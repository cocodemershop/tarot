/* Klangraum: generative Entspannungsmusik */
/* ===== KLANGRAUM: generative Entspannungsmusik ===== */
(function(){
const MD=[{n:"Mondlicht",d:"Tiefe, warme Ruhe",r:110,ch:[[0,7,15,19],[-4,3,7,14],[-2,5,10,14],[-7,0,3,10]],sc:[0,3,5,7,10]},{n:"Sternenmeer",d:"Weit, klar und leicht",r:146.83,ch:[[0,7,14,18],[5,9,12,19],[7,11,14,21],[2,9,14,17]],sc:[0,2,4,7,9]},{n:"Sonnenaufgang",d:"Sanft, hell und hoffnungsvoll",r:130.81,ch:[[0,7,11,16],[5,9,12,16],[-3,4,9,12],[-5,2,7,11]],sc:[0,2,4,7,9]},
{n:"Waldquelle",d:"Hell, leicht, plätschernd",r:130.81,ch:[[0,7,12,16],[5,9,12,19],[7,11,14,19],[2,9,12,16]],sc:[0,2,4,7,9],o:[1,2,3]},
{n:"Ozeantraum",d:"Tief, weit, schwebend",r:98,ch:[[0,7,14,17],[-2,5,12,16],[3,10,14,19],[-5,2,7,14]],sc:[0,2,3,7,9],o:[1,2],p:.6},
{n:"Tempelklang",d:"Offen, still, meditativ",r:116.54,ch:[[0,7,12,19],[0,5,12,17],[-2,5,10,17],[0,7,14,19]],sc:[0,2,5,7,9],o:[1,2],p:.5},
{n:"Nachtregen",d:"Zart, hoch, tropfend",r:123.47,ch:[[0,7,12,15],[-4,3,7,15],[-2,5,10,14],[-5,2,7,14]],sc:[0,3,5,7,10],o:[2,3]},
{n:"Kristallhöhle",d:"Funkelnd, klar, magisch",r:164.81,ch:[[0,7,11,18],[5,12,16,21],[7,14,19,23],[2,9,14,21]],sc:[0,2,4,6,7,9,11],o:[1,2],p:.8}];
let S=Object.assign({v:50,m:0},ls.g("et21_snd",{})),ac,mg,bus,dr,on=false,tm={},ci=0;
if(!MD[S.m]||!S.auto){S.m=0;S.auto=1}
const M=()=>MD[S.m],F=x=>M().r*Math.pow(2,x/12),R=(a,b)=>a+Math.random()*(b-a),pk=a=>a[Math.floor(Math.random()*a.length)];
function tone(f,type,t,a,peak,dec,dst,pan){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dec);o.connect(g);let n=g;if(pan!=null&&ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=pan;g.connect(p);n=p}n.connect(dst);o.start(t);o.stop(t+a+dec+.2)}
function pad(){const t=ac.currentTime,c=M().ch[ci++%4],lp=ac.createBiquadFilter();lp.type="lowpass";lp.frequency.value=750;lp.connect(bus);c.forEach((x,i)=>[-5,5].forEach(d=>tone(F(x)*Math.pow(2,d/1200),i%2?"triangle":"sine",t,R(4,6),.05,R(7,9),lp,R(-.6,.6))))}
function bell(){if(Math.random()>(M().p||1))return;const t=ac.currentTime,sc=M().sc,f=F(pk(sc)+12*pk(M().o||[1,2])),p=R(-.8,.8);tone(f,"sine",t,.02,.06,R(4,6),bus,p);tone(f*2.01,"sine",t,.02,.015,2.5,bus,p);if(Math.random()<.35)tone(F(pk(sc)+24),"sine",t+R(.4,.9),.02,.035,4,bus,-p)}
function bowl(){const t=ac.currentTime,f=F(pk(M().sc.slice(0,3))+12);tone(f,"sine",t,1.5,.06,14,bus,-.3);tone(f+R(1,2),"sine",t,1.5,.05,14,bus,.3)}
function loop(k,fn,a,b){const go=()=>{if(!on)return;fn();tm[k]=setTimeout(go,R(a,b)*1000)};go()}
function init(){ac=new(window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.gain.value=0;mg.connect(ac.destination);bus=ac.createGain();bus.connect(mg);
const cv=ac.createConvolver(),wg=ac.createGain(),l=ac.sampleRate*5,b=ac.createBuffer(2,l,ac.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<l;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/l,2.6)}
cv.buffer=b;wg.gain.value=.7;bus.connect(cv);cv.connect(wg);wg.connect(mg);
dr=ac.createOscillator();const dg=ac.createGain(),lf=ac.createOscillator(),lg=ac.createGain();dr.frequency.value=F(-12);dg.gain.value=.04;lf.frequency.value=.06;lg.gain.value=.015;lf.connect(lg);lg.connect(dg.gain);dr.connect(dg);dg.connect(bus);dr.start();lf.start();
const nb=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
const ns=ac.createBufferSource();ns.buffer=nb;ns.loop=true;const bp=ac.createBiquadFilter();bp.type="bandpass";bp.frequency.value=600;bp.Q.value=.7;const ng=ac.createGain(),l2=ac.createOscillator(),l2g=ac.createGain();ng.gain.value=.012;l2.frequency.value=.05;l2g.gain.value=300;l2.connect(l2g);l2g.connect(bp.frequency);ns.connect(bp);bp.connect(ng);ng.connect(bus);ns.start();l2.start()}
const vol=()=>S.v/100*.7;
function ui(){$("pl").textContent=on?"❚❚ Pause":"▶ Musik beginnen";$("sb").classList.toggle("on",on)}
function play(){if(!ac)init();ac.resume();on=true;mg.gain.cancelScheduledValues(ac.currentTime);mg.gain.setTargetAtTime(vol(),ac.currentTime,2);loop("p",pad,8,11);loop("b",bell,2.5,6);loop("w",bowl,20,34);ui()}
function stop(){on=false;Object.values(tm).forEach(clearTimeout);tm={};mg.gain.setTargetAtTime(0,ac.currentTime,.8);setTimeout(()=>{if(!on)ac.suspend()},3500);ui()}
function save(){ls.s("et21_snd",S)}
$("mo").innerHTML=MD.map((m,i)=>`<button data-i="${i}" aria-pressed="${i===S.m}">${m.n}<small>${m.d}</small></button>`).join("");
$("mo").onclick=e=>{const b=e.target.closest("button");if(!b)return;S.m=+b.dataset.i;save();$("mo").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));if(ac)dr.frequency.setTargetAtTime(F(-12),ac.currentTime,3)};
$("vol").value=S.v;$("vol").oninput=e=>{S.v=+e.target.value;save();if(ac&&on)mg.gain.setTargetAtTime(vol(),ac.currentTime,.3)};
$("pl").onclick=()=>{if(on){S.off=1;stop()}else{S.off=0;play()}save()};
const au=e=>{if(e.target.closest&&e.target.closest("#sb,#sndp"))return;["pointerdown","keydown","touchend"].forEach(v=>removeEventListener(v,au,true));if(!on&&!S.off)play()};
["pointerdown","keydown","touchend"].forEach(v=>addEventListener(v,au,{capture:true,passive:true}));
$("sb").onclick=()=>{const h=$("sndp").hidden=!$("sndp").hidden;$("sb").setAttribute("aria-expanded",!h)};
document.addEventListener("visibilitychange",()=>{if(ac&&on)document.hidden?ac.suspend():ac.resume()});window.et21Stop=()=>{if(ac&&on)stop()};
})();
