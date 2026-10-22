/* Kartenreich · Opening „Die Blüte der 22“
   Ein durchgehender, ruhiger Ablauf (ca. 7,5 Sekunden):
   1  Stille     Ein Sternenhimmel öffnet sich, in der Mitte atmet ein goldener Lichtpunkt.
   2  Siegel     Aus dem Licht zeichnet sich eine goldene heilige Geometrie: Kreise, achtzackiger Stern, Strahlen.
   3  Blüte      Die 22 Großen Arkana falten sich aus einem Stapel zu einer Lotusblüte auf,
                 richten sich auf und drehen sich in einer Welle zur Vorderseite.
   4  Name       „Kartenreich“ erscheint in Gold, ein Lichtstreif gleitet darüber.
   5  Heimkehr   Die Blüte schließt sich zum Stapel. Daraus werden Narr, Rückseite und Welt
                 genau in den Kartenfächer der Startseite ausgeteilt, während das All sich auflöst.
   Start: Der Himmel ist schon da, ein leuchtender Kreis lädt zum „Eintreten“ ein. Nur so dürfen Browser
   Ton abspielen. „Eintreten“ (oder Tippen irgendwo) startet mit Klang, „ohne Klang eintreten“ leise;
   nach 12 Sekunden ohne Eingabe beginnt das Opening von selbst ohne Klang.
   Während des Openings: Antippen, Escape oder „Überspringen“ beendet es sofort, „♪ Klang“ schaltet stumm.
   Pro Browser-Sitzung läuft es einmal; beim erneuten Laden in derselben Sitzung startet die Seite direkt.
   Bei „Bewegung reduzieren“ gibt es nur ein kurzes, ruhiges Einblenden. */
(function(){
"use strict";
var root=document.getElementById("krIntro");if(!root)return;
var html=document.documentElement,cv=root.querySelector(".kri-sky"),stage=root.querySelector(".kri-stage"),
    title=root.querySelector(".kri-title"),skipB=root.querySelector(".kri-skip"),g=cv&&cv.getContext&&cv.getContext("2d");
function drop(){root.parentNode&&root.parentNode.removeChild(root)}
if(!g||!stage){drop();return}
var SEEN="kr_intro_seen";
/* Testhilfe: …/?introAt=4.5 hält das Opening bei 4,5 Sekunden an (für Standbilder) */
var AT=/[?&]introAt=([\d.]+)/.exec(location.search);AT=AT?parseFloat(AT[1]):null;
try{if(sessionStorage.getItem(SEEN)&&!/[?&]intro/.test(location.search)){drop();return}sessionStorage.setItem(SEEN,"1")}catch(e){}
var reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches);
root.classList.add("run");html.classList.add("kri-on");

/* ---------- Hilfen ---------- */
var PI=Math.PI,TAU=PI*2,seed=20261022;
function R(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646}   /* gleichbleibend schön, nicht zufällig wackelig */
function cl(v,a,b){return v<a?a:v>b?b:v}
function lerp(a,b,t){return a+(b-a)*t}
function seg(t,a,b){return cl((t-a)/(b-a),0,1)}
function ss(t){return t*t*(3-2*t)}                         /* weicher Ein- und Ausklang */
function sm(t){return t*t*t*(t*(t*6-15)+10)}               /* noch weicher (smootherstep) */
function oCubic(t){return 1-Math.pow(1-t,3)}
function oQuint(t){return 1-Math.pow(1-t,5)}
function ioCubic(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function ioSine(t){return-(Math.cos(PI*t)-1)/2}

/* ---------- Ablauf (Sekunden) ---------- */
var T={stars:[0,.42],seal:[.45,2.6],bloom:[1.85,4.1],flip:2.55,title:[4.0,4.9],titleOut:[5.55,6.25],
       close:[5.45,6.55],deal:6.3,fade:[6.35,7.45],end:7.75};

/* ---------- Leinwand ---------- */
var W=0,H=0,M=0,dpr=1,neb=null,NS=0,vig=null;
function size(){
  dpr=Math.min(window.devicePixelRatio||1,2);W=window.innerWidth;H=window.innerHeight;M=Math.min(W,H);
  cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);g.setTransform(dpr,0,0,dpr,0,0);
  buildNebula();buildVignette();layoutRing();
}
function buildNebula(){
  var D=Math.ceil(Math.hypot(W,H)),N=Math.ceil(D/2.2);seed=7;
  neb=document.createElement("canvas");neb.width=neb.height=N;NS=D;
  var c=neb.getContext("2d"),m=N/2;c.globalCompositeOperation="lighter";
  var COLS=[[104,52,190],[64,38,150],[150,60,140],[36,58,140],[128,84,214]];
  for(var i=0;i<26;i++){
    var a=R()*TAU,d=Math.pow(R(),.7)*N*.42,x=m+Math.cos(a)*d,y=m+Math.sin(a)*d*.8,r=N*(.1+R()*.26),col=COLS[i%5],al=.035+R()*.08,
        gr=c.createRadialGradient(x,y,0,x,y,r);
    gr.addColorStop(0,"rgba("+col+","+al+")");gr.addColorStop(.6,"rgba("+col+","+al*.3+")");gr.addColorStop(1,"rgba("+col+",0)");
    c.fillStyle=gr;c.fillRect(x-r,y-r,r*2,r*2);
  }
  var gc=c.createRadialGradient(m,m,0,m,m,N*.3);gc.addColorStop(0,"rgba(232,180,90,.07)");gc.addColorStop(1,"rgba(232,180,90,0)");c.fillStyle=gc;c.fillRect(0,0,N,N);
}
function buildVignette(){
  vig=g.createRadialGradient(W/2,H/2,M*.35,W/2,H/2,Math.hypot(W,H)*.62);
  vig.addColorStop(0,"rgba(3,1,8,0)");vig.addColorStop(1,"rgba(3,1,8,.78)");
}
function sprite(rgb){
  var s=document.createElement("canvas");s.width=s.height=64;var c=s.getContext("2d"),gr=c.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,"rgba(255,252,240,1)");gr.addColorStop(.16,"rgba("+rgb+",.85)");gr.addColorStop(.42,"rgba("+rgb+",.2)");gr.addColorStop(1,"rgba("+rgb+",0)");
  c.fillStyle=gr;c.fillRect(0,0,64,64);return s;
}
var GOLD=sprite("246,214,150"),VIOL=sprite("208,180,255");

