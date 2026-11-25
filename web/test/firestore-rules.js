// Pruebas de las reglas de Firestore con el emulador:
//   npx firebase emulators:exec --only firestore --project demo-sdo "node --test test/firestore-rules.js"
import test, {before, after, beforeEach} from 'node:test';
import {readFileSync} from 'node:fs';
import {initializeTestEnvironment, assertSucceeds, assertFails} from '@firebase/rules-unit-testing';
import {doc, getDoc, setDoc, deleteDoc, serverTimestamp, collection, getDocs} from 'firebase/firestore';

let env;
const ok = () => ({v: 1, d: {level: 5, best: 7, coins: 120, up: {rec: 2, pow: 1}, stars: {'1': 3, '2': 2}, daily: '20261115'}, pt: Date.now(), t: serverTimestamp()});
before(async () => {
  env = await initializeTestEnvironment({projectId: 'demo-sdo', firestore: {rules: readFileSync('firebase/firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080}});
});
after(async () => { await env.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });

const as = uid => uid ? env.authenticatedContext(uid).firestore() : env.unauthenticatedContext().firestore();

test('el dueño crea, lee, actualiza y borra su partida', async () => {
  const db = as('alice');
  await assertSucceeds(setDoc(doc(db, 'saves/alice'), ok()));
  await assertSucceeds(getDoc(doc(db, 'saves/alice')));
  await assertSucceeds(setDoc(doc(db, 'saves/alice'), {...ok(), d: {...ok().d, level: 6}}));
  await assertSucceeds(deleteDoc(doc(db, 'saves/alice')));
});

test('nadie más puede leer ni escribir la partida de otro', async () => {
  await assertSucceeds(setDoc(doc(as('alice'), 'saves/alice'), ok()));
  await assertFails(getDoc(doc(as('bob'), 'saves/alice')));
  await assertFails(setDoc(doc(as('bob'), 'saves/alice'), ok()));
  await assertFails(deleteDoc(doc(as('bob'), 'saves/alice')));
  await assertFails(getDoc(doc(as(null), 'saves/alice')));
  await assertFails(setDoc(doc(as(null), 'saves/x'), ok()));
});

test('no se puede listar la colección', async () => {
  await assertFails(getDocs(collection(as('alice'), 'saves')));
});

test('rechaza campos extra (p. ej. correo o nombre)', async () => {
  const db = as('alice');
  await assertFails(setDoc(doc(db, 'saves/alice'), {...ok(), email: 'a@b.c'}));
  await assertFails(setDoc(doc(db, 'saves/alice'), {...ok(), d: {...ok().d, name: 'Ana'}}));
});

test('rechaza datos fuera de rango o de otro tipo', async () => {
  const db = as('alice');
  const bad = [
    {d: {...ok().d, level: 0}}, {d: {...ok().d, best: 1000}}, {d: {...ok().d, coins: -1}},
    {d: {...ok().d, level: 2.5}}, {d: {...ok().d, daily: '2026111500'}}, {d: {...ok().d, up: 'x'}},
    {v: 2}, {pt: 'ayer'}, {t: new Date(0)}, {d: {level: 1}},
  ];
  for (const b of bad) await assertFails(setDoc(doc(db, 'saves/alice'), {...ok(), ...b}));
});

test('otras colecciones están cerradas', async () => {
  await assertFails(setDoc(doc(as('alice'), 'ranking/alice'), {x: 1}));
  await assertFails(getDoc(doc(as('alice'), 'ranking/alice')));
});

// ---------- extras del progreso y tablas de leyendas ----------
const lbS = (o = {}) => Object.assign({n: 'ROM', km: 12.5, d: 4, lv: 10, s: Math.round(12.5 * 10 / (10 + 2) * 1000) / 1000, ti: 'b1', t: serverTimestamp()}, o);
const lbE = (o = {}) => Object.assign({n: 'ANA', m: 5200, d: 3, c: 7, lv: 12, s: Math.round(5200 * 12 / (12 + 5) * 1000) / 1000, h: 'elfo', t: serverTimestamp()}, o);

test('la partida acepta el mapa de extras x', async () => {
  const db = as('alice');
  await assertSucceeds(setDoc(doc(db, 'saves/alice'), {...ok(), d: {...ok().d, x: {gems: 12, skin: 'real', gu: ['ent', 'bear']}}}));
  await assertFails(setDoc(doc(db, 'saves/alice'), {...ok(), d: {...ok().d, x: 'texto'}}));
});

test('tabla Sendero: cada jugador escribe solo su fila y cualquiera con sesión la lee', async () => {
  await assertSucceeds(setDoc(doc(as('alice'), 'lb_sendero/alice'), lbS()));
  await assertFails(setDoc(doc(as('bob'), 'lb_sendero/alice'), lbS()));
  await assertSucceeds(getDocs(collection(as('bob'), 'lb_sendero')));
  await assertFails(getDocs(collection(as(null), 'lb_sendero')));
});

test('tabla Sendero: rechaza puntaje inventado, iniciales raras y distancia imposible', async () => {
  const db = as('alice');
  await assertFails(setDoc(doc(db, 'lb_sendero/alice'), lbS({s: 99})));
  await assertFails(setDoc(doc(db, 'lb_sendero/alice'), lbS({n: 'ab1'})));
  await assertFails(setDoc(doc(db, 'lb_sendero/alice'), lbS({km: 900, s: Math.round(900 * 10 / 12 * 1000) / 1000})));
  await assertFails(setDoc(doc(db, 'lb_sendero/alice'), lbS({email: 'x@y.z'})));
  await assertSucceeds(setDoc(doc(db, 'lb_sendero/alice'), lbS({lv: 0, d: 0, km: 0.5, s: 0})));
});

test('tabla Sendero: las muertes no se pueden borrar reescribiendo la fila', async () => {
  const db = as('alice');
  await assertSucceeds(setDoc(doc(db, 'lb_sendero/alice'), lbS()));
  await assertFails(setDoc(doc(db, 'lb_sendero/alice'), lbS({d: 0, s: 12.5})));
});

test('tabla Escalada: valida metros, caídas y puntaje', async () => {
  const db = as('alice');
  await assertSucceeds(setDoc(doc(db, 'lb_escalada/alice'), lbE()));
  await assertFails(setDoc(doc(as('bob'), 'lb_escalada/alice'), lbE()));
  await assertFails(setDoc(doc(db, 'lb_escalada/bob'), lbE()));
  await assertFails(setDoc(doc(as('carl'), 'lb_escalada/carl'), lbE({s: 9999})));
  await assertFails(setDoc(doc(as('carl'), 'lb_escalada/carl'), lbE({lv: 80})));
});

test('Escalada: la partida acepta héroes, gemas gastadas y estadísticas', async () => {
  const base = {unlocked: 12, best: {}, cloak: 1, story: {}, bossDone: {ent: 1}, seenCloak: {}, hearts: 1, lev: 0};
  const db = as('alice');
  await assertSucceeds(setDoc(doc(db, 'escalada/alice'), {v: 1, pt: 5, t: serverTimestamp(), d: base}));
  await assertSucceeds(setDoc(doc(db, 'escalada/alice'), {v: 1, pt: 6, t: serverTimestamp(), d: {...base, hid: 'elfo', heroes: ['arquera', 'elfo'], gspent: 10, st: {d: 3, c: 9}}}));
  await assertFails(setDoc(doc(db, 'escalada/alice'), {v: 1, pt: 7, t: serverTimestamp(), d: {...base, gspent: 99999}}));
});
