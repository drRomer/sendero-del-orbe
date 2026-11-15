// chars9.js — todos los personajes con el pintor de volumen (diseños originales)
const TAU9=Math.PI*2;
const RP={
  bark:['#24161a','#3f2522','#61392a','#8a5434','#b07444','#d49a5c'],
  leaf:['#16301c','#24502a','#357a34','#55a43e','#8cd05a'],
  void:['#0c0608','#1a0e10','#22141a'],
  rock:['#1c181a','#36302f','#544b46','#7a6e64','#a39584','#cbbca6'],
  lrock:['#120e12','#221c22','#342b33','#4a3e47','#62545e','#7c6c74'],
  skinR:['#2a0c14','#4e1420','#7a2026','#a6362c','#c85c3c','#e8905c'],
  horn:['#0e0a0e','#221a22','#3a2e36','#5a4a52','#7a6a6e'],
  cloth:['#140e12','#261a20','#3a2a30','#504048'],
  wood:['#22140e','#40281a','#664226','#8e6236','#b08048'],
  wing:['#12080c','#24101a','#3a1a28','#542638','#6e3448'],
  iron:['#121218','#24242e','#3a3a48','#565666','#7a7a8c','#a4a4b4'],
  trim:['#2a0a0e','#561418','#8a2020','#b8342a','#e05a3a'],
  orc:['#14261c','#22402a','#36603a','#4e8448','#74ac5e','#a2d07c'],
  orc2:['#1e2414','#343c22','#4e5a32','#6c7a46','#8e9c60','#b4c084'],
  orc3:['#2a1410','#46241a','#6a3826','#8e5034','#b06c44','#cc8c5c'],
  leather:['#22140e','#40281a','#664226','#946238','#b8844c'],
  metal:['#1a1a24','#34344a','#56566e','#8282a0','#b4b4cc','#e4e4f0'],
  skin:['#3a1e1a','#6a3a2c','#9a5a3e','#c8845a','#e8b07c'],
  pants:['#141014','#221a20','#342830','#46383e'],
  cloakG:['#12281a','#1c4228','#2a6036','#408448','#62ac5c'],
  cloakB:['#24160e','#3e2818','#5e4026','#845c36','#a87c48'],
  cloakU:['#121a30','#1c2a4e','#2a3e70','#3c5896','#567ebe'],
  robe:['#1a1030','#2a1a4a','#40286a','#5a3c8e','#7c5ab6'],
  gold:['#4a3008','#7a5414','#b08022','#e0b040','#ffe07a'],
  bone:['#3a3428','#6a6250','#9c9583','#c8c2ae','#e8e2d0'],
  gob:['#1e2c10','#344a1c','#4e6c2a','#6c923a','#94b850'],
  impR:['#2a0a10','#4e121a','#7e1e22','#aa3428','#d05a36'],
  troll:['#1a2010','#2e3a1c','#465223','#6b7a38','#8f9e4f','#b4c070'],
  hair:['#1e120a','#3a2214','#593622','#7a4e30'],
  drag:['#0e2a24','#16443a','#1d5a46','#2f8a6a','#5ac094','#8ae0b4'],
  belly:['#5a3a14','#8a5e24','#b88a34','#e0b860','#f4dc90'],
  dwing:['#1c1030','#2c1a4a','#3e2862','#5a3a7a','#7a54a0'],
  lrobe:['#120c1c','#1e1428','#2b1e38','#3a2a4a','#49365c'],
  spB:['#0c3a5a','#1a6a9a','#2ea6e6','#6ad0ff','#bff4ff'],
  spP:['#2a1450','#4a2690','#7a46d8','#a87cf0','#e0ccff'],
};
const M9=(...k)=>k.map(n=>typeof n==='string'?{ramp:RP[n]}:n);
// hoja: cuadros + sombra al pie + ancla en los pies
function sheet9(frames,opt){opt=opt||{};const fw=frames[0].width,fh=frames[0].height+2,n=frames.length,c=document.createElement('canvas');c.width=fw*n;c.height=fh;const g=c.getContext('2d');
  const f0=frames[0].getContext('2d').getImageData(0,0,fw,fh-2).data;let foot=fh-3,top=0;
  for(let y=fh-3;y>=0;y--){let any=false;for(let x=0;x<fw;x++)if(f0[(y*fw+x)*4+3]>120){any=true;break;}if(any){foot=y;break;}}
  scan:for(let y=0;y<fh-2;y++)for(let x=0;x<fw;x++)if(f0[(y*fw+x)*4+3]>120){top=y;break scan;}
  const ay=(opt.ay!=null?opt.ay:foot+1);
  frames.forEach((f,i)=>{if(opt.shadow!==false){g.fillStyle='rgba(10,6,16,.34)';const rx=Math.max(2,fw*(opt.shw||.26)),cx=i*fw+(opt.ax!=null?opt.ax:fw/2);for(let yy=-1;yy<=1;yy++){const w=Math.round(rx*Math.sqrt(1-(yy/1.6)**2));g.fillRect(Math.round(cx-w),Math.round(ay-1+yy),w*2,1);}}g.drawImage(f,i*fw,0);});
  const S={img:c,fw,fh,n,ax:opt.ax!=null?opt.ax:fw/2,ay,top,mx:opt.mx||fw/2,my:opt.my||fh/2};
  if(opt.mxs){S.mxs=opt.mxs;S.mys=opt.mys;}if(opt.pc)S.pc=opt.pc;return S;}

