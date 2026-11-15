// bosses10.js — jefes con progresión por tramos (t: 0 sin arma ni protección, 1 arma, 2 +pechera, 3 +casco, 4 +aura)
RP.jrobe=['#12060a','#240a12','#3a1018','#541820','#6e222a'];
RP.ash=['#2a2626','#4a4444','#6e6666','#948a88','#bcb0aa'];
RP.white=['#5a5a66','#8e8e9a','#c4c4cc','#ececf2'];
RP.shadow=['#0c060e','#180e1c','#24162a','#321e38','#42284a','#56345e'];
RP.mask=['#1a0c10','#2e161c','#46222a','#5e3038','#7a4048'];
RP.flesh=['#1e0a0e','#361418','#521e22','#6e2a2c'];
RP.voidc=['#0a0612','#120c22','#1c1434','#281c48','#36265e'];
RP.hole=['#000000','#030206','#06040a'];
RP.rockV=['#1a1620','#2e2834','#4a4250','#6a6070'];
const AURA={troll:['#e8ff7a','#8ad83a','#2e8a2a'],lich:['#d8ffd8','#5ae07a','#1a7a3a'],demon:['#ffd27a','#ff4a1a','#8a0a10'],judge:['#ffffff','#ffd84a','#c08a1c'],guard:['#ff9a8a','#e8202a','#5a0410']};
const seedOf=(ph,r)=>Math.round((ph||0)*10+(r||0)*7);
const spikes=(o,cx,cy,rad,n,len,m,z,a0)=>{for(let k=0;k<n;k++){const a=(a0||0)+k/n*Math.PI*2,bx=cx+Math.cos(a)*rad,by=cy+Math.sin(a)*rad;o.poly([[bx-Math.sin(a)*1.1,by+Math.cos(a)*1.1],[bx+Math.sin(a)*1.1,by-Math.cos(a)*1.1],[bx+Math.cos(a)*len,by+Math.sin(a)*len]],m,z,1);}};

// ================= TROLL =================
function troll10(ph,r,t){const o=PXRw(84,86,5),S=0,HR=1,LT=2,WD=3,BN=4,V=5,MT=6,M=M9('troll','hair','leather',{ramp:RP.wood,tex:'bark'},'bone','void','iron');
  const s=Math.sin(ph),bb=Math.round(Math.abs(s)*2),y=-bb,la=Math.round(s*3);r=r||0;
  o.cap(32,60+y,28,72-(la>0?2:0),7,6,S,2);o.blob(28,79-(la>0?2:0),8,4,S,2.1);o.cap(28,72-(la>0?2:0),28,78-(la>0?2:0),6,6,S,2);
  o.cap(52,60+y,56,72-(la<0?2:0),7,6,S,1.5);o.blob(56,79-(la<0?2:0),8,4,S,1.6);o.cap(56,72-(la<0?2:0),56,78-(la<0?2:0),6,6,S,1.5);
  o.blob(42,47+y,20,17,S,3);o.blob(42,52+y,14,10,S,3.1);
  o.poly([[26,58+y],[58,58+y],[56,68+y],[42,71+y],[28,68+y]],LT,3.3,2);
  o.blob(26,33+y,10,8,S,3.6,.35);o.blob(58,33+y,10,8,S,3.6,-.35);
  if(t>=2){o.poly([[27,34+y],[57,34+y],[60,47+y],[55,57+y],[42,60+y],[29,57+y],[24,47+y]],MT,3.7,3);o.cap(42,37+y,42,57+y,.8,.8,MT,3.72);
    for(const d of [-1,1])o.cap(42+d*13,34+y,42+d*17,28+y,1.3,1.3,LT,3.75);o.cap(25,58+y,59,58+y,1.7,1.7,LT,3.8);o.blob(42,58+y,2.2,1.8,MT,3.85);
    for(const [x,yy] of [[30,38],[54,38],[28,50],[56,50],[42,56]])o.glow(x,yy+y,'#e4e4f0');}
  for(let k=0;k<7;k++)o.blob(32+k*3.3,35+y+Math.abs(k-3)*.9,1.3,1.8,BN,3.9);o.blob(42,40+y,2.6,2.6,BN,3.95);
  const ua=r;const arm=(dir,z)=>{const shx=42+dir*20,shy=34+y,ex=shx+dir*(8-6*ua),ey=shy+14-24*ua,hx=shx+dir*(6-12*ua),hy=shy+30-50*ua+(1-ua)*Math.round(dir*s*3);
    o.cap(shx,shy,ex,ey,8.5,7,S,z);o.cap(ex,ey,hx,hy,7,6,S,z+.1);o.blob(hx,hy,t?6:6.8,t?5:5.8,S,z+.2);return [hx,hy];};
  if(t>=2)for(const d of [-1,1]){o.blob(42+d*21,31+y,9,6,MT,4.4,d*-.4);for(const k of [0,1,2])o.poly([[42+d*(16+k*4)-1.3,27+y-k*.4],[42+d*(16+k*4)+1.3,27+y-k*.4],[42+d*(17+k*4),21+y-k]],MT,4.45,1);}
  const hL=arm(-1,4),hR=arm(1,4);
  const mace=(x0,y0,x1,y1,z)=>{o.cap(x0,y0,x1,y1,1.6,1.8,WD,z);o.blob(x1,y1,6.4,6.4,MT,z+.1);spikes(o,x1,y1,5.6,8,3.8,MT,z+.12,.2);o.cap(x1-6,y1,x1+6,y1,.7,.7,LT,z+.15);};
  if(t>=1){if(ua>.5){const cx=(hL[0]+hR[0])/2,cy=Math.min(hL[1],hR[1])+1;mace(cx-14,cy+2,cx+12,cy-6,5);}else mace(hL[0],hL[1],hL[0]-3,hL[1]+15,4.5);}
  // cabeza hundida, melena, colmillos
  o.blob(42,23+y,12.5,9.5,HR,4.9);o.cap(31,22+y,30,31+y,3,1.6,HR,4.95);o.cap(53,22+y,54,31+y,3,1.6,HR,4.95);o.blob(42,25+y,9,8,S,5);
  if(t<3)for(const [x0,x1,y1] of [[38,36,13],[42,42,12],[46,48,13]])o.cap(x0,18+y,x1,y1+y,1.8,.6,HR,5.2);
  o.cap(36,21.5+y,48,21.5+y,1.5,1.5,S,5.3);o.blob(42,27+y,3.4,2.4,S,5.4);
  if(t>=3){o.blob(42,19+y,10.4,6.4,MT,5.6);o.cap(31.5,22+y,52.5,22+y,1.3,1.3,MT,5.65);o.cap(42,19+y,42,27+y,1,.9,MT,5.7);
    for(const d of [-1,1]){o.cap(42+d*9,17+y,42+d*15,10+y,2.2,1.4,BN,5.55);o.cap(42+d*15,10+y,42+d*14,4+y,1.4,.5,BN,5.55);}o.glow(42,14+y,'#e4e4f0');}
  const ec=t>=4?['#ffffff','#e8ff7a']:['#d93838','#ff8a6a'];
  o.glow(38,24+y,ec[0]);o.glow(39,24+y,ec[1]);o.glow(45,24+y,ec[0]);o.glow(46,24+y,ec[1]);
  o.poly([[37,30+y],[39,30+y],[38,26+y]],BN,5.5,1);o.poly([[45,30+y],[47,30+y],[46,26+y]],BN,5.5,1);
  if(t>=4)for(const [x,yy] of [[24,30],[25,33],[24,36],[60,30],[59,33],[60,36],[33,48],[51,48]])o.glow(x,yy+y,'#b8ff6a');
  o.glow(42,40+y,t>=4?'#e8ff7a':'#ff8a22');o.glow(41,39+y,'#ffe25a');
  return {c:o.render(M,{soft:.36,aura:t>=4?{c:AURA.troll,w:4,seed:seedOf(ph,r)}:null}),gem:[47,45+y]};}

