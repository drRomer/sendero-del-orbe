// guard11.js — guardianes nuevos (diseños originales, criaturas de mitos de dominio público)
// Fénix, Gólem de cristal, Oso de guerra, Centauro, Valquiria, León guardián, Enano herrero.
// Las criaturas de suelo miran a la derecha (el juego las voltea); las voladoras se ven de frente.
const RP11={
  flame:['#3a0a06','#7a1a08','#c23a10','#f07a1c','#ffc040','#fff2a0'],
  flameD:['#2a0604','#5a1206','#92280c','#c84a14','#e8781e'],
  crys:['#0a2a3a','#145a6e','#2a8ca0','#58c4d0','#a8f0f4','#e8ffff'],
  crysD:['#06141e','#0c3040','#18506a','#2a7690','#4aa0b8'],
  bear:['#1a100a','#301c10','#4c2e18','#6c4424','#8e5e34','#ae7a48'],
  bearL:['#3e2a1a','#644630','#8c6a4a','#b4926c','#d8bc94'],
  plate:['#16161e','#2c2c3a','#464658','#646478','#8a8aa0','#b8b8cc'],
  banner:['#2a060a','#520c14','#7e1620','#aa2430','#d4404a'],
  horse:['#1e120a','#3a2214','#5c3a20','#80542e','#a4723e','#c4945a'],
  hair:['#1a0e08','#34200e','#56361a','#7a5228','#a0743c'],
  wingW:['#2e2e3c','#565668','#8484a0','#b4b4cc','#e0e0ee','#ffffff'],
  valk:['#1a1a28','#30304a','#4a4a6e','#6c6c96','#9494c0','#c4c4e8'],
  lion:['#3a2406','#6a440e','#a06c1a','#d09a30','#f0c050','#ffe48a'],
  mane:['#2a1206','#4e220a','#7a3810','#a4521a','#c87028'],
  beard:['#2a0e06','#4e1a0a','#7a2c12','#a6441c','#cc6428'],
  dTunic:['#0e1a2a','#16304a','#22466a','#326090','#4a80b4']
};
const M11=(...k)=>k.map(n=>typeof n==='string'?{ramp:RP11[n]||RP[n]}:n);

// ---------------- FÉNIX (de frente, alas abiertas) ----------------
function phoenix11(f,n,pose){const o=PXRw(44,40,4),B=0,D=1,G=2,M=M11('flame','flameD','gold');
  const t=f/n*TAU9,s=Math.sin(t),cx=22;
  const wing=(sd)=>{const up=pose==='dive'?-2:pose==='perch'?6:Math.round(s*7),tipX=cx+sd*(pose==='perch'?9:20),tipY=14-up;
    o.poly([[cx+sd*3,13],[tipX,tipY],[cx+sd*(pose==='perch'?8:17),tipY+7],[cx+sd*12,22-up*.3],[cx+sd*4,21]],D,1.5,2);
    for(let k=0;k<4;k++){const fx=lerp9(cx+sd*6,tipX,k/4),fy=lerp9(17-up*.4,tipY+2,k/4);o.cap(fx,fy,fx+sd*3,fy+6,1.6,.6,B,1.6);}};
  wing(-1);wing(1);
  // cola de llamas
  for(let k=-2;k<=2;k++)o.cap(cx+k*1.4,26,cx+k*3.2+Math.round(s*k*.4),37-Math.abs(k),1.6,.5,k%2?B:D,1.2);
  o.blob(cx,20,4.4,6.6,B,3);o.blob(cx,22,2.6,3.6,G,3.1);
  o.blob(cx,11,3.2,3,B,4);o.poly([[cx-1,12],[cx+1,12],[cx,15.5]],G,4.2,1);
  for(let k=-1;k<=1;k++)o.cap(cx+k*1.6,9,cx+k*3,3-Math.abs(k),1,.4,G,4.1);// cresta
  o.glow(cx-1.5,10.5,'#fff8d0');o.glow(cx+1.5,10.5,'#fff8d0');
  return o.render(M,{soft:.45,aura:{c:['#ffd25a','#ff8a2a','#c2361a'],w:2,seed:f}});}
