'use strict';
(function(){
/* ============================================================
   Brigada del Puente v2 — runner/shooter de escuadrón (original)
   Render: Canvas 2D con proyección pseudo-3D (cámara inclinada)
   ============================================================ */
const $=id=>document.getElementById(id);
const cv=$('c'), ctx=cv.getContext('2d',{alpha:false});
const FONT='"Russo One","Arial Black",Impact,system-ui,sans-serif';
const TAU=Math.PI*2;
const clamp=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,t)=>a+(b-a)*t, rnd=(a,b)=>a+Math.random()*(b-a);
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

/* ---------- Ajustes de juego ---------- */
const RUN=7.2, SLOW=2.3, BV=44, RANGE=30, CAP=28, MAX_SQUAD=120;
const BASE_DMG=10, BASE_RATE=2.6, GATE_INC=0.3;
const BOSS_K=1.45, BOSS_HP0=8000, BOSS_HPK=0.8;
const GUARD_X=-7.9, GUARD_K=0.95, GUARD_HP0=3000, GUARD_HPK=0.45, GUARD_LOCK=32, GUARD_PASS=4.5;
const WCOL=['95,215,255','90,255,190','255,214,90','255,140,70','225,110,255','255,255,255'];

/* ---------- Guardado (solo en este navegador) ---------- */
const SAVE_KEY='brigada-puente-v1';
const save={level:1,coins:0,best:1,muted:false,up:{rec:0,pow:0,rate:0,slash:0}};
const UPG=[
  {id:'rec',icon:'🪖',name:'Reclutas',desc:'+1 soldado al iniciar',base:30,mult:1.55,max:15},
  {id:'pow',icon:'💥',name:'Potencia',desc:'+15% de daño',base:40,mult:1.5,max:20},
  {id:'rate',icon:'⚡',name:'Cadencia',desc:'+10% de disparos',base:40,mult:1.5,max:15},
  {id:'slash',icon:'🗡️',name:'Tajo',desc:'El tajo carga 25% más rápido',base:50,mult:1.6,max:8}
];
const cost=(u,l)=>Math.round(u.base*Math.pow(u.mult,l));
function loadSave(){
  try{
    const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
    if(s&&typeof s==='object'){
      const n=(v,a,b,d)=>Number.isFinite(v)?clamp(Math.floor(v),a,b):d;
      save.level=n(s.level,1,999,1); save.coins=n(s.coins,0,1e9,0); save.best=n(s.best,1,999,1); save.muted=s.muted===true;
      if(s.up&&typeof s.up==='object') for(const u of UPG) save.up[u.id]=n(s.up[u.id],0,u.max,0);
    }
  }catch(e){}
}
function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));}catch(e){}}

/* ---------- Cámara y proyección ---------- */
const CAM_H=12, CAM_D=10, LOOK=8;
const PITCH=Math.atan2(CAM_H,CAM_D+LOOK), cosP=Math.cos(PITCH), sinP=Math.sin(PITCH), tanP=Math.tan(PITCH);
const RAIL=5.3, ROAD=4.6, CURB=5.35, WALK_L=-10.4, WALK_R=6.9, WALK_Y=0.25;
const cam={x:0,z:-CAM_D};
let W=1,H=1,DPR=1,F=500,CX=0,CY=0,HORY=0,dSq=1,shX=0,shY=0,shake=0,quality=1,T=0;
function resize(){
  W=Math.max(1,innerWidth); H=Math.max(1,innerHeight);
  DPR=Math.min(devicePixelRatio||1,2)*quality;
  cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR);
  dSq=CAM_D*cosP+CAM_H*sinP;
  const vSq=-CAM_H*cosP+CAM_D*sinP;
  F=Math.min(0.74*H,0.96*W*dSq/(2*RAIL));
  CX=W/2; CY=0.75*H+vSq*F/dSq; HORY=CY-tanP*F;
  if(SCN){buildSky();buildVignette();}
}
const PJ={x:0,y:0,s:0};
function proj(x,y,z){
  const dx=x-cam.x, dy=y-CAM_H, dz=z-cam.z;
  const d=dz*cosP-dy*sinP; if(d<0.4) return false;
  const s=F/d; PJ.s=s; PJ.x=CX+shX+dx*s; PJ.y=CY+shY-(dy*cosP+dz*sinP)*s; return true;
}
const Q=new Float32Array(8);
function q4(ax,ay,az,bx,by,bz,cx,cy,cz,dx,dy,dz){
  if(!proj(ax,ay,az))return false; Q[0]=PJ.x;Q[1]=PJ.y;
  if(!proj(bx,by,bz))return false; Q[2]=PJ.x;Q[3]=PJ.y;
  if(!proj(cx,cy,cz))return false; Q[4]=PJ.x;Q[5]=PJ.y;
  if(!proj(dx,dy,dz))return false; Q[6]=PJ.x;Q[7]=PJ.y;
  ctx.beginPath();ctx.moveTo(Q[0],Q[1]);ctx.lineTo(Q[2],Q[3]);ctx.lineTo(Q[4],Q[5]);ctx.lineTo(Q[6],Q[7]);ctx.closePath();return true;
}
const gq=(x0,z0,x1,z1,y)=>q4(x0,y||0,z0,x1,y||0,z0,x1,y||0,z1,x0,y||0,z1);
function gqa(x0,z0,x1,z1,y){y=y||0;if(!proj(x0,y,z0))return;const ax=PJ.x,ay=PJ.y;proj(x1,y,z0);const bx=PJ.x,by=PJ.y;proj(x1,y,z1);const cx=PJ.x,cy=PJ.y;proj(x0,y,z1);
  ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.lineTo(cx,cy);ctx.lineTo(PJ.x,PJ.y);ctx.closePath();}
const vq=(x0,y0,x1,y1,z)=>q4(x0,y0,z,x1,y0,z,x1,y1,z,x0,y1,z);
const xq=(x,y0,y1,z0,z1)=>q4(x,y0,z0,x,y0,z1,x,y1,z1,x,y1,z0);

/* ---------- Utilidades de dibujo ---------- */
function mk(w,h){const c=document.createElement('canvas');c.width=Math.max(1,w|0);c.height=Math.max(1,h|0);return c;}
function rr(g,x,y,w,h,r){r=Math.min(r,w/2,h/2);g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function el(g,x,y,rx,ry){g.beginPath();g.ellipse(x,y,Math.abs(rx)+1e-4,Math.abs(ry)+1e-4,0,0,TAU);}
function tri(g,a,b,c,d,e,f){g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.lineTo(e,f);g.closePath();g.fill();}
function ln(g,a,b,c,d){g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.stroke();}
function lg(g,x0,y0,x1,y1,...cs){const r=g.createLinearGradient(x0,y0,x1,y1);cs.forEach((c,i)=>r.addColorStop(i/(cs.length-1),c));return r;}
function rg(g,x,y,r0,r1,...cs){const r=g.createRadialGradient(x,y,r0,x,y,r1);cs.forEach((c,i)=>r.addColorStop(i/(cs.length-1),c));return r;}
function otext(t,x,y,fs,fill,stroke,lw){
  ctx.font=(fs|0)+'px '+FONT; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineJoin='round';
  ctx.lineWidth=fs*(lw||0.17); ctx.strokeStyle=stroke||'#111722'; ctx.strokeText(t,x,y); ctx.fillStyle=fill; ctx.fillText(t,x,y);
}
function silhouette(src,col){const c=mk(src.width,src.height),g=c.getContext('2d');g.drawImage(src,0,0);g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,c.width,c.height);return c;}

/* ============================================================
   SPRITES (dibujados por código, diseños originales)
   ============================================================ */
