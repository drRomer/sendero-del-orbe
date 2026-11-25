/* ============================================================
   V3-B · jefes con habilidades por tramo, peligros, furia, fases, revivir, fin
   ============================================================ */
const BATK=[
  [['punch'],['rocks'],[],['charge'],[]],
  [['beamG'],['wave'],['shield'],['curse'],['tele']],
  [['fireLane'],['tail'],[],['sweep'],['flight']],
  [['fireballs'],['trident'],['imps'],['cracks'],['meteors']],
  [['sentence'],['burn'],['chains'],['countdown'],['cells']],
  [['claws','eggRay'],['tentacles'],['claws2'],['intang'],['laser','shadow']],
  [['gravity','debris','absorb','rays','tentacles']]];
const SUMP=[null,[6],[7,3],[7],[9,6],[3,4],[3,4,10]];
const HZC={warn:'255,60,70',fire:'255,140,40',green:'90,230,120',violet:'184,106,255',lava:'255,90,20',rock:'150,130,110',gold:'255,210,90',void:'120,60,200'};
function bossAtkList(b){if(b.block===6)return BATK[6][0].slice();const L=[];for(let i=0;i<=b.tier;i++)L.push(...BATK[b.block][i]);return L;}
function startBoss(){const b=G.boss;b.st='fight';b.atk=2.2;b.sum=6;b.ft=0;sfx.roar();shake=.5;buzz(80);
  if(G.lv===MAXLV)G.banner2={txt:'¡EL CAOS DESPIERTA!',sub:'El huevo se rompió: resiste su gravedad',t:2.6,col:'#ffb46a'};}
// ---------- peligros ----------
function hzRect(o){G.hz.push(Object.assign({type:'rect',t:0,warn:.9,act:.3,cont:false,col:'fire',done:false,hitOnce:false},o));}
function hzCirc(o){G.hz.push(Object.assign({type:'circ',t:0,warn:1,act:.2,cont:false,col:'rock',done:false,hitOnce:false},o));}
function laneZ(){const sq=G.squad,b=G.boss;return [sq.z-6,b.z-1.5];}
function hzKill(test,h){const S=G.soldiers;let any=false;for(let j=S.length-1;j>=0;j--)if(test(S[j])){any=true;break;}if(!any)return;
  if(G.shieldHits>0&&!(h&&h.shielded)){G.shieldHits--;if(h)h.shielded=true;const sq=G.squad;G.rings.push({x:sq.x,z:sq.z,t:0});burst(sq.x,1.4,sq.z,14,'190,230,120');ftext('¡ESCUDO DE ROBLE!','#c8ff8a',sq.x,2.4,sq.z+1,1);sfx.tink();return;}
  if(h&&h.shielded)return;
  for(let j=S.length-1;j>=0;j--)if(test(S[j]))killSoldierAt(j);}
function updHazards(dt){const H=G.hz;
  for(let i=H.length-1;i>=0;i--){const h=H[i];h.t+=dt;
    if(h.mv){const k=clamp((h.t-h.warn)/h.act,0,1);const cx=lerp(h.mv[0],h.mv[1],k);h.x0=cx-h.w/2;h.x1=cx+h.w/2;}
    if(h.follow){const [a,b]=laneZ();h.z0=a;h.z1=b;}
    if(h.t>=h.warn&&h.t<h.warn+h.act){
      if(!h.fx){h.fx=true;if(h.type==='circ'){debris(h.x,.4,h.z,8,h.col==='rock'?'120,112,100':'255,150,80');dust(h.x,h.z,3,1.2);shake=Math.max(shake,.25);if(thr('hzc',.08))sfx.slam();}else if(thr('hzr',.12))sfx.impact();}
      if(h.cont||!h.hitOnce){h.hitOnce=true;
        if(h.type==='rect')hzKill(s=>s.wx>h.x0&&s.wx<h.x1&&s.wz>h.z0&&s.wz<h.z1,h.cont?null:h);
        else hzKill(s=>(s.wx-h.x)**2+(s.wz-h.z)**2<h.r*h.r,h);}
      if(h.type==='rect'&&Math.random()<.6)part({x:rnd(h.x0,h.x1),y:.2,z:rnd(Math.max(h.z0,G.squad.z-4),Math.min(h.z1,G.squad.z+14)),vx:0,vy:rnd(1,3),vz:0,l:.35,m:.35,sz:rnd(.08,.16),c:HZC[h.col]||HZC.fire,t:0});}
    if(h.t>=h.warn+h.act){if(h.then)h.then();H.splice(i,1);}}}
