// sprites8.js — personajes 8-bit dibujados por código (sin imágenes externas)
// Cada hoja: {img,fw,fh,n,ax,ay,top,mx,my,white?,mxs?,mys?}
function Sprites8(mk){
const TAU=Math.PI*2;
const C={
  out:'#160f1e', sh:'rgba(10,6,16,.38)',
  skin:'#f1bf98',skinD:'#c47f62',
  wood:'#9a6438',woodD:'#5f3a20',woodL:'#c48a4e',
  leaf:'#3f9c3c',leafD:'#256128',leafL:'#7fd04e',
  steel:'#c3cad6',steelD:'#76808f',gold:'#ffd04a',goldD:'#c08a1c',
  white:'#f6f3ea',red:'#d8333f',redD:'#851b2c',
  cyan:'#7ef3ff',cyanD:'#2ea6e6',blue:'#3f5fd0',
  fire:'#ff8a22',fireL:'#ffe25a',fireD:'#c8361c',
  bone:'#eadcb8',boneD:'#a8936a',
};
// ---------- pintor de píxeles ----------
function P(w,h){const c=mk(w,h),g=c.getContext('2d');g.imageSmoothingEnabled=false;
  const o={c,g,w,h,
    p(x,y,col){g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),1,1);},
    r(x,y,ww,hh,col){if(ww<=0||hh<=0)return;g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(ww),Math.round(hh));},
    // elipse rellena en píxeles
    e(cx,cy,rx,ry,col){g.fillStyle=col;for(let y=Math.ceil(cy-ry);y<=Math.floor(cy+ry);y++){const t=(y-cy)/ry,dx=rx*Math.sqrt(Math.max(0,1-t*t));g.fillRect(Math.round(cx-dx),y,Math.max(1,Math.round(dx*2)),1);}},
    // línea de píxeles (Bresenham)
    l(x0,y0,x1,y1,col){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);g.fillStyle=col;const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let er=dx+dy;for(;;){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*er;if(e2>=dy){er+=dy;x0+=sx;}if(e2<=dx){er+=dx;y0+=sy;}}},
    // línea gruesa
    L(x0,y0,x1,y1,w,col){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){const t=i/n;o.r(x0+(x1-x0)*t-w/2,y0+(y1-y0)*t-w/2,w,w,col);}},
  };return o;}
// contorno exterior de 1 px y sombra al pie
function finish(o,shadow){const {g,w,h}=o,id=g.getImageData(0,0,w,h),d=id.data,a=i=>d[i*4+3]>40;
  const oc=[22,15,30];const out=[];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(a(i))continue;
    if((x>0&&a(i-1))||(x<w-1&&a(i+1))||(y>0&&a(i-w))||(y<h-1&&a(i+w)))out.push(i);}
  for(const i of out){d[i*4]=oc[0];d[i*4+1]=oc[1];d[i*4+2]=oc[2];d[i*4+3]=255;}
  g.putImageData(id,0,0);
  if(shadow){const s=P(w,h);s.e(shadow[0],shadow[1],shadow[2],shadow[3],C.sh);s.g.drawImage(o.c,0,0);return s.c;}
  return o.c;}
function sheet(frames,fw,fh,opt){opt=opt||{};const n=frames.length,c=mk(fw*n,fh),g=c.getContext('2d');
  frames.forEach((f,i)=>g.drawImage(f,i*fw,0));
  const id=g.getImageData(0,0,fw,fh).data;let top=0;scan:for(let y=0;y<fh;y++)for(let x=0;x<fw;x++)if(id[(y*fw+x)*4+3]>120){top=y;break scan;}
  const S={img:c,fw,fh,n,ax:opt.ax!=null?opt.ax:fw/2,ay:opt.ay!=null?opt.ay:fh,top,mx:opt.mx||fw/2,my:opt.my||fh/2};
  if(opt.mxs){S.mxs=opt.mxs;S.mys=opt.mys;}
  if(opt.pc)S.pc=opt.pc;
  return S;}
const bob=(f,n)=>Math.round(Math.abs(Math.sin(f/n*TAU))*1);

// ---------- ARQUERO (de espaldas) 16x20 ----------
function archer(v,f,n,sh){const o=P(16,20),t=sh?0:f/n*TAU,b=sh?0:bob(f,n),s=sh?0:Math.sin(t);
  const tun=v.tun,tunD=v.tunD,hood=v.hood,hoodD=v.hoodD;
  const lA=Math.round(s*2),lB=-lA; // zancada
  // piernas
  const leg=(x,lift,col,colD)=>{o.r(x,13-b+(lift<0?lift:0),2,4+(lift<0?0:0),col);o.r(x,17-b+(lift<0?lift:0),2,2,colD);if(lift>0)o.r(x,19-b,2,1,colD);};
  leg(5,lA<0?-1:0,'#6b4a33','#2e2018');leg(9,lB<0?-1:0,'#6b4a33','#2e2018');
  // botas al frente/atrás
  o.r(5,18-b+(lA<0?-1:0),2,1,'#3a2a1c');o.r(9,18-b+(lB<0?-1:0),2,1,'#3a2a1c');
  // capa / túnica
  o.r(4,7-b,8,7,tun);o.r(4,7-b,1,7,tunD);o.r(11,7-b,1,7,tunD);o.r(5,13-b,6,1,tunD);
  o.r(4,12-b,8,1,'#5a3a22');o.p(8,12-b,C.gold); // cinturón
  // carcaj en la espalda con flechas
  o.l(9,4-b,11,11-b,C.woodD);o.l(10,4-b,12,11-b,C.wood);
  o.p(9,2-b,C.white);o.p(10,3-b,C.red);o.p(11,2-b,C.white);o.p(10,1-b,C.white);
  if(sh){ // tensando el arco
    o.l(4,8,1,6,tunD);o.l(12,8,14,7,tunD);o.p(14,7,C.skin);o.p(1,6,C.skin);
    o.l(1,0,0,6,C.wood);o.l(0,6,1,12,C.wood);o.p(1,-0,C.woodD);o.p(1,12,C.woodD);o.l(1,1,14,7,'#e8e0c8');o.l(14,7,1,11,'#e8e0c8');o.l(2,6,14,7,C.white);
  }else{
  // brazos
  o.r(3,8-b+(s>0?0:1),1,4,tunD);o.r(12,8-b+(s>0?1:0),1,4,tunD);o.p(3,12-b,C.skin);o.p(12,12-b,C.skin);
  // arco a la izquierda
  o.l(1,3-b,0,9-b,C.wood);o.l(0,9-b,1,15-b,C.wood);o.l(2,3-b,2,15-b,'#e8e0c8');o.p(1,2-b,C.woodD);o.p(1,15-b,C.woodD);}
  // capucha
  o.e(8,4-b,3.5,3.4,hood);o.r(5,5-b,7,3,hood);o.p(8,0-b,hoodD);o.r(7,1-b,3,1,hood);
  o.r(5,6-b,1,2,hoodD);o.r(11,4-b,1,4,hoodD);o.r(6,2-b,1,2,v.hoodL);
  return finish(o,[8,19,4,1]);}
