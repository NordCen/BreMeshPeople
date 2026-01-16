---
layout: default
title: Umstieg von Meshtastic
permalink: /umstieg/
---

# Umstieg von Meshtastic

## Kein Fork, sondern Neuentwurf

MeshCore ist **kein Ableger von Meshtastic**, sondern ein komplett eigenständiges System.  
Die Hardware ist gleich – das **Netzkonzept ist anders**.

<hr>

## Rollenprinzip

- **Companion**  
  Dein persönlicher Node zum Schreiben und Lesen von Nachrichten.  
  Leitet keine fremden Pakete weiter.

- **Repeater**  
  Reiner Weiterleitungs-Knoten ohne Chats oder UI.  
  Zuständig für Reichweite und Netzstruktur.

Das sorgt für weniger Funklast und klarere Netze.

<hr>

## Wichtige Unterschiede zu Meshtastic

- Keine Mischrollen
- Keine manuell konfigurierten Intervalle
- Automatische Verwaltung von Telemetrie
- Eigenes Protokoll (nicht kompatibel)

<hr>

## Empfehlung für Umsteiger:innen

- Pro Standort **nur ein Companion**
- Repeater separat und möglichst hoch platzieren
- Public/Private Key notieren (Backup!)