function bpShoot(x,z,tx,tz,kind,sp){const d=Math.max(.1,Math.hypot(tx-x,tz-z));sp=sp||14;G.bp.push({x,z,vx:(tx-x)/d*sp,vz:(tz-z)/d*sp,kind:kind||'fire',life:4});}
function updBP(dt){const S=G.soldiers,P=G.bp;
  for(let i=P.length-1;i>=0;i--){const p=P[i];p.x+=p.vx*dt;p.z+=p.vz*dt;p.life-=dt;let gone=p.life<=0||p.z<G.squad.z-6;
    if(!gone)for(let j=S.length-1;j>=0;j--){const s=S[j];if((s.wx-p.x)**2+(s.wz-p.z)**2<.5){if(G.nk>=10&&Math.random()<.5){burst(p.x,1,p.z,5,'200,220,255');sfx.tink();}
        else hzKill(o=>(o.wx-p.x)**2+(o.wz-p.z)**2<1.1,{});burst(p.x,1,p.z,8,p.kind==='skull'?'150,255,170':'255,150,60');gone=true;break;}}
    if(gone)P.splice(i,1);}}
// ---------- ataques ----------
function bossSummon(n,pals,link){const b=G.boss,hp=Math.round(34*Math.pow(hpScale(G.lv),.8))*G.hpMul;
  for(let i=0;i<n;i++){const pal=pals[(Math.random()*pals.length)|0];G.zombies.push({x:clamp(b.x+rnd(-4,4),-ROAD,ROAD),z:b.z-2.5+rnd(0,2),sp:rnd(1.3,2),hp:link?hp*2:hp,max:link?hp*2:hp,br:false,run:false,sh:false,cd:1,cd2:2,shoot:0,ph:Math.random()*TAU,off:rnd(-1.6,1.6),pal,hit:0,dead:false,kd:2,sz:0,link:!!link,role:pal===9?'shield':undefined});}
  G.zombies.sort((a,c)=>a.z-c.z);dust(b.x,b.z-2,6,1.2);}
function convertFront(k,pal){const S=G.soldiers,idx=S.map((s,i)=>i).sort((a,b)=>S[b].oz-S[a].oz).slice(0,Math.min(k,S.length)).sort((a,b)=>b-a),hp=Math.round(34*Math.pow(hpScale(G.lv),.8))*G.hpMul;
  for(const i of idx){const s=S[i];if(s.v===6&&s.hp>1){s.hp--;continue;}G.zombies.push({x:s.wx,z:s.wz+2.2,sp:1.2,hp,max:hp,br:false,run:false,sh:false,cd:1,cd2:2,shoot:0,ph:0,off:rnd(-1,1),pal,hit:0,dead:false,kd:2,sz:0});burst(s.wx,1,s.wz,6,pal===6?'150,255,170':'184,106,255');S.splice(i,1);G.lost++;}
  G.zombies.sort((a,c)=>a.z-c.z);}
