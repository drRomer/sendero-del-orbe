"""Prueba la versión web servida como en GitHub Pages (/sendero-del-orbe/).
Uso: python3 tests/webcheck.py <carpeta_sitio> [fake]
Revisa: errores/CSP, manifest, service worker, modo sin conexión, partida, y con 'fake'
la UI de nube con backend simulado (subida, recuperación en otro "celular", borrado)."""
import asyncio, sys, os, threading, http.server, functools, tempfile, shutil, json
from playwright.async_api import async_playwright

SITE = os.path.abspath(sys.argv[1]); FAKE = len(sys.argv) > 2 and sys.argv[2] == 'fake'
root = tempfile.mkdtemp(); os.symlink(SITE, os.path.join(root, 'sendero-del-orbe'))
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=root)
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8765), H); threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = 'http://localhost:8765/sendero-del-orbe/'
SHOTS = '/home/claude/shots'
fails = []
def check(c, msg):
    print(('OK   ' if c else 'FAIL ') + msg)
    if not c: fails.append(msg)

async def waitfor(pg, expr, timeout=8000):
    # Sondeo con evaluate: la espera nativa de Playwright evalúa texto y la CSP de producción lo bloquea (bien).
    t, last = 0, None
    while t < timeout:
        try:
            if await pg.evaluate(expr): return True
        except Exception as e: last = e
        await pg.wait_for_timeout(100); t += 100
    raise TimeoutError(f'{expr} :: {last}')

