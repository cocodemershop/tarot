/* Sternenhimmel, Navigation, Fenster, Eingangstor, Anleitung */
/* ===== EINE GROSSARTIGE WEBSEITE: Sternenhimmel, Tor, Anleitung ===== */
(function(){
const rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
/* Sternenhimmel */
const cv=$("sky"),cx=cv.getContext("2d"),mcv=document.createElement("canvas");mcv.id="mwc";mcv.setAttribute("aria-hidden","true");document.body.prepend(mcv);
let W,H,DP=1,lf=0,LT=false,col="#e8b45a";const SH=[];
const ST=Array.from({length:90},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.3+.3,p:Math.random()*6.28,v:Math.random()*.0015+.0004}));
const lt=()=>document.documentElement.dataset.theme==="light";
/* Milchstraße: einmal vorgerendert, kostet danach keine Leistung */
function milky(){const g=mcv.getContext("2d");const md=Math.min(DP,1.5);mcv.width=W*md;mcv.height=H*md;g.setTransform(md,0,0,md,0,0);g.clearRect(0,0,W,H);LT=lt();const L=Math.hypot(W,H);g.save();g.translate(W*.5,H*.5);g.rotate(-.55);
for(let i=0;i<15;i++){const x=(i/14-.5)*L*1.05,R=L*(.13+Math.random()*.05),k=LT?[150,100,20,.05]:(i%2?[185,138,224,.085]:[120,160,235,.075]);g.save();g.translate(x,0);g.scale(1,.34);const r=g.createRadialGradient(0,0,0,0,0,R);r.addColorStop(0,`rgba(${k[0]},${k[1]},${k[2]},${k[3]})`);r.addColorStop(1,`rgba(${k[0]},${k[1]},${k[2]},0)`);g.fillStyle=r;g.fillRect(-R,-R,2*R,2*R);g.restore()}
for(let i=0;i<1100;i++){const v=(Math.random()+Math.random()+Math.random()-1.5)*L*.05,z=.4+Math.random()*.8;g.globalAlpha=.12+Math.random()*.4;g.fillStyle=LT?"#7a5518":(Math.random()<.2?"#ffd9a0":"#e6ecff");g.fillRect((Math.random()*2-1)*L*.55,v,z,z)}g.restore()}
function rs(){const w=cv.clientWidth||innerWidth,h=cv.clientHeight||innerHeight;if(w===W&&h===H)return;DP=Math.min(devicePixelRatio||1,innerWidth<900?1.5:2);W=w;H=h;cv.width=W*DP;cv.height=H*DP;col=getComputedStyle(document.documentElement).getPropertyValue("--g").trim()||col;milky()}
function dr(t){if(!rm&&t-lf<50){requestAnimationFrame(dr);return}lf=t;cx.setTransform(DP,0,0,DP,0,0);cx.clearRect(0,0,W,H);cx.fillStyle=col;
ST.forEach(a=>{cx.globalAlpha=.15+.5*Math.abs(Math.sin(t*a.v+a.p));cx.beginPath();cx.arc(a.x*W,a.y*H,a.r,0,6.283);cx.fill()});
if(!rm){if(SH.length<2&&Math.random()<.005){const d=Math.random()<.75?1:-1,an=.35+Math.random()*.5,sp=8+Math.random()*8;SH.push({x:d>0?Math.random()*W*.8:W*.2+Math.random()*W*.8,y:Math.random()*H*.45,vx:d*Math.cos(an)*sp,vy:Math.sin(an)*sp,len:60+Math.random()*90,l:0,max:35+Math.random()*30})}
const hc=LT?"148,100,15":"255,240,210";
for(let i=SH.length-1;i>=0;i--){const q=SH[i];q.l++;q.x+=q.vx;q.y+=q.vy;const k=Math.min(1,q.l/6)*(1-q.l/q.max);if(k<=0||q.x<-100||q.x>W+100||q.y>H+100){SH.splice(i,1);continue}
const n=Math.hypot(q.vx,q.vy),tx=q.x-q.vx/n*q.len,ty=q.y-q.vy/n*q.len,gr=cx.createLinearGradient(q.x,q.y,tx,ty);gr.addColorStop(0,`rgba(${hc},1)`);gr.addColorStop(1,`rgba(${hc},0)`);
cx.globalAlpha=k;cx.strokeStyle=gr;cx.lineWidth=1.6;cx.lineCap="round";cx.beginPath();cx.moveTo(q.x,q.y);cx.lineTo(tx,ty);cx.stroke();cx.fillStyle=`rgb(${hc})`;cx.beginPath();cx.arc(q.x,q.y,1.7,0,6.283);cx.fill();cx.fillStyle=col}}
cx.globalAlpha=1;if(!rm)requestAnimationFrame(dr)}
rs();addEventListener("resize",()=>{rs();if(rm)dr(0)});dr(0);
/* alle Rondelle auf einer Seite */

