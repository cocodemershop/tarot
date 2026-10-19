/* Startseite: Deck-Galerie, Großansicht, Schutz der Bilder und Texte */
(function(){
const D=[["g0","Der Narr","Unschuld"],["g1","Der Magier","Willen & Schöpfung"],["g2","Die Hohepriesterin","Weisheit"],["g3","Die Herrscherin","Schöpfung & Wachstum"],["g4","Der Herrscher","Imperium"],["g5","Der Hierophant","Tradition"],["g6","Die Liebenden","Liebe"],["g7","Der Wagen","Sieg"],["g8","Die Kraft","Mut"],["g9","Der Eremit","Innehalten"],["g10","Das Schicksalsrad","Wandel"],["g11","Die Gerechtigkeit","Klarheit"],["g12","Der Gehängte","Hingabe"],["g13","Der Tod","Transformation"],["g14","Die Mäßigkeit","Harmonie"],["g15","Der Teufel","Befreiung"],["g16","Der Turm","Durchbruch"],["g17","Der Stern","Hoffnung"],["g18","Der Mond","Unterbewusstsein"],["g19","Die Sonne","Lebensfreude"],["g20","Das Gericht","Neuanfang"],["g21","Die Welt","Vollendung"],["s0_0","Ass der Stäbe","Inspiration"],["s0_1","Zwei der Stäbe","Planung"],["s0_2","Drei der Stäbe","Abenteuer"],["s0_3","Vier der Stäbe","Feier"],["s0_4","Fünf der Stäbe","Konflikt"],["s0_5","Sechs der Stäbe","Triumph"],["s0_6","Sieben der Stäbe","Standhaftigkeit"],["s0_7","Acht der Stäbe","Schnelligkeit"],["s0_8","Neun der Stäbe","Schutz"],["s0_9","Zehn der Stäbe","Verantwortung"],["s0_10","Bube der Stäbe","Neugier"],["s0_11","Ritter der Stäbe","Leidenschaft"],["s0_12","Königin der Stäbe","Ausstrahlung"],["s0_13","König der Stäbe","Visionskraft"],["s1_0","Ass der Kelche","Herzöffnung"],["s1_1","Zwei der Kelche","Verbindung"],["s1_2","Drei der Kelche","Gemeinschaft"],["s1_3","Vier der Kelche","Neubetrachtung"],["s1_4","Fünf der Kelche","Loslassen"],["s1_5","Sechs der Kelche","Nostalgie"],["s1_6","Sieben der Kelche","Tagträume"],["s1_7","Acht der Kelche","Aufbruch"],["s1_8","Neun der Kelche","Wunscherfüllung"],["s1_9","Zehn der Kelche","Familienglück"],["s1_10","Bube der Kelche","Träume"],["s1_11","Ritter der Kelche","Romantik"],["s1_12","Königin der Kelche","Mitgefühl"],["s1_13","König der Kelche","Gelassenheit"],["s2_0","Ass der Schwerter","Erkenntnis"],["s2_1","Zwei der Schwerter","Unentschlossenheit"],["s2_2","Drei der Schwerter","Herzschmerz"],["s2_3","Vier der Schwerter","Ruhe"],["s2_4","Fünf der Schwerter","Niederlage"],["s2_5","Sechs der Schwerter","Übergang"],["s2_6","Sieben der Schwerter","Strategie"],["s2_7","Acht der Schwerter","Blockade"],["s2_8","Neun der Schwerter","Sorgen"],["s2_9","Zehn der Schwerter","Wendepunkt"],["s2_10","Bube der Schwerter","Wissbegier"],["s2_11","Ritter der Schwerter","Entschlossenheit"],["s2_12","Königin der Schwerter","Klare Grenzen"],["s2_13","König der Schwerter","Geisteskraft"],["s3_0","Ass der Münzen","Chance"],["s3_1","Zwei der Münzen","Flexibilität"],["s3_2","Drei der Münzen","Zusammenarbeit"],["s3_3","Vier der Münzen","Stabilität"],["s3_4","Fünf der Münzen","Durchhaltevermögen"],["s3_5","Sechs der Münzen","Freigebigkeit"],["s3_6","Sieben der Münzen","Geduld & Wahrnehmung"],["s3_7","Acht der Münzen","Meisterschaft & Fleiß"],["s3_8","Neun der Münzen","Genuss"],["s3_9","Zehn der Münzen","Vermächtnis"],["s3_10","Bube der Münzen","Lernfreude"],["s3_11","Ritter der Münzen","Effizienz"],["s3_12","Königin der Münzen","Fürsorge"],["s3_13","König der Münzen","Reichtum & Erdung"]];
const $=id=>document.getElementById(id);
const rail=$("mxrail"),dlg=$("mxl");
if(rail&&dlg){
let list=D,cur=0,built=false;
const card=(c,i)=>'<button class="mx-card" type="button" data-i="'+i+'" aria-label="'+c[1]+' ansehen"><img src="cards/t/'+c[0]+'.webp" alt="'+c[1]+' · '+c[2]+'" width="210" height="360" loading="lazy" decoding="async" draggable="false"></button>';
function render(g){list=g==="all"?D:g==="g"?D.slice(0,22):D.filter(c=>c[0].indexOf(g+"_")===0);
 rail.innerHTML=list.map(card).join("");rail.scrollLeft=0;built=true}
const go=()=>{if(!built)render("all")};
if("IntersectionObserver" in window){const o=new IntersectionObserver(e=>{if(e[0].isIntersecting){o.disconnect();go()}},{rootMargin:"600px 0px"});o.observe(rail)}else go();
document.querySelectorAll(".mx-chips button").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".mx-chips button").forEach(x=>x.setAttribute("aria-pressed",x===b));render(b.dataset.g)}));
function show(i){cur=(i+list.length)%list.length;const c=list[cur],im=$("mxli");
 im.src="cards/"+c[0]+".jpg";im.alt=c[1]+" · "+c[2];$("mxln").textContent=c[1];$("mxlk").textContent=c[2];
 $("mxlc").textContent=(cur+1)+" / "+list.length;
 const nx=list[(cur+1)%list.length];(new Image).src="cards/"+nx[0]+".jpg"}