async def boot(ctx, errs):
    pg = await ctx.new_page()
    pg.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    pg.on('console', lambda m: errs.append(m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
    await pg.goto(URL); await pg.wait_for_selector('#titleScr:not(.hidden)', timeout=30000)
    return pg

async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx = await br.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        errs = []
        pg = await boot(ctx, errs)
        man = await pg.evaluate("fetch(document.querySelector('link[rel=manifest]').href).then(r=>r.json())")
        check(man['display'] == 'fullscreen' and len(man['icons']) == 3, 'manifest válido')
        for ic in man['icons']:
            st = await pg.evaluate(f"fetch('{ic['src']}').then(r=>r.status)"); check(st == 200, 'ícono ' + ic['src'])
        await waitfor(pg, "navigator.serviceWorker.ready.then(()=>true)", 15000)
        await pg.reload(); await pg.wait_for_selector('#titleScr:not(.hidden)', timeout=30000)
        ctl = await pg.evaluate("!!navigator.serviceWorker.controller"); check(ctl, 'service worker controla la página')
        fonts = await pg.evaluate("document.fonts.load('16px \"Press Start 2P\"').then(f=>f.length)"); check(fonts > 0, 'fuente local Press Start 2P cargada')
        check(await pg.evaluate("window.SDO_WEB===1&&!!window.SDO&&typeof SDO.progress==='function'"), 'API SDO presente')
        check(not await pg.evaluate("'__BP' in window"), 'sin ganchos de prueba en producción')

        # Partida corta
        await pg.click('#titleScr'); await pg.wait_for_timeout(300)
        inst = await pg.evaluate("!document.getElementById('bInstall').classList.contains('hidden')")
        print('     botón instalar visible:', inst, '(depende de que Chrome ofrezca instalación)')
        await pg.screenshot(path=f'{SHOTS}/web_main.png')
        await pg.click('#bMainPlay'); await pg.wait_for_timeout(300); await pg.click('#bPlay'); await pg.wait_for_timeout(2500)
        await pg.mouse.move(195, 600); await pg.mouse.down(); await pg.mouse.move(120, 600, steps=8); await pg.mouse.up(); await pg.wait_for_timeout(1500)
        hud = await pg.evaluate("!document.getElementById('hud').classList.contains('hidden')"); check(hud, 'partida en curso')
        await pg.screenshot(path=f'{SHOTS}/web_play.png')

        # Sin conexión: recargar sigue funcionando
        await ctx.set_offline(True)
        await pg.reload(); await pg.wait_for_selector('#titleScr:not(.hidden)', timeout=30000)
        check(True, 'carga sin conexión (desde caché)')
        pr = await ctx.new_page(); await pr.goto(URL + 'privacidad.html'); check('PRIVACIDAD' in await pr.content(), 'privacidad sin conexión')
        await pr.close(); await ctx.set_offline(False)

        if FAKE:
            # Celular A: progreso local nivel 9, conecta → se sube a la nube simulada
            await pg.evaluate("localStorage.removeItem('fakeAuth');localStorage.removeItem('fakeCloud')")
            await pg.evaluate("(()=>{const k='legion-bosque-v1';const s=JSON.parse(localStorage.getItem(k)||'{}');Object.assign(s,{level:9,best:9,coins:777,pt:Date.now(),cu:'',cb:''});localStorage.setItem(k,JSON.stringify(s));})()")
            await pg.reload(); await pg.wait_for_selector('#titleScr:not(.hidden)'); await pg.click('#titleScr'); await pg.click('#bMainOpt')
            check(await pg.is_visible('#cloudBox'), 'caja de nube visible en Opciones')
            await pg.screenshot(path=f'{SHOTS}/web_opts_off.png')
            await pg.click('#bCloud'); await waitfor(pg, "document.getElementById('cloudInfo').classList.contains('ok')", 5000)
            info = await pg.text_content('#cloudInfo'); check('j***@example.com' in info, 'muestra correo enmascarado: ' + info)
            cloud = await pg.evaluate("JSON.parse(localStorage.getItem('fakeCloud'))")
            check(cloud['fakeUid123']['d']['best'] == 9 and 'email' not in json.dumps(cloud), 'nube recibe solo progreso (sin correo)')
            await pg.screenshot(path=f'{SHOTS}/web_opts_on.png')
            # Comprar una mejora → se sube con retardo
            await pg.click('#bOptBack'); await pg.click('#bMainPlay'); await pg.wait_for_timeout(300)
            await pg.click('#shopList .upg button >> nth=0'); await pg.wait_for_timeout(3200)
            cloud = await pg.evaluate("JSON.parse(localStorage.getItem('fakeCloud'))")
            check(cloud['fakeUid123']['d']['coins'] < 777 and cloud['fakeUid123']['n'] >= 2, 'compra en tienda se sincroniza')
            fc = cloud
            # Celular B: otro contexto, progreso nivel 2, misma cuenta → recupera nivel 9
            ctx2 = await br.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
            e2 = []; pb = await boot(ctx2, e2)
            await pb.evaluate("(c)=>{localStorage.setItem('fakeCloud',JSON.stringify(c));localStorage.setItem('fakeAuth',JSON.stringify({uid:'fakeUid123',email:'jugador@example.com'}));const k='legion-bosque-v1';const s=JSON.parse(localStorage.getItem(k)||'{}');Object.assign(s,{level:2,best:2,coins:5});localStorage.setItem(k,JSON.stringify(s));}", fc)
            await pb.reload(); await pb.wait_for_selector('#titleScr:not(.hidden)'); await pb.wait_for_timeout(800)
            prog = await pb.evaluate("SDO.progress()"); check(prog['best'] == 9, f"celular B recupera progreso (best={prog['best']})")
            toast = await pb.text_content('#toast'); check('recuperado' in (toast or ''), 'aviso de progreso recuperado: ' + str(toast))
            await pb.screenshot(path=f'{SHOTS}/web_toast.png')
            errs += ['B ' + x for x in e2]
            # Borrar datos de la nube desde A
            await pg.click('#bShopBack'); await pg.click('#bMainOpt'); await pg.click('#bCloudDel'); await pg.click('#bCfYes'); await pg.wait_for_timeout(600)
            cloud = await pg.evaluate("JSON.parse(localStorage.getItem('fakeCloud'))")
            check('fakeUid123' not in cloud, 'borrar datos elimina la copia en la nube')
            check((await pg.text_content('#bCloud')) == 'Google', 'vuelve a estado desconectado')
            check((await pg.evaluate("SDO.progress().best")) == 9, 'progreso local intacto tras borrar la nube')

        bad = [e for e in errs if 'Content Security Policy' in e or 'pageerror' in e or e.startswith('error')]
        check(not bad, 'sin errores ni violaciones CSP' + ('' if not bad else ': ' + ' | '.join(bad[:5])))
        await br.close()
    srv.shutdown(); shutil.rmtree(root)
    print('\nRESULTADO:', 'TODO OK' if not fails else f'{len(fails)} fallas')
    sys.exit(1 if fails else 0)

asyncio.run(main())
