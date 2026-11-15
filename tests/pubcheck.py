import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx=await br.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
        pg=await ctx.new_page(); errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        t0=await pg.evaluate('performance.now()') if False else 0
        await pg.goto('file:///home/claude/medieval/index.html'); await pg.wait_for_selector('#titleScr:not(.hidden)',timeout=20000); await pg.wait_for_timeout(600)
        await pg.click('#titleScr'); await pg.wait_for_timeout(250); await pg.click('#bMainPlay'); await pg.wait_for_timeout(250); await pg.click('#bPlay'); await pg.wait_for_timeout(3000)
        await pg.mouse.move(195,600); await pg.mouse.down(); await pg.mouse.move(120,600,steps=8); await pg.mouse.up(); await pg.wait_for_timeout(800)
        hud=await pg.evaluate("!document.getElementById('hud').classList.contains('hidden')")
        await pg.screenshot(path='/home/claude/shots/pub_check.png')
        print('hud',hud,'errors',errs); await br.close()
asyncio.run(main())
