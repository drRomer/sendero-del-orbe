// guard10.js — guardianes alternados: Ent / Antiguo Errante, lobos / sabuesos espirituales, hipogrifo / pegaso
RP.rockV2=['#141020','#262036','#3a3250','#544a6e','#70668c','#9088aa'];
RP.nebula=['#160a34','#281658','#3e2a8a','#5a44b8','#7e68e0','#b0a0ff'];
RP.wolf=['#1e1c22','#34303a','#4e4854','#6e6672','#948a94','#bcb2b8'];
RP.wolfL=['#4a444e','#6e6672','#948a94','#c0b6bc','#e2dade'];
RP.spirit=['#140e38','#22206a','#343aa0','#4e62d0','#7aa0f0','#bce0ff'];
RP.spiritL=['#22206a','#4e62d0','#7aa0f0','#bce0ff','#ffffff'];
RP.gHead=['#3a3430','#6a625a','#9c948a','#c8c0b4','#ece6dc'];
RP.gWing=['#2a1a10','#46301e','#6a4a2e','#946a42','#bc905a'];
RP.gBody=['#2e1e14','#4e3422','#724e32','#9a6c44','#c08c5a'];
RP.pBody=['#4a5064','#7a809c','#a8b0cc','#d4dcef','#f4f6ff'];
RP.pWing=['#2a2070','#4a3ca8','#7a6ae0','#b0a4ff','#e8e2ff'];
RP.beak=['#5a3a08','#9a6a14','#d8a424','#ffd65a'];
function errante10(k,ph,back,u){const o=PXR(64,86),B=0,LF=1,V=2,M=[{ramp:RP.rockV2,tex:'rock',cs:3},{ramp:RP.nebula,tex:'leaf',bias:.06},{ramp:RP.void}];
  const s=Math.sin(ph||0),bb=Math.round(Math.abs(s)*1.5),cr=k*20,y=-bb+cr,la=back?Math.round(s*3):0;u=u||0;
  const kn=k*7; // rodillas abiertas al agacharse
  // piernas
  const leg=(hx,hz,dir,lift,z)=>{const kx=hx+dir*(3+kn),ky=67+cr*.55-lift,fx=hx+dir*(4+kn*.6),fy=79;
    o.cap(hx,55+y,kx,ky,5.6,4.4,B,z);o.cap(kx,ky,fx,fy-lift*.5,4.4,3.8,B,z);
    o.cap(fx,fy,fx+dir*7,82,2.8,1.2,B,z+.1);o.cap(fx,fy,fx-dir*4,83,2.4,1.2,B,z+.1);o.cap(fx,fy-1,fx+dir,84,2,1,B,z+.1);};
  leg(27,0,-1,la>0?3:0,back?1:3);leg(39,0,1,la<0?3:0,back?3:1);
  o.blob(33,55+y,9,5,B,2);
  o.cap(33,55+y,31,33+y,8,12,B,4);o.blob(20,33+y,7,5,B,5,.35);o.blob(43,32+y,6.5,5,B,4.5,-.3);
  // brazos
  const down=k*10;
  const armL=(z)=>{const sw=back?Math.round(s*3):0;o.cap(19,33+y,11,47+y+sw+down*.3,5.2,4.2,B,z);o.cap(11,47+y+sw+down*.3,8,61+y+sw*1.4+down*.2,4.2,3.6,B,z+.2);o.blob(8,62+y+sw*1.4+down*.2,4.2,3.2,B,z+.3);
    for(const [dx,ex,ey] of [[-1,-5,10],[1,0,12],[2,4,10]])o.cap(8+dx,63+y+sw*1.4+down*.2,8+dx+ex,63+y+ey+sw*1.4+down*.2,1.7,.8,B,z+.4);};
  const armR=(z)=>{const sw=back?-Math.round(s*3):0;
    if(u>0){const ex=44+10*(1-u),ey=32+y-12*u,hx=46+6*(1-u),hy=34+y-19*u;o.cap(44,32+y,ex,ey+sw,4.6,3.8,B,z);o.cap(ex,ey+sw,hx,hy+sw,3.8,3.2,B,z+.1);o.blob(hx,hy-3+sw,4.6,4,B,z+.2);
      for(const [dx,ex2,ey2] of [[-2,-3,-6],[0,0,-7],[2,3,-6]])o.cap(hx+dx,hy-5+sw,hx+dx+ex2,hy-5+ey2+sw,1.5,.7,B,z+.3);}
    else{o.cap(44,32+y,52,43+y+sw+down*.3,4.6,3.6,B,z);o.cap(52,43+y+sw+down*.3,56,55+y+sw*1.4+down*.2,3.6,3,B,z+.1);
      for(const [ex,ey] of [[5,8],[0,9],[-4,7]])o.cap(56,55+y+sw*1.4+down*.2,56+ex,55+y+ey+sw*1.4+down*.2,1.5,.7,B,z+.2);}};
  if(back){armL(3.5);armR(7);}else{armR(3.5);armL(7);}
  // cabeza
  o.blob(30,23+y+k*3,8,9,B,6);
  if(!back){o.cap(23,20+y+k*3,37,19+y+k*3,2.2,2.2,B,6.5);o.blob(26.5,22+y+k*3,2.4,1.7,V,6.6);o.blob(33.5,22+y+k*3,2.4,1.7,V,6.6);
    o.cap(30,23+y+k*3,30.5,27+y+k*3,1.6,1.3,B,6.62);o.cap(27.5,29.5+y+k*3,32.5,29+y+k*3,.6,.6,V,6.6);}
  else{o.cap(30,18+y,30,32+y,1,1,B,6.4);}
  // ramas y copa frondosa
  const hy=k*3;
  for(const [x0,y0,x1,y1] of [[28,16,23,5],[31,15,32,3],[34,16,40,7],[26,17,19,10],[36,18,42,13]])o.cap(x0,y0+y+hy,x1,y1+y+hy,1.7,.8,B,5.5);
  o.blob(30,11+y+hy,13,8,LF,5.4);o.blob(21,13+y+hy,6,5,LF,5.45);o.blob(40,12+y+hy,6,5,LF,5.45);
  for(const [x,yy,rx,ry] of [[23,5,4,3],[32,3,4.5,3],[40,7,4,3],[19,10,3.5,2.6],[42,13,3.5,2.6],[27,8,3.5,2.6],[36,9,3.5,2.6],[31,10,3,2]])o.blob(x,yy+y+hy,rx,ry,LF,back?7.5:7);
  o.blob(19,31+y,6,3.5,LF,5.3,.35);o.blob(44,29+y,5,3,LF,4.7,-.3);
  if(!back){o.blob(25,17+y+hy,3,2,LF,6.7);o.blob(36,17+y+hy,3,2,LF,6.7);}
  else{o.blob(28,40+y,4,2.4,LF,4.3);o.blob(36,26+y,3,2,LF,6.5);}
  o.blob(37,46+y,3,2,LF,4.2);
  if(!back){const ey=22+y+k*3;if(k>.75){for(const x of [25,26,27,33,34,35])o.glow(x,ey,'#3a2216');}else for(const [x,c] of [[26,'#6ad0ff'],[27,'#ffffff'],[33,'#6ad0ff'],[34,'#ffffff']])o.glow(x,ey,c);}
  // constelaciones en la corteza y estrellas en la copa
  const C=[[24,40],[29,36],[34,41],[31,47],[36,52],[27,52]];for(let q=0;q<C.length;q++){const [x0,y0]=C[q];o.glow(x0,y0+y,'#c8f4ff');if(q){const [x1,y1]=C[q-1],n=6;for(let w=1;w<n;w++)if(w%2)o.glow(x1+(x0-x1)*w/n,y1+(y0-y1)*w/n+y,'#4a8ab0');}}
  for(const [x,yy] of [[22,6],[30,2],[38,8],[26,12],[34,11],[41,14],[19,11],[31,9]])o.glow(x,yy+y+k*3,(x+yy)%3?'#ffffff':'#ffe9a0');
  // linterna de luz estelar en la mano izquierda
  if(!u){const lx=back?8:8,ly=72+y+(back?Math.round(Math.sin(ph||0)*3*1.4):0)+k*2;for(let yy=-3;yy<=3;yy++)for(let xx=-2;xx<=2;xx++){const d=Math.hypot(xx,yy*.8);if(d<=2.6)o.glow(lx+xx,ly+yy,d<1?'#ffffff':d<1.8?'#fff0b0':'#ffb46a');}o.glow(lx,ly-4,'#8a8090');o.glow(lx,ly-5,'#8a8090');}
  return o.render(M,{soft:.34});}
