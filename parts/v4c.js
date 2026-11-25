/* ============================================================
   V4-C · guardianes: catálogo, selección, siete guardianes nuevos (comportamiento y dibujo)
   ============================================================ */
const GUARDS=[
  {id:'ent',n:'TREANT',cost:0,desc:'Ondas de tierra que barren a la horda'},
  {id:'wolves',n:'LOBOS',cost:0,desc:'Jauría que muerde a los enemigos cercanos'},
  {id:'griffin',n:'HIPOGRIFO',cost:0,desc:'Picadas sobre la multitud'},
  {id:'bear',n:'OSO DE GUERRA',cost:2000,desc:'Embiste y rompe filas enemigas'},
  {id:'lions',n:'LEONES GUARDIANES',cost:2500,desc:'Cuidan tus flancos y frenan emboscadas'},
  {id:'centaur',n:'CENTAUROS',cost:3000,desc:'Tres arqueros que galopan a tu lado'},
  {id:'crystal',n:'GÓLEM DE CRISTAL',cost:3500,desc:'Bloquea proyectiles y aplasta el suelo'},
  {id:'dwarves',n:'ENANOS HERREROS',cost:4000,desc:'Forjan en marcha: +25% de daño de flechas'},
  {id:'phoenix',n:'FÉNIX',cost:6000,desc:'Picada de fuego que revive tropas caídas'},
  {id:'valk',n:'VALQUIRIAS',cost:7000,desc:'Lanzas desde el cielo; levantan a los caídos'}];
const GNEED=8,GBASE=['ent','wolves','griffin'];
const GDEF={
  bear:{n:1,type:'pack',free:'¡OSO LIBERADO!',r:2.4,mul:24,cd:2.6,sp:17,boss:.006},
  lions:{n:2,type:'pack',free:'¡LEONES LIBERADOS!',r:1.8,mul:13,cd:1.7,sp:19,boss:.003,flank:true},
  dwarves:{n:3,type:'pack',free:'¡ENANOS LIBERADOS!',r:1.6,mul:9,cd:2.4,sp:12,boss:.002,forge:1.25},
  centaur:{n:3,type:'shoot',free:'¡CENTAUROS LIBERADOS!'},
  crystal:{n:1,type:'tank',free:'¡GÓLEM LIBERADO!'},
  phoenix:{n:1,type:'fly',free:'¡FÉNIX LIBERADO!',r:3.4,mul:16,cd:3.4,boss:.012,revive:2,col:'255,170,60'},
  valk:{n:2,type:'fly',free:'¡VALQUIRIAS LIBERADAS!',r:2.2,mul:12,cd:3.0,boss:.008,revive:1,col:'220,230,255'}};
for(const g of GUARDS)if(GDEF[g.id]){GNAME[g.id]=[g.n,g.n];GFREE[g.id]=[GDEF[g.id].free,GDEF[g.id].free];}
const gUnl=()=>{const u=Array.isArray(save.gu)?save.gu.filter(id=>GUARDS.some(g=>g.id===id)):[];for(const b of GBASE)if(!u.includes(b))u.unshift(b);return GUARDS.map(g=>g.id).filter(id=>u.includes(id));};
function guardKind(lv){if(lv<1)return 'ent';const U=gUnl();if(save.gsel&&U.includes(save.gsel))return save.gsel;return U[(lv-1)%U.length];}
function prepG11(S){const k=(s,h)=>{s.k=h/Math.max(4,s.ay-s.top);return s;};
  const H={phoenix:[2.4,2.8,2.8],crystal:[2.6,3.2,3.6],bear:[1.8,1.6,1.7],centaur:[2.5,2.5,2.5],valk:[2.4,2.8,2.8],lions:[1.5,1.3,1.35],dwarves:[1.0,1.0,1.0]};
  for(const id in S){const o=S[id],h=H[id],ks=Object.keys(o);ks.forEach((p,i)=>k(o[p],h[Math.min(i,2)]));}return S;}
