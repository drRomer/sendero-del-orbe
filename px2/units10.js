// units10.js — tropas nuevas, enemigos con rol, obstáculos, utilería de ambientes nuevos, íconos y jefes por tramo (carga perezosa)
RP.obsid=['#0a0608','#160c10','#24141a','#341c24','#46262e'];
RP.chain=['#1a1a20','#3a3a44','#6a6a78','#9a9aac'];
RP.cryst=['#1a0a3a','#2e1660','#4a2a96','#7048c8','#a07ae8','#d8c8ff'];
RP.crystC=['#062a3a','#0c4a62','#16708e','#2aa0c0','#6ad0e8','#c8f4ff'];
RP.feath=['#120a18','#22142e','#341e46','#4a2c60','#62407a'];
RP.pale=['#3a3034','#6a5a5c','#9a8a88','#c8b8b0'];

// ---------- CABALLERO (de espaldas): armadura, capa azul, escudo y espada ----------
function knight9(f,n){const o=PXR(16,20),ST=0,CP=1,LE=2,PL=3,GD=4,M=M9('iron','cloakU','leather','trim','gold');
  const t=f/n*TAU9,s=Math.sin(t),b=Math.round(Math.abs(s)),y=-b,la=Math.round(s*1.6);
  o.cap(6,13+y,6,18-(la>0?1:0),1.6,1.4,ST,1);o.cap(10,13+y,10,18-(la<0?1:0),1.6,1.4,ST,1);
  o.blob(6,18.5-(la>0?1:0),1.7,1,LE,1.1);o.blob(10,18.5-(la<0?1:0),1.7,1,LE,1.1);
  o.cap(8,8+y,8,13+y,3.6,3.8,ST,1.8);
  o.poly([[4,7+y],[12,7+y],[13,16+y],[8,17+y],[3,16+y]],CP,2,2);o.cap(4.5,7.2+y,11.5,7.2+y,.7,.7,GD,2.1);
  o.blob(4,8+y,2.3,1.7,ST,3);o.blob(12,8+y,2.3,1.7,ST,3);
  o.blob(2.4,11.5+y,2.6,3.6,ST,3.4);o.blob(2.4,11.5+y,1.8,2.8,CP,3.45);o.glow(2,11+y,'#ffe07a');o.glow(3,11+y,'#ffe07a');o.glow(2,12+y,'#ffe07a');
  o.cap(13.6,9+y,14,17+y,.6,.5,ST,3.5);o.cap(12.8,9.4+y,14.6,9.4+y,.5,.5,GD,3.6);
  o.blob(8,4.6+y,3.3,3.3,ST,5);o.cap(8,2.5+y,10,.2+y,1.1,.7,PL,5.1);o.cap(5.2,5.5+y,10.8,5.5+y,.5,.5,ST,5.05);
  return o.render(M,{soft:.4});}
// ---------- DRUIDA (de espaldas): túnica verde, capucha con astas, báculo con hojas ----------
function druid9(f,n,cast){const o=PXR(16,22),R=0,WD=1,LF=2,M=M9('cloakG','wood','leaf');
  const t=cast?0:f/n*TAU9,s=Math.sin(t),b=cast?0:Math.round(Math.abs(s)),y=-b,up=cast?3:0,sw=Math.round(s);
  o.poly([[5,9+y],[11,9+y],[13+sw,20],[3+sw,20]],R,2,2);o.cap(8,10+y,8,18,3.6,5.2,R,2.1);
  o.cap(3,7+y-up,3,20+y-up,.8,.8,WD,3);o.cap(3,10+y-up,4.5,11+y-up,1.2,1,R,3.1);
  o.blob(3,5.5+y-up,2.6,2.2,LF,3.2);o.blob(2,4+y-up,1.4,1.2,LF,3.25);
  o.blob(8,8+y,4.4,1.8,R,4);o.poly([[4,8+y],[12,8+y],[11,4+y],[8,1+y],[5,4+y]],R,4.2,2);
  for(const d of [-1,1]){o.cap(8+d*2.5,3+y,8+d*4.5,-0.2+y,.6,.4,WD,4.3);o.cap(8+d*4,1.2+y,8+d*5.6,1+y,.5,.4,WD,4.3);}
  const gc=cast?['#ffffff','#c8ff8a','#7fd04e']:['#c8ff8a','#7fd04e','#3f9c3c'];
  for(const [dx,dy,k] of [[0,0,0],[1,0,1],[-1,0,1],[0,-1,1],[0,1,2]])o.glow(3+dx,5+dy+y-up,gc[k]);
  if(cast)for(const [x,yy] of [[1,0],[5,1],[0,4],[6,5]])o.glow(x,yy-up+3,'#c8ff8a');
  return o.render(M,{soft:.4});}
