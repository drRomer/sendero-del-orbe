#!/usr/bin/env python3
"""Genera la versión web (PWA) del juego en docs/, lista para GitHub Pages.

Uso:
    python3 assemble.py              # parts/ → game.js
    python3 build_web.py             # → docs/  (producción)
    python3 build_web.py --fake-cloud --out /tmp/sitio   # nube simulada, solo pruebas

Requiere: cd web && npm ci   (Firebase, fuentes y esbuild)
"""
import os, re, sys, json, hashlib, base64, shutil, subprocess, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from build import compose

SITE = os.environ.get('SDO_SITE_URL', 'https://drromer.github.io/sendero-del-orbe/')
REPO = os.environ.get('SDO_REPO_URL', 'https://github.com/drRomer/sendero-del-orbe')
WEB = os.path.join(HERE, 'web')
STATIC = os.path.join(WEB, 'static')
FAKE = '--fake-cloud' in sys.argv
OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else os.path.join(HERE, 'docs')
FONTS = {
    'press-start-2p.woff2': 'node_modules/@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2',
    'vt323.woff2': 'node_modules/@fontsource/vt323/files/vt323-latin-400-normal.woff2',
}
DESC = 'Runner medieval 8-bit: guía a tu legión por el Sendero del Orbe, libera guardianes y derrota a los jefes. Sin anuncios.'


def sha(b): return hashlib.sha256(b).hexdigest()
def b64sha(s): return base64.b64encode(hashlib.sha256(s.encode('utf-8')).digest()).decode()
def must(cond, msg):
    if not cond: sys.exit('build_web: ' + msg)


def bundle():
    entry = 'src/cloud-fake.js' if FAKE else 'src/cloud.js'
    out = os.path.join(WEB, 'dist', 'cloud.js')
    cmd = ['npx', '--no-install', 'esbuild', entry, '--bundle', '--format=esm', '--target=es2019',
           '--legal-comments=none', '--outfile=' + out] + ([] if FAKE else ['--minify'])
    subprocess.run(cmd, cwd=WEB, check=True, capture_output=True)
    return open(out, 'rb').read()