function lerp9(a,b,k){return a+(b-a)*k;}

// ---------------- GÓLEM DE CRISTAL (de espaldas, camina hacia el frente) ----------------
function crystal11(f,n,pose){const o=PXR(36,40),C=0,D=1,R=2,M=[{ramp:RP11.crys,tex:'rock',cs:3,bias:.05},{ramp:RP11.crysD,tex:'rock',cs:3},{ramp:RP.rock,tex:'rock',cs:4}];
  const t=f/n*TAU9,s=Math.sin(t),y=pose==='walk'?-Math.round(Math.abs(s)):pose==='kneel'?4:0,la=pose==='walk'?Math.round(s*2):0,up=pose==='slam';
  o.cap(12,28+y,12,37-(la>0?1:0),3,3.4,D,1);o.cap(24,28+y,24,37-(la<0?1:0),3,3.4,D,1);
  o.blob(12,37.5,3.6,1.6,R,1.1);o.blob(24,37.5,3.6,1.6,R,1.1);
  o.blob(18,22+y,9.5,9,C,2);o.blob(18,26+y,7,4,D,2.1);
  // brazos enormes
  if(up){o.cap(8,15+y,5,4,3.2,3.6,C,3);o.cap(28,15+y,31,4,3.2,3.6,C,3);o.blob(5,3,4,3.6,D,3.2);o.blob(31,3,4,3.6,D,3.2);}
  else{o.cap(8,16+y,5,30+y+la,3.2,3.8,C,3);o.cap(28,16+y,31,30+y-la,3.2,3.8,C,3);o.blob(5,31+y+la,4,3.4,D,3.2);o.blob(31,31+y-la,4,3.4,D,3.2);}
  o.blob(18,11+y,4.6,4,C,4);
  // espinas de cristal en la espalda
  for(const [x,h] of [[12,6],[16,9],[20,9],[24,6],[18,12]])o.poly([[x-1.6,16+y],[x+1.6,16+y],[x+.3,16+y-h]],C,4.5,1);
  o.glow(16.5,10.5+y,'#e8ffff');o.glow(19.5,10.5+y,'#e8ffff');
  return o.render(M,{soft:.42});}

// ---------------- OSO DE GUERRA (de lado) ----------------
function bear11(f,n,pose){const o=PXR(34,26,1.2),F=0,L=1,P=2,BN=3,M=M11('bear','bearL','plate','banner');
  const t=f/n*TAU9,s=Math.sin(t),ext=Math.cos(t);
  if(pose==='run'||pose==='bite'){const y=pose==='bite'?1:-Math.round(Math.abs(s)*1.5),lg=pose==='bite'?0:ext;
    o.cap(9,16+y,9+lg*3,24,2.2,1.8,F,1);o.cap(13,16+y,13-lg*3,24,2.2,1.8,F,1.2);
    o.cap(7,12+y,23,12+y,6,6.6,F,2);o.blob(15,16+y,7,3,L,2.05);
    o.poly([[10,6.5+y],[22,6.5+y],[23,13+y],[9,13+y]],P,2.5,2);// lomo blindado
    o.poly([[13,6.5+y],[17,6.5+y],[16,1+y],[12,2+y]],BN,2.6,1);// estandarte
    o.cap(21,16+y,22-lg*3,24,2.2,1.8,F,2.4);o.cap(25,16+y,26+lg*3,24,2.2,1.8,F,2.6);
    const hx=pose==='bite'?31:29;o.blob(hx-2,10+y,4.4,4,F,3);o.cap(hx,11+y,hx+3,12.5+y,2.2,1.8,L,3.1);o.blob(hx-4,6.5+y,1.4,1.4,F,3.05);
    o.poly([[hx-5,9+y],[hx,8+y],[hx-1,11+y]],P,3.2,1);// casco
    if(pose==='bite'){o.poly([[hx+1,13.5+y],[hx+4,13+y],[hx+3,15+y]],L,3.3,1);}
    o.glow(hx-1,10+y,'#ffd23a');return o.render(M,{soft:.4});}
  // sentado (enjaulado)
  const bb=Math.round(Math.abs(s));o.blob(10,20,5,4,F,1);o.blob(22,20,5,4,F,1);o.blob(16,15,8,7,F,2);o.blob(16,17,5,4.6,L,2.1);
  o.poly([[9,9],[23,9],[24,15],[8,15]],P,2.4,2);o.blob(16,7-bb,4.6,4.2,F,3);o.cap(16,8-bb,16,11-bb,2,1.8,L,3.1);o.blob(12.5,3.5-bb,1.4,1.4,F,3.05);o.blob(19.5,3.5-bb,1.4,1.4,F,3.05);
  o.glow(14.5,6.5-bb,'#ffd23a');o.glow(17.5,6.5-bb,'#ffd23a');return o.render(M,{soft:.4});}

