/* Sternenwirbel auf den Reitern */
/* ===== STERNENWIRBEL AUF DEN REITERN ===== */
(function(){
const nv=document.querySelector("nav.tabs");if(!nv||!document.body.animate||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
const lay=document.createElement("div");lay.className="zw";lay.setAttribute("aria-hidden","true");document.body.appendChild(lay);
const G=["✦","✧","★","✦","✶"],C=["#f7d98a","#fff3c4","#e8b45a","#d9b8ff","#ffffff"],last=new WeakMap();
function swirl(b){
 const now=performance.now();if(now-(last.get(b)||0)<450)return;last.set(b,now);
 const r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,n=16;
 for(let i=0;i<n;i++){
  const el=document.createElement("i");el.textContent=G[i%G.length];
  const sz=8+Math.random()*11;el.style.fontSize=sz+"px";el.style.color=C[i%C.length];
  const a0=Math.random()*6.283,turns=(1.1+Math.random()*.9)*(i%2?1:-1),R=r.width*.38+22+Math.random()*34,dur=950+Math.random()*650,k=14,fr=[];
  for(let j=0;j<=k;j++){const t=j/k,ang=a0+turns*6.283*t,rad=R*Math.sin(t*1.57),x=cx+Math.cos(ang)*rad*1.25-sz/2,y=cy+Math.sin(ang)*rad*.8-sz/2-t*26;
   fr.push({transform:`translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(t*360*(i%2?1:-1)).toFixed(0)}deg) scale(${(.3+Math.sin(t*3.14)*.9).toFixed(2)})`,opacity:t<.12?t/.12:t>.65?Math.max(0,(1-t)/.35):1,offset:t})}
  lay.appendChild(el);
  el.animate(fr,{duration:dur,delay:Math.random()*160,easing:"ease-out",fill:"both"}).onfinish=()=>el.remove();
 }
}
nv.addEventListener("pointerover",e=>{const b=e.target.closest("button");if(!b||!nv.contains(b))return;if(e.relatedTarget&&b.contains(e.relatedTarget))return;swirl(b)});
nv.addEventListener("focusin",e=>{const b=e.target.closest("button");if(b&&b.matches(":focus-visible"))swirl(b)});
})();