// ================= NIGROMANTE =================
function lich10(ph,r,t){const o=PXRw(76,86,5),RB=0,GD=1,BN=2,WD=3,V=4,MT=5,M=M9('lrobe','gold','bone','wood','void','iron');
  const up=Math.round(Math.sin(ph)*3),sw=Math.round(Math.sin(ph*2)*2);r=r||0;
  for(const [x,d] of [[33,sw],[42,-sw]]){o.cap(x+d,64-up,x+d,76-up,1.1,1,BN,1);o.blob(x+d+.5,77-up,2.2,1,BN,1.1);}
  o.poly([[29,24-up],[47,24-up],[56,70-up],[50,68-up],[46,72-up],[40,69-up],[36,72-up],[30,68-up],[24,72-up],[20,70-up]],RB,2,3);
  o.cap(38,26-up,38,60-up,9,15,RB,2.1);
  o.poly([[32,30-up],[44,30-up],[42,48-up],[34,48-up]],V,2.5,1);o.cap(38,31-up,38,47-up,.8,.8,BN,2.6);for(let i=0;i<4;i++){o.cap(34,32+i*3-up,37,32+i*3-up,.6,.6,BN,2.7);o.cap(39,32+i*3-up,42,32+i*3-up,.6,.6,BN,2.7);}
  if(t>=1){o.cap(31.5,30-up,33.5,48-up,.7,.7,GD,2.8);o.cap(44.5,30-up,42.5,48-up,.7,.7,GD,2.8);}
  if(t>=2){o.poly([[31,30-up],[45,30-up],[44,45-up],[38,50-up],[32,45-up]],MT,2.9,2);o.cap(31,30-up,45,30-up,.7,.7,GD,2.95);o.cap(38,45-up,38,50-up,.6,.6,GD,2.95);
    o.blob(38,37-up,3.2,3.4,BN,2.96);o.blob(36.8,36.6-up,.9,.9,V,2.97);o.blob(39.2,36.6-up,.9,.9,V,2.97);
    for(const d of [-1,1]){o.blob(38+d*14,28-up,6.5,4.4,BN,3.05);for(const k of [0,1])o.poly([[38+d*(11+k*5)-1.2,26-up],[38+d*(11+k*5)+1.2,26-up],[38+d*(12+k*5),20-up-k]],BN,3.06,1);}}
  else for(const d of [-1,1])o.blob(38+d*14,28-up,6,4,RB,3);
  const arm=(dir,z,rr)=>{const shx=38+dir*14,shy=30-up,ex=shx+dir*(5-3*rr),ey=shy+12-20*rr,hx=shx+dir*(4-8*rr),hy=shy+22-36*rr;o.cap(shx,shy,ex,ey,3,2.6,RB,z);o.cap(ex,ey,hx,hy,2.6,2,RB,z+.1);o.blob(hx,hy+1,2,1.6,BN,z+.2);
    for(const d of [-1,0,1])o.cap(hx+d*.8,hy+2,hx+d*1.4,hy+4.5,.4,.3,BN,z+.25);return [hx,hy];};
  const staffUp=t>=1&&r>.5;
  const hL=arm(-1,3.5,r),hR=arm(1,3.5,t>=1?Math.min(r,.55):r);
  const orbCol=(k)=>['#ffffff','#bfffc8','#5ae07a','#2ab84a'][k];
  if(t>=1){const sx=hR[0],sy=hR[1]-(staffUp?10:0),top=sy-26;o.cap(sx,top,sx,sy+16,.9,.9,WD,3.6);o.cap(sx-2.4,sy-1,sx+2.4,sy-1,.7,.7,GD,3.62);
    for(let a=-0.6;a<=Math.PI+.6;a+=.25){const cx=sx+Math.cos(a)*4.4,cy=top-4.4-Math.sin(a)*4.4*-1;o.cap(cx,cy,cx+Math.cos(a+.25)*.1,cy+.1,.95,.95,GD,3.65);}
    const fr=staffUp?2+3*r:1.5;for(let yy=-3;yy<=3;yy++)for(let xx=-3;xx<=3;xx++){const d=Math.hypot(xx,yy);if(d>fr)continue;o.glow(sx+xx,top-4.4+yy,orbCol(Math.min(3,Math.floor(d/fr*4))));}}
  if(r>.5&&(t===0||true)){const cx=t>=1?hL[0]+2:(hL[0]+hR[0])/2,cy=(t>=1?hL[1]:Math.min(hL[1],hR[1]))-5,rr=t>=1?3.5*r:5*r;for(let a=0;a<Math.PI*2;a+=.4)for(let q=0;q<rr;q++)o.glow(cx+Math.cos(a)*q,cy+Math.sin(a)*q,q<1.5?'#ffffff':q<3?'#bfffc8':'#2ab84a');}
  // capucha y calavera
  o.blob(38,18-up,11,11,RB,5);if(t>=1){o.blob(38,19-up,8.4,8.4,GD,5.1);o.blob(38,20-up,7.4,7.4,V,5.2);}else o.blob(38,20-up,8,8,V,5.2);o.blob(38,21-up,6,6,BN,5.3);
  if(t>=3){o.cap(29,11-up,47,11-up,1.4,1.4,GD,5.5);for(let k=0;k<5;k++){const x=30+k*4;o.poly([[x-1.4,11-up],[x+1.4,11-up],[x,(k===2?2:k%2?6:4)-up]],k%2?GD:BN,5.45,1);}o.glow(38,9-up,'#7aff8a');}
  o.blob(35.5,20.5-up,1.4,1.4,V,5.4);o.blob(40.5,20.5-up,1.4,1.4,V,5.4);const ec=t>=4?'#ffffff':'#7aff8a';o.glow(35,20-up,ec);o.glow(40,20-up,ec);o.glow(38,23-up,'#6a6250');
  for(const x of [36,37,38,39,40])o.glow(x,25-up,x%2?'#3a3428':'#c8c2ae');
  if(t>=4)for(let k=0;k<6;k++){const a=k/6*Math.PI*2+ph,wx=38+Math.cos(a)*24,wy=40-up+Math.sin(a)*8;o.glow(wx,wy,'#bfffc8');o.glow(wx,wy+1,'#5ae07a');o.glow(wx-Math.cos(a),wy+2,'#2ab84a');}
  o.glow(38,42-up,'#7aff8a');o.glow(37,41-up,'#ffffff');
  return {c:o.render(M,{soft:.36,aura:t>=4?{c:AURA.lich,w:4,seed:seedOf(ph,r)}:null}),gem:[43,47-up]};}