// ---------- CATAPULTA (de espaldas) ----------
function catapult9(f,n,fire){const o=PXR(22,18),WD=0,MT=1,RK=2,M=[{ramp:RP.wood,tex:'bark'},{ramp:RP.iron},{ramp:RP.rock}];
  const b=fire?0:(f%2);
  o.poly([[4,10-b],[18,10-b],[19,14-b],[3,14-b]],WD,1,1);o.cap(4,12-b,18,12-b,.6,.6,MT,1.1);
  for(const x of [3,19]){o.blob(x,14,2.8,2.8,WD,2);o.blob(x,14,1.2,1.2,MT,2.1);}
  o.cap(7,10-b,8,4-b,1,.8,WD,1.5);o.cap(15,10-b,14,4-b,1,.8,WD,1.5);o.cap(7.5,4.6-b,14.5,4.6-b,.8,.8,WD,1.6);
  if(fire){o.cap(11,11,11,1,1,.8,WD,2.5);o.blob(11,1,2.2,1.3,WD,2.6);}
  else{o.cap(11,11-b,11,15.5-b,1,.8,WD,2.5);o.blob(11,16-b,2.2,1.3,WD,2.6);o.blob(11,15.3-b,1.5,1.2,RK,2.7);}
  for(const x of [3,19])for(let k=0;k<4;k++){const a=k/4*Math.PI*2+f*.8;o.glow(x+Math.cos(a)*2,14+Math.sin(a)*2,'#40281a');}
  return o.render(M,{soft:.38});}
// ---------- CHAMÁN ORCO (cura): máscara de calavera, plumas, báculo con fuego verde ----------
function shaman9(f,n){const o=PXR(22,24),G=0,LT=1,WD=2,BN=3,V=4,FT=5,M=M9('orc','leather','wood','bone','void','trim');
  const t=f/n*TAU9,s=Math.sin(t),b=Math.round(Math.abs(s)),y=-b,la=Math.round(s*1.2);
  o.cap(8.5,16+y,8,21-(la>0?1:0),2,1.8,G,1);o.cap(13.5,16+y,14,21-(la<0?1:0),2,1.8,G,1);o.blob(8,22-(la>0?1:0),2.4,1.2,LT,1.1);o.blob(14,22-(la<0?1:0),2.4,1.2,LT,1.1);
  o.poly([[6,10+y],[16,10+y],[17,20+y],[5,20+y]],LT,2,2);o.blob(11,12+y,5,4.4,G,1.9);
  o.cap(6,10+y,4,15+y,2,1.8,G,3);o.cap(16,10+y,18,14+y,2,1.8,G,3);
  o.cap(18.4,2+y,18.4,22+y,.8,.8,WD,3.2);o.blob(18.4,2.6+y,1.8,1.8,BN,3.3);o.blob(18,2.5+y,.6,.6,V,3.4);o.blob(18.8,2.5+y,.6,.6,V,3.4);
  for(const [dx,dy,c] of [[0,-2,'#ffffff'],[0,-3,'#c8ff8a'],[-1,-3,'#7fd04e'],[1,-4,'#7fd04e'],[0,-5,'#3f9c3c']])o.glow(18.4+dx,2+dy+y,c);
  o.blob(11,6+y,4,3.8,G,4);o.blob(11,6.6+y,3.2,2.8,BN,4.2);o.blob(9.8,6.2+y,.9,.8,V,4.3);o.blob(12.2,6.2+y,.9,.8,V,4.3);o.glow(10,6+y,'#c8ff8a');o.glow(12,6+y,'#c8ff8a');
  for(const [x0,x1,yy,c] of [[8,6,-1,FT],[10,10,-2,FT],[12,12,-2,FT],[14,16,-1,FT]])o.cap(x0,3+y,x1,yy+y,.8,.5,c,3.9);
  for(let k=0;k<5;k++)o.glow(8+k,10+y,k%2?'#c8b8a0':'#8a7a6a');
  return o.render(M,{soft:.4});}
