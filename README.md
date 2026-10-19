# Kartenreich · Website

Statische Seite für GitHub Pages: https://cocodemershop.github.io/tarot/

## Struktur
| Datei / Ordner | Aufgabe |
|---|---|
| `index.html` | Die Seite: Start mit Kartenfächer, Deck-Galerie, Ablauf, Tagebuch, Angebot, Orloj, FAQ, alle Fenster |
| `app.min.css`, `app.min.js` | Schnelle Bündel, die die Seite tatsächlich lädt (aus `css/` und `js/` gebaut) |
| `css/`, `js/` | Quelldateien. `css/magic.css` = neues Design, `js/landing.js` = Galerie, Großansicht, Kopierschutz |
| `cards/` | 78 Kartenbilder (480 × 823) und `cards/t/` Vorschaubilder |
| `img/` | Logo, Kartenfächer, Rückseite, Arbeitsbuch-Vorschauen, Teilen-Bild `og-kartenreich.jpg` |
| `fonts/` | Schrift Lora, lokal (keine Google-Fonts-Verbindung) |
| `icons/` | App- und Browser-Icons |
| `Kartenreich_Transformation_21_Tage_Arbeitsbuch.pdf` | Arbeitsbuch zum Download (71 Seiten) |

## Nach Änderungen an CSS oder JS
```
sh build.sh
```
Danach in `index.html` und `sw.js` die Versionsnummer `?v=7` sowie `CACHE` hochzählen, damit Besucher die neue Fassung bekommen.

## Einstellungen
- **Spende (aus):** `js/kartenlegen.js` → `DONATIONS = false`. Vor dem Einschalten `DONATE_EMAIL` eintragen.
- **Shop:** `js/shop.js` → `SHOP_URL`, `STORE_ID`, `PRODUCT_ID`.
- **Preis:** `index.html` und `js/preview.js` (`89,90 €`).

## Schutz
Rechtsklick, Ziehen, Langdruck-Speichern und Kopieren von Texten sind gesperrt. Kopiert jemand dennoch, landet nur ein Urheberrechtshinweis in der Zwischenablage. Ein vollständiger Schutz ist im Web technisch nicht möglich, die Sperren halten aber Gelegenheitskopierer ab.
