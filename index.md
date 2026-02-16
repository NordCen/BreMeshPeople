---
layout: default
title: ""
permalink: /
hero: "Freies MeshCore-Netzwerk für Bremen und Umgebung"
---

<div class="center" markdown="1">

## Ein offenes Funknetz für Bremen

Das **Bremer Mesh** ist ein gemeinschaftlich betriebenes, offenes Funknetz auf Basis von **MeshCore** und LoRa-Technik im 868-MHz-Band.  
Unser Ziel ist ein **stabiles, dezentrales und sinnvoll nutzbares Mesh** – kein Funkrauschen, sondern Reichweite, Struktur und gegenseitige Rücksichtnahme.

Mitmachen kann jede:r:  
vom einzelnen Node auf dem Balkon bis zum fest installierten Repeater an einem guten Funkstandort.

</div>

<div class="columns">

<div markdown="1">

### Was ist MeshCore?

MeshCore ist eine moderne, schlanke Mesh-Firmware für LoRa-Geräte.  
Sie trennt klar zwischen **Client-Geräten (Companion)** und **reinen Weiterleitungs-Knoten (Repeater)** und sorgt so für weniger Airtime und bessere Netzqualität.

</div>

<div markdown="1">

### Mitmachen

Du brauchst:

- ein kompatibles LoRa-Board (z. B. ESP32 / Heltec)
- eine 868-MHz-Antenne
- etwas Platz mit halbwegs freier Sicht

**Zum Einstieg empfehlen wir den [Schnellstart](/moin/).**  
Meshtastic-Nutzer:innen finden eine eigene **[Umstiegsseite](/umstieg/)**.

</div>

<div markdown="1">

### Community

Das Bremer Mesh lebt vom Austausch:

- Öffentlicher Chat im Mesh: 
  - `Public`
  - `#bremesh`
- Matrix-Space:
  - [#bremesh:hbme.sh](https://matrix.to/#/%23bremesh:hbme.sh)
- Telegram-Gruppen: 
  - [MeshCore Deutschland](https://t.me/meshcorede)
  - [Meshtastic Bremen und Umzu](https://t.me/meshhbuz)


</div>

</div>

{% if site.posts.size > 0 %}
<div class="center" markdown="1">

## Neuigkeiten

{% for post in site.posts limit:3 %}
**{{ post.date | date: "%d.%m.%Y" }}** – [{{ post.title }}]({{ post.url }})  
{{ post.excerpt | strip_html | truncatewords: 20 }}

{% endfor %}

→ [Alle News anzeigen](/news/)

</div>
{% endif %}
