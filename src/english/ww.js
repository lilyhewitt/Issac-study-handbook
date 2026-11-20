/* ---------- 写作工坊 Writing Workshop: P3 picture-series compositions (claude/英文作文题目_全部47套.md, sets 1–9).
   ① 放格子 · 找主人: the box words are in a jumbled order — put each one under the right picture, then say whose word it is
   ② 拼句子: one sentence per picture, who → did (past tense) → where/how; the wrong blocks are his own mistakes (There / We, present tense)
   ③ 写在纸上: the ending formula and the three checks, then he writes the whole story on paper.
   The exam pictures live in ws-data.js, encrypted; his English name (any capitals) unlocks them and the key stays on that iPad. ---------- */
const WWK='xiaoxiao-ww-k',WWV='__WWV__';
let WWD=null,WWKEY=null,WWIMG={},WW=null;
function wwSt(){if(!S.ww||typeof S.ww!=='object'||Array.isArray(S.ww))S.ww={};const w=S.ww;
  if(!w.done||typeof w.done!=='object'||Array.isArray(w.done))w.done={};if(!w.err||typeof w.err!=='object'||Array.isArray(w.err))w.err={};return w;}
const wwB64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const wwShuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function wwLoad(){if(QB.WW)return Promise.resolve(WWD=QB.WW);
  return new Promise((ok,no)=>{const s=document.createElement('script');s.src='ws-data.js?v='+WWV;s.onload=()=>QB.WW?ok(WWD=QB.WW):no(new Error('no data'));s.onerror=no;document.head.appendChild(s);});}
function wwLS(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){return null;}}
async function wwUnwrap(name){const enc=new TextEncoder();
  for(const w of WWD.wraps){try{const km=await crypto.subtle.importKey('raw',enc.encode(name),'PBKDF2',false,['deriveKey']);
    const kek=await crypto.subtle.deriveKey({name:'PBKDF2',salt:wwB64(w.s),iterations:WWD.iter,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['decrypt']);
    const c=wwB64(w.c);return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:c.slice(0,12),additionalData:enc.encode('ww')},kek,c.slice(12)));}catch(e){}}
  return null;}
async function wwKeyFrom(raw){WWKEY=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);return WWKEY;}
async function wwImg(set,j){const id=set.id+'_'+j;if(WWIMG[id])return WWIMG[id];const d=wwB64(set.img[j]);
  const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:d.slice(0,12)},WWKEY,d.slice(12));return WWIMG[id]=URL.createObjectURL(new Blob([pt],{type:'image/png'}));}
function wwSay(t){$('wwBub').innerHTML=t||'';}
const wwName=()=>S.name||'小小';

async function wwOpen(){show('vWW');$('wwLock').hidden=true;$('wwHome').hidden=true;
  try{await wwLoad();}catch(e){$('wwHome').hidden=false;$('wwList').innerHTML='<p class="st-note">图片还没下载下来，连上网再打开一次。</p>';return;}
  const k=wwLS(WWK);
  if(k&&!WWKEY){try{await wwKeyFrom(wwB64(k));await wwImg(WWD.sets[0],0);}catch(e){WWKEY=null;wwLS(WWK,null);}}
  if(WWKEY)wwHome();else wwLockView();}
function wwLockView(){$('wwLock').hidden=false;$('wwHome').hidden=true;$('wwLockBub').innerHTML='工坊的门锁住了！<br>说出发明家的名字就能开 🔑';$('wwName').value='';}
async function wwTry(){const typed=$('wwName').value.trim();if(!typed)return;$('wwOpen').disabled=true;
  const raw=await wwUnwrap(typed.toLowerCase());$('wwOpen').disabled=false;
  if(!raw){const c=document.querySelector('.ww-lock-card');c.classList.remove('ww-shake');void c.offsetWidth;c.classList.add('ww-shake');
    $('wwLockBub').innerHTML='Hmm… 不是这个名字哦，<br>再试试！';return;}
  await wwKeyFrom(raw);let s='';for(const b of raw)s+=String.fromCharCode(b);wwLS(WWK,btoa(s));
  S.name=typed.charAt(0).toUpperCase()+typed.slice(1).toLowerCase();save();beep(true);wwHome();
  wwSay('');$('wwHi').textContent=`Hi, ${S.name}! 🔓`;}
function wwHome(){show('vWW');$('wwLock').hidden=true;$('wwHome').hidden=false;const w=wwSt();
  $('wwHi').textContent=`Hi, ${wwName()}!`;if(typeof wdHomeStat==='function')wdHomeStat();if(typeof dcHomeStat==='function')dcHomeStat();
  $('wwList').innerHTML=WWD.sets.map((st,i)=>{const d=w.done[st.id];
    return `<button class="ww-set${d?' done':''}" data-wwset="${i}"><small>第 ${st.n} 套 · ${esc(st.src)}</small><b>${esc(st.title)}</b><small>at least ${st.words} words · ${st.phrases.length} 个词组</small>${d?`<span class="ww-ok">✓ ${esc(d.slice(5).replace('-','/'))} 做完</span>`:''}</button>`;}).join('');}
