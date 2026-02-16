---
layout: default
title: Matrix – Community Space für das BreMesh
permalink: /matrix/
---

# Matrix – Chat für das Bremer Mesh

## Was ist Matrix?

[Matrix](https://matrix.org/) ist ein offenes, dezentrales Kommunikationsprotokoll – ähnlich wie E-Mail, aber für Echtzeit-Chat.  
Jeder kann einen eigenen Server betreiben, und alle Server sprechen untereinander (Föderation).  
Nachrichten sind Ende-zu-Ende-verschlüsselt, es gibt Räume, Spaces, Sub-Spaces, Sub-Sub-(..), Dateiaustausch, Videotelefonie, Voicecalls und vieles mehr – alles ohne Abhängigkeit von einem einzelnen Anbieter.

Das Bremer Mesh nutzt Matrix als **Community Space außerhalb des Funknetzes**.  
Unser Matrix-Server lautet **hbme.sh**.

<hr>

## Account erstellen

1. **Element installieren** – lade den Client für deine Plattform herunter (siehe Tabelle unten) und starte ihn  (Oder benutzte den [WebClient](https://mtrx.hbme.sh/))
2. Wähle **„Konto erstellen"** (bzw. „Sign Up" / „Registrieren")  
3. Bei der Server-Auswahl auf **„Bearbeiten"** klicken und den Homeserver auf **`hbme.sh`** ändern  
4. Trage deinen gewünschten **Benutzernamen** und ein **Passwort** ein  
5. Gib den **Registrierungs-Token** ein, den du von einem Community-Mitglied erhalten hast  
6. Fertig – du bist drin!

> **Hinweis:** Die Registrierung ist Token-basiert. Du brauchst einen Einladungs-Token von jemandem aus der Community, um dich anzumelden. Frag einfach in der Telegram-Gruppe oder im Mesh nach einem Token.
>


<hr>

## Element – der empfohlene Client

[Element](https://element.io/) ist der bekannteste Matrix-Client und für alle Plattformen verfügbar:

| Plattform | Download |
|-----------|----------|
| **Web** | [mtrx.hbme.sh](https://mtrx.hbme.sh/) |
| **Windows** | [Element für Windows](https://element.io/download#windows) |
| **macOS** | [Element für Mac](https://element.io/download#macos) |
| **Linux** | [Element für Linux](https://element.io/download#linux) |
| **Android** | [Element im Play Store](https://play.google.com/store/apps/details?id=im.vector.app) |
| **iOS** | [Element im App Store](https://apps.apple.com/app/element-messenger/id1083446067) |

> **Tipp:** Es gibt zwei Versionen – **Element X** (neu, schneller, noch nicht alle Features) und **Element Classic** (bewährt, voller Funktionsumfang). Für die meisten Zwecke empfehlen wir derzeit den simpleren Client  **Element X** (im App Store als „Element x" gelistet).

<hr>

## Bridges – WhatsApp, Telegram & Co. in Matrix

Wer einen eigenen Matrix-Server betreibt (oder Zugang zu einem privat gehosteten Server hat), kann sogenannte **Bridges** einrichten.  
Bridges verbinden Matrix mit anderen Messengern – zum Beispiel **WhatsApp**, **Telegram**, Signal, Discord oder IRC.

### Wie funktioniert das?

Eine Bridge läuft auf dem Matrix-Server und verbindet sich mit deinem Account beim jeweiligen Dienst.  
Alle Nachrichten werden automatisch zwischen Matrix und dem anderen Messenger synchronisiert – du chattest in Element, dein Gegenüber in WhatsApp oder Telegram, ohne etwas davon zu merken.

### Vorteile

- **Ein Client für alles** – du brauchst nur noch Element und hast WhatsApp, Telegram und Matrix-Chats an einem Ort  
- **Desktop-Nutzung** – WhatsApp und Co. bequem am Rechner nutzen, ohne deren offizielle Desktop-Apps oder Handykopplung  
- **Benachrichtigungen bündeln** – keine fünf verschiedenen Messenger-Apps mehr

### Sicherheitsaspekt

- Die Bridge läuft auf **deinem eigenen Server** – deine Nachrichten gehen nicht über Drittanbieter-Infrastruktur  
- Du behältst die **volle Kontrolle** über deine Daten und Logs  
- Innerhalb von Matrix bleibt die **Ende-zu-Ende-Verschlüsselung** erhalten  
- Die Brücke entschlüsselt Nachrichten nur lokal auf deinem Server, um sie an den jeweiligen Dienst weiterzuleiten – es gibt keinen zusätzlichen Mittelsmann  
- Im Vergleich zu WhatsApp Web oder Telegram Web, die im Browser des Anbieters laufen, hast du mit einer selbst gehosteten Bridge **deutlich mehr Kontrolle und Transparenz**

> **Hinweis:** Bridges sind ein Feature für Fortgeschrittene und erfordern einen eigenen Server mit Root-Zugang. Auf dem BreMesh-Server (hbme.sh) sind aktuell keine öffentlichen Bridges eingerichtet.

<hr>

## Exkurs: BW-Messenger

Der [BW-Messenger](https://www.bwmessenger.de/) ist die offizielle Kommunikationslösung der Bundeswehr – und basiert vollständig auf dem **Matrix-Protokoll**.  
Damit ist die Bundeswehr einer der größten institutionellen Nutzer von Matrix weltweit und trägt aktiv zur Weiterentwicklung des Open-Source-Projekts bei – unter anderem durch Finanzierung, Sicherheitsaudits und Anforderungen an Skalierbarkeit und Verschlüsselung, von denen die gesamte Matrix-Community profitiert.
