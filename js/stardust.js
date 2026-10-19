/* Sternenstaub in den Fenstern */
/* Sternenstaub hinter dem Fenster-Kopf: eine Funktion für alle drei Dialoge */
(function(){
function initStarDust(id){const dl=document.getElementById(id);if(!dl)return;
const w=dl.querySelector(".dkw"),cv=document.createElement("canvas");cv.className="pdw";cv.setAttribute("aria-hidden","true");w.appendChild(cv);
const g=cv.getContext("2d"),rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
let raf=0,P=[],W=0,H=0,t0=0,dpr=1;
const COL=["#fff3c4","#f7d98a","#e8b45a","#d9b8ff","#ffffff"];
function size(){dpr=Math.min(devicePixelRatio||1,2);W=w.offsetWidth;H=w.offsetHeight;cv.width=W*dpr;cv.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0)}
function centre(){const c=w.querySelector(".pdc");if(!c)return[W/2,Math.min(H*.3,190)];const a=c.getBoundingClientRect(),b=w.getBoundingClientRect();return[a.left-b.left+a.width/2,a.top-b.top+a.height/2]}
function mk(i,burst){const far=burst?1.8:1;return{a:Math.random()*6.283,r:(60+Math.random()*190)*far,v:(.25+Math.random()*.7)*(Math.random()<.5?1:-1),dr:(Math.random()*.1+.02)*(burst?1.2:.05),s:1.5+Math.random()*4.5,c:COL[i%COL.length],ph:Math.random()*6.283,tw:1+Math.random()*3}}
function star(x,y,r,al,c){g.globalAlpha=al;g.fillStyle=c;g.shadowColor=c;g.shadowBlur=r*3;g.beginPath();for(let k=0;k<8;k++){const q=k%2?r*.28:r,a=k*Math.PI/4;g.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}g.closePath();g.fill()}
function frame(now){if(!dl.open){raf=0;return}
if(w.offsetHeight!==H||w.offsetWidth!==W)size();
const t=(now-t0)/1000,[cx,cy]=centre();g.clearRect(0,0,W,H);
for(let i=0;i<P.length;i++){const p=P[i];p.a+=p.v*.012;const R0=Math.max(46,p.r);
if(t<3.2)p.r=Math.max(R0>p.r?p.r:p.r-p.dr*p.r*.35,70+i%7*18);
const sq=.62+.12*Math.sin(p.a*2);
const x=cx+Math.cos(p.a)*p.r,y=cy+Math.sin(p.a)*p.r*sq;
const al=(.35+.65*Math.abs(Math.sin(t*p.tw+p.ph)))*Math.min(1,t*1.2);
star(x,y,p.s,al,p.c);
if(p.s>3.4){g.shadowBlur=0;const a2=p.a-p.v*.1;g.globalAlpha=al*.35;g.strokeStyle=p.c;g.lineWidth=1;g.beginPath();g.moveTo(cx+Math.cos(a2)*p.r,cy+Math.sin(a2)*p.r*sq);g.lineTo(x,y);g.stroke()}}
g.shadowBlur=0;g.globalAlpha=1;raf=requestAnimationFrame(frame)}
function go(){if(rm||raf)return;size();P=[];for(let i=0;i<120;i++)P.push(mk(i,true));t0=performance.now();raf=requestAnimationFrame(frame)}
new MutationObserver(()=>{if(dl.open)setTimeout(go,60);else{cancelAnimationFrame(raf);raf=0;g.clearRect(0,0,W,H)}}).observe(dl,{attributes:true,attributeFilter:["open"]});
if(dl.open)go();
}
initStarDust("pdd");
initStarDust("trd");
initStarDust("lgd");
})();
