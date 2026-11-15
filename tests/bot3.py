import asyncio, sys, json
from playwright.async_api import async_playwright
LV=int(sys.argv[1]) if len(sys.argv)>1 else 1
PRE=sys.argv[2] if len(sys.argv)>2 else 'v3'
REV=(sys.argv[3]=='rev') if len(sys.argv)>3 else False
BOT = r"""(() => {
  const B=window.__BP, G=B.G; if(!G||G.demo) return {st:B.state};
  const sq=G.squad, n=G.soldiers.length, gd=G.guard, rad=Math.min(.44*Math.sqrt(Math.max(1,n)),3.1)*(G.cmp||1);
  let pref=sq.tx;
  const gv=g=>{let k=g.k,v=g.val;if(k==='rou'){const o=g.rou[Math.floor((G.time*1.8+g.rp))%g.rou.length];k=o.k;v=o.v;}const t=n+G.reserve;if(k==='trade')return t-g.cost+g.val*2;if(g.unit)return t+6;if(k==='pct')return t*(1+v/100);if(g.curse)return t*1.3;return k==='add'?t+Math.round(v):t*v;};
  if(G.phase==='boss'){pref=G.boss.x*.5;}
  else if(gd&&gd.st==='lock'){pref=-3.2;}
  else{const ahead=G.gates.filter(g=>!g.used&&g.z>sq.z).sort((a,b)=>a.z-b.z);const crate=G.crates.find(c=>!c.dead&&c.z>sq.z&&c.z-sq.z<28);
    if(ahead.length&&ahead[0].z-sq.z<26){const row=ahead.filter(g=>g.row===ahead[0].row);let best=row[0],bv=-1e9;for(const g of row){const v=gv(g);if(v>bv){bv=v;best=g;}}pref=(Math.max(best.x0,-4.6)+Math.min(best.x1,4.6))/2;}
    else if(crate){pref=crate.z-sq.z>5?crate.x:(crate.x>0?crate.x-2.6:crate.x+2.6);} else pref=0;}
  const F=G.fork;if(F&&sq.z>F.z0-14&&sq.z<F.z1){pref=(G.forkSide||(G.lv%2?1:-1))*2.9;}
  const Br=G.bridge;
  const danger=x=>{let d=0;
    for(const h of G.hz){if(h.type==='rect'){if(h.z1<sq.z-2||h.z0>sq.z+3)continue;if(x>h.x0-rad&&x<h.x1+rad)d+=1;}else{if(Math.abs(h.z-sq.z)>h.r+2.5)continue;if(Math.abs(x-h.x)<h.r+rad*.8)d+=1;}}
    for(const s of G.shock){if(s.on&&s.front<sq.z-2)continue;if(Math.abs(x-s.x)<s.w/2+rad)d+=1;}
    for(const r of G.rolls){if(r.dead)continue;const dz=r.z-sq.z;if(dz<-1.5||dz>18)continue;if(Math.abs(x-r.x)<r.w+rad)d+=1;}
    for(const p of G.spikes){if(p.z1<sq.z-1||p.z0>sq.z+7)continue;if(x>p.x0-rad&&x<p.x1+rad)d+=.8;}
    for(const p of G.bp){if(p.z-sq.z>12)continue;if(Math.abs(x-p.x)<rad+.6)d+=.6;}
    if(Br&&sq.z>Br.z0-8&&sq.z<Br.z1+1)d+=Math.max(0,Math.abs(x-Br.cx)+rad-Br.hw)*2;
    return d;};
  let bx=pref,bc=1e9;for(let x=-4.2;x<=4.21;x+=.3){const c=danger(x)*10+Math.abs(x-pref)*.25;if(c<bc){bc=c;bx=x;}}
  sq.tx=bx;
  return {st:B.state,ph:G.phase,z:Math.round(sq.z),L:G.L,n,res:G.reserve,zs:G.zombies.length,gst:gd?gd.st:null,gdz:gd?Math.round(gd.z-sq.z):0,gr:gd?gd.raise:0,
    bhp:Math.round(G.boss.hp),bmax:G.boss.max,hz:G.hz.length,sh:G.shock.length,near:G.zombies.filter(z=>z.z-sq.z<9).length,cards:G.cards,
    fork:F?Math.round(F.z0-sq.z):null,br:Br?Math.round(Br.z0-sq.z):null,rolls:G.rolls.filter(r=>!r.dead).length,ft:Math.round(G.boss.ft||0),units:[G.nk,G.nm],coins:G.coins,meter:G.meter};
})()"""
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=[])
        ctx=await br.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
        page=await ctx.new_page(); errs=[]
        page.on('pageerror',lambda e:errs.append(str(e))); page.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await page.goto('file:///home/claude/medieval/index.html'); await page.wait_for_function('window.__BP&&window.__BP.ready',timeout=90000); await page.wait_for_timeout(400)
        up=min(20,LV//3); await page.evaluate(f"(()=>{{const s=window.__BP.save;s.level={LV};s.up.rec={min(15,LV//4)};s.up.pow={up};s.up.rate={min(15,LV//4)};s.up.slash={min(8,LV//8)};s.coins=999999;}})()")
        await page.click('#titleScr'); await page.wait_for_timeout(250); await page.click('#bMainPlay'); await page.wait_for_timeout(250); await page.click('#bPlay'); await page.wait_for_timeout(300)
        taken=set(); log=[]; cards=0
        async def snap(tag):
            if tag not in taken: taken.add(tag); await page.screenshot(path=f'/home/claude/shots/{PRE}_{tag}.png')
        for i in range(1500):
            r=await page.evaluate(BOT)
            st=r.get('st')
            if st=='card':
                await snap('card'); cards+=1; await page.evaluate("window.__BP.pickCard(0)"); await page.wait_for_timeout(150); continue
            if st=='revive':
                await snap('revive'); await page.evaluate(f"window.__BP.revive({'true' if REV else 'false'})"); await page.wait_for_timeout(150); continue
            if st=='end' or 'ph' not in r: break
            log.append(r)
            if r['meter']>=1 and (r['near']>10 or r['ph']=='boss' or (r['gst']=='lock' and r['gdz']<20)): await page.click('#bSlash')
            if r['near']>6 and r['ph']=='run': await snap('horde')
            if r['gst']=='lock' and r['gdz']<24: await snap('lock')
            if r['rolls']>0: await snap('roll')
            if r['br'] is not None and -6<r['br']<6: await snap('bridge')
            if r['fork'] is not None and -20<r['fork']<4: await snap('fork')
            if r['ph']=='boss' and r['hz']>0: await snap('boss')
            if r['ph']=='boss' and r['ft']>12: await snap('boss2')
            await page.wait_for_timeout(120)
        await page.wait_for_timeout(2600); await page.screenshot(path=f'/home/claude/shots/{PRE}_end.png')
        bl=[x for x in log if x['ph']=='boss']
        print('LV',LV,'len',len(log),'cards',cards,'errors',errs[:5])
        if log: print('first boss',bl[:1]); print('last',log[-1])
        txt=await page.evaluate("document.getElementById('eTitle').textContent+' | '+document.getElementById('eSub').textContent")
        print('end:',txt,'taken',sorted(taken))
        await br.close()
asyncio.run(main())
