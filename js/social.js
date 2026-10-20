/* Teilen auf Facebook und Instagram
   Facebook: öffnet den offiziellen Teilen-Dialog mit dem Link zur Seite (Vorschaubild kommt aus og:image).
             Facebook erlaubt keinen vorausgefüllten Text, deshalb wird der Text zusätzlich kopiert.
   Instagram: auf dem Handy öffnet sich das Teilen-Menü mit einem Bild (Story/Beitrag direkt in Instagram).
              Am PC wird der Text kopiert und Instagram geöffnet. */
/* ===== FACEBOOK + INSTAGRAM ===== */
const SOC=(function(){
const PUB="https://cocodemershop.github.io/tarot/";
const site=()=>{const c=document.querySelector('link[rel="canonical"]');return c&&c.href?c.href:PUB};
let ogBlob=null,legBlob=null;

function toast(msg){
  const host=[...document.querySelectorAll("dialog[open]")].pop()||document.body;
  let t=document.getElementById("soct");
  if(!t||t.parentNode!==host){if(t)t.remove();t=document.createElement("div");t.id="soct";t.className="soct";t.setAttribute("role","status");t.setAttribute("aria-live","polite");host.appendChild(t)}
  t.textContent=msg;t.classList.remove("on");void t.offsetWidth;t.classList.add("on");
  clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("on"),4200);
}
function copy(t){
  if(!t)return Promise.resolve(false);
  if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(t).then(()=>true,()=>false);
  return Promise.resolve(false);
}
/* Vorschaubild vorab laden, damit das Teilen-Menü auf dem iPhone sofort aufgeht */
function warm(){
  if(ogBlob||!navigator.canShare||!/^https?:/.test(location.href))return;
  fetch("img/og-kartenreich.jpg").then(r=>r.ok?r.blob():null).then(b=>{ogBlob=b}).catch(()=>{});
}
["pointerdown","keydown","touchstart"].forEach(ev=>addEventListener(ev,warm,{once:true,passive:true}));

function fb(text){
  const u=site();
  const w=open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(u),"_blank","noopener,width=680,height=640");
  if(text)copy(text).then(ok=>{if(ok)toast("Text kopiert ✓ Füge ihn in Facebook in deinen Beitrag ein.")});
  return w;
}
function ig(text,blob){
  const b=blob||legBlob||ogBlob,full=(text?text+"\n\n":"")+site();
  copy(full);
  if(b&&navigator.canShare){
    const f=new File([b],"kartenreich.jpg",{type:b.type||"image/jpeg"});
    if(navigator.canShare({files:[f]})){
      navigator.share({files:[f],text:full}).catch(e=>{if(e&&e.name!=="AbortError")igWeb()});
      return;
    }
  }
  igWeb();
}
function igWeb(){
  toast("Text kopiert ✓ Instagram öffnet sich: Füge ihn in deine Story oder deinen Beitrag ein.");
  open("https://www.instagram.com/","_blank","noopener");
}

