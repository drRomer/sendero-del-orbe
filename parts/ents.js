function drawSoldier(s){
  if(!proj(s.wx,0,s.wz))return;
  const sc=s.pop>0?1-s.pop/.3*.6:1,S=SPR.sol[s.v%SPR.sol.length],n=S.nr||S.n;
  const fr=s.fl>0&&S.shoot!=null?S.shoot:G.squad.sp<.6?0:(((s.ph/TAU*n)|0)%n+n)%n;
  blit(S,fr,PJ.x,PJ.y,sc);
  if(s.fl>0){const k=S.k*PJ.s*sc;G.flashes.push(PJ.x+(S.mx-S.ax)*k,PJ.y+(S.my-S.ay)*k,PJ.s);}
  if(s.pop>0){ctx.fillStyle='rgba(255,230,140,'+(s.pop/.3)+')';const r=PJ.s*.6*(1.6-s.pop*2);for(let i=0;i<10;i++){const a=i/10*TAU;ctx.fillRect(Math.round(PJ.x+Math.cos(a)*r),Math.round(PJ.y+Math.sin(a)*r*.4),1,1);}}
}
function drawZombie(z){
  if(!proj(z.x,0,z.z))return;
  const S=z.br?SPR.bru[z.pal%SPR.bru.length]:SPR.zom[z.pal%SPR.zom.length],n=S.nr||S.n,fr=z.sh&&z.shoot>0&&S.shoot!=null?S.shoot:(((z.ph/TAU*n)|0)%n+n)%n;
  blit(S,fr,PJ.x,PJ.y);
  if(z.hit>0){ctx.globalAlpha=Math.min(1,z.hit/.07)*.8;blit(S,fr,PJ.x,PJ.y,1,true);ctx.globalAlpha=1;}
  if(z.br&&z.hp<z.max){const bw=Math.max(6,Math.round(PJ.s*1.3)),bx=Math.round(PJ.x-bw/2),by=Math.round(PJ.y-(S.ay-S.top)*S.k*PJ.s-4);ctx.fillStyle='#120c18';ctx.fillRect(bx-1,by-1,bw+2,4);ctx.fillStyle='#e8333f';ctx.fillRect(bx,by,Math.round(bw*Math.max(0,z.hp/z.max)),2);}
}
function drawCorpse(c){
  if(!proj(c.x,0,c.z))return;
  const S=c.br?SPR.bru[c.pal%SPR.bru.length]:SPR.zom[c.pal%SPR.zom.length],n=S.n,k=c.t/.55,fr=(((c.ph/TAU*n)|0)%n+n)%n,q=S.k*PJ.s;
  ctx.save();ctx.globalAlpha=Math.max(0,1-k);ctx.translate(Math.round(PJ.x),Math.round(PJ.y));ctx.rotate(c.side*k*.9);ctx.scale(1,1-k*.55);
  ctx.drawImage(S.img,fr*S.fw,0,S.fw,S.fh,-S.ax*q,-S.ay*q,S.fw*q,S.fh*q);ctx.restore();
}
function hatIcon(x,y){x=Math.round(x);y=Math.round(y);ctx.fillStyle='#120c18';ctx.fillRect(x-3,y-5,7,7);ctx.fillStyle='#8e66d6';ctx.fillRect(x-2,y-1,5,2);ctx.fillRect(x-1,y-3,3,2);ctx.fillRect(x,y-4,1,1);ctx.fillStyle='#ffd04a';ctx.fillRect(x-2,y,5,1);}
function drawCastle(c){if(!proj(0,0,c.z))return;const w=Math.round(26*PJ.s),h=Math.round(w*c.img.height/c.img.width);if(w<2)return;ctx.drawImage(c.img,Math.round(PJ.x-w/2),Math.round(PJ.y-h),w,h);}
function personIcon(x,y,s,col){ctx.fillStyle=col;ctx.fillRect(Math.round(x-1),Math.round(y-4),3,3);ctx.fillRect(Math.round(x-2),Math.round(y-1),5,4);}
const R4=()=>[Math.round(Math.min(Q[0],Q[2])),Math.round(Math.min(Q[1],Q[5])),Math.round(Math.abs(Q[2]-Q[0])),Math.round(Math.abs(Q[1]-Q[5]))];
function fr4(col){const r=R4();ctx.fillStyle=col;ctx.fillRect(r[0],r[1],Math.max(1,r[2]),Math.max(1,r[3]));return r;}
function drawGate(gt){
  let a=1;if(gt.used){a=gt.chosen?Math.max(0,1-gt.ft/.25):Math.max(0,1-gt.ft/.5);if(a<=0)return;}
  const z=gt.z,x0=Math.max(gt.x0,-ROAD-.3)+.12,x1=Math.min(gt.x1,ROAD+.3)-.12;
  const good=gt.k==='add'?Math.round(gt.val)>=0:gt.val>=1,col=good?(gt.k==='mul'?'90,230,255':'70,130,255'):'255,60,70';
  ctx.globalAlpha=a;
  // campo mágico
  if(vq(x0+.2,.08,x1-.2,2.5,z)){const r=fr4('rgba('+col+',.42)');
    ctx.fillStyle='rgba(255,255,255,.22)';for(let i=0;i<5;i++){const k=((T*.7+i/5)%1);ctx.fillRect(r[0],Math.round(r[1]+r[3]*(1-k)),r[2],1);}
    ctx.fillStyle='rgba('+col+',.9)';ctx.fillRect(r[0],r[1],r[2],1);ctx.fillRect(r[0],r[1]+r[3]-1,r[2],1);
    if(gt.fl>0){ctx.fillStyle='rgba(255,255,255,'+Math.min(.55,gt.fl*5)+')';ctx.fillRect(r[0],r[1],r[2],r[3]);}}
  // pilares de piedra
  for(const px of [x0,x1]){if(vq(px-.24,0,px+.24,2.7,z)){const r=fr4('#8f8a80');ctx.fillStyle='#bbb5a8';ctx.fillRect(r[0],r[1],Math.max(1,r[2]>>2),r[3]);ctx.fillStyle='#5c5850';ctx.fillRect(r[0]+r[2]-Math.max(1,r[2]>>2),r[1],Math.max(1,r[2]>>2),r[3]);
      ctx.fillStyle='#6e6a62';const st=Math.max(3,r[3]/5|0);for(let y=r[1]+st;y<r[1]+r[3];y+=st)ctx.fillRect(r[0],y,r[2],1);}}
  // arco
  if(vq(x0-.3,2.55,x1+.3,2.95,z)){const r=fr4('#8f8a80');ctx.fillStyle='#bbb5a8';ctx.fillRect(r[0],r[1],r[2],1);ctx.fillStyle='#5c5850';ctx.fillRect(r[0],r[1]+r[3]-1,r[2],1);}
  if(vq((x0+x1)/2-.3,2.5,(x0+x1)/2+.3,3.05,z)){fr4('rgb('+col+')');}
  if(proj((x0+x1)/2,1.25,z)){const s=PJ.s>=15?2:1,t=gateLabel(gt);const w=ptext(t,PJ.x+(gt.k==='add'?3*s:0),PJ.y,s,gt.mg?'#ead8ff':'#ffffff','#101830');
    if(gt.k==='add'){if(gt.mg)hatIcon(PJ.x-w/2-1,PJ.y+3*s-1);else personIcon(PJ.x-w/2-1,PJ.y+3*s-1,s,'#ffffff');}}
  ctx.globalAlpha=1;
}
function drawCrate(c){
  const a=c.dead?Math.max(0,1-c.ft/.3):1;if(a<=0)return;
  const hw=.85,h=1.25,z0=c.z-.6,z1=c.z+.6,x=c.x,w=c.type==='w';
  ctx.globalAlpha=a;
  const cf=w?['#a8343a','#d8504a','#6a1c24']:['#2f5ab0','#4a7ad8','#1c3a7a'];
  const sd=x>cam.x?-1:1;ctx.fillStyle=cf[2];if(xq(x+sd*hw,0,h,z0,z1))ctx.fill();
  ctx.fillStyle=cf[1];if(gq(x-hw,z0,x+hw,z1,h))ctx.fill();
  if(vq(x-hw,0,x+hw,h,z0)){const r=fr4(cf[0]);ctx.fillStyle='#120c18';ctx.fillRect(r[0]-1,r[1]-1,r[2]+2,1);ctx.fillRect(r[0]-1,r[1]+r[3],r[2]+2,1);ctx.fillRect(r[0]-1,r[1],1,r[3]);ctx.fillRect(r[0]+r[2],r[1],1,r[3]);
    ctx.fillStyle=cf[1];ctx.fillRect(r[0],r[1],r[2],Math.max(1,r[3]>>3));
    ctx.fillStyle='#ffd04a';for(const k of [.1,.9])ctx.fillRect(Math.round(r[0]+r[2]*k)-1,r[1],Math.max(1,r[2]>>4),r[3]);ctx.fillRect(r[0],Math.round(r[1]+r[3]*.38),r[2],1);
    const lw=Math.max(2,r[2]>>3);ctx.fillStyle='#fff3b0';ctx.fillRect(Math.round(r[0]+r[2]/2-lw/2),Math.round(r[1]+r[3]*.32),lw,lw);
    if(c.fl>0){ctx.fillStyle='rgba(255,255,255,'+Math.min(.6,c.fl*8)+')';ctx.fillRect(r[0],r[1],r[2],r[3]);}}
  if(!c.dead&&proj(x,h+.55,c.z)){const bw=Math.max(18,Math.round(PJ.s*1.6)),bx=Math.round(PJ.x-bw/2),by=Math.round(PJ.y)-3;
    ctx.fillStyle='#120c18';ctx.fillRect(bx-1,by-1,bw+2,9);ctx.fillStyle='#3a2c3a';ctx.fillRect(bx,by,bw,7);ctx.fillStyle=w?'#e8404a':'#3f7fe0';ctx.fillRect(bx,by,Math.round(bw*c.hp/c.max),7);
    ptext(String(Math.ceil(c.hp)),PJ.x,by+3.5,1,'#ffffff','#120c18');
    if(PJ.s>6)ptext(w?'FLECHAS':'ALIADOS',PJ.x,by-7,1,w?'#ffb0a0':'#b8d8ff','#120c18');}
  ctx.globalAlpha=1;
}
function drawLamp(l){
  if(!proj(l.x,0,l.z))return;const x0=Math.round(PJ.x),y0=Math.round(PJ.y),s=PJ.s;proj(l.x,2.4,l.z);const y1=Math.round(PJ.y);
  const pw=Math.max(1,Math.round(s*.14));ctx.fillStyle=SCN.pal.fence;ctx.fillRect(x0-(pw>>1),y1,pw,y0-y1);ctx.fillStyle='#3a3a44';ctx.fillRect(x0-pw,y1,pw*2+1,Math.max(1,pw));
  const f=Math.max(2,Math.round(s*.34)),fl=Math.sin(T*14+l.z)>0?1:0;
  ctx.fillStyle='#c8361c';ctx.fillRect(x0-(f>>1)-0,y1-f-fl,f+1,f);ctx.fillStyle='#ff8a22';ctx.fillRect(x0-(f>>1)+(f>2?1:0),y1-f+1-fl,Math.max(1,f-1),Math.max(1,f-1));
  ctx.fillStyle='#ffe25a';ctx.fillRect(x0,y1-Math.max(1,f>>1)-fl,1,Math.max(1,f>>1));ctx.fillRect(x0-(fl?0:1),y1-f-1-fl,1,1);
  if(SCN.pal.night){ctx.globalCompositeOperation='lighter';const r=Math.max(3,Math.round(s*1.1)),cy=y1-(f>>1);ctx.fillStyle='rgba(255,160,70,.12)';el(ctx,x0,cy,r,r);ctx.fill();ctx.fillStyle='rgba(255,190,100,.14)';el(ctx,x0,cy,r*.55,r*.55);ctx.fill();ctx.globalCompositeOperation='source-over';}
}
function drawProp(o){
  if(!proj(o.x,0,o.z))return;const p=o.p,h=Math.round(p.h*PJ.s),w=Math.round(p.w*PJ.s);if(h<1)return;
  ctx.drawImage(p.img,Math.round(PJ.x-w/2),Math.round(PJ.y-h*.97),w,h);
}
function drawGantry(gy){
  const z=gy.z,fa=clamp((z-cam.z-22)/12,0,1);if(fa<=0)return;ctx.globalAlpha=fa;
  const wood=SCN.pal.fence;
  for(const x of [-5.7,6.2]){if(vq(x-.22,0,x+.22,6.4,z)){const r=fr4(wood);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(r[0],r[1],Math.max(1,r[2]>>2),r[3]);}}
  if(vq(-6.1,5.9,6.6,6.5,z)){const r=fr4(wood);ctx.fillStyle='rgba(255,255,255,.2)';ctx.fillRect(r[0],r[1],r[2],1);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(r[0],r[1]+r[3]-1,r[2],1);}
  for(const [xa,xb,img] of [[-4.6,-.6,gy.s],[1.0,5.0,gy.s2]]){if(!proj(xa,5.9,z))continue;const ax=PJ.x,ay=PJ.y;proj(xb,5.9,z);const ww=PJ.x-ax,hh=ww*img.height/img.width;
    ctx.fillStyle='#3a3a44';ctx.fillRect(Math.round(ax+ww*.15),Math.round(ay),1,2);ctx.fillRect(Math.round(ax+ww*.85),Math.round(ay),1,2);
    ctx.drawImage(img,Math.round(ax),Math.round(ay+2),Math.round(ww),Math.round(hh));}
  ctx.globalAlpha=1;
}
