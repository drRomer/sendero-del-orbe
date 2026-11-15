// Personajes con el pintor de volumen (diseños originales)
const RAMPS={
  bark:['#24161a','#3f2522','#61392a','#8a5434','#b07444','#d49a5c'],
  leaf:['#16301c','#24502a','#357a34','#55a43e','#8cd05a'],
  void:['#0c0608','#1a0e10','#22141a'],
  rock:['#1c181a','#36302f','#544b46','#7a6e64','#a39584','#cbbca6'],
  lrock:['#120e12','#221c22','#342b33','#4a3e47','#62545e','#7c6c74'],
};
function crack(o,pts,col,core){for(let i=1;i<pts.length;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i],n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let k=0;k<=n;k++){const x=Math.round(x0+(x1-x0)*k/n),y=Math.round(y0+(y1-y0)*k/n);if(o.matAt(x,y)>=0)o.glow(x,y,(core&&k%3===1)?core:col);}}}
function entFront(ph){const o=PXR(64,86),B=0,LF=1,V=2,M=[{ramp:RAMPS.bark,tex:'bark'},{ramp:RAMPS.leaf,tex:'leaf'},{ramp:RAMPS.void}];
  const s=Math.sin(ph||0),bb=Math.round(Math.abs(s)*1.5),y=-bb;
  // pierna de atrás y raíces
  o.cap(38,55+y,44,67,5,4.2,B,1);o.cap(44,67,46,79,4.2,3.6,B,1);o.cap(46,79,53,82,2.6,1.2,B,1.1);o.cap(45,79,40,83,2.4,1.2,B,1.1);o.cap(47,78,48,84,2,1,B,1.1);
  // pierna de adelante
  o.cap(28,55+y,22,67,6,4.6,B,3);o.cap(22,67,20,79,4.6,4,B,3);o.cap(20,79,12,82,3,1.3,B,3.1);o.cap(20,79,25,84,2.6,1.2,B,3.1);o.cap(19,78,17,84,2.2,1,B,3.1);
  o.blob(33,55+y,9,5,B,2);
  // tronco jorobado
  o.cap(33,55+y,30,33+y,8,12,B,4);
  o.blob(20,33+y,7,5,B,5,.35);o.blob(42,31+y,6,5,B,4.5,-.3);
  // brazo de atrás (derecha del dibujo)
  o.cap(43,32+y,52,43+y,4.6,3.6,B,3.5);o.cap(52,43+y,56,55+y,3.6,3,B,3.6);
  o.cap(56,55+y,61,63+y,1.5,.7,B,3.7);o.cap(55,56+y,55,65+y,1.5,.7,B,3.7);o.cap(54,55+y,50,62+y,1.4,.7,B,3.7);
  // cabeza baja, ceja, cuencas y boca
  o.blob(29,23+y,8,9,B,6);o.cap(22,20+y,36,19+y,2.2,2.2,B,6.5);
  o.blob(25.5,22+y,2.4,1.7,V,6.6);o.blob(32.5,22+y,2.4,1.7,V,6.6);o.cap(29,23+y,29.5,27+y,1.6,1.3,B,6.62);o.cap(26.5,29.5+y,31.5,29+y,.6,.6,V,6.6);
  // ramitas con brotes
  for(const [x0,y0,x1,y1] of [[27,16,22,5],[30,15,31,3],[33,16,39,7],[25,17,18,10],[35,18,41,13]])o.cap(x0,y0+y,x1,y1+y,1.7,.8,B,5.5);
  // copa frondosa: masa detrás de la cabeza y racimos en las ramas
  o.blob(29,11+y,13,8,LF,5.4);o.blob(20,13+y,6,5,LF,5.45);o.blob(39,12+y,6,5,LF,5.45);
  for(const [x,yy,rx,ry] of [[22,5,4,3],[31,3,4.5,3],[39,7,4,3],[18,10,3.5,2.6],[41,13,3.5,2.6],[26,8,3.5,2.6],[35,9,3.5,2.6],[30,10,3,2]])o.blob(x,yy+y,rx,ry,LF,7);
  o.blob(18,31+y,6,3.5,LF,5.3,.35);o.blob(43,29+y,5,3,LF,4.7,-.3);o.blob(24,17+y,3,2,LF,6.7);o.blob(35,17+y,3,2,LF,6.7);
  // brazo de adelante: largo, colgando, con garras
  o.cap(19,33+y,11,47+y,5.2,4.2,B,7);o.cap(11,47+y,8,61+y,4.2,3.6,B,7.2);o.blob(8,62+y,4.2,3.2,B,7.3);
  o.cap(7,63+y,2,73+y,1.7,.8,B,7.4);o.cap(9,64+y,8,75+y,1.7,.8,B,7.4);o.cap(10,63+y,14,73+y,1.6,.8,B,7.4);
  // musgo
o.blob(36,46+y,3,2,LF,4.2);o.blob(12,49+y,2.4,1.6,LF,7.25);
  // ojos que brillan
  for(const [x,c] of [[25,'#ffe86a'],[26,'#ffffff'],[32,'#ffe86a'],[33,'#ffffff']])o.glow(x,22+y,c);
  return o.render(M);}