function wwNote(){const w=wwSt(),n=Object.keys(w.done).length,tot=QB.WW?QB.WW.sets.length:9;return n?`做完 ${n} / ${tot} 套`:'看图写作 · 先放格子再写';}

/* ---- one set ---- */
async function wwStart(i){const st=WWD.sets[i];WW={st,step:1,order:wwShuf(st.phrases.map((p,j)=>j)),placed:{},sel:null,own:null,tries:{},si:0,pick:[],pool:null,err:{panel:0,owner:0,who:0,tense:0,order:0},img:[]};
  show('vWWSet');$('wwTitle').textContent=st.title;$('wwSub').textContent=`第 ${st.n} 套 · ${st.src} · at least ${st.words} words`;
  WW.img=await Promise.all([0,1,2].map(j=>wwImg(st,j)));
  wwSay('框里的词是<b>乱序</b>的，不用照着顺序写。先点一个词，再点它属于哪一格图。');wwDraw();}
function wwStepsHTML(){return['① 放格子 · 找主人','② 拼句子','③ 写在纸上'].map((t,i)=>`<span class="${i+1===WW.step?'on':i+1<WW.step?'done':''}">${t}</span>`).join('');}
function wwDraw(){$('wwSteps').innerHTML=wwStepsHTML();if(WW.step===1)wwDraw1();else if(WW.step===2)wwDraw2();else wwDraw3();}
function wwOwnTag(o){const ow=WW.st.owners[o];return ow?ow[1]:'';}
function wwDraw1(){const st=WW.st,P=WW.placed;
  const cell=k=>{const cards=Object.keys(P).filter(j=>P[j].p===k).map(j=>`<span class="ww-cd" data-wwc="${j}">${esc(st.phrases[j][0])}${P[j].o!=null?` <i>${esc(wwOwnTag(P[j].o))}</i>`:''}</span>`).join('');
    return `<div class="ww-cell${WW.hl===k?' hl':''}${WW.sel!=null?' pick':''}" data-wwp="${k}">${k<4?`<img src="${WW.img[k-1]}" alt="picture ${k}">`:'<div class="ww-q">?</div>'}<span class="ww-num">${k}</span><div class="ww-strip">${cards}</div></div>`;};
  const left=WW.order.filter(j=>!(j in P));
  const own=WW.own!=null?`<div class="ww-own"><b>“${esc(st.phrases[WW.own][0])}” 是谁的？（谁做的 / 说的是谁 / 谁觉得）</b>${st.owners.map((o,k)=>`<button data-wwo="${k}">${esc(o[0])}<small>${esc(o[1])}</small></button>`).join('')}</div>`:'';
  const done=!left.length&&WW.own==null;
  $('wwBody').innerHTML=`<div class="ww-step1"><div class="ww-grid">${[1,2,3,4].map(cell).join('')}</div><div style="display:flex;flex-direction:column;gap:.6rem">${own}
    <div class="ww-tray"><span class="ww-tray-h">框里的词 · 顺序是乱的（还剩 ${left.length} 个）</span>${left.map(j=>`<button class="ww-cd${WW.sel===j?' sel':''}${WW.bad===j?' bad':''}" data-wwt="${j}">${esc(st.phrases[j][0])}</button>`).join('')||'<span class="ww-tray-h">全部放好了！</span>'}</div>
    ${done?'<button class="btn" id="wwNext1">下一步：拼句子 →</button>':''}</div></div>`;
  WW.bad=null;}