// ---------- MAGO (de espaldas) 16x22 ----------
function mage(f,n,cast){const o=P(16,22),t=cast?0:f/n*TAU,b=cast?0:bob(f,n),s=cast?0:Math.sin(t),glow=(f%2)?C.cyan:C.white,up=cast?3:0;
  const rob='#5b3a9e',robD='#3a2470',robL='#8e66d6';
  // túnica larga
  o.r(4,9-b,8,10,rob);o.r(3,12-b,10,7,rob);o.r(3,12-b,1,7,robD);o.r(12,12-b,1,7,robD);o.r(4,9-b,1,4,robD);
  o.r(3,19-b,10,1,robD);o.r(7,10-b,1,9,robD);
  // pies asomando
  o.r(5+(s>0?0:1),20-b,2,1,'#2e2018');o.r(9-(s>0?1:0),20-b,2,1,'#2e2018');
  // capa con borde dorado
  o.r(4,8-b,8,2,robD);o.r(3,18-b,10,1,C.goldD);
  // bastón a la derecha
  o.l(13,4-b-up,13,19-b-up,C.woodD);o.l(14,5-b-up,14,18-b-up,C.wood);
  o.e(13.5,3-b-up,cast?2.4:1.6,cast?2.4:1.6,glow);o.p(13,2-b-up,C.white);
  if(cast){o.p(11,0,C.cyan);o.p(15,1,C.white);o.p(12,5,C.cyan);o.p(15,5,C.cyan);}
  // brazo derecho al bastón
  o.r(12,10-b-up,2,2,rob);o.p(13,11-b-up,C.skin);
  // sombrero puntiagudo
  o.r(4,7-b,8,2,robD);o.r(3,8-b,10,1,robD);
  o.r(5,4-b,6,3,rob);o.r(6,2-b,4,2,rob);o.r(7,0-b,2,2,rob);o.p(9,-0-b+0,robL);
  o.r(5,6-b,6,1,C.gold);o.r(6,3-b,1,3,robL);
  return finish(o,[8,21,4,1]);}
// ---------- ORCO (de frente) 18x20 ----------
function orc(v,f,n){const o=P(18,20),t=f/n*TAU,b=bob(f,n),s=Math.sin(t);
  const sk=v.sk,skD=v.skD,skL=v.skL;
  // piernas
  const lA=Math.round(s*1.5);
  o.r(6,14-b,2,4+(lA>0?0:0),'#4a3424');o.r(10,14-b,2,4,'#4a3424');
  o.r(5,18-b-(lA>0?1:0),3,2,'#24180f');o.r(10,18-b-(lA<0?1:0),3,2,'#24180f');
  // torso con armadura de cuero
  o.r(5,8-b,8,6,v.arm);o.r(5,8-b,1,6,v.armD);o.r(12,8-b,1,6,v.armD);o.r(5,12-b,8,1,'#2c1e14');o.p(9,12-b,C.steel);
  o.l(5,8-b,12,13-b,v.armD); // correa
  // hombreras
  o.r(3,7-b,3,2,C.steelD);o.r(12,7-b,3,2,C.steelD);o.p(3,7-b,C.steel);o.p(12,7-b,C.steel);
  // brazos
  const aY=Math.round(s*1.5);
  o.r(3,9-b+aY,2,4,sk);o.r(13,9-b-aY,2,4,sk);o.r(3,9-b+aY,1,4,skD);
  // hacha en mano derecha (izquierda de la imagen)
  o.l(2,4-b+aY,2,14-b+aY,C.woodD);o.r(0,4-b+aY,2,4,C.steel);o.p(0,4-b+aY,C.white);o.r(0,7-b+aY,2,1,C.steelD);
  // cabeza grande
  o.r(5,2-b,8,6,sk);o.r(4,3-b,10,4,sk);o.r(4,6-b,10,1,skD);o.r(5,2-b,8,1,skL);
  o.r(6,4-b,2,1,'#fff6d0');o.r(10,4-b,2,1,'#fff6d0');o.p(7,4-b,v.eye);o.p(10,4-b,v.eye); // ojos
  o.r(6,3-b,2,1,skD);o.r(10,3-b,2,1,skD); // ceño
  o.r(7,6-b,4,1,'#3a1c14');o.p(6,6-b,C.white);o.p(11,6-b,C.white);o.p(6,5-b,C.white);o.p(11,5-b,C.white); // colmillos
  o.r(3,4-b,1,2,skD);o.r(14,4-b,1,2,skD);o.p(3,3-b,sk);o.p(14,3-b,sk); // orejas
  o.r(7,0-b,4,2,'#2a1a14');o.r(8,-1-b+1,2,1,'#2a1a14'); // cresta
  return finish(o,[9,19,5,1]);}