// ================= DEMONIO =================
function demon10(ph,r,t){const o=PXRw(84,86,5),S=0,H=1,C=2,WD=3,WG=4,V=5,AR=6,TR=7,M=[{ramp:RP.skinR},{ramp:RP.horn},{ramp:RP.cloth},{ramp:RP.wood,tex:'bark'},{ramp:RP.wing},{ramp:RP.void},{ramp:RP.iron},{ramp:RP.trim}];
  const s=Math.sin(ph||0),bb=Math.round(Math.abs(s)*2),y=-bb,la=Math.round(s*2);r=r||0;
  o.poly([[30,30+y],[8,14+y],[4,34+y],[12,48+y],[26,42+y]],WG,0,3);o.poly([[54,30+y],[76,14+y],[80,34+y],[72,48+y],[58,42+y]],WG,0,3);
  o.cap(30,30+y,8,14+y,1.6,1.2,WG,.1);o.cap(54,30+y,76,14+y,1.6,1.2,WG,.1);
  o.cap(30,58+y,16,66,3,2,S,.5);o.cap(16,66,10,58,2,1.4,S,.5);o.poly([[10,58],[6,52],[13,55]],S,.6,1);
  o.cap(34,58+y,28,68-(la>0?2:0),7,5.5,S,2);o.cap(28,68-(la>0?2:0),30,80-(la>0?2:0),5.5,4.5,S,2);o.blob(30,81-(la>0?2:0),6,3,H,2.1);
  o.cap(50,58+y,56,68-(la<0?2:0),7,5.5,S,1.5);o.cap(56,68-(la<0?2:0),54,80-(la<0?2:0),5.5,4.5,S,1.5);o.blob(55,81-(la<0?2:0),6,3,H,1.6);
  o.poly([[30,54+y],[54,54+y],[52,66+y],[42,70+y],[32,66+y]],C,2.5,2);
  o.cap(42,56+y,42,36+y,10,13,S,3);o.blob(35,37+y,7,6,S,3.3);o.blob(49,37+y,7,6,S,3.3);
  o.blob(28,33+y,7,6,S,3.6,.4);o.blob(56,33+y,7,6,S,3.6,-.4);
  if(t<2){for(const [pts] of [[[[38,46],[36,50],[38,54]]],[[[46,46],[48,50],[46,54]]],[[[42,48],[42,55]]]])for(let i=1;i<pts.length;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i],n=6;for(let k=0;k<=n;k++)o.glow(x0+(x1-x0)*k/n,y0+(y1-y0)*k/n+y,'#ff7a2a');}
    o.cap(33,56+y,51,56+y,1.4,1.4,C,3.4);}
  if(t>=2){o.poly([[31,34+y],[53,34+y],[55,44+y],[50,55+y],[42,58+y],[34,55+y],[29,44+y]],AR,3.8,3);
    o.poly([[31,34+y],[53,34+y],[52,37+y],[32,37+y]],TR,3.85,1);o.poly([[34,55+y],[42,58+y],[50,55+y],[49,53+y],[42,56+y],[35,53+y]],TR,3.85,1);o.cap(42,38+y,42,54+y,.8,.8,TR,3.86);
    for(const dir of [-1,1]){const hx=42+dir*15;o.blob(hx,31+y,7.5,5,AR,4.8,dir*-.3);o.poly([[hx-2,27+y],[hx+2,27+y],[hx+dir*5,19+y]],H,4.9,1);o.poly([[hx+dir*3,29+y],[hx+dir*6,28+y],[hx+dir*10,23+y]],H,4.9,1);}}
  const ua=r*1.2,aw=Math.round(s*2);
  const clawArm=(d,z,u,ws)=>{const sx=42-d*15,ex=sx-d*7,hx=sx-d*9;o.cap(sx,34+y,ex,47+y-u*14+ws,6,5,S,z);o.cap(ex,47+y-u*14+ws,hx,58+y-u*30+ws,5,4,S,z+.1);o.blob(hx,60+y-u*31+ws,4,3.5,S,z+.2);
    for(const k of [-3,0,3])o.cap(hx+k,62+y-u*31+ws,hx+k*1.3,67+y-u*31+ws,1.3,.6,H,z+.3);return [hx,60+y-u*31+ws];};
  const hl=clawArm(1,4,ua,aw);let hr=null;
  if(t>=1){o.cap(57,34+y,63,46+y,6,5,S,4);o.cap(63,46+y,64,56+y,5,4,S,4.1);
    const ty=y+8;o.cap(66,8+ty,66,82,1.8,1.8,WD,4.4);o.blob(64,57+y,4.2,3.6,S,4.5);
    o.poly([[59,14+ty],[73,14+ty],[73,17+ty],[59,17+ty]],H,4.6,1);for(const x of [59,66,73])o.poly([[x-1.5,15+ty],[x+1.5,15+ty],[x,3+ty]],H,4.7,1);
    for(const [x,h] of [[59,6],[66,8],[73,6]])for(let k=0;k<h;k++)for(let w=-1;w<=1;w++){if(Math.abs(w)>(h-k)/3)continue;const yy=3+ty-k,xx=x+w+(k>h*.6?((k+x)%2?1:-1):0);o.glow(xx,yy,k<2?'#ffffff':k<h*.45?'#ffd541':'#fa6a0a');}}
  else hr=clawArm(-1,4,ua,-aw);
  // cabeza
  o.blob(42,24+y,7,7,S,5);o.blob(42,29+y,5,3.5,S,5.1);o.blob(42,28+y,3.8,2.6,S,5.25);
  o.cap(36,20+y,26,16+y,2.8,2.2,H,5.2);o.cap(26,16+y,22,6+y,2.2,1,H,5.2);o.cap(48,20+y,58,16+y,2.8,2.2,H,5.2);o.cap(58,16+y,62,6+y,2.2,1,H,5.2);
  if(t>=3){o.cap(34.5,20+y,49.5,20+y,1.6,1.6,AR,5.3);o.blob(42,17.5+y,6.6,3.4,AR,5.28);for(const d of [-1,0,1])o.poly([[42+d*4-1.2,16+y],[42+d*4+1.2,16+y],[42+d*4,(d?11:8)+y]],TR,5.31,1);
    for(const d of [-1,1])o.poly([[42+d*5,20+y],[42+d*8,21+y],[42+d*6.5,28+y]],AR,5.32,1);o.glow(42,13+y,'#ffd541');}
  for(let k=0;k<=8;k++){const tt=k/8,cx=33+18*tt,cy=35+y+Math.round(5*Math.sin(tt*Math.PI));o.glow(cx,cy,k%2?'#8a7a6a':'#c8b8a0');}
  o.blob(42,42+y,4.6,4.6,TR,5.4);o.blob(42,42+y,3.4,3.4,AR,5.45);
  const PS=[];for(let k=0;k<5;k++){const a=Math.PI/2+k*2*Math.PI/5;PS.push([42+Math.cos(a)*2.9,42+y+Math.sin(a)*2.9]);}
  for(let k=0;k<5;k++){const A=PS[k],Bp=PS[(k+2)%5],n=6;for(let j=0;j<=n;j++)o.glow(A[0]+(Bp[0]-A[0])*j/n,A[1]+(Bp[1]-A[1])*j/n,'#ff5a2a');}o.glow(42,42+y,'#ffd541');
  const ec=t>=4?['#ffffff','#ffffff']:['#ffd541','#ffffff'];for(const [x,c] of [[38,ec[0]],[39,ec[1]],[45,ec[0]],[46,ec[1]]])o.glow(x,23+y,c);
  o.glow(40,28+y,'#1a0608');o.glow(44,28+y,'#1a0608');o.glow(40,27+y,'#3a0c12');o.glow(44,27+y,'#3a0c12');
  for(const [x,yy,c] of [[41,29,'#c08a1c'],[43,29,'#c08a1c'],[40,30,'#ffd541'],[44,30,'#ffd541'],[40,31,'#ffd541'],[44,31,'#c08a1c'],[41,32,'#fff3b0'],[42,32,'#ffd541'],[43,32,'#c08a1c']])o.glow(x,yy+y,c);
  const fire=(fx,fy)=>{for(let k=0;k<9;k++)for(let w=-2;w<=2;w++){if(Math.abs(w)>(9-k)/3)continue;o.glow(fx+w,fy-k,k<3?'#ffffff':k<6?'#ffd541':'#fa6a0a');}};
  if(r>.6){fire(hl[0],hl[1]-10);if(hr)fire(hr[0],hr[1]-10);}
  return {c:o.render(M,{soft:.36,aura:t>=4?{c:AURA.demon,w:4,seed:seedOf(ph,r)}:null}),gem:[47,47+y]};}

