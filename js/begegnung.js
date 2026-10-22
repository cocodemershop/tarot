/* Kartenreich · „Erst selbst deuten – dann Bedeutung entdecken“
   Fünf Schritte: 1 Karte entdecken · 2 Erster Blick · 3 Bedeutung · 4 Vergleich · 5 Abschluss
   + Journal „Meine Begegnungen“ mit Sammlung (wie viele der 78 Karten dir schon begegnet sind).

   Daten:  nutzt CARDS aus js/cards.js (keine zweite Kartenliste) und den Speicher-Helfer ls.
   Speicher (nur im Browser, nichts wird übertragen):
     kr_begegnungen   gespeicherte Begegnungen (Journal)
     kr_beg_entwurf   die laufende Begegnung, damit nichts verloren geht
     sessionStorage kr_beg_sitzung   in dieser Sitzung gezogene Karten (keine Doppelten)
   Optional: window.KR_SYMBOLE = { g0: ["Weiße Rose: …", …], … } ergänzt geprüfte Symbol-Texte.
   Ohne diese Daten wird der Abschnitt „Zentrale Symbole“ einfach nicht angezeigt. */
(function(){
"use strict";
var DECK=(typeof CARDS!=="undefined"&&CARDS&&CARDS.length===78)?CARDS:null;
var dlg=document.getElementById("bgd"),body=document.getElementById("bgBody"),prog=document.getElementById("bgProg");
if(!DECK||!dlg||!body||!prog)return;

/* ---------- Speicher ---------- */
var S=(typeof ls!=="undefined"&&ls&&ls.g)?ls:{
  g:function(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},
  s:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
var KJ="kr_begegnungen",KD="kr_beg_entwurf",KS="kr_beg_sitzung";
function journal(){var j=S.g(KJ,[]);return Array.isArray(j)?j.filter(function(e){return e&&byId(e.cid)}):[]}
function saveJournal(j){S.s(KJ,j.slice(0,400))}
function draft(){var d=S.g(KD,null);return d&&d.cid&&byId(d.cid)?d:null}
function saveDraft(){if(D)S.s(KD,D)}
function clearDraft(){D=null;try{localStorage.removeItem(KD)}catch(e){}}
function sess(){try{return JSON.parse(sessionStorage.getItem(KS)||"[]")}catch(e){return []}}
function addSess(id){var a=sess();if(a.indexOf(id)<0)a.push(id);try{sessionStorage.setItem(KS,JSON.stringify(a))}catch(e){}}

/* ---------- Hilfen ---------- */
function byId(id){for(var i=0;i<DECK.length;i++)if(DECK[i].id===id)return DECK[i];return null}
function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function nl(t){return esc(t).replace(/\n/g,"<br>")}
var RM=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches);
function rnd(n){try{var a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n}catch(e){return Math.floor(Math.random()*n)}}
function fmt(iso){try{var d=new Date(iso);return d.toLocaleDateString("de-DE",{day:"numeric",month:"long",year:"numeric"})+", "+d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})+" Uhr"}catch(e){return ""}}
function toast(m){if(typeof SOC!=="undefined"&&SOC.toast)SOC.toast(m)}
var maj=function(c){return c.grp==="g"};
function sub(c){return maj(c)?"Große Arkana · "+c.num:c.name.split(" der ")[1]+" · Element "+c.kw.split(":")[0]}
function keys(c){return(maj(c)?c.kw:c.kw.split(":")[1]||"").split(",").map(function(x){return x.trim()}).filter(Boolean)}

/* Karte ziehen: in dieser Sitzung keine Doppelten; noch nicht begegnete Karten bevorzugt */
function drawCard(){
  var seen=sess(),met={};journal().forEach(function(e){met[e.cid]=1});
  var pool=DECK.filter(function(c){return seen.indexOf(c.id)<0});
  if(!pool.length){try{sessionStorage.removeItem(KS)}catch(e){}pool=DECK.slice()}
  var fresh=pool.filter(function(c){return !met[c.id]});
  var from=fresh.length?fresh:pool,c=from[rnd(from.length)];addSess(c.id);return c;
}

/* ---------- Inhalte ---------- */
var TERMS=["Aufbruch","Veränderung","Mut","Zweifel","Freiheit","Ruhe","Verlust","Hoffnung","Kraft","Ungewissheit","Nähe","Spannung"];
var STEPS=["Entdecken","Erster Blick","Bedeutung","Vergleich","Abschluss"];
var LEVELS=[[1,"Erster Blick"],[5,"Beobachten"],[12,"Bilder lesen"],[22,"Symbole verstehen"],[40,"Tiefer sehen"],[78,"Das ganze Kartenreich"]];
var FINALQ=["Wo könnte dir diese Karte in den nächsten Tagen im Alltag wiederbegegnen?",
  "Wenn du in einer Woche auf diese Begegnung zurückschaust: Was soll dann anders sein?",
  "Welcher kleine Schritt passt heute zu dem, was du mitnimmst?",
  "Was würdest du einem Menschen, den du magst, über diese Karte erzählen?"];
