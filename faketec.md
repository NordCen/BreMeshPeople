---
layout: default
title: FakeTec – DIY LoRa-Boards
permalink: /faketec/
---

# FakeTec – ProMicro-basierte LoRa-Boards

## Was ist das FakeTec?

Das **FakeTec** ist ein Open-Source-PCB-Design für ein günstiges, selbst lötbares LoRa-Board auf Basis des **ProMicro nRF52840** (auch bekannt als „NiceNano" / „SuperMini").  
Es hat den Formfaktor eines Heltec V3 – man kann also die gleichen Gehäuse verwenden – und ist kompatibel mit **MeshCore** und **Meshtastic**.

Das Projekt wurde von [gargomoma](https://github.com/gargomoma) gestartet und wird aktiv von der Community weiterentwickelt.

- **Repository:** [github.com/gargomoma/fakeTec_pcb](https://github.com/gargomoma/fakeTec_pcb)
- **Kosten:** ca. **15 €** pro Board (PCB + Bauteile + Antenne)
- **MCU:** ProMicro nRF52840 (SuperMini / NiceNano)
- **LoRa-Modul:** EByte E22/E220 (HT-RA62) oder RA-01SH
- **Frequenz:** 868 MHz (EU)

Mit ein wenig Löt-Equipment und Grundkenntnissen im Löten kann man sich ein FakeTec für ca. **15 €** komplett selbst bauen.  
Wer kein eigenes Board bauen möchte oder gerade kein Material da hat: **Frag einfach in unseren [Kommunikationskanälen](/community/)** – einige Community-Mitglieder haben immer fertige Boards herumliegen und geben gerne eins ab.

<hr>

## Überblick der Versionen

Es gibt mehrere PCB-Revisionen – neuere sind nicht zwingend besser, je nach Anwendungsfall.

| Version | Autor | Besonderheiten |
|---------|-------|----------------|
| **V1** | gargomoma | Ursprüngliches Layout |
| **V2** | gargomoma | OLED-Pins verschoben, Spannungsteiler-Widerstände verschoben, 2-mm-Löcher |
| **V3** | gargomoma | Größere Pads, 2 Taster, Zugang zu Charge-Boost-Option |
| **V4** | lupusworax | Wie V3, plus 3 SMD-MOSFETs für externe Hardware (GPS, Buzzer, Vibra, LED) |
| **V5** | ShimonHoranek | Batterieschutz (XB8089D0), Low-Profile, JST-Stecker, dedizierte Batterie-Pins |
| **V6** | ShimonHoranek | ⚠️ UNTESTED – Wie V5 + Solar (CN3791 MPPT) |
| **MiniX** | lupusworax | Kompakte Variante des V4 mit zusätzlichen Features |

> **Tipp:** Wer unsicher ist, nimmt am besten **V3** oder **V4** als Einstieg.

<hr>

## FakeTec V4

Das **FakeTec V4** wurde von [lupusworax](https://github.com/lupusworax) entworfen und erweitert das V3-Design um **drei SMD-MOSFETs** (SI2312) zum Schalten externer Hardware.

### Features

- Gleicher Formfaktor wie V3 – passt in alle bisherigen Gehäuse
- 3 GPIO-gesteuerte MOSFETs (Pin 24, 6, 8) für:
  - **GPS-Modul** (z. B. ATGM336H)
  - **Buzzer**
  - **Vibra-Motor**
  - **LED**
- Externe Hardware wird an Dauer-Plus angeschlossen, Ground wird über die MOSFETs geschaltet
- Nur noch SMD-Spannungsteiler (kein THT mehr)
- Große, runde Lötpads für einfache Verdrahtung

### Bauteile (zusätzlich zur Basisversion)

- 3× SI2312 MOSFETs
- 10K Widerstände (1206)

### Details & Gerber-Dateien

→ [FakeTec V4 – Issue #16](https://github.com/gargomoma/fakeTec_pcb/issues/16)

<hr>

## FakeTec V5

Das **FakeTec V5** wurde von [ShimonHoranek](https://github.com/shimonomihs) entwickelt und bringt signifikante Verbesserungen bei Batterieschutz und Montage.

### Features

- **Batterieschutz** mit XB8089D0 (Überladung, Tiefentladung, Kurzschluss, Überstrom)
  - Verhindert Speicherkorruption durch zu niedrige Spannung (Cutoff bei 2,9 V)
- **JST 1,25 Stecker** – gleich wie beim Heltec V3
- **Dedizierte Batterie-Pins** auf dem Board
- **Low-Profile-Montage** – ProMicro wird per SMD-Pads befestigt statt durch klassische Pin-Header
- **Pull-up-Widerstände und Kondensatoren** an den Tastern für Entprellung
- **GPS-Pads** auf der Rückseite (TX, RX)
- Design in **KiCad** (frei editierbar, lizenziert unter GPLv3 / CERN-OHL-P-2.0)
- Jumper zum Wählen zwischen BMS-Schutz oder Direkt-Batterieanschluss
- **Rev. B** ergänzt Encoder-Pins für Canned Messages

### Bauteile

| Bauteil | Menge |
|---------|-------|
| ProMicro nRF52840 (NiceNano) | 1× |
| LoRa-Modul (E22/HT-RA62/RA-01SH) | 1× |
| XB8089D0 (Batterieschutz) | 1× |
| SI2312 MOSFETs | 3× |
| SMD-Taster 3×4×2,5 mm | 2× |
| Widerstand 1206 1k | 1× |
| Widerstände 1206 10k | 5× |
| Widerstände 1206 10M | 2× |
| Kondensatoren 1206 100nF 10V | 4× |
| JST 1,25 Stecker (optional) | 1× |

### Einstellungen nach dem Build

- ADC Multiplier Override: **2**
- GPS-Pins (Meshtastic): RX → 20, TX → 22, EN → 24

### Details & Gerber-Dateien

→ [FakeTec V5 – Issue #24](https://github.com/gargomoma/fakeTec_pcb/issues/24)

<hr>

## Basis-Bauteile (alle Versionen)

| Bauteil | Ungefährer Preis |
|---------|-----------------|
| ProMicro nRF52840 (SuperMini / NiceNano) | ~5 € |
| HT-RA62 oder RA-01SH (LoRa-Modul) | ~5 € |
| 2× Widerstände (Spannungsteiler, z. B. 2× 1M) | ~0,10 € |
| OLED SSD1306 i2c (optional) | ~1,50 € |
| Antennen-Pigtail (empfohlen) | ~2 € |
| PCB (5er Pack, inkl. Versand & Zoll) | ~8 € (1,60 €/Stück) |
| 2× Taster (3×4×2 mm) | ~0,10 € |
| **Gesamt** | **~15 €** |

<hr>

## Bootloader

> ⚠️ **Immer den ProMicro vor dem Löten testen!**

Prüfe ob die Bootloader-Version **≥ 0.8** ist. Falls nicht, Update von [Adafruit nRF52 Bootloader](https://github.com/adafruit/Adafruit_nRF52_Bootloader/releases) herunterladen.

**Update-Datei:** `update-nice_nano_bootloader-X.X.X_nosd.uf2`

### Bootloader flashen

1. Gerät per USB anschließen
2. **RST und GND schnell doppelt** mit einer Pinzette brücken
3. Es erscheint ein USB-Laufwerk namens **„NICENANO"**
4. Die `.uf2`-Datei auf das Laufwerk kopieren
5. Warten bis das Gerät neu startet

### ProMicro ohne Bootloader (Brick)

Manche billige ProMicros kommen ohne Bootloader. In dem Fall brauchst du einen ESP32 als Programmer:

1. `.hex`-Bootloader von [Adafruit Releases](https://github.com/adafruit/Adafruit_nRF52_Bootloader/releases) herunterladen
2. ESP32 mit [ESP32_nRF52_SWD](https://github.com/atc1441/ESP32_nRF52_SWD) flashen
3. `CLK`, `DIO`, `GND`, `VDD` (3V) an die SWD-Pins auf der Rückseite des ProMicro löten
4. ESP32 einschalten → `swd.local` im Browser öffnen
5. **Init SWD** → **Erase nRF** → **Flash Uploaded File** (Offset: 0, die `.hex`-Datei auswählen)
6. Fertig!

<hr>

## MeshCore Firmware via OTA updaten

Das FakeTec kann **Over-the-Air (OTA)** aktualisiert werden – ohne USB-Kabel und ohne physischen Zugang zum Gerät. Das ist besonders praktisch für Repeater, die an hohen Masten oder auf Dächern montiert sind.

Das FakeTec basiert auf dem nRF52840 – dafür funktioniert das OTA-Update via **Bluetooth DFU**:

1. **nRF DFU App** installieren  
   - [Android (Play Store)](https://play.google.com/store/apps/details?id=no.nordicsemi.android.dfu) – Suche nach „nRF Device Firmware Update"  
   - [iOS (App Store)](https://apps.apple.com/app/nrf-device-firmware-update/id1624454660)

2. **Firmware herunterladen**  
   Auf [flasher.meshcore.co.uk](https://flasher.meshcore.co.uk/) die **ZIP-Version** der Firmware für dein Gerät herunterladen (z. B. `promicro_diy_tcxo_companion_radio_ble-vX.X.X.zip`)

3. **OTA-Modus starten**  
   - Verbinde dich über die MeshCore-App mit dem Repeater (Admin-Login)
   - Gehe zum **Command Line**-Tab und tippe: `start ota`
   - Es sollte `OK` erscheinen – das Gerät ist jetzt im OTA/DFU-Modus

4. **DFU App öffnen**  
   - Tippe auf **Settings** (oben rechts)
   - Aktiviere **Packets receipt notifications**
   - Setze **Number of Packets** auf **8**

5. **Firmware flashen**  
   - Wähle die heruntergeladene ZIP-Datei aus
   - Wähle das Gerät aus der Liste (falls es nicht erscheint: `Force Scanning` aktivieren oder Bluetooth neu starten)
   - Tippe auf **Upload** und warte, bis das Update abgeschlossen ist (kann einige Minuten dauern)

> **Tipp:** Falls das Update fehlschlägt, Bluetooth am Handy aus- und wieder einschalten. Bei weiteren Problemen das Handy neu starten.

### ⚠️ Bootloader 0.6.0 – kein OTA möglich

Die meisten aktuellen ProMicros werden mit **Bootloader 0.6.0** ausgeliefert. Dieser Bootloader unterstützt **kein OTA-Update** – der `start ota`-Befehl funktioniert damit nicht.

**Workaround mit dem oltaco-Bootloader:**

> ⚠️ **Vorher unbedingt die Keys sichern!** Das Flashen des neuen Bootloaders **löscht das Gerät komplett**.

1. Den verbesserten Bootloader als **ZIP-Datei** von [oltaco/Adafruit_nRF52_Bootloader_OTAFIX](https://github.com/oltaco/Adafruit_nRF52_Bootloader_OTAFIX) herunterladen
2. Das Gerät per USB in den DFU-Modus versetzen (RST + GND doppelt brücken → USB-Laufwerk erscheint)
3. Den oltaco-Bootloader via **nRF DFU App** (siehe oben) auf das Gerät flashen
4. Nach dem Neustart ist der neue Bootloader aktiv und OTA-fähig
5. Jetzt die aktuelle **MeshCore-Firmware** per DFU OTA flashen (wie oben beschrieben)
6. Gerät neu konfigurieren (Keys, Name, etc.)

Dieser Bootloader fällt bei ungültiger Firmware automatisch in den DFU-Modus zurück – so kannst du einen fehlgeschlagenen OTA-Versuch einfach wiederholen, ohne das Gerät physisch zu erreichen.

<hr>

## Power Saving Mode (ab Firmware 1.13.0)

Mit der **MeshCore Firmware v1.13.0** wurde der **Power Saving Mode** für nRF52-Geräte eingeführt. Damit sinkt der Stromverbrauch eines FakeTec-Repeaters von ca. **11 mA** auf nur noch **4–5 mA**.

### Aktivieren

Verbinde dich über die MeshCore-App mit dem Gerät (Admin-Login), gehe zum **Command Line**-Tab und tippe:

```
powersaving on
```

### Akkulaufzeit-Rechnung

| Akku | Kapazität | Ohne Power Saving (11 mA) | Mit Power Saving (4,5 mA) |
|------|-----------|---------------------------|---------------------------|
| 18650 Li-Ion | 3.400 mAh | ~309 h ≈ **12,9 Tage** | ~756 h ≈ **31,5 Tage** |
| LiPo-Zelle | 3.000 mAh | ~273 h ≈ **11,4 Tage** | ~667 h ≈ **27,8 Tage** |

> **Hinweis:** Die Werte sind theoretische Maximalwerte (Kapazität ÷ Stromverbrauch). In der Praxis hängt die Laufzeit von Temperatur, Sendehäufigkeit und Displaynutzung ab – aber die verdoppelte Laufzeit durch Power Saving macht einen enormen Unterschied, besonders bei Solar-Repeatern.

<hr>

## Community-Ressourcen

### Videos

- [FakeTec V2 bauen – KBOX Labs](https://www.youtube.com/watch?v=NtnSVTl6weA)
- [FakeTec V2 bauen – lupusworax](https://www.youtube.com/watch?v=JvBfYyUF-0w)
- [FakeTec V3 bauen – ea3grn (Spanisch)](https://www.youtube.com/watch?v=NRIXPWYmfq8)
- [FakeTec V5 + RA-01SH-P – Fu-Yuan Li (Chinesisch)](https://www.youtube.com/watch?v=OINfwTYuP40)
- [ProMicro Bootloader & Firmware flashen – JudithWang25](https://www.youtube.com/watch?v=Nf3oAq6VFJk)

### Gehäuse (3D-Druck)

Die Community hat zahlreiche Gehäuse-Designs erstellt, z. B.:

- **FakeCAP** / **FakeCAP Solar** – von lupusworax ([Printables](https://www.printables.com/social/1081137-lupusworax/models))
- **Meshformer** / **WayPoint** / **SCOUT** – von lupusworax
- **Solar Outdoor Node** – für Repeater im Außeneinsatz

Alle Designs findest du im [FakeTec Repository](https://github.com/gargomoma/fakeTec_pcb).

### Anleitungen

- [Building Guide – Adrelien](https://adrelien.com/diy-meshtastic-how-to-build-your-own-meshtastic-device-with-faketec-pcb-nrf52840)
