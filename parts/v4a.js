/* ============================================================
   V4-A · Etapa 0: tutorial guiado (nivel corto y fijo, sin azar)
   ============================================================ */
function genLevel0(){
  const L=330,gates=[],crates=[],waves=[];let row=0;
  const zhp=26,bhp=260;
  const gate=(z,x0,x1,k,v)=>{gates.push({row,z,x0,x1,k,val:v,v0:v,kd:3,sz:z,fl:0,mg:0,unit:0,curse:0,rou:null,cost:0,mv:0,side:0,rp:0});};
  const pair=(z,l,r)=>{if(l)gate(z,-RAIL,0,l[0],l[1]);if(r)gate(z,0,RAIL,r[0],r[1]);row++;};
  const wave=(z,n,x0,x1,br)=>waves.push({z,n,x0,x1,depth:5+n*.08,br:br||0,run:0,sh:0,hp:zhp,bhp,done:false,ro:null,mini:false,gaunt:false,fs:0});
  const crate=(z,x,type)=>crates.push({z,x,type,hp:150,max:150,val:6,dead:false,fl:0,ft:0,kd:4,sz:z});
  pair(26,['add',8],['add',-3]);            // azul suma / rojo resta
  pair(60,null,['add',1]);                  // un solo portal: dispararle sube su número
  wave(92,10,-ROAD,ROAD);                   // primeros enemigos
  crate(122,0,'w');                         // cofre de flechas
  const gz=176;                             // guardián encerrado a la izquierda
  wave(gz+4,6,.2,ROAD);
  wave(236,22,-ROAD,ROAD,1);                // horda para la magia
  pair(268,['mul',2],['add',4]);            // multiplicador
  return {L,gates,crates,waves,bossHp:9000,gz,rollTrig:[],spikes:[],bridge:null,fork:null,amb:null,bk:0,t:0};
}
// pasos: z = metros del escuadrón en que aparece; tt = texto táctil; tk = texto con teclado (si cambia)
const TUT_STEPS=[
  {z:0,tt:'◀ <b>Desliza</b> para mover a tu legión ▶',tk:'◀ ▶ o <b>A / D</b> para mover a tu legión'},
  {z:10,tt:'Cruza el portal <b>AZUL</b>: suma arqueros. El <b>ROJO</b> resta.'},
  {z:40,tt:'<b>Dispárale</b> a un portal antes de cruzarlo: cada flecha sube su número.'},
  {z:74,tt:'¡Enemigos! Tus arqueros <b>disparan solos</b>: ponte frente a ellos.'},
  {z:106,tt:'Rompe el <b>cofre</b> a disparos: mejora tus flechas.'},
  {z:140,tt:'Un <b>guardián</b> está encerrado a la <b>IZQUIERDA</b>: pásate a ese lado y dispárale para liberarlo.'},
  {z:212,tt:'¡Anillo lleno! Toca <b>MAGIA</b> para barrer a la horda.',tk:'¡Anillo lleno! Pulsa <b>ESPACIO</b> para lanzar la magia.',fx:g=>{g.meter=1;},hold:g=>g.meter>=1&&!g.slash},
  {z:252,tt:'Los portales <b>×2</b> multiplican tu legión.'},
  {z:286,tt:'¡El <b>jefe</b>! Sal de las zonas <b>ROJAS</b> antes del golpe y no dejes de disparar.'}
];
function tutInit(g){g.tut={i:0,t:0,on:false};}
function tutShow(html){const b=$('tutBox');if(!b)return;b.firstElementChild.innerHTML=html;b.classList.add('on');}
function tutHide(){const b=$('tutBox');if(b)b.classList.remove('on');}
function tutTick(dt){const g=G,T=g.tut,sq=g.squad;if(!T)return;
  const kb=document.body.classList.contains('kb');
  if(T.i<TUT_STEPS.length&&sq.z>=TUT_STEPS[T.i].z){const s=TUT_STEPS[T.i];T.cur=s;T.i++;T.t=0;T.on=true;if(s.fx)s.fx(g);tutShow(kb&&s.tk?s.tk:s.tt);sfx.click();}
  if(T.on){T.t+=dt;const s=T.cur,keep=s&&s.hold&&s.hold(g)&&T.t<14;if(T.t>5.5&&!keep){T.on=false;tutHide();}}
}
// el tutorial también se puede repetir desde "Cómo jugar"
{const b=$('bTut');if(b)b.addEventListener('click',()=>{sfx.click();NEXT_MODE='next';startGame({tut:true});});}

/* ============================================================
   V4-A · bifurcación a ciegas y caudillo emboscador
   ============================================================ */