/* ---------- Sterne: ruhige Tiefe statt Warp ---------- */
var stars=[];
function initStars(){seed=99;var n=Math.min(520,Math.round(W*H/2400));stars=[];
  for(var i=0;i<n;i++)stars.push({x:(R()-.5)*2.4,y:(R()-.5)*2.4,z:.08+R()*.92,b:.3+R()*.7,tw:R()*TAU,c:R()<.1?1:0})}
function starSpeed(t){return .018+.16*ss(seg(t,6.0,7.0))}

/* ---------- Schwebende Goldstäubchen ---------- */
var motes=[],sparks=[];
function initMotes(){seed=5;motes=[];for(var i=0;i<(M<600?34:60);i++)motes.push({x:R(),y:R(),s:.6+R()*1.6,v:.006+R()*.014,ph:R()*TAU})}
function spark(x,y,n,sp,life){for(var i=0;i<n;i++){var a=Math.random()*TAU,v=sp*(.25+Math.random());
  sparks.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*.15,l:life*(.6+Math.random()*.4),m:0,s:2+Math.random()*3.5,k:Math.random()<.75?GOLD:VIOL})}}

/* ---------- Die 22 Großen Arkana ---------- */
var N=22,ring=null,cards=[],cw=100,ch=171,Rc=200;
function layoutRing(){
  var Rout=M*(M<600?.37:.4);ch=Rout*.56;cw=ch*300/514;Rc=Rout-ch/2;
  stage.style.setProperty("--cw",cw.toFixed(1)+"px");stage.style.setProperty("--ch",ch.toFixed(1)+"px");
}
function initCards(){
  ring=document.createElement("div");ring.className="kri-ring";stage.appendChild(ring);
  var BACK="cards/t/back.webp";seed=3;
  for(var i=0;i<N;i++){
    var id="g"+i,el=document.createElement("div");el.className="kri-card";
    var f=document.createElement("i"),b=document.createElement("i");f.className="f";b.className="b";
    f.style.backgroundImage="url(cards/t/"+id+".webp)";b.style.backgroundImage="url("+BACK+")";
    el.appendChild(f);el.appendChild(b);ring.appendChild(el);
    cards.push({el:el,i:i,a0:(R()-.5)*.09,phi:TAU*i/N});
    var im=new Image();im.decoding="async";im.src="cards/t/"+id+".webp";
  }
  (new Image).src=BACK;
}

/* Öffnungsgrad der Blüte: 0 = Stapel, 1 = voll geöffnet */
function openness(t){
  var o=sm(seg(t,T.bloom[0],T.bloom[1]));
  var c=ioCubic(seg(t,T.close[0],T.close[1]));
  return o*(1-c);
}
function ringRot(t){return -.35+t*.09+Math.pow(seg(t,T.close[0],T.close[1]),2)*1.6}   /* in Umdrehungen×TAU unten */
function tilt(t){return lerp(62,14,sm(seg(t,1.7,4.3)))+8*ss(seg(t,T.close[0],T.close[1]))}

