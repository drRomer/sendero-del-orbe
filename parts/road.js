function drawBackdrop(){
  const p=SCN.pal,top=Math.max(0,HORY);
  if(SKYC)ctx.drawImage(SKYC,Math.round(-W*.125-cam.x*2),0);
  if(CLOUDC){const w=CLOUDC.width,o=(T*3)%w,x0=Math.round(-W*.125-cam.x*2-o);ctx.drawImage(CLOUDC,x0,0);ctx.drawImage(CLOUDC,x0+w,0);}
  if(SCN.back){const B=SCN.back,sx=Math.round(CX-B.width/2-cam.x*4),sy=Math.round(HORY-B.height+2);ctx.drawImage(B,sx,sy);}
  ctx.fillStyle=p.grass[1];ctx.fillRect(0,Math.round(HORY),W,H-Math.round(HORY));
}
// franjas alternadas a lo largo del camino (estilo carreras retro)
function stripes(x0,x1,len,c0,c1,y,zF){
  const zN=cam.z+.6;y=y||0;ctx.fillStyle=c0;if(gq(x0,zN,x1,zF||cam.z+240,y))ctx.fill();
  ctx.fillStyle=c1;ctx.beginPath();const st=Math.floor(cam.z/(len*2))*len*2;
  for(let z=st;z<cam.z+(zF?zF-cam.z:160);z+=len*2){const a=Math.max(z,zN);if(z+len<zN)continue;gqa(x0,a,x1,z+len,y);}ctx.fill();
}
function drawRoad(){
  const p=SCN.pal,zN=cam.z+.6,zF=cam.z+240;
  // pasto lejano a ambos lados
  stripes(-70,WALK_L,3,p.grass[0],p.grass[1],0);stripes(WALK_R,70,3,p.grass[0],p.grass[1],0);
  // orillas de pasto (la izquierda es donde duerme el Ent)
  stripes(WALK_L,-CURB,3,p.verge[0],p.verge[1],0);stripes(CURB,WALK_R,3,p.verge[0],p.verge[1],0);
  // camino de tierra
  stripes(-ROAD,ROAD,2.5,p.road[0],p.road[1],.01);
  // huellas de carretas
  ctx.fillStyle=p.rut;ctx.beginPath();for(const x of [-2.6,-1.9,1.7,2.4])gqa(x,zN,x+.18,cam.z+150,.012);ctx.fill();
  // piedras del borde (bloques alternados)
  for(const [a,b] of [[-CURB,-ROAD],[ROAD,CURB]]){ctx.fillStyle=p.edge[1];if(gq(a,zN,b,zF,.015))ctx.fill();
    ctx.fillStyle=p.edge[0];ctx.beginPath();const st=Math.floor(cam.z/1.6)*1.6;for(let z=st;z<cam.z+140;z+=1.6){if(z+.9<zN)continue;gqa(a,Math.max(z,zN),b,z+.9,.02);}ctx.fill();}
  // detalles: piedritas, barro y matas
  const z0d=cam.z+1,z1d=cam.z+110;
  ctx.fillStyle='rgba(60,40,24,.35)';ctx.beginPath();for(const d of SCN.decals)if(d.t===1&&d.z>z0d&&d.z<z1d)gqa(d.x,d.z,d.x+d.w*2,d.z+d.l,.013);ctx.fill();
  for(const d of SCN.decals){if(d.z<z0d||d.z>z1d)continue;if(d.t===1||!proj(d.x,0,d.z))continue;const s=Math.max(1,Math.round(PJ.s*d.w*.35));
    if(d.t===0){ctx.fillStyle=p.edge[1];ctx.fillRect(Math.round(PJ.x),Math.round(PJ.y),s,Math.max(1,s>>1));ctx.fillStyle=p.edge[0];ctx.fillRect(Math.round(PJ.x),Math.round(PJ.y),Math.max(1,s>>1),1);}
    else{ctx.fillStyle=p.verge[0];ctx.fillRect(Math.round(PJ.x),Math.round(PJ.y)-s,1,s);ctx.fillRect(Math.round(PJ.x)+1,Math.round(PJ.y)-s+1,1,s-1);}}
  // cercas de madera al borde exterior de las orillas
  ctx.fillStyle=p.fence;
  for(const x of [WALK_L+.1,WALK_R-.1]){if(xq(x,.75,.9,zN,cam.z+120))ctx.fill();if(xq(x,.35,.48,zN,cam.z+120))ctx.fill();}
  ctx.beginPath();for(let z=Math.floor(cam.z/2)*2;z<cam.z+80;z+=2){if(z<zN)continue;for(const x of [WALK_L+.1,WALK_R-.1]){if(!proj(x,0,z))continue;const x0=PJ.x,y0=PJ.y,w=Math.max(1,PJ.s*.12);proj(x,1.05,z);ctx.rect(Math.round(x0-w/2),Math.round(PJ.y),Math.max(1,Math.round(w)),Math.max(1,Math.round(y0-PJ.y)));}}ctx.fill();
  if(p.night){ctx.globalCompositeOperation='lighter';for(const l of SCN.lamps){if(l.z<cam.z+2||l.z>cam.z+90)continue;if(!proj(l.x,0,l.z))continue;const r=PJ.s*2.2;
    ctx.fillStyle='rgba(255,160,70,.13)';el(ctx,PJ.x,PJ.y,r,r*.42);ctx.fill();ctx.fillStyle='rgba(255,180,90,.12)';el(ctx,PJ.x,PJ.y,r*.6,r*.25);ctx.fill();}ctx.globalCompositeOperation='source-over';}
}
function drawGroundFx(){
  const sq=G.squad,b=G.boss;
  if(G.soldiers.length&&proj(sq.x,.02,sq.z)){const r=(formRad(G.soldiers.length)+.8)*PJ.s;ctx.fillStyle='rgba(255,220,120,.12)';el(ctx,PJ.x,PJ.y,r,r*.42);ctx.fill();
    ctx.fillStyle=Math.sin(T*4)>0?'rgba(255,230,140,.55)':'rgba(255,210,110,.4)';const n=24;for(let i=0;i<n;i++){const a=i/n*TAU+T*.6;ctx.fillRect(Math.round(PJ.x+Math.cos(a)*r*.92),Math.round(PJ.y+Math.sin(a)*r*.39),1,1);}}
  for(const s of G.shock){const zA=sq.z-5,zB=b.z-1.5;
    const bc=SCN.bc[0],bl=SCN.bc[1];
    if(!s.on){const a=Math.sin(T*22)>0?.34:.18;ctx.fillStyle='rgba('+bc+','+a+')';if(gq(s.x-s.w/2,zA,s.x+s.w/2,zB,.03))ctx.fill();
      ctx.fillStyle='rgba('+bl+',.9)';for(const x of [s.x-s.w/2,s.x+s.w/2-.12]){ctx.beginPath();for(let z=Math.floor(zA);z<zB;z+=1.4)gqa(x,z,x+.12,z+.7,.04);ctx.fill();}}
    else{ctx.fillStyle='rgba('+bc+',.16)';if(gq(s.x-s.w/2,zA,s.x+s.w/2,s.front,.03))ctx.fill();
      ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba('+bc+',.85)';if(gq(s.x-s.w/2,s.front-.7,s.x+s.w/2,s.front+.5,.05))ctx.fill();ctx.fillStyle='rgba('+bl+',.7)';if(gq(s.x-s.w/2,s.front-.2,s.x+s.w/2,s.front+.2,.06))ctx.fill();ctx.globalCompositeOperation='source-over';}}
  const gd=G.guard;
  if(gd&&gd.waves.length){
    for(const w of gd.waves){const k=Math.min(1,w.t/w.dur),hx=lerp(w.x0,w.x1,k),hz=lerp(w.z0,w.z1,k);
      // raíces que avanzan por el suelo
      ctx.fillStyle='#4c3220';ctx.beginPath();const n=12;for(let i=0;i<=n;i++){const t=i/n*k,x=lerp(w.x0,w.x1,t)+Math.sin(i*1.7)*.25,z=lerp(w.z0,w.z1,t);if(proj(x,.04,z)){const r=Math.max(1,PJ.s*.18);ctx.rect(Math.round(PJ.x-r),Math.round(PJ.y-r*.5),Math.round(r*2),Math.max(1,Math.round(r)));}}ctx.fill();
      if(proj(hx,.05,hz)){ctx.fillStyle='#7fd04e';const r=Math.max(2,PJ.s*.4);ctx.fillRect(Math.round(PJ.x-r),Math.round(PJ.y-r),Math.round(r*2),Math.round(r*2));ctx.fillStyle='#3f9c3c';ctx.fillRect(Math.round(PJ.x-r/2),Math.round(PJ.y-r*1.6),Math.max(1,Math.round(r)),Math.round(r));}}}
  for(const r of G.rings){if(!proj(r.x,.05,r.z))continue;const k=r.t/.5,rad=PJ.s*(.5+k*4.2);
    ctx.fillStyle='rgba(127,208,78,'+(.3*(1-k))+')';el(ctx,PJ.x,PJ.y,rad,rad*.42);ctx.fill();
    ctx.fillStyle='rgba(200,255,140,'+(1-k)+')';const n=28;for(let i=0;i<n;i++){const a=i/n*TAU;ctx.fillRect(Math.round(PJ.x+Math.cos(a)*rad),Math.round(PJ.y+Math.sin(a)*rad*.42),1,1);}}
  if(G.slash){const z=G.slash.front;ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(170,110,255,.32)';if(gq(-RAIL,z-2.4,RAIL,z+.2,.03))ctx.fill();ctx.globalCompositeOperation='source-over';}
}
