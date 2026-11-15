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