def main():
    must(os.path.isdir(os.path.join(WEB, 'node_modules')), 'falta web/node_modules (ejecuta: cd web && npm ci)')
    html = compose(pub=True)
    cloud = bundle()
    today = datetime.date.today()
    build = today.strftime('%Y%m%d') + '-' + sha(html.encode() + cloud + open(os.path.join(STATIC, 'sw.js'), 'rb').read())[:6]

    # 1) Fuentes locales en vez de Google Fonts (funciona sin conexión y no expone la IP a terceros).
    gf = re.compile(r'<link rel="preconnect" href="https://fonts\.googleapis\.com">\n<link rel="preconnect" href="https://fonts\.gstatic\.com" crossorigin>\n<link href="https://fonts\.googleapis\.com/css2[^"]*" rel="stylesheet">\n')
    must(len(gf.findall(html)) == 1, 'no se encontró el bloque de Google Fonts en shell.html')
    html = gf.sub('<style>@font-face{font-family:\'Press Start 2P\';src:url(fonts/press-start-2p.woff2) format(\'woff2\');font-display:swap}'
                  '@font-face{font-family:\'VT323\';src:url(fonts/vt323.woff2) format(\'woff2\');font-display:swap}</style>\n', html)

    # 2) Metadatos de app, íconos y vista previa al compartir.
    meta = '\n'.join([
        '<meta http-equiv="Content-Security-Policy" content="__CSP__">',
        '<meta name="referrer" content="strict-origin-when-cross-origin">',
        f'<meta name="description" content="{DESC}">',
        '<link rel="manifest" href="manifest.webmanifest">',
        '<link rel="icon" type="image/png" href="icons/favicon-64.png">',
        '<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">',
        '<meta name="mobile-web-app-capable" content="yes">',
        '<meta name="apple-mobile-web-app-capable" content="yes">',
        '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
        '<meta name="apple-mobile-web-app-title" content="Sendero del Orbe">',
        '<meta property="og:type" content="website">',
        '<meta property="og:title" content="Sendero del Orbe · Cuentos del Medioevo">',
        f'<meta property="og:description" content="{DESC}">',
        f'<meta property="og:url" content="{SITE}">',
        f'<meta property="og:image" content="{SITE}og.jpg">',
        '<meta name="twitter:card" content="summary_large_image">',
    ])
    anchor = '<meta name="theme-color" content="#120c18">'
    must(html.count(anchor) == 1, 'falta theme-color en shell.html')
    html = html.replace(anchor, anchor + '\n' + meta, 1)

    # 3) Scripts externos: config + arranque web antes del juego; módulo de nube al final.
    first = html.index('<script>\n')
    html = html[:first] + '<script src="config.js"></script>\n<script src="web.js?v=' + build + '"></script>\n' + html[first:]
    end = html.rindex('</body>')
    html = html[:end] + '<script type="module" src="cloud.js?v=' + build + '"></script>\n' + html[end:]

    # 4) Versión visible en Opciones (para soporte).
    ver = '<div class="ver">Cuentos del Medioevo · Sendero del Orbe · Primera entrega</div>'
    must(html.count(ver) == 1, 'no se encontró la línea de versión en Opciones')
    html = html.replace(ver, ver.replace('Primera entrega</div>', 'Primera entrega · v' + build + '</div>'), 1)

    # 5) CSP con hash de cada script en línea: nada que no venga de este sitio o de Google Auth se ejecuta.
    inline = re.findall(r'<script>(.*?)</script>', html, flags=re.S)
    must(len(inline) == 2, f'se esperaban 2 scripts en línea, hay {len(inline)}')
    csp = '; '.join([
        "default-src 'self'",
        "script-src 'self' " + ' '.join(f"'sha256-{b64sha(s)}'" for s in inline) + ' https://apis.google.com',
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https://*.googleusercontent.com",
        "font-src 'self'",
        "connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com",
        "frame-src https://*.firebaseapp.com https://*.web.app https://accounts.google.com https://apis.google.com",
        "worker-src 'self'", "manifest-src 'self'", "media-src 'self' data: blob:",
        "object-src 'none'", "base-uri 'self'", "form-action 'none'",
    ])
    html = html.replace('__CSP__', csp, 1)

    # 6) Escribir el sitio.
    if os.path.isdir(OUT):
        for n in os.listdir(OUT):
            p = os.path.join(OUT, n)
            shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
    os.makedirs(os.path.join(OUT, 'fonts'), exist_ok=True)
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(html)
    open(os.path.join(OUT, 'cloud.js'), 'wb').write(cloud)
    for n in ['config.js', 'web.js', 'og.jpg']:
        shutil.copy(os.path.join(STATIC, n), os.path.join(OUT, n))
    shutil.copytree(os.path.join(STATIC, 'icons'), os.path.join(OUT, 'icons'))
    for n, src in FONTS.items():
        shutil.copy(os.path.join(WEB, src), os.path.join(OUT, 'fonts', n))
    priv = open(os.path.join(STATIC, 'privacidad.html'), encoding='utf-8').read()
    priv = priv.replace('__UPDATED__', today.strftime('%d-%m-%Y')).replace('__REPO__', REPO)
    open(os.path.join(OUT, 'privacidad.html'), 'w', encoding='utf-8').write(priv)
    manifest = {
        'id': './', 'name': 'Sendero del Orbe · Cuentos del Medioevo', 'short_name': 'Sendero del Orbe',
        'description': DESC, 'lang': 'es-CL', 'dir': 'ltr', 'categories': ['games'],
        'start_url': './?src=app', 'scope': './',
        'display': 'fullscreen', 'display_override': ['fullscreen', 'standalone'], 'orientation': 'portrait',
        'background_color': '#120c18', 'theme_color': '#120c18',
        'icons': [
            {'src': 'icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'any'},
            {'src': 'icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any'},
            {'src': 'icons/maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'},
        ],
    }
    open(os.path.join(OUT, 'manifest.webmanifest'), 'w', encoding='utf-8').write(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    pre = ['./', 'index.html', 'config.js', 'web.js?v=' + build, 'cloud.js?v=' + build, 'manifest.webmanifest',
           'fonts/press-start-2p.woff2', 'fonts/vt323.woff2', 'icons/icon-192.png', 'icons/icon-512.png',
           'icons/favicon-64.png', 'privacidad.html']
    sw = open(os.path.join(STATIC, 'sw.js'), encoding='utf-8').read()
    sw = sw.replace('__BUILD__', build).replace('__PRECACHE__', json.dumps(pre))
    open(os.path.join(OUT, 'sw.js'), 'w', encoding='utf-8').write(sw)
    open(os.path.join(OUT, '.nojekyll'), 'w').write('')

    size = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(OUT) for f in fs)
    print(f'{OUT}  build {build}  {size/1024:.0f} KB  {"NUBE SIMULADA" if FAKE else "producción"}')


if __name__ == '__main__':
    main()
