import asyncio, sys
from playwright.async_api import async_playwright
LV=int(sys.argv[1]) if len(sys.argv)>1 else 1
PRE=sys.argv[2] if len(sys.argv)>2 else 'g'
BOT = r"""(() => {
  const B=window.__BP, G=B.G; if(!G||G.demo) return null;
  const sq=G.squad, n=G.soldiers.length, gd=G.guard; let tx=sq.tx;
  if(G.phase==='boss'){ tx=G.boss.x*0.5; for(const s of G.shock){ if(Math.abs(sq.x-s.x)<s.w/2+1.3) tx=s.x>0?s.x-s.w/2-1.7:s.x+s.w/2+1.7; } }
  else if(gd && gd.st==='lock'){ tx=-3.2; }
  else { const ahead=G.gates.filter(g=>!g.used&&g.z>sq.z).sort((a,b)=>a.z-b.z); const crate=G.crates.find(c=>!c.dead&&c.z>sq.z&&c.z-sq.z<28);
    if(ahead.length&&ahead[0].z-sq.z<26){const row=ahead.filter(g=>g.row===ahead[0].row);let best=row[0],bv=-1e9;for(const g of row){const v=g.k==='add'?n+Math.round(g.val):n*g.val;if(v>bv){bv=v;best=g;}}tx=(Math.max(best.x0,-4.6)+Math.min(best.x1,4.6))/2;}
    else if(crate){tx=crate.z-sq.z>5?crate.x:(crate.x>0?crate.x-2.6:crate.x+2.6);} else tx=0; }
  sq.tx=tx;
  return {ph:G.phase,z:Math.round(sq.z),n,zs:G.zombies.length,gst:gd?gd.st:null,ghp:gd?Math.round(gd.hp):0,gdz:gd?Math.round(gd.z-sq.z):0,gr:gd?gd.raise:0,sh:G.shock.length,st:B.state,near:G.zombies.filter(z=>z.z-sq.z<9).length};
})()"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=[])
        ctx=await br.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
        page=await ctx.new_page(); errs=[]
        page.on('pageerror',lambda e:errs.append(str(e))); page.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await page.goto('file:///home/claude/medieval/index.html'); await page.wait_for_function('window.__BP&&window.__BP.ready',timeout=90000); await page.wait_for_timeout(400)
        await page.evaluate(f"window.__BP.save.level={LV};window.__BP.save.up.rec=6;window.__BP.save.up.pow=3")
        await page.click('#bPlay'); await page.wait_for_timeout(300)
        await page.evaluate("""window.__ft=[];(function L(t){window.__ft.push(t);requestAnimationFrame(L);})(performance.now())""")
        taken=set(); log=[]
        async def snap(tag):
            if tag not in taken: taken.add(tag); await page.screenshot(path=f'/home/claude/shots/{PRE}_{tag}.png')
        for i in range(520):
            r=await page.evaluate(BOT)
            if r is None or r['st']=='end': break
            log.append(r)
            if r['near']>6 and r['ph']=='run': await snap('horde')
            if r['gst'] in ('lock','sleep') and r['gdz']<24: await snap('lock')
            if r['ph']=='run' and r['near']>3: await snap('near')
            if r['gst']=='wake': await snap('wake')
            if r['gst']=='ally' and r['gr']>0.6 and r['ph']=='run': await snap('ally')
            if r['ph']=='boss' and r['gst']=='ally' and r['gr']>0.6: await snap('bossally')
            if r['ph']=='boss' and r['sh']>0: await snap('boss')
            await page.wait_for_timeout(180)
        await page.wait_for_timeout(2600); await page.screenshot(path=f'/home/claude/shots/{PRE}_end.png')
        ft=await page.evaluate("(()=>{const a=window.__ft;const d=[];for(let i=1;i<a.length;i++)d.push(a[i]-a[i-1]);d.sort((x,y)=>x-y);return {n:d.length,med:d[d.length>>1],p95:d[Math.floor(d.length*0.95)]};})()")
        gl=[x for x in log if x['gst'] in ('lock','wake')]
        print('guard log', gl[:1], gl[-1:] if gl else None)
        print('last', log[-1] if log else None)
        print('frames',ft,'taken',sorted(taken),'errors',errs)
        await br.close()
asyncio.run(main())
