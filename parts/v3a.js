/* ============================================================
   V3-A · progresión de 60 niveles, ambientes por bloque, tramos del nivel,
   tropas nuevas, reserva, cartas de bendición, eventos y enemigos con rol
   ============================================================ */
const MAXLV=60, RES_MAX=60;
const ENVB=[0,2,1,3,4,5,6];
const BOSSN3=['TROLL DEL BOSQUE','EL NIGROMANTE','DRAGÓN DEL OCASO','DEMONIO DEL ABISMO','EL JUEZ DICTADOR','EL GUARDIÁN DEL ORBE','CAOS REGENTE'];
const BOSSC3=[['170,120,60','240,210,150'],['90,230,120','200,255,200'],['255,110,40','255,210,110'],['255,60,30','255,200,100'],['255,200,80','255,250,220'],['184,106,255','230,200,255'],['255,150,60','255,240,200']];
const ROMAN=['I','II','III','IV','V'];
const UNITN={5:'MAGOS',6:'CABALLEROS',7:'DRUIDAS',8:'CATAPULTA'},UNITS={6:'CAB',7:'DRU',8:'CAT'};
function blockOf(lv){if(lv>MAXLV)return (lv-MAXLV-1)%6;if(lv===MAXLV)return 6;return Math.floor((lv-1)/10);}
function tierOf(lv){if(lv>=MAXLV)return 4;if(lv>50)return Math.min(4,Math.floor((lv-51)/2));return Math.floor(((lv-1)%10)/2);}
function hpScale(lv){const l=lv-1;return 1+.16*l+.0015*l*l;}
function bossTitle(lv){const b=blockOf(lv),t=tierOf(lv);if(b===6)return BOSSN3[6];if(b===5)return BOSSN3[5]+' · FORMA '+(t+1);return BOSSN3[b]+' '+ROMAN[t];}

// ---------- ambientes nuevos (fuera del plano terrenal desde el 51) ----------
PALS.push(
 {name:'TRIBUNAL INFERNAL',sky:['#12040a','#2a0810','#4a0e16','#7a1a1a'],sun:['#ff3a2a','#ffb08a'],sunX:.5,sunY:.36,sunR:10,moon:0,stars:0,clouds:3,cloud:'#3a0a14',cloudD:'#24060c',
  mnt:['#2a0c14','#1a060c'],castle:'#120408',castleL:'#2a0a12',win:'#ff4a2a',tree:'#1a0a0e',treeL:'#2a1016',fog:'90,20,24',
  grass:['#1e1216','#1a0e12'],verge:['#24161a','#201216'],road:['#3a2a2a','#342424'],edge:['#6a5a52','#3a302c'],rut:'#241818',fence:'#2a2026',night:.6,en:{n:[6,9,0],r:[7],h:[1]},stone:['#3a2a2c','#54403e','#22181a'],roof:'#120408',env:'trib'},
 {name:'SANTUARIO DEL ORBE',sky:['#05030c','#0c0820','#1a1040','#2e1a5a'],sun:['#e0c8ff','#ffffff'],sunX:.7,sunY:.3,sunR:9,moon:1,stars:1,clouds:2,cloud:'#3a2a6a',cloudD:'#24184a',
  mnt:['#1c1438','#120c26'],castle:'#0c0820',castleL:'#2a1e50',win:'#b86aff',tree:'#100a20',treeL:'#1c1238',fog:'60,40,120',
  grass:['#120c22','#0e091c'],verge:['#18102c','#140d26'],road:['#3a3450','#342e48'],edge:['#6ad0e8','#2a6a80'],rut:'#2a2440',fence:'#4a3a7a',night:.7,en:{n:[3,4,11],r:[10],h:[1]},stone:['#2e2648','#463a6a','#1c1630'],roof:'#4a2a96',env:'cosmo'},
 {name:'EL VACÍO',sky:['#000000','#05020a','#0c0618','#160a26'],sun:['#ffb46a','#fff0d0'],sunX:.32,sunY:.34,sunR:5,moon:0,stars:1,clouds:0,cloud:'#000000',cloudD:'#000000',
  mnt:['#0c0814','#06040c'],castle:'#06040a',castleL:'#160c26',win:'#ffb46a',tree:'#06040a',treeL:'#0c0814',fog:'20,10,40',
  grass:['#06040c','#04020a'],verge:['#0a0614','#08040f'],road:['#24203a','#201c34'],edge:['#b86aff','#4a2a8a'],rut:'#18142a',fence:'#3a2a5a',night:.8,en:{n:[3,4],r:[10,7],h:[1,0]},stone:['#1c1630','#2e2648','#0c0818'],roof:'#2a1660',env:'void'});
TRACKS.push(
 {bpm:96,mel:[69,0,72,71,69,68,69,0, 64,65,68,69,71,72,74,0, 76,74,72,71,72,71,69,68, 69,0,64,0,69,0,0,0],bas:[33,33,36,36, 40,40,33,33, 29,29,33,33, 28,28,33,33],lead:'sawtooth'},
 {bpm:84,mel:[76,0,79,0,83,0,81,79, 76,0,74,0,72,74,76,0, 79,0,83,0,86,84,83,81, 79,0,76,0,0,0,0,0],bas:[40,40,47,47, 45,45,43,43, 40,40,48,48, 47,47,40,40],lead:'triangle'},
 {bpm:72,mel:[57,0,0,60,0,0,63,0, 62,0,0,58,0,0,57,0, 57,0,0,60,0,63,0,66, 65,0,63,0,62,0,0,0],bas:[33,33,33,33, 34,34,34,34, 33,33,33,33, 30,30,30,30],lead:'triangle'});
const CHAOS_TRACK={bpm:160,mel:[69,70,69,66,69,70,73,72, 69,70,69,66,64,0,63,0, 69,72,75,78,77,75,72,70, 69,66,63,66,69,0,57,0],bas:[33,45,33,45, 34,46,34,46, 30,42,30,42, 33,45,33,45],lead:'sawtooth'};
function musTick(){const c=AU.ctx;if(!c||save.muted||!MUS.on){musStop();return;}
  const boss=G&&G.phase==='boss',chaos=boss&&G.boss.block===6,ti=boss?(chaos?98:99):(SCN?SCN.pi:0),tr=boss?(chaos?CHAOS_TRACK:BOSS_TRACK):TRACKS[ti%TRACKS.length],st=60/tr.bpm/4;
  if(ti!==MUS.tr){MUS.tr=ti;MUS.step=0;}
  AU.bus=AU.mus||null;
  while(MUS.next<c.currentTime+.25){const s=MUS.step%64,d=MUS.next-c.currentTime;
    if(s%2===0){const n=tr.mel[s>>1];if(n)tone(mf(n),st*1.6,tr.lead,tr.lead==='triangle'?.05:tr.lead==='sawtooth'?.012:.018,0,d);}
    if(s%4===0)tone(mf(tr.bas[s>>2]),st*3.2,'triangle',.05,0,d);
    if(s%4===2)noise(.03,.012,6000,'highpass',d);
    if(boss&&s%8===0)noise(.06,.05,180,'lowpass',d);
    MUS.next+=st;MUS.step++;}
  AU.bus=null;
}

// ---------- guardado: estrellas y desafío diario ----------
function loadSave(){
  try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
    if(s&&typeof s==='object'){const n=(v,a,b,d)=>Number.isFinite(v)?clamp(Math.floor(v),a,b):d;
      save.level=n(s.level,1,999,1);save.coins=n(s.coins,0,1e9,0);save.best=n(s.best,1,999,1);save.muted=s.muted===true;save.crt=s.crt===true;
      if(s.up&&typeof s.up==='object')for(const u of UPG)save.up[u.id]=n(s.up[u.id],0,u.max,0);
      save.stars={};if(s.stars&&typeof s.stars==='object')for(const k in s.stars){const lv=parseInt(k,10);if(lv>=1&&lv<=999)save.stars[lv]=n(s.stars[k],0,3,0);}
      save.daily=typeof s.daily==='string'&&/^\d{8}$/.test(s.daily)?s.daily:'';
      const f=(v,d)=>Number.isFinite(v)?clamp(v,0,1):d;save.vm=f(s.vm,.7);save.vs=f(s.vs,.8);save.vib=s.vib!==false;save.qual=['normal','alta','baja'].includes(s.qual)?s.qual:'normal';}
  }catch(e){}
  if(!save.stars)save.stars={};if(typeof save.daily!=='string')save.daily='';if(save.vm==null)save.vm=.7;if(save.vs==null)save.vs=.8;if(save.vib==null)save.vib=true;if(!save.qual)save.qual='normal';
}
const totalStars=()=>Object.values(save.stars||{}).reduce((a,b)=>a+b,0);
function todayKey(){const d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();}
const DAILY_M=[['horde','HORDA DOBLE'],['furia','JEFE FURIOSO'],['oro','ORO TRIPLE · ENEMIGOS DUROS'],['sinEnt','SIN ENT']];
function dailyInfo(){const k=todayKey(),lv=Math.max(1,Math.min(save.best,MAXLV)-(k%3)),m=DAILY_M[k%4];return {key:String(k),lv,m:m[0],name:m[1],reward:120+lv*8,seed:k*7+lv};}

