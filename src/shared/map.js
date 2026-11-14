/* ===== word map: sets along a road like a game map. 3 sets, then a review station (10 questions on those 15 words);
   beside every 2nd review a treasure chest (10 questions with the words in new sentences) that gives a badge.
   Everything unlocks in order. Saved in S.map[track] = {lv:{set:stars}, rv:{review:stars}, ch:{chest:'g'|'s'}} and S.badges. ===== */
const MAP={k:'w',ctx:null,walk:null};
const BADGES=[['rocket','小火箭'],['dino','小恐龙'],['whale','小鲸鱼'],['bolt','闪电'],['crown','皇冠'],['ball','足球'],['volcano','火山'],['planet','小星球'],['bulb','灯泡'],['rainbow','彩虹'],['gem','宝石'],['cup','奖杯']];
const BICON={
rocket:`<path d="M0-30c10 8 14 22 10 38h-20c-4-16 0-30 10-38z" fill="#fff"/><circle cy="-8" r="6" fill="#4fb3ff" stroke="#1d6fb0" stroke-width="2.5"/><path d="M-10 8l-9 10 9-2zM10 8l9 10-9-2z" fill="#e5383b"/><path d="M-6 10q6 16 12 0" fill="#ffc93a"/>`,
dino:`<path d="M-22 14q0-22 22-22h6q4-14 14-12 6 2 4 10-2 5-8 6v12q0 6-6 6h-26q-6 0-6 0z" fill="#22b07d" stroke="#137a54" stroke-width="3"/><circle cx="15" cy="-14" r="2.4" fill="#13112a"/><path d="M-12 -6l3-6 3 6M-3 -8l3-6 3 6" fill="#7fe0b8"/><rect x="-14" y="14" width="7" height="8" rx="2" fill="#137a54"/><rect x="2" y="14" width="7" height="8" rx="2" fill="#137a54"/>`,
whale:`<path d="M-26 4q2-18 24-18 22 0 24 14l8-8-2 12 6 6-12-2q-6 14-24 14-22 0-24-18z" fill="#4fb3ff" stroke="#1d6fb0" stroke-width="3"/><path d="M-24 8q22 10 44 0" stroke="#d6efff" stroke-width="5" fill="none"/><circle cx="-12" cy="-2" r="2.6" fill="#13112a"/><path d="M-8 -16q0-10 4-12M-8 -16q-4-8-10-8" stroke="#9fd7ff" stroke-width="3" fill="none" stroke-linecap="round"/>`,
bolt:`<path d="M6-28l-22 32h14l-6 24 22-32h-14z" fill="#ffc93a" stroke="#c98a00" stroke-width="3" stroke-linejoin="round"/>`,
crown:`<path d="M-24 14l-4-26 14 12 14-20 14 20 14-12-4 26z" fill="#ffc93a" stroke="#c98a00" stroke-width="3" stroke-linejoin="round"/><circle cx="0" cy="4" r="4" fill="#e5383b"/><circle cx="-14" cy="6" r="3" fill="#4fb3ff"/><circle cx="14" cy="6" r="3" fill="#22b07d"/>`,
ball:`<circle r="24" fill="#fff" stroke="#3a3566" stroke-width="3"/><path d="M0-9l9 6-3 10h-12l-3-10z" fill="#2a2650"/><path d="M0-9v-15M9-3l14-5M6 7l9 12M-6 7l-9 12M-9-3l-14-5" stroke="#2a2650" stroke-width="2.5"/>`,
volcano:`<path d="M-28 22l18-30h20l18 30z" fill="#8a5a2b" stroke="#5a3816" stroke-width="3" stroke-linejoin="round"/><path d="M-10-8q5 6 10 0t10 0l-4 8q-6 4-12 0z" fill="#e5603a"/><circle cx="-4" cy="-20" r="5" fill="#ff8a3a"/><circle cx="6" cy="-26" r="4" fill="#ffc93a"/><circle cx="-10" cy="-30" r="3" fill="#ff8a3a"/>`,
planet:`<circle r="17" fill="#8460ea" stroke="#4a2e96" stroke-width="3"/><ellipse rx="30" ry="9" fill="none" stroke="#ffc93a" stroke-width="4" transform="rotate(-18)"/><circle cx="-6" cy="-6" r="4" fill="#a98cff"/>`,
bulb:`<path d="M0-28a18 18 0 0 1 10 33v7h-20v-7a18 18 0 0 1 10-33z" fill="#ffe27a" stroke="#c98a00" stroke-width="3"/><rect x="-9" y="14" width="18" height="8" rx="3" fill="#9a9ab8"/><path d="M-6-4l6 6 6-6" stroke="#c98a00" stroke-width="2.5" fill="none"/>`,
rainbow:`<path d="M-28 16a28 28 0 0 1 56 0" stroke="#e5383b" stroke-width="7" fill="none"/><path d="M-21 16a21 21 0 0 1 42 0" stroke="#ffc93a" stroke-width="7" fill="none"/><path d="M-14 16a14 14 0 0 1 28 0" stroke="#22b07d" stroke-width="7" fill="none"/><path d="M-7 16a7 7 0 0 1 14 0" stroke="#4fb3ff" stroke-width="7" fill="none"/>`,
gem:`<path d="M-22-8l10-14h24l10 14-22 30z" fill="#4fd1e0" stroke="#1d8fa0" stroke-width="3" stroke-linejoin="round"/><path d="M-22-8h44M-12-22l6 14 6-14 6 14 6-14M-6-8l6 30 6-30" stroke="#1d8fa0" stroke-width="2" fill="none"/>`,
cup:`<path d="M-16-24h32v10a16 16 0 0 1-32 0z" fill="#ffc93a" stroke="#c98a00" stroke-width="3"/><path d="M-16-18h-8a8 8 0 0 0 8 10M16-18h8a8 8 0 0 1-8 10" stroke="#c98a00" stroke-width="3" fill="none"/><rect x="-4" y="2" width="8" height="10" fill="#c98a00"/><rect x="-12" y="12" width="24" height="7" rx="2" fill="#c98a00"/><path d="M0-18l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" fill="#fff3c4"/>`};
const KIDSVG=`<g class="kid"><ellipse cx="0" cy="44" rx="20" ry="5" fill="rgba(0,0,0,.35)"/>
<g class="legL"><rect x="-10" y="26" width="7" height="17" rx="3" fill="#ffd9b0" stroke="#c7905e" stroke-width="2"/><rect x="-12" y="40" width="10" height="5" rx="2" fill="#fff" stroke="#999" stroke-width="1.5"/></g>
<g class="legR"><rect x="3" y="26" width="7" height="17" rx="3" fill="#ffd9b0" stroke="#c7905e" stroke-width="2"/><rect x="2" y="40" width="10" height="5" rx="2" fill="#fff" stroke="#999" stroke-width="1.5"/></g>
<path d="M-14 18h28v10a3 3 0 0 1-3 3h-8l-3-4-3 4h-8a3 3 0 0 1-3-3z" fill="#2f6fe0" stroke="#1d47a0" stroke-width="2.5" stroke-linejoin="round"/>
<g class="armL"><path d="M-13 6l-8 10" stroke="#ffd9b0" stroke-width="6" stroke-linecap="round"/><path d="M-14 4l-6 7 4 4 4-5" fill="#e5383b" stroke="#a51d22" stroke-width="2" stroke-linejoin="round"/></g>
<g class="armR"><path d="M13 6l8 10" stroke="#ffd9b0" stroke-width="6" stroke-linecap="round"/><path d="M14 4l6 7-4 4-4-5" fill="#e5383b" stroke="#a51d22" stroke-width="2" stroke-linejoin="round"/></g>
<path d="M-14 4q0-8 8-8h12q8 0 8 8v15h-28z" fill="#e5383b" stroke="#a51d22" stroke-width="2.5"/>
<circle cx="0" cy="-16" r="16" fill="#ffd9b0" stroke="#c7905e" stroke-width="2.5"/>
<path d="M-16.5 -17 C-17 -27 -14 -33 -11 -34 L11 -34 C14 -33 17 -27 16.5 -17 C15 -22 13 -24 10 -24 L-10 -24 C-13 -24 -15 -22 -16.5 -17Z" fill="#2a1a10"/>
<path d="M-12 -34l1.5-3 1.5 3 1.5-3 1.5 3 1.5-3 1.5 3 1.5-3 1.5 3 1.5-3 1.5 3 1.5-3 1.5 3 1.5-3 1.5 3 1.5-3 1.5 3" fill="#2a1a10" stroke="#2a1a10" stroke-width="1.5" stroke-linejoin="round"/>
<circle cx="-6" cy="-14" r="2.5" fill="#2a1a10"/><circle cx="6" cy="-14" r="2.5" fill="#2a1a10"/>
<path d="M-5 -7q5 4 10 0" stroke="#2a1a10" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<circle cx="-10" cy="-9" r="2.5" fill="#ff9a8a" opacity=".6"/><circle cx="10" cy="-9" r="2.5" fill="#ff9a8a" opacity=".6"/></g>`;
const PHR=typeof PPD!=='undefined'&&PPD.length;
/* a track = one map: word cards, or (English) the phrases */
const TR={w:{zh:'单词卡',n:()=>WS.length,name:i=>WS[i].title,learned:i=>!!S.sets[WS[i].title]&&WS[i].words.every(w=>S.wd[w.w]),start:i=>startCards(i)}};
if(PHR)TR.p={zh:'介词词组',n:()=>PPD.length,name:i=>PPD[i].t,learned:i=>!!(S.ppg||{})[PPD[i].t],start:i=>ppCards(i)};
function mapSt(){if(!S.map||typeof S.map!=='object')S.map={};if(!Array.isArray(S.badges))S.badges=[];
  Object.keys(TR).forEach(k=>{const m=S.map[k]||(S.map[k]={});['lv','rv','ch'].forEach(f=>{if(!m[f]||typeof m[f]!=='object')m[f]={};});
    /* first time: sets already learned count as walked, with stars from how well their words are known; reviews between them too */
    if(!m.mig){const T=TR[k],n=T.n();let last=-1;
      for(let i=0;i<n;i++)if(T.learned(i)){last=i;if(m.lv[T.name(i)]==null)m.lv[T.name(i)]=knownStars(k,i);}
      for(let r=0;(r+1)*3<=n;r++)if([0,1,2].every(j=>T.learned(r*3+j))&&last>r*3+2&&m.rv[r]==null)m.rv[r]=0;
      m.mig=1;}});}
