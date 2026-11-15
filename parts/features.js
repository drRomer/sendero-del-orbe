/* ---------- Novedades: daño en área, flechas enemigas, monedas, clima ---------- */
let FDT=0;
function splash(t,b){for(const z of G.zombies){if(z===t||z.dead)continue;if(Math.abs(z.z-t.z)<1.4&&Math.abs(z.x-t.x)<1.4){z.hp-=b.d*.6;z.hit=.07;if(z.hp<=0)killZombie(z,true);}}
  for(let i=0;i<6;i++)part({x:t.x+rnd(-.6,.6),y:rnd(.4,1.4),z:t.z+rnd(-.4,.4),vx:rnd(-1.5,1.5),vy:rnd(.5,2.5),vz:rnd(-1,1),l:.35,m:.35,sz:rnd(.08,.14),c:'126,243,255',t:3});}
function updEB(dt){const E=G.eb,S=G.soldiers,sq=G.squad,fr=formRad(S.length)+.6;
  for(let i=E.length-1;i>=0;i--){const e=E[i];e.z-=26*dt;e.x+=e.vx*dt;let gone=false;
    if(e.z<sq.z+fr){for(let j=S.length-1;j>=0;j--){const s=S[j];if(Math.abs(s.wx-e.x)<.45&&Math.abs(s.wz-e.z)<.7){killSoldierAt(j);sfx.hurt();gone=true;break;}}}
    if(gone||e.z<sq.z-4)E.splice(i,1);}}
function pixelBurst(z){const S=z.br?SPR.bru[z.pal%SPR.bru.length]:SPR.zom[z.pal%SPR.zom.length],pc=S.pc||['200,200,200'],nn=z.br?26:11,k=z.br?1.9:1;
  for(let i=0;i<nn;i++)part({x:z.x+rnd(-.35,.35)*k,y:rnd(.2,1.1*k),z:z.z,vx:rnd(-3,3),vy:rnd(2,6),vz:rnd(-1,2),l:rnd(.45,.85),m:.85,sz:rnd(.07,.12)*k,c:pc[(Math.random()*pc.length)|0],t:2});}
const CF=[];let COINXY=null;
function coinTarget(){const e=document.querySelector('.coins');if(!e)return null;const r=e.getBoundingClientRect();if(!r.width)return null;return [(r.left+14)/PIX,(r.top+r.height/2)/PIX];}
function flyCoin(x,y,z){if(CF.length>=26||!G||G.demo||!proj(x,y,z))return;CF.push({x0:PJ.x,y0:PJ.y,t:0,d:rnd(.45,.7),c:(Math.random()-.5)*30});}
function drawCoins(dt){if(!CF.length)return;if(!COINXY)COINXY=coinTarget();const tg=COINXY||[W-20,8];
  for(let i=CF.length-1;i>=0;i--){const c=CF[i];c.t+=dt;const k=Math.min(1,c.t/c.d),e=k*k,mx=(c.x0+tg[0])/2+c.c,my=Math.min(c.y0,tg[1])-20;
    const x=Math.round((1-e)*(1-e)*c.x0+2*(1-e)*e*mx+e*e*tg[0]),y=Math.round((1-e)*(1-e)*c.y0+2*(1-e)*e*my+e*e*tg[1]);
    ctx.fillStyle='#120c18';ctx.fillRect(x-2,y-2,5,5);ctx.fillStyle='#ffd04a';ctx.fillRect(x-1,y-1,3,3);ctx.fillStyle='#fff3b0';ctx.fillRect(x-1,y-1,1,1);
    if(k>=1)CF.splice(i,1);}}
// ceniza que cae en tierras malditas (además de las brasas que suben)
function drawAsh(dt){const A=SCN.ash||(SCN.ash=[]);while(A.length<46)A.push({x:Math.random()*W,y:Math.random()*H,v:Math.random(),p:Math.random()*TAU});
  for(const q of A){q.y+=dt*(9+q.v*12);q.x+=(Math.sin(T*.9+q.p)*10-6)*dt;if(q.y>H){q.y=-2;q.x=Math.random()*W*1.1;}if(q.x<-2)q.x=W;
    ctx.fillStyle=q.v<.5?'rgba(150,136,142,.75)':'rgba(96,84,92,.85)';ctx.fillRect(q.x|0,q.y|0,q.v>.8?2:1,1);}}
