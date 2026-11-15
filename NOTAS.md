# Legión del Bosque — notas de desarrollo
- Artefacto: slug 8ad6f4dc-4880-4efd-a921-22b6cbc4aad1 · versión 1794745895-d8be
- Fuente: game.js se genera con `python3 assemble.py` (motor de Brigada + parts/*.js); sprites en sprites8.js; HTML en shell.html; `python3 build.py [--publish]`.
- Render a baja resolución (PIX = round(ancho/200), mínimo 2) con image-rendering:pixelated; textos del mundo con fuente 5x7 propia.
- Tropas: v 0..4 arqueros (3 colores), v 5 mago (dispara orbes). Enemigos: 3 orcos, 2 espíritus (corredores), 2 gólems (pesados). Aliado: Ent. Jefe: Demonio.
- Paletas: Bosque Viejo, Ocaso Dorado, Noche de Luna, Tierras Malditas (ciclan por nivel).
- Pruebas: tests/bot.py <nivel> <prefijo> (capturas en /home/claude/shots), tests/pubcheck.py.
- v2 (2026-11-15): jefes por tierra (Troll, Dragón, Nigromante, Demonio) con castillo detrás; enemigos por tierra (PALS[i].en: n/r/h; 5=goblin arquero que dispara G.eb); magos con daño en área y portales de magos (gt.mg); estallido en píxeles (S.pc); pausa de impacto (G.hs); monedas al contador (CF); clima por tierra; nubes móviles (CLOUDC); filtro retro (#crt, save.crt); íconos pixelados; música por tierra + jefe (TRACKS/BOSS_TRACK).

## Personajes v2 (pintor de volumen)
- sprites9.js = px2/pxr9_part.js (PXR con escala sc) + px2/chars9.js (todos los personajes). Se regenera con el script del commit: concatenar ambos.
- sprites8.js queda para utilería del escenario e íconos (S8.icons()); los íconos de tienda llevan marco de piedra en parts/sprites.js.
- Vista previa: px2/preview9.html + px2/prev9.py <salida.png>.
- Alturas: tropa 1.12, orcos 1.1, gólems 2.25, jefes kl=10.4.
- Dragón negro: px2/dragon10.js (cuadrúpedo, lienzo 104x94 con DY=6, textura 'scale' en PXR). sprites9.js = pxr9_part + chars9 + dragon10.
- Ambientes (parts/features.js): drawEnvGround() tras drawGroundFx → ocaso: drawLongShadows (DX=.85, DZ=-1, L=min(h*2.2,9)); tierras malditas: drawLowFog + drawAsh (dentro de drawWeather). Caminos de noche y malditos oscurecidos en PALS.

## V3 (1794745895-d8be): 60 niveles y sistemas nuevos
- Código: parts/v3a.js (progresión, escena, generación por tramos, tropas, reserva, cartas, eventos, enemigos con rol), v3b.js (jefes, peligros, bucle, revivir, pantallas), v3c.js (dibujo). assemble.py los inserta antes de `function boot(){`; las funciones redefinidas reemplazan a las viejas por hoisting.
- Sprites: px2/units10.js (caballero, druida, catapulta, chamán, escudero, arpía, nigromante menor, caudillo, tronco, roca, utilería tribunal/cósmica, íconos) y bosses10.js (troll10, lich10, demon10, judge10, guardian11+eggFx, chaos10) + dragon10 con tier. Jefes se construyen al entrar al nivel (bossSheets, caché).
- Bloques: blockOf/tierOf; ENVB=[bosque,noche,ocaso,malditas,tribunal,santuario,vacío]; lv>60 modo infinito.
- Curvas: hpScale=1+.16l+.0015l²; zhp=34·hs^.8; golem 330·hs^.85; jefe 20000·hs^1.2·(1+.12t)·(1+.1b).
- Pruebas: tests/bot3.py <nivel> <prefijo> [rev] (esquiva peligros, elige cartas, prueba revivir).
- Bug corregido: precedencia en g.cmp (formación que se abría en el puente).

## Dificultad + guardianes (1794745895-d8be)
- Portales: ningún par sin costo; 'pct' (−25/−35 %, disparar lo reduce), 'trade' (+unidades −tropas), par final dilema (ruleta vs poco seguro) + horda final 'gaunt' en L-70. RES_MAX=60. Jefe ×1.3 (26000·…), furia a los 35 s. Guardián ×1.9 de vida. Tropa de élite = 3 caudillos (G.eliteLeft). Letrero único de bifurcación.
- Guardianes alternados (parts/v3d.js + px2/guard10.js): ent/wolves/griffin por (lv-1)%3; cósmico (env cosmo/void) = errante/sabuesos/pegaso. APAGADO con GUARD_ROT=false hasta el visto bueno de Tomás; al aprobar: GUARD_ROT=true, rebuild, probar 2/3/53/54, publicar.
- bot3 ahora usa la MAGIA cuando hay horda o jefe.

## Sendero del Orbe (1794745895-d8be)
- Nuevo título: "Cuentos del Medioevo · Sendero del Orbe · Primera entrega" (logo de Tomás). assets/logo.webp (fondo quitado, 572x656, "PRIMERA ENTREGA" aclarado); build.py lo incrusta en lugar de __LOGO__. Artifact renombrado.
- #menu con justify-content:flex-start + márgenes auto (el menú se desplaza sin cortar el logo).
- GUARD_ROT=true: guardianes alternados activos.
- SAVE_KEY se mantiene (no se pierde el progreso).

## Pantallas (1794745895-d8be)
- parts/v3e.js: titleScr (logo grande animado + PULSA PARA EMPEZAR) → mainScr (JUGAR / OPCIONES / SALIR) → menu (mejoras + JUGAR · NIVEL X, botón VOLVER).
- optScr: música y efectos (canales AU.mus / AU.fx; musTick usa AU.bus), sonido, vibración (buzz respeta save.vib), filtro retro, calidad (resize con QUAL normal/alta/baja), cómo jugar, borrar progreso (confirmación).
- Salir: confirmación → Capacitor App.exitApp / navigator.app.exitApp / window.close; si el navegador no deja cerrar, muestra byeScr. boot() llama toTitle() (rep en assemble).
- Pruebas: bot3/pubcheck navegan titleScr → bMainPlay → bPlay.

## Versión web propia (PWA + nube) — build_web.py → docs/
- Repo pensado para GitHub Pages (main /docs) en tomispongge/sendero-del-orbe. base/game_v2.js vendorizado (assemble.py ya no depende de /home/claude/game).
- parts/v3f.js: persist() marca save.pt solo si cambia el progreso (no las opciones); save.cu/save.cb = uid vinculado + huella base. window.SDO (progress/apply/clean/rank/linked/setLinked/onChange/toast/confirm). Toast #toast. Botón INSTALAR (beforeinstallprompt / guía iOS). Pantalla completa al pulsar el título en celular (solo web).
- web/src: cloud-core.js (mezcla a 3 vías: base=huella del último sync; primera vez gana el más avanzado [best, estrellas, mejoras, monedas]; no aplica nube en partida), cloud-ui.js (Opciones: Google/Salir, correo enmascarado, Borrar datos nube = deleteDoc + deleteUser), cloud.js (Firebase Auth popup→redirect + Firestore Lite), cloud-fake.js (solo pruebas).
- Firestore: saves/{uid} = {v:1, d:{level,best,coins,up,stars,daily}, pt, t:serverTimestamp}. Reglas en web/firebase/firestore.rules (dueño únicamente, campos y rangos validados, resto cerrado). Sin nombre ni correo.
- PWA: manifest (fullscreen, vertical), sw.js (HTML/config red primero con respaldo a 3,5 s; resto caché), fuentes locales (fontsource), íconos desde el logo, privacidad.html. CSP con hash de los 2 scripts en línea + apis.google.com para Auth.
- Pruebas: web `npm test` (11 unitarias), reglas con emulador (6), tests/webcheck.py docs [fake] (SW, offline, CSP, partida, nube simulada entre 2 "celulares").
