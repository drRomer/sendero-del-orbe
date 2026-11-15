import test from 'node:test';
import assert from 'node:assert/strict';
import {stable,hash,decide,createSync,fingerprint,maskEmail,ago,errText} from '../src/cloud-core.js';

// SDO de prueba con las mismas reglas que el juego.
function mkSdo(p){
  const s={prog:{level:1,best:1,coins:0,up:{rec:0,pow:0},stars:{},daily:''},pt:0,link:{uid:'',base:''},menu:true,applied:0};
  Object.assign(s.prog,p||{});
  const clean=x=>x&&{level:x.level|0||1,best:Math.max(x.best|0||1,x.level|0||1),coins:x.coins|0,up:{rec:(x.up&&x.up.rec)|0,pow:(x.up&&x.up.pow)|0},stars:Object.assign({},x.stars||{}),daily:x.daily||''};
  return {s,
    progress:()=>Object.assign(clean(s.prog),{pt:s.pt}),
    clean,
    apply:(d,pt)=>{s.prog=clean(d);s.pt=pt;s.applied++;return true;},
    rank:x=>{const o=clean(x);return [o.best,Object.values(o.stars).reduce((a,b)=>a+b,0),o.up.rec+o.up.pow,o.coins];},
    cmpRank:(a,b)=>{for(let i=0;i<4;i++)if(a[i]!==b[i])return a[i]-b[i];return 0;},
    linked:()=>Object.assign({},s.link),
    setLinked:(uid,base)=>{s.link={uid,base:uid?base:''};},
    inMenu:()=>s.menu,
    play(ch){Object.assign(s.prog,ch);s.pt=Date.now()+Math.random();}
  };
}
function mkBackend(){const db={};let saves=0;return {db,get saves(){return saves;},
  async load(uid){return db[uid]?JSON.parse(JSON.stringify(db[uid])):null;},
  async save(uid,v){saves++;db[uid]=JSON.parse(JSON.stringify(v));},
  async remove(uid){delete db[uid];}};}
const timers={set:()=>0,clear:()=>{}};

test('stable ordena claves y hash es determinista',()=>{
  assert.equal(stable({b:1,a:{d:2,c:[3,{z:1,y:2}]}}),'{"a":{"c":[3,{"y":2,"z":1}],"d":2},"b":1}');
  assert.equal(hash(stable({a:1,b:2})),hash(stable({b:2,a:1})));
  assert.notEqual(hash('a'),hash('b'));
});

test('primera vez: gana la partida más avanzada',()=>{
  const sdo=mkSdo({best:12,level:12});
  const local=sdo.progress();
  assert.equal(decide(sdo,local,{level:5,best:5,coins:900,up:{},stars:{},pt:9e12},{uid:'',base:''},'u'),'local');
  assert.equal(decide(sdo,local,{level:20,best:20,coins:0,up:{},stars:{},pt:1},{uid:'',base:''},'u'),'cloud');
});

test('vinculado: mezcla a 3 vías sin depender del reloj',()=>{
  const sdo=mkSdo({best:10,level:10});
  const base=fingerprint(sdo,sdo.progress());
  const link={uid:'u',base};
  // jugué en otro celular (aunque su reloj vaya atrasado)
  assert.equal(decide(sdo,sdo.progress(),{level:11,best:11,coins:5,up:{},stars:{},pt:1},link,'u'),'cloud');
  // borré el progreso aquí: aunque la nube vaya más avanzada, gana lo local
  sdo.s.prog={level:1,best:1,coins:0,up:{},stars:{},daily:''};
  assert.equal(decide(sdo,sdo.progress(),{level:10,best:10,coins:0,up:{},stars:{},daily:''},link,'u'),'local');
  // cambios en ambos lados: el más avanzado
  assert.equal(decide(sdo,sdo.progress(),{level:11,best:11,coins:0,up:{},stars:{},pt:0},link,'u'),'cloud');
  // vínculo de otra cuenta se ignora
  assert.equal(decide(sdo,sdo.progress(),{level:10,best:10,coins:0,up:{},stars:{}},{uid:'otra',base},'u'),'cloud');
});

test('orden de campos distinto en la nube = mismo estado',()=>{
  const sdo=mkSdo({best:3,level:3,stars:{1:3,2:2}});
  const cloud={stars:{2:2,1:3},daily:'',up:{pow:0,rec:0},coins:0,best:3,level:3,pt:5};
  assert.equal(decide(sdo,sdo.progress(),cloud,{uid:'',base:''},'u'),'same');
});

