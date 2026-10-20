/* Mond: echter aktueller Mondzyklus */
/* ===== MOND: echter aktueller Mondzyklus (Meeus, gekuerzte Reihen) + echte Libration als 3D-Kugel + prozedurale Oberflaeche.
   Gerechnet und gezeichnet wird in einem eigenen Hintergrund-Thread (Web Worker + OffscreenCanvas), damit die Seite flüssig bleibt.
   Ältere Browser ohne OffscreenCanvas zeichnen denselben Mond sparsam im Haupt-Thread.
   Klangraum schließt sich nach 3 Sekunden Benutzung ===== */
(function(){
/* Astronomie: Phase, Länge, Breite, Libration (läuft auf Seite und im Worker) */
function MOONMATH(){
const R=Math.PI/180,mod=(a,m)=>((a%m)+m)%m;
function moonState(date){
 const d=date.getTime()/86400000+2440587.5-2451545.0;
 const sn=x=>Math.sin(x*R);
 const Lm=218.316+13.176396*d,Mm=134.963+13.064993*d,M=357.529+0.98560028*d,D=297.850+12.190749*d,F=93.272+13.229350*d;
 const lon=mod(Lm+6.289*sn(Mm)+1.274*sn(2*D-Mm)+0.658*sn(2*D)+0.214*sn(2*Mm)-0.186*sn(M)-0.114*sn(2*F)-0.059*sn(2*D-2*Mm)-0.057*sn(2*D-M-Mm)+0.053*sn(2*D+Mm)+0.046*sn(2*D-M),360);
 const lat=5.128*sn(F)+0.281*sn(Mm+F)+0.278*sn(Mm-F)+0.173*sn(2*D-F);
 const g=357.528+0.9856003*d,sun=mod(280.460+0.9856474*d+1.915*sn(g)+0.020*sn(2*g),360);
 const E=mod(lon-sun,360);
 const cosPsi=Math.cos(lat*R)*Math.cos(E*R);
 const k=(1-cosPsi)/2;
 return {E,k,lon,lat,d,age:E/360*29.530589};
}
function libration(st){
 const I=1.54242*R,Om=(125.0445-0.0529538*st.d)*R,F=(93.272+13.229350*st.d)*R,W=st.lon*R-Om,be=st.lat*R;
 const A=Math.atan2(Math.sin(W)*Math.cos(be)*Math.cos(I)-Math.sin(be)*Math.sin(I),Math.cos(W)*Math.cos(be));
 let l=mod((A-F)/R+180,360)-180;
 const b=Math.asin(-Math.sin(W)*Math.cos(be)*Math.sin(I)-Math.sin(be)*Math.cos(I))/R;
 return {l,b};
}
return {R,mod,moonState,libration};
}
/* Oberfläche, Karte der ganzen Kugel und Beleuchtung */
function MOONCORE(cv){
 const R=Math.PI/180,ctx=cv.getContext("2d");
 const hash=(x,y,z)=>{let h=(x*374761393+y*668265263+z*2147483647)|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296};
 const hh=(x,y,z,s)=>hash(x+s*131,y+s*71,z+s*17);
 const sm=t=>t*t*(3-2*t);
 function vn(x,y,z,s){const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),fx=sm(x-ix),fy=sm(y-iy),fz=sm(z-iz);
  const g=(a,b,c)=>hh(ix+a,iy+b,iz+c,s),L=(a,b,t)=>a+(b-a)*t;
  return L(L(L(g(0,0,0),g(1,0,0),fx),L(g(0,1,0),g(1,1,0),fx),fy),L(L(g(0,0,1),g(1,0,1),fx),L(g(0,1,1),g(1,1,1),fx),fy),fz)}
 const fbm=(x,y,z,o)=>{let a=.5,f=1,t=0;for(let i=0;i<o;i++){t+=a*vn(x*f,y*f,z*f,i);f*=2.03;a*=.5}return t};
 const vec=(lo,la)=>{lo*=R;la*=R;return [Math.sin(lo)*Math.cos(la),Math.sin(la),Math.cos(lo)*Math.cos(la)]};
 const MARIA=[[-16,35,.30,.8],[18,28,.17,.75],[31,8,.20,.8],[51,-4,.15,.62],[59,17,.11,.85],[-15,-21,.19,.6],[-39,-24,.13,.75],[-55,15,.40,.5],[0,58,.15,.4],[34,-15,.09,.6],[3,14,.12,.55],[-30,44,.13,.5],[-8,-40,.08,.25],[22,50,.07,.45],[-3,0,.10,.45],
  /* Rückseite: fast nur Hochland, kleine dunkle Becken (Moskau-Meer, Apollo, Ingenii) */
  [147,27,.05,.55],[-151,-36,.06,.35],[163,-34,.04,.4]].map(m=>({c:vec(m[0],m[1]),s2:m[2]*m[2],w:m[3]}));
 const CR=[[-11.4,-43.3,1,.9],[-20,9.6,.8,.7],[-47.4,23.7,.7,.55],[-38,8.1,.5,.4],[-1.5,-13,.3,.2],[129,-10,.6,.5]].map(c=>({c:vec(c[0],c[1]),b:c[2],r:c[3],a:c[0]}));
 /* Oberfläche eines Punktes auf der Kugel: Helligkeit (Albedo) und Höhe */
 function surf(px,py,pz,lo){
  const NS=lo?0:4;
  let a=.50+.16*(fbm(px*3.2+5,py*3.2,pz*3.2,lo?3:5)-.5)*2+(lo?0:.05*(fbm(px*18,py*18,pz*18,3)-.5));
  let mare=0;
  for(const m of MARIA){const dt=1-(px*m.c[0]+py*m.c[1]+pz*m.c[2]);if(dt>.6)continue;
   const wob=.75+.5*fbm(px*7+2,py*7+9,pz*7+4,4);
   mare+=m.w*Math.exp(-dt/(m.s2*wob*.55))}
  mare=Math.min(1,mare);const mm=mare*(.78+.22*fbm(px*9,py*9,pz*9,3));
  a=a*(1-.64*mm);
  let h=-.10*mm+.05*(fbm(px*5,py*5,pz*5,4)-.5);
  for(let sc=0;sc<NS;sc++){
   const S=[7,15,31,62][sc],amp=[1,.7,.45,.28][sc];
   const gx=px*S,gy=py*S,gz=pz*S,cx=Math.floor(gx),cy=Math.floor(gy),cz=Math.floor(gz);
   for(let u=-1;u<=1;u++)for(let v=-1;v<=1;v++)for(let w=-1;w<=1;w++){
    const qx=cx+u,qy=cy+v,qz=cz+w,p0=hh(qx,qy,qz,sc+50);
    if(p0>(sc<2?.38:.55))continue;
    const ox=qx+.15+.7*hh(qx,qy,qz,sc+60),oy=qy+.15+.7*hh(qx,qy,qz,sc+70),oz=qz+.15+.7*hh(qx,qy,qz,sc+80);
    const rad=(.16+.30*hh(qx,qy,qz,sc+90))*(1-.4*mm);
    const dx=gx-ox,dy=gy-oy,dz=gz-oz,dd=Math.sqrt(dx*dx+dy*dy+dz*dz)/rad;
    if(dd>1.8)continue;
    const bowl=dd<1?-(1-dd*dd)*.9:0,rim=Math.exp(-((dd-1.05)*(dd-1.05))/.03)*.7;
    h+=amp*.07*(bowl+rim);
    a+=amp*.05*(rim*1.2-(dd<1?(1-dd)*.6:0)+(dd<1.7&&dd>1?.15*(1.7-dd)*hh(qx,qy,qz,9):0));
   }
  }
  for(const c of CR){const dt=1-(px*c.c[0]+py*c.c[1]+pz*c.c[2]);
   if(dt<.20){const th=Math.atan2(py-c.c[1],px-c.c[0]);
    const ray=Math.pow(Math.abs(Math.cos(th*7+c.a)*Math.cos(th*3+c.a*2)),2.2);
    a+=c.b*.45*Math.exp(-dt/.05)*(.35+.65*ray)*Math.exp(-dt/.06);
    if(!lo)a+=c.b*.5*Math.exp(-dt/.0018);
    if(dt<.0035*c.r*3){h-=.05*c.r;}}}
  return [Math.max(.04,Math.min(1,a)),h];
 }
 /* Ganze Kugel als Karte (Länge × Breite), damit sie sich drehen kann.
    Erst die zur Erde zeigende Seite, danach die Rückseite. Bis dahin dient eine grobe Vorlage als Platzhalter. */
 function makeTex(TW,TH,base,lod){
  const n=TW*TH,T={TW,TH,A:new Float32Array(n),H:new Float32Array(n),A2:new Float32Array(n),H2:new Float32Array(n),GE:new Float32Array(n),GN:new Float32Array(n),j:0,done:false,near:false};
  if(base){for(let v=0;v<TH;v++)for(let u=0;u<TW;u++){const id=v*TW+u,su=(u+.5)/TW*base.TW-.5,sv=(v+.5)/TH*base.TH-.5;T.A[id]=samp(base,base.A,su,sv);T.H[id]=samp(base,base.H,su,sv)}grad(T)}
  const nU0=Math.floor(TW*80/360),nU1=Math.ceil(TW*280/360),jobs=[];
  for(let v=0;v<TH;v++)jobs.push([v,nU0,nU1]);
  const nearJobs=jobs.length;
  for(let v=0;v<TH;v++){jobs.push([v,0,nU0]);jobs.push([v,nU1,TW])}
  T.step=budget=>{const t0=performance.now();let ev=0;
   while(T.j<jobs.length&&performance.now()-t0<budget){const [v,u0,u1]=jobs[T.j++],la=(90-(v+.5)/TH*180)*R,cl=Math.cos(la),sl=Math.sin(la);
    for(let u=u0;u<u1;u++){const lo=((u+.5)/TW*360-180)*R,r=surf(Math.sin(lo)*cl,sl,Math.cos(lo)*cl,lod),id=v*TW+u;T.A2[id]=r[0];T.H2[id]=r[1]}
    if(T.j===nearJobs){for(let w=0;w<TH;w++){const o=w*TW;T.A.set(T.A2.subarray(o+nU0,o+nU1),o+nU0);T.H.set(T.H2.subarray(o+nU0,o+nU1),o+nU0)}grad(T);T.near=true;ev=1}}
   if(T.j>=jobs.length&&!T.done){T.A.set(T.A2);T.H.set(T.H2);T.A2=T.H2=null;grad(T);T.done=true;ev=1}
   return ev};
  return T;
 }
 function grad(T){const TW=T.TW,TH=T.TH,dL=2*Math.PI/TW,dB=Math.PI/TH;
  for(let v=0;v<TH;v++){const cl=Math.max(.12,Math.cos((90-(v+.5)/TH*180)*R)),vu=Math.max(0,v-1),vd=Math.min(TH-1,v+1);
   for(let u=0;u<TW;u++){const id=v*TW+u,ul=(u+TW-1)%TW,ur=(u+1)%TW;
    T.GE[id]=(T.H[v*TW+ur]-T.H[v*TW+ul])/(2*dL*cl);
    T.GN[id]=(T.H[vu*TW+u]-T.H[vd*TW+u])/((vd-vu)*dB)}}}
 /* weiche (bilineare) Abtastung, Länge läuft rundherum */
 function samp(T,F,fu,fv){const TW=T.TW,TH=T.TH;let u0=Math.floor(fu),v0=Math.floor(fv);const du=fu-u0,dv=fv-v0;
  let u1=u0+1,v1=v0+1;u0=(u0%TW+TW)%TW;u1=u1%TW;if(v0<0)v0=0;if(v1>TH-1)v1=TH-1;if(v0>TH-1)v0=TH-1;
  const a=F[v0*TW+u0],b=F[v0*TW+u1],c=F[v1*TW+u0],d=F[v1*TW+u1];
  return (a+(b-a)*du)*(1-dv)+(c+(d-c)*du)*dv}
 /* Bildpunkte der Scheibe einmal vorberechnen */
 function makeDisc(N){cv.width=N;cv.height=N;
  const D={N,X:new Float32Array(N*N),Y:new Float32Array(N*N),Z:new Float32Array(N*N),Rr:new Float32Array(N*N),img:ctx.createImageData(N,N)};
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=(i+.5)/N*2-1,y=1-(j+.5)/N*2,r2=x*x+y*y,id=j*N+i;D.X[id]=x;D.Y[id]=y;D.Rr[id]=Math.sqrt(r2);D.Z[id]=Math.sqrt(Math.max(0,1-r2))}
  return D;
 }
 /* Zeichnen: Licht nach echter Mondphase, Drehung nach Libration (L = Länge, B = Breite, in Grad) */
 function render(D,T,st,L,B){
  const N=D.N,px8=D.img.data,TW=T.TW,TH=T.TH,AA=T.A,GE=T.GE,GN=T.GN;
  const cy=Math.cos(L*R),sy=Math.sin(L*R),cb=Math.cos(-B*R),sb=Math.sin(-B*R);
  /* q = Ry(L)·Rx(-B)·p  (Bildschirm → Mondkugel) */
  const m00=cy,m01=sy*sb,m02=sy*cb,m10=0,m11=cb,m12=-sb,m20=-sy,m21=cy*sb,m22=cy*cb;
  const E=st.E*R,sx=Math.sin(E),sz=-Math.cos(E),sy0=.10,sl=Math.hypot(sx,sy0,sz),S0=sx/sl,S1=sy0/sl,S2=sz/sl;
  const Sx=m00*S0+m01*S1+m02*S2,Sy=m10*S0+m11*S1+m12*S2,Sz=m20*S0+m21*S1+m22*S2;
  const Vx=m02,Vy=m12,Vz=m22,K=1.3,es0=.075*(1-st.k),f=c=>Math.max(0,Math.min(255,Math.pow(Math.min(1.1,c),.82)*238));
  for(let id=0,n=N*N;id<n;id++){
   const o=id*4,r=D.Rr[id];
   if(r>1.03){px8[o+3]=0;continue}
   const al=Math.max(0,Math.min(1,(1-r)*N*.5/1.7+.5));
   if(al<=0){px8[o+3]=0;continue}
   const x=D.X[id],y=D.Y[id],z=D.Z[id];
   const qx=m00*x+m01*y+m02*z,qy=m10*x+m11*y+m12*z,qz=m20*x+m21*y+m22*z;
   const lo=Math.atan2(qx,qz),la=Math.asin(qy>1?1:qy<-1?-1:qy);
   const fu=(lo/Math.PI+1)*.5*TW-.5,fv=(.5-la/Math.PI)*TH-.5;
   let u0=Math.floor(fu),v0=Math.floor(fv);const du=fu-u0,dv=fv-v0;let u1=u0+1,v1=v0+1;
   u0=(u0+TW)%TW;u1=u1%TW;if(v0<0)v0=0;if(v1>TH-1)v1=TH-1;
   const i00=v0*TW+u0,i01=v0*TW+u1,i10=v1*TW+u0,i11=v1*TW+u1,w00=(1-du)*(1-dv),w01=du*(1-dv),w10=(1-du)*dv,w11=du*dv;
   const ge=r<.985?GE[i00]*w00+GE[i01]*w01+GE[i10]*w10+GE[i11]*w11:0,gn=r<.985?GN[i00]*w00+GN[i01]*w01+GN[i10]*w10+GN[i11]*w11:0;
   const cl=Math.cos(lo),sn=Math.sin(lo),sla=Math.sin(la),cla=Math.cos(la);
   /* Ost- und Nordrichtung auf der Kugel, daraus die geneigte Oberfläche */
   let nx=qx-K*(ge*cl-gn*sn*sla),ny=qy-K*(gn*cla),nz=qz-K*(-ge*sn-gn*cl*sla);
   const nl=Math.hypot(nx,ny,nz);nx/=nl;ny/=nl;nz/=nl;
   const mu=nx*Sx+ny*Sy+nz*Sz,mu0=Math.max(.0001,nx*Vx+ny*Vy+nz*Vz);
   let Lt=0;if(mu>0)Lt=mu/(mu+mu0*.9)*1.75;
   Lt*=Math.min(1,Math.max(0,(mu+.05)/.17));
   const geo=qx*Sx+qy*Sy+qz*Sz;Lt*=Math.min(1,Math.max(0,(geo+.02)/.085));
   const alb=AA[i00]*w00+AA[i01]*w01+AA[i10]*w10+AA[i11]*w11,vv=Lt*(.28+alb*1.05),es=es0*(.4+.6*alb)*(1-.5*r*r)+.012;
   px8[o]=f(vv+es*.80);px8[o+1]=f(vv*.985+es*.90);px8[o+2]=f(vv*.94+es*1.05);px8[o+3]=al*255;
  }
  ctx.putImageData(D.img,0,0);
 }
 return {makeTex,makeDisc,render};
}
/* Animations-Schleife: Zeitraffer der echten Libration, feine Oberfläche nach und nach */
function MOONLOOP(MM,MC,send,fast){
 let tex,lowT,hiT,disc,st,lib0,rm=false,run=true,uL=0,uB=0,user=false,SPEED=27.55*864e5/45000,t0=0,now0=0,tm=0,N=150,TW=360;
 const FR=fast?66:100,BUD=fast?24:8;
 let fc=0,sent=0;
 function frame(){tm=0;
  const gen=hiT&&!hiT.done;let ev=0;
  if(gen){ev=hiT.step(BUD);if(ev&&hiT.near&&!sent){sent=1;fc=-1}}
  if(gen&&!ev&&!user&&(++fc%(fast?3:12))){tm=setTimeout(frame,16);return}
  const lb=rm?lib0:MM.libration(MM.moonState(new Date(now0+(performance.now()-t0)*SPEED)));
  const L=lb.l+uL,B=Math.max(-80,Math.min(80,lb.b+uB));
  MC.render(disc,tex,st,L,B);
  if(sent===1){sent=2;send({near:1})}
  if(run&&(!rm||user||(hiT&&!hiT.done)))tm=setTimeout(frame,hiT&&!hiT.done?16:(user?33:FR));
 }
 const kick=()=>{if(!tm)tm=setTimeout(frame,0)};
 return function(m){
  if(m.init){rm=m.rm;N=m.N;TW=m.TW;now0=m.now;t0=performance.now();st=MM.moonState(new Date(now0));lib0=MM.libration(st);
   lowT=MC.makeTex(160,80,null,1);lowT.step(1e9);tex=lowT;disc=MC.makeDisc(N);
   hiT=MC.makeTex(TW,TW/2,lowT);tex=hiT;kick();send({ready:1})}
  if(m.now){st=MM.moonState(new Date(m.now));lib0=MM.libration(st)}
  if("rm" in m)rm=m.rm;
  if("run" in m)run=m.run;
  if("L" in m){uL=m.L;uB=m.B;user=!!m.user}
  if(run)kick();
 };
}
const MM=MOONMATH(),R=MM.R,mod=MM.mod,moonState=MM.moonState,libration=MM.libration;
function nextFull(from){let prev=mod(moonState(from).E-180,360);const H=36e5;for(let i=1;i<=24*32;i++){const t=new Date(from.getTime()+i*H),c=mod(moonState(t).E-180,360);if(c<prev&&prev>300)return t;prev=c}return null}
const NAMEN=[[6.5,"Neumond"],[83.5,"Zunehmende Sichel"],[96.5,"Erstes Viertel"],[173.5,"Zunehmender Mond"],[186.5,"Vollmond"],[263.5,"Abnehmender Mond"],[276.5,"Letztes Viertel"],[353.5,"Abnehmende Sichel"],[361,"Neumond"]];
const ZEICHEN=["Widder","Stier","Zwillinge","Krebs","Löwe","Jungfrau","Waage","Skorpion","Schütze","Steinbock","Wassermann","Fische"];
const el=document.getElementById("moon"),cv=document.getElementById("moonc"),cap=document.getElementById("mcap");
if(el&&cv){
 const rmq=matchMedia("(prefers-reduced-motion: reduce)");
 let st=moonState(new Date()),lib0=libration(st),post=null,vis=true;
 const size=()=>{const N=Math.min(460,Math.round((el.getBoundingClientRect().width||300)*Math.min(2,devicePixelRatio||1))+20);return {N,TW:Math.max(360,Math.min(720,Math.round(N*1.6/2)*2))}};
 function start(){
  const s=size(),init={init:1,N:s.N,TW:s.TW,now:Date.now(),rm:rmq.matches};
  try{
   if(cv.transferControlToOffscreen&&window.Worker&&window.OffscreenCanvas){
    const src="const MOONMATH="+MOONMATH+";const MOONCORE="+MOONCORE+";const MOONLOOP="+MOONLOOP+";let h;onmessage=e=>{const m=e.data;if(m.canvas){h=MOONLOOP(MOONMATH(),MOONCORE(m.canvas),x=>postMessage(x),true)}h&&h(m)};";
    const url=URL.createObjectURL(new Blob([src],{type:"text/javascript"})),w=new Worker(url),oc=cv.transferControlToOffscreen();
    w.onmessage=e=>{if(e.data&&e.data.ready)URL.revokeObjectURL(url);if(e.data&&e.data.near)el.classList.add("mready")};
    w.onerror=e=>console.error("Mond",e.message);
    init.canvas=oc;w.postMessage(init,[oc]);post=m=>w.postMessage(m);return;
   }
  }catch(e){console.error(e)}
  /* Rückfall: gleicher Mond im Haupt-Thread, mit weniger Bildern pro Sekunde */
  const h=MOONLOOP(MM,MOONCORE(cv),m=>{if(m.near)el.classList.add("mready")},false);h(init);post=h;
 }
 function caption(){
  el.style.setProperty("--li",st.k.toFixed(3));
  let nm="";for(const n of NAMEN){if(st.E<n[0]){nm=n[1];break}}
  const pct=Math.round(st.k*100),ag=st.age.toFixed(1).replace(".",",");
  const zk=ZEICHEN[Math.floor(st.lon/30)%12];
  const now=new Date(),fd=(d,y)=>d.toLocaleDateString("de-DE",y?{weekday:"short",day:"numeric",month:"long",year:"numeric"}:{weekday:"short",day:"numeric",month:"long"});
  const fz=v=>(v>=0?"+":"−")+Math.abs(v).toFixed(1).replace(".",",")+"°";
  let extra='<span class="mdate">'+fd(now,1)+'</span>';
  const nf=nextFull(now);
  if(nf){const dd=Math.max(0,Math.round((nf-now)/864e5)),isF=nm==="Vollmond";
   extra+='<span class="mfull"><i aria-hidden="true"></i><span class="mfl">'+(isF?"Heute Vollmond · nächster":"Nächster Vollmond")+'</span><b>'+fd(nf)+'</b><span class="mfd">in '+dd+(dd===1?" Tag":" Tagen")+'</span></span>'}
  extra+='<span class="mlib">Libration heute '+fz(lib0.l)+' / '+fz(lib0.b)+(rmq.matches?"":" · Taumeln im Zeitraffer")+'</span>';
  cap.innerHTML="<b>"+nm+"</b><span>"+pct+" % beleuchtet · Tag "+ag+" · Mond in "+zk+"</span>"+extra;
  el.setAttribute("aria-label","Aktueller Mond: "+nm+", "+pct+" Prozent beleuchtet");
  el.classList.add("on");
 }
 const runState=()=>post&&post({run:vis&&!document.hidden});
 function update(){try{st=moonState(new Date());lib0=libration(st);caption();if(post)post({now:Date.now(),rm:rmq.matches})}catch(e){console.error(e)}}
 /* Beschriftung sofort, den Mond selbst erst, wenn die Seite steht */
 update();
 const boot=()=>setTimeout(()=>{start();runState()},250);
 if(document.readyState==="complete")boot();else addEventListener("load",boot,{once:true});
 setInterval(update,60000);
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)update();runState()});
 if("IntersectionObserver" in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting;runState()}).observe(el);
 rmq.addEventListener&&rmq.addEventListener("change",update);
 /* Mit Maus oder Stift drehen: der Mond federt danach in seine echte Lage zurück */
 if(matchMedia("(pointer: fine)").matches){
  let dL=0,dB=0,drag=null,raf=0;
  const spring=()=>{raf=0;if(drag)return;dL*=.9;dB*=.9;if(Math.abs(dL)<.02&&Math.abs(dB)<.02){dL=dB=0;post&&post({L:0,B:0,user:false});return}post&&post({L:dL,B:dB,user:true});raf=requestAnimationFrame(spring)};
  cv.classList.add("mdrag");
  cv.addEventListener("pointerdown",e=>{drag={x:e.clientX,y:e.clientY,l:dL,b:dB};cv.setPointerCapture(e.pointerId);cv.classList.add("grab")});
  cv.addEventListener("pointermove",e=>{if(!drag)return;const w=cv.getBoundingClientRect().width||200;dL=drag.l-(e.clientX-drag.x)/w*180;dB=drag.b+(e.clientY-drag.y)/w*180;post&&post({L:dL,B:dB,user:true})});
  const up=()=>{if(!drag)return;drag=null;cv.classList.remove("grab");if(!raf)raf=requestAnimationFrame(spring)};
  cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
 }
 window.__moonState=moonState;
}
const p=document.getElementById("sndp"),sb=document.getElementById("sb");
if(p&&sb){let t,down=false;
 const close=()=>{p.hidden=true;sb.setAttribute("aria-expanded","false")};
 const arm=()=>{clearTimeout(t);if(p.hidden)return;t=setTimeout(()=>{down?arm():close()},3000)};
 p.addEventListener("click",e=>{if(e.target.closest("button"))arm()});
 p.addEventListener("input",arm);p.addEventListener("change",arm);
 p.addEventListener("pointerdown",e=>{if(e.target.closest("input[type=range]")){down=true;clearTimeout(t)}});
 addEventListener("pointerup",()=>{if(down){down=false;arm()}});
 sb.addEventListener("click",()=>clearTimeout(t));
}
})();
