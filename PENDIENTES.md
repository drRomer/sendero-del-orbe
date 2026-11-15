# Legión del Bosque — pendientes (aplicar juntos cuando Tomás lo indique)

Origen: guía de Gemini (2026-11-15). Tomar las IDEAS, no las matrices literales (5 de 15 tienen filas desparejas o letras sin color; son cuadros únicos y más chicos).
1. Ent: brazos separados en diagonal, postura encorvada, ojos brillantes, raíces definidas.
2. Demonio: cuerpo hueso/ceniza con grietas, cuernos rojos enormes, hombros anchos (los diablillos quedan rojos para distinguirse).
3. Troll: cabeza hundida entre hombros, pelo, líneas de músculo.
4. Nigromante: capucha con borde dorado, costillas y piernas de hueso bajo la túnica, báculo con medialuna.
5. Gólem de lava con más grietas; variante de orco con casco metálico.
6. Íconos de tienda en marco biselado (claro arriba/izquierda #8c7a6b, oscuro abajo/derecha #26191c).
7. Contraste: camino más oscuro de noche y en tierras malditas; sombras largas en el ocaso; ceniza cayendo + niebla baja en tierras malditas.
Descartado (salvo que lo pida): dragón naranjo (se pierde contra el cielo del ocaso), pasto marrón en el ocaso, texto con fuente monospace (la fuente pixel propia es más nítida), halo de antorcha de 38 px (enorme a baja resolución).

- [hecho] 6. Íconos de tienda con marco.
- [hecho] Rediseño de todos los personajes con volumen (v 1794714612-8749).
- [hecho] 7. Caminos más oscuros, sombras largas en el ocaso, ceniza y niebla baja (v 1794715680-cd35).
- [hecho] Dragón negro amenazante (cuadrúpedo, fauces con fuego).

## Dinamismo y dificultad (Tomás aprobó todas las ideas, 2026-11-15 madrugada) — aplicar juntas
Diagnóstico desde el código: MAX_SQUAD=120 se alcanza a mitad de nivel (×2 y +N generosos); nivel corto (L=250+16·lv ≈ 37-50 s); jefe con un solo ataque (onda de 3,1 de ancho avisada 0,9 s, fácil de esquivar) y solo mata si llega a tocar al escuadrón; tener muchas tropas no tiene ningún costo.
1. Cartas de bendición 1 de 3 al abrir cofre / superar horda (flechas que atraviesan, rebote, lluvia de fuego, oro ×2 con enemigos más fuertes…).
2. Bifurcaciones del camino (sendero con cofres y trampas vs. ruta de batalla con más oro).
3. Portales con riesgo: ruleta, móviles, maldito (×2 tropas / jefe +30 % vida).
4. Obstáculos: troncos/rocas rodando por carril, pinchos, puente angosto sobre río.
5. Enemigos con rol: chamán orco que cura, escuderos (bloquean flechas de frente, solo magia), arpías por los costados, nigromante menor.
6. Emboscadas por los lados/atrás.
7. Jefes con mecánica y fase al 50 %: troll lanza rocas; dragón barre fuego y alza vuelo; nigromante con escudo ligado a esqueletos; demonio abre grietas de lava.
8. Tropas nuevas desde portales (caballeros, druidas, catapulta) y sinergias (10 magos = hechizo grande).
9. Director de ritmo (calma/oleada según tamaño del escuadrón); misiones 3 estrellas, desafío diario, modo infinito.
10. Niveles más largos por tramos (≈2 min) con miniboss a mitad.
11. Reserva de tropas: sobre 120 van a reserva ("120 +38"), reponen bajas automáticamente; la reserva sobrante se paga en oro al final.
12. Dificultad real: ataques del jefe que quitan 15-25 % de tropas, varios ataques + enfurecimiento; hordas que escalan con el escuadrón; un revivir pagado en el jefe (porque el nivel es más largo).

## Progresión de jefes (propuesta 2026-11-15, esperando visto bueno)
Diseños en px2/bosses10.js (+ dragon10 con t). Tramos de 2 niveles: t0 sin arma → t1 arma → t2 +pechera → t3 +casco → t4 +aura.
1-10 Troll · 11-20 Nigromante · 21-30 Dragón negro · 31-40 Demonio · 41-50 Juez Dictador (original, no copia a Pinhead) · 51-59 Guardián del Orbe (muta cada 2 niveles, 5 formas) · 60 Caos Regente (final).
Habilidades acumulativas por tramo (ver mensaje a Tomás). Ambiente sugerido por bloque: bosque, noche, ocaso, tierras malditas, tribunal infernal, santuario del orbe, el vacío.
- [aprobado] Ambientes por bloque de 10 y diseños de troll, nigromante, dragón, demonio, juez y Caos.
- Guardián del Orbe v2 (guardian11 + eggFx/eggClose en px2/bosses10.js): carcelero de sombra con máscara de hueso que custodia el Huevo del Caos. 4 sellos encadenan el huevo; cada forma rompe uno y el huevo se agrieta; en la forma 5 (niv 59) el huevo flota libre. Al vencerlo el huevo eclosiona y el nivel 60 es el Caos Regente. Esperando visto bueno.
- [hecho] Dinamismo 1-12, progresión de jefes 60 niveles, ambientes por bloque, guardián v2 (v 1794722186-b9ee).
- Próximo (Tomás): agregar historia.

## Dificultad (Tomás, nivel 22: "se sigue sintiendo fácil"; 3 portales seguidos que solo suman antes del jefe)
Causa en genLevel: el par final es pos() vs bigOrMul() (dos positivos), el relleno tiene pair(unitG(),pos()) y el maldito es ×2 vs pos(): pueden caer 3 pares sin riesgo al final.
Propuesta:
1. Todo par con costo: nunca dos positivos. Par final = dilema (mucho con trampa vs poco seguro).
2. Portales de trueque: "+6 caballeros / −15 arqueros".
3. Negativos en % del total (−25/−35 %, ÷2) para que con 120+reserva duelan.
4. Reserva máx. 200 → 60.
5. Último tramo antes del jefe = horda fuerte con élite, no portales gratis.
6. Jefes de mitad de juego algo más duros (vida +30 %, furia a los 35 s).
7. "Tropa de élite" en vez de caudillo: 3 caudillos juntos.
8. Bifurcación: los letreros SENDERO / BATALLA se superponen (de lejos se proyectan juntos y chocan con el aviso). Un solo letrero centrado "◀ SENDERO · BATALLA ▶".
9. Ent muy fácil de liberar: más vida del cristal / ventana más corta.
10. Guardianes alternados como el Ent: jauría de lobos y hipogrifo o pegaso (cada uno con su forma de liberarlo y de pelear).
11. Versión cósmica de los guardianes (desde el 51): lobos → sabuesos espirituales; Ent → antiguo errante; hipogrifo → pegaso.
- [hecho] Dificultad 1-9 (v 1794725586-c2e5). [listo, apagado] Guardianes alternados: esperando visto bueno de los diseños (GUARD_ROT).
- [hecho] Guardianes alternados activos y logo Sendero del Orbe (v 1794731094-1916).
- Próximo: historia de Cuentos del Medioevo (Sendero del Orbe = 1.ª entrega).
