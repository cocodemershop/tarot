# Kartenreich · Website

Statische Seite für GitHub Pages: https://cocodemershop.github.io/tarot/

## Struktur
| Datei / Ordner | Aufgabe |
|---|---|
| `index.html` | Die Seite: Start mit Kartenfächer, Deck-Galerie, Ablauf, Tagebuch, Angebot, Orloj, FAQ, alle Fenster |
| `app.min.css`, `app.min.js` | Schnelle Bündel, die die Seite tatsächlich lädt (aus `css/` und `js/` gebaut) |
| `css/`, `js/` | Quelldateien. `css/magic.css` = neues Design, `js/landing.js` = Galerie, Großansicht, Kopierschutz |
| `cards/` | 78 Kartenbilder als WebP (480 × 823) und `cards/t/` Vorschaubilder |
| `img/` | Logo, Kartenfächer, Rückseite, Arbeitsbuch-Vorschauen, Teilen-Bild `og-kartenreich.jpg` |
| `fonts/` | Schrift Lora, lokal (keine Google-Fonts-Verbindung) |
| `icons/` | App- und Browser-Icons |
| `Kartenreich_Transformation_21_Tage_Arbeitsbuch.pdf` | Arbeitsbuch zum Download (71 Seiten) |

## Nach Änderungen an CSS oder JS
```
sh build.sh
```
Danach in `index.html` und `sw.js` die Versionsnummer `?v=14` sowie `CACHE` hochzählen, damit Besucher die neue Fassung bekommen.

## Ladezeit
- Mond und Milchstraße rechnen in eigenen Hintergrund-Threads (Web Worker). Die Seite bleibt beim Start flüssig.
- Bereiche weiter unten werden erst berechnet, wenn sie in Sicht kommen (`content-visibility` in `css/magic.css`).
- Sternenwirbel um „Jetzt kaufen“ zeichnet nur, wenn der Knopf sichtbar ist.
- App-Hinweis schwebt unten und schiebt die Seite nicht mehr (kein Layout-Sprung).
- Bauen: `sh build.sh` (braucht esbuild über npx).

## Teilen
- `js/social.js`: Facebook- und Instagram-Knöpfe überall neben WhatsApp und Telegram.
- Facebook teilt den Link der Seite (Vorschaubild aus `img/og-kartenreich.jpg`) und kopiert den Text zum Einfügen.
- Instagram: Auf dem Handy öffnet sich das Teilen-Menü mit Bild. Nach einer Legung ist das ein eigenes Story-Bild (1080 × 1920) mit den drei gezogenen Karten. Am PC wird der Text kopiert und Instagram geöffnet.

## Mond
- `js/moon.js`: echte Mondphase und echte Libration (das Taumeln des Mondes, nach Meeus) als 3D-Kugel, im Zeitraffer. Mit der Maus drehbar, federt danach in die echte Lage zurück. Bei „Bewegung reduzieren“ steht er still in der heutigen Lage.

## Einstellungen
- **Spende (aus):** `js/kartenlegen.js` → `DONATIONS = false`. Vor dem Einschalten `DONATE_EMAIL` eintragen.
- **Shop:** `js/shop.js` → `SHOP_URL`, `STORE_ID`, `PRODUCT_ID`.
- **Preis:** `index.html` und `js/preview.js` (`89,90 €`).

## Schutz
Rechtsklick, Ziehen, Langdruck-Speichern und Kopieren von Texten sind gesperrt. Kopiert jemand dennoch, landet nur ein Urheberrechtshinweis in der Zwischenablage. Ein vollständiger Schutz ist im Web technisch nicht möglich, die Sperren halten aber Gelegenheitskopierer ab.
