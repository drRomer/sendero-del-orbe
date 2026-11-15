/* sprites9.js — personajes con volumen (pintor PXR) */
// pxr.js — pintor de pixel art con volumen: primitivas con normales, una luz, rampas de color,
// texturas (vetas, facetas), sombras de contacto y contorno selectivo.
function PXR(W0,H0,sc){sc=sc||1;const W=Math.ceil(W0*sc),H=Math.ceil(H0*sc),Z=v=>v*sc;
  const N=W*H,mat=new Int16Array(N).fill(-1),pid=new Int16Array(N).fill(-1),zo=new Float32Array(N).fill(-1e9);
  const nx=new Float32Array(N),ny=new Float32Array(N),nz=new Float32Array(N),uu=new Float32Array(N),vv=new Float32Array(N);
  const em=[];let parts=0;
  const L=(()=>{const x=-.55,y=-.68,z=.62,l=Math.hypot(x,y,z);return [x/l,y/l,z/l];})();
  const put=(i,m,p,z,a,b,c,u,v)=>{if(z<zo[i])return;zo[i]=z;mat[i]=m;pid[i]=p;const l=Math.hypot(a,b,c)||1;nx[i]=a/l;ny[i]=b/l;nz[i]=c/l;uu[i]=u;vv[i]=v;};
  const o={W,H,L,
    // extremidad cónica (cápsula) — m: material, z: orden
    cap(x0,y0,x1,y1,r0,r1,m,z){x0=Z(x0);y0=Z(y0);x1=Z(x1);y1=Z(y1);r0=Math.max(.5,Z(r0));r1=Math.max(.5,Z(r1));const p=parts++,dx=x1-x0,dy=y1-y0,ll=dx*dx+dy*dy||1,len=Math.sqrt(ll),R=Math.max(r0,r1)+1;
      const xa=Math.max(0,Math.floor(Math.min(x0,x1)-R)),xb=Math.min(W-1,Math.ceil(Math.max(x0,x1)+R)),ya=Math.max(0,Math.floor(Math.min(y0,y1)-R)),yb=Math.min(H-1,Math.ceil(Math.max(y0,y1)+R));
      for(let y=ya;y<=yb;y++)for(let x=xa;x<=xb;x++){const px=x+.5,py=y+.5;let t=((px-x0)*dx+(py-y0)*dy)/ll;t=t<0?0:t>1?1:t;
        const cx=x0+dx*t,cy=y0+dy*t,r=r0+(r1-r0)*t,ex=px-cx,ey=py-cy,d=Math.hypot(ex,ey);if(d>r)continue;
        const k=d/r,h=Math.sqrt(Math.max(0,1-k*k)),sg=(dx*ey-dy*ex)>=0?1:-1;put(y*W+x,m,p,z,(ex/(d||1))*k,(ey/(d||1))*k,h,t*len,sg*d);}return p;},
    // masa elíptica rotada
    blob(cx,cy,rx,ry,m,z,rot){cx=Z(cx);cy=Z(cy);rx=Math.max(.6,Z(rx));ry=Math.max(.6,Z(ry));const p=parts++,c=Math.cos(rot||0),s=Math.sin(rot||0),R=Math.max(rx,ry)+1;
      for(let y=Math.max(0,Math.floor(cy-R));y<=Math.min(H-1,Math.ceil(cy+R));y++)for(let x=Math.max(0,Math.floor(cx-R));x<=Math.min(W-1,Math.ceil(cx+R));x++){
        const px=x+.5-cx,py=y+.5-cy,lx=px*c+py*s,ly=-px*s+py*c,q=(lx/rx)**2+(ly/ry)**2;if(q>1)continue;
        const a=lx/rx,b=ly/ry,h=Math.sqrt(Math.max(0,1-q));put(y*W+x,m,p,z,a*c-b*s,a*s+b*c,h,ly,lx);}return p;},
    // polígono con bisel (cuernos, garras, alas)
    poly(pts,m,z,bev){pts=pts.map(q=>[Z(q[0]),Z(q[1])]);const p=parts++;bev=Math.max(1,Z(bev||2));let xa=1e9,xb=-1e9,ya=1e9,yb=-1e9;for(const q of pts){xa=Math.min(xa,q[0]);xb=Math.max(xb,q[0]);ya=Math.min(ya,q[1]);yb=Math.max(yb,q[1]);}
      for(let y=Math.max(0,Math.floor(ya));y<=Math.min(H-1,Math.ceil(yb));y++)for(let x=Math.max(0,Math.floor(xa));x<=Math.min(W-1,Math.ceil(xb));x++){
        const px=x+.5,py=y+.5;let inside=false,best=1e9,bx=0,by=0;
        for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))inside=!inside;
          const ex=xj-xi,ey=yj-yi,el=ex*ex+ey*ey||1;let t=((px-xi)*ex+(py-yi)*ey)/el;t=t<0?0:t>1?1:t;const qx=xi+ex*t-px,qy=yi+ey*t-py,d=Math.hypot(qx,qy);if(d<best){best=d;bx=-qx/(d||1);by=-qy/(d||1);}}
        if(!inside)continue;const k=Math.min(1,best/bev);put(y*W+x,m,p,z,-bx*(1-k),-by*(1-k),.35+k,px,py);}return p;},
    glow(x,y,col){em.push([Math.round(Z(x)),Math.round(Z(y)),col]);},
    render(M,opt){opt=opt||{};const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),id=g.createImageData(W,H),D=id.data;
      const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
      const RM=M.map(mm=>({...mm,rc:mm.ramp.map(hex)}));const lvl=new Int8Array(N).fill(-1);
      const hash=(a,b)=>{let h=Math.imul(a*374761393+b*668265263,1274126177);h^=h>>>13;return((h>>>0)%10000)/10000;};
      for(let i=0;i<N;i++){const m=mat[i];if(m<0)continue;const MM=RM[m],x=i%W,y=(i/W)|0;let a=nx[i],b=ny[i],cz=nz[i];
        if(MM.tex==='bark'){const gr=Math.sin(vv[i]*1.9+hash(Math.floor(uu[i]/3),m)*4)*.55;a+=gr*.32;b+=gr*.12;}
        if(MM.tex==='rock'){const cs=Math.max(2,(MM.cs||5)*sc),gx=Math.floor(x/cs),gy=Math.floor(y/cs);let d1=1e9,d2=1e9,cid=0;
          for(let j=-1;j<=1;j++)for(let k=-1;k<=1;k++){const cx=(gx+j+hash(gx+j,gy+k))*cs,cy=(gy+k+hash(gy+k+7,gx+j+3))*cs,d=Math.hypot(x-cx,y-cy);if(d<d1){d2=d1;d1=d;cid=(gx+j)*131+(gy+k);}else if(d<d2)d2=d;}
          a+=(hash(cid,1)-.5)*.6;b+=(hash(cid,2)-.5)*.6;if(d2-d1<1.1){cz*=.45;}}
        if(MM.tex==='scale'){const cw=Math.max(3,(MM.cs||4)*sc),ch=cw*.75,row=Math.floor(y/ch),off=(row&1)?cw/2:0,lx=((x+off)%cw)-cw/2+.5,ly=(y%ch)+.5,d=Math.hypot(lx,ly)/cw;a+=lx/cw*.35;b+=(ly/ch-.5)*.25;if(d>.5&&d<.68)cz*=.72;}
        if(MM.tex==='leaf'){const q=hash(x>>1,y>>1);a+=(q-.5)*.6;b+=(hash(y>>1,x>>1)-.5)*.6;}
        const l=Math.hypot(a,b,cz)||1;let s=(a*L[0]+b*L[1]+cz*L[2])/l;s=Math.max(0,s);s=(opt.soft!=null?opt.soft:.36)+s*(1-(opt.soft!=null?opt.soft:.36))*.92+(MM.bias||0);
        if(opt.dither){const bay=[[0,2],[3,1]][y&1][x&1]/4-.375;s+=bay*.09;}
        lvl[i]=Math.max(0,Math.min(MM.rc.length-1,Math.floor(s*MM.rc.length)));}
      // sombras de contacto: la parte de atrás se oscurece junto a la de adelante
      const lv2=Int8Array.from(lvl);
      for(let i=0;i<N;i++){if(mat[i]<0)continue;const x=i%W;for(const j of [i-1,i+1,i-W,i+W]){if(j<0||j>=N||(j===i-1&&x===0)||(j===i+1&&x===W-1))continue;if(mat[j]>=0&&pid[j]!==pid[i]&&zo[j]>zo[i]+.01){lv2[i]=Math.max(0,lvl[i]-1);break;}}}
      for(let i=0;i<N;i++){if(mat[i]<0)continue;const col=RM[mat[i]].rc[lv2[i]];D[i*4]=col[0];D[i*4+1]=col[1];D[i*4+2]=col[2];D[i*4+3]=255;}
      // contorno selectivo: oscuro del material vecino
      const OUT=hex(opt.outline||'#120a14');
      for(let i=0;i<N;i++){if(mat[i]>=0)continue;const x=i%W;let nb=-1;for(const j of [i-1,i+1,i-W,i+W]){if(j<0||j>=N||(j===i-1&&x===0)||(j===i+1&&x===W-1))continue;if(mat[j]>=0){nb=j;break;}}
        if(nb<0)continue;const d=RM[mat[nb]].rc[0];D[i*4]=(d[0]*.45+OUT[0]*.55)|0;D[i*4+1]=(d[1]*.45+OUT[1]*.55)|0;D[i*4+2]=(d[2]*.45+OUT[2]*.55)|0;D[i*4+3]=255;}
      for(const [x,y,colr] of em){if(x<0||y<0||x>=W||y>=H)continue;const i=y*W+x,cc=hex(colr);D[i*4]=cc[0];D[i*4+1]=cc[1];D[i*4+2]=cc[2];D[i*4+3]=255;}
      g.putImageData(id,0,0);return c;},
    matAt(x,y){x=Math.round(Z(x));y=Math.round(Z(y));if(x<0||y<0||x>=W||y>=H)return -1;return mat[y*W+x];}
  };return o;}

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
// ---------------- TROLL ----------------
function troll9(ph,r){const o=PXR(84,86),S=0,HR=1,LT=2,WD=3,BN=4,V=5,M=M9('troll','hair','leather',{ramp:RP.wood,tex:'bark'},'bone','void');
  const s=Math.sin(ph),bb=Math.round(Math.abs(s)*2),y=-bb,la=Math.round(s*3);r=r||0;
  o.cap(32,60+y,28,72-(la>0?2:0),7,6,S,2);o.blob(28,79-(la>0?2:0),8,4,S,2.1);o.cap(28,72-(la>0?2:0),28,78-(la>0?2:0),6,6,S,2);
  o.cap(52,60+y,56,72-(la<0?2:0),7,6,S,1.5);o.blob(56,79-(la<0?2:0),8,4,S,1.6);o.cap(56,72-(la<0?2:0),56,78-(la<0?2:0),6,6,S,1.5);
  o.blob(42,47+y,20,17,S,3);o.blob(42,52+y,14,10,S,3.1);
  o.poly([[26,58+y],[58,58+y],[56,68+y],[42,71+y],[28,68+y]],LT,3.3,2);
  o.blob(26,33+y,10,8,S,3.6,.35);o.blob(58,33+y,10,8,S,3.6,-.35);
  // collar de huesos con piedra
  for(let k=0;k<7;k++)o.blob(32+k*3.3,35+y+Math.abs(k-3)*.9,1.3,1.8,BN,3.8);o.blob(42,40+y,2.6,2.6,BN,3.9);
  const ua=r;const arm=(dir,z)=>{const shx=42+dir*20,shy=34+y,ex=shx+dir*(8-6*ua),ey=shy+14-24*ua,hx=shx+dir*(6-12*ua),hy=shy+30-50*ua+(1-ua)*Math.round(dir*s*3);
    o.cap(shx,shy,ex,ey,8.5,7,S,z);o.cap(ex,ey,hx,hy,7,6,S,z+.1);o.blob(hx,hy,6,5,S,z+.2);return [hx,hy];};
  const hL=arm(-1,4),hR=arm(1,4);
  if(ua>.5){const cx=(hL[0]+hR[0])/2,cy=Math.min(hL[1],hR[1])+2;o.cap(cx-16,cy,cx+10,cy-5,3.2,3.2,WD,5);o.blob(cx+13,cy-6,7,6,WD,5.1);for(const [dx,dy] of [[2,-5],[-3,-3],[6,0],[1,4]])o.poly([[cx+13+dx-1,cy-6+dy],[cx+13+dx+1,cy-6+dy],[cx+13+dx*1.5,cy-6+dy*1.5]],BN,5.2,1);}
  else{o.cap(hL[0],hL[1],hL[0]-6,hL[1]+16,2.8,3,WD,4.5);o.blob(hL[0]-7,hL[1]+19,6,5,WD,4.6);for(const [dx,dy] of [[-4,-2],[3,1],[-1,4]])o.poly([[hL[0]-7+dx-1,hL[1]+19+dy],[hL[0]-7+dx+1,hL[1]+19+dy],[hL[0]-7+dx*1.6,hL[1]+19+dy*1.6]],BN,4.7,1);}
  // cabeza hundida con melena y colmillos
  o.blob(42,23+y,12.5,9.5,HR,4.9);o.cap(31,22+y,30,31+y,3,1.6,HR,4.95);o.cap(53,22+y,54,31+y,3,1.6,HR,4.95);o.blob(42,25+y,9,8,S,5);for(const [x0,x1,y1] of [[38,36,13],[42,42,12],[46,48,13]])o.cap(x0,18+y,x1,y1+y,1.8,.6,HR,5.2);o.cap(36,21.5+y,48,21.5+y,1.5,1.5,S,5.3);
  o.blob(42,27+y,3.4,2.4,S,5.4);
  o.glow(38,24+y,'#d93838');o.glow(39,24+y,'#ff8a6a');o.glow(45,24+y,'#d93838');o.glow(46,24+y,'#ff8a6a');
  o.poly([[37,30+y],[39,30+y],[38,26+y]],BN,5.5,1);o.poly([[45,30+y],[47,30+y],[46,26+y]],BN,5.5,1);
  o.glow(42,40+y,'#ff8a22');o.glow(41,39+y,'#ffe25a');
  return {c:o.render(M,{soft:.36}),gem:[42,40+y]};}
