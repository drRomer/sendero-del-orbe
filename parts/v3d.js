/* ============================================================
   V3-D · guardianes alternados: Ent / Antiguo Errante, lobos / sabuesos, hipogrifo / pegaso
   ============================================================ */
const GUARD_ROT=true; // aprobado por Tomás
const GKIND=GUARD_ROT?['ent','wolves','griffin']:['ent','ent','ent'];
const GNAME={ent:['TREANT','ERRANTE'],wolves:['LOBOS','SABUESOS'],griffin:['HIPOGRIFO','PEGASO']};
const GFREE={ent:['¡TREANT LIBERADO!','¡ERRANTE LIBERADO!'],wolves:['¡LOBOS LIBERADOS!','¡SABUESOS LIBERADOS!'],griffin:['¡HIPOGRIFO LIBERADO!','¡PEGASO LIBERADO!']};
const isCos=()=>GUARD_ROT&&SCN&&(SCN.env==='cosmo'||SCN.env==='void');
const gName=gd=>GNAME[gd.kind||'ent'][isCos()?1:0];
function drawSpr(S,fr,x,y,sc,flip){const k=S.k*PJ.s*(sc||1),w=Math.max(1,Math.round(S.fw*k)),h=Math.max(1,Math.round(S.fh*k));
  if(!flip){ctx.drawImage(S.img,fr*S.fw,0,S.fw,S.fh,Math.round(x-S.ax*k),Math.round(y-S.ay*k),w,h);return;}
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(-1,1);ctx.drawImage(S.img,fr*S.fw,0,S.fw,S.fh,Math.round(-S.ax*k),Math.round(-S.ay*k),w,h);ctx.restore();}
function guardFree(){
  const gd=G.guard;if(!gd||gd.st!=='lock')return;
  gd.st='wake';gd.t=0;gd.hp=0;G.coins+=20;G.cards++;if(!G.demo&&save.st)save.st.guards++;
  shards(gd.x+1,gd.kind==='ent'?5:2,gd.z,gd.kind==='ent'?70:40);burst(gd.x+1,gd.kind==='ent'?5:2,gd.z,30,isCos()?'200,170,255':'190,245,255');
  sfx.shatter();setTimeout(()=>sfx.mech(),450);shake=.7;G.flashScr=.2;buzz(120);
  G.banner2={txt:GFREE[gd.kind||'ent'][isCos()?1:0],sub:'Ahora pelea a tu lado · elige una bendición',t:2.4,col:'#9ff0ff'};
  if(gd.kind==='wolves'){G.pack=[];for(let i=0;i<4;i++)G.pack.push({x:gd.x+i*.6,z:gd.z+rnd(-1,1),st:'back',t:0,cd:rnd(.6,1.4)+i*.4,tx:0,tz:0,face:1,ph:Math.random()*TAU,i,kd:13,sz:gd.z,bite:0});}
  if(GDEF[gd.kind])spawnAllies(gd);
  if(gd.kind==='griffin'){G.grif={x:gd.x+.5,z:gd.z,y:1.2,st:'climb',t:0,cd:1.6,tx:0,tz:0,ty:0,ph:0,kd:14,sz:gd.z,y0:1.2};}
}
function updGuard(dt){
  const gd=G.guard;if(!gd)return;const sq=G.squad;gd.t+=dt;gd.flash-=dt;gd.sz=gd.z;
  switch(gd.st){
    case 'sleep':if(G.phase==='run'&&sq.z>=gd.z-GUARD_LOCK){gd.st='lock';gd.t=0;}break;
    case 'lock':if(sq.z>=gd.z-GUARD_PASS||G.phase!=='run'){gd.st='lost';gd.lit=.12;ftext(gName(gd)+' PERDIDO','#a9bccd',gd.x+3,gd.kind==='ent'?7:3,gd.z,1);sfx.bad();}break;
    case 'wake':
      if(gd.kind!=='ent'){gd.st='ally';break;}
      gd.kneel=Math.max(0,1-Math.max(0,gd.t-.5)/1.3);gd.lit=Math.min(1,.3+gd.t);
      if(gd.t>1.9){gd.st='ally';gd.atk=.8;gd.slab=false;dust(gd.x,gd.z,10,2.2,.4);debris(gd.x,.5,gd.z,14);}
      break;
    case 'ally':{
      if(gd.kind!=='ent'){gd.z=sq.z+15;break;}
      const tz=sq.z+(G.phase==='boss'?16:15),d=tz-gd.z,spd=clamp(d*1.6,-3,RUN*1.7);
      gd.z+=spd*dt;gd.x+=(-7.1-gd.x)*Math.min(1,dt*1.5);gd.walk+=Math.abs(spd)*dt*.08;
      if(gd.raiseT>0){gd.raiseT-=dt;gd.raise=Math.min(1,gd.raise+dt*2.6);if(gd.raiseT<=0)guardSlam();}
      else{gd.raise=Math.max(0,gd.raise-dt*7);gd.atk-=dt;if(gd.atk<=0&&(G.phase==='run'||G.phase==='boss'))guardPick();}
      if(Math.random()<dt*4)for(const sd of [-1,1])smoke(gd.x+sd*1.9*GUARD_K,(5.6+3.2)*GUARD_K,gd.z+.4);
    }break;
  }
  for(let i=gd.waves.length-1;i>=0;i--){const w=gd.waves[i];w.t+=dt;
    const k=Math.min(1,w.t/w.dur);if(Math.random()<.8)part({x:lerp(w.x0,w.x1,k)+rnd(-.3,.3),y:.2,z:lerp(w.z0,w.z1,k),vx:rnd(-1,1),vy:rnd(1,4),vz:rnd(-1,1),l:.4,m:.4,sz:rnd(.08,.16),c:isCos()?'200,170,255':'150,240,255',t:0});
    if(w.t>=w.dur){guardImpact(w);gd.waves.splice(i,1);}}
  updPack(dt);updGrif(dt);updAllies(dt);
}
function allyHit(x,z,r,mul,bossMul){const fm=1+.5*G.bl.ent,ad=arrowDmg();
  for(const o of G.zombies){if(o.dead||o.ov)continue;if((o.x-x)**2+(o.z-z)**2<r*r){o.hp-=(o.mini?o.max*.06*mul/10:o.br?ad*mul*1.4:ad*mul)*fm;o.hit=.1;if(o.hp<=0)killZombie(o,true);}}
  for(const c of G.crates)if(!c.dead&&Math.abs(c.x-x)<r&&Math.abs(c.z-z)<r){c.hp-=ad*mul*fm;c.fl=.07;if(c.hp<=0)breakCrate(c,true);}
  for(const ro of G.rolls)if(!ro.dead&&Math.abs(ro.x-x)<r+1&&Math.abs(ro.z-z)<r){ro.hp-=ad*mul*fm;if(ro.hp<=0)breakRoll(ro);}
  const b=G.boss;if(bossMul&&b.st==='fight'&&!(b.immune>0)&&Math.abs(b.z-1.8-z)<r+3){const d=(b.max*bossMul+ad*mul*2)*fm*b.armor;b.hp-=d;if(G.countdown)G.countdown.dealt+=d;b.flash=.1;ftext('−'+Math.round(d),'#9ff0ff',b.x,8,b.z-2,1);if(b.hp<=0)bossDie();}}
