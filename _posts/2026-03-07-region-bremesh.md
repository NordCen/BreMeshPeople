---
layout: post
title: "Bitte Region „bremesh" einstellen"
date: 2026-03-07
author: BreMesh Team
---

Unser Netz wächst – und damit auch unsere Reichweite. Das ist grundsätzlich erfreulich, bringt aber ein Problem mit sich: **Unsere Pakete werden inzwischen weit über Bremen hinaus empfangen** und belasten dadurch andere Mesh-Netze.

Ein konkretes Beispiel: Auf dem **Brocken** musste ein Repeater das Weiterleiten von Paketen ohne gesetzte Region teilweise abschalten, weil zu viel Airtime verbraucht wurde.

## Was ist zu tun?

Bitte stellt auf euren Bremer Repeatern die **Region auf `bremesh`** ein. So bleiben unsere Nachrichten im lokalen Netz und belasten nicht das überregionale Mesh.

Per CLI geht das so:

```
set region bremesh
```

## Warum ist das wichtig?

- **Weniger Airtime-Verschwendung** – Repeater außerhalb Bremens leiten unsere Pakete nicht unnötig weiter
- **Bessere Netz-Qualität** – lokal bleibt mehr Kapazität für unsere eigene Kommunikation
- **Gute Nachbarschaft** – wir belasten andere Communities nicht mit unserem Traffic

> **Hinweis:** Companions, die nur mit Bremer Repeatern verbunden sind, müssen nicht zwingend umgestellt werden – aber es schadet auch nicht.
