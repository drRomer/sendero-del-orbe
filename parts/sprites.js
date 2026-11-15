/* ============================================================
   SPRITES (sprites9.js personajes con volumen; sprites8.js utilería e íconos)
   ============================================================ */
const NF=4;
const SVAR={length:6},ZVAR={length:3},BVAR={length:2}; // 6 tipos de tropa (el 6º es mago), 3 orcos, 2 gólems
const GUARD_HSTAND=9.19; // alto de pie del Ent (unidades locales)
const SPR={sol:[],zom:[],bru:[],flash:null,titan:null,guard3:null,mode:'pixel'};
function buildSprites(){
  const S8=Sprites8(mk),S=Sprites9();
  const fix=(s,h,wh)=>{s.k=h/Math.max(4,s.ay-s.top);if(wh&&!s.white)s.white=silhouette(s.img,'#fff');return s;};
  SPR.sol=S.sol.map(s=>fix(s,1.12));
  SPR.zom=S.zom.map((s,i)=>fix(s,[1.1,1.1,1.1,.98,.98,.94,1.12,.98][i]||1,true));
  SPR.bru=S.bru.map(s=>fix(s,2.25,true));
  SPR.bosses=S.bosses.map(B=>({walk:B.walk,raise:B.raise,kl:10.4/Math.max(10,B.walk.ay-B.walk.top)}));SPR.titan=SPR.bosses[3];
  // íconos de tienda con marco de piedra
  SPR.icons={};const IC=S8.icons();for(const k in IC){const F=mk(20,20),g=F.getContext('2d');g.imageSmoothingEnabled=false;
    g.fillStyle='#26191c';g.fillRect(0,0,20,20);g.fillStyle='#8c7a6b';g.fillRect(0,0,19,19);g.fillStyle='#4a3442';g.fillRect(1,1,18,18);g.fillStyle='#3a2a36';g.fillRect(2,2,16,16);
    g.fillStyle='#a8968a';g.fillRect(1,1,17,1);g.fillRect(1,1,1,17);g.drawImage(IC[k],2,2,16,16);SPR.icons[k]=F.toDataURL();}
  const E=S.ent,kl=GUARD_HSTAND/Math.max(10,E.walk.ay-E.walk.top);
  SPR.guard3={stand:E.stand,walk:E.walk,raise:E.raise,kl,cs:clamp((E.stand.ay-E.stand.top)*kl/7.5*1.18,.72,1)};
}
function buildFlash(){const c=mk(5,5),g=c.getContext('2d');g.fillStyle='#fff6c8';g.fillRect(2,0,1,5);g.fillRect(0,2,5,1);g.fillStyle='#ffffff';g.fillRect(2,2,1,1);SPR.flash=c;}