function packTarget(w){const sq=G.squad,b=G.boss;if(G.phase==='boss'&&b.st==='fight')return {x:b.x+rnd(-2.5,2.5),z:b.z-2.2,boss:true};
  if(G.phase!=='run')return null;const t=w.i===0?densest(3,26):null;if(t)return {x:t.x,z:t.z-t.sp*.3};
  let best=null,bd=1e9;for(const z of G.zombies){if(z.dead||z.ov||z.z<sq.z+3||z.z>sq.z+26)continue;const d=Math.abs(z.x-(sq.x+(w.i-1.5)*2))+(z.z-sq.z)*.5;if(d<bd){bd=d;best=z;}}return best?{x:best.x,z:best.z-best.sp*.3}:null;}
function updPack(dt){if(!G.pack)return;const sq=G.squad,fk=G.bl.ent?Math.pow(.7,G.bl.ent):1;
  for(const w of G.pack){w.ph+=dt*12;if(w.bite>0)w.bite-=dt;
    const fx=clamp(sq.x+(w.i-1.5)*1.7,-ROAD-.5,ROAD+.5),fz=sq.z+4+(w.i%2)*1.4;
    if(w.st==='follow'){const dx=fx-w.x;w.x+=dx*Math.min(1,dt*3);w.z+=(fz-w.z)*Math.min(1,dt*3);if(Math.abs(dx)>.05)w.face=dx>0?1:-1;
      w.cd-=dt;if(w.cd<=0){const t=packTarget(w);if(t){w.st='dash';w.tx=t.x;w.tz=t.z;w.boss=!!t.boss;}else w.cd=.4;}}
    else{const tx=w.st==='dash'?w.tx:fx,tz=w.st==='dash'?w.tz:fz,dx=tx-w.x,dz=tz-w.z,d=Math.hypot(dx,dz),sp=w.st==='dash'?19:15;
      if(d<.7){if(w.st==='dash'){allyHit(w.tx,w.tz,1.5,9,w.boss?.0035:0);w.bite=.35;w.cd=2.3*fk;w.st='back';burst(w.tx,.8,w.tz,8,isCos()?'160,200,255':'200,190,180');if(thr('wolf',.12))tone(220,.12,'sawtooth',.05,-80);}else w.st='follow';}
      else{const m=Math.min(d,sp*dt);w.x+=dx/d*m;w.z+=dz/d*m;if(Math.abs(dx)>.1)w.face=dx>0?1:-1;}}
    w.sz=w.z;}}
