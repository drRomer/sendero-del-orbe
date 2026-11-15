import re,sys,os
HERE=os.path.dirname(os.path.abspath(__file__))
src=open(os.path.join(HERE,'base','game_v2.js'),encoding='utf-8').read()
s=src
P=lambda n:open(os.path.join(HERE,'parts',n),encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    c=s.count(a)
    assert c==cnt,(a[:80],c); s=s.replace(a,b)
def span(a,b,new):
    global s
    i=s.index(a); j=s.index(b,i+len(a)); s=s[:i]+new+s[j:]
rep("Brigada del Puente v2 — runner/shooter de escuadrón (original)","Legión del Bosque — runner medieval 8-bit (original)")
rep("Render: Canvas 2D con proyección pseudo-3D (cámara inclinada)","Render: Canvas 2D a baja resolución (pixel art) con proyección pseudo-3D")
span("const WCOL=[","\n","const WCOL=['216,200,160','120,255,140','255,150,60','140,220,255','220,130,255','255,220,90'];")
rep("const SAVE_KEY='brigada-puente-v1';","const SAVE_KEY='legion-bosque-v1';")
span("  {id:'rec',icon:","];","""  {id:'rec',icon:'bow',name:'Reclutas',desc:'+1 arquero al iniciar',base:30,mult:1.55,max:15},
  {id:'pow',icon:'target',name:'Puntería',desc:'+15% de daño',base:40,mult:1.5,max:20},
  {id:'rate',icon:'bolt',name:'Cadencia',desc:'+10% de flechas',base:40,mult:1.5,max:15},
  {id:'slash',icon:'star',name:'Magia',desc:'La magia carga 25% más rápido',base:50,mult:1.6,max:8}
""")
span("let W=1,H=1,DPR=1","const PJ={x:0,y:0,s:0};","""let W=1,H=1,DPR=1,F=500,CX=0,CY=0,HORY=0,dSq=1,shX=0,shY=0,shake=0,quality=1,T=0,PIX=2;
function resize(){
  const cw=Math.max(1,innerWidth),ch=Math.max(1,innerHeight);
  PIX=Math.max(2,Math.round(cw/200));W=Math.ceil(cw/PIX);H=Math.ceil(ch/PIX);DPR=1;
  cv.width=W;cv.height=H;ctx.imageSmoothingEnabled=false;
  dSq=CAM_D*cosP+CAM_H*sinP;
  const vSq=-CAM_H*cosP+CAM_D*sinP;
  F=Math.min(0.74*H,0.96*W*dSq/(2*RAIL));
  CX=W/2; CY=0.75*H+vSq*F/dSq; HORY=CY-tanP*F;
  if(SCN){buildSky();buildBack();}
}
""")
span("function otext(","function silhouette(",P('font.js'))
span("/* ============================================================\n   SPRITES (dibujados por código","function blit(",P('sprites.js'))
rep("function blit(S,fr,x,y,sc,white){const k=S.k*PJ.s*(sc||1);ctx.drawImage(white?S.white:S.img,fr*S.fw,0,S.fw,S.fh,x-S.ax*k,y-S.ay*k,S.fw*k,S.fh*k);}",
    "function blit(S,fr,x,y,sc,white){const k=S.k*PJ.s*(sc||1),w=Math.max(1,Math.round(S.fw*k)),h=Math.max(1,Math.round(S.fh*k));ctx.drawImage(white?S.white:S.img,fr*S.fw,0,S.fw,S.fh,Math.round(x-S.ax*k),Math.round(y-S.ay*k),w,h);}")
span("function propCar(","/* ============================================================\n   NIVELES",P('scene.js'))
rep("SCN=mkScene(lv,d.L,d.gz);buildSky();buildVignette();","SCN=mkScene(lv,d.L,d.gz);buildSky();buildBack();buildVignette();")
span("function drawBackdrop(){","/* ============================================================\n   RENDER — entidades",P('road.js'))
span("function drawSoldier(s){","/* ----- Jefe: Titán del Puente ----- */",P('ents.js'))
span("const FOG_Z=38;","/* ============================================================\n   HUD y pantallas",P('fx.js'))
rep("G.squad.tx+=dx*pxToWorld();","G.squad.tx+=dx/PIX*pxToWorld();")
rep("pal:br?(Math.random()*BVAR.length)|0:(Math.random()*ZVAR.length)|0","pal:br?(Math.random()*BVAR.length)|0:run?3+((Math.random()*2)|0):(Math.random()*ZVAR.length)|0")
rep("const b={x:s.wx+.12,z:s.wz+.4,d:dmg,life:RANGE/BV,vx:0,g:0};","const b={x:s.wx+.12,z:s.wz+.4,d:dmg,life:RANGE/BV,vx:0,g:0,mg:s.v===5};")
rep("'¡GUARDIÁN LIBERADO!'","'¡ENT LIBERADO!'")
rep("'GUARDIÁN PERDIDO'","'ENT PERDIDO'")
rep("' TROPA'","' ALIADOS'")
rep("'ARMA NV '","'FLECHAS NV '",2)
rep("'¡PUENTE DESPEJADO!'","'¡CAMINO DESPEJADO!'")
rep("mejora tu escuadrón y vuelve","mejora tu legión y vuelve")
rep("[['Zombis eliminados',G.kills],['Soldados en pie',surv],['Guardián',gf?'Liberado':'Perdido']","[['Enemigos derrotados',G.kills],['Arqueros en pie',surv],['Ent',gf?'Liberado':'Perdido']")
span("function build3D(done){","boot();","""function boot(){
  loadSave();resize();buildProps();buildSigns();buildSprites();buildFlash();READY=true;const ls=$('loadScr');if(ls)ls.classList.add('hidden');toMenu();
}
""")
rep("""document.fonts.load('20px "Russo One"')""","""document.fonts.load('16px "Press Start 2P"')""")
rep("ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#0e1622';","ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#120c18';")
rep("if(perf.acc/perf.n>.026&&quality>.7){quality=.72;resize();}","")
rep("shot(){if(thr('shot',.075)){noise(.045,.045,3200,'highpass');tone(1400,.035,'square',.012,-700);}},","shot(){if(thr('shot',.075)){tone(560,.07,'triangle',.035,-300);noise(.03,.025,2600,'highpass');}},")
rep("  click(){tone(700,.05,'square',.04);}\n};","  click(){tone(700,.05,'square',.04);}\n};\n"+P('music.js'))
rep("function startGame(){initAudio();sfx.click();","function startGame(){initAudio();sfx.click();musStart();")
rep("function pause(){if(state!=='play')return;state='pause';","function pause(){if(state!=='play')return;state='pause';musStop();")
rep("function resume(){if(state!=='pause')return;state='play';","function resume(){if(state!=='pause')return;state='play';musStart();")
rep("function toMenu(){state='menu';","function toMenu(){musStop();state='menu';")
rep("  state='end';const win=G.phase==='win'","  musStop();state='end';const win=G.phase==='win'")
rep("$('bSound').addEventListener('click',()=>{save.muted=!save.muted;persist();initAudio();","$('bSound').addEventListener('click',()=>{save.muted=!save.muted;persist();initAudio();if(save.muted)musStop();")

span("function spawnWave(w){","function updZombies(dt){","""function spawnWave(w){
  const E=SCN.pal.en;
  for(let i=0;i<w.n;i++){const br=i<w.br,run=!br&&i<w.br+w.run,sh=!br&&!run&&i<w.br+w.run+(w.sh||0),hp=br?w.bhp:run?w.hp*.7:sh?w.hp*.8:w.hp;
    const pal=br?E.h[(Math.random()*E.h.length)|0]:run?E.r[(Math.random()*E.r.length)|0]:sh?5:E.n[(Math.random()*E.n.length)|0];
    G.zombies.push({x:rnd(w.x0,w.x1),z:w.z+Math.random()*w.depth,sp:br?.85:run?3.3:sh?1.0:rnd(.9,1.6),hp,max:hp,br,run,sh,cd:rnd(.6,1.6),shoot:0,ph:Math.random()*TAU,off:rnd(-1.6,1.6),pal,hit:0,dead:false,kd:2,sz:0});}
}
""")
rep("function update(dt){\n","function update(dt){\n  if(G&&G.hs>0){G.hs-=dt;return;}\n")
s=s[:s.index("function update(dt){")]+P('features.js')+"\n"+s[s.index("function update(dt){"):]
rep("const raw=(t-last)/1000;last=t;const dt=Math.min(.05,Math.max(0,raw));T+=dt;","const raw=(t-last)/1000;last=t;const dt=Math.min(.05,Math.max(0,raw));T+=dt;FDT=dt;")
rep("updBullets(dt);spawnWaves();updZombies(dt);","updBullets(dt);updEB(dt);spawnWaves();updZombies(dt);")
rep("soldiers:[],bullets:[],zombies:[],","soldiers:[],bullets:[],eb:[],hs:0,zombies:[],")
rep("buildBack();buildVignette();","buildBack();buildVignette();SPR.titan=SPR.bosses[(lv-1)%SPR.bosses.length];{const bn=document.querySelector('#bossBar .bn');if(bn)bn.textContent=BOSSN[(lv-1)%BOSSN.length];}CF.length=0;COINXY=null;")
rep("pal:(Math.random()*ZVAR.length)|0","pal:SCN.pal.en.n[(Math.random()*SCN.pal.en.n.length)|0]")
rep("z.z-=z.sp*dt;z.ph+=dt*(z.br?5.4:z.sp*2.6+1.2);","z.z-=z.sp*dt;if(z.sh&&z.z-sq.z<15)z.z+=z.sp*dt;z.ph+=dt*(z.br?5.4:z.sp*2.6+1.2);\n    if(z.sh){z.shoot-=dt;z.cd-=dt;const dd=z.z-sq.z;if(z.cd<=0&&dd>3&&dd<24&&S.length){z.cd=rnd(1.8,2.6);z.shoot=.3;const t=S[(Math.random()*S.length)|0],tt=Math.max(.2,(z.z-t.wz)/26);G.eb.push({x:z.x,z:z.z-.4,vx:(t.wx-z.x)/tt});if(thr('gob',.15))tone(380,.06,'triangle',.03,-150);}}")
rep("if(tk===1){t.hp-=b.d;t.hit=.07;if(t.hp<=0)killZombie(t,true);","if(tk===1){t.hp-=b.d;t.hit=.07;if(b.mg)splash(t,b);if(t.hp<=0)killZombie(t,true);")
rep("  G.corpses.push({x:z.x,z:z.z,t:0,br:z.br,pal:z.pal,ph:z.ph,kd:7,sz:z.z,side:Math.random()<.5?-1:1});\n  burst(z.x,z.br?1.3:.75,z.z,z.br?14:6);dust(","  pixelBurst(z);if(reward&&(z.br||Math.random()<.5))flyCoin(z.x,1,z.z);\n  dust(")
rep("sfx.crate();buzz(20);burst(c.x,1,c.z,12,'255,230,140');}","sfx.crate();buzz(20);burst(c.x,1,c.z,12,'255,230,140');for(let i=0;i<4;i++)flyCoin(c.x+rnd(-.5,.5),1,c.z);}")
rep("b.st='dying';b.dieT=0;","b.st='dying';b.dieT=0;G.hs=.3;for(let i=0;i<14;i++)flyCoin(b.x+rnd(-3,3),rnd(2,8),b.z-1);")
rep("s.boss=true;b.hp-=b.max*.07+500;b.flash=.2;","s.boss=true;b.hp-=b.max*.07+500;b.flash=.2;G.hs=.1;")
rep("b.hp-=dmg;b.flash=.12;","b.hp-=dmg;b.flash=.12;G.hs=.06;")
rep("G.bullets.push(b);s.fl=.06;shots++;}","G.bullets.push(b);s.fl=.14;shots++;}")
rep("function addSoldiers(k,instant){","function addSoldiers(k,instant,fv){")
rep("v:(Math.random()*SVAR.length)|0","v:fv!=null?fv:(Math.random()*SVAR.length)|0")
rep("if(nn>n)addSoldiers(nn-n);","if(nn>n)addSoldiers(nn-n,false,gt.mg?5:undefined);")
rep("ftext(gateLabel(gt),good?'#8fd0ff':'#ff8a92',","ftext(gateLabel(gt)+(gt.mg?' MAGOS':''),good?(gt.mg?'#ead8ff':'#8fd0ff'):'#ff8a92',")
rep("const pos=()=>({k:'add',v:ri(3,6)+Math.round(lv*1.2)});","const pos=()=>lv>=2&&R()<.3?{k:'add',v:ri(2,3)+Math.round(lv*.6),mg:1}:{k:'add',v:ri(3,6)+Math.round(lv*1.2)};")
rep("gates.push({row,z,x0,x1,k:o.k,val:o.v,v0:o.v,kd:3,sz:z,fl:0})","gates.push({row,z,x0,x1,k:o.k,val:o.v,v0:o.v,kd:3,sz:z,fl:0,mg:o.mg||0})")
rep("const br=lv>=2?Math.floor(rf(0,1+lv*.45)):0,run=lv>=3?ri(0,Math.floor(lv/2)):0;","const br=lv>=2?Math.floor(rf(0,1+lv*.45)):0,run=lv>=3?ri(0,Math.floor(lv/2)):0,sh=lv>=3?Math.floor(rf(0,1+Math.min(3,lv*.3))):0;")
rep("waves.push({z,n,x0,x1,depth:rf(5,9)+n*.08,br,run,hp:zhp,bhp,done:false});","waves.push({z,n,x0,x1,depth:rf(5,9)+n*.08,br,run,sh,hp:zhp,bhp,done:false});")
rep("if(G.guard&&G.guard.z>zMin&&G.guard.z<zMax)DL.push(G.guard);","if(G.guard&&G.guard.z>zMin&&G.guard.z<zMax)DL.push(G.guard);\n    if(SCN.castle&&SCN.castle.z>zMin&&SCN.castle.z<zMax+60)DL.push(SCN.castle);")
rep("case 9:drawGan","case 11:drawCastle(e);break;case 9:drawGan")
rep("const row=mkEl('div','upg'),ic=mkEl('div','ic',u.icon),tx=mkEl('div','tx');","const row=mkEl('div','upg'),ic=mkEl('div','ic'),tx=mkEl('div','tx');{const im=new Image();im.alt='';im.src=SPR.icons[u.icon]||'';ic.append(im);}")
rep("const save={level:1,coins:0,best:1,muted:false,up:","const save={level:1,coins:0,best:1,muted:false,crt:false,up:")
rep("save.muted=s.muted===true;","save.muted=s.muted===true;save.crt=s.crt===true;")
rep("  $('bSound').textContent='Sonido: '+(save.muted?'No':'Sí');","  $('bSound').textContent='Sonido: '+(save.muted?'No':'Sí');\n  $('bCrt').textContent='Filtro retro: '+(save.crt?'Sí':'No');$('crt').classList.toggle('on',save.crt);")
rep("$('bHow').addEventListener('click',","$('bCrt').addEventListener('click',()=>{save.crt=!save.crt;persist();initAudio();sfx.click();renderShop();});\n$('bHow').addEventListener('click',")
rep("function startGame(){initAudio();sfx.click();musStart();","function startGame(){initAudio();sfx.click();musStart();COINXY=null;CF.length=0;")
rep("  if(SCN){buildSky();buildBack();}\n}","  if(SCN){buildSky();buildBack();}\n  if(typeof COINXY!=='undefined')COINXY=null;\n}")

rep("for(const e of DL){if(!fogDone&&e.sz<fz){drawFog();fogDone=true;}","for(const e of DL){if(!fogDone&&(e.sz<fz||(e.kd===11&&e.sz-cam.z<80))){drawFog();fogDone=true;}")
rep("  if(G&&!G.demo)drawGroundFx();\n  drawEntities();","  if(G&&!G.demo)drawGroundFx();\n  drawEnvGround();\n  drawEntities();")
s=s.replace("function boot(){",P('v3a.js')+"\n"+P('v3b.js')+"\n"+P('v3c.js')+"\n"+P('v3d.js')+"\n"+P('v3e.js')+"\n"+P('v3f.js')+"\nfunction boot(){",1)
s=s.replace("setState:s=>{state=s;}};","setState:s=>{state=s;},pickCard:i=>pickCard(i),revive:y=>doRevive(y),dailyInfo:()=>dailyInfo()};",1)
s=s.replace("READY=true;const ls=$('loadScr');if(ls)ls.classList.add('hidden');toMenu();","READY=true;const ls=$('loadScr');if(ls)ls.classList.add('hidden');toTitle();",1)
s=s.replace("$('bHowBack').addEventListener('click',()=>{sfx.click();show('menu');});","$('bHowBack').addEventListener('click',()=>{sfx.click();show(HOW_BACK);});",1)
s=s.replace("$('bSound').addEventListener('click',()=>{save.muted=!save.muted;persist();initAudio();if(save.muted)musStop();if(!save.muted)sfx.click();renderShop();});","$('bSound').addEventListener('click',()=>{save.muted=!save.muted;persist();initAudio();if(save.muted)musStop();else{sfx.click();musStart();}renderOpts();});",1)
s=s.replace("$('bCrt').addEventListener('click',()=>{save.crt=!save.crt;persist();initAudio();sfx.click();renderShop();});","$('bCrt').addEventListener('click',()=>{save.crt=!save.crt;persist();initAudio();sfx.click();renderOpts();});",1)
assert s.count("loadSave();resize();")==1
s=s.replace("loadSave();resize();","loadSave();loadSaveExtra();resize();",1)
open(os.path.join(HERE,'game.js'),'w',encoding='utf-8').write(s)
print('ok',len(s))
