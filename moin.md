---
layout: default
title: Mitmachen – Schnellstart
permalink: /moin/
---

# Mitmachen im Bremer Mesh – Schnellstart

## Companion (Client-Knoten)

Ein Companion ist dein persönliches Gerät, über das du Nachrichten senden und empfangen kannst – entweder per Bluetooth mit der MeshCore App oder per USB.

1. **Companion-Firmware flashen**
   Web-Flasher: [https://flasher.meshcore.co.uk/](https://flasher.meshcore.co.uk/) → Firmware-Typ **Companion** wählen

2. **Region & Preset einstellen**
   EU/UK (NARROW)

3. **App installieren & verbinden**
   MeshCore App ([Android](https://play.google.com/store/apps/details?id=com.liamcottle.meshcore.android)) installieren und per Bluetooth mit dem Companion verbinden

4. **Namen setzen**
   Einen individuellen Namen vergeben (z. B. "HB-Max", "Benjamin" oder deinen Funknamen)

5. **Kanal beitreten**
   `Public` (Wenn nicht automatisch geschehen)

6. **Testnachricht senden**
   Zum Beispiel: „Hallo aus Bremen!"

7. **Reichweite testen (optional)**
   Kanal `#Ping` – Bots antworten automatisch auf ping.

<hr>

## Repeater

Ein Repeater leitet Nachrichten anderer Knoten weiter und erweitert so die Reichweite des Netzes. Repeater brauchen keine App – sie arbeiten autonom.

1. **Repeater-Firmware flashen**
   Web-Flasher: [https://flasher.meshcore.co.uk/](https://flasher.meshcore.co.uk/) → Firmware-Typ **Repeater** wählen

2. **Region & Preset einstellen**
   EU/UK (NARROW)

3. **Region „bremesh" setzen**
   Damit unsere Pakete lokal bleiben und andere Netze nicht belasten, bitte die Region `bremesh` einstellen – per App (als Admin auf dem Repeater eingeloggt) oder per CLI:
   ```
   region put bremesh *
   region allowf bremesh
   region home bremesh
   region save
   ```
   → Mehr Details im [News-Beitrag](/2026/03/07/region-bremesh/)

4. **Namen setzen**
   Einen eindeutigen Namen vergeben (z. B. „HB-CitySolar", „Bremen-Süd Dach")

5. **Knoten platzieren**
   Möglichst hoch und frei (Dach, Balkon, Mast), kurze Koaxkabel, gute Antenne.

<hr>

## Knotenname

Bitte ändere den Standardnamen.

**Gute Beispiele:**

- Bremen-Süd Balkon
- HB-CitySolar
- Walle-Nord


<hr>

## Standort-Tipps (Repeater)

- Höhe ist wichtiger als Sendeleistung
- Metall, Stahlbeton und Wechselrichter meiden
- Antenne wichtiger als Board-Modell

<hr>

## Community beitreten

Nach dem Setup – komm in unsere Community!
Alle Infos zu Chat, Austausch und Kontakt findest du auf der **[Community-Seite](/community/)**.