// ---------- liberación ----------
function spawnAllies(gd){const D=GDEF[gd.kind];if(!D)return;G.allies=[];G.forge=D.forge||1;
  for(let i=0;i<D.n;i++)G.allies.push({kind:gd.kind,type:D.type,i,x:gd.x+i*.8,z:gd.z+rnd(-1,1),y:D.type==='fly'?1.2:0,st:D.type==='fly'?'climb':'back',t:0,cd:1+i*.6,tx:0,tz:0,face:1,ph:Math.random()*TAU,kd:15,sz:gd.z,bite:0,shoot:0,slam:0});}
function hitAt(x,z,r,mul,bossMul,ov){const fm=1+.5*G.bl.ent,ad=arrowDmg();
  if(ov)for(const o of G.zombies){if(o.dead||!o.ov)continue;if((o.x-x)**2+(o.z-z)**2<r*r){o.hp-=ad*mul*fm;o.hit=.1;if(o.hp<=0)killZombie(o,true);}}
  allyHit(x,z,r,mul,bossMul);}
function allyTarget(a,flank){const sq=G.squad,b=G.boss;if(G.phase==='boss'&&b.st==='fight')return {x:b.x+rnd(-2.5,2.5),z:b.z-2.2,boss:true};
  if(G.phase!=='run')return null;let best=null,bd=1e9;
  for(const z of G.zombies){if(z.dead||z.caud&&!flank&&false)continue;if(!flank&&z.ov)continue;if(z.z<sq.z-(flank?8:-3)||z.z>sq.z+(flank?14:26))continue;
    const d=flank?Math.abs(z.x-a.x)+Math.abs(z.z-sq.z)*.4:Math.abs(z.x-a.x)+(z.z-sq.z)*.5;if(d<bd){bd=d;best=z;}}
  return best?{x:best.x,z:best.z-(best.ov?-1:best.sp*.3),ov:!!best.ov}:null;}