// ---------------- NIGROMANTE ----------------
function lich9(ph,r){const o=PXR(76,86),RB=0,GD=1,BN=2,WD=3,V=4,M=M9('lrobe','gold','bone','wood','void');
  const up=Math.round(Math.sin(ph)*3),sw=Math.round(Math.sin(ph*2)*2);r=r||0;
  for(const [x,d] of [[33,sw],[42,-sw]]){o.cap(x+d,64-up,x+d,76-up,1.1,1,BN,1);o.blob(x+d+.5,77-up,2.2,1,BN,1.1);}
  o.poly([[29,24-up],[47,24-up],[56,70-up],[50,68-up],[46,72-up],[40,69-up],[36,72-up],[30,68-up],[24,72-up],[20,70-up]],RB,2,3);
  o.cap(38,26-up,38,60-up,9,15,RB,2.1);
  o.poly([[32,30-up],[44,30-up],[42,48-up],[34,48-up]],V,2.5,1);o.cap(38,31-up,38,47-up,.8,.8,BN,2.6);for(let i=0;i<4;i++){o.cap(34,32+i*3-up,37,32+i*3-up,.6,.6,BN,2.7);o.cap(39,32+i*3-up,42,32+i*3-up,.6,.6,BN,2.7);}
  o.cap(31.5,30-up,33.5,48-up,.7,.7,GD,2.8);o.cap(44.5,30-up,42.5,48-up,.7,.7,GD,2.8);
  o.blob(24,28-up,6,4,BN,3);o.blob(52,28-up,6,4,BN,3);
  const arm=(dir,z)=>{const shx=38+dir*14,shy=30-up,ex=shx+dir*(5-3*r),ey=shy+12-20*r,hx=shx+dir*(4-8*r),hy=shy+22-36*r;o.cap(shx,shy,ex,ey,3,2.6,RB,z);o.cap(ex,ey,hx,hy,2.6,2,RB,z+.1);o.blob(hx,hy+1,2,1.6,BN,z+.2);return [hx,hy];};
  const hL=arm(-1,3.5),hR=arm(1,3.5);
  if(r>.5){const cx=(hL[0]+hR[0])/2,cy=Math.min(hL[1],hR[1])-6;for(let a=0;a<TAU9;a+=.4)for(let rr=0;rr<5*r;rr++)o.glow(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,rr<1.5?'#ffffff':rr<3?'#bfffc8':'#2ab84a');}
  else{o.cap(hR[0],hR[1]-24,hR[0],hR[1]+14,.9,.9,WD,3.6);o.blob(hR[0]+1,hR[1]-29,4,4,BN,3.7);o.blob(hR[0]+2.2,hR[1]-30,2.8,2.8,V,3.75);
    for(const [dx,dy,c] of [[1,-29,'#ffffff'],[0,-29,'#7aff8a'],[1,-28,'#7aff8a'],[0,-28,'#2ab84a']])o.glow(hR[0]+dx,hR[1]+dy,c);}
  o.blob(38,18-up,11,11,RB,5);o.blob(38,19-up,8.4,8.4,GD,5.1);o.blob(38,20-up,7.4,7.4,V,5.2);o.blob(38,21-up,6,6,BN,5.3);
  o.blob(35.5,20.5-up,1.4,1.4,V,5.4);o.blob(40.5,20.5-up,1.4,1.4,V,5.4);o.glow(35,20-up,'#7aff8a');o.glow(40,20-up,'#7aff8a');o.glow(38,23-up,'#6a6250');
  for(const x of [36,37,38,39,40])o.glow(x,25-up,x%2?'#3a3428':'#c8c2ae');
  o.glow(38,40-up,'#7aff8a');o.glow(37,39-up,'#ffffff');
  return {c:o.render(M,{soft:.36}),gem:[38,40-up]};}