["lex","lgm","fam"].forEach(i=>{$(i).hidden=false});$("lex").classList.add("chap");
$("lex").querySelector("h2").textContent="Kartenlexikon";

const lazy=(id,fn)=>{const el=$(id);let d=false;const run=()=>{if(!d){d=true;fn()}};if("IntersectionObserver" in window){const o=new IntersectionObserver(e=>{if(e[0].isIntersecting){o.disconnect();run()}},{rootMargin:"900px 0px"});o.observe(el)}else run()};
lazy("lex",()=>build());lazy("lgm",()=>lgBuild());renderFam();
/* Navigation */
const T=[["home","Programm"],["lex","Kartenlexikon"]],nav=document.querySelector(".tabs");
nav.removeAttribute("role");nav.innerHTML=T.map((t,i)=>`<button data-t="${t[0]}" aria-current="${i===0}" aria-selected="${i===0}">${t[1]}</button>`).join("")+'<button id="tdk" data-o="dk" aria-haspopup="dialog" aria-selected="false"><span class="f">Kartenlegen</span><span class="s">Legen</span></button><button id="tsk" data-o="sk" aria-haspopup="dialog" aria-selected="false">✦ Sterne &amp; Geburtstage</button><button id="tmlg" data-o="lg" aria-haspopup="dialog" aria-selected="false"><span class="f">Legemethoden</span><span class="s">Legungen</span></button><button id="tmfk" data-o="fk" aria-haspopup="dialog" aria-selected="false">✦ Kartenkreis</button><button id="tpd" data-o="pd" aria-haspopup="dialog" aria-selected="false">✦ Arbeitsbuch</button><button id="ttr" data-o="tr" aria-haspopup="dialog" aria-selected="false">✦ Transformation</button><button class="gd" id="gg">✦ Anleitung</button>';
nav.onclick=e=>{const ob=e.target.closest("button[data-o]");if(ob){({dk:()=>window.openDk(),sk:()=>window.openSk(),lg:()=>window.openLg(),fk:()=>window.openFk(),pd:()=>window.openPd(),tr:()=>window.openTr()})[ob.dataset.o]();return}const b=e.target.closest("button[data-t]");if(!b)return;b.dataset.t==="home"?scrollTo({top:0,behavior:rm?"auto":"smooth"}):$(b.dataset.t).scrollIntoView({behavior:rm?"auto":"smooth",block:"start"})};
let ra,la="";addEventListener("scroll",()=>{cancelAnimationFrame(ra);ra=requestAnimationFrame(()=>{let a="home";T.forEach(t=>{const el=$(t[0]);if(el&&el.offsetParent!==null&&el.getBoundingClientRect().top<innerHeight*.4)a=t[0]});if(a!==la){la=a;nav.querySelectorAll("[data-t]").forEach(b=>{const on=b.dataset.t===a;b.setAttribute("aria-selected",on);if(on)nav.scrollTo({left:b.offsetLeft-(nav.clientWidth-b.offsetWidth)/2,behavior:"smooth"})})}})},{passive:true});
/* Fenster: Sterne & Geburtstage, Arbeitsbuch */
(function(){
[["skd","tsk","openSk","skx"],["lgd","tmlg","openLg","lgdx"],["fkd","tmfk","openFk","fkdx"],["pdd","tpd","openPd","pdx"]].forEach(a=>{
const dl=$(a[0]),bt=$(a[1]);if(!dl)return;
const mark=on=>{if(bt)bt.setAttribute("aria-selected",on)};
window[a[2]]=()=>{if(!dl.open)dl.showModal();mark(true)};
dl.addEventListener("close",()=>mark(false));
$(a[3]).onclick=()=>dl.close();
dl.addEventListener("click",e=>{if(e.target===dl)dl.close()})});
const po=$("pdo");if(po)po.onclick=()=>window.openPd();
})();
/* Tor: Rechte, 18+, Anleitung */
const K="et21_gate",gt=$("gate"),g=$("gs");let ok=ls.g(K,null),step=1,gi=0,only=false;
const G=[
["✦","Willkommen in deinem Kartenreich","21 Tage, 78 Karten, ein ruhiger Raum nur für dich. Du kannst nichts falsch machen.",["Kein Konto und keine Anmeldung nötig","Dein Fortschritt bleibt in deinem Browser","Alle Bereiche erreichst du über das Menü oben"]],
["☾","Kartenlegen","Die 3-Karten-Legung ist kostenlos: Gestern prägt dich, heute bewegt dich, morgen ruft dich.",["Thema wählen und eine Frage im Herzen halten","Drei Karten ziehen und einzeln aufdecken","Deutung lesen, teilen oder neu legen"]],
["✧","Die Transformation","Dein persönlicher Lernraum für 21 Tage mit allem, was du zum Üben brauchst.",["Programm: jeden Tag Aufgabe, Karte, drei Fragen und Tagebuch","Kartenlexikon mit allen 78 Karten und Arbeitsbuch zum Download","Kauf direkt auf dieser Seite, danach trittst du mit deinem Zugangscode ein"]],
["♪","Legemethoden und Klangraum","Neun Legungen führen dich vom ersten Ziehen bis zur großen Legung.",["Legemethoden, Lexikon und Transformation findest du im Menü","Sterne & Geburtstage, Kartenkreis und Arbeitsbuch stehen unter „Mehr“","Der goldene Knopf ♪ unten rechts startet sanfte Musik, nur wenn du es willst"]],
["❖","Wichtig zum Schluss","Tarot ist ein Spiegel für Nachdenken und Freude.",["Keine Vorhersage und kein Ersatz für ärztlichen, psychologischen, rechtlichen oder finanziellen Rat","Diese Anleitung findest du jederzeit unter „Mehr“ → „Anleitung“"]]];
function fin(){gt.classList.remove("show");document.documentElement.style.overflow="";if(!only){ok={v:1,t:Date.now()};ls.s(K,ok)}}
function show(){gt.classList.add("show");document.documentElement.style.overflow="hidden";gt.scrollTop=0;rd()}
function rd(){let h="";
if(step===1)h=`<div class="gmeta"><span>✦ KARTENREICH ✦</span><span>Schritt 1 von 2</span></div><div class="gbar" aria-hidden="true"><i style="width:50%"></i></div><h2 id="gt">Deine Rechte</h2><p class="ctr">Schön, dass du da bist. Damit du dich sicher fühlst, hier das Wichtigste in Ruhe.</p><ul class="rl"><li><b>Deine Daten:</b> Es gibt keine Konten. Fortschritt, Notizen und Familienkreis liegen nur im Speicher deines Browsers. Wir sehen sie nicht.</li><li><b>Keine fremden Dienste:</b> Schriften und Bilder kommen direkt von dieser Seite. Es werden keine Daten an Google oder andere Anbieter übertragen.</li><li><b>Deine Rechte nach DSGVO:</b> Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Widerruf. Wende dich dazu schriftlich an die im Impressum genannte Anschrift. Löschst du die Browserdaten, ist alles entfernt.</li><li><b>Urheberrecht:</b> © 2026 Michaela Schäfer. Alle Rechte vorbehalten. Die private Nutzung ist herzlich willkommen, Weitergabe oder Kopie nur mit Genehmigung.</li><li><b>Dauer:</b> Dein Zugang gilt drei Monate ab dem ersten Besuch. Danach schließt sich das Programm von selbst, und du kannst deine Daten vorher sichern.</li><li><b>Hinweis:</b> Tarot dient der Reflexion und Motivation. Es ersetzt keine ärztliche, psychologische, rechtliche oder finanzielle Beratung.</li></ul><div class="lk"><button class="lnk" data-l="datenschutz">Datenschutz lesen</button><button class="lnk" data-l="impressum">Impressum lesen</button></div><label class="chk"><input type="checkbox" id="gck"> Ich habe die Hinweise gelesen und bin einverstanden.</label><div class="row"><button class="btn" id="gn" disabled>Weiter</button></div>`;
else if(step===2)h=`<div class="gmeta"><span>✦ KARTENREICH ✦</span><span>Schritt 2 von 2</span></div><div class="gbar" aria-hidden="true"><i style="width:100%"></i></div><div class="gicon" aria-hidden="true">18</div><h2 id="gt">Bist du 18?</h2><p class="ctr">Diese Seite behandelt Themen wie Selbstreflexion, Beziehungen und Lebensfragen und richtet sich an Erwachsene. Bist du mindestens 18 Jahre alt?</p><div class="row"><button class="btn" id="gy">Ja, ich bin 18 oder älter</button><button class="btn o" id="gno">Nein, noch nicht</button></div>`;
else if(step===0)h=`<h2 id="gt">Danke für deine Ehrlichkeit</h2><p class="ctr">Diese Seite ist für Erwachsene. Wenn du 18 bist, bist du herzlich willkommen. Bis dahin: Sei lieb zu dir und sprich mit einem Menschen, dem du vertraust, wenn dich etwas beschäftigt.</p><div class="row"><button class="btn o" id="gbk">Zurück</button></div>`;
else{const q=G[gi],pc=Math.round((gi+1)/G.length*100);h=(only?'<button class="gx" id="gx" aria-label="Schließen">✕</button>':"")+`<div class="gmeta"><span>✦ KARTENREICH ✦</span><span>Anleitung · ${gi+1} von ${G.length}</span></div><div class="gbar" aria-hidden="true"><i style="width:${pc}%"></i></div><div class="gicon" aria-hidden="true">${q[0]}</div><h2 id="gt">${q[1]}</h2><p class="ctr glead">${q[2]}</p><ul class="gl">${q[3].map(x=>`<li>${x}</li>`).join("")}</ul><div class="row">${gi?'<button class="btn o" id="gp">Zurück</button>':""}<button class="btn" id="gn">${gi===G.length-1?(only?"Verstanden ✦":"Eintreten ✦"):"Weiter"}</button></div>`}
g.innerHTML=h;const f=g.querySelector("button:not([disabled]),input");f&&f.focus({preventScroll:true});
const c=$("gck");if(c)c.onchange=()=>$("gn").disabled=!c.checked;
const n=$("gn");if(n)n.onclick=()=>{if(step===1){step=2;rd()}else if(gi<G.length-1){gi++;rd();gt.scrollTop=0}else fin()};
if($("gy"))$("gy").onclick=()=>fin();if($("gno"))$("gno").onclick=()=>{step=0;rd()};if($("gbk"))$("gbk").onclick=()=>{step=2;rd()};
if($("gp"))$("gp").onclick=()=>{gi--;rd()};if($("gx"))$("gx").onclick=fin}
$("gg").onclick=()=>{only=true;step=3;gi=0;show()};
addEventListener("keydown",e=>{if(e.key==="Escape"&&only&&gt.classList.contains("show"))fin()});
if(!ok||ok.v!==1){only=false;step=1;show()}
})();
