/* 21-Tage-Programm: Profil, Fortschritt, Tagebuch, Finale */
document.getElementById("tlg").innerHTML=TL.map(t=>`<div class="it"><b>${t[0]}</b>${t[1]}</div>`).join("");
document.getElementById("ms").innerHTML=MS.map(t=>`<div class="it"><b>${t[0]}</b>${t[1]}</div>`).join("");


const SK="et21_done",SP="et21_prof",ST="et21_start";
const ls={g:(k,d)=>{try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let done=ls.g(SK,[]),prof=ls.g(SP,null),start=ls.g(ST,null),armed=false;
const $=id=>document.getElementById(id),DAY=864e5;
function elapsed(){return start?Math.min(21,Math.max(0,Math.floor((Date.now()-start)/DAY))+1):0}
function unlocked(){const e=elapsed();return e<1?1:Math.min(21,Math.ceil(e/7)*7)}
const WN=["Hinschauen","Fragen &amp; Verbinden","Eigene Wege"],wkd=w=>start?new Date(start+(w-1)*7*DAY).toLocaleDateString("de-DE",{day:"numeric",month:"long"}):"";
const wkh=(w,u)=>{const o=(w-1)*7+1<=u;return`<div class="wkh${o?" on":""}"><b>Woche ${w}</b><span>${WN[w-1]}</span><small>${o?"✦ geöffnet":"🔒 öffnet "+(wkd(w)?"am "+wkd(w):"nach dem Start")}</small></div>`}
function fmt(n){return n.toLocaleString("de-DE")}
function metrics(){const e=elapsed(),c=prof?prof.cards:0,m=prof?prof.min:0;$("m1").textContent=fmt(e*c);$("m2").textContent=fmt(e*m);$("m3").textContent=done.length}
function saveProfile(){const n=$("un").value.trim(),d=$("ud").value,c=parseInt($("uc").value),m=parseInt($("um").value);
 if(!n||!d||isNaN(c)||isNaN(m)){$("pm").textContent="Bitte fülle alle vier Felder aus.";return}
 if(c<1||c>30||m<1||m>240){$("pm").textContent="Bitte wähle 1 bis 30 Karten und 1 bis 240 Minuten pro Tag.";return}
 prof={name:n,date:d,cards:c,min:m};ls.s(SP,prof);start=new Date(d).getTime();ls.s(ST,start);$("pm").textContent="Gespeichert. Schön, dass du dabei bist, "+n+".";metrics();render()}
function phase(d){return d<=7?"Woche 1: Hinschauen":d<=14?"Woche 2: Fragen &amp; Verbinden":"Woche 3: Eigene Wege"}
const TBK="et21_tb",TBV=ls.g(TBK,{});
const ea=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sec=(c,h,b)=>`<div class="${c}"><h5>${h}</h5>${b}</div>`;
function render(){const u=unlocked();
 $("days").innerHTML=D.map((x,i)=>{const n=i+1,lock=n>u,ok=done.includes(n);
 const fq="<ol>"+x[8].map(q=>`<li>${q}</li>`).join("")+"</ol>";
 const tb=x[10].map((l,k)=>`<label class="tbf"><span>${l}</span><input type="text" maxlength="300" data-tb="t${n}_${k}" value="${ea(TBV["t"+n+"_"+k]||"")}" autocomplete="off"></label>`).join("");
 return(n%7===1?wkh(Math.ceil(n/7),u):"")+`<div class="card${lock?" locked":""}${ok?" completed":""}" id="c${n}"><div class="dh" data-n="${n}" tabindex="0" role="button" aria-expanded="false"><div class="l"><span class="dn">TAG ${n}</span><span class="dt">${x[0]}</span></div><span class="ph">${lock?"🔒 Woche "+Math.ceil(n/7)+" öffnet "+(wkd(Math.ceil(n/7))?"am "+wkd(Math.ceil(n/7)):"nach dem Start"):phase(n)}</span></div>
 <div class="dc"><p class="wq2">${x[1]}</p><p class="lead">${x[2]}</p>
 ${sec("hl","Das lernst du heute",`<p>${x[3]}</p>`)}
 ${sec("nf","Ein Kartenbeispiel",`<p>${x[4]}</p>`)}
 ${sec("nf","Das solltest du heute wissen",`<p>${x[5]}</p>`)}
 ${sec("fe","Typischer Anfängerfehler",`<p>${x[7]}</p>`)}
 ${sec("ac","Deine heutige Aufgabe",`<p>${x[6]}</p>`)}
 ${sec("nf fq","Deine 3 Fragen",fq)}
 ${sec("bn","Kleine Überraschungsaufgabe",`<p>${x[9]}</p>`)}
 ${sec("nf","Dein Tagebuch",tb)}
 ${sec("hl","Deine Motivation für heute",`<p>${x[11]}</p>`)}
 <p class="ab">✦ ${x[12]}</p>
 <button class="btn${ok?" done":" o"}" data-t="${n}">${ok?"✓ Tag erledigt":"Tag als erledigt markieren"}</button></div></div>`}).join("");
 progress()}
function progress(){const c=done.length;$("pf").style.width=c/21*100+"%";$("pt").textContent=c+" / 21 Tage abgeschlossen";$("pf").parentElement.setAttribute("aria-valuenow",c);metrics()}
$("days").addEventListener("click",e=>{
 const h=e.target.closest(".dh"),t=e.target.closest("[data-t]"),q=e.target.closest(".qb");
 if(q){const n=+q.dataset.n,k=+q.dataset.k,c=D[n-1][4][2];q.parentElement.querySelectorAll(".qb").forEach((b,i)=>{b.disabled=true;if(i===c)b.classList.add("c");else if(i===k)b.classList.add("w")});$("qe"+n).classList.add("show");return}
 if(t){const n=+t.dataset.t;done=done.includes(n)?done.filter(x=>x!==n):[...done,n].sort((a,b)=>a-b);ls.s(SK,done);
  const c=$("c"+n),ok=done.includes(n);c.classList.toggle("completed",ok);t.className="btn"+(ok?" done":" o");t.textContent=ok?"✓ Tag erledigt":"Tag als erledigt markieren";progress();if(done.length>=21)setTimeout(finale,600);return}
 if(h){const n=+h.dataset.n;if(n>unlocked())return;const c=$("c"+n);c.classList.toggle("open");h.setAttribute("aria-expanded",c.classList.contains("open"))}});
$("days").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.classList.contains("dh")){e.preventDefault();e.target.click()}});
$("days").addEventListener("input",e=>{const t=e.target.dataset&&e.target.dataset.tb;if(t){TBV[t]=e.target.value;ls.s(TBK,TBV)}});
$("sv").onclick=saveProfile;

