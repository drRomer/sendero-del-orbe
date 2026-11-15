import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    pre=sys.argv[1] if len(sys.argv)>1 else 'm'
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx=await br.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
        pg=await ctx.new_page(); errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file:///home/claude/medieval/index.html'); await pg.wait_for_function('window.__BP&&window.__BP.ready',timeout=30000); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=f'/home/claude/shots/{pre}_menu.png')
        await pg.click('#bPlay'); await pg.wait_for_timeout(2500)
        await pg.screenshot(path=f'/home/claude/shots/{pre}_play1.png')
        await pg.wait_for_timeout(4000)
        await pg.screenshot(path=f'/home/claude/shots/{pre}_play2.png')
        print('errors',errs[:6]); await br.close()
asyncio.run(main())
