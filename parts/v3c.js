/* ============================================================
   V3-C · dibujo de lo nuevo: portales, cofres dorados, eventos, peligros, jefes, interfaz
   ============================================================ */
function buildSprites(){
  const S8x=Sprites8(mk),S=Sprites9(),U=Sprites10();
  const fix=(s,h,wh)=>{s.k=h/Math.max(4,s.ay-s.top);if(wh&&!s.white)s.white=silhouette(s.img,'#fff');return s;};
  SPR.sol=S.sol.concat(U.sol).map((s,i)=>fix(s,i===8?1.05:1.12));
  SPR.zom=S.zom.concat(U.zom).map((s,i)=>fix(s,[1.1,1.1,1.1,.98,.98,.94,1.12,.98,1.12,1.12,1.0,1.05][i]||1,true));
  SPR.bru=S.bru.map(s=>fix(s,2.25,true));SPR.bru.push(fix(U.mini,3.1,true));
  SPR.log=U.log;SPR.boulder=U.boulder;SPR.props10=U.props;
  SPR.icons={};const IC=S8x.icons();for(const k in IC){const F=mk(20,20),g=F.getContext('2d');g.imageSmoothingEnabled=false;
    g.fillStyle='#26191c';g.fillRect(0,0,20,20);g.fillStyle='#8c7a6b';g.fillRect(0,0,19,19);g.fillStyle='#4a3442';g.fillRect(1,1,18,18);g.fillStyle='#3a2a36';g.fillRect(2,2,16,16);
    g.fillStyle='#a8968a';g.fillRect(1,1,17,1);g.fillRect(1,1,1,17);g.drawImage(IC[k],2,2,16,16);SPR.icons[k]=F.toDataURL();}
  SPR.ic10=U.icons;SPR.icu={};for(const k in U.icons)SPR.icu[k]=U.icons[k].toDataURL();
  const E=S.ent,kl=GUARD_HSTAND/Math.max(10,E.walk.ay-E.walk.top);
  SPR.guard3={stand:E.stand,walk:E.walk,raise:E.raise,kl,cs:clamp((E.stand.ay-E.stand.top)*kl/7.5*1.18,.72,1)};SPR.guardE=SPR.guard3;
  const GS=GuardSprites(),EC=GS.errante,klc=GUARD_HSTAND/Math.max(10,EC.walk.ay-EC.walk.top);
  SPR.guardC={stand:EC.stand,walk:EC.walk,raise:EC.raise,kl:klc,cs:clamp((EC.stand.ay-EC.stand.top)*klc/7.5*1.18,.72,1)};
  SPR.wolfS=GS.wolf.map(o=>({sit:fix(o.sit,1.3),run:fix(o.run,1.1),bite:fix(o.bite,1.25)}));
  SPR.grifS=GS.grif.map(o=>({perch:fix(o.perch,3.6),fly:fix(o.fly,2.8),dive:fix(o.dive,2.8)}));
}
function unitIcon(u,x,y){x=Math.round(x);y=Math.round(y);const I=SPR.ic10&&SPR.ic10[u===6?'knight':u===7?'druid':'catapult'];if(I){ctx.drawImage(I,x-5,y-5,10,10);}}
function drawGate(gt){
  let a=1;if(gt.used){a=gt.chosen?Math.max(0,1-gt.ft/.25):Math.max(0,1-gt.ft/.5);if(a<=0)return;}
  const z=gt.z,x0=Math.max(gt.x0,-ROAD-.3)+.12,x1=Math.min(gt.x1,ROAD+.3)-.12;
  let k=gt.k,v=gt.val;if(k==='rou'){const o=rouCur(gt);k=o.k;v=o.v;}
  const good=gt.unit?true:k==='add'?Math.round(v)>=0:k==='pct'?v>=0:v>=1;
  const col=gt.curse?'150,40,170':gt.unit?'230,190,70':good?(k==='mul'?'90,230,255':'70,130,255'):'255,60,70';
  ctx.globalAlpha=a;
  if(vq(x0+.2,.08,x1-.2,2.5,z)){const r=fr4('rgba('+col+',.42)');
    ctx.fillStyle='rgba(255,255,255,.22)';for(let i=0;i<5;i++){const kk=((T*.7+i/5)%1);ctx.fillRect(r[0],Math.round(r[1]+r[3]*(1-kk)),r[2],1);}
    ctx.fillStyle='rgba('+col+',.9)';ctx.fillRect(r[0],r[1],r[2],1);ctx.fillRect(r[0],r[1]+r[3]-1,r[2],1);
    if(gt.k==='rou'&&Math.sin(T*18)>0){ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(r[0],r[1],r[2],r[3]);}
    if(gt.curse){ctx.fillStyle='rgba(20,0,20,.35)';ctx.fillRect(r[0],r[1],r[2],r[3]);}
    if(gt.fl>0){ctx.fillStyle='rgba(255,255,255,'+Math.min(.55,gt.fl*5)+')';ctx.fillRect(r[0],r[1],r[2],r[3]);}}
  const pc=gt.curse?['#4a2a4a','#6a4a6a','#2a1a2a']:SCN.env==='cosmo'||SCN.env==='void'?['#4a3a7a','#7a6ab0','#2a2050']:SCN.env==='trib'?['#3a2a2c','#5a4446','#22181a']:['#8f8a80','#bbb5a8','#5c5850'];
  for(const px of [x0,x1]){if(vq(px-.24,0,px+.24,2.7,z)){const r=fr4(pc[0]);ctx.fillStyle=pc[1];ctx.fillRect(r[0],r[1],Math.max(1,r[2]>>2),r[3]);ctx.fillStyle=pc[2];ctx.fillRect(r[0]+r[2]-Math.max(1,r[2]>>2),r[1],Math.max(1,r[2]>>2),r[3]);}}
  if(vq(x0-.3,2.55,x1+.3,2.95,z)){const r=fr4(pc[0]);ctx.fillStyle=pc[1];ctx.fillRect(r[0],r[1],r[2],1);ctx.fillStyle=pc[2];ctx.fillRect(r[0],r[1]+r[3]-1,r[2],1);}
  if(vq((x0+x1)/2-.3,2.5,(x0+x1)/2+.3,3.05,z)){fr4('rgb('+col+')');}
  if(proj((x0+x1)/2,1.25,z)){const s=PJ.s>=15?2:1,t=gateLabel(gt)+(gt.k==='rou'?'?':'');const hasIc=k==='add'||k==='pct'||gt.unit;const w=ptext(t,PJ.x+(hasIc?3*s:0),PJ.y,s,gt.curse?'#ffb0f0':gt.unit?'#fff0b0':gt.mg?'#ead8ff':'#ffffff','#101830');
    if(gt.unit)unitIcon(gt.unit,PJ.x-w/2-3,PJ.y+1);else if(k==='add'||k==='pct'){if(gt.mg)hatIcon(PJ.x-w/2-1,PJ.y+3*s-1);else personIcon(PJ.x-w/2-1,PJ.y+3*s-1,s,'#ffffff');}
    if(gt.curse&&PJ.s>5)ptext('JEFE +30%',PJ.x,PJ.y+10*s,1,'#ff9ae8','#101830');
    if(gt.k==='trade'&&PJ.s>4)ptext('TRUEQUE −'+gt.cost,PJ.x,PJ.y+10*s,1,'#ffb0a0','#101830');
    if(gt.k==='rou'&&PJ.s>5)ptext('RULETA',PJ.x,PJ.y-9*s,1,'#ffe27a','#101830');}
  ctx.globalAlpha=1;
}
function drawCrate(c){
  const a=c.dead?Math.max(0,1-c.ft/.3):1;if(a<=0)return;
  const hw=.85,h=1.25,z0=c.z-.6,z1=c.z+.6,x=c.x,w=c.type==='w',gd=c.type==='g';
  ctx.globalAlpha=a;
  const cf=gd?['#b08022','#ffd04a','#6a4a10']:w?['#a8343a','#d8504a','#6a1c24']:['#2f5ab0','#4a7ad8','#1c3a7a'];
  const sd=x>cam.x?-1:1;ctx.fillStyle=cf[2];if(xq(x+sd*hw,0,h,z0,z1))ctx.fill();
  ctx.fillStyle=cf[1];if(gq(x-hw,z0,x+hw,z1,h))ctx.fill();
  if(vq(x-hw,0,x+hw,h,z0)){const r=fr4(cf[0]);ctx.fillStyle='#120c18';ctx.fillRect(r[0]-1,r[1]-1,r[2]+2,1);ctx.fillRect(r[0]-1,r[1]+r[3],r[2]+2,1);ctx.fillRect(r[0]-1,r[1],1,r[3]);ctx.fillRect(r[0]+r[2],r[1],1,r[3]);
    ctx.fillStyle=cf[1];ctx.fillRect(r[0],r[1],r[2],Math.max(1,r[3]>>3));
    ctx.fillStyle=gd?'#fff3b0':'#ffd04a';for(const kk of [.1,.9])ctx.fillRect(Math.round(r[0]+r[2]*kk)-1,r[1],Math.max(1,r[2]>>4),r[3]);ctx.fillRect(r[0],Math.round(r[1]+r[3]*.38),r[2],1);
    const lw=Math.max(2,r[2]>>3);ctx.fillStyle=gd?'#e8333f':'#fff3b0';ctx.fillRect(Math.round(r[0]+r[2]/2-lw/2),Math.round(r[1]+r[3]*.32),lw,lw);
    if(gd&&Math.sin(T*6)>0){ctx.fillStyle='rgba(255,240,170,.25)';ctx.fillRect(r[0],r[1],r[2],r[3]);}
    if(c.fl>0){ctx.fillStyle='rgba(255,255,255,'+Math.min(.6,c.fl*8)+')';ctx.fillRect(r[0],r[1],r[2],r[3]);}}
  if(!c.dead&&proj(x,h+.55,c.z)){const bw=Math.max(18,Math.round(PJ.s*1.6)),bx=Math.round(PJ.x-bw/2),by=Math.round(PJ.y)-3;
    ctx.fillStyle='#120c18';ctx.fillRect(bx-1,by-1,bw+2,9);ctx.fillStyle='#3a2c3a';ctx.fillRect(bx,by,bw,7);ctx.fillStyle=gd?'#ffd04a':w?'#e8404a':'#3f7fe0';ctx.fillRect(bx,by,Math.round(bw*c.hp/c.max),7);
    ptext(String(Math.ceil(c.hp)),PJ.x,by+3.5,1,'#ffffff','#120c18');
    if(PJ.s>6)ptext(gd?'BENDICIÓN':w?'FLECHAS':'ALIADOS',PJ.x,by-7,1,gd?'#ffe27a':w?'#ffb0a0':'#b8d8ff','#120c18');}
  ctx.globalAlpha=1;
}
function drawSoldier(s){
  if(!proj(s.wx,0,s.wz))return;
  const sc=s.pop>0?1-s.pop/.3*.6:1,S=SPR.sol[s.v%SPR.sol.length],n=S.nr||S.n;
  const fr=s.fl>0&&S.shoot!=null?S.shoot:G.squad.sp<.6?0:(((s.ph/TAU*n)|0)%n+n)%n;
  if(s.hurt>0&&Math.sin(T*40)>0)ctx.globalAlpha=.5;
  blit(S,fr,PJ.x,PJ.y,sc);ctx.globalAlpha=1;
  if(s.fl>0&&s.v!==8){const k=S.k*PJ.s*sc;G.flashes.push(PJ.x+(S.mx-S.ax)*k,PJ.y+(S.my-S.ay)*k,PJ.s);}
  if(s.ch>0){const k=S.k*PJ.s,y=Math.round(PJ.y-(S.ay-S.top)*k*.55),x=Math.round(PJ.x);ctx.fillStyle='#9a9ab0';ctx.fillRect(x-2,y,5,1);ctx.fillRect(x-2,y+2,5,1);ctx.fillStyle='#4a4a5c';ctx.fillRect(x-2,y+1,1,1);ctx.fillRect(x+2,y+1,1,1);}
  if(s.pop>0){ctx.fillStyle='rgba(255,230,140,'+(s.pop/.3)+')';const r=PJ.s*.6*(1.6-s.pop*2);for(let i=0;i<10;i++){const a=i/10*TAU;ctx.fillRect(Math.round(PJ.x+Math.cos(a)*r),Math.round(PJ.y+Math.sin(a)*r*.4),1,1);}}
}
function drawZombie(z){
  const yy=z.fly?1.4+Math.sin(z.ph)*.25:0;if(!proj(z.x,yy,z.z))return;
  const S=z.br?SPR.bru[z.pal%SPR.bru.length]:SPR.zom[z.pal%SPR.zom.length],n=S.nr||S.n,fr=z.sh&&z.shoot>0&&S.shoot!=null?S.shoot:(((z.ph/TAU*n)|0)%n+n)%n;
  if(z.fly&&proj(z.x,0,z.z)){ctx.fillStyle='rgba(10,6,16,.3)';el(ctx,PJ.x,PJ.y,PJ.s*.4,PJ.s*.16);ctx.fill();proj(z.x,yy,z.z);}
  if(z.link){ctx.fillStyle='rgba(120,255,150,.25)';el(ctx,PJ.x,PJ.y-PJ.s*.5,PJ.s*.55,PJ.s*.7);ctx.fill();}
  blit(S,fr,PJ.x,PJ.y);
  if(z.hit>0&&S.white){ctx.globalAlpha=Math.min(1,z.hit/.07)*.8;blit(S,fr,PJ.x,PJ.y,1,true);ctx.globalAlpha=1;}
  if((z.br||z.role==='shield')&&z.hp<z.max||z.mini){const bw=Math.max(6,Math.round(PJ.s*(z.mini?2.6:1.3))),bx=Math.round(PJ.x-bw/2),by=Math.round(PJ.y-(S.ay-S.top)*S.k*PJ.s-4);
    ctx.fillStyle='#120c18';ctx.fillRect(bx-1,by-1,bw+2,4);ctx.fillStyle=z.mini?'#ffd04a':'#e8333f';ctx.fillRect(bx,by,Math.round(bw*Math.max(0,z.hp/z.max)),2);
    if(z.mini&&PJ.s>3)ptext('ÉLITE',PJ.x,by-6,1,'#ffe27a','#120c18');}
}
function drawRoll(r){if(r.dead||!proj(r.x,0,r.z))return;const imgs=r.kind==='log'?SPR.log:SPR.boulder,im=imgs[((r.f|0)%imgs.length+imgs.length)%imgs.length];
  const w=Math.round(r.w*2*PJ.s*(r.kind==='log'?1.05:1.1)),h=Math.round(w*im.height/im.width);ctx.drawImage(im,Math.round(PJ.x-w/2),Math.round(PJ.y-h*.92),w,h);
  if(r.fl>0){ctx.globalAlpha=.4;ctx.fillStyle='#fff';ctx.fillRect(Math.round(PJ.x-w/2),Math.round(PJ.y-h*.92),w,h);ctx.globalAlpha=1;}}
