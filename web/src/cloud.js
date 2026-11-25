// Entrada de producción: Firebase Auth (Google) + Firestore Lite.
// Documento por jugador: saves/{uid} = {v, d:{progreso}, pt, t}. Sin nombre ni correo en la base.
import {initializeApp} from 'firebase/app';
import {getAuth,GoogleAuthProvider,signInWithPopup,signInWithRedirect,getRedirectResult,onAuthStateChanged,signOut,deleteUser,reauthenticateWithPopup} from 'firebase/auth';
import {getFirestore,doc,getDoc,setDoc,deleteDoc,serverTimestamp} from 'firebase/firestore/lite';
import {mountCloud} from './cloud-ui.js';
import {mountLeaderboard} from './leaderboard.js';

const CFG=window.SDO_FIREBASE;
const configured=c=>!!c&&typeof c==='object'&&/^AIza[0-9A-Za-z_-]{20,}$/.test(c.apiKey||'')&&/^[a-z0-9-]{4,40}$/.test(c.projectId||'')&&typeof c.appId==='string'&&c.appId.length>5;

function start(){
  const host=location.hostname;
  const authDomain=/\.(web\.app|firebaseapp\.com)$/.test(host)?host:(CFG.authDomain||CFG.projectId+'.firebaseapp.com');
  const app=initializeApp({apiKey:CFG.apiKey,authDomain,projectId:CFG.projectId,appId:CFG.appId,messagingSenderId:CFG.messagingSenderId});
  const auth=getAuth(app);auth.languageCode='es';
  const db=getFirestore(app);
  const prov=new GoogleAuthProvider();prov.setCustomParameters({prompt:'select_account'});

  const backend={
    async load(uid){const s=await getDoc(doc(db,'saves',uid));if(!s.exists())return null;const x=s.data()||{};return {d:x.d||{},pt:Number(x.pt)||0};},
    async save(uid,{d,pt}){await setDoc(doc(db,'saves',uid),{v:1,d,pt,t:serverTimestamp()});},
    async remove(uid){await deleteDoc(doc(db,'saves',uid));}
  };
  const api={
    onChange:cb=>onAuthStateChanged(auth,cb),
    async login(){
      try{await signInWithPopup(auth,prov);}
      catch(e){
        // Si el navegador no permite ventanas emergentes, se usa redirección.
        if(e&&['auth/popup-blocked','auth/operation-not-supported-in-this-environment'].includes(e.code)){await signInWithRedirect(auth,prov);return;}
        throw e;
      }
    },
    logout:()=>signOut(auth),
    async remove(){
      const u=auth.currentUser;if(!u)return true;
      try{await deleteUser(u);return true;}
      catch(e){
        if(e&&e.code==='auth/requires-recent-login'){
          try{await reauthenticateWithPopup(u,prov);await deleteUser(u);return true;}catch(e2){}
        }
        await signOut(auth);return false;
      }
    }
  };
  getRedirectResult(auth).catch(e=>{if(window.SDO)window.SDO.toast('No se pudo iniciar sesión con Google',3200);});
  mountCloud({sdo:window.SDO,auth:api,backend});
  mountLeaderboard({auth,db,coll:'lb_sendero',fields:['n','km','d','lv','s','ti']});
}

if(window.SDO&&configured(CFG))start();
