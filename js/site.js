/* Sternenhimmel, Navigation, Fenster, Eingangstor, Anleitung */
/* ===== EINE GROSSARTIGE WEBSEITE: Sternenhimmel, Tor, Anleitung ===== */
(function(){
const rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
/* Sternenhimmel */
const cv=$("sky"),cx=cv.getContext("2d"),mcv=document.createElement("canvas");mcv.id="mwc";mcv.style.cssText="opacity:0;transition:opacity 2s ease";mcv.setAttribute("aria-hidden","true");document.body.prepend(mcv);
let W,H,DP=1,lf=0,LT=false,col="#e8b45a";const SH=[];
const ST=Array.from({length:90},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.3+.3,p:Math.random()*6.28,v:Math.random()*.0015+.0004}));
const lt=()=>document.documentElement.dataset.theme==="light";
/* Milchstraße: prozedural, einmal vorgerendert (Rauschfelder, Staubbänder, Kernwulst, Sternwolken, Einzelsterne), kostet danach keine Leistung */
let mwT=0,mwFirst=true;
function milky(){clearTimeout(mwT);if(mwFirst){mwFirst=false;(window.requestIdleCallback||(f=>setTimeout(f,30)))(mwDraw)}else mwT=setTimeout(mwDraw,160)}
/* Zeichnen geschieht in einem Hintergrund-Thread (Web Worker), damit die Seite beim Start nicht stockt */
function MWPAINT(mcv,W,H,DP,light){
let sd=20260719;const rnd=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
/* Wertrauschen + fbm */
const PT=new Float32Array(256*256);for(let i=0;i<PT.length;i++)PT[i]=rnd();
const sm=t=>t*t*(3-2*t),q2=x=>x*x;
function vn(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=sm(x-xi),yf=sm(y-yi),a=xi&255,b=yi&255,c=(xi+1)&255,d=(yi+1)&255;
const p=PT[a+(b<<8)],q=PT[c+(b<<8)],r=PT[a+(d<<8)],s=PT[c+(d<<8)];return p+(q-p)*xf+(r-p)*yf+(p-q-r+s)*xf*yf}
function fbm(x,y,o){let s=0,a=.5,f=1,n=0;for(let i=0;i<o;i++){s+=a*vn(x*f,y*f);n+=a;a*=.5;f*=2.03;x+=17.3;y+=9.1}return s/n}
const ss=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
const L=Math.hypot(W,H),ang=-.55,ca=Math.cos(ang),sa=Math.sin(ang);
const sc=Math.max(2,Math.round(Math.max(W,H)/420)),lw=Math.ceil(W/sc),lh=Math.ceil(H/sc);
const img=new ImageData(lw,lh),D=img.data,I=new Float32Array(lw*lh);
const CU=.10;/* Lage des Kerns entlang des Bandes */
for(let j=0;j<lh;j++)for(let i=0;i<lw;i++){
const x=((i+.5)*sc-W/2)/L,y=((j+.5)*sc-H/2)/L,u=x*ca+y*sa,v=-x*sa+y*ca;
const vc=.05*(fbm(u*2.2+4,3.1,3)-.5)+.012*Math.sin(u*6.5);/* leicht geschwungene Mittellinie */
const w=.075+.05*Math.exp(-q2((u-CU)/.3));/* breiter am Kern */
const dv=v-vc;
const halo=Math.exp(-q2(dv/(w*2.3)))*.28,body=Math.exp(-q2(dv/w)),narrow=Math.exp(-q2(dv/(w*.42)));
const cl=fbm(u*5.2+1.7,v*9+8.4,5),cl2=fbm(u*13+2,v*19+5,4);
const gr3=fbm(u*46+5,v*74+2,3);
let star=(halo+body*(.34+1.05*Math.pow(cl,1.6))+narrow*.35*cl2)*(.62+.8*gr3);
/* Staubbänder (Große Spalte) */
const lane=Math.exp(-q2((dv-.012*Math.sin(u*9)-.006)/(w*.34)));
const rg=1-Math.abs(2*fbm(u*8+3,v*16+1,5)-1);
const patch=ss(.52,.82,fbm(u*6+11,v*10+2,4));
let dust=Math.min(1,lane*ss(.38,.78,rg)*.95+body*patch*.55);
/* Kernwulst */
const bu=Math.exp(-(q2((u-CU)/.17)+q2(dv/.052)));
star+=bu*.62*(.6+.6*cl2)*(.7+.6*gr3);
let it=star*(1-dust*.88);
it=Math.max(0,it);
/* Farbe: außen kühl blauweiß, zum Kern warmgolden, dazu rosa H-II-Wolken */
const wm=Math.min(1,bu*1.5+.1+.25*Math.exp(-q2((u-CU)/.35))*body);
let R=150+(255-150)*wm,G=174+(212-174)*wm,B=232+(158-232)*wm;
const ne=ss(.66,.84,fbm(u*24+9,v*26-4,4))*body*.2;
R+=(235-R)*ne;G+=(96-G)*ne;B+=(150-B)*ne;
/* staubverfärbt: rötlich-braun in den Bändern */
const dd=dust*.6;R+=(120-R)*dd*.3;G+=(70-G)*dd*.4;B+=(40-B)*dd*.5;
it=Math.pow(it,1.18);let al=light?Math.min(1,it*.2):Math.min(.6,it*.44);
if(light){R=150;G=100;B=20}
const k=(j*lw+i)*4;D[k]=R;D[k+1]=G;D[k+2]=B;D[k+3]=Math.max(0,Math.min(255,al*255+(rnd()-.5)*1.6));I[j*lw+i]=it}
const off=(typeof OffscreenCanvas!=="undefined"?new OffscreenCanvas(lw,lh):document.createElement("canvas"));off.width=lw;off.height=lh;off.getContext("2d").putImageData(img,0,0);
const md=Math.min(DP,1.5);mcv.width=W*md;mcv.height=H*md;const g=mcv.getContext("2d");g.setTransform(md,0,0,md,0,0);g.clearRect(0,0,W,H);
g.imageSmoothingEnabled=true;g.imageSmoothingQuality="high";g.drawImage(off,0,0,lw*sc,lh*sc);
const dens=(px,py)=>I[Math.min(lh-1,Math.floor(py/sc))*lw+Math.min(lw-1,Math.floor(px/sc))];
/* unaufgelöster Sternenstaub */
const area=W*H,nF=Math.min(40000,Math.round(area/24));
for(let n=0;n<nF;n++){const px=rnd()*W,py=rnd()*H,d=dens(px,py);if(rnd()>d*1.7)continue;
g.globalAlpha=(.08+rnd()*.34)*(light?.7:1);g.fillStyle=light?"#7a5518":(rnd()<.18?"#ffd9a8":"#dfe8ff");const z=.5+rnd()*.5;g.fillRect(px,py,z,z)}
/* Einzelsterne mit Größenklassen, dichter im Band */
const nS=Math.min(6000,Math.round(area/260)),SC=light?["#7a5518","#8a6220"]:["#ffffff","#dfe9ff","#bcd2ff","#fff1d0","#ffd9a0","#ffb98a"];
const big=[];
for(let n=0;n<nS;n++){const px=rnd()*W,py=rnd()*H,d=dens(px,py);if(rnd()>.1+d*1.1)continue;
const m=Math.pow(rnd(),5.5),r=.35+m*1.45,a=Math.min(1,.28+m*.9),c=SC[Math.floor(rnd()*rnd()*SC.length*1.2)%SC.length];
g.globalAlpha=a;g.fillStyle=c;if(r<.8)g.fillRect(px-r/2,py-r/2,r,r);else{g.beginPath();g.arc(px,py,r*.7,0,6.283);g.fill()}
if(m>.38)big.push([px,py,r,c])}
/* sanfte Strahlenkränze der hellsten Sterne */
if(!light)for(const[b,c,r,col2]of big.slice(0,70)){const gr=g.createRadialGradient(b,c,0,b,c,r*7);gr.addColorStop(0,col2+"99");gr.addColorStop(.25,col2+"33");gr.addColorStop(1,col2+"00");g.globalAlpha=.55;g.fillStyle=gr;g.fillRect(b-r*7,c-r*7,r*14,r*14)}
/* Leseschutz: im Textbereich weich abdunkeln, an den Rändern bleibt die Milchstraße voll sichtbar */
{const cw=Math.min(W,940),fe=Math.min(240,cw*.4),x0=(W-cw)/2;g.save();g.globalAlpha=1;g.globalCompositeOperation="destination-out";
if(W<=700){g.fillStyle="rgba(0,0,0,.82)";g.fillRect(0,0,W,H)}
else{const gr=g.createLinearGradient(x0-fe,0,x0+cw+fe,0),f=fe/(cw+2*fe);gr.addColorStop(0,"rgba(0,0,0,0)");gr.addColorStop(f,"rgba(0,0,0,.8)");gr.addColorStop(1-f,"rgba(0,0,0,.8)");gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(0,0,W,H)}
g.restore()}
g.globalAlpha=1;
}
let mwW=null;
function mwDraw(){const light=lt();LT=light;
if(mwW===null){mwW=false;try{if(mcv.transferControlToOffscreen&&window.Worker&&window.OffscreenCanvas){const src="const MW="+MWPAINT+";let c;onmessage=e=>{const d=e.data;if(d.c)c=d.c;MW(c,d.W,d.H,d.DP,d.light);postMessage(1)}",u=URL.createObjectURL(new Blob([src],{type:"text/javascript"})),w=new Worker(u),oc=mcv.transferControlToOffscreen();w.onmessage=()=>{mcv.style.opacity="1"};w.onerror=e=>console.error("Milchstraße",e.message);w.postMessage({c:oc,W,H,DP,light},[oc]);mwW=w;return}}catch(e){console.error(e)}}
if(mwW){mwW.postMessage({W,H,DP,light});return}
MWPAINT(mcv,W,H,DP,light);mcv.style.opacity="1"}
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
if(step===1)h=`<div class="gmeta"><span>✦ KARTENREICH ✦</span><span>Schritt 1 von 2</span></div><div class="gbar" aria-hidden="true"><i style="width:50%"></i></div><h2 id="gt">Deine Rechte</h2><p class="ctr">Schön, dass du da bist. Damit du dich sicher fühlst, hier das Wichtigste in Ruhe.</p><ul class="rl"><li><b>Deine Daten:</b> Es gibt keine Konten. Fortschritt, Notizen und Kartenkreis liegen nur im Speicher deines Browsers. Wir sehen sie nicht.</li><li><b>Keine fremden Dienste:</b> Schriften und Bilder kommen direkt von dieser Seite. Es werden keine Daten an Google oder andere Anbieter übertragen.</li><li><b>Deine Rechte nach DSGVO:</b> Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Widerruf. Wende dich dazu schriftlich an die im Impressum genannte Anschrift. Löschst du die Browserdaten, ist alles entfernt.</li><li><b>Urheberrecht:</b> © 2026 Michaela Schäfer. Alle Rechte vorbehalten. Die private Nutzung ist herzlich willkommen, Weitergabe oder Kopie nur mit Genehmigung.</li><li><b>Dauer:</b> Die 3-Karten-Legung ist kostenlos. Die Transformation gilt 90 Tage ab dem ersten Eintreten mit deinem Zugangscode. Danach schließt sie sich von selbst, und du kannst deine Daten vorher sichern.</li><li><b>Hinweis:</b> Tarot dient der Reflexion und Motivation. Es ersetzt keine ärztliche, psychologische, rechtliche oder finanzielle Beratung.</li></ul><div class="lk"><button class="lnk" data-l="datenschutz">Datenschutz lesen</button><button class="lnk" data-l="impressum">Impressum lesen</button></div><label class="chk"><input type="checkbox" id="gck"> Ich habe die Hinweise gelesen und bin einverstanden.</label><div class="row"><button class="btn" id="gn" disabled>Weiter</button></div>`;
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