function knownStars(k,i){const xs=k==='w'?WS[i].words.map(w=>S.wd[w.w]):PPL.filter(p=>p.g===i).map(p=>(S.pp||{})[p.id]);
  const b=xs.reduce((a,x)=>a+(x?x.box:0),0)/Math.max(1,xs.length);return b>=3?3:b>=1.5?2:1;}
/* the road: [{t:'l',i}|{t:'r',r,sets}] in order; chests hang off every 2nd review */
function road(k){const n=TR[k].n(),L=[];for(let i=0;i<n;i++){L.push({t:'l',i});if((i+1)%3===0)L.push({t:'r',r:(i+1)/3-1,sets:[i-2,i-1,i]});}return L;}
function chestOf(r){return r%2===1?(r-1)/2:-1;}
function nodeDone(k,x){const m=S.map[k];return x.t==='l'?m.lv[TR[k].name(x.i)]!=null:m.rv[x.r]!=null;}
function curIdx(k){const L=road(k);const i=L.findIndex(x=>!nodeDone(k,x));return i<0?L.length:i;}
function mapStars(k){const m=S.map[k];return Object.values(m.lv).concat(Object.values(m.rv)).reduce((a,b)=>a+(+b||0),0);}

/* ---------- questions ---------- */
const SIM=(a,b)=>(a[0]===b[0]?2:0)+(Math.abs(a.length-b.length)<=2?1:0)+(a.slice(-2)===b.slice(-2)?1:0);
function wq(w,type){const others=QB.shuf(WL.filter(x=>x.w!==w.w)),same=others.filter(x=>x.set===w.set),diff=others.filter(x=>x.set!==w.set);
  if(type==='F'){if(/^[a-z]+$/i.test(w.w))return{sp:w,c:'card',t:'Spell it · 拼一拼',wd:w.w};type='C';}
  if(type==='E'&&!((QB.SENT||{})[w.w]))type='D';
  let q,a=w.w,d,hint,say=null,t='Word cards · 单词卡';
  if(type==='A'){q=`What does “${w.w}” mean?`;a=w.zh;d=same.concat(diff).map(x=>x.zh);hint='想想例句：'+w.ex.replace(/\*\*/g,'');}
  else if(type==='B'){q='Listen. Which word do you hear?\n点 Listen 再听一次。';say=w.w;d=others.slice().sort((x,y)=>SIM(w.w,y.w)-SIM(w.w,x.w)).map(x=>x.w);hint='一个音一个音地听，再看拼法。';t='Listen · 听一听';}
  else if(type==='C'){q=`Which word means “${w.def}”?`;d=same.concat(diff).map(x=>x.w);hint='把每个词的意思想一想，哪个最接近？';}
  else{const src=type==='E'?QB.SENT[w.w][Math.random()<.5?0:1]:w.ex;
    const m=/\*\*(.+?)\*\*/.exec(src),cp=!!(m&&/^[A-Z]/.test(m[1]));q='Which word fits in the blank?\n'+src.replace(/\*\*(.+?)\*\*/,'___');
    a=cp?cap1(w.w):w.w;d=(type==='E'?diff:same.concat(diff)).map(x=>cp?cap1(x.w):x.w);hint='把每个词放进去读一读，看句子里的线索词。';if(type==='E')t='In a sentence · 放进句子';}
  const seen=new Set([a]),ds=[];for(const x of d){if(!seen.has(x)){seen.add(x);ds.push(x);}if(ds.length===3)break;}
  const opts=QB.shuf([a,...ds]);
  return{q,p:null,zh:hint,opts,ans:opts.indexOf(a),ex:`**${w.w}** = ${w.zh}（${w.def}）\n例句：${w.ex}`,c:'card',t,l:1,wd:w.w,say};}