function golem(lava,ph){const o=PXR(48,54),R=0,LF=1,V=2,M=[{ramp:lava?RAMPS.lrock:RAMPS.rock,tex:'rock',cs:5},{ramp:RAMPS.leaf,tex:'leaf'},{ramp:RAMPS.void}];
  const s=Math.sin(ph||0),bb=Math.round(Math.abs(s)*2),y=-bb,la=Math.round(s*2);
  o.cap(17,39+y,15,48-(la>0?2:0),6,6,R,2);o.blob(14,49-(la>0?2:0),7.5,4,R,2.1);
  o.cap(31,39+y,33,48-(la<0?2:0),6,6,R,2);o.blob(34,49-(la<0?2:0),7.5,4,R,2.1);
  o.blob(24,38+y,11,6,R,3);
  o.blob(24,27+y,15,12,R,4);
  o.blob(24,14+y,6.5,6,R,5);o.blob(24,18+y,2.6,1.1,V,5.5);
  o.blob(10,19+y,8,7,R,6,.4);o.blob(38,19+y,8,7,R,6,-.4);
  o.cap(8,23+y-la,6,35+y-la,6,5.5,R,6.5);o.cap(40,23+y+la,42,35+y+la,6,5.5,R,6.5);
  o.blob(6,39+y-la,7.5,6.5,R,7);o.blob(42,39+y+la,7.5,6.5,R,7);
  if(!lava){o.blob(31,21+y,4,2,LF,4.5);o.blob(13,15+y,3,1.6,LF,6.1);o.blob(40,42+y,2.6,1.4,LF,7.1);o.blob(17,33+y,3,1.4,LF,4.2);}
  for(const [x,c] of [[21,'#ff9a4a'],[22,'#ffd8a0'],[26,'#ff9a4a'],[27,'#ffd8a0']])o.glow(x,14+y,c);
  if(lava){const C1='#fa6a0a',C2='#ffd541';
    crack(o,[[17,20+y],[21,25+y],[19,30+y],[23,34+y]],C1,C2);crack(o,[[30,19+y],[27,24+y],[30,29+y],[28,33+y]],C1,C2);crack(o,[[24,28+y],[24,31+y]],C2);
    crack(o,[[6,25+y-la],[8,30+y-la],[6,34+y-la]],C1);crack(o,[[42,25+y+la],[40,30+y+la],[42,34+y+la]],C1);crack(o,[[4,38+y-la],[8,41+y-la]],C1,C2);crack(o,[[40,38+y+la],[44,41+y+la]],C1,C2);
    crack(o,[[15,42],[17,46]],C1);crack(o,[[33,42],[31,46]],C1);crack(o,[[22,12+y],[26,12+y]],C1);}
  return o.render(M);}
