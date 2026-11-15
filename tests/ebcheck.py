import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx=await br.new_context(viewport={'width':390,'height':844},device_scale_factor=2)
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/medieval/index.html'); await pg.wait_for_function('window.__BP&&window.__BP.ready')
        await pg.evaluate("window.__BP.save.level=5"); await pg.click('#bPlay')
        mx=0;shooters=0;mg=0;shot=False
        for i in range(120):
            r=await pg.evaluate("(()=>{const G=window.__BP.G;return {eb:G.eb.length,sh:G.zombies.filter(z=>z.sh).length,mg:G.soldiers.filter(s=>s.v===5).length,n:G.soldiers.length,gm:G.gates.filter(g=>g.mg).length,hs:G.hs}})()")
            mx=max(mx,r['eb']);shooters=max(shooters,r['sh']);mg=max(mg,r['mg'])
            if r['eb']>0 and not shot: await pg.screenshot(path='/home/claude/shots/eb_shot.png'); shot=True
            await pg.wait_for_timeout(150)
        print('max eb',mx,'max shooters',shooters,'mages',mg,'mage gates',r['gm'],'errors',errs)
        await br.close()
asyncio.run(main())
