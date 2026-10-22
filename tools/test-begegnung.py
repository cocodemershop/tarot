"""Browser-Tests für „Erst selbst deuten“ (Playwright, Chromium).
Aufruf:  python3 tools/test-begegnung.py http://localhost:8766/tarot/
Die Seite muss unter einem Unterpfad laufen (wie auf GitHub Pages), z. B. mit
  mkdir -p /tmp/p && ln -s "$PWD" /tmp/p/tarot && (cd /tmp/p && python3 -m http.server 8766)
"""
import sys, asyncio, json, re
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8766/tarot/"
results = []
def ok(nr, name, cond, info=""):
    results.append((nr, name, bool(cond), info))
    print(("PASS" if cond else "FAIL"), f"{nr:>2}. {name}", ("· " + info) if info else "")

GATE = "try{localStorage.setItem('et21_gate',JSON.stringify({v:1,t:1}))}catch(e){}"

async def fresh(b, w=1280, h=800, gate=True):
    ctx = await b.new_context(viewport={"width": w, "height": h})
    if gate: await ctx.add_init_script(GATE)
    pg = await ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))
    pg.on("console", lambda m: errs.append("console: " + m.text) if m.type == "error" else None)
    pg.on("requestfailed", lambda r: errs.append("requestfailed: " + r.url))
    pg.on("response", lambda r: errs.append(f"http {r.status}: {r.url}") if r.status >= 400 else None)
    return ctx, pg, errs