// ================= EL JUEZ DICTADOR =================
// magistrado infernal: toga carmesí, banda blanca, cuernos de carnero como peluca, mazo de juez y libro de sentencias
function judge10(ph,r,t){const o=PXRw(84,90,5),RB=0,SK=1,WH=2,GD=3,WD=4,BN=5,V=6,AR=7,BK=8,M=M9('jrobe','ash','white','gold',{ramp:RP.wood,tex:'bark'},'bone','void','iron','cloth');
  const s=Math.sin(ph||0),bb=Math.round(Math.abs(s)*1.5),y=-bb,sw=Math.round(s*1.5);r=r||0;const CX=42;
  // toga hasta el suelo
  o.poly([[31,30+y],[53,30+y],[64,86],[57,84],[50,88],[42,85],[34,88],[27,84],[20,86]],RB,2,3);
  o.poly([[38,32+y],[46,32+y],[48,86],[42,84],[36,86]],BK,2.2,1);
  o.cap(37.5,34+y,35,86,.7,.7,GD,2.3);o.cap(46.5,34+y,49,86,.7,.7,GD,2.3);
  for(const d of [-1,1])o.blob(CX+d*11,32+y,7,5,RB,2.6,d*-.35);
  if(t>=2){o.poly([[31,32+y],[53,32+y],[54,44+y],[49,54+y],[42,56+y],[35,54+y],[30,44+y]],AR,2.8,3);o.cap(31,32+y,53,32+y,.8,.8,GD,2.85);o.cap(35,54+y,49,54+y,.7,.7,GD,2.85);
    // balanza de la justicia
    o.cap(CX,38+y,CX,50+y,.5,.5,GD,2.9);o.cap(36,40+y,48,40+y,.5,.5,GD,2.9);for(const d of [-1,1]){o.blob(CX+d*6,45+y,2.2,1,GD,2.92);o.cap(CX+d*6,40+y,CX+d*7.6,45+y,.3,.3,GD,2.91);o.cap(CX+d*6,40+y,CX+d*4.4,45+y,.3,.3,GD,2.91);}
    for(const d of [-1,1]){o.blob(CX+d*12,31+y,7.4,4.6,AR,3.05,d*-.3);o.cap(CX+d*7,29+y,CX+d*17,31+y,.6,.6,GD,3.06);}}
  // cadena de su cargo con sello (punto del cristal)
  for(let k=0;k<=10;k++){const tt=k/10,cx=33+18*tt,cy=33+y+Math.round(7*Math.sin(tt*Math.PI));o.glow(cx,cy,k%2?'#b08022':'#ffe07a');}
  o.blob(CX,41+y,3,3,GD,3.4);o.blob(CX,41+y,1.8,1.8,V,3.45);o.glow(CX,41+y,'#ff2a2a');o.glow(CX-1,40+y,'#ff8a6a');
  // banda blanca de juez
  o.poly([[39,29+y],[42,29+y],[41.5,37+y],[39.5,37+y]],WH,3.5,1);o.poly([[42,29+y],[45,29+y],[44.5,37+y],[42.5,37+y]],WH,3.5,1);
  o.cap(36,28.5+y,48,28.5+y,1.2,1.2,WH,3.45);
  // brazos de manga ancha
  const ua=r;
  // izquierdo: libro de sentencias
  o.cap(30,32+y,24,46+y+sw,3.2,5.2,RB,4);o.blob(23,48+y+sw,5.6,3,RB,4.05);o.blob(23,51+y+sw,2.2,1.6,SK,4.1);
  {const by=y+sw;o.poly([[13,49+by],[23,47+by],[33,49+by],[33,60+by],[23,58+by],[13,60+by]],RB,4.2,1);o.poly([[14,49.5+by],[22.6,48+by],[22.6,57.4+by],[14,59+by]],WH,4.25,1);o.poly([[23.4,48+by],[32,49.5+by],[32,59+by],[23.4,57.4+by]],WH,4.25,1);
   for(let k=0;k<4;k++){for(let x=0;x<6;x++){if(k===3&&x>3)continue;o.glow(15.5+x,51.5+k*1.8-x*.15+by,'#a01418');o.glow(24.5+x,50.5+k*1.8+x*.15+by,'#a01418');}}o.glow(23,47+by,'#ffe07a');}
  // derecho: mazo
  const ex=58-4*ua,ey=44+y-20*ua,hx=60-6*ua,hy=56+y-38*ua;
  o.cap(54,32+y,ex,ey,3.2,4.6,RB,4);o.cap(ex,ey,hx,hy,4.6,5.4,RB,4.05);o.blob(hx,hy+2,2.4,2,SK,4.1);
  if(t>=1){const tx=ua>.5?hx-2:hx+4,ty=ua>.5?hy-13:hy-21,mx=tx,my=ty-3.8;o.cap(hx,hy+3,tx,ty,1.1,1.1,WD,4.6);
    o.cap(mx-7,my,mx+7,my,4.2,4.2,WD,4.7);for(const d of [-1,1]){o.blob(mx+d*7.6,my,1.4,4.3,WD,4.72);o.cap(mx+d*5.6,my-4.2,mx+d*5.6,my+4.2,.75,.75,GD,4.74);}o.cap(mx-1.4,my-4.3,mx-1.4,my+4.3,.5,.5,GD,4.74);o.cap(mx+1.4,my-4.3,mx+1.4,my+4.3,.5,.5,GD,4.74);
    if(ua>.6)for(let k=0;k<12;k++){const a=k/12*Math.PI*2;o.glow(mx+Math.cos(a)*11,my+Math.sin(a)*7,k%2?'#ffd84a':'#ffffff');}}
  // cabeza: rostro ceniza alargado, cuernos de carnero
  for(const d of [-1,1]){o.cap(CX+d*4,15+y,CX+d*10,12+y,2.4,2.2,BN,4.9);o.cap(CX+d*10,12+y,CX+d*13,17+y,2.2,2,BN,4.9);o.cap(CX+d*13,17+y,CX+d*11,23+y,2,1.7,BN,4.92);o.cap(CX+d*11,23+y,CX+d*8,21+y,1.6,1,BN,4.93);
    o.cap(CX+d*9,22+y,CX+d*12,27+y,1.6,1.4,BN,4.88);o.cap(CX+d*12,27+y,CX+d*9,30+y,1.3,.8,BN,4.88);}
  o.blob(CX,20+y,6.4,8.6,SK,5);o.blob(CX,27+y,3.6,2.4,SK,5.05);
  o.cap(CX-5.5,16.5+y,CX-1,18+y,1.3,1.1,SK,5.2);o.cap(CX+5.5,16.5+y,CX+1,18+y,1.3,1.1,SK,5.2);
  o.blob(CX-3,19.5+y,1.8,1.1,V,5.15);o.blob(CX+3,19.5+y,1.8,1.1,V,5.15);
  const ec=t>=4?'#ffffff':'#ffe9a0';o.glow(CX-3,19+y,ec);o.glow(CX+3,19+y,ec);o.glow(CX-2,20+y,'#ff4a2a');o.glow(CX+2,20+y,'#ff4a2a');
  o.cap(CX,20+y,CX,24+y,.6,.8,SK,5.1);for(const x of [-2,-1,0,1,2])o.glow(CX+x,27+y,'#1a1414');
  for(const d of [-1,1])o.cap(CX+d*4.5,22+y,CX+d*3.5,26+y,.5,.5,V,5.12);
  if(t>=3){o.poly([[CX-7,14+y],[CX+7,14+y],[CX+5,2+y],[CX,-2+y],[CX-5,2+y]],AR,5.4,2);o.cap(CX-7,14+y,CX+7,14+y,1,1,GD,5.45);o.cap(CX,1+y,CX,13+y,.5,.5,V,5.46);
    for(const d of [-1,1])o.cap(CX+d*5.6,13+y,CX+d*3.6,1+y,.5,.5,GD,5.45);o.glow(CX,8+y,'#ff2a2a');}
  if(t>=4)for(let k=0;k<8;k++){const a=k/8*Math.PI*2+ph,cx=CX+Math.cos(a)*30,cy=52+Math.sin(a)*10+y;for(let q=0;q<3;q++)o.glow(cx+q,cy,q%2?'#b08022':'#ffe07a');}
  return {c:o.render(M,{soft:.34,aura:t>=4?{c:AURA.judge,w:4,seed:seedOf(ph,r)}:null}),gem:[CX+5,41+y+5]};}