// ---------- LOBO / SABUESO ESPIRITUAL ----------
// pose: 'sit' (de frente, encadenado, gruñe), 'run' (de espaldas, galopa), 'bite' (de frente, se lanza)
function wolf10(f,n,pose,cos){const o=PXR(28,22,1.25),F=0,L=1,V=2,M=[{ramp:cos?RP.spirit:RP.wolf,bias:cos?.08:0},{ramp:cos?RP.spiritL:RP.wolfL},{ramp:RP.void}];
  const t=f/n*TAU9,s=Math.sin(t),EY=cos?['#ffffff','#9ae8ff']:['#ffd23a','#fff3a0'];
  if(pose==='run'){// de lado, galopando hacia la derecha (en el juego se voltea)
    const y=-Math.round(Math.abs(s)*1.5),ga=s,ext=Math.cos(t);
    o.cap(19,10+y,25,8+y-Math.round(ga),1.6,.8,F,.5);o.blob(26,8+y-Math.round(ga),1.4,1.1,L,.6);
    o.cap(7,13+y,7+ext*3,19,1.4,1,F,1);o.cap(10,13+y,10-ext*3,19,1.4,1,F,1.2);
    o.cap(6,11+y,19,11+y,4,4.6,F,2);o.cap(7,13+y,17,13+y,2.2,2,L,2.05);
    o.cap(16,13+y,17-ext*3,19,1.4,1,F,2.4);o.cap(19,13+y,20+ext*3,19,1.4,1,F,2.6);
    o.blob(4,8+y,3.4,3,F,3);o.cap(4,9+y,0,10+y,1.8,1.4,F,3.1);o.blob(.5,10.5+y,1.2,.9,L,3.2);o.poly([[4,6+y],[6,5.5+y],[5.6,2.6+y]],F,3.05,1);o.poly([[2.6,6+y],[4,5+y],[2.8,2.4+y]],F,3.04,1);
    o.glow(3,7.5+y,EY[0]);o.glow(0,9.6+y,'#120a10');
    if(cos)for(let k=0;k<6;k++)o.glow(20+((k*5+f*3)%8),6+((k*3+f)%10),k%2?'#9ae8ff':'#d8b8ff');
    return o.render(M,{soft:.4});}
  const lunge=pose==='bite',y=lunge?2:0,bb=Math.round(Math.abs(s));
  o.blob(8,16+y,3.6,3,F,1);o.blob(20,16+y,3.6,3,F,1);
  o.cap(21,16+y,25,11+y-bb,1.8,1,F,.8);o.blob(25.5,10+y-bb,1.4,1.2,L,.9);
  o.blob(14,13+y,5.4,5.4,F,2);o.blob(14,15+y,3.4,3.6,L,2.1);
  const fl=lunge?3:0;o.cap(11.5,15+y,11-fl*.4,21,1.4,1.2,F,2.5);o.cap(16.5,15+y,17+fl*.4,21,1.4,1.2,F,2.5);o.blob(11-fl*.4,21,1.6,.9,L,2.6);o.blob(17+fl*.4,21,1.6,.9,L,2.6);
  const hy=(lunge?9:6)+y;o.blob(14,hy,4.2,3.6,F,3);o.blob(14,hy+2.6,2.4,1.9,L,3.1);o.poly([[10,hy-1],[12,hy-2.4],[10.6,hy-5]],F,3.05,1);o.poly([[18,hy-1],[16,hy-2.4],[17.4,hy-5]],F,3.05,1);
  o.glow(12,hy-.5,EY[0]);o.glow(16,hy-.5,EY[0]);o.glow(14,hy+1.6,'#120a10');
  if(lunge||(f%2)){o.blob(14,hy+4,1.8,1.2,V,3.2);o.glow(13,hy+3.5,'#ffffff');o.glow(15,hy+3.5,'#ffffff');}
  if(cos)for(let k=0;k<6;k++)o.glow(4+((k*7+f*3)%20),3+((k*5+f)%16),k%2?'#9ae8ff':'#d8b8ff');
  return o.render(M,{soft:.4});}
