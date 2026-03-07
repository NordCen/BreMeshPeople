---
layout: post
title: "Bitte Region bremesh einstellen"
date: 2026-03-07
author: BreMesh Team
---

Unser Netz wächst – und damit auch unsere Reichweite. Das ist grundsätzlich erfreulich, bringt aber ein Problem mit sich: **Unsere Pakete werden inzwischen weit über Bremen hinaus empfangen** und belasten dadurch andere Mesh-Netze.

Ein konkretes Beispiel: Auf dem **Brocken** musste ein Repeater das Weiterleiten von Paketen ohne gesetzte Region teilweise abschalten, weil zu viel Airtime verbraucht wurde.

## Was ist zu tun?

Bitte stellt auf euren Bremer Repeatern die **Region `bremesh`** ein und erlaubt das Flooding dafür. So bleiben unsere Nachrichten im lokalen Netz und belasten nicht das überregionale Mesh.

Das geht entweder **über die MeshCore App** (als Admin auf dem Repeater eingeloggt) oder **per CLI** (seriell).

### Per CLI

```
region put bremesh *
region allowf bremesh
region home bremesh
region save
```

**Schritt für Schritt:**

1. `region put bremesh *` – legt die Region „bremesh" an (unter dem globalen Scope)
2. `region allowf bremesh` – erlaubt Flooding für Pakete mit Region „bremesh"
3. `region home bremesh` – setzt „bremesh" als Heimat-Region des Repeaters
4. `region save` – speichert die Konfiguration dauerhaft

**Prüfen** könnt ihr die Einstellung mit:

```
region
```

Dort sollte `bremesh` mit einem `F` (Flood erlaubt) aufgelistet sein.

## Warum ist das wichtig?

- **Weniger Airtime-Verschwendung** – Repeater außerhalb Bremens leiten unsere Pakete nicht unnötig weiter
- **Bessere Netz-Qualität** – lokal bleibt mehr Kapazität für unsere eigene Kommunikation
- **Gute Nachbarschaft** – wir belasten andere Communities nicht mit unserem Traffic

## Weitere nützliche Region-Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `region` | Zeigt alle definierten Regionen und Flood-Berechtigungen |
| `region get bremesh` | Zeigt Details zur Region „bremesh" |
| `region list allowed` | Listet alle Regionen mit Flood-Erlaubnis |
| `region list denied` | Listet alle Regionen ohne Flood-Erlaubnis |
| `region home` | Zeigt die aktuell gesetzte Heimat-Region |
| `region denyf {name}` | Entzieht einer Region die Flood-Berechtigung |
| `region remove {name}` | Entfernt eine Region (nur wenn keine Kind-Regionen existieren) |

> **Hinweis:** Companions, die nur mit Bremer Repeatern verbunden sind, müssen nicht umgestellt werden – aber es schadet auch nicht. Die Region-Befehle sind nur auf Repeatern verfügbar.