// ---------- ESPÍRITU (fuego fatuo, flota) 14x18 ----------
function spirit(v,f,n){const o=P(14,18),t=f/n*TAU,fl=Math.round(Math.sin(t)*1.5),up=Math.round(Math.sin(t)*1);
  const c1=v.c1,c2=v.c2,c3=v.c3;
  o.e(7,8-up,5,5,c2);o.e(7,9-up,4,4,c1);
  // llamas superiores
  o.r(4,1-up,2,4,c2);o.r(8+fl,0-up,2,4,c2);o.r(6,2-up,2,3,c1);o.p(5,0-up,c2);o.p(10+fl,-0-up,c3);
  // cola ondulante
  o.r(5,13-up,4,2,c2);o.r(6+fl,15-up,2,2,c2);o.p(7+fl,17-up,c3);
  o.e(7,9-up,2,2,C.white);
  o.r(5,8-up,1,2,'#10142a');o.r(8,8-up,1,2,'#10142a'); // ojos
  return finish(o,[7,17,4,1]);}
// ---------- GÓLEM (de frente) 30x34 ----------
function golem(v,f,n){const o=P(30,34),t=f/n*TAU,b=Math.round(Math.abs(Math.sin(t))*2),s=Math.sin(t);
  const st=v.st,stD=v.stD,stL=v.stL,rune=v.rune;
  const lA=Math.round(s*2);
  // piernas cortas y anchas
  o.r(8,24-b+(lA>0?-1:0),5,7,stD);o.r(17,24-b+(lA<0?-1:0),5,7,stD);o.r(8,24-b,1,7,st);o.r(17,24-b,1,7,st);
  o.r(7,31-b+(lA>0?-1:0),7,3,stD);o.r(16,31-b+(lA<0?-1:0),7,3,stD);
  // torso de bloque
  o.r(6,9-b,18,16,st);o.r(6,9-b,18,2,stL);o.r(6,9-b,2,16,stL);o.r(22,9-b,2,16,stD);o.r(6,23-b,18,2,stD);o.r(5,10-b,1,6,stD);o.r(24,10-b,1,6,stD);
  o.l(10,12-b,13,18-b,stD);o.l(18,20-b,21,14-b,stD); // grietas
  o.r(13,14-b,4,4,rune);o.p(14,15-b,C.white);o.r(12,16-b,6,1,rune); // runa del pecho
  o.r(8,10-b,4,2,v.moss);o.r(19,19-b,3,2,v.moss);
  // brazos enormes
  const aY=Math.round(s*2);
  o.r(0,10-b+aY,4,13,st);o.r(0,10-b+aY,1,13,stL);o.r(26,10-b-aY,4,13,st);o.r(29,10-b-aY,1,13,stD);
  o.r(0,23-b+aY,5,6,stD);o.r(25,23-b-aY,5,6,stD);o.r(0,23-b+aY,5,1,st);o.r(25,23-b-aY,5,1,st);o.p(2,25-b+aY,st);o.p(27,25-b-aY,st);
  // cabeza pequeña
  o.r(11,3-b,8,7,st);o.r(11,3-b,8,1,stL);o.r(18,3-b,1,7,stD);
  o.r(12,6-b,2,2,rune);o.r(16,6-b,2,2,rune);o.p(12,6-b,C.white);o.p(16,6-b,C.white);
  o.r(13,9-b,4,1,stD);
  return finish(o,[15,33,10,1.5]);}