// ---------- HIPOGRIFO / PEGASO ----------
// pose: 'perch' (de frente, alas plegadas), 'fly' (de espaldas, aleteo), 'dive' (alas recogidas en picada)
function griffin10(f,n,pose,cos){const o=PXR(56,46),HD=0,WG=1,BD=2,BK=3,V=4,M=[{ramp:cos?RP.pBody:RP.gHead},{ramp:cos?RP.pWing:RP.gWing,bias:cos?.06:0},{ramp:cos?RP.pBody:RP.gBody},{ramp:cos?RP.pBody:RP.beak},{ramp:RP.void}];
  const t=f/n*TAU9,s=Math.sin(t),CX=28;
  if(pose==='fly'||pose==='dive'){const up=pose==='dive'?1:(f%n)/(n-1),wy=pose==='dive'?-10:Math.round(Math.sin(t)*9);
    for(const d of [-1,1]){const tip=[CX+d*(pose==='dive'?12:26),20+wy-(pose==='dive'?14:0)];
      o.poly([[CX+d*3,20],[CX+d*10,14+wy*.4],tip,[CX+d*(pose==='dive'?13:24),26+wy*.6],[CX+d*16,28+wy*.3],[CX+d*8,27]],WG,0,2);
      for(let k=0;k<3;k++)o.cap(CX+d*(8+k*5),18+wy*(.3+k*.2),CX+d*(10+k*6),27+wy*(.3+k*.12),.6,.4,WG,.1);}
    for(let k=-1;k<=1;k++)o.cap(CX+k,28,CX+k*2+Math.round(s*2),40-Math.abs(k),1.6,.7,cos?WG:V,1.5);if(cos)for(let k=0;k<5;k++)o.glow(CX+Math.round(s*2)+((k*3)%5)-2,32+k*2,'#e8e2ff');
    o.cap(CX,15,CX,24,4.6,6,BD,2);o.blob(CX,25,6.4,4.6,BD,2.1);o.cap(CX-4,26,CX-5,31,1.8,1.4,BD,1.8);o.cap(CX+4,26,CX+5,31,1.8,1.4,BD,1.8);
    o.cap(CX,13,CX,18,3.8,4.2,HD,2.3);
    o.blob(CX,10,4,4,HD,3);if(!cos){o.poly([[CX-3,8],[CX-1.5,7],[CX-2.5,3]],HD,3.1,1);o.poly([[CX+3,8],[CX+1.5,7],[CX+2.5,3]],HD,3.1,1);}
    else{for(let k=0;k<4;k++)o.cap(CX,8+k*2,CX+Math.round(s*2)+1,10+k*2,1,.5,WG,3.1);for(let k=0;k<5;k++)o.glow(CX-1+((k*2)%3),6+k*2,'#ffffff');}
    return o.render(M,{soft:.36});}
  // posado y encadenado (de frente)
  const b=Math.round(Math.abs(s)*1),y=-b;
  for(const d of [-1,1]){o.poly([[CX+d*6,18+y],[CX+d*17,12+y],[CX+d*19,26+y],[CX+d*14,38],[CX+d*8,32]],WG,1,2);for(let k=0;k<3;k++)o.cap(CX+d*(9+k*3),16+y+k*2,CX+d*(12+k*2),34-k*2,.5,.4,WG,1.1);}
  o.blob(CX-8,36,5,4,BD,1.5);o.blob(CX+8,36,5,4,BD,1.5);o.cap(CX-10,38,CX-11,43,1.6,1.4,BD,1.6);o.cap(CX+10,38,CX+11,43,1.6,1.4,BD,1.6);
  o.cap(CX,22+y,CX,34,7,6,BD,2);o.blob(CX,22+y,6,6,HD,2.4);
  for(const d of [-1,1]){o.cap(CX+d*4,32+y,CX+d*4.5,41,2,1.6,cos?BD:HD,2.6);o.cap(CX+d*4.5,40,CX+d*4.5,42.5,1.4,1.2,cos?BD:BK,2.65);for(const k of [-1,0,1])o.cap(CX+d*4.5,42.5,CX+d*4.5+k*1.4,44.5,.5,.4,cos?BD:BK,2.7);}
  if(!cos){o.blob(CX,12+y,5,5,HD,3);o.poly([[CX-4,9+y],[CX-2,8+y],[CX-4,3+y]],HD,3.05,1);o.poly([[CX+4,9+y],[CX+2,8+y],[CX+4,3+y]],HD,3.05,1);
    o.poly([[CX-2,13+y],[CX+2,13+y],[CX+1,17+y],[CX,19+y],[CX-1,17+y]],BK,3.2,1);o.glow(CX-2,11+y,'#ffb02a');o.glow(CX+2,11+y,'#ffb02a');o.glow(CX-2,10+y,'#120a10');o.glow(CX+2,10+y,'#120a10');}
  else{o.cap(CX,8+y,CX,18+y,3.6,2.6,HD,3);o.blob(CX,18+y,2.8,1.8,HD,3.1);o.poly([[CX-3,8+y],[CX-1.6,6+y],[CX-2.6,2+y]],HD,3.05,1);o.poly([[CX+3,8+y],[CX+1.6,6+y],[CX+2.6,2+y]],HD,3.05,1);
    for(let k=0;k<5;k++)o.cap(CX,5+k*2.6+y,CX+3+Math.round(s),7+k*2.6+y,1.1,.5,WG,3.2);o.glow(CX-2,11+y,'#9ae8ff');o.glow(CX+2,11+y,'#9ae8ff');o.glow(CX-1,18+y,'#4a5064');o.glow(CX+1,18+y,'#4a5064');
    for(let k=0;k<8;k++)o.glow(CX-14+((k*11)%28),6+((k*7)%30),k%2?'#ffffff':'#d8ccff');}
  return o.render(M,{soft:.36});}
function GuardSprites(){const cyc=(n,f)=>Array.from({length:n},(_,i)=>f(i));
  const mkEnt=fn=>({stand:sheet9(cyc(6,f=>fn(1-f/5,0,false,0)),{shw:.32}),walk:sheet9(cyc(6,f=>fn(0,f/6*TAU9,true,0)),{shw:.32}),raise:sheet9(cyc(5,f=>fn(0,0,true,f/4)),{shw:.32})});
  return {errante:mkEnt(errante10),
    wolf:[0,1].map(c=>({sit:sheet9([wolf10(0,4,'sit',c),wolf10(1,4,'sit',c)],{shw:.3}),run:sheet9(cyc(4,f=>wolf10(f,4,'run',c)),{shw:.3}),bite:sheet9([wolf10(0,4,'bite',c)],{shw:.3})})),
    grif:[0,1].map(c=>({perch:sheet9([griffin10(0,4,'perch',c)],{shw:.3}),fly:sheet9(cyc(4,f=>griffin10(f,4,'fly',c)),{shadow:false}),dive:sheet9([griffin10(0,4,'dive',c)],{shadow:false})}))};}
