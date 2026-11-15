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