// ---------- ENT (aliado gigante) 52x68 ----------
// modo: 'front' (dormido→de pie), 'back' (camina/golpea). k: 0 de pie … 1 agachado/raíz. raise: 0..1 brazo arriba
function ent(mode,k,ph,raise){const W=52,H=68,o=P(W,H);const bk='#7a5434',bkD='#4c3220',bkL='#a07448',mo='#5c8f3a';
  const crouch=Math.round(k*22),b=Math.round(Math.abs(Math.sin(ph))*2),s=Math.sin(ph);
  const top=crouch-b; // desplazamiento vertical del cuerpo
  // raíces / piernas
  const lA=Math.round(s*3);
  if(k<.6){o.r(17,48+top/2+(lA>0?-2:0),6,18-top/2,bkD);o.r(29,48+top/2+(lA<0?-2:0),6,18-top/2,bkD);o.r(17,48+top/2,2,18,bk);o.r(29,48+top/2,2,18,bk);}
  for(const [x,dx] of [[16,-4],[22,-2],[30,2],[36,4]])o.l(x,64,x+dx,67,bkD); // raíces al suelo
  o.r(13,63,26,4,bkD);o.r(14,63,24,1,bk);
  // tronco
  const ty=18+top;o.r(14,ty,24,32,bk);o.r(14,ty,3,32,bkL);o.r(35,ty,3,32,bkD);
  for(let i=0;i<5;i++)o.l(19+i*4,ty+4+(i%2)*3,19+i*4+((i%2)?1:-1),ty+28,bkD); // vetas
  o.r(16,ty+6,4,3,mo);o.r(30,ty+20,5,3,mo);
  if(mode==='front'){
    const eo=k>.75?bkD:'#d8ff6a';o.r(19,ty+8,4,2,eo);o.r(29,ty+8,4,2,eo);if(k<=.75){o.p(20,ty+8,C.white);o.p(30,ty+8,C.white);}
    o.r(22,ty+15,8,3,'#2a1a10');o.r(23,ty+18,6,1,'#2a1a10'); // boca hueca
  }else{o.r(25,ty+2,2,26,bkD);o.l(20,ty+10,25,ty+16,bkD);o.l(32,ty+8,27,ty+14,bkD);o.r(18,ty+22,6,3,mo);o.r(28,ty+4,5,2,mo);o.p(21,ty+5,bkL);o.p(33,ty+18,bkL);} // espalda
  // brazos-rama
  const rA=raise||0;
  const arm=(sx,dir,lift)=>{const shx=sx,shy=ty+6,u=Math.min(1,lift);
    const ex=shx+dir*(5+3*(1-u)),ey=shy+10-20*u,hx=shx+dir*(3-5*u),hy=shy+20-42*u;
    o.L(shx,shy,ex,ey,6,bk);o.L(ex,ey,hx,hy,5,bkD);o.L(shx,shy,ex,ey,1,bkL);
    if(u>.5){o.e(hx,hy-2,5,4,bkD);o.e(hx,hy-3,3,2,bk);}
    for(const d of [-3,0,3])o.l(hx,hy,hx+d+dir,hy+(u>.5?-6:4),bkD);};
  arm(14,-1,Math.max(0,(mode==='front'?0:0)+(k>.5?.15:0)+s*.08));arm(38,1,mode==='back'?rA:Math.max(0,-s*.08));
  // copa de hojas (cabeza y hombros)
  const cy=ty-6;o.e(26,cy,15,9,C.leafD);o.e(25,cy-2,13,7,C.leaf);o.e(20,cy-4,5,3,C.leafL);o.e(33,cy-1,4,3,C.leafL);
  o.e(12,ty+3,5,4,C.leafD);o.e(40,ty+3,5,4,C.leafD);o.e(12,ty+2,3,2,C.leaf);o.e(40,ty+2,3,2,C.leaf);
  if(mode==='front'&&k>.75){o.r(10,ty+20,32,6,C.leafD);} // hojas tapando al dormir
  return finish(o,[26,66,16,2]);}
// ---------- DEMONIO (jefe) 84x84 ----------
function demon(ph,raise){const W=84,H=84,o=P(W,H);const sk='#c8303c',skD='#7e1426',skL='#ef6a5a',wg='#3a1430',wgD='#220a1e',hn=C.bone,hnD=C.boneD;
  const b=Math.round(Math.abs(Math.sin(ph))*2),s=Math.sin(ph),r=raise||0,by=-b;
  // alas detrás
  const wf=Math.round(Math.sin(ph*1)*2)+Math.round(r*4);
  for(const dir of [-1,1]){const x0=42+dir*12,y0=22+by;
    o.L(x0,y0,x0+dir*24,y0-14-wf,3,wgD);o.L(x0+dir*24,y0-14-wf,x0+dir*28,y0+14-wf,3,wgD);
    for(let i=0;i<3;i++){const px=x0+dir*(7+i*7),py=y0-5-wf/2-i*3;o.L(px,py,px+dir*2,py+24-i*3,2,wgD);}
    // membrana
    o.g.fillStyle=wg;o.g.beginPath();o.g.moveTo(x0,y0);o.g.lineTo(x0+dir*24,y0-14-wf);o.g.lineTo(x0+dir*28,y0+14-wf);o.g.lineTo(x0+dir*12,y0+28);o.g.closePath();o.g.fill();}
  // piernas con pezuñas
  const lA=Math.round(s*3);
  o.r(30,56+by+(lA>0?-2:0),8,18,skD);o.r(46,56+by+(lA<0?-2:0),8,18,skD);o.r(30,56+by,2,18,sk);o.r(46,56+by,2,18,sk);
  o.r(28,74+by+(lA>0?-2:0),11,6,'#2a1018');o.r(45,74+by+(lA<0?-2:0),11,6,'#2a1018');
  // torso musculoso
  o.r(27,26+by,30,32,sk);o.r(25,30+by,34,22,sk);o.r(27,26+by,30,3,skL);o.r(25,30+by,3,22,skL);o.r(56,30+by,3,22,skD);
  o.r(41,32+by,2,20,skD);o.r(31,40+by,9,1,skD);o.r(44,40+by,9,1,skD);o.r(31,46+by,9,1,skD);o.r(44,46+by,9,1,skD); // abdomen
  o.r(25,52+by,34,5,'#3a1420');o.r(39,52+by,6,5,C.gold);o.p(41,54+by,C.fireD); // cinturón
  // runa ardiente en el pecho
  o.r(39,33+by,6,5,C.fire);o.r(40,34+by,4,3,C.fireL);
  // brazos: caminar (balanceo) o levantar (r)
  const arm=(dir)=>{const shx=42+dir*16,shy=30+by;const up=r;
    const ex=shx+dir*(6-2*up),ey=shy+14-30*up;const hx=shx+dir*(8-8*up),hy=shy+28-56*up+(1-up)*Math.round(dir*s*3);
    o.L(shx,shy,ex,ey,8,sk);o.L(ex,ey,hx,hy,7,skD);o.L(shx+dir*-1,shy,ex+dir*-1,ey,2,skL);
    o.r(hx-4,hy-3,8,6,skD);for(const d of [-3,0,3])o.l(hx+d,hy+(up>.5?-3:3),hx+d,hy+(up>.5?-6:6),hn);};
  arm(-1);arm(1);
  if(r>.6){const fx=42,fy=-2+Math.round((1-r)*20)+by+6;o.e(fx,fy,7*r,6*r,C.fireD);o.e(fx,fy,5*r,4*r,C.fire);o.e(fx,fy,3*r,2*r,C.fireL);}
  // cabeza
  o.r(34,12+by,16,15,sk);o.r(33,15+by,18,9,sk);o.r(34,12+by,16,2,skL);o.r(49,14+by,2,11,skD);
  o.r(36,17+by,4,2,C.fireL);o.r(44,17+by,4,2,C.fireL);o.p(37,17+by,C.white);o.p(45,17+by,C.white); // ojos
  o.r(36,16+by,4,1,skD);o.r(44,16+by,4,1,skD);
  o.r(37,22+by,10,3,'#2a0a12');for(let i=0;i<5;i++)o.p(37+i*2,22+by,C.white);o.p(38,24+by,C.white);o.p(46,24+by,C.white); // boca con colmillos
  // cuernos
  o.L(35,13+by,29,6+by,3,hn);o.L(29,6+by,27,0+by,2,hn);o.L(49,13+by,55,6+by,3,hn);o.L(55,6+by,57,0+by,2,hn);o.L(35,14+by,30,8+by,1,hnD);o.L(49,14+by,54,8+by,1,hnD);
  return {c:finish(o,[42,82,20,2]),gem:[42,35.5+by]};}