// ================= CAOS REGENTE =================
// túnica de vacío estrellado; la cabeza es un agujero negro con disco de acreción; escombros en órbita
function chaos10(ph,r){const o=PXRw(100,104,5),RB=0,HL=1,RK=2,M=[{ramp:RP.voidc},{ramp:RP.hole},{ramp:RP.rockV},{ramp:['#3a2a5a','#6a5a9a','#a89ad8','#e0d8ff']}],HD=3;
  const fl=Math.round(Math.sin(ph||0)*2),y=fl,CX=50;r=r||0;const HY=26+y,hr=8.5+r*3;
  const rot=(ph||0)*.5;
  // escombros que orbitan detrás
  const deb=[];for(let k=0;k<7;k++){const a=k/7*Math.PI*2+rot,rx=34-r*10,ry=10-r*3,dx=Math.cos(a)*rx,dy=Math.sin(a)*ry;deb.push([CX+dx,HY+6+dy,Math.sin(a)>0,1.6+(k%3)*.8]);}
  for(const [x,yy,front,sz] of deb)if(!front)o.blob(x,yy,sz,sz*.8,RK,.5,.6);
  // túnica abierta, brazos extendidos
  o.poly([[38,38+y],[62,38+y],[72,74+y],[76,92+y],[68,88+y],[64,98+y],[56,92+y],[50,100+y],[44,92+y],[36,98+y],[32,88+y],[24,92+y],[28,74+y]],RB,2,3);
  const ua=r;
  for(const d of [-1,1]){const sx=CX+d*11,sy=40+y,ex=CX+d*(24-ua*2),ey=52+y-ua*16,hx=CX+d*(36-ua*4),hy=58+y-ua*34;
    o.cap(sx,sy,ex,ey,4,5,RB,3);o.cap(ex,ey,hx,hy,5,7,RB,3.1);o.poly([[hx-d*2,hy-4],[hx+d*8,hy-2],[hx+d*10,hy+6],[hx+d*2,hy+8]],RB,3.15,2);
    const px=hx+d*4,py=hy+(ua>.5?-6:4),fd=ua>.5?-1:1;o.blob(px,py,2.8,2.4,HD,3.3);for(const k of [-1.5,-.5,.5,1.5])o.cap(px+k*1.3,py+fd*1.6,px+k*1.9,py+fd*5,.6,.45,HD,3.35);o.cap(px-d*2.4,py,px-d*4.4,py-fd*1.8,.6,.45,HD,3.35);}
  for(const d of [-1,1])o.blob(CX+d*9,40+y,6,4,RB,2.6,d*-.3);
  for(let a=0;a<Math.PI;a+=.1)o.glow(CX+Math.cos(a)*7,39+y+Math.sin(a)*3,(a*10|0)%2?'#8a7ad8':'#c8b8ff');
  // estrellas en la túnica
  for(let k=0;k<70;k++){const hx=Math.abs(Math.sin(k*12.9898)*43758.5453)%1,hy=Math.abs(Math.sin(k*78.233)*12345.678)%1;const x=24+hx*52,yy=38+hy*60+y;const m=o.matAt(x,yy);if(m===RB&&((k+Math.round((ph||0)*3))%5))o.glow(x,yy,k%7===0?'#ffffff':k%3?'#8a7ad8':'#c8b8ff');}
  // partículas que se desprenden
  for(let k=0;k<12;k++){const x=30+((k*37)%40),yy=96+((k*13+Math.round((ph||0)*4))%10);o.glow(x,yy+y,k%2?'#5a46a0':'#8a7ad8');}
  // agujero negro: lente arriba, disco detrás, horizonte, disco delante
  for(let a=Math.PI;a<=Math.PI*2;a+=.03){for(const [rr,c] of [[hr+3.5,'#ff9a2a'],[hr+2.5,'#ffd27a']])o.glow(CX+Math.cos(a)*rr,HY+Math.sin(a)*rr,c);}
  o.blob(CX,HY,hr+1.2,hr+1.2,HL,5);
  const ring=(front)=>{for(let a=0;a<Math.PI*2;a+=.012){const s2=Math.sin(a);if((s2>0)!==front)continue;for(let w=0;w<3;w++){const rx=hr*2+4-w*1.2,ry=(hr*.55+1.2)-w*.4,x=CX+Math.cos(a)*rx,yy=HY+s2*ry-Math.cos(a)*rx*.12;
      if(!front&&Math.hypot(x-CX,yy-HY)<hr+1.2)continue;const c=w===2?'#ffffff':w===1?(Math.cos(a)<-.3?'#ffe27a':'#ffb24a'):(Math.cos(a)<0?'#ff7a2a':'#e8333f');o.glow(x,yy,c);}}};
  ring(false);
  for(let a=0;a<Math.PI*2;a+=.03)o.glow(CX+Math.cos(a)*(hr+1.6),HY+Math.sin(a)*(hr+1.6),Math.sin(a)<-.2?'#fff4d0':'#ffb46a');
  ring(true);
  if(r>.4)for(let k=0;k<14;k++){const a=k/14*Math.PI*2+rot,d0=hr+10+r*8;for(let q=0;q<6;q++){const d=d0-q*2.2;o.glow(CX+Math.cos(a+q*.08)*d,HY+Math.sin(a+q*.08)*d*.7,q<2?'#ffffff':q<4?'#c8b8ff':'#8a7ad8');}}
  for(const [x,yy,front,sz] of deb)if(front)o.blob(x,yy,sz,sz*.8,RK,6,.6);
  return {c:o.render(M,{soft:.3}),gem:[CX+5,HY+5]};}