// ---------------- ARQUERO (de espaldas) ----------------
function archer9(cl,f,n,sh){const o=PXR(16,20),C=0,PN=1,LE=2,WD=3,SK=4,M=M9(cl,'pants','leather','wood','skin');
  const t=sh?0:f/n*TAU9,s=Math.sin(t),b=sh?0:Math.round(Math.abs(s)),y=-b,la=Math.round(s*1.6);
  o.cap(6,13+y,6,18-(la>0?1:0),1.5,1.3,PN,1);o.cap(10,13+y,10,18-(la<0?1:0),1.5,1.3,PN,1);
  o.blob(6,18.5-(la>0?1:0),1.7,1,LE,1.1);o.blob(10,18.5-(la<0?1:0),1.7,1,LE,1.1);
  o.poly([[4,7+y],[12,7+y],[13,14+y],[3,14+y]],C,2,2);o.cap(8,8+y,8,13+y,3.4,4.2,C,2.1);
  o.cap(9,4+y,11.5,11+y,1.3,1.3,LE,3); // carcaj
  if(sh){o.cap(4,8,2,6,1,1,C,4);o.cap(12,8,14,7,1,1,C,4);}else{o.cap(4,8+y,3,12+y+(s>0?0:1),1,.9,C,4);o.cap(12,8+y,13,12+y+(s>0?1:0),1,.9,C,4);}
  o.blob(8,4.5+y,3.6,3.4,C,5);o.poly([[6,2+y],[10,2+y],[8,-0.5+y]],C,5.1,1);
  const fx=[[9,2],[10,3],[11,2]];for(const [x,yy] of fx)o.glow(x,yy+y,yy===3?'#d8333f':'#f6f3ea');
  if(sh){for(let k=0;k<12;k++)o.glow(1+(k<6?-Math.round(k/6):-1+Math.round((k-6)/6)),k,'#8e6236');o.glow(1,0,'#5e3a20');o.glow(1,11,'#5e3a20');
    for(let k=0;k<=12;k++)o.glow(2+Math.round(k*12/12),1+Math.round(k*6/12),'#e8e0c8');for(let k=0;k<=12;k++)o.glow(14-Math.round(k*12/12),7+Math.round(k*4/12),'#e8e0c8');o.glow(14,7,'#e8b07c');}
  else{for(let k=0;k<13;k++)o.glow(k<6||k>8?1:0,3+k+y,'#8e6236');for(let k=0;k<13;k++)o.glow(2,3+k+y,'#d8d0b8');o.glow(3,12+y,'#e8b07c');}
  return o.render(M,{soft:.4});}