/* weakest first: more misses, lower box, then random */
function weakFirst(ws){return ws.map(w=>{const s=S.wd[w.w]||{box:0,bad:0};return{w,k:(s.bad||0)*2+(5-s.box)+Math.random()*1.5};}).sort((a,b)=>b.k-a.k).map(x=>x.w);}
function typeFor(w){const b=(S.wd[w.w]||{box:0}).box;return QB.shuf(b<=1?['A','B']:b===2?['B','C','D']:['D','E','F'])[0];}
function ppWeak(ps){return ps.map(p=>{const s=(S.pp||{})[p.id]||{box:0};return{p,k:(5-s.box)+Math.random()*1.5};}).sort((a,b)=>b.k-a.k).map(x=>x.p);}
function mapRound(mode){let m;
  if((m=/^mlv:(\d+)$/.exec(mode))){const si=+m[1],ws=WS[si].words;if(!S.sets[WS[si].title])S.sets[WS[si].title]=dkey(new Date());
    const qs=QB.shuf(ws).map(w=>wq(w,'A')),more=QB.shuf(ws);qs.push(wq(more[0],'B'),wq(more[1],'C'),wq(more[2],QB.spell?'F':'C'));return qs;}
  if((m=/^mrv:(\w):(\d+)$/.exec(mode))){const k=m[1],r=+m[2];
    if(k==='w'){const ws=[].concat(...[0,1,2].map(j=>WS[r*3+j].words));return weakFirst(ws).slice(0,10).map(w=>wq(w,typeFor(w)));}
    const ps=PPL.filter(p=>Math.floor(p.g/3)===r);return ppWeak(ps).slice(0,10).map(p=>((S.pp||{})[p.id]||{box:0}).box>=2?QB.PPX.sentence(p):QB.PPX.word(p));}
  if((m=/^mch:(\w):(\d+)$/.exec(mode))){const k=m[1],c=+m[2];
    if(k==='w'){const ws=[].concat(...[0,1,2,3,4,5].map(j=>(WS[c*6+j]||{words:[]}).words));return weakFirst(ws).slice(0,10).map(w=>wq(w,'E'));}
    const ps=PPL.filter(p=>Math.floor(p.g/6)===c);return ppWeak(ps).slice(0,10).map(p=>QB.PPX.sentence(p));}
  if(mode==='mrw'){const ws=WL.filter(w=>S.wd[w.w]);let f=0;
    return weakFirst(ws.slice()).slice(0,20).sort(()=>Math.random()-.5).slice(0,10).map(w=>{let t=typeFor(w);if(t==='F'&&++f>2)t='E';return wq(w,t);});}
  return null;}
{const prev=HOOK.round;HOOK.round=mode=>mapRound(mode)||(prev?prev(mode):null);}
/* a review: a word answered wrong comes back at the end (an easier question) until it is right */
HOOK.answer.push((q,ok)=>{if(!R||ok||q.again)return;const rv=/^mrv:(\w):/.exec(R.mode);if(!rv)return;
  let x=null;if(rv[1]==='w'&&q.wd){const w=WL.find(y=>y.w===q.wd);if(w)x=wq(w,'A');}else if(q.pp){x=QB.PPX.word(PPL.find(p=>p.id===q.pp)||q);}
  if(x){x.again=1;R.qs.push(x);}});