// ---------------- DEMONIO ----------------
function demon9(ph,r){const o=PXR(84,86),S=0,H=1,C=2,WD=3,WG=4,V=5,AR=6,TR=7,M=[{ramp:RP.skinR},{ramp:RP.horn},{ramp:RP.cloth},{ramp:RP.wood,tex:'bark'},{ramp:RP.wing},{ramp:RP.void},{ramp:RP.iron},{ramp:RP.trim}];
  const s=Math.sin(ph||0),bb=Math.round(Math.abs(s)*2),y=-bb,la=Math.round(s*2);r=r||0;
  o.poly([[30,30+y],[8,14+y],[4,34+y],[12,48+y],[26,42+y]],WG,0,3);o.poly([[54,30+y],[76,14+y],[80,34+y],[72,48+y],[58,42+y]],WG,0,3);
  o.cap(30,30+y,8,14+y,1.6,1.2,WG,.1);o.cap(54,30+y,76,14+y,1.6,1.2,WG,.1);
  o.cap(30,58+y,16,66,3,2,S,.5);o.cap(16,66,10,58,2,1.4,S,.5);o.poly([[10,58],[6,52],[13,55]],S,.6,1);
  o.cap(34,58+y,28,68-(la>0?2:0),7,5.5,S,2);o.cap(28,68-(la>0?2:0),30,80-(la>0?2:0),5.5,4.5,S,2);o.blob(30,81-(la>0?2:0),6,3,H,2.1);
  o.cap(50,58+y,56,68-(la<0?2:0),7,5.5,S,1.5);o.cap(56,68-(la<0?2:0),54,80-(la<0?2:0),5.5,4.5,S,1.5);o.blob(55,81-(la<0?2:0),6,3,H,1.6);
  o.poly([[30,54+y],[54,54+y],[52,66+y],[42,70+y],[32,66+y]],C,2.5,2);
  o.cap(42,56+y,42,36+y,10,13,S,3);o.blob(35,36+y,7,6,S,3.3);o.blob(49,36+y,7,6,S,3.3);
  o.blob(28,33+y,7,6,S,3.6,.4);o.blob(56,33+y,7,6,S,3.6,-.4);
  o.poly([[31,34+y],[53,34+y],[55,44+y],[50,55+y],[42,58+y],[34,55+y],[29,44+y]],AR,3.8,3);
  o.poly([[31,34+y],[53,34+y],[52,37+y],[32,37+y]],TR,3.85,1);o.poly([[34,55+y],[42,58+y],[50,55+y],[49,53+y],[42,56+y],[35,53+y]],TR,3.85,1);o.cap(42,38+y,42,54+y,.8,.8,TR,3.86);
  for(const dir of [-1,1]){const hx=42+dir*15;o.blob(hx,31+y,7.5,5,AR,4.8,dir*-.3);o.poly([[hx-2,27+y],[hx+2,27+y],[hx+dir*5,19+y]],H,4.9,1);o.poly([[hx+dir*3,29+y],[hx+dir*6,28+y],[hx+dir*10,23+y]],H,4.9,1);}
  const ua=r*1.2,aw=Math.round(s*2);
  o.cap(27,34+y,20,47+y-ua*14+aw,6,5,S,4);o.cap(20,47+y-ua*14+aw,18,58+y-ua*30+aw,5,4,S,4.1);o.blob(18,60+y-ua*31+aw,4,3.5,S,4.2);
  for(const d of [-3,0,3])o.cap(18+d,62+y-ua*31+aw,18+d*1.3,67+y-ua*31+aw,1.3,.6,H,4.3);
  o.cap(57,34+y,63,46+y,6,5,S,4);o.cap(63,46+y,64,56+y,5,4,S,4.1);
  const ty=y+8;o.cap(66,8+ty,66,82,1.8,1.8,WD,4.4);o.blob(64,57+y,4.2,3.6,S,4.5);
  o.poly([[59,14+ty],[73,14+ty],[73,17+ty],[59,17+ty]],H,4.6,1);for(const x of [59,66,73])o.poly([[x-1.5,15+ty],[x+1.5,15+ty],[x,3+ty]],H,4.7,1);
  o.blob(42,24+y,7,7,S,5);o.blob(42,29+y,5,3.5,S,5.1);o.blob(42,28+y,3.8,2.6,S,5.25);
  o.cap(36,20+y,26,16+y,2.8,2.2,H,5.2);o.cap(26,16+y,22,6+y,2.2,1,H,5.2);o.cap(48,20+y,58,16+y,2.8,2.2,H,5.2);o.cap(58,16+y,62,6+y,2.2,1,H,5.2);
  for(let k=0;k<=8;k++){const t=k/8,cx=33+18*t,cy=35+y+Math.round(5*Math.sin(t*Math.PI));o.glow(cx,cy,k%2?'#8a7a6a':'#c8b8a0');}
  o.blob(42,42+y,4.6,4.6,TR,5.4);o.blob(42,42+y,3.4,3.4,AR,5.45);
  const PS=[];for(let k=0;k<5;k++){const a=Math.PI/2+k*2*Math.PI/5;PS.push([42+Math.cos(a)*2.9,42+y+Math.sin(a)*2.9]);}
  for(let k=0;k<5;k++){const A=PS[k],Bp=PS[(k+2)%5],n=6;for(let j=0;j<=n;j++)o.glow(A[0]+(Bp[0]-A[0])*j/n,A[1]+(Bp[1]-A[1])*j/n,'#ff5a2a');}o.glow(42,42+y,'#ffd541');
  for(const [x,c] of [[38,'#ffd541'],[39,'#ffffff'],[45,'#ffd541'],[46,'#ffffff']])o.glow(x,23+y,c);
  o.glow(40,28+y,'#1a0608');o.glow(44,28+y,'#1a0608');o.glow(40,27+y,'#3a0c12');o.glow(44,27+y,'#3a0c12');
  for(const [x,yy,c] of [[41,29,'#c08a1c'],[43,29,'#c08a1c'],[40,30,'#ffd541'],[44,30,'#ffd541'],[40,31,'#ffd541'],[44,31,'#c08a1c'],[41,32,'#fff3b0'],[42,32,'#ffd541'],[43,32,'#c08a1c']])o.glow(x,yy+y,c);
  for(const [x,h] of [[59,6],[66,8],[73,6]])for(let k=0;k<h;k++)for(let w=-1;w<=1;w++){if(Math.abs(w)>(h-k)/3)continue;const yy=3+ty-k,xx=x+w+(k>h*.6?((k+x)%2?1:-1):0);o.glow(xx,yy,k<2?'#ffffff':k<h*.45?'#ffd541':'#fa6a0a');}
  if(r>.6){const fx=18,fy=50+y-ua*31+aw;for(let k=0;k<9;k++)for(let w=-2;w<=2;w++){if(Math.abs(w)>(9-k)/3)continue;o.glow(fx+w,fy-k,k<3?'#ffffff':k<6?'#ffd541':'#fa6a0a');}}
  return {c:o.render(M,{soft:.36}),gem:[42,42+y]};}

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
  const boss=fn=>{const dw=cyc(4,f=>fn(f/4*TAU9,0)),dr=cyc(5,f=>fn(0,f/4));
    return {walk:sheet9(dw.map(d=>d.c),{mxs:dw.map(d=>d.gem[0]),mys:dw.map(d=>d.gem[1]),shw:.3}),raise:sheet9(dr.map(d=>d.c),{mxs:dr.map(d=>d.gem[0]),mys:dr.map(d=>d.gem[1]),shw:.3})};};
  out.bosses=[boss(troll9),boss(dragon10),boss(lich9),boss(demon9)];
  return out;}