// ---------------- CENTAURO ARQUERO (de lado) ----------------
function centaur11(f,n,pose){const o=PXR(32,34,1.15),H=0,HL=1,SK=2,HA=3,LE=4,WD=5,TU=6,M=M11('horse','bearL','skin','hair','leather','wood','cloakG');
  const t=f/n*TAU9,s=Math.sin(t),ext=pose==='run'?Math.cos(t):0,y=pose==='run'?-Math.round(Math.abs(s)*1.4):0;
  o.cap(6,22+y,6+ext*3,33,1.5,1.1,H,1);o.cap(9,22+y,9-ext*3,33,1.5,1.1,H,1.2);
  o.cap(5,19+y,20,19+y,4.4,4.8,H,2);o.cap(2,17+y,-1,24+y+Math.round(s),1.4,.8,HA,1.5);// cola
  o.cap(18,22+y,19-ext*3,33,1.5,1.1,H,2.4);o.cap(21,22+y,22+ext*3,33,1.5,1.1,H,2.6);
  // torso humano
  o.cap(20,17+y,21,9+y,3.6,3,TU,3);o.cap(19,12+y,23,12+y,1,1,LE,3.05);o.blob(21.6,5+y,3,3,SK,3.5);o.cap(20.4,2.6+y,17.6,10+y,1.8,1.1,HA,3.4);o.blob(21,2.8+y,2.6,1.4,HA,3.45);
  if(pose==='shoot'){o.cap(22,10+y,28,9+y,1,.9,SK,3.6);for(let k=0;k<11;k++)o.glow(28+Math.round(Math.sin(k/10*Math.PI)*2),4+k+y,'#8e6236');for(let k=0;k<=10;k++)o.glow(21+Math.round(k*.7),9+y,'#e8e0c8');}
  else{o.cap(22,10+y,25,15+y,1,.9,SK,3.6);for(let k=0;k<11;k++)o.glow(26+Math.round(Math.sin(k/10*Math.PI)*2),8+k+y,'#8e6236');}
  o.cap(18,8+y,17,15+y,1.1,1.1,LE,2.9);// carcaj
  o.glow(23,5+y,'#2a1a14');return o.render(M,{soft:.4});}

