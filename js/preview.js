/* Transformations-Vorschau: animiertes Subfenster mit fünf Szenen */
(function(){
const SHOP="https://lebensbegleiterin.company.site/products/bucher";
const dl=document.getElementById("pvd");if(!dl)return;
const rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
const DUR=6500;
const dots=n=>Array.from({length:n},(_,i)=>i);
const cards=[["0","Der Narr","✦"],["II","Die Hohepriesterin","☾"],["III","Die Herrscherin","♀"],["XVII","Der Stern","★"],["XIX","Die Sonne","☀"]];
const S=[
{t:"Dein 21-Tage-Weg",x:"Jeden Tag eine Aufgabe, ein Kartenbeispiel, drei Fragen und Platz fürs Tagebuch. Woche für Woche öffnet sich ein neuer Abschnitt.",
 h:`<div class="pvph"><span class="a">Tag 1–7 · Ich sehe</span><span class="b">Tag 8–14 · Ich verstehe</span><span class="c">Tag 15–21 · Ich entscheide</span></div><div class="pvdays">${dots(21).map(i=>`<i style="--i:${i}" class="${i<7?"a":i<14?"b":"c"}">${i+1}</i>`).join("")}</div>`},
{t:"78 Karten kennenlernen",x:"Das Kartenlexikon führt dich durch alle Karten. Du schaust zuerst hin und hältst fest, was sie in dir berührt.",
 h:`<div class="pvfan">${cards.map((c,i)=>`<div class="pvc" style="--i:${i};--r:${(i-2)*9}deg;--y:${Math.abs(i-2)*10}px"><div class="in"><span class="bk">✦</span><span class="fr"><small>${c[0]}</small><b>${c[3]||c[2]}</b><em>${c[1]}</em></span></div></div>`).join("")}</div>`},
{t:"Täglich üben, eigene Deutung",x:"Dein Tagebuch begleitet dich: Du deutest mit eigenen Worten, die Karten liefern nur die Bilder.",
 h:`<div class="pvjr"><div class="hd2"><b>Tag 3 · Die Herrscherin</b><span>Aufgabe: Schau 3 Minuten hin</span></div><p class="q">Was fällt dir zuerst auf?</p><p class="ty" data-t="Die Farben sind warm. Ich spüre Fürsorge, und ich frage mich, wo ich heute für mich selbst sorge."></p><div class="ln"></div><div class="ln s"></div></div>`},
{t:"9 Legemethoden",x:"Vom ersten Ziehen bis zum Keltischen Kreuz: Schritt für Schritt lernst du, Karten in Zusammenhang zu lesen.",
 h:`<svg class="pvsp" viewBox="0 0 300 200" role="img" aria-label="Keltisches Kreuz"><g>${[[110,100,0],[110,100,90],[110,150,1],[110,50,2],[60,100,3],[160,100,4],[230,160,5],[230,120,6],[230,80,7],[230,40,8]].map((p,i)=>`<g class="c" style="--i:${i}" transform="translate(${p[0]} ${p[1]})${i==1?" rotate(90)":""}"><rect x="-17" y="-25" width="34" height="50" rx="4"/><text y="5" text-anchor="middle">${i==1?"":i+1}</text></g>`).join("")}</g></svg>`},
{t:"Am Ende liest du selbst",x:"Nach 21 Tagen hast du ein Gefühl für deine Karten, deine eigenen Deutungen und deinen Weg. Du entscheidest.",
 h:`<div class="pvend"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="t"/><circle cx="60" cy="60" r="52" class="p"/></svg><div class="mid"><b>21</b><span>von 21 Tagen</span></div></div><ul class="pvck"><li>21-Tage-Programm</li><li>78-Karten-Lexikon</li><li>Arbeitsbuch &amp; Journal</li><li>Kartenkreis &amp; Orakel</li></ul>`}
];
// feste Kartenzeichen
cards.forEach(c=>c[3]=c[2]);
dl.innerHTML=`<div class="dkw"><div class="dkh"><h3>✦ Transformations-Vorschau</h3><button class="btn o" id="pvx" type="button" aria-label="Fenster schließen">✕</button></div>
<div class="pvstage" aria-live="off">${S.map((s,i)=>`<section class="pvs" data-i="${i}" aria-hidden="true">${s.h}</section>`).join("")}</div>
<div class="pvcap"><h4 id="pvt"></h4><p id="pvp"></p></div>
<div class="pvprog" aria-hidden="true"><i id="pvbar"></i></div>
<div class="pvnav"><button class="btn o" id="pvpv" type="button" aria-label="Zurück">‹</button><div class="pvdt" id="pvdt">${S.map((_,i)=>`<button type="button" data-g="${i}" aria-label="Szene ${i+1}"></button>`).join("")}</div><button class="btn o" id="pvpl" type="button" aria-label="Pause">❚❚</button><button class="btn o" id="pvnx" type="button" aria-label="Weiter">›</button></div>
<div class="pvcta"><div class="pr"><b>89,90 €</b><small>einmalig · kein Abo</small></div><a class="btn lg" href="${SHOP}" target="_blank" rel="noopener">✦ Jetzt kaufen</a></div>
<p class="pvn">Tarot dient der Reflexion und ersetzt keine medizinische, rechtliche oder finanzielle Beratung.</p></div>`;
const $=id=>document.getElementById(id),sc=[...dl.querySelectorAll(".pvs")],dt=[...$("pvdt").children];
let cur=-1,tm=0,playing=!rm,tw=0;
function type(el){clearInterval(tw);const t=el.dataset.t;if(rm){el.textContent=t;return}el.textContent="";let i=0;tw=setInterval(()=>{el.textContent=t.slice(0,++i);if(i>=t.length)clearInterval(tw)},38)}
function go(i){i=(i+S.length)%S.length;if(i===cur)return;cur=i;dl.scrollTop=0;
 sc.forEach((s,k)=>{s.classList.toggle("on",k===i);s.setAttribute("aria-hidden",k!==i)});
 dt.forEach((d,k)=>d.classList.toggle("on",k===i));
 $("pvt").textContent=S[i].t;$("pvp").textContent=S[i].x;
 const ty=sc[i].querySelector(".ty");if(ty)type(ty);
 const b=$("pvbar");b.style.animation="none";void b.offsetWidth;if(playing)b.style.animation="pvb "+DUR+"ms linear forwards";else b.style.width="0";
 clearTimeout(tm);if(playing)tm=setTimeout(()=>go(cur+1),DUR)}
function setPlay(p){playing=p;$("pvpl").textContent=p?"❚❚":"▶";$("pvpl").setAttribute("aria-label",p?"Pause":"Abspielen");if(p){const c=cur;cur=-1;go(c<0?0:c)}else{clearTimeout(tm);$("pvbar").style.animation="none";$("pvbar").style.width="0"}}
$("pvpv").onclick=()=>go(cur-1);$("pvnx").onclick=()=>go(cur+1);$("pvpl").onclick=()=>setPlay(!playing);
$("pvdt").onclick=e=>{const b=e.target.closest("button[data-g]");if(b)go(+b.dataset.g)};
$("pvx").onclick=()=>dl.close();dl.addEventListener("click",e=>{if(e.target===dl)dl.close()});
dl.addEventListener("keydown",e=>{if(e.key==="ArrowRight")go(cur+1);if(e.key==="ArrowLeft")go(cur-1)});
dl.addEventListener("close",()=>{clearTimeout(tm);clearInterval(tw)});
window.openPv=()=>{document.querySelectorAll("dialog[open]").forEach(d=>d.close());dl.showModal();cur=-1;playing=!rm;$("pvpl").textContent=playing?"❚❚":"▶";go(0)};
})();