// ---------- ESCUDERO ORCO: tras un escudo torre con calavera ----------
function shieldOrc9(f,n){const o=PXR(22,24),G=0,LT=1,MT=2,WD=3,BN=4,V=5,M=M9('orc2','leather','iron',{ramp:RP.wood,tex:'bark'},'bone','void');
  const t=f/n*TAU9,s=Math.sin(t),b=Math.round(Math.abs(s)),y=-b,la=Math.round(s*1.2);
  o.cap(8,16+y,7.5,21-(la>0?1:0),2.2,2,G,1);o.cap(14,16+y,14.5,21-(la<0?1:0),2.2,2,G,1);o.blob(7.5,22-(la>0?1:0),2.6,1.3,LT,1.1);o.blob(14.5,22-(la<0?1:0),2.6,1.3,LT,1.1);
  o.blob(11,12+y,5.6,5.4,G,2);o.blob(11,5.5+y,4,3.8,G,3);o.blob(11,4+y,4.4,2.6,MT,3.2);o.glow(9.5,6+y,'#ffd23a');o.glow(12.5,6+y,'#ffd23a');
  o.poly([[4,8+y],[18,8+y],[18,19+y],[11,22+y],[4,19+y]],WD,4,2);o.poly([[5,9+y],[17,9+y],[17,18.4+y],[11,21+y],[5,18.4+y]],MT,4.1,1.5);
  o.cap(5,13+y,17,13+y,.6,.6,WD,4.15);o.blob(11,13.5+y,2.6,2.6,BN,4.2);o.blob(10,13+y,.7,.7,V,4.3);o.blob(12,13+y,.7,.7,V,4.3);
  for(const [x,yy] of [[6,10],[16,10],[6,17],[16,17]])o.glow(x,yy+y,'#a4a4b4');
  o.cap(19,4+y,19,14+y,.7,.7,WD,3.5);o.poly([[18,3+y],[20,3+y],[19,0+y]],MT,3.6,1);
  return o.render(M,{soft:.4});}
// ---------- ARPÍA: criatura alada con garras, vuela en picada ----------
function harpy9(f,n){const o=PXR(22,20),FE=0,PA=1,BN=2,V=3,M=[{ramp:RP.feath},{ramp:RP.pale},{ramp:RP.bone},{ramp:RP.void}];
  const t=f/n*TAU9,up=Math.round(Math.sin(t)*1.2),wu=f%2;
  if(wu){o.poly([[9,8-up],[1,1-up],[0,6-up],[4,8-up],[1,11-up],[7,11-up]],FE,1,1);o.poly([[13,8-up],[21,1-up],[22,6-up],[18,8-up],[21,11-up],[15,11-up]],FE,1,1);}
  else{o.poly([[9,9-up],[0,11-up],[2,15-up],[5,13-up],[7,15-up],[9,12-up]],FE,1,1);o.poly([[13,9-up],[22,11-up],[20,15-up],[17,13-up],[15,15-up],[13,12-up]],FE,1,1);}
  o.blob(11,10-up,3.4,4,FE,2);o.blob(11,11-up,2,2.6,PA,2.1);
  for(const d of [-1,1]){o.cap(11+d*1.5,13-up,11+d*2.2,17-up,.7,.6,PA,2.2);for(const k of [-1,0,1])o.cap(11+d*2.2,17-up,11+d*2.2+k*.9,18.6-up,.4,.3,BN,2.3);}
  o.blob(11,5.5-up,2.6,2.6,PA,3);o.blob(11,3.6-up,3,1.6,FE,3.1);for(const d of [-1,1])o.cap(11+d*2,4-up,11+d*4,1-up,.8,.4,FE,3.05);
  o.poly([[10.2,6.5-up],[11.8,6.5-up],[11,8.6-up]],BN,3.2,1);o.glow(10,5.5-up,'#ffd23a');o.glow(12,5.5-up,'#ffd23a');
  return o.render(M,{soft:.42});}