function drawRing(t){
  var o=openness(t),rot=ringRot(t),tl=tilt(t),
      dim=1-.62*ss(seg(t,3.95,4.6))*(1-ss(seg(t,5.35,5.9))),
      vis=ss(seg(t,1.7,2.15))*(1-ss(seg(t,6.4,6.85))),
      sc=lerp(.9,1,ss(seg(t,1.8,3.2)))*(1-.12*ss(seg(t,3.95,4.6))*(1-ss(seg(t,5.35,5.9))))*lerp(1,.55,ss(seg(t,6.2,6.9)));
  ring.style.transform="rotateX("+tl.toFixed(2)+"deg) rotateZ("+(rot*57.2958).toFixed(2)+"deg) scale("+sc.toFixed(4)+")";
  ring.style.opacity=vis.toFixed(3);
  ring.style.filter=dim<.995?"brightness("+dim.toFixed(3)+")":"none";
  for(var n=0;n<N;n++){var c=cards[n];
    /* jede Karte faltet sich mit leichtem Nachlauf auf: wie Blütenblätter */
    var lag=n/N*.22,on=sm(cl((o-lag*(1-o))/(1-lag*(1-o)),0,1)),
        a=lerp(c.a0,c.phi,on),r=lerp(0,Rc,ss(on)),
        x=Math.sin(a)*r,y=-Math.cos(a)*r,
        fl=sm(seg(t,T.flip+n*.05,T.flip+n*.05+.75))*(1-sm(seg(t,T.close[0]+.25,T.close[1]))),
        ry=180-180*fl,s=lerp(.62,1,ss(on)),lift=Math.sin(on*PI)*14;
    c.el.style.transform="translate3d("+x.toFixed(2)+"px,"+y.toFixed(2)+"px,"+(n*.35+lift).toFixed(2)+"px) rotateZ("+(a*57.2958).toFixed(2)+"deg) rotateY("+ry.toFixed(2)+"deg) scale("+s.toFixed(4)+")";
  }
}

/* ---------- Siegel: heilige Geometrie in Gold ---------- */
function stroke(path,p,lw,al){if(p<=0)return;g.save();g.globalAlpha=al;g.lineWidth=lw;g.setLineDash([p*4000,4000]);g.beginPath();path();g.stroke();g.restore()}
function drawSeal(t,cx,cy){
  var tl=tilt(t)*PI/180,sy=Math.cos(tl)*.98+.02,rot=ringRot(t)*.35,Rs=(Rc+ch/2)*1.08,
      coll=ioCubic(seg(t,5.6,6.6)),k=1-coll*.92,
      al=ss(seg(t,.45,1.0))*(1-ss(seg(t,6.2,6.8)))*(.55+.45*(1-ss(seg(t,3.95,4.6))*(1-ss(seg(t,5.35,5.9)))));
  if(al<=0)return;
  var P1=seg(t,.45,1.55),P2=seg(t,.75,1.85),P3=seg(t,1.05,2.25),P4=seg(t,1.45,2.6);
  g.save();g.translate(cx,cy);g.scale(1,sy);g.rotate(rot);g.scale(k,k);
  g.strokeStyle="rgba(240,206,140,1)";g.shadowColor="rgba(232,180,90,.85)";g.shadowBlur=10;
  var C=TAU*Rs;
  /* äußerer Doppelkreis */
  stroke(function(){g.arc(0,0,Rs,-PI/2,-PI/2+TAU)},sm(P1)*C/4000,1.4,al);
  stroke(function(){g.arc(0,0,Rs*1.035,PI/2,PI/2+TAU)},sm(P1)*C*1.035/4000,.7,al*.7);
  /* innerer Kreis */
  stroke(function(){g.arc(0,0,Rs*.42,0,TAU)},sm(P2)*TAU*Rs*.42/4000,1,al*.85);
  /* achtzackiger Stern aus zwei Quadraten (wie auf der Kartenrückseite) */
  var sq=function(off){return function(){for(var q=0;q<=4;q++){var an=off+q*PI/2,px=Math.cos(an)*Rs*.94,py=Math.sin(an)*Rs*.94;q?g.lineTo(px,py):g.moveTo(px,py)}}};
  var L=4*Rs*.94*Math.SQRT2;
  stroke(sq(-PI/2),sm(P3)*L/4000,1,al*.8);stroke(sq(-PI/4),sm(seg(t,1.25,2.45))*L/4000,1,al*.8);
  /* zwölf feine Strahlen und Gradstriche */
  g.shadowBlur=0;
  for(var i=0;i<72;i++){var an=i*TAU/72,big=i%6===0,pp=sm(seg(P4,i/72*.6,i/72*.6+.4));if(pp<=0)continue;
    g.globalAlpha=al*(big?.9:.45);g.lineWidth=big?1.1:.6;g.beginPath();
    var r1=Rs*1.035,r2=Rs*(1.035+(big?.07:.03)*pp);g.moveTo(Math.cos(an)*r1,Math.sin(an)*r1);g.lineTo(Math.cos(an)*r2,Math.sin(an)*r2);g.stroke()}
  g.restore();
}