function drawEntities(){
  DL.length=0;const zMin=cam.z+.8,zMax=cam.z+175;
  for(const l of SCN.lamps)if(l.z>zMin&&l.z<zMax)DL.push(l);
  for(const o of SCN.props)if(o.z>zMin+1&&o.z<zMax-40)DL.push(o);
  for(const gy of SCN.gantries)if(gy.z>zMin+2&&gy.z<zMax)DL.push(gy);
  if(G){
    for(const g of G.gates)if(g.z>zMin&&g.z<zMax&&!(g.used&&g.ft>.6))DL.push(g);
    for(const c of G.crates)if(c.z>zMin&&c.z<zMax&&!(c.dead&&c.ft>.35))DL.push(c);
    for(const z of G.zombies)if(z.z>zMin&&z.z<zMax)DL.push(z);
    for(const r of G.rolls)if(!r.dead&&r.z>zMin&&r.z<zMax)DL.push(r);
    if(G.pack)for(const w of G.pack)if(w.z>zMin&&w.z<zMax)DL.push(w);
    if(G.grif&&G.grif.z>zMin)DL.push(G.grif);
    for(const s of G.soldiers)DL.push(s);
    for(const c of G.corpses)if(c.z>zMin)DL.push(c);
    if(G.boss.z<zMax+40)DL.push(G.boss);
    if(G.guard&&G.guard.z>zMin&&G.guard.z<zMax)DL.push(G.guard);
    if(SCN.castle&&SCN.castle.z>zMin&&SCN.castle.z<zMax+60)DL.push(SCN.castle);
  }
  DL.sort((a,b)=>b.sz-a.sz);
  if(G)G.flashes.length=0;
  let fogDone=false;const fz=cam.z+FOG_Z;
  for(const e of DL){if(!fogDone&&(e.sz<fz||(e.kd===11&&e.sz-cam.z<80))){drawFog();fogDone=true;}switch(e.kd){case 1:drawSoldier(e);break;case 2:drawZombie(e);break;case 3:drawGate(e);break;case 4:drawCrate(e);break;case 5:drawLamp(e);break;case 6:drawBoss(e);break;case 7:drawCorpse(e);break;case 8:drawGuard(e);break;case 13:drawPackWolf(e);break;case 14:drawGrifAlly(e);break;case 11:drawCastle(e);break;case 9:drawGantry(e);break;case 10:drawProp(e);break;case 12:drawRoll(e);break;}}
  if(!fogDone)drawFog();
}
// ---------- suelo: pinchos, río y puente, bifurcación ----------
function drawEventsGround(){if(!G)return;const zN=cam.z+.7;
  const Br=G.bridge;if(Br&&Br.z1>zN&&Br.z0<cam.z+150){const a=Math.max(Br.z0,zN);
    const env=SCN.env,wc=env==='trib'?['#8a1a08','#ff7a1a']:env==='cosmo'||env==='void'?['#06030e','#6a4aa0']:['#1c4a8a','#3a7ad0'];
    ctx.fillStyle=wc[0];if(gq(-RAIL-2,a,Br.cx-Br.hw,Br.z1,.02))ctx.fill();if(gq(Br.cx+Br.hw,a,RAIL+2,Br.z1,.02))ctx.fill();
    ctx.fillStyle=wc[1];ctx.beginPath();for(let z=Math.floor(a);z<Br.z1;z+=1.3){const o=Math.sin(T*2+z)*.4;gqa(-RAIL-2+o,z+((T*.8)%1.3),Br.cx-Br.hw,z+((T*.8)%1.3)+.2,.025);gqa(Br.cx+Br.hw,z+((T*.8)%1.3)+.6,RAIL+2,z+((T*.8)%1.3)+.8,.025);}ctx.fill();
    ctx.fillStyle='#6a4426';if(gq(Br.cx-Br.hw,Math.max(Br.z0-.6,zN),Br.cx+Br.hw,Br.z1+.6,.03))ctx.fill();
    ctx.fillStyle='#4a2c16';ctx.beginPath();for(let z=Math.ceil(Math.max(Br.z0,zN)*1.4)/1.4;z<Br.z1;z+=.7)gqa(Br.cx-Br.hw,z,Br.cx+Br.hw,z+.08,.035);ctx.fill();
    ctx.fillStyle='#3a2414';for(const x of [Br.cx-Br.hw,Br.cx+Br.hw-.15]){if(gq(x,Math.max(Br.z0-.6,zN),x+.15,Br.z1+.6,.04))ctx.fill();}}
  for(const sp of G.spikes){if(sp.z1<zN||sp.z0>cam.z+120)continue;const a=Math.max(sp.z0,zN);ctx.fillStyle=sp.up?'#2a2630':'#3a3640';if(gq(sp.x0,a,sp.x1,sp.z1,.02))ctx.fill();
    ctx.fillStyle=sp.up?'#d8d8e8':'#5a5866';ctx.beginPath();for(let z=Math.ceil(a/.8)*.8;z<sp.z1;z+=.8)for(let x=sp.x0+.3;x<sp.x1;x+=.8){if(!proj(x,0,z))continue;const h=sp.up?Math.max(1,Math.round(PJ.s*.35)):1;ctx.rect(Math.round(PJ.x),Math.round(PJ.y)-h,1,h);}ctx.fill();}
  const F=G.fork;if(F&&F.z1>zN&&F.z0<cam.z+160){ctx.fillStyle='rgba(30,20,20,.55)';if(gq(-.9,Math.max(F.z0,zN),.9,F.z1,.015))ctx.fill();}
}
// ---------- peligros del jefe ----------
function drawHazards(){if(!G)return;const zN=cam.z+.7,bl=Math.sin(T*20)>0;
  for(const h of G.hz){const warn=h.t<h.warn,c=HZC[h.col]||HZC.fire;
    if(h.type==='rect'){const z0=Math.max(h.z0,zN);if(h.z1<=z0)continue;
      if(warn){ctx.fillStyle='rgba('+HZC.warn+','+(bl?.28:.14)+')';if(gq(h.x0,z0,h.x1,h.z1,.03))ctx.fill();ctx.fillStyle='rgba('+HZC.warn+',.85)';for(const x of [h.x0,h.x1-.1]){ctx.beginPath();for(let z=Math.floor(z0);z<h.z1;z+=1.2)gqa(x,Math.max(z,z0),x+.1,Math.min(z+.6,h.z1),.04);ctx.fill();}
        if(h.seal&&proj((h.x0+h.x1)/2,.05,G.squad.z+3)){const r=PJ.s*1.1;ctx.strokeStyle='rgba(255,220,90,.9)';ctx.lineWidth=1;el(ctx,PJ.x,PJ.y,r,r*.42);ctx.stroke();el(ctx,PJ.x,PJ.y,r*.6,r*.25);ctx.stroke();}}
      else{ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba('+c+','+(bl?.5:.38)+')';if(gq(h.x0,z0,h.x1,h.z1,.04))ctx.fill();ctx.fillStyle='rgba(255,255,255,.25)';const m=(h.x0+h.x1)/2,w=(h.x1-h.x0)*.18;if(gq(m-w,z0,m+w,h.z1,.05))ctx.fill();ctx.globalCompositeOperation='source-over';}}
    else{if(h.z<zN||!proj(h.x,.03,h.z))continue;const r=PJ.s*h.r;
      if(warn){const k=h.t/h.warn;ctx.fillStyle='rgba('+HZC.warn+','+(bl?.3:.16)+')';el(ctx,PJ.x,PJ.y,r,r*.42);ctx.fill();ctx.fillStyle='rgba('+HZC.warn+',.8)';el(ctx,PJ.x,PJ.y,r*k,r*.42*k);ctx.fill();
        if(h.col==='rock'||h.col==='fire'||h.col==='void'){const fy=PJ.y-(1-k)*PJ.s*9;ctx.fillStyle=h.col==='fire'?'#ff9a2a':h.col==='void'?'#6a4aa0':'#8a7a6a';const rr=Math.max(2,Math.round(PJ.s*.5));ctx.fillRect(Math.round(PJ.x-rr/2),Math.round(fy-rr/2),rr,rr);}}
      else{ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba('+c+',.55)';el(ctx,PJ.x,PJ.y,r,r*.42);ctx.fill();ctx.globalCompositeOperation='source-over';}}}}
function drawBP(){if(!G)return;for(const p of G.bp){if(!proj(p.x,1.1,p.z))continue;const r=Math.max(2,Math.round(PJ.s*.32));
  if(p.kind==='skull'){ctx.fillStyle='#2ab84a';ctx.fillRect(Math.round(PJ.x-r),Math.round(PJ.y-r),r*2,r*2);ctx.fillStyle='#e8e2d0';ctx.fillRect(Math.round(PJ.x-r/2),Math.round(PJ.y-r/2),r,r);}
  else{ctx.fillStyle='#fa6a0a';ctx.fillRect(Math.round(PJ.x-r),Math.round(PJ.y-r),r*2,r*2);ctx.fillStyle='#ffd541';ctx.fillRect(Math.round(PJ.x-r/2),Math.round(PJ.y-r/2),r,r);ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(PJ.x),Math.round(PJ.y),1,1);}
  if(Math.random()<.4)part({x:p.x,y:1.1,z:p.z+.3,vx:0,vy:.5,vz:0,l:.25,m:.25,sz:.1,c:p.kind==='skull'?'120,255,150':'255,160,60',t:0});}}
function drawCats(){if(!G)return;for(const c of G.cats){const k=c.t/c.dur,x=lerp(c.x0,c.x1,k),z=lerp(c.z0,c.z1,k),y=1+Math.sin(k*Math.PI)*6;if(!proj(x,y,z))continue;const r=Math.max(2,Math.round(PJ.s*.3));
  ctx.fillStyle='#4a4250';ctx.fillRect(Math.round(PJ.x-r),Math.round(PJ.y-r),r*2,r*2);ctx.fillStyle='#8a8090';ctx.fillRect(Math.round(PJ.x-r),Math.round(PJ.y-r),r,r);}}
function drawBoss3D(b){
  if(b.st==='dead'||!proj(b.x,(b.lift||0)*3.2+(b.block>=5?Math.sin(b.t*1.6)*.4+.6:0),b.z))return;
  const s=PJ.s*BOSS_K;if(s<.5)return;
  ctx.save();ctx.translate(PJ.x,PJ.y);
  if(b.st==='dying'){const k=Math.min(1,b.dieT/1.3);ctx.rotate(k*.4*b.dieDir);ctx.translate(0,k*s*1.2);ctx.globalAlpha=Math.max(0,1-Math.max(0,b.dieT-1.2));}
  if(b.intang>0)ctx.globalAlpha*=.45+.15*Math.sin(b.t*12);
  ctx.scale(s,s);
  ctx.fillStyle=rg(ctx,0,0,.2,4.8,'rgba(0,0,0,.5)','rgba(0,0,0,0)');el(ctx,0,(b.lift||0)*3.2/BOSS_K,4.8,1.15);ctx.fill();
  const TT=SPR.titan,kl=TT.kl;let S,fr;
  if(b.raise>.02){S=TT.raise;fr=Math.min(S.n-1,Math.round(ease(b.raise)*(S.n-1)));}else{S=TT.walk;fr=(((b.walk/TAU*S.n)|0)%S.n+S.n)%S.n;}
  const dx=-S.ax*kl,dy=-S.ay*kl,dw=S.fw*kl,dh=S.fh*kl;
  ctx.drawImage(S.img,fr*S.fw,0,S.fw,S.fh,dx,dy,dw,dh);
  if(b.flash>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.3;ctx.drawImage(S.img,fr*S.fw,0,S.fw,S.fh,dx,dy,dw,dh);ctx.globalCompositeOperation='source-over';}
  if(b.enr&&Math.sin(b.t*8)>.3){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.18;ctx.fillStyle='#ff2a1a';ctx.fillRect(dx,dy,dw,dh*.98);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;}
  const pu=.55+.3*Math.sin(b.t*6),gx=S.mxs?(S.mxs[fr]-S.ax)*kl:0,gy=S.mys?(S.mys[fr]-S.ay)*kl:-4.3,gr=S.mxs?1.5:2.2;ctx.globalCompositeOperation='lighter';ctx.fillStyle=rg(ctx,gx,gy,0,gr,'rgba(255,120,60,'+(.45*pu)+')','rgba(255,60,20,0)');el(ctx,gx,gy,gr,gr);ctx.fill();ctx.globalCompositeOperation='source-over';
  if(b.immune>0){ctx.globalAlpha=.25+.1*Math.sin(b.t*6);ctx.fillStyle='#9affb0';el(ctx,0,dy*.5,dw*.42,-dy*.55);ctx.fill();ctx.globalAlpha=1;}
  ctx.restore();
}
function drawLamp(l){
  const env=SCN.env;if(env==='cosmo'||env==='void'){const y0=1.4+Math.sin(T*1.5+l.z)*.25;if(!proj(l.x,y0,l.z))return;const s=Math.max(2,Math.round(PJ.s*.32)),x=Math.round(PJ.x),y=Math.round(PJ.y);
    ctx.fillStyle=env==='void'?'#ffb46a':'#b86aff';for(let k=0;k<s;k++){ctx.fillRect(x-k,y-s+k,k*2+1,1);ctx.fillRect(x-k,y+s-k,k*2+1,1);}ctx.fillStyle='#ffffff';ctx.fillRect(x,y-1,1,2);
    ctx.globalCompositeOperation='lighter';ctx.fillStyle=env==='void'?'rgba(255,170,90,.12)':'rgba(184,106,255,.14)';const r=Math.max(3,Math.round(PJ.s*1.1));el(ctx,x,y,r,r);ctx.fill();ctx.globalCompositeOperation='source-over';return;}
  if(!proj(l.x,0,l.z))return;const x0=Math.round(PJ.x),y0=Math.round(PJ.y),s=PJ.s;proj(l.x,2.4,l.z);const y1=Math.round(PJ.y);
  const pw=Math.max(1,Math.round(s*.14));ctx.fillStyle=SCN.pal.fence;ctx.fillRect(x0-(pw>>1),y1,pw,y0-y1);ctx.fillStyle='#3a3a44';ctx.fillRect(x0-pw,y1,pw*2+1,Math.max(1,pw));
  const f=Math.max(2,Math.round(s*.34)),fl=Math.sin(T*14+l.z)>0?1:0;
  ctx.fillStyle='#c8361c';ctx.fillRect(x0-(f>>1)-0,y1-f-fl,f+1,f);ctx.fillStyle='#ff8a22';ctx.fillRect(x0-(f>>1)+(f>2?1:0),y1-f+1-fl,Math.max(1,f-1),Math.max(1,f-1));
  ctx.fillStyle='#ffe25a';ctx.fillRect(x0,y1-Math.max(1,f>>1)-fl,1,Math.max(1,f>>1));ctx.fillRect(x0-(fl?0:1),y1-f-1-fl,1,1);
  if(SCN.pal.night){ctx.globalCompositeOperation='lighter';const r=Math.max(3,Math.round(s*1.1)),cy=y1-(f>>1);ctx.fillStyle='rgba(255,160,70,.12)';el(ctx,x0,cy,r,r);ctx.fill();ctx.fillStyle='rgba(255,190,100,.14)';el(ctx,x0,cy,r*.55,r*.55);ctx.fill();ctx.globalCompositeOperation='source-over';}
}
function drawWeather(dt){if(!SCN)return;const P=SCN.wxp||(SCN.wxp=[]),k=SCN.pi,N=k===2?70:k===3?36:k===0?22:k>=4?40:30;
  if(k===3)drawAsh(dt);
  while(P.length<N)P.push({x:Math.random()*W,y:Math.random()*H,v:Math.random(),p:Math.random()*TAU});
  for(const q of P){
    if(k===2){q.y+=dt*(160+q.v*60);q.x-=dt*40;if(q.y>H){q.y=-4;q.x=Math.random()*W*1.2;}ctx.fillStyle='rgba(170,200,255,.4)';ctx.fillRect(q.x|0,q.y|0,1,3);}
    else if(k===3||k===4){q.y-=dt*(14+q.v*20);q.x+=Math.sin(T*2+q.p)*dt*8;if(q.y<HORY){q.y=H+2;q.x=Math.random()*W;}ctx.fillStyle=Math.sin(T*9+q.p)>0?(k===4?'#ff4a2a':'#ff8a22'):'#ffe25a';ctx.fillRect(q.x|0,q.y|0,1,1);}
    else if(k===5){q.y-=dt*(6+q.v*8);q.x+=Math.sin(T+q.p)*dt*6;if(q.y<0){q.y=H+2;q.x=Math.random()*W;}ctx.fillStyle=q.v<.5?'rgba(184,106,255,'+(.5+.4*Math.sin(T*3+q.p))+')':'rgba(106,208,232,'+(.5+.4*Math.sin(T*3+q.p))+')';ctx.fillRect(q.x|0,q.y|0,1,1);}
    else if(k===6){q.x-=dt*(20+q.v*40);if(q.x<0){q.x=W;q.y=Math.random()*H;}ctx.fillStyle='rgba(255,255,255,'+(.3+.5*q.v)+')';ctx.fillRect(q.x|0,q.y|0,q.v>.8?2:1,1);}
    else if(k===0){q.y+=dt*(18+q.v*14);q.x+=Math.sin(T*1.5+q.p)*dt*14-dt*4;if(q.y>H){q.y=-3;q.x=Math.random()*W;}ctx.fillStyle=q.v<.5?'#7fd04e':'#e8c040';ctx.fillRect(q.x|0,q.y|0,2,1);if(Math.sin(T*3+q.p)>0)ctx.fillRect((q.x|0)+1,(q.y|0)-1,1,1);}
    else{q.y+=Math.sin(T*.8+q.p)*dt*6;q.x+=dt*(5+q.v*6);if(q.x>W){q.x=-2;q.y=HORY+Math.random()*(H-HORY);}ctx.fillStyle='rgba(255,230,150,'+(.5+.4*Math.sin(T*3+q.p))+')';ctx.fillRect(q.x|0,q.y|0,1,1);}}}
function drawEnvGround(){if(!SCN)return;if(SCN.pi===1)drawLongShadows();else if(SCN.pi===3||SCN.pi===4)drawLowFog();}
function render(){
  ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;
  shX=shake>0?Math.round((Math.random()-.5)*shake*8):0;shY=shake>0?Math.round((Math.random()-.5)*shake*8):0;
  drawBackdrop();drawRoad();drawEventsGround();
  if(G&&!G.demo){drawGroundFx();drawHazards();}
  drawEnvGround();
  drawEntities();
  if(SCN.pal.night){ctx.fillStyle='rgba(4,8,24,'+(.22*SCN.pal.night)+')';ctx.fillRect(0,0,W,H);}
  if(G){if(!G.demo){drawBullets();drawSlashWall();drawBP();drawCats();}drawParts();drawWeather(FDT);drawCoins(FDT);}
  if(G)drawWorldUI();
  if(G&&G.flashScr>0){ctx.fillStyle='rgba(230,255,220,'+(G.flashScr*2)+')';ctx.fillRect(0,0,W,H);}
}
function drawWorldUI(){
  if(G.demo)return;
  const b=G.boss,sq=G.squad,gd=G.guard;
  const gk=gd?(gd.kind||'ent'):'ent',gh=gk==='ent'?(12.9+1.4)*GUARD_K+1.25:gk==='wolves'?4.2:6.4;
  if(gd&&(gd.st==='sleep'||gd.st==='lock')&&gd.z-cam.z<105&&proj(gd.x+1.2,gh,gd.z)){
    const x=clamp(Math.round(PJ.x),22,W-22),y=clamp(Math.round(PJ.y),Math.max(Math.round(HORY),34)+10,Math.round(H*.45));
    ptext(gName(gd),x,y-12,1,isCos()?'#d8c8ff':'#c8ff8a','#0e2a14');ptext(String(Math.max(0,Math.ceil(gd.hp))),x,y,2,'#ffffff','#0e2a14');
    if(gd.st==='lock'){const k=clamp((gd.z-GUARD_PASS-sq.z)/(GUARD_LOCK-GUARD_PASS),0,1),bw=36,bx=Math.round(x-bw/2),by=y+10;
      ctx.fillStyle='#120c18';ctx.fillRect(bx-1,by-1,bw+2,5);ctx.fillStyle='#7fd04e';ctx.fillRect(bx,by,Math.round(bw*k),3);
      if(Math.sin(T*6)>-.3){const msg='¡DISPARA DESDE LA IZQUIERDA!',mw=msg.length*6;ptext(msg,clamp(x,mw/2+2,W-mw/2-2),by+11,1,'#ffffff','#0e2a14');}}}
  const F=G.fork;if(F&&F.z0-sq.z<46&&F.z0-sq.z>9&&!G.banner2&&proj(0,2.6,F.z0)){const y=Math.round(PJ.y),x=Math.round(PJ.x);ctx.fillStyle='#120c18';ctx.fillRect(x-58,y-7,117,13);ctx.fillStyle='#3a2a1c';ctx.fillRect(x-57,y-6,115,11);ptext('◀ SENDERO',x-29,y,1,'#c8ff8a',false);ptext('BATALLA ▶',x+29,y,1,'#ffb0a0',false);}
  if((b.st==='idle'||b.st==='fight')&&b.z-cam.z<120&&proj(b.x,5.3*BOSS_K,b.z-1)){
    ptext(String(Math.max(0,Math.ceil(b.hp))),Math.round(PJ.x),Math.max(Math.round(PJ.y),Math.round(HORY*.5)+10,44),2,b.immune>0?'#bfffc8':'#ffffff','#2a0a12');}
  if(!G.demo&&G.soldiers.length){const n=G.soldiers.length,rad=formRad(n);
    if(proj(sq.x,1.75,sq.z+rad*.8+.4)){const t=String(n)+(G.reserve?' +'+G.reserve:''),tw=t.length*6+12,x=Math.round(PJ.x-tw/2),y=Math.round(PJ.y-6);
      ctx.fillStyle='#120c18';ctx.fillRect(x-1,y-1,tw+2,13);ctx.fillStyle='#2f6ad8';ctx.fillRect(x,y,tw,11);ctx.fillStyle='#5a8ef0';ctx.fillRect(x,y,tw,1);
      personIcon(x+5,y+8,1,'#ffffff');ptext(t,x+9,y+6,1,'#ffffff',false,'left');
      if(G.shieldHits>0){ctx.fillStyle='#6b7a38';ctx.fillRect(x+tw+3,y,9,11);ptext(String(G.shieldHits),x+tw+8,y+6,1,'#e8ffb0','#120c18');}}}
  for(const t of G.texts){if(!proj(t.x,t.y,t.z))continue;ctx.globalAlpha=Math.max(0,1-t.t/t.l);ptext(t.txt,PJ.x,PJ.y,t.sz>1.3?2:1,t.col);}
  ctx.globalAlpha=1;
  if(G.countdown){const c=G.countdown,k=clamp(c.dealt/c.need,0,1),bw=Math.round(W*.5),bx=Math.round(W/2-bw/2),by=Math.round(H*.47);
    ptext('CONDENA '+Math.ceil(c.t),W/2,by-8,2,'#ffe27a','#120c18');ctx.fillStyle='#120c18';ctx.fillRect(bx-1,by-1,bw+2,6);ctx.fillStyle='#ffd04a';ctx.fillRect(bx,by,Math.round(bw*k),4);}
  if(G.chainX!=null&&Math.sin(T*6)>-.3)ptext('¡MUÉVETE PARA ROMPER LAS CADENAS!',W/2,Math.round(H*.62),1,'#ffffff','#120c18');
  if(b.intang>0&&Math.sin(T*6)>-.3)ptext('¡APUNTA AL HUEVO!',W/2,Math.round(H*.62),1,'#e0c8ff','#120c18');
  if(G.grav>0&&Math.sin(T*6)>-.3)ptext('¡RESISTE LA GRAVEDAD!',W/2,Math.round(H*.62),1,'#ffd27a','#120c18');
  if(G.banner>0&&!G.demo){const a=Math.min(1,G.banner/.5,(2.6-G.banner)/.3);if(a>.3){
    ptext(G.lv>MAXLV?'INFINITO '+(G.lv-MAXLV):'NIVEL '+G.lv,W/2,H*.34,3,'#ffffff','#120c18');ptext(SCN.pal.name,W/2,H*.34+20,1,'#ffe27a','#120c18');ptext(bossTitle(G.lv),W/2,H*.34+32,1,'#ffb0a0','#120c18');}}
  if(G.banner2){const bn=G.banner2,a=Math.min(1,bn.t/.4,(2.4-bn.t)/.25);if(a>.3){
    const s=bn.txt.length*12<W-8?2:1;ptext(bn.txt,W/2,H*.3,s,bn.col,'#120c18');if(bn.sub){const mx=Math.floor((W-10)/6);if(bn.sub.length<=mx)ptext(bn.sub,W/2,H*.3+16,1,'#ffffff','#120c18');else{let c=bn.sub.lastIndexOf(' ',mx);if(c<1)c=mx;ptext(bn.sub.slice(0,c),W/2,H*.3+16,1,'#ffffff','#120c18');ptext(bn.sub.slice(c+1),W/2,H*.3+26,1,'#ffffff','#120c18');}}}}
}