// ---------- escena por bloque ----------
function mkScene(lv,L,guardZ){
  const pi=ENVB[blockOf(lv)],pal=PALS[pi],seed=lv*131+7,env=pal.env||'earth',P10=SPR.props10||{};
  const decals=[];for(let z=2;z<L+90;z+=rnd(1.4,3.2)){const r=Math.random();decals.push({x:r<.75?rnd(-4.2,4.2):(Math.random()<.5?-4.5:4.3),z,w:rnd(.15,.6),l:rnd(.4,1.6),t:env==='earth'?(r<.55?0:r<.75?1:2):(r<.7?0:1)});}
  const lamps=[];for(let z=12;z<L+150;z+=20){lamps.push({x:-5.95,z,kd:5,sz:z});lamps.push({x:5.95,z:z+10,kd:5,sz:z+10});}
  const props=[],pk=a=>a[(Math.random()*a.length)|0],big=(p,k)=>p?{img:p.img,w:p.w*k,h:p.h*k}:null;
  const far=env==='trib'?()=>{const r=Math.random();return r<.45?big(P10.pillar,1.8):r<.75?PROPS.dead:r<.9?big(P10.cage,1.6):big(P10.brazier,1.7);}
    :env==='cosmo'?()=>{const r=Math.random();return r<.55?big(pk(P10.cryst),1.9):r<.8?big(P10.obelisk,1.7):big(P10.frock,1.8);}
    :env==='void'?()=>{const r=Math.random();return r<.5?big(P10.frock,2):r<.75?big(pk(P10.cryst),1.6):null;}
    :()=>{const tl=Math.random()<.72?pk(PROPS.pines):pk(PROPS.oaks);return pal.night===.5&&Math.random()<.5?PROPS.dead:tl;};
  for(let z=6;z<L+140;z+=rnd(2.2,4.4)*(env==='void'?2.2:env==='earth'?1:1.4)){const a=far(),b=far();
    if(a)props.push({x:rnd(-17,-11.2),z,p:a,kd:10,sz:z});if(b)props.push({x:rnd(8.4,14),z:z+rnd(-1,1),p:b,kd:10,sz:z});}
  for(let z=14;z<L+120;z+=rnd(5,10)){
    if(guardZ&&Math.abs(z-guardZ)<11)continue;const r=Math.random();let pr=null,pr2=null;
    if(env==='earth'){
      if(r<.16)pr=PROPS.cart;else if(r<.3)pr=pk(PROPS.tents);else if(r<.44)pr=PROPS.barrel;else if(r<.56)pr=PROPS.fence;else if(r<.66)pr=pk(PROPS.banners);else if(r<.76)pr=PROPS.pillar;else if(r<.88)pr=pk(PROPS.bush);else pr=PROPS.rock;
      if(Math.random()<.5)pr2=Math.random()<.4?pk(PROPS.bush):Math.random()<.5?PROPS.rock:Math.random()<.5?PROPS.shroom:PROPS.barrel;}
    else if(env==='trib'){pr=r<.3?P10.brazier:r<.55?P10.spikes:r<.75?P10.cage:r<.9?PROPS.rock:PROPS.dead;if(Math.random()<.4)pr2=Math.random()<.5?P10.spikes:PROPS.rock;}
    else{pr=r<.45?pk(P10.cryst):r<.7?P10.obelisk:env==='void'&&r<.85?null:P10.frock;if(Math.random()<.35)pr2=pk(P10.cryst);}
    if(pr)props.push({x:rnd(-9.6,-6.6),z,p:pr,kd:10,sz:z});if(pr2)props.push({x:rnd(6.1,6.8),z:z+rnd(-3,3),p:pr2,kd:10,sz:z});}
  const gantries=[];if(env==='earth'||env==='trib')for(let z=70;z<L-30;z+=rnd(85,120)){if(guardZ&&Math.abs(z-guardZ)<16)continue;const i=(Math.random()*SIGNS.length)|0;gantries.push({z,s:SIGNS[i],s2:SIGNS[(i+1)%SIGNS.length],kd:9,sz:z});}
  return {pal,seed,decals,lamps,props,gantries,back:null,pi,env,bc:BOSSC3[blockOf(lv)],castle:{z:L+24,kd:11,sz:L+24,img:buildCastle(pal)}};
}