rail.addEventListener("click",e=>{const b=e.target.closest(".mx-card");if(!b)return;show(+b.dataset.i);dlg.showModal()});
$("mxlp").onclick=()=>show(cur-1);$("mxlnx").onclick=()=>show(cur+1);$("mxlx").onclick=()=>dlg.close();
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
dlg.addEventListener("keydown",e=>{if(e.key==="ArrowRight")show(cur+1);if(e.key==="ArrowLeft")show(cur-1)});
let sx=null;dlg.addEventListener("touchstart",e=>{sx=e.touches[0].clientX},{passive:true});
dlg.addEventListener("touchend",e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>45)show(cur+(dx<0?1:-1))},{passive:true});
}
/* Kopierschutz: kein Rechtsklick und kein Ziehen bei Bildern, kein Kopieren von Texten außerhalb von Eingabefeldern */
const free=t=>t&&t.closest&&t.closest("input,textarea,select,[contenteditable=true],#lg .lgb");
document.addEventListener("contextmenu",e=>{if(!free(e.target))e.preventDefault()});
document.addEventListener("dragstart",e=>{if(e.target&&e.target.tagName==="IMG")e.preventDefault()});
["copy","cut"].forEach(t=>document.addEventListener(t,e=>{const sel=getSelection();if(free(document.activeElement)||(sel&&sel.anchorNode&&free(sel.anchorNode.parentElement)))return;e.preventDefault();
 if(e.clipboardData)e.clipboardData.setData("text/plain","© Kartenreich · Inhalte und Kartenbilder sind urheberrechtlich geschützt. https://cocodemershop.github.io/tarot/")}));
})();
