import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx=await br.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file:///home/claude/medieval/index.html'); await pg.wait_for_selector('#menu:not(.hidden)')
        await pg.click('#bCrt'); await pg.wait_for_timeout(300)
        on=await pg.evaluate("document.getElementById('crt').classList.contains('on')")
        await pg.click('#bPlay'); await pg.wait_for_timeout(3500); await pg.screenshot(path='/home/claude/shots/crt_on.png')
        print('crt',on,'errors',errs); await br.close()
asyncio.run(main())