async def ready(pg, url=None):
    await pg.goto(url or BASE)
    await pg.wait_for_timeout(500)
    await pg.keyboard.press("Escape")          # Opening überspringen
    await pg.wait_for_function("!document.getElementById('krIntro')", timeout=8000)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx, pg, errs = await fresh(b)
        await ready(pg)

        # 1 Start einer neuen Begegnung
        await pg.click("#bgStart")
        await pg.wait_for_selector("#bgd[open] .bg-fan")
        await pg.click('[data-act="draw"]')
        await pg.wait_for_selector(".bg-one .bg-fig img")
        h2 = await pg.text_content("#bgBody h2")
        ok(1, "Neue Begegnung starten", "Schau genau hin" in h2, h2)

        # 2 Vorhandene Karte korrekt angezeigt
        d = await pg.evaluate("JSON.parse(localStorage.getItem('kr_beg_entwurf'))")
        src = await pg.get_attribute(".bg-one .bg-fig img", "src")
        loaded = await pg.evaluate("(()=>{const i=document.querySelector('.bg-one .bg-fig img');return i.complete&&i.naturalWidth>0})()")
        await pg.wait_for_timeout(400)
        loaded = loaded or await pg.evaluate("document.querySelector('.bg-one .bg-fig img').naturalWidth>0")
        name = await pg.text_content(".bg-name")
        exp = await pg.evaluate(f"CARDS.find(c=>c.id==='{d['cid']}').name")
        ok(2, "Karte wird korrekt angezeigt", src == f"cards/{d['cid']}.webp" and loaded and name == exp, f"{d['cid']} · {name}")

        # 3 Traditionelle Deutung anfangs verborgen
        up = await pg.evaluate(f"CARDS.find(c=>c.id==='{d['cid']}').up")
        html1 = await pg.inner_html("#bgBody")
        await pg.click('[data-act="to2"]')
        html2 = await pg.inner_html("#bgBody")
        ok(3, "Deutung in Schritt 1 und 2 verborgen", up[:40] not in html1 and up[:40] not in html2)

        # 4 Eingaben bleiben erhalten
        await pg.fill("#bga1", "Ein helles Licht oben links")
        await pg.fill("#bga2", "Mut und Ruhe")
        await pg.click('[data-term="Mut"]')
        await pg.click('[data-act="hold"]')
        held = await pg.text_content("#bgheld")
        await pg.click('[data-act="to3"]')
        await pg.click('[data-act="back"]')
        v1 = await pg.input_value("#bga1"); v2 = await pg.input_value("#bga2")
        mut = await pg.get_attribute('[data-term="Mut"]', "aria-pressed")
        ok(4, "Eigene Eingaben bleiben erhalten", v1 == "Ein helles Licht oben links" and v2 == "Mut und Ruhe" and mut == "true" and "festgehalten" in held)

        # 6 Zurückgehen ohne Verlust (über Fortschrittsanzeige und Zurück-Knopf)
        await pg.click('#bgProg [data-go="1"]')
        await pg.click('[data-act="to2"]')
        v1b = await pg.input_value("#bga1")
        ok(6, "Zurückgehen ohne Eingabeverlust", v1b == "Ein helles Licht oben links")

        # 7 Richtige Deutung zur richtigen Karten-ID
        await pg.click('[data-act="to3"]')
        mean = await pg.inner_text(".bg-mean")
        rv = await pg.evaluate(f"CARDS.find(c=>c.id==='{d['cid']}').rv")
        ok(7, "Deutung gehört zur gezogenen Karte", up[:50] in mean and rv[:50] in mean and exp in mean, d["cid"])

        # 8 Speichern und wieder laden
        await pg.click('[data-act="to4"]')
        await pg.fill("#bgtk", "Ich nehme Ruhe mit.")
        await pg.fill("#bgnt", "Private Notiz 123")
        await pg.click('[data-act="to5"]')
        fin = await pg.inner_text("#bgBody")
        j = await pg.evaluate("JSON.parse(localStorage.getItem('kr_begegnungen'))")
        await pg.reload(); await pg.wait_for_timeout(400); await pg.keyboard.press("Escape")
        await pg.wait_for_function("!document.getElementById('krIntro')", timeout=8000)
        await pg.click("#bgJour")
        await pg.wait_for_selector(".bg-jl button")
        await pg.click(".bg-jl button")
        entry = await pg.inner_text("#bgBody")
        ok(8, "Eintrag gespeichert und nach Neuladen geöffnet",
           len(j) == 1 and j[0]["cid"] == d["cid"] and j[0]["name"] == exp and j[0]["t"] and "Private Notiz 123" in entry and "Ich nehme Ruhe mit." in fin and "Ein helles Licht" in entry)

        # 9 Löschen
        await pg.click(".bg-del")
        await pg.click("[data-delok]")
        j2 = await pg.evaluate("JSON.parse(localStorage.getItem('kr_begegnungen')||'[]')")
        empty = await pg.inner_text("#bgBody")
        ok(9, "Eintrag löschen (mit Bestätigung im Fenster)", len(j2) == 0 and "Noch keine Begegnungen" in empty)
        await pg.keyboard.press("Escape")

        # 15 Alle neuen Knöpfe tun, was sie ankündigen
        acts = {}
        await pg.click("#bgStart"); await pg.wait_for_selector(".bg-fan")
        await pg.click('[data-act="draw"]'); await pg.wait_for_selector(".bg-one")
        first = (await pg.evaluate("JSON.parse(localStorage.getItem('kr_beg_entwurf'))"))["cid"]
        await pg.click('[data-act="redraw"]'); await pg.wait_for_timeout(300)
        second = (await pg.evaluate("JSON.parse(localStorage.getItem('kr_beg_entwurf'))"))["cid"]
        acts["Andere Karte ziehen"] = first != second
        await pg.click('[data-act="to2"]'); await pg.click(".bg-lupe")
        acts["Lupe"] = await pg.evaluate("!!document.querySelector('.bg-lens')&&document.querySelector('.bg-lupe').getAttribute('aria-pressed')==='true'")
        await pg.click('[data-act="skip2"]'); await pg.click('[data-act="to4"]'); await pg.click('[data-act="to5"]')
        n_before = len(await pg.evaluate("JSON.parse(localStorage.getItem('kr_begegnungen'))"))
        acts["Abschluss speichert"] = n_before == 1
        await pg.click('[data-act="journal"]')
        acts["Meine Begegnungen ansehen"] = "Meine Begegnungen" in await pg.text_content("#bgBody h2")
        await pg.click('[data-act="next"]')
        acts["Nächste Karte entdecken"] = await pg.is_visible(".bg-fan")
        await pg.click(".bg-back >> nth=6"); await pg.wait_for_selector(".bg-one", timeout=3000)
        third = (await pg.evaluate("JSON.parse(localStorage.getItem('kr_beg_entwurf'))"))["cid"]
        acts["Keine doppelte Karte in der Sitzung"] = third not in (first, second)
        await pg.click('[data-act="to2"]'); await pg.click('[data-act="skip2"]')
        await pg.click('[data-act="to4"]'); await pg.click('[data-act="to5"]')
        await pg.click('[data-act="deck"]'); await pg.wait_for_timeout(900)
        acts["Weitere Karten kennenlernen"] = (not await pg.evaluate("document.getElementById('bgd').open")) and await pg.evaluate("Math.abs(document.getElementById('deck').getBoundingClientRect().top)<200")
        await pg.click("#bgJour"); await pg.click('[data-act="next"]')
        await pg.click('[data-act="draw"]'); await pg.wait_for_selector(".bg-one")
        await pg.click('[data-act="to2"]'); await pg.click('[data-act="skip2"]'); await pg.click('[data-act="to4"]'); await pg.click('[data-act="to5"]')
        await pg.click('[data-act="program"]'); await pg.wait_for_timeout(900)
        acts["Zum 21-Tage-Lernweg"] = await pg.evaluate("Math.abs(document.getElementById('angebot').getBoundingClientRect().top)<200")
        # Teilen: Teilen-Menü des Geräts simulieren
        await pg.evaluate("window.__sh=null;navigator.share=(d)=>{window.__sh=d;return Promise.resolve()};navigator.canShare=()=>false")
        await pg.click("#bgJour"); await pg.click(".bg-jl button")
        await pg.keyboard.press("Escape")
        await pg.click("#bgStart"); await pg.click('[data-act="draw"]'); await pg.wait_for_selector(".bg-one")
        await pg.click('[data-act="to2"]'); await pg.fill("#bga1", "GEHEIM-NOTIZ"); await pg.click('[data-act="skip2"]'); await pg.click('[data-act="to4"]')
        await pg.fill("#bgnt", "GEHEIM-NOTIZ-2"); await pg.click('[data-act="to5"]')
        await pg.click('[data-act="share"]'); await pg.wait_for_timeout(600)
        sh = await pg.evaluate("window.__sh")
        acts["Karte teilen (ohne Notizen)"] = bool(sh) and "#selbst-deuten" in (sh.get("url") or sh.get("text", "")) and "GEHEIM" not in json.dumps(sh)
        # Großansicht der Galerie → diese Karte selbst deuten
        await pg.keyboard.press("Escape")
        await pg.evaluate("document.getElementById('deck').scrollIntoView()"); await pg.wait_for_selector(".mx-card")
        await pg.click(".mx-card >> nth=2"); await pg.wait_for_selector("#mxl[open]")
        await pg.click(".bg-mxl"); await pg.wait_for_selector("#bgd[open] .bg-one")
        acts["Galerie: Diese Karte selbst deuten"] = (await pg.evaluate("JSON.parse(localStorage.getItem('kr_beg_entwurf')).cid")) == "g2"
        await pg.keyboard.press("Escape")
        # Mehr-Menü
        await pg.click("#tmo"); await pg.click("#tbg"); await pg.wait_for_timeout(300)
        acts["Mehr-Menü: Selbst deuten"] = await pg.evaluate("document.getElementById('bgd').open")
        await pg.keyboard.press("Escape")
        bad = [k for k, v in acts.items() if not v]
        ok(15, "Neue Schaltflächen führen ihre Aktion aus", not bad, ", ".join(bad) if bad else f"{len(acts)} geprüft")

        # 13 Bestehende Funktionen
        await pg.evaluate("openDk()"); await pg.wait_for_selector("#klg[open]")
        await pg.click("#klgo"); await pg.wait_for_timeout(1500)
        legung = await pg.evaluate("document.querySelectorAll('#klsp img, #klsp .kc, #klsp > *').length")
        await pg.keyboard.press("Escape")
        ok(13, "Bestehende Funktionen (3-Karten-Legung, Galerie, Menü) laufen", legung >= 3, f"{legung} Elemente in der Legung")

        # 14 Keine JavaScript-Fehler
        ok(14, "Keine JavaScript-Fehler oder fehlerhaften Pfade", not errs, "; ".join(errs[:5]))
        await ctx.close()

        # 5 Ersten Schritt überspringen  + 10 ohne Journal-Einträge
        ctx, pg, errs2 = await fresh(b)
        await ready(pg)
        await pg.click("#bgStart"); await pg.click('[data-act="draw"]'); await pg.wait_for_selector(".bg-one")
        await pg.click('[data-act="to2"]'); await pg.click('[data-act="skip2"]')
        s3 = await pg.text_content("#bgBody h2")
        ok(5, "Ersten Blick überspringen", "Bedeutung" in s3)
        await pg.keyboard.press("Escape")
        await pg.evaluate("localStorage.removeItem('kr_begegnungen');localStorage.removeItem('kr_beg_entwurf')")
        await pg.reload(); await pg.wait_for_timeout(300); await pg.keyboard.press("Escape")
        await pg.wait_for_function("!document.getElementById('krIntro')", timeout=8000)
        hidden = await pg.evaluate("document.getElementById('bgJour').hidden")
        await pg.evaluate("openBg('journal')")
        t = await pg.inner_text("#bgBody")
        ok(10, "Funktioniert ohne Journal-Einträge", hidden and "Noch keine Begegnungen" in t and not errs2, "; ".join(errs2[:3]))
        await ctx.close()

        # 11 Schmales Smartphone (320 px)
        ctx, pg, errs3 = await fresh(b, 320, 640)
        await ready(pg)
        await pg.evaluate("document.getElementById('selbst-deuten').scrollIntoView()")
        await pg.click("#bgStart"); await pg.click('[data-act="draw"]'); await pg.wait_for_selector(".bg-one")
        await pg.click('[data-act="to2"]')
        over = await pg.evaluate("""(()=>{const d=document.getElementById('bgd');const r=[];d.querySelectorAll('button,textarea,img').forEach(e=>{const b=e.getBoundingClientRect();if(b.width&&(b.right>innerWidth+1||b.left<-1))r.push(e.className||e.tagName)});return {r, sw:d.scrollWidth>d.clientWidth+1}})()""")
        small = await pg.evaluate("[...document.querySelectorAll('#bgd button:not(.bg-link)')].filter(b=>b.offsetParent&&b.getBoundingClientRect().height<36).map(b=>b.textContent.trim()).slice(0,5)")
        await pg.fill("#bga1", "klein"); await pg.click('[data-act="hold"]'); await pg.click('[data-act="to3"]'); await pg.click('[data-act="to4"]'); await pg.click('[data-act="to5"]')
        fin = await pg.is_visible('[data-act="next"]')
        ok(11, "Schmales Smartphone (320 px)", not over["r"] and not over["sw"] and fin and not errs3, f"überstehend: {over}, kleine Knöpfe: {small}")
        await ctx.close()

        # 12 Direkte Navigation auf GitHub-Pages-Adresse (Unterpfad + Direktlink)
        ctx, pg, errs4 = await fresh(b)
        await pg.goto(BASE + "#begegnung")
        await pg.wait_for_timeout(500); await pg.keyboard.press("Escape")
        await pg.wait_for_selector("#bgd[open]", timeout=8000)
        bad = [e for e in errs4 if "404" in e or "requestfailed" in e]
        ok(12, "Direktaufruf unter /tarot/#begegnung", not bad and await pg.is_visible(".bg-fan"), "; ".join(bad[:3]))
        await ctx.close()

        # Tastatur + reduzierte Bewegung (Zusatz)
        ctx = await b.new_context(viewport={"width": 1280, "height": 800}, reduced_motion="reduce")
        await ctx.add_init_script(GATE)
        pg = await ctx.new_page(); await pg.goto(BASE); await pg.wait_for_function("!document.getElementById('krIntro')", timeout=8000)
        await pg.focus("#bgStart"); await pg.keyboard.press("Enter")
        await pg.wait_for_selector(".bg-fan")
        await pg.keyboard.press("Tab")
        f = await pg.evaluate("document.activeElement.className")
        await pg.keyboard.press("Enter"); await pg.wait_for_selector(".bg-one", timeout=3000)
        anim = await pg.evaluate("getComputedStyle(document.querySelector('.bg-fig .bg-zoom')).animationName")
        ok("+", "Tastatur & reduzierte Bewegung", "bg-back" in f and anim == "none", f"Fokus: {f}, Animation: {anim}")
        await ctx.close(); await b.close()

    failed = [r for r in results if not r[2]]
    print(f"\n{len(results)-len(failed)} von {len(results)} Prüfungen bestanden")
    sys.exit(1 if failed else 0)

asyncio.run(main())
