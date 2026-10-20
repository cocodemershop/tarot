/* Ersatzfarben für ältere iPhones (Safari vor iOS 16.2 kennt color-mix() nicht).
   Vor jede Angabe mit color-mix() wird dieselbe Angabe mit einer fertig berechneten
   Farbe gesetzt. Neue Browser nehmen die zweite (genaue) Angabe, alte die erste.
   Aufruf durch build.sh:  node tools/css-fallback.js datei.css */
const fs = require("fs");
const file = process.argv[2];
let css = fs.readFileSync(file, "utf8");

/* Werte der dunklen Grundfarben; Kartenfarben (--zc, --sc) werden durch Gold angenähert */
const VARS = { "--g": "#e8b45a", "--ok": "#7ee0b5", "--ink": "#ece3f2", "--line": "#3a2b4d",
  "--card": "#1a1127", "--mute": "#a998b8", "--bg": "#0e0817", "--bad": "#ff7a8a", "--zc": "#e8b45a", "--sc": "#e8b45a" };
const NAMED = { transparent: [0, 0, 0, 0], white: [255, 255, 255, 1], black: [0, 0, 0, 1], red: [255, 0, 0, 1], blue: [0, 0, 255, 1] };

function parseColor(s) {
  s = s.trim();
  const v = s.match(/^var\((--[\w-]+)(?:,([^)]*))?\)$/);
  if (v) return VARS[v[1]] ? parseColor(VARS[v[1]]) : (v[2] ? parseColor(v[2]) : null);
  if (NAMED[s]) return NAMED[s].slice();
  let h = s.match(/^#([0-9a-f]{3,8})$/i);
  if (h) {
    h = h[1];
    if (h.length <= 4) h = h.split("").map(c => c + c).join("");
    const n = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
    n.push(h.length === 8 ? parseInt(h.substr(6, 2), 16) / 255 : 1);
    return n;
  }
  const r = s.match(/^rgba?\(([^)]*)\)$/);
  if (r) { const p = r[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
  return null;
}
function splitTop(s) { const out = []; let d = 0, cur = "";
  for (const ch of s) { if (ch === "(") d++; if (ch === ")") d--; if (ch === "," && d === 0) { out.push(cur); cur = ""; } else cur += ch; }
  out.push(cur); return out; }
function part(p) { const m = p.trim().match(/^(.*?)(?:\s+([\d.]+)%)?$/); return { c: parseColor(m[1]), pct: m[2] !== undefined ? +m[2] / 100 : null }; }
function mix(args) {
  const a = splitTop(args); if (a.length !== 3 || !/^\s*in\s+srgb\s*$/.test(a[0])) return null;
  const A = part(a[1]), B = part(a[2]); if (!A.c || !B.c) return null;
  let pa = A.pct, pb = B.pct;
  if (pa === null && pb === null) { pa = .5; pb = .5; } else if (pa === null) pa = 1 - pb; else if (pb === null) pb = 1 - pa;
  const al = A.c[3] * pa + B.c[3] * pb; if (al <= 0) return "transparent";
  const ch = i => Math.round((A.c[i] * A.c[3] * pa + B.c[i] * B.c[3] * pb) / al);
  return `rgba(${ch(0)},${ch(1)},${ch(2)},${+al.toFixed(3)})`;
}
function replaceMixes(val) {
  let out = "", i = 0;
  while (true) {
    const k = val.indexOf("color-mix(", i); if (k < 0) { out += val.slice(i); return out; }
    out += val.slice(i, k); let d = 0, j = k + 9;
    for (; j < val.length; j++) { if (val[j] === "(") d++; if (val[j] === ")") { d--; if (d === 0) break; } }
    const inner = val.slice(k + 10, j), res = mix(replaceMixes(inner));
    if (!res) return null; out += res; i = j + 1;
  }
}
let n = 0;
css = css.replace(/([{;]\s*)([a-z-]+)(\s*:\s*)([^;{}]*color-mix\([^;{}]*)/gi, (all, pre, prop, colon, val) => {
  const fb = replaceMixes(val); if (!fb) return all; n++;
  return `${pre}${prop}${colon}${fb.replace(/\s*!important\s*$/, "")};${prop}${colon}${val}`;
});
fs.writeFileSync(file, css);
console.log("Ersatzfarben für ältere iPhones: " + n);