const NF=10;
function buildSheet(drawFn,k,shadowR,outlinePx){
  const fw=Math.round(64*k), fh=Math.round(96*k);
  const sh=mk(fw*NF,fh), sg=sh.getContext('2d');
  const tmp=mk(fw,fh), tg=tmp.getContext('2d');
  for(let i=0;i<NF;i++){
    tg.setTransform(1,0,0,1,0,0); tg.clearRect(0,0,fw,fh); tg.setTransform(k,0,0,k,0,0);
    drawFn(tg,i/NF*TAU);
    const sil=silhouette(tmp,'rgba(10,12,18,.92)');
    sg.save(); sg.translate(i*fw,0); sg.scale(k,k);
    sg.fillStyle=rg(sg,32,91,1,shadowR,'rgba(0,0,0,.5)','rgba(0,0,0,0)'); el(sg,32,91,shadowR,shadowR*0.32); sg.fill();
    sg.restore();
    const o=outlinePx;
    for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[-.7,-.7],[.7,-.7],[-.7,.7],[.7,.7]]) sg.drawImage(sil,i*fw+dx*o,dy*o);
    sg.drawImage(tmp,i*fw,0);
  }
  return {img:sh,white:silhouette(sh,'#fff'),fw,fh,ax:fw/2,ay:fh*.958,top:fh*.08,mx:fw*52.6/64,my:fh*10.5/96,k:0};
}
/* ----- Soldado (de espaldas, cámara alta) ----- */
const SVAR=[
  {vest:'#5e6138',vestL:'#7a7e4c',vestD:'#3f4125',pack:'#4b4e2c',packL:'#666a3c',packD:'#33351d',helm:'#4a5734',helmL:'#6b7b4d',helmD:'#2b331f',roll:true,radio:false},
  {vest:'#8a7a52',vestL:'#a9986c',vestD:'#5d5035',pack:'#6e6142',packL:'#8a7b59',packD:'#4a412b',helm:'#7d6e4c',helmL:'#9d8d66',helmD:'#4f452f',roll:false,radio:true},
  {vest:'#3d4447',vestL:'#59626a',vestD:'#252a2c',pack:'#30363a',packL:'#454d52',packD:'#1d2124',helm:'#3a4046',helmL:'#5a636b',helmD:'#212529',roll:true,radio:false}
];
function soldierLeg(g,x,k,bob){
  const back=Math.max(0,k), fwd=Math.max(0,-k);
  const hipY=56-bob, footY=90-back*7.5-fwd*2.5, kneeY=hipY+(footY-hipY)*0.48, sp=(x<32?-1:1)*0.6;
  g.fillStyle=lg(g,x-6,0,x+6,0,'#4477e6','#2a55c0','#1b3b8e');
  g.beginPath();g.moveTo(x-5.7,hipY);g.lineTo(x+5.7,hipY);g.lineTo(x+4.9+sp,kneeY);g.lineTo(x+4.3+sp,footY-5);g.lineTo(x-4.3+sp,footY-5);g.lineTo(x-4.9+sp,kneeY);g.closePath();g.fill();
  g.strokeStyle='rgba(8,18,60,.4)';g.lineWidth=.8;ln(g,x-3,kneeY,x+3,kneeY+.6);
  g.fillStyle='#21479c';rr(g,x+(x<32?-5.5:1.7),hipY+5,3.8,7,1.2);g.fill();
  g.fillStyle='rgba(255,255,255,.1)';g.fillRect(x-4.8,hipY+1,1.4,footY-hipY-8);
  const bx=x+sp;
  if(back>0.3){g.fillStyle='#17171b';rr(g,bx-5,footY-7.5,10,7.5,2.6);g.fill();
    g.fillStyle=lg(g,0,footY-4,0,footY,'#75624b','#4a3d2f');rr(g,bx-4.2,footY-4.3,8.4,4.1,1.6);g.fill();
    g.strokeStyle='#2c241b';g.lineWidth=.6;for(let i=-1;i<=1;i++)ln(g,bx+i*2.4,footY-3.9,bx+i*2.4,footY-.6);}
  else{g.fillStyle=lg(g,0,footY-8,0,footY,'#2c2c33','#111115');rr(g,bx-5.3,footY-7.6,10.6,7.9,2.6);g.fill();
    g.fillStyle='rgba(255,255,255,.16)';g.fillRect(bx-4,footY-7.1,6.5,1.1);}
}
function soldierBody(g,p,v){
  const sw=Math.sin(p),bob=Math.abs(Math.cos(p))*1.8;
  const legs=[[25.5,sw],[38.5,-sw]].sort((a,b)=>a[1]-b[1]);
  for(const [x,k] of legs) soldierLeg(g,x,k,bob);
  g.save();g.translate(32,58-bob);g.rotate(sw*0.035);g.translate(-32,-58);
  const sleeve=lg(g,8,0,56,0,'#5a8cf6','#2f5fd0','#22489f');
  g.fillStyle=sleeve;
  g.beginPath();g.moveTo(17,33);g.quadraticCurveTo(10.5,38,12,48.5);g.lineTo(18.2,49.5);g.quadraticCurveTo(18,40,21.5,36);g.closePath();g.fill();
  g.beginPath();g.moveTo(47,33);g.quadraticCurveTo(54.5,37,54,45.5);g.lineTo(48,46.5);g.quadraticCurveTo(47,40,42.5,36);g.closePath();g.fill();
  g.fillStyle='#262c3c';el(g,14.6,48,3.1,2.5);g.fill();el(g,51.2,45,3.1,2.5);g.fill();
  g.fillStyle='rgba(255,255,255,.18)';el(g,13.8,47.2,1.2,.8);g.fill();
  // fusil (apunta hacia adelante = arriba en pantalla)
  g.lineCap='round';g.strokeStyle='#14161b';g.lineWidth=3.8;ln(g,46,41,52.6,10.5);
  g.strokeStyle='#454b57';g.lineWidth=1.1;ln(g,45.2,39.5,51.7,11.5);
  g.fillStyle='#1c1f26';rr(g,47.3,23.5,4.4,6.4,1);g.fill();g.fillStyle='#5fd6ff';g.fillRect(48.3,24.4,2.4,1.1);
  g.fillStyle='#1c1f26';rr(g,48.6,30,2.8,4.5,.8);g.fill();
  // torso
  g.fillStyle=lg(g,16,28,48,60,'#5d90f8','#3467d8','#20429c');
  g.beginPath();g.moveTo(18,31);g.quadraticCurveTo(32,27,46,31);g.lineTo(47,40);g.quadraticCurveTo(46,52,44,59);g.lineTo(20,59);g.quadraticCurveTo(18,52,17,40);g.closePath();g.fill();
  // chaleco
  g.fillStyle=lg(g,19,32,45,57,v.vestL,v.vest,v.vestD);rr(g,19.5,32.5,25,24.5,5);g.fill();
  g.strokeStyle=v.vestD;g.lineWidth=.9;for(let y=41;y<56;y+=3.1)ln(g,20.5,y,43.5,y);
  // mochila
  g.fillStyle=lg(g,22,34,42,54,v.packL,v.pack,v.packD);rr(g,22.5,35,19,18.5,4);g.fill();
  g.fillStyle=lg(g,0,35,0,41,v.packL,v.pack);rr(g,22.5,35,19,6.2,3.5);g.fill();
  g.fillStyle=v.packD;rr(g,24,44.2,6.6,8,1.6);g.fill();rr(g,33.4,44.2,6.6,8,1.6);g.fill();
  g.fillStyle='rgba(255,255,255,.12)';g.fillRect(24.4,44.6,5.8,1);g.fillRect(33.8,44.6,5.8,1);
  g.fillStyle='#cbbb8c';g.fillRect(30.5,39.6,3,1.7);
  g.strokeStyle='#2c2d1c';g.lineWidth=1.6;ln(g,24,32.5,23,53);ln(g,40,32.5,41,53);
  if(v.roll){g.fillStyle=lg(g,0,30,0,36.5,'#d6c294','#9a8357');rr(g,21,30.4,22,5.8,2.8);g.fill();
    g.strokeStyle='#5d4c2e';g.lineWidth=.8;ln(g,26,30.5,26,36.2);ln(g,38,30.5,38,36.2);}
  if(v.radio){g.strokeStyle='#0e0e10';g.lineWidth=.9;ln(g,40.5,35,44.5,14);g.fillStyle='#24272c';rr(g,37.4,32.8,5.4,5.4,1);g.fill();g.fillStyle='#ff4b3a';g.fillRect(38.4,33.6,1.2,1.2);}
  g.fillStyle='#24251e';g.fillRect(19,56.4,26,3.3);g.fillStyle='#3b3c2d';rr(g,21,55.8,5,4.8,1);g.fill();rr(g,38,55.8,5,4.8,1);g.fill();
  // cabeza
  g.fillStyle=lg(g,0,23,0,32,'#dba887','#a5745a');rr(g,28,24,8,8.5,2.2);g.fill();
  g.fillStyle='#c48e6c';el(g,21.5,22.2,1.6,2.4);g.fill();el(g,42.5,22.2,1.6,2.4);g.fill();
  g.fillStyle=rg(g,28,13,1,15,v.helmL,v.helm,v.helmD);el(g,32,19,10.9,10.5);g.fill();
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=.55;for(let i=0;i<4;i++){g.beginPath();g.ellipse(32,16+i*2.2,10.3-i*.5,2.8,0,Math.PI,TAU);g.stroke();}
  for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(32+i*3.6,9.4);g.quadraticCurveTo(32+i*4.6,16,32+i*4.4,22.5);g.stroke();}
  g.fillStyle=v.helmD;g.beginPath();g.ellipse(32,24.2,11.7,3.7,0,0,Math.PI);g.fill();
  g.fillStyle='#ad9058';g.beginPath();g.ellipse(32,21,11,2.3,0,0,Math.PI);g.fill();
  g.fillStyle='#2a2420';rr(g,29.5,20.4,5,2.4,.8);g.fill();
  g.fillStyle='rgba(255,255,255,.26)';el(g,28,13.4,4.8,2.9);g.fill();
  g.restore();
}
/* ----- Zombis (de frente) ----- */
const ZVAR=[
  {style:'shirt',shirt:'#9aa0a6',shirtL:'#c1c6cb',shirtD:'#686e74',pants:'#3a3f4a',pantsL:'#4f5566',pantsD:'#252930',skin:'#93a184',skinL:'#b1bda2',skinD:'#68765b',shoe:'#2a2522',shoeL:'#4d433c',hair:'#2a2420',hairS:0,tilt:.14,rip:true,bare:false},
  {style:'hoodie',shirt:'#8a2f35',shirtL:'#ad474d',shirtD:'#5a1e23',pants:'#2f3f5c',pantsL:'#44597f',pantsD:'#1f2a40',skin:'#a3a08a',skinL:'#c0bda6',skinD:'#74725c',shoe:'#cfcfca',shoeL:'#f1f1ee',hair:'#3a2f26',hairS:2,tilt:-.16,rip:true,bare:false},
  {style:'tank',shirt:'#c9c4b2',shirtL:'#e6e1ce',shirtD:'#948f7c',pants:'#5b5240',pantsL:'#756b51',pantsD:'#3d362a',skin:'#8b9a7c',skinL:'#a6b498',skinD:'#617055',shoe:'#3b3128',shoeL:'#5d4e3f',hair:'#1e1c1a',hairS:1,tilt:.06,rip:false,bare:true},
  {style:'overalls',shirt:'#c46a2c',shirtL:'#e28947',shirtD:'#8c481c',pants:'#3e5f8f',pantsL:'#527cb3',pantsD:'#2a446a',skin:'#9b8f85',skinL:'#b8ada3',skinD:'#6f645b',shoe:'#4a3626',shoeL:'#6c513a',hair:'#5a4632',hairS:0,tilt:-.08,rip:true,bare:false},
  {style:'jacket',shirt:'#6b4a33',shirtL:'#8a6342',shirtD:'#472f20',inner:'#2a2d33',pants:'#26292f',pantsL:'#383c45',pantsD:'#17191d',skin:'#8d9988',skinL:'#aab6a5',skinD:'#647060',shoe:'#1c1c1c',shoeL:'#3a3a3a',hair:'#141312',hairS:2,tilt:.18,rip:false,bare:false},
  {style:'sweater',shirt:'#4f6b4a',shirtL:'#6a8962',shirtD:'#354832',pants:'#4a4038',pantsL:'#60544a',pantsD:'#312a24',skin:'#a09a8c',skinL:'#bdb7a9',skinD:'#736e62',shoe:'#2c2a28',shoeL:'#4c4946',hair:'#6d6458',hairS:1,tilt:-.12,rip:true,bare:false}
];
function zLeg(g,x,k,bob,v){
  const back=Math.max(0,k),fwd=Math.max(0,-k),hipY=55-bob,footY=90-back*5+fwd*.8,w=5.2+fwd*.5;
  g.fillStyle=lg(g,x-6,0,x+6,0,v.pantsL,v.pants,v.pantsD);
  g.beginPath();g.moveTo(x-w,hipY);g.lineTo(x+w,hipY);g.lineTo(x+w*.86,footY-9);
  for(let i=0;i<=4;i++)g.lineTo(x+w*.86-i*(w*1.72/4),footY-9+(i%2?2.4:0));
  g.closePath();g.fill();
  if(v.rip){g.fillStyle=v.skinD;el(g,x+(k>0?-1:1),hipY+15,2.3,1.7);g.fill();}
  g.fillStyle=lg(g,x-4,0,x+4,0,v.skin,v.skinD);rr(g,x-3.6,footY-9,7.2,5,1.5);g.fill();
  if(v.bare&&k<0){g.fillStyle=lg(g,0,footY-5,0,footY,v.skin,v.skinD);el(g,x,footY-2.5,4.7,2.9);g.fill();}
  else{g.fillStyle=lg(g,0,footY-6,0,footY,v.shoeL,v.shoe);rr(g,x-5.2,footY-6,10.4,6.2,2.6);g.fill();g.fillStyle='rgba(255,255,255,.14)';g.fillRect(x-4,footY-5.6,5,1);}
}
function zTorso(g,v){
  const top=31,bot=57;
  const shape=()=>{g.beginPath();g.moveTo(17,top+2);g.quadraticCurveTo(32,top-2,47,top+2);g.lineTo(48,44);g.quadraticCurveTo(47.5,52,46.5,bot);
    for(let i=0;i<=8;i++)g.lineTo(46.5-i*(29/8),bot+(i%2?2.6:.4));g.quadraticCurveTo(16,52,16,44);g.closePath();};
  if(v.style==='tank'){g.fillStyle=lg(g,16,30,48,58,v.skinL,v.skin,v.skinD);shape();g.fill();
    g.fillStyle=lg(g,20,32,44,58,v.shirtL,v.shirt,v.shirtD);g.beginPath();g.moveTo(22,top+1);g.lineTo(26,top);g.quadraticCurveTo(32,top+7,38,top);g.lineTo(42,top+1);g.lineTo(44,bot);g.lineTo(20,bot);g.closePath();g.fill();
    g.fillStyle='rgba(0,0,0,.18)';el(g,25,40,2.2,3);g.fill();el(g,39,40,2.2,3);g.fill();}
  else{g.fillStyle=lg(g,16,30,48,58,v.shirtL,v.shirt,v.shirtD);shape();g.fill();}
  switch(v.style){
    case 'shirt':
      g.fillStyle=v.skin;tri(g,28,top,36,top,32,top+5.5);
      g.fillStyle=v.shirtL;tri(g,25.5,top,31,top+.5,28.5,top+5);tri(g,38.5,top,33,top+.5,35.5,top+5);
      g.fillStyle='#2b3047';g.beginPath();g.moveTo(31.2,top+4.2);g.lineTo(33.2,top+4.2);g.lineTo(34.4,top+16);g.lineTo(32.4,top+19.5);g.lineTo(30.6,top+16);g.closePath();g.fill();
      g.fillStyle='#3d4463';g.fillRect(31.6,top+6,1.2,9);
      g.fillStyle='#e8e6df';for(let y=top+7;y<bot-2;y+=4.5){el(g,29.2,y,.55,.55);g.fill();}
      break;
    case 'hoodie':
      g.fillStyle=v.shirtD;el(g,32,top+1.2,9.5,3.6);g.fill();
      g.strokeStyle='#e4e4e0';g.lineWidth=.8;ln(g,29.5,top+3,29,top+11.5);ln(g,34.5,top+3,35,top+11.5);
      g.fillStyle=v.shirtD;rr(g,23,46,18,7.4,2.5);g.fill();g.fillStyle='rgba(255,255,255,.12)';g.fillRect(23.5,46.4,17,1);
      break;
    case 'overalls':
      g.fillStyle=lg(g,22,36,42,58,'#5f84b6','#3e5f8f','#2a446a');rr(g,22,40,20,17,2);g.fill();
      g.fillStyle='#3e5f8f';g.fillRect(22.5,31,3,10);g.fillRect(38.5,31,3,10);
      g.fillStyle='#d6d0a6';el(g,24,40.6,1.25,1.25);g.fill();el(g,40,40.6,1.25,1.25);g.fill();
      g.fillStyle='#2a446a';rr(g,28,44,8,6,1);g.fill();g.strokeStyle='#c9a24a';g.lineWidth=.5;ln(g,28.5,44.6,35.5,44.6);
      break;
    case 'jacket':
      g.fillStyle=v.inner;g.beginPath();g.moveTo(27,top);g.lineTo(37,top);g.lineTo(36,bot);g.lineTo(28,bot);g.closePath();g.fill();
      g.fillStyle=v.shirtL;tri(g,25.5,top,30.5,top,28,top+9.5);tri(g,38.5,top,33.5,top,36,top+9.5);
      g.strokeStyle=v.shirtD;g.lineWidth=.9;ln(g,27.5,top+9,27,bot);ln(g,36.5,top+9,37,bot);
      g.fillStyle='#b9b4a6';el(g,26.2,top+13,.6,.6);g.fill();el(g,26.2,top+18,.6,.6);g.fill();
      break;
    case 'sweater':
      g.fillStyle=v.shirtD;g.fillRect(17,42,30,3);g.fillStyle=v.shirtL;g.fillRect(17,42,30,.8);
      g.fillStyle=v.skin;tri(g,29,top,35,top,32,top+3.8);
      break;
  }
  g.fillStyle='rgba(40,28,18,.32)';el(g,37,47,5,3.6);g.fill();el(g,24,52,3.2,2.2);g.fill();el(g,30,38,2,1.5);g.fill();
  g.fillStyle=v.skinD;g.beginPath();g.moveTo(39,50);g.lineTo(43,49);g.lineTo(41.5,53.4);g.closePath();g.fill();
  g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.moveTo(40,top+1);g.quadraticCurveTo(48.5,40,46.5,bot);g.lineTo(42,bot);g.quadraticCurveTo(43,42,40,top+1);g.fill();
}
function zArms(g,v,sw){
  const sleeve=v.style==='tank'?null:v.shirt;
  for(const [sd,a] of [[-1,sw*3],[1,-sw*3]]){
    const shx=32+sd*14,shy=34,hx=32+sd*8.5,hy=49+a,ex=32+sd*16.6,ey=43+a*.5;
    g.lineCap='round';g.strokeStyle=sleeve?v.shirtD:v.skinD;g.lineWidth=7;ln(g,shx,shy,ex,ey);
    g.strokeStyle=sleeve||v.skin;g.lineWidth=5.4;ln(g,shx-sd*.4,shy-.3,ex-sd*.3,ey-.3);
    g.strokeStyle=v.skinD;g.lineWidth=5.6;ln(g,ex,ey,hx,hy);
    g.strokeStyle=v.skin;g.lineWidth=3.6;ln(g,ex-sd*.4,ey-.7,hx,hy-.9);
    if(sleeve){g.fillStyle=v.shirtD;el(g,ex,ey,3.5,3.1);g.fill();}
    g.fillStyle=lg(g,hx-4,hy-4,hx+4,hy+4,v.skinL,v.skin,v.skinD);el(g,hx,hy,4.5,4);g.fill();
    g.strokeStyle=v.skinD;g.lineWidth=1.35;for(let i=-1;i<=2;i++)ln(g,hx+i*1.6-sd*.5,hy+2,hx+i*1.9-sd*.6,hy+5.4);
    g.strokeStyle='#d9d2bf';g.lineWidth=.6;for(let i=-1;i<=2;i++)ln(g,hx+i*1.9-sd*.6,hy+5,hx+i*1.95-sd*.6,hy+5.9);
  }
}
function zHead(g,v,sw){
  g.fillStyle=lg(g,0,24,0,33,v.skin,v.skinD);rr(g,28.5,24,7,9,2);g.fill();
  g.save();g.translate(32,19.5);g.rotate(v.tilt+sw*.06);
  g.fillStyle=v.skinD;el(g,-9.6,1,1.8,2.8);g.fill();el(g,9.6,1,1.8,2.8);g.fill();
  g.fillStyle=rg(g,-3,-4,1,13,v.skinL,v.skin,v.skinD);
  g.beginPath();g.moveTo(-9.5,-2);g.quadraticCurveTo(-10,-11,0,-11.5);g.quadraticCurveTo(10,-11,9.5,-2);g.quadraticCurveTo(9.2,6,5,9.5);g.quadraticCurveTo(0,11.6,-5,9.5);g.quadraticCurveTo(-9.2,6,-9.5,-2);g.fill();
  g.fillStyle='rgba(0,0,0,.17)';el(g,-5.5,4,2.4,3.4);g.fill();el(g,5.5,4,2.4,3.4);g.fill();
  g.fillStyle='rgba(0,0,0,.26)';g.beginPath();g.moveTo(-8,-3.5);g.quadraticCurveTo(0,-6,8,-3.5);g.lineTo(8,-2.2);g.quadraticCurveTo(0,-4.4,-8,-2.2);g.fill();
  g.fillStyle='#1d120e';el(g,-3.8,-.6,2.9,2.4);g.fill();el(g,3.8,-.6,2.9,2.4);g.fill();
  for(const ex of [-3.8,3.8]){g.fillStyle=rg(g,ex,-.6,0,2.4,'#fff3c4','#ff5a2a','rgba(255,60,20,0)');el(g,ex,-.6,2.4,2.2);g.fill();}
  g.fillStyle='rgba(0,0,0,.32)';tri(g,-.9,2.6,.9,2.6,0,.9);
  g.fillStyle='#1b0f0c';el(g,0,6,3.8,2.5);g.fill();
  g.fillStyle='#d8cfb6';for(let i=-2;i<=2;i++)g.fillRect(i*1.25-.45,4.2,.9,1.2);
  g.fillStyle='rgba(255,255,255,.14)';el(g,-4,-7,3.4,1.8);g.fill();
  g.fillStyle=v.hair;
  if(v.hairS===0){g.beginPath();g.moveTo(-9.6,-3);g.quadraticCurveTo(-10,-12.6,0,-12.7);g.quadraticCurveTo(10,-12.6,9.6,-3);g.lineTo(7.5,-6.5);g.lineTo(5,-4.8);g.lineTo(2,-7.4);g.lineTo(-1.5,-5.2);g.lineTo(-4.5,-7.6);g.lineTo(-7.5,-5);g.closePath();g.fill();}
  else if(v.hairS===1){el(g,-8.2,-5,2.4,3.4);g.fill();el(g,8.2,-5,2.4,3.4);g.fill();}
  else{g.beginPath();g.moveTo(-10,4);g.quadraticCurveTo(-11,-12,0,-12.5);g.quadraticCurveTo(11,-12,10,4);g.lineTo(8,6);g.lineTo(8.3,-4);g.quadraticCurveTo(0,-8,-8.3,-4);g.lineTo(-8,6);g.closePath();g.fill();}
  g.restore();
}
function zombieBody(g,p,v){
  const sw=Math.sin(p),bob=Math.abs(Math.cos(p))*1.5;
  const L=[[26,sw],[38,-sw]].sort((a,b)=>b[1]-a[1]);
  for(const [x,k] of L) zLeg(g,x,k,bob,v);
  g.save();g.translate(32,56-bob);g.rotate(v.tilt*.25+sw*.03);g.translate(-32,-56);
  zTorso(g,v);zArms(g,v,sw);zHead(g,v,sw);
  g.restore();
}
/* ----- Bruto ----- */
const BVAR=[
  {skin:'#8d917b',skinL:'#abaf98',skinD:'#636753',pants:'#2f2c28',pantsL:'#45413a',pantsD:'#1d1b18',shoe:'#1b1a18',shoeL:'#36342f',apron:'#2e2c31',apronL:'#46424b',apronD:'#1a191d',hair:'#1c1a18',tilt:.06},
  {skin:'#9c8c7e',skinL:'#b9a99a',skinD:'#6f6155',pants:'#28303a',pantsL:'#3c4755',pantsD:'#191e25',shoe:'#1b1a18',shoeL:'#36342f',apron:'#4a3a2c',apronL:'#634e3b',apronD:'#2e241b',hair:'#2a2420',tilt:-.07}
];
function bruteBody(g,p,v){
  const sw=Math.sin(p),bob=Math.abs(Math.cos(p))*1.8;
  for(const [x,k] of [[22,sw],[42,-sw]].sort((a,b)=>b[1]-a[1])){
    const back=Math.max(0,k),hipY=60-bob,footY=91-back*4;
    g.fillStyle=lg(g,x-8,0,x+8,0,v.pantsL,v.pants,v.pantsD);rr(g,x-7.5,hipY,15,footY-hipY-5,4);g.fill();
    g.fillStyle=v.skinD;rr(g,x-5.5,footY-11,11,6,2);g.fill();
    g.fillStyle=lg(g,0,footY-7,0,footY,v.shoeL,v.shoe);rr(g,x-8,footY-7,16,7,3);g.fill();
  }
  g.save();g.translate(0,-bob);
  g.fillStyle=rg(g,24,36,2,32,v.skinL,v.skin,v.skinD);
  g.beginPath();g.moveTo(8,40);g.quadraticCurveTo(8,24,32,23);g.quadraticCurveTo(56,24,56,40);g.quadraticCurveTo(58,58,50,64);g.lineTo(14,64);g.quadraticCurveTo(6,58,8,40);g.fill();
  g.fillStyle=lg(g,18,36,46,66,v.apronL,v.apron,v.apronD);g.beginPath();g.moveTo(18,38);g.lineTo(46,38);g.lineTo(48,66);g.lineTo(16,66);g.closePath();g.fill();
  g.strokeStyle=v.apronD;g.lineWidth=2.2;ln(g,19,38,13,26);ln(g,45,38,51,26);
  g.fillStyle='#b0ada2';el(g,19,38,1.9,1.9);g.fill();el(g,45,38,1.9,1.9);g.fill();
  g.fillStyle='rgba(35,25,18,.36)';el(g,36,52,6,4);g.fill();el(g,25,58,4,3);g.fill();
  g.strokeStyle='#3b2a24';g.lineWidth=.9;ln(g,22,30,34,33);for(let i=0;i<5;i++){const xx=23+i*2.6,yy=30.25+i*.65;ln(g,xx,yy-1.4,xx+.6,yy+1.4);}
  for(const sd of [-1,1]){const s2=Math.sin(p+(sd>0?Math.PI:0))*2.5;
    g.fillStyle=lg(g,32+sd*14,0,32+sd*31,0,v.skinL,v.skin,v.skinD);
    g.beginPath();g.moveTo(32+sd*18,26);g.quadraticCurveTo(32+sd*31.5,30,32+sd*30,50+s2);g.lineTo(32+sd*22,52+s2);g.quadraticCurveTo(32+sd*21,38,32+sd*14,32);g.closePath();g.fill();
    g.fillStyle=rg(g,32+sd*26-1.5,57+s2,1,8,v.skinL,v.skin,v.skinD);el(g,32+sd*26,59+s2,6.6,6.1);g.fill();
    g.strokeStyle=v.skinD;g.lineWidth=1;for(let i=-1;i<=1;i++)ln(g,32+sd*26+i*2.4,55+s2,32+sd*26+i*2.4,58+s2);
    g.strokeStyle='#9a978f';g.lineWidth=1.7;g.beginPath();g.ellipse(32+sd*26,52.5+s2,4.7,1.6,0,0,TAU);g.stroke();
  }
  g.fillStyle=v.skinD;el(g,32,25,15,5);g.fill();
  g.save();g.translate(32,23);g.rotate(v.tilt);
  g.fillStyle=rg(g,-2,-3,1,8,v.skinL,v.skin,v.skinD);el(g,0,0,7.2,7.6);g.fill();
  g.fillStyle='rgba(0,0,0,.3)';g.fillRect(-6,-2.6,12,1.6);
  g.fillStyle='#1a0f0b';el(g,-2.6,.2,1.9,1.5);g.fill();el(g,2.6,.2,1.9,1.5);g.fill();
  g.fillStyle='#ff4a22';el(g,-2.6,.2,1.1,.9);g.fill();el(g,2.6,.2,1.1,.9);g.fill();
  g.fillStyle='#1a0f0b';rr(g,-3,3.4,6,2.2,1);g.fill();g.fillStyle='#d5cbb0';g.fillRect(-2.4,3.4,1,1);g.fillRect(1.4,3.4,1,1);
  g.fillStyle=v.hair;el(g,0,-6.2,4.5,1.6);g.fill();
  g.restore();g.restore();
}
const SPR={sol:[],zom:[],bru:[],flash:null,titan:null,guard3:null,mode:'2d'};
function buildSprites(){
  for(const v of SVAR){const S=buildSheet((g,p)=>soldierBody(g,p,v),2,15,2);S.k=1.18/S.fh;SPR.sol.push(S);}
  for(const v of ZVAR){const S=buildSheet((g,p)=>zombieBody(g,p,v),2,15,2);S.k=1.18/S.fh;SPR.zom.push(S);}
  for(const v of BVAR){const S=buildSheet((g,p)=>bruteBody(g,p,v),2.4,24,2.4);S.k=2.25/S.fh;SPR.bru.push(S);}
  SPR.mode='2d';
}
/* ----- Recursos pre-renderizados (modelos externos convertidos a sprites) ----- */
const BAKED=(typeof window.__BAKED==='object'&&window.__BAKED)||{};
const BSPR={};
function loadBaked(done){
  const ks=Object.keys(BAKED);if(!ks.length){done();return;}let left=ks.length;
  const fin=()=>{if(--left===0)done();};
  for(const key of ks){const b=BAKED[key],im=new Image();
    im.onload=()=>{try{const c=mk(im.width,im.height);c.getContext('2d').drawImage(im,0,0);
      const S={img:c,fw:b.fw,fh:b.fh,n:Math.round(im.width/b.fw),ax:b.ax,ay:b.ay,top:b.top,mx:b.mx,my:b.my,mxs:b.mxs,mys:b.mys,k:b.h/Math.max(10,b.ay-b.top)};
      if(b.white)S.white=silhouette(c,'#fff');BSPR[key]=S;}catch(e){}fin();};
    im.onerror=fin;im.src=b.src;}
}
function bakedSet(pre){return Object.keys(BSPR).filter(k=>k===pre||new RegExp('^'+pre+'\\d+$').test(k)).sort().map(k=>BSPR[k]);}
const GUARD_HSTAND=9.19; // alto de pie del Guardián (unidades locales), igual al modelo anterior
function applyBaked(){
  const s=bakedSet('sol'),z=bakedSet('zom'),b=bakedSet('bru');if(s.length)SPR.sol=s;if(z.length)SPR.zom=z;if(b.length)SPR.bru=b;
  if(BSPR.titan_walk&&BSPR.titan_raise){const w=BSPR.titan_walk;SPR.titan={walk:w,raise:BSPR.titan_raise,kl:10.4/Math.max(10,w.ay-w.top)};}
  if(BSPR.guard_stand&&BSPR.guard_walk&&BSPR.guard_raise){const w=BSPR.guard_walk,st=BSPR.guard_stand,kl=GUARD_HSTAND/Math.max(10,w.ay-w.top);
    SPR.guard3={stand:st,walk:w,raise:BSPR.guard_raise,kl,cs:clamp((st.ay-st.top)*kl/7.5*1.18,.72,1)};}
  if(s.length&&z.length&&b.length&&SPR.titan&&SPR.guard3&&SPR.mode!=='3d')SPR.mode='baked';
}
function allBaked(){return bakedSet('sol').length&&bakedSet('zom').length&&bakedSet('bru').length&&BSPR.titan_walk&&BSPR.guard_walk;}
function apply3D(o){
  const fix=(S,h)=>{S.k=h/Math.max(10,S.ay-S.top);return S;};
  if(o.sol.length)SPR.sol=o.sol.map(S=>fix(S,1.12));if(o.zom.length)SPR.zom=o.zom.map(S=>fix(S,1.08));if(o.bru.length)SPR.bru=o.bru.map(S=>fix(S,2.1));
  if(o.titan){const tk=10.4/Math.max(10,o.titan.walk.ay-o.titan.walk.top);o.titan.kl=tk;SPR.titan=o.titan;}
  if(o.guard){const gk=7.5/Math.max(10,o.guard.stand.ay-o.guard.stand.top);o.guard.kl=gk;SPR.guard3=o.guard;}
  SPR.mode='3d';
}
function buildFlash(){
  const f=mk(64,64),g=f.getContext('2d');g.translate(32,32);
  g.fillStyle=rg(g,0,0,0,30,'rgba(255,255,230,1)','rgba(255,220,120,.7)','rgba(255,160,40,0)');
  g.beginPath();for(let i=0;i<10;i++){const a=i/10*TAU,r=i%2?9:30;g.lineTo(Math.cos(a)*r,Math.sin(a)*r*1.3);}g.closePath();g.fill();
  SPR.flash=f;
}
function blit(S,fr,x,y,sc,white){const k=S.k*PJ.s*(sc||1);ctx.drawImage(white?S.white:S.img,fr*S.fw,0,S.fw,S.fh,x-S.ax*k,y-S.ay*k,S.fw*k,S.fh*k);}

