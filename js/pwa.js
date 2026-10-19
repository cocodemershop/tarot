/* App-Verhalten: Installation, Offline, Zugangsdauer */
/* ===== APP: Animationen nur sichtbar, Installation, Offline ===== */
(function(){
const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle("vis",e.isIntersecting)),{root:$("trk"),threshold:.1});
const ob=()=>$("trk").querySelectorAll(".sl").forEach(x=>io.observe(x));const b0=build;build=function(){b0();ob()};ob();
if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol))addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
const sa=matchMedia("(display-mode: standalone)").matches||navigator.standalone;
if(!sa){$("legal").insertAdjacentHTML("beforeend",'<button class="lnk" id="inst">📲 Als App installieren</button>');let dp;
const ov=()=>$("gate").classList.contains("show")?"hidden":"";
function guide(){const ua=navigator.userAgent,ios=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1),saf=/Safari/.test(ua)&&!/Chrome|Chromium|Edg|OPR/.test(ua);
const st=ios?["Tippe in Safari auf das Teilen-Symbol (Quadrat mit Pfeil nach oben).","Scrolle im Menü und wähle „Zum Home-Bildschirm“.","Tippe oben rechts auf „Hinzufügen“. Mindshift liegt nun als App auf deinem Startbildschirm."]:saf?["Wähle in der Menüleiste „Ablage“.","Klicke auf „Zum Dock hinzufügen“.","Bestätige mit „Hinzufügen“. Mindshift öffnet sich nun wie eine eigene Mac-App."]:["Öffne das Browser-Menü (drei Punkte) oder klicke auf das Installieren-Symbol in der Adressleiste.","Wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.","Bestätige. Mindshift erscheint als App auf deinem Gerät."];
let im=$("im");if(!im){im=document.createElement("div");im.className="gate";im.id="im";im.setAttribute("role","dialog");im.setAttribute("aria-modal","true");document.body.appendChild(im)}
im.innerHTML=`<div class="gb"><div class="ey">✦ Als App installieren ✦</div><h2>So geht es in drei Schritten</h2><ol class="stp" style="--sc:#e8b45a;margin:16px 0">${st.map(t=>`<li>${t}</li>`).join("")}</ol>${ios?'<p class="ctr" style="font-size:.85rem">Bitte öffne die Seite dafür direkt in Safari, nicht aus einer anderen App heraus.</p>':""}<div class="row"><button class="btn" id="imx">Verstanden</button></div></div>`;
im.classList.add("show");document.documentElement.style.overflow="hidden";$("imx").onclick=()=>{im.classList.remove("show");document.documentElement.style.overflow=ov()}}
function inst(){if(dp){dp.prompt();if(dp.userChoice)dp.userChoice.then(()=>{dp=null});return}guide()}
function hideIb(p){const e=$("ib");if(e)e.remove();ls.s("et21_ib",p?9e15:Date.now())}
function showIb(){if(Date.now()-ls.g("et21_ib",0)<6048e5||$("ib")||document.documentElement.classList.contains("exp"))return;
document.querySelector(".bar").insertAdjacentHTML("beforebegin",'<div class="ib" id="ib"><span>📲 Kartenreich als App auf deinen Startbildschirm</span><button class="btn" id="ibi">Installieren</button><button class="lnk" id="ibx">Später</button></div>');$("ibi").onclick=inst;$("ibx").onclick=()=>hideIb(false)}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();dp=e});addEventListener("appinstalled",()=>hideIb(true));
$("inst").onclick=inst;const iv=setInterval(()=>{if(!$("gate").classList.contains("show")){clearInterval(iv);setTimeout(showIb,1500)}},1000)}
/* Drei Monate Zugang, danach schließt sich das Programm von selbst */
const KF="et21_first",DAYS=90;let fs=ls.g(KF,null);if(!fs){const g0=ls.g("et21_gate",null);fs=(g0&&g0.t)||Date.now();ls.s(KF,fs)}
const left=DAYS-Math.floor((Date.now()-fs)/864e5),br=document.querySelector(".bar");
if(br)br.insertAdjacentHTML("beforeend",`<span>⏳ Zugang: noch ${Math.max(0,left)} Tage</span>`);
if(left<=0){document.documentElement.classList.add("exp");if(window.et21Stop)window.et21Stop();
const d=document.createElement("div");d.className="gate show";d.id="ex";d.innerHTML='<div class="gb"><div class="ey">✦ Ein Kreis schließt sich ✦</div><h2>Deine drei Monate sind vollendet</h2><p class="ctr">Danke, dass du dir 90 Tage Zeit für dich und deine Karten geschenkt hast. Das Programm schließt sich nun. Alles, was du hier eingetragen hast, ist dein Schatz: Sichere es mit einem Klick, bevor du gehst.</p><p class="ctr">Wenn du weitergehen möchtest, begleite uns von Herzen gern im WhatsApp-Kanal.</p><div class="row"><button class="btn" id="exd">Meine Daten sichern</button><a class="btn o" href="https://whatsapp.com/channel/0029Vb9Izau4IBh8cdFsoZ0Z" target="_blank" rel="noopener">Wir bleiben in Kontakt</a></div></div>';
document.body.appendChild(d);document.documentElement.style.overflow="hidden";
$("exd").onclick=()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=localStorage.getItem(k)}const b=new Blob([JSON.stringify(o,null,1)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="mein-kartenreich-sicherung.json";a.click()}}
})();

/* Legemethoden: Rondell passt seine Höhe der Karte an */
(function(){const t=$("ltrk");function fit(){const c=t.children[lgC];if(c)t.style.height=c.offsetHeight+"px"}
const a=lgSet;lgSet=function(i){a(i);fit()};const b=lgBuild;lgBuild=function(){b();fit()};
addEventListener("resize",fit);addEventListener("load",fit);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);fit()})();