// ---------- GOBLIN ARQUERO (de frente; cuadro 4 = disparo) 16x16 ----------
function goblin(f,n,sh){const o=P(16,16),t=sh?0:f/n*TAU,b=sh?0:bob(f,n),s=sh?0:Math.sin(t);
  const sk='#9ccc4e',skD='#5e8a2e',tn='#6a4a2a',tnD='#3e2a16';
  const lA=Math.round(s*1.5);
  o.r(5,11-b,2,3,tnD);o.r(9,11-b,2,3,tnD);o.r(4,14-b-(lA>0?1:0),3,2,'#24180f');o.r(9,14-b-(lA<0?1:0),3,2,'#24180f');
  o.r(4,7-b,8,5,tn);o.r(4,7-b,1,5,tnD);o.r(11,7-b,1,5,tnD);o.r(4,10-b,8,1,'#2a1a10');
  o.r(4,2-b,8,6,sk);o.r(5,1-b,6,1,sk);o.r(4,6-b,8,1,skD);o.l(4,3-b,0,1-b,sk);o.l(11,3-b,15,1-b,sk);o.p(0,1-b,skD);o.p(15,1-b,skD); // orejas
  o.r(5,1-b,6,2,'#5a3a22');o.p(5,3-b,'#5a3a22');o.p(10,3-b,'#5a3a22'); // gorro
  o.p(6,4-b,'#ffe25a');o.p(9,4-b,'#ffe25a');o.r(7,6-b,2,1,'#3a1c14');
  if(sh){o.l(2,8,13,8,C.wood);o.l(2,8,4,6,C.wood);o.l(13,8,11,6,C.wood);o.r(7,7,2,3,C.white);o.p(7,7,C.steel);o.r(3,9,2,2,sk);o.r(11,9,2,2,sk);}
  else{o.r(2,7-b+Math.round(s),2,4,sk);o.r(12,7-b-Math.round(s),2,4,sk);o.l(1,3-b,0,8-b,C.wood);o.l(0,8-b,1,13-b,C.wood);o.l(2,3-b,2,13-b,'#e8e0c8');}
  return finish(o,[8,15,4,1]);}
// ---------- ESQUELETO (de frente) 16x20 ----------
function skeleton(f,n){const o=P(16,20),t=f/n*TAU,b=bob(f,n),s=Math.sin(t),bn=C.bone,bd=C.boneD;
  const lA=Math.round(s*1.5);
  o.r(6,13-b,1,5,bn);o.r(9,13-b,1,5,bn);o.r(5,18-b-(lA>0?1:0),3,2,bd);o.r(9,18-b-(lA<0?1:0),3,2,bd);
  o.r(5,12-b,6,2,bd);o.r(7,7-b,2,6,bd); // pelvis y columna
  for(let i=0;i<3;i++)o.r(5,7-b+i*2,6,1,bn); // costillas
  o.r(4,7-b,1,1,bn);o.r(11,7-b,1,1,bn);
  const aY=Math.round(s*1.5);o.r(3,8-b+aY,1,5,bn);o.r(12,8-b-aY,1,5,bn);
  o.l(2,3-b+aY,2,13-b+aY,'#9aa0aa');o.r(1,12-b+aY,3,1,C.woodD); // espada oxidada
  o.e(13,11-b-aY,2.4,2.4,'#7a5a3a');o.p(13,11-b-aY,'#c8a050'); // escudo
  o.r(5,1-b,6,6,bn);o.r(4,2-b,8,3,bn);o.r(5,6-b,6,1,bd);o.r(5,1-b,6,1,'#fff6e0');
  o.r(5,3-b,2,2,'#1a1220');o.r(9,3-b,2,2,'#1a1220');o.p(6,3-b,'#7ef3ff');o.p(9,3-b,'#7ef3ff');o.r(7,5-b,2,1,'#1a1220');
  for(let i=0;i<3;i++)o.p(6+i*2,6-b,'#1a1220');
  return finish(o,[8,19,4,1]);}