/* ----- Utilería del puente ----- */
function propCar(c){
  const cv2=mk(240,170),g=cv2.getContext('2d');
  g.fillStyle=rg(g,120,158,4,120,'rgba(0,0,0,.5)','rgba(0,0,0,0)');el(g,120,156,116,13);g.fill();
  g.fillStyle='#111';rr(g,20,118,36,44,9);g.fill();rr(g,184,118,36,44,9);g.fill();
  g.fillStyle=lg(g,0,70,0,146,c[0],c[1],c[2]);rr(g,10,72,220,74,18);g.fill();
  g.fillStyle=lg(g,0,18,0,78,c[0],c[1]);g.beginPath();g.moveTo(42,78);g.lineTo(62,26);g.quadraticCurveTo(120,15,178,26);g.lineTo(198,78);g.closePath();g.fill();
  g.fillStyle=lg(g,0,30,0,74,'#43566a','#141b24');g.beginPath();g.moveTo(56,74);g.lineTo(71,34);g.quadraticCurveTo(120,26,169,34);g.lineTo(184,74);g.closePath();g.fill();
  g.strokeStyle='rgba(220,235,255,.5)';g.lineWidth=1.3;const cx=132,cy=50;for(let i=0;i<9;i++){const a=i/9*TAU;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a)*rnd(14,40),cy+Math.sin(a)*rnd(8,22));g.stroke();}
  g.fillStyle='#a51d27';rr(g,16,86,34,15,4);g.fill();rr(g,190,86,34,15,4);g.fill();
  g.fillStyle='rgba(255,180,180,.45)';g.fillRect(19,88,26,3);g.fillRect(193,88,26,3);
  g.fillStyle='#e6e2d2';rr(g,98,104,44,15,2);g.fill();g.fillStyle='#2a2a2a';g.font='bold 11px sans-serif';g.textAlign='center';g.fillText('ZK·19',120,116);
  g.fillStyle='#26262a';rr(g,8,124,224,15,6);g.fill();
  g.fillStyle='rgba(80,45,20,.4)';for(let i=0;i<7;i++){el(g,rnd(20,220),rnd(80,140),rnd(5,14),rnd(3,8));g.fill();}
  g.fillStyle='rgba(20,20,20,.35)';el(g,90,30,30,7);g.fill();
  return {img:cv2,w:2.2,h:1.55};
}
function propBarrier(){
  const c=mk(220,100),g=c.getContext('2d');
  g.fillStyle=rg(g,110,92,4,110,'rgba(0,0,0,.45)','rgba(0,0,0,0)');el(g,110,92,106,9);g.fill();
  g.fillStyle=lg(g,0,10,0,95,'#d9d7d0','#a9a69e','#77746d');g.beginPath();g.moveTo(14,92);g.lineTo(30,52);g.lineTo(44,12);g.lineTo(176,12);g.lineTo(190,52);g.lineTo(206,92);g.closePath();g.fill();
  for(let i=0;i<6;i++){g.fillStyle=i%2?'#e9e9e6':'#c8282f';g.beginPath();const x=40+i*24;g.moveTo(x,46);g.lineTo(x+24,46);g.lineTo(x+20,58);g.lineTo(x-4,58);g.closePath();g.fill();}
  g.fillStyle='rgba(60,50,40,.3)';for(let i=0;i<8;i++){el(g,rnd(30,190),rnd(20,88),rnd(4,12),rnd(2,6));g.fill();}
  return {img:c,w:2.3,h:1.0};
}
function propCone(){
  const c=mk(70,100),g=c.getContext('2d');
  g.fillStyle='rgba(0,0,0,.4)';el(g,35,94,30,5);g.fill();
  g.fillStyle='#1d1d1d';rr(g,6,86,58,9,2);g.fill();
  g.fillStyle=lg(g,10,0,60,0,'#ffa04a','#f06a10','#b8480a');g.beginPath();g.moveTo(14,87);g.lineTo(31,8);g.lineTo(39,8);g.lineTo(56,87);g.closePath();g.fill();
  g.fillStyle='#f1f1ec';g.beginPath();g.moveTo(22,52);g.lineTo(48,52);g.lineTo(45,38);g.lineTo(25,38);g.closePath();g.fill();
  return {img:c,w:.5,h:.72};
}
function propBarrel(){
  const c=mk(90,120),g=c.getContext('2d');
  g.fillStyle='rgba(0,0,0,.4)';el(g,45,113,40,6);g.fill();
  g.fillStyle=lg(g,6,0,84,0,'#3d6aa8','#2a4f86','#183258');rr(g,8,10,74,104,10);g.fill();
  g.fillStyle='rgba(0,0,0,.28)';g.fillRect(8,40,74,5);g.fillRect(8,78,74,5);
  g.fillStyle='rgba(150,80,30,.5)';for(let i=0;i<6;i++){el(g,rnd(14,76),rnd(18,108),rnd(4,10),rnd(3,8));g.fill();}
  g.fillStyle=lg(g,0,4,0,18,'#4c78b4','#21416e');el(g,45,12,37,7);g.fill();
  g.fillStyle='#f2c230';g.beginPath();g.moveTo(45,52);g.lineTo(55,70);g.lineTo(35,70);g.closePath();g.fill();
  return {img:c,w:.78,h:1.05};
}
function propSandbags(){
  const c=mk(220,100),g=c.getContext('2d');
  g.fillStyle='rgba(0,0,0,.4)';el(g,110,92,104,8);g.fill();
  for(let r=0;r<3;r++)for(let i=0;i<5-(r===2?1:0);i++){const x=22+i*44+(r%2)*22,y=80-r*24;g.fillStyle=lg(g,0,y-14,0,y+12,'#cdb98c','#a38e62','#7a6845');el(g,x,y,24,13);g.fill();g.strokeStyle='rgba(60,45,25,.5)';g.lineWidth=1.2;ln(g,x-18,y,x+18,y+1);}
  return {img:c,w:2.1,h:.95};
}
const PROPS={};
function buildProps(){
  PROPS.cars=[propCar(['#c45a4c','#8f3a30','#5a221c']),propCar(['#dfe2e4','#a4a9ae','#6c7177']),propCar(['#5f7b95','#3d566e','#253546'])];
  PROPS.barrier=propBarrier();PROPS.cone=propCone();PROPS.barrel=propBarrel();PROPS.bags=propSandbags();
}
function signCanvas(txt,sub){
  const c=mk(300,110),g=c.getContext('2d');
  g.fillStyle='#1d6b3f';rr(g,2,2,296,106,10);g.fill();g.strokeStyle='#f2f2ee';g.lineWidth=5;rr(g,9,9,282,92,7);g.stroke();
  g.fillStyle='#f4f4f0';g.font='bold 38px system-ui,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,150,sub?44:56);
  if(sub){g.font='bold 22px system-ui,Arial,sans-serif';g.fillText(sub,150,80);}
  g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,80,300,30);
  return c;
}
const SIGNS=[];
function buildSigns(){SIGNS.push(signCanvas('EVACUACIÓN','SIGA ADELANTE'),signCanvas('PUENTE NORTE','ZONA SEGURA 2 km'),signCanvas('SALIDA 4','CERRADA'),signCanvas('NO DETENERSE',null));}

/* ============================================================
   AMBIENTES
   ============================================================ */
const PALS=[
  {name:'NIEBLA',skyT:'#5c7187',skyM:'#8ea1b2',skyB:'#c5d0d9',sunX:.74,sunY:.36,sunGlow:'rgba(255,250,236,.38)',sunDisk:'rgba(255,253,242,.95)',sunDiskE:'rgba(255,253,242,0)',sunR:15,clouds:10,cloud:'rgba(232,238,243,.34)',fog:'192,203,212',
   waterT:'#7189a1',water:'#2d4863',waterB:'#172a3f',glint:'rgba(218,234,246,1)',sunRefl:0,bld:['#aab7c3','#8b9aa9','#6c7d8e'],win:null,
   road:'#7b7f86',roadF:'#aab0b6',walk:'#a8aaad',walkD:'#8d9094',curbF:'#686c72',line:'rgba(242,242,236,.9)',rail:'#58606b',night:0,grade:'rgba(140,175,210,.07)'},
  {name:'ATARDECER',skyT:'#28284d',skyM:'#985a7b',skyB:'#f8aa68',sunX:.28,sunY:.8,sunGlow:'rgba(255,186,118,.6)',sunDisk:'rgba(255,238,196,1)',sunDiskE:'rgba(255,170,90,0)',sunR:30,clouds:9,cloud:'rgba(255,172,142,.3)',fog:'234,170,126',
   waterT:'#b37f7a',water:'#3c3a5f',waterB:'#1b1c35',glint:'rgba(255,212,168,1)',sunRefl:1,bld:['#90697d','#694f67','#443552'],win:null,
   road:'#787077',roadF:'#b89d93',walk:'#9f9290',walkD:'#857876',curbF:'#5f575c',line:'rgba(252,238,222,.88)',rail:'#4c4550',night:0,grade:'rgba(255,150,90,.08)'},
  {name:'NOCHE',skyT:'#04080f',skyM:'#0e172d',skyB:'#2a3858',sunX:.8,sunY:.28,sunGlow:'rgba(160,190,255,.2)',sunDisk:'rgba(238,242,255,1)',sunDiskE:'rgba(200,215,255,0)',sunR:12,clouds:6,cloud:'rgba(120,140,190,.16)',fog:'36,48,76',
   waterT:'#22304d',water:'#0f192d',waterB:'#050b16',glint:'rgba(165,195,245,1)',sunRefl:0,bld:['#1f2b47','#162036','#0e1526'],win:'rgba(255,214,140,.6)',
   road:'#454a56',roadF:'#323a4e',walk:'#555a64',walkD:'#41454e',curbF:'#2e3239',line:'rgba(225,230,240,.78)',rail:'#3a404c',night:1,grade:'rgba(40,60,150,.1)'}
];
let SCN=null,SKYC=null,VIG=null;
function makeSkyline(p){
  const c=mk(1600,320),g=c.getContext('2d'),B=[];
  g.fillStyle=p.bld[0];g.globalAlpha=.55;g.beginPath();g.moveTo(0,320);for(let x=0;x<=1600;x+=40)g.lineTo(x,226-Math.sin(x*.004)*26-Math.sin(x*.013)*12);g.lineTo(1600,320);g.fill();g.globalAlpha=1;
  const layer=(col,minH,maxH,minW,maxW,det,winA)=>{let x=-20;while(x<1620){const w=rnd(minW,maxW),h=rnd(minH,maxH),y=320-h;g.fillStyle=col;const r=Math.random();
      if(r<.14){g.fillRect(x,y,w,h);g.fillRect(x+w*.2,y-h*.14,w*.6,h*.14);g.fillRect(x+w*.46,y-h*.3,Math.max(2,w*.08),h*.16);}
      else if(r<.22){g.fillRect(x,y,w,h);g.beginPath();g.moveTo(x,y);g.lineTo(x+w/2,y-h*.32);g.lineTo(x+w,y);g.fill();}
      else{g.fillRect(x,y,w,h);if(det&&Math.random()<.35){g.fillRect(x+w*.6,y-9,8,9);g.fillRect(x+w*.6-1,y-11,10,2);}if(Math.random()<.2)g.fillRect(x+w*.3,y-rnd(15,35),2,40);}
      if(winA){g.fillStyle=winA;for(let yy=y+5;yy<316;yy+=6)for(let xx=x+3;xx<x+w-3;xx+=5)if(Math.random()<.28)g.fillRect(xx,yy,2.2,2.8);}
      else if(det){g.fillStyle='rgba(255,255,255,.07)';for(let yy=y+5;yy<316;yy+=7)g.fillRect(x+2,yy,w-4,1);g.fillStyle='rgba(0,0,0,.08)';g.fillRect(x+w*.7,y,w*.3,h);}
      if(p.night&&Math.random()<.16)B.push([x+w/2,y-3]);
      x+=w+rnd(-3,8);}};
  layer(p.bld[0],60,200,14,50,false,p.win&&'rgba(255,214,140,.22)');
  layer(p.bld[1],40,150,20,70,true,p.win&&'rgba(255,214,140,.38)');
  layer(p.bld[2],20,92,26,90,true,p.win);
  g.strokeStyle=p.bld[1];g.lineWidth=3;const cx=rnd(300,1300);ln(g,cx,320,cx,120);ln(g,cx-60,124,cx+120,124);g.lineWidth=1.2;ln(g,cx+100,124,cx+100,170);
  const fg=g.createLinearGradient(0,110,0,320);fg.addColorStop(0,'rgba('+p.fog+',0)');fg.addColorStop(1,'rgba('+p.fog+',.9)');g.fillStyle=fg;g.fillRect(0,0,1600,320);
  return {img:c,beacons:B};
}
function buildSky(){
  const p=SCN.pal,w=Math.ceil(W*1.25),h=Math.max(4,Math.ceil(HORY+6));
  const c=mk(w,h),g=c.getContext('2d');
  g.fillStyle=lg(g,0,0,0,h,p.skyT,p.skyM,p.skyB);g.fillRect(0,0,w,h);
  if(p.night){for(let i=0;i<160;i++){g.fillStyle='rgba(255,255,255,'+rnd(.2,.95)+')';const r=rnd(.5,1.5);g.fillRect(Math.random()*w,Math.random()*h*.85,r,r);}}
  const sx=w*p.sunX,sy=h*p.sunY;
  g.fillStyle=rg(g,sx,sy,0,Math.max(h,w*.6),p.sunGlow,'rgba(0,0,0,0)');g.fillRect(0,0,w,h);
  g.fillStyle=rg(g,sx,sy,0,p.sunR*1.6,p.sunDisk,p.sunDisk,p.sunDiskE);el(g,sx,sy,p.sunR*1.6,p.sunR*1.6);g.fill();
  if(p.night){g.fillStyle='rgba(150,160,190,.35)';el(g,sx-3,sy-2,2.6,2.6);g.fill();el(g,sx+4,sy+3,1.8,1.8);g.fill();}
  for(let i=0;i<p.clouds;i++){const cx=Math.random()*w,cy=h*rnd(.22,.86),cw=rnd(70,220)*(w/420);
    for(let j=0;j<8;j++){const bx=cx+rnd(-cw/2,cw/2),by=cy+rnd(-cw*.07,cw*.07),br=rnd(cw*.14,cw*.3);g.fillStyle=rg(g,bx,by,0,br,p.cloud,'rgba(255,255,255,0)');el(g,bx,by,br,br*.5);g.fill();}}
  SKYC=c;
}
function buildVignette(){
  const w=Math.ceil(W/3),h=Math.ceil(H/3);VIG=mk(w,h);const g=VIG.getContext('2d');
  g.fillStyle=rg(g,w/2,h*.46,Math.min(w,h)*.3,Math.hypot(w,h)*.62,'rgba(0,0,0,0)','rgba(0,0,0,.42)');g.fillRect(0,0,w,h);
  g.fillStyle=lg(g,0,0,0,h,SCN.pal.grade,'rgba(0,0,0,0)');g.fillRect(0,0,w,h);
}
function sunScreenX(){const w=Math.ceil(W*1.25);return -W*.125-cam.x*2+w*SCN.pal.sunX;}
function mkScene(lv,L,guardZ){
  const pal=PALS[(lv-1)%PALS.length];
  const decals=[];for(let z=2;z<L+90;z+=rnd(2,4.5)){const r=Math.random();if(r<.72)decals.push({x:rnd(-4.2,4.2),z,w:rnd(.25,1.3),l:rnd(.4,2.4),a:rnd(.05,.13),t:r<.3?0:r<.55?1:r<.68?2:3});}
  const lamps=[];for(let z=10;z<L+150;z+=24){lamps.push({x:-10.05,z,kd:5,sz:z});lamps.push({x:6.6,z:z+12,kd:5,sz:z+12});}
  const glints=[];for(let i=0;i<170;i++){const sd=Math.random()<.5?-1:1;glints.push({x:sd*rnd(sd<0?11:7.5,70),z:rnd(0,200),p:rnd(0,TAU),w:rnd(.5,2.4)});}
  const props=[];
  for(let z=14;z<L+120;z+=rnd(7,15)){
    if(guardZ&&Math.abs(z-guardZ)<11)continue;
    const r=Math.random();let pr;
    if(r<.3)pr=PROPS.cars[(Math.random()*3)|0];else if(r<.5)pr=PROPS.barrier;else if(r<.68)pr=PROPS.bags;else if(r<.84)pr=PROPS.barrel;else pr=PROPS.cone;
    props.push({x:rnd(-9.4,-6.4),z,p:pr,kd:10,sz:z});
    if(Math.random()<.45){const pr2=Math.random()<.6?PROPS.cone:PROPS.barrel;props.push({x:rnd(5.8,6.4),z:z+rnd(-3,3),p:pr2,kd:10,sz:z});}
  }
  const gantries=[];for(let z=70;z<L-30;z+=rnd(85,120)){if(guardZ&&Math.abs(z-guardZ)<16)continue;gantries.push({z,s:SIGNS[(Math.random()*SIGNS.length)|0],kd:9,sz:z});}
  const sl=makeSkyline(pal);
  return {pal,decals,lamps,glints,props,gantries,sky:sl.img,beacons:sl.beacons};
}

/* ============================================================
   NIVELES
   ============================================================ */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function genLevel(lv){
  const R=mulberry32(lv*7919+101);
  const ri=(a,b)=>a+Math.floor(R()*(b-a+1)),rf=(a,b)=>a+R()*(b-a),pick=a=>a[Math.floor(R()*a.length)];
  const L=250+Math.min(lv,12)*16;
  const gates=[],crates=[],waves=[];let row=0;
  const zhp=Math.round(24+lv*9+1.2*lv*lv),bhp=Math.round(260+lv*130+15*lv*lv);
  const mkg=(z,x0,x1,o)=>gates.push({row,z,x0,x1,k:o.k,val:o.v,v0:o.v,kd:3,sz:z,fl:0});
  const pair=(z,A,B)=>{const f=R()<.5,l=f?B:A,r=f?A:B;if(l)mkg(z,-RAIL,0,l);if(r)mkg(z,0,RAIL,r);row++;};
  const right=(z,o)=>{mkg(z,0,RAIL,o);row++;};
  const pos=()=>({k:'add',v:ri(3,6)+Math.round(lv*1.2)});
  const neg=()=>({k:'add',v:-(ri(5,9)+Math.round(lv*2.8))});
  const mul2=()=>({k:'mul',v:2}),half=()=>({k:'mul',v:.5});
  let mulLeft=lv>=3?1+(lv>=7?1:0):0;
  const bigOrMul=()=>{if(mulLeft>0&&R()<.6){mulLeft--;return mul2();}return {k:'add',v:ri(6,9)+Math.round(lv*1.8)};};
  const wave=(z,n,side)=>{let x0=-ROAD,x1=ROAD;if(side===1)x0=.2;else if(side===-1)x1=-.2;
    const br=lv>=2?Math.floor(rf(0,1+lv*.45)):0,run=lv>=3?ri(0,Math.floor(lv/2)):0;
    waves.push({z,n,x0,x1,depth:rf(5,9)+n*.08,br,run,hp:zhp,bhp,done:false});};
  const crate=(z,x)=>{const hp=140+lv*120;crates.push({z,x,type:R()<.55?'w':'m',hp,max:hp,val:ri(4,8)+lv*2,dead:false,fl:0,ft:0,kd:4,sz:z});};
  let z=24;
  pair(z,{k:'add',v:5+lv},{k:'add',v:2});z+=rf(26,30);
  wave(z,12+lv*4,0);z+=rf(26,30);
  pair(z,pos(),lv>=2?neg():{k:'add',v:1});z+=rf(24,28);
  // Tramo del Guardián: todo el contenido va por la derecha (la izquierda queda para dispararle)
  const gz=Math.round(z+34);
  right(gz-24,R()<.65?pos():{k:'add',v:-(ri(3,6)+lv)});
  crate(gz-13,rf(2.2,3.2));
  wave(gz+3,8+lv*3,1);
  z=gz+14+rf(0,6);
  let last='g';
  while(z<L-50){
    const r=R();
    if(r<.38&&last!=='g'){
      const c=ri(0,5);
      if(c===0)pair(z,pos(),neg());else if(c===1)pair(z,bigOrMul(),neg());else if(c===2)pair(z,neg(),{k:'add',v:-(ri(2,5)+lv)});
      else if(c===3)pair(z,bigOrMul(),pos());else if(c===4)pair(z,half(),pos());else pair(z,pos(),{k:'add',v:-(ri(1,3)+lv)});
      last='g';
    }else if(r<.78||last==='c'){wave(z,ri(16,22)+Math.round(lv*5),pick([0,0,1,-1]));last='w';}
    else{crate(z,pick([-2.6,0,2.6])+rf(-.5,.5));last='c';}
    z+=rf(25,32);
  }
  pair(L-40,pos(),lv>=3?bigOrMul():neg());
  const l1=lv-1,bossHp=Math.round(BOSS_HP0*(1+BOSS_HPK*l1+.1*l1*l1)/100)*100;
  return {L,gates,crates,waves,bossHp,gz};
}

/* ============================================================
   ESTADO
   ============================================================ */
