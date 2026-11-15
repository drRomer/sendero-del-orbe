// Interfaz de la nube en Opciones. Recibe un adaptador de autenticación
// {onChange(cb), login(), logout(), remove()->bool} y un backend de datos.
// No guarda ni muestra datos personales salvo el correo enmascarado en pantalla.
import {createSync,maskEmail,ago,errText} from './cloud-core.js';

const CANCEL=['auth/popup-closed-by-user','auth/cancelled-popup-request','auth/user-cancelled'];

export function mountCloud({sdo,auth,backend,doc=document,win=window}){
  const $=id=>doc.getElementById(id);
  const box=$('cloudBox'),btn=$('bCloud'),info=$('cloudInfo'),del=$('bCloudDel');
  if(!sdo||!box||!btn||!info||!del)return null;
  box.classList.remove('hidden');
  let user=null,st={status:'off'},working=false,opening=false;

  const sync=createSync({sdo,backend,onState:s=>{st=s;render();}});
  sdo.onChange(()=>sync.schedule());

  function say(text,cls){info.className='cloudInfo'+(cls?' '+cls:'');info.textContent=text;}
  function render(){
    if(working)return;
    if(!user){btn.textContent='Google';del.classList.add('hidden');
      say('Guarda tu avance en tu cuenta Google y sigue en otro celular.');return;}
    btn.textContent='Salir';del.classList.remove('hidden');
    const who=maskEmail(user.email);
    if(st.status==='sync')say('Sincronizando · '+who);
    else if(st.status==='err')say(errText(st.err)+' · '+who,'err');
    else say('Conectado: '+who+(st.lastOk?' · guardado '+ago(st.lastOk):''),'ok');
  }
  function report(choice){
    if(choice==='cloud')sdo.toast('Progreso recuperado de la nube · nivel '+sdo.progress().level,3200);
    else if(choice==='new')sdo.toast('Tu progreso quedó respaldado en la nube',3000);
  }

  auth.onChange(async u=>{
    user=u?{uid:String(u.uid),email:u.email||''}:null;render();
    report(await sync.setUser(user&&user.uid));render();
  });

  btn.addEventListener('click',async()=>{
    sdo.click();
    if(user){sdo.confirm('¿CERRAR SESIÓN DE LA NUBE?','Tu progreso sigue guardado en este celular.',async()=>{
      try{await sync.flush();}catch(e){}
      try{await auth.logout();}catch(e){sdo.toast(errText(e));}
    },'SALIR','CANCELAR');return;}
    working=opening=true;say('Abriendo Google…');
    try{await auth.login();}
    catch(e){if(!CANCEL.includes(e&&e.code)){working=opening=false;render();say(errText(e),'err');return;}}
    working=opening=false;render();
  });

  del.addEventListener('click',()=>{
    sdo.click();
    sdo.confirm('¿BORRAR TUS DATOS DE LA NUBE?','Se elimina tu copia en la nube y tu cuenta del juego. El progreso de este celular se mantiene.',async()=>{
      working=true;say('Borrando…');
      try{await sync.wipe();const full=await auth.remove();
        sdo.toast(full?'Tus datos de la nube fueron eliminados':'Copia eliminada. Para cerrar la cuenta, entra de nuevo y repite.',3800);}
      catch(e){sdo.toast(errText(e),3600);}
      working=false;render();
    },'BORRAR','CANCELAR');
  });

  const again=async()=>{if(user)report(await sync.resync());};
  // Si cierras la ventana de Google sin entrar, Firebase tarda ~10 s en avisar (Google bloquea window.closed):
  // al volver al juego se libera el botón antes.
  win.addEventListener('focus',()=>{if(opening)win.setTimeout(()=>{if(opening){working=opening=false;render();}},1500);});
  win.addEventListener('online',again);
  doc.addEventListener('visibilitychange',()=>{if(doc.visibilityState==='hidden')sync.flush();else again();});
  win.addEventListener('pagehide',()=>sync.flush());
  win.setInterval(()=>{if(user&&st.status==='ok')render();},30000);
  return {sync,render};
}