// ---------- NIGROMANTE MENOR: levanta esqueletos ----------
function necro9(f,n){const o=PXR(16,22),RB=0,BN=1,WD=2,V=3,M=M9('robe','bone','wood','void');
  const t=f/n*TAU9,up=Math.round(Math.sin(t)*1),sw=Math.round(Math.sin(t*2));
  o.poly([[5,9-up],[11,9-up],[13+sw,20],[3+sw,20]],RB,2,2);o.cap(8,10-up,8,18,3.4,5,RB,2.1);
  o.cap(13,3-up,13,20,.7,.7,WD,3);o.blob(12,10-up,1.2,1,BN,3.1);
  o.blob(8,6-up,4,4.2,RB,4);o.blob(8,7-up,2.8,3,V,4.1);o.blob(8,7.5-up,2.2,2.4,BN,4.2);o.glow(7,7-up,'#c87aff');o.glow(9,7-up,'#c87aff');
  for(const [dx,dy,c] of [[0,0,'#ffffff'],[1,0,'#c87aff'],[-1,0,'#c87aff'],[0,-1,'#c87aff'],[0,1,'#7a3adf']])o.glow(13+dx,2+dy-up,c);
  return o.render(M,{soft:.4});}
// ---------- CAUDILLO ORCO (miniboss) ----------
function warlord9(f,n){const o=PXR(30,30,1.6),G=0,LT=1,MT=2,V=3,BN=4,GD=5,M=M9('orc','leather','iron','void','bone','gold');
  const t=f/n*TAU9,s=Math.sin(t),b=Math.round(Math.abs(s)),y=-b,la=Math.round(s*1.5),aw=Math.round(s*2);
  o.cap(11,21+y,10.5,27-(la>0?1:0),3,2.6,G,1);o.cap(19,21+y,19.5,27-(la<0?1:0),3,2.6,G,1);o.blob(10.5,28-(la>0?1:0),3.2,1.5,LT,1.1);o.blob(19.5,28-(la<0?1:0),3.2,1.5,LT,1.1);
  o.blob(15,16+y,7.6,7.2,G,2);o.poly([[8.5,11+y],[21.5,11+y],[21,21+y],[15,23+y],[9,21+y]],MT,2.5,1.5);o.cap(9,21+y,21,21+y,1,1,LT,2.6);o.blob(15,21+y,1.6,1.4,BN,2.7);
  for(const d of [-1,1]){o.blob(15+d*8,11+y,4.4,3.4,MT,3.2);o.poly([[15+d*6,9+y],[15+d*8,9+y],[15+d*10,4+y]],BN,3.3,1);}
  for(const d of [-1,1]){const hx=15+d*11,hy=19+y+d*aw;o.cap(15+d*8,12+y,hx,hy,2.6,2.2,G,3);o.cap(hx,hy+1,hx,hy-9,.7,.7,LT,3.4);o.poly([[hx,hy-9],[hx+d*4,hy-11],[hx+d*4.5,hy-5],[hx,hy-6]],MT,3.5,1);}
  o.blob(15,7+y,4.8,4.6,G,4);o.blob(15,5+y,5.2,3,MT,4.2);for(const d of [-1,0,1])o.poly([[15+d*3-1,3+y],[15+d*3+1,3+y],[15+d*3,(d?0:-1)+y]],GD,4.3,1);
  o.glow(13,7+y,'#ff4a3a');o.glow(17,7+y,'#ff4a3a');o.glow(14,10+y,'#efe6d6');o.glow(16,10+y,'#efe6d6');
  return o.render(M,{soft:.4});}
// ---------- TRONCO Y ROCA RODANTES ----------
function log9(f){const o=PXR(42,16),WD=0,EN=1,M=[{ramp:RP.wood,tex:'bark'},{ramp:['#3a2414','#6a4426','#9a6a3e','#c89a62']}];
  o.cap(5,8,37,8,6,6,WD,1);for(const x of [4,38]){o.blob(x,8,2.6,6.2,EN,2);}
  const c0=o.render(M,{soft:.4}),g=c0.getContext('2d');g.fillStyle='rgba(30,16,10,.75)';for(let k=0;k<3;k++){const yy=Math.round(3+((k*4+f*1.3)%11));g.fillRect(7,yy,28,1);}
  g.fillStyle='#5a3a20';for(const x of [3,37]){g.fillRect(x,7,2,2);g.fillRect(x-1,8,1,1);}return c0;}