// ---------- bifurcación real (dos caminos de ancho completo) ----------
// Antes del cruce se ve una Y que se pierde en la niebla. Se decide por el lado en que va el escuadrón; el camino
// elegido se endereza (pasa a ser el camino recto) y el otro se aleja hacia el costado. La niebla va por delante.
const FORK_DEC=3,FORK_AHEAD=15;
function forkD(F,z){const u=z-F.z0;return u<=0?0:12.5*(1-Math.exp(-u/13));}
function forkTick(g,sq,dt){const F=g.fork;
  if(!g.forkSide&&sq.z>=F.z0-FORK_DEC){g.forkSide=sq.x<0?-1:1;g.forkT=0;g.forkBan=.85;const P=F.pend&&F.pend[g.forkSide];
    if(P){g.gates.push(...P.gates);g.crates.push(...P.crates);g.waves.push(...P.waves);g.spikes.push(...P.spikes);}F.pend=null;}
  if(g.forkSide&&g.forkT<1)g.forkT=Math.min(1,g.forkT+dt/.9);
  if(g.forkBan>0){g.forkBan-=dt;if(g.forkBan<=0){const FN=FORK_NAMES[F.k[g.forkSide]]||FORK_NAMES.tesoro;g.banner2={txt:FN[0],sub:FN[1],t:1.8,col:FN[2]};}}
  const fz=g.forkSide?Math.max(F.z0+7,sq.z+FORK_AHEAD):F.z0+7;let fa=.95;
  if(sq.z>F.z1-FORK_AHEAD)fa*=clamp(1-(sq.z-(F.z1-FORK_AHEAD))/18,0,1);
  if(F.z0-sq.z>150)fa=0;
  g.forkFog=fa>.01?{z:fz,a:fa}:null;}
// cuadrilátero en el suelo con bordes inclinados (a0..b0 en z0, a1..b1 en z1)
function pqa(a0,b0,z0,a1,b1,z1,y){if(!proj(a0,y,z0))return;const ax=PJ.x,ay=PJ.y;proj(b0,y,z0);const bx=PJ.x,by=PJ.y;if(!proj(b1,y,z1))return;const cx=PJ.x,cy=PJ.y;proj(a1,y,z1);
  ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.lineTo(cx,cy);ctx.lineTo(PJ.x,PJ.y);ctx.closePath();}
function drawForkGround(){const F=G.fork,p=SCN.pal,zN=cam.z+.6;if(F.z1<zN||F.z0>cam.z+170)return;
  const s=G.forkSide||0,t=G.forkT||0,za=Math.max(F.z0,zN),zb=Math.min(F.z1+.01,cam.z+170);if(zb<=za)return;
  const cA=z=>{const d=forkD(F,z);return s?s*d*(1-t):-d;},cB=z=>{const d=forkD(F,z);return s?-s*d*(1+t):d;};
  // el camino recto se tapa con pasto más allá del cruce
  ctx.fillStyle=p.grass[1];if(gq(-80,za,80,zb,.005))ctx.fill();
  ctx.fillStyle=p.grass[0];ctx.beginPath();for(let z=Math.floor(za/6)*6;z<zb;z+=6){const a=Math.max(z,za),b=Math.min(z+3,zb);if(b>a)gqa(-80,a,80,b,.006);}ctx.fill();
  // banda: rellena [c+x0, c+x1] por tramos de largo len alternando colores
  const band=(c,x0,x1,len,c0,c1,y)=>{for(const k of [0,1]){const col=k?c1:c0;if(!col)continue;ctx.fillStyle=col;ctx.beginPath();
      for(let z=Math.floor(za/len)*len;z<zb;z+=len){if(((Math.round(z/len)%2)+2)%2!==k&&c1)continue;const a=Math.max(z,za),b=Math.min(z+len,zb);if(b<=a)continue;const ca=c(a),cb=c(b);pqa(ca+x0,ca+x1,a,cb+x0,cb+x1,b,y);}
      ctx.fill();}};
  for(const c of s?[cB,cA]:[cA,cB]){
    band(c,-CURB-.6,CURB+.6,3,p.verge[0],p.verge[1],.008);
    band(c,-CURB,-ROAD,1.6,p.edge[1],p.edge[0],.015);band(c,ROAD,CURB,1.6,p.edge[1],p.edge[0],.015);
    band(c,-ROAD,ROAD,2.5,p.road[0],p.road[1],.01);
    for(const x of [-2.6,-1.9,1.7,2.4])band(c,x,x+.18,8,p.rut,null,.012);}
}
function drawForkFog(){const F=G.forkFog;if(!F||!proj(0,0,F.z))return;const f=SCN.pal.fog,yA=Math.min(H,Math.round(PJ.y));proj(0,0,F.z+8);
  const yB=Math.round(PJ.y),top=Math.max(0,Math.round(HORY)-40),n=8;
  ctx.fillStyle='rgba('+f+','+F.a.toFixed(3)+')';ctx.fillRect(0,top,W,Math.max(0,yB-top));
  for(let i=0;i<n;i++){const ya=Math.round(yB+(yA-yB)*i/n),yb=Math.round(yB+(yA-yB)*(i+1)/n);ctx.fillStyle='rgba('+f+','+(F.a*(1-(i+.5)/n)).toFixed(3)+')';ctx.fillRect(0,ya,W,yb-ya);}
  for(let i=0;i<6;i++){const y=yB+(yA-yB)*(.1+i*.15),w=W*(.3+.1*(i%3)),x=((T*(10+i*4)+i*131)%(W+w))-w;ctx.fillStyle='rgba('+f+','+(F.a*.3).toFixed(3)+')';ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.max(2,Math.round((yA-yB)*.07)));}}
