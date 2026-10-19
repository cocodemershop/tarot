/* Sanfter Hinweis auf den Klangraum */
(function(){const sb=$("sb"),pn=$("sndp");if(!sb||!pn)return;const K="kr_snd_hint",H=ls.g(K,{n:0,t:0,x:0}),T0=Date.now(),WAIT=[0,18e4,6e5];if(H.x)return;
const b=document.createElement("button");b.type="button";b.className="sndhint";b.hidden=true;b.setAttribute("aria-label","Klangraum öffnen");b.innerHTML="<span aria-hidden=\"true\">♪</span> Dein Klangraum <small>Musik &amp; Lautstärke wählen</small>";document.body.appendChild(b);
let tm=0;const hide=()=>{clearTimeout(tm);b.classList.remove("on");setTimeout(()=>{b.hidden=true},600)};
b.onclick=()=>{H.x=1;ls.s(K,H);hide();if(pn.hidden)sb.click()};
sb.addEventListener("click",()=>{H.x=1;ls.s(K,H);hide();clearInterval(iv)});
const iv=setInterval(()=>{if(H.n>=3){clearInterval(iv);return}
 if(Date.now()-T0<35e3||Date.now()-H.t<WAIT[H.n]||document.hidden||!pn.hidden||document.querySelector("dialog[open]"))return;
 H.n++;H.t=Date.now();ls.s(K,H);b.hidden=false;requestAnimationFrame(()=>b.classList.add("on"));tm=setTimeout(hide,7500)},15e3);
})();