/* ---------- Himmel, Licht, Staub ---------- */
function drawSky(t,dt){
  var cx=W/2,cy=H/2,bg=bgAlpha(t),fin=ss(seg(t,T.stars[0],T.stars[1]));
  g.globalCompositeOperation="source-over";g.globalAlpha=1;g.clearRect(0,0,W,H);
  if(bg>0){
    g.globalAlpha=bg;g.fillStyle="#04020a";g.fillRect(0,0,W,H);
    g.save();g.translate(cx,cy);g.rotate(t*.02);g.globalCompositeOperation="lighter";g.globalAlpha=bg*fin;
    var ns=1.05+.05*Math.sin(t*.5);g.scale(ns,ns);g.drawImage(neb,-NS/2,-NS/2,NS,NS);g.restore();
    /* Sterne */
    var v=reduce?0:starSpeed(t),half=Math.max(W,H)*.5;
    for(var i=0;i<stars.length;i++){var s=stars[i];s.z-=v*dt*(.5+s.b*.5);
      if(s.z<=.05){s.z=1;s.x=(Math.random()-.5)*2.4;s.y=(Math.random()-.5)*2.4}
      var k=1/s.z,px=cx+s.x*half*k*.5,py=cy+s.y*half*k*.5;if(px<-4||px>W+4||py<-4||py>H+4){s.z=1;continue}
      var al=Math.min(1,(1.1-s.z)*1.4)*s.b*(.7+.3*Math.sin(t*2.2+s.tw))*fin*bg,sz=Math.max(.5,(1-s.z)*1.9);
      if(al<.03)continue;g.globalAlpha=al;g.fillStyle=s.c?"#ffe3a8":"#fbf6ff";
      if(v>.06){var k0=1/(s.z+v*.08),qx=cx+s.x*half*k0*.5,qy=cy+s.y*half*k0*.5;g.strokeStyle=g.fillStyle;g.lineWidth=sz;g.beginPath();g.moveTo(qx,qy);g.lineTo(px,py);g.stroke()}
      else g.fillRect(px-sz/2,py-sz/2,sz,sz)}
    g.globalCompositeOperation="source-over";
    drawSeal(t,cx,cy);
    /* Lichtpunkt in der Mitte: atmet, blüht auf, sammelt sich am Ende */
    var core=ss(seg(t,.15,.9))*(1-.65*ss(seg(t,2.0,3.0)))+.9*Math.exp(-Math.pow((t-1.95)/.28,2))+1.1*Math.exp(-Math.pow((t-6.45)/.3,2));
    core*=(1+.12*Math.sin(t*3.1))*(1-ss(seg(t,6.7,7.2)));
    if(core>0){var cr=M*(.16+.1*core),gr=g.createRadialGradient(cx,cy,0,cx,cy,cr);
      gr.addColorStop(0,"rgba(255,246,220,"+cl(.85*core,0,1)+")");gr.addColorStop(.12,"rgba(246,214,150,"+cl(.45*core,0,1)+")");
      gr.addColorStop(.45,"rgba(160,110,240,"+cl(.12*core,0,1)+")");gr.addColorStop(1,"rgba(60,30,120,0)");
      g.globalCompositeOperation="lighter";g.globalAlpha=bg;g.fillStyle=gr;g.fillRect(cx-cr,cy-cr,cr*2,cr*2);g.globalCompositeOperation="source-over"}
    g.globalAlpha=bg;g.fillStyle=vig;g.fillRect(0,0,W,H);
  }
  /* Goldstäubchen (ruhig aufsteigend) und Funken */
  g.globalCompositeOperation="lighter";
  var ma=ss(seg(t,.8,2.2))*(1-ss(seg(t,6.3,7.2)));
  if(ma>0)for(var m=0;m<motes.length;m++){var q=motes[m];q.y-=q.v*dt;if(q.y<-.02)q.y=1.02;
    var mx=(q.x+Math.sin(t*.4+q.ph)*.012)*W,my=q.y*H,mz=q.s*3.2;g.globalAlpha=ma*(.35+.35*Math.sin(t*1.7+q.ph));g.drawImage(GOLD,mx-mz,my-mz,mz*2,mz*2)}
  for(var j=sparks.length-1;j>=0;j--){var p=sparks[j];p.m+=dt;if(p.m>=p.l){sparks.splice(j,1);continue}
    p.vx*=.955;p.vy=p.vy*.955+10*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;var f=1-p.m/p.l,sz2=p.s*(.5+f);
    g.globalAlpha=f*f;g.drawImage(p.k,p.x-sz2,p.y-sz2,sz2*2,sz2*2)}
  g.globalCompositeOperation="source-over";g.globalAlpha=1;
}
function bgAlpha(t){return reduce?1-ss(seg(t,1.8,2.5)):1-ss(seg(t,T.fade[0],heroOK?T.fade[1]:T.fade[1]-.3))}

