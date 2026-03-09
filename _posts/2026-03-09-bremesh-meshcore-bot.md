---
layout: post
title: "MeshCore Bot – MQTT-Bridge & API-Anbindung"
date: 2026-03-09
author: BreMesh Team
---

Der **BreMesh MeshCore Bot** ist da! 🤖

Bartzi hat den [meshcore-bot](https://github.com/agessaman/meshcore-bot) von agessaman geforkt und um einige praktische Funktionen für unser Netz erweitert. Der Bot dient als Brücke zwischen dem Mesh-Netzwerk, MQTT und unserer API-Infrastruktur.

## Was kann der Bot?


- **Akkustand & Telemetrie** – Daten eurer eigenen Repeater lassen sich bequem via Web oder MQTT abfragen
- **MQTT-Bridge** – Entschlüsselte Mesh-Pakete werden per MQTT ausgeliefert, und umgekehrt können über MQTT auch Nachrichten ins Mesh gesendet werden
- **API-Anbindung an api.hbme.sh** – Empfangene Pakete können automatisch an die API übermittelt und auf der Website ausgewertet werden. Den API-Key gibts von Bartzi.

## Warum ist das nützlich?
Wer eigene Repeater betreibt, kann damit den Zustand seiner Nodes zentral überwachen – ohne sich mit dem Repeater via App verbinden zu müssen. Und über die MQTT-Schnittstelle lassen sich eigene Automatisierungen und Dashboards (z.B. Grafana) anbinden. Auch die Integration in **Node-RED** oder **Home Assistant** ist damit problemlos möglich – einfach den MQTT-Broker anbinden und Mesh-Daten in eure Smart-Home-Flows einbauen.

## Zum Projekt

- **Repository:** [github.com/robrec/bremesh-meshcore-bot](https://github.com/robrec/bremesh-meshcore-bot)
- **Basiert auf:** [meshcore-bot](https://github.com/agessaman/meshcore-bot) von agessaman
- **Autor:** Bartzi