function updGrif(dt){const g=G.grif;if(!g)return;const sq=G.squad,b=G.boss,fk=G.bl.ent?Math.pow(.7,G.bl.ent):1;g.t+=dt;g.ph+=dt*9;
  const hx=clamp(sq.x*.4+Math.sin(G.time*.7)*2.2,-4,4),hz=sq.z+(G.phase==='boss'?14:12);
  if(g.st==='climb'||g.st==='hover'){g.x+=(hx-g.x)*Math.min(1,dt*1.5);g.z+=(hz-g.z)*Math.min(1,dt*2);g.y+=(6-g.y)*Math.min(1,dt*2);if(g.st==='climb'&&g.y>5.4)g.st='hover';
    g.cd-=dt;if(g.st==='hover'&&g.cd<=0&&(G.phase==='run'||G.phase==='boss')){let t=null;if(G.phase==='boss'&&b.st==='fight')t={x:b.x+rnd(-2,2),z:b.z-2.2,boss:true};else{const d=densest(6,30);if(d)t={x:d.x,z:d.z-d.sp*.5};}
      if(t){g.st='dive';g.t=0;g.tx=t.x;g.tz=t.z;g.x0=g.x;g.z0=g.z;g.y0=g.y;g.boss=!!t.boss;if(thr('grif',.3))tone(900,.25,'sawtooth',.04,-500);}else g.cd=.5;}}
  else if(g.st==='dive'){const k=Math.min(1,g.t/.5),e=k*k;g.x=lerp(g.x0,g.tx,k);g.z=lerp(g.z0,g.tz,k);g.y=lerp(g.y0,.8,e);
    if(k>=1){allyHit(g.tx,g.tz,3,14,g.boss?.012:0);G.rings.push({x:g.tx,z:g.tz,t:0});burst(g.tx,.6,g.tz,18,isCos()?'220,200,255':'255,230,170');dust(g.tx,g.tz,6,1.6);shake=Math.max(shake,.4);sfx.impact();g.st='climb';g.cd=3.2*fk;}}
  g.sz=g.z;}
function drawPackWolf(w){if(!proj(w.x,0,w.z))return;const W=SPR.wolfS[isCos()?1:0];
  if(w.bite>0)drawSpr(W.bite,0,PJ.x,PJ.y,1,false);else drawSpr(W.run,((w.ph/TAU*4)|0)%4,PJ.x,PJ.y,1,w.face<0);}