HOOK.learnMode=si=>MAP.ctx?'mlv:'+si:'learn:'+si;

/* ---------- result over the map ---------- */
HOOK.finish=(n,s)=>{const mode=R.mode,cx=MAP.ctx;let m;if(cx&&cx.k==='w')tkDay().mnext=1;
  if(mode==='mrw'){tkDay().mrw=1;save();return false;}
  if(!cx||!/^(mlv:|mrv:|mch:|pplearn:)/.test(mode))return false;
  /* only first tries count: a word asked again after a miss is extra */
  const base=R.qs.filter(q=>!q.again).length,ok=R.qs.reduce((a,q,i)=>a+(!q.again&&R.res[i]?1:0),0),st=ok>=base?3:ok>=Math.ceil(base*.75)?2:1,M=S.map[cx.k];
  if(cx.t==='l'){const nm=TR[cx.k].name(cx.i);const was=M.lv[nm]!=null;M.lv[nm]=Math.max(+M.lv[nm]||0,st);if(!was)MAP.walk=cx.idx;}
  else if(cx.t==='r'){const was=M.rv[cx.r]!=null;M.rv[cx.r]=Math.max(+M.rv[cx.r]||0,st);if(!was)MAP.walk=cx.idx;}
  if(cx.t==='c'){const gold=ok>=8,id=cx.k+':'+cx.c;M.ch[cx.c]=gold||M.ch[cx.c]==='g'?'g':'s';
    let b=S.badges.find(x=>x.id===id);if(!b){b={id,b:S.badges.length%BADGES.length,g:gold,d:dkey(new Date())};S.badges.push(b);}else if(gold)b.g=true;
    save();mapOpen(cx.k,true);chestOpen(b,ok,base);return true;}
  save();mapOpen(cx.k,true);mapResult(st,ok,base,cx);return true;};
