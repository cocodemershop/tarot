/* Mond: echter aktueller Mondzyklus */
/* ===== MOND: echter aktueller Mondzyklus (Meeus, gekuerzte Reihen) + prozedurale Oberflaeche + Klangraum schließt sich nach 3 Sekunden Benutzung ===== */
(function(){
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
 return {E,k,lon,age:E/360*29.530589};
}
function nextFull(from){let prev=mod(moonState(from).E-180,360);const H=36e5;for(let i=1;i<=24*32;i++){const t=new Date(from.getTime()+i*H),c=mod(moonState(t).E-180,360);if(c<prev&&prev>300)return t;prev=c}return null}
const NAMEN=[[6.5,"Neumond"],[83.5,"Zunehmende Sichel"],[96.5,"Erstes Viertel"],[173.5,"Zunehmender Mond"],[186.5,"Vollmond"],[263.5,"Abnehmender Mond"],[276.5,"Letztes Viertel"],[353.5,"Abnehmende Sichel"],[361,"Neumond"]];
const ZEICHEN=["Widder","Stier","Zwillinge","Krebs","Löwe","Jungfrau","Waage","Skorpion","Schütze","Steinbock","Wassermann","Fische"];
const el=document.getElementById("moon"),cv=document.getElementById("moonc"),cap=document.getElementById("mcap");
if(el&&cv){
 const ctx=cv.getContext("2d");
 const hash=(x,y,z)=>{let h=(x*374761393+y*668265263+z*2147483647)|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296};
 const hh=(x,y,z,s)=>hash(x+s*131,y+s*71,z+s*17);
 const sm=t=>t*t*(3-2*t);
 function vn(x,y,z,s){const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),fx=sm(x-ix),fy=sm(y-iy),fz=sm(z-iz);
  const g=(a,b,c)=>hh(ix+a,iy+b,iz+c,s),L=(a,b,t)=>a+(b-a)*t;
  return L(L(L(g(0,0,0),g(1,0,0),fx),L(g(0,1,0),g(1,1,0),fx),fy),L(L(g(0,0,1),g(1,0,1),fx),L(g(0,1,1),g(1,1,1),fx),fy),fz)}
 const fbm=(x,y,z,o)=>{let a=.5,f=1,t=0;for(let i=0;i<o;i++){t+=a*vn(x*f,y*f,z*f,i);f*=2.03;a*=.5}return t};
 const vec=(lo,la)=>{lo*=R;la*=R;return [Math.sin(lo)*Math.cos(la),Math.sin(la),Math.cos(lo)*Math.cos(la)]};
 const MARIA=[[-16,35,.30,.8],[18,28,.17,.75],[31,8,.20,.8],[51,-4,.15,.62],[59,17,.11,.85],[-15,-21,.19,.6],[-39,-24,.13,.75],[-55,15,.40,.5],[0,58,.15,.4],[34,-15,.09,.6],[3,14,.12,.55],[-30,44,.13,.5],[-8,-40,.08,.25],[22,50,.07,.45],[-3,0,.10,.45]].map(m=>({c:vec(m[0],m[1]),s2:m[2]*m[2],w:m[3]}));
 const CR=[[-11.4,-43.3,1,.9],[-20,9.6,.8,.7],[-47.4,23.7,.7,.55],[-38,8.1,.5,.4],[-9,-43+25,0,0],[-1.5,-13,.3,.2]].filter(c=>c[2]>0).map(c=>({c:vec(c[0],c[1]),b:c[2],r:c[3],a:c[0]}));
 function build(N){cv.width=N;cv.height=N;
 const A=new Float32Array(N*N),Hh=new Float32Array(N*N),Z=new Float32Array(N*N),X=new Float32Array(N*N),Y=new Float32Array(N*N),Rr=new Float32Array(N*N);
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){
  const x=(i+.5)/N*2-1,y=1-(j+.5)/N*2,r2=x*x+y*y,id=j*N+i;
  Rr[id]=Math.sqrt(r2);X[id]=x;Y[id]=y;
  if(r2>=1.02){continue}
  const z=Math.sqrt(Math.max(0,1-r2));Z[id]=z;
  const px=x,py=y,pz=z;
  // Grundalbedo: Hochland mit Variation
  let a=.50+.16*(fbm(px*3.2+5,py*3.2,pz*3.2,5)-.5)*2+.05*(fbm(px*18,py*18,pz*18,3)-.5);
  // Maria
  let mare=0;
  for(const m of MARIA){const dt=1-(px*m.c[0]+py*m.c[1]+pz*m.c[2]);if(dt>.6)continue;
   const wob=.75+.5*fbm(px*7+2,py*7+9,pz*7+4,4);
   mare+=m.w*Math.exp(-dt/(m.s2*wob*.55))}
  mare=Math.min(1,mare);const mm=mare*(.78+.22*fbm(px*9,py*9,pz*9,3));
  a=a*(1-.64*mm);
  let h=-.10*mm+.05*(fbm(px*5,py*5,pz*5,4)-.5);
  // Krater (3 Maßstäbe, zellbasiert)
  for(let sc=0;sc<4;sc++){
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
  // helle Strahlenkrater
  for(const c of CR){const dt=1-(px*c.c[0]+py*c.c[1]+pz*c.c[2]);
   if(dt<.20){const th=Math.atan2(py-c.c[1],px-c.c[0]);
    const ray=Math.pow(Math.abs(Math.cos(th*7+c.a)*Math.cos(th*3+c.a*2)),2.2);
    a+=c.b*.45*Math.exp(-dt/.05)*(.35+.65*ray)*(dt<.001?1:1)*Math.exp(-dt/.06);
    a+=c.b*.5*Math.exp(-dt/.0018);
    if(dt<.0035*c.r*3){h-=.05*c.r;}}}
  A[id]=Math.max(.04,Math.min(1,a));Hh[id]=h;
 }
 // Beleuchtung
 const img=ctx.createImageData(N,N),px8=img.data;
 function render(st){
  const E=st.E*R,sx=Math.sin(E),sz=-Math.cos(E),tilt=.10,sy=tilt;
  const sl=Math.hypot(sx,sy,sz),Sx=sx/sl,Sy=sy/sl,Sz=sz/sl;
  const BUMP=26;
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){
   const id=j*N+i,o=id*4,r=Rr[id];
   if(r>1.03){px8[o+3]=0;continue}
   const al=Math.max(0,Math.min(1,(1-r)*N*.5/1.7+.5));
   if(al<=0){px8[o+3]=0;continue}
   const x=X[id],y=Y[id],z=Z[id];
   let gx=0,gy=0;
   if(i>0&&i<N-1&&j>0&&j<N-1&&r<.985){gx=(Hh[id+1]-Hh[id-1])*.5*N/2;gy=(Hh[id-N]-Hh[id+N])*.5*N/2}
   let nx=x-gx*BUMP*.05,ny=y-gy*BUMP*.05,nz=z+0.0;
   const nl=Math.hypot(nx,ny,nz);nx/=nl;ny/=nl;nz/=nl;
   const mu=nx*Sx+ny*Sy+nz*Sz,mu0=Math.max(.0001,nz);
   // Lommel-Seeliger mit weichem Terminator
   let L=0;
   if(mu>0)L=mu/(mu+mu0*.9)*1.75;
   L*=Math.min(1,Math.max(0,(mu+.05)/.17));
   // geometrische Terminator-Dämpfung (Kugel)
   const geo=x*Sx+y*Sy+z*Sz;
   L*=Math.min(1,Math.max(0,(geo+.02)/.085));
   const alb=A[id];
   let v=L*(.28+alb*1.05);
   // Erdschein auf der Nachtseite
   const es=.075*(1-st.k)*(.4+.6*alb)*(1-.5*r*r)+.012;
   let rch=v*1.0,gch=v*.985,bch=v*.94;
   rch+=es*.80;gch+=es*.90;bch+=es*1.05;
   const f=c=>Math.max(0,Math.min(255,Math.pow(Math.min(1.1,c),.82)*238));
   px8[o]=f(rch);px8[o+1]=f(gch);px8[o+2]=f(bch);px8[o+3]=al*255;
  }
  ctx.putImageData(img,0,0);
 }
 return render}
 let low=null,full=null,cur=null;
 function update(){
  const st=moonState(new Date());
  if(!cur)cur=low=build(150);
  cur(st);
  el.style.setProperty("--li",st.k.toFixed(3));
  let nm="";for(const n of NAMEN){if(st.E<n[0]){nm=n[1];break}}
  const pct=Math.round(st.k*100),ag=st.age.toFixed(1).replace(".",",");
  const zk=ZEICHEN[Math.floor(st.lon/30)%12];
  const now=new Date(),fd=(d,y)=>d.toLocaleDateString("de-DE",y?{weekday:"short",day:"numeric",month:"long",year:"numeric"}:{weekday:"short",day:"numeric",month:"long"});
  let extra='<span class="mdate">'+fd(now,1)+'</span>';
  const nf=nextFull(now);
  if(nf){const dd=Math.max(0,Math.round((nf-now)/864e5)),isF=nm==="Vollmond";
   extra+='<span class="mfull"><i aria-hidden="true"></i><span class="mfl">'+(isF?"Heute Vollmond · nächster":"Nächster Vollmond")+'</span><b>'+fd(nf)+'</b><span class="mfd">in '+dd+(dd===1?" Tag":" Tagen")+'</span></span>'}
  cap.innerHTML="<b>"+nm+"</b><span>"+pct+" % beleuchtet · Tag "+ag+" · Mond in "+zk+"</span>"+extra;
  el.setAttribute("aria-label","Aktueller Mond: "+nm+", "+pct+" Prozent beleuchtet");
  el.classList.add("on");
 }
 const go=()=>{try{update()}catch(e){console.error(e)}};
 requestAnimationFrame(()=>{go();setTimeout(()=>{try{cur=full=build(460);update()}catch(e){console.error(e)}},120)});
 setInterval(go,60000);
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)go()});
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
