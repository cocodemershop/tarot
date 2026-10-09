# Kartenreich – 21 Tage Transformation

Live: https://cocodemershop.github.io/tarot/

## Veröffentlichen (GitHub Pages)
1. Repo `tarot` im Account `cocodemershop` öffnen.
2. Den **Inhalt** dieses Ordners ins Repo hochladen (Add file → Upload files). Den Ordner `cards/` mit den 78 Kartenbildern (`g0.jpg` … `s3_13.jpg`) ebenfalls ins Repo legen. Fehlt er, zeigt die Seite gezeichnete Karten statt Fotos.
3. Settings → Pages → Branch `main`, Ordner `/ (root)`.

## Nach Updates
In `sw.js` die Zeile `const VERSION = "kr-v1"` hochzählen (z. B. `kr-v2`), damit Geräte die neue Version laden.

## Inhalt
`index.html` App · `karten/` 78 SEO-Seiten · `sw.js` Offline/Cache · `manifest.webmanifest` + `icons/` Installation · `sitemap.xml`, `robots.txt` · Arbeitsbuch-PDF
