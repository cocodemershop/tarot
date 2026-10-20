#!/bin/sh
# Baut die schnellen Bündel aus css/ und js/. Nach jeder Änderung an CSS oder JS ausführen:  sh build.sh
set -e
ESB=${ESBUILD:-npx -y esbuild@0.24.0}
CSS="css/base.css css/components.css css/kartenlegen.css css/responsive.css css/pro.css css/magic.css"
JS=$(grep -o 'data-src="js/[^"]*"' index.html | sed 's/data-src="//;s/"//')
cat $CSS | sed 's#\.\./fonts/#fonts/#g; s#\.\./img/#img/#g' > dist.tmp.css
node tools/css-fallback.js dist.tmp.css
$ESB dist.tmp.css --minify --outfile=app.min.css --log-level=warning
for f in $JS; do cat "$f"; printf '\n;\n'; done > dist.tmp.js
$ESB dist.tmp.js --minify --target=es2019 --outfile=app.min.js --log-level=warning
rm -f dist.tmp.css dist.tmp.js
echo "fertig: app.min.css $(wc -c < app.min.css) Bytes, app.min.js $(wc -c < app.min.js) Bytes"
