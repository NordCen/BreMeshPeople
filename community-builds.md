---
layout: default
title: Community Builds
permalink: /community-builds/
---

# Community Builds

Neben dem offiziellen MeshCore-Projekt entstehen in der Bremer Mesh-Community eigene **Hardware-Designs, 3D-Modelle, Firmware-Anpassungen, Apps und Software-Tools**. Hier stellen wir euch diese Projekte vor.

<hr>


## Firmware

### RePeter Firmware

Ein Fork der offiziellen MeshCore-Firmware, speziell angepasst für die RePeter-Hardware und das BreMesh-Netz. Enthält vorkonfigurierte Frequenzen für die 868-MHz-Region, aktiviertes powersaving, ein eigenes Boot-Logo und fertige Release-Binaries über GitHub Actions, sodass kein eigenes Kompilieren nötig ist. Unterstützt ProMicro nRF52840 Boards.

- **Projekt:** [RePeter-Firmware](https://github.com/timniklas/RePeter-Firmware)
- **Typ:** Firmware (MeshCore-Fork)
- **Autor:** Nagios

<hr>

## Apps

### BreMesh App (iOS & Android)

Die **BreMesh App** ist eine von Nagios entwickelte Companion-App für iOS und Android.  
Sie zeigt hauptsächlich eine Karte mit den Repeatern und Verbindungen im BreMesh-Netz. Darüber hinaus hat man Zugriff auf den Chat und sieht, welche Repeater, Clients und Roomserver aktuell verfügbar sind.

- **Website:** [bremesh.de](https://bremesh.de)
- **Download:** [App Store (iOS)](https://apps.apple.com/de/app/bremesh/id6757368075) · [Play Store (Android)](https://play.google.com/store/apps/details?id=de.bremesh.app)
- **Autor:** Nagios

<hr>


## Hardware

### RePeter – MeshCore Repeater

Ein offenes Hardware-Design für einen kompakten MeshCore-Repeater auf Basis des nRF52840 ProMicro und SX1262 LoRa-Chip (Ra-01SH-P oder HT-RA62). Der RePeter verbraucht nur ca. 0.4 Wh/Tag unterstützt 1–3× 18650-Akkus mit BMS sowie Solarbetrieb über USB-C und ist ab ca. 45 € nachzubauen. PCB, Gehäuse (IP66), Antenna-Bracket und ein eigenes ChargeBoard sind im Projekt enthalten – dazu optionale Erweiterungen wie OLED-Display, RTC und Temperatur-/Wettersensoren.

- **Projekt:** [MeshCoreRepeater-RePeter](https://github.com/robrec/MeshCoreRepeater-RePeter)
- **Typ:** Hardware-Design (PCB / Gehäuse / Zubehör)
- **Autor:** Bartzi
<hr>



## Eigenes Projekt beitragen?

Du hast selbst etwas gebaut – Firmware, Hardware, 3D-Modelle, Software oder ein anderes Tool?  
Trage es einfach selbst ein – diese Seite kann jeder direkt über GitHub bearbeiten:

###  So geht's

Diese Website liegt als Open-Source-Projekt auf GitHub – jeder kann Änderungen vorschlagen:

1. **Fork anlegen** – Öffne das Repository [NordCen/BreMeshPeople](https://github.com/NordCen/BreMeshPeople) und klicke oben rechts auf **Fork**.
2. **Datei bearbeiten** – Navigiere in deinem Fork zur gewünschten Datei (z. B. `community-builds.md`) und klicke auf das Stift-Symbol ✏️ zum Bearbeiten.
3. **Änderungen committen** – Beschreibe kurz, was du geändert hast, und klicke auf **Commit changes**.
4. **Pull Request erstellen** – Gehe zurück zum Original-Repository und klicke auf **New Pull Request**. Wähle deinen Fork als Quelle aus.
5. **Review & Merge** – Ein Maintainer prüft deinen Vorschlag und übernimmt ihn in die Live-Seite.

> **Tipp:** Kleine Änderungen (Tippfehler, neue Links) kannst du direkt über die GitHub-Weboberfläche machen – kein lokales Git nötig.