// ---------------- MAGO (de espaldas) ----------------
function mage9(f,n,cast){const o=PXR(16,22),R=0,GD=1,WD=2,SK=3,M=M9('robe','gold','wood','skin');
  const t=cast?0:f/n*TAU9,s=Math.sin(t),b=cast?0:Math.round(Math.abs(s)),y=-b,up=cast?3:0,sw=Math.round(s);
  o.poly([[5,9+y],[11,9+y],[13+sw,20],[3+sw,20]],R,2,2);o.cap(8,10+y,8,18,3.6,5.2,R,2.1);
  o.cap(3+sw,19.5,13+sw,19.5,.7,.7,GD,2.2);
  o.cap(13,4+y-up,13,19+y-up,.8,.8,WD,3);o.cap(12,10+y-up,13,11+y-up,1.3,1.1,R,3.1);
  o.blob(8,8.5+y,4.5,1.8,R,4);o.poly([[4,8+y],[12,8+y],[10,4+y],[8,-0.5+y],[7,3+y]],R,4.2,2);o.cap(4.5,7.6+y,11.5,7.6+y,.8,.8,GD,4.3);
  const oc=cast?['#ffffff','#bff4ff','#6ad0ff']:['#bff4ff','#6ad0ff','#2ea6e6'];
  for(const [dx,dy,k] of [[0,0,0],[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,2],[-1,1,2],[1,-1,2],[-1,-1,2]])o.glow(13+dx,3+dy+y-up,oc[k]);
  if(cast)for(const [x,yy] of [[11,0],[15,1],[11,4],[15,5]])o.glow(x,yy-up+3,'#bff4ff');
  return o.render(M,{soft:.4});}
// ---------------- ORCOS (de frente) ----------------
function orc9(v,f,n){const o=PXR(22,24),G=0,LT=1,MT=2,V=3,HR=4,M=M9(v.sk,'leather','metal','void','hair');
  const t=f/n*TAU9,s=Math.sin(t),b=Math.round(Math.abs(s)),y=-b,la=Math.round(s*1.5),aw=Math.round(s*2);
  o.cap(8,16+y,7.5,21-(la>0?1:0),2.3,2,G,1);o.cap(14,16+y,14.5,21-(la<0?1:0),2.3,2,G,1);o.blob(7.5,22-(la>0?1:0),2.6,1.3,LT,1.1);o.blob(14.5,22-(la<0?1:0),2.6,1.3,LT,1.1);
  o.blob(11,12+y,5.6,5.4,G,2);o.poly([[6.5,9+y],[15.5,9+y],[15,17+y],[7,17+y]],LT,2.5,1.2);o.cap(7,9+y,15,15+y,.6,.6,LT,2.6);
  o.cap(6,9.5+y,3.5,14+y+aw,2.2,1.9,G,3);o.cap(16,9.5+y,18.5,14+y-aw,2.2,1.9,G,1.8);
  // arma
  if(v.wp==='hammer'){o.cap(3,14+y+aw,3.6,3+y+aw,.8,.8,LT,3.1);o.poly([[0,1+y+aw],[7,1+y+aw],[7,5.5+y+aw],[0,5.5+y+aw]],MT,3.2,1.2);}
  else{o.cap(3,14+y+aw,3.4,4+y+aw,.8,.8,LT,3.1);o.poly([[3,3+y+aw],[0,2+y+aw],[-1,7+y+aw],[3,7+y+aw]],MT,3.2,1);}
  o.blob(11,6+y,4.4,4.2,G,4);o.poly([[6.6,5+y],[4.5,3+y],[7.4,4+y]],G,4.05,1);o.poly([[15.4,5+y],[17.5,3+y],[14.6,4+y]],G,4.05,1);
  if(v.helm){o.blob(11,4+y,4.6,2.6,MT,4.2);o.poly([[7,4+y],[5,0+y],[8,3+y]],MT,4.3,1);o.poly([[15,4+y],[17,0+y],[14,3+y]],MT,4.3,1);}
  else if(v.mohawk){for(let k=0;k<5;k++)o.cap(11,3+y,11+(k-2)*.6,0+y,1,.6,HR,4.2);}
  else{o.blob(11,2.6+y,3,1.4,HR,4.2);}
  o.blob(11,8.6+y,1.8,.9,V,4.4);
  o.glow(9,6+y,v.eye);o.glow(13,6+y,v.eye);o.glow(10,9+y,'#efe6d6');o.glow(12,9+y,'#efe6d6');
  return o.render(M,{soft:.4});}
// ---------------- ESPÍRITU ----------------
function spirit9(rp,f,n){const o=PXR(14,18),B=0,M=[{ramp:rp,bias:.18}];const t=f/n*TAU9,up=Math.round(Math.sin(t)*1.4),fl=Math.round(Math.sin(t*2)*1.2);
  o.blob(7,9-up,5,5,B,1);o.cap(5,6-up,4,0-up,2,.6,B,1.1);o.cap(8,5-up,9+fl,-0.5-up,2,.6,B,1.1);o.cap(7,13-up,7+fl,17-up,2.6,.7,B,1.2);
  for(const [x,yy] of [[5,8],[8,8]]){o.glow(x,yy-up,'#10142a');o.glow(x,yy+1-up,'#10142a');}
  o.glow(6,11-up,'#ffffff');o.glow(9,7-up,'#ffffff');
  return o.render(M,{soft:.5});}