// ---------- DIABLILLO volador (de frente) 16x16 ----------
function imp(f,n){const o=P(18,18),t=f/n*TAU,up=Math.round(Math.sin(t)*1.5),wf=f%2;
  const sk='#e0484a',skD='#8a1e2c',wg='#4a1430';
  // alas
  if(wf){o.l(6,6-up,0,2-up,wg);o.l(0,2-up,2,9-up,wg);o.l(12,6-up,18,2-up,wg);o.l(17,2-up,15,9-up,wg);o.r(1,3-up,4,5,wg);o.r(13,3-up,4,5,wg);}
  else{o.l(6,7-up,0,10-up,wg);o.l(0,10-up,4,12-up,wg);o.l(12,7-up,17,10-up,wg);o.l(17,10-up,13,12-up,wg);o.r(1,8-up,5,3,wg);o.r(12,8-up,5,3,wg);}
  o.e(9,9-up,4,4,sk);o.r(7,12-up,1,3,skD);o.r(10,12-up,1,3,skD);o.l(9,13-up,13,16-up,skD);o.p(14,16-up,'#ffcc44');
  o.e(9,5-up,3.5,3,sk);o.p(6,2-up,C.bone);o.p(5,1-up,C.bone);o.p(12,2-up,C.bone);o.p(13,1-up,C.bone);
  o.p(8,5-up,'#ffe25a');o.p(10,5-up,'#ffe25a');o.r(8,7-up,3,1,'#2a0a12');o.p(7,9-up,skD);
  return finish(o,[9,17,3,1]);}
// ---------- TROLL (jefe del bosque) 84x84 ----------
function troll(ph,raise){const o=P(84,84),sk='#7f8f5c',skD='#56633c',skL='#a4b47a',r=raise||0;
  const b=Math.round(Math.abs(Math.sin(ph))*2),s=Math.sin(ph),by=-b,lA=Math.round(s*3);
  o.r(26,60+by+(lA>0?-2:0),12,16,skD);o.r(46,60+by+(lA<0?-2:0),12,16,skD);o.r(24,74+by+(lA>0?-2:0),16,6,'#3e3a2a');o.r(44,74+by+(lA<0?-2:0),16,6,'#3e3a2a');
  o.e(42,44+by,22,20,sk);o.e(38,40+by,15,13,skL);o.e(42,54+by,18,8,skD); // panza
  o.r(24,56+by,36,7,'#6a4a2a');o.r(24,56+by,36,1,'#8a6a3a');for(let x=26;x<58;x+=6)o.r(x,62+by,3,3,'#6a4a2a'); // taparrabo
  // collar con piedra brillante
  for(let i=0;i<7;i++)o.p(34+i*2.4,30+by+Math.abs(i-3),C.bone);o.e(42,34+by,2.6,2.6,C.fire);o.p(41,33+by,C.fireL);
  const arm=dir=>{const shx=42+dir*20,shy=32+by,up=r,ex=shx+dir*(8-6*up),ey=shy+14-24*up,hx=shx+dir*(6-12*up),hy=shy+30-49*up+(1-up)*Math.round(dir*s*3);
    o.L(shx,shy,ex,ey,11,sk);o.L(ex,ey,hx,hy,10,skD);o.L(shx-dir,shy,ex-dir,ey,2,skL);o.e(hx,hy,6,5,skD);return [hx,hy];};
  const hL=arm(-1),hR=arm(1);
  // garrote
  if(r>.5){const cx=(hL[0]+hR[0])/2,cy=Math.min(hL[1],hR[1])+2;o.L(cx-16,cy-1,cx+12,cy-5,7,C.wood);o.e(cx+14,cy-6,7,6,C.woodD);o.p(cx+15,cy-10,C.bone);o.p(cx+10,cy-7,C.bone);}
  else{o.L(hL[0],hL[1],hL[0]-6,hL[1]+18,6,C.wood);o.e(hL[0]-7,hL[1]+20,6,5,C.woodD);o.p(hL[0]-9,hL[1]+18,C.bone);o.p(hL[0]-4,hL[1]+22,C.bone);}
  // cabeza
  o.e(42,18+by,10,9,sk);o.e(41,15+by,7,5,skL);o.r(36,16+by,4,2,'#2a1a10');o.r(44,16+by,4,2,'#2a1a10');o.p(37,16+by,'#ffe25a');o.p(45,16+by,'#ffe25a');
  o.e(42,20+by,3,2,skD);o.r(36,24+by,12,3,'#3a1c14');o.p(36,22+by,C.white);o.p(37,23+by,C.white);o.p(47,22+by,C.white);o.p(46,23+by,C.white);
  o.r(33,12+by,3,4,sk);o.r(48,12+by,3,4,sk);
  return {c:finish(o,[42,82,22,2]),gem:[42,34+by]};}
