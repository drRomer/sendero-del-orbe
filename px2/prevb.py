import asyncio,base64
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg=await br.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/medieval/px2/prevb.html'); await pg.wait_for_function('window.DONE',timeout=60000)
        e=await pg.evaluate('window.ERR||null')
        if e: print('ERR',e); return
        for k,f in [('OUTA','jefes_1_40.png'),('OUTB','jefes_41_60.png')]:
            u=await pg.evaluate('window.'+k); open('/home/claude/shots/'+f,'wb').write(base64.b64decode(u.split(',')[1]))
        print('ok',errs); await br.close()
asyncio.run(main())