/* ---------- Titel ---------- */
var tB=title.querySelector("b"),tS=title.querySelector("span"),tM=title.querySelector("small"),tI=title.querySelector("img");
function drawTitle(t){
  var a,b,o;
  if(reduce){o=ss(seg(t,.2,.8))*(1-ss(seg(t,1.7,2.3)));title.style.opacity=o.toFixed(3);return}
  a=sm(seg(t,T.title[0],T.title[1]));b=ss(seg(t,T.titleOut[0],T.titleOut[1]));o=a*(1-b);
  title.style.opacity=o>0.001?"1":"0";
  if(tI){tI.style.opacity=(sm(seg(t,T.title[0]-.1,T.title[0]+.6))*(1-b)).toFixed(3);tI.style.transform="translateY("+((1-a)*10-b*14).toFixed(1)+"px) scale("+(.9+.1*a).toFixed(3)+")"}
  if(tB){tB.style.opacity=(a*(1-b)).toFixed(3);tB.style.letterSpacing=(.42-.34*a+.06*b).toFixed(3)+"em";tB.style.transform="translateY("+(-b*16).toFixed(1)+"px)";tB.style.filter="blur("+((1-a)*6+b*5).toFixed(2)+"px) drop-shadow(0 0 18px rgba(232,180,90,.38))"}
  var sa=sm(seg(t,T.title[0]+.45,T.title[1]+.45))*(1-b);
  if(tS){tS.style.opacity=sa.toFixed(3);tS.style.transform="translateY("+((1-sa)*8-b*12).toFixed(1)+"px)"}
  if(tM){tM.style.opacity=(sm(seg(t,T.title[0]+.8,T.title[1]+.8))*(1-b)*.85).toFixed(3)}
  if(a>.2&&!title.classList.contains("shine"))title.classList.add("shine");
}

