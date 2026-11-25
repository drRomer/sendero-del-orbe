/* ============================================================
   V3-E · pantalla de título, menú principal, opciones, salir, audio por canales
   ============================================================ */
screens.push('titleScr','mainScr','optScr','confirmScr','byeScr');
let HOW_BACK='optScr';
{const a=document.querySelector('.logoBig'),b=$('mainLogo');if(a&&b)b.src=a.src;}
// ---------- resolución según la calidad elegida ----------
// La resolución lógica se elige para que la cámara (F) quede igual que en un celular vertical de
// 200 px lógicos de ancho: así los sprites se dibujan a su tamaño nativo en cualquier pantalla.
// Cada píxel lógico ocupa un número ENTERO de píxeles físicos (sin estiramientos desparejos).
const QUAL={normal:1,alta:1.25,baja:.8},QUALN={normal:'Normal',alta:'Alta',baja:'Baja'};
const F_REF=.96*200*(CAM_D*cosP+CAM_H*sinP)/(2*RAIL);
let LDEV=2;
function resize(){
  const dpr=Math.max(1,window.devicePixelRatio||1);
  const wd=Math.max(1,Math.round(innerWidth*dpr)),hd=Math.max(1,Math.round(innerHeight*dpr));
  dSq=CAM_D*cosP+CAM_H*sinP;
  const f1=Math.min(.74*hd,.96*wd*dSq/(2*RAIL));
  LDEV=Math.max(1,Math.round(f1/(F_REF*(QUAL[save.qual]||1))));
  W=Math.ceil(wd/LDEV);H=Math.ceil(hd/LDEV);PIX=LDEV/dpr;DPR=1;
  cv.width=W;cv.height=H;cv.style.width=(W*PIX)+'px';cv.style.height=(H*PIX)+'px';
  ctx.imageSmoothingEnabled=false;
  {const ui=Math.max(1,Math.min(2,innerWidth/700,innerHeight/520));document.documentElement.style.setProperty('--ui',ui.toFixed(3));}
  const vSq=-CAM_H*cosP+CAM_D*sinP;
  F=Math.min(0.74*H,0.96*W*dSq/(2*RAIL));
  CX=W/2; CY=0.75*H+vSq*F/dSq; HORY=CY-tanP*F;
  if(SCN){buildSky();buildBack();buildVignette();}
  if(typeof COINXY!=='undefined')COINXY=null;
}
// ---------- audio: música y efectos por separado ----------
function initAudio(){
  try{
    if(!AU.ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return;AU.ctx=new A();AU.master=AU.ctx.createGain();AU.master.gain.value=.55;AU.master.connect(AU.ctx.destination);
      AU.mus=AU.ctx.createGain();AU.fx=AU.ctx.createGain();AU.mus.connect(AU.master);AU.fx.connect(AU.master);applyVol();
      const len=AU.ctx.sampleRate,buf=AU.ctx.createBuffer(1,len,AU.ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;AU.nb=buf;}
    if(AU.ctx.state==='suspended')AU.ctx.resume();
  }catch(e){AU.ctx=null;}
}
function applyVol(){if(!AU.ctx||!AU.mus)return;AU.mus.gain.value=save.vm*1.1;AU.fx.gain.value=save.vs;}
const busOut=()=>AU.bus||AU.fx||AU.master;
function tone(f,dur,type,vol,slide,delay){const c=AU.ctx;if(!c||save.muted)return;try{const t0=c.currentTime+(delay||0),o=c.createOscillator(),g=c.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f+slide),t0+dur);g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+.008);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(g);g.connect(busOut());o.start(t0);o.stop(t0+dur+.03);}catch(e){}}
function noise(dur,vol,freq,ftype,delay,f2){const c=AU.ctx;if(!c||save.muted||!AU.nb)return;try{const t0=c.currentTime+(delay||0),s=c.createBufferSource();s.buffer=AU.nb;const fl=c.createBiquadFilter();fl.type=ftype||'lowpass';fl.frequency.setValueAtTime(freq,t0);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t0+dur);const g=c.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);s.connect(fl);fl.connect(g);g.connect(busOut());s.start(t0,Math.random()*.4);s.stop(t0+dur+.03);}catch(e){}}
function buzz(ms){if(save.vib===false)return;try{if(navigator.vibrate)navigator.vibrate(ms);}catch(e){}}
// ---------- navegación ----------
function toTitle(){musStop();state='menu';if(!G||!G.demo)newRun(save.level,true);hud.root.classList.add('hidden');show('titleScr');
  const t=$('titleScr'),lg=t.querySelector('.logoBig');if(lg){lg.style.animation='none';void lg.offsetWidth;lg.style.animation='';}}