let state='menu',G=null;
const SLOTS=[];for(let i=0;i<MAX_SQUAD+5;i++){if(!i){SLOTS.push([0,0]);continue;}const r=Math.sqrt(i),a=i*2.399963;SLOTS.push([Math.cos(a)*r,Math.sin(a)*r*.8]);}
const formRad=n=>Math.min(.44*Math.sqrt(Math.max(1,n)),3.1);
const formSp=n=>formRad(n)/Math.sqrt(Math.max(1,n));
function mkGuard(lv,gz){
  const hp=Math.round(GUARD_HP0*(1+GUARD_HPK*(lv-1)+.06*(lv-1)*(lv-1))/50)*50,cracks=[];
  for(let i=0;i<16;i++){const pts=[];let x=rnd(-4.6,5.2),y=rnd(-10.5,-1);pts.push([x,y]);let a=rnd(0,TAU);const n=3+(Math.random()*3|0);
    for(let j=0;j<n;j++){a+=rnd(-.9,.9);x+=Math.cos(a)*rnd(.6,1.6);y+=Math.sin(a)*rnd(.6,1.6);pts.push([x,y]);}cracks.push({th:(i+1)/17,pts});}
  return {x:GUARD_X,z:gz,st:'sleep',hp,max:hp,t:0,kneel:1,raise:0,raiseT:0,atk:1.2,walk:0,flash:-1,lit:.3,cracks,waves:[],tgt:null,kd:8,sz:gz,slab:true};
}
function newRun(lv,demo){
  const d=genLevel(lv);
  SCN=mkScene(lv,d.L,d.gz);buildSky();buildVignette();
  G={lv,demo:!!demo,L:d.L,gates:d.gates,crates:d.crates,waves:d.waves,
    squad:{x:0,tx:0,z:0,sp:demo?RUN*.7:0},
    soldiers:[],bullets:[],zombies:[],parts:[],texts:[],corpses:[],shock:[],flashes:[],rings:[],
    boss:{x:0,z:d.L+6,hp:d.bossHp,max:d.bossHp,t:0,st:'idle',atk:2.2,sum:6,raise:0,raiseT:0,flash:-1,walk:0,dieT:0,dieDir:1,roarT:2,spd:.5+.035*Math.min(lv,12),kd:6,sz:0},
    guard:mkGuard(lv,d.gz),
    phase:'run',time:0,kills:0,coins:0,meter:.2,slash:null,wl:1,fireAcc:0,endT:0,shown:false,banner:demo?0:2.6,banner2:null,flashScr:0};
  addSoldiers(demo?7:1+save.up.rec,true);
  cam.z=-CAM_D;cam.x=0;
}
function addSoldiers(k,instant){
  const S=G.soldiers,sp0=formSp(k);
  for(let i=0;i<k&&S.length<MAX_SQUAD;i++)S.push({ox:instant?SLOTS[S.length][0]*sp0:rnd(-.3,.3),oz:instant?SLOTS[S.length][1]*sp0:rnd(-.3,.3),ph:Math.random()*TAU,fl:0,pop:instant?0:.3,v:(Math.random()*SVAR.length)|0,wx:G.squad.x,wz:G.squad.z,kd:1,sz:0});
}
function killSoldierAt(i){const s=G.soldiers[i];if(!s)return;puff(s.wx,.6,s.wz,'110,170,255');G.soldiers.splice(i,1);sfx.hurt();}
function removeSoldiers(k){
  const S=G.soldiers,idx=S.map((s,i)=>i).sort((a,b)=>S[b].oz-S[a].oz).slice(0,k).sort((a,b)=>b-a);
  for(const i of idx){const s=S[i];puff(s.wx,.6,s.wz,'255,90,100');S.splice(i,1);}
}

/* ---------- Partículas y textos ---------- */
function part(o){if(G.parts.length<750)G.parts.push(o);}
function burst(x,y,z,n,col){for(let i=0;i<n;i++)part({x,y,z,vx:rnd(-3,3),vy:rnd(1,5),vz:rnd(-2,3),l:rnd(.25,.55),m:.55,sz:rnd(.06,.14),c:col||'200,245,255',t:0});}
function puff(x,y,z,col){for(let i=0;i<6;i++)part({x,y,z,vx:rnd(-2,2),vy:rnd(1,3),vz:rnd(-1.5,1.5),l:rnd(.3,.5),m:.5,sz:rnd(.07,.13),c:col,t:0});}
function dust(x,z,n,big,y){for(let i=0;i<n;i++)part({x:x+rnd(-1,1)*(big||1),y:y||.3,z:z+rnd(-.6,.6),vx:rnd(-2,2),vy:rnd(.5,2),vz:rnd(-1,1),l:rnd(.6,1.1),m:1.1,sz:rnd(.4,.9)*(big||1),c:'150,140,130',t:1});}
function smoke(x,y,z){part({x,y,z,vx:rnd(-.4,.4),vy:rnd(1.2,2.2),vz:rnd(-.3,.3),l:rnd(.9,1.4),m:1.4,sz:rnd(.3,.5),c:'90,92,98',t:1});}
function debris(x,y,z,n,col){for(let i=0;i<n;i++)part({x,y,z,vx:rnd(-4,4),vy:rnd(3,8),vz:rnd(-3,3),l:rnd(.6,1),m:1,sz:rnd(.1,.25),c:col||'70,62,58',t:2});}
function shards(x,y,z,n){for(let i=0;i<n;i++)part({x:x+rnd(-4,4),y:y+rnd(-4,4),z:z+rnd(-1,1),vx:rnd(-6,6),vy:rnd(1,9),vz:rnd(-4,3),l:rnd(.7,1.3),m:1.3,sz:rnd(.12,.3),c:'170,235,255',t:3});}
function ftext(txt,col,x,y,z,sz){G.texts.push({txt,col,x,y,z,t:0,l:1.1,sz:sz||1});}
function buzz(ms){try{if(navigator.vibrate)navigator.vibrate(ms);}catch(e){}}

/* ---------- Audio sintetizado ---------- */
const AU={ctx:null,master:null,nb:null,last:{}};
function initAudio(){
  try{
    if(!AU.ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return;AU.ctx=new A();AU.master=AU.ctx.createGain();AU.master.gain.value=.55;AU.master.connect(AU.ctx.destination);
      const len=AU.ctx.sampleRate,buf=AU.ctx.createBuffer(1,len,AU.ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;AU.nb=buf;}
    if(AU.ctx.state==='suspended')AU.ctx.resume();
  }catch(e){AU.ctx=null;}
}
const thr=(n,g)=>{const t=performance.now();if((AU.last[n]||0)+g*1000>t)return false;AU.last[n]=t;return true;};
function tone(f,dur,type,vol,slide,delay){const c=AU.ctx;if(!c||save.muted)return;try{const t0=c.currentTime+(delay||0),o=c.createOscillator(),g=c.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f+slide),t0+dur);g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+.008);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(g);g.connect(AU.master);o.start(t0);o.stop(t0+dur+.03);}catch(e){}}
function noise(dur,vol,freq,ftype,delay,f2){const c=AU.ctx;if(!c||save.muted||!AU.nb)return;try{const t0=c.currentTime+(delay||0),s=c.createBufferSource();s.buffer=AU.nb;const fl=c.createBiquadFilter();fl.type=ftype||'lowpass';fl.frequency.setValueAtTime(freq,t0);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t0+dur);const g=c.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);s.connect(fl);fl.connect(g);g.connect(AU.master);s.start(t0,Math.random()*.4);s.stop(t0+dur+.03);}catch(e){}}
const sfx={
  shot(){if(thr('shot',.075)){noise(.045,.045,3200,'highpass');tone(1400,.035,'square',.012,-700);}},
  kill(){if(thr('kill',.05)){tone(180,.09,'triangle',.07,-90);noise(.06,.035,900,'lowpass');}},
  hurt(){if(thr('hurt',.08))tone(240,.12,'sawtooth',.05,-120);},
  good(){tone(523,.09,'square',.06);tone(659,.09,'square',.06,0,.07);tone(988,.16,'square',.06,0,.14);},
  bad(){tone(320,.3,'sawtooth',.07,-200);},
  tick(){if(thr('tick',.06))tone(1100+Math.random()*250,.03,'sine',.025);},
  tink(){if(thr('tink',.05))tone(2000+Math.random()*900,.05,'triangle',.028);},
  crate(){tone(784,.1,'triangle',.09);tone(1175,.18,'triangle',.08,0,.08);noise(.15,.08,1200,'bandpass');},
  roar(){tone(65,1.1,'sawtooth',.16,-25);tone(98,1,'sawtooth',.08,-30);noise(.9,.12,500,'lowpass');},
  quake(){noise(.7,.25,300,'lowpass');tone(48,.6,'sine',.3,-18);},
  slash(){noise(.45,.22,400,'bandpass',0,5000);tone(220,.4,'sawtooth',.05,600);},
  boom(){noise(1.4,.3,700,'lowpass',0,80);tone(60,1.1,'sine',.3,-30);},
  shatter(){noise(.7,.28,3500,'highpass',0,700);[1568,2093,2637,3136,3951].forEach((f,i)=>tone(f,.3,'triangle',.05,0,i*.045));},
  mech(){tone(110,.9,'sawtooth',.1,220);tone(55,1,'square',.06,40);noise(.8,.1,600,'lowpass',.2);},
  slam(){noise(.25,.16,500,'lowpass');tone(95,.22,'sine',.22,-50);},
  impact(){noise(.55,.24,900,'lowpass',0,120);tone(70,.45,'sine',.26,-35);},
  win(){[523,659,784,1047].forEach((f,i)=>tone(f,.22,'square',.07,0,i*.12));},
  lose(){[392,330,262,196].forEach((f,i)=>tone(f,.3,'triangle',.08,0,i*.16));},
  click(){tone(700,.05,'square',.04);}
};