HOOK.quit=mode=>{if(MAP.ctx&&/^(mlv:|mrv:|mch:|pplearn:)/.test(mode||'')){mapOpen(MAP.ctx.k);return true;}return false;};
HOOK.cardBack=()=>{if(MAP.ctx)mapOpen(MAP.ctx.k);else wordsView();};
function mapBack(){if(MAP.ctx){mapOpen(MAP.ctx.k);return true;}return false;}
function starRow(n,big){return [0,1,2].map(i=>`<span class="mr-s${i<n?' on':''}${big?' big':''}">${STAR}</span>`).join('');}
function mapResult(st,ok,base,cx){const what=cx.t==='l'?TR[cx.k].name(cx.i):'复习';
  $('mRes').innerHTML=`<div class="mr-card"><div class="mr-t">${esc(what)} · 完成！</div><div class="mr-stars">${starRow(st,1)}</div><div class="mr-big">${base} 题对 ${ok} 题</div>
    <div class="mr-sub">${st<3?'再玩一次可以拿 3 颗星':'太棒了，3 颗星！'}</div><div class="mr-btns"><button class="mr-b" id="mrAgain">再玩一次</button><button class="mr-b go" id="mrGo">${cx.t==='l'||cx.t==='r'?'走到下一站 →':'回地图'}</button></div></div>`;
  $('mRes').hidden=false;if(st===3)confetti();
  $('mrAgain').onclick=()=>{$('mRes').hidden=true;MAP.walk=null;mapStart(cx);};
  $('mrGo').onclick=()=>{$('mRes').hidden=true;mapDraw(true);};}