function reflectQ(c){
  if(!maj(c))return c.tip;
  var k=keys(c)[0]||c.name;
  return "Wo begegnet dir „"+k+"“ gerade in deinem Leben, und was möchtest du damit tun?";
}
function level(n){var l=null;for(var i=0;i<LEVELS.length;i++)if(n>=LEVELS[i][0])l=LEVELS[i];return l}
function nextLevel(n){for(var i=0;i<LEVELS.length;i++)if(n<LEVELS[i][0])return LEVELS[i];return null}
function metCount(){var m={};journal().forEach(function(e){m[e.cid]=1});return Object.keys(m).length}

/* Überschneidungen: Worte der Besucherin, die auch in der traditionellen Deutung vorkommen.
   Keine Bewertung, nur ein Spiegel. */
var STOP="aber alle allem auch dass dein deine deinem deinen deiner diese dieser dieses doch eine einem einen einer etwas habe haben hier ihre immer jetzt kann karte karten keine mehr mich mein meine meinem meinen mir nach nicht noch oder schon sehr sein seine sich sind über und unter viel vielleicht weil wenn werden wird wieder wird zwischen zwei bild bilde bildes".split(" ");
function stem(w){return w.toLowerCase().replace(/[^a-zäöüß]/g,"").slice(0,6)}
function overlap(c,d){
  var txt=(c.kw+" "+c.up+" "+c.rv+" "+(c.tip||"")+" "+(maj(c)?"":c.rank+" "+(c.sw||""))).toLowerCase();
  var words=(d.terms||[]).slice();
  [d.a1,d.a2,d.a3].forEach(function(a){(a||"").split(/[\s,.;:!?„“"()\-–]+/).forEach(function(w){if(w.length>=5&&STOP.indexOf(w.toLowerCase())<0)words.push(w)})});
  var out=[],seen={};
  words.forEach(function(w){var s=stem(w);if(s.length<4||seen[s])return;seen[s]=1;
    var re=new RegExp("(^|[^a-zäöüß])"+s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));if(re.test(txt))out.push(w.charAt(0).toUpperCase()+w.slice(1))});
  return out.slice(0,8);
}

/* ---------- Zustand ---------- */
var D=null,VIEW="flow",JSEL=null,newLevel=null;
function newDraft(c){D={v:1,cid:c.id,step:1,max:1,t0:new Date().toISOString(),a1:"",a2:"",a3:"",terms:[],held:false,r1:"",r2:"",r3:"",pick:"",take:"",note:"",fq:rnd(FINALQ.length),eid:null,flip:true};saveDraft()}

/* ---------- Fortschrittsanzeige ---------- */
function renderProg(){
  if(VIEW!=="flow"||!D){prog.hidden=true;return}
  prog.hidden=false;
  prog.innerHTML=STEPS.map(function(l,i){var n=i+1,cur=n===D.step,ok=n<=D.max&&(n!==1||true);
    return '<li class="'+(cur?"cur ":"")+(n<D.step?"done ":"")+'"><button type="button" data-go="'+n+'"'+(ok&&!cur?"":" disabled")+(cur?' aria-current="step"':"")+'><i>'+n+'</i><span>'+l+'</span></button></li>'}).join("");
}

/* ---------- Kartenbild mit Lupe ---------- */
function cardFig(c,cls){
  return '<figure class="bg-fig '+(cls||"")+'"><div class="bg-zoom" data-src="cards/'+c.id+'.webp"><img src="cards/'+c.id+'.webp" alt="'+esc(c.name)+'" width="480" height="823" decoding="async" draggable="false"></div>'+
    '<button class="bg-lupe" type="button" aria-pressed="false" title="Mit der Lupe Details ansehen"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg> Lupe</button></figure>';
}
function bindLupe(root){
  var fig=root.querySelector(".bg-fig");if(!fig)return;
  var z=fig.querySelector(".bg-zoom"),b=fig.querySelector(".bg-lupe"),lens=null,on=false;
  function place(x,y){var r=z.getBoundingClientRect();var px=x-r.left,py=y-r.top;if(px<0||py<0||px>r.width||py>r.height){lens.style.opacity="0";return}
    var Z=2.6,L=lens.offsetWidth/2;lens.style.opacity="1";lens.style.transform="translate("+(px-L)+"px,"+(py-L)+"px)";
    lens.style.backgroundSize=(r.width*Z)+"px "+(r.height*Z)+"px";lens.style.backgroundPosition=(-(px*Z-L))+"px "+(-(py*Z-L))+"px"}
  function mv(e){if(on)place(e.clientX,e.clientY)}
  b.addEventListener("click",function(){on=!on;b.setAttribute("aria-pressed",String(on));z.classList.toggle("lupe-on",on);
    if(on&&!lens){lens=document.createElement("div");lens.className="bg-lens";lens.setAttribute("aria-hidden","true");lens.style.backgroundImage="url("+z.dataset.src+")";z.appendChild(lens)}
    if(lens){if(on){var r=z.getBoundingClientRect();place(r.left+r.width/2,r.top+r.height*.4)}else lens.style.opacity="0"}
    if(on)toast("Lupe an: Fahre über die Karte oder ziehe mit dem Finger.")});
  z.addEventListener("pointermove",mv);z.addEventListener("pointerdown",function(e){if(on){place(e.clientX,e.clientY);try{z.setPointerCapture(e.pointerId)}catch(x){}}});
}

/* ---------- Schritte ---------- */
function head(t,s){return '<header class="bg-hd"><h2 tabindex="-1">'+t+'</h2>'+(s?'<p>'+s+'</p>':"")+'</header>'}
function stepFan(){
  return head("Wähle deine Karte","Sieben Karten liegen verdeckt vor dir. Nimm die, die dich ruft, oder lass dir eine ziehen.")+
  '<div class="bg-fan" role="group" aria-label="Verdeckte Karten">'+[0,1,2,3,4,5,6].map(function(i){return '<button type="button" class="bg-back" style="--i:'+(i-3)+'" aria-label="Verdeckte Karte '+(i+1)+' wählen"><img src="cards/t/back.webp" alt="" width="210" height="360" draggable="false"></button>'}).join("")+'</div>'+
  '<div class="bg-row"><button class="btn" type="button" data-act="draw">✦ Meine Karte entdecken</button></div>';
}
function step1(c){
  return head("Schau genau hin. Was entdeckst du?","Bevor du erfährst, was diese Karte traditionell bedeutet, entdecke zuerst, was DU in ihr siehst.")+
  '<div class="bg-one">'+cardFig(c,(D.flip&&!RM)?"flip":"")+
  '<div class="bg-side"><p class="bg-name">'+esc(c.name)+'</p><p class="bg-sub">'+esc(sub(c))+'</p>'+
  '<p class="bg-tip">Nimm dir einen Atemzug Zeit. Schau auf Farben, Gesten, Blicke, Gegenstände und den Hintergrund. Mit der Lupe kannst du Details vergrößern.</p>'+
  '<div class="bg-row"><button class="btn" type="button" data-act="to2">Weiter zum ersten Blick →</button>'+
  (D.a1||D.a2||D.a3||D.terms.length?'':'<button class="btn o" type="button" data-act="redraw">Andere Karte ziehen</button>')+'</div></div></div>';
}
function step2(c){
  var held=D.held;
  return head("Dein erster Blick","Es gibt hier kein Richtig und kein Falsch. Alles ist freiwillig.")+
  '<div class="bg-two">'+cardFig(c,"sticky")+'<div class="bg-form">'+
  '<label for="bga1">1. Was fällt dir auf diesem Bild als Erstes auf?</label><textarea id="bga1" data-f="a1" rows="2" maxlength="600" placeholder="Zum Beispiel eine Farbe, eine Figur, ein Licht …">'+esc(D.a1)+'</textarea>'+
  '<label for="bga2">2. Welche Stimmung oder welches Gefühl löst die Karte in dir aus?</label><textarea id="bga2" data-f="a2" rows="2" maxlength="600">'+esc(D.a2)+'</textarea>'+
  '<label for="bga3">3. Welches Detail könnte für dich besonders wichtig sein?</label><textarea id="bga3" data-f="a3" rows="2" maxlength="600">'+esc(D.a3)+'</textarea>'+
  '<p class="bg-lab" id="bgtl">Begriffe, die dir in den Sinn kommen (optional, Mehrfachauswahl)</p>'+
  '<div class="bg-terms" role="group" aria-labelledby="bgtl">'+TERMS.map(function(t){var on=D.terms.indexOf(t)>-1;return '<button type="button" class="bg-term" data-term="'+t+'" aria-pressed="'+on+'">'+t+'</button>'}).join("")+'</div>'+
  '<p class="bg-held" id="bgheld" role="status" aria-live="polite">'+(held?"✓ Deine Gedanken sind festgehalten.":"")+'</p>'+
  '<div class="bg-row">'+(held?'<button class="btn" type="button" data-act="to3">Jetzt entdecke ich die Karte →</button><button class="btn o" type="button" data-act="hold">Erneut festhalten</button>':'<button class="btn" type="button" data-act="hold">Meine Gedanken festhalten</button>')+'</div>'+
  '<div class="bg-row sm"><button class="bg-link" type="button" data-act="back">← Zurück</button><button class="bg-link" type="button" data-act="skip2">Diesen Schritt überspringen</button></div>'+
  '</div></div>';
}
function sec(t,html,cls){return '<section class="bg-sec3 '+(cls||"")+'"><h3>'+t+'</h3>'+html+'</section>'}
function step3(c){
  var m=maj(c),sym=(window.KR_SYMBOLE||{})[c.id],ov=overlap(c,D),own=[D.a1,D.a2,D.a3].some(function(x){return x&&x.trim()})||D.terms.length;
  var h=head("Die Bedeutung entdecken","Hier ist die überlieferte Sicht auf deine Karte, Abschnitt für Abschnitt.")+
  '<div class="bg-two">'+cardFig(c,"sticky")+'<div class="bg-mean">'+
  '<p class="bg-name">'+esc(c.name)+'</p><p class="bg-sub">'+esc(sub(c))+'</p>'+
  sec("Kernaussage",'<ul class="bg-keys">'+keys(c).map(function(k){return "<li>"+esc(k)+"</li>"}).join("")+'</ul>'+(m?'<p class="bg-q">'+esc(c.tip)+'</p>':""))+
  (sym&&sym.length?sec("Zentrale Symbole",'<ul class="bg-list">'+sym.map(function(s){return "<li>"+esc(s)+"</li>"}).join("")+"</ul>"):"")+
  sec("Traditionelle Bedeutung",m?'<p>'+esc(c.rank)+'</p>':'<p><b>Die Zahl:</b> '+esc(c.rank)+'</p><p><b>Das Element:</b> '+esc(c.sw)+'</p>')+
  '<div class="bg-duo">'+sec("Konstruktiv",'<p class="bg-lab2">Wenn sie aufrecht liegt</p><p>'+esc(c.up)+'</p>',"lt")+sec("Herausfordernd",'<p class="bg-lab2">Wenn sie umgekehrt liegt</p><p>'+esc(c.rv)+'</p>',"dk")+'</div>'+
  sec("Deine Reflexionsfrage",'<p class="bg-q">'+esc(reflectQ(c))+'</p>',"q")+
  (own?sec("Dein Blick daneben",
    '<p class="bg-mini">Jetzt kennst du die traditionelle Sicht auf diese Karte. Doch deine eigene Wahrnehmung ist ebenfalls ein Teil deiner Entdeckungsreise.</p><dl class="bg-mine">'+(D.a1?'<dt>Zuerst aufgefallen</dt><dd>'+nl(D.a1)+'</dd>':"")+(D.a2?'<dt>Stimmung</dt><dd>'+nl(D.a2)+'</dd>':"")+(D.a3?'<dt>Wichtiges Detail</dt><dd>'+nl(D.a3)+'</dd>':"")+(D.terms.length?'<dt>Deine Begriffe</dt><dd>'+esc(D.terms.join(" · "))+'</dd>':"")+'</dl>'+
    (ov.length?'<p class="bg-ov"><b>Gemeinsamkeiten:</b> Diese Worte von dir klingen auch in der traditionellen Deutung an: '+ov.map(function(w){return '<span>'+esc(w)+'</span>'}).join(" ")+'</p>'
      :'<p class="bg-ov">Deine Worte und die Tradition gehen hier eigene Wege. Das ist kein Fehler: Dein Blick ergänzt die überlieferte Bedeutung.</p>'),"mine"):
    sec("Dein Blick daneben",'<p class="bg-mini">Du hast den ersten Blick übersprungen. Du kannst jederzeit zurückgehen und deine Gedanken ergänzen.</p>',"mine"))+
  '<p class="bg-mini">Tarot ist hier ein Spiegel für Nachdenken und Lernen. Die Karten sagen nicht die Zukunft voraus.</p>'+
  '<div class="bg-row"><button class="btn" type="button" data-act="to4">Weiter zum Vergleich →</button></div>'+
  '<div class="bg-row sm"><button class="bg-link" type="button" data-act="back">← Zurück zum ersten Blick</button></div>'+
  '</div></div>';
  return h;
}
function step4(c){
  var picks=["Die konstruktive Seite","Die herausfordernde Seite","Beide Seiten","Etwas ganz Eigenes"];
  return head("Dein persönlicher Vergleich","Lege deinen ersten Blick neben die traditionelle Sicht. Du entscheidest, was für dich stimmt.")+
  '<div class="bg-two">'+cardFig(c,"sticky small")+'<div class="bg-form">'+
  '<label for="bgr1">Was hast du zuerst erkannt?</label><textarea id="bgr1" data-f="r1" rows="2" maxlength="600">'+esc(D.r1)+'</textarea>'+
  '<label for="bgr2">Was war dir vorher noch nicht bewusst?</label><textarea id="bgr2" data-f="r2" rows="2" maxlength="600">'+esc(D.r2)+'</textarea>'+
  '<p class="bg-lab" id="bgpl">Welche Bedeutung passt zu deiner eigenen Wahrnehmung?</p>'+
  '<div class="bg-terms" role="group" aria-labelledby="bgpl">'+picks.map(function(p){return '<button type="button" class="bg-term" data-pick="'+p+'" aria-pressed="'+(D.pick===p)+'">'+p+'</button>'}).join("")+'</div>'+
  '<label for="bgr3" class="vh">Was genau passt für dich? (optional)</label><textarea id="bgr3" data-f="r3" rows="2" maxlength="600" placeholder="Was genau passt für dich? (optional)">'+esc(D.r3)+'</textarea>'+
  '<label for="bgtk">Was möchtest du aus dieser Begegnung mitnehmen?</label><textarea id="bgtk" data-f="take" rows="2" maxlength="300" placeholder="Ein Satz genügt.">'+esc(D.take)+'</textarea>'+
  '<label for="bgnt">Deine Notiz (optional)</label><textarea id="bgnt" data-f="note" rows="3" maxlength="2000">'+esc(D.note)+'</textarea>'+
  '<div class="bg-row"><button class="btn" type="button" data-act="to5">Begegnung abschließen</button></div>'+
  '<div class="bg-row sm"><button class="bg-link" type="button" data-act="back">← Zurück zur Bedeutung</button></div>'+
  '</div></div>';
}
function insight(){
  if(D.take&&D.take.trim())return D.take.trim();
  var x=[D.r2,D.r1,D.r3,D.a1].filter(function(v){return v&&v.trim()})[0];
  return x?x.trim():"Du hast dir Zeit genommen, diese Karte mit deinem eigenen Blick anzusehen. Das ist der Anfang jeder Deutung.";
}
function canShare(){return !!(navigator.share||(navigator.clipboard&&window.isSecureContext))}
function step5(c){
  var n=metCount(),lv=level(n),nx=nextLevel(n),jn=journal().length;
  return '<div class="bg-final">'+head("Deine Begegnung mit der Karte","")+
  '<div class="bg-two">'+cardFig(c,"sticky")+'<div class="bg-mean">'+
  '<p class="bg-name">'+esc(c.name)+'</p><p class="bg-sub">'+esc(sub(c))+' · '+esc(fmt(D.t0))+'</p>'+
  sec("Deine zentrale Erkenntnis",'<p class="bg-q">'+nl(insight())+'</p>',"q")+
  sec("Deine Notiz",D.note&&D.note.trim()?'<p>'+nl(D.note)+'</p>':'<p class="bg-mini">Keine Notiz. Du kannst im Schritt „Vergleich“ jederzeit eine ergänzen.</p>')+
  sec("Zum Weiterdenken",'<p class="bg-q">'+esc(FINALQ[D.fq||0])+'</p>')+
  '<div class="bg-lvl" role="status"><div class="bg-bar" aria-hidden="true"><i style="width:'+Math.round(n/78*100)+'%"></i></div>'+
    '<p><b>'+n+' von 78 Karten</b> sind dir schon begegnet'+(lv?' · Stufe „'+lv[1]+'“':"")+'.'+(newLevel?' <span class="bg-new">Neue Stufe erreicht.</span>':"")+(nx?' Noch '+(nx[0]-n)+' bis „'+nx[1]+'“.':"")+'</p></div>'+
  '<p class="bg-saved">✓ Gespeichert in „Meine Begegnungen“, nur in diesem Browser.</p>'+
  '<div class="bg-acts">'+
    '<button class="btn" type="button" data-act="next">✦ Nächste Karte entdecken</button>'+
    '<button class="btn o" type="button" data-act="journal">Meine Begegnungen ansehen ('+jn+')</button>'+
    (canShare()?'<button class="btn o" type="button" data-act="share">Karte teilen</button>':"")+
    '<button class="btn o" type="button" data-act="deck">Weitere Karten kennenlernen</button>'+
  '</div>'+
  '<p class="bg-mini">Beim Teilen wird nur die Karte geteilt, nie deine Notizen.</p>'+
  '<aside class="bg-invite"><p>Du möchtest lernen, die Karten selbst zu deuten? Entdecke den 21-Tage-Lernweg von KARTENREICH. Genau so beginnt Tag 1: erst schauen, dann nachlesen.</p><button class="bg-link" type="button" data-act="program">Zum 21-Tage-Lernweg →</button></aside>'+
  '<div class="bg-row sm"><button class="bg-link" type="button" data-act="back">← Zurück zum Vergleich</button></div>'+
  '</div></div></div>';
}

/* ---------- Journal ---------- */
function notice(){return '<p class="bg-notice"><b>Nur in deinem Browser gespeichert.</b> Deine Begegnungen werden nicht übertragen und sind für niemanden außer dir sichtbar. Wenn du die Browserdaten löschst oder das Gerät wechselst, gehen sie verloren.</p>'}
function viewJournal(){
  var j=journal(),met={};j.forEach(function(e){met[e.cid]=1});var n=Object.keys(met).length,lv=level(n);
  var h=head("Meine Begegnungen",j.length?(j.length===1?"Eine Begegnung":j.length+" Begegnungen")+" · "+n+" von 78 Karten"+(lv?" · Stufe „"+lv[1]+"“":""):"")+notice();
  if(!j.length)return h+'<div class="bg-empty"><p>Noch keine Begegnungen. Deine erste Karte wartet auf deinen Blick.</p><button class="btn" type="button" data-act="next">✦ Meine Karte entdecken</button></div>';
  h+='<h3 class="bg-h3">Deine Sammlung</h3><div class="bg-bar big" aria-hidden="true"><i style="width:'+Math.round(n/78*100)+'%"></i></div>'+
    '<ul class="bg-grid" aria-label="Sammlung: '+n+' von 78 Karten begegnet">'+DECK.map(function(c){return met[c.id]?'<li><img src="cards/t/'+c.id+'.webp" alt="'+esc(c.name)+'" title="'+esc(c.name)+'" width="210" height="360" loading="lazy" decoding="async" draggable="false"></li>':'<li class="no" aria-hidden="true"></li>'}).join("")+'</ul>'+
    '<h3 class="bg-h3">Alle Begegnungen</h3><ul class="bg-jl">'+j.map(function(e){var c=byId(e.cid);return '<li><button type="button" data-open="'+esc(e.id)+'"><img src="cards/t/'+c.id+'.webp" alt="" width="210" height="360" loading="lazy" decoding="async" draggable="false"><span><b>'+esc(c.name)+'</b><small>'+esc(fmt(e.t))+'</small>'+(e.take?'<em>'+esc(e.take.slice(0,110))+(e.take.length>110?"…":"")+'</em>':"")+'</span></button></li>'}).join("")+'</ul>'+
    '<div class="bg-row"><button class="btn" type="button" data-act="next">✦ Nächste Karte entdecken</button></div>';
  return h;
}
function viewEntry(e){
  var c=byId(e.cid),row=function(l,v){return v&&String(v).trim()?'<dt>'+l+'</dt><dd>'+nl(v)+'</dd>':""};
  return head(esc(c.name),esc(fmt(e.t)))+'<div class="bg-two">'+cardFig(c,"sticky small")+'<div class="bg-mean">'+
  '<dl class="bg-mine">'+row("Zuerst aufgefallen",e.a1)+row("Stimmung",e.a2)+row("Wichtiges Detail",e.a3)+((e.terms||[]).length?'<dt>Deine Begriffe</dt><dd>'+esc(e.terms.join(" · "))+'</dd>':"")+
  row("Zuerst erkannt",e.r1)+row("Vorher nicht bewusst",e.r2)+row("Passende Bedeutung",[e.pick,e.r3].filter(Boolean).join(": "))+row("Zentrale Erkenntnis",e.take)+row("Notiz",e.note)+'</dl>'+
  (["a1","a2","a3","r1","r2","r3","take","note","pick"].some(function(k){return e[k]&&String(e[k]).trim()})||(e.terms||[]).length?"":'<p class="bg-mini">Zu dieser Begegnung hast du nichts notiert.</p>')+
  '<div class="bg-row"><button class="btn o" type="button" data-act="jback">← Zur Übersicht</button><button class="btn o bg-del" type="button" data-del="'+esc(e.id)+'">Begegnung löschen</button></div>'+
  '<div class="bg-confirm" id="bgconf" hidden><p>Diese Begegnung wirklich löschen? Das lässt sich nicht rückgängig machen.</p><div class="bg-row"><button class="btn" type="button" data-delok="'+esc(e.id)+'">Ja, löschen</button><button class="btn o" type="button" data-act="delno">Abbrechen</button></div></div>'+
  '</div></div>';
}

/* ---------- Rendern ---------- */
function render(focus){
  var html="";
  if(VIEW==="journal")html=viewJournal();
  else if(VIEW==="entry"){var e=journal().filter(function(x){return x.id===JSEL})[0];if(!e){VIEW="journal";return render(focus)}html=viewEntry(e)}
  else if(!D)html=stepFan();
  else{var c=byId(D.cid);html=[0,step1,step2,step3,step4,step5][D.step](c)}
  body.innerHTML=html;renderProg();
  if(VIEW==="flow"&&D&&D.step===1)D.flip=false;
  bindLupe(body);
  dlg.scrollTop=0;var w=dlg.querySelector(".dkw");if(w)w.scrollTop=0;
  if(focus!==false){var h2=body.querySelector("h2");if(h2)try{h2.focus({preventScroll:true})}catch(x){}}
  updateSection();
}
function go(n){if(!D)return;D.step=n;if(n>D.max)D.max=n;saveDraft();if(n===5)commit();render()}

/* Begegnung ins Journal schreiben (oder aktualisieren, wenn schon gespeichert) */
function commit(){
  var j=journal(),before=metCount(),c=byId(D.cid);
  var e={id:D.eid||("b"+Date.now().toString(36)+rnd(1e6).toString(36)),cid:D.cid,name:c.name,t:D.t0,a1:D.a1,a2:D.a2,a3:D.a3,terms:D.terms.slice(),r1:D.r1,r2:D.r2,r3:D.r3,pick:D.pick,take:D.take,note:D.note,
    lern:{schritte:D.max,gezogenAm:D.t0}};
  var i=-1;j.forEach(function(x,k){if(x.id===e.id)i=k});
  if(i>-1)j[i]=e;else j.unshift(e);
  saveJournal(j);D.eid=e.id;saveDraft();
  var after=metCount(),l1=level(before),l2=level(after);newLevel=(after>before&&l2&&(!l1||l2[0]!==l1[0]))?l2:null;
}

/* ---------- Ereignisse ---------- */
function startNew(){
  var c=drawCard();newDraft(c);VIEW="flow";newLevel=null;render();
}
function pickFromFan(btn){
  if(body.querySelector(".bg-back.chosen"))return;
  btn.classList.add("chosen");body.querySelector(".bg-fan").classList.add("picked");
  setTimeout(startNew,RM?0:420);
}
function share(){
  var c=byId(D?D.cid:"");if(!c)return;
  var link=(function(){var l=document.querySelector('link[rel="canonical"]');return(l&&l.href?l.href:location.href.split("#")[0])+"#selbst-deuten"})();
  var text="Ich habe heute „"+c.name+"“ aus dem Kartenreich-Deck betrachtet: erst mit meinem eigenen Blick, dann mit der traditionellen Bedeutung. Probier es selbst:";
  if(navigator.share){
    var base={title:"Kartenreich · "+c.name,text:text,url:link};
    fetch("cards/"+c.id+".webp").then(function(r){return r.ok?r.blob():null}).catch(function(){return null}).then(function(b){
      var data=base;
      if(b&&navigator.canShare){try{var f=new File([b],"kartenreich-"+c.id+".webp",{type:"image/webp"});if(navigator.canShare({files:[f]}))data={files:[f],title:base.title,text:text+" "+link}}catch(x){}}
      return navigator.share(data);
    }).catch(function(err){if(err&&err.name!=="AbortError")copyLink(text,link)});
  }else copyLink(text,link);
}
function copyLink(text,link){
  if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(text+" "+link).then(function(){toast("Text und Link kopiert ✓ Füge sie ein, wo du teilen möchtest.")},function(){toast("Kopieren war nicht möglich.")});
  else toast("Teilen ist in diesem Browser nicht möglich.");
}
function scrollToId(id){dlg.close();var el=document.getElementById(id);if(el)setTimeout(function(){el.scrollIntoView({behavior:RM?"auto":"smooth",block:"start"})},60)}

body.addEventListener("input",function(e){var f=e.target.getAttribute&&e.target.getAttribute("data-f");if(f&&D){D[f]=e.target.value;if(/^a/.test(f)&&D.held){D.held=false;var h=document.getElementById("bgheld");if(h)h.textContent=""}saveDraft()}});
body.addEventListener("click",function(e){
  var t=e.target.closest("button");if(!t||!body.contains(t))return;
  if(t.classList.contains("bg-back")){pickFromFan(t);return}
  if(t.dataset.term&&D){var i=D.terms.indexOf(t.dataset.term);if(i>-1)D.terms.splice(i,1);else D.terms.push(t.dataset.term);t.setAttribute("aria-pressed",String(i<0));D.held=false;var hh=document.getElementById("bgheld");if(hh)hh.textContent="";saveDraft();return}
  if(t.dataset.pick&&D){D.pick=D.pick===t.dataset.pick?"":t.dataset.pick;body.querySelectorAll("[data-pick]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.pick===D.pick))});saveDraft();return}
  if(t.dataset.open){JSEL=t.dataset.open;VIEW="entry";render();return}
  if(t.dataset.del){var cf=document.getElementById("bgconf");if(cf){cf.hidden=false;var y=cf.querySelector("button");if(y)y.focus()}return}
  if(t.dataset.delok){var id=t.dataset.delok;saveJournal(journal().filter(function(x){return x.id!==id}));if(D&&D.eid===id)clearDraft();VIEW="journal";JSEL=null;render();toast("Begegnung gelöscht.");return}
  var a=t.dataset.act;if(!a)return;
  switch(a){
    case "draw":var bk=body.querySelectorAll(".bg-back");pickFromFan(bk[rnd(bk.length)]);break;
    case "redraw":startNew();break;
    case "to2":go(2);break;
    case "hold":D.held=true;saveDraft();render(false);var b2=body.querySelector('[data-act="to3"]');if(b2)b2.focus();break;
    case "skip2":case "to3":go(3);break;
    case "to4":go(4);break;
    case "to5":go(5);break;
    case "back":go(Math.max(1,D.step-1));break;
    case "next":clearDraft();VIEW="flow";newLevel=null;render();break;
    case "journal":VIEW="journal";render();break;
    case "jback":VIEW="journal";render();break;
    case "delno":var c2=document.getElementById("bgconf");if(c2)c2.hidden=true;break;
    case "share":share();break;
    case "deck":scrollToId("deck");break;
    case "program":scrollToId("angebot");break;
  }
});
prog.addEventListener("click",function(e){var b=e.target.closest("button[data-go]");if(b&&!b.disabled)go(+b.dataset.go)});
document.getElementById("bgx").addEventListener("click",function(){dlg.close()});
dlg.addEventListener("click",function(e){if(e.target===dlg)dlg.close()});
dlg.addEventListener("close",function(){if(D&&D.step===5&&D.eid){clearDraft()}updateSection()});

/* ---------- Öffnen ---------- */
function open(view){
  D=draft();newLevel=null;
  /* eine abgeschlossene Begegnung liegt im Journal; beim nächsten Öffnen beginnt eine neue */
  if(D&&D.step===5)clearDraft();
  if(view==="journal"){VIEW="journal"}else{VIEW="flow"}
  render();
  if(!dlg.open)try{dlg.showModal()}catch(x){dlg.setAttribute("open","")}
  var h2=body.querySelector("h2");if(h2)try{h2.focus({preventScroll:true})}catch(x){}
}
window.openBg=open;

/* Startseiten-Abschnitt aktualisieren */
var bS=document.getElementById("bgStart"),bJ=document.getElementById("bgJour"),meta=document.getElementById("bgMeta");
function updateSection(){
  var j=journal(),n=metCount(),d=draft();
  if(bS)bS.textContent=d&&!(d.step===5&&d.eid)?"✦ Begegnung fortsetzen":"✦ Meine Karte entdecken";
  if(bJ){bJ.hidden=!j.length;bJ.textContent="Meine Begegnungen ("+j.length+")"}
  if(meta)meta.textContent=n?"Deine Sammlung: "+n+" von 78 Karten · Gespeichert nur in deinem Browser.":"Kostenlos, ohne Anmeldung. Deine Gedanken bleiben in deinem Browser.";
}
if(bS)bS.addEventListener("click",function(){open("flow")});
if(bJ)bJ.addEventListener("click",function(){open("journal")});
updateSection();

/* Im „Mehr“-Menü */
var mp=document.getElementById("mp");
if(mp&&!document.getElementById("tbg")){var mb=document.createElement("button");mb.type="button";mb.id="tbg";mb.setAttribute("aria-haspopup","dialog");mb.textContent="✦ Selbst deuten";
  mb.addEventListener("click",function(){open("flow")});mp.insertBefore(mb,mp.children[1]||null)}

/* In der Großansicht der Deck-Galerie: diese Karte selbst deuten */
var mxl=document.getElementById("mxl"),mxi=document.getElementById("mxli");
if(mxl&&mxi){var nav=mxl.querySelector(".mxl-nav"),gb=document.createElement("button");gb.type="button";gb.className="bg-mxl";gb.textContent="✦ Diese Karte selbst deuten";
  gb.addEventListener("click",function(){var m=/cards\/([a-z0-9_]+)\.webp/.exec(mxi.getAttribute("src")||"");var c=m&&byId(m[1]);if(!c)return;mxl.close();addSess(c.id);newDraft(c);VIEW="flow";newLevel=null;render();if(!dlg.open)dlg.showModal()});
  if(nav)nav.parentNode.insertBefore(gb,nav.nextSibling)}

/* Direktlink: …/tarot/#begegnung öffnet die Übung (nach dem Opening) */
if(location.hash==="#begegnung"){var tries=0,iv=setInterval(function(){tries++;var gate=document.getElementById("gate");
  if(!document.getElementById("krIntro")&&!(gate&&gate.classList.contains("show"))){clearInterval(iv);open("flow")}else if(tries>60)clearInterval(iv)},250)}
})();
