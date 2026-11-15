// pxr.js — pintor de pixel art con volumen: primitivas con normales, una luz, rampas de color,
// texturas (vetas, facetas), sombras de contacto y contorno selectivo.
function PXR(W,H){
  const N=W*H,mat=new Int16Array(N).fill(-1),pid=new Int16Array(N).fill(-1),zo=new Float32Array(N).fill(-1e9);
  const nx=new Float32Array(N),ny=new Float32Array(N),nz=new Float32Array(N),uu=new Float32Array(N),vv=new Float32Array(N);
  const em=[];let parts=0;
  const L=(()=>{const x=-.55,y=-.68,z=.62,l=Math.hypot(x,y,z);return [x/l,y/l,z/l];})();
  const put=(i,m,p,z,a,b,c,u,v)=>{if(z<zo[i])return;zo[i]=z;mat[i]=m;pid[i]=p;const l=Math.hypot(a,b,c)||1;nx[i]=a/l;ny[i]=b/l;nz[i]=c/l;uu[i]=u;vv[i]=v;};
  const o={W,H,L,
    // extremidad cónica (cápsula) — m: material, z: orden
    cap(x0,y0,x1,y1,r0,r1,m,z){const p=parts++,dx=x1-x0,dy=y1-y0,ll=dx*dx+dy*dy||1,len=Math.sqrt(ll),R=Math.max(r0,r1)+1;
      const xa=Math.max(0,Math.floor(Math.min(x0,x1)-R)),xb=Math.min(W-1,Math.ceil(Math.max(x0,x1)+R)),ya=Math.max(0,Math.floor(Math.min(y0,y1)-R)),yb=Math.min(H-1,Math.ceil(Math.max(y0,y1)+R));
      for(let y=ya;y<=yb;y++)for(let x=xa;x<=xb;x++){const px=x+.5,py=y+.5;let t=((px-x0)*dx+(py-y0)*dy)/ll;t=t<0?0:t>1?1:t;
        const cx=x0+dx*t,cy=y0+dy*t,r=r0+(r1-r0)*t,ex=px-cx,ey=py-cy,d=Math.hypot(ex,ey);if(d>r)continue;
        const k=d/r,h=Math.sqrt(Math.max(0,1-k*k)),sg=(dx*ey-dy*ex)>=0?1:-1;put(y*W+x,m,p,z,(ex/(d||1))*k,(ey/(d||1))*k,h,t*len,sg*d);}return p;},
    // masa elíptica rotada
    blob(cx,cy,rx,ry,m,z,rot){const p=parts++,c=Math.cos(rot||0),s=Math.sin(rot||0),R=Math.max(rx,ry)+1;
      for(let y=Math.max(0,Math.floor(cy-R));y<=Math.min(H-1,Math.ceil(cy+R));y++)for(let x=Math.max(0,Math.floor(cx-R));x<=Math.min(W-1,Math.ceil(cx+R));x++){
        const px=x+.5-cx,py=y+.5-cy,lx=px*c+py*s,ly=-px*s+py*c,q=(lx/rx)**2+(ly/ry)**2;if(q>1)continue;
        const a=lx/rx,b=ly/ry,h=Math.sqrt(Math.max(0,1-q));put(y*W+x,m,p,z,a*c-b*s,a*s+b*c,h,ly,lx);}return p;},
    // polígono con bisel (cuernos, garras, alas)
    poly(pts,m,z,bev){const p=parts++;bev=bev||2;let xa=1e9,xb=-1e9,ya=1e9,yb=-1e9;for(const q of pts){xa=Math.min(xa,q[0]);xb=Math.max(xb,q[0]);ya=Math.min(ya,q[1]);yb=Math.max(yb,q[1]);}
      for(let y=Math.max(0,Math.floor(ya));y<=Math.min(H-1,Math.ceil(yb));y++)for(let x=Math.max(0,Math.floor(xa));x<=Math.min(W-1,Math.ceil(xb));x++){
        const px=x+.5,py=y+.5;let inside=false,best=1e9,bx=0,by=0;
        for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))inside=!inside;
          const ex=xj-xi,ey=yj-yi,el=ex*ex+ey*ey||1;let t=((px-xi)*ex+(py-yi)*ey)/el;t=t<0?0:t>1?1:t;const qx=xi+ex*t-px,qy=yi+ey*t-py,d=Math.hypot(qx,qy);if(d<best){best=d;bx=-qx/(d||1);by=-qy/(d||1);}}
        if(!inside)continue;const k=Math.min(1,best/bev);put(y*W+x,m,p,z,-bx*(1-k),-by*(1-k),.35+k,px,py);}return p;},
    glow(x,y,col){em.push([Math.round(x),Math.round(y),col]);},
    render(M,opt){opt=opt||{};const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),id=g.createImageData(W,H),D=id.data;
      const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
      const RM=M.map(mm=>({...mm,rc:mm.ramp.map(hex)}));const lvl=new Int8Array(N).fill(-1);
      const hash=(a,b)=>{let h=Math.imul(a*374761393+b*668265263,1274126177);h^=h>>>13;return((h>>>0)%10000)/10000;};
      for(let i=0;i<N;i++){const m=mat[i];if(m<0)continue;const MM=RM[m],x=i%W,y=(i/W)|0;let a=nx[i],b=ny[i],cz=nz[i];
        if(MM.tex==='bark'){const gr=Math.sin(vv[i]*1.9+hash(Math.floor(uu[i]/3),m)*4)*.55;a+=gr*.32;b+=gr*.12;}
        if(MM.tex==='rock'){const cs=MM.cs||5,gx=Math.floor(x/cs),gy=Math.floor(y/cs);let d1=1e9,d2=1e9,cid=0;
          for(let j=-1;j<=1;j++)for(let k=-1;k<=1;k++){const cx=(gx+j+hash(gx+j,gy+k))*cs,cy=(gy+k+hash(gy+k+7,gx+j+3))*cs,d=Math.hypot(x-cx,y-cy);if(d<d1){d2=d1;d1=d;cid=(gx+j)*131+(gy+k);}else if(d<d2)d2=d;}
          a+=(hash(cid,1)-.5)*.6;b+=(hash(cid,2)-.5)*.6;if(d2-d1<1.1){cz*=.45;}}
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
    matAt(x,y){return mat[(y|0)*W+(x|0)];}
  };return o;}