function toMain(){state='menu';hud.root.classList.add('hidden');show('mainScr');if(AU.ctx&&!save.muted)musStart();}
function toMenu(){musStop();state='menu';newRun(save.level,true);hud.root.classList.add('hidden');renderShop();show('menu');if(AU.ctx&&!save.muted)musStart();}
function toOptions(){renderOpts();show('optScr');}
let CF_YES=null,CF_NO=null;
function askConfirm(title,sub,yes,no,yesTxt,noTxt){$('cfTitle').textContent=title;$('cfSub').textContent=sub||'';$('bCfYes').textContent=yesTxt||'SÍ';$('bCfNo').textContent=noTxt||'NO';CF_YES=yes;CF_NO=no;show('confirmScr');}
function exitGame(){persist();musStop();
  try{const C=window.Capacitor;if(C&&C.Plugins&&C.Plugins.App&&C.Plugins.App.exitApp){C.Plugins.App.exitApp();return;}}catch(e){}
  try{if(navigator.app&&navigator.app.exitApp){navigator.app.exitApp();return;}}catch(e){}
  try{window.close();}catch(e){}
  setTimeout(()=>{if(!document.hidden)show('byeScr');},300);}
function resetProgress(){save.level=1;save.best=1;save.coins=0;for(const u of UPG)save.up[u.id]=0;save.stars={};save.daily='';persist();newRun(1,true);renderShop();}
function renderOpts(){
  $('oMus').value=String(Math.round(save.vm*100));$('oMusV').textContent=String(Math.round(save.vm*100));
  $('oSfx').value=String(Math.round(save.vs*100));$('oSfxV').textContent=String(Math.round(save.vs*100));
  $('bSound').textContent=save.muted?'No':'Sí';$('bVib').textContent=save.vib===false?'No':'Sí';
  $('bCrt').textContent=save.crt?'Sí':'No';$('crt').classList.toggle('on',save.crt);$('bQual').textContent=QUALN[save.qual]||'Normal';
  for(const id of ['oMus','oSfx'])$(id).disabled=!!save.muted;}
// ---------- eventos ----------
{const ts=$('titleScr');const go=e=>{if(state!=='menu'||ts.classList.contains('hidden'))return;if(e&&e.type==='keydown'&&!['Enter',' ','Spacebar'].includes(e.key))return;initAudio();sfx.good();toMain();};
  ts.addEventListener('click',go);ts.addEventListener('keydown',go);}
$('bMainPlay').addEventListener('click',()=>{initAudio();sfx.click();musStop();toMenu();});
$('bMainOpt').addEventListener('click',()=>{initAudio();sfx.click();toOptions();});
$('bMainExit').addEventListener('click',()=>{initAudio();sfx.click();askConfirm('¿ESTÁS SEGURO QUE DESEAS SALIR?','Tu progreso queda guardado.',exitGame,toMain);});
$('bShopBack').addEventListener('click',()=>{sfx.click();toMain();});
$('bOptBack').addEventListener('click',()=>{sfx.click();toMain();});
$('bCfYes').addEventListener('click',()=>{sfx.click();const f=CF_YES;CF_YES=CF_NO=null;if(f)f();});
$('bCfNo').addEventListener('click',()=>{sfx.click();const f=CF_NO;CF_YES=CF_NO=null;if(f)f();else toMain();});
$('bByeBack').addEventListener('click',()=>{initAudio();sfx.click();toTitle();});
$('oMus').addEventListener('input',e=>{save.vm=clamp(+e.target.value/100,0,1);$('oMusV').textContent=e.target.value;initAudio();applyVol();persist();});
$('oSfx').addEventListener('input',e=>{save.vs=clamp(+e.target.value/100,0,1);$('oSfxV').textContent=e.target.value;initAudio();applyVol();persist();});
$('oSfx').addEventListener('change',()=>sfx.crate());
$('bVib').addEventListener('click',()=>{save.vib=save.vib===false;persist();sfx.click();if(save.vib)buzz(40);renderOpts();});
$('bQual').addEventListener('click',()=>{const o=['normal','alta','baja'];save.qual=o[(o.indexOf(save.qual||'normal')+1)%o.length];persist();sfx.click();resize();renderOpts();});
$('bReset').addEventListener('click',()=>{sfx.click();askConfirm('¿BORRAR TODO EL PROGRESO?','Vuelves al nivel 1 sin monedas, mejoras ni estrellas. Las opciones se mantienen.'+(save.cu?' También se reemplaza tu copia en la nube.':''),()=>{resetProgress();toOptions();},toOptions,'BORRAR','CANCELAR');});

// ---------- textos según el dispositivo: teclado/mouse (body.kb) o táctil ----------
{const B=document.body,set=k=>B.classList.toggle('kb',k);
  set(!!(window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches));
  addEventListener('keydown',()=>set(true),true);
  addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.pointerType==='pen')set(false);else if(e.pointerType==='mouse')set(true);},true);}