function wwTap1(e){const st=WW.st;const t=e.target.closest('[data-wwt],[data-wwp],[data-wwo]');if(!t)return;
  if(t.dataset.wwo!=null){const j=WW.own,o=+t.dataset.wwo,ok=st.phrases[j][2].includes(o);
    if(ok){WW.placed[j].o=o;WW.own=null;wwSay(`对！<b>${esc(st.phrases[j][0])}</b> → ${esc(st.owners[o][0])}。`);beep(true);}
    else{WW.err.owner++;const n=WW.tries['o'+j]=(WW.tries['o'+j]||0)+1;
      if(n>=2){const r=st.phrases[j][2][0];WW.placed[j].o=r;WW.own=null;wwSay(`看图：<b>${esc(st.phrases[j][0])}</b> 是 <b>${esc(st.owners[r][0])}</b>（${esc(st.owners[r][1])}）的。`);}
      else wwSay(`再想想：图里是谁 <b>${esc(st.phrases[j][0])}</b>？`);beep(false);}
    wwDraw1();return;}
  if(WW.own!=null){wwSay('先选上面这个词是谁的。');return;}
  if(t.dataset.wwt!=null){WW.sel=+t.dataset.wwt;WW.hl=null;wwSay(`<b>${esc(st.phrases[WW.sel][0])}</b> 在哪一格？点那一格图。`);wwDraw1();return;}
  if(t.dataset.wwp!=null){if(WW.sel==null){wwSay('先点下面的一个词，再点格子。');return;}
    const j=WW.sel,k=+t.dataset.wwp,ph=st.phrases[j];
    if(ph[1].includes(k)){WW.placed[j]={p:k,o:null};WW.sel=null;WW.hl=null;
      if(ph[2].length===1&&st.owners.length===1){WW.placed[j].o=ph[2][0];}else{WW.own=j;wwSay(`放对了，第 ${k} 格！现在选：这个词是谁的？`);}beep(true);}
    else{WW.err.panel++;const n=WW.tries['p'+j]=(WW.tries['p'+j]||0)+1;WW.bad=j;beep(false);
      if(n>=2){WW.hl=ph[1][0];wwSay(`<b>${esc(ph[0])}</b> 在第 ${ph[1].join(' 或 ')} 格，看看图里发生了什么。`);}
      else wwSay(`<b>${esc(ph[0])}</b> 不在第 ${k} 格。框里的顺序不算数，要看图！`);}
    wwDraw1();}}

function wwDraw2(){const s=WW.st.sents[WW.si];
  if(!WW.pool){WW.pool=wwShuf([{t:s[0],k:'who',r:0},{t:s[1],k:'did',r:1},{t:s[2],k:'rest',r:2}].concat(s[3].map(([t,k])=>({t,k:k==='who'?'who':'did',bad:k}))));WW.pick=[];}
  const blk=(b,i,where)=>`<button class="ww-bl ${b.k}" data-ww${where}="${i}">${esc(b.t)}</button>`;
  $('wwBody').innerHTML=`<div class="ww-sent"><div class="ww-legend">第 ${WW.si+1} 格 · 第 ${WW.si+1} / 3 句　蓝 = 谁　橙 = 做了什么（过去式）　绿 = 在哪 / 怎么样</div>
    <div class="ww-sent-pic"><img src="${WW.img[WW.si]}" alt="picture ${WW.si+1}"></div>
    <div class="ww-slots">${WW.pick.map(i=>blk(WW.pool[i],i,'s')).join('')||'<span class="ww-legend">点下面的块，按顺序拼一句话</span>'}</div>
    <div class="ww-pool">${WW.pool.map((b,i)=>WW.pick.includes(i)?'':blk(b,i,'q')).join('')}</div>
    ${WW.ok?`<button class="btn" id="wwNext2">${WW.si<2?'下一句 →':'下一步：写在纸上 →'}</button>`:''}</div>`;}
function wwTap2(e){const t=e.target.closest('[data-wwq],[data-wws],#wwNext2');if(!t)return;
  if(t.id==='wwNext2'){WW.ok=false;WW.pool=null;if(WW.si<2){WW.si++;wwSay('');}else{WW.step=3;wwSay('');}wwDraw();return;}
  if(WW.ok)return;
  if(t.dataset.wws!=null){WW.pick=WW.pick.filter(i=>i!==+t.dataset.wws);wwDraw2();return;}
  WW.pick.push(+t.dataset.wwq);
  if(WW.pick.length===3){const P=WW.pick.map(i=>WW.pool[i]),bad=P.find(b=>b.bad);
    if(!bad&&P.every((b,i)=>b.r===i)){WW.ok=true;beep(true);wwSay(`✓ ${esc(P.map(b=>b.t).join(' '))}`);}
    else{beep(false);if(bad){WW.err[bad.bad]++;wwSay(bad.bad==='who'?`<b>${esc(bad.t)}</b> 不对：这个故事写的是别人，人称选好就不变——一直用名字或 he / she / they，不写 there / we / I。`:`<b>${esc(bad.t)}</b> 不对：故事发生在<b>过去</b>，动词要用过去式。`);}
      else{WW.err.order++;wwSay('顺序不对：谁 → 做了什么 → 在哪 / 怎么样。');}
      WW.pick=[];}}
  wwDraw2();}

