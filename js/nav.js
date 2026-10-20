/* Navigation: Mehr-Menü und Reihenfolge */
(function(){const nav=document.querySelector("nav.tabs");if(!nav)return;
const L={home:["21-Tage-Programm","Programm"],lex:["Kartenlexikon","Lexikon"],lgm:["Legemethoden","Legungen"],fam:["Kartenkreis","Kreis"]};
nav.querySelectorAll("button[data-t]").forEach(b=>{const l=L[b.dataset.t];if(l)b.innerHTML='<span class="f">'+l[0]+'</span><span class="s">'+l[1]+'</span>'});
const mw=document.createElement("div");mw.className="mw";mw.innerHTML='<button id="tmo" type="button" aria-haspopup="true" aria-expanded="false"><span class="f">✦ Mehr ▾</span><span class="s">✦ Mehr</span></button><div class="mp" id="mp" hidden></div>';
nav.appendChild(mw);const mp=mw.querySelector("#mp"),tm=mw.querySelector("#tmo");
const g=id=>document.getElementById(id),ttr=g("ttr");
["tsk","tmfk","tpd","gg"].forEach(id=>{const b=g(id);if(b)mp.appendChild(b)});
const mq=matchMedia("(max-width:900px)");
const lxb=nav.querySelector('button[data-t="lex"]'),lgb=document.getElementById('tmlg'),dkb=document.getElementById('tdk');const place=()=>{if(mq.matches){mp.insertBefore(ttr,mp.firstChild);document.body.appendChild(mp);nav.insertBefore(lgb,lxb)}else{nav.insertBefore(ttr,mw);mw.appendChild(mp);nav.insertBefore(lgb,ttr)}nav.insertBefore(dkb,lgb);nav.insertBefore(lxb,mw)};place();
(mq.addEventListener?mq.addEventListener("change",place):mq.addListener(place));
const close=()=>{mp.hidden=true;tm.setAttribute("aria-expanded","false")};
tm.onclick=e=>{e.stopPropagation();const o=mp.hidden;mp.hidden=!o;tm.setAttribute("aria-expanded",String(o))};
mp.addEventListener("click",e=>{const ob=e.target.closest("button[data-o]");if(ob&&!nav.contains(ob)){const f={dk:window.openDk,sk:window.openSk,lg:window.openLg,fk:window.openFk,pd:window.openPd,tr:window.openTr}[ob.dataset.o];if(f)f()}setTimeout(close,0)});
document.addEventListener("click",e=>{if(!mw.contains(e.target)&&!mp.contains(e.target))close()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
/* Höhe der Leiste ohne erzwungenes Layout beim Start messen */
const nh=h=>document.documentElement.style.setProperty("--nh",Math.round(h)+"px");
if(window.ResizeObserver)new ResizeObserver(es=>{const e=es[es.length-1],b=e.borderBoxSize&&e.borderBoxSize[0];nh(b?b.blockSize:nav.offsetHeight)}).observe(nav);else{const f=()=>nh(nav.offsetHeight);requestAnimationFrame(f);addEventListener("resize",f)}
})();
