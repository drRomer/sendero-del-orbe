/* ---------- Utilería medieval (pixel art por código) ---------- */
let S8=null;
function pxProp(w,h,fn,wu,hu,shadow){const o=S8.P(w,h);fn(o);const c=S8.finish(o,shadow);return {img:c,w:wu,h:hu};}
const PROPS={};
function buildProps(){
  S8=Sprites8(mk);const C=S8.C;
  const pine=(L,M,D,tr)=>pxProp(22,44,o=>{o.r(9,36,4,8,tr);o.r(9,36,1,8,'#3a2414');
    for(let i=0;i<4;i++){const y=4+i*8,hw=4+i*2.6;for(let r=0;r<10;r++){const w=Math.round(hw*(r/10)+1);o.r(11-w,y+r,w*2,1,r<3?L:r<7?M:D);}}
    o.p(11,2,L);o.p(10,3,L);o.p(11,3,M);},3,6);
  const oak=(L,M,D)=>pxProp(34,38,o=>{o.r(14,22,6,16,C.wood);o.r(14,22,2,16,C.woodL);o.r(18,22,2,16,C.woodD);o.l(17,28,10,22,C.woodD);o.l(17,26,24,20,C.woodD);
    o.e(17,13,15,11,D);o.e(15,11,12,9,M);o.e(11,8,5,4,L);o.e(22,9,4,3,L);o.e(8,16,5,4,M);o.e(27,16,5,4,M);},4.6,5.2);
  const dead=()=>pxProp(22,34,o=>{o.r(9,12,4,22,'#6a5a4a');o.r(9,12,1,22,'#8a7a66');o.l(11,16,3,8,'#5a4a3c');o.l(3,8,1,3,'#5a4a3c');o.l(11,13,18,5,'#5a4a3c');o.l(18,5,20,1,'#5a4a3c');o.l(12,20,19,15,'#5a4a3c');o.l(10,24,4,19,'#5a4a3c');},2.6,4.2);
  const bush=(M,D,L)=>pxProp(16,9,o=>{o.e(8,5,7,4,D);o.e(7,4,5,3,M);o.e(5,3,2,1.5,L);o.p(11,4,'#e8506a');o.p(4,6,'#e8506a');},1.7,1);
  const rock=()=>pxProp(14,9,o=>{o.e(7,5,6,4,'#7d7a74');o.e(6,4,4,2.5,'#9d9a92');o.p(4,3,'#c8c4ba');o.r(9,6,3,1,'#5a5852');},1.3,.85);
  const barrel=()=>pxProp(9,11,o=>{o.r(1,0,7,11,C.wood);o.r(0,2,9,7,C.wood);o.r(1,0,7,1,C.woodL);o.r(0,2,9,1,'#4a4a52');o.r(0,8,9,1,'#4a4a52');o.r(6,1,1,9,C.woodD);o.r(2,1,1,9,C.woodL);},.85,1.05);
  const cart=()=>pxProp(28,18,o=>{o.r(3,6,20,6,C.wood);o.r(3,6,20,1,C.woodL);o.r(3,11,20,1,C.woodD);for(let x=5;x<22;x+=4)o.r(x,6,1,6,C.woodD);
    o.e(12,4,8,3,'#d8b84a');o.e(11,3,5,2,'#f0d870');o.l(23,9,27,7,C.woodD);
    for(const wx of [7,19]){o.e(wx,14,3.5,3.5,'#4a3424');o.e(wx,14,2,2,C.woodL);o.p(wx,14,'#2a1a10');}},2.6,1.7);
  const tent=(a,b)=>pxProp(26,24,o=>{for(let y=0;y<20;y++){const hw=Math.round(1+y*.62);for(let x=-hw;x<=hw;x++)o.p(13+x,4+y,((x+40)>>1)%2?a:b);}
    o.r(11,17,5,7,'#2a1a14');o.l(13,0,13,4,C.woodD);o.r(14,0,4,2,'#ffd04a');},2.4,2.6);
  const fence=()=>pxProp(18,10,o=>{o.r(1,1,2,9,C.wood);o.r(15,1,2,9,C.wood);o.r(0,3,18,2,C.woodL);o.r(0,6,18,2,C.wood);o.r(1,1,2,1,C.woodL);o.r(15,1,2,1,C.woodL);},1.8,1);
  const banner=(col,colD)=>pxProp(10,36,o=>{o.r(1,2,2,34,C.woodD);o.p(1,1,C.gold);o.p(2,1,C.gold);o.r(3,4,7,14,col);o.r(3,17,7,1,colD);o.p(4,18,colD);o.p(8,18,colD);o.r(5,8,3,3,C.gold);o.p(6,7,C.gold);},.9,3.4);
  const pillar=()=>pxProp(10,18,o=>{o.r(1,15,8,3,'#8a8680');o.r(2,4,6,11,'#b4aea4');o.r(2,4,1,11,'#d4cec4');o.r(7,4,1,11,'#8a8680');o.r(1,2,8,2,'#a8a298');o.r(2,1,3,1,'#a8a298');o.l(4,6,6,10,'#7a766e');o.r(3,12,3,2,'#5f8f3a');},1,1.8);
  const shroom=()=>pxProp(12,9,o=>{for(const [x,y,r] of [[3,5,2.5],[8,4,3],[6,7,1.8]]){o.r(x-.5,y,1,9-y,'#e8dcc8');o.e(x,y,r,r*.7,'#3ae0ff');o.p(x-1,y-1,'#c8fbff');}},.9,.7);
  PROPS.pines=[pine('#5fb04a','#3f8a3a','#2a6a30','#5a3a22'),pine('#4f9a5a','#2f7a48','#1f5a3a','#4a3020')];
  PROPS.oaks=[oak('#7fd04e','#4fa83c','#2f7a30'),oak('#a8c84a','#7a9e34','#556f26')];
  PROPS.dead=dead();PROPS.bush=[bush('#3f9c3c','#256128','#7fd04e'),bush('#5a8a3a','#3a5e28','#8ab84e')];PROPS.rock=rock();PROPS.barrel=barrel();PROPS.cart=cart();
  PROPS.tents=[tent('#d8333f','#f6f3ea'),tent('#3f5fd0','#f6f3ea')];PROPS.fence=fence();PROPS.banners=[banner('#c8283a','#7e1426'),banner('#3a5ac8','#22327e')];PROPS.pillar=pillar();PROPS.shroom=shroom();
}
// pendones de los arcos (tela con texto pixelado)
function signCanvas(txt,col,colD){const w=Math.max(40,txt.length*6+8),c=mk(w,16),g=c.getContext('2d');
  g.fillStyle=colD;g.fillRect(0,0,w,16);g.fillStyle=col;g.fillRect(1,1,w-2,14);g.fillStyle='#ffd04a';g.fillRect(1,1,w-2,1);g.fillRect(1,14,w-2,1);
  ptextG(g,txt,w/2,8,1,'#fff6d8','#3a1018');return c;}