// niebla baja a ras de suelo en tierras malditas
function drawLowFog(){const fr_=(a,b)=>a+Math.random()*(b-a);const F=SCN.lfog||(SCN.lfog=[]);if(!F.length)for(let i=0;i<26;i++)F.push({x:fr_(-16,16),z:cam.z+3+i*3.9,w:fr_(3,6),p:fr_(0,TAU)});
  for(const f of F){if(f.z<cam.z+2||f.z>cam.z+108){f.z=f.z<cam.z+2?f.z+26*3.9:cam.z+3+Math.random()*100;f.x=fr_(-16,16);f.w=fr_(3,6);}}
  for(const f of F){if(!proj(f.x+Math.sin(T*.25+f.p)*1.2,.15,f.z))continue;const rx=PJ.s*f.w,ry=Math.max(1,rx*.2),a=Math.min(.26,.1+(f.z-cam.z)*.004);
    ctx.fillStyle='rgba(150,104,124,'+a+')';el(ctx,PJ.x,PJ.y,rx,ry);ctx.fill();ctx.fillStyle='rgba(170,126,146,'+(a*.6)+')';el(ctx,PJ.x+rx*.2,PJ.y-ry*.4,rx*.6,ry*.6);ctx.fill();}}
// sombras largas del ocaso: el sol bajo a la izquierda las estira hacia la cámara y a la derecha
function drawLongShadows(){if(!G)return;const zN=cam.z+.75,DX=.85,DZ=-1;ctx.fillStyle='rgba(40,14,36,.36)';ctx.beginPath();
  const sh=(x,z,h,w)=>{if(z<zN+.2||z>cam.z+120)return;const L=Math.min(h*2.2,9);let tz=z+DZ*L,tx=x+DX*L;if(tz<zN){const k=(z-zN)/(z-tz);tz=zN;tx=x+DX*L*k;}
    const P=[[x-w/2,z],[x+w/2,z],[tx+w*.32,tz],[tx-w*.32,tz]];let ok=true;const Q=P.map(([a,b])=>{if(!proj(a,0,b))ok=false;return [PJ.x,PJ.y];});if(!ok)return;
    ctx.moveTo(Q[0][0],Q[0][1]);for(let i=1;i<4;i++)ctx.lineTo(Q[i][0],Q[i][1]);ctx.closePath();};
  for(const s of G.soldiers)sh(s.wx,s.wz,1.12,.55);
  for(const z of G.zombies){if(z.br){const S=SPR.bru[z.pal%SPR.bru.length];sh(z.x,z.z,(S.ay-S.top)*S.k,1.5);}else sh(z.x,z.z,1.05,.55);}
  const b=G.boss;if(b&&b.st!=='dead'&&b.st!=='dying')sh(b.x,b.z,10,6);
  const gd=G.guard;if(gd)sh(gd.x,gd.z,8,3);
  ctx.fill();}
function drawEnvGround(){if(!SCN)return;if(SCN.pi===1)drawLongShadows();else if(SCN.pi===3)drawLowFog();}
function drawWeather(dt){if(!SCN)return;const P=SCN.wxp||(SCN.wxp=[]),k=SCN.pi,N=k===2?70:k===3?36:k===0?22:30;
  if(k===3)drawAsh(dt);
  while(P.length<N)P.push({x:Math.random()*W,y:Math.random()*H,v:Math.random(),p:Math.random()*TAU});
  for(const q of P){
    if(k===2){q.y+=dt*(160+q.v*60);q.x-=dt*40;if(q.y>H){q.y=-4;q.x=Math.random()*W*1.2;}ctx.fillStyle='rgba(170,200,255,.4)';ctx.fillRect(q.x|0,q.y|0,1,3);}
    else if(k===3){q.y-=dt*(14+q.v*20);q.x+=Math.sin(T*2+q.p)*dt*8;if(q.y<HORY){q.y=H+2;q.x=Math.random()*W;}ctx.fillStyle=Math.sin(T*9+q.p)>0?'#ff8a22':'#ffe25a';ctx.fillRect(q.x|0,q.y|0,1,1);}
    else if(k===0){q.y+=dt*(18+q.v*14);q.x+=Math.sin(T*1.5+q.p)*dt*14-dt*4;if(q.y>H){q.y=-3;q.x=Math.random()*W;}ctx.fillStyle=q.v<.5?'#7fd04e':'#e8c040';ctx.fillRect(q.x|0,q.y|0,2,1);if(Math.sin(T*3+q.p)>0)ctx.fillRect((q.x|0)+1,(q.y|0)-1,1,1);}
    else{q.y+=Math.sin(T*.8+q.p)*dt*6;q.x+=dt*(5+q.v*6);if(q.x>W){q.x=-2;q.y=HORY+Math.random()*(H-HORY);}ctx.fillStyle='rgba(255,230,150,'+(.5+.4*Math.sin(T*3+q.p))+')';ctx.fillRect(q.x|0,q.y|0,1,1);}}}