// ---------------- VALQUIRIA (de frente, alas abiertas, lanza) ----------------
function valk11(f,n,pose){const o=PXRw(40,40,3),W=0,A=1,SK=2,HA=3,GD=4,M=M11('wingW','valk','skin','gold','gold');
  const t=f/n*TAU9,s=Math.sin(t),cx=20;
  const wing=sd=>{const up=pose==='dive'?-3:pose==='perch'?5:Math.round(s*6),tx=cx+sd*(pose==='perch'?7:18),ty=12-up;
    o.poly([[cx+sd*2,12],[tx,ty],[cx+sd*(pose==='perch'?9:15),ty+8],[cx+sd*4,20]],W,1.6,1);
    for(let k=0;k<3;k++){const fx=lerp9(cx+sd*5,tx,k/3+.15),fy=lerp9(16,ty+3,k/3+.15);o.cap(fx,fy,fx+sd*1.5,fy+7,1.4,.5,W,1.3);}};
  wing(-1);wing(1);
  o.cap(cx-2,26,cx-2.4,36,1.4,1.1,A,2);o.cap(cx+2,26,cx+2.4,36,1.4,1.1,A,2);
  o.poly([[cx-4,15],[cx+4,15],[cx+5,27],[cx-5,27]],A,2.5,2);o.blob(cx,17,3.6,3,A,2.6);
  o.cap(cx-6,14,cx-7,8,1,1,A,2.8);// brazo con lanza
  for(let k=0;k<26;k++)o.glow(cx-7,-2+k+(pose==='dive'?4:0),k<3?'#e8e8f8':'#8e6236');
  o.cap(cx-2,16,cx-5,21,1.2,1,SK,2.7);
  o.blob(cx,10,2.8,3,SK,3);o.cap(cx-3,10,cx-3.4,18,1.2,.8,HA,2.9);o.cap(cx+3,10,cx+3.4,18,1.2,.8,HA,2.9);
  o.poly([[cx-3.2,9],[cx+3.2,9],[cx+2.4,6],[cx-2.4,6]],A,3.1,1);// casco
  o.poly([[cx-3,7],[cx-7,3],[cx-3.6,5.4]],W,3.2,1);o.poly([[cx+3,7],[cx+7,3],[cx+3.6,5.4]],W,3.2,1);// alitas del casco
  o.glow(cx-1,10,'#3a5aa0');o.glow(cx+1,10,'#3a5aa0');
  return o.render(M,{soft:.45});}

// ---------------- LEÓN GUARDIÁN (de lado) ----------------
function lion11(f,n,pose){const o=PXR(30,24,1.2),F=0,MN=1,L=2,M=M11('lion','mane','gold');
  const t=f/n*TAU9,s=Math.sin(t),ext=Math.cos(t);
  if(pose==='run'||pose==='bite'){const y=pose==='bite'?1:-Math.round(Math.abs(s)*1.5),lg=pose==='bite'?0:ext;
    o.cap(7,14+y,7+lg*3,22,1.6,1.3,F,1);o.cap(10,14+y,10-lg*3,22,1.6,1.3,F,1.2);
    o.cap(5,11+y,19,11+y,4.4,4.8,F,2);o.cap(3,10+y,-1,6+y-Math.round(s),1,.7,F,1.5);o.blob(-1,5.5+y,1.4,1.4,MN,1.6);
    o.cap(17,14+y,18-lg*3,22,1.6,1.3,F,2.4);o.cap(20,14+y,21+lg*3,22,1.6,1.3,F,2.6);
    const hx=pose==='bite'?25:24;o.blob(hx-2,8+y,5.4,5.6,MN,3);o.blob(hx,8.5+y,3,2.8,F,3.2);o.cap(hx+1,9.5+y,hx+3.6,10.5+y,1.6,1.3,F,3.3);
    if(pose==='bite')o.poly([[hx+1,11+y],[hx+4,11+y],[hx+3,13+y]],L,3.4,1);
    o.glow(hx+.5,7.5+y,'#3ae8a0');return o.render(M,{soft:.42});}
  const bb=Math.round(Math.abs(s));o.blob(9,18,4,3.4,F,1);o.blob(20,18,4,3.4,F,1);o.blob(14.5,14,6,6,F,2);
  o.blob(14.5,8-bb,6,6,MN,3);o.blob(14.5,9-bb,3.4,3.2,F,3.2);o.cap(14.5,10-bb,14.5,12.5-bb,1.6,1.4,F,3.3);
  o.cap(10,15,9,21,1.5,1.3,F,2.5);o.cap(19,15,20,21,1.5,1.3,F,2.5);o.blob(14.5,20,5,1.4,L,2.6);// pedestal dorado
  o.glow(13,8.5-bb,'#3ae8a0');o.glow(16,8.5-bb,'#3ae8a0');return o.render(M,{soft:.42});}

