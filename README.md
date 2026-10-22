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
- **Angebot:** `js/angebot.js` + `css/angebot.css`. 59,90 € statt 89,90 € bis einschließlich 1. Dezember 2026 (Berliner Zeit), danach automatisch wieder 89,90 €. Band oben, Angebotsbereich mit Countdown, Kaufansicht, Vorschau, FAQ und Suchmaschinen-Daten. Werte stehen oben in der Datei (`A`). Testen: `?angebotAm=2026-12-02`. Den Preis im Ecwid-Shop separat einstellen!

## Schutz
Rechtsklick, Ziehen, Langdruck-Speichern und Kopieren von Texten sind gesperrt. Kopiert jemand dennoch, landet nur ein Urheberrechtshinweis in der Zwischenablage. Ein vollständiger Schutz ist im Web technisch nicht möglich, die Sperren halten aber Gelegenheitskopierer ab.

## Opening „Die Blüte der 22“
- `css/intro.css` + `js/intro.js` (eigenständig, nicht im Bündel). Ablauf ca. 7,5 s: Sternenhimmel und Lichtpunkt · goldenes Siegel (Kreise, achtzackiger Stern wie auf der Rückseite) · die 22 Großen Arkana öffnen sich als Lotusblüte und drehen sich zur Vorderseite · Schriftzug „Kartenreich“ mit Lichtstreif · die Blüte schließt sich, Narr, Rückseite und Welt werden in den Kartenfächer ausgeteilt.
- Eintreten und Klang: Browser erlauben Ton erst nach einer Berührung. Das Opening beginnt deshalb mit einem leuchtenden Kreis „Eintreten · mit Klang“ (oder „ohne Klang eintreten“). Nach 12 s ohne Eingabe startet es leise von selbst. Der Klang wird live im Browser erzeugt (Web Audio, keine Audiodateien): tiefer Grundton, Glocken in A-lydisch-pentatonisch, Nachhall, Kartenrascheln, Gong beim Namen. Während des Openings schaltet „♪ Klang“ stumm. Lautstärke: `makeAudio()` in `js/intro.js`, Wert `.6`.
- Einmal pro Browser-Sitzung; erneutes Laden in derselben Sitzung startet direkt. Mit `?intro` in der Adresse läuft es immer.
- Antippen, Escape oder „Überspringen“ beendet es sofort. „Bewegung reduzieren“: kurzes ruhiges Einblenden.
- Erstbesuch: das Willkommensfenster erscheint erst nach der Landung.
- Standbild zum Prüfen: `?introAt=4.5` hält das Opening bei 4,5 Sekunden an.

## Erst selbst deuten (Begegnung mit einer Karte)
- Dateien: `css/begegnung.css`, `js/begegnung.js` (eigenständig geladen, nach `app.min.js`), Abschnitt `#selbst-deuten` und Fenster `#bgd` in `index.html`.
- Ablauf in 5 Schritten: Karte entdecken (aus einem verdeckten Fächer) · Erster Blick (3 Fragen, Begriffe, Lupe) · Bedeutung (erst jetzt sichtbar) · Vergleich · Abschluss.
- Daten: nutzt `CARDS` aus `js/cards.js` (keine zweite Kartenliste). Symbol-Texte und Bedeutungen je Lebensbereich gibt es im Projekt nicht; diese Abschnitte werden nicht angezeigt.
  Symbol-Texte lassen sich später ergänzen: vor `js/begegnung.js` ein Skript mit `window.KR_SYMBOLE={g0:["…"]}` laden.
- Speicher (nur im Browser): `kr_begegnungen` (Journal), `kr_beg_entwurf` (laufende Begegnung), sessionStorage `kr_beg_sitzung` (keine doppelten Karten pro Sitzung).
- Einstiege: Abschnitt auf der Startseite, „Mehr“-Menü, Großansicht der Deck-Galerie („Diese Karte selbst deuten“), Direktlink `…/tarot/#begegnung`.
- Tests: `python3 tools/test-begegnung.py http://localhost:8766/tarot/` (Playwright, Seite unter Unterpfad starten, siehe Kopf der Datei).