const SIGNS=[];
function buildSigns(){for(const [t,a,b] of [['CAMINO REAL','#b0283a','#5a1020'],['BOSQUE VIEJO','#2f7a3a','#183e1e'],['AL CASTILLO','#3a5ac8','#1c2c6a'],['¡ADELANTE!','#b0283a','#5a1020'],['TIERRA DE ORCOS','#6a4a2a','#3a2614']])SIGNS.push(signCanvas(t,a,b));}

/* ============================================================
   AMBIENTES (paletas planas estilo 8-bit)
   ============================================================ */
const PALS=[
  {name:'BOSQUE VIEJO',sky:['#3f7fd8','#5d9be8','#86b8f0','#b8d8f8'],sun:['#fff6c8','#fffbe6'],sunX:.74,sunY:.32,sunR:7,moon:0,stars:0,clouds:6,cloud:'#f4f8ff',cloudD:'#c8dcf4',
   mnt:['#8aa8d0','#6a8ab8'],castle:'#4a5f8a',castleL:'#6a7fa8',win:null,tree:'#2e6a3a',treeL:'#3f8a46',fog:'200,224,240',
   grass:['#4f9a3a','#468e34'],verge:['#5aa844','#52a03e'],road:['#a47c4e','#987246'],edge:['#bab2a2','#857e70'],rut:'#7e5e3a',fence:'#6b4a2e',night:0,en:{n:[0,1,2],r:[3],h:[0]},stone:['#9a958a','#c4beb0','#6a665e'],roof:'#b0283a'},
  {name:'OCASO DORADO',sky:['#2a2350','#6a3a6e','#c45a5a','#f2a05a'],sun:['#ffd27a','#fff0b8'],sunX:.28,sunY:.78,sunR:12,moon:0,stars:0,clouds:5,cloud:'#f0a07a',cloudD:'#c46a6a',
   mnt:['#8a5470','#64385a'],castle:'#3a2440',castleL:'#5a3a5a',win:'#ffc85a',tree:'#3a3a2a',treeL:'#4e4a34',fog:'240,170,120',
   grass:['#6e8c3c','#648234'],verge:['#7e9c46','#76943e'],road:['#a06e4c','#946444'],edge:['#ccae94','#8e7462'],rut:'#7a4e34',fence:'#5a3a24',night:0,en:{n:[0,1,2,2],r:[4],h:[1,0]},stone:['#a08070','#c8a890','#6a5048'],roof:'#7a2a5a'},
  {name:'NOCHE DE LUNA',sky:['#060a1e','#0e1636','#1a2652','#2a3a6a'],sun:['#e8ecff','#ffffff'],sunX:.8,sunY:.26,sunR:6,moon:1,stars:1,clouds:3,cloud:'#3a4a7a',cloudD:'#2a3660',
   mnt:['#24305a','#182244'],castle:'#0e1430',castleL:'#1e2650',win:'#ffd27a',tree:'#0e2a24',treeL:'#16382e',fog:'30,40,80',
   grass:['#1f4c3a','#1b4434'],verge:['#245642','#204e3c'],road:['#3c3a48','#363442'],edge:['#5e5c6c','#34343e'],rut:'#2a2834',fence:'#3a2a22',night:1,en:{n:[6,6,6,1],r:[3,4],h:[0]},stone:['#4a4c66','#62647e','#2e3046'],roof:'#2a3a7a'},
  {name:'TIERRAS MALDITAS',sky:['#2a0e2a','#4a1638','#7a2440','#a83a3a'],sun:['#ff6a4a','#ffb08a'],sunX:.66,sunY:.3,sunR:8,moon:1,stars:1,clouds:4,cloud:'#5a1a34',cloudD:'#3a1028',
   mnt:['#3e1c34','#2c1226'],castle:'#1e0c1c',castleL:'#341830',win:'#ff6a3a',tree:'#2a1a24',treeL:'#3a2430',fog:'120,50,70',
   grass:['#4c3c4a','#443444'],verge:['#564252','#4e3c4c'],road:['#463028','#3e2a24'],edge:['#6e5e5a','#3e3432'],rut:'#2e201c',fence:'#2a1c18',night:.5,en:{n:[2,6,0],r:[7],h:[1]},stone:['#4a3838','#665050','#2c2020'],roof:'#5a1018'}
];
let SCN=null,SKYC=null,VIG=null,CLOUDC=null;
const BOSSN=['TROLL DEL BOSQUE','DRAGÓN DEL OCASO','EL NIGROMANTE','DEMONIO DEL ABISMO'];
const BOSSC=[['170,120,60','240,210,150'],['255,110,40','255,210,110'],['90,230,120','200,255,200'],['255,60,30','255,200,100']];
// cielo en franjas con transición tramada
function buildSky(){
  const p=SCN.pal,w=Math.ceil(W*1.25)+4,h=Math.max(4,Math.ceil(HORY+6)),c=mk(w,h),g=c.getContext('2d');
  const n=p.sky.length,bh=h/n;
  for(let i=0;i<n;i++){g.fillStyle=p.sky[i];g.fillRect(0,Math.floor(i*bh),w,Math.ceil(bh)+1);
    if(i<n-1){g.fillStyle=p.sky[i+1];const y0=Math.floor((i+1)*bh)-3;for(let y=0;y<3;y++)for(let x=(y%2);x<w;x+=2)if(y===2||((x>>1)+y)%2===0)g.fillRect(x,y0+y,1,1);}}
  const R=mulberry32(SCN.seed||7);
  if(p.stars){for(let i=0;i<w*h/90;i++){g.fillStyle=R()<.2?'#ffffff':'#9aa8d8';g.fillRect((R()*w)|0,(R()*h*.8)|0,1,1);}}
  const sx=Math.round(w*p.sunX),sy=Math.round(h*p.sunY),r=p.sunR;
  g.fillStyle=p.sun[0];for(let y=-r-2;y<=r+2;y++){const dx=Math.round(Math.sqrt(Math.max(0,(r+2)*(r+2)-y*y)));if(((y+100)%2)===0)g.fillRect(sx-dx,sy+y,dx*2,1);}
  g.fillStyle=p.sun[1];for(let y=-r;y<=r;y++){const dx=Math.round(Math.sqrt(Math.max(0,r*r-y*y)));g.fillRect(sx-dx,sy+y,dx*2,1);}
  if(p.moon){g.fillStyle=p.sky[1];g.fillRect(sx+2,sy-2,2,2);g.fillRect(sx-3,sy+1,2,2);g.fillRect(sx+1,sy+3,1,1);}
  const cc=mk(w,h),cg=cc.getContext('2d');
  for(let i=0;i<p.clouds;i++){const cx=R()*w,cy=h*(.15+R()*.55),cw=10+R()*22;
    for(let j=0;j<4;j++){const bx=cx+(j-1.5)*cw*.32,br=cw*(.22+R()*.12);cg.fillStyle=p.cloudD;cg.fillRect(Math.round(bx-br),Math.round(cy-br*.35+1),Math.round(br*2),Math.round(br*.7));
      cg.fillStyle=p.cloud;cg.fillRect(Math.round(bx-br+1),Math.round(cy-br*.45),Math.round(br*2-2),Math.round(br*.6));}}
  CLOUDC=cc;
  SKYC=c;
}
// capa lejana: montañas, castillo y bosque
function buildBack(){
  const p=SCN.pal,sw=Math.ceil(Math.max(W*1.6,320)),sh=Math.max(24,Math.round(sw*.2)),c=mk(sw,sh),g=c.getContext('2d'),R=mulberry32((SCN.seed||7)*3+1);
  const ridge=(col,base,amp,f1,f2)=>{g.fillStyle=col;const ph=R()*100;for(let x=0;x<sw;x++){let y=base-amp*(Math.abs(Math.sin(x*f1+ph))*.7+Math.abs(Math.sin(x*f2+ph*2))*.3);y=Math.round(y);g.fillRect(x,y,1,sh-y);}};
  ridge(p.mnt[0],sh*.62,sh*.5,.021,.07);
  // castillo en una colina
  const cx=Math.round(sw*(.3+R()*.4)),cb=Math.round(sh*.62);
  g.fillStyle=p.mnt[1];for(let x=-40;x<=40;x++){const y=Math.round(cb-14*Math.cos(x/40*1.57));g.fillRect(cx+x,y,1,sh-y);}
  g.fillStyle=p.castle;const wy=cb-20;g.fillRect(cx-18,wy,36,12);for(let x=-18;x<18;x+=4)g.fillRect(cx+x,wy-2,2,2);
  for(const [tx,tw,th] of [[-20,7,22],[13,7,22],[-5,10,30]]){g.fillRect(cx+tx,cb-th,tw,th-8);g.fillStyle=p.castleL;g.fillRect(cx+tx,cb-th,1,th-8);g.fillStyle=p.castle;
    for(let k=0;k<Math.ceil(tw/2)+1;k++){const hw=Math.max(0,Math.ceil(tw/2)-k+1);g.fillRect(cx+tx+tw/2-hw,cb-th-k,hw*2,1);}
    if(p.win){g.fillStyle=p.win;g.fillRect(cx+tx+Math.floor(tw/2),cb-th+5,1,2);g.fillStyle=p.castle;}}
  g.fillRect(cx-1,cb-30-Math.ceil(10/2)-6,1,6);g.fillStyle='#d8333f';g.fillRect(cx,cb-30-Math.ceil(10/2)-6,3,2);
  ridge(p.mnt[1],sh*.8,sh*.22,.05,.13);
  // línea de bosque
  for(let x=-4;x<sw+4;x+=3){const h2=4+((R()*5)|0),y=sh-h2-2;g.fillStyle=p.tree;for(let k=0;k<h2;k++){const hw=Math.max(0,Math.round(k*.45));g.fillRect(x-hw,y+k,hw*2+1,1);}
    g.fillStyle=p.treeL;g.fillRect(x,y+1,1,1);}
  g.fillStyle=p.tree;g.fillRect(0,sh-3,sw,3);
  SCN.back=c;
}
function buildVignette(){VIG=null;}
function sunScreenX(){const w=Math.ceil(W*1.25);return -W*.125-cam.x*2+w*SCN.pal.sunX;}
function buildCastle(p){const c=mk(128,74),g=c.getContext('2d'),[st,stL,stD]=p.stone,R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  R(12,28,104,46,st);R(12,28,104,2,stL);for(let x=12;x<116;x+=6)R(x,24,4,4,st);for(let y=34;y<74;y+=6)for(let x=12+((y/6)%2)*4;x<116;x+=8)R(x,y,1,1,stD);
  for(const tx of [0,104]){R(tx,14,24,60,st);R(tx,14,3,60,stL);R(tx+21,14,3,60,stD);for(let x=tx;x<tx+24;x+=5)R(x,10,3,4,st);
    for(let k=0;k<14;k++){const hw=Math.max(0,13-k);R(tx+12-hw,10-k,hw*2,1,p.roof);}R(tx+11,-6+10,1,6,stD);R(tx+12,-6+10,5,3,'#ffd04a');
    R(tx+9,30,6,8,'#120c18');if(p.win)R(tx+10,31,4,6,p.win);R(tx+9,48,6,8,'#120c18');if(p.win)R(tx+10,49,4,6,p.win);}
  for(let y=0;y<26;y++){const hw=Math.round(Math.sqrt(Math.max(0,256-(Math.max(0,16-y))**2)));R(64-hw,48+y-10+10-26+26,hw*2,1,'#120c18');}
  g.fillStyle='#120c18';g.beginPath();g.moveTo(48,74);g.lineTo(48,46);g.quadraticCurveTo(64,30,80,46);g.lineTo(80,74);g.fill();
  for(let x=51;x<80;x+=4)R(x,40,1,34,'#5a5a66');for(let y=46;y<74;y+=5)R(49,y,30,1,'#5a5a66');
  for(const bx of [30,90]){R(bx,32,9,22,'#b0283a');R(bx,32,9,1,'#ffd04a');R(bx+3,38,3,3,'#ffd04a');R(bx,53,3,2,'#b0283a');R(bx+6,53,3,2,'#b0283a');}
  return c;}