let raf=null,P=[];
function finale(){const s=$("fin");s.classList.add("show");document.body.style.overflow="hidden";
 const c=prof?prof.cards:3,m=prof?prof.min:20;$("f1").textContent=fmt(21*c);$("f2").textContent=fmt(21*m);
 if(prof)$("fn").textContent=prof.name+", deine Transformation ist komplett!";
 if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 const cv=$("cv"),x=cv.getContext("2d");cv.width=innerWidth;cv.height=innerHeight;const col=["#e8b45a","#7ee0b5","#c25b6e","#b98ae0","#fff"];
 const mk=()=>({x:Math.random()*cv.width,y:-10,vx:(Math.random()-.5)*2,vy:1+Math.random()*2,s:3+Math.random()*5,c:col[Math.floor(Math.random()*5)],l:260});
 P=Array.from({length:innerWidth<700?90:150},mk);
 (function loop(){x.clearRect(0,0,cv.width,cv.height);P.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;p.l--;x.globalAlpha=Math.max(p.l/260,0);x.fillStyle=p.c;x.fillRect(p.x,p.y,p.s,p.s*.5);if(p.l<=0||p.y>cv.height)P[i]=mk()});raf=requestAnimationFrame(loop)})()}
function closeFin(){$("fin").classList.remove("show");document.body.style.overflow="";if(raf)cancelAnimationFrame(raf);raf=null}
$("cl").onclick=closeFin;
$("rs").onclick=function(){if(!armed){armed=true;this.textContent="Wirklich neu starten? Noch einmal klicken";return}
 armed=false;this.textContent="Neu starten";done=[];start=null;ls.s(SK,[]);ls.s(ST,null);closeFin();render();scrollTo({top:0,behavior:"smooth"})};
if(prof){$("un").value=prof.name;$("ud").value=prof.date;$("uc").value=prof.cards;$("um").value=prof.min}
render();