// ---------- DRAGÓN (jefe del ocaso) 92x84 ----------
function dragon(ph,raise){const W=92,o=P(W,84),sk='#2f8a6a',skD='#1d5a46',skL='#5ac094',bel='#e8c060',belD='#b88a34',wg='#5a3a7a',wgD='#3a2252',r=raise||0;
  const b=Math.round(Math.abs(Math.sin(ph))*2),s=Math.sin(ph),by=-b,wf=Math.round(Math.sin(ph)*2)+Math.round(r*6);
  for(const dir of [-1,1]){const x0=46+dir*12,y0=30+by;o.g.fillStyle=wg;o.g.beginPath();o.g.moveTo(x0,y0);o.g.lineTo(x0+dir*24,y0-22-wf);o.g.lineTo(x0+dir*32,y0+6-wf);o.g.lineTo(x0+dir*18,y0+26);o.g.closePath();o.g.fill();
    o.L(x0,y0,x0+dir*24,y0-22-wf,3,wgD);o.L(x0+dir*24,y0-22-wf,x0+dir*32,y0+6-wf,2,wgD);for(let i=1;i<3;i++)o.L(x0+dir*24,y0-22-wf,x0+dir*(10+i*8),y0+16+i*3,1,wgD);}
  o.L(60,66+by,82,72+by,6,skD);o.L(82,72+by,88,62+by,4,skD);o.p(89,60+by,skL); // cola
  const lA=Math.round(s*3);o.r(30,58+by+(lA>0?-2:0),11,18,skD);o.r(51,58+by+(lA<0?-2:0),11,18,skD);o.r(28,74+by+(lA>0?-2:0),15,6,'#163a2e');o.r(49,74+by+(lA<0?-2:0),15,6,'#163a2e');
  for(const x of [29,33,37,50,54,58])o.p(x,79+by+((x<45)?(lA>0?-2:0):(lA<0?-2:0)),C.bone);
  o.e(46,48+by,17,16,sk);o.e(46,50+by,11,13,bel);for(let y=40;y<62;y+=4)o.r(37,y+by,18,1,belD); // vientre
  o.e(46,38+by,3,3,C.fire);o.p(45,37+by,C.fireL); // glándula de fuego
  // brazos cortos con garras
  for(const dir of [-1,1]){const hx=46+dir*16,hy=44+by-Math.round(r*8);o.L(46+dir*12,38+by,hx,hy,6,sk);for(const d of [-2,0,2])o.p(hx+d,hy+4,C.bone);}
  // cuello y cabeza (se echa atrás al rugir)
  const hy=14+by-Math.round(r*6);o.L(46,36+by,46,hy+8,10,sk);for(let y=hy+10;y<36+by;y+=3)o.r(43,y,6,1,bel);
  o.e(46,hy,9,8,sk);o.e(46,hy+5,6,4,skL);o.r(41,hy-2,3,2,'#ffe25a');o.r(49,hy-2,3,2,'#ffe25a');o.p(42,hy-2,'#1a1220');o.p(50,hy-2,'#1a1220');
  o.L(39,hy-5,33,hy-13,3,C.bone);o.L(53,hy-5,59,hy-13,3,C.bone);o.p(44,hy+5,'#1a1220');o.p(48,hy+5,'#1a1220');
  if(r>.5){o.r(42,hy+7,8,4,'#3a0a12');o.e(46,hy+12,5*r,4*r,C.fire);o.e(46,hy+12,3*r,2*r,C.fireL);}
  return {c:finish(o,[46,82,22,2]),gem:[46,38+by]};}
// ---------- NIGROMANTE (jefe de la noche) 76x84 ----------
function lich(ph,raise){const o=P(76,84),rb='#2e2240',rbD='#1a1228',rbL='#4a3a66',r=raise||0,g='#7aff8a',gD='#2ab84a';
  const up=Math.round(Math.sin(ph)*3),sw=Math.round(Math.sin(ph*2)*2);
  // túnica flotante con borde rasgado
  for(let y=24;y<74;y++){const hw=Math.round(9+(y-24)*.34);o.r(38-hw,y-up,hw*2,1,rb);}
  for(let x=20;x<57;x+=4){const d=3+((x*7)%5);o.r(x+sw,74-up,3,d,rb);}
  o.r(37,30-up,2,40,rbD);o.r(22,40-up,2,30,rbL);
  // hombreras de hueso
  o.e(24,28-up,6,4,C.bone);o.e(52,28-up,6,4,C.bone);o.p(22,25-up,C.boneD);o.p(54,25-up,C.boneD);
  o.e(38,40-up,3,3,g);o.p(37,39-up,'#ffffff'); // gema de almas
  // brazos y bastón
  const arm=dir=>{const shx=38+dir*14,shy=30-up,ex=shx+dir*(5-3*r),ey=shy+12-24*r,hx=shx+dir*(4-8*r),hy=shy+22-44*r;o.L(shx,shy,ex,ey,5,rb);o.L(ex,ey,hx,hy,4,rbL);o.r(hx-2,hy-1,4,3,C.bone);return [hx,hy];};
  const hL=arm(-1),hR=arm(1);
  if(r>.5){const cx=(hL[0]+hR[0])/2,cy=Math.min(hL[1],hR[1])-6;o.e(cx,cy,6*r,6*r,gD);o.e(cx,cy,4*r,4*r,g);o.p(cx,cy,'#ffffff');}
  else{o.l(hR[0],hR[1]-26,hR[0],hR[1]+14,C.woodD);o.l(hR[0]+1,hR[1]-25,hR[0]+1,hR[1]+13,C.wood);o.e(hR[0],hR[1]-29,3,3,C.bone);o.p(hR[0]-1,hR[1]-29,'#1a1220');o.p(hR[0]+1,hR[1]-29,'#1a1220');o.r(hR[0]-1,hR[1]-35,3,4,g);}
  // capucha y calavera
  o.e(38,18-up,10,11,rbD);o.e(38,20-up,7,7,C.bone);o.r(34,19-up,3,3,'#120c18');o.r(39,19-up,3,3,'#120c18');o.p(35,20-up,g);o.p(40,20-up,g);
  o.r(36,24-up,5,2,'#120c18');for(let i=0;i<3;i++)o.p(36+i*2,24-up,C.bone);o.r(30,10-up,16,3,rbD);
  return {c:finish(o,[38,82,18,2]),gem:[38,40-up]};}