/* ---------- Austeilen in den Kartenfächer ---------- */
var heroOK=null,heroImgs=null,heroFly=[],heroTried=false;
function readHero(){
  var fan=document.querySelector(".mx-hero .mx-fan");if(!fan)return null;
  var c1=fan.querySelector(".c1"),c2=fan.querySelector(".c2"),c3=fan.querySelector(".c3");if(!c1||!c2||!c3)return null;
  var fr=fan.getBoundingClientRect();if(fr.bottom<40||fr.top>H-40||fr.width<10)return null;
  heroImgs=[c1,c3,c2];
  return heroImgs.map(function(im){
    var r=im.getBoundingClientRect(),m=getComputedStyle(im).transform,ang=0,mm=/matrix\(([^,]+),([^,]+)/.exec(m||"");
    if(mm)ang=Math.atan2(parseFloat(mm[2]),parseFloat(mm[1]))*180/PI;
    return{im:im,x:r.left+r.width/2-W/2,y:r.top+r.height/2-H/2,w:im.offsetWidth,h:im.offsetHeight||im.offsetWidth*514/300,a:ang,src:im.currentSrc||im.src};
  });
}
function launchHero(){
  heroOK=readHero();if(!heroOK)return;
  heroOK.forEach(function(h,k){
    var el=document.createElement("div");el.className="kri-card hero";
    var f=document.createElement("i"),b=document.createElement("i");f.className="f";b.className="b";
    f.style.backgroundImage="url("+h.src+")";b.style.backgroundImage="url(cards/t/back.webp)";el.appendChild(f);el.appendChild(b);
    el.style.width=h.w+"px";el.style.height=h.h+"px";el.style.margin=(-h.h/2)+"px 0 0 "+(-h.w/2)+"px";stage.appendChild(el);
    heroFly.push({el:el,h:h,t0:T.deal+[0,.14,.3][k],dur:1.05,k:k,done:false,flipped:k===2});
  });
}
function moveHero(t){
  for(var n=0;n<heroFly.length;n++){var c=heroFly[n];if(c.done)continue;var h=c.h;
    if(t<c.t0){c.el.style.opacity="0";continue}
    var p=seg(t,c.t0,c.t0+c.dur),e=ioSine(ioCubic(p)*.5+p*.5),
        /* sanfter Bogen nach oben, dann hinein in den Fächer */
        cx0=0,cy0=0,qx=h.x*1.15,qy=h.y*.25,
        x=(1-e)*(1-e)*cx0+2*(1-e)*e*qx+e*e*h.x,y=(1-e)*(1-e)*cy0+2*(1-e)*e*qy+e*e*h.y,
        s=lerp(.34,1,ioCubic(p)),rz=lerp((c.k-1)*-14,h.a,e),ry=c.flipped?0:180-180*sm(seg(p,.15,.85));
    c.el.style.transform="translate3d("+x.toFixed(2)+"px,"+y.toFixed(2)+"px,0) rotateZ("+rz.toFixed(2)+"deg) rotateY("+ry.toFixed(2)+"deg) scale("+s.toFixed(4)+")";
    c.el.style.opacity=ss(seg(p,0,.18)).toFixed(3);c.el.style.zIndex=10+c.k;
    if(p>=1){c.done=true;if(AU)AU.land(c.k);h.im.classList.add("kri-landed");c.el.style.display="none";spark(W/2+h.x,H/2+h.y-h.h*.2,M<600?16:24,110,1.1)}
  }
}
function landAll(){(heroImgs||[].slice.call(document.querySelectorAll(".mx-fan img"))).forEach(function(im){im.classList.add("kri-landed")})}


/* ---------- Klang (Web Audio, live erzeugt, keine Audiodateien) ----------
   Browser erlauben Ton erst nach einer Berührung. Deshalb beginnt das Opening mit „Eintreten“.
   Klangbild: tiefer Grundton (A), Glocken in A-lydisch-pentatonisch (A H Cis E Fis),
   ein Raum aus Nachhall, Rascheln der Karten, ein Gong beim Namen, ein Atemzug beim Schließen. */
var AU=null;
function makeAudio(){
  var A=window.AudioContext||window.webkitAudioContext;if(!A)return null;
  var ac;try{ac=new A()}catch(e){return null}
  try{if(ac.state==="suspended")ac.resume()}catch(e){}
  var now=function(){return ac.currentTime},out=ac.createGain(),comp=ac.createDynamicsCompressor();
  out.gain.value=.0001;comp.threshold.value=-20;comp.knee.value=12;comp.ratio.value=3;comp.attack.value=.01;comp.release.value=.3;
  out.connect(comp);comp.connect(ac.destination);out.gain.exponentialRampToValueAtTime(.6,now()+.6);
  /* Nachhall: erzeugter Raum, ca. 4,5 s */
  var len=Math.floor(ac.sampleRate*4.5),ib=ac.createBuffer(2,len,ac.sampleRate);
  for(var ch=0;ch<2;ch++){var d=ib.getChannelData(ch);for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
  var rev=ac.createConvolver();rev.buffer=ib;var rg=ac.createGain();rg.gain.value=.62;rev.connect(rg);rg.connect(out);
  var dry=ac.createGain();dry.gain.value=.75;dry.connect(out);
  var nb=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),nd=nb.getChannelData(0);for(var k=0;k<nd.length;k++)nd[k]=Math.random()*2-1;
  function route(node,wet,pan){var n=node;if(pan&&ac.createStereoPanner){var p=ac.createStereoPanner();p.pan.value=cl(pan,-1,1);node.connect(p);n=p}
    n.connect(dry);var w=ac.createGain();w.gain.value=wet;n.connect(w);w.connect(rev)}
  function env(g,t,a,peak,dec){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dec)}
  /* Glocke: Grundton + unharmonische Teiltöne */
  function bell(f,vol,dec,pan,wet,at){var t=at||now()+.01,parts=[[1,1],[2,.32],[2.76,.18],[5.4,.06],[8.93,.025]];
    parts.forEach(function(q){var o=ac.createOscillator(),g=ac.createGain();o.type="sine";o.frequency.value=f*q[0];env(g,t,.006,vol*q[1],dec/(1+q[0]*.35));o.connect(g);route(g,wet==null?.7:wet,pan);o.start(t);o.stop(t+dec+.1)})}
  /* Rauschen durch ein wanderndes Bandpassfilter: Wehen, Rascheln, Atem */
  function whoosh(dur,f0,f1,vol,pan,q,wet){var t=now()+.01,s=ac.createBufferSource(),bp=ac.createBiquadFilter(),g=ac.createGain();
    s.buffer=nb;s.loop=true;bp.type="bandpass";bp.Q.value=q||.9;bp.frequency.setValueAtTime(f0,t);bp.frequency.exponentialRampToValueAtTime(f1,t+dur);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+dur*.55);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    s.connect(bp);bp.connect(g);route(g,wet==null?.5:wet,pan);s.start(t,Math.random());s.stop(t+dur+.05)}
  /* Grundton: tiefe Quinten mit atmendem Filter */
  var dg=ac.createGain(),lp=ac.createBiquadFilter();lp.type="lowpass";lp.frequency.value=220;lp.Q.value=.7;dg.gain.value=.0001;lp.connect(dg);route(dg,.45);
  var oscs=[[55,"sine",.55],[55.25,"sine",.4],[82.41,"triangle",.16],[110,"sine",.22],[164.81,"sine",.07],[220.4,"sine",.04]].map(function(o){
    var x=ac.createOscillator(),g=ac.createGain();x.type=o[1];x.frequency.value=o[0];g.gain.value=o[2];x.connect(g);g.connect(lp);x.start();return x});
  var lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=.13;lg.gain.value=70;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();
  function droneTo(v,cut,sec){var t=now();dg.gain.cancelScheduledValues(t);dg.gain.setValueAtTime(Math.max(dg.gain.value,.0001),t);dg.gain.exponentialRampToValueAtTime(Math.max(v,.0001),t+sec);
    lp.frequency.cancelScheduledValues(t);lp.frequency.setValueAtTime(lp.frequency.value,t);lp.frequency.exponentialRampToValueAtTime(cut,t+sec)}
  /* Schimmer über dem Siegel: hohe, leise Obertöne */
  var sg=ac.createGain();sg.gain.value=.0001;route(sg,.9);
  [880,1318.5,1760,2217.5].forEach(function(f,i){var x=ac.createOscillator(),g=ac.createGain(),tr=ac.createOscillator(),tg=ac.createGain();
    x.frequency.value=f*(1+(i-1.5)*.0012);g.gain.value=.018/(1+i*.6);tr.frequency.value=.7+i*.37;tg.gain.value=g.gain.value*.8;tr.connect(tg);tg.connect(g.gain);x.connect(g);g.connect(sg);x.start();tr.start();oscs.push(x,tr)});
  var N5=[440,493.88,554.37,659.26,739.99,880,987.77,1108.73,1318.51,1479.98,1760];
  var ev=[],fired={};
  function at(t,f){ev.push([t,f])}
  /* Ablauf in Sekunden des Openings */
  at(0,function(){droneTo(.32,260,2.4)});
  at(.45,function(){var t=now();sg.gain.setValueAtTime(.0001,t);sg.gain.exponentialRampToValueAtTime(.9,t+1.8)});
  [[.5,10,-.5],[.82,7,.4],[1.12,8,-.2],[1.45,6,.55],[1.8,9,-.6],[2.15,5,.2]].forEach(function(n){at(n[0],function(){bell(N5[n[1]],.07,3.6,n[2],.85)})});
  at(1.88,function(){bell(110,.16,5,0,.6);bell(220,.08,4.5,0,.7);whoosh(1.9,180,1400,.11,0,.7,.6);droneTo(.42,900,2.2)});
  for(var c=0;c<22;c++)(function(c){var a=TAU*c/22;at(2.05+c*.085,function(){whoosh(.16,2600,5200,.035,Math.sin(a)*.8,1.4,.35)});
    if(c%3===0)at(T.flip+c*.05+.3,function(){bell(N5[6+(c/3|0)%5],.028,2.2,Math.sin(a)*.7,.9)})})(c);
  at(3.3,function(){whoosh(.75,300,3200,.07,0,.6,.7)});
  at(3.98,function(){[110,220,329.63,440,554.37].forEach(function(f,i){bell(f,[.2,.12,.08,.06,.045][i],[7,6,5,4.5,4][i],(i-2)*.18,.75)});
    var t=now();sg.gain.cancelScheduledValues(t);sg.gain.setValueAtTime(sg.gain.value,t);sg.gain.exponentialRampToValueAtTime(.35,t+2)});
  at(4.6,function(){bell(1108.73,.03,3,.5,.9);bell(1479.98,.025,3,-.5,.9)});
  at(5.4,function(){whoosh(1.05,4200,260,.09,0,.8,.6);droneTo(.26,320,1.1);var t=now();sg.gain.cancelScheduledValues(t);sg.gain.setValueAtTime(sg.gain.value,t);sg.gain.exponentialRampToValueAtTime(.0001,t+1)});
  at(6.42,function(){var t=now(),o=ac.createOscillator(),g=ac.createGain();o.type="sine";o.frequency.setValueAtTime(96,t);o.frequency.exponentialRampToValueAtTime(38,t+1.1);
    env(g,t,.012,.42,1.4);o.connect(g);route(g,.35);o.start(t);o.stop(t+1.6);bell(220,.1,5,0,.7);bell(659.26,.05,4,.2,.8)});
  [0,.14,.3].forEach(function(d,k){at(T.deal+d+.05,function(){whoosh(.7,700,2600,.06,(k-1)*.7,1,.5)})});
  at(T.fade[0],function(){droneTo(.0001,200,2.2)});
  return{
    tick:function(t){for(var i=0;i<ev.length;i++)if(!fired[i]&&t>=ev[i][0]){fired[i]=1;try{ev[i][1]()}catch(e){}}},
    land:function(k){bell(N5[[3,4,5][k]||5],.07,3.5,[-.5,.5,0][k]||0,.8)},
    mute:function(m){var t=now();out.gain.cancelScheduledValues(t);out.gain.setValueAtTime(Math.max(out.gain.value,.0001),t);out.gain.exponentialRampToValueAtTime(m?.0001:.6,t+.35)},
    stop:function(sec){var t=now();out.gain.cancelScheduledValues(t);out.gain.setValueAtTime(Math.max(out.gain.value,.0001),t);out.gain.exponentialRampToValueAtTime(.0001,t+(sec||1.2));
      setTimeout(function(){try{oscs.forEach(function(x){x.stop()});lfo.stop();ac.close()}catch(e){}},((sec||1.2)+.3)*1000)}
  };
}