function updAllies(dt){const A=G.allies;if(!A||!A.length)return;const sq=G.squad,b=G.boss,fk=G.bl.ent?Math.pow(.7,G.bl.ent):1;
  for(const a of A){a.ph+=dt*(a.type==='tank'?6:a.type==='fly'?9:12);a.t+=dt;if(a.bite>0)a.bite-=dt;if(a.shoot>0)a.shoot-=dt;if(a.slam>0)a.slam-=dt;const D=GDEF[a.kind];
    if(a.type==='pack'){
      const fx=D.flank?clamp(sq.x+(a.i?3.2:-3.2),-ROAD-.6,ROAD+.6):clamp(sq.x+(a.kind==='bear'?2.4:(a.i-1)*1.5),-ROAD-.5,ROAD+.5),fz=sq.z+(a.kind==='dwarves'?-1.6:D.flank?.8:4);
      if(a.st==='follow'){const dx=fx-a.x;a.x+=dx*Math.min(1,dt*3);a.z+=(fz-a.z)*Math.min(1,dt*3);if(Math.abs(dx)>.05)a.face=dx>0?1:-1;
        a.cd-=dt;if(a.cd<=0){const t=allyTarget(a,D.flank);if(t){a.st='dash';a.tx=t.x;a.tz=t.z;a.boss=!!t.boss;a.ov=t.ov;}else a.cd=.4;}}
      else{const tx=a.st==='dash'?a.tx:fx,tz=a.st==='dash'?a.tz:fz,dx=tx-a.x,dz=tz-a.z,d=Math.hypot(dx,dz),sp=a.st==='dash'?D.sp:D.sp*.8;
        if(d<.7){if(a.st==='dash'){hitAt(a.tx,a.tz,D.r,D.mul,a.boss?D.boss:0,D.flank);a.bite=.35;a.cd=D.cd*fk;a.st='back';burst(a.tx,.8,a.tz,a.kind==='bear'?14:8,a.kind==='lions'?'255,220,120':'200,190,180');
            if(a.kind==='bear'){shake=Math.max(shake,.3);dust(a.tx,a.tz,4,1.4);}if(a.kind==='dwarves'&&thr('anvil',.2))tone(1500,.06,'square',.03,-200);else if(thr('ally',.15))tone(a.kind==='bear'?120:200,.14,'sawtooth',.05,-60);}else a.st='follow';}
        else{const m=Math.min(d,sp*dt);a.x+=dx/d*m;a.z+=dz/d*m;if(Math.abs(dx)>.1)a.face=dx>0?1:-1;}}}
    else if(a.type==='shoot'){const fx=a.i===2?sq.x:clamp(sq.x+(a.i?3.4:-3.4),-ROAD-1,ROAD+1),fz=sq.z+(a.i===2?-2:1.2);
      a.x+=(fx-a.x)*Math.min(1,dt*3);a.z+=(fz-a.z)*Math.min(1,dt*3);a.face=1;a.cd-=dt;
      if(a.cd<=0&&(G.phase==='run'||G.phase==='boss')){let tx=null,tz=null;
        if(G.phase==='boss'&&b.st==='fight'){tx=b.x+rnd(-1.5,1.5);tz=b.z-1.8;}else{let bd=1e9;for(const z of G.zombies){if(z.dead||z.ov||z.z<a.z+3||z.z>a.z+30)continue;const d=Math.abs(z.x-a.x)*.6+(z.z-a.z);if(d<bd){bd=d;tx=z.x;tz=z.z;}}}
        if(tx!=null){const dz=Math.max(2,tz-a.z);G.bullets.push({x:a.x,z:a.z+.4,d:arrowDmg()*4*(1+.5*G.bl.ent),life:dz/BV+.2,vx:(tx-a.x)/dz*BV,g:0,mg:false,pr:1});a.shoot=.25;a.cd=1.05*fk;if(thr('cent',.12))tone(620,.06,'triangle',.03,-200);}else a.cd=.3;}}
    else if(a.type==='tank'){const fx=clamp(sq.x*.85,-ROAD+1,ROAD-1),fz=sq.z+5.5;a.x+=(fx-a.x)*Math.min(1,dt*2.2);a.z+=(fz-a.z)*Math.min(1,dt*2.5);
      for(let i=G.eb.length-1;i>=0;i--){const e=G.eb[i];if(Math.abs(e.x-a.x)<2.8&&e.z>a.z-1&&e.z<a.z+2.5){G.eb.splice(i,1);burst(e.x,1.2,e.z,4,'170,240,255');if(thr('crys',.15))tone(1800,.05,'sine',.02,400);}}
      a.cd-=dt;if(a.cd<=0&&(G.phase==='run'||G.phase==='boss')){a.cd=3*fk;a.slam=.4;const bz=G.phase==='boss'&&b.st==='fight';hitAt(a.x,a.z+2,2.9,15,bz?.006:0);G.rings.push({x:a.x,z:a.z+2,t:0});shards(a.x,1,a.z+2,18);shake=Math.max(shake,.35);sfx.impact();}}
    else{// voladores
      const hx=clamp(sq.x*.4+Math.sin(G.time*.7+a.i*2)*2.4+(a.i?1.4:-1.4)*(D.n>1?1:0),-4,4),hz=sq.z+(G.phase==='boss'?14:12)+a.i*1.5;
      if(a.st==='climb'||a.st==='hover'){a.x+=(hx-a.x)*Math.min(1,dt*1.5);a.z+=(hz-a.z)*Math.min(1,dt*2);a.y+=(6-a.y)*Math.min(1,dt*2);if(a.st==='climb'&&a.y>5.4)a.st='hover';
        a.cd-=dt;if(a.st==='hover'&&a.cd<=0&&(G.phase==='run'||G.phase==='boss')){let t=null;if(G.phase==='boss'&&b.st==='fight')t={x:b.x+rnd(-2,2),z:b.z-2.2,boss:true};else{const d=densest(6,30);if(d)t={x:d.x,z:d.z-d.sp*.5};}
          if(t){a.st='dive';a.t=0;a.tx=t.x;a.tz=t.z;a.x0=a.x;a.z0=a.z;a.y0=a.y;a.boss=!!t.boss;if(thr('dive'+a.kind,.3))tone(a.kind==='phoenix'?700:1000,.25,'sawtooth',.04,-500);}else a.cd=.5;}}
      else if(a.st==='dive'){const k=Math.min(1,a.t/.5),e=k*k;a.x=lerp(a.x0,a.tx,k);a.z=lerp(a.z0,a.tz,k);a.y=lerp(a.y0,.8,e);
        if(k>=1){hitAt(a.tx,a.tz,D.r,D.mul,a.boss?D.boss:0);G.rings.push({x:a.tx,z:a.tz,t:0});burst(a.tx,.6,a.tz,a.kind==='phoenix'?26:14,D.col);dust(a.tx,a.tz,5,1.5);shake=Math.max(shake,.35);sfx.impact();
          if(D.revive&&G.lost>0&&G.phase!=='lose'){const k2=Math.min(D.revive,G.lost);G.lost-=k2;addSoldiers(k2,false);ftext('+'+k2+' REVIVEN',a.kind==='phoenix'?'#ffd28a':'#e8f0ff',sq.x,3,sq.z+2,1);}
          a.st='climb';a.cd=D.cd*fk;}}}
    a.sz=a.z;}}