// ================= EL GUARDIÁN DEL ORBE (v2) =================
// carcelero de sombra que custodia el Huevo del Caos: 4 sellos encadenan el huevo; cada forma rompe uno y el huevo se agrieta
RP.gshadow=['#0c0712','#170e22','#231634','#311f48','#41295e','#543676'];
RP.garmor=['#120c1a','#20162e','#2e2042','#3e2c58','#52396e','#6a4a8a'];
RP.gbone=['#2e2832','#544a58','#8a8090','#bcb4c0','#e2dce6'];
RP.ghorn=['#08060a','#141018','#221c28','#342a3c','#463a50'];
RP.egg=['#06040c','#120a22','#1e1238','#2e1c52','#40286e','#5a3c92'];
RP.gcloak=['#08050c','#110a18','#1a1024','#241630'];
const EGGCR=[[[-.15,-.92],[-.02,-.58],[-.22,-.3]],[[.32,-.78],[.14,-.42],[.36,-.12]],[[-.62,.06],[-.3,.22],[-.46,.56]],[[.58,.28],[.26,.44],[.42,.8]],[[-.02,-.58],[.08,-.2],[-.12,.18],[.06,.56]],[[-.22,-.3],[-.5,-.38]],[[.14,-.42],[.46,-.5]]];
function eggFx(o,cx,cy,rx,ry,m,ph,EG,seals){const on=(x,y)=>o.matAt(x,y)===EG,G=(x,y,c)=>{if(on(x,y))o.glow(x,y,c);};
  for(let k=0;k<18;k++){const a=Math.abs(Math.sin(k*12.9898))*Math.PI*2,d=Math.sqrt(Math.abs(Math.sin(k*78.233)))*.85;G(cx+Math.cos(a)*d*rx,cy+Math.sin(a)*d*ry,k%4?'#6a5ab0':'#c8b8ff');}
  // remolino interior (el Caos dormido)
  for(let a=0;a<Math.PI*4;a+=.18){const d=.15+a/(Math.PI*4)*.6;G(cx+Math.cos(a+ph)*d*rx,cy+Math.sin(a+ph)*d*ry*.7,a<Math.PI*2?'#8a5ad8':'#4a2a8a');}
  const rh=Math.max(1.2,rx*.3),pul=.5+.5*Math.sin(ph*2);
  for(let yy=-rh-2;yy<=rh+2;yy++)for(let xx=-rh-2;xx<=rh+2;xx++){const d=Math.hypot(xx,yy);if(d<rh)G(cx+xx,cy+yy,'#000000');else if(d<rh+.9)G(cx+xx,cy+yy,pul>.5?'#fff0c0':'#ffd27a');}
  for(let a=0;a<Math.PI*2;a+=.06){const s2=Math.sin(a),x=cx+Math.cos(a)*rx*.58,y=cy+s2*ry*.1-Math.cos(a)*rx*.08;if(s2<0&&Math.hypot(x-cx,y-cy)<rh+.9)continue;G(x,y,Math.cos(a)<-.2?'#ffe27a':'#ff9a2a');}
  for(let a=Math.PI*1.05;a<Math.PI*1.45;a+=.06)G(cx+Math.cos(a)*rx*.78,cy+Math.sin(a)*ry*.78,'#9a7ad8');
  // grietas: crecen con la forma
  const nc=[0,1,3,5,7][m]||0;for(let i=0;i<nc;i++){const P=EGGCR[i];for(let j=1;j<P.length;j++){const [x0,y0]=P[j-1],[x1,y1]=P[j],n=Math.ceil(Math.max(Math.abs(x1-x0)*rx,Math.abs(y1-y0)*ry)*1.6);
    for(let k=0;k<=n;k++){const x=cx+(x0+(x1-x0)*k/n)*rx,y=cy+(y0+(y1-y0)*k/n)*ry;G(x,y,m>=3&&k%2?'#ffffff':m>=2?'#ffd27a':'#ff9a2a');}}}
  // cadenas y sellos
  const SP=[[-.62,-.38],[.62,.38],[.62,-.38],[-.62,.38]],chain=(x0,y0,x1,y1)=>{const n=Math.ceil(Math.hypot((x1-x0)*rx,(y1-y0)*ry)*1.2);for(let k=0;k<=n;k++){const x=cx+(x0+(x1-x0)*k/n)*rx,y=cy+(y0+(y1-y0)*k/n)*ry;G(x,y,k%2?'#4a4a5c':'#9a9ab0');}};
  if(seals>=2)chain(-.96,-.58,.96,.58);else if(seals===1)chain(-.96,-.58,-.2,-.12);
  if(seals>=4)chain(.96,-.58,-.96,.58);else if(seals===3)chain(.96,-.58,.2,-.12);
  for(let k=0;k<seals;k++){const [u,v]=SP[k],x=cx+u*rx,y=cy+v*ry;for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0],[1,-1],[-1,1],[1,1],[-1,-1]])G(x+dx,y+dy,'#ffe07a');G(x,y,'#e8333f');}}
