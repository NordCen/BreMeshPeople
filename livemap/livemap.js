/* ================================================================
   BreMesh Live Map – Public Map for hbme.sh
   Connects to wss://api.hbme.sh/ws/public
   No custom repeaters, GRP_TXT limited to Public + #ping
   ================================================================ */
(() => {
"use strict";

// ── Config ──────────────────────────────────────────────
const WS_URL = "wss://api.hbme.sh/ws/public";
const API_BASE = "https://api.hbme.sh/api/public";
const LIVE_MAX = 5;

// Hop-distance color gradient: green (hop 0) → red (hop 7+)
function hopColor(hopIdx) {
    const t = Math.min(hopIdx / 7, 1);  // 0 → 1 over hops 0…7
    const hue = 120 - t * 120;          // 120° (green) → 0° (red)
    return `hsl(${Math.round(hue)}, 90%, 50%)`;
}
const TYPE_CLASSES = {
    ADVERT: "type-advert", TXT_MSG: "type-txt", GRP_TXT: "type-grp",
    ACK: "type-ack", REQ: "type-req", RESPONSE: "type-response",
    TRACE: "type-trace", PATH: "type-path",
};

// ── State ───────────────────────────────────────────────
let addressBook = {};
let liveCount = 0;
let ws = null;
let wsTimer = null;
const feedByHash = {};

// Route map
let routeMap = null;
let routePolyline = null;
let routeMarkers = [];
let rptMarkerMap = {};
let routeFadeTimer = null;
let routeHashPrefix = null;
let routePathLayers = [];
let routeGeneration = 0;  // generation counter to invalidate stale moveend callbacks

// ── DOM helpers ─────────────────────────────────────────
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (k === "text") { e.textContent = v; continue; }
        if (k === "html") { e.innerHTML = v; continue; }
        if (k === "style" && typeof v === "object") { Object.assign(e.style, v); continue; }
        e.setAttribute(k, v);
    }
    for (const c of children) {
        if (typeof c === "string") e.appendChild(document.createTextNode(c));
        else if (c) e.appendChild(c);
    }
    return e;
}

function escHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
}

// ── API ─────────────────────────────────────────────────
async function api(endpoint, params = {}) {
    const url = new URL(`${API_BASE}/${endpoint}`);
    for (const [k, v] of Object.entries(params))
        if (v != null && v !== "") url.searchParams.set(k, v);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    return res.json();
}

function isEncryptedDM(text) {
    if (!text || text.length < 4) return false;
    let bad = 0;
    for (let i = 0; i < text.length; i++) {
        const c = text.charCodeAt(i);
        if (c < 32 && c !== 10 && c !== 13 && c !== 9) bad++;
        else if (c === 0xFFFD) bad++;
        else if (c > 126 && c < 160) bad++;
    }
    return (bad / text.length) > 0.25;
}

// ── Address Book ────────────────────────────────────────
function addrName(a) { return a ? (addressBook[a.toLowerCase()]?.name || "") : ""; }
function addrLabel(a) { const n = addrName(a); return n ? `${a} (${n})` : a; }

async function loadAddressBook() {
    try {
        const data = await api("address-book");
        addressBook = {};
        for (const e of data.addresses) {
            const a = e.addr.toLowerCase();
            if (!addressBook[a] || e.name) addressBook[a] = e;
        }
    } catch (e) { console.error("AddressBook:", e); }
}

// ── Type class helper ───────────────────────────────────
function typeClass(short) {
    return TYPE_CLASSES[short] || "type-default";
}

