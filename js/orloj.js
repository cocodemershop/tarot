/* Prager Orloj: Sonne, Mond, Tierkreis live */
/* ===== PRAGER ORLOJ: Sonne, Mond, Tierkreis live ===== */
(function(){
const NS="http://www.w3.org/2000/svg",sv=document.getElementById("orl");if(!sv)return;
const rmo=matchMedia("(prefers-reduced-motion: reduce)").matches,RAD=Math.PI/180,GD="#e8b45a",CR="#f3e6c8",FN='"Bodoni Moda",Georgia,serif',SYM='"Segoe UI Symbol","Noto Sans Symbols 2","Apple Symbols",serif';
function el(t,a,p){const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);(p||sv).appendChild(n);return n}
function arch(c){return`M${c-13},-112V-134a13,13 0 0 1 26,0V-112Z`}
const df=el("defs",{});
df.innerHTML=`<radialGradient id="ogS"><stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#e8b45a"/></radialGradient>
<linearGradient id="ogG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7d98a"/><stop offset=".5" stop-color="#b8821f"/><stop offset="1" stop-color="#f2cf7c"/></linearGradient>
<linearGradient id="ogK" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f7fd6"/><stop offset="1" stop-color="#173b7a"/></linearGradient>
<linearGradient id="ogN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151b30"/><stop offset="1" stop-color="#090b15"/></linearGradient>
<clipPath id="ogD"><circle r="74"/></clipPath>
<clipPath id="ogW"><path d="${arch(-22)}"/><path d="${arch(22)}"/></clipPath>`;
df.insertAdjacentHTML("beforeend",`<radialGradient id="ogM" cx=".38" cy=".33" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>`);
/* 21-Tage-Scheibe */
const cgC=el("g",{transform:"translate(0,150)"});
el("circle",{r:41,fill:"#0a0710",stroke:"url(#ogG)","stroke-width":2.2},cgC);
const cal=el("g",{},cgC),WC=["#27467a","#3c7a4a","#8a3a2a"],dsg=[],pt=(r,a)=>`${r*Math.sin(a)},${-r*Math.cos(a)}`;
for(let i=0;i<21;i++){const a0=i/21*2*Math.PI,a1=(i+1)/21*2*Math.PI;
 dsg.push(el("path",{d:`M${pt(38,a0)}A38,38 0 0 1 ${pt(38,a1)}L${pt(26,a1)}A26,26 0 0 0 ${pt(26,a0)}Z`,fill:WC[Math.floor(i/7)],stroke:GD,"stroke-width":.35},cal));
 const g=el("g",{transform:`rotate(${(a0+a1)/2/RAD})`},cal);el("text",{y:-32,"text-anchor":"middle","dominant-baseline":"central","font-size":4.4,"font-weight":700,fill:CR,"font-family":FN},g).textContent=i+1}
el("circle",{r:26,fill:"#10264f",stroke:GD,"stroke-width":.7},cgC);
const cdt=el("text",{y:15,"text-anchor":"middle","font-size":5,"font-weight":700,fill:CR,"font-family":FN},cgC);
el("path",{d:"M-3,102.5L3,102.5L0,109.5Z",fill:GD,stroke:"#7a5212","stroke-width":.4});
/* Turm mit Fenstern */
const ws=[-22,22].map(c=>el("path",{d:arch(c),fill:"#0d0a16",stroke:GD,"stroke-width":.9}));
const fg=[];const wg=el("g",{"clip-path":"url(#ogW)"});
for(let i=0;i<12;i++){const g=el("g",{opacity:0},wg);el("circle",{cy:-5.6,r:2.1,fill:GD},g);el("path",{d:"M-3.3,4L-2.5,-2.8Q0,-3.8 2.5,-2.8L3.3,4Z",fill:GD},g);fg.push(g)}
const sht=[-22,22].map(c=>el("path",{d:arch(c),fill:"#4a3a2a",stroke:GD,"stroke-width":.9,class:"sh"}));
/* Ringe */
el("circle",{r:98,fill:"#0a0710",stroke:"url(#ogG)","stroke-width":3.2});
el("circle",{r:100.6,fill:"none",stroke:GD,"stroke-width":1.6,"stroke-dasharray":"1.6 2.4",opacity:.85});
el("circle",{r:89,fill:"none",stroke:"#0c0912","stroke-width":11});
el("circle",{r:94.2,fill:"none",stroke:GD,"stroke-width":.5});
el("circle",{r:83.8,fill:"none",stroke:GD,"stroke-width":.5});
el("circle",{r:79,fill:"none",stroke:"#15274f","stroke-width":9});
for(let k=0;k<48;k++){const a=k*7.5*RAD;el("circle",{cx:96.6*Math.sin(a),cy:-96.6*Math.cos(a),r:.65,fill:"#f7d98a"})}
/* Zifferblatt: Tag, Dämmerung, Nacht */
const dl=el("g",{"clip-path":"url(#ogD)"});
el("rect",{x:-74,y:-74,width:148,height:74,fill:"url(#ogK)"},dl);
el("rect",{x:-74,y:0,width:148,height:74,fill:"url(#ogN)"},dl);
[[0,5,"#b5432f",.9],[5,6,"#6b2a35",.9],[11,7,"#2b1832",.9]].forEach(b=>el("rect",{x:-74,y:b[0],width:148,height:b[1],fill:b[2],opacity:b[3]},dl));
for(let k=0;k<24;k++){const a=k*15*RAD;el("line",{x1:34*Math.sin(a),y1:-34*Math.cos(a),x2:74*Math.sin(a),y2:-74*Math.cos(a),stroke:CR,"stroke-width":.4,opacity:.2},dl)}
el("line",{x1:-74,y1:0,x2:74,y2:0,stroke:GD,"stroke-width":.7},dl);
[["ORTUS",-71,"start"],["OCCASUS",71,"end"]].forEach(t=>{el("text",{x:t[1],y:-2,"text-anchor":t[2],"font-size":3.3,fill:GD,"font-family":FN,"letter-spacing":".3"}).textContent=t[0]});
[["AURORA",-71,"start"],["CREPUSCULUM",71,"end"]].forEach(t=>el("text",{x:t[1],y:3.6,"text-anchor":t[2],"font-size":2.3,fill:"#f0c9a0","font-family":FN,"letter-spacing":".2",opacity:.85},dl).textContent=t[0]);
el("circle",{r:74.6,fill:"none",stroke:GD,"stroke-width":.6});
/* Römische Ziffern (fest) */
const RO=["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"];
for(let h=0;h<24;h++){const g=el("g",{transform:`rotate(${(h-12)*15})`});el("text",{y:-79,"text-anchor":"middle","dominant-baseline":"central","font-size":5,"font-weight":700,fill:CR,"font-family":FN},g).textContent=RO[h%12]}
/* Altböhmische Ziffern (drehen mit Sonnenuntergang) */
const cg=el("g",{});
for(let n=1;n<=24;n++){const g=el("g",{transform:`rotate(${n*15})`},cg);el("text",{y:-89,"text-anchor":"middle","dominant-baseline":"central","font-size":6.2,"font-weight":700,fill:"url(#ogG)","font-family":FN},g).textContent=n}
/* Tierkreisring (außermittig) */
const zg=el("g",{});
el("circle",{r:52,fill:"rgba(12,9,26,.74)",stroke:GD,"stroke-width":.9},zg);
el("circle",{r:40,fill:"none",stroke:GD,"stroke-width":.5,"stroke-dasharray":"1.2 1.2"},zg);
el("circle",{r:34,fill:"#0f2247",stroke:GD,"stroke-width":.7},zg);
const ZS=["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
for(let i=0;i<12;i++){const a=-(i*30)*RAD;el("line",{x1:41*Math.sin(a),y1:-41*Math.cos(a),x2:52*Math.sin(a),y2:-52*Math.cos(a),stroke:GD,"stroke-width":.4,opacity:.8},zg);
 const g=el("g",{transform:`rotate(${-(i*30+15)})`},zg);el("text",{y:-46.5,"text-anchor":"middle","dominant-baseline":"central","font-size":7,fill:CR,"font-family":SYM},g).textContent=ZS[i]+"\uFE0E"}
/* Erde, Zeiger, Mond, Sonne */
const lgo=el("g",{});el("image",{href:"img/orloj-logo.webp",x:-15,y:-23,width:30,height:30,preserveAspectRatio:"xMidYMid meet",class:"orlogo"},cgC); /* Logo bleibt aufrecht, folgt nur der Mitte des Tierkreisrings */
const hg=el("g",{});
const mh=el("line",{x1:0,y1:0,x2:0,y2:0,stroke:"#b9c6e8","stroke-width":.8,"stroke-linecap":"round",opacity:.75},hg);
const sh=el("line",{x1:0,y1:0,x2:0,y2:0,stroke:GD,"stroke-width":1.5,"stroke-linecap":"round"},hg);
const st=el("circle",{r:2.1,fill:GD},hg);
const mg=el("g",{},hg);el("circle",{r:4.8,fill:"#20263d",stroke:"#9fb0d8","stroke-width":.5},mg);const ml=el("path",{d:"",fill:"#eef0ff"},mg);el("circle",{r:4.8,fill:"url(#ogM)"},mg);
const sg=el("g",{},hg);el("path",{d:(()=>{let d="";for(let i=0;i<16;i++){const a=i*22.5*RAD,b=a-.11,c=a+.11,t=i%2?7.8:9.6;d+=`M${5*Math.sin(b)},${-5*Math.cos(b)}L${t*Math.sin(a)},${-t*Math.cos(a)}L${5*Math.sin(c)},${-5*Math.cos(c)}Z`}return d})(),fill:GD,opacity:.95},sg);el("circle",{r:5.6,fill:"url(#ogS)",stroke:"#fff3c4","stroke-width":.4},sg);
el("circle",{r:2.6,fill:GD,stroke:"#7a5212","stroke-width":.5});
/* Rechnen */
const C=-6,R=40,SN=["Widder","Stier","Zwillinge","Krebs","Löwe","Jungfrau","Waage","Skorpion","Schütze","Steinbock","Wassermann","Fische"];
function ec(a){const r=a*RAD,ux=Math.sin(r),uy=-Math.cos(r),b=uy*C,t=b+Math.sqrt(b*b-C*C+R*R);return[ux*t,uy*t]}
const pad=n=>String(n).padStart(2,"0");
function mname(p){return p<.03||p>.97?"Neumond":p<.22?"Zunehmende Sichel":p<.28?"Erstes Viertel":p<.47?"Zunehmender Mond":p<.53?"Vollmond":p<.72?"Abnehmender Mond":p<.78?"Letztes Viertel":"Abnehmende Sichel"}
let lastH=-1,vis=true,pl=false;
function upd(){const d=new Date(),hr=d.getHours()+d.getMinutes()/60+d.getSeconds()/3600,n=(d-Date.UTC(2000,0,1,12))/864e5,L=(280.46+.9856474*n)%360,g=(357.528+.9856003*n)*RAD;
 let lam=(L+1.915*Math.sin(g)+.02*Math.sin(2*g))%360;if(lam<0)lam+=360;
 const dec=Math.asin(Math.sin(23.44*RAD)*Math.sin(lam*RAD)),ha=Math.acos(Math.max(-1,Math.min(1,-Math.tan(50.09*RAD)*Math.tan(dec))))/RAD;
 const a=(hr-12)*15,P=ec(a),beta=Math.atan2(P[0],-(P[1]-C))/RAD;
 cg.setAttribute("transform",`rotate(${ha})`);
 const st0=(typeof start!=="undefined"&&start)||ls.g("et21_first",Date.now()),x=Math.max(0,Math.min(21,(Date.now()-st0)/864e5)),dd=typeof done!=="undefined"?done:[];
 cal.setAttribute("transform",`rotate(${-x*360/21})`);cdt.textContent="Tag "+Math.min(21,Math.floor(x)+1);
 dsg.forEach((q,i)=>q.setAttribute("fill",dd.includes(i+1)?GD:WC[Math.floor(i/7)]));
 zg.setAttribute("transform",`translate(0,${C}) rotate(${beta+lam})`);lgo.setAttribute("transform",`translate(0,${C})`);
 const ux=Math.sin(a*RAD),uy=-Math.cos(a*RAD);
 sh.setAttribute("x2",ux*88);sh.setAttribute("y2",uy*88);st.setAttribute("cx",ux*88);st.setAttribute("cy",uy*88);
 sg.setAttribute("transform",`translate(${P[0]},${P[1]})`);
 const p=(((Date.now()-Date.UTC(2000,0,6,18,14))/864e5/29.530588)%1+1)%1,Q=ec(a-p*360),th=Math.atan2(P[1]-Q[1],P[0]-Q[0])/RAD,k=(1-Math.cos(2*Math.PI*p))/2,rx=4.8*Math.abs(1-2*k);
 mh.setAttribute("x2",Q[0]);mh.setAttribute("y2",Q[1]);
 mg.setAttribute("transform",`translate(${Q[0]},${Q[1]}) rotate(${th})`);
 ml.setAttribute("d",`M0,-4.8A4.8,4.8 0 0 1 0,4.8A${rx},4.8 0 0 ${k<.5?0:1} 0,-4.8Z`);
 const oc=(((hr-12-ha/15)%24)+24)%24;
 document.getElementById("olS").textContent=SN[Math.floor(lam/30)];
 document.getElementById("olM").textContent=mname(p);
 document.getElementById("olC").textContent=Math.floor(oc)+":"+pad(Math.floor(oc%1*60));
 }
function play(){if(pl)return;pl=true;ws.forEach(w=>w.setAttribute("fill","#3a2611"));sht.forEach(x=>x.classList.add("op"));
 if(rmo){setTimeout(()=>{ws.forEach(w=>w.setAttribute("fill","#0d0a16"));sht.forEach(x=>x.classList.remove("op"));pl=false},2200);return}
 const t0=performance.now(),D=2500,S=520;
 (function f(now){const t=now-t0;let act=false;
  fg.forEach((g,i)=>{const u=(t-i*S)/D;if(u<0){act=true;return}if(u>1){g.setAttribute("opacity",0);return}act=true;g.setAttribute("opacity",1);g.setAttribute("transform",`translate(${-40+80*u},-118)`)});
  if(act)requestAnimationFrame(f);else{ws.forEach(w=>w.setAttribute("fill","#0d0a16"));sht.forEach(x=>x.classList.remove("op"));pl=false}})(t0)}
/* Läuten: Viertelstunden-Gong (WebAudio, braucht einmal Tippen/Klick) */
const KC="et21_chime";let on=ls.g(KC,false)===true,ac=null,mb=null,lastK="";
const ob=document.getElementById("olb"),tg=document.createElement("button"),stt=document.createElement("p");
tg.type="button";tg.className="btn o";tg.id="olt";tg.style.marginTop="8px";
stt.id="olst";stt.setAttribute("role","status");stt.style.cssText="font-size:.8rem;opacity:.85;margin:8px 0 0;text-align:center;line-height:1.4";
ob.insertAdjacentElement("afterend",stt);ob.insertAdjacentElement("afterend",tg);
function ensure(){if(!ac){const A=window.AudioContext||window.webkitAudioContext;if(!A)return false;try{ac=new A()}catch(e){return false}
 mb=ac.createGain();mb.gain.value=.6;const cp=ac.createDynamicsCompressor();mb.connect(cp);cp.connect(ac.destination)}
 if(ac.state==="suspended")ac.resume().catch(()=>{});return true}
const PT=[[.5,.6,1],[1,1,.9],[1.2,.55,.7],[1.56,.35,.5],[2,.4,.45],[2.51,.25,.35],[3,.2,.3],[4.1,.12,.2]];
function bell(t,f,v,du){PT.forEach(p=>{const o=ac.createOscillator(),g=ac.createGain(),e=t+du*p[2];o.type="sine";o.frequency.value=f*p[0];
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*p[1],t+.005);g.gain.exponentialRampToValueAtTime(.0001,e);
 o.connect(g);g.connect(mb);o.start(t);o.stop(e+.1)})}
function clap(t,v){const n=ac.sampleRate*.06|0,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=b;f.type="bandpass";f.frequency.value=2400;g.gain.value=v;s.connect(f);f.connect(g);g.connect(mb);s.start(t)}
function big(t,f,v,du){clap(t,v*.5);bell(t,f,v,du);PT.slice(0,4).forEach(p=>{const o=ac.createOscillator(),g=ac.createGain(),e=t+du*p[2];o.type="sine";o.frequency.value=f*p[0];o.detune.value=7;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*p[1]*.45,t+.01);g.gain.exponentialRampToValueAtTime(.0001,e);o.connect(g);g.connect(mb);o.start(t);o.stop(e+.1)})}
/* Prager Orloj: erst das Totenglöckchen (hell, rasch), dann schlägt die große Turmglocke die Stunde */
function strike(m,h,f){if(!on&&!f)return;if(!ensure())return;const go=()=>{const t=ac.currentTime+.05;
 if(m===0){const n=h%12||12;for(let i=0;i<7;i++){clap(t+i*.46,.05);bell(t+i*.46,1318.5,.16,1.5)}const b=t+4.2;for(let i=0;i<n;i++)big(b+i*3,146.8,.55,8)}
 else{[523.3,392,659.3].slice(0,m/15===1?1:m/15===2?2:3).forEach((q,i)=>bell(t+i*1.1,q,.32,3.6))}};
 if(ac.state==="running")go();else if(f)ac.resume().then(go).catch(()=>{})}