// ---------- generación del nivel por tramos ----------
function genLevel(lv,opts){opts=opts||{};
  const R=mulberry32(opts.seed||(lv*7919+101));
  const ri=(a,b)=>a+Math.floor(R()*(b-a+1)),rf=(a,b)=>a+R()*(b-a),pick=a=>a[Math.floor(R()*a.length)];
  const hs=hpScale(lv),bk=blockOf(lv),t=tierOf(lv),lvC=Math.min(lv,22),env=(PALS[ENVB[bk]].env||'earth');
  const L=Math.round(560+Math.min(lv,MAXLV)*5);
  const gates=[],crates=[],waves=[],rollTrig=[],spikes=[];let bridge=null,fork=null,amb=null,row=0;
  const zhp=Math.round(34*Math.pow(hs,.8)),bhp=Math.round(330*Math.pow(hs,.85));
  const mkg=(z,x0,x1,o)=>gates.push({row,z,x0,x1,k:o.k,val:o.v,v0:o.v,kd:3,sz:z,fl:0,mg:o.mg||0,unit:o.u||0,curse:o.curse||0,rou:o.rou||null,cost:o.cost||0,mv:0,side:0,rp:R()*10});
  const pair=(z,A,B,mv)=>{const f=R()<.5,l=f?B:A,r=f?A:B;const i0=gates.length;if(l)mkg(z,-RAIL,0,l);if(r)mkg(z,0,RAIL,r);
    if(mv){const ph=R()*6;for(let i=i0;i<gates.length;i++){gates[i].mv=1;gates[i].mvp=ph;gates[i].side=gates[i].x0<0?-1:1;}}row++;};
  const right=(z,o)=>{mkg(z,0,RAIL,o);row++;};
  const pos=()=>lv>=2&&R()<.25?{k:'add',v:ri(2,3)+Math.round(lvC*.5),mg:1}:{k:'add',v:ri(3,6)+Math.round(lvC*1.1)};
  const neg=()=>lv>=6&&R()<.6?{k:'pct',v:-ri(25,35)}:{k:'add',v:-(ri(5,9)+Math.round(lvC*2.4))};
  const small=()=>({k:'add',v:ri(2,4)+Math.round(lvC*.4)});
  const trade=()=>{const r=R(),u=lv>=6&&r<.25?8:lv>=4&&r<.55?7:6,v=u===8?1:u===7?ri(2,3):ri(5,7);return {k:'trade',u,v,cost:ri(10,16)+Math.round(lvC*1.2)};};
  const big=()=>({k:'add',v:ri(6,9)+Math.round(lvC*1.6)});
  const mul2=()=>({k:'mul',v:2}),half=()=>({k:'mul',v:.5});
  const unitG=()=>{const r=R();if(lv>=6&&r<.25)return {k:'add',v:1,u:8};if(lv>=4&&r<.55)return {k:'add',v:ri(2,3),u:7};return {k:'add',v:ri(3,5)+Math.floor(lvC/7),u:6};};
  const rou=()=>({k:'rou',v:0,rou:[{k:'mul',v:2},big(),neg(),{k:'mul',v:.5}]});
  let mulLeft=lv>=3?1+(lv>=7?1:0):0;
  const bigOrMul=()=>{if(mulLeft>0&&R()<.6){mulLeft--;return mul2();}return big();};
  const roleMix=()=>({heal:lv>=4&&R()<.55?1+(lv>=20?1:0):0,shield:lv>=6&&R()<.5?ri(1,2+Math.floor(lv/15)):0,fly:lv>=8&&R()<.4?ri(2,3+Math.floor(lv/12)):0,raise:lv>=12&&R()<.35?1:0});
  const wave=(z,n,side,o)=>{o=o||{};let x0=-ROAD,x1=ROAD;if(side===1)x0=.2;else if(side===-1)x1=-.2;if(o.x0!=null){x0=o.x0;x1=o.x1;}
    const br=lv>=2?Math.floor(rf(0,1+Math.min(lv,20)*.25)):0,run=lv>=3?ri(0,Math.floor(Math.min(lv,30)/2)):0,sh=lv>=3?Math.floor(rf(0,1+Math.min(3,lv*.3))):0;
    waves.push({z,n,x0,x1,depth:rf(5,9)+n*.08,br:o.mini?Math.min(br,1):o.gaunt?br+2:br,run,sh:o.gaunt?sh+2:sh,hp:zhp,bhp,done:false,ro:o.noRole?null:roleMix(),mini:!!o.mini,gaunt:!!o.gaunt,fs:o.fs||0});};
  const crate=(z,x,type)=>{const hp=Math.round((120+Math.min(lv,60)*12)*Math.pow(hs,.75));crates.push({z,x,type:type||(R()<.55?'w':'m'),hp:type==='g'?Math.round(hp*1.6):hp,max:type==='g'?Math.round(hp*1.6):hp,val:ri(4,8)+Math.min(lv,25),dead:false,fl:0,ft:0,kd:4,sz:z});};
  const event=(z,kind)=>{
    if(kind==='roll'){rollTrig.push({z,n:2+Math.floor(lv/14),kind:env==='earth'&&bk!==3?'log':'rock',k:0,t:0,done:false});return 34;}
    if(kind==='spikes'){const per=2.4-Math.min(.8,lv*.012);for(let i=0;i<3;i++){const s=R()<.5?-1:1,zz=z+i*9;spikes.push({z0:zz,z1:zz+4.5,x0:s<0?-ROAD:-ROAD+3.6+R()*1.2,x1:s<0?ROAD-3.6-R()*1.2:ROAD,per,off:R()*per,up:false});}return 34;}
    if(kind==='bridge'){bridge={z0:z,z1:z+26,cx:rf(-1.6,1.6),hw:2.1};return 34;}
    return 0;};
  const evPool=lv<2?['roll']:lv<4?['roll','spikes']:['roll','spikes','bridge'];
  let z=24;
  pair(z,{k:'add',v:5+Math.min(lv,10)},{k:'add',v:2});z+=rf(26,30);
  wave(z,10+Math.round(Math.min(lv,20)*1.5),0,{noRole:lv<6});z+=rf(26,30);
  pair(z,pos(),lv>=2?neg():{k:'add',v:1});z+=rf(24,28);
  // tramo A: obstáculo
  const evA=pick(evPool);z+=event(z,evA);z+=8;
  pair(z,lv>=3&&R()<.5?unitG():pos(),neg());z+=rf(20,24);
  // tramo del Ent (todo el contenido por la derecha)
  const gz=Math.round(z+34);
  right(gz-24,R()<.65?pos():{k:'add',v:-(ri(3,6)+Math.min(lv,20))});
  crate(gz-13,rf(2.2,3.2));
  wave(gz+3,8+lvC*2,1,{noRole:true});
  z=gz+16+rf(0,6);
  // tramo B: portales de riesgo, enemigos con rol, cofre dorado
  pair(z,lv>=5?rou():bigOrMul(),neg(),lv>=4&&R()<.6);z+=rf(26,30);
  wave(z,ri(16,22)+Math.round(lvC*4),pick([0,1,-1]));z+=rf(26,30);
  crate(z,pick([-2.6,2.6]),'g');z+=rf(22,26);
  pair(z,unitG(),neg(),lv>=6&&R()<.5);z+=rf(24,28);
  // caudillo (miniboss)
  wave(z,6+Math.round(lvC*1.2),0,{mini:true});z+=rf(34,40);
  // bifurcación
  if(lv>=2){fork={z0:z,z1:z+64};const L0=-ROAD,L1=-1.1,R0=1.1,R1=ROAD;
    spikes.push({z0:z+12,z1:z+16,x0:L0,x1:L1-.9,per:2.2,off:R()*2.2,up:false});spikes.push({z0:z+30,z1:z+34,x0:L0+.9,x1:L1,per:2.2,off:R()*2.2,up:false});
    crate(z+22,-2.9,'g');crate(z+44,-2.9,'m');wave(z+50,6+lvC,0,{x0:L0,x1:L1,fs:-1,noRole:true});
    wave(z+14,ri(14,18)+Math.round(lvC*3),0,{x0:R0,x1:R1,fs:1});wave(z+42,ri(14,18)+Math.round(lvC*3.4),0,{x0:R0,x1:R1,fs:1});
    z+=72;}
  // tramo C: emboscada, portal maldito, segundo obstáculo
  amb={z:z,done:false};z+=10;
  wave(z,ri(16,22)+Math.round(lvC*4.5),pick([0,0,1,-1]));z+=rf(26,30);
  if(lv>=5)pair(z,{k:'mul',v:2,curse:1},small());else pair(z,pos(),neg());z+=rf(24,28);
  const evB=pick(evPool.filter(e=>e!==evA))||'roll';if(z<L-110){z+=event(z,evB);z+=8;}
  while(z<L-118){const r=R();
    if(r<.4){const c=ri(0,4);if(c===0)pair(z,pos(),neg());else if(c===1)pair(z,bigOrMul(),neg());else if(c===2)pair(z,lv>=3?trade():pos(),neg());else if(c===3)pair(z,half(),pos());else pair(z,lv>=5?rou():pos(),neg());}
    else if(r<.85)wave(z,ri(16,22)+Math.round(lvC*5),pick([0,0,1,-1]));else crate(z,pick([-2.6,0,2.6])+rf(-.5,.5));
    z+=rf(25,32);}
  // tramo final: un dilema y luego una horda fuerte antes del jefe
  if(lv>=5)pair(L-104,rou(),small());else pair(L-104,pos(),neg());
  wave(L-70,ri(18,24)+Math.round(lvC*5),0,{gaunt:true});
  // las olas no caen sobre el río
  if(bridge)for(const w of waves)if(w.z>bridge.z0-14&&w.z<bridge.z1+6)w.z=bridge.z1+8;
  const bossHp=Math.round(26000*Math.pow(hs,1.2)*(1+.12*t)*(1+.1*bk)/100)*100;
  return {L,gates,crates,waves,bossHp,gz,rollTrig,spikes,bridge,fork,amb,bk,t};
}
function mkGuard(lv,gz){
  const hp=Math.round(GUARD_HP0*Math.pow(hpScale(lv),.9)*1.9/50)*50,cracks=[];
  for(let i=0;i<16;i++){const pts=[];let x=rnd(-4.6,5.2),y=rnd(-10.5,-1);pts.push([x,y]);let a=rnd(0,TAU);const n=3+(Math.random()*3|0);
    for(let j=0;j<n;j++){a+=rnd(-.9,.9);x+=Math.cos(a)*rnd(.6,1.6);y+=Math.sin(a)*rnd(.6,1.6);pts.push([x,y]);}cracks.push({th:(i+1)/17,pts});}
  return {x:GUARD_X,z:gz,st:'sleep',hp,max:hp,t:0,kneel:1,raise:0,raiseT:0,atk:1.2,walk:0,flash:-1,lit:.3,cracks,waves:[],tgt:null,kd:8,sz:gz,slab:true};
}
const BARMOR=[[1,1,.75,.75,.75],[1,1,.8,.8,.8],[1,1,.6,.6,.6],[1,1,.75,.75,.75],[1,1,.75,.75,.75],[1,1,1,1,1],[1,1,1,1,1]];
function newRun(lv,demo,opts){opts=opts||{};
  const daily=opts.daily||null,d=genLevel(lv,daily?{seed:daily.seed}:{});
  SCN=mkScene(lv,d.L,d.gz);buildSky();buildBack();buildVignette();
  const bk=d.bk,t=d.t,B=bossSheets(bk,t);SPR.titan={walk:B.walk,raise:B.raise,kl:10.4/Math.max(10,B.walk.ay-B.walk.top)};
  {const bn=document.querySelector('#bossBar .bn');if(bn)bn.textContent=bossTitle(lv);}CF.length=0;COINXY=null;
  G={lv,demo:!!demo,L:d.L,gates:d.gates,crates:d.crates,waves:d.waves,
    squad:{x:0,tx:0,z:0,sp:demo?RUN*.7:0},
    soldiers:[],bullets:[],eb:[],hs:0,zombies:[],parts:[],texts:[],corpses:[],shock:[],flashes:[],rings:[],
    boss:{x:0,z:d.L+6,hp:d.bossHp,max:d.bossHp,t:0,st:'idle',atk:2.4,sum:6,raise:0,raiseT:0,flash:-1,walk:0,dieT:0,dieDir:1,roarT:2,kd:6,sz:0,
      block:bk,tier:t,spd:.3+.04*t+.02*Math.min(bk,4),ft:0,enr:false,ph2:false,ph3:false,immune:0,link:0,fly:0,intang:0,cr:2,last:'',armor:BARMOR[bk][t],fbT:1,lift:0},
    guard:(daily&&daily.m==='sinEnt')?null:Object.assign(mkGuard(lv,d.gz),{kind:GKIND[(lv-1)%3]}),pack:null,grif:null,
    phase:'run',time:0,kills:0,coins:0,meter:.2,slash:null,wl:1,fireAcc:0,endT:0,shown:false,banner:demo?0:2.6,banner2:null,flashScr:0,
    reserve:0,refT:0,lost:0,bl:{pierce:0,bounce:0,rain:0,rate:0,dmg:0,magic:0,ent:0},taken:{},shieldHits:0,cards:0,
    hz:[],bp:[],cats:[],rolls:[],rollTrig:d.rollTrig,spikes:d.spikes,bridge:d.bridge,fork:d.fork,forkSide:0,amb:d.amb,cmp:1,
    goldMul:daily&&daily.m==='oro'?3:1,hpMul:daily&&daily.m==='oro'?1.3:1,bossMul:1,rainT:8,synT:12,drT:0,revived:false,daily,countdown:null,chainX:null,grav:0,nk:0,nm:0};
  SPR.guard3=(GUARD_ROT&&(SCN.env==='cosmo'||SCN.env==='void'))?(SPR.guardC||SPR.guard3):(SPR.guardE||SPR.guard3);
  if(d.fork){const F=d.fork;for(let z=F.z0+2;z<F.z1;z+=2.6)SCN.props.push({x:rnd(-.35,.35),z,p:Math.random()<.6?PROPS.rock:(SCN.env==='earth'?PROPS.bush[0]:PROPS.rock),kd:10,sz:z});}
  addSoldiers(demo?7:1+save.up.rec+Math.floor(Math.min(lv,60)/6),true);
  cam.z=-CAM_D;cam.x=0;
}

