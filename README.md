# Sendero del Orbe · Cuentos del Medioevo

Runner medieval 8-bit en HTML5 Canvas. Primera entrega de la saga *Cuentos del Medioevo*.

**Jugar:** https://tomispongge.github.io/sendero-del-orbe/ — se instala como app desde el navegador, funciona sin conexión y puede guardar el progreso en la nube con Google.

## Estructura

| Ruta | Qué es |
|---|---|
| `base/game_v2.js` | Motor base |
| `parts/` | Capas del juego: progresión y tropas (`v3a`), jefes (`v3b`), dibujo (`v3c`), guardianes (`v3d`), menús (`v3e`), guardado web (`v3f`) |
| `px2/`, `sprites8.js` | Sprites pixel-art generados por código |
| `shell.html` | HTML y CSS de las pantallas |
| `web/` | Versión web: `src/` nube, `static/` PWA, `firebase/` reglas, `test/` pruebas |
| `docs/` | Sitio publicado en GitHub Pages (generado, no editar a mano) |
| `tests/` | Pruebas en navegador (Playwright) |

## Construir

```bash
python3 assemble.py            # parts/ → game.js
python3 build.py --publish     # index.html de una sola pieza (artifact de claude.ai)
(cd web && npm ci)             # Firebase, fuentes y esbuild
python3 build_web.py           # docs/ para GitHub Pages
```

## Probar

```bash
(cd web && npm test)                                    # sincronización (unitarias)
(cd web && npm run test:rules)                          # reglas de Firestore con emulador (requiere Java)
python3 tests/webcheck.py docs                          # PWA: service worker, sin conexión, CSP, partida
python3 build_web.py --fake-cloud --out /tmp/sitio && python3 tests/webcheck.py /tmp/sitio fake
```

## Publicar

GitHub → *Settings* → *Pages* → *Deploy from a branch* → `main` / `/docs`. Cada push a `main` publica.

## Guardado en la nube (Firebase)

1. Crear un proyecto en Firebase y habilitar **Authentication → Google**. En *Dominios autorizados*, agregar `tomispongge.github.io`.
2. Crear **Firestore** en modo producción y publicar las reglas de `web/firebase/firestore.rules`.
3. Registrar una app web y pegar su `firebaseConfig` en `web/static/config.js`. Luego ejecutar `python3 build_web.py`.

Sin configuración, el juego funciona igual, con guardado local.

Datos guardados: un documento `saves/{uid}` con `{v, d:{level, best, coins, up, stars, daily}, pt, t}`. **No** se guarda nombre ni correo en la base. Firebase Authentication conserva el correo de la cuenta Google, solo para el inicio de sesión.

## Seguridad y privacidad

- **Política de seguridad (CSP) estricta:**
  - Solo se ejecutan los scripts del propio sitio y Google Auth.
  - Los scripts en línea se autorizan por hash.
  - Sin `eval`.
- **Recursos locales:**
  - Fuentes alojadas en el sitio (sin Google Fonts).
  - Sin analítica ni anuncios.
- **Reglas de Firestore:**
  - Solo el dueño lee o escribe su documento.
  - Los campos y rangos se validan.
  - Todo lo demás está cerrado.
  - Se prueban con el emulador.
- **Sincronización:**
  - Mezcla a 3 vías: la base es el último estado sincronizado, así que no depende del reloj del celular.
  - La primera vez en un celular gana la partida más avanzada.
  - Nunca cambia el progreso en mitad de una partida.
- **Borrar datos:**
  - "Borrar datos nube" en Opciones elimina el documento y la cuenta de Firebase.
  - Página de privacidad: `docs/privacidad.html`.