// ---------------- GOBLIN ARQUERO ----------------
function goblin9(f,n,sh){const o=PXR(16,18),G=0,LT=1,WD=2,HD=3,M=M9('gob','leather','wood','cloakB');
  const t=sh?0:f/n*TAU9,s=Math.sin(t),b=sh?0:Math.round(Math.abs(s)),y=-b,la=Math.round(s*1.4);
  o.cap(6,12+y,5.5,16-(la>0?1:0),1.6,1.4,LT,1);o.cap(10,12+y,10.5,16-(la<0?1:0),1.6,1.4,LT,1);o.blob(5.5,16.6-(la>0?1:0),1.9,1,LT,1.1);o.blob(10.5,16.6-(la<0?1:0),1.9,1,LT,1.1);
  o.blob(8,10+y,3.8,3.6,LT,2);
  o.poly([[4,6+y],[0,3+y],[4,8+y]],G,2.5,1);o.poly([[12,6+y],[16,3+y],[12,8+y]],G,2.5,1);
  o.blob(8,5.5+y,3.8,3.6,G,3);o.blob(8,3+y,3.8,2,HD,3.2);o.poly([[6,2+y],[10,2+y],[8,-0.5+y]],HD,3.3,1);
  o.glow(6,6+y,'#ffe25a');o.glow(10,6+y,'#ffe25a');o.glow(8,7+y,'#2a3a14');
  if(sh){o.cap(3,10,13,10,.7,.7,WD,4);o.cap(3,10,4.5,7.5,.6,.6,WD,4);o.cap(13,10,11.5,7.5,.6,.6,WD,4);o.cap(4,11,6,11,1.2,1,G,4.1);o.cap(12,11,10,11,1.2,1,G,4.1);for(const yy of [8,9])o.glow(8,yy,'#f6f3ea');o.glow(8,7,'#c3cad6');}
  else{o.cap(4,8+y,3,12+y+Math.round(s),1.1,1,G,3.4);o.cap(12,8+y,13,12+y-Math.round(s),1.1,1,G,3.4);for(let k=0;k<11;k++)o.glow(k<4||k>7?2:1,3+k+y,'#8e6236');for(let k=0;k<11;k++)o.glow(3,3+k+y,'#d8d0b8');}
  return o.render(M,{soft:.42});}
// ---------------- ESQUELETO ----------------
function skeleton9(f,n){const o=PXR(18,22),B=0,MT=1,WD=2,V=3,M=M9('bone','metal','wood','void');
  const t=f/n*TAU9,s=Math.sin(t),b=Math.round(Math.abs(s)),y=-b,la=Math.round(s*1.5),aw=Math.round(s*1.6);
  o.cap(7.5,14+y,7,20-(la>0?1:0),.9,.8,B,1);o.cap(10.5,14+y,11,20-(la<0?1:0),.9,.8,B,1);o.blob(7,20.6-(la>0?1:0),1.6,.8,B,1.1);o.blob(11,20.6-(la<0?1:0),1.6,.8,B,1.1);
  o.blob(9,13.5+y,3,1.4,B,2);o.cap(9,8+y,9,13+y,.8,.8,B,2.1);
  for(let i=0;i<3;i++)o.cap(6.5,8.5+i*1.6+y,11.5,8.5+i*1.6+y,.6,.6,B,2.2);
  o.cap(5.5,8+y,4,13+y+aw,.8,.7,B,3);o.cap(12.5,8+y,14,13+y-aw,.8,.7,B,1.9);
  o.cap(3.6,14+y+aw,3.6,3+y+aw,.7,.5,MT,3.1);o.cap(2,13.5+y+aw,5.2,13.5+y+aw,.6,.6,WD,3.2);
  o.blob(14.5,12+y-aw,2.6,2.8,WD,2);o.blob(14.5,12+y-aw,1,1,MT,2.1);
  o.blob(9,4.5+y,3.6,3.6,B,4);o.blob(9,7+y,2.4,1.2,B,4.1);
  o.blob(7.6,4.6+y,1.1,1,V,4.2);o.blob(10.4,4.6+y,1.1,1,V,4.2);o.glow(7,5+y,'#7ef3ff');o.glow(10,5+y,'#7ef3ff');
  for(const x of [8,9,10])o.glow(x,7+y,x===9?'#3a3428':'#c8c2ae');
  return o.render(M,{soft:.42});}
