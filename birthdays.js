/* Geburtstage und Grüße */
/* ===== GEBURTSTAGE: Kalender, Orakelkarte des Tages, Gruß per WhatsApp / Telegram / SMS ===== */
(function(){
const root=$("zdk");if(!root)return;
root.insertAdjacentHTML("beforeend",`<div class="zbirth" id="bdy"><div class="zh">✦ Geburtstage deiner Liebsten ✦</div>
<p class="zbs">Trage die Menschen ein, die du liebst. Am Geburtstag öffnet sich beim Besuch der Seite ein Fenster mit der Orakelkarte des Tages und einem Gruß von dir für WhatsApp, Telegram oder SMS.</p>
<p class="zbs" id="bdsub"></p>
<div class="bfm"><div><label for="bn1">Name</label><input id="bn1" maxlength="40" autocomplete="off" placeholder="z. B. Lena"></div>
<div><label for="bd1">Geburtstag (Kalender)</label><input id="bd1" type="date"></div>
<div><label for="bp1">Handynummer (optional)</label><input id="bp1" type="tel" inputmode="tel" autocomplete="off" placeholder="+49 171 1234567"></div>
<div><label for="bsn">Dein Name unter dem Gruß</label><input id="bsn" maxlength="40" autocomplete="off" placeholder="z. B. Frank"></div>
<button class="btn" id="bda" type="button">✦ Geburtstag speichern</button></div>
<div class="msg" id="bmsg" role="status"></div><div class="bl" id="bli"></div>
<p class="bnote" id="bnote">Namen, Geburtstage und Nummern bleiben nur in deinem Browser. Eine Nummer wird erst beim Senden an WhatsApp oder deine SMS-App übergeben. Ohne Nummer wählst du den Empfänger beim Senden selbst aus.</p></div>`);
const KB="et21_bd",KN="et21_bn",KS="et21_bs";
let bd=ls.g(KB,[]),shown=ls.g(KS,{}),q=[],cur=null;
const dlg=$("bdl"),pad=n=>String(n).padStart(2,"0");
const leap=y=>y%4===0&&(y%100!==0||y%400===0);
const todayStr=()=>{const n=new Date();return n.getFullYear()+"-"+pad(n.getMonth()+1)+"-"+pad(n.getDate())};
function occ(b,y){const p=b.d.split("-").map(Number);let d=p[2];if(p[1]===2&&d===29&&!leap(y))d=28;return new Date(y,p[1]-1,d)}
function info(b){const n=new Date(),t0=new Date(n.getFullYear(),n.getMonth(),n.getDate());let nx=occ(b,t0.getFullYear());if(nx<t0)nx=occ(b,t0.getFullYear()+1);return{days:Math.round((nx-t0)/864e5),age:nx.getFullYear()-(+b.d.slice(0,4))}}
function all(){return bd.concat(fam.filter(f=>!bd.some(b=>b.n===f.n&&b.d===f.d)).map(f=>({id:"f"+f.id,n:f.n,d:f.d,p:"",fam:true})))}
function tel(p){let s=String(p||"").trim();if(!s)return"";const pl=s[0]==="+";s=s.replace(/\D/g,"");if(!s)return"";if(!pl){if(s.startsWith("00"))s=s.slice(2);else if(s[0]==="0")s="49"+s.slice(1)}return s.length>=8&&s.length<=15?s:""}
const sender=()=>$("bsn").value.trim()||(typeof prof!=="undefined"&&prof?prof.name:"");
function cardFor(b){let h=0;(b.n+b.d+todayStr()).split("").forEach(c=>h=(h*31+c.charCodeAt(0))>>>0);return CARDS[h%CARDS.length]}
function msgFor(b,c,i){const s=sender(),u=/^https?:/.test(location.href)?location.href:"";
return`🎂 Alles Liebe zum ${i.days===0?i.age+". ":""}Geburtstag, ${b.n}! ✨\n\nIch wünsche dir einen Tag voller Wärme, Freude und schöner Momente.\n\nDeine Orakelkarte für heute: ${c.name} – ${c.tip}\n\nUnd weil du mir wichtig bist, schenke ich dir einen Blick in mein kleines Kartenreich: „21 Tage Transformation – Karten legen Mindshift“ mit Tarot, Kartenlexikon und Sternzeichen.${u?"\n"+u:""}\n\nVon Herzen${s?", "+s:""} 💛`}
function openB(b){const i=info(b),c=cardFor(b);cur=b;
$("bdb").innerHTML=`<div class="bdg">${i.days===0?"Heute hat "+esc(b.n)+" Geburtstag! 🎉":esc(b.n)+" hat in "+i.days+(i.days===1?" Tag":" Tagen")+" Geburtstag"}</div>
<div class="bdc" style="--sc:${c.col}">${mc(c,"Orakelkarte des Tages")}<div class="ct bdt"><h3>${esc(c.name)}</h3><p class="kw">${esc(c.kw)}</p><p>${esc(c.up)}</p><p class="qs">${esc(c.tip)}</p></div></div>
<label for="bdm">Dein Gruß (du kannst ihn frei ändern)</label><textarea id="bdm"></textarea>
<div class="shr"><button class="btn wa" data-x="wa">WhatsApp</button><button class="btn tgm" data-x="tg">Telegram</button><button class="btn sms" data-x="sm">SMS</button>${navigator.share?'<button class="btn o" data-x="sh">Teilen …</button>':""}<button class="btn o" data-x="cp">Kopieren</button></div>
<p class="bhint">${tel(b.p)?"Der Gruß geht direkt an die gespeicherte Nummer.":"Du wählst den Empfänger beim Senden selbst aus."} SMS öffnet sich auf dem Smartphone in deiner Nachrichten-App.</p>`;
$("bdm").value=msgFor(b,c,i);if(!dlg.open)dlg.showModal();$("bdb").scrollTop=0}
$("bdb").addEventListener("click",e=>{const b=e.target.closest("[data-x]");if(!b||!cur)return;const t=$("bdm").value,ph=tel(cur.p),k=b.dataset.x,old=b.textContent;
if(k==="wa")open("https://wa.me/"+ph+"?text="+encodeURIComponent(t),"_blank","noopener");
else if(k==="tg")open("https://t.me/share/url?url="+encodeURIComponent(" ")+"&text="+encodeURIComponent(t),"_blank","noopener");
else if(k==="sm")location.href="sms:"+(ph?"+"+ph:"")+"?&body="+encodeURIComponent(t);
else if(k==="sh")navigator.share({text:t}).catch(()=>{});
else(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{b.textContent="Kopiert ✓";setTimeout(()=>b.textContent=old,1800)},()=>{b.textContent="Nicht möglich"})});
$("bdx").onclick=()=>dlg.close();dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
function next(){const b=q.shift();if(!b)return;shown[b.id]=todayStr();ls.s(KS,shown);openB(b)}
dlg.addEventListener("close",()=>{if(q.length)setTimeout(next,400)});
function check(){if(document.documentElement.classList.contains("exp"))return true;if($("gate").classList.contains("show")||dlg.open)return false;
q=all().filter(b=>info(b).days===0&&shown[b.id]!==todayStr());if(q.length)next();return true}
const ZN=["Widder","Stier","Zwillinge","Krebs","Löwe","Jungfrau","Waage","Skorpion","Schütze","Steinbock","Wassermann","Fische"],ZY=["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"],ZE=["Feuer","Erde","Luft","Wasser"],CUT=[321,420,521,621,723,823,923,1023,1122,1222];
function sgn(b){const p=b.d.split("-").map(Number),v=p[1]*100+p[2];if(v>=1222||v<120)return 9;if(v<219)return 10;if(v<321)return 11;return CUT.filter(c=>v>=c).length-1}
function sub(){const el=$("bdsub");if(!el)return;const p=document.querySelector('#zrw button[aria-pressed="true"]'),i=p?+p.dataset.i:-1;if(i<0){el.textContent="";return}
const nm=all().filter(b=>sgn(b)===i).map(b=>b.n);el.textContent=ZY[i]+"︎ "+(nm.length?"Im Zeichen "+ZN[i]+" geboren: "+nm.join(", "):"Im Zeichen "+ZN[i]+" ist noch niemand in deinem Kreis.")}
function render(){const L=all().map(b=>({b,i:info(b),z:sgn(b)})).sort((x,y)=>x.i.days-y.i.days);
$("bli").innerHTML=L.length?L.map(({b,i,z})=>`<div class="bi2${i.days===0?" today":""}"><div class="ps"><span class="sg" style="--zg:${EC[ZE[z%4]]}" aria-hidden="true">${ZY[z]}&#xFE0E;</span><div><b>${esc(b.n)}</b><span class="m">${ZN[z]} · ${b.d.split("-").reverse().join(".")} · wird ${i.age} · ${i.days===0?"heute Geburtstag 🎉":"noch "+i.days+(i.days===1?" Tag":" Tage")}${b.fam?" · aus dem Familienkreis":""}</span></div></div><div class="a"><button class="btn" data-g="${b.id}">🎂 Gruß senden</button>${b.fam?"":`<button class="btn o" data-r="${b.id}">Entfernen</button>`}</div></div>`).join(""):'<p class="p" style="text-align:center;margin-top:18px">Noch keine Geburtstage gespeichert. Trage oben den ersten Menschen ein, der dir am Herzen liegt.</p>';sub()}
$("bli").addEventListener("click",e=>{const g=e.target.closest("[data-g]"),r=e.target.closest("[data-r]");
if(g){const b=all().find(x=>String(x.id)===g.dataset.g);if(b)openB(b)}
if(r){bd=bd.filter(x=>String(x.id)!==r.dataset.r);ls.s(KB,bd);render()}});
$("bda").onclick=()=>{const n=$("bn1").value.trim(),d=$("bd1").value,p=$("bp1").value.trim(),m=$("bmsg");
if(!n||!d){m.textContent="Bitte Name und Geburtstag eintragen.";return}
if(new Date(d)>new Date()){m.textContent="Dieser Geburtstag liegt in der Zukunft. Bitte das Geburtsdatum wählen.";return}
if(p&&!tel(p)){m.textContent="Die Nummer sieht ungewöhnlich aus. Schreibe sie z. B. als +49 171 1234567 oder lass das Feld leer.";return}
bd.push({id:Date.now(),n,d,p});ls.s(KB,bd);$("bn1").value="";$("bd1").value="";$("bp1").value="";m.textContent="✦ "+n+" wurde gespeichert.";render()};
$("bsn").value=ls.g(KN,"")||(typeof prof!=="undefined"&&prof?prof.name:"");
$("bsn").addEventListener("input",()=>ls.s(KN,$("bsn").value.trim()));
if(!/^https?:/.test(location.href))$("bnote").insertAdjacentHTML("beforeend"," Der Link zur Seite wird automatisch in den Gruß eingefügt, sobald sie online ist.");
const rf=renderFam;renderFam=function(){rf();render()};
root.addEventListener("click",e=>{if(e.target.closest("#zrw,#zbk"))setTimeout(sub,0)});setInterval(()=>{if(!document.hidden)sub()},60000);
render();const iv=setInterval(()=>{if(check())clearInterval(iv)},1200);
})();