function doAttack(a){const b=G.boss,sq=G.squad,[z0,z1]=laneZ(),tx=clamp(sq.x+rnd(-.6,.6),-3.4,3.4);b.last=a;
  switch(a){
    case 'punch':case 'claws':case 'wave':G.shock.push({x:tx,w:3.1,warn:.9,front:0,on:false,sp:28});break;
    case 'charge':G.shock.push({x:tx,w:4.4,warn:.75,front:0,on:false,sp:42});setTimeout(()=>{if(G&&G.boss===b&&b.st==='fight')b.z=Math.max(sq.z+8,b.z-3);},800);break;
    case 'claws2':for(const d of [-1,1])G.shock.push({x:clamp(sq.x+d*2.3,-3.6,3.6),w:2.6,warn:.9,front:0,on:false,sp:30});break;
    case 'rocks':{const n=b.ph2?5:3;for(let i=0;i<n;i++)hzCirc({x:clamp(sq.x+rnd(-2.4,2.4),-4,4),z:sq.z+rnd(-.5,4),r:1.5,warn:1.1+i*.12,col:'rock'});}break;
    case 'beamG':hzRect({x0:tx-.9,x1:tx+.9,z0,z1,warn:.8,act:.7,cont:true,col:'green',follow:true});break;
    case 'eggRay':hzRect({x0:tx-.8,x1:tx+.8,z0,z1,warn:.7,act:.6,cont:true,col:'violet',follow:true});break;
    case 'rays':for(const d of [-1,1]){const x=clamp(sq.x+d*rnd(.6,1.8),-4,4);hzRect({x0:x-.8,x1:x+.8,z0,z1,warn:.9,act:.6,cont:true,col:'gold',follow:true});}break;
    case 'shield':bossSummon(6,[6],true);b.link=6;b.immune=14;G.banner2={txt:'¡ESCUDO DE HUESO!',sub:'Mata a los esqueletos que lo sostienen',t:2,col:'#bfffc8'};break;
    case 'curse':convertFront(4+b.tier,6);ftext('¡MALDICIÓN!','#bfffc8',sq.x,2.6,sq.z+1,1.3);sfx.bad();break;
    case 'shadow':convertFront(6,4);ftext('¡SOMBRAS!','#d8b8ff',sq.x,2.6,sq.z+1,1.3);sfx.bad();break;
    case 'tele':{burst(b.x,5,b.z-1,20,'150,255,170');b.x=b.x>0?-3:3;burst(b.x,5,b.z-1,20,'150,255,170');for(let k=-2;k<=2;k++)bpShoot(b.x,b.z-2,sq.x+k*1.6,sq.z,'skull',13);sfx.slash();}break;
    case 'fireLane':hzRect({x0:tx-1.2,x1:tx+1.2,z0,z1,warn:.9,act:1,cont:true,col:'fire',follow:true});break;
    case 'tail':{const s=sq.x<0?-1:1;hzRect({x0:s<0?-ROAD-1:0,x1:s<0?0:ROAD+1,z0:sq.z-5,z1:sq.z+8,warn:1,act:.25,col:'rock'});}break;
    case 'sweep':{const o=Math.random()<.5?[-3.1,0,3.1]:[3.1,0,-3.1];o.forEach((x,i)=>hzRect({x0:x-1.55,x1:x+1.55,z0,z1,warn:.6+i*.38,act:.35,col:'fire',follow:true}));}break;
    case 'flight':b.fly=6;b.fbT=.8;G.banner2={txt:'¡ALZA EL VUELO!',sub:'Esquiva las bolas de fuego',t:1.8,col:'#ffb46a'};break;
    case 'fireballs':for(let k=-1;k<=1;k++)bpShoot(b.x+k*2,b.z-2,sq.x+k*1.5,sq.z,'fire',13);break;
    case 'trident':hzRect({x0:tx-.7,x1:tx+.7,z0,z1,warn:.5,act:.3,col:'lava',follow:true});break;
    case 'imps':bossSummon(6,[7]);break;
    case 'cracks':for(const d of [-1,1]){const x=clamp(sq.x+d*rnd(.4,2),-4,4);hzRect({x0:x-.7,x1:x+.7,z0,z1,warn:.8,act:3,cont:true,col:'lava',follow:true});}break;
    case 'meteors':case 'debris':for(let i=0;i<7;i++)hzCirc({x:rnd(-4,4),z:sq.z+rnd(-1,6),r:1.3,warn:.8+i*.14,col:a==='debris'?'void':'fire'});break;
    case 'sentence':case 'burn':{const x=tx;hzRect({x0:x-1.3,x1:x+1.3,z0,z1,warn:1.2,act:.2,col:'gold',follow:true,seal:true,
      then:(a==='burn'||b.tier>=1)?()=>hzRect({x0:x-1.3,x1:x+1.3,z0:laneZ()[0],z1:laneZ()[1],warn:0,act:2,cont:true,col:'fire',follow:true}):null});}break;
    case 'chains':{const S=G.soldiers;let k=0;for(const s of S)if(Math.random()<.35){s.ch=3;k++;}G.chainX=sq.x;if(k){ftext('¡ENCADENADOS!','#c8c8d8',sq.x,2.6,sq.z+1,1.2);sfx.bad();}}break;
    case 'countdown':if(!G.countdown){G.countdown={t:10,need:b.max*.05,dealt:0};G.banner2={txt:'¡CONDENA!',sub:'Quítale vida antes de que acabe la cuenta',t:2,col:'#ffe27a'};}break;
    case 'cells':{const safe=(Math.random()*3)|0,cw=ROAD*2/3;for(let i=0;i<3;i++)if(i!==safe)hzRect({x0:-ROAD+i*cw,x1:-ROAD+(i+1)*cw,z0:sq.z-5,z1:sq.z+7,warn:1.6,act:.3,col:'gold'});G.banner2={txt:'¡JUICIO FINAL!',sub:'Busca la celda a salvo',t:1.6,col:'#ffe27a'};}break;
    case 'tentacles':{const S=G.soldiers;for(let i=0;i<4&&S.length;i++){const s=S[(Math.random()*S.length)|0];hzCirc({x:s.wx,z:s.wz,r:1.1,warn:1,act:.35,col:'violet'});}}break;
    case 'intang':b.intang=4.5;G.banner2={txt:'¡INTANGIBLE!',sub:'Solo el huevo recibe daño: apunta al centro',t:1.8,col:'#d8b8ff'};break;
    case 'laser':{const s=Math.random()<.5?1:-1;hzRect({x0:-s*5-.8,x1:-s*5+.8,w:1.6,mv:[-s*5,s*5],z0,z1,warn:.7,act:2.6,cont:true,col:'violet',follow:true});}break;
    case 'gravity':G.grav=4;hzCirc({x:0,z:sq.z+1,r:2.3,warn:1.4,act:2,cont:true,col:'void'});G.banner2={txt:'¡GRAVEDAD!',sub:'Resiste: aléjate del centro',t:1.6,col:'#d8b8ff'};break;
    case 'absorb':{const k=Math.max(1,Math.round(G.soldiers.length*.08));const S=G.soldiers;for(let i=0;i<Math.min(k,S.length);i++){const s=S[i];for(let q=0;q<4;q++)part({x:s.wx,y:1,z:s.wz,vx:(b.x-s.wx)*.6,vy:2,vz:(b.z-s.wz)*.6,l:.6,m:.6,sz:.12,c:'200,170,255',t:3});}
      hzKill(()=>false,null);removeSoldiers(Math.min(k,G.soldiers.length));ftext('¡ABSORCIÓN!','#d8b8ff',sq.x,2.6,sq.z+1,1.2);sfx.boom();}break;
  }}