const FORK_NAMES={tesoro:['SENDERO DEL TESORO','Cofres y trampas','#c8ff8a'],batalla:['CAMPO DE BATALLA','Más enemigos · oro doble','#ffb0a0'],portales:['PORTALES ARCANOS','Apuesta: ×2 o pierdes tropas','#c8a0ff']};
// El caudillo va siempre por delante del escuadrón y llama refuerzos mientras viva.
function spawnCaudillo(){const sq=G.squad,hs=hpScale(G.lv),hp=Math.round(330*Math.pow(hs,.85)*6*G.hpMul),s=Math.random()<.5?-1:1;
  G.zombies.push({x:s*1.6,z:sq.z+15,sp:0,hp,max:hp,br:true,caud:true,run:false,sh:false,cd:3.2,cd2:0,shoot:0,ph:0,off:0,pal:SPR.bru.length-1,hit:0,dead:false,kd:2,sz:sq.z+15,calls:0,sway:s});}
function caudTick(z,dt){const sq=G.squad;
  if(G.phase!=='run'||sq.z>G.L-40){z.dead=true;G.banner2={txt:'EL CAUDILLO HUYE',sub:'Se llevó su botín',t:1.8,col:'#ffb08a'};return;}
  z.z+=(sq.z+11-z.z)*Math.min(1,dt*1.8);z.ph+=dt*5;z.x+=(z.sway*1.6+Math.sin(G.time*.6)*1.4-z.x)*Math.min(1,dt*.9);
  if(z.hit>0)z.hit-=dt;
  z.cd-=dt;if(z.cd<=0){z.cd=Math.max(3.4,4.6-G.lv*.015);z.calls++;
    const E=SCN.pal.en,hpn=Math.round(34*Math.pow(hpScale(G.lv),.8))*G.hpMul,k=2+Math.min(5,Math.floor(G.lv/12));
    for(let i=0;i<k;i++){const sd=i%2?-1:1;G.zombies.push({x:sd*ROAD,z:sq.z+rnd(4,11),sp:rnd(1.6,2.4),hp:hpn,max:hpn,br:false,run:false,sh:false,cd:1,cd2:2,shoot:0,ph:Math.random()*TAU,off:rnd(-1,1),pal:E.r[(Math.random()*E.r.length)|0],hit:0,dead:false,kd:2,sz:0});}
    if(z.calls%4===0){const bh=Math.round(330*Math.pow(hpScale(G.lv),.85))*G.hpMul;G.zombies.push({x:rnd(-2,2),z:sq.z+16,sp:.85,hp:bh,max:bh,br:true,run:false,sh:false,cd:1,cd2:2,shoot:0,ph:0,off:rnd(-1,1),pal:E.h[(Math.random()*E.h.length)|0],hit:0,dead:false,kd:2,sz:0});}
    G.rings.push({x:z.x,z:z.z,t:0});ftext('¡REFUERZOS!','#ffb08a',z.x,4.2,z.z,1);if(thr('caud',.5))sfx.roar();}
}
function caudDown(z,reward){if(!reward)return;if(save.st)save.st.caud++;dropGem(z.x,z.z,1);if(Math.random()<.6)dropFrag(z.x,z.z);const c=Math.round((60+Math.min(G.lv,60)*5)*G.goldMul);G.coins+=c;G.cards++;shake=.9;G.hs=.15;
  for(let i=0;i<8;i++)flyCoin(z.x+rnd(-1,1),2,z.z);G.banner2={txt:'¡CAUDILLO DERRIBADO!',sub:'+'+c+' monedas · elige una bendición',t:2.2,col:'#ffe27a'};}