// dragon10.js — dragón cuadrúpedo, alas rasgadas, cabeza en cuña con fauces y fuego
const DPAL={
  obsidiana:{sc:['#0e0c12','#1a1620','#2a2432','#3c3446','#544a5e','#6e6278'],bl:['#1e100a','#34200e','#4e3014','#6a441c','#865a26'],wg:['#1a0608','#2e0c10','#4a1218','#681c22','#86282c'],hn:['#2a2420','#4a4038','#76695a','#a8987e','#d2c4a4'],eye:['#ff6a00','#ffd23a'],fire:['#fa6a0a','#ffd541','#ffffff']},
  veneno:{sc:['#081410','#10241c','#183a2a','#22543a','#34724c','#4e9460'],bl:['#1e1e0c','#323214','#4a4a1e','#64622a','#7e7c38'],wg:['#100c1a','#1c1630','#2c2248','#3e3062','#52427c'],hn:['#2a2420','#4a4038','#76695a','#a8987e','#d2c4a4'],eye:['#7aff2a','#e8ff9a'],fire:['#3ad84a','#b8ff6a','#f4ffe0']},
  carmesi:{sc:['#1a060a','#300a12','#4c1018','#6e1a20','#922a28','#b44434'],bl:['#2a1a0c','#443014','#5e461e','#7a5e2a','#987838'],wg:['#12080c','#22101a','#341a28','#4a2438','#5e3048'],hn:['#1a1418','#2e262c','#4a4048','#6e646a','#948a8c'],eye:['#ffd23a','#fff4b0'],fire:['#fa6a0a','#ffd541','#ffffff']},
};
function dragon10(ph,r,pal){pal=DPAL[pal||'obsidiana'];r=r||0;
  const o0=PXR(104,94),DY=6,o={cap:(a,b,c,d,e,f,g,h)=>o0.cap(a,b+DY,c,d+DY,e,f,g,h),blob:(a,b,c,d,e,f,g)=>o0.blob(a,b+DY,c,d,e,f,g),poly:(P,m,z,bv)=>o0.poly(P.map(q=>[q[0],q[1]+DY]),m,z,bv),glow:(a,b,c)=>o0.glow(a,b+DY,c),render:(M,op)=>o0.render(M,op)},S=0,BL=1,WG=2,HN=3,V=4,M=[{ramp:pal.sc,tex:'scale',cs:4},{ramp:pal.bl},{ramp:pal.wg},{ramp:pal.hn},{ramp:['#060406','#0e080a','#160c0e']}];
  const s=Math.sin(ph||0),c=Math.cos(ph||0),bb=Math.round(Math.abs(s)*1.5),y=-bb-Math.round(r*2);
  const la=r>0?0:Math.round(s*3),wf=Math.round(c*2)+Math.round(r*4),CX=52;
  const H=y+Math.round(Math.sin((ph||0)+.6))-Math.round(r*4),HY=18+H,jo=r>.4?Math.round((r-.4)*7):0;
  const [F1,F2,F3]=pal.fire;
  // ---- alas rasgadas
  for(const d of [-1,1]){const rx=CX+d*13,ry=36+y,ex=CX+d*30,ey=19+y-wf,wx=CX+d*45,wy=9+y-wf*1.3;
    const tips=[[CX+d*51,33+y-wf*.6],[CX+d*48,48+y-wf*.3],[CX+d*37,58+y],[CX+d*23,56+y]];
    const pts=[[rx,ry],[ex,ey],[wx,wy],tips[0]];
    for(let i=1;i<tips.length;i++){const a=tips[i-1],b=tips[i],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;pts.push([mx+(wx-mx)*.24,my+(wy-my)*.24],b);}
    pts.push([CX+d*14,48+y]);o.poly(pts,WG,0,3);
    o.cap(rx,ry,ex,ey,2.8,2,S,.2);o.cap(ex,ey,wx,wy,2,1.4,S,.2);
    for(const t of tips)o.cap(wx,wy,t[0],t[1],1,.5,S,.15);
    o.poly([[wx-1.4,wy+1],[wx+1.4,wy+1],[wx+d*2,wy-6]],HN,.3,1);o.poly([[ex-1.2,ey+1],[ex+1.2,ey+1],[ex+d*1,ey-4]],HN,.3,1);}
  // ---- cola con púa
  const tw=Math.round(s*2);
  o.cap(CX+12,66+y,CX+30,74,4.6,3,S,.6);o.cap(CX+30,74,CX+42,66+tw,3,2,S,.6);o.cap(CX+42,66+tw,CX+45,54+tw,2,1.2,S,.6);
  o.poly([[CX+43,56+tw],[CX+48,55+tw],[CX+46,47+tw]],HN,.7,1);for(const [tx,ty] of [[CX+22,70],[CX+34,71],[CX+41,62+tw]])o.poly([[tx-1.2,ty-2],[tx+1.2,ty-2],[tx,ty-5]],HN,.65,1);
  // ---- patas traseras
  for(const d of [-1,1]){o.blob(CX+d*13,66+y,6,7,S,1);o.cap(CX+d*13,70+y,CX+d*12,80,4,3.4,S,1);o.blob(CX+d*12,82,5,2.4,S,1.1);}
  // ---- lomo y púas dorsales
  o.blob(CX,46+y,16,8,S,2.4);for(const [dx,h] of [[-12,4],[-8,6],[8,6],[12,4]])o.poly([[CX+dx-2,40+y],[CX+dx+2,40+y],[CX+dx,40+y-h]],HN,2.3,1);
  // ---- torso y vientre con corazón de brasa
  o.blob(CX,57+y,17,13,S,3);
  o.cap(CX,46+y,CX,69+y,5.2,3,BL,3.2);for(let k=48+y;k<68+y;k+=3.2){const hw=5-(k-46-y)*.09;o.cap(CX-hw,k,CX+hw,k,.4,.4,V,3.3);}
  // ---- patas delanteras abiertas con garras en hoz
  for(const d of [-1,1]){const lift=(d<0?la>0:la<0)?Math.abs(la):0;
    o.blob(CX+d*16,48+y,6.5,6.5,S,4);
    const ex=CX+d*27,ey=61+y-lift*.5,fx=CX+d*23,fy=79-lift;
    o.cap(CX+d*17,50+y,ex,ey,5.4,4.3,S,4.1);o.cap(ex,ey,fx,fy,4.3,3.5,S,4.2);o.blob(fx,fy+2.5,6,3,S,4.3);
    o.poly([[ex+d*2,ey-3],[ex+d*3,ey+1],[ex+d*8,ey-2]],HN,4.15,1);
    for(const [cx,cl] of [[-4,4],[0,5],[4,4]]){const bx=fx+cx,by=fy+4;o.poly([[bx-1.3,by-1],[bx+1.3,by-1],[bx+(cx<0?-1:cx>0?1:0)*1.5,by+cl]],HN,4.4,1);}}
  // ---- cuello con placas de garganta
  o.cap(CX,48+y,CX,HY+6,8.5,7,S,4.6);
  o.cap(CX,48+y,CX,HY+18,4.6,4,BL,4.7);for(let k=HY+20;k<48+y;k+=3)o.cap(CX-4,k,CX+4,k,.4,.4,V,4.75);
  // ---- cabeza en cuña
  for(const d of [-1,1]){
    o.cap(CX+d*7,HY-4,CX+d*17,HY-10,3,2,HN,5.9);o.cap(CX+d*17,HY-10,CX+d*21,HY-20,2,.6,HN,5.9);
    o.cap(CX+d*4,HY-6,CX+d*9,HY-15,1.8,.6,HN,5.85);
    o.poly([[CX+d*10,HY-1],[CX+d*22,HY+1],[CX+d*10,HY+3]],HN,6.05,1);o.poly([[CX+d*9,HY+4],[CX+d*18,HY+9],[CX+d*8,HY+7]],HN,6.05,1);}
  o.blob(CX,HY,12,8,S,6);
  for(const d of [-1,1]){o.cap(CX+d*10.5,HY-3.5,CX+d*3,HY+.5,2,1.5,S,6.4);o.blob(CX+d*6,HY+1.4,2.8,1.4,V,6.3);}
  // fauces
  o.blob(CX,HY+22+jo,6.8,3.4,S,6.5);
  o.blob(CX,HY+19+jo*.5,5.4,2.3+jo*.6,V,6.6);
  o.blob(CX,HY+9,6.4,8.4,S,6.7);o.blob(CX,HY+15,5.2,2.6,S,6.72);o.cap(CX,HY+3,CX,HY+13,1.2,1.4,S,6.73);o.poly([[CX-1.3,HY+6],[CX+1.3,HY+6],[CX,HY+1]],HN,6.75,1);
  for(const d of [-1,1]){o.poly([[CX+d*3.2,HY+17.5],[CX+d*5.2,HY+17.5],[CX+d*4.2,HY+24+jo*.5]],HN,6.8,1);o.poly([[CX+d*1.4,HY+23+jo],[CX+d*3,HY+23+jo],[CX+d*2.2,HY+19+jo*.6]],HN,6.8,1);
    o.cap(CX+d*4.5,HY+5,CX+d*6.5,HY+12,.8,.6,HN,6.74);}
  for(const x of [-2,0,2])o.glow(CX+x,HY+18,pal.hn[4]);
  const gl=r>.4?3:1;for(let x=-gl;x<=gl;x++)o.glow(CX+x,HY+20+jo*.5,Math.abs(x)<gl?F2:F1);
  // ojos rasgados furiosos
  for(const d of [-1,1]){o.glow(CX+d*8,HY,pal.eye[0]);o.glow(CX+d*7,HY+1,pal.eye[1]);o.glow(CX+d*6,HY+1,pal.eye[1]);o.glow(CX+d*5,HY+2,pal.eye[0]);}
  // fosas y humo
  o.glow(CX-2,HY+15,'#000000');o.glow(CX+2,HY+15,'#000000');
  if(r<.4){const f=Math.round(((ph||0)/(Math.PI*2))*4)%4;for(const d of [-1,1])for(let k=0;k<3;k++){const sy=HY+12-k*2-f,sx=CX+d*(3+k+(f>>1));o.glow(sx,sy,k?'#6a6070':'#8a8090');}}
  // corazón de brasa (punto del cristal)
  const hx=CX,hy2=58+y;o.glow(hx,hy2,F2);for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])o.glow(hx+dx,hy2+dy,F1);
  // aliento de fuego
  if(r>.7){const fr=3+9*(r-.7)/.3,fx=CX,fy=HY+24+jo+fr*.55;
    for(let yy=-fr;yy<=fr;yy++)for(let xx=-fr*1.2;xx<=fr*1.2;xx++){const d=Math.hypot(xx/1.2,yy);if(d>fr)continue;const n=Math.sin(xx*1.7+yy*2.3)*.12;o.glow(fx+xx,fy+yy,d<fr*(.35+n)?F3:d<fr*(.68+n)?F2:F1);}
    for(const [dx,h] of [[-fr,6],[fr,6],[-fr*.5,9],[fr*.5,9]])for(let k=0;k<h;k++)o.glow(fx+dx+(k%2?1:0),fy+fr*.6+k,k<h/2?F2:F1);}
  return {c:o.render(M,{soft:.3}),gem:[hx,hy2+DY]};}