// ---------- dibujo ----------
function drawAlly(a){const S=SPR.g11&&SPR.g11[a.kind];if(!S)return;
  if(a.type==='fly'){if(!proj(a.x,0,a.z))return;const sh=Math.max(1,PJ.s*.9*(1-a.y/10));ctx.fillStyle='rgba(10,6,16,.3)';el(ctx,PJ.x,PJ.y,sh*1.6,sh*.55);ctx.fill();
    if(!proj(a.x,a.y,a.z))return;if(a.st==='dive')drawSpr(S.dive,0,PJ.x,PJ.y,1);else drawSpr(S.fly,((a.ph/TAU*4)|0)%4,PJ.x,PJ.y,1);return;}
  if(!proj(a.x,0,a.z))return;
  if(a.type==='tank'){if(a.slam>0)drawSpr(S.atk,0,PJ.x,PJ.y,1);else drawSpr(S.walk,((a.ph/TAU*4)|0)%4,PJ.x,PJ.y,1);return;}
  const busy=a.type==='shoot'?a.shoot>0:a.bite>0;
  if(busy)drawSpr(S.bite,0,PJ.x,PJ.y,1,a.face<0);else drawSpr(S.run,((a.ph/TAU*4)|0)%4,PJ.x,PJ.y,1,a.face<0);}
// guardián encerrado (nuevos): altar + criaturas + barrotes que se rompen a disparos
function drawLockedNew(gd,cx,by,s,lk,lost,hpk,cos){const S=SPR.g11&&SPR.g11[gd.kind];if(!S)return;const D=GDEF[gd.kind];
  const pose=S.sit||S.perch,cnt=Math.min(3,D.n),fr=lost?0:(((T*2.5)|0)%pose.n);
  for(let i=0;i<cnt;i++)drawSpr(pose,(fr+i)%pose.n,cx+(cnt>1?(i-(cnt-1)/2)*2.4*s:0)+.4*s,by+(cnt>1&&i===1?-.15*s:0),1,i===0&&cnt>1);
  if(lk){const bars=lost?9:Math.max(0,Math.ceil(9*hpk));ctx.fillStyle=lost?'#3a3a44':'#5a4a3a';const bw=Math.max(1,Math.round(.16*s)),h=Math.round(3.4*s);
    for(let k=0;k<9;k++){if(k>=bars)continue;ctx.fillRect(Math.round(cx+(-3.1+k*.95)*s),Math.round(by-h),bw,h);}
    ctx.fillRect(Math.round(cx-3.3*s),Math.round(by-h),Math.round(8*s),Math.max(1,Math.round(.25*s)));}}
