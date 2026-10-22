/* Kartenreich · Magisches Angebot
   21-Tage-Transformation 59,90 € statt 89,90 €, gültig bis einschließlich 1. Dezember 2026 (Berliner Zeit).
   Ab dem 2. Dezember tut diese Datei nichts mehr: Die Seite zeigt automatisch wieder 89,90 €.

   WICHTIG: Der Preis an der Kasse kommt aus dem Ecwid-Shop. Dort den Angebotspreis ebenfalls
   bis 1. Dezember auf 59,90 € setzen und danach zurückstellen.

   Zum Testen: ?angebotAm=2026-12-02 in der Adresse simuliert ein anderes Datum. */
(function(){
"use strict";
var A={alt:"89,90 €",neu:"59,90 €",altZahl:"89.90",neuZahl:"59.90",ersparnis:"30 €",prozent:"33 %",
  ende:new Date("2026-12-01T23:59:59+01:00"),endeText:"1. Dezember",endeISO:"2026-12-01",
  shop:"https://lebensbegleiterin.company.site/products/bucher"};

var q=/[?&]angebotAm=([\d-]+)/.exec(location.search),jetzt=function(){return q?new Date(q[1]+"T12:00:00+01:00").getTime()+(Date.now()-T0):Date.now()},T0=Date.now();
if(jetzt()>A.ende.getTime())return;
var RM=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches);
document.documentElement.classList.add("ao-on");

function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function preis(cls){return '<span class="ao-pr '+(cls||"")+'"><s aria-label="statt '+A.alt+'">'+A.alt+'</s> <b>'+A.neu+'</b></span>'}

/* 1  Band ganz oben */
var wrap=document.querySelector(".wrap"),bar=document.querySelector(".wrap > .bar");
if(wrap){
  var rib=el("a","ao-rib",'<span class="ao-rib-k">✦ Magisches Angebot</span><span class="ao-rib-t">21-Tage-Transformation '+preis()+'</span><span class="ao-rib-d">nur bis '+A.endeText+'</span><span class="ao-rib-c">Jetzt Karten legen lernen →</span>');
  rib.href="#angebot";wrap.insertBefore(rib,bar||wrap.firstChild);
}

/* 2  Startbereich: zweiter Knopf nennt das Angebot */
var heroB=document.querySelector('.mx-hero .mx-cta a[href="#angebot"]');
if(heroB)heroB.innerHTML='✦ Angebot: <s>'+A.alt+'</s>&nbsp;'+A.neu;

/* 3  Angebotsbereich */
var sec=document.getElementById("angebot");
if(sec){
  sec.classList.add("ao-sec");
  var ey=sec.querySelector(".mx-ey"),h2=sec.querySelector("h2"),pr=sec.querySelector(".mx-price");
  if(ey)ey.innerHTML='<span class="ao-badge">✦ Magisches Angebot · nur bis '+A.endeText+' ✦</span>';
  if(h2)h2.innerHTML='Jetzt Karten legen lernen.';
  var klar=el("div","ao-klar",
    '<p class="ao-lead">Klartext: In 21 Tagen liest du deine Karten selbst. Mit deinem eigenen Deck, einer Übung pro Tag und deinem Tagebuch.</p>'+
    '<ul class="ao-facts"><li><b>21 Tage</b><span>Schritt für Schritt</span></li><li><b>78 Karten</b><span>eigens gemalt</span></li><li><b>71 Seiten</b><span>Arbeitsbuch</span></li><li><b>9</b><span>Legemethoden</span></li></ul>');
  if(h2)h2.parentNode.insertBefore(klar,h2.nextSibling);
  if(pr){
    pr.classList.add("ao-price");
    pr.innerHTML='<small class="ao-was">Regulär <s>'+A.alt+'</s></small><b>'+A.neu+'</b><em>Du sparst '+A.ersparnis+' · '+A.prozent+'</em><span>einmalig · kein Abo · 90 Tage Zugang</span>';
    var cd=el("div","ao-cd",'<p class="ao-cd-t">Das Angebot endet in</p><div class="ao-cd-n" role="timer" aria-live="off"><div><b data-u="d">0</b><small>Tage</small></div><div><b data-u="h">00</b><small>Std</small></div><div><b data-u="m">00</b><small>Min</small></div><div><b data-u="s">00</b><small>Sek</small></div></div><p class="ao-cd-f">Es endet am 1. Dezember um 24 Uhr. Danach kostet die Transformation wieder '+A.alt+'.</p>');
    pr.parentNode.insertBefore(cd,pr.nextSibling);
  }
  var buy=sec.querySelector('.mx-cta a.btn.lg');
  if(buy)buy.innerHTML='✦ Jetzt für '+A.neu+' Karten legen lernen';
  var small=sec.querySelector(".mx-small");
  if(small)small.innerHTML='Nach dem Kauf erhältst du deinen Zugangscode und trittst sofort in deinen Transformationsraum ein. Angebotspreis gültig bis einschließlich '+A.endeText+' 2026.';
}

/* 4  Kaufansicht und Kaufleiste */
var shpr=document.querySelector("#shd .shpr");
if(shpr)shpr.innerHTML='<span class="ao-badge sm">✦ Magisches Angebot · bis '+A.endeText+'</span><span class="ao-pr big"><s>'+A.alt+'</s> <b>'+A.neu+'</b></span><small>einmalig · kein Abo · du sparst '+A.ersparnis+'</small>';
var shbuy=document.querySelector("#shbuy span");
if(shbuy)shbuy.innerHTML=preis()+' · bis '+A.endeText;
var shgo=document.getElementById("shgo");if(shgo)shgo.textContent="✦ Jetzt für "+A.neu+" kaufen";

/* 5  Vorschau-Fenster (wird erst beim Öffnen gebaut) */
var pvd=document.getElementById("pvd");
function patchPv(){var b=pvd&&pvd.querySelector(".pvcta .pr b");if(b&&!b.dataset.ao){b.dataset.ao=1;b.innerHTML='<s class="ao-s">'+A.alt+'</s> '+A.neu;var sm=pvd.querySelector(".pvcta .pr small");if(sm)sm.textContent="einmalig · nur bis "+A.endeText}}
if(pvd&&window.MutationObserver)new MutationObserver(patchPv).observe(pvd,{childList:true,subtree:true});

/* 6  Schlussbereich */
var fin=document.querySelector(".mx-final");
if(fin){var fp=fin.querySelector("p");if(fp)fp.innerHTML='Nur bis '+A.endeText+': die ganze Transformation für <b>'+A.neu+'</b> statt <s>'+A.alt+'</s>.';
  var fa=fin.querySelector('a[href="#angebot"]');if(fa)fa.textContent="Angebot sichern · "+A.neu}

/* 7  Häufige Fragen und strukturierte Daten für Suchmaschinen */
[].forEach.call(document.querySelectorAll("#faq p"),function(p){if(p.textContent.indexOf("kostet einmalig "+A.alt)>-1)p.innerHTML=p.innerHTML.replace("kostet einmalig "+A.alt,"kostet einmalig "+A.alt+", im Angebot bis "+A.endeText+" nur "+A.neu)});
var ld=document.querySelector('script[type="application/ld+json"]');
if(ld)try{var j=JSON.parse(ld.textContent),hit=false;
  (j["@graph"]||[]).forEach(function(n){(n.offers||[]).forEach(function(o){if(o.price===A.altZahl){o.price=A.neuZahl;o.priceValidUntil=A.endeISO;hit=true}});
    if(n["@type"]==="FAQPage")(n.mainEntity||[]).forEach(function(m){var t=m.acceptedAnswer;if(t&&t.text)t.text=t.text.replace("kostet einmalig "+A.alt,"kostet einmalig "+A.alt+", im Angebot bis "+A.endeText+" nur "+A.neu)})});
  if(hit)ld.textContent=JSON.stringify(j)}catch(e){}

/* 8  Countdown (echtes Enddatum) */
var cds=[].slice.call(document.querySelectorAll(".ao-cd-n"));
function two(n){return(n<10?"0":"")+n}
function tick(){
  var ms=A.ende.getTime()-jetzt();
  if(ms<=0){location.reload();return}
  var s=Math.floor(ms/1000),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),x=s%60;
  cds.forEach(function(c){c.querySelector('[data-u="d"]').textContent=d;c.querySelector('[data-u="h"]').textContent=two(h);c.querySelector('[data-u="m"]').textContent=two(m);c.querySelector('[data-u="s"]').textContent=two(x);
    c.setAttribute("aria-label","Noch "+d+" Tage, "+h+" Stunden und "+m+" Minuten")});
}
if(cds.length){tick();setInterval(tick,1000)}
})();
