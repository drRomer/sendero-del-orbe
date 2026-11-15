import asyncio,base64,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg=await br.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/medieval/px2/preview9.html'); await pg.wait_for_function('window.DONE',timeout=60000)
        e=await pg.evaluate('window.ERR||null')
        if e: print('ERR',e); return
        u=await pg.evaluate('window.OUT'); open(sys.argv[1],'wb').write(base64.b64decode(u.split(',')[1])); print('ok',errs,await pg.evaluate('window.MS'))
        await br.close()
asyncio.run(main())