/* ---------- Taktgeber ---------- */
var Tm=0,last=0,raf=0,ended=false,bursts={},HOLD=.42,waiting=!reduce&&AT===null,autoGo=0,enterUI=null,sndB=null,muted=false;
function once(k,f){if(!bursts[k]){bursts[k]=1;f()}}
function frame(now){
  var dt=last?Math.min((now-last)/1000,1/12):1/60;last=now;Tm+=dt;if(AT!==null)Tm=AT;if(waiting&&Tm>HOLD)Tm=HOLD;var t=Tm;
  if(waiting){autoGo+=dt;if(autoGo>12)enter(false)}
  if(AU)AU.tick(t);
  if(!reduce&&t>=T.deal-.2&&!heroTried){heroTried=true;launchHero();if(!heroOK)T.end=7.2}
  drawSky(t,dt);
  if(!reduce){drawRing(t);moveHero(t);
    if(t>1.9)once("b",function(){spark(W/2,H/2,M<600?18:30,90,1.3)});
    if(t>6.4)once("c",function(){spark(W/2,H/2,M<600?14:22,70,1)})}
  drawTitle(t);
  if(t>=(reduce?1.8:T.fade[0]+.15)&&!html.classList.contains("kri-show")){html.classList.add("kri-show");if(reduce||!heroOK)landAll()}
  if(AT===null&&t>=(reduce?2.6:T.end)){end();return}
  raf=requestAnimationFrame(frame);
}