function mkScene(lv,L,guardZ){
  const pal=PALS[(lv-1)%PALS.length],seed=lv*131+7;
  const decals=[];for(let z=2;z<L+90;z+=rnd(1.4,3.2)){const r=Math.random();decals.push({x:r<.75?rnd(-4.2,4.2):(Math.random()<.5?-4.5:4.3),z,w:rnd(.15,.6),l:rnd(.4,1.6),t:r<.55?0:r<.75?1:2});}
  const lamps=[];for(let z=12;z<L+150;z+=20){lamps.push({x:-5.95,z,kd:5,sz:z});lamps.push({x:5.95,z:z+10,kd:5,sz:z+10});}
  const props=[],pk=a=>a[(Math.random()*a.length)|0];
  // árboles a ambos lados (bosque)
  for(let z=6;z<L+140;z+=rnd(2.2,4.4)){
    const tl=Math.random()<.75?pk(PROPS.pines):pk(PROPS.oaks);props.push({x:rnd(-17,-11.2),z,p:pal.night===.5&&Math.random()<.5?PROPS.dead:tl,kd:10,sz:z});
    const tr=Math.random()<.7?pk(PROPS.pines):pk(PROPS.oaks);props.push({x:rnd(8.4,14),z:z+rnd(-1,1),p:pal.night===.5&&Math.random()<.5?PROPS.dead:tr,kd:10,sz:z});}
  // utilería en las orillas
  for(let z=14;z<L+120;z+=rnd(5,10)){
    if(guardZ&&Math.abs(z-guardZ)<11)continue;
    const r=Math.random();let pr;
    if(r<.16)pr=PROPS.cart;else if(r<.3)pr=pk(PROPS.tents);else if(r<.44)pr=PROPS.barrel;else if(r<.56)pr=PROPS.fence;else if(r<.66)pr=pk(PROPS.banners);else if(r<.76)pr=PROPS.pillar;else if(r<.88)pr=pk(PROPS.bush);else pr=PROPS.rock;
    props.push({x:rnd(-9.6,-6.6),z,p:pr,kd:10,sz:z});
    if(Math.random()<.5){const pr2=Math.random()<.4?pk(PROPS.bush):Math.random()<.5?PROPS.rock:Math.random()<.5?PROPS.shroom:PROPS.barrel;props.push({x:rnd(6.1,6.8),z:z+rnd(-3,3),p:pr2,kd:10,sz:z});}
  }
  const gantries=[];for(let z=70;z<L-30;z+=rnd(85,120)){if(guardZ&&Math.abs(z-guardZ)<16)continue;const i=(Math.random()*SIGNS.length)|0;gantries.push({z,s:SIGNS[i],s2:SIGNS[(i+1)%SIGNS.length],kd:9,sz:z});}
  const pi=(lv-1)%PALS.length;
  return {pal,seed,decals,lamps,props,gantries,back:null,pi,bc:BOSSC[pi],castle:{z:L+24,kd:11,sz:L+24,img:buildCastle(pal)}};
}