// ---------- tropas: reserva, caballeros al frente ----------
function addSoldiersRaw(k,instant,fv){
  const S=G.soldiers,sp0=formSp(Math.max(1,S.length+k));
  for(let i=0;i<k&&S.length<MAX_SQUAD;i++){const v=fv!=null?fv:(Math.random()*SVAR.length)|0;S.push({ox:instant?SLOTS[S.length][0]*sp0:rnd(-.3,.3),oz:instant?SLOTS[S.length][1]*sp0:rnd(-.3,.3),ph:Math.random()*TAU,fl:0,pop:instant?0:.3,v,hp:v===6?3:1,inv:0,ch:0,hurt:0,wx:G.squad.x,wz:G.squad.z,kd:1,sz:0});}
}
function addSoldiers(k,instant,fv){if(!G)return;const S=G.soldiers,add=Math.min(k,MAX_SQUAD-S.length),over=k-Math.max(0,add);
  if(add>0)addSoldiersRaw(add,instant,fv);if(over>0&&!G.demo)G.reserve=Math.min(RES_MAX,G.reserve+over);
  if(fv===6||fv===8||G.soldiers.some(s=>s.v===6||s.v===8))reform();}
function reform(){const S=G.soldiers,n=S.length;if(n<2)return;const idx=[...Array(n).keys()].sort((a,b)=>SLOTS[b][1]-SLOTS[a][1]);
  const kn=S.filter(s=>s.v===6),ct=S.filter(s=>s.v===8),ot=S.filter(s=>s.v!==6&&s.v!==8),order=kn.concat(ot,ct),out=new Array(n);idx.forEach((si,k)=>{out[si]=order[k];});for(let i=0;i<n;i++)S[i]=out[i];}
function killSoldierAt(i){const s=G.soldiers[i];if(!s)return false;if(s.inv>0)return false;
  if(s.hp>1){s.hp--;s.inv=.6;s.hurt=.25;puff(s.wx,.7,s.wz,'200,200,220');sfx.tink();return false;}
  puff(s.wx,.6,s.wz,'110,170,255');G.soldiers.splice(i,1);G.lost++;sfx.hurt();return true;}
function removeSoldiers(k){const S=G.soldiers,idx=S.map((s,i)=>i).sort((a,b)=>S[b].oz-S[a].oz).slice(0,k).sort((a,b)=>b-a);
  for(const i of idx){const s=S[i];puff(s.wx,.6,s.wz,'255,90,100');S.splice(i,1);G.lost++;}}
function updSoldiers(dt){
  const S=G.soldiers,sq=G.squad,f=Math.min(1,dt*6),sp=formSp(S.length)*(G.cmp||1);
  for(let i=0;i<S.length;i++){const s=S[i],a=SLOTS[i];
    s.ox+=(a[0]*sp-s.ox)*f;s.oz+=(a[1]*sp-s.oz)*f;s.ph+=dt*sq.sp*1.6;
    if(s.fl>0)s.fl-=dt;if(s.pop>0)s.pop-=dt;if(s.inv>0)s.inv-=dt;if(s.hurt>0)s.hurt-=dt;if(s.ch>0)s.ch=Math.max(0,s.ch-dt);
    s.wx=sq.x+s.ox;s.wz=sq.z+s.oz;s.sz=s.wz;}
}
const shoots=s=>(s.v<6||s.v===7)&&!(s.ch>0);
function arrowDmg(){return BASE_DMG*(1+.15*save.up.pow)*(1+.3*(G.wl-1))*(1+.3*G.bl.dmg);}
function fire(dt){
  const S=G.soldiers,n=S.length;if(!n)return;let sh=0;for(const s of S)if(shoots(s))sh++;if(!sh)return;
  const shooters=Math.min(sh,CAP),mult=Math.pow(sh/shooters,.7);
  const rate=BASE_RATE*(1+.1*save.up.rate)*(1+.1*(G.wl-1))*(1+.25*G.bl.rate);
  const dmg=arrowDmg()*mult;
  const gd=G.guard,aimG=gd&&gd.st==='lock'&&gd.z-G.squad.z<RANGE+6;
  let threat=false;if(aimG)for(const z of G.zombies){if(!z.dead&&z.z-G.squad.z<9&&z.x<1){threat=true;break;}}
  G.fireAcc+=shooters*rate*dt;let shots=0;
  while(G.fireAcc>=1){G.fireAcc-=1;let s=null;for(let k=0;k<8;k++){const c=S[(Math.random()*n)|0];if(shoots(c)){s=c;break;}}if(!s)continue;
    const b={x:s.wx+.12,z:s.wz+.4,d:dmg,life:RANGE/BV,vx:0,g:0,mg:s.v===5,pr:G.bl.pierce};
    if(aimG&&s.wx<-.8&&(!threat||Math.random()<.45)){const tx=gd.x+((gd.kind||'ent')==='ent'?2.4*GUARD_K:.6)+rnd(-1.3,1.3),tz=gd.z-1.2;if(tz>b.z+1){b.vx=(tx-b.x)/(tz-b.z)*BV;b.g=1;b.life=(tz-b.z)/BV+.05;}}
    G.bullets.push(b);s.fl=.14;shots++;}
  if(shots)sfx.shot();
}
function updBullets(dt){
  const B=G.bullets,Z=G.zombies,bo=G.boss,gd=G.guard;
  for(let i=B.length-1;i>=0;i--){
    const b=B[i],z0=b.z,z1=z0+BV*dt;b.life-=dt;b.x+=b.vx*dt;
    let hz=Infinity,tg=null,tk=0;
    for(let j=lowerBound(Z,z0-.6);j<Z.length;j++){const zb=Z[j];if(zb.z>z1+.6)break;if(zb.dead||zb.ov||zb===b.last)continue;
      if(Math.abs(zb.x-b.x)<(zb.mini?1.25:zb.br?.78:.42)){hz=zb.z;tg=zb;tk=1;break;}}
    for(const gt of G.gates){if(gt.used||(gt.k!=='add'&&gt.k!=='pct'))continue;if(gt.z>z0-.2&&gt.z<=z1+.3&&b.x>gt.x0&&b.x<gt.x1&&gt.z<hz){hz=gt.z;tg=gt;tk=2;}}
    for(const c of G.crates){if(c.dead)continue;const cz=c.z-.55;if(cz>z0-.4&&cz<=z1+.3&&Math.abs(b.x-c.x)<.78&&cz<hz){hz=cz;tg=c;tk=3;}}
    for(const r of G.rolls){if(r.dead)continue;if(r.z>z0-.4&&r.z<=z1+.4&&Math.abs(b.x-r.x)<r.w&&r.z<hz){hz=r.z;tg=r;tk=6;}}
    if(b.g&&gd&&gd.st==='lock'){const gz=gd.z-1.2;if(gz<=z1&&gz<hz){hz=gz;tg=gd;tk=5;}}
    else if(!b.g&&(bo.st==='idle'||bo.st==='fight')){const bz=bo.z-1.8,hw=bo.intang>0?1.15:4.2;if(bz<=z1&&bz>z0-3&&Math.abs(b.x-bo.x)<hw&&bz<hz){hz=bz;tg=bo;tk=4;}}
    if(tg){if(hit(tk,tg,b)){b.last=tg;b.z=hz+.05;continue;}B[i]=B[B.length-1];B.pop();continue;}
    b.z=z1;if(b.life<=0){B[i]=B[B.length-1];B.pop();}
  }
}
function hit(tk,t,b){
  if(tk===1){let d=b.d;if(t.role==='shield'&&!b.mg){d*=.15;if(Math.random()<.35){burst(t.x,1,t.z-.4,1,'200,200,220');sfx.tink();}}
    t.hp-=d;t.hit=.07;if(b.mg)splash(t,b);
    if(t.hp<=0){killZombie(t,true);if(G.bl.bounce&&Math.random()<.35*G.bl.bounce)bounceFrom(t,b);}else if(Math.random()<.3)burst(t.x,.9,t.z-.3,1);
    if(b.pr>0){b.pr--;return true;}return false;}
  if(tk===2){if(t.k==='pct')t.val=Math.min(0,t.val+.12);else t.val+=GATE_INC/(1+Math.max(0,t.val-t.v0)/6);t.fl=.06;sfx.tick();if(Math.random()<.25)burst(b.x,1,t.z-.1,1,t.val>=0?'140,200,255':'255,150,150');return false;}
  if(tk===3){t.hp-=b.d;t.fl=.07;if(t.hp<=0)breakCrate(t,true);return false;}
  if(tk===4){if(t.st==='idle'){if(Math.random()<.3)burst(b.x,rnd(3,9),t.z-2,1,'200,200,210');return false;}
    if(t.immune>0){if(Math.random()<.25){burst(b.x,rnd(3,9),t.z-2.4,1,'150,255,170');sfx.tink();}return false;}
    const d=b.d*(b.mg?Math.max(t.armor,.85):t.armor);t.hp-=d;if(G.countdown)G.countdown.dealt+=d;if(t.flash<-.12)t.flash=.05;if(Math.random()<.5)burst(b.x,rnd(3,9),t.z-2,1,'255,230,170');if(t.hp<=0)bossDie();return false;}
  if(tk===5){t.hp-=b.d;if(t.flash<-.1)t.flash=.05;sfx.tink();if(Math.random()<.45)burst(b.x,rnd(1,7),t.z-1.2,2,'170,235,255');if(t.hp<=0)guardFree();return false;}
  if(tk===6){t.hp-=b.d;t.fl=.06;if(Math.random()<.3)burst(b.x,.8,t.z-.4,1,'160,130,100');if(t.hp<=0)breakRoll(t);return false;}
  return false;
}
function bounceFrom(t,b){let best=null,bd=9;for(const z of G.zombies){if(z.dead||z===t)continue;const d=Math.hypot(z.x-t.x,z.z-t.z);if(d<bd&&z.z>t.z-1){bd=d;best=z;}}
  if(!best)return;const dz=Math.max(.6,best.z-t.z);G.bullets.push({x:t.x,z:t.z+.2,d:b.d*.8,life:dz/BV+.1,vx:(best.x-t.x)/dz*BV,g:0,mg:false,pr:0,last:t});burst(t.x,1,t.z,3,'255,240,170');}