// ---------------- DIABLILLO ----------------
function imp9(f,n){const o=PXR(18,18),R=0,H=1,WG=2,M=M9('impR','horn','wing');const t=f/n*TAU9,up=Math.round(Math.sin(t)*1.4),wf=f%2;
  if(wf){o.poly([[7,7-up],[1,1-up],[0,7-up],[3,10-up]],WG,1,1);o.poly([[11,7-up],[17,1-up],[18,7-up],[15,10-up]],WG,1,1);}
  else{o.poly([[7,8-up],[0,10-up],[2,13-up],[6,11-up]],WG,1,1);o.poly([[11,8-up],[18,10-up],[16,13-up],[12,11-up]],WG,1,1);}
  o.cap(9,12-up,13,16-up,.8,.5,R,1.2);o.glow(13,16-up,'#ffcc44');
  o.blob(9,10-up,3.6,3.6,R,2);o.cap(7.5,12.5-up,7,15-up,.9,.8,R,2.1);o.cap(10.5,12.5-up,11,15-up,.9,.8,R,2.1);
  o.blob(9,6-up,3.2,2.9,R,3);o.poly([[6.6,4.5-up],[5,1-up],[7.4,3.6-up]],H,3.1,1);o.poly([[11.4,4.5-up],[13,1-up],[10.6,3.6-up]],H,3.1,1);
  o.glow(8,6-up,'#ffe25a');o.glow(10,6-up,'#ffe25a');
  return o.render(M,{soft:.42});}
// ---------------- GÓLEMS ----------------
function golem9(lava,f,n){const o=PXR(48,54,.78),R=0,LF=1,V=2,M=[{ramp:lava?RP.lrock:RP.rock,tex:'rock',cs:5},{ramp:RP.leaf,tex:'leaf'},{ramp:RP.void}];
  const t=f/n*TAU9,s=Math.sin(t),bb=Math.round(Math.abs(s)*2),y=-bb,la=Math.round(s*2);
  o.cap(17,39+y,15,48-(la>0?2:0),6,6,R,2);o.blob(14,49-(la>0?2:0),7.5,4,R,2.1);
  o.cap(31,39+y,33,48-(la<0?2:0),6,6,R,2);o.blob(34,49-(la<0?2:0),7.5,4,R,2.1);
  o.blob(24,38+y,11,6,R,3);o.blob(24,27+y,15,12,R,4);
  o.blob(24,14+y,6.5,6,R,5);
  o.blob(10,19+y,8,7,R,6,.4);o.blob(38,19+y,8,7,R,6,-.4);
  o.cap(8,23+y-la,6,35+y-la,6,5.5,R,6.5);o.cap(40,23+y+la,42,35+y+la,6,5.5,R,6.5);
  o.blob(6,39+y-la,7.5,6.5,R,7);o.blob(42,39+y+la,7.5,6.5,R,7);
  if(!lava){o.blob(31,21+y,4,2,LF,4.5);o.blob(13,15+y,3,1.6,LF,6.1);o.blob(40,42+y,2.6,1.4,LF,7.1);o.blob(17,33+y,3,1.4,LF,4.2);}
  for(const [x,c] of [[21,'#ff9a4a'],[22,'#ffd8a0'],[26,'#ff9a4a'],[27,'#ffd8a0']])o.glow(x,14+y,c);
  if(lava){const C1='#fa6a0a',C2='#ffd541';
    crack9(o,[[17,20+y],[21,25+y],[19,30+y],[23,34+y]],C1,C2);crack9(o,[[30,19+y],[27,24+y],[30,29+y],[28,33+y]],C1,C2);
    crack9(o,[[6,25+y-la],[8,30+y-la],[6,34+y-la]],C1);crack9(o,[[42,25+y+la],[40,30+y+la],[42,34+y+la]],C1);crack9(o,[[4,38+y-la],[8,41+y-la]],C1,C2);crack9(o,[[40,38+y+la],[44,41+y+la]],C1,C2);
    crack9(o,[[15,42],[17,46]],C1);crack9(o,[[33,42],[31,46]],C1);}
  return o.render(M,{soft:.36});}
