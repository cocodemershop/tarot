/* Orakel und Teilen per WhatsApp / Telegram */
/* ===== ORAKEL + WHATSAPP / TELEGRAM ===== */
(function(){
let OT="";
function famText(f){const c=calc(f);return`✦ ${f.n} · ${c.z[0]} ${c.z[1]}${c.asc?" · Aszendent "+c.asc[0]+" "+c.asc[1]:""}\nSeelenkarte: ${c.soul.name} – ${c.soul.tip}\nJahreskarte ${c.cy}: ${c.year.name} – ${c.year.tip}\nVon Herzen: Du bist ein Geschenk für uns alle.`}
const REC="✦ Ich habe etwas Schönes für dich entdeckt: „21 Tage Transformation“. Ein sanftes Tarot-Programm mit einer kleinen Mission pro Tag, einem Lexikon mit 78 Karten, Legemethoden und einem Familienkreis, der für jeden, den du liebst, Sternzeichen, Aszendent und Seelenkarte enthüllt. Nichts davon verlässt dein Gerät. Schau einmal hinein, ich glaube, es passt zu dir. 🌙\n\nAuch im WhatsApp-Kanal dabei sein: https://whatsapp.com/channel/0029Vb9Izau4IBh8cdFsoZ0Z";
function getT(k){if(k==="rec")return REC;if(k==="o")return OT;if(k==="fall")return fam.length?"✦ Unser Familienkreis\n\n"+fam.map(f=>{const c=calc(f);return`${f.n} ${c.z[1]} ${c.z[0]}${c.asc?" · Aszendent "+c.asc[0]:""} · Seelenkarte ${c.soul.name} · ${c.days===0?"heute Geburtstag 🎉":"Geburtstag in "+c.days+" Tagen"}`}).join("\n")+"\n\nMit Liebe gelegt – 21 Tage Transformation":"";const f=fam.find(x=>"f"+x.id===k);return f?famText(f):""}
function oracle(){if(typeof prof==="undefined"||!prof){$("om").textContent="Bitte speichere zuerst dein Profil oben.";$("oo").innerHTML="";return}
$("om").textContent="";const n=prof.name,d=new Date(),ds=d.toISOString().slice(0,10);
const nm=n.toUpperCase().replace(/Ä/g,"AE").replace(/Ö/g,"OE").replace(/Ü/g,"UE").replace(/ß/g,"SS").replace(/[^A-Z]/g,"").split("").reduce((a,c)=>a+c.charCodeAt(0)-64,0);
let h=0;(n+ds).split("").forEach(c=>h=(h*31+c.charCodeAt(0))>>>0);
const R=[["Deine Startkarte",CARDS[red(dsum(prof.date))]],["Deine Namenskarte",CARDS[red(nm||1)]],["Orakelkarte von heute",CARDS[h%78]]];
const hrs=Math.round(prof.min*21/6)/10,st=prof.date.split("-").reverse().join(".");
OT=`✦ Mein Orakel · ${n}\n`+R.map(r=>`${r[0]}: ${r[1].name} – ${r[1].tip}`).join("\n")+`\nMein Rhythmus: ${prof.cards} Karten und ${prof.min} Minuten täglich\n21 Tage Transformation – Karten legen Mindshift`;
$("oo").innerHTML=`<p class="ol">Für dich, ${esc(n)}: Diese Karten sprechen heute zu dir.</p>`+R.map(r=>`<div class="tg" style="--sc:${r[1].col}">${mc(r[1],r[0])}<div class="ct"><h3>${r[1].name}</h3><p class="kw">${r[1].kw}</p><p>${r[1].up}</p><p class="qs">${r[1].tip}</p></div></div>`).join("")+`<p class="p" style="text-align:center;margin-top:20px">Dein Start am ${st}, ${prof.cards} Karten und ${prof.min} Minuten täglich: In 21 Tagen schenkst du dir ${prof.cards*21} Karten und rund ${hrs} Stunden liebevoller Zuwendung.</p><div class="shr"><button class="btn wa" data-s="wa" data-k="o">Per WhatsApp senden</button><button class="btn tgm" data-s="tg" data-k="o">Per Telegram senden</button><button class="btn o" data-s="cp" data-k="o">Kopieren</button>${navigator.share?'<button class="btn o" data-s="sh" data-k="o">Teilen …</button>':""}</div>`}
$("ob").onclick=oracle;$("sv").addEventListener("click",()=>setTimeout(()=>{if($("oo").innerHTML)oracle()},0));
document.addEventListener("click",e=>{const b=e.target.closest("[data-s]");if(!b)return;const t=getT(b.dataset.k);if(!t){alert("Es gibt noch nichts zu senden. Füge zuerst jemanden zum Familienkreis hinzu oder befrage dein Orakel.");return}
const u=/^https?:/.test(location.href)?location.href:"",k=b.dataset.s,k2=b.dataset.k,old=b.textContent;
if(k==="wa")open("https://wa.me/?text="+encodeURIComponent(t+(u?"\n"+u:"")),"_blank","noopener");
else if(k==="tg")open("https://t.me/share/url?url="+encodeURIComponent(u||" ")+"&text="+encodeURIComponent(t),"_blank","noopener");
else if(k==="sh")navigator.share({text:t,url:u||undefined}).catch(()=>{});
else(navigator.clipboard?navigator.clipboard.writeText(t+(k2==="rec"&&u?"\n"+u:"")):Promise.reject()).then(()=>{b.textContent="Kopiert ✓";setTimeout(()=>b.textContent=old,1800)},()=>{b.textContent="Nicht möglich"})});
})();