function killZombie(z,reward){
  if(z.dead)return;z.dead=true;
  if(z.link&&G.boss.link>0){G.boss.link--;if(G.boss.link<=0&&G.boss.immune>0){G.boss.immune=0;ftext('¡ESCUDO ROTO!','#bfffc8',G.boss.x,9,G.boss.z-2,1.4);sfx.shatter();}}
  if(reward){G.kills++;const zone=G.fork&&G.forkSide>0&&z.z>=G.fork.z0-4&&z.z<=G.fork.z1+10?2:1;G.coins+=Math.round((z.mini?25:z.br?8:1)*G.goldMul*zone);
    G.meter=Math.min(1,G.meter+(z.br?.05:.011)*(1+.25*save.up.slash)*(1+.6*G.bl.magic));}
  if(z.mini){G.eliteLeft=Math.max(0,(G.eliteLeft||1)-1);shake=.6;G.hs=.1;for(let i=0;i<6;i++)flyCoin(z.x+rnd(-1,1),2,z.z);
    if(G.eliteLeft===0){G.cards++;G.banner2={txt:'¡TROPA DE ÉLITE CAÍDA!',sub:'Elige una bendición',t:2.2,col:'#ffe27a'};shake=.9;G.hs=.15;}else ftext('ÉLITE · QUEDAN '+G.eliteLeft,'#ffe27a',z.x,3,z.z,1.1);}
  pixelBurst(z);if(reward&&(z.br||Math.random()<.5))flyCoin(z.x,1,z.z);
  dust(z.x,z.z,z.br?3:1,z.br?.9:.5);sfx.kill();
}
// ---------- olas: director de ritmo y enemigos con rol ----------
function spawnWave(w){
  const E=SCN.pal.en,tot=G.soldiers.length+G.reserve*.5,dir=.75+.45*Math.min(1.6,tot/70),hm=G.hpMul;
  const n=Math.max(4,Math.round(w.n*dir*(G.daily&&G.daily.m==='horde'?1.5:1)));
  const ro=w.ro||{heal:0,shield:0,fly:0,raise:0},sp=[];for(let i=0;i<ro.heal;i++)sp.push('heal');for(let i=0;i<ro.shield;i++)sp.push('shield');for(let i=0;i<ro.fly;i++)sp.push('fly');for(let i=0;i<ro.raise;i++)sp.push('raise');
  const mk=(o)=>{G.zombies.push(Object.assign({x:rnd(w.x0,w.x1),z:w.z+Math.random()*w.depth,sp:rnd(.9,1.6),hp:w.hp*hm,max:w.hp*hm,br:false,run:false,sh:false,cd:rnd(.6,1.6),cd2:rnd(1,3),shoot:0,ph:Math.random()*TAU,off:rnd(-1.6,1.6),pal:E.n[(Math.random()*E.n.length)|0],hit:0,dead:false,kd:2,sz:0,fs:w.fs},o));};
  if(w.mini){const hp=w.bhp*6*hm;G.eliteLeft=3;for(const dx of [-2.4,0,2.4])mk({br:true,mini:true,pal:2,hp,max:hp,sp:.75,x:clamp((w.x0+w.x1)/2+dx,-3.4,3.4),z:w.z+w.depth*.6+Math.abs(dx)*.6,off:dx*.4});}
  for(let i=0;i<n;i++){const br=i<w.br,run=!br&&i<w.br+w.run,sh=!br&&!run&&i<w.br+w.run+(w.sh||0),hp=(br?w.bhp:run?w.hp*.7:sh?w.hp*.8:w.hp)*hm;
    const pal=br?E.h[(Math.random()*E.h.length)|0]:run?E.r[(Math.random()*E.r.length)|0]:sh?5:E.n[(Math.random()*E.n.length)|0];
    mk({sp:br?.85:run?3.3:sh?1.0:rnd(.9,1.6),hp,max:hp,br,run,sh,pal});}
  for(const r of sp){
    if(r==='heal')mk({role:'heal',pal:8,hp:w.hp*1.5*hm,max:w.hp*1.5*hm,sp:.8});
    else if(r==='shield')mk({role:'shield',pal:9,hp:w.hp*2.2*hm,max:w.hp*2.2*hm,sp:.8});
    else if(r==='raise')mk({role:'raise',pal:11,hp:w.hp*1.6*hm,max:w.hp*1.6*hm,sp:.9});
    else{const s=Math.random()<.5?-1:1;mk({role:'fly',fly:true,pal:10,hp:w.hp*.7*hm,max:w.hp*.7*hm,sp:3.6,x:s*(ROAD+2.5),z:w.z+rnd(-4,6)});}}
}
function updZombies(dt){
  const Z=G.zombies,sq=G.squad,S=G.soldiers,F=G.fork,Br=G.bridge;
  for(const z of Z){if(z.dead)continue;
    if(z.ov){z.z+=(RUN+5)*dt;z.x+=(z.side*4.4-z.x)*Math.min(1,dt*2);z.ph+=dt*9;if(z.z>sq.z+11)z.ov=false;z.sz=z.z;continue;}
    if(z.fly){z.z-=z.sp*dt;const tx=sq.x+z.off*.4;z.x+=clamp(tx-z.x,-1,1)*3.4*dt;z.ph+=dt*10;}
    else{z.z-=z.sp*dt;if(z.sh&&z.z-sq.z<15)z.z+=z.sp*dt;if((z.role==='heal'||z.role==='raise')&&z.z-sq.z<15)z.z+=z.sp*.8*dt;z.ph+=dt*(z.br?5.4:z.sp*2.6+1.2);}
    if(z.sh){z.shoot-=dt;z.cd-=dt;const dd=z.z-sq.z;if(z.cd<=0&&dd>3&&dd<24&&S.length){z.cd=rnd(1.8,2.6);z.shoot=.3;const t=S[(Math.random()*S.length)|0],tt=Math.max(.2,(z.z-t.wz)/26);G.eb.push({x:z.x,z:z.z-.4,vx:(t.wx-z.x)/tt});if(thr('gob',.15))tone(380,.06,'triangle',.03,-150);}}
    if(z.role==='heal'){z.cd2-=dt;if(z.cd2<=0&&z.z-sq.z<34){z.cd2=3;let k=0;for(const o of Z){if(o.dead||o===z)continue;if(Math.abs(o.x-z.x)<3.2&&Math.abs(o.z-z.z)<3.2&&o.hp<o.max){o.hp=Math.min(o.max,o.hp+o.max*.3);k++;}}if(k){G.rings.push({x:z.x,z:z.z,t:0});if(thr('heal',.3))tone(880,.12,'sine',.03,300);}}}
    if(z.role==='raise'){z.cd2-=dt;if(z.cd2<=0&&z.z-sq.z<32){z.cd2=4.5;for(let k=0;k<2;k++){const hp=Math.round(34*Math.pow(hpScale(G.lv),.8))*G.hpMul;G.zombies.push({x:clamp(z.x+rnd(-1.5,1.5),-ROAD,ROAD),z:z.z-1+rnd(0,1),sp:rnd(1,1.5),hp,max:hp,br:false,run:false,sh:false,cd:1,cd2:2,shoot:0,ph:0,off:rnd(-1.6,1.6),pal:6,hit:0,dead:false,kd:2,sz:0});}burst(z.x,1,z.z-1,8,'200,122,255');}}
    const dz=z.z-sq.z;
    if(dz<18&&!z.fly){const tx=sq.x+z.off;z.x+=clamp(tx-z.x,-1,1)*z.sp*.5*dt;}
    if(z.fly)z.x=clamp(z.x,-ROAD-3,ROAD+3);else z.x=clamp(z.x,-ROAD,ROAD);
    if(F&&z.z>=F.z0-1&&z.z<=F.z1&&!z.fly){const s=z.fs||(z.x<0?-1:1);z.fs=s;if(s<0)z.x=Math.min(z.x,-1.2);else z.x=Math.max(z.x,1.2);}
    if(Br&&z.z>Br.z0&&z.z<Br.z1&&!z.fly)z.x=clamp(z.x,Br.cx-Br.hw+.3,Br.cx+Br.hw-.3);
    if(z.hit>0)z.hit-=dt;
    if(dz<1.8&&dz>-1.8&&S.length){const r=z.mini?1.25:z.br?.85:.5;
      for(let i=S.length-1;i>=0;i--){const s=S[i];
        if(Math.abs(s.wx-z.x)<r&&Math.abs(s.wz-z.z)<.5){const died=killSoldierAt(i);
          if(z.br){z.hp-=z.max*(z.mini?.04:.2)*(died?1:1.5);z.hit=.07;if(z.hp<=0){killZombie(z,false);break;}}
          else{killZombie(z,false);break;}}}}
    if(z.z<sq.z-6)z.dead=true;
    z.sz=z.z;
  }
  let w=0;for(let i=0;i<Z.length;i++)if(!Z[i].dead)Z[w++]=Z[i];Z.length=w;
  Z.sort((a,b)=>a.z-b.z);
}
function updEB(dt){const E=G.eb,S=G.soldiers,sq=G.squad,fr=formRad(S.length)+.6;
  for(let i=E.length-1;i>=0;i--){const e=E[i];e.z-=26*dt;e.x+=e.vx*dt;let gone=false;
    if(e.z<sq.z+fr){for(let j=S.length-1;j>=0;j--){const s=S[j];if(Math.abs(s.wx-e.x)<.45&&Math.abs(s.wz-e.z)<.7){if(G.nk>=10&&Math.random()<.5){burst(e.x,1,e.z,3,'200,220,255');sfx.tink();}else killSoldierAt(j);gone=true;break;}}}
    if(gone||e.z<sq.z-4)E.splice(i,1);}}
