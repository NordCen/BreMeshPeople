---
layout: default
title: Mitmachen – Schnellstart
permalink: /moin/
---

# Mitmachen im Bremer Mesh – Schnellstart

## Schnellstart in wenigen Schritten

1. **Firmware flashen**  
   Web-Flasher: [https://flasher.meshcore.co.uk/](https://flasher.meshcore.co.uk/)

2. **Region & Preset einstellen**  
   EU/UK (NARROW)

3. **Region „bremesh" setzen (Repeater)**  
   Damit unsere Pakete lokal bleiben und andere Netze nicht belasten, bitte auf allen Bremer Repeatern die Region `bremesh` einstellen – per App (als Admin) oder per CLI:
   ```
   region put bremesh *
   region allowf bremesh
   region home bremesh
   region save
   ```
   → Mehr Details im [News-Beitrag](/2026/03/07/region-bremesh/)

4. **Kanal beitreten**  
   `Public`

5. **Knoten platzieren**  
   Möglichst hoch und frei (Dach, Balkon, Mast), kurze Koaxkabel, gute Antenne.

6. **Testnachricht senden**  
   Zum Beispiel: „Hallo aus Bremen!"

7. **Reichweite testen (optional)**  
   Kanal `#Ping` – Bots antworten automatisch auf ping.

<hr>

## Knotenname

Bitte ändere den Standardnamen.

**Gute Beispiele:**

- Bremen-Süd Balkon
- HB-CitySolar
- NodeWalle

Solar-Knoten bitte mit „Solar“ kennzeichnen.

<hr>

## Standort-Tipps

- Höhe ist wichtiger als Sendeleistung
- Metall, Stahlbeton und Wechselrichter meiden
- Antenne wichtiger als Board-Modell

<hr>

## Community beitreten

Nach dem Setup – komm in unsere Community!  
Alle Infos zu Chat, Austausch und Kontakt findest du auf der **[Community-Seite](/community/)**.