function pickAtk(b){const L=bossAtkList(b);let a=L[(Math.random()*L.length)|0];if(L.length>1&&a===b.last)a=L[(L.indexOf(a)+1)%L.length];return a;}
function updBoss(dt){
  const b=G.boss,sq=G.squad;b.t+=dt;b.flash-=dt;b.sz=b.z;
  if(b.st==='idle'){b.roarT-=dt;if(b.roarT<=0&&b.z-sq.z<95){b.roarT=rnd(6,9);sfx.roar();}return;}
  if(b.st==='fight'){
    if(b.block!==5&&b.block!==6&&Math.random()<dt*3)for(const sd of [-1,1])smoke(b.x+sd*2.4*BOSS_K,7.6*BOSS_K,b.z+.5);
    if(G.phase!=='boss'){b.raise=Math.max(0,b.raise-dt*4);return;}
    b.ft+=dt;if(b.immune>0){b.immune-=dt;if(b.immune<=0){b.immune=0;b.link=0;for(const z of G.zombies)z.link=false;}}
    if(b.intang>0)b.intang-=dt;
    const hasPh2=b.tier>=4||b.block>=5;
    if(hasPh2&&!b.ph2&&b.hp<b.max*(b.block===6?.66:.5)){b.ph2=true;G.banner2={txt:b.block===6?'¡FASE 2!':'¡FASE FINAL!',sub:'Ataca más rápido',t:1.8,col:'#ff9a8a'};sfx.roar();shake=.8;}
    if(b.block===6&&!b.ph3&&b.hp<b.max*.33){b.ph3=true;G.banner2={txt:'¡FASE 3!',sub:'El agujero negro crece',t:1.8,col:'#ffb46a'};sfx.roar();shake=1;}
    const enrT=G.daily&&G.daily.m==='furia'?20:35;if(!b.enr&&b.ft>enrT){b.enr=true;G.banner2={txt:'¡FURIA!',sub:'El jefe se enfurece: termínalo rápido',t:2,col:'#ff6a5a'};sfx.roar();shake=.8;}
    b.lift=b.fly>0?Math.min(1,b.lift+dt*1.5):Math.max(0,b.lift-dt*1.5);
    if(b.fly>0){b.fly-=dt;b.fbT-=dt;if(b.fbT<=0){b.fbT=b.ph2?.7:1.05;bpShoot(b.x,b.z-2,sq.x+rnd(-1.5,1.5),sq.z+rnd(-1,2),'fire',15);}}
    if(G.grav>0){G.grav-=dt;sq.tx+=(0-sq.tx)*Math.min(1,dt*1.6);}
    if(G.chainX!=null){if(Math.abs(sq.x-G.chainX)>2.4){for(const s of G.soldiers)s.ch=0;G.chainX=null;ftext('¡CADENAS ROTAS!','#ffffff',sq.x,2.6,sq.z+1,1.2);sfx.shatter();}else if(!G.soldiers.some(s=>s.ch>0))G.chainX=null;}
    if(G.countdown){const c=G.countdown;c.t-=dt;if(c.dealt>=c.need){G.countdown=null;ftext('¡ABSUELTO!','#ffe27a',sq.x,2.8,sq.z+1,1.4);sfx.good();}
      else if(c.t<=0){G.countdown=null;const k=Math.round((G.soldiers.length+G.reserve)*.25);const fr=Math.min(G.reserve,k);G.reserve-=fr;removeSoldiers(Math.min(G.soldiers.length,k-fr));ftext('¡EJECUCIÓN!','#ff6a5a',sq.x,2.8,sq.z+1,1.4);shake=1;sfx.boom();}}
    if(b.raiseT>0){b.raiseT-=dt;b.raise=Math.min(1,b.raise+dt*3);if(b.raiseT<=0){shake=Math.max(shake,.5);sfx.quake();buzz(90);if(!b.lift){dust(b.x-2.5*BOSS_K,b.z-1,8,1.6);dust(b.x+2.5*BOSS_K,b.z-1,8,1.6);}}}
    else{b.raise=Math.max(0,b.raise-dt*6);if(b.z-sq.z>7.5&&!(b.fly>0)){b.z-=b.spd*(b.enr?2:1)*dt;b.walk+=dt*2.2;}else b.walk+=dt*.8;b.x+=clamp(sq.x*.4-b.x,-1,1)*dt*.6;}
    b.atk-=dt;
    if(b.atk<=0&&b.raiseT<=0){const iv=Math.max(1.3,3.3-.16*b.tier-.07*b.block)*(b.ph2?.72:1)*(b.ph3?.8:1)*(b.enr?.6:1);b.atk=iv;const a=pickAtk(b);b.raiseT=.85;doAttack(a);}
    b.sum-=dt;if(b.sum<=0){b.sum=Math.max(4.5,7.5-.2*b.tier-.15*b.block);const E=SCN.pal.en,pals=SUMP[b.block]||E.n;bossSummon(5+Math.min(12,b.tier*2+b.block),pals);}
    if(b.z-sq.z<=7.6&&G.soldiers.length){b.cr-=dt;if(b.cr<=0){b.cr=2.2;b.raise=1;const k=Math.max(1,Math.round(G.soldiers.length*.15));removeSoldiers(k);shake=1.1;sfx.quake();buzz(120);ftext('¡APLASTA!','#ff6a5a',sq.x,2.6,sq.z+1,1.3);}}
  }
  if(b.st==='dying'){b.dieT+=dt;if(Math.random()<.6)burst(b.x+rnd(-4,4),rnd(2,12),b.z-1,4,'255,200,120');if(Math.random()<.25)dust(b.x+rnd(-4,4),b.z,2,1.5);if(b.dieT>2.2)b.st='dead';}
}
function updShock(dt){
  const sq=G.squad,b=G.boss;
  for(let i=G.shock.length-1;i>=0;i--){const s=G.shock[i];
    if(!s.on){s.warn-=dt;if(s.warn<=0){s.on=true;s.front=b.z-2;}continue;}
    const f0=s.front;s.front-=(s.sp||28)*dt;
    hzKill(so=>so.wz<=f0&&so.wz>s.front&&Math.abs(so.wx-s.x)<s.w/2,s);
    if(Math.random()<.9)debris(s.x+rnd(-s.w/2,s.w/2),.3,s.front,2);
    if(s.front<sq.z-6)G.shock.splice(i,1);
  }
}
function bossDie(){
  const b=G.boss;if(b.st==='dying'||b.st==='dead')return;
  b.st='dying';b.dieT=0;G.hs=.3;for(let i=0;i<14;i++)flyCoin(b.x+rnd(-3,3),rnd(2,8),b.z-1);b.dieDir=Math.random()<.5?-1:1;b.hp=0;G.phase='win';G.endT=0;
  G.coins+=Math.round((60+Math.min(G.lv,60)*15)*G.goldMul);shake=1.4;sfx.boom();setTimeout(()=>sfx.win(),700);buzz(250);
  for(const z of G.zombies)killZombie(z,false);G.shock.length=0;G.hz.length=0;G.bp.length=0;G.countdown=null;G.grav=0;for(const s of G.soldiers)s.ch=0;G.flashScr=.25;
  if(b.block===5&&G.lv===59)G.banner2={txt:'¡EL HUEVO SE ROMPE!',sub:'Algo despierta en su interior…',t:2.4,col:'#d8b8ff'};
  if(b.block===6)G.banner2={txt:'¡EL CAOS HA CAÍDO!',sub:'',t:2.4,col:'#ffe27a'};
}
// ---------- bucle principal ----------
function reviveCost(){return 60+Math.min(G.lv,80)*12;}
function canRevive(){return !G.revived&&!G.demo&&(save.coins+G.coins)>=reviveCost();}
function openRevive(){state='revive';musStop();const c=reviveCost();$('revCost').textContent=String(c);$('revScr').classList.remove('hidden');sfx.lose();}
function doRevive(yes){if(state!=='revive')return;$('revScr').classList.add('hidden');
  if(yes&&canRevive()){let c=reviveCost();const fromRun=Math.min(G.coins,c);G.coins-=fromRun;c-=fromRun;save.coins-=c;persist();G.revived=true;
    G.hz.length=0;G.bp.length=0;G.shock.length=0;G.countdown=null;G.grav=0;G.boss.z=Math.max(G.boss.z,G.squad.z+16);G.boss.cr=3;
    addSoldiersRaw(25+save.up.rec,true);G.banner2={txt:'¡DE PIE, LEGIÓN!',sub:'Una sola oportunidad',t:2,col:'#9ff0ff'};state='play';musStart();last=performance.now();sfx.good();return;}
  G.revived=true;G.phase='lose';G.endT=0;state='play';last=performance.now();}
function update(dt){
  if(G&&G.hs>0){G.hs-=dt;return;}
  const g=G,sq=g.squad;g.time+=dt;
  if(g.demo){demoUpdate(dt);return;}
  const alive=g.phase==='run'||g.phase==='boss';
  if(g.tut)tutTick(dt);
  if(g.soldiers.length>(g.peak||0))g.peak=g.soldiers.length;
  if(alive){if(keys.l)sq.tx-=10*dt;if(keys.r)sq.tx+=10*dt;}
  const n=g.soldiers.length,rad=formRad(n)*(g.cmp||1);let lo=-Math.max(0,ROAD-rad*.9),hi=Math.max(0,ROAD-rad*.9);
  const F=g.fork;if(F){forkTick(g,sq,dt);}
  sq.tx=clamp(sq.tx,lo,hi);sq.x+=(sq.tx-sq.x)*Math.min(1,dt*14);
  const Br=g.bridge,inB=Br&&sq.z>Br.z0-9&&sq.z<Br.z1+1,inF=false;g.cmp+=(((inB||inF)?.5:1)-g.cmp)*Math.min(1,dt*3);
  if(g.phase==='run'&&sq.z>=g.L-22){g.phase='boss';startBoss();}
  const slow=g.guard&&g.guard.st==='lock';
  const tsp=g.phase==='run'?(slow?SLOW:RUN):0;sq.sp+=(tsp-sq.sp)*Math.min(1,dt*(tsp>sq.sp?1.6:2.6));
  sq.z+=sq.sp*dt;
  cam.z=sq.z-CAM_D;cam.x+=(sq.x*.35-cam.x)*Math.min(1,dt*4);
  updSoldiers(dt);
  if(alive)fire(dt);
  updBullets(dt);updEB(dt);spawnWaves();updZombies(dt);
  if(alive){gatesPass();cratesPass();updEvents(dt);updUnits(dt);}
  updGuard(dt);updBoss(dt);updShock(dt);updHazards(dt);updBP(dt);updSlash(dt);updParts(dt);
  if(alive&&g.reserve>0&&g.soldiers.length<MAX_SQUAD){g.refT-=dt;if(g.refT<=0){const k=g.soldiers.length===0?Math.min(g.reserve,12):1;g.refT=.12;g.reserve-=k;addSoldiersRaw(k,false);}}
  if(alive)g.meter=Math.min(1,g.meter+dt*.008*(1+.15*save.up.slash)*(1+.6*g.bl.magic));
  if(alive&&g.cards>0&&g.phase==='run'&&state==='play'&&!g.banner2){openCards();return;}
  if(alive&&g.soldiers.length===0&&g.reserve===0){if(g.phase==='boss'&&canRevive()){openRevive();return;}g.phase='lose';g.endT=0;sfx.lose();buzz(200);}
  if(g.phase==='win'||g.phase==='lose'){g.endT+=dt;if(g.endT>(g.phase==='win'?2.4:1.5)&&!g.shown){g.shown=true;showEnd();}}
  if(g.banner>0)g.banner-=dt;if(g.banner2){g.banner2.t-=dt;if(g.banner2.t<=0)g.banner2=null;}if(g.flashScr>0)g.flashScr-=dt;
}
// ---------- pantallas ----------
let NEXT_MODE='next';
function startGame(opts){initAudio();sfx.click();
  if(!(opts&&opts.daily)){if(NEXT_MODE==='menu'){NEXT_MODE='next';toMenu();return;}if(NEXT_MODE==='daily'){opts={daily:dailyInfo()};}else if(NEXT_MODE==='tut'){opts={tut:true};}}
  NEXT_MODE='next';musStart();COINXY=null;CF.length=0;const daily=opts&&opts.daily?opts.daily:null;
  const tut=!daily&&((opts&&opts.tut)||(!save.tut&&save.best<=1&&save.level<=1));
  newRun(daily?daily.lv:tut?0:save.level,false,{daily});hc={};moved=false;state='play';show(null);$('cardScr').classList.add('hidden');$('revScr').classList.add('hidden');hud.root.classList.remove('hidden');perf.reset();
  if(daily)G.banner2={txt:'DESAFÍO DIARIO',sub:daily.name,t:2.6,col:'#ffe27a'};else if(G.lv>MAXLV)G.banner2={txt:'MODO INFINITO',sub:'Ronda '+(G.lv-MAXLV),t:2.4,col:'#d8b8ff'};}
function showEnd(){
  musStop();state='end';const win=G.phase==='win',surv=G.soldiers.length,res=G.reserve,gf=G.guard&&G.guard.st==='ally',tot=surv+res;
  let earned=G.coins;if(win)earned+=Math.round((25+surv*2+Math.min(G.lv,60)*10)*G.goldMul)+res;
  let stars=0;if(win){stars=1+(gf?1:0)+(tot>=40?1:0);}
  const daily=G.daily;let dailyMsg='';
  if(daily&&win&&save.daily!==daily.key){earned+=daily.reward;save.daily=daily.key;dailyMsg='+'+daily.reward+' desafío';}
  save.coins+=earned;
  const tutEnd=G.lv===0;if(tutEnd){stars=0;if(win)save.tut=true;}
  const v4rows=v4End(win,tutEnd,stars);
  if(win&&!daily&&!tutEnd){save.stars[G.lv]=Math.max(save.stars[G.lv]||0,stars);save.level=G.lv+1;save.best=Math.max(save.best,save.level);}
  persist();
  const fin=win&&G.lv===MAXLV&&!daily;
  $('eTitle').textContent=fin?'¡EL CAOS HA CAÍDO!':tutEnd&&win?'¡TUTORIAL COMPLETADO!':win?'¡CAMINO DESPEJADO!':'LA HORDA TE ALCANZÓ';
  $('eSub').textContent=tutEnd?(win?'Ya sabes lo esencial: comienza el Sendero':'Etapa 0 · inténtalo otra vez'):fin?'Completaste el Sendero del Orbe · se abre el modo infinito':daily?(win?'Desafío diario superado':'Desafío diario · inténtalo otra vez'):win?('Nivel '+G.lv+' completado · '+'★'.repeat(stars)+'☆'.repeat(3-stars)):'Nivel '+G.lv+' · mejora tu legión y vuelve';
  const st=$('eStats');st.replaceChildren();
  const rows=[['Enemigos derrotados',G.kills],['Tropas en pie',surv+(res?' +'+res:'')],['Guardián',G.guard?(gf?'Liberado':'Perdido'):'—'],['Monedas ganadas','+'+earned+(dailyMsg?' ('+dailyMsg+')':'')]];
  if(win&&!daily&&!tutEnd){rows.push(['Estrellas','★'.repeat(stars)+'☆'.repeat(3-stars)]);if(stars<3)rows.push(['Para 3 ★',[gf?'':'liberar al guardián',tot<40?'40+ tropas':''].filter(Boolean)]);}
  rows.push(...v4rows);const newAch=checkAch(true);if(newAch.length)rows.push([newAch.length>1?'¡Logros!':'¡Logro!',newAch.map(a=>a.name).concat('+'+newAch.reduce((t,a)=>t+a.g,0)+' gemas')]);
  // valores con varias partes (fragmentos, logros): una línea por parte, alineadas a la derecha
  for(const [k,v] of rows){const r=mkEl('div'),b=mkEl('b');if(Array.isArray(v))v.forEach(x=>b.append(mkEl('span','ln',String(x))));else b.textContent=String(v);r.append(mkEl('span',null,k),b);st.append(r);}
  if(daily){NEXT_MODE=win?'menu':'daily';$('bNext').textContent=win?'VOLVER AL MENÚ':'REINTENTAR DESAFÍO';}
  else if(tutEnd){NEXT_MODE=win?'next':'tut';$('bNext').textContent=win?'COMENZAR · NIVEL '+save.level:'REINTENTAR TUTORIAL';}
  else{NEXT_MODE='next';$('bNext').textContent=win?(save.level>MAXLV?'MODO INFINITO · RONDA '+(save.level-MAXLV):'SIGUIENTE · NIVEL '+save.level):'REINTENTAR';}
  $('bNext').classList.toggle('red',!win);
  hud.root.classList.add('hidden');show('endScr');
  if(!daily||win)setTimeout(()=>lbPost(true),300);
}
function renderShop(){
  const list=$('shopList');list.replaceChildren();
  for(const u of UPG){const lv=save.up[u.id],mx=lv>=u.max,c=cost(u,lv);
    const row=mkEl('div','upg'),ic=mkEl('div','ic'),tx=mkEl('div','tx');{const im=new Image();im.alt='';im.src=SPR.icons[u.icon]||'';ic.append(im);}tx.append(mkEl('b',null,u.name+' · Nv '+lv),mkEl('span',null,u.desc));
    const bt=mkEl('button','buy');bt.type='button';
    if(mx){bt.textContent='MÁX';bt.disabled=true;}else{bt.append(mkEl('i','coin'),document.createTextNode(String(c)));bt.disabled=save.coins<c;}
    bt.addEventListener('click',()=>{const l=save.up[u.id];if(l>=u.max)return;const k=cost(u,l);if(save.coins<k)return;save.coins-=k;save.up[u.id]=l+1;persist();initAudio();sfx.crate();renderShop();});
    row.append(ic,tx,bt);list.append(row);}
  $('shopCoins').textContent=String(save.coins);{const e=$('shopGems');if(e)e.textContent=String(save.gems||0);}$('mLv').textContent=save.level>MAXLV?('∞ '+(save.level-MAXLV)):String(save.level);
  const bt=$('mBoss');if(bt)bt.textContent=bossTitle(save.level)+' · '+PALS[ENVB[blockOf(save.level)]].name;
  const ms=$('mStars');if(ms)ms.textContent='ESTRELLAS '+totalStars()+' / '+(MAXLV*3);
  const di=dailyInfo(),bd=$('bDaily');if(bd){bd.textContent=save.daily===di.key?'DESAFÍO DIARIO · HECHO':'DESAFÍO DIARIO · '+di.name;bd.disabled=save.daily===di.key;}
  renderOpts();
}

$('bDaily').addEventListener('click',()=>{const di=dailyInfo();if(save.daily===di.key)return;startGame({daily:di});});
$('bRevYes').addEventListener('click',()=>doRevive(true));
$('bRevNo').addEventListener('click',()=>doRevive(false));