// ---------- portales ----------
const rouCur=gt=>gt.rou[Math.floor((G.time*1.8+gt.rp))%gt.rou.length];
function gateLabel(gt){let k=gt.k,v=gt.val;if(k==='rou'){const o=rouCur(gt);k=o.k;v=o.v;}
  if(k==='trade')return '+'+v;if(k==='pct')return '−'+Math.max(0,Math.round(-v))+'%';
  if(k==='mul')return v<1?'÷'+Math.round(1/v):'×'+v;const r=Math.round(v);return r>=0?'+'+r:'−'+(-r);}
function applyGate(gt){
  const n=G.soldiers.length,tot=n+G.reserve;let k=gt.k,val=gt.val;if(k==='rou'){const o=rouCur(gt);k=o.k;val=o.v;}
  let nt=k==='add'?tot+Math.round(val):k==='pct'?Math.round(tot*(1+val/100)):k==='trade'?tot-gt.cost:Math.round(tot*val);nt=clamp(nt,0,MAX_SQUAD+RES_MAX);
  if(k==='trade'){let lose=Math.min(tot,gt.cost);const fr=Math.min(G.reserve,lose);G.reserve-=fr;lose-=fr;if(lose>0)removeSoldiers(lose);addSoldiers(val,false,gt.unit);nt=tot;}
  else if(gt.unit&&val>0)addSoldiers(Math.max(1,Math.round(val)),false,gt.unit);
  else if(nt>tot)addSoldiers(nt-tot,false,gt.mg?5:undefined);
  else if(nt<tot){let lose=tot-nt;const fr=Math.min(G.reserve,lose);G.reserve-=fr;lose-=fr;if(lose>0)removeSoldiers(lose);}
  const good=(gt.unit&&val>0)||nt>=tot,lab=gateLabel(gt)+(gt.unit?' '+UNITN[gt.unit]:gt.mg?' MAGOS':'')+(k==='trade'?' · −'+gt.cost:'');
  ftext(lab,good?(gt.unit?'#ffe9a0':gt.mg?'#ead8ff':'#8fd0ff'):'#ff8a92',G.squad.x,2.2,G.squad.z+1.5,1.3);
  if(gt.curse){G.bossMul*=1.3;G.boss.max=Math.round(G.boss.max*1.3);G.boss.hp=Math.round(G.boss.hp*1.3);ftext('JEFE +30% VIDA','#ff7ad8',G.squad.x,3.4,G.squad.z+1.5,1);sfx.roar();}
  if(good){sfx.good();buzz(15);}else{sfx.bad();buzz(60);shake=Math.max(shake,.25);}
}
function breakCrate(c,reward){
  c.dead=true;c.ft=0;debris(c.x,.8,c.z,14,c.type==='g'?'220,180,60':'110,86,52');
  if(reward){G.coins+=5*G.goldMul;
    if(c.type==='g'){G.cards++;ftext('¡BENDICIÓN!','#ffe27a',c.x,2.4,c.z,1.3);}
    else if(c.type==='w'){if(G.wl<6)G.wl++;ftext('FLECHAS NV '+G.wl,'#ffe27a',c.x,2.2,c.z,1.1);}
    else{addSoldiers(c.val);ftext('+'+c.val+' ALIADOS','#8fd0ff',c.x,2.2,c.z,1.1);}
    sfx.crate();buzz(20);burst(c.x,1,c.z,12,'255,230,140');for(let i=0;i<4;i++)flyCoin(c.x+rnd(-.5,.5),1,c.z);}
}
// ---------- Ent: carta y furia ----------
function guardPick(){
  const gd=G.guard,sq=G.squad,b=G.boss,fk=G.bl.ent?Math.pow(.7,G.bl.ent):1;
  if(G.phase==='boss'&&b.st==='fight'){gd.tgt={x:b.x,z:b.z-1.8,boss:true};gd.raiseT=.55;gd.atk=2.4*fk;return;}
  if(G.phase!=='run'){gd.atk=.5;return;}
  let best=null,bc=0;const Z=G.zombies;
  for(const z of Z){if(z.dead||z.z<sq.z+4||z.z>sq.z+30)continue;let c=0;for(const o of Z)if(!o.dead&&Math.abs(o.x-z.x)<3&&Math.abs(o.z-z.z)<3)c+=o.br?4:1;if(c>bc){bc=c;best=z;}}
  if(best&&bc>=3){gd.tgt={x:clamp(best.x,-4.6,3.4),z:best.z-best.sp*.9};gd.raiseT=.5;gd.atk=2.6*fk;return;}
  const cr=G.crates.find(c=>!c.dead&&c.z>sq.z+6&&c.z<sq.z+30);
  if(cr){gd.tgt={x:cr.x,z:cr.z};gd.raiseT=.5;gd.atk=2.6*fk;return;}
  gd.atk=.4;
}
function guardImpact(w){
  const R=3.4,fm=1+.5*G.bl.ent;
  if(w.boss){const b=G.boss;if(b.st==='fight'&&!(b.immune>0)){const dmg=(b.max*.03+300*hpScale(G.lv))*fm;b.hp-=dmg;if(G.countdown)G.countdown.dealt+=dmg;b.flash=.12;G.hs=.06;ftext('−'+Math.round(dmg),'#9ff0ff',b.x,9,b.z-2,1.2);if(b.hp<=0)bossDie();}}
  for(const z of G.zombies){if(z.dead)continue;if((z.x-w.x1)**2+(z.z-w.z1)**2<R*R){z.hp-=(z.mini?z.max*.12:z.br?700*hpScale(G.lv):1e9)*fm;z.hit=.1;if(z.hp<=0)killZombie(z,true);}}
  for(const c of G.crates)if(!c.dead&&Math.abs(c.x-w.x1)<R&&Math.abs(c.z-w.z1)<R)breakCrate(c,true);
  for(const r of G.rolls)if(!r.dead&&Math.abs(r.x-w.x1)<R&&Math.abs(r.z-w.z1)<R)breakRoll(r);
  for(const g of G.gates)if(!g.used&&g.k==='add'&&Math.abs(g.z-w.z1)<R&&w.x1>g.x0-1&&w.x1<g.x1+1){g.val+=4;g.fl=.2;}
  G.rings.push({x:w.x1,z:w.z1,t:0});burst(w.x1,.5,w.z1,16,'150,240,255');debris(w.x1,.3,w.z1,12);dust(w.x1,w.z1,6,1.5);
  shake=Math.max(shake,.45);sfx.impact();buzz(25);
}
// ---------- eventos del camino ----------
function breakRoll(r){if(r.dead)return;r.dead=true;debris(r.x,.8,r.z,18,r.kind==='log'?'120,80,46':'120,112,100');dust(r.x,r.z,4,1.4);G.coins+=4*G.goldMul;flyCoin(r.x,1,r.z);sfx.impact();}
function spawnAmbush(){const sq=G.squad,E=SCN.pal.en,hp=Math.round(34*Math.pow(hpScale(G.lv),.8))*G.hpMul,k=5+Math.min(10,Math.floor(G.lv/5));
  G.banner2={txt:'¡EMBOSCADA!',sub:'Salen del bosque por los lados y por detrás',t:2.2,col:'#ff9a8a'};sfx.roar();shake=.4;
  for(const s of [-1,1])for(let i=0;i<k;i++)G.zombies.push({x:s*ROAD,z:sq.z+rnd(5,15),sp:rnd(1.4,2.2),hp,max:hp,br:false,run:false,sh:false,cd:1,cd2:2,shoot:0,ph:Math.random()*TAU,off:rnd(-1,1),pal:E.n[(Math.random()*E.n.length)|0],hit:0,dead:false,kd:2,sz:0});
  for(let i=0;i<k;i++){const s=i%2?-1:1;G.zombies.push({x:s*4.4,z:sq.z-6-rnd(0,3),sp:rnd(1.2,1.8),hp,max:hp,br:false,run:false,sh:false,cd:1,cd2:2,shoot:0,ph:0,off:rnd(-1,1),pal:E.r[(Math.random()*E.r.length)|0],hit:0,dead:false,kd:2,sz:0,ov:true,side:s});}
  G.zombies.sort((a,b)=>a.z-b.z);}