test('sync: login sin nube sube; sin cambios no reescribe; cambios se suben',async()=>{
  const sdo=mkSdo({best:4,level:4}),be=mkBackend();
  const sync=createSync({sdo,backend:be,timers});
  assert.equal(await sync.setUser('u1'),'new');
  assert.equal(be.saves,1);assert.equal(be.db.u1.d.best,4);
  assert.equal(sdo.s.link.uid,'u1');
  await sync.flush();assert.equal(be.saves,1,'sin cambios no escribe');
  sdo.play({level:5,best:5,coins:30});await sync.flush();
  assert.equal(be.saves,2);assert.equal(be.db.u1.d.coins,30);
});

test('sync: segundo celular recupera; luego el primero trae los cambios',async()=>{
  const be=mkBackend();
  const a=mkSdo({best:8,level:8}),sa=createSync({sdo:a,backend:be,timers});
  await sa.setUser('u');
  const b=mkSdo({best:2,level:2}),sb=createSync({sdo:b,backend:be,timers});
  assert.equal(await sb.setUser('u'),'cloud');assert.equal(b.s.prog.best,8);
  b.play({level:9,best:9});await sb.flush();
  assert.equal(await sa.resync(),'cloud');assert.equal(a.s.prog.best,9);
});

test('sync: durante la partida no aplica cambios de la nube',async()=>{
  const be=mkBackend();
  const a=mkSdo({best:3,level:3}),sa=createSync({sdo:a,backend:be,timers});await sa.setUser('u');
  be.db.u.d.best=7;be.db.u.d.level=7;
  a.s.menu=false;assert.equal(await sa.resync(),null);assert.equal(a.s.prog.best,3);
  a.s.menu=true;assert.equal(await sa.resync(),'cloud');assert.equal(a.s.prog.best,7);
});

test('sync: sin conexión marca error, no pisa la nube y reintenta',async()=>{
  const be=mkBackend();be.db.u={d:{level:15,best:15,coins:0,up:{},stars:{},daily:''},pt:1};
  let off=true;const flaky=Object.assign({},be,{load:async uid=>{if(off)throw Object.assign(new Error('x'),{code:'unavailable'});return be.load(uid);}});
  const sdo=mkSdo({best:2,level:2}),states=[];
  const sync=createSync({sdo,backend:flaky,timers,onState:s=>states.push(s.status)});
  assert.equal(await sync.setUser('u'),null);
  assert.equal(states.at(-1),'err');assert.equal(sync.ready,false);
  sdo.play({coins:5});await sync.flush();
  assert.equal(be.db.u.d.best,15,'no sube antes de comparar');
  off=false;assert.equal(await sync.resync(),'cloud');assert.equal(sdo.s.prog.best,15);
});

test('sync: cambiar de cuenta a mitad de carga no mezcla datos',async()=>{
  const be=mkBackend();be.db.a={d:{level:30,best:30,coins:0,up:{},stars:{},daily:''},pt:1};
  let release;const slow=Object.assign({},be,{load:uid=>uid==='a'?new Promise(r=>{release=()=>r(be.load('a'));}):be.load(uid)});
  const sdo=mkSdo({best:2,level:2}),sync=createSync({sdo,backend:slow,timers});
  const p=sync.setUser('a');await sync.setUser(null);release();
  assert.equal(await p,null);assert.equal(sdo.s.prog.best,2);
});

test('wipe borra la copia y el vínculo',async()=>{
  const be=mkBackend(),sdo=mkSdo({best:6,level:6}),sync=createSync({sdo,backend:be,timers});
  await sync.setUser('u');await sync.wipe();
  assert.equal(be.db.u,undefined);assert.deepEqual(sdo.s.link,{uid:'',base:''});
  sdo.play({coins:1});await sync.flush();assert.equal(be.db.u,undefined,'tras borrar no vuelve a subir');
});

test('utilidades de texto',()=>{
  assert.equal(maskEmail('tomas@example.com'),'t***@example.com');
  assert.equal(maskEmail(''),'tu cuenta');
  assert.equal(ago(1000,1000+30e3),'recién');assert.equal(ago(1,1+5*60e3),'hace 5 min');
  assert.match(errText({code:'unavailable'}),/Sin conexión/);
  assert.match(errText({code:'permission-denied'}),/rechazó/);
});