function boulder9(f){const o=PXR(22,20),RK=0,M=[{ramp:RP.rock,tex:'rock',cs:4}];o.blob(11,10,9,8.6,RK,1);
  const c0=o.render(M,{soft:.38}),g=c0.getContext('2d');g.fillStyle='rgba(20,16,18,.8)';const a0=f*.9;for(let k=0;k<3;k++){const a=a0+k*2.1;g.fillRect(Math.round(11+Math.cos(a)*5),Math.round(10+Math.sin(a)*4.6),2,1);}return c0;}
// ---------- UTILERÍA: TRIBUNAL INFERNAL ----------
function obsPillar9(){const o=PXR(14,42),OB=0,CH=1,M=[{ramp:RP.obsid,tex:'rock',cs:3},{ramp:RP.chain}];
  o.poly([[3,40],[11,40],[10,6],[7,1],[4,6]],OB,1,2);o.cap(2,40,12,40,1.4,1.4,OB,1.2);
  for(let k=0;k<6;k++){o.blob(4+k*1.2,14+k*2.6,.9,.7,CH,2);}for(let k=0;k<6;k++){o.blob(10-k*1.2,22+k*2.4,.9,.7,CH,2);}
  const c=o.render(M,{soft:.38}),g=c.getContext('2d');for(const [x,y] of [[7,10],[7,18],[7,26]]){g.fillStyle='#e8333f';g.fillRect(x,y,1,2);}return {img:c,w:1.5,h:4.6};}
function brazier9(){const o=PXR(16,24),MT=0,M=[{ramp:RP.iron}];o.cap(8,23,8,10,1,1,MT,1);o.cap(4,23,12,23,1,1,MT,1);o.poly([[2,8],[14,8],[12,13],[4,13]],MT,2,1.5);
  const c=o.render(M,{soft:.38}),g=c.getContext('2d');for(let k=0;k<10;k++)for(let w=-3;w<=3;w++){if(Math.abs(w)>(10-k)/2.4)continue;g.fillStyle=k<3?'#ffffff':k<6?'#ffd541':'#fa6a0a';g.fillRect(8+w+(k>6?((k+w)%2?1:-1):0),7-k,1,1);}return {img:c,w:1.6,h:2.4};}
function cage9(){const o=PXR(20,30),CH=0,BN=1,M=[{ramp:RP.chain},{ramp:RP.bone}];o.cap(10,0,10,4,.6,.6,CH,1);o.blob(10,6,7,2.4,CH,1);
  for(let k=0;k<6;k++){const x=4+k*2.4;o.cap(x,6,x,26,.55,.55,CH,2);}o.blob(10,26,7,2,CH,2.1);o.blob(10,22,2.2,2.4,BN,1.5);o.blob(10,18,1.8,1.8,BN,1.6);
  return {img:o.render(M,{soft:.38}),w:2,h:3};}
function spikes9(){const o=PXR(18,18),MT=0,BN=1,M=[{ramp:RP.iron},{ramp:RP.bone}];for(const [x,h] of [[3,10],[7,16],[11,12],[15,9]])o.poly([[x-1.4,17],[x+1.4,17],[x,17-h]],MT,1,1);o.blob(7,3,1.6,1.6,BN,2);
  return {img:o.render(M,{soft:.38}),w:1.8,h:1.8};}
// ---------- UTILERÍA: PLANOS CÓSMICOS ----------
function crystal9(c2){const o=PXR(16,40),CR=0,M=[{ramp:c2?RP.crystC:RP.cryst}];
  o.poly([[5,39],[11,39],[12,12],[8,1],[4,12]],CR,1,2);o.poly([[1,39],[5,39],[5,22],[2,17],[0,24]],CR,.8,1.5);o.poly([[11,39],[15,39],[16,26],[13,20],[11,26]],CR,.9,1.5);
  const c=o.render(M,{soft:.3}),g=c.getContext('2d');g.fillStyle='#ffffff';g.fillRect(7,6,1,8);g.fillRect(2,24,1,4);return {img:c,w:1.6,h:4};}