function updEvents(dt){const sq=G.squad,S=G.soldiers;
  for(const gt of G.gates){if(gt.mv&&!gt.used){const b=Math.sin(G.time*1.3+gt.mvp)*2.2;if(gt.side<0)gt.x1=b;else gt.x0=b;}}
  for(const tr of G.rollTrig){if(tr.done||sq.z<tr.z-18)continue;tr.t-=dt;if(tr.t<=0){tr.t=1.15;tr.k++;const x=clamp(sq.x+rnd(-1.2,1.2),-3,3),hp=Math.round(260*hpScale(G.lv));
    G.rolls.push({x,z:sq.z+42,w:tr.kind==='log'?2.0:1.15,sp:tr.kind==='log'?10:12.5,kind:tr.kind,hp,max:hp,f:0,fl:0,dead:false,kd:12,sz:sq.z+42});if(tr.k>=tr.n)tr.done=true;}}
  for(const r of G.rolls){if(r.dead)continue;r.z-=r.sp*dt;r.f+=dt*r.sp*.9;r.sz=r.z;if(r.fl>0)r.fl-=dt;
    if(Math.abs(r.z-sq.z)<4)for(let j=S.length-1;j>=0;j--){const s=S[j];if(Math.abs(s.wx-r.x)<r.w&&Math.abs(s.wz-r.z)<.7)killSoldierAt(j);}
    if(r.z<sq.z-8)r.dead=true;}
  if(G.rolls.length>12)G.rolls=G.rolls.filter(r=>!r.dead);
  for(const sp of G.spikes){const up=((G.time+sp.off)%sp.per)<sp.per*.42;if(up&&!sp.up&&Math.abs((sp.z0+sp.z1)/2-sq.z)<20&&thr('spk',.2))tone(1400,.05,'square',.02);sp.up=up;
    if(up&&sq.z>sp.z0-4&&sq.z<sp.z1+4)for(let j=S.length-1;j>=0;j--){const s=S[j];if(s.wz>sp.z0&&s.wz<sp.z1&&s.wx>sp.x0&&s.wx<sp.x1)killSoldierAt(j);}}
  const Br=G.bridge;if(Br&&sq.z>Br.z0-4&&sq.z<Br.z1+4)for(let j=S.length-1;j>=0;j--){const s=S[j];if(s.wz>Br.z0&&s.wz<Br.z1&&Math.abs(s.wx-Br.cx)>Br.hw){for(let k=0;k<4;k++)part({x:s.wx,y:.1,z:s.wz,vx:rnd(-1,1),vy:rnd(1,3),vz:rnd(-.5,.5),l:.4,m:.4,sz:rnd(.06,.12),c:SCN.env==='trib'?'255,140,40':SCN.env==='earth'?'120,190,255':'184,106,255',t:0});s.inv=0;s.hp=1;killSoldierAt(j);}}
  if(G.amb&&!G.amb.done&&sq.z>=G.amb.z){G.amb.done=true;spawnAmbush();}
}
// ---------- unidades especiales y sinergias ----------
function densest(z0,z1){const sq=G.squad,Z=G.zombies;let best=null,bc=0;for(const z of Z){if(z.dead||z.ov||z.z<sq.z+z0||z.z>sq.z+z1)continue;let c=0;for(const o of Z)if(!o.dead&&Math.abs(o.x-z.x)<3&&Math.abs(o.z-z.z)<3)c+=o.br?4:1;if(c>bc){bc=c;best=z;}}return best;}
function aoe(x,z,r,dmg,bossDmg){for(const o of G.zombies){if(o.dead)continue;if((o.x-x)**2+(o.z-z)**2<r*r){o.hp-=o.mini?dmg*.5:dmg;o.hit=.1;if(o.hp<=0)killZombie(o,true);}}
  for(const c of G.crates)if(!c.dead&&Math.abs(c.x-x)<r&&Math.abs(c.z-z)<r)breakCrate(c,true);
  for(const ro of G.rolls)if(!ro.dead&&Math.abs(ro.x-x)<r+1&&Math.abs(ro.z-z)<r){ro.hp-=dmg;if(ro.hp<=0)breakRoll(ro);}
  const b=G.boss;if(bossDmg&&b.st==='fight'&&!(b.immune>0)&&Math.abs(b.z-1.8-z)<r+2.5){const d=bossDmg*b.armor;b.hp-=d;if(G.countdown)G.countdown.dealt+=d;b.flash=.1;ftext('−'+Math.round(d),'#ffe9a0',b.x,8,b.z-2,1);if(b.hp<=0)bossDie();}}