RAMPS.iron=['#121218','#24242e','#3a3a48','#565666','#7a7a8c','#a4a4b4'];
RAMPS.trim=['#2a0a0e','#561418','#8a2020','#b8342a','#e05a3a'];
RAMPS.skinR=['#2a0c14','#4e1420','#7a2026','#a6362c','#c85c3c','#e8905c'];
RAMPS.horn=['#0e0a0e','#221a22','#3a2e36','#5a4a52','#7a6a6e'];
RAMPS.cloth=['#140e12','#261a20','#3a2a30','#504048'];
RAMPS.wood=['#22140e','#40281a','#664226','#8e6236'];
RAMPS.wing=['#12080c','#24101a','#3a1a28','#542638'];
RAMPS.orc=['#14261c','#22402a','#36603a','#4e8448','#74ac5e','#a2d07c'];
RAMPS.leather=['#22140e','#40281a','#664226','#946238','#b8844c'];
RAMPS.metal=['#1a1a24','#34344a','#56566e','#8282a0','#b4b4cc','#e4e4f0'];
function demonFront(ph,raise){const o=PXR(84,86),S=0,H=1,C=2,Wd=3,Wg=4,V=5,AR=6,TR=7,M=[{ramp:RAMPS.skinR},{ramp:RAMPS.horn},{ramp:RAMPS.cloth},{ramp:RAMPS.wood,tex:'bark'},{ramp:RAMPS.wing},{ramp:RAMPS.void},{ramp:RAMPS.iron},{ramp:RAMPS.trim}];
  const s=Math.sin(ph||0),r=raise||0,bb=Math.round(Math.abs(s)*2),y=-bb,la=Math.round(s*2);
  // alas plegadas detrás
  o.poly([[30,30+y],[8,14+y],[4,34+y],[12,48+y],[26,42+y]],Wg,0,3);o.poly([[54,30+y],[76,14+y],[80,34+y],[72,48+y],[58,42+y]],Wg,0,3);
  o.cap(30,30+y,8,14+y,1.6,1.2,Wg,.1);o.cap(54,30+y,76,14+y,1.6,1.2,Wg,.1);
  // cola
  o.cap(30,58+y,16,66,3,2,S,.5);o.cap(16,66,10,58,2,1.4,S,.5);o.poly([[10,58],[6,52],[13,55]],S,.6,1);
  // piernas (de bruto)
  o.cap(34,58+y,28,68-(la>0?2:0),7,5.5,S,2);o.cap(28,68-(la>0?2:0),30,80-(la>0?2:0),5.5,4.5,S,2);o.blob(30,81-(la>0?2:0),6,3,H,2.1);
  o.cap(50,58+y,56,68-(la<0?2:0),7,5.5,S,1.5);o.cap(56,68-(la<0?2:0),54,80-(la<0?2:0),5.5,4.5,S,1.5);o.blob(55,81-(la<0?2:0),6,3,H,1.6);
  o.poly([[30,54+y],[54,54+y],[52,66+y],[42,70+y],[32,66+y]],C,2.5,2); // taparrabo
  // torso musculoso
  o.cap(42,56+y,42,36+y,10,13,S,3);o.blob(35,36+y,7,6,S,3.3);o.blob(49,36+y,7,6,S,3.3);
  o.blob(28,33+y,7,6,S,3.6,.4);o.blob(56,33+y,7,6,S,3.6,-.4);
  // peto de hierro con bordes rojos
  o.poly([[31,34+y],[53,34+y],[55,44+y],[50,55+y],[42,58+y],[34,55+y],[29,44+y]],AR,3.8,3);
  o.poly([[31,34+y],[53,34+y],[52,37+y],[32,37+y]],TR,3.85,1);o.poly([[34,55+y],[42,58+y],[50,55+y],[49,53+y],[42,56+y],[35,53+y]],TR,3.85,1);
  o.cap(42,38+y,42,54+y,.8,.8,TR,3.86);
  // hombreras con púas
  for(const dir of [-1,1]){const hx=42+dir*15;o.blob(hx,31+y,7.5,5,AR,4.8,dir*-.3);o.poly([[hx-2,27+y],[hx+2,27+y],[hx+dir*5,19+y]],H,4.9,1);o.poly([[hx+dir*3,29+y],[hx+dir*6,28+y],[hx+dir*10,23+y]],H,4.9,1);}
  // collar con medallón
  // brazo izquierdo (garras) y derecho (tridente)
  const ua=r*1.2;
  o.cap(27,34+y,20,47+y-ua*14,6,5,S,4);o.cap(20,47+y-ua*14,18,58+y-ua*30,5,4,S,4.1);o.blob(18,60+y-ua*31,4,3.5,S,4.2);
  for(const d of [-3,0,3])o.cap(18+d,62+y-ua*31,18+d*1.3,67+y-ua*31,1.3,.6,H,4.3);
  o.cap(57,34+y,63,46+y,6,5,S,4);o.cap(63,46+y,64,56+y,5,4,S,4.1);
  const ty=y+8;o.cap(66,8+ty,66,82,1.8,1.8,Wd,4.4);o.blob(64,57+y,4.2,3.6,S,4.5);
  o.poly([[59,14+ty],[73,14+ty],[73,17+ty],[59,17+ty]],H,4.6,1);for(const x of [59,66,73])o.poly([[x-1.5,15+ty],[x+1.5,15+ty],[x,3+ty]],H,4.7,1);
  // cabeza y cuernos
  o.blob(42,24+y,7,7,S,5);o.blob(42,29+y,5,3.5,S,5.1);
  o.cap(36,20+y,26,16+y,2.8,2.2,H,5.2);o.cap(26,16+y,22,6+y,2.2,1,H,5.2);o.cap(48,20+y,58,16+y,2.8,2.2,H,5.2);o.cap(58,16+y,62,6+y,2.2,1,H,5.2);
  o.blob(42,28+y,3.8,2.6,S,5.25);
  for(let k=0;k<=8;k++){const t=k/8,cx=33+18*t,cy=35+y+Math.round(5*Math.sin(t*Math.PI));o.glow(cx,cy,k%2?'#8a7a6a':'#c8b8a0');}
  o.blob(42,42+y,4.6,4.6,TR,5.4);o.blob(42,42+y,3.4,3.4,AR,5.45);
  // pentagrama invertido brillante
  const PS=[];for(let k=0;k<5;k++){const a=Math.PI/2+k*2*Math.PI/5;PS.push([42+Math.cos(a)*2.9,42+y+Math.sin(a)*2.9]);}
  for(let k=0;k<5;k++){const A=PS[k],Bp=PS[(k+2)%5],n=6;for(let j=0;j<=n;j++)o.glow(A[0]+(Bp[0]-A[0])*j/n,A[1]+(Bp[1]-A[1])*j/n,'#ff5a2a');}
  o.glow(42,42+y,'#ffd541');
  for(const [x,c] of [[38,'#ffd541'],[39,'#ffffff'],[45,'#ffd541'],[46,'#ffffff']])o.glow(x,23+y,c);
  o.glow(40,28+y,'#1a0608');o.glow(44,28+y,'#1a0608');o.glow(40,27+y,'#3a0c12');o.glow(44,27+y,'#3a0c12');
  for(const [x,yy,c] of [[41,29,'#c08a1c'],[43,29,'#c08a1c'],[40,30,'#ffd541'],[44,30,'#ffd541'],[40,31,'#ffd541'],[44,31,'#c08a1c'],[41,32,'#fff3b0'],[42,32,'#ffd541'],[43,32,'#c08a1c']])o.glow(x,yy+y,c);
  // llamas del tridente
  for(const [x,h] of [[59,9],[66,12],[73,9]])for(let k=0;k<h;k++)for(let w=-1;w<=1;w++){if(Math.abs(w)>(h-k)/4)continue;const yy=2+ty-k,xx=x+w+(k>h*.6?((k+x)%2?1:-1):0);o.glow(xx,yy,k<2?'#ffffff':k<h*.45?'#ffd541':'#fa6a0a');}
  if(r>.6){for(let k=0;k<8;k++)o.glow(18+((k*5)%5)-2,50+y-ua*31-k,k<3?'#ffd541':'#fa6a0a');}
  return o.render(M);}
