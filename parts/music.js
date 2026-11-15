/* ---------- Música chiptune: un tema por ambiente y uno del jefe ---------- */
const MUS={on:false,next:0,step:0,timer:null,tr:-1};
const TRACKS=[
  {bpm:128,mel:[69,72,76,74,72,71,69,64, 65,69,72,71,69,67,64,0, 69,72,76,79,77,76,74,72, 71,67,64,67,69,0,69,0],bas:[45,45,40,40, 41,41,40,40, 45,45,48,48, 43,43,45,45],lead:'square'},
  {bpm:112,mel:[62,65,69,72,71,69,67,69, 65,67,69,74,72,69,67,64, 62,65,69,71,72,74,76,74, 72,69,65,67,69,0,62,0],bas:[38,38,48,48, 43,43,45,45, 38,38,41,41, 43,43,45,45],lead:'square'},
  {bpm:100,mel:[64,67,71,76,74,71,67,71, 72,76,79,76,71,67,64,67, 69,72,76,72,71,67,62,67, 64,67,71,67,64,0,0,0],bas:[40,40,40,40, 48,48,48,48, 45,45,47,47, 40,40,40,40],lead:'triangle'},
  {bpm:120,mel:[72,71,72,67,68,67,65,63, 62,63,65,67,68,71,72,0, 72,74,75,74,72,71,68,67, 65,68,71,74,72,0,60,0],bas:[36,36,36,36, 44,44,41,41, 36,36,44,44, 43,43,36,36],lead:'square'},
];
const BOSS_TRACK={bpm:150,mel:[69,69,70,69,67,69,76,74, 72,70,69,67,69,0,69,0, 69,72,76,77,76,74,72,70, 69,67,65,67,69,0,64,0],bas:[45,57,45,57, 46,58,46,58, 43,55,43,55, 45,57,45,57],lead:'square'};
const mf=n=>440*Math.pow(2,(n-69)/12);
function musStart(){if(!AU.ctx||save.muted||MUS.on)return;MUS.on=true;MUS.next=AU.ctx.currentTime+.08;MUS.step=0;MUS.tr=-1;MUS.timer=setInterval(musTick,40);}
function musStop(){MUS.on=false;if(MUS.timer){clearInterval(MUS.timer);MUS.timer=null;}}
function musTick(){const c=AU.ctx;if(!c||save.muted||!MUS.on){musStop();return;}
  const boss=G&&G.phase==='boss',ti=boss?99:(G?(G.lv-1)%TRACKS.length:0),tr=boss?BOSS_TRACK:TRACKS[ti],st=60/tr.bpm/4;
  if(ti!==MUS.tr){MUS.tr=ti;MUS.step=0;}
  while(MUS.next<c.currentTime+.25){const s=MUS.step%64,d=MUS.next-c.currentTime;
    if(s%2===0){const n=tr.mel[s>>1];if(n)tone(mf(n),st*1.6,tr.lead,tr.lead==='triangle'?.05:.018,0,d);}
    if(s%4===0)tone(mf(tr.bas[s>>2]),st*3.2,'triangle',.05,0,d);
    if(s%4===2)noise(.03,.012,6000,'highpass',d);
    if(boss&&s%8===0)noise(.06,.05,180,'lowpass',d);
    MUS.next+=st;MUS.step++;}
}
