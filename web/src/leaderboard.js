// Tabla global de puntuaciones (Firestore Lite). Un documento por jugador: <coleccion>/{uid}.
// Solo guarda 3 letras, cifras de juego y un título; nada personal. Si no hay sesión de Google,
// se usa una sesión anónima de Firebase (hay que habilitar "Anónimo" en Authentication).
import {signInAnonymously} from 'firebase/auth';
import {doc,getDoc,setDoc,collection,query,orderBy,limit,getDocs,where,getCount,serverTimestamp} from 'firebase/firestore/lite';

export function mountLeaderboard({auth,db,coll,fields,globalName}){
  let lastPost=0;
  async function user(){if(auth.currentUser)return auth.currentUser;const r=await signInAnonymously(auth);return r.user;}
  const api={
    ready:()=>true,
    async post(e){const now=Date.now();if(now-lastPost<16000)return false;
      const u=await user();const data={};for(const k of fields)data[k]=e[k];data.t=serverTimestamp();
      await setDoc(doc(db,coll,u.uid),data);lastPost=now;return true;},
    async top(field,dir,n){await user();const q=query(collection(db,coll),orderBy(field,dir==='asc'?'asc':'desc'),limit(n||50));
      const s=await getDocs(q),me=auth.currentUser&&auth.currentUser.uid;return s.docs.map(d=>Object.assign({me:d.id===me},d.data()));},
    async mine(){const u=await user();const s=await getDoc(doc(db,coll,u.uid));return s.exists()?s.data():null;},
    async rank(field,dir,val){await user();const q=query(collection(db,coll),where(field,dir==='asc'?'<':'>',val));const c=await getCount(q);return c.data().count+1;}
  };
  window[globalName||'SDO_LB']=Object.freeze(api);
  try{window.dispatchEvent(new Event((globalName||'SDO_LB').toLowerCase()));}catch(e){}
}