function wwDraw3(){const st=WW.st;
  $('wwBody').innerHTML=`<div class="ww-end"><h4>第 4 格：编结局</h4><ol><li>问题怎么解决了？（谁做了什么）</li><li>谁说了什么？（加一句对话 "…," said …）</li><li>学到了什么 / 心情怎么样？（felt ___ because ___）</li></ol></div>
    <div class="ww-end"><h4>先说再写</h4><p class="ww-legend">动笔前，看着图把整个故事讲给妈妈听一遍。讲顺了再写。</p></div>
    <div class="ww-end"><h4>在纸上写完整篇（at least ${st.words} words）</h4><p class="ww-legend">每格写 3 句：谁在哪 → 发生了什么 → 什么感觉 / 说了什么。框里的词可以用，也可以不用全。</p>
    <div class="ww-chk"><label><input type="checkbox" class="wwc"> 每句都是过去式吗？（walked, was, saw）</label><label><input type="checkbox" class="wwc"> 每句开头大写、结尾有句号吗？</label><label><input type="checkbox" class="wwc"> 人称从头到尾一样吗？（写别人就一直用 he / she / they）</label></div></div>
    <button class="btn" id="wwDone" disabled>三查都做了，写完了 ✓</button>`;
  wwSay(`写完拍照发给大人看。加油，${esc(wwName())}！`);}
function wwFinish(){const st=WW.st,w=wwSt(),dk=dkey(new Date());w.done[st.id]=dk;
  for(const k in WW.err)w.err[k]=(w.err[k]||0)+WW.err[k];
  S.days[dk]=(S.days[dk]||0)+1;S.stars+=3;
  const e={d:dk,ts:Date.now(),c:'gram',t:'写作工坊 · Writing',h:QB.hash('ww:'+st.id),ok:1,q:`第 ${st.n} 套 ${st.title}`,a:Object.entries(WW.err).filter(x=>x[1]).map(x=>x[0]+' '+x[1]).join(', ')||'全对'};
  if(!Array.isArray(S.log))S.log=[];S.log.push(e);if(S.log.length>5000)S.log=S.log.slice(-5000);save();beep(true);
  $('wwBody').innerHTML=`<div class="ww-end" style="text-align:center"><h4 style="font-size:1.6rem">Great job, ${esc(wwName())}! 🎉</h4><p>+3 ★ · 第 ${st.n} 套做完了</p></div><button class="btn" id="wwBackList">回到写作工坊</button>`;
  wwSay('');$('wwSteps').innerHTML=wwStepsHTML().replace('class="on"','class="done"');}

$('wwBack').addEventListener('click',()=>home());
$('wwOpen').addEventListener('click',wwTry);
$('wwName').addEventListener('keydown',e=>{if(e.key==='Enter')wwTry();});
$('wwList').addEventListener('click',e=>{const b=e.target.closest('[data-wwset]');if(b)wwStart(+b.dataset.wwset);});
$('wwQuit').addEventListener('click',()=>wwHome());
$('wwBody').addEventListener('click',e=>{if(!WW)return;
  if(e.target.closest('#wwBackList')){wwHome();return;}
  if(e.target.closest('#wwNext1')){WW.step=2;WW.si=0;WW.pool=null;WW.ok=false;wwSay('每格拼一句：<b>谁 → 做了什么 → 在哪 / 怎么样</b>。');wwDraw();return;}
  if(e.target.closest('#wwDone')){wwFinish();return;}
  if(WW.step===1)wwTap1(e);else if(WW.step===2)wwTap2(e);});
$('wwBody').addEventListener('change',e=>{if(e.target.classList.contains('wwc'))$('wwDone').disabled=![...document.querySelectorAll('.wwc')].every(c=>c.checked);});
HOOK.tile.ww=wwOpen;
HOOK.home.push(()=>{if(S.name){const h=document.querySelector('#vHome .hello');if(h)h.textContent=`Hi, ${S.name}!`;}if($('wwNote'))$('wwNote').textContent=wwNote();});
HOOK.statsExtra.push(()=>{const w=wwSt(),n=Object.keys(w.done).length;let el=$('wwStat');
  if(!el){el=document.createElement('div');el.id='wwStat';el.className='stcard';$('stSum').after(el);}
  const E=w.err,lab={panel:'放错格子',owner:'选错主人',who:'人称（There / We / I）',tense:'时态（现在时、will）',order:'句子顺序'};
  el.innerHTML=`<b>写作工坊</b><p class="st-sub">做完 ${n} 套。累计错的次数（越往后越少就是进步）：</p><p>${Object.keys(lab).map(k=>`${lab[k]} <b>${E[k]||0}</b>`).join(' · ')}</p>`+(w.dr&&Object.keys(w.dr).length?`<p class="st-sub">基本功正确率：${Object.entries(w.dr).filter(x=>Array.isArray(x[1])&&x[1][0]+x[1][1]).map(([k,v])=>`${(typeof WDK!=='undefined'&&WDK[k])||k} <b>${Math.round(100*v[0]/(v[0]+v[1]))}%</b>（${v[0]+v[1]} 题）`).join(' · ')}</p>`:'');});
window.__ww={S:()=>wwSt(),WW:()=>WW,open:wwOpen,start:wwStart};