function drawGrifAlly(g){if(!proj(g.x,0,g.z))return;const sh=Math.max(1,PJ.s*.9*(1-g.y/10));ctx.fillStyle='rgba(10,6,16,.3)';el(ctx,PJ.x,PJ.y,sh*1.8,sh*.6);ctx.fill();
  if(!proj(g.x,g.y,g.z))return;const S=SPR.grifS[isCos()?1:0];if(g.st==='dive')drawSpr(S.dive,0,PJ.x,PJ.y,1);else drawSpr(S.fly,((g.ph/TAU*4)|0)%4,PJ.x,PJ.y,1);}
function drawGuardian2(gd){
  if(gd.st==='ally'||!proj(gd.x,WALK_Y,gd.z))return;const s=PJ.s*GUARD_K;if(s<.3)return;const cx=PJ.x,cy=PJ.y,cos=isCos(),hpk=gd.max?clamp(gd.hp/gd.max,0,1):0,lost=gd.st==='lost',lk=gd.st==='sleep'||gd.st==='lock'||lost;
  ctx.fillStyle=cos?'#2e2648':'#6f706d';ctx.beginPath();ctx.moveTo(cx-3.8*s,cy);ctx.lineTo(cx+4.6*s,cy);ctx.lineTo(cx+4.1*s,cy-1*s);ctx.lineTo(cx-3.3*s,cy-1.1*s);ctx.closePath();ctx.fill();
  ctx.fillStyle=cos?'#463a6a':'#9a9b98';ctx.fillRect(Math.round(cx-3.3*s),Math.round(cy-1.1*s),Math.round(7.4*s),Math.max(1,Math.round(.2*s)));
  const by=cy-1*s;
  if(gd.kind==='wolves'){const W=SPR.wolfS[cos?1:0];for(let i=0;i<3;i++){const fr=lost?0:(((T*2.5+i*.7)|0)%2);drawSpr(W.sit,fr,cx+(i-1)*1.9*s+.4*s,by+(i===1?-.2*s:0),1);}
    if(lk){const bars=lost?9:Math.max(0,Math.ceil(9*hpk));ctx.fillStyle=cos?'#8a7ad8':'#4a4a56';const bw=Math.max(1,Math.round(.16*s)),h=Math.round(2.9*s);
      for(let k=0;k<9;k++){if(k>=bars)continue;ctx.fillRect(Math.round(cx+(-3.1+k*.95)*s),Math.round(by-h),bw,h);}
      ctx.fillRect(Math.round(cx-3.3*s),Math.round(by-h),Math.round(8*s),Math.max(1,Math.round(.25*s)));}}
  else if(GDEF[gd.kind])drawLockedNew(gd,cx,by,s,lk,lost,hpk,cos);
  else{const S=SPR.grifS[cos?1:0];drawSpr(S.perch,0,cx+.5*s,by,1);
    if(lk){const n=lost?3:Math.max(0,Math.ceil(3*hpk)),ends=[[-3.4,-.4],[4.4,-.4],[.5,-.2]],nx=cx+.5*s,ny=by-2.6*s;ctx.fillStyle=cos?'#9a8ae8':'#7a7a8c';
      for(let k=0;k<n;k++){const [ex,ey]=ends[k],x0=cx+ex*s,y0=by+ey*s,L=Math.max(4,Math.round(Math.hypot(nx-x0,ny-y0)/Math.max(2,s*.35)));for(let q=0;q<=L;q++){const x=Math.round(x0+(nx-x0)*q/L),y=Math.round(y0+(ny-y0)*q/L+Math.sin(q/L*Math.PI)*s*.4);ctx.fillRect(x,y,q%2?2:1,q%2?1:2);}}}}
  if(gd.flash>0){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(Math.round(cx-3.4*s),Math.round(by-3.4*s),Math.round(8*s),Math.round(3.4*s));ctx.globalCompositeOperation='source-over';}
}
function drawGuard(gd){if((gd.kind||'ent')==='ent')drawGuardian(gd);else drawGuardian2(gd);}