/* Story-Bild (1080 × 1920) aus der Drei-Karten-Legung */
function img(src){return new Promise(ok=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>ok(null);i.src=src})}
function wrap(g,t,x,y,max,lh){const w=t.split(" ");let l="";for(const s of w){const n=l?l+" "+s:s;if(g.measureText(n).width>max&&l){g.fillText(l,x,y);y+=lh;l=s}else l=n}if(l)g.fillText(l,x,y);return y}
function prepLegung(last,pos,q){
  legBlob=null;if(!last||!last.length)return;
  Promise.all([document.fonts?document.fonts.ready:0,...last.map(x=>img("cards/"+x.c[0]+".webp")),img("img/logo.webp")]).then(r=>{
    const ims=r.slice(1,4),logo=r[4],W=1080,H=1920,c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");
    const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,"#1d1030");bg.addColorStop(.55,"#0e0817");bg.addColorStop(1,"#170c26");g.fillStyle=bg;g.fillRect(0,0,W,H);
    const gl=g.createRadialGradient(W/2,820,40,W/2,820,720);gl.addColorStop(0,"rgba(232,180,90,.20)");gl.addColorStop(1,"rgba(232,180,90,0)");g.fillStyle=gl;g.fillRect(0,0,W,H);
    let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;g.fillStyle="#f5e6c8";for(let i=0;i<140;i++){g.globalAlpha=.25+rnd()*.6;g.beginPath();g.arc(rnd()*W,rnd()*H,rnd()*2.2+.4,0,7);g.fill()}g.globalAlpha=1;
    const gold=g.createLinearGradient(0,0,W,0);gold.addColorStop(0,"#c8913a");gold.addColorStop(.5,"#f6d48e");gold.addColorStop(1,"#c8913a");
    g.textAlign="center";
    if(logo)g.drawImage(logo,W/2-50,170,100,108);
    g.fillStyle=gold;g.font='600 66px "Lora",Georgia,serif';g.fillText("Meine Drei-Karten-Legung",W/2,350);
    g.fillStyle="#ece3f2";g.font='italic 400 38px "Lora",Georgia,serif';
    let y=360;if(q){y=wrap(g,"„"+q.slice(0,90)+"“",W/2,425,880,50)}
    const cw=316,ch=542,gap=26,x0=(W-3*cw-2*gap)/2,cy=Math.max(y+110,560);
    last.forEach((x,i)=>{const cx=x0+i*(cw+gap);
      g.fillStyle=gold;g.font='600 34px "Lora",Georgia,serif';g.fillText(pos[i][0],cx+cw/2,cy-22);
      g.save();g.shadowColor="rgba(232,180,90,.45)";g.shadowBlur=40;g.fillStyle="#2a1a3a";g.fillRect(cx,cy,cw,ch);g.restore();
      if(ims[i]){g.save();if(x.rv){g.translate(cx+cw,cy+ch);g.rotate(Math.PI);g.drawImage(ims[i],0,0,cw,ch)}else g.drawImage(ims[i],cx,cy,cw,ch);g.restore()}
      g.strokeStyle="rgba(246,212,142,.85)";g.lineWidth=3;g.strokeRect(cx+1.5,cy+1.5,cw-3,ch-3);
      g.fillStyle="#ece3f2";g.font='600 31px "Lora",Georgia,serif';const ny=wrap(g,x.c[1],cx+cw/2,cy+ch+56,cw,38);
      if(x.rv){g.fillStyle="#bfa9d4";g.font='italic 400 26px "Lora",Georgia,serif';g.fillText("umgekehrt",cx+cw/2,ny+38)}
    });
    g.fillStyle="#d9cbe6";g.font='italic 400 36px "Lora",Georgia,serif';
    const kw=last.map(x=>String(x.c[2]).split(",")[0].trim()).join(" · ");g.fillText(kw,W/2,cy+ch+190);
    g.strokeStyle=gold;g.lineWidth=2;g.beginPath();g.moveTo(W/2-160,H-330);g.lineTo(W/2+160,H-330);g.stroke();
    g.fillStyle=gold;g.font='600 52px "Lora",Georgia,serif';g.fillText("Kartenreich",W/2,H-250);
    g.fillStyle="#ece3f2";g.font='400 34px "Lora",Georgia,serif';g.fillText("Ziehe deine eigene Legung – kostenlos",W/2,H-190);
    g.fillStyle="#f6d48e";g.font='600 34px system-ui,sans-serif';g.fillText("cocodemershop.github.io/tarot",W/2,H-130);
    c.toBlob(b=>{legBlob=b},"image/jpeg",.9);
  }).catch(e=>console.error("Story-Bild",e));
}
function clearLegung(){legBlob=null}

return{fb,ig,toast,prepLegung,clearLegung,story:()=>legBlob};
})();
