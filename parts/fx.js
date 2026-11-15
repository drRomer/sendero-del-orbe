const FOG_Z=38;
const BB=[];
function pline(x0,y0,x1,y1){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));if(!n){ctx.rect(x0,y0,1,1);return;}for(let i=0;i<=n;i++)ctx.rect(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),1,1);}
function drawBullets(){
  const B=G.bullets,wl=G.wl,mc=WCOL[wl-1];
  BB.length=0;
  for(const b of B){if(!proj(b.x,.8,b.z))continue;const hx=PJ.x,hy=PJ.y,dx=b.vx/BV;
    if(!proj(b.x-dx*.9,.8,b.z-.9))continue;const tx=PJ.x,ty=PJ.y;let ex=tx,ey=ty;
    if(wl>1||b.mg){if(proj(b.x-dx*2.4,.8,b.z-2.4)){ex=PJ.x;ey=PJ.y;}}
    BB.push(hx,hy,tx,ty,ex,ey,b.mg?1:0);}
  // estelas mágicas (nivel de flechas ≥2 o hechizos)
  ctx.fillStyle='rgba('+mc+',.45)';ctx.beginPath();for(let i=0;i<BB.length;i+=7)if(wl>1&&!BB[i+6])pline(BB[i+2],BB[i+3],BB[i+4],BB[i+5]);ctx.fill();
  ctx.fillStyle='rgba(150,240,255,.5)';ctx.beginPath();for(let i=0;i<BB.length;i+=7)if(BB[i+6])pline(BB[i],BB[i+1],BB[i+4],BB[i+5]);ctx.fill();
  // astiles
  ctx.fillStyle=wl>1?'rgb('+mc+')':'#d8c8a0';ctx.beginPath();for(let i=0;i<BB.length;i+=7)if(!BB[i+6])pline(BB[i],BB[i+1],BB[i+2],BB[i+3]);ctx.fill();
  // plumas
  ctx.fillStyle='#e8404a';ctx.beginPath();for(let i=0;i<BB.length;i+=7)if(!BB[i+6])ctx.rect(Math.round(BB[i+2]),Math.round(BB[i+3]),1,1);ctx.fill();
  // puntas y orbes
  ctx.fillStyle='#ffffff';ctx.beginPath();for(let i=0;i<BB.length;i+=7){if(BB[i+6]){ctx.rect(Math.round(BB[i])-1,Math.round(BB[i+1])-1,3,3);}else ctx.rect(Math.round(BB[i]),Math.round(BB[i+1]),1,2);}ctx.fill();
  ctx.fillStyle='#7ef3ff';ctx.beginPath();for(let i=0;i<BB.length;i+=7)if(BB[i+6]){ctx.rect(Math.round(BB[i])-1,Math.round(BB[i+1])-1,3,1);ctx.rect(Math.round(BB[i])-1,Math.round(BB[i+1])+1,3,1);}ctx.fill();
  const Fl=G.flashes;
  for(let i=0;i<Fl.length;i+=3){ctx.drawImage(SPR.flash,Math.round(Fl[i]-2),Math.round(Fl[i+1]-2));}
  // flechas de los goblins
  for(const e of G.eb){if(!proj(e.x,1,e.z))continue;const hx=PJ.x,hy=PJ.y;if(!proj(e.x-e.vx*.03,1,e.z+.8))continue;
    ctx.fillStyle='#6a3a1e';ctx.beginPath();pline(hx,hy,PJ.x,PJ.y);ctx.fill();ctx.fillStyle='#e8eef8';ctx.fillRect(Math.round(hx),Math.round(hy),1,2);ctx.fillStyle='#e8404a';ctx.fillRect(Math.round(PJ.x),Math.round(PJ.y),1,1);}
}
function drawParts(){
  for(const p of G.parts){if(!proj(p.x,p.y,p.z))continue;const a=Math.max(0,p.l/p.m),r=clamp(Math.round(p.sz*PJ.s),1,4),x=Math.round(PJ.x-r/2),y=Math.round(PJ.y-r/2);
    if(p.t===0){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba('+p.c+','+a+')';ctx.fillRect(x,y,r,r);ctx.globalCompositeOperation='source-over';}
    else if(p.t===1){ctx.fillStyle='rgba('+p.c+','+(a*.35)+')';ctx.fillRect(x-r,y-r,r*3,r*2);}
    else if(p.t===3){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba('+p.c+','+a+')';ctx.fillRect(x,y-r,1,r*2+1);ctx.fillRect(x-r,y,r*2+1,1);ctx.globalCompositeOperation='source-over';}
    else{ctx.fillStyle='rgba('+p.c+','+a+')';ctx.fillRect(x,y,r,Math.max(1,r-1));}}
}
function drawSlashWall(){
  const s=G.slash;if(!s)return;const z=s.front;
  ctx.globalCompositeOperation='lighter';
  if(vq(-RAIL,0,RAIL,3.4,z)){const r=R4();for(let i=0;i<4;i++){ctx.fillStyle='rgba(170,110,255,'+(.42-i*.09)+')';const hh=Math.round(r[3]*(1-i*.22));ctx.fillRect(r[0],r[1]+r[3]-hh,r[2],hh);}
    ctx.fillStyle='rgba(230,210,255,.9)';ctx.fillRect(r[0],r[1]+r[3]-1,r[2],1);
    for(let i=0;i<30;i++){const x=r[0]+((i*37+((T*60)|0)*7)%Math.max(1,r[2])),y=r[1]+((i*53+((T*90)|0)*5)%Math.max(1,r[3]));ctx.fillStyle=i%3?'#c8a0ff':'#ffffff';ctx.fillRect(x,y,1,1);}}
  ctx.globalCompositeOperation='source-over';
}
function drawFog(){
  const f=SCN.pal.fog,h=H*.24,y0=Math.round(HORY)-2,n=6;
  for(let i=0;i<n;i++){ctx.fillStyle='rgba('+f+','+(1-i/n)*.95+')';const ya=Math.round(y0+h*i/n),yb=Math.round(y0+h*(i+1)/n);ctx.fillRect(0,ya,W,yb-ya);}
}
function drawWorldUI(){
  if(G.demo)return;
  const b=G.boss,sq=G.squad,gd=G.guard;
  if(gd&&(gd.st==='sleep'||gd.st==='lock')&&gd.z-cam.z<105&&proj(gd.x+1.2,(12.9+1.4)*GUARD_K+1.25,gd.z)){
    const x=clamp(Math.round(PJ.x),22,W-22),y=clamp(Math.round(PJ.y),Math.max(Math.round(HORY),34)+10,Math.round(H*.45));
    ptext('ENT',x,y-12,1,'#c8ff8a','#0e2a14');ptext(String(Math.max(0,Math.ceil(gd.hp))),x,y,2,'#ffffff','#0e2a14');
    if(gd.st==='lock'){const k=clamp((gd.z-GUARD_PASS-sq.z)/(GUARD_LOCK-GUARD_PASS),0,1),bw=36,bx=Math.round(x-bw/2),by=y+10;
      ctx.fillStyle='#120c18';ctx.fillRect(bx-1,by-1,bw+2,5);ctx.fillStyle='#7fd04e';ctx.fillRect(bx,by,Math.round(bw*k),3);
      if(Math.sin(T*6)>-.3){const msg='¡DISPARA DESDE LA IZQUIERDA!',mw=msg.length*6;ptext(msg,clamp(x,mw/2+2,W-mw/2-2),by+11,1,'#ffffff','#0e2a14');}}}
  if((b.st==='idle'||b.st==='fight')&&b.z-cam.z<120&&proj(b.x,5.3*BOSS_K,b.z-1)){
    ptext(String(Math.max(0,Math.ceil(b.hp))),Math.round(PJ.x),Math.max(Math.round(PJ.y),Math.round(HORY*.5)+10,44),2,'#ffffff','#2a0a12');}
  if(!G.demo&&G.soldiers.length){const n=G.soldiers.length,rad=formRad(n);
    if(proj(sq.x,1.75,sq.z+rad*.8+.4)){const t=String(n),tw=t.length*6+12,x=Math.round(PJ.x-tw/2),y=Math.round(PJ.y-6);
      ctx.fillStyle='#120c18';ctx.fillRect(x-1,y-1,tw+2,13);ctx.fillStyle='#2f6ad8';ctx.fillRect(x,y,tw,11);ctx.fillStyle='#5a8ef0';ctx.fillRect(x,y,tw,1);
      personIcon(x+5,y+8,1,'#ffffff');ptext(t,x+9,y+6,1,'#ffffff',false,'left');}}
  for(const t of G.texts){if(!proj(t.x,t.y,t.z))continue;ctx.globalAlpha=Math.max(0,1-t.t/t.l);ptext(t.txt,PJ.x,PJ.y,t.sz>1.3?2:1,t.col);}
  ctx.globalAlpha=1;
  if(G.banner>0&&!G.demo){const a=Math.min(1,G.banner/.5,(2.6-G.banner)/.3);if(a>.3){
    ptext('NIVEL '+G.lv,W/2,H*.34,3,'#ffffff','#120c18');ptext(SCN.pal.name,W/2,H*.34+20,1,'#ffe27a','#120c18');}}
  if(G.banner2){const bn=G.banner2,a=Math.min(1,bn.t/.4,(2.4-bn.t)/.25);if(a>.3){
    const s=bn.txt.length*12<W-8?2:1;ptext(bn.txt,W/2,H*.3,s,bn.col,'#120c18');if(bn.sub)ptext(bn.sub,W/2,H*.3+16,1,'#ffffff','#120c18');}}
}
function render(){
  ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;
  shX=shake>0?Math.round((Math.random()-.5)*shake*8):0;shY=shake>0?Math.round((Math.random()-.5)*shake*8):0;
  drawBackdrop();drawRoad();
  if(G&&!G.demo)drawGroundFx();
  drawEntities();
  if(SCN.pal.night){ctx.fillStyle='rgba(4,8,24,'+(.22*SCN.pal.night)+')';ctx.fillRect(0,0,W,H);}
  if(G){if(!G.demo){drawBullets();drawSlashWall();}drawParts();drawWeather(FDT);drawCoins(FDT);}
  if(G)drawWorldUI();
  if(G&&G.flashScr>0){ctx.fillStyle='rgba(230,255,220,'+(G.flashScr*2)+')';ctx.fillRect(0,0,W,H);}
}