function nextQ(){const d=new Date(),m=(Math.floor(d.getMinutes()/15)+1)*15,n=new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),m,0);return pad(n.getHours())+":"+pad(n.getMinutes())}
function ui(){tg.textContent=on?"🔔 Läuten: an":"🔕 Läuten: aus";tg.setAttribute("aria-pressed",on);
 stt.textContent=!on?"Alle 15 Minuten läutet die Uhr, zur vollen Stunde mit Stundenschlag und Apostelumgang. Zum Einschalten tippen.":ac&&ac.state==="running"?"Nächstes Läuten um "+nextQ()+" Uhr":"Läuten ist bereit. Tippe einmal irgendwo auf die Seite, damit der Browser den Ton freigibt."}
tg.onclick=()=>{on=!on;ls.s(KC,on);if(on){if(!ensure()){on=false;ls.s(KC,false);stt.textContent="Dieser Browser kann leider keinen Ton abspielen.";tg.textContent="🔕 Läuten: aus";return}
  if(ac.state==="running"){const t=ac.currentTime+.05;bell(t,523.3,.32,3.6)}}ui();setTimeout(ui,300)};
function unlock(){if(on)ensure();if(ac&&ac.state==="running"){["pointerdown","keydown","touchend"].forEach(k=>removeEventListener(k,unlock,true));ui()}}
["pointerdown","keydown","touchend"].forEach(k=>addEventListener(k,unlock,true));
function kq(d){return d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+"-"+d.getHours()+"-"+Math.floor(d.getMinutes()/15)}
lastK=kq(new Date());
setInterval(()=>{const d=new Date(),k=kq(d);
 if(k!==lastK&&d.getSeconds()<45){lastK=k;const m=d.getMinutes();if(m%15===0){if(m===0){if(!document.hidden)play();strike(0,d.getHours())}else strike(m,d.getHours())}ui()}
 else if(k!==lastK)lastK=k;
 if(vis&&!document.hidden&&d.getSeconds()%15===0)upd()},1000);
ob.onclick=()=>{play();strike(0,new Date().getHours(),true)};
ui();
upd();
if("IntersectionObserver" in window)new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(vis)upd()},{threshold:.1}).observe(sv);
setInterval(()=>{if(vis&&!document.hidden)upd()},15000);
})();