function guardian11(ph,r,m){const o=PXRw(88,108,6),SH=0,AR=1,BN=2,HN=3,EG=4,V=5,CL=6,M=[{ramp:RP.gshadow},{ramp:RP.garmor},{ramp:RP.gbone},{ramp:RP.ghorn},{ramp:RP.egg},{ramp:RP.hole},{ramp:RP.gcloak}];
  r=r||0;ph=ph||0;const fl=Math.round(Math.sin(ph)*2),Y=fl+10,CX=44,free=m>=4,L=(a,b,t)=>a+(b-a)*t;
  const VI='#b86aff',VL='#e0c8ff';
  // alas de jirones (formas 4-5)
  if(m>=3)for(const d of [-1,1]){const wy=r*-6;o.poly([[CX+d*12,40+Y],[CX+d*34,18+Y+wy],[CX+d*44,30+Y+wy],[CX+d*38,40+Y],[CX+d*43,54+Y],[CX+d*32,52+Y],[CX+d*33,66+Y],[CX+d*22,58+Y],[CX+d*16,52+Y]],CL,0,2);
    for(const [a,b] of [[[CX+d*13,41+Y],[CX+d*34,19+Y+wy]],[[CX+d*34,19+Y+wy],[CX+d*43,31+Y+wy]],[[CX+d*16,46+Y],[CX+d*42,53+Y]],[[CX+d*17,50+Y],[CX+d*32,65+Y]]])o.cap(a[0],a[1],b[0],b[1],1,.5,HN,.1);}
  const hy0=22+Y,HALO=[];if(!free)for(let k=0;k<10;k++){const a=k/10*Math.PI*2+ph*.4,x=CX+Math.cos(a)*16,y=hy0-2+Math.sin(a)*15;o.blob(x,y,2,1.6,AR,.3,a);HALO.push([x,y]);}
  // capa rasgada detrás
  o.poly([[31,38+Y],[57,38+Y],[66,70+Y],[70,86+Y],[63,82+Y],[60,92+Y],[54,85+Y],[44,94+Y],[34,85+Y],[28,92+Y],[25,82+Y],[18,86+Y],[22,70+Y]],CL,.5,2);
  // cola de humo
  const sw=Math.sin(ph*1.3)*2;o.poly([[36,56+Y],[52,56+Y],[50,72+Y],[47+sw,86+Y],[45+sw*1.4,98+Y],[42+sw,86+Y],[38,72+Y]],SH,1,3);
  for(const [dx,yy,len] of [[-7,64,5],[7,66,5],[-5,78,4],[5,80,4]])o.poly([[CX+dx,yy+Y-2],[CX+dx,yy+Y+2],[CX+dx*1.9,yy+Y+len]],SH,.95,1);
  // torso con placas
  o.cap(CX,38+Y,CX,58+Y,10,6.5,SH,2);
  o.poly([[35,40+Y],[53,40+Y],[52,50+Y],[44,54+Y],[36,50+Y]],AR,2.4,2);o.cap(CX,41+Y,CX,53+Y,.6,.6,HN,2.45);for(const k of [44,48])for(const d of [-1,1])o.cap(CX+d*1.5,k+Y,CX+d*7,k+1.5+Y,.5,.5,HN,2.45);
  // hombreras en capas
  for(const d of [-1,1]){o.blob(CX+d*13,39+Y,7.5,4.6,AR,3,d*-.35);o.blob(CX+d*17,43+Y,5.6,3.6,AR,3.05,d*-.5);o.poly([[CX+d*10,36+Y],[CX+d*14,35+Y],[CX+d*(18+m),27+Y-m]],HN,3.1,1);}
  o.cap(36,36.5+Y,52,36.5+Y,1.6,1.6,AR,3.2);
  // posición del huevo
  const er=free?10:8.6,eRy=free?13:11,ecy=free?(8+Y+Math.round(Math.sin(ph*2)*1.5)):L(58+Y,12+Y,r),ecx=CX;
  // brazos
  const claws=(hx,hy,ang,len,z,n)=>{for(let k=0;k<(n||4);k++){const a=ang+(k-1.5)*.32;o.cap(hx,hy,hx+Math.cos(a)*len,hy+Math.sin(a)*len,.75,.3,BN,z);}};
  const arm=(sx,sy,ex,ey,hx,hy,z,r0)=>{o.cap(sx,sy,ex,ey,r0||2.8,2.2,SH,z);o.cap(ex,ey,hx,hy,2.4,2,AR,z+.05);o.cap(L(ex,hx,.45),L(ey,hy,.45),hx,hy,2.6,2.2,BN,z+.06);o.blob(hx,hy,2.4,2,BN,z+.08);
    if(m>=1){const mx=L(ex,hx,.3),my=L(ey,hy,.3),dx=hx-ex,dy=hy-ey,l=Math.hypot(dx,dy)||1,nx=-dy/l*(sx<CX?1:-1),ny=dx/l*(sx<CX?1:-1);o.poly([[mx-dx/l*1.2,my-dy/l*1.2],[mx+dx/l*1.2,my+dy/l*1.2],[mx-nx*5,my-ny*5]],BN,z+.07,1);}};
  const hold=(d,sx,sy,z,u)=>{const ex=L(CX+d*22,CX+d*23,u),ey=L(56+Y,32+Y,u),hx=CX+d*(er-1+u*2),hy=L(ecy+eRy-3,ecy+3,u);arm(sx,sy,ex,ey,hx,hy,z);claws(hx,hy,u>.5?-Math.PI/2-d*.5:-Math.PI/2+d*.75,6,z+.1);};
  const spread=(d,sx,sy,z,u)=>{const ex=L(CX+d*28,CX+d*27,u),ey=L(46+Y,30+Y,u),hx=L(CX+d*34,CX+d*30,u),hy=L(60+Y,16+Y,u);arm(sx,sy,ex,ey,hx,hy,z,2.4);claws(hx,hy,u>.5?-Math.PI/2+d*.3:Math.PI/2+d*.4,7,z+.1,5);};
  if(free){for(const d of [-1,1]){const ex=CX+d*24,ey=34+Y,hx=CX+d*13,hy=16+Y;arm(CX+d*14,40+Y,ex,ey,hx,hy,4);claws(hx,hy,-Math.PI/2-d*.6,6,4.1);}if(m>=2)for(const d of [-1,1])spread(d,CX+d*12,48+Y,3.6,r);}
  else if(m>=2){for(const d of [-1,1])spread(d,CX+d*15,39+Y,3.6,r);}
  // huevo
  o.blob(ecx,ecy,er,eRy,EG,5.5);
  if(!free){const pairY=m>=2?50+Y:40+Y;for(const d of [-1,1])hold(d,CX+d*(m>=2?11:14),pairY,6,r);}
  // cabeza: capucha, máscara de hueso alargada, corona de cuernos
  o.blob(CX,hy0,9.5,9.5,SH,3.8);
  const hs=1+m*.18;for(const d of [-1,1]){o.cap(CX+d*5,hy0-6,CX+d*11,hy0-12,2.2,1.6,HN,3.85);o.cap(CX+d*11,hy0-12,CX+d*(13+2*hs),hy0-12-7*hs,1.6,.5,HN,3.85);
    if(m>=1)o.cap(CX+d*7,hy0-2,CX+d*(15+m),hy0-5-m,1.6,.5,HN,3.82);if(m>=3)o.cap(CX+d*3,hy0-8,CX+d*5,hy0-16-m,1.3,.4,HN,3.83);}
  o.cap(CX,hy0-5,CX,hy0+11,5.4,2.6,BN,4.2);o.blob(CX,hy0-3,5.8,4.6,BN,4.18);
  o.blob(CX-2.6,hy0-1.5,1.7,1.2,V,4.3);o.blob(CX+2.6,hy0-1.5,1.7,1.2,V,4.3);o.cap(CX,hy0+3,CX,hy0+9,.5,.6,V,4.3);
  const ec=free?'#ffffff':VL;o.glow(CX-2.6,hy0-1.5,ec);o.glow(CX+2.6,hy0-1.5,ec);o.glow(CX-3.6,hy0-1.5,VI);o.glow(CX+3.6,hy0-1.5,VI);
  for(const d of [-1,1])o.cap(CX+d*3.4,hy0+2,CX+d*2.2,hy0+8,.4,.4,V,4.25);
  if(m>=3){for(const [x0,y0,x1,y1] of [[CX+1,hy0-7,CX-1,hy0-2],[CX-1,hy0+1,CX+1.5,hy0+7],[CX-3,hy0-5,CX-4.5,hy0-2]]){const n=7;for(let k=0;k<=n;k++)o.glow(x0+(x1-x0)*k/n,y0+(y1-y0)*k/n,k%2?'#ffd27a':VI);}}
  if(free)for(const [x0,y0,x1,y1] of [[CX-8,42,CX-3,52],[CX+7,44,CX+2,54],[CX-3,60,CX+2,74],[CX+9,58,CX+5,70],[CX-10,48,CX-14,56]]){const n=12;for(let k=0;k<=n;k++)o.glow(x0+(x1-x0)*k/n+(k%4<2?0:1),y0+(y1-y0)*k/n+Y,k%3?VI:'#ffd27a');}
  // energía al atacar
  if(r>.5||free){const n=free?16:10,rr=er+4+r*5;for(let k=0;k<n;k++){const a=k/n*Math.PI*2+ph;o.glow(ecx+Math.cos(a)*rr,ecy+Math.sin(a)*rr*1.1,k%2?VI:'#ffd27a');}}
  if(free)for(let k=0;k<6;k++){const a=k/6*Math.PI*2+ph*.7,x=ecx+Math.cos(a)*(er+8),y=ecy+Math.sin(a)*(eRy+3);o.blob(x,y,1.2,1.6,EG,6,a);}
  const c0=o.render(M,{soft:.32,aura:free?{c:['#ffe0ff','#b86aff','#4a1a8a'],w:4,seed:seedOf(ph,r)}:null});
  // el interior del huevo se pinta sobre la imagen final (solo donde se ve la cáscara)
  const g=c0.getContext('2d'),o2={matAt:o.matAt,glow:(x,y,c)=>{g.fillStyle=c;g.fillRect(Math.round(x+6),Math.round(y+6),1,1);}};
  eggFx(o2,ecx,ecy,er,eRy,m,ph,EG,4-m);
  for(const [x,y] of HALO)if(o.matAt(x,y)===AR){o2.glow(x,y,'#e0c8ff');o2.glow(x+1,y,'#b86aff');}
  return {c:c0,gem:[ecx+6,ecy+6]};}
