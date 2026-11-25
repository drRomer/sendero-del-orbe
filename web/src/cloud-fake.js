// SOLO PARA PRUEBAS (no se publica): misma interfaz que cloud.js, con cuenta y nube
// simuladas en localStorage ('fakeAuth', 'fakeCloud') para probar la UI y la mezcla en el navegador.
import {mountCloud} from './cloud-ui.js';
const LS=window.localStorage;
const read=k=>{try{return JSON.parse(LS.getItem(k)||'null');}catch(e){return null;}};
const cbs=[];let cur=read('fakeAuth');
const fire=()=>cbs.forEach(cb=>cb(cur));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const backend={
  async load(uid){await wait(80);if(read('fakeOffline'))throw Object.assign(new Error('offline'),{code:'unavailable'});const db=read('fakeCloud')||{};return db[uid]||null;},
  async save(uid,v){await wait(80);if(read('fakeOffline'))throw Object.assign(new Error('offline'),{code:'unavailable'});const db=read('fakeCloud')||{};db[uid]={d:v.d,pt:v.pt,n:((db[uid]&&db[uid].n)||0)+1};LS.setItem('fakeCloud',JSON.stringify(db));},
  async remove(uid){await wait(50);const db=read('fakeCloud')||{};delete db[uid];LS.setItem('fakeCloud',JSON.stringify(db));}
};
const auth={
  onChange(cb){cbs.push(cb);setTimeout(()=>cb(cur),0);return ()=>{};},
  async login(){await wait(50);cur={uid:'fakeUid123',email:'jugador@example.com'};LS.setItem('fakeAuth',JSON.stringify(cur));fire();},
  async logout(){cur=null;LS.removeItem('fakeAuth');fire();},
  async remove(){cur=null;LS.removeItem('fakeAuth');fire();return true;}
};
window.__fakeCloud={login:()=>auth.login()};
mountCloud({sdo:window.SDO,auth,backend});
// Tabla simulada para probar la interfaz
{const sample=[['ROM',61.4,3,60,'b6'],['ANA',48.2,9,46,'b4'],['ZED',33.9,0,28,'b2'],['MAX',40.7,22,40,'kill'],['LUZ',12.1,1,11,'b1'],['KAI',25.5,14,24,''],['SOL',5.2,0,5,'tut']];
  const rows=sample.map(([n,km,d,lv,ti])=>({n,km,d,lv,ti,s:lv?Math.round(km*lv/(lv+d/2)*1000)/1000:0}));let mine=null;
  const val=(r,f)=>r[f];
  window.SDO_LB=Object.freeze({ready:()=>true,
    async post(e){await wait(60);mine=Object.assign({me:true},e);return true;},
    async top(f,dir){await wait(60);const all=rows.concat(mine?[mine]:[]);return all.slice().sort((a,b)=>dir==='asc'?val(a,f)-val(b,f):val(b,f)-val(a,f)).slice(0,50);},
    async mine(){return mine;},
    async rank(f,dir,v){const all=rows.concat(mine?[mine]:[]);return all.filter(r=>dir==='asc'?r[f]<v:r[f]>v).length+1;}});
  window.dispatchEvent(new Event('sdo_lb'));}
