/* Tierkreis-Anzeige */
/* ===== TIERKREIS-ANZEIGE: aktuelles Zeichen automatisch, das ganze Jahr ===== */
(function(){
const root=document.getElementById("zdk");if(!root)return;
const V="\uFE0E";
const Z=[
["♈","Widder","21. März – 19. April","Feuer","Kardinal","Mars","Der Herrscher","#ff9a6b","Mut, Anfang und Tatkraft: Der Widder öffnet die Tür und geht als Erster hindurch.","Wofür lohnt es sich, jetzt den ersten Schritt zu gehen?"],
["♉","Stier","20. April – 20. Mai","Erde","Fix","Venus","Der Hohepriester","#9fcf86","Beständigkeit, Genuss und Verlässlichkeit: Der Stier lädt dich ein, im Körper anzukommen.","Was nährt mich wirklich, und was darf ich mir gönnen?"],
["♊","Zwillinge","21. Mai – 20. Juni","Luft","Veränderlich","Merkur","Die Liebenden","#ffe27a","Neugier, Austausch und Leichtigkeit: Die Zwillinge sehen immer zwei Seiten und lieben das Gespräch.","Was möchte ich gerade lernen, sagen oder erzählen?"],
["♋","Krebs","21. Juni – 22. Juli","Wasser","Kardinal","Mond","Der Wagen","#a9c6ff","Geborgenheit, Gefühl und Fürsorge: Der Krebs erinnert dich an dein inneres Zuhause.","Wo darf ich mir selbst ein sicherer Hafen sein?"],
["♌","Löwe","23. Juli – 22. August","Feuer","Fix","Sonne","Die Kraft","#ffb347","Herz, Ausdruck und Großzügigkeit: Der Löwe zeigt, was in dir leuchten will.","Was bringt mich zum Strahlen, ohne dass ich es beweisen muss?"],
["♍","Jungfrau","23. August – 22. September","Erde","Veränderlich","Merkur","Der Eremit","#b7d68a","Klarheit, Sorgfalt und Dienst: Die Jungfrau ordnet, verfeinert und sieht das Wesentliche.","Was darf ich ordnen, und was darf unperfekt bleiben?"],
["♎","Waage","23. September – 22. Oktober","Luft","Kardinal","Venus","Die Gerechtigkeit","#f4a6d7","Harmonie, Fairness und Beziehung: Die Waage sucht Ausgleich und das schöne Maß.","Wo suche ich Ausgleich, ohne mich selbst dabei zu vergessen?"],
["♏","Skorpion","23. Oktober – 21. November","Wasser","Fix","Pluto","Der Tod","#c78bff","Tiefe, Wandlung und Wahrhaftigkeit: Der Skorpion schaut hinter die Fassade und wandelt.","Was darf ich loslassen, damit Neues entstehen kann?"],
["♐","Schütze","22. November – 21. Dezember","Feuer","Veränderlich","Jupiter","Die Mäßigkeit","#ff9a6b","Weite, Sinn und Zuversicht: Der Schütze richtet den Blick zum Horizont.","Wohin zieht es mich, wenn ich ganz frei wählen dürfte?"],
["♑","Steinbock","22. Dezember – 19. Januar","Erde","Kardinal","Saturn","Der Teufel","#9fcf86","Struktur, Ausdauer und Verantwortung: Der Steinbock baut Schritt für Schritt am Gipfel.","Welches Ziel verdient meine Geduld und meine Kraft?"],
["♒","Wassermann","20. Januar – 18. Februar","Luft","Fix","Uranus","Der Stern","#8fd8ff","Freiheit, Ideen und Gemeinschaft: Der Wassermann denkt voraus und liebt das Ungewöhnliche.","Was darf ich anders denken als bisher?"],
["♓","Fische","19. Februar – 20. März","Wasser","Veränderlich","Neptun","Der Mond","#9db4ff","Intuition, Mitgefühl und Träume: Die Fische spüren, was zwischen den Zeilen liegt.","Was flüstert mir meine innere Stimme gerade zu?"]];
const lam=()=>{const n=(Date.now()-Date.UTC(2000,0,1,12))/864e5,L=(280.46+.9856474*n)%360,g=(357.528+.9856003*n)*Math.PI/180;const l=(L+1.915*Math.sin(g)+.02*Math.sin(2*g))%360;return l<0?l+360:l};
let cur=-1,view=-1,deg=0;
root.setAttribute("aria-live","polite");
root.innerHTML='<div class="zh">✦ Tierkreiszeichen jetzt ✦</div><div class="zmain"><div class="zsy" id="zsy" aria-hidden="true"></div><div class="zin" id="zin"></div></div><div class="zpr" id="zpr"><div class="zbar"><i id="zpf"></i></div><small id="zpt"></small></div><p class="zx" id="zx"></p><p class="zq" id="zq"></p><div class="zrow" id="zrw" role="group" aria-label="Alle zwölf Tierkreiszeichen">'+Z.map((z,i)=>`<button type="button" data-i="${i}" aria-pressed="false" aria-label="${z[1]} anzeigen"><b>${z[0]+V}</b><small>${z[1]}</small></button>`).join("")+'</div><button type="button" class="zbk" id="zbk" hidden>↺ Zurück zu heute</button>';
const $z=id=>document.getElementById(id);
function paint(){
 const z=Z[view],now=view===cur;
 root.style.setProperty("--zc",z[7]);
 $z("zsy").textContent=z[0]+V;
 $z("zin").innerHTML=`<div class="znm"><h3>${z[1]}</h3>${now?'<span class="zbd">Aktuell</span>':""}</div><p class="zdt">ca. ${z[2]}</p><p class="zfa">Element ${z[3]} · ${z[4]} · Herrscher ${z[5]} · Tarot: ${z[6]}</p>`;
 $z("zx").textContent=z[8];$z("zq").textContent="„"+z[9]+"“";
 const pr=$z("zpr");pr.hidden=!now;
 if(now){$z("zpf").style.width=(deg/30*100).toFixed(1)+"%";const d=Math.max(1,Math.ceil((30-deg)/.9856));$z("zpt").textContent=`Die Sonne wandert gerade durch ${z[1]}: noch etwa ${d} ${d===1?"Tag":"Tage"} bis ${Z[(cur+1)%12][1]}`}
 $z("zrw").querySelectorAll("button").forEach((b,i)=>{b.setAttribute("aria-pressed",i===view);b.classList.toggle("zn",i===cur)});
 $z("zbk").hidden=now;
}
function tick(){const l=lam(),i=Math.floor(l/30)%12;deg=l%30;const was=cur;cur=i;if(view<0||view===was)view=cur;paint()}
$z("zrw").onclick=e=>{const b=e.target.closest("button[data-i]");if(!b)return;view=+b.dataset.i;paint()};
$z("zbk").onclick=()=>{view=cur;paint()};
tick();setInterval(()=>{if(!document.hidden)tick()},60000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)tick()});
})();