// primer plano del huevo: estados por forma y la eclosión
function eggClose(m,ph,hatch){const o=PXRw(30,36,4),EG=0,M=[{ramp:RP.egg}],cx=15,cy=19,rx=9,ry=12;ph=ph||0;
  if(!hatch){o.blob(cx,cy,rx,ry,EG,1);const c0=o.render(M,{soft:.32}),g=c0.getContext('2d');eggFx({matAt:o.matAt,glow:(x,y,c)=>{g.fillStyle=c;g.fillRect(Math.round(x+4),Math.round(y+4),1,1);}},cx,cy,rx,ry,m,ph,EG,4-m);return c0;}
  // eclosión: mitad inferior, mitad superior levantada, el agujero negro naciendo
  const P=[];for(let a=0;a<=Math.PI;a+=.15)P.push([cx+Math.cos(a)*rx,cy+4+Math.sin(a)*ry*.75]);P.push([cx-rx,cy+4]);for(let k=0;k<=6;k++)P.push([cx-rx+k*rx*2/6,cy+4+(k%2?-2:1)]);o.poly(P,EG,1,2);
  const T=[];for(let a=Math.PI;a<=Math.PI*2;a+=.15)T.push([cx-3+Math.cos(a)*rx*.95,cy-7+Math.sin(a)*ry*.7]);for(let k=0;k<=6;k++)T.push([cx-3+rx*.95-k*rx*1.9/6,cy-7+(k%2?2:-1)]);o.poly(T,EG,1.1,2);
  const c0=o.render(M,{soft:.32}),g=c0.getContext('2d'),G=(x,y,c)=>{g.fillStyle=c;g.fillRect(Math.round(x+4),Math.round(y+4),1,1);};
  const hx=cx,hy=cy-1;for(let yy=-6;yy<=6;yy++)for(let xx=-6;xx<=6;xx++){const d=Math.hypot(xx,yy);if(d<3.4)G(hx+xx,hy+yy,'#000000');else if(d<4.3)G(hx+xx,hy+yy,'#fff0c0');}
  for(let a=0;a<Math.PI*2;a+=.04){const s2=Math.sin(a),x=hx+Math.cos(a)*9,y=hy+s2*2.4-Math.cos(a)*1.2;if(s2<0&&Math.hypot(x-hx,y-hy)<4.3)continue;G(x,y,Math.cos(a)<-.3?'#ffe27a':'#ff9a2a');}
  for(let k=0;k<12;k++){const a=k/12*Math.PI*2;for(let q=0;q<3;q++)G(hx+Math.cos(a)*(11+q*1.6),hy+Math.sin(a)*(11+q*1.6)*.8,q?'#c8b8ff':'#ffffff');}
  return c0;}