// ── Time formatting ─────────────────────────────────────
function fmtTimeFeed(iso) {
    if (!iso) return "–";
    return new Date(iso).toLocaleTimeString("de-DE", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
}

// ── Payload summary ─────────────────────────────────────
function buildPayloadSummary(short, pd, pkt) {
    if (!pd) {
        if (short === "ADVERT" && pkt.name)
            return `<span class="feed-icon">📡</span> <strong>${escHtml(pkt.name)}</strong>`;
        return "";
    }
    switch (pd.type) {
        case "ADVERT": {
            let parts = [];
            if (pd.name) parts.push(`<strong>${escHtml(pd.name)}</strong>`);
            if (pd.device_type_name) parts.push(`<span class="feed-dim">${escHtml(pd.device_type_name)}</span>`);
            if (pd.source_addr) parts.push(`<span class="feed-addr">${pd.source_addr}</span>`);
            if (pd.battery_pct != null) parts.push(`<span class="feed-dim">🔋${pd.battery_pct}%</span>`);
            return parts.length ? `<span class="feed-icon">📡</span> ${parts.join(" · ")}` : "";
        }
        case "TXT_MSG":
            return `<span class="feed-icon">✉️</span> <span class="feed-locked">🔒 DM (verschlüsselt)</span>`;
        case "GRP_TXT": {
            let line = `<span class="feed-icon">📢</span>`;
            if (pd.decrypted === true) line += `<span class="feed-badge-dec">🔓</span>`;
            if (pd.channel_name) line += ` <span class="feed-chan">#${escHtml(pd.channel_name)}</span>`;
            if (pd.decrypted === true && pd.text) {
                line += ` ${pd.sender ? `<span style="color:#1abc9c">${escHtml(pd.sender)}:</span>` : ""}<span class="feed-msg">${escHtml(pd.text.substring(0, 100))}</span>`;
            } else if (pd.decrypted === false) {
                line += ` <span class="feed-locked">🔒 verschlüsselt</span>`;
            }
            return line;
        }
        case "ACK":
            return pd.acked_hash
                ? `<span class="feed-icon">✓</span> <span class="feed-dim">ACK ${pd.acked_hash.substring(0, 12)}…</span>`
                : "";
        default:
            return "";
    }
}

// ── Rich Hops HTML ──────────────────────────────────────
function buildHopsRichHtml(hopsStr) {
    if (!hopsStr) return "";
    return hopsStr.split(",").map(a => {
        const addr = a.trim();
        const n = addrName(addr);
        return `<span class="hop-addr ${n ? "hop-known" : "hop-unknown"}" title="${n || addr}">${addr}${n ? "<small>(" + escHtml(n) + ")</small>" : ""}</span>`;
    }).join('<span class="hop-arrow">→</span>');
}

function prependSourceToPath(hopsStr, pkt, group) {
    const src = pkt.source_addr || (group && group.source_addr);
    if (!src) return hopsStr;
    if (!(pkt.payload_type || "").includes("ADVERT")) return hopsStr;
    const parts = hopsStr ? hopsStr.split(",").map(a => a.trim().toLowerCase()) : [];
    if (parts.length && parts[0] === src.toLowerCase()) return hopsStr;
    return src.toLowerCase() + (hopsStr ? "," + hopsStr : "");
}

// ── WebSocket ───────────────────────────────────────────
function connectWS() {
    ws = new WebSocket(WS_URL);
    ws.onopen = () => {
        $("#liveDot").classList.add("connected");
        $("#feedStatus").textContent = "Verbunden";
        if (wsTimer) { clearTimeout(wsTimer); wsTimer = null; }
    };
    ws.onclose = () => {
        $("#liveDot").classList.remove("connected");
        $("#feedStatus").textContent = "Reconnect…";
        wsTimer = setTimeout(connectWS, 3000);
    };
    ws.onerror = () => ws.close();
    ws.onmessage = ev => {
        try {
            const msg = JSON.parse(ev.data);
            if (msg.type === "packet_ingested") onPacket(msg.data);
            if (msg.type === "client_count") {
                const el = $("#wsClientCount");
                if (el) el.textContent = msg.count;
            }
        } catch (_) {}
    };
}

// ── Packet handler ──────────────────────────────────────
function pktHasRoute(pkt) {
    const isAdv = (pkt.payload_type || "").includes("ADVERT");
    const hopsStr = isAdv ? prependSourceToPath(pkt.hops || "", pkt, null) : (pkt.hops || "");
    let hops = hopsStr ? hopsStr.split(",").map(a => a.trim().toLowerCase()).filter(Boolean) : [];
    if (hops.length < 3) return false;
    const segs = resolveHopSegments(hops);
    return segs.some(s => s.coords.length >= 3);
}

function activityIcon(short) {
    switch (short) {
        case "ADVERT": return "📡";
        case "TXT_MSG": return "✉️";
        case "GRP_TXT": return "📢";
        case "ACK": return "✓";
        case "TRACE": return "🔍";
        default: return "📦";
    }
}

function activityLabel(pkt, short) {
    const pd = pkt.decoded?.payload_details;
    if (short === "ADVERT") {
        const name = pd?.name || pkt.name;
        return name ? name : (pkt.source_addr || "Repeater");
    }
    if (short === "GRP_TXT" && pd?.decrypted && pd?.text) {
        const sender = pd.sender ? `${pd.sender}: ` : "";
        return sender + pd.text.substring(0, 60);
    }
    if (short === "TXT_MSG") {
        return "DM (verschlüsselt)";
    }
    const hops = (pkt.hops || "").split(",").map(a => a.trim()).filter(Boolean);
    const firstHop = hops[0] ? (addrName(hops[0]) || hops[0]) : "";
    const lastHop = hops.length > 1 ? (addrName(hops[hops.length - 1]) || hops[hops.length - 1]) : "";
    return firstHop && lastHop ? `${firstHop} → ${lastHop}` : short;
}

function onPacket(pkt) {
    // Only show packets with drawable routes
    if (!pktHasRoute(pkt)) return;

    const feed = $("#feedScroll");
    const short = (pkt.payload_type || "").replace("PAYLOAD_TYPE_", "");
    const cls = typeClass(short);
    const time = fmtTimeFeed(pkt.time);
    const hPrefix = pkt.hash_prefix || (pkt.packet_hash || "").substring(0, 16);

    // Multi-path: update existing entry
    if (hPrefix && feedByHash[hPrefix]) {
        const group = feedByHash[hPrefix];
        const isAdv = (pkt.payload_type || "").includes("ADVERT");
        const curHops = isAdv ? prependSourceToPath(pkt.hops || "", pkt, group) : (pkt.hops || "");
        if (curHops && !group.paths.includes(curHops)) group.paths.push(curHops);
        if (pkt.source_addr && !group.source_addr) group.source_addr = pkt.source_addr;
        if (pkt.name && !group.source_name) group.source_name = pkt.name;
        group.count++;
        group.el.classList.add("activity-item-new");
        requestAnimationFrame(() => { group.el.offsetHeight; group.el.classList.remove("activity-item-new"); });
        if (feed.firstChild !== group.el) feed.insertBefore(group.el, feed.firstChild);
        showRouteOnMap(pkt, group);
        return;
    }

    liveCount++;
    $("#feedCount").textContent = liveCount.toLocaleString();

    const isAdv = (pkt.payload_type || "").includes("ADVERT");
    const label = activityLabel(pkt, short);
    const icon = activityIcon(short);
    const hops = (pkt.hops || "").split(",").filter(Boolean).length;

    const entry = el("div", { class: "activity-item activity-item-new" });
    entry.innerHTML = `
        <span class="activity-icon">${icon}</span>
        <div class="activity-body">
            <div class="activity-label">${escHtml(label)}</div>
            <div class="activity-meta">${time} · ${hops}h</div>
        </div>
        <span class="activity-type ${cls}">${short}</span>
    `;

    const primaryHops = isAdv ? prependSourceToPath(pkt.hops || "", pkt, null) : (pkt.hops || "");
    const altPaths = pkt.alt_paths || [];
    const rawPaths = [pkt.hops || ""];
    for (const ap of altPaths) { if (ap && !rawPaths.includes(ap)) rawPaths.push(ap); }
    const allPaths = isAdv ? rawPaths.map(p => prependSourceToPath(p, pkt, null)) : rawPaths;

    if (hPrefix) {
        feedByHash[hPrefix] = {
            el: entry,
            paths: [...allPaths],
            count: pkt.sighting_count || 1,
            pkt,
            source_addr: pkt.source_addr || null,
            source_name: pkt.name || null,
        };
        entry._hashPrefix = hPrefix;
    }
    entry._pktData = pkt;
    entry._group = feedByHash[hPrefix] || null;
    entry.addEventListener("click", () => onFeedEntryClick(entry));

    if (feed.firstChild) feed.insertBefore(entry, feed.firstChild);
    else feed.appendChild(entry);

    while (feed.children.length > LIVE_MAX) {
        const last = feed.lastChild;
        if (last && last._hashPrefix && feedByHash[last._hashPrefix]?.el === last) {
            delete feedByHash[last._hashPrefix];
        }
        feed.removeChild(last);
    }

    requestAnimationFrame(() => { entry.offsetHeight; entry.classList.remove("activity-item-new"); });
    showRouteOnMap(pkt);
    markActiveFeedEntry(entry);
}

// ── Feed click → show route ─────────────────────────────
function onFeedEntryClick(entry) {
    const pkt = entry._pktData;
    if (!pkt) return;
    markActiveFeedEntry(entry);
    showRouteOnMap(pkt, entry._group);
}

function markActiveFeedEntry(entry) {
    $$(".activity-item.activity-active").forEach(e => e.classList.remove("activity-active"));
    entry.classList.add("activity-active");
}



// ── Preload Feed ────────────────────────────────────────
async function preloadFeed(count = 20) {
    try {
        const data = await api("recent-packets", { limit: count });
        if (!data.packets || !data.packets.length) return;

        const pkts = data.packets.slice().reverse();
        const feed = $("#feedScroll");

        for (const pkt of pkts) {
            if (!pkt.time && pkt.received_at) pkt.time = pkt.received_at;
            if (!pktHasRoute(pkt)) continue;

            const short = (pkt.payload_type || "").replace("PAYLOAD_TYPE_", "");
            const cls = typeClass(short);
            const time = fmtTimeFeed(pkt.time);
            const hPrefix = (pkt.packet_hash || "").substring(0, 16);
            const isAdv = (pkt.payload_type || "").includes("ADVERT");

            if (hPrefix && feedByHash[hPrefix]) {
                const group = feedByHash[hPrefix];
                const curHops = isAdv ? prependSourceToPath(pkt.hops || "", pkt, group) : (pkt.hops || "");
                if (curHops && !group.paths.includes(curHops)) group.paths.push(curHops);
                group.count++;
                continue;
            }

            liveCount++;
            const label = activityLabel(pkt, short);
            const icon = activityIcon(short);
            const hops = (pkt.hops || "").split(",").filter(Boolean).length;

            const entry = el("div", { class: "activity-item" });
            entry.innerHTML = `
                <span class="activity-icon">${icon}</span>
                <div class="activity-body">
                    <div class="activity-label">${escHtml(label)}</div>
                    <div class="activity-meta">${time} · ${hops}h</div>
                </div>
                <span class="activity-type ${cls}">${short}</span>
            `;

            const primaryHops = isAdv ? prependSourceToPath(pkt.hops || "", pkt, null) : (pkt.hops || "");
            const altPaths = pkt.alt_paths || [];
            const rawPaths = [pkt.hops || ""];
            for (const ap of altPaths) { if (ap && !rawPaths.includes(ap)) rawPaths.push(ap); }
            const allPaths = isAdv ? rawPaths.map(p => prependSourceToPath(p, pkt, null)) : rawPaths;

            if (hPrefix) {
                feedByHash[hPrefix] = { el: entry, paths: [...allPaths], count: 1, pkt, source_addr: pkt.source_addr || null, source_name: pkt.name || null };
                entry._hashPrefix = hPrefix;
            }
            entry._pktData = pkt;
            entry._group = feedByHash[hPrefix] || null;
            entry.addEventListener("click", () => onFeedEntryClick(entry));

            if (feed.firstChild) feed.insertBefore(entry, feed.firstChild);
            else feed.appendChild(entry);
        }
        $("#feedCount").textContent = liveCount.toLocaleString();

        // Show most recent drawable route on map
        if (feed.firstChild) {
            const first = feed.firstChild;
            if (first._pktData) {
                showRouteOnMap(first._pktData, first._group);
                markActiveFeedEntry(first);
            }
        }
    } catch (e) { console.warn("Feed preload failed:", e); }
}

// ── Route Map ───────────────────────────────────────────
function initRouteMap() {
    if (routeMap) return;
    const mapEl = document.getElementById("routeMap");
    if (!mapEl) return;

    routeMap = L.map(mapEl, {
        center: [53.04, 8.82],
        zoom: 11,
        zoomControl: false,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        attributionControl: true,
    });

    // Custom panes for z-ordering: lines < repeaters < endpoints < bubbles
    routeMap.createPane("routeLines").style.zIndex = 410;
    routeMap.createPane("repeaters").style.zIndex = 420;
    routeMap.createPane("endpoints").style.zIndex = 430;
    routeMap.createPane("bubbles").style.zIndex = 440;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
    }).addTo(routeMap);

    setTimeout(() => routeMap.invalidateSize(), 200);
}