/* ---------- treasure chest ---------- */
function badgeSvg(b,locked){const k=BADGES[b.b][0],gold=b.g;return `<svg viewBox="-60 -60 120 130" class="bdg"><path d="M-20 34l-8 30 14-8 6 14 8-34z M20 34l8 30-14-8-6 14-8-34z" fill="${locked?'#24204a':gold?'#e5383b':'#4fb3ff'}"/><circle r="48" fill="${locked?'#3a3566':gold?'#ffc93a':'#b9c2d6'}" stroke="${locked?'#2a2650':gold?'#c98a00':'#7d879b'}" stroke-width="4"/><circle r="38" fill="${locked?'#1a1738':['#3b2f7a','#173d33','#16365c','#4a2a12'][b.b%4]}"/>${locked?'<text y="12" text-anchor="middle" font-size="32" font-weight="900" fill="#6e68a3">?</text>':BICON[k]}${gold&&!locked?'<path d="M30-40l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill="#fff3c4" stroke="#c98a00" stroke-width="1.5"/>':''}</svg>`;}
function chestOpen(b,ok,base){$('mRes').innerHTML=`<div class="ch-st"><div class="ch-rays"></div><div class="ch-badge">${badgeSvg(b)}</div>
  <svg class="ch-box" viewBox="0 0 200 150"><ellipse cx="100" cy="140" rx="90" ry="9" fill="rgba(0,0,0,.4)"/><ellipse cx="100" cy="62" rx="66" ry="9" fill="#ffe27a" class="ch-glow"/><rect x="30" y="62" width="140" height="70" rx="9" fill="#8a5a2b" stroke="#5a3816" stroke-width="6"/><rect x="30" y="80" width="140" height="10" fill="#5a3816"/><rect x="88" y="66" width="24" height="30" rx="5" fill="#ffc93a" stroke="#c98a00" stroke-width="4"/>
  <g class="ch-lid"><path d="M30 62v-12a24 24 0 0 1 24-24h92a24 24 0 0 1 24 24v12z" fill="#a8703a" stroke="#5a3816" stroke-width="6" stroke-linejoin="round"/><rect x="88" y="44" width="24" height="18" rx="4" fill="#ffc93a" stroke="#c98a00" stroke-width="3"/></g></svg>
  <div class="ch-txt">打开宝箱！得到「${BADGES[b.b][1]}」<small>${base} 题对 ${ok} 题 · ${ok>=8?'金边徽章':'银边徽章，再开一次对 8 题就换成金边'}</small><div class="mr-btns"><button class="mr-b go" id="mrGo">收下徽章</button></div></div></div>`;
  $('mRes').hidden=false;const st=$('mRes').querySelector('.ch-st');
  setTimeout(()=>{st.classList.add('open');confetti();},650);
  $('mrGo').onclick=()=>{$('mRes').hidden=true;mapDraw();};}

/* ---------- the map ---------- */
function mapOpen(k,quiet){mapSt();save();MAP.k=k&&TR[k]?k:'w';MAP.ctx=null;show('vMap');$('mRes').hidden=true;
  document.querySelectorAll('#mTabs [data-k]').forEach(b=>b.classList.toggle('on',b.dataset.k===MAP.k));
  $('mTabs').hidden=Object.keys(TR).length<2;mapDraw(false);}
function mapStart(cx){MAP.ctx=cx;
  if(cx.t==='l'){TR[cx.k].start(cx.i);return;}
  if(cx.t==='r')startRound('mrv:'+cx.k+':'+cx.r);else startRound('mch:'+cx.k+':'+cx.c);}
/* positions: wide screens get rows of 4 (3 sets + a review) with round turns; phones get one zigzag column */
function mapLayout(L,W){const P=[],chests=[];
  if(W>=640){const x0=Math.max(170,W*.16),x3=W-Math.max(190,W*.2),X=[0,1,2,3].map(i=>x0+(x3-x0)*i/3),G=240,R=G/2,y0=90;
    L.forEach((n,i)=>{const r=Math.floor(i/4),c=i%4;P.push([r%2?X[3-c]:X[c],y0+r*G]);});
    const rows=Math.ceil(L.length/4);let d=`M${X[0]} ${y0}`;
    for(let r=0;r<rows;r++){const y=y0+r*G,last=r===rows-1,endX=r%2?X[0]:X[3],cnt=Math.min(4,L.length-r*4);
      const stop=last?P[r*4+cnt-1][0]+(r%2?-40:40):(r%2?X[0]-40:X[3]+40);d+=` H${stop}`;
      if(!last)d+=` A${R} ${R} 0 0 ${r%2?0:1} ${stop} ${y+G}`;}
    L.forEach((n,i)=>{if(n.t==='r'&&chestOf(n.r)>=0){const c=chestOf(n.r),gap=c%2?2*c-1:2*c;chests.push({c,r:n.r,x:c%2?Math.min(W-62,x3+115):Math.max(64,x0-110),y:y0+gap*G+G/2});}});
    return{P,d,chests,H:y0+(rows-1)*G+140};}
  const cx=W/2,dx=Math.min(110,W*.28),xs=[cx,cx+dx,cx,cx-dx],G=130,y0=70;L.forEach((n,i)=>P.push([xs[i%4],y0+i*G]));
  let d=`M${P[0][0]} ${P[0][1]}`;for(let i=1;i<P.length;i++){const[a,b]=P[i-1],[x,y]=P[i];d+=` C${a} ${b+G*.55}, ${x} ${y-G*.55}, ${x} ${y}`;}
  L.forEach((n,i)=>{if(n.t==='r'&&chestOf(n.r)>=0){const[x,y]=P[i];chests.push({c:chestOf(n.r),r:n.r,x:x>=cx?Math.max(60,cx-dx-10):Math.min(W-60,cx+dx+10),y:y+G/2});}});
  return{P,d,chests,H:y0+(P.length-1)*G+120};}