/* ---------- Eintreten ---------- */
function buildEnter(){
  enterUI=document.createElement("div");enterUI.className="kri-enter";
  enterUI.innerHTML='<button class="kri-go" type="button" aria-label="Eintreten mit Klang"><i aria-hidden="true"></i><b>Eintreten</b><small>mit Klang</small></button>'+
    '<button class="kri-quiet" type="button">ohne Klang eintreten</button><p>Kopfhörer empfohlen</p>';
  root.appendChild(enterUI);
  enterUI.querySelector(".kri-go").addEventListener("click",function(e){e.stopPropagation();enter(true)});
  enterUI.querySelector(".kri-quiet").addEventListener("click",function(e){e.stopPropagation();enter(false)});
  setTimeout(function(){try{enterUI.querySelector(".kri-go").focus({preventScroll:true})}catch(x){}},60);
}
function enter(withSound){
  if(!waiting)return;waiting=false;
  if(enterUI){enterUI.classList.add("gone");setTimeout(function(){enterUI&&enterUI.parentNode&&enterUI.parentNode.removeChild(enterUI)},900)}
  if(withSound){AU=makeAudio();
    if(AU){sndB=document.createElement("button");sndB.type="button";sndB.className="kri-snd";sndB.setAttribute("aria-label","Klang ausschalten");sndB.textContent="♪ Klang an";
      sndB.addEventListener("click",function(e){e.stopPropagation();muted=!muted;AU.mute(muted);sndB.textContent=muted?"♪ Klang aus":"♪ Klang an";sndB.setAttribute("aria-label",muted?"Klang einschalten":"Klang ausschalten");sndB.classList.toggle("off",muted)});
      root.appendChild(sndB)}}
  root.classList.add("entered");
}

/* ---------- Ende und Überspringen ---------- */
var skipping=false;
function cleanup(){
  if(ended)return;ended=true;cancelAnimationFrame(raf);
  if(AU){AU.stop(1.6);AU=null}
  removeEventListener("resize",size);removeEventListener("keydown",onKey,true);
  drop();
  [].forEach.call(document.querySelectorAll(".mx-fan img.kri-landed"),function(im){im.classList.remove("kri-landed")});
  html.classList.remove("kri-on","kri-show");
  /* Erstbesuch: das Willkommensfenster erscheint erst, nachdem die Karten gelandet sind */
  var gate=document.getElementById("gate");
  if(gate&&gate.classList.contains("show")){
    html.classList.add("kri-wait");
    setTimeout(function(){html.classList.remove("kri-wait");html.classList.add("kri-gate");setTimeout(function(){html.classList.remove("kri-gate")},1300)},skipping?250:1300);
  }
}
function end(){cleanup()}
function skip(){
  if(skipping||ended)return;skipping=true;cancelAnimationFrame(raf);
  if(AU){AU.stop(.6);AU=null}
  landAll();html.classList.add("kri-show");
  root.style.transition="opacity .6s ease";root.style.opacity="0";root.style.pointerEvents="none";
  setTimeout(cleanup,650);
}
function onKey(e){if(waiting){if(e.key==="Escape"){e.preventDefault();skip()}return}if(e.key==="Escape"||e.key==="Enter"||e.key===" "){e.preventDefault();skip()}}
root.addEventListener("click",function(){if(waiting)enter(true);else skip()});
if(skipB)skipB.addEventListener("click",function(e){e.stopPropagation();skip()});
addEventListener("keydown",onKey,true);
addEventListener("resize",size);
document.addEventListener("visibilitychange",function(){if(!document.hidden)last=0});

/* ---------- Start ---------- */
size();initStars();initMotes();if(!reduce)initCards();else layoutRing();
if(waiting)buildEnter();else root.classList.add("entered");
raf=requestAnimationFrame(frame);
})();