function orcHammer(ph){const o=PXR(24,26),G=0,Lt=1,Mt=2,V=3,M=[{ramp:RAMPS.orc},{ramp:RAMPS.leather},{ramp:RAMPS.metal},{ramp:RAMPS.void}];
  const s=Math.sin(ph||0),bb=Math.round(Math.abs(s)),y=-bb,la=Math.round(s*1.5);
  o.cap(9,17+y,8,23-(la>0?1:0),2.4,2,G,1);o.cap(15,17+y,16,23-(la<0?1:0),2.4,2,G,1);o.blob(8,24-(la>0?1:0),2.6,1.4,Lt,1.1);o.blob(16,24-(la<0?1:0),2.6,1.4,Lt,1.1);
  o.blob(12,13+y,6,6,G,2);o.poly([[7,9+y],[17,9+y],[16,18+y],[8,18+y]],Lt,2.5,1.2);o.blob(12,12+y,1.6,1.6,Mt,2.6);
  o.cap(6,10+y,3,15+y+la,2.4,2,G,3);o.cap(18,10+y,20,16+y-la,2.4,2,G,1.8);
  // martillo en alto
  o.cap(3,15+y+la,4,3+y+la,.9,.9,Lt,3.1);o.poly([[0,1+y+la],[8,1+y+la],[8,6+y+la],[0,6+y+la]],Mt,3.2,1.2);
  o.blob(12,6+y,4.6,4.4,G,4);o.blob(12,4+y,4.6,2.6,Mt,4.2);o.poly([[7,4+y],[5,0+y],[8,3+y]],Mt,4.3,1);o.poly([[17,4+y],[19,0+y],[16,3+y]],Mt,4.3,1);
  o.blob(12,9+y,2,1,V,4.4);o.glow(10,6+y,'#ff4a6a');o.glow(14,6+y,'#ff4a6a');o.glow(11,9+y,'#efe6d6');o.glow(13,9+y,'#efe6d6');
  return o.render(M);}
