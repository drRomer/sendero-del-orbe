// Núcleo de sincronización del progreso. No depende de Firebase: recibe un backend
// {load(uid)->{d,pt}|null, save(uid,{d,pt}), remove(uid)} y la API del juego (window.SDO).
// Mezcla a 3 vías: la "base" es la huella del último estado que este celular sincronizó.

// JSON con claves ordenadas: la misma partida da siempre la misma huella,
// venga de localStorage o de Firestore (que no garantiza el orden de los campos).
export function stable(v){
  if(v===null||typeof v!=='object')return JSON.stringify(v);
  if(Array.isArray(v))return '['+v.map(stable).join(',')+']';
  return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}';
}
// FNV-1a 32 bits en hexadecimal: corto, suficiente para detectar cambios (no es seguridad).
export function hash(str){let h=0x811c9dc5;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193);}return (h>>>0).toString(16);}
export function strip(p){const o=Object.assign({},p||{});delete o.pt;return o;}
export function fingerprint(sdo,p){return hash(stable(sdo.clean(strip(p))||{}));}

// 'cloud' = usar la nube, 'local' = subir lo de este celular, 'same' = iguales.
export function decide(sdo,local,cloud,link,uid){
  const lf=fingerprint(sdo,local),cf=fingerprint(sdo,cloud);
  if(lf===cf)return 'same';
  if(link&&link.uid===uid&&link.base){
    const lChanged=lf!==link.base,cChanged=cf!==link.base;
    if(!lChanged&&cChanged)return 'cloud';   // jugaste en otro celular
    if(lChanged&&!cChanged)return 'local';   // jugaste aquí (o borraste el progreso)
  }
  // Primera vez en este celular o cambios en ambos lados: gana la partida más avanzada.
  const r=sdo.cmpRank(sdo.rank(local),sdo.rank(cloud));
  if(r!==0)return r>0?'local':'cloud';
  return (cloud.pt||0)>(local.pt||0)?'cloud':'local';
}

export function createSync({sdo,backend,onState=()=>{},delay=2500,timers={set:(f,ms)=>setTimeout(f,ms),clear:t=>clearTimeout(t)}}){
  const st={uid:null,status:'off',lastOk:0,err:null};
  let gen=0,ready=false,lastFp=null,timer=0,busy=false,again=false;
  const emit=()=>{try{onState(Object.assign({},st));}catch(e){}};
  const fail=e=>{st.status='err';st.err=e;emit();};

  async function push(force){
    const p=sdo.progress(),f=fingerprint(sdo,p);
    if(!force&&f===lastFp)return false;
    const uid=st.uid,g=gen;
    await backend.save(uid,{d:sdo.clean(strip(p)),pt:Number.isFinite(p.pt)?p.pt:0});
    if(g!==gen)return false;
    lastFp=f;sdo.setLinked(uid,f);
    st.status='ok';st.err=null;st.lastOk=Date.now();emit();return true;
  }
  async function pull(){
    const uid=st.uid,g=gen;
    st.status='sync';emit();
    const remote=await backend.load(uid);
    if(g!==gen)return null;
    const local=sdo.progress();
    let choice='local';
    if(remote){
      const cloud=Object.assign({},remote.d||{},{pt:Number(remote.pt)||0});
      choice=decide(sdo,local,cloud,sdo.linked(),uid);
      if(choice==='cloud'){sdo.apply(remote.d,cloud.pt);}
    }
    if(choice==='local'){await push(true);}
    if(g!==gen)return null;
    lastFp=fingerprint(sdo,sdo.progress());sdo.setLinked(uid,lastFp);
    ready=true;st.status='ok';st.err=null;st.lastOk=Date.now();emit();
    return remote?choice:'new';
  }
  async function flush(){
    if(!st.uid||!ready)return;
    if(busy){again=true;return;}
    busy=true;timers.clear(timer);timer=0;
    try{await push(false);}catch(e){fail(e);}
    finally{busy=false;if(again){again=false;flush();}}
  }
  function schedule(){if(!st.uid||!ready)return;timers.clear(timer);timer=timers.set(flush,delay);}
  async function setUser(uid){
    gen++;ready=false;lastFp=null;timers.clear(timer);timer=0;
    st.uid=uid||null;st.err=null;
    if(!uid){st.status='off';emit();return null;}
    try{return await pull();}catch(e){fail(e);return null;}
  }
  // Al volver a la app o recuperar señal: sube lo pendiente y, si estás en el menú, trae cambios de otro celular.
  async function resync(){
    if(!st.uid||busy)return null;
    try{
      if(ready)await push(false);
      if(sdo.inMenu&&!sdo.inMenu())return null;
      return await pull();
    }catch(e){fail(e);return null;}
  }
  async function wipe(){
    const uid=st.uid;if(!uid)return;
    gen++;ready=false;timers.clear(timer);timer=0;
    await backend.remove(uid);
    lastFp=null;sdo.setLinked('','');
  }
  return {setUser,schedule,flush,resync,wipe,get state(){return Object.assign({},st);},get ready(){return ready;}};
}

export function maskEmail(e){
  if(typeof e!=='string'||e.indexOf('@')<1)return 'tu cuenta';
  const i=e.lastIndexOf('@');return e.slice(0,1)+'***'+e.slice(i);
}
export function ago(t,now=Date.now()){
  if(!t)return '';const s=Math.max(0,(now-t)/1000);
  if(s<60)return 'recién';if(s<3600)return 'hace '+Math.floor(s/60)+' min';
  if(s<86400)return 'hace '+Math.floor(s/3600)+' h';return 'hace '+Math.floor(s/86400)+' d';
}
export function errText(e){
  const c=(e&&e.code)||'',m=String((e&&e.message)||'');
  if(/network|unavailable|offline|Failed to fetch|deadline/i.test(c+' '+m))return 'Sin conexión: se guardará al volver la señal';
  if(c==='auth/unauthorized-domain')return 'Este sitio no está autorizado en Firebase';
  if(c==='auth/operation-not-allowed')return 'El inicio con Google no está habilitado en Firebase';
  if(c==='auth/popup-blocked')return 'El navegador bloqueó la ventana de Google';
  if(/permission-denied|PERMISSION_DENIED/.test(c+' '+m))return 'La nube rechazó el guardado';
  if(c==='auth/user-disabled')return 'Esta cuenta está deshabilitada';
  return 'No se pudo sincronizar';
}