function crack9(o,pts,col,core){for(let i=1;i<pts.length;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i],n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))*1.4|0;for(let k=0;k<=n;k++){const x=x0+(x1-x0)*k/n,y=y0+(y1-y0)*k/n;if(o.matAt(x,y)>=0)o.glow(x,y,(core&&k%3===1)?core:col);}}}
// ---------------- ENT ----------------
// k: 0 de pie … 1 dormido; back: vista de espaldas; u: brazo derecho en alto
function ent9(k,ph,back,u){const o=PXR(64,86),B=0,LF=1,V=2,M=[{ramp:RP.bark,tex:'bark'},{ramp:RP.leaf,tex:'leaf'},{ramp:RP.void}];
  const s=Math.sin(ph||0),bb=Math.round(Math.abs(s)*1.5),cr=k*20,y=-bb+cr,la=back?Math.round(s*3):0;u=u||0;
  const kn=k*7; // rodillas abiertas al agacharse
  // piernas
  const leg=(hx,hz,dir,lift,z)=>{const kx=hx+dir*(3+kn),ky=67+cr*.55-lift,fx=hx+dir*(4+kn*.6),fy=79;
    o.cap(hx,55+y,kx,ky,5.6,4.4,B,z);o.cap(kx,ky,fx,fy-lift*.5,4.4,3.8,B,z);
    o.cap(fx,fy,fx+dir*7,82,2.8,1.2,B,z+.1);o.cap(fx,fy,fx-dir*4,83,2.4,1.2,B,z+.1);o.cap(fx,fy-1,fx+dir,84,2,1,B,z+.1);};
  leg(27,0,-1,la>0?3:0,back?1:3);leg(39,0,1,la<0?3:0,back?3:1);
  o.blob(33,55+y,9,5,B,2);
  o.cap(33,55+y,31,33+y,8,12,B,4);o.blob(20,33+y,7,5,B,5,.35);o.blob(43,32+y,6.5,5,B,4.5,-.3);
  // brazos
  const down=k*10;
  const armL=(z)=>{const sw=back?Math.round(s*3):0;o.cap(19,33+y,11,47+y+sw+down*.3,5.2,4.2,B,z);o.cap(11,47+y+sw+down*.3,8,61+y+sw*1.4+down*.2,4.2,3.6,B,z+.2);o.blob(8,62+y+sw*1.4+down*.2,4.2,3.2,B,z+.3);
    for(const [dx,ex,ey] of [[-1,-5,10],[1,0,12],[2,4,10]])o.cap(8+dx,63+y+sw*1.4+down*.2,8+dx+ex,63+y+ey+sw*1.4+down*.2,1.7,.8,B,z+.4);};
  const armR=(z)=>{const sw=back?-Math.round(s*3):0;
    if(u>0){const ex=44+10*(1-u),ey=32+y-12*u,hx=46+6*(1-u),hy=34+y-19*u;o.cap(44,32+y,ex,ey+sw,4.6,3.8,B,z);o.cap(ex,ey+sw,hx,hy+sw,3.8,3.2,B,z+.1);o.blob(hx,hy-3+sw,4.6,4,B,z+.2);
      for(const [dx,ex2,ey2] of [[-2,-3,-6],[0,0,-7],[2,3,-6]])o.cap(hx+dx,hy-5+sw,hx+dx+ex2,hy-5+ey2+sw,1.5,.7,B,z+.3);}
    else{o.cap(44,32+y,52,43+y+sw+down*.3,4.6,3.6,B,z);o.cap(52,43+y+sw+down*.3,56,55+y+sw*1.4+down*.2,3.6,3,B,z+.1);
      for(const [ex,ey] of [[5,8],[0,9],[-4,7]])o.cap(56,55+y+sw*1.4+down*.2,56+ex,55+y+ey+sw*1.4+down*.2,1.5,.7,B,z+.2);}};
  if(back){armL(3.5);armR(7);}else{armR(3.5);armL(7);}
  // cabeza
  o.blob(30,23+y+k*3,8,9,B,6);
  if(!back){o.cap(23,20+y+k*3,37,19+y+k*3,2.2,2.2,B,6.5);o.blob(26.5,22+y+k*3,2.4,1.7,V,6.6);o.blob(33.5,22+y+k*3,2.4,1.7,V,6.6);
    o.cap(30,23+y+k*3,30.5,27+y+k*3,1.6,1.3,B,6.62);o.cap(27.5,29.5+y+k*3,32.5,29+y+k*3,.6,.6,V,6.6);}
  else{o.cap(30,18+y,30,32+y,1,1,B,6.4);}
  // ramas y copa frondosa
  const hy=k*3;
  for(const [x0,y0,x1,y1] of [[28,16,23,5],[31,15,32,3],[34,16,40,7],[26,17,19,10],[36,18,42,13]])o.cap(x0,y0+y+hy,x1,y1+y+hy,1.7,.8,B,5.5);
  o.blob(30,11+y+hy,13,8,LF,5.4);o.blob(21,13+y+hy,6,5,LF,5.45);o.blob(40,12+y+hy,6,5,LF,5.45);
  for(const [x,yy,rx,ry] of [[23,5,4,3],[32,3,4.5,3],[40,7,4,3],[19,10,3.5,2.6],[42,13,3.5,2.6],[27,8,3.5,2.6],[36,9,3.5,2.6],[31,10,3,2]])o.blob(x,yy+y+hy,rx,ry,LF,back?7.5:7);
  o.blob(19,31+y,6,3.5,LF,5.3,.35);o.blob(44,29+y,5,3,LF,4.7,-.3);
  if(!back){o.blob(25,17+y+hy,3,2,LF,6.7);o.blob(36,17+y+hy,3,2,LF,6.7);}
  else{o.blob(28,40+y,4,2.4,LF,4.3);o.blob(36,26+y,3,2,LF,6.5);}
  o.blob(37,46+y,3,2,LF,4.2);
  if(!back){const ey=22+y+k*3;if(k>.75){for(const x of [25,26,27,33,34,35])o.glow(x,ey,'#3a2216');}else for(const [x,c] of [[26,'#ffe86a'],[27,'#ffffff'],[33,'#ffe86a'],[34,'#ffffff']])o.glow(x,ey,c);}
  return o.render(M,{soft:.36});}
