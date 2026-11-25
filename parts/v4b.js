/* ============================================================
   V4-B · premios: gemas, aspectos de tropas, logros y títulos, fragmentos de guardián,
   estadísticas (km, muertes) y pantalla de colección
   ============================================================ */
const KM_PER_UNIT=1.5/1000; // 1 unidad del mundo ≈ 1,5 m
const SKINS=[
  {id:'bosque',name:'Bosque',cost:0,r:null},
  {id:'real',name:'Guardia real',cost:15,r:{cloakG:['#2a0a10','#4e1218','#7a1c22','#a82c2c','#d4483a'],cloakB:['#3a2408','#644012','#94661e','#c08e2e','#e8b84a'],cloakU:['#0e1236','#18205a','#24308a','#3448b4','#5068d8'],robe:['#24081a','#3e0e2a','#60183e','#862656','#b03a72']}},
  {id:'sombra',name:'Sombra',cost:25,r:{cloakG:['#0c0a10','#16141c','#22202c','#302c3e','#423c56'],cloakB:['#100c0c','#1e1616','#2e2222','#403030','#564242'],cloakU:['#0c0c18','#141428','#1e1e3a','#2a2a50','#3a3a6a'],robe:['#0e0614','#1a0c24','#2a1438','#3c1e52','#54306e']}},
  {id:'escarcha',name:'Escarcha',cost:25,r:{cloakG:['#2a4650','#3e6670','#5a8c96','#86b8c0','#c4e8ec'],cloakB:['#3a4048','#58606a','#7c8690','#a8b2ba','#dae2e8'],cloakU:['#1c3a5a','#2a5680','#3c76a6','#62a0cc','#a0d0f0'],robe:['#203a52','#30587a','#4a7ea4','#78acd0','#bce0f6']}},
  {id:'ocaso',name:'Ocaso',cost:35,r:{cloakG:['#3a1606','#64280c','#944216','#c86422','#f08c38'],cloakB:['#2e1a08','#523010','#7e4c1a','#ae6e28','#d8963c'],cloakU:['#3a0e0a','#621a12','#8e2c1a','#be4424','#e86630'],robe:['#2e0e06','#521c0c','#7c3012','#aa4a1a','#d86c26']}},
  {id:'dorado',name:'Legión dorada',cost:60,r:{cloakG:['#4a3008','#7a5414','#b08022','#e0b040','#ffe07a'],cloakB:['#3a2a10','#66501e','#9a7c34','#ccaa52','#f4d888'],cloakU:['#42320e','#70561c','#a6822e','#d6ae48','#fcdc7e'],robe:['#40382a','#6e6450','#a49a82','#d8d0b8','#fffaf0']}}];
// logros: t = título que se puede lucir; g = gemas de premio
const ACH=[
  {id:'tut',name:'Primeros pasos',desc:'Completa la etapa 0',t:'Aprendiz',g:2,ok:()=>save.tut},
  {id:'b1',name:'Rompetrolls',desc:'Vence al Troll del Bosque (nivel 10)',t:'Rompetrolls',g:5,ok:()=>save.best>10},
  {id:'b2',name:'Exorcista',desc:'Vence al Nigromante (nivel 20)',t:'Exorcista',g:5,ok:()=>save.best>20},
  {id:'b3',name:'Matadragones',desc:'Vence al Dragón del Ocaso (nivel 30)',t:'Matadragones',g:6,ok:()=>save.best>30},
  {id:'b4',name:'Desterrador',desc:'Vence al Demonio del Abismo (nivel 40)',t:'Desterrador',g:6,ok:()=>save.best>40},
  {id:'b5',name:'Insurgente',desc:'Vence al Juez Dictador (nivel 50)',t:'Insurgente',g:8,ok:()=>save.best>50},
  {id:'b6',name:'Guardián del Orbe',desc:'Derrota al Caos Regente (nivel 60)',t:'Guardián del Orbe',g:15,ok:()=>save.best>60},
  {id:'kill',name:'Mataorcos',desc:'Derrota a 2.000 enemigos',t:'Mataorcos',g:4,ok:()=>save.st.kills>=2000},
  {id:'army',name:'Comandante',desc:'Ten 120 tropas a la vez',t:'Comandante',g:3,ok:()=>save.st.peak>=120},
  {id:'free',name:'Libertador',desc:'Libera 15 guardianes',t:'Libertador',g:4,ok:()=>save.st.guards>=15},
  {id:'caud',name:'Cazacaudillos',desc:'Derriba 10 caudillos',t:'Cazacaudillos',g:4,ok:()=>save.st.caud>=10},
  {id:'stars',name:'Estratega',desc:'Consigue 3 estrellas en 15 niveles',t:'Estratega',g:5,ok:()=>Object.values(save.stars).filter(v=>v>=3).length>=15},
  {id:'col',name:'Domador',desc:'Desbloquea 6 guardianes',t:'Domador',g:4,ok:()=>gUnl().length>=6},
  {id:'km',name:'Trotamundos',desc:'Recorre 40 km',t:'Trotamundos',g:4,ok:()=>save.st.km>=40}];