const MSTAR=(s,f,k)=>`<path d="M0 ${-s} L${s*.29} ${-s*.4} L${s*.95} ${-s*.31} L${s*.47} ${s*.15} L${s*.59} ${s*.81} L0 ${s*.5} L${-s*.59} ${s*.81} L${-s*.47} ${s*.15} L${-s*.95} ${-s*.31} L${-s*.29} ${-s*.4}Z" fill="${f}" stroke="${k}" stroke-width="4" stroke-linejoin="round"/>`;
const REVI='<path d="M-11 -4a12 12 0 1 1 3 10" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M-17 -9l6 6 6-7" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
const LOCKI='<path d="M-9 -2v-6a9 9 0 0 1 18 0v6" stroke="#5a5490" stroke-width="4" fill="none"/><rect x="-12" y="-3" width="24" height="18" rx="4" fill="#5a5490"/>';
function mini(n){return [0,1,2].map(i=>`<g transform="translate(${(i-1)*17},${i===1?-4:0})">${MSTAR(8,i<n?'#ffc93a':'#3a3566',i<n?'#c98a00':'#2a2650')}</g>`).join('');}
function mapDraw(walk){const k=MAP.k,M=S.map[k],T=TR[k],L=road(k),cur=curIdx(k),box=$('mBoard'),W=Math.max(320,box.clientWidth||document.documentElement.clientWidth-32);
  const{P,d,chests,H}=mapLayout(L,W);let g='';
  L.forEach((n,i)=>{const[x,y]=P[i],done=nodeDone(k,n),now=i===cur,lock=!done&&!now;
    if(n.t==='l'){const nm=T.name(n.i);g+=`<g class="mn${lock?' lock':''}" data-i="${i}" transform="translate(${x},${y})">`;
      if(lock)g+=`<circle r="30" fill="#24204a" stroke="#3a3566" stroke-width="4"/>${LOCKI}`;
      else if(done)g+=`<circle r="34" fill="#ffc93a" stroke="#c98a00" stroke-width="5"/><g transform="translate(0,2)">${MSTAR(17,'#fff3c4','#c98a00')}</g><g transform="translate(0,-48)">${mini(+M.lv[nm]||0)}</g>`;
      else g+=`<circle class="mn-pulse" r="44" fill="none" stroke="#ffc93a" stroke-width="3" stroke-dasharray="6 8"/><circle r="36" fill="#8460ea" stroke="#4a2e96" stroke-width="5"/><g transform="translate(0,2)">${MSTAR(18,'#fff','#4a2e96')}</g>`;
      g+=`<text y="${lock?54:58}" text-anchor="middle" class="mn-t${lock?' off':''}">${esc(nm)}</text></g>`;}
    else{g+=`<g class="mn${lock?' lock':''}" data-i="${i}" transform="translate(${x},${y})">`;
      if(lock)g+=`<rect x="-30" y="-30" width="60" height="60" rx="18" fill="#24204a" stroke="#3a3566" stroke-width="4"/><g opacity=".35">${REVI}</g>`;
      else if(done)g+=`<rect x="-32" y="-32" width="64" height="64" rx="20" fill="#22b07d" stroke="#137a54" stroke-width="5"/>${REVI}${M.rv[n.r]?`<g transform="translate(0,-48)">${mini(M.rv[n.r])}</g>`:''}`;
      else g+=`<rect class="mn-pulse" x="-44" y="-44" width="88" height="88" rx="28" fill="none" stroke="#ffc93a" stroke-width="3" stroke-dasharray="6 8"/><rect x="-36" y="-36" width="72" height="72" rx="22" fill="#e5603a" stroke="#a8401f" stroke-width="5"/>${REVI}<g transform="translate(30,-30)"><circle r="15" fill="#fff"/><text y="6" text-anchor="middle" class="mn-n">10</text></g>`;
      g+=`<text y="${now?62:56}" text-anchor="middle" class="mn-t${lock?' off':''}">复习</text></g>`;}});
  chests.forEach(c=>{const rvDone=M.rv[c.r]!=null,open=M.ch[c.c];const st=open==='g'?'gold':open?'silver':rvDone?'ready':'lock';
    g+=`<g class="mc ${st}" data-c="${c.c}" transform="translate(${c.x},${c.y})"><g class="mc-in" transform="scale(1.3)"><rect x="-32" y="-14" width="64" height="38" rx="6" class="mc-b"/><path d="M-32 -14v-6a14 14 0 0 1 14-14h36a14 14 0 0 1 14 14v6z" class="mc-l"/><rect x="-7" y="-10" width="14" height="16" rx="3" fill="#ffc93a" stroke="#c98a00" stroke-width="3"/></g><text y="62" text-anchor="middle" class="mn-t${st==='lock'?' off':''}">${open?(open==='g'?'金边徽章':'银边 · 再开一次'):'宝箱 · 10 题'}</text></g>`;});
  const kp=P[Math.min(cur,P.length-1)],from=MAP.walk!=null&&P[MAP.walk]?P[MAP.walk]:null;   /* he stands on the last stop until he walks on */
  g+=`<g class="walker${from&&walk?' going':''}" style="transform:translate(${(from||kp)[0]}px,${(from||kp)[1]-82}px)">${KIDSVG}</g>`;
  box.innerHTML=`<svg width="${W}" height="${H}" class="mboard"><path d="${d}" class="rd1"/><path d="${d}" class="rd2"/>${g}</svg>`;
  $('mTot').textContent=mapStars(k);
  const wk=box.querySelector('.walker');
  if(from&&walk){requestAnimationFrame(()=>requestAnimationFrame(()=>{wk.style.transform=`translate(${kp[0]}px,${kp[1]-82}px)`;setTimeout(()=>wk.classList.remove('going'),1300);}));MAP.walk=null;}
  setTimeout(()=>{try{const y=kp[1]-200+box.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:Math.max(0,y),behavior:'smooth'});}catch(e){}},from?50:0);}