function populateRepeaterMarkers() {
    if (!routeMap) return;
    Object.values(rptMarkerMap).forEach(m => routeMap.removeLayer(m));
    rptMarkerMap = {};

    for (const [addr, info] of Object.entries(addressBook)) {
        if (info.lat == null || info.lon == null) continue;
        const icon = L.divIcon({
            className: "rpt-marker-wrap",
            html: `<div class="rpt-marker" title="${escHtml(info.name || addr)}"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
        });
        const m = L.marker([info.lat, info.lon], { icon, interactive: true, pane: "repeaters" })
            .bindTooltip(`<b>${escHtml(info.name || addr)}</b><br><span style="font-family:monospace;font-size:0.7rem">${addr}</span>`, { direction: "top", offset: [0, -8] });
        m.addTo(routeMap);
        rptMarkerMap[addr.toLowerCase()] = m;
    }
}

function resolveHopSegments(hops) {
    const segments = [];
    let cur = { coords: [], addrs: [] };
    for (const addr of hops) {
        const info = addressBook[addr];
        if (info && info.lat != null && info.lon != null) {
            cur.coords.push([info.lat, info.lon]);
            cur.addrs.push(addr);
        } else {
            if (cur.coords.length >= 2) segments.push(cur);
            cur = { coords: [], addrs: [] };
        }
    }
    if (cur.coords.length >= 2) segments.push(cur);
    return segments;
}

function showRouteOnMap(pkt, group) {
    if (!routeMap) return;
    const isAdvert = (pkt.payload_type || "").includes("ADVERT");
    const sourceAddr = (pkt.source_addr || (group && group.source_addr) || "").toLowerCase();
    const sourceName = pkt.name || (group && group.source_name) || "";

    const hopsStr = isAdvert ? prependSourceToPath(pkt.hops, pkt, group) : (pkt.hops || "");
    let hops = hopsStr ? hopsStr.split(",").map(a => a.trim().toLowerCase()) : [];
    if (hops.length < 3) return;

    const hPrefix = pkt.hash_prefix || (pkt.packet_hash || "").substring(0, 16);

    const segments = resolveHopSegments(hops);
    const coords = segments.flatMap(s => s.coords);
    const resolvedAddrs = segments.flatMap(s => s.addrs);
    if (coords.length < 3) return;

    // ── Multi-path: add to existing route ───────────────
    if (hPrefix && hPrefix === routeHashPrefix && group) {
        let hopOff = 0;
        for (const seg of segments) {
            drawHopSegments(seg, hopOff);
            hopOff += Math.max(seg.coords.length - 1, 0);
        }

        activateMarkersByHop(resolvedAddrs);

        const allCoords = routeMarkers
            .filter(l => l instanceof L.Polyline)
            .flatMap(l => l.getLatLngs());
        if (allCoords.length > 1) {
            routeMap.panTo(L.latLngBounds(allCoords).pad(0.12).getCenter(), { duration: 0.6 });
        }

        const short = (pkt.payload_type || "").replace("PAYLOAD_TYPE_", "");
        const infoEl = $("#mapRouteInfo");
        if (infoEl && group) {
            if (isAdvert && sourceName) {
                infoEl.innerHTML = `<span class="map-pkt-badge"><span class="pkt-type ${typeClass(short)}">${short}</span> ⭐ <strong>${escHtml(sourceName)}</strong> → ${group.paths.length} Pfade</span>`;
            } else {
                infoEl.innerHTML = `<span class="map-pkt-badge"><span class="pkt-type ${typeClass(short)}">${short}</span> ${group.paths.length} Pfade · ${hops.length}h</span>`;
            }
        }
        return;
    }

    // ── New route – clear & draw ────────────────────────
    clearRoute();
    routeHashPrefix = hPrefix;
    routePathLayers = [];

    // Dim all markers
    for (const [, marker] of Object.entries(rptMarkerMap)) {
        const mel = marker.getElement();
        if (!mel) continue;
        const dot = mel.querySelector(".rpt-marker");
        if (dot) {
            dot.classList.remove("rpt-active");
            dot.classList.add("rpt-dimmed");
            dot.style.background = "";
            dot.style.borderColor = "";
            dot.style.boxShadow = "";
        }
    }

    // Build path list
    let allPaths;
    if (group && group.paths && group.paths.length > 0) {
        allPaths = [...group.paths];
    } else {
        const altPaths = pkt.alt_paths || [];
        const rawPaths = [pkt.hops || ""];
        for (const ap of altPaths) { if (ap && !rawPaths.includes(ap)) rawPaths.push(ap); }
        allPaths = isAdvert ? rawPaths.map(p => prependSourceToPath(p, pkt, group)) : rawPaths;
    }

    // Compute bounds across all paths
    const boundsCoords = [];
    for (const p of allPaths) {
        const pH = p.split(",").map(a => a.trim().toLowerCase());
        const segs = resolveHopSegments(pH);
        for (const s of segs) boundsCoords.push(...s.coords);
    }
    if (boundsCoords.length < 2) return;
    const bounds = L.latLngBounds(boundsCoords).pad(0.12);

    // ── Draw polylines per hop (colored by hop index) ───
    for (let pi = 0; pi < allPaths.length; pi++) {
        const pathHops = allPaths[pi].split(",").map(a => a.trim().toLowerCase());
        const pathSegments = resolveHopSegments(pathHops);
        if (pathSegments.length === 0) continue;

        // Activate repeater markers along this path
        for (const seg of pathSegments) {
            activateMarkersByHop(seg.addrs);
        }

        // Draw each hop as individual segment with hop-based color
        let hopOff = 0;
        for (const seg of pathSegments) {
            drawHopSegments(seg, hopOff);
            hopOff += Math.max(seg.coords.length - 1, 0);
        }
    }

    // ── Endpoint markers ────────────────────────────────
    if (isAdvert && sourceAddr) {
        const srcInfo = addressBook[sourceAddr];
        if (srcInfo && srcInfo.lat != null && srcInfo.lon != null) {
            const starIcon = L.divIcon({
                className: "route-star-wrap",
                html: `<div class="route-star-center" title="${escHtml(sourceName || sourceAddr)}">⭐</div>`,
                iconSize: [28, 28], iconAnchor: [14, 14],
            });
            routeMarkers.push(L.marker([srcInfo.lat, srcInfo.lon], { icon: starIcon, interactive: false, pane: "endpoints" }).addTo(routeMap));
        }
        const seenRx = new Set();
        for (let pi = 0; pi < allPaths.length; pi++) {
            const pH = allPaths[pi].split(",").map(a => a.trim().toLowerCase());
            const lastA = pH[pH.length - 1];
            if (seenRx.has(lastA)) continue;
            seenRx.add(lastA);
            const rxInfo = addressBook[lastA];
            if (rxInfo && rxInfo.lat != null && rxInfo.lon != null) {
                const rxColor = hopColor(pH.length - 1);
                const rxName = rxInfo.name || lastA;
                const rxIcon = L.divIcon({
                    className: "route-endpoint-wrap",
                    html: `<div class="route-endpoint route-rx" title="${escHtml(rxName)}" style="border-color:${rxColor}">📥</div>`,
                    iconSize: [20, 20], iconAnchor: [10, 10],
                });
                routeMarkers.push(L.marker([rxInfo.lat, rxInfo.lon], { icon: rxIcon, interactive: false, pane: "endpoints" }).addTo(routeMap));
            }
        }
    } else {
        // Collect unique first/last GPS-resolved hops across ALL paths
        const srcAddrs = new Map();
        const dstAddrs = new Map();
        for (const p of allPaths) {
            const pH = p.split(",").map(a => a.trim().toLowerCase());
            const pSegs = resolveHopSegments(pH);
            const pAddrs = pSegs.flatMap(s => s.addrs);
            if (pAddrs.length >= 1) {
                const a = pAddrs[0];
                const info = addressBook[a];
                if (info && info.lat != null && !srcAddrs.has(a)) srcAddrs.set(a, info);
            }
            if (pAddrs.length > 1) {
                const a = pAddrs[pAddrs.length - 1];
                const info = addressBook[a];
                if (info && info.lat != null && !dstAddrs.has(a)) dstAddrs.set(a, info);
            }
        }
        for (const [addr, info] of srcAddrs) {
            routeMarkers.push(L.marker([info.lat, info.lon], {
                icon: L.divIcon({
                    className: "route-endpoint-wrap",
                    html: `<div class="route-endpoint route-src" title="${escHtml(info.name || addr)}">📡</div>`,
                    iconSize: [18, 18], iconAnchor: [9, 9],
                }),
                interactive: false, pane: "endpoints",
            }).addTo(routeMap));
        }
        for (const [addr, info] of dstAddrs) {
            routeMarkers.push(L.marker([info.lat, info.lon], {
                icon: L.divIcon({
                    className: "route-endpoint-wrap",
                    html: `<div class="route-endpoint route-dst" title="${escHtml(info.name || addr)}">📥</div>`,
                    iconSize: [18, 18], iconAnchor: [9, 9],
                }),
                interactive: false, pane: "endpoints",
            }).addTo(routeMap));
        }
    }

    // ── Triangulation: multiple start repeaters ─────────
    // When the original signal was heard by multiple repeaters,
    // mark each with 📡, connect with white dashed lines, and
    // show a white dot at the centroid (triangulated position).
    // ADVERT packets always have a known origin → skip triangulation.
    if (!isAdvert) {
        const triIdx = 0;
        const triStarts = new Map();
        for (const p of allPaths) {
            const pH = p.split(",").map(a => a.trim().toLowerCase());
            for (let hi = triIdx; hi < pH.length; hi++) {
                const info = addressBook[pH[hi]];
                if (info && info.lat != null && info.lon != null) {
                    if (!triStarts.has(pH[hi])) {
                        triStarts.set(pH[hi], { lat: info.lat, lon: info.lon, name: info.name || pH[hi] });
                    }
                    break;
                }
            }
        }

        if (triStarts.size >= 2) {
            const pts = [...triStarts.values()];

            // 📡 at each start repeater
            for (const sp of pts) {
                routeMarkers.push(L.marker([sp.lat, sp.lon], {
                    icon: L.divIcon({
                        className: "route-endpoint-wrap",
                        html: `<div class="route-endpoint route-src" title="${escHtml(sp.name)}">📡</div>`,
                        iconSize: [18, 18], iconAnchor: [9, 9],
                    }),
                    interactive: false, pane: "endpoints",
                }).addTo(routeMap));
            }

            // White dashed lines between start repeaters
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    routeMarkers.push(L.polyline(
                        [[pts[i].lat, pts[i].lon], [pts[j].lat, pts[j].lon]],
                        { color: '#ffffff', weight: 2, opacity: 0.7, dashArray: '6 4', lineCap: 'round', interactive: false, pane: 'endpoints' }
                    ).addTo(routeMap));
                }
            }

            // White dot at centroid (triangulated position)
            const cLat = pts.reduce((s, p) => s + p.lat, 0) / pts.length;
            const cLon = pts.reduce((s, p) => s + p.lon, 0) / pts.length;
            routeMarkers.push(L.marker([cLat, cLon], {
                icon: L.divIcon({
                    className: "tri-centroid-wrap",
                    html: `<div class="tri-centroid"></div>`,
                    iconSize: [14, 14], iconAnchor: [7, 7],
                }),
                interactive: false, pane: "endpoints",
            }).addTo(routeMap));
        }
    }

    // ── Speech bubble for public GRP_TXT ────────────────
    const _pd = pkt.decoded && pkt.decoded.payload_details;
    if (_pd && _pd.type === "GRP_TXT" && _pd.decrypted === true && _pd.text) {
        const originAddr = hops[0] || sourceAddr;
        const originInfo = originAddr ? addressBook[originAddr] : null;
        if (originInfo && originInfo.lat != null && originInfo.lon != null) {
            let bHtml = "";
            if (_pd.sender) bHtml += `<div class="detail-speech-sender">${escHtml(_pd.sender)}</div>`;
            bHtml += `<div class="detail-speech-text">${escHtml(_pd.text)}</div>`;
            if (_pd.channel_name) bHtml += `<div class="detail-speech-channel">#${escHtml(_pd.channel_name)}</div>`;
            const bIcon = L.divIcon({
                className: "detail-speech-wrap",
                html: `<div class="detail-speech-bubble">${bHtml}</div>`,
                iconSize: [180, 70], iconAnchor: [-12, 70],
            });
            routeMarkers.push(L.marker([originInfo.lat, originInfo.lon], { icon: bIcon, interactive: false, pane: "bubbles" }).addTo(routeMap));
        }
    }

    // ── Fly to bounds ───────────────────────────────────
    routeMap.panTo(bounds.getCenter(), { duration: 0.8 });

    // ── Update info label ───────────────────────────────
    const short = (pkt.payload_type || "").replace("PAYLOAD_TYPE_", "");
    const hopNames = resolvedAddrs.map(a => addrName(a) || a);
    const infoEl = $("#mapRouteInfo");
    if (infoEl) {
        if (isAdvert && sourceName && allPaths.length > 1) {
            infoEl.innerHTML = `<span class="map-pkt-badge"><span class="pkt-type ${typeClass(short)}">${short}</span> ⭐ <strong>${escHtml(sourceName)}</strong> → ${allPaths.length} Pfade</span>`;
        } else if (isAdvert && sourceName) {
            infoEl.innerHTML = `<span class="map-pkt-badge"><span class="pkt-type ${typeClass(short)}">${short}</span> ⭐ <strong>${escHtml(sourceName)}</strong> → ${hopNames.join(" → ")}</span>`;
        } else {
            infoEl.innerHTML = `<span class="map-pkt-badge"><span class="pkt-type ${typeClass(short)}">${short}</span> ${hopNames.join(" → ")} <span>${hops.length}h</span></span>`;
        }
    }

    // ── Auto-fade pulse after 15s ───────────────────────
    if (routeFadeTimer) clearTimeout(routeFadeTimer);
    routeFadeTimer = setTimeout(() => {
        for (const [, marker] of Object.entries(rptMarkerMap)) {
            const mel = marker.getElement();
            if (!mel) continue;
            const dot = mel.querySelector(".rpt-marker");
            if (dot) { dot.classList.remove("rpt-active"); dot.style.boxShadow = ""; }
        }
    }, 15000);
}

// Draw individual hop segments with per-hop coloring (matching BIA dashboard)
function drawHopSegments(seg, hopOffset) {
    for (let i = 0; i < seg.coords.length - 1; i++) {
        const color = hopColor(hopOffset + i);
        const pair = [seg.coords[i], seg.coords[i + 1]];
        const glow = L.polyline(pair, {
            color, weight: 6, opacity: 0.15,
            lineCap: "round", lineJoin: "round", interactive: false,
            pane: "routeLines",
        }).addTo(routeMap);
        routeMarkers.push(glow);

        const line = L.polyline(pair, {
            color, weight: 2.5, opacity: 0.7,
            lineCap: "round", lineJoin: "round",
            dashArray: "8 6", interactive: false,
            pane: "routeLines",
        }).addTo(routeMap);
        routeMarkers.push(line);
        routePathLayers.push({ polyline: line, glow });

        let offset = 0;
        const animLine = () => {
            offset -= 0.5;
            if (line && line._path) line._path.style.strokeDashoffset = offset;
            line._animFrame = requestAnimationFrame(animLine);
        };
        animLine();
    }
}

// Activate repeater markers with hop-based coloring (skip isolated nodes)
function activateMarkersByHop(addrs) {
    for (let i = 0; i < addrs.length; i++) {
        const cur = addressBook[addrs[i]];
        if (!cur || cur.lat == null) continue;
        const prev = i > 0 ? addressBook[addrs[i - 1]] : null;
        const next = i < addrs.length - 1 ? addressBook[addrs[i + 1]] : null;
        if (!(prev && prev.lat != null) && !(next && next.lat != null)) continue;

        const color = hopColor(i);
        const marker = rptMarkerMap[addrs[i]];
        if (!marker) continue;
        const mel = marker.getElement();
        if (!mel) continue;
        const dot = mel.querySelector(".rpt-marker");
        if (dot) {
            dot.classList.add("rpt-active");
            dot.classList.remove("rpt-dimmed");
            dot.style.background = color;
            dot.style.borderColor = color;
            dot.style.boxShadow = `0 0 6px ${color}`;
        }
    }
}

function clearRoute() {
    for (const pl of routePathLayers) {
        if (pl.polyline && pl.polyline._animFrame) cancelAnimationFrame(pl.polyline._animFrame);
    }
    if (routePolyline && routePolyline._animFrame) cancelAnimationFrame(routePolyline._animFrame);
    for (const layer of routeMarkers) routeMap.removeLayer(layer);
    routeMarkers = [];
    routePolyline = null;
    routePathLayers = [];
    routeHashPrefix = null;
}

// ── Init ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
    await loadAddressBook();

    initRouteMap();
    populateRepeaterMarkers();

    await preloadFeed(10);
    connectWS();
});

})();