function floatRock9(){const o=PXR(24,22),RK=0,CR=1,M=[{ramp:RP.rockV,tex:'rock',cs:3},{ramp:RP.crystC}];
  o.poly([[2,6],[22,6],[18,13],[12,21],[6,13]],RK,1,2);o.blob(12,6,10,3,RK,1.2);o.poly([[9,6],[13,6],[11,0]],CR,2,1);o.poly([[15,6],[18,6],[17,2]],CR,2,1);
  return {img:o.render(M,{soft:.3}),w:2.4,h:2.2};}
function obelisk9(){const o=PXR(12,38),RK=0,M=[{ramp:RP.rockV,tex:'rock',cs:3}];o.poly([[2,37],[10,37],[9,6],[6,1],[3,6]],RK,1,2);
  const c=o.render(M,{soft:.3}),g=c.getContext('2d');for(const y of [10,16,22,28]){g.fillStyle=y%12?'#b86aff':'#6ad0e8';g.fillRect(6,y,1,3);g.fillRect(5,y+1,3,1);}return {img:c,w:1.2,h:3.8};}
// ---------- ÍCONOS (16x16) ----------
function icon10(kind){const c=document.createElement('canvas');c.width=16;c.height=16;const g=c.getContext('2d'),R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  const L=(x0,y0,x1,y1,col)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let k=0;k<=n;k++)R(Math.round(x0+(x1-x0)*k/n),Math.round(y0+(y1-y0)*k/n),1,1,col);};
  const E=(cx,cy,r,col)=>{for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r+r*.6)R(cx+x,cy+y,1,1,col);};
  switch(kind){
    case 'pierce':L(1,14,13,2,'#d8c8a0');L(2,14,14,2,'#8e6236');R(12,1,3,3,'#ffffff');for(const [x,y] of [[4,7],[8,9]]){E(x,y,2,'#4e8448');}break;
    case 'bounce':L(1,13,6,4,'#d8c8a0');L(6,4,11,12,'#d8c8a0');L(11,12,14,6,'#d8c8a0');R(13,5,2,2,'#ffffff');R(5,3,2,2,'#ffe27a');R(10,11,2,2,'#ffe27a');break;
    case 'rain':for(const [x,y] of [[3,2],[8,4],[12,1],[5,8],[11,9]]){R(x,y,2,3,'#fa6a0a');R(x,y+3,2,1,'#ffd541');R(x,y+4,1,1,'#ffffff');}R(0,14,16,2,'#6a3a1e');break;
    case 'rate':for(const y of [3,7,11]){L(1,y,12,y,'#d8c8a0');R(12,y-1,2,3,'#ffffff');R(1,y-1,1,3,'#e8404a');}break;
    case 'dmg':E(8,8,6,'#e8404a');E(8,8,4,'#ffffff');E(8,8,2,'#e8404a');L(9,7,15,1,'#8e6236');R(14,0,2,2,'#ffd541');break;
    case 'shield':for(let y=1;y<15;y++){const w=y<9?6:Math.max(1,6-(y-8));R(8-w,y,w*2,1,y<3?'#a8c84a':'#6b7a38');}R(7,3,2,10,'#3a2a14');R(4,6,8,2,'#3a2a14');break;
    case 'reinf':for(const [x,y] of [[3,4],[8,2],[12,5],[5,9],[10,9]]){R(x,y,3,3,'#3f7fe0');R(x,y+3,3,3,'#2a4a8a');R(x+1,y-1,1,1,'#ffe0b0');}R(7,13,2,3,'#ffffff');R(6,14,4,1,'#ffffff');break;
    case 'gold':E(6,9,4,'#c08a1c');E(6,9,3,'#ffd04a');E(10,6,4,'#c08a1c');E(10,6,3,'#ffd04a');R(9,5,2,1,'#fff3b0');R(12,12,3,3,'#e8333f');R(13,11,1,1,'#ffffff');break;
    case 'magic':E(8,8,6,'#5a3c8e');E(8,8,4,'#a87cf0');R(7,2,2,12,'#e0ccff');R(2,7,12,2,'#e0ccff');R(7,7,2,2,'#ffffff');break;
    case 'ent':R(6,6,4,9,'#8a5434');R(6,6,1,9,'#b07444');E(8,5,5,'#357a34');E(7,4,3,'#55a43e');R(6,9,1,1,'#ffe86a');R(9,9,1,1,'#ffe86a');break;
    case 'knight':R(4,2,8,7,'#7a7a8c');R(4,2,8,1,'#a4a4b4');R(5,5,6,1,'#24242e');R(7,0,2,3,'#b8342a');R(3,9,10,6,'#2a3e70');R(7,9,2,6,'#ffe07a');R(4,11,8,2,'#ffe07a');break;
    case 'druid':R(7,3,2,13,'#8e6236');E(8,4,3,'#55a43e');E(7,3,2,'#8cd05a');R(8,2,1,1,'#ffffff');for(const [x,y] of [[2,8],[13,6],[3,13],[12,12]])R(x,y,1,1,'#c8ff8a');break;
    case 'catapult':R(2,10,12,3,'#664226');E(3,13,2,'#40281a');E(13,13,2,'#40281a');L(5,10,11,2,'#8e6236');E(11,2,2,'#7a6e64');break;
    case 'wl':L(2,14,12,4,'#ffe27a');L(3,14,13,4,'#ff9a2a');R(12,2,3,3,'#ffffff');break;
    default:E(8,8,6,'#ffd04a');}
  return c;}