function catImpact(c){aoe(c.x1,c.z1,2.4,arrowDmg()*7,c.boss?arrowDmg()*30:0);G.rings.push({x:c.x1,z:c.z1,t:0});debris(c.x1,.4,c.z1,10,'120,112,100');dust(c.x1,c.z1,4,1.2);shake=Math.max(shake,.2);sfx.slam();}
function arcaneStorm(){const sq=G.squad,b=G.boss;let x,z;if(G.phase==='boss'&&b.st==='fight'){x=b.x;z=b.z-1.8;}else{const t=densest(6,30);if(!t)return;x=t.x;z=t.z;}
  aoe(x,z,3.6,arrowDmg()*12,arrowDmg()*70);for(let i=0;i<40;i++)part({x:x+rnd(-3,3),y:rnd(0,6),z:z+rnd(-2,2),vx:rnd(-1,1),vy:rnd(-6,-2),vz:0,l:rnd(.4,.8),m:.8,sz:rnd(.1,.2),c:i%2?'200,150,255':'255,255,255',t:3});
  G.flashScr=Math.max(G.flashScr,.08);sfx.slash();}
function fireRain(){const t=densest(6,30),b=G.boss;let x,z;if(G.phase==='boss'&&b.st==='fight'){x=b.x;z=b.z-1.8;}else if(t){x=t.x;z=t.z;}else return;
  for(let k=0;k<6;k++){const fx=x+rnd(-2.5,2.5),fz=z+rnd(-2,2);aoe(fx,fz,1.3,arrowDmg()*5,arrowDmg()*12);for(let i=0;i<6;i++)part({x:fx,y:rnd(2,6),z:fz,vx:rnd(-.5,.5),vy:-8,vz:0,l:.4,m:.4,sz:rnd(.1,.18),c:i%2?'255,140,40':'255,220,90',t:3});}
  sfx.impact();}
function updUnits(dt){if(G.phase!=='run'&&G.phase!=='boss')return;const S=G.soldiers;let nk=0,nm=0,nd=0;const cats=[];
  for(const s of S){if(s.v===6)nk++;else if(s.v===5)nm++;else if(s.v===7)nd++;else if(s.v===8)cats.push(s);}
  G.nk=nk;G.nm=nm;
  for(const s of cats){s.cd=(s.cd==null?rnd(.5,2):s.cd)-dt;if(s.cd<=0){const b=G.boss;let tx,tz,boss=false;
      if(G.phase==='boss'&&b.st==='fight'){tx=b.x+rnd(-1,1);tz=b.z-1.8;boss=true;}else{const t=densest(8,30);if(!t){s.cd=.5;continue;}tx=t.x;tz=t.z-t.sp*1.0;}
      s.cd=2.6;s.fl=.35;G.cats.push({x0:s.wx,z0:s.wz,x1:tx,z1:tz,t:0,dur:1.0,boss});if(thr('cat',.2))tone(140,.12,'triangle',.08,-60);}}
  for(let i=G.cats.length-1;i>=0;i--){const c=G.cats[i];c.t+=dt;if(c.t>=c.dur){catImpact(c);G.cats.splice(i,1);}}
  if(nd){G.drT+=dt*nd;while(G.drT>=9){G.drT-=9;if(S.length<MAX_SQUAD){addSoldiersRaw(1,false);}else G.reserve=Math.min(RES_MAX,G.reserve+1);const sq=G.squad;for(let i=0;i<6;i++)part({x:sq.x+rnd(-1,1),y:rnd(.5,2),z:sq.z+rnd(-1,1),vx:0,vy:rnd(1,2),vz:0,l:.6,m:.6,sz:.1,c:'190,255,140',t:3});}}
  if(nm>=10){if(!G.synA){G.synA=true;G.banner2={txt:'¡SINERGIA ARCANA!',sub:'10 magos: tormenta arcana',t:2.2,col:'#d8b8ff'};}G.synT-=dt;if(G.synT<=0){G.synT=12;arcaneStorm();}}
  if(nk>=10&&!G.synK){G.synK=true;G.banner2={txt:'¡MURO DE ESCUDOS!',sub:'10 caballeros: bloquean proyectiles',t:2.2,col:'#b8d8ff'};}
  if(G.bl.rain){G.rainT-=dt*(1+.3*(G.bl.rain-1));if(G.rainT<=0){G.rainT=10;fireRain();}}
}
// ---------- cartas de bendición ----------
const CARDS=[
 {id:'pierce',icon:'pierce',name:'Flechas perforantes',desc:'Atraviesan un enemigo más',max:3,ap:()=>G.bl.pierce++},
 {id:'bounce',icon:'bounce',name:'Rebote',desc:'Al matar, la flecha puede saltar a otro enemigo',max:3,ap:()=>G.bl.bounce++},
 {id:'rain',icon:'rain',name:'Lluvia de fuego',desc:'Cada 10 s cae fuego sobre la horda o el jefe',max:3,ap:()=>{G.bl.rain++;G.rainT=Math.min(G.rainT,3);}},
 {id:'rate',icon:'rate',name:'Disparo rápido',desc:'+25 % de flechas',max:5,ap:()=>G.bl.rate++},
 {id:'dmg',icon:'dmg',name:'Puntas de acero',desc:'+30 % de daño',max:5,ap:()=>G.bl.dmg++},
 {id:'shield',icon:'shield',name:'Escudo de roble',desc:'Bloquea los próximos 3 golpes de jefe o trampas',max:9,ap:()=>{G.shieldHits+=3;}},
 {id:'reinf',icon:'reinf',name:'Refuerzos',desc:'+15 arqueros ahora',max:9,ap:()=>addSoldiers(15,false)},
 {id:'gold',icon:'gold',name:'Codicia',desc:'Oro ×2, pero los enemigos tienen +25 % de vida',max:1,ap:()=>{G.goldMul*=2;G.hpMul*=1.25;}},
 {id:'magic',icon:'magic',name:'Fuente arcana',desc:'La magia carga 60 % más rápido',max:3,ap:()=>G.bl.magic++},
 {id:'ent',icon:'ent',name:'Furia del guardián',desc:'Tu guardián ataca más seguido y más fuerte',max:3,ap:()=>G.bl.ent++,ok:()=>G.guard&&G.guard.st!=='lost'},
 {id:'knight',icon:'knight',name:'Caballeros',desc:'+6 caballeros al frente: aguantan 3 golpes',max:9,ap:()=>addSoldiers(6,false,6)},
 {id:'druid',icon:'druid',name:'Círculo druida',desc:'+3 druidas: reponen tropas con el tiempo',max:9,ap:()=>addSoldiers(3,false,7)},
 {id:'catapult',icon:'catapult',name:'Catapulta',desc:'+1 catapulta: rocas que golpean en área',max:3,ap:()=>addSoldiers(1,false,8)},
 {id:'wl',icon:'wl',name:'Flechas mejoradas',desc:'Sube un nivel de flechas',max:5,ap:()=>{if(G.wl<6)G.wl++;},ok:()=>G.wl<6}];
let CARDOPT=[];
function openCards(){const pool=CARDS.filter(c=>(G.taken[c.id]||0)<c.max&&(!c.ok||c.ok()));CARDOPT=[];
  while(CARDOPT.length<3&&pool.length){CARDOPT.push(pool.splice((Math.random()*pool.length)|0,1)[0]);}
  const box=$('cardList');box.replaceChildren();
  CARDOPT.forEach((c,i)=>{const b=mkEl('button','card');b.type='button';const im=new Image();im.alt='';im.src=(SPR.icu&&SPR.icu[c.icon])||'';b.append(im,mkEl('b',null,c.name),mkEl('span',null,c.desc));
    b.addEventListener('click',()=>pickCard(i));box.append(b);});
  state='card';musStop();sfx.crate();$('cardScr').classList.remove('hidden');}
function pickCard(i){if(state!=='card')return;const c=CARDOPT[i];if(c){c.ap();G.taken[c.id]=(G.taken[c.id]||0)+1;ftext(c.name.toUpperCase(),'#ffe27a',G.squad.x,2.6,G.squad.z+1.5,1);}
  G.cards=Math.max(0,G.cards-1);$('cardScr').classList.add('hidden');state='play';musStart();last=performance.now();sfx.good();}
