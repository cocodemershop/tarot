/* Sternenwirbel um die Kaufen-Buttons */
(function(){const rm=matchMedia("(prefers-reduced-motion:reduce)").matches,S=new Set(),COL=["#fff3c4","#f7d98a","#e8b45a","#d9b8ff","#ffffff"];let raf=0,t0=performance.now();
/* Nur zeichnen, was man sieht; Größe nur bei Änderung messen (kein Layout pro Bild) */
const EL=new Map(),wake=()=>{if(!raf&&!rm&&!document.hidden)raf=requestAnimationFrame(loop)};
const RO=window.ResizeObserver?new ResizeObserver(es=>es.forEach(e=>{const o=EL.get(e.target);if(o){o.dirty=true;if(rm)draw(o,0)}})):null;
const IO=window.IntersectionObserver?new IntersectionObserver(es=>es.forEach(e=>{const o=EL.get(e.target);if(o){o.vis=e.isIntersecting;if(o.vis){if(rm)draw(o,0);else wake()}}}),{rootMargin:"60px"}):null;
function mk(a){if(a.dataset.sw)return;a.dataset.sw=1;a.classList.add("kauf");const c=document.createElement("canvas");c.className="kswirl";c.setAttribute("aria-hidden","true");a.appendChild(c);
const P=[];for(let i=0;i<26;i++)P.push({a:Math.random()*6.283,v:(.35+Math.random()*.7)*(i%2?1:-1),k:.92+Math.random()*.5,s:1.4+Math.random()*3.2,ph:Math.random()*6.283,tw:1+Math.random()*3,c:COL[i%5]});
const o={a:a,c:c,g:c.getContext("2d"),P:P,W:0,H:0,dpr:1,vis:false,dirty:true};S.add(o);EL.set(a,o);if(RO)RO.observe(a);if(IO)IO.observe(a);else o.vis=true}
function size(s){const r=s.a.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),M=34;s.bw=r.width;s.bh=r.height;s.W=r.width+M*2;s.H=r.height+M*2;s.dpr=d;s.c.style.width=s.W+"px";s.c.style.height=s.H+"px";s.c.style.left=-M+"px";s.c.style.top=-M+"px";s.c.width=s.W*d;s.c.height=s.H*d;s.g.setTransform(d,0,0,d,0,0)}
function star(g,x,y,r,al,c){g.globalAlpha=al;g.fillStyle=c;g.shadowColor=c;g.shadowBlur=r*3;g.beginPath();for(let k=0;k<8;k++){const q=k%2?r*.28:r,a=k*Math.PI/4;g.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}g.closePath();g.fill()}
function draw(s,t){if(s.dirty||!s.W){s.dirty=false;size(s)}const g=s.g;g.clearRect(0,0,s.W,s.H);const cx=s.W/2,cy=s.H/2,rx=s.bw/2+12,ry=s.bh/2+10;
s.P.forEach(p=>{if(!rm)p.a+=p.v*.011;const sw=1+.08*Math.sin(p.a*3+t);const x=cx+Math.cos(p.a)*rx*p.k*sw,y=cy+Math.sin(p.a)*ry*p.k*sw*1.15;const al=rm?.7:(.3+.7*Math.abs(Math.sin(t*p.tw+p.ph)));
if(!rm&&p.s>2.6){const a2=p.a-p.v*.12;g.globalAlpha=al*.35;g.shadowBlur=0;g.strokeStyle=p.c;g.lineWidth=1;g.beginPath();g.moveTo(cx+Math.cos(a2)*rx*p.k*sw,cy+Math.sin(a2)*ry*p.k*sw*1.15);g.lineTo(x,y);g.stroke()}
star(g,x,y,p.s,al,p.c)});g.shadowBlur=0;g.globalAlpha=1}
let lf=0;function loop(now){raf=0;let any=false;if(now-lf>=30){lf=now;const t=(now-t0)/1000;S.forEach(s=>{if(!s.a.isConnected){S.delete(s);EL.delete(s.a);return}if(!s.vis)return;any=true;draw(s,t)})}else any=true;if(any&&!document.hidden&&!rm)raf=requestAnimationFrame(loop)}
function scan(){document.querySelectorAll("a.btn").forEach(a=>{if(/Jetzt kaufen/.test(a.textContent))mk(a)});if(S.size&&!raf){if(rm){S.forEach(s=>{if(s.vis)draw(s,0)})}else raf=requestAnimationFrame(loop)}}
let tm=0;new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(scan,120)}).observe(document.body,{childList:true,subtree:true});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)scan()});scan();
})();