// ---------- JEFES POR TRAMO (se construyen al entrar al nivel) ----------
const BOSSFN=[troll10,lich10,(p,r,t)=>dragon10(p,r,'obsidiana',t),demon10,judge10,(p,r,t)=>guardian11(p,r,t),(p,r)=>chaos10(p,r)];
const BOSSCACHE={};
function bossSheets(bk,t){const key=bk+'_'+t;if(BOSSCACHE[key])return BOSSCACHE[key];const fn=BOSSFN[bk],cyc=(n,f)=>Array.from({length:n},(_,i)=>f(i));
  const dw=cyc(4,f=>fn(f/4*TAU9,0,t)),dr=cyc(5,f=>fn(0,f/4,t));
  const S={walk:sheet9(dw.map(d=>d.c),{mxs:dw.map(d=>d.gem[0]),mys:dw.map(d=>d.gem[1]),shw:.3}),raise:sheet9(dr.map(d=>d.c),{mxs:dr.map(d=>d.gem[0]),mys:dr.map(d=>d.gem[1]),shw:.3})};
  return BOSSCACHE[key]=S;}
function Sprites10(){const cyc=(n,f)=>Array.from({length:n},(_,i)=>f(i)),o={};
  const kn=sheet9(cyc(4,f=>knight9(f,4)));kn.nr=4;
  const dr=sheet9(cyc(4,f=>druid9(f,4)).concat([druid9(0,4,true)]),{mx:3,my:4});dr.nr=4;dr.shoot=4;
  const ct=sheet9(cyc(4,f=>catapult9(f,4)).concat([catapult9(0,4,true)]),{mx:11,my:1,shw:.32});ct.nr=4;ct.shoot=4;
  o.sol=[kn,dr,ct];
  o.zom=[sheet9(cyc(4,f=>shaman9(f,4)),{pc:['78,132,72','200,190,170','127,208,78']}),sheet9(cyc(4,f=>shieldOrc9(f,4)),{pc:['108,122,70','90,90,110','142,98,54']}),
    sheet9(cyc(4,f=>harpy9(f,4)),{pc:['74,44,96','200,184,176','255,210,58'],shw:.2}),sheet9(cyc(4,f=>necro9(f,4)),{pc:['90,60,142','200,194,174','200,122,255']})];
  o.mini=sheet9(cyc(4,f=>warlord9(f,4)),{pc:['78,132,72','90,90,110','255,200,60'],shw:.3});
  o.log=cyc(4,f=>log9(f));o.boulder=cyc(4,f=>boulder9(f));
  o.props={pillar:obsPillar9(),brazier:brazier9(),cage:cage9(),spikes:spikes9(),cryst:[crystal9(0),crystal9(1)],frock:floatRock9(),obelisk:obelisk9()};
  o.icons={};for(const k of ['pierce','bounce','rain','rate','dmg','shield','reinf','gold','magic','ent','knight','druid','catapult','wl'])o.icons[k]=icon10(k);
  return o;}