/* ---------- Entrada ---------- */
const keys={l:false,r:false};
let drag=null,moved=false;
const pxToWorld=()=>dSq/F*1.12;
cv.addEventListener('pointerdown',e=>{drag={id:e.pointerId,x:e.clientX};try{cv.setPointerCapture(e.pointerId);}catch(_){}initAudio();});
cv.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x;drag.x=e.clientX;if(G&&state==='play'&&!G.demo){G.squad.tx+=dx*pxToWorld();if(Math.abs(dx)>2)moved=true;}});
const endDrag=e=>{if(drag&&e.pointerId===drag.id)drag=null;};
cv.addEventListener('pointerup',endDrag);cv.addEventListener('pointercancel',endDrag);
document.addEventListener('touchmove',e=>{if(e.target===cv)e.preventDefault();},{passive:false});
addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')keys.l=true;
  else if(e.key==='ArrowRight'||e.key==='d'||e.key==='D')keys.r=true;
  else if(e.key===' '){e.preventDefault();doSlash();}
  else if(e.key==='Escape'||e.key==='p'||e.key==='P'){if(state==='play')pause();else if(state==='pause')resume();}
  if(state==='play')moved=moved||keys.l||keys.r;
});
addEventListener('keyup',e=>{if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')keys.l=false;if(e.key==='ArrowRight'||e.key==='d'||e.key==='D')keys.r=false;});

/* ============================================================
   SIMULACIÓN
   ============================================================ */
function lowerBound(a,z){let lo=0,hi=a.length;while(lo<hi){const m=(lo+hi)>>1;if(a[m].z<z)lo=m+1;else hi=m;}return lo;}
function update(dt){
  const g=G,sq=g.squad;g.time+=dt;
  if(g.demo){demoUpdate(dt);return;}
  const alive=g.phase==='run'||g.phase==='boss';
  if(alive){if(keys.l)sq.tx-=10*dt;if(keys.r)sq.tx+=10*dt;}
  const n=g.soldiers.length,rad=formRad(n),lim=Math.max(0,ROAD-rad*.9);
  sq.tx=clamp(sq.tx,-lim,lim);sq.x+=(sq.tx-sq.x)*Math.min(1,dt*14);
  if(g.phase==='run'&&sq.z>=g.L-22){g.phase='boss';startBoss();}
  const slow=g.guard&&g.guard.st==='lock';
  const tsp=g.phase==='run'?(slow?SLOW:RUN):0;sq.sp+=(tsp-sq.sp)*Math.min(1,dt*(tsp>sq.sp?1.6:2.6));
  sq.z+=sq.sp*dt;
  cam.z=sq.z-CAM_D;cam.x+=(sq.x*.35-cam.x)*Math.min(1,dt*4);
  updSoldiers(dt);
  if(alive)fire(dt);
  updBullets(dt);spawnWaves();updZombies(dt);
  if(alive){gatesPass();cratesPass();}
  updGuard(dt);updBoss(dt);updShock(dt);updSlash(dt);updParts(dt);
  if(alive)g.meter=Math.min(1,g.meter+dt*.008*(1+.25*save.up.slash));
  if(alive&&g.soldiers.length===0){g.phase='lose';g.endT=0;sfx.lose();buzz(200);}
  if(g.phase==='win'||g.phase==='lose'){g.endT+=dt;if(g.endT>(g.phase==='win'?2.4:1.5)&&!g.shown){g.shown=true;showEnd();}}
  if(g.banner>0)g.banner-=dt;if(g.banner2){g.banner2.t-=dt;if(g.banner2.t<=0)g.banner2=null;}if(g.flashScr>0)g.flashScr-=dt;
}
function demoUpdate(dt){
  const sq=G.squad;sq.z+=sq.sp*dt;if(sq.z>G.L-60)sq.z=0;
  sq.x=Math.sin(G.time*.6)*2.2;
  cam.z=sq.z-CAM_D;cam.x+=(sq.x*.35-cam.x)*Math.min(1,dt*4);
  updSoldiers(dt);updParts(dt);
}
function updSoldiers(dt){
  const S=G.soldiers,sq=G.squad,f=Math.min(1,dt*6),sp=formSp(S.length);
  for(let i=0;i<S.length;i++){const s=S[i],a=SLOTS[i];
    s.ox+=(a[0]*sp-s.ox)*f;s.oz+=(a[1]*sp-s.oz)*f;s.ph+=dt*sq.sp*1.6;
    if(s.fl>0)s.fl-=dt;if(s.pop>0)s.pop-=dt;
    s.wx=sq.x+s.ox;s.wz=sq.z+s.oz;s.sz=s.wz;}
}
function fire(dt){
  const S=G.soldiers,n=S.length;if(!n)return;
  const shooters=Math.min(n,CAP),mult=Math.pow(n/shooters,.7);
  const rate=BASE_RATE*(1+.1*save.up.rate)*(1+.1*(G.wl-1));
  const dmg=BASE_DMG*(1+.15*save.up.pow)*(1+.3*(G.wl-1))*mult;
  const gd=G.guard,aimG=gd&&gd.st==='lock'&&gd.z-G.squad.z<RANGE+6;
  let threat=false;if(aimG)for(const z of G.zombies){if(!z.dead&&z.z-G.squad.z<9&&z.x<1){threat=true;break;}}
  G.fireAcc+=shooters*rate*dt;let shots=0;
  while(G.fireAcc>=1){G.fireAcc-=1;const s=S[(Math.random()*n)|0];const b={x:s.wx+.12,z:s.wz+.4,d:dmg,life:RANGE/BV,vx:0,g:0};
    if(aimG&&s.wx<-.8&&(!threat||Math.random()<.45)){const tx=gd.x+2.4*GUARD_K+rnd(-1.3,1.3),tz=gd.z-1.2;if(tz>b.z+1){b.vx=(tx-b.x)/(tz-b.z)*BV;b.g=1;b.life=(tz-b.z)/BV+.05;}}
    G.bullets.push(b);s.fl=.06;shots++;}
  if(shots)sfx.shot();
}
function updBullets(dt){
  const B=G.bullets,Z=G.zombies,bo=G.boss,gd=G.guard;
  for(let i=B.length-1;i>=0;i--){
    const b=B[i],z0=b.z,z1=z0+BV*dt;b.life-=dt;b.x+=b.vx*dt;
    let hz=Infinity,tg=null,tk=0;
    for(let j=lowerBound(Z,z0-.6);j<Z.length;j++){const zb=Z[j];if(zb.z>z1+.6)break;if(zb.dead)continue;
      if(Math.abs(zb.x-b.x)<(zb.br?.78:.4)){hz=zb.z;tg=zb;tk=1;break;}}
    for(const gt of G.gates){if(gt.used||gt.k!=='add')continue;if(gt.z>z0-.2&&gt.z<=z1+.3&&b.x>gt.x0&&b.x<gt.x1&&gt.z<hz){hz=gt.z;tg=gt;tk=2;}}
    for(const c of G.crates){if(c.dead)continue;const cz=c.z-.55;if(cz>z0-.4&&cz<=z1+.3&&Math.abs(b.x-c.x)<.78&&cz<hz){hz=cz;tg=c;tk=3;}}
    if(b.g&&gd&&gd.st==='lock'){const gz=gd.z-1.2;if(gz<=z1&&gz<hz){hz=gz;tg=gd;tk=5;}}
    else if(!b.g&&(bo.st==='idle'||bo.st==='fight')){const bz=bo.z-1.8;if(bz<=z1&&bz>z0-3&&Math.abs(b.x-bo.x)<4.2&&bz<hz){hz=bz;tg=bo;tk=4;}}
    if(tg){hit(tk,tg,b);B[i]=B[B.length-1];B.pop();continue;}
    b.z=z1;if(b.life<=0){B[i]=B[B.length-1];B.pop();}
  }
}
function hit(tk,t,b){
  if(tk===1){t.hp-=b.d;t.hit=.07;if(t.hp<=0)killZombie(t,true);else if(Math.random()<.3)burst(t.x,.9,t.z-.3,1);}
  else if(tk===2){t.val+=GATE_INC/(1+Math.max(0,t.val-t.v0)/6);t.fl=.06;sfx.tick();if(Math.random()<.25)burst(b.x,1,t.z-.1,1,t.val>=0?'140,200,255':'255,150,150');}
  else if(tk===3){t.hp-=b.d;t.fl=.07;if(t.hp<=0)breakCrate(t,true);}
  else if(tk===4){if(t.st==='idle'){if(Math.random()<.3)burst(b.x,rnd(3,9),t.z-2,1,'200,200,210');return;}t.hp-=b.d;if(t.flash<-.12)t.flash=.05;if(Math.random()<.5)burst(b.x,rnd(3,9),t.z-2,1,'255,230,170');if(t.hp<=0)bossDie();}
  else if(tk===5){t.hp-=b.d;if(t.flash<-.1)t.flash=.05;sfx.tink();if(Math.random()<.45)burst(b.x,rnd(1,7),t.z-1.2,2,'170,235,255');if(t.hp<=0)guardFree();}
}
function killZombie(z,reward){
  if(z.dead)return;z.dead=true;
  if(reward){G.kills++;G.coins+=z.br?8:1;G.meter=Math.min(1,G.meter+(z.br?.05:.011)*(1+.25*save.up.slash));}
  G.corpses.push({x:z.x,z:z.z,t:0,br:z.br,pal:z.pal,ph:z.ph,kd:7,sz:z.z,side:Math.random()<.5?-1:1});
  burst(z.x,z.br?1.3:.75,z.z,z.br?14:6);dust(z.x,z.z,z.br?3:1,z.br?.9:.5);sfx.kill();
}
function spawnWaves(){for(const w of G.waves){if(w.done)continue;if(G.squad.z>=w.z-60){w.done=true;spawnWave(w);}}}
function spawnWave(w){
  for(let i=0;i<w.n;i++){const br=i<w.br,run=!br&&i<w.br+w.run,hp=br?w.bhp:run?w.hp*.7:w.hp;
    G.zombies.push({x:rnd(w.x0,w.x1),z:w.z+Math.random()*w.depth,sp:br?.85:run?3.3:rnd(.9,1.6),hp,max:hp,br,run,ph:Math.random()*TAU,off:rnd(-1.6,1.6),pal:br?(Math.random()*BVAR.length)|0:(Math.random()*ZVAR.length)|0,hit:0,dead:false,kd:2,sz:0});}
}
function updZombies(dt){
  const Z=G.zombies,sq=G.squad,S=G.soldiers;
  for(const z of Z){if(z.dead)continue;
    z.z-=z.sp*dt;z.ph+=dt*(z.br?5.4:z.sp*2.6+1.2);
    const dz=z.z-sq.z;
    if(dz<18){const tx=sq.x+z.off;z.x+=clamp(tx-z.x,-1,1)*z.sp*.5*dt;}
    z.x=clamp(z.x,-ROAD,ROAD);if(z.hit>0)z.hit-=dt;
    if(dz<1.8&&dz>-1.8&&S.length){const r=z.br?.85:.5;
      for(let i=S.length-1;i>=0;i--){const s=S[i];
        if(Math.abs(s.wx-z.x)<r&&Math.abs(s.wz-z.z)<.5){killSoldierAt(i);
          if(z.br){z.hp-=z.max*.2;z.hit=.07;if(z.hp<=0){killZombie(z,false);break;}}
          else{killZombie(z,false);break;}}}}
    if(z.z<sq.z-6)z.dead=true;
    z.sz=z.z;
  }
  let w=0;for(let i=0;i<Z.length;i++)if(!Z[i].dead)Z[w++]=Z[i];Z.length=w;
  Z.sort((a,b)=>a.z-b.z);
}
function gateLabel(gt){if(gt.k==='mul')return gt.val<1?'÷'+Math.round(1/gt.val):'×'+gt.val;const v=Math.round(gt.val);return v>=0?'+'+v:'−'+(-v);}
function gatesPass(){
  const sq=G.squad;
  for(const gt of G.gates){if(gt.used||sq.z<gt.z)continue;
    const row=G.gates.filter(o=>o.row===gt.row);let ch=null;
    for(const o of row){o.used=true;o.ft=0;if(sq.x>=o.x0&&sq.x<=o.x1)ch=o;}
    if(ch){ch.chosen=true;applyGate(ch);}
  }
}
function applyGate(gt){
  const n=G.soldiers.length;let nn=gt.k==='add'?n+Math.round(gt.val):Math.round(n*gt.val);nn=clamp(nn,0,MAX_SQUAD);
  if(nn>n)addSoldiers(nn-n);else if(nn<n)removeSoldiers(n-nn);
  const good=nn>=n;
  ftext(gateLabel(gt),good?'#8fd0ff':'#ff8a92',G.squad.x,2.2,G.squad.z+1.5,1.3);
  if(good){sfx.good();buzz(15);}else{sfx.bad();buzz(60);shake=Math.max(shake,.25);}
}
function breakCrate(c,reward){
  c.dead=true;c.ft=0;debris(c.x,.8,c.z,14,'110,86,52');
  if(reward){G.coins+=5;
    if(c.type==='w'){if(G.wl<6)G.wl++;ftext('ARMA NV '+G.wl,'#ffe27a',c.x,2.2,c.z,1.1);}
    else{addSoldiers(c.val);ftext('+'+c.val+' TROPA','#8fd0ff',c.x,2.2,c.z,1.1);}
    sfx.crate();buzz(20);burst(c.x,1,c.z,12,'255,230,140');}
}
function cratesPass(){
  const sq=G.squad;
  for(const c of G.crates){if(c.dead||sq.z<c.z-.4)continue;
    let k=0;for(let i=G.soldiers.length-1;i>=0;i--){const s=G.soldiers[i];if(Math.abs(s.wx-c.x)<.85){killSoldierAt(i);k++;}}
    breakCrate(c,false);if(k){shake=Math.max(shake,.3);ftext('−'+k,'#ff8a92',c.x,2,c.z,1);buzz(50);}
  }
}

/* ---------- Guardián ---------- */
function guardFree(){
  const gd=G.guard;if(gd.st!=='lock')return;
  gd.st='wake';gd.t=0;gd.hp=0;G.coins+=20;
  shards(gd.x+1,5,gd.z,70);burst(gd.x+1,5,gd.z,30,'190,245,255');
  sfx.shatter();setTimeout(()=>sfx.mech(),450);shake=.7;G.flashScr=.2;buzz(120);
  G.banner2={txt:'¡GUARDIÁN LIBERADO!',sub:'Ahora pelea a tu lado',t:2.4,col:'#9ff0ff'};
}
function updGuard(dt){
  const gd=G.guard;if(!gd)return;const sq=G.squad;gd.t+=dt;gd.flash-=dt;gd.sz=gd.z;
  switch(gd.st){
    case 'sleep':if(G.phase==='run'&&sq.z>=gd.z-GUARD_LOCK){gd.st='lock';gd.t=0;}break;
    case 'lock':if(sq.z>=gd.z-GUARD_PASS||G.phase!=='run'){gd.st='lost';gd.lit=.12;ftext('GUARDIÁN PERDIDO','#a9bccd',gd.x+3,7,gd.z,1);sfx.bad();}break;
    case 'wake':
      gd.kneel=Math.max(0,1-Math.max(0,gd.t-.5)/1.3);gd.lit=Math.min(1,.3+gd.t);
      if(gd.t>1.9){gd.st='ally';gd.atk=.8;gd.slab=false;dust(gd.x,gd.z,10,2.2,.4);debris(gd.x,.5,gd.z,14);}
      break;
    case 'ally':{
      const tz=sq.z+(G.phase==='boss'?16:15),d=tz-gd.z,spd=clamp(d*1.6,-3,RUN*1.7);
      gd.z+=spd*dt;gd.x+=(-7.1-gd.x)*Math.min(1,dt*1.5);gd.walk+=Math.abs(spd)*dt*.08;
      if(gd.raiseT>0){gd.raiseT-=dt;gd.raise=Math.min(1,gd.raise+dt*2.6);if(gd.raiseT<=0)guardSlam();}
      else{gd.raise=Math.max(0,gd.raise-dt*7);gd.atk-=dt;if(gd.atk<=0&&(G.phase==='run'||G.phase==='boss'))guardPick();}
      if(Math.random()<dt*4)for(const sd of [-1,1])smoke(gd.x+sd*1.9*GUARD_K,(5.6+3.2)*GUARD_K,gd.z+.4);
    }break;
  }
  for(let i=gd.waves.length-1;i>=0;i--){const w=gd.waves[i];w.t+=dt;
    const k=Math.min(1,w.t/w.dur);if(Math.random()<.8)part({x:lerp(w.x0,w.x1,k)+rnd(-.3,.3),y:.2,z:lerp(w.z0,w.z1,k),vx:rnd(-1,1),vy:rnd(1,4),vz:rnd(-1,1),l:.4,m:.4,sz:rnd(.08,.16),c:'150,240,255',t:0});
    if(w.t>=w.dur){guardImpact(w);gd.waves.splice(i,1);}}
}
function guardPick(){
  const gd=G.guard,sq=G.squad,b=G.boss;
  if(G.phase==='boss'&&b.st==='fight'){gd.tgt={x:b.x,z:b.z-1.8,boss:true};gd.raiseT=.55;gd.atk=2.4;return;}
  if(G.phase!=='run'){gd.atk=.5;return;}
  let best=null,bc=0;const Z=G.zombies;
  for(const z of Z){if(z.dead||z.z<sq.z+4||z.z>sq.z+30)continue;let c=0;for(const o of Z)if(!o.dead&&Math.abs(o.x-z.x)<3&&Math.abs(o.z-z.z)<3)c+=o.br?4:1;if(c>bc){bc=c;best=z;}}
  if(best&&bc>=3){gd.tgt={x:clamp(best.x,-4.6,3.4),z:best.z-best.sp*.9};gd.raiseT=.5;gd.atk=2.6;return;}
  const cr=G.crates.find(c=>!c.dead&&c.z>sq.z+6&&c.z<sq.z+30);
  if(cr){gd.tgt={x:cr.x,z:cr.z};gd.raiseT=.5;gd.atk=2.6;return;}
  gd.atk=.4;
}
function guardSlam(){
  const gd=G.guard,t=gd.tgt;if(!t)return;
  const ox=gd.x+3.9*GUARD_K,oz=gd.z-.6,dist=Math.hypot(t.x-ox,t.z-oz);
  gd.waves.push({x0:ox,z0:oz,x1:t.x,z1:t.z,t:0,dur:Math.max(.12,dist/48),boss:!!t.boss});
  shake=Math.max(shake,.3);sfx.slam();dust(ox,oz,6,1.2);debris(ox,.4,oz,8);
}
function guardImpact(w){
  const R=3.4;
  if(w.boss){const b=G.boss;if(b.st==='fight'){const dmg=b.max*.035+400;b.hp-=dmg;b.flash=.12;ftext('−'+Math.round(dmg),'#9ff0ff',b.x,9,b.z-2,1.2);if(b.hp<=0)bossDie();}}
  for(const z of G.zombies){if(z.dead)continue;if((z.x-w.x1)**2+(z.z-w.z1)**2<R*R){z.hp-=z.br?700:9999;z.hit=.1;if(z.hp<=0)killZombie(z,true);}}
  for(const c of G.crates)if(!c.dead&&Math.abs(c.x-w.x1)<R&&Math.abs(c.z-w.z1)<R)breakCrate(c,true);
  for(const g of G.gates)if(!g.used&&g.k==='add'&&Math.abs(g.z-w.z1)<R&&w.x1>g.x0-1&&w.x1<g.x1+1){g.val+=4;g.fl=.2;}
  G.rings.push({x:w.x1,z:w.z1,t:0});burst(w.x1,.5,w.z1,16,'150,240,255');debris(w.x1,.3,w.z1,12);dust(w.x1,w.z1,6,1.5);
  shake=Math.max(shake,.45);sfx.impact();buzz(25);
}

/* ---------- Jefe ---------- */
function startBoss(){const b=G.boss;b.st='fight';b.atk=2.4;b.sum=6;sfx.roar();shake=.5;buzz(80);}
function updBoss(dt){
  const b=G.boss,sq=G.squad;b.t+=dt;b.flash-=dt;b.sz=b.z;
  if(b.st==='idle'){b.roarT-=dt;if(b.roarT<=0&&b.z-sq.z<95){b.roarT=rnd(6,9);sfx.roar();}return;}
  if(b.st==='fight'){
    if(Math.random()<dt*3)for(const sd of [-1,1])smoke(b.x+sd*2.4*BOSS_K,7.6*BOSS_K,b.z+.5);
    if(G.phase!=='boss'){b.raise=Math.max(0,b.raise-dt*4);return;}
    if(b.raiseT>0){b.raiseT-=dt;b.raise=Math.min(1,b.raise+dt*3);if(b.raiseT<=0){shake=.6;sfx.quake();buzz(90);dust(b.x-2.5*BOSS_K,b.z-1,8,1.6);dust(b.x+2.5*BOSS_K,b.z-1,8,1.6);}}
    else{b.raise=Math.max(0,b.raise-dt*6);b.z-=b.spd*dt;b.walk+=dt*2.2;b.x+=clamp(sq.x*.4-b.x,-1,1)*dt*.6;}
    b.atk-=dt;
    if(b.atk<=0&&b.raiseT<=0){b.atk=Math.max(2.2,3.8-.12*G.lv);b.raiseT=.9;
      const tx=clamp(sq.x+rnd(-.8,.8),-3.2,3.2);G.shock.push({x:tx,w:3.1,warn:.9,front:0,on:false});}
    b.sum-=dt;if(b.sum<=0){b.sum=Math.max(4.5,7.5-.2*G.lv);
      const n=6+Math.min(14,G.lv);for(let i=0;i<n;i++){const hp=Math.round(24+G.lv*9+1.2*G.lv*G.lv);G.zombies.push({x:clamp(b.x+rnd(-4,4),-ROAD,ROAD),z:b.z-2.5+rnd(0,2),sp:rnd(1.3,2),hp,max:hp,br:false,run:false,ph:Math.random()*TAU,off:rnd(-1.6,1.6),pal:(Math.random()*ZVAR.length)|0,hit:0,dead:false,kd:2,sz:0});}
      dust(b.x,b.z-2,6,1.2);}
    if(b.z-sq.z<4.2&&G.soldiers.length){removeSoldiers(G.soldiers.length);shake=1.2;sfx.quake();b.raise=1;}
  }
  if(b.st==='dying'){b.dieT+=dt;if(Math.random()<.6)burst(b.x+rnd(-4,4),rnd(2,12),b.z-1,4,'255,200,120');if(Math.random()<.25)dust(b.x+rnd(-4,4),b.z,2,1.5);if(b.dieT>2.2)b.st='dead';}
}
function bossDie(){
  const b=G.boss;if(b.st==='dying'||b.st==='dead')return;
  b.st='dying';b.dieT=0;b.dieDir=Math.random()<.5?-1:1;b.hp=0;G.phase='win';G.endT=0;
  G.coins+=60+G.lv*15;shake=1.4;sfx.boom();setTimeout(()=>sfx.win(),700);buzz(250);
  for(const z of G.zombies)killZombie(z,false);G.shock.length=0;G.flashScr=.25;
}
function updShock(dt){
  const sq=G.squad,b=G.boss;
  for(let i=G.shock.length-1;i>=0;i--){const s=G.shock[i];
    if(!s.on){s.warn-=dt;if(s.warn<=0){s.on=true;s.front=b.z-2;}continue;}
    const f0=s.front;s.front-=28*dt;
    for(let j=G.soldiers.length-1;j>=0;j--){const so=G.soldiers[j];if(so.wz<=f0&&so.wz>s.front&&Math.abs(so.wx-s.x)<s.w/2)killSoldierAt(j);}
    if(Math.random()<.9)debris(s.x+rnd(-s.w/2,s.w/2),.3,s.front,2);
    if(s.front<sq.z-6)G.shock.splice(i,1);
  }
}
/* ---------- Tajo de energía ---------- */
function doSlash(){
  if(!G||G.demo||state!=='play'||G.meter<1||(G.phase!=='run'&&G.phase!=='boss'))return;
  G.meter=0;G.slash={front:G.squad.z+.5,prev:G.squad.z+.5,end:G.squad.z+42,done:new Set(),boss:false,guard:false};
  sfx.slash();shake=.45;G.flashScr=.18;buzz(40);
}
function updSlash(dt){
  const s=G.slash;if(!s)return;
  s.prev=s.front;s.front+=46*dt;
  for(const z of G.zombies){if(z.dead||z.z<s.prev-.6||z.z>s.front)continue;z.hp-=z.br?900:9999;z.hit=.1;if(z.hp<=0)killZombie(z,true);}
  for(const g of G.gates){if(g.used||s.done.has(g)||g.z<s.prev||g.z>s.front)continue;s.done.add(g);if(g.k==='add'){g.val+=15;g.fl=.25;}}
  for(const c of G.crates)if(!c.dead&&c.z>=s.prev&&c.z<=s.front)breakCrate(c,true);
  const gd=G.guard;if(gd&&!s.guard&&gd.st==='lock'&&gd.z-1.2<=s.front){s.guard=true;gd.hp-=gd.max*.18;gd.flash=.2;shards(gd.x+2,5,gd.z,12);if(gd.hp<=0)guardFree();}
  const b=G.boss;if(!s.boss&&(b.st==='fight'||b.st==='idle')&&b.z-1.8<=s.front){s.boss=true;b.hp-=b.max*.07+500;b.flash=.2;if(b.hp<=0)bossDie();}
  for(let i=0;i<5;i++)part({x:rnd(-RAIL,RAIL),y:rnd(.2,3),z:s.front,vx:0,vy:rnd(0,2),vz:rnd(2,6),l:.35,m:.35,sz:rnd(.08,.16),c:'150,240,255',t:0});
  if(s.front>=s.end)G.slash=null;
}
function updParts(dt){
  const P=G.parts;
  for(let i=P.length-1;i>=0;i--){const p=P[i];p.l-=dt;if(p.l<=0){P[i]=P[P.length-1];P.pop();continue;}
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;if(p.t!==1)p.vy-=12*dt;else{p.sz+=dt*.8;p.vy*=.96;}if(p.y<0){p.y=0;p.vy*=-.3;}}
  for(let i=G.texts.length-1;i>=0;i--){const t=G.texts[i];t.t+=dt;t.y+=dt*1.2;if(t.t>t.l)G.texts.splice(i,1);}
  for(let i=G.corpses.length-1;i>=0;i--){const c=G.corpses[i];c.t+=dt;if(c.t>.55)G.corpses.splice(i,1);}
  for(let i=G.rings.length-1;i>=0;i--){const r=G.rings[i];r.t+=dt;if(r.t>.5)G.rings.splice(i,1);}
  for(const g of G.gates){if(g.fl>0)g.fl-=dt;if(g.used)g.ft+=dt;}
  for(const c of G.crates){if(c.fl>0)c.fl-=dt;if(c.dead)c.ft+=dt;}
  if(shake>0)shake=Math.max(0,shake-dt*2.2);
}

/* ============================================================
   RENDER — fondo y puente
   ============================================================ */
function drawBackdrop(){
  const p=SCN.pal,top=Math.max(0,HORY);
  if(SKYC)ctx.drawImage(SKYC,-W*.125-cam.x*2,0,SKYC.width,top+6);
  const sw=Math.max(W*1.6,780),sh=sw*320/1600,sx=CX-sw/2-cam.x*4,sy=HORY-sh+6;
  ctx.drawImage(SCN.sky,sx,sy,sw,sh);
  if(SCN.beacons.length){ctx.fillStyle='rgba(255,60,50,.9)';for(let i=0;i<SCN.beacons.length;i++){if(Math.sin(T*2.6+i*1.7)<.55)continue;const b=SCN.beacons[i];ctx.fillRect(sx+b[0]*sw/1600-1,sy+b[1]*sh/320-1,2.2,2.2);}}
  let g=ctx.createLinearGradient(0,HORY,0,H);g.addColorStop(0,p.waterT);g.addColorStop(.16,p.water);g.addColorStop(1,p.waterB);ctx.fillStyle=g;ctx.fillRect(0,HORY,W,H-HORY);
  g=ctx.createLinearGradient(0,HORY,0,HORY+H*.09);g.addColorStop(0,'rgba('+p.fog+',.55)');g.addColorStop(1,'rgba('+p.fog+',0)');ctx.fillStyle=g;ctx.fillRect(0,HORY,W,H*.09);
  if(p.sunRefl){const x0=sunScreenX();for(let i=0;i<34;i++){const k=i/34,y=HORY+2+k*k*H*.5,ww=(1-k*.8)*W*.11*(.55+.45*Math.sin(T*3+i*1.7));ctx.fillStyle='rgba(255,205,150,'+(.55*(1-k))+')';ctx.fillRect(x0-ww/2+Math.sin(T*2+i)*6,y,ww,1.4+k*3.5);}}
  ctx.fillStyle=p.glint;
  for(const gl of SCN.glints){const zz=cam.z+2+(((gl.z-cam.z-2)%200)+200)%200;if(!proj(gl.x,-4,zz))continue;
    const a=(.28+.36*Math.sin(T*1.7+gl.p))*Math.min(1,PJ.s/5);if(a<=.03)continue;ctx.globalAlpha=a;const L=gl.w*PJ.s;ctx.fillRect(PJ.x-L/2,PJ.y,L,Math.max(1,PJ.s*.07));}
  ctx.globalAlpha=1;
  ctx.fillStyle='rgba(0,0,0,.28)';if(gq(WALK_L,cam.z,WALK_L-3.6,cam.z+230,-4))ctx.fill();if(gq(WALK_R,cam.z,WALK_R+3.2,cam.z+230,-4))ctx.fill();
}
function drawRoad(){
  const p=SCN.pal,zN=cam.z+.6,zF=cam.z+240;
  if(gq(-CURB,zN,CURB,zF)){const g=ctx.createLinearGradient(0,H,0,HORY);g.addColorStop(0,p.road);g.addColorStop(1,p.roadF);ctx.fillStyle=g;ctx.fill();}
  ctx.fillStyle='rgba(0,0,0,.055)';for(const x of [-3.4,-.35,2.8])if(gq(x,zN,x+.65,zF))ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.035)';for(const x of [-2.6,.5,3.6])if(gq(x,zN,x+.3,zF))ctx.fill();
  const z0d=cam.z+1,z1d=cam.z+120;
  ctx.fillStyle='rgba(20,20,20,.1)';ctx.beginPath();for(const d of SCN.decals)if(d.t===1&&d.z>z0d&&d.z<z1d)gqa(d.x,d.z,d.x+d.w,d.z+d.l);ctx.fill();
  ctx.fillStyle='rgba(10,10,14,.14)';ctx.beginPath();for(const d of SCN.decals){if(d.t!==2||d.z<z0d||d.z>z1d||!proj(d.x,0,d.z))continue;ctx.moveTo(PJ.x+d.w*PJ.s*.7,PJ.y);ctx.ellipse(PJ.x,PJ.y,d.w*PJ.s*.7,d.w*PJ.s*.25,0,0,TAU);}ctx.fill();
  ctx.strokeStyle='rgba(25,25,25,.2)';ctx.lineWidth=1;ctx.beginPath();for(const d of SCN.decals){if(d.t!==0||d.z<z0d||d.z>z1d||!proj(d.x,0,d.z))continue;ctx.moveTo(PJ.x,PJ.y);proj(d.x+d.w*.4,0,d.z+d.l*.5);ctx.lineTo(PJ.x,PJ.y);proj(d.x-d.w*.2,0,d.z+d.l);ctx.lineTo(PJ.x,PJ.y);}ctx.stroke();
  ctx.fillStyle='rgba(40,40,44,.5)';ctx.beginPath();for(const d of SCN.decals){if(d.t!==3||d.z<z0d||d.z>z1d||!proj(d.x,0,d.z))continue;const r=.42*PJ.s;ctx.moveTo(PJ.x+r,PJ.y);ctx.ellipse(PJ.x,PJ.y,r,r*.4,0,0,TAU);}ctx.fill();
  const jz=Math.floor(cam.z/16)*16+8;
  ctx.fillStyle='rgba(30,30,34,.5)';ctx.beginPath();for(let z=jz;z<cam.z+140;z+=16)if(z>=zN)gqa(-CURB,z,CURB,z+.18);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();for(let z=jz;z<cam.z+140;z+=16)if(z>=zN)gqa(-CURB,z+.18,CURB,z+.26);ctx.fill();
  ctx.fillStyle=p.line;const st=Math.floor(cam.z/5)*5;ctx.beginPath();
  for(let z=st;z<cam.z+130;z+=5){if(z+2.2<zN)continue;for(const x of [-1.75,1.75])gqa(x-.08,Math.max(z,zN),x+.08,z+2.2);}
  for(const x of [-4.55,4.55])gqa(x-.07,zN,x+.07,cam.z+200);ctx.fill();
  ctx.fillStyle=p.night?'rgba(255,220,140,.95)':'rgba(255,240,200,.75)';ctx.beginPath();
  for(let z=Math.floor(cam.z/6)*6+3;z<cam.z+90;z+=6){if(z<zN)continue;for(const x of [-4.55,4.55]){if(!proj(x,.02,z))continue;const r=Math.max(.8,PJ.s*.07);ctx.rect(PJ.x-r,PJ.y-r*.5,r*2,r);}}ctx.fill();
  // vereda izquierda (ancha) y derecha (angosta)
  ctx.fillStyle=p.curbF;if(xq(-CURB,0,WALK_Y,zN,zF))ctx.fill();if(xq(CURB,0,WALK_Y,zN,zF))ctx.fill();
  if(gq(WALK_L,zN,-CURB,zF,WALK_Y)){const g=ctx.createLinearGradient(0,H,0,HORY);g.addColorStop(0,p.walk);g.addColorStop(1,p.roadF);ctx.fillStyle=g;ctx.fill();}
  if(gq(CURB,zN,WALK_R,zF,WALK_Y)){ctx.fillStyle=p.walk;ctx.fill();}
  ctx.fillStyle='rgba(255,255,255,.18)';if(gq(-CURB-.25,zN,-CURB,zF,WALK_Y+.002))ctx.fill();if(gq(CURB,zN,CURB+.25,zF,WALK_Y+.002))ctx.fill();
  ctx.fillStyle=p.walkD;ctx.beginPath();
  for(let z=Math.floor(cam.z/2.5)*2.5;z<cam.z+110;z+=2.5){if(z<zN)continue;gqa(WALK_L,z,-CURB,z+.07,WALK_Y+.003);gqa(CURB,z,WALK_R,z+.07,WALK_Y+.003);}
  gqa(-7.9,zN,-7.83,cam.z+150,WALK_Y+.003);ctx.fill();
  ctx.fillStyle=p.curbF;if(xq(WALK_L,WALK_Y,1.0,zN,zF))ctx.fill();if(xq(WALK_R,WALK_Y,1.0,zN,zF))ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.12)';if(xq(WALK_L,.92,1.0,zN,zF))ctx.fill();if(xq(WALK_R,.92,1.0,zN,zF))ctx.fill();
  ctx.fillStyle=p.rail;ctx.beginPath();
  for(let z=Math.floor(cam.z/1.6)*1.6;z<cam.z+85;z+=1.6){if(z<zN)continue;for(const x of [WALK_L+.1,WALK_R-.1]){if(!proj(x,1.0,z))continue;const x0=PJ.x,y0=PJ.y,w=Math.max(.7,PJ.s*.07)/2;proj(x,1.85,z);ctx.moveTo(x0-w,y0);ctx.lineTo(x0+w,y0);ctx.lineTo(PJ.x+w,PJ.y);ctx.lineTo(PJ.x-w,PJ.y);ctx.closePath();}}ctx.fill();
  ctx.fillStyle=p.rail;for(const x of [WALK_L+.1,WALK_R-.1]){if(xq(x,1.78,1.92,zN,zF))ctx.fill();if(xq(x,1.38,1.45,zN,zF))ctx.fill();}
  ctx.fillStyle='rgba(255,255,255,.14)';for(const x of [WALK_L+.1,WALK_R-.1])if(xq(x,1.88,1.92,zN,zF))ctx.fill();
  if(p.night){ctx.globalCompositeOperation='lighter';for(const l of SCN.lamps){if(l.z<cam.z+2||l.z>cam.z+110)continue;const lx=l.x<0?l.x+3.4:l.x-2.6;if(!proj(lx,0,l.z))continue;const r=PJ.s*2.4;const g=ctx.createRadialGradient(PJ.x,PJ.y,0,PJ.x,PJ.y,r);g.addColorStop(0,'rgba(255,200,120,.32)');g.addColorStop(1,'rgba(255,200,120,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(PJ.x,PJ.y,r,r*.45,0,0,TAU);ctx.fill();}ctx.globalCompositeOperation='source-over';}
}
function drawGroundFx(){
  const sq=G.squad,b=G.boss;
  if(G.soldiers.length&&proj(sq.x,.02,sq.z)){const r=(formRad(G.soldiers.length)+.8)*PJ.s;ctx.fillStyle=rg(ctx,PJ.x,PJ.y,0,r,'rgba(80,170,255,.2)','rgba(80,170,255,0)');ctx.beginPath();ctx.ellipse(PJ.x,PJ.y,r,r*.42,0,0,TAU);ctx.fill();
    ctx.strokeStyle='rgba(130,205,255,'+(.25+.1*Math.sin(T*4))+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(PJ.x,PJ.y,r*.92,r*.39,0,0,TAU);ctx.stroke();}
  for(const s of G.shock){const zA=sq.z-5,zB=b.z-1.5;
    if(!s.on){const a=.22+.18*Math.sin(T*22);ctx.fillStyle='rgba(255,40,40,'+a+')';if(gq(s.x-s.w/2,zA,s.x+s.w/2,zB,.03))ctx.fill();
      ctx.strokeStyle='rgba(255,120,120,.9)';ctx.lineWidth=2;ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);}
    else{ctx.fillStyle='rgba(255,60,40,.14)';if(gq(s.x-s.w/2,zA,s.x+s.w/2,s.front,.03))ctx.fill();
      ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,150,60,.8)';if(gq(s.x-s.w/2,s.front-.7,s.x+s.w/2,s.front+.5,.05))ctx.fill();ctx.globalCompositeOperation='source-over';}}
  const gd=G.guard;
  if(gd&&gd.waves.length){ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(const w of gd.waves){const k=Math.min(1,w.t/w.dur),hx=lerp(w.x0,w.x1,k),hz=lerp(w.z0,w.z1,k);
      if(!proj(w.x0,.05,w.z0))continue;const ax=PJ.x,ay=PJ.y,as=PJ.s;if(!proj(hx,.05,hz))continue;
      ctx.strokeStyle='rgba(90,210,255,.35)';ctx.lineWidth=Math.max(4,as*.6);ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(PJ.x,PJ.y);ctx.stroke();
      ctx.strokeStyle='rgba(220,250,255,.9)';ctx.lineWidth=Math.max(1.5,as*.14);ctx.stroke();
      ctx.fillStyle='rgba(200,250,255,.9)';ctx.beginPath();ctx.arc(PJ.x,PJ.y,Math.max(3,PJ.s*.45),0,TAU);ctx.fill();}
    ctx.globalCompositeOperation='source-over';}
  for(const r of G.rings){if(!proj(r.x,.05,r.z))continue;const k=r.t/.5,rad=PJ.s*(.5+k*4.2);
    ctx.strokeStyle='rgba(150,240,255,'+(1-k)+')';ctx.lineWidth=Math.max(2,PJ.s*.3*(1-k));ctx.beginPath();ctx.ellipse(PJ.x,PJ.y,rad,rad*.42,0,0,TAU);ctx.stroke();
    ctx.fillStyle='rgba(120,220,255,'+(.25*(1-k))+')';ctx.fill();}
  if(G.slash){const z=G.slash.front;ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(80,210,255,.35)';if(gq(-RAIL,z-2.4,RAIL,z+.2,.03))ctx.fill();ctx.globalCompositeOperation='source-over';}
}

/* ============================================================
   RENDER — entidades
   ============================================================ */
function drawSoldier(s){
  if(!proj(s.wx,0,s.wz))return;
  const sc=s.pop>0?1-s.pop/.3*.6:1,S=SPR.sol[s.v%SPR.sol.length];
  const fr=G.squad.sp<.6?0:(((s.ph/TAU*NF)|0)%NF+NF)%NF;
  blit(S,fr,PJ.x,PJ.y,sc);
  if(s.fl>0){const k=S.k*PJ.s*sc;G.flashes.push(PJ.x+(S.mx-S.ax)*k,PJ.y+(S.my-S.ay)*k,PJ.s);}
  if(s.pop>0){ctx.strokeStyle='rgba(120,220,255,'+(s.pop/.3)+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(PJ.x,PJ.y,PJ.s*.6*(1.6-s.pop*2),PJ.s*.22*(1.6-s.pop*2),0,0,TAU);ctx.stroke();}
}
function drawZombie(z){
  if(!proj(z.x,0,z.z))return;
  const fr=(((z.ph/TAU*NF)|0)%NF+NF)%NF,S=z.br?SPR.bru[z.pal%SPR.bru.length]:SPR.zom[z.pal%SPR.zom.length];
  blit(S,fr,PJ.x,PJ.y);
  if(z.hit>0){ctx.globalAlpha=Math.min(1,z.hit/.07)*.8;blit(S,fr,PJ.x,PJ.y,1,true);ctx.globalAlpha=1;}
  if(z.br&&z.hp<z.max){const bw=PJ.s*1.3,bx=PJ.x-bw/2,by=PJ.y-(S.ay-S.top)*S.k*PJ.s-8;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(bx-1,by-1,bw+2,6);ctx.fillStyle='#ff4d5a';ctx.fillRect(bx,by,bw*Math.max(0,z.hp/z.max),4);}
}
function drawCorpse(c){
  if(!proj(c.x,0,c.z))return;
  const k=c.t/.55,fr=(((c.ph/TAU*NF)|0)%NF+NF)%NF,S=c.br?SPR.bru[c.pal%SPR.bru.length]:SPR.zom[c.pal%SPR.zom.length],q=S.k*PJ.s;
  ctx.save();ctx.globalAlpha=Math.max(0,1-k);ctx.translate(PJ.x,PJ.y);ctx.rotate(c.side*k*.9);ctx.scale(1,1-k*.55);
  ctx.drawImage(S.img,fr*S.fw,0,S.fw,S.fh,-S.ax*q,-S.ay*q,S.fw*q,S.fh*q);ctx.restore();
}
function personIcon(x,y,s,col){ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y-s*.55,s*.28,0,TAU);ctx.fill();rr(ctx,x-s*.36,y-s*.2,s*.72,s*.7,s*.25);ctx.fill();}
function drawGate(gt){
  let a=1;if(gt.used){a=gt.chosen?Math.max(0,1-gt.ft/.25):Math.max(0,1-gt.ft/.5);if(a<=0)return;}
  const z=gt.z,x0=Math.max(gt.x0,-ROAD-.3)+.12,x1=Math.min(gt.x1,ROAD+.3)-.12;
  const good=gt.k==='add'?Math.round(gt.val)>=0:gt.val>=1,col=good?(gt.k==='mul'?'60,205,255':'45,140,255'):'255,45,62';
  ctx.globalAlpha=a;
  for(const px of [x0,x1]){if(vq(px-.16,0,px+.16,2.5,z)){ctx.fillStyle=lg(ctx,Q[0],0,Q[2],0,'#4d5564','#a6b0bf','#2c323d');ctx.fill();}
    if(vq(px-.2,2.36,px+.2,2.64,z)){ctx.fillStyle='rgb('+col+')';ctx.fill();}}
  if(vq(x0,2.3,x1,2.5,z)){ctx.fillStyle='#262c36';ctx.fill();}
  if(vq(x0+.2,2.36,x1-.2,2.42,z)){ctx.fillStyle='rgba('+col+',.95)';ctx.fill();}
  if(vq(x0+.16,.15,x1-.16,2.26,z)){
    const g=ctx.createLinearGradient(0,Q[7],0,Q[1]);g.addColorStop(0,'rgba('+col+',.38)');g.addColorStop(1,'rgba('+col+',.84)');ctx.fillStyle=g;ctx.fill();
    const l0x=Q[0],l0y=Q[1],l1x=Q[6],l1y=Q[7],r0x=Q[2],r0y=Q[3],r1x=Q[4],r1y=Q[5];
    ctx.strokeStyle='rgba(255,255,255,.1)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<8;i++){const k=i/8;ctx.moveTo(lerp(l0x,l1x,k),lerp(l0y,l1y,k));ctx.lineTo(lerp(r0x,r1x,k),lerp(r0y,r1y,k));}ctx.stroke();
    vq(x0+.16,.15,x1-.16,2.26,z);const s=PJ.s;
    ctx.lineWidth=Math.max(2,s*.14);ctx.strokeStyle='rgba('+col+',.55)';ctx.stroke();ctx.lineWidth=Math.max(1,s*.045);ctx.strokeStyle='rgba(255,255,255,.85)';ctx.stroke();
    if(gt.fl>0){ctx.fillStyle='rgba(255,255,255,'+Math.min(.5,gt.fl*5)+')';ctx.fill();}}
  if(vq(x0+.16,2.02,x1-.16,2.26,z)){ctx.fillStyle='rgba(255,255,255,.2)';ctx.fill();}
  if(proj((x0+x1)/2,1.2,z)){const fs=Math.max(9,PJ.s*.95),t=gateLabel(gt);
    if(gt.k==='add'){ctx.font=(fs|0)+'px '+FONT;const tw=ctx.measureText(t).width;const ix=PJ.x-tw/2-fs*.32;personIcon(ix,PJ.y+fs*.12,fs*.62,'rgba(255,255,255,.95)');otext(t,PJ.x+fs*.22,PJ.y,fs,'#fff');}
    else otext(t,PJ.x,PJ.y,fs,'#fff');}
  ctx.globalAlpha=1;
}
function drawCrate(c){
  const a=c.dead?Math.max(0,1-c.ft/.3):1;if(a<=0)return;
  const hw=.7,h=1.22,z0=c.z-.55,z1=c.z+.55,x=c.x,w=c.type==='w';
  ctx.globalAlpha=a;
  const cf=w?['#5b6b3d','#7c8f52','#425030']:['#2f60aa','#4d83d4','#22467f'];
  const sd=x>cam.x?-1:1;ctx.fillStyle=cf[2];if(xq(x+sd*hw,0,h,z0,z1))ctx.fill();
  ctx.fillStyle=cf[1];if(gq(x-hw,z0,x+hw,z1,h)){ctx.fill();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1;ctx.stroke();}
  if(vq(x-hw,0,x+hw,h,z0)){ctx.fillStyle=lg(ctx,0,Q[7],0,Q[1],cf[1],cf[0],cf[2]);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=Math.max(1,PJ.s*.04);ctx.stroke();
    const l0x=Q[0],l0y=Q[1],l1x=Q[6],l1y=Q[7],r0x=Q[2],r0y=Q[3],r1x=Q[4],r1y=Q[5];
    ctx.strokeStyle='rgba(0,0,0,.22)';ctx.beginPath();for(const k of [.33,.66]){ctx.moveTo(lerp(l0x,l1x,k),lerp(l0y,l1y,k));ctx.lineTo(lerp(r0x,r1x,k),lerp(r0y,r1y,k));}ctx.stroke();}
  ctx.fillStyle='#2a2d30';for(const [cx,cy] of [[-hw,0],[hw-.16,0],[-hw,h-.16],[hw-.16,h-.16]])if(vq(x+cx,cy,x+cx+.16,cy+.16,z0-.01))ctx.fill();
  ctx.fillStyle=w?'#e8c23a':'#bfe0ff';if(vq(x-hw+.16,h-.2,x+hw-.16,h-.12,z0-.01))ctx.fill();
  if(c.fl>0){ctx.fillStyle='rgba(255,255,255,'+Math.min(.6,c.fl*8)+')';if(vq(x-hw,0,x+hw,h,z0))ctx.fill();}
  if(proj(x,h*.5,z0-.02)){const fs=Math.max(7,PJ.s*.34);otext(w?'ARMA':'TROPA',PJ.x,PJ.y,fs,w?'#ffe27a':'#e6f3ff','#14181f',.2);}
  if(!c.dead&&proj(x,h+.65,c.z)){const fs=Math.max(9,PJ.s*.6),r=fs*.95;
    ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.arc(PJ.x,PJ.y,r,0,TAU);ctx.fill();
    ctx.strokeStyle=w?'#ffd34a':'#6fb6ff';ctx.lineWidth=Math.max(2,fs*.16);ctx.beginPath();ctx.arc(PJ.x,PJ.y,r,-Math.PI/2,-Math.PI/2+TAU*c.hp/c.max);ctx.stroke();
    otext(String(Math.ceil(c.hp)),PJ.x,PJ.y,fs*.62,'#fff');}
  ctx.globalAlpha=1;
}
function drawLamp(l){
  if(!proj(l.x,1.0,l.z))return;const x0=PJ.x,y0=PJ.y,s=PJ.s;proj(l.x,6.2,l.z);const x1=PJ.x,y1=PJ.y;
  const sd=l.x>0?-1:1;proj(l.x+sd*2.4,6.4,l.z);const x2=PJ.x,y2=PJ.y;
  ctx.strokeStyle='#363b44';ctx.lineCap='round';ctx.lineWidth=Math.max(1,s*.14);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.quadraticCurveTo(x1,y2,x2,y2);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=Math.max(.5,s*.04);ctx.beginPath();ctx.moveTo(x0-s*.04,y0);ctx.lineTo(x1-s*.04,y1);ctx.stroke();
  ctx.fillStyle=SCN.pal.night?'#ffe2a8':'#d8dde3';ctx.fillRect(x2-s*.3,y2-s*.04,s*.6,s*.16);
  if(SCN.pal.night){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x2,y2,0,x2,y2,s*1.5);g.addColorStop(0,'rgba(255,210,140,.55)');g.addColorStop(1,'rgba(255,210,140,0)');ctx.fillStyle=g;ctx.fillRect(x2-s*1.5,y2-s*1.5,s*3,s*3);ctx.globalCompositeOperation='source-over';}
}
function drawProp(o){
  if(!proj(o.x,WALK_Y,o.z))return;const p=o.p,h=p.h*PJ.s,w=p.w*PJ.s;
  ctx.drawImage(p.img,PJ.x-w/2,PJ.y-h*.95,w,h);
}
function drawGantry(gy){
  const z=gy.z,fa=clamp((z-cam.z-22)/12,0,1);if(fa<=0)return;ctx.globalAlpha=fa;
  for(const x of [-5.7,6.2]){if(vq(x-.18,0,x+.18,6.6,z)){ctx.fillStyle=lg(ctx,Q[0],0,Q[2],0,'#4b5260','#8d97a6','#2a2f39');ctx.fill();}}
  if(vq(-5.9,6.2,6.4,6.7,z)){ctx.fillStyle='#3a404b';ctx.fill();}
  if(vq(-5.9,6.62,6.4,6.7,z)){ctx.fillStyle='rgba(255,255,255,.18)';ctx.fill();}
  if(proj(-4.2,7.9,z)){const ax=PJ.x,ay=PJ.y;proj(1.2,5.5,z);ctx.drawImage(gy.s,ax,ay,PJ.x-ax,PJ.y-ay);}
  if(proj(1.9,7.9,z)){const ax=PJ.x,ay=PJ.y;proj(5.6,5.5,z);ctx.drawImage(SIGNS[(SIGNS.indexOf(gy.s)+1)%SIGNS.length],ax,ay,PJ.x-ax,PJ.y-ay);}
  ctx.globalAlpha=1;
}
/* ----- Jefe: Titán del Puente ----- */
const BOSS_C={skin:'#4c4454',skinD:'#302a37',skinL:'#665c72',plate:'#9196a1',plateL:'#c4c8d0',plateD:'#555963',bone:'#ddd3c0',boneD:'#a99f8b',dark:'#1b1820'};
const BOSS_CF={skin:'#7d7486',skinD:'#5f5768',skinL:'#948aa0',plate:'#c3c6cf',plateL:'#e6e8ec',plateD:'#8f939e',bone:'#f3ecdf',boneD:'#cfc6b4',dark:'#3a3542'};
function limb(x0,y0,x1,y1,w0,w1,fill){const a=Math.atan2(y1-y0,x1-x0)+Math.PI/2,c=Math.cos(a),s=Math.sin(a);ctx.fillStyle=fill;ctx.beginPath();ctx.moveTo(x0+c*w0,y0+s*w0);ctx.lineTo(x1+c*w1,y1+s*w1);ctx.lineTo(x1-c*w1,y1-s*w1);ctx.lineTo(x0-c*w0,y0-s*w0);ctx.closePath();ctx.fill();ctx.beginPath();ctx.arc(x1,y1,w1,0,TAU);ctx.fill();}
function drawBoss(b){if(SPR.titan)drawBoss3D(b);else drawBoss2D(b);}
function drawBoss3D(b){
  if(b.st==='dead'||!proj(b.x,0,b.z))return;
  const s=PJ.s*BOSS_K;if(s<.5)return;
  ctx.save();ctx.translate(PJ.x,PJ.y);
  if(b.st==='dying'){const k=Math.min(1,b.dieT/1.3);ctx.rotate(k*.4*b.dieDir);ctx.translate(0,k*s*1.2);ctx.globalAlpha=Math.max(0,1-Math.max(0,b.dieT-1.2));}
  ctx.scale(s,s);
  ctx.fillStyle=rg(ctx,0,0,.2,4.8,'rgba(0,0,0,.5)','rgba(0,0,0,0)');el(ctx,0,0,4.8,1.15);ctx.fill();
  const TT=SPR.titan,kl=TT.kl;let S,fr;
  if(b.raise>.02){S=TT.raise;fr=Math.min(S.n-1,Math.round(ease(b.raise)*(S.n-1)));}else{S=TT.walk;fr=(((b.walk/TAU*S.n)|0)%S.n+S.n)%S.n;}
  const dx=-S.ax*kl,dy=-S.ay*kl,dw=S.fw*kl,dh=S.fh*kl;
  ctx.drawImage(S.img,fr*S.fw,0,S.fw,S.fh,dx,dy,dw,dh);
  if(b.flash>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.3;ctx.drawImage(S.img,fr*S.fw,0,S.fw,S.fh,dx,dy,dw,dh);ctx.globalCompositeOperation='source-over';}
  const pu=.55+.3*Math.sin(b.t*6),gx=S.mxs?(S.mxs[fr]-S.ax)*kl:0,gy=S.mys?(S.mys[fr]-S.ay)*kl:-4.3,gr=S.mxs?1.5:2.2;ctx.globalCompositeOperation='lighter';ctx.fillStyle=rg(ctx,gx,gy,0,gr,'rgba(255,120,60,'+(.45*pu)+')','rgba(255,60,20,0)');el(ctx,gx,gy,gr,gr);ctx.fill();ctx.globalCompositeOperation='source-over';
  ctx.restore();
}
function drawBoss2D(b){
  if(b.st==='dead'||!proj(b.x,0,b.z))return;
  const s=PJ.s*BOSS_K;if(s<.5)return;
  ctx.save();ctx.translate(PJ.x,PJ.y);
  if(b.st==='dying'){const k=Math.min(1,b.dieT/1.3);ctx.rotate(k*.4*b.dieDir);ctx.translate(0,k*s*1.2);ctx.globalAlpha=Math.max(0,1-Math.max(0,b.dieT-1.2));}
  ctx.scale(s,s);
  const C=b.flash>0?BOSS_CF:BOSS_C,t=b.t,br=Math.sin(t*2.1)*.1,wk=Math.sin(b.walk),a=ease(b.raise);
  ctx.fillStyle=rg(ctx,0,0,.2,4.6,'rgba(0,0,0,.5)','rgba(0,0,0,0)');el(ctx,0,0,4.6,1.1);ctx.fill();
  const skinG=lg(ctx,-4,0,4,0,C.skinL,C.skin,C.skinD),plateG=lg(ctx,-3,-8,3,-4,C.plateL,C.plate,C.plateD);
  for(const [x,k] of [[-1.6,wk],[1.6,-wk]]){const lift=Math.max(0,k)*.5,fx=x*1.05;
    limb(x*.75,-3.7,fx,-1.9-lift*.5,1.05,.82,skinG);limb(fx,-1.9-lift*.5,fx,-.6-lift,.82,.7,C.skinD);
    ctx.fillStyle=plateG;el(ctx,fx,-2.05-lift*.5,.72,.55);ctx.fill();ctx.fillStyle='rgba(255,255,255,.3)';el(ctx,fx-.2,-2.2-lift*.5,.3,.18);ctx.fill();
    ctx.fillStyle=C.dark;rr(ctx,fx-1.02,-.74-lift,2.04,.74,.25);ctx.fill();
    ctx.fillStyle=C.bone;for(let i=-1;i<=1;i++)tri(ctx,fx+i*.6-.18,-.12-lift,fx+i*.6+.18,-.12-lift,fx+i*.6,.12-lift);}
  ctx.translate(0,br);
  ctx.fillStyle=lg(ctx,0,-9,0,-7,C.bone,C.boneD);for(let i=0;i<5;i++){const sx=-1.6+i*.8;tri(ctx,sx-.3,-7.4,sx+.3,-7.4,sx,-8.95-Math.sin(i*1.3)*.35);}
  ctx.fillStyle=rg(ctx,-1.2,-6.4,.3,4.2,C.skinL,C.skin,C.skinD);el(ctx,0,-5.3,3.35,2.85);ctx.fill();
  ctx.fillStyle=rg(ctx,-.5,-4.6,.2,2.4,C.skinL,C.skin);el(ctx,0,-4.3,2.2,1.6);ctx.fill();
  ctx.strokeStyle='rgba(230,170,170,.35)';ctx.lineWidth=.07;ln(ctx,-1.8,-4.2,-.9,-3.6);ln(ctx,1.2,-4.8,2,-4.1);
  ctx.fillStyle=plateG;ctx.beginPath();ctx.moveTo(-2.5,-7);ctx.lineTo(2.5,-7);ctx.lineTo(1.8,-5.3);ctx.lineTo(-1.8,-5.3);ctx.closePath();ctx.fill();
  ctx.fillStyle=C.plateD;ctx.fillRect(-2.05,-6.1,4.1,.16);
  ctx.fillStyle=C.plateL;for(const [rx,ry] of [[-2.1,-6.75],[2.1,-6.75],[-1.6,-5.55],[1.6,-5.55],[0,-6.8]]){el(ctx,rx,ry,.1,.1);ctx.fill();}
  ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=.05;ln(ctx,-1.4,-6.6,-.6,-6.3);ln(ctx,.9,-6.5,1.6,-6.2);
  const pu=.75+.25*Math.sin(t*6);
  ctx.fillStyle=rg(ctx,0,-4.5,0,1.5,'rgba(255,245,190,'+pu+')','rgba(255,140,40,'+(.85*pu)+')','rgba(255,80,20,0)');el(ctx,0,-4.5,1.5,1.5);ctx.fill();
  ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,130,40,'+(.35*pu)+')';ctx.lineWidth=.09;
  for(let i=0;i<6;i++){const an=i/6*TAU+.3;ctx.beginPath();ctx.moveTo(Math.cos(an)*.8,-4.5+Math.sin(an)*.6);ctx.quadraticCurveTo(Math.cos(an+.4)*1.6,-4.5+Math.sin(an+.4)*1.1,Math.cos(an)*2.3,-4.5+Math.sin(an)*1.6);ctx.stroke();}
  ctx.globalCompositeOperation='source-over';
  for(const sd of [-1,1]){const sw=Math.sin(b.walk+(sd>0?Math.PI:0))*.4,shx=2.9*sd,shy=-6.6;
    const ex=lerp(3.95*sd,2.6*sd,a),ey=lerp(-4.5+sw,-9.5,a),fx=lerp(3.75*sd,1.25*sd,a),fy=lerp(-2.5+sw,-11.3,a);
    limb(shx,shy,ex,ey,.85,.7,skinG);limb(ex,ey,fx,fy,.72,.9,lg(ctx,-4,0,4,0,C.skinL,C.skin,C.skinD));
    ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=.12;ln(ctx,shx-sd*.4,shy,ex-sd*.35,ey);
    ctx.fillStyle=plateG;el(ctx,ex,ey,.62,.55);ctx.fill();
    ctx.fillStyle=rg(ctx,fx-.3,fy-.3,.1,1.2,C.skinL,C.skinD);el(ctx,fx,fy,1.08,.98);ctx.fill();
    ctx.fillStyle=C.bone;for(let i=-1;i<=1;i++){el(ctx,fx+i*.42,fy-.62,.22,.2);ctx.fill();}}
  for(const sd of [-1,1]){ctx.fillStyle=lg(ctx,2.9*sd-1.4,-7.8,2.9*sd+1.4,-5.8,C.plateL,C.plate,C.plateD);el(ctx,2.9*sd,-6.8,1.4,1);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(2.9*sd-1.2,-6.55,2.4,.12);
    ctx.fillStyle=lg(ctx,0,-9.2,0,-7.2,C.bone,C.boneD);tri(ctx,2.3*sd,-7.4,2.95*sd,-7.55,3.3*sd,-9.1);tri(ctx,3.2*sd,-7.3,3.85*sd,-7,4.35*sd,-8.5);}
  ctx.fillStyle=rg(ctx,-.3,-8,.1,1.2,C.skinL,C.skinD);el(ctx,0,-7.75,1.08,.98);ctx.fill();
  ctx.fillStyle=lg(ctx,0,-10,0,-8.4,C.bone,C.boneD);
  for(const sd of [-1,1]){ctx.beginPath();ctx.moveTo(.55*sd,-8.45);ctx.quadraticCurveTo(1.7*sd,-8.7,2.1*sd,-9.9);ctx.quadraticCurveTo(1.3*sd,-9,.25*sd,-8.75);ctx.closePath();ctx.fill();}
  ctx.fillStyle=plateG;ctx.beginPath();ctx.moveTo(-1.02,-8.25);ctx.lineTo(1.02,-8.25);ctx.lineTo(.62,-7.45);ctx.lineTo(-.62,-7.45);ctx.closePath();ctx.fill();
  ctx.fillStyle=C.dark;rr(ctx,-.52,-7.28,1.04,.38,.1);ctx.fill();
  ctx.fillStyle=C.bone;for(let i=0;i<4;i++)tri(ctx,-.4+i*.26,-7.28,-.28+i*.26,-7.28,-.34+i*.26,-7.08);
  ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,70,40,.95)';ctx.fillRect(-.58,-8,.4,.15);ctx.fillRect(.18,-8,.4,.15);
  ctx.fillStyle='rgba(255,60,30,.28)';el(ctx,-.38,-7.93,.5,.25);ctx.fill();el(ctx,.38,-7.93,.5,.25);ctx.fill();
  ctx.restore();
}
/* ----- Guardián de Acero ----- */
const GC={armor:'#566170',armorL:'#9aa7b8',armorD:'#2f3640',dark:'#1d2128',plate:'#aeb9c8',plateD:'#6c7685',steel:'#717c8b',steelD:'#353c47',stripe:'#f2c230',glow:'110,225,255',visor:'255,176,64'};
const GCF={armor:'#8691a0',armorL:'#cfd8e4',armorD:'#5c6470',dark:'#3d434d',plate:'#dde5ee',plateD:'#9ca6b4',steel:'#a2acb9',steelD:'#5f6773',stripe:'#ffe07a',glow:'200,245,255',visor:'255,220,150'};
function drawGuardian(gd){
  if(!proj(gd.x,WALK_Y,gd.z))return;
  const s=PJ.s*GUARD_K;if(s<.4)return;
  ctx.save();ctx.translate(PJ.x,PJ.y);ctx.scale(s,s);
  const M=gd.flash>0&&gd.st!=='lock'?GCF:GC,kn=gd.kneel,hr=ease(gd.raise),lit=gd.lit,locked=gd.st==='sleep'||gd.st==='lock'||gd.st==='lost';
  ctx.fillStyle=rg(ctx,0,0,.2,6,'rgba(0,0,0,.5)','rgba(0,0,0,0)');el(ctx,0,0,6,1.2);ctx.fill();
  if(gd.slab){ctx.fillStyle=lg(ctx,0,-1.8,0,0,'#9a9b98','#6f706d','#4b4c4a');ctx.beginPath();ctx.moveTo(-5.2,0);ctx.lineTo(5.4,0);ctx.lineTo(4.9,-1.35);ctx.lineTo(1.2,-1.75);ctx.lineTo(-4.6,-1.5);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=.06;ln(ctx,-2,-1.6,-1.2,-.3);ln(ctx,2.6,-1.6,3.2,-.6);ctx.strokeStyle='#5a3b2a';ctx.lineWidth=.09;ln(ctx,-4.4,-1.4,-4.9,-2.3);ln(ctx,4.7,-1.3,5.3,-2.1);ln(ctx,-3.7,-1.45,-3.9,-2.4);
    ctx.translate(0,-1.25);}
  if(SPR.guard3){
    const GG=SPR.guard3,kl=GG.kl;let S,fr;
    if(gd.st==='ally'){if(gd.raise>.02){S=GG.raise;fr=Math.min(S.n-1,Math.round(ease(gd.raise)*(S.n-1)));}else{S=GG.walk;fr=(((gd.walk*S.n)|0)%S.n+S.n)%S.n;}}
    else{S=GG.stand;fr=gd.st==='wake'?Math.min(S.n-1,Math.round((1-gd.kneel)*(S.n-1))):0;}
    const dx=-S.ax*kl,dy=-S.ay*kl,dw=S.fw*kl,dh=S.fh*kl;
    if(gd.st==='lost')ctx.globalAlpha=.85;
    ctx.drawImage(S.img,fr*S.fw,0,S.fw,S.fh,dx,dy,dw,dh);
    if(gd.flash>0&&gd.st!=='lock'){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.3;ctx.drawImage(S.img,fr*S.fw,0,S.fw,S.fh,dx,dy,dw,dh);ctx.globalCompositeOperation='source-over';}
    ctx.globalAlpha=1;
  }else{
  const hipY=-lerp(5.1,2.65,kn),wk=gd.walk*TAU,sL=Math.sin(wk),aG=lg(ctx,-5,0,5,0,M.armorL,M.armor,M.armorD);
  // tubos de escape (detrás)
  ctx.fillStyle=M.steelD;for(const sd of [-1,1]){limb(1.8*sd,hipY-4.9,2.15*sd,hipY-6.9,.32,.36,M.steelD);ctx.fillStyle=M.dark;el(ctx,2.15*sd,hipY-6.95,.36,.16);ctx.fill();}
  // piernas
  const P=(st,kp)=>[lerp(st[0],kp[0],kn),lerp(st[1],kp[1],kn)];
  const legL=[P([-1.5,hipY],[-1.5,hipY]),P([-1.75,-2.6+Math.max(0,sL)*.5],[-2.35,-3.3]),P([-1.85,-Math.max(0,sL)*.6],[-2.1,0])];
  const legR=[P([1.5,hipY],[1.5,hipY]),P([1.75,-2.6+Math.max(0,-sL)*.5],[2.05,-.4]),P([1.85,-Math.max(0,-sL)*.6],[2.55,-.25])];
  for(const L of [legR,legL]){limb(L[0][0],L[0][1],L[1][0],L[1][1],1.0,.82,aG);limb(L[1][0],L[1][1],L[2][0],L[2][1]-.5,.82,.7,M.armorD);
    ctx.fillStyle=lg(ctx,L[1][0]-.8,L[1][1]-.8,L[1][0]+.8,L[1][1]+.8,M.plate,M.plateD);el(ctx,L[1][0],L[1][1],.78,.62);ctx.fill();
    ctx.fillStyle=M.stripe;ctx.fillRect(L[1][0]-.5,L[1][1]-.08,1,.16);
    ctx.fillStyle=M.dark;rr(ctx,L[2][0]-1.05,L[2][1]-.78,2.1,.8,.25);ctx.fill();ctx.fillStyle='rgba(255,255,255,.15)';ctx.fillRect(L[2][0]-.9,L[2][1]-.74,1.4,.1);}
  // pelvis y torso
  ctx.fillStyle=M.dark;rr(ctx,-1.95,hipY-.35,3.9,1.05,.3);ctx.fill();
  ctx.fillStyle=aG;ctx.beginPath();ctx.moveTo(-3.05,hipY-4.85);ctx.quadraticCurveTo(0,hipY-5.4,3.05,hipY-4.85);ctx.lineTo(2.25,hipY-.3);ctx.lineTo(-2.25,hipY-.3);ctx.closePath();ctx.fill();
  ctx.fillStyle=lg(ctx,-2.3,hipY-4.6,2.3,hipY-2,M.plate,M.plateD);ctx.beginPath();ctx.moveTo(-2.35,hipY-4.55);ctx.lineTo(2.35,hipY-4.55);ctx.lineTo(1.65,hipY-2.05);ctx.lineTo(-1.65,hipY-2.05);ctx.closePath();ctx.fill();
  ctx.fillStyle=M.dark;for(let i=0;i<3;i++)rr(ctx,-1.3,hipY-1.75+i*.42,2.6,.2,.08),ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(-2.2,hipY-4.5,4.4,.1);
  ctx.fillStyle=M.plateD;for(const [rx,ry] of [[-2,-4.3],[2,-4.3],[-1.5,-2.3],[1.5,-2.3]]){el(ctx,rx,hipY+ry,.09,.09);ctx.fill();}
  const cg=lit;ctx.fillStyle=rg(ctx,0,hipY-3.3,0,.7,'rgba(230,252,255,'+cg+')','rgba('+M.glow+','+cg+')','rgba('+M.glow+',.15)');el(ctx,0,hipY-3.3,.66,.66);ctx.fill();
  ctx.strokeStyle=M.dark;ctx.lineWidth=.12;ctx.beginPath();ctx.arc(0,hipY-3.3,.7,0,TAU);ctx.stroke();
  if(lit>.4){ctx.globalCompositeOperation='lighter';ctx.fillStyle=rg(ctx,0,hipY-3.3,0,1.8,'rgba('+M.glow+','+(.45*lit)+')','rgba('+M.glow+',0)');el(ctx,0,hipY-3.3,1.8,1.8);ctx.fill();ctx.globalCompositeOperation='source-over';}
  // brazo izquierdo (apoyado en la rodilla o colgando)
  const shL=[-3.55,hipY-4.25],elL=P([-4.35,hipY-2+sL*.3],[-3.95,hipY-2.4]),haL=P([-4.15,hipY+.25+sL*.4],[-2.6,-3.45]);
  limb(shL[0],shL[1],elL[0],elL[1],.78,.66,aG);limb(elL[0],elL[1],haL[0],haL[1],.66,.6,M.armorD);
  ctx.fillStyle=lg(ctx,elL[0]-.6,0,elL[0]+.6,0,M.plate,M.plateD);el(ctx,elL[0],elL[1],.55,.5);ctx.fill();
  ctx.fillStyle=M.dark;rr(ctx,haL[0]-.62,haL[1]-.45,1.24,.95,.3);ctx.fill();
  // brazo derecho + martillo
  const shR=[3.55,hipY-4.25],haR=[lerp(3.5,1.1,hr),lerp(hipY-1.35,hipY-8.3,hr)],elR=[lerp(4.45,3.05,hr),lerp(hipY-2.9,hipY-6.4,hr)];
  const ang=lerp(Math.PI*.47,-Math.PI*.62,hr),Ls=3.6,hx=haR[0]+Math.cos(ang)*Ls,hy=haR[1]+Math.sin(ang)*Ls;
  const drawHammer=()=>{ctx.strokeStyle=M.steelD;ctx.lineCap='round';ctx.lineWidth=.34;ln(ctx,haR[0]-Math.cos(ang)*.6,haR[1]-Math.sin(ang)*.6,hx,hy);
    ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=.08;ln(ctx,haR[0],haR[1],hx,hy);
    ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);
    ctx.fillStyle=lg(ctx,0,-1.3,0,1.3,M.steel,M.armorL,M.steelD);rr(ctx,-.7,-1.3,1.4,2.6,.18);ctx.fill();
    ctx.fillStyle=M.dark;rr(ctx,-.78,-1.42,1.56,.42,.12);ctx.fill();rr(ctx,-.78,1,1.56,.42,.12);ctx.fill();
    ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba('+M.glow+','+(.25+.7*lit)+')';ctx.lineWidth=.1;
    ln(ctx,-.45,-.8,.45,-.8);ln(ctx,-.45,0,.45,0);ln(ctx,-.45,.8,.45,.8);ln(ctx,0,-.8,0,.8);ctx.globalCompositeOperation='source-over';
    ctx.restore();};
  if(hr>.5)drawHammer();
  limb(shR[0],shR[1],elR[0],elR[1],.78,.66,aG);limb(elR[0],elR[1],haR[0],haR[1],.66,.6,M.armorD);
  ctx.fillStyle=lg(ctx,elR[0]-.6,0,elR[0]+.6,0,M.plate,M.plateD);el(ctx,elR[0],elR[1],.55,.5);ctx.fill();
  ctx.fillStyle=M.dark;rr(ctx,haR[0]-.62,haR[1]-.48,1.24,.96,.3);ctx.fill();
  if(hr<=.5)drawHammer();
  // hombreras con franjas de peligro
  for(const sd of [-1,1]){const cx=3.55*sd,cy=hipY-4.55;ctx.save();el(ctx,cx,cy,1.68,1.3);ctx.clip();
    ctx.fillStyle=lg(ctx,cx-1.7,cy-1.3,cx+1.7,cy+1.3,M.armorL,M.armor,M.armorD);ctx.fillRect(cx-2,cy-1.5,4,3);
    ctx.fillStyle=M.stripe;for(let i=-4;i<4;i++){ctx.beginPath();ctx.moveTo(cx+i*.6,cy+.2);ctx.lineTo(cx+i*.6+.3,cy+.2);ctx.lineTo(cx+i*.6+.75,cy+1.4);ctx.lineTo(cx+i*.6+.45,cy+1.4);ctx.closePath();ctx.fill();}
    ctx.fillStyle='rgba(255,255,255,.22)';el(ctx,cx-.5,cy-.6,.8,.35);ctx.fill();ctx.restore();
    ctx.strokeStyle=M.dark;ctx.lineWidth=.1;el(ctx,cx,cy,1.68,1.3);ctx.stroke();}
  // cabeza
  const hy0=hipY-5.6;ctx.fillStyle=M.dark;rr(ctx,-.75,hy0+.2,1.5,.6,.15);ctx.fill();
  ctx.fillStyle=lg(ctx,-1.1,0,1.1,0,M.armorL,M.armor,M.armorD);rr(ctx,-1.05,hy0-.95,2.1,1.55,.38);ctx.fill();
  ctx.fillStyle=M.armorD;tri(ctx,-1.05,hy0-.6,-1.55,hy0-1.3,-1.0,hy0-.1);tri(ctx,1.05,hy0-.6,1.55,hy0-1.3,1.0,hy0-.1);
  ctx.fillStyle='#14171c';rr(ctx,-.82,hy0-.45,1.64,.42,.12);ctx.fill();
  ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba('+M.visor+','+(.25+.75*lit)+')';rr(ctx,-.72,hy0-.38,1.44,.26,.1);ctx.fill();
  if(lit>.4){ctx.fillStyle=rg(ctx,0,hy0-.25,0,1.4,'rgba('+M.visor+','+(.4*lit)+')','rgba('+M.visor+',0)');el(ctx,0,hy0-.25,1.4,.7);ctx.fill();}
  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle='rgba(255,255,255,.22)';ctx.fillRect(-.85,hy0-.88,1.2,.1);
  }
  // cristal de sello
  if(locked||(gd.st==='wake'&&gd.t<.08)){
    if(gd.slab)ctx.translate(0,1.25);
    if(SPR.guard3&&SPR.guard3.cs){const cs=SPR.guard3.cs;ctx.scale(cs,cs);}
    const lost=gd.st==='lost',CP=[[-5.7,.15],[-6.1,-5.6],[-4.3,-10.4],[-.6,-12.5],[3.5,-11.6],[6,-7.3],[6.5,-1.5],[5.5,.15]];
    const path=()=>{ctx.beginPath();ctx.moveTo(CP[0][0],CP[0][1]);for(let i=1;i<CP.length;i++)ctx.lineTo(CP[i][0],CP[i][1]);ctx.closePath();};
    path();ctx.fillStyle=lost?lg(ctx,-6,-12,6,0,'rgba(170,180,190,.35)','rgba(110,120,130,.25)'):lg(ctx,-6,-12,6,0,'rgba(160,235,255,.26)','rgba(90,190,240,.1)','rgba(120,220,255,.2)');ctx.fill();
    ctx.save();path();ctx.clip();
    const sx=((T*2.4)%20)-10;ctx.fillStyle=lg(ctx,sx-1.5,0,sx+1.5,0,'rgba(255,255,255,0)','rgba(255,255,255,'+(lost?.08:.22)+')','rgba(255,255,255,0)');
    ctx.beginPath();ctx.moveTo(sx-2,1);ctx.lineTo(sx+1,1);ctx.lineTo(sx+5,-13);ctx.lineTo(sx+2,-13);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(220,250,255,'+(lost?.15:.3)+')';ctx.lineWidth=.06;for(const p of CP)ln(ctx,.2,-6.2,p[0],p[1]);
    const frac=1-gd.hp/gd.max;ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=.07;
    for(const c of gd.cracks){if(c.th>frac)continue;ctx.beginPath();ctx.moveTo(c.pts[0][0],c.pts[0][1]);for(let i=1;i<c.pts.length;i++)ctx.lineTo(c.pts[i][0],c.pts[i][1]);ctx.stroke();}
    if(gd.flash>0){ctx.fillStyle='rgba(220,250,255,.25)';ctx.fillRect(-7,-13,14,14);}
    ctx.restore();
    path();ctx.strokeStyle=lost?'rgba(200,210,220,.4)':'rgba(215,250,255,.85)';ctx.lineWidth=.1;ctx.stroke();
    if(!lost){ctx.globalCompositeOperation='lighter';ctx.lineWidth=.35;ctx.strokeStyle='rgba(120,220,255,'+(.12+.06*Math.sin(T*3))+')';ctx.stroke();ctx.globalCompositeOperation='source-over';}
  }
  ctx.restore();
}
const DL=[];
function drawEntities(){
  DL.length=0;const zMin=cam.z+.8,zMax=cam.z+175;
  for(const l of SCN.lamps)if(l.z>zMin&&l.z<zMax)DL.push(l);
  for(const o of SCN.props)if(o.z>zMin+1&&o.z<zMax-40)DL.push(o);
  for(const gy of SCN.gantries)if(gy.z>zMin+2&&gy.z<zMax)DL.push(gy);
  if(G){
    for(const g of G.gates)if(g.z>zMin&&g.z<zMax&&!(g.used&&g.ft>.6))DL.push(g);
    for(const c of G.crates)if(c.z>zMin&&c.z<zMax&&!(c.dead&&c.ft>.35))DL.push(c);
    for(const z of G.zombies)if(z.z>zMin&&z.z<zMax)DL.push(z);
    for(const s of G.soldiers)DL.push(s);
    for(const c of G.corpses)if(c.z>zMin)DL.push(c);
    if(G.boss.z<zMax+40)DL.push(G.boss);
    if(G.guard&&G.guard.z>zMin&&G.guard.z<zMax)DL.push(G.guard);
  }
  DL.sort((a,b)=>b.sz-a.sz);
  if(G)G.flashes.length=0;
  // niebla entre lo lejano y lo cercano: tapa lo que aparece en el horizonte sin velar a los gigantes cercanos
  let fogDone=false;const fz=cam.z+FOG_Z;
  for(const e of DL){if(!fogDone&&e.sz<fz){drawFog();fogDone=true;}switch(e.kd){case 1:drawSoldier(e);break;case 2:drawZombie(e);break;case 3:drawGate(e);break;case 4:drawCrate(e);break;case 5:drawLamp(e);break;case 6:drawBoss(e);break;case 7:drawCorpse(e);break;case 8:drawGuardian(e);break;case 9:drawGantry(e);break;case 10:drawProp(e);break;}}
  if(!fogDone)drawFog();
}
const FOG_Z=38;
const BB=[];
function drawBullets(){
  const B=G.bullets,wm=1+.06*(G.wl-1);
  ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
  BB.length=0;
  for(const b of B){if(!proj(b.x,.8,b.z))continue;const hx=PJ.x,hy=PJ.y,s=PJ.s,dx=b.vx/BV;
    if(!proj(b.x-dx*.9,.8,b.z-.9))continue;const mx=PJ.x,my=PJ.y;
    if(!proj(b.x-dx*2.8,.8,b.z-2.8))continue;BB.push(hx,hy,mx,my,PJ.x,PJ.y,s<12?0:s<22?1:s<34?2:3);}
  const widths=[.7,1.05,1.5,2];
  for(let pass=0;pass<3;pass++)for(let k=0;k<4;k++){
    ctx.beginPath();let any=false;
    for(let i=0;i<BB.length;i+=7)if(BB[i+6]===k){
      if(pass===0){ctx.moveTo(BB[i],BB[i+1]);ctx.lineTo(BB[i+4],BB[i+5]);}
      else if(pass===1){ctx.moveTo(BB[i+2],BB[i+3]);ctx.lineTo(BB[i+4],BB[i+5]);}
      else{ctx.moveTo(BB[i],BB[i+1]);ctx.lineTo(BB[i+2],BB[i+3]);}any=true;}
    if(!any)continue;
    if(pass===0){ctx.strokeStyle='rgba(255,150,50,.14)';ctx.lineWidth=widths[k]*3.4*wm;}
    else if(pass===1){ctx.strokeStyle='rgba(255,190,105,.38)';ctx.lineWidth=widths[k]*.75*wm;}
    else{ctx.strokeStyle='rgba(255,246,218,.96)';ctx.lineWidth=widths[k]*wm;}
    ctx.stroke();}
  const Fl=G.flashes;
  for(let i=0;i<Fl.length;i+=3){const r=Fl[i+2]*.42;ctx.drawImage(SPR.flash,Fl[i]-r,Fl[i+1]-r*1.2,r*2,r*2);}
  ctx.globalCompositeOperation='source-over';
}
function drawParts(){
  for(const p of G.parts){if(!proj(p.x,p.y,p.z))continue;const a=Math.max(0,p.l/p.m),r=Math.max(.8,p.sz*PJ.s);
    if(p.t===0){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba('+p.c+','+a+')';ctx.fillRect(PJ.x-r,PJ.y-r,r*2,r*2);ctx.globalCompositeOperation='source-over';}
    else if(p.t===1){ctx.fillStyle='rgba('+p.c+','+(a*.35)+')';ctx.beginPath();ctx.arc(PJ.x,PJ.y,r,0,TAU);ctx.fill();}
    else if(p.t===3){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba('+p.c+','+a+')';ctx.beginPath();ctx.moveTo(PJ.x,PJ.y-r*1.6);ctx.lineTo(PJ.x+r,PJ.y);ctx.lineTo(PJ.x,PJ.y+r*1.2);ctx.lineTo(PJ.x-r*.8,PJ.y);ctx.closePath();ctx.fill();ctx.globalCompositeOperation='source-over';}
    else{ctx.fillStyle='rgba('+p.c+','+a+')';ctx.fillRect(PJ.x-r,PJ.y-r,r*2,r*1.4);}}
}
function drawSlashWall(){
  const s=G.slash;if(!s)return;const z=s.front;
  ctx.globalCompositeOperation='lighter';
  if(vq(-RAIL,0,RAIL,3.4,z)){const g=ctx.createLinearGradient(0,Q[1],0,Q[7]);g.addColorStop(0,'rgba(150,240,255,.7)');g.addColorStop(1,'rgba(150,240,255,0)');ctx.fillStyle=g;ctx.fill();}
  if(proj(0,1.6,z)){const r=PJ.s*RAIL*1.05;ctx.strokeStyle='rgba(230,255,255,.9)';ctx.lineWidth=Math.max(2,PJ.s*.18);ctx.beginPath();ctx.ellipse(PJ.x,PJ.y,r,r*.28,0,Math.PI*1.05,Math.PI*1.95);ctx.stroke();
    ctx.strokeStyle='rgba(90,210,255,.45)';ctx.lineWidth=Math.max(5,PJ.s*.55);ctx.stroke();}
  ctx.globalCompositeOperation='source-over';
}
function drawFog(){
  const f=SCN.pal.fog,g=ctx.createLinearGradient(0,HORY-2,0,HORY+H*.24);
  g.addColorStop(0,'rgba('+f+',1)');g.addColorStop(.4,'rgba('+f+',.5)');g.addColorStop(1,'rgba('+f+',0)');
  ctx.fillStyle=g;ctx.fillRect(0,HORY-2,W,H*.24+2);
}
function drawWorldUI(){
  if(G.demo)return;
  const b=G.boss,sq=G.squad,gd=G.guard;
  if(gd&&(gd.st==='sleep'||gd.st==='lock')&&gd.z-cam.z<150&&proj(gd.x+1.2,(12.9+1.4)*GUARD_K+1.25,gd.z)){
    const fs=clamp(PJ.s*1.9,20,52);ctx.font=(Math.max(11,fs*.3)|0)+'px '+FONT;const lw=ctx.measureText('¡DISPARA DESDE LA IZQUIERDA!').width;
    const x=Math.max(PJ.x,fs*1.6+8,lw/2+10),y=clamp(PJ.y,Math.max(HORY,92)+fs*1.1,H*.45);
    otext(String(Math.max(0,Math.ceil(gd.hp))),x,y,fs,'#ffffff','#0f2533',.16);
    otext('GUARDIÁN',x,y-fs*.95,fs*.36,'#aef2ff','#0f2533',.25);
    if(gd.st==='lock'){const k=clamp((gd.z-GUARD_PASS-sq.z)/(GUARD_LOCK-GUARD_PASS),0,1),bw=fs*2.6;
      ctx.fillStyle='rgba(0,0,0,.55)';rr(ctx,x-bw/2,y+fs*.62,bw,7,3.5);ctx.fill();ctx.fillStyle='#6ee6ff';rr(ctx,x-bw/2+1,y+fs*.62+1,(bw-2)*k,5,2.5);ctx.fill();
      if(Math.sin(T*6)>-.3)otext('¡DISPARA DESDE LA IZQUIERDA!',x,y+fs*.62+20,Math.max(11,fs*.3),'#ffffff','#0f2533',.28);}}
  if((b.st==='idle'||b.st==='fight')&&b.z-cam.z<170&&proj(b.x,5.3*BOSS_K,b.z-1)){
    const fs=clamp(PJ.s*2.4,22,64);otext(String(Math.max(0,Math.ceil(b.hp))),PJ.x,Math.max(PJ.y,HORY*.5+fs*.6,110),fs,'#fff','#141821',.15);}
  if(!G.demo&&G.soldiers.length){const n=G.soldiers.length,rad=formRad(n);
    if(proj(sq.x,1.75,sq.z+rad*.8+.4)){const fs=clamp(PJ.s*.75,16,30),t=String(n);ctx.font=(fs|0)+'px '+FONT;const tw=ctx.measureText(t).width+fs*1.5;
      ctx.fillStyle=lg(ctx,0,PJ.y-fs*.62,0,PJ.y+fs*.62,'rgba(60,150,255,.96)','rgba(22,92,210,.96)');rr(ctx,PJ.x-tw/2,PJ.y-fs*.62,tw,fs*1.24,fs*.4);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=2;ctx.stroke();
      personIcon(PJ.x-tw/2+fs*.5,PJ.y+fs*.14,fs*.62,'#fff');otext(t,PJ.x+fs*.22,PJ.y+1,fs,'#fff','#0d2a55',.12);}}
  for(const t of G.texts){if(!proj(t.x,t.y,t.z))continue;ctx.globalAlpha=Math.max(0,1-t.t/t.l);otext(t.txt,PJ.x,PJ.y,clamp(PJ.s*.9*t.sz,16,44),t.col);}
  ctx.globalAlpha=1;
  if(G.banner>0&&!G.demo){const a=Math.min(1,G.banner/.5,(2.6-G.banner)/.3);ctx.globalAlpha=Math.max(0,a);
    otext('NIVEL '+G.lv,W/2,H*.36,Math.min(56,W*.13),'#fff');otext(SCN.pal.name,W/2,H*.36+Math.min(44,W*.1),Math.min(22,W*.055),'#bfe8ff');ctx.globalAlpha=1;}
  if(G.banner2){const bn=G.banner2,a=Math.min(1,bn.t/.4,(2.4-bn.t)/.25);ctx.globalAlpha=Math.max(0,a);
    otext(bn.txt,W/2,H*.32,Math.min(40,W*.085),bn.col);if(bn.sub)otext(bn.sub,W/2,H*.32+Math.min(36,W*.08),Math.min(18,W*.045),'#ffffff');ctx.globalAlpha=1;}
}
function render(){
  ctx.setTransform(DPR,0,0,DPR,0,0);
  shX=shake>0?(Math.random()-.5)*shake*16:0;shY=shake>0?(Math.random()-.5)*shake*16:0;
  drawBackdrop();drawRoad();
  if(G&&!G.demo)drawGroundFx();
  drawEntities();
  if(SCN.pal.night){ctx.fillStyle='rgba(4,8,24,.2)';ctx.fillRect(0,0,W,H);}
  if(G){if(!G.demo){drawBullets();drawSlashWall();}drawParts();}
  if(VIG)ctx.drawImage(VIG,0,0,W,H);
  if(G)drawWorldUI();
  if(G&&G.flashScr>0){ctx.fillStyle='rgba(200,245,255,'+(G.flashScr*2)+')';ctx.fillRect(0,0,W,H);}
}

/* ============================================================
   HUD y pantallas
   ============================================================ */
const hud={root:$('hud'),lv:$('lvText'),pf:$('progFill'),coin:$('coinText'),slash:$('bSlash'),boss:$('bossBar'),bf:$('bossFill'),weap:$('weapText'),weapDot:document.querySelector('#weap i'),hint:$('hint')};
let hc={};
function setTxt(e,k,v){if(hc[k]!==v){hc[k]=v;e.textContent=v;}}
function hudTick(){
  if(!G||G.demo)return;
  setTxt(hud.lv,'lv','NIVEL '+G.lv);
  const pr=clamp(G.squad.z/(G.L-22),0,1),pk=(pr*300)|0;if(hc.pr!==pk){hc.pr=pk;hud.pf.style.width=(pr*100).toFixed(1)+'%';}
  setTxt(hud.coin,'coin',String(save.coins+G.coins));
  const m=Math.round(G.meter*100);if(hc.m!==m){hc.m=m;hud.slash.style.setProperty('--p',m+'%');hud.slash.classList.toggle('ready',m>=100);}
  const b=G.boss,sb=b.z-G.squad.z<80&&b.st!=='dead'&&b.st!=='dying';if(hc.sb!==sb){hc.sb=sb;hud.boss.classList.toggle('hidden',!sb);}
  if(sb){const f=Math.max(0,b.hp/b.max),k=(f*400)|0;if(hc.bf!==k){hc.bf=k;hud.bf.style.width=(f*100)+'%';}}
  if(hc.wl!==G.wl){hc.wl=G.wl;hud.weap.textContent='ARMA NV '+G.wl;const c='rgb('+WCOL[G.wl-1]+')';hud.weapDot.style.background=c;hud.weapDot.style.boxShadow='0 0 10px '+c;}
  const hv=!moved&&G.time<7;if(hc.hv!==hv){hc.hv=hv;hud.hint.style.opacity=hv?'1':'0';}
}
const screens=['menu','howScr','pauseScr','endScr'];// loadScr se maneja aparte
function show(id){for(const s of screens)$(s).classList.toggle('hidden',s!==id);}
function mkEl(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}
function renderShop(){
  const list=$('shopList');list.replaceChildren();
  for(const u of UPG){const lv=save.up[u.id],mx=lv>=u.max,c=cost(u,lv);
    const row=mkEl('div','upg'),ic=mkEl('div','ic',u.icon),tx=mkEl('div','tx');tx.append(mkEl('b',null,u.name+' · Nv '+lv),mkEl('span',null,u.desc));
    const bt=mkEl('button','buy');bt.type='button';
    if(mx){bt.textContent='MÁX';bt.disabled=true;}else{bt.append(mkEl('i','coin'),document.createTextNode(String(c)));bt.disabled=save.coins<c;}
    bt.addEventListener('click',()=>{const l=save.up[u.id];if(l>=u.max)return;const k=cost(u,l);if(save.coins<k)return;save.coins-=k;save.up[u.id]=l+1;persist();initAudio();sfx.crate();renderShop();});
    row.append(ic,tx,bt);list.append(row);}
  $('shopCoins').textContent=String(save.coins);$('mLv').textContent=String(save.level);
  $('bSound').textContent='Sonido: '+(save.muted?'No':'Sí');
}
function toMenu(){state='menu';newRun(save.level,true);hud.root.classList.add('hidden');renderShop();show('menu');}
function startGame(){initAudio();sfx.click();newRun(save.level,false);hc={};moved=false;state='play';show(null);hud.root.classList.remove('hidden');perf.reset();}
function pause(){if(state!=='play')return;state='pause';show('pauseScr');}
function resume(){if(state!=='pause')return;state='play';show(null);last=performance.now();}
function showEnd(){
  state='end';const win=G.phase==='win',surv=G.soldiers.length,gf=G.guard&&G.guard.st==='ally';
  let earned=G.coins;if(win)earned+=25+surv*2+G.lv*10;
  save.coins+=earned;if(win){save.level=G.lv+1;save.best=Math.max(save.best,save.level);}persist();
  $('eTitle').textContent=win?'¡PUENTE DESPEJADO!':'LA HORDA TE ALCANZÓ';
  $('eSub').textContent=win?'Nivel '+G.lv+' completado':'Nivel '+G.lv+' · mejora tu escuadrón y vuelve';
  const st=$('eStats');st.replaceChildren();
  for(const [k,v] of [['Zombis eliminados',G.kills],['Soldados en pie',surv],['Guardián',gf?'Liberado':'Perdido'],['Monedas ganadas','+'+earned]]){const r=mkEl('div');r.append(mkEl('span',null,k),mkEl('b',null,String(v)));st.append(r);}
  $('bNext').textContent=win?'SIGUIENTE · NIVEL '+save.level:'REINTENTAR';
  $('bNext').classList.toggle('red',!win);
  hud.root.classList.add('hidden');show('endScr');
}
$('bPlay').addEventListener('click',startGame);
$('bNext').addEventListener('click',startGame);
$('bToMenu').addEventListener('click',()=>{sfx.click();toMenu();});
$('bPause').addEventListener('click',()=>{sfx.click();pause();});
$('bResume').addEventListener('click',()=>{sfx.click();resume();});
$('bQuit').addEventListener('click',()=>{if(G&&!G.demo&&G.coins>0){save.coins+=G.coins;persist();}sfx.click();toMenu();});
$('bSlash').addEventListener('click',()=>{initAudio();doSlash();});
$('bSound').addEventListener('click',()=>{save.muted=!save.muted;persist();initAudio();if(!save.muted)sfx.click();renderShop();});
$('bHow').addEventListener('click',()=>{sfx.click();show('howScr');});
$('bHowBack').addEventListener('click',()=>{sfx.click();show('menu');});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')pause();});
addEventListener('resize',resize);

/* ---------- Bucle principal + calidad adaptativa ---------- */
const perf={acc:0,n:0,checked:false,reset(){this.acc=0;this.n=0;this.checked=false;}};
let last=performance.now();
function frame(t){
  const raw=(t-last)/1000;last=t;const dt=Math.min(.05,Math.max(0,raw));T+=dt;
  if(!READY){ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#0e1622';ctx.fillRect(0,0,W,H);requestAnimationFrame(frame);return;}
  if(G&&(state==='play'||state==='end'||state==='menu'))update(dt);
  render();hudTick();
  if(state==='play'&&!perf.checked){perf.acc+=raw;perf.n++;if(perf.n>=150){perf.checked=true;if(perf.acc/perf.n>.026&&quality>.7){quality=.72;resize();}}}
  requestAnimationFrame(frame);
}

/* ---------- Arranque ---------- */
let READY=false;
function setLoad(p,txt){const b=$('loadFill');if(b)b.style.width=Math.round(p*100)+'%';if(txt){const t=$('loadTxt');if(t)t.textContent=txt;}}
function build3D(done){
  if(location.hash==='#2d'||typeof THREE==='undefined'||typeof Chars3D!=='function'){done(false);return;}
  const skipSol=bakedSet('sol').length>0,skipZom=bakedSet('zom').length>0,skipBru=bakedSet('bru').length>0,skipTitan=!!BSPR.titan_walk,skipGuard=!!BSPR.guard_walk;
  if(allBaked()){done(false);return;}
  let C;try{C=Chars3D(THREE,{mk,silhouette,NF,skipSol,skipZom,skipBru,skipTitan,skipGuard});C.init();}catch(e){done(false);return;}
  let st;try{st=C.steps();}catch(e){C.dispose();done(false);return;}
  const list=st.list;let i=0;
  const names=(skipSol?[]:['soldados','soldados','soldados']).concat(skipZom?[]:['zombis','zombis','zombis','zombis','zombis','zombis'],skipBru?[]:['brutos','brutos'],skipTitan?[]:['al Titán'],skipGuard?[]:['al Guardián']);
  if(!list.length){C.dispose();try{apply3D(st.out);done(true);}catch(e){done(false);}return;}
  const step=()=>{try{list[i]();}catch(e){C.dispose();done(false);return;}i++;setLoad(i/list.length,i<list.length?'Modelando '+(names[i]||'personajes')+'…':'¡Listo!');
    if(i<list.length)setTimeout(step,0);else{C.dispose();try{apply3D(st.out);done(true);}catch(e){done(false);}}};
  setLoad(0,'Modelando '+names[0]+'…');setTimeout(step,60);
}
function boot(){
  loadSave();resize();buildFlash();buildProps();buildSigns();
  loadBaked(()=>build3D(ok=>{if(!ok)buildSprites();applyBaked();READY=true;$('loadScr').classList.add('hidden');toMenu();}));
}
boot();
if(document.fonts&&document.fonts.load){document.fonts.load('20px "Russo One"').catch(()=>{});}
requestAnimationFrame(t=>{last=t;requestAnimationFrame(frame);});
// TEST-HOOK-START
window.__BP={get G(){return G;},get state(){return state;},get ready(){return READY;},get mode(){return SPR.mode;},save,update,startGame,newRun,setState:s=>{state=s;}};
// TEST-HOOK-END
})();
