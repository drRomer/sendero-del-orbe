"""Une shell + sprites + juego en un solo HTML.
Uso: python3 build.py [--publish]   → index.html (versión artifact de claude.ai)
La versión web (PWA) se genera con build_web.py, que reutiliza compose()."""
import sys,re,os,base64
HERE=os.path.dirname(os.path.abspath(__file__))
PX2=['pxr9_part.js','chars9.js','dragon10.js','bosses10.js','units10.js','guard10.js']
def rd(*p):return open(os.path.join(HERE,*p),encoding='utf-8').read()
def compose(pub):
    head=rd('shell.html')
    head=head.replace('__LOGO__','data:image/webp;base64,'+base64.b64encode(open(os.path.join(HERE,'assets','logo.webp'),'rb').read()).decode())
    spr=rd('sprites8.js').replace("if(typeof module!=='undefined')module.exports=Sprites8;","")
    spr+='\n'+''.join(rd('px2',f)+'\n' for f in PX2)
    game=rd('game.js')
    if pub: game=re.sub(r"// TEST-HOOK-START.*?// TEST-HOOK-END\n","",game,flags=re.S)
    return head+'<script>\n'+spr+'\n</script>\n<script>\n'+game+'\n</script>\n</body>\n</html>\n'
if __name__=='__main__':
    pub='--publish' in sys.argv
    out=compose(pub)
    open(os.path.join(HERE,'index.html'),'w',encoding='utf-8').write(out); print('index.html',len(out.encode()),'publish' if pub else 'dev')