function loadSaveV4(){let s=null;try{s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');}catch(e){}s=s&&typeof s==='object'?s:{};
  const n=(v,a,b,d)=>Number.isFinite(v)?clamp(Math.floor(v),a,b):d,ids=GUARDS.map(g=>g.id);
  save.gems=n(s.gems,0,1e6,0);
  save.skins=Array.isArray(s.skins)?s.skins.filter(id=>SKINS.some(k=>k.id===id)):[];if(!save.skins.includes('bosque'))save.skins.unshift('bosque');
  save.skin=SKINS.some(k=>k.id===s.skin)&&save.skins.includes(s.skin)?s.skin:'bosque';
  save.ach={};if(s.ach&&typeof s.ach==='object')for(const a of ACH)if(s.ach[a.id])save.ach[a.id]=1;
  save.title=typeof s.title==='string'&&save.ach[s.title]?s.title:'';
  save.lbn=typeof s.lbn==='string'&&/^[A-Z]{3}$/.test(s.lbn)?s.lbn:'';
  save.frag={};if(s.frag&&typeof s.frag==='object')for(const id of ids)if(s.frag[id])save.frag[id]=n(s.frag[id],0,GNEED,0);
  save.gu=Array.isArray(s.gu)?s.gu.filter(id=>ids.includes(id)):[];for(const b of GBASE)if(!save.gu.includes(b))save.gu.push(b);
  save.gsel=typeof s.gsel==='string'&&save.gu.includes(s.gsel)?s.gsel:'';
  const st=s.st&&typeof s.st==='object'?s.st:{},f=(v,a,b)=>Number.isFinite(v)?clamp(v,a,b):0;
  save.st={kills:n(st.kills,0,1e9,0),peak:n(st.peak,0,999,0),guards:n(st.guards,0,1e6,0),caud:n(st.caud,0,1e6,0),km:Math.round(f(st.km,0,1e5)*1000)/1000,deaths:n(st.deaths,0,1e6,0)};}
// ---------- aspectos: se reconstruyen arqueros y magos con otras rampas de color ----------
function applySkin(){const sk=SKINS.find(k=>k.id===save.skin)||SKINS[0];if(!SPR.sol||typeof archer9!=='function')return;
  const keys=['cloakG','cloakB','cloakU','robe'],bak={};for(const k of keys)bak[k]=RP[k];
  try{if(sk.r)for(const k of keys)RP[k]=sk.r[k];
    const cyc=(n,fn)=>Array.from({length:n},(_,f)=>fn(f)),fix=s=>{s.k=1.12/Math.max(4,s.ay-s.top);return s;};
    const A=['cloakG','cloakB','cloakU'].map(cl=>{const S=sheet9(cyc(4,f=>archer9(cl,f,4)).concat([archer9(cl,0,4,true)]),{mx:2,my:7});S.nr=4;S.shoot=4;return fix(S);});
    const MG=sheet9(cyc(4,f=>mage9(f,4)).concat([mage9(0,4,true)]),{mx:13,my:1});MG.nr=4;MG.shoot=4;fix(MG);
    const nw=[A[0],A[1],A[2],A[0],A[1],MG];for(let i=0;i<6;i++)SPR.sol[i]=nw[i];}
  finally{for(const k of keys)RP[k]=bak[k];}}
// ---------- premios durante el nivel ----------
function lockedGuards(){const U=gUnl();return GUARDS.filter(g=>!U.includes(g.id));}
function dropFrag(x,z){const L=lockedGuards();if(!L.length)return;const g=L[(Math.random()*L.length)|0];G.fragRun=G.fragRun||{};G.fragRun[g.id]=(G.fragRun[g.id]||0)+1;ftext('FRAGMENTO · '+g.n,'#c8a0ff',x,3.2,z,1);}
function dropGem(x,z,k){G.gemRun=(G.gemRun||0)+(k||1);ftext('+'+(k||1)+' GEMA','#7ae8ff',x,2.8,z,1);if(thr('gem',.2))tone(1320,.12,'sine',.04,600);}
function v4Crate(c){if(Math.random()<.35)dropGem(c.x,c.z,1);if(Math.random()<.4)dropFrag(c.x,c.z);}
// ---------- fin del nivel: estadísticas, gemas, fragmentos y logros ----------
function v4End(win,tutEnd,stars){const rows=[],st=save.st,lv=G.lv,daily=G.daily;
  st.kills+=G.kills;st.peak=Math.max(st.peak,G.peak||0);
  if(win){st.km=Math.round((st.km+G.L*KM_PER_UNIT)*1000)/1000;rows.push(['Distancia','+'+(G.L*KM_PER_UNIT).toFixed(2)+' km']);}
  else if(!tutEnd)st.deaths++;
  let gems=G.gemRun||0;
  if(win&&!daily&&!tutEnd){const prev=save.stars[lv]||0;if(!prev){gems+=1;if(lv%10===0)gems+=4;}if(stars>=3&&prev<3)gems+=1;}
  if(win&&!daily&&!tutEnd&&!(save.stars[lv]>0))dropFrag(0,0);
  if(gems){save.gems+=gems;rows.push(['Gemas','+'+gems]);}
  const fr=G.fragRun||{},fl=[];for(const id in fr){const g=GUARDS.find(q=>q.id===id);if(!g||gUnl().includes(id))continue;save.frag[id]=Math.min(GNEED,(save.frag[id]||0)+fr[id]);
    if(save.frag[id]>=GNEED){unlockGuard(id);rows.push(['¡Guardián nuevo!',g.n]);}else fl.push(g.n.split(' ')[0]+' '+save.frag[id]+'/'+GNEED);}
  if(fl.length)rows.push(['Fragmentos',fl]);
  return rows;}
function checkAch(quiet){const out=[];for(const a of ACH){if(save.ach[a.id])continue;let ok=false;try{ok=a.ok();}catch(e){}if(ok){save.ach[a.id]=1;save.gems+=a.g;out.push(a);}}
  if(out.length){persist();if(!quiet)out.forEach((a,i)=>setTimeout(()=>toast('LOGRO · '+a.name+' · +'+a.g+' gemas'),400+i*2800));}return out;}
function unlockGuard(id){if(!save.gu.includes(id))save.gu.push(id);delete save.frag[id];}
// ---------- colección (guardianes, aspectos, logros) ----------
let COLTAB='g';const ICONS={};
function sprIcon(S,fr){const c=document.createElement('canvas');c.width=S.fw;c.height=S.fh;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(S.img,(fr||0)*S.fw,0,S.fw,S.fh,0,0,S.fw,S.fh);return c.toDataURL();}
function guardIcon(id){if(ICONS[id])return ICONS[id];let S=null;
  if(id==='ent')S=SPR.guardE&&SPR.guardE.stand;else if(id==='wolves')S=SPR.wolfS&&SPR.wolfS[0].sit;else if(id==='griffin')S=SPR.grifS&&SPR.grifS[0].perch;else if(SPR.g11&&SPR.g11[id]){const o=SPR.g11[id];S=o.fly||o.walk||o.run;}
  return ICONS[id]=S?sprIcon(S,0):'';}
function skinIcon(id){const key='sk_'+id;if(ICONS[key])return ICONS[key];const cur=save.skin;save.skin=id;const bak=SPR.sol.slice(0,6);applySkin();ICONS[key]=sprIcon(SPR.sol[0],0);for(let i=0;i<6;i++)SPR.sol[i]=bak[i];save.skin=cur;return ICONS[key];}
function achIcon(own){const key='ach'+(own?1:0);if(ICONS[key])return ICONS[key];const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d');
  const P=['......##......','.....#oo#.....','.....#oo#.....','#####oyyo#####','#oooooyyooooo#','.#ooyyyyyyoo#.','..#ooyyyyoo#..','...#oyyyyo#...','..#oooyyooo#..','..#oo#..#oo#..','.#oo#....#oo#.','.###......###.'];
  const col=own?{'#':'#3a2408','o':'#e0b040','y':'#fff2a0'}:{'#':'#1a1424','o':'#4a3e5a','y':'#6a5e7a'};
  P.forEach((r,y)=>[...r].forEach((ch,x)=>{if(col[ch]){g.fillStyle=col[ch];g.fillRect(x+1,y+2,1,1);}}));return ICONS[key]=c.toDataURL();}
function openCol(tab){COLTAB=tab||COLTAB;renderCol();show('colScr');}
function renderCol(){const list=$('colList');if(!list)return;list.replaceChildren();
  document.querySelectorAll('#colScr .tab').forEach(b=>b.classList.toggle('on',b.dataset.t===COLTAB));
  const head=$('colHead');head.replaceChildren();head.append(mkEl('span',null,COLTAB==='g'?'GUARDIANES':COLTAB==='s'?'ASPECTOS':'LOGROS'));
  const wal=mkEl('span');wal.append(mkEl('i','coin'),mkEl('b',null,String(save.coins)),mkEl('i','gem'),mkEl('b',null,String(save.gems)));head.append(wal);
  const row=(icon,title,desc,btn)=>{const r=mkEl('div','upg'),ic=mkEl('div','ic'),tx=mkEl('div','tx');if(icon){const im=new Image();im.alt='';im.src=icon;ic.append(im);}tx.append(mkEl('b',null,title),mkEl('span',null,desc));r.append(ic,tx);if(btn)r.append(btn);list.append(r);return r;};
  const button=(txt,cls,on,dis)=>{const b=mkEl('button',cls||'buy');b.type='button';if(typeof txt==='string')b.textContent=txt;else b.append(...txt);b.disabled=!!dis;b.addEventListener('click',()=>{initAudio();on();renderCol();renderShop();});return b;};
  if(COLTAB==='g'){const U=gUnl();
    const auto=mkEl('div','upg rot');auto.append(mkEl('div','tx'));auto.firstChild.append(mkEl('b',null,'ALTERNAR GUARDIANES'),mkEl('span',null,'Cada nivel trae uno distinto de los que tienes'));
    auto.append(button(save.gsel?'ELEGIR':'ACTIVO',save.gsel?'buy':'buy on',()=>{save.gsel='';persist();sfx.click();},!save.gsel));list.append(auto);
    for(const g of GUARDS){const own=U.includes(g.id),fr=save.frag[g.id]||0,sel=save.gsel===g.id;
      let b;if(own)b=button(sel?'ELEGIDO':'ELEGIR',sel?'buy on':'buy',()=>{save.gsel=g.id;persist();sfx.click();},sel);
      else b=button([mkEl('i','coin'),document.createTextNode(String(g.cost))],'buy',()=>{if(save.coins<g.cost)return;save.coins-=g.cost;unlockGuard(g.id);persist();sfx.crate();checkAch();},save.coins<g.cost);
      row(guardIcon(g.id),g.n,g.desc+(own?'':' · fragmentos '+fr+'/'+GNEED),b).classList.toggle('lock',!own);}}
  else if(COLTAB==='s'){for(const k of SKINS){const own=save.skins.includes(k.id),sel=save.skin===k.id;
      const b=own?button(sel?'PUESTO':'USAR',sel?'buy on':'buy',()=>{save.skin=k.id;persist();applySkin();sfx.click();if(state==='menu')newRun(save.level,true);},sel)
        :button([mkEl('i','gem'),document.createTextNode(String(k.cost))],'buy',()=>{if(save.gems<k.cost)return;save.gems-=k.cost;save.skins.push(k.id);save.skin=k.id;persist();applySkin();sfx.crate();},save.gems<k.cost);
      row(skinIcon(k.id),k.name.toUpperCase(),own?'Aspecto para arqueros y magos':'Se compra con gemas',b);}}
  else{const got=ACH.filter(a=>save.ach[a.id]).length;
    const tt=mkEl('div','upg rot');tt.append(mkEl('div','tx'));tt.firstChild.append(mkEl('b',null,'TÍTULO: '+(save.title?(ACH.find(a=>a.id===save.title)||{}).t:'ninguno').toUpperCase()),mkEl('span',null,got+' de '+ACH.length+' logros · toca LUCIR para usar un título'));list.append(tt);
    for(const a of ACH){const own=!!save.ach[a.id],sel=save.title===a.id;
      const b=own?button(sel?'LUCIENDO':'LUCIR',sel?'buy on':'buy',()=>{save.title=sel?'':a.id;persist();sfx.click();}):null;
      const r=row(achIcon(own),a.name.toUpperCase(),a.desc+' · título «'+a.t+'» · +'+a.g+' gemas',b);r.classList.toggle('lock',!own);}}}
{const B=(id,fn)=>{const e=$(id);if(e)e.addEventListener('click',fn);};
  B('bGuards',()=>{sfx.click();openCol('g');});B('bSkins',()=>{sfx.click();openCol('s');});B('bAch',()=>{sfx.click();openCol('a');});
  B('bColBack',()=>{sfx.click();renderShop();show('menu');});
  document.querySelectorAll('#colScr .tab').forEach(b=>b.addEventListener('click',()=>{sfx.click();COLTAB=b.dataset.t;renderCol();}));}
screens.push('colScr');
function resetProgress(){save.level=1;save.best=1;save.coins=0;for(const u of UPG)save.up[u.id]=0;save.stars={};save.daily='';
  save.gems=0;save.skins=['bosque'];save.skin='bosque';save.ach={};save.title='';save.frag={};save.gu=GBASE.slice();save.gsel='';save.tut=false;
  save.st={kills:0,peak:0,guards:0,caud:0,km:0,deaths:0};applySkin();persist();newRun(1,true);renderShop();}

/* ---------- progreso en la nube: ahora incluye los extras (gemas, aspectos, logros, guardianes, estadísticas) ---------- */
function xOf(s){const st=s.st||{};return {gems:s.gems|0,skins:(s.skins||['bosque']).slice().sort(),skin:s.skin||'bosque',ach:Object.keys(s.ach||{}).sort(),title:s.title||'',
  frag:Object.assign({},s.frag||{}),gu:(s.gu||GBASE).slice().sort(),gsel:s.gsel||'',tut:!!s.tut,
  st:{kills:st.kills|0,peak:st.peak|0,guards:st.guards|0,caud:st.caud|0,km:Math.round((st.km||0)*1000)/1000,deaths:st.deaths|0}};}
function cleanX(x){if(!x||typeof x!=='object')return null;const n=(v,a,b,d)=>Number.isFinite(v)?clamp(Math.floor(v),a,b):d,ids=GUARDS.map(g=>g.id);
  const skins=Array.isArray(x.skins)?x.skins.filter(id=>SKINS.some(k=>k.id===id)):[];if(!skins.includes('bosque'))skins.push('bosque');
  const ach=Array.isArray(x.ach)?x.ach.filter(id=>ACH.some(a=>a.id===id)):[];const gu=Array.isArray(x.gu)?x.gu.filter(id=>ids.includes(id)):[];for(const b of GBASE)if(!gu.includes(b))gu.push(b);
  const frag={};if(x.frag&&typeof x.frag==='object')for(const id of ids)if(x.frag[id])frag[id]=n(x.frag[id],0,GNEED,0);
  const st=x.st&&typeof x.st==='object'?x.st:{};
  return {gems:n(x.gems,0,1e6,0),skins:skins.sort(),skin:skins.includes(x.skin)?x.skin:'bosque',ach:ach.sort(),title:ach.includes(x.title)?x.title:'',frag,gu:gu.sort(),gsel:gu.includes(x.gsel)?x.gsel:'',tut:x.tut===true,
    st:{kills:n(st.kills,0,1e9,0),peak:n(st.peak,0,999,0),guards:n(st.guards,0,1e6,0),caud:n(st.caud,0,1e6,0),km:Number.isFinite(st.km)?Math.round(clamp(st.km,0,1e5)*1000)/1000:0,deaths:n(st.deaths,0,1e6,0)}};}
function progOf(s){const up={},st={};for(const u of UPG)up[u.id]=(s.up&&s.up[u.id])|0;
  const ss=s.stars||{};for(const k of Object.keys(ss).sort((a,b)=>a-b))st[k]=ss[k]|0;
  return {level:s.level|0,best:s.best|0,coins:s.coins|0,up,stars:st,daily:s.daily||'',x:xOf(s)};}
function cleanProg(p){
  if(!p||typeof p!=='object')return null;
  const n=(v,a,b,d)=>Number.isFinite(v)?clamp(Math.floor(v),a,b):d;
  const o={level:n(p.level,1,999,1),best:n(p.best,1,999,1),coins:n(p.coins,0,1e9,0),up:{},stars:{},daily:typeof p.daily==='string'&&/^\d{8}$/.test(p.daily)?p.daily:''};
  for(const u of UPG)o.up[u.id]=n(p.up&&typeof p.up==='object'?p.up[u.id]:0,0,u.max,0);
  if(p.stars&&typeof p.stars==='object')for(const k of Object.keys(p.stars)){const lv=parseInt(k,10);if(lv>=1&&lv<=999&&String(lv)===k)o.stars[lv]=n(p.stars[k],0,3,0);}
  o.best=Math.max(o.best,o.level);const x=cleanX(p.x);if(x)o.x=x;return o;}
function applyProg(p,pt){
  const o=cleanProg(p);if(!o)return false;
  save.level=o.level;save.best=o.best;save.coins=o.coins;save.daily=o.daily;
  for(const u of UPG)save.up[u.id]=o.up[u.id];
  save.stars=o.stars;save.pt=Number.isFinite(pt)&&pt>0?pt:Date.now();
  if(o.x){const x=o.x;save.gems=x.gems;save.skins=x.skins;save.skin=x.skin;save.ach={};for(const id of x.ach)save.ach[id]=1;save.title=x.title;save.frag=x.frag;save.gu=x.gu;save.gsel=x.gsel;save.tut=x.tut||save.tut;save.st=x.st;applySkin();}
  _pfp=JSON.stringify(progOf(save));writeLocal();
  if(state==='menu'){newRun(save.level,true);renderShop();}
  return true;}

/* ---------- tabla de leyendas (global) ---------- */
// Fórmula general: distancia × eficiencia, con eficiencia = niveles ÷ (niveles + muertes ÷ 2).
const lbScore=(km,lv,d)=>lv>0?Math.round(km*lv/(lv+d*.5)*1000)/1000:0;
let LBO='s';
const LBCOLS={s:['PUNTAJE',r=>r.s.toFixed(2),'desc'],km:['KM',r=>r.km.toFixed(2),'desc'],d:['MUERTES',r=>String(r.d),'asc']};
function lbEntry(){const st=save.st||{},lv=Math.max(0,save.best-1),km=Math.round((st.km||0)*1000)/1000,d=st.deaths|0;
  const ti=save.title&&ACH.some(a=>a.id===save.title)?save.title:'';return {n:save.lbn||'',km,d,lv,s:lbScore(km,lv,d),ti};}
const titleOf=id=>{const a=ACH.find(q=>q.id===id);return a?a.t:'';};
async function lbPost(silent){const L=window.SDO_LB;if(!L||!/^[A-Z]{3}$/.test(save.lbn||''))return false;
  try{const ok=await L.post(lbEntry());if(ok&&!silent)toast('Puntaje publicado');return ok;}catch(e){if(!silent)toast('No se pudo publicar: '+((e&&e.code)||'sin conexión'),3200);return false;}}
async function renderLb(){const L=window.SDO_LB,list=$('lbList'),note=$('lbNote'),head=$('lbHead'),mine=$('lbMine');
  document.querySelectorAll('#lbScr .tab').forEach(b=>b.classList.toggle('on',b.dataset.o===LBO));
  $('lbName').value=save.lbn||'';const e=lbEntry();
  mine.textContent='Tú: '+e.km.toFixed(2)+' km · '+e.lv+' niveles · '+e.d+' muertes → puntaje '+e.s.toFixed(2)+(e.ti?' · «'+titleOf(e.ti)+'»':'');
  const col=LBCOLS[LBO];head.replaceChildren(mkEl('span',null,'#'),mkEl('span',null,'JUG.'),mkEl('span',null,'TÍTULO'),mkEl('span','v',col[0]));
  list.replaceChildren();
  if(!L){note.textContent='La tabla global está en la versión web del juego (necesita conexión a la nube).';return;}
  note.textContent='Cargando…';
  try{const rows=await L.top(LBO,col[2],50);list.replaceChildren();
    rows.forEach((r,i)=>{const d=mkEl('div','lbRow'+(r.me?' me':''));d.append(mkEl('span',null,String(i+1)),mkEl('b',null,r.n||'???'),mkEl('span','ti',titleOf(r.ti)),mkEl('span','v',col[1](r)));list.append(d);});
    note.textContent=rows.length?'General = km × niveles ÷ (niveles + muertes ÷ 2)':'Aún no hay puntajes: ¡sé el primero!';
    const me=await L.mine();if(me&&!rows.some(r=>r.me)){const k=await L.rank(LBO,col[2],me[LBO]);note.textContent='Tu puesto: '+k+' · '+note.textContent;}}
  catch(err){note.textContent='No se pudo cargar la tabla ('+((err&&err.code)||'sin conexión')+').';}}
function openLb(back){LB_BACK=back||'menu';renderLb();show('lbScr');}
let LB_BACK='menu';
{const B=(id,fn)=>{const e=$(id);if(e)e.addEventListener('click',fn);};
  B('bLb',()=>{sfx.click();openLb('menu');});B('bMainLb',()=>{sfx.click();openLb('mainScr');});
  B('bLbBack',()=>{sfx.click();if(LB_BACK==='menu'){renderShop();show('menu');}else show(LB_BACK);});
  B('bLbPost',async()=>{const v=($('lbName').value||'').toUpperCase().replace(/[^A-Z]/g,'').slice(0,3);if(v.length!==3){toast('Escribe 3 letras (A-Z)');return;}
    save.lbn=v;persist();sfx.click();if(await lbPost(false))renderLb();});
  const inp=$('lbName');if(inp)inp.addEventListener('input',()=>{inp.value=inp.value.toUpperCase().replace(/[^A-Z]/g,'').slice(0,3);});
  document.querySelectorAll('#lbScr .tab').forEach(b=>b.addEventListener('click',()=>{sfx.click();LBO=b.dataset.o;renderLb();}));
  window.addEventListener('sdo_lb',()=>{if(state==='menu'&&!$('lbScr').classList.contains('hidden'))renderLb();});}
screens.push('lbScr');