// ---------------- construcción de todas las hojas ----------------
function Sprites9(){
  const cyc=(n,fn)=>Array.from({length:n},(_,f)=>fn(f));const out={};
  const A=['cloakG','cloakB','cloakU'].map(cl=>{const S=sheet9(cyc(4,f=>archer9(cl,f,4)).concat([archer9(cl,0,4,true)]),{mx:2,my:7});S.nr=4;S.shoot=4;return S;});
  const MG=sheet9(cyc(4,f=>mage9(f,4)).concat([mage9(0,4,true)]),{mx:13,my:1});MG.nr=4;MG.shoot=4;
  out.sol=[A[0],A[1],A[2],A[0],A[1],MG];
  const OV=[{sk:'orc',eye:'#ff4a3a',wp:'axe'},{sk:'orc2',eye:'#ffd23a',wp:'hammer',helm:1},{sk:'orc3',eye:'#ffee66',wp:'axe',mohawk:1}];
  const orcs=OV.map((v,i)=>sheet9(cyc(4,f=>orc9(v,f,4)),{pc:[['78,132,72','102,66,38'],['108,122,70','130,130,160'],['142,80,52','70,40,30']][i]}));
  const sps=[RP.spB,RP.spP].map((rp,i)=>sheet9(cyc(4,f=>spirit9(rp,f,4)),{pc:[['106,208,255','46,166,230','255,255,255'],['168,124,240','122,70,216','255,255,255']][i],shw:.22}));
  const gob=sheet9(cyc(4,f=>goblin9(f,4)).concat([goblin9(0,4,true)]),{pc:['108,146,58','102,66,38']});gob.nr=4;gob.shoot=4;
  const sk=sheet9(cyc(4,f=>skeleton9(f,4)),{pc:['200,194,174','156,149,131']});
  const im=sheet9(cyc(4,f=>imp9(f,4)),{pc:['170,52,40','84,38,56','255,204,68'],shw:.2});
  out.zom=orcs.concat(sps,[gob,sk,im]);
  out.bru=[0,1].map(l=>sheet9(cyc(4,f=>golem9(!!l,f,4)),{pc:l?['74,62,71','250,106,10','255,213,65']:['122,110,100','163,149,132','85,164,62'],shw:.3}));
  out.ent={stand:sheet9(cyc(6,f=>ent9(1-f/5,0,false,0)),{shw:.32}),walk:sheet9(cyc(6,f=>ent9(0,f/6*TAU9,true,0)),{shw:.32}),raise:sheet9(cyc(5,f=>ent9(0,0,true,f/4)),{shw:.32})};
  out.bosses=[];
  return out;}
