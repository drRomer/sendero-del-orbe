/* ---------- Fuente de píxeles 5x7 (textos del mundo) ---------- */
const GLY={A:[14,17,17,31,17,17,17],B:[30,17,17,30,17,17,30],C:[14,17,16,16,16,17,14],D:[28,18,17,17,17,18,28],E:[31,16,16,30,16,16,31],F:[31,16,16,30,16,16,16],G:[14,17,16,23,17,17,15],H:[17,17,17,31,17,17,17],I:[14,4,4,4,4,4,14],J:[7,2,2,2,2,18,12],K:[17,18,20,24,20,18,17],L:[16,16,16,16,16,16,31],M:[17,27,21,21,17,17,17],N:[17,17,25,21,19,17,17],'Ñ':[14,0,17,25,21,19,17],O:[14,17,17,17,17,17,14],P:[30,17,17,30,16,16,16],Q:[14,17,17,17,21,18,13],R:[30,17,17,30,20,18,17],S:[15,16,16,14,1,1,30],T:[31,4,4,4,4,4,4],U:[17,17,17,17,17,17,14],V:[17,17,17,17,17,10,4],W:[17,17,17,21,21,21,10],X:[17,17,10,4,10,17,17],Y:[17,17,17,10,4,4,4],Z:[31,1,2,4,8,16,31],
  '0':[14,17,19,21,25,17,14],'1':[4,12,4,4,4,4,14],'2':[14,17,1,2,4,8,31],'3':[31,2,4,2,1,17,14],'4':[2,6,10,18,31,2,2],'5':[31,16,30,1,1,17,14],'6':[6,8,16,30,17,17,14],'7':[31,1,2,4,8,8,8],'8':[14,17,17,14,17,17,14],'9':[14,17,17,15,1,2,12],
  '+':[0,4,4,31,4,4,0],'-':[0,0,0,31,0,0,0],'−':[0,0,0,31,0,0,0],'×':[0,17,10,4,10,17,0],'÷':[0,4,0,31,0,4,0],'!':[4,4,4,4,4,0,4],'¡':[4,0,4,4,4,4,4],'?':[14,17,1,2,4,0,4],'¿':[4,0,4,8,16,17,14],'.':[0,0,0,0,0,12,12],',':[0,0,0,0,12,4,8],':':[0,12,12,0,12,12,0],'/':[0,1,2,4,8,16,0],'%':[24,25,2,4,8,19,3],"'":[4,4,8,0,0,0,0],'·':[0,0,0,12,12,0,0],' ':[0,0,0,0,0,0,0]};
const GNORM={'Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U','Ü':'U'};
const FCACHE={};
function glyphAtlas(col){let o=FCACHE[col];if(o)return o;const keys=Object.keys(GLY),c=mk(keys.length*6,7),g=c.getContext('2d');g.fillStyle=col;
  keys.forEach((k,i)=>{const r=GLY[k];for(let y=0;y<7;y++)for(let x=0;x<5;x++)if(r[y]&(16>>x))g.fillRect(i*6+x,y,1,1);});
  o={c,idx:{}};keys.forEach((k,i)=>o.idx[k]=i);FCACHE[col]=o;return o;}
// texto pixelado: s = escala entera; centrado salvo align
function ptextG(g,t,x,y,s,col,ol,align){t=String(t).toUpperCase();s=Math.max(1,s|0);
  const w=(t.length*6-1)*s,x0=Math.round(align==='left'?x:align==='right'?x-w:x-w/2),y0=Math.round(y-3.5*s);
  const draw=(A,dx,dy)=>{for(let i=0;i<t.length;i++){const ch=GNORM[t[i]]||t[i],k=A.idx[ch];if(k==null)continue;g.drawImage(A.c,k*6,0,5,7,x0+i*6*s+dx,y0+dy,5*s,7*s);}};
  if(ol!==false){const O=glyphAtlas(ol||'#120c18');for(const d of [[-1,0],[1,0],[0,-1],[0,1],[1,1]])draw(O,d[0],d[1]);}
  draw(glyphAtlas(col),0,0);return w;}
function ptext(t,x,y,s,col,ol,align){return ptextG(ctx,t,x,y,s,col,ol,align);}
function otext(t,x,y,fs,fill,stroke){return ptext(t,x,y,clamp(Math.round(fs/13),1,4),fill,stroke||'#120c18');}