// ---------------- ENANO HERRERO (de lado) ----------------
function dwarf11(f,n,pose){const o=PXR(20,22,1.25),T=0,SK=1,BD=2,MT=3,WD=4,LE=5,M=M11('dTunic','skin','beard','plate','wood','leather');
  const t=f/n*TAU9,s=Math.sin(t),y=pose==='walk'?-Math.round(Math.abs(s)):0,la=pose==='walk'?Math.round(s*2):0;
  o.cap(7,16+y,7+la,21,1.6,1.4,LE,1);o.cap(11,16+y,11-la,21,1.6,1.4,LE,1.2);o.blob(7+la,21,2,1,LE,1.1);o.blob(11-la,21,2,1,LE,1.1);
  o.blob(9,13+y,4.6,4.4,T,2);o.cap(5,14+y,13,14+y,1,1,LE,2.1);
  o.blob(10,7+y,3.2,3,SK,3);o.poly([[7,8+y],[13,8+y],[12.5,15+y],[9,16+y]],BD,3.2,1.2);// barba
  o.poly([[6.6,6+y],[13.4,6+y],[12.6,3+y],[7.4,3+y]],MT,3.3,1);o.cap(8,3.5+y,6,1+y,.7,.4,MT,3.25);o.cap(12,3.5+y,14,1+y,.7,.4,MT,3.25);
  // martillo
  if(pose==='atk'){o.cap(12,11+y,18,13+y,.8,.8,WD,3.5);o.blob(18.5,15+y,1.8,2.4,MT,3.6);}
  else{o.cap(12,11+y,14,3+y,.8,.8,WD,3.5);o.blob(14.5,2+y,2.4,1.6,MT,3.6);}
  o.glow(11,6.5+y,'#120a10');return o.render(M,{soft:.4});}

function GuardSprites11(){const cyc=(k,fn)=>Array.from({length:k},(_,i)=>fn(i));
  return {
    phoenix:{perch:sheet9([phoenix11(0,4,'perch')],{shw:.3}),fly:sheet9(cyc(4,f=>phoenix11(f,4,'fly')),{shadow:false}),dive:sheet9([phoenix11(0,4,'dive')],{shadow:false})},
    crystal:{sit:sheet9([crystal11(0,4,'kneel')],{shw:.34}),walk:sheet9(cyc(4,f=>crystal11(f,4,'walk')),{shw:.34}),atk:sheet9([crystal11(0,4,'slam')],{shw:.34})},
    bear:{sit:sheet9([bear11(0,4,'sit'),bear11(1,4,'sit')],{shw:.3}),run:sheet9(cyc(4,f=>bear11(f,4,'run')),{shw:.3}),bite:sheet9([bear11(0,4,'bite')],{shw:.3})},
    centaur:{sit:sheet9([centaur11(0,4,'idle')],{shw:.3}),run:sheet9(cyc(4,f=>centaur11(f,4,'run')),{shw:.3}),bite:sheet9([centaur11(0,4,'shoot')],{shw:.3})},
    valk:{perch:sheet9([valk11(0,4,'perch')],{shw:.3}),fly:sheet9(cyc(4,f=>valk11(f,4,'fly')),{shadow:false}),dive:sheet9([valk11(0,4,'dive')],{shadow:false})},
    lions:{sit:sheet9([lion11(0,4,'sit'),lion11(1,4,'sit')],{shw:.3}),run:sheet9(cyc(4,f=>lion11(f,4,'run')),{shw:.3}),bite:sheet9([lion11(0,4,'bite')],{shw:.3})},
    dwarves:{sit:sheet9([dwarf11(0,4,'idle')],{shw:.3}),run:sheet9(cyc(4,f=>dwarf11(f,4,'walk')),{shw:.3}),bite:sheet9([dwarf11(0,4,'atk')],{shw:.3})}
  };}
