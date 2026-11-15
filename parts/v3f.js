// ---------- v3f: guardado con marca de tiempo, API para la nube (window.SDO), instalar app ----------
// El progreso (nivel, monedas, mejoras, estrellas, diario) se separa de las opciones del dispositivo.
// Solo el progreso viaja a la nube; volumen, filtro y calidad quedan en cada celular.
const WEBAPP=!!window.SDO_WEB;
function progOf(s){const up={},st={};for(const u of UPG)up[u.id]=(s.up&&s.up[u.id])|0;
  const ss=s.stars||{};for(const k of Object.keys(ss).sort((a,b)=>a-b))st[k]=ss[k]|0;
  return {level:s.level|0,best:s.best|0,coins:s.coins|0,up,stars:st,daily:s.daily||''};}
let _pfp=null,SDO_HOOK=null;
function writeLocal(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));}catch(e){}}
function persist(){
  const fp=JSON.stringify(progOf(save));
  if(_pfp!==null&&fp!==_pfp)save.pt=Date.now();
  _pfp=fp;writeLocal();
  if(SDO_HOOK)try{SDO_HOOK();}catch(e){}
}
function loadSaveExtra(){
  let s=null;try{s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');}catch(e){}
  s=s&&typeof s==='object'?s:{};
  save.pt=Number.isFinite(s.pt)?Math.max(0,s.pt):0;
  save.cu=typeof s.cu==='string'&&/^[A-Za-z0-9_-]{1,128}$/.test(s.cu)?s.cu:'';
  save.cb=typeof s.cb==='string'&&/^[a-z0-9]{1,16}$/.test(s.cb)?s.cb:'';
  _pfp=JSON.stringify(progOf(save));
}
// Valida datos que llegan de fuera (nube) con los mismos límites que loadSave.
function cleanProg(p){
  if(!p||typeof p!=='object')return null;
  const n=(v,a,b,d)=>Number.isFinite(v)?clamp(Math.floor(v),a,b):d;
  const o={level:n(p.level,1,999,1),best:n(p.best,1,999,1),coins:n(p.coins,0,1e9,0),up:{},stars:{},
    daily:typeof p.daily==='string'&&/^\d{8}$/.test(p.daily)?p.daily:''};
  for(const u of UPG)o.up[u.id]=n(p.up&&typeof p.up==='object'?p.up[u.id]:0,0,u.max,0);
  if(p.stars&&typeof p.stars==='object')for(const k of Object.keys(p.stars)){const lv=parseInt(k,10);if(lv>=1&&lv<=999&&String(lv)===k)o.stars[lv]=n(p.stars[k],0,3,0);}
  o.best=Math.max(o.best,o.level);return o;
}
function applyProg(p,pt){
  const o=cleanProg(p);if(!o)return false;
  save.level=o.level;save.best=o.best;save.coins=o.coins;save.daily=o.daily;
  for(const u of UPG)save.up[u.id]=o.up[u.id];
  save.stars=o.stars;save.pt=Number.isFinite(pt)&&pt>0?pt:Date.now();
  _pfp=JSON.stringify(progOf(save));writeLocal();
  if(state==='menu'){newRun(save.level,true);renderShop();}
  return true;
}
// Orden de "quién va más avanzado": mejor nivel, estrellas, mejoras, monedas.
function progRank(p){const o=cleanProg(p)||cleanProg({});let u=0,st=0;for(const k in o.up)u+=o.up[k];for(const k in o.stars)st+=o.stars[k];return [o.best,st,u,o.coins];}
function cmpRank(a,b){for(let i=0;i<4;i++)if(a[i]!==b[i])return a[i]-b[i];return 0;}

// ---------- aviso flotante ----------
let TOAST_T=0;
function toast(msg,ms){const el=$('toast');if(!el)return;el.textContent=String(msg||'');el.classList.remove('hidden');el.classList.add('on');
  clearTimeout(TOAST_T);TOAST_T=setTimeout(()=>{el.classList.remove('on');setTimeout(()=>el.classList.add('hidden'),260);},ms||2600);}

window.SDO=Object.freeze({
  version:1,
  progress:()=>Object.assign(progOf(save),{pt:save.pt||0}),
  apply:(p,pt)=>applyProg(p,pt),
  rank:p=>progRank(p),cmpRank,
  clean:p=>cleanProg(p),
  // Vínculo con la nube: id opaco de la cuenta y huella del último estado sincronizado (base de la mezcla a 3 vías).
  linked:()=>({uid:save.cu||'',base:save.cb||''}),
  setLinked:(uid,base)=>{save.cu=typeof uid==='string'&&/^[A-Za-z0-9_-]{0,128}$/.test(uid)?uid:'';
    save.cb=save.cu&&typeof base==='string'&&/^[a-z0-9]{1,16}$/.test(base)?base:'';writeLocal();},
  onChange:f=>{SDO_HOOK=typeof f==='function'?f:null;},
  toast:(m,ms)=>toast(m,ms),
  confirm:(title,sub,yes,yesTxt,noTxt)=>askConfirm(title,sub,()=>{toOptions();if(yes)yes();},toOptions,yesTxt,noTxt),
  click:()=>{try{initAudio();sfx.click();}catch(e){}},
  inMenu:()=>state==='menu'
});

// ---------- solo versión web: pantalla completa e instalar ----------
if(WEBAPP){
  const mm=q=>window.matchMedia&&matchMedia(q).matches;
  const standalone=()=>mm('(display-mode: fullscreen)')||mm('(display-mode: standalone)')||navigator.standalone===true;
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  // Al pulsar el título en un celular (navegador, no instalada) entra a pantalla completa vertical.
  {const ts=$('titleScr');if(ts)ts.addEventListener('click',()=>{
    const de=document.documentElement;
    if(!mm('(pointer: coarse)')||standalone()||document.fullscreenElement||!de.requestFullscreen)return;
    de.requestFullscreen({navigationUI:'hide'}).then(()=>{try{const o=screen.orientation;if(o&&o.lock)o.lock('portrait').catch(()=>{});}catch(e){}}).catch(()=>{});
  });}
  let DEFER=null;const bI=$('bInstall');
  const showI=v=>{if(bI)bI.classList.toggle('hidden',!v);};
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();DEFER=e;showI(true);});
  window.addEventListener('appinstalled',()=>{DEFER=null;showI(false);toast('¡Instalada! Búscala en tu pantalla de inicio.');});
  if(ios&&!standalone())showI(true);
  if(bI)bI.addEventListener('click',()=>{try{initAudio();sfx.click();}catch(e){}
    if(DEFER){const d=DEFER;DEFER=null;d.prompt();d.userChoice.then(r=>{if(r&&r.outcome!=='accepted')DEFER=d;else showI(false);}).catch(()=>{});return;}
    if(ios)askConfirm('INSTALAR EN IPHONE','En Safari toca el botón Compartir y luego «Agregar a pantalla de inicio».',toMain,toMain,'ENTENDIDO','VOLVER');
  });
}