$('mBoard').addEventListener('click',e=>{const n=e.target.closest('.mn'),c=e.target.closest('.mc');const k=MAP.k,L=road(k);
  if(n){const i=+n.dataset.i,x=L[i];if(n.classList.contains('lock')){n.classList.remove('shake');void n.getBBox();n.classList.add('shake');return;}
    mapStart(x.t==='l'?{k,t:'l',i:x.i,idx:i}:{k,t:'r',r:x.r,idx:i});return;}
  if(c){const ci=+c.dataset.c;if(c.classList.contains('lock'))return;mapStart({k,t:'c',c:ci});}});
$('mBack').addEventListener('click',home);
$('mTabs').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b)mapOpen(b.dataset.k);});
HOOK.tile.cards=()=>mapOpen('w');if(PHR)HOOK.tile.pp=()=>mapOpen('p');
HOOK.task.ppnew=()=>mapOpen('p');
HOOK.noWordTasks=true;
HOOK.tasks.push(t=>WL.filter(w=>S.wd[w.w]).length>=4?{k:'mrw',name:'复习单词 · Word review（10 题）',done:!!t.mrw}:null);
HOOK.task.mrw=()=>startRound('mrw');
let mapRz=0;window.addEventListener('resize',()=>{clearTimeout(mapRz);mapRz=setTimeout(()=>{if(!$('vMap').hidden)mapDraw();},200);});
/* the badge wall, in 我的进步 */
HOOK.meExtra.push(()=>{mapSt();let el=$('stBadges');if(!el){el=document.createElement('div');el.id='stBadges';el.className='stcard';$('meWords').after(el);}
  el.innerHTML=`<h3 class="st-h3" style="margin-top:0">我的徽章 · ${S.badges.length}/${BADGES.length}</h3><div class="bwall">`+BADGES.map((x,i)=>{const b=S.badges.find(y=>y.b===i);return `<div class="bw">${badgeSvg(b||{b:i},!b)}<small>${b?x[1]+(b.g?' · 金边':' · 银边'):'？？'}</small></div>`;}).join('')+'</div>';});
window.__map={R:()=>R,MAP,WL:()=>WL};   /* for the tests */

/* a daily-task fallback: the next stop on the word map, straight into its questions */
HOOK.fill.push(t=>{mapSt();const L=road('w'),i=curIdx('w');if(i>=L.length&&!t.mnext)return null;return {k:'mnext',name:'单词地图下一关 · Next stop',done:!!t.mnext};});
HOOK.task.mnext=()=>{mapSt();const L=road('w'),i=curIdx('w');if(i>=L.length)return mapOpen('w');MAP.k='w';const x=L[i];mapStart(x.t==='l'?{k:'w',t:'l',i:x.i,idx:i}:{k:'w',t:'r',r:x.r,idx:i});};
