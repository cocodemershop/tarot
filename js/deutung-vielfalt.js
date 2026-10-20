/* Deutungs-Vielfalt: große Textpools, Gedächtnis gegen Wiederholung und das „Siegel dieser Stunde“.
   Wird vor kartenlegen.js geladen. Alle Funktionen hängen am Objekt `Vielfalt`.

   Wie die Wiederholungsfreiheit funktioniert:
   - Jeder Textbaustein stammt aus einem Pool. Pro Pool merkt sich der Browser (localStorage),
     welche Varianten zuletzt gezeigt wurden, und zieht nur aus den noch ungezeigten.
     Erst wenn ein Pool ganz durch ist, beginnt er von vorn (mit anderer Reihenfolge).
   - Die Bausteine werden zu Sätzen kombiniert und mit Kartennamen, Schlüsselwörtern,
     Zahl, Uhrzeit, Wochentag und Mondphase der jeweiligen Legung gefüllt.
   - Das Siegel am Ende wählt zusätzlich eine von sieben Ausdrucksformen. */
const Vielfalt = (function () {
  "use strict";
  const KEY = "kr_vf2";
  let mem = {};
  try { mem = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { mem = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {} };
  const rnd = n => {
    try { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; }
    catch (e) { return Math.floor(Math.random() * n); }
  };

  /* Zieht eine Variante, die in diesem Pool noch nicht (oder am längsten nicht) gezeigt wurde. */
  function pick(pool, arr) {
    if (!arr || !arr.length) return "";
    if (arr.length === 1) return arr[0];
    let seen = Array.isArray(mem[pool]) ? mem[pool].filter(i => i < arr.length) : [];
    let free = [];
    for (let i = 0; i < arr.length; i++) if (!seen.includes(i)) free.push(i);
    if (!free.length) {
      const last = seen[seen.length - 1];
      seen = last === undefined ? [] : [last];
      for (let i = 0; i < arr.length; i++) if (i !== last) free.push(i);
    }
    const i = free[rnd(free.length)];
    seen.push(i);
    mem[pool] = seen;
    save();
    return arr[i];
  }

  /* {A} {kB} … durch Werte ersetzen */
  const fill = (t, v) => String(t).replace(/\{(\w+)\}/g, (_, k) => (v && v[k] != null ? v[k] : ""));
  const P = (pool, arr, v) => fill(pick(pool, arr), v);

  /* Textbausteine liegen in deutung-texte.js */
  const { KW, CORE1, CORE2, ADV, MANTRA, MAJ_N, ELT, PR, RANKS, ASC, DESC, COURT, REV, BRIDGE, LENS, TEND, FRQ, HINT, UNSURE, H_MAIN, H_WORK, H_TASK, ST_B, ST_C, ST_Q, MAJX, ELX, PP, PN, QQ, SG, WD, PLANET, NUMSEN, FORMEN, OPEN, PLFLAVOR, UNIQ, LETTER_OPEN, LETTER_BODY, LETTER_END, RIDDLE, RIDDLE_T, RITUAL, RITUAL_T, LOOK, LOOK_T, PROPH, PROPH_T, COLOR, COLOR_TXT, COLOR_T, HIDDEN, HIDDEN_IN, HIDDEN_T, FUNKE, MOON_N, MOON_D, HINT2, UNIQ2, PLT } = DeutungTexte;
  /* ------------------------------------------------------------------ Hilfen */
  function moonInfo(d) {
    const syn = 29.530588853, ref = Date.UTC(2000, 0, 6, 18, 14);
    const age = (((d.getTime() - ref) / 86400000) % syn + syn) % syn, ill = Math.round((1 - Math.cos(2 * Math.PI * age / syn)) / 2 * 100);
    const i = Math.floor((age / syn) * 8 + 0.5) % 8;
    return { mn: MOON_N[i] + " (" + ill + " % beleuchtet)", md: MOON_D[i] + " (" + ill + " % beleuchtet)" };
  }
  const part = h => h < 4 ? "mitten in der Nacht" : h < 7 ? "im ersten Morgenlicht" : h < 11 ? "am Vormittag" : h < 14 ? "um die Mittagszeit" : h < 18 ? "am Nachmittag" : h < 22 ? "am Abend" : "in der Nacht";
  const reduce = s => { while (s > 9 && s !== 11 && s !== 22) s = String(s).split("").reduce((a, c) => a + +c, 0); return s; };
  const elOfSet = M => { const m = M.find(x => !x.maj); return m ? m.el : 9; };

  /* Siegel: der staunende Schlussmoment */
  function siegel(M, ctx) {
    const { KC, esc, kw, v } = ctx, now = new Date(), N = KC.length;
    const nums = M.map(m => m.maj ? KC.findIndex(c => c[1] === m.n) : m.r + 1), sum = nums.reduce((a, b) => a + b, 0);
    const hIdx = sum % 22, hid = KC[hIdx], inSet = M.some(m => m.n === hid[1]);
    const e = elOfSet(M), el = e in RITUAL ? e : 9;
    const form = pick("form", FORMEN);
    const nrm = (N * (N - 1) * (N - 2) * 8).toLocaleString("de-DE");
    let j = 0;
    const L = (t, c) => `<p class="kl${c ? " " + c : ""}" style="--j:${j++}">${t}</p>`;
    let html = `<h3 id="ksgt" class="kl" style="--j:${j++}">✦ Das Siegel dieser Stunde ✦</h3>`;
    html += L(P("sg_open", OPEN, Object.assign({ t: part(now.getHours()), w: WD[now.getDay()], p: PLANET[now.getDay()] }, moonInfo(now))) + " " + pick("sg_pl" + now.getDay(), PLFLAVOR[now.getDay()]) + " " + pick("sg_plt", PLT), "kopen2");
    html += L(P("sg_uniq", UNIQ, { n: nrm }) + " " + pick("sg_uniq2", UNIQ2));
    const vv = Object.assign({}, v, { w: kw });
    const sect = (title, ...lines) => { html += `<h4 class="kl" style="--j:${j++}">${title}</h4>` + lines.map(x => L(x)).join(""); };
    if (form === "brief") {
      sect(P("sg_lt", ["Ein Brief von deinem Morgen", "Post aus der Zukunft", "Ein Brief aus dem Morgen"]),
        `<i>${P("sg_lo", LETTER_OPEN, vv)}</i> ${P("sg_lb", LETTER_BODY, vv)}`,
        `<i>${P("sg_le", LETTER_END, vv)}</i>`);
    } else if (form === "raetsel") {
      sect(P("sg_rt", RIDDLE_T), P("sg_r", RIDDLE, vv));
    } else if (form === "ritual") {
      sect(P("sg_rit", RITUAL_T), P("sg_rtx" + el, RITUAL[el], vv));
    } else if (form === "rueckblick") {
      sect(P("sg_lkt", LOOK_T), P("sg_lk", LOOK, vv));
    } else if (form === "prophezeiung") {
      const pr = pick("sg_pr", PROPH);
      sect(P("sg_pt", PROPH_T), ...pr.map(x => "<i>" + fill(x, vv) + "</i>"));
    } else if (form === "farbe") {
      sect(P("sg_ct", COLOR_T), P("sg_cx", COLOR_TXT, Object.assign({}, vv, { c: pick("sg_cc" + el, COLOR[el]) })));
    } else {
      const r = reduce(sum), hv = { s: sum + " (Quersumme " + r + ")", h: "„" + hid[1] + "“", k: "„" + hid[2].split(": ").pop() + "“" };
      sect(P("sg_ht", HIDDEN_T), pick("sg_nm" + r, NUMSEN[r] || NUMSEN[reduce(r)]), fill(pick(inSet ? "sg_hi" : "sg_h", inSet ? HIDDEN_IN : HIDDEN), hv));
    }
    html += L(pick("sg_funke", FUNKE), "kfunke");
    return `<section class="ksiegel" aria-labelledby="ksgt" data-n="${j}">${html}</section>`;
  }

  /* Reveal erst, wenn der Abschnitt im Blickfeld ist (Funkenwirbel zum Schluss) */
  function stage(el, spark) {
    if (!el) return;
    const total = (+el.dataset.n || 8) * 850 + 600;
    const go = () => {
      if (el.classList.contains("go")) return;
      el.classList.add("go");
      const f = el.querySelector(".kfunke");
      if (f && spark) setTimeout(() => { try { spark(f); } catch (e) {} }, total);
    };
    if (!("IntersectionObserver" in window)) { go(); return; }
    const io = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { io.disconnect(); go(); } }, { threshold: 0.35 });
    io.observe(el);
  }



  return {
    pick, fill, P, siegel, stage,
    KW, CORE1, CORE2, ADV, MANTRA, MAJ_N, ELT, PR, RANKS, ASC, DESC, COURT, REV, BRIDGE, LENS, TEND, FRQ,
    HINT, HINT2, UNSURE, H_MAIN, H_WORK, H_TASK, ST_B, ST_C, ST_Q,
    MAJX, ELX, PP, PN, QQ, SG
  };
})();
