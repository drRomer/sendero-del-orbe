// dragon10.js — dragón cuadrúpedo, alas rasgadas, cabeza en cuña con fauces y fuego
const DPAL={
  obsidiana:{sc:['#0e0c12','#1a1620','#2a2432','#3c3446','#544a5e','#6e6278'],bl:['#1e100a','#34200e','#4e3014','#6a441c','#865a26'],wg:['#1a0608','#2e0c10','#4a1218','#681c22','#86282c'],hn:['#2a2420','#4a4038','#76695a','#a8987e','#d2c4a4'],eye:['#ff6a00','#ffd23a'],fire:['#fa6a0a','#ffd541','#ffffff']},
  veneno:{sc:['#081410','#10241c','#183a2a','#22543a','#34724c','#4e9460'],bl:['#1e1e0c','#323214','#4a4a1e','#64622a','#7e7c38'],wg:['#100c1a','#1c1630','#2c2248','#3e3062','#52427c'],hn:['#2a2420','#4a4038','#76695a','#a8987e','#d2c4a4'],eye:['#7aff2a','#e8ff9a'],fire:['#3ad84a','#b8ff6a','#f4ffe0']},
  carmesi:{sc:['#1a060a','#300a12','#4c1018','#6e1a20','#922a28','#b44434'],bl:['#2a1a0c','#443014','#5e461e','#7a5e2a','#987838'],wg:['#12080c','#22101a','#341a28','#4a2438','#5e3048'],hn:['#1a1418','#2e262c','#4a4048','#6e646a','#948a8c'],eye:['#ffd23a','#fff4b0'],fire:['#fa6a0a','#ffd541','#ffffff']},
};
function dragon10(ph,r,pal,t){pal=DPAL[pal||'obsidiana'];r=r||0;t=t||0;
  const PX=4,o0=PXR(104+PX*2,94+PX*2),DY=6+PX,o={cap:(a,b,c,d,e,f,g,h)=>o0.cap(a+PX,b+DY,c+PX,d+DY,e,f,g,h),blob:(a,b,c,d,e,f,g)=>o0.blob(a+PX,b+DY,c,d,e,f,g),poly:(P,m,z,bv)=>o0.poly(P.map(q=>[q[0]+PX,q[1]+DY]),m,z,bv),glow:(a,b,c)=>o0.glow(a+PX,b+DY,c),render:(M,op)=>o0.render(M,op)},S=0,BL=1,WG=2,HN=3,V=4,M=[{ramp:pal.sc,tex:'scale',cs:4},{ramp:pal.bl},{ramp:pal.wg},{ramp:pal.hn},{ramp:['#060406','#0e080a','#160c0e']},{ramp:['#14141c','#2a2a38','#464658','#6a6a80','#9696ac','#c4c4d4']}],MT=5;
  const s=Math.sin(ph||0),c=Math.cos(ph||0),bb=Math.round(Math.abs(s)*1.5),y=-bb-Math.round(r*2);
  const la=r>0?0:Math.round(s*3),wf=Math.round(c*2)+Math.round(r*4),CX=52;
  const H=y+Math.round(Math.sin((ph||0)+.6))-Math.round(r*4),HY=18+H,jo=r>.4?Math.round((r-.4)*7):0;
  const [F1,F2,F3]=pal.fire;
  // ---- alas rasgadas
  for(const d of [-1,1]){const rx=CX+d*13,ry=36+y,ex=CX+d*30,ey=19+y-wf,wx=CX+d*45,wy=9+y-wf*1.3;
    const tips=[[CX+d*51,33+y-wf*.6],[CX+d*48,48+y-wf*.3],[CX+d*37,58+y],[CX+d*23,56+y]];
    const pts=[[rx,ry],[ex,ey],[wx,wy],tips[0]];
    for(let i=1;i<tips.length;i++){const a=tips[i-1],b=tips[i],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;pts.push([mx+(wx-mx)*.24,my+(wy-my)*.24],b);}
    pts.push([CX+d*14,48+y]);o.poly(pts,WG,0,3);
    o.cap(rx,ry,ex,ey,2.8,2,S,.2);o.cap(ex,ey,wx,wy,2,1.4,S,.2);
    for(const t of tips)o.cap(wx,wy,t[0],t[1],1,.5,S,.15);
    o.poly([[wx-1.4,wy+1],[wx+1.4,wy+1],[wx+d*2,wy-6]],HN,.3,1);o.poly([[ex-1.2,ey+1],[ex+1.2,ey+1],[ex+d*1,ey-4]],HN,.3,1);}
  // ---- cola con púa
  const tw=Math.round(s*2);
  o.cap(CX+12,66+y,CX+30,74,4.6,3,S,.6);o.cap(CX+30,74,CX+42,66+tw,3,2,S,.6);o.cap(CX+42,66+tw,CX+45,54+tw,2,1.2,S,.6);
  if(t>=1){o.blob(CX+45.5,51+tw,4.4,4.4,MT,.75);for(let k=0;k<7;k++){const a=k/7*Math.PI*2-.4,bx=CX+45.5+Math.cos(a)*3.8,by=51+tw+Math.sin(a)*3.8;o.poly([[bx-1.1,by],[bx+1.1,by],[bx+Math.cos(a)*3.4,by+Math.sin(a)*3.4]],MT,.76,1);}}else o.poly([[CX+43,56+tw],[CX+48,55+tw],[CX+46,47+tw]],HN,.7,1);for(const [tx,ty] of [[CX+22,70],[CX+34,71],[CX+41,62+tw]])o.poly([[tx-1.2,ty-2],[tx+1.2,ty-2],[tx,ty-5]],HN,.65,1);
  // ---- patas traseras
  for(const d of [-1,1]){o.blob(CX+d*13,66+y,6,7,S,1);o.cap(CX+d*13,70+y,CX+d*12,80,4,3.4,S,1);o.blob(CX+d*12,82,5,2.4,S,1.1);}
  // ---- lomo y púas dorsales
  o.blob(CX,46+y,16,8,S,2.4);for(const [dx,h] of [[-12,4],[-8,6],[8,6],[12,4]])o.poly([[CX+dx-2,40+y],[CX+dx+2,40+y],[CX+dx,40+y-h]],HN,2.3,1);
  // ---- torso y vientre con corazón de brasa
  o.blob(CX,57+y,17,13,S,3);
  o.cap(CX,46+y,CX,69+y,5.2,3,BL,3.2);for(let k=48+y;k<68+y;k+=3.2){const hw=5-(k-46-y)*.09;o.cap(CX-hw,k,CX+hw,k,.4,.4,V,3.3);}
  if(t>=2){o.poly([[CX-9,45+y],[CX+9,45+y],[CX+8,61+y],[CX,68+y],[CX-8,61+y]],MT,3.4,2);for(const k of [50,55,60])o.cap(CX-7,k+y,CX+7,k+y,.45,.45,V,3.45);for(const [dx,dy] of [[-6,47],[6,47],[-6,58],[6,58]])o.glow(CX+dx,dy+y,'#c4c4d4');}
  // ---- patas delanteras abiertas con garras en hoz
  for(const d of [-1,1]){const lift=(d<0?la>0:la<0)?Math.abs(la):0;
    o.blob(CX+d*16,48+y,6.5,6.5,S,4);if(t>=2){o.blob(CX+d*16,46+y,7.6,5.6,MT,4.05,d*-.35);o.poly([[CX+d*19,42+y],[CX+d*22,43+y],[CX+d*24,36+y]],MT,4.06,1);}
    const ex=CX+d*27,ey=61+y-lift*.5,fx=CX+d*23,fy=79-lift;
    o.cap(CX+d*17,50+y,ex,ey,5.4,4.3,S,4.1);o.cap(ex,ey,fx,fy,4.3,3.5,S,4.2);o.blob(fx,fy+2.5,6,3,S,4.3);
    o.poly([[ex+d*2,ey-3],[ex+d*3,ey+1],[ex+d*8,ey-2]],HN,4.15,1);
    for(const [cx,cl] of [[-4,4],[0,5],[4,4]]){const bx=fx+cx,by=fy+4;o.poly([[bx-1.3,by-1],[bx+1.3,by-1],[bx+(cx<0?-1:cx>0?1:0)*1.5,by+cl]],HN,4.4,1);}}
  // ---- cuello con placas de garganta
  o.cap(CX,48+y,CX,HY+6,8.5,7,S,4.6);
  o.cap(CX,48+y,CX,HY+18,4.6,4,BL,4.7);for(let k=HY+20;k<48+y;k+=3)o.cap(CX-4,k,CX+4,k,.4,.4,V,4.75);
  // ---- cabeza en cuña
  for(const d of [-1,1]){
    o.cap(CX+d*7,HY-4,CX+d*17,HY-10,3,2,HN,5.9);o.cap(CX+d*17,HY-10,CX+d*21,HY-20,2,.6,HN,5.9);
    o.cap(CX+d*4,HY-6,CX+d*9,HY-15,1.8,.6,HN,5.85);
    o.poly([[CX+d*10,HY-1],[CX+d*22,HY+1],[CX+d*10,HY+3]],HN,6.05,1);o.poly([[CX+d*9,HY+4],[CX+d*18,HY+9],[CX+d*8,HY+7]],HN,6.05,1);}
  o.blob(CX,HY,12,8,S,6);
  for(const d of [-1,1]){o.cap(CX+d*10.5,HY-3.5,CX+d*3,HY+.5,2,1.5,S,6.4);o.blob(CX+d*6,HY+1.4,2.8,1.4,V,6.3);}
  if(t>=3){o.blob(CX,HY-3,11.6,5.6,MT,6.45);o.cap(CX-11.5,HY-.6,CX+11.5,HY-.6,1.3,1.3,MT,6.5);o.cap(CX,HY-1,CX,HY+7,1.3,1,MT,6.76);for(const d of [-1,0,1])o.poly([[CX+d*5-1.4,HY-7],[CX+d*5+1.4,HY-7],[CX+d*5,HY-(d?12:14)]],MT,6.46,1);}
  // fauces
  o.blob(CX,HY+22+jo,6.8,3.4,S,6.5);
  o.blob(CX,HY+19+jo*.5,5.4,2.3+jo*.6,V,6.6);
  o.blob(CX,HY+9,6.4,8.4,S,6.7);o.blob(CX,HY+15,5.2,2.6,S,6.72);o.cap(CX,HY+3,CX,HY+13,1.2,1.4,S,6.73);o.poly([[CX-1.3,HY+6],[CX+1.3,HY+6],[CX,HY+1]],HN,6.75,1);
  for(const d of [-1,1]){o.poly([[CX+d*3.2,HY+17.5],[CX+d*5.2,HY+17.5],[CX+d*4.2,HY+24+jo*.5]],HN,6.8,1);o.poly([[CX+d*1.4,HY+23+jo],[CX+d*3,HY+23+jo],[CX+d*2.2,HY+19+jo*.6]],HN,6.8,1);
    o.cap(CX+d*4.5,HY+5,CX+d*6.5,HY+12,.8,.6,HN,6.74);}
  for(const x of [-2,0,2])o.glow(CX+x,HY+18,pal.hn[4]);
  const gl=r>.4?3:1;for(let x=-gl;x<=gl;x++)o.glow(CX+x,HY+20+jo*.5,Math.abs(x)<gl?F2:F1);
  // ojos rasgados furiosos
  for(const d of [-1,1]){o.glow(CX+d*8,HY,pal.eye[0]);o.glow(CX+d*7,HY+1,pal.eye[1]);o.glow(CX+d*6,HY+1,pal.eye[1]);o.glow(CX+d*5,HY+2,pal.eye[0]);}
  // fosas y humo
  o.glow(CX-2,HY+15,'#000000');o.glow(CX+2,HY+15,'#000000');
  if(r<.4){const f=Math.round(((ph||0)/(Math.PI*2))*4)%4;for(const d of [-1,1])for(let k=0;k<3;k++){const sy=HY+12-k*2-f,sx=CX+d*(3+k+(f>>1));o.glow(sx,sy,k?'#6a6070':'#8a8090');}}
  // corazón de brasa (punto del cristal)
  const hx=CX,hy2=58+y;o.glow(hx,hy2,F2);for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])o.glow(hx+dx,hy2+dy,F1);
  // aliento de fuego
  if(r>.7){const fr=3+9*(r-.7)/.3,fx=CX,fy=HY+24+jo+fr*.55;
    for(let yy=-fr;yy<=fr;yy++)for(let xx=-fr*1.2;xx<=fr*1.2;xx++){const d=Math.hypot(xx/1.2,yy);if(d>fr)continue;const n=Math.sin(xx*1.7+yy*2.3)*.12;o.glow(fx+xx,fy+yy,d<fr*(.35+n)?F3:d<fr*(.68+n)?F2:F1);}
    for(const [dx,h] of [[-fr,6],[fr,6],[-fr*.5,9],[fr*.5,9]])for(let k=0;k<h;k++)o.glow(fx+dx+(k%2?1:0),fy+fr*.6+k,k<h/2?F2:F1);}
  return {c:o.render(M,{soft:.3,aura:t>=4?{c:['#ffe27a','#ff8a22','#c0301a'],w:4,seed:Math.round((ph||0)*10+r*7)}:null}),gem:[hx+PX,hy2+DY]};}