// ---------- íconos de la tienda 16x16 ----------
function icon(kind){const o=P(16,16);
  if(kind==='bow'){o.l(4,1,2,7,C.wood);o.l(2,7,4,14,C.wood);o.l(5,2,5,13,'#e8e0c8');o.l(3,8,14,8,C.woodL);o.r(13,7,2,3,C.steel);o.r(2,7,2,2,C.red);}
  else if(kind==='target'){o.e(8,8,7,7,C.red);o.e(8,8,5,5,C.white);o.e(8,8,3,3,C.red);o.r(7,7,2,2,C.white);o.l(9,7,15,1,C.woodD);o.r(14,0,2,2,C.red);}
  else if(kind==='bolt'){o.g.fillStyle=C.fireL;o.g.beginPath();o.g.moveTo(10,0);o.g.lineTo(3,9);o.g.lineTo(8,9);o.g.lineTo(5,16);o.g.lineTo(13,6);o.g.lineTo(8,6);o.g.closePath();o.g.fill();o.p(9,2,C.white);}
  else{o.r(7,1,2,14,'#c8a0ff');o.r(1,7,14,2,'#c8a0ff');o.r(5,5,6,6,'#9a6ad8');o.r(6,6,4,4,C.white);o.p(3,3,C.cyan);o.p(12,12,C.cyan);o.p(12,3,C.white);}
  return finish(o);}
// ---------- variantes ----------
const AV=[{tun:'#2f8f4a',tunD:'#1d5c30',hood:'#3a9e52',hoodD:'#22663a',hoodL:'#6fd07a'},
          {tun:'#7a4f2a',tunD:'#4c301a',hood:'#8a5c32',hoodD:'#5a3a1e',hoodL:'#b8844a'},
          {tun:'#355f9a',tunD:'#203c66',hood:'#3f6fae',hoodD:'#264674',hoodL:'#78a6e0'}];
const OV=[{sk:'#5fae4a',skD:'#3a7232',skL:'#8edc6a',arm:'#7a4f2e',armD:'#4a2e1a',eye:'#e83a2a'},
          {sk:'#8a9a62',skD:'#5c6a3e',skL:'#b4c48a',arm:'#5a5a62',armD:'#36363e',eye:'#ffd23a'},
          {sk:'#b0684a',skD:'#78402c',skL:'#d8946a',arm:'#3c2e26',armD:'#221a14',eye:'#ffee66'}];
const SV=[{c1:'#7ef3ff',c2:'#2ea6e6',c3:'#bff9ff'},{c1:'#c8a0ff',c2:'#7a46d8',c3:'#ead8ff'}];
const GV=[{st:'#8f8a80',stD:'#5c5850',stL:'#bbb5a8',rune:'#6ff0ff',moss:'#5f8f3a'},
          {st:'#5a4a48',stD:'#352a2a',stL:'#7e6a64',rune:'#ff8a22',moss:'#7a3a22'}];
const cyc=(n,fn)=>Array.from({length:n},(_,f)=>fn(f));
function build(){
  const out={};
  const A=AV.map(v=>sheet(cyc(4,f=>archer(v,f,4)).concat([archer(v,0,4,true)]),16,20,{mx:1,my:6}));
  const M=sheet(cyc(4,f=>mage(f,4)).concat([mage(0,4,true)]),16,22,{mx:13.5,my:1});
  for(const S of A.concat([M])){S.nr=4;S.shoot=4;}
  out.sol=[A[0],A[1],A[2],A[0],A[1],M];
  const pc=(...c)=>c;
  const orcs=OV.map((v,i)=>sheet(cyc(4,f=>orc(v,f,4)),18,20,{pc:[['95,174,74','122,79,46'],['138,154,98','90,90,98'],['176,104,74','60,46,38']][i]}));
  const spirits=SV.map((v,i)=>sheet(cyc(4,f=>spirit(v,f,4)),14,18,{pc:[['126,243,255','46,166,230','255,255,255'],['200,160,255','122,70,216','255,255,255']][i]}));
  const gob=sheet(cyc(4,f=>goblin(f,4,false)).concat([goblin(0,4,true)]),16,16,{pc:['156,204,78','106,74,42']});gob.nr=4;gob.shoot=4;
  const skel=sheet(cyc(4,f=>skeleton(f,4)),16,20,{pc:['234,220,184','168,147,106']});
  const im=sheet(cyc(4,f=>imp(f,4)),18,18,{pc:['224,72,74','74,20,48','255,204,68']});
  out.zom=orcs.concat(spirits,[gob,skel,im]); // 0-2 orcos, 3-4 espíritus, 5 goblin, 6 esqueleto, 7 diablillo
  out.bru=GV.map((v,i)=>sheet(cyc(4,f=>golem(v,f,4)),30,34,{pc:[['143,138,128','187,181,168','111,240,255'],['90,74,72','255,138,34','53,42,42']][i]}));
  out.ent={stand:sheet(cyc(6,f=>ent('front',1-f/5,0,0)),52,68),walk:sheet(cyc(6,f=>ent('back',0,f/6*TAU,0)),52,68),raise:sheet(cyc(5,f=>ent('back',0,0,f/4)),52,68)};
  const boss=(fn,w,h)=>{const dw=cyc(4,f=>fn(f/4*TAU,0)),dr=cyc(5,f=>fn(0,f/4));
    return {walk:sheet(dw.map(d=>d.c),w,h,{mxs:dw.map(d=>d.gem[0]),mys:dw.map(d=>d.gem[1])}),raise:sheet(dr.map(d=>d.c),w,h,{mxs:dr.map(d=>d.gem[0]),mys:dr.map(d=>d.gem[1])})};};
  out.bosses=[boss(troll,84,84),boss(dragon,92,84),boss(lich,76,84),boss(demon,84,84)];
  out.demon=out.bosses[3];
  out.icons={bow:icon('bow'),target:icon('target'),bolt:icon('bolt'),star:icon('star')};
  return out;}
return {build,C,P,finish,icons:()=>({bow:icon('bow'),target:icon('target'),bolt:icon('bolt'),star:icon('star')})};
}
if(typeof module!=='undefined')module.exports=Sprites8;
