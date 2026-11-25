/* ---------- 一起读 · 一分钟朗读 · 短句听写 (texts in rt-data.js)
   Saves (all optional, old saves simply lack them):
     S.rt  = {done:{id:date}, last:'r3'}                read-together passages finished (+2 ★ the first time each)
     S.orf = [{d, id, n, ok}]                           one-minute reading: words reached, words read right
     S.dc  = {s:{idx:{n, bad, last, due}}, sp:{word:n}, day:{date:1}}   dictation: each sentence's history, words he misspelt
   The adult tools open from the parent page (家长看); dictation opens from the Writing Workshop. ---------- */
function rtSt(){const o=v=>v&&typeof v==='object'&&!Array.isArray(v);
  if(!o(S.rt))S.rt={};if(!o(S.rt.done))S.rt.done={};
  if(!Array.isArray(S.orf))S.orf=[];
  if(!o(S.dc))S.dc={};for(const k of ['s','sp','day'])if(!o(S.dc[k]))S.dc[k]={};}
function rtLog(c,t,q,a,ok){const dk=dkey(new Date());if(!Array.isArray(S.log))S.log=[];
  S.log.push({d:dk,ts:Date.now(),c,t,h:QB.hash(t+':'+Date.now()),ok:ok?1:0,q,a});if(S.log.length>5000)S.log=S.log.slice(-5000);}
function rtAddDays(d,n){const x=new Date(d+'T12:00:00');x.setDate(x.getDate()+n);return dkey(x);}
const rtEsc=s=>esc(s).replace(/&quot;/g,'"');

/* ----- read together ----- */
let RTI=0,RT_FROM='stats';
function rtNextIdx(){rtSt();const L=RTP.findIndex(p=>p.id===S.rt.last);const nx=RTP.findIndex(p=>!S.rt.done[p.id]);return L>=0&&!S.rt.done[RTP[L].id]?L:nx>=0?nx:0;}
function rtOpen(i,from){RT_FROM=from||'stats';rtSt();if(i==null)i=rtNextIdx();
  RTI=(i+RTP.length)%RTP.length;S.rt.last=RTP[RTI].id;save();show('vRT');rtDraw();}
function rtDraw(){const p=RTP[RTI],done=S.rt.done[p.id],n=p.p.join(' ').split(/\s+/).length;
  $('rtSub').textContent=`一起读 · 第 ${RTI+1} 篇 / 共 ${RTP.length} 篇 · 约 ${n} 词${done?' · ✓ 读过了':''}`;
  $('rtText').innerHTML=`<h3>${rtEsc(p.t)}</h3>`+p.p.map((t,i)=>`<p><b class="rt-n">${i+1}</b>${rtEsc(t)}</p>`).join('');
  const lab=['写明的','要推的','他自己的'];
  $('rtQs').innerHTML=p.q.map((q,i)=>`<div class="rt-q"><b>${i+1} ${lab[i]}</b> ${rtEsc(q[0])}<br><span>${rtEsc(q[1])}${q[2]?' → '+rtEsc(q[2]):''}</span></div>`).join('');
  $('rtWords').innerHTML=p.w.map(w=>`<span class="rt-w">${rtEsc(w[0])} <small>${rtEsc(w[1])}</small></span>`).join('');
  $('rtDone').textContent=done?'✓ 又读了一遍':'✓ 读完了 +2 ★';
  $('rtList').innerHTML=RTP.map((x,i)=>`<button class="rt-li${i===RTI?' on':''}" data-rt="${i}">${S.rt.done[x.id]?'✓':'·'} ${i+1}. ${rtEsc(x.t)}</button>`).join('');}
function rtFinish(){const p=RTP[RTI],first=!S.rt.done[p.id],dk=dkey(new Date());S.rt.done[p.id]=dk;
  if(first){S.stars+=2;S.days[dk]=(S.days[dk]||0)+1;}
  rtLog('read','一起读 · Read together',`一起读：${p.t}`,first?'第一次读完 +2 ★':'又读了一遍',1);save();
  beep(true);rtDraw();}
$('rtBack').addEventListener('click',()=>{if(RT_FROM==='home')home();else statsView();});
$('rtPrev').addEventListener('click',()=>{RTI=(RTI+RTP.length-1)%RTP.length;S.rt.last=RTP[RTI].id;save();rtDraw();});
$('rtNext').addEventListener('click',()=>{RTI=(RTI+1)%RTP.length;S.rt.last=RTP[RTI].id;save();rtDraw();});
$('rtDone').addEventListener('click',rtFinish);
$('rtToOrf').addEventListener('click',()=>orfOpen());
$('rtList').addEventListener('click',e=>{const b=e.target.closest('[data-rt]');if(b){RTI=+b.dataset.rt;S.rt.last=RTP[RTI].id;save();rtDraw();}});

/* ----- one-minute reading: a 60-second timer; tap the words he misses; when time is up tap the last word he reached ----- */
const ORF_MS=60000;
let OR=null;
function orfMonthIdx(d){const x=d||new Date(),k=x.getFullYear()*12+x.getMonth()-(2026*12+11);return ((k%ORF.length)+ORF.length)%ORF.length;}
function orfOpen(i){rtSt();if(OR&&OR.tm)clearInterval(OR.tm);
  i=i==null?orfMonthIdx():i;const words=ORF[i].p.join(' \n ').split(/ +/);
  OR={i,words,miss:new Set(),st:'ready',left:ORF_MS,t0:0,tm:null,last:-1};show('vORF');orfDraw();}
function orfDraw(){const o=ORF[OR.i];let k=0,h='';
  $('orfSub').textContent=`一分钟朗读 · ${o.t}（每月换一篇，难度差不多）`;
  for(const w of OR.words){if(w==='\n'){h+='<br><br>';continue;}const c=OR.miss.has(k)?' x':'',l=OR.st==='done'&&k>OR.last?' after':'';
    h+=`<span class="ow${c}${l}" data-ow="${k}">${rtEsc(w)}</span> `;k++;}
  $('orfText').innerHTML=h;orfClock();
  const step={ready:['怎么做','让他从第一个词开始读，你点“开始”。他读错或跳过的词，点一下变红，再点取消。'],
    run:['在读','读错或跳过的词点一下变红。别打断他，读错了也让他接着读。'],
    pause:['暂停了','点“继续”接着计时。'],
    pick:['时间到！','点他读到的最后一个词。'],done:['记下来了','可以“重来”再测一次，或者换一篇。']}[OR.st];
  $('orfStepH').textContent=step[0];$('orfStep').textContent=step[1];
  $('orfGo').textContent=OR.st==='run'?'⏸ 暂停':OR.st==='pause'?'▶ 继续':OR.st==='ready'?'▶ 开始':'▶ 开始';
  $('orfGo').disabled=OR.st==='pick'||OR.st==='done';
  $('orfRes').innerHTML=OR.st==='done'?`<b class="orf-big">${OR.n} 词 · 读对 ${OR.ok}</b>`:'';
  const H=S.orf.slice(-6),mx=Math.max(60,...H.map(r=>r.ok));
  $('orfHist').innerHTML=H.length?`<div class="orf-bars">${H.map(r=>`<div><b>${r.ok}</b><i style="height:${Math.max(6,Math.round(70*r.ok/mx))}px"></i><small>${r.d.slice(5,7)*1} 月</small></div>`).join('')}</div>`:'<p class="rt-dim">还没有记录。每月测一次，三个月后就能看出变化。</p>';
  $('orfList').innerHTML=ORF.map((x,i)=>{const used=S.orf.some(r=>r.id===x.id);return `<button class="rt-li${i===OR.i?' on':''}" data-orf="${i}">${used?'✓':'·'} ${rtEsc(x.t)}${i===orfMonthIdx()?'（这个月）':''}</button>`;}).join('');}
function orfClock(){const f=Math.max(0,OR.left)/ORF_MS,a=-Math.PI/2,b=a+2*Math.PI*f,r=46,s=Math.ceil(Math.max(0,OR.left)/1000);
  $('orfTime').textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  $('orfArc').setAttribute('d',f<=0?'':f>=.999?`M0 ${-r}A${r} ${r} 0 1 1 -0.01 ${-r}`:`M${(r*Math.cos(a)).toFixed(2)} ${(r*Math.sin(a)).toFixed(2)}A${r} ${r} 0 ${f>.5?1:0} 1 ${(r*Math.cos(b)).toFixed(2)} ${(r*Math.sin(b)).toFixed(2)}`);}
function orfTick(){OR.left=OR.end-Date.now();if(OR.left<=0){OR.left=0;clearInterval(OR.tm);OR.tm=null;OR.st='pick';beep(true);orfDraw();return;}orfClock();}
function orfGo(){if(OR.st==='ready'||OR.st==='pause'){OR.end=Date.now()+OR.left;OR.st='run';OR.tm=setInterval(orfTick,200);}
  else if(OR.st==='run'){clearInterval(OR.tm);OR.tm=null;OR.left=OR.end-Date.now();OR.st='pause';}orfDraw();}
function orfTap(k){if(OR.st==='pick'||OR.st==='done'){OR.last=k;let ok=0;for(let j=0;j<=k;j++)if(!OR.miss.has(j))ok++;OR.n=k+1;OR.ok=ok;
    if(OR.st==='pick'){S.orf.push({d:dkey(new Date()),id:ORF[OR.i].id,n:OR.n,ok});}else{const r=S.orf[S.orf.length-1];if(r){r.n=OR.n;r.ok=ok;}}
    if(OR.st==='pick')rtLog('read','一分钟朗读 · One-minute reading',`一分钟朗读：${ORF[OR.i].t}`,`读到 ${OR.n} 词，读对 ${ok} 词`,1);
    OR.st='done';save();orfDraw();return;}
  if(OR.miss.has(k))OR.miss.delete(k);else OR.miss.add(k);orfDraw();}
$('orfBack').addEventListener('click',()=>{if(OR&&OR.tm)clearInterval(OR.tm);statsView();});
$('orfGo').addEventListener('click',orfGo);
$('orfReset').addEventListener('click',()=>orfOpen(OR.i));
$('orfText').addEventListener('click',e=>{const w=e.target.closest('[data-ow]');if(w)orfTap(+w.dataset.ow);});
$('orfList').addEventListener('click',e=>{const b=e.target.closest('[data-orf]');if(b)orfOpen(+b.dataset.orf);});

/* ----- dictation: 3 sentences a day, written on paper. Bolt reads; he writes; then he checks against the right sentence:
   taps the words he spelt wrong, and says whether the capital and the full stop are there. Missed sentences come back two days later. ----- */
const DC_N=3;let DC=null;
const dcPlain=s=>s.replace(/[\[\]]/g,'');
function dcPick(){rtSt();const t=dkey(new Date()),S2=S.dc.s,ids=DICT.map((_,i)=>i);
  const due=ids.filter(i=>S2[i]&&S2[i].due&&S2[i].due<=t),fresh=ids.filter(i=>!S2[i]),old=ids.filter(i=>S2[i]&&!S2[i].due).sort((a,b)=>(S2[a].last<S2[b].last?-1:1));
  return due.concat(fresh,old).slice(0,DC_N);}
function dcStart(){DC={list:dcPick(),i:0,st:'listen',bad:new Set(),chk:{},res:[]};show('vDict');dcDraw();}
function dcSay(slow){if(!DC||DC.i>=DC.list.length||!canSay)return;const t=dcPlain(DICT[DC.list[DC.i]]);
  try{speechSynthesis.cancel();const u=utter(t);u.rate=slow?.6:.85;speechSynthesis.speak(u);}catch(e){}}
function dcChecks(s){const c=[['cap','开头大写']];if(/"/.test(s))c.push(['q','引号 “ ”']);c.push(['end',/[?!]"?$/.test(s)?'句末的 ? 或 !':'句末的句号 .']);return c;}
function dcDraw(){const s=DICT[DC.list[DC.i]];
  $('dcSub').textContent=`短句听写 · 第 ${Math.min(DC.i+1,DC_N)} 句 / 共 ${DC_N} 句 · 写在纸上`;
  $('dcDots').innerHTML=DC.list.map((_,i)=>`<span class="${i<DC.i?(DC.res[i]?'ok':'no'):i===DC.i?'on':''}">${i<DC.i?(DC.res[i]?'✓':'·'):i+1}</span>`).join('');
  if(DC.st==='listen'){
    $('dcBody').innerHTML=`<div class="rt-panel dc-say"><svg viewBox="-60 -55 120 110" aria-hidden="true"><g transform="translate(-18 0) scale(.9)"><use href="#ww-bot"/></g><path d="M22 -20q10 8 0 18M32 -28q16 16 0 34" stroke="#d9a845" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      <div><b>听 Bolt 说一句，写在纸上</b><small>可以听很多遍。写完点“写好了”。</small></div>
      ${canSay?'<div class="dc-btns"><button class="rt-go" id="dcPlay">🔊 听一遍</button><button class="rt-chip" id="dcSlow">🐢 慢一点</button></div>':'<p class="rt-dim">这台设备不能朗读，请大人看着下面的句子读给他听。</p>'}</div>
      ${canSay?'':`<details class="rt-list"><summary>大人看：这一句</summary><p class="dc-sent">${rtEsc(dcPlain(s))}</p></details>`}
      <button class="rt-go dc-next" id="dcWrote">写好了，对一对 ✓</button>`;return;}
  const parts=s.split(/(\[[^\]]+\]|\s+)/).filter(x=>x&&!/^\s+$/.test(x));let k=0;
  const sent=parts.map(x=>{const v=/^\[/.test(x),w=x.replace(/[\[\]]/g,''),i=k++;return `<button class="dc-w${v?' v':''}${DC.bad.has(i)?' x':''}" data-dw="${i}">${rtEsc(w)}</button>`;}).join(' ');
  $('dcBody').innerHTML=`<div class="rt-panel"><div class="rt-lbl">对着纸，一个词一个词看</div>
      <div class="dc-sent">${sent}</div>
      <p class="rt-dim">写错的词点一下（变红），再点取消。<span class="dc-vk">橙色下划线</span>的是过去式，特别看看。</p>
      <div class="dc-chk">${dcChecks(s).map(([k2,l])=>`<button class="dc-c${DC.chk[k2]===false?' no':''}" data-dc="${k2}">${DC.chk[k2]===false?'✗':'✓'} ${l}</button>`).join('')}</div>
      <p class="rt-dim">漏了就点一下变成 ✗。</p></div>
    <button class="rt-go dc-next" id="dcOk">${DC.i<DC_N-1?'下一句 →':'看结果'}</button>`;}
function dcNext(){rtSt();const idx=DC.list[DC.i],s=DICT[idx],words=dcPlain(s).split(/\s+/),t=dkey(new Date());
  const ok=!DC.bad.size&&!Object.values(DC.chk).some(v=>v===false),r=S.dc.s[idx]||{n:0,bad:0};
  r.n++;if(!ok)r.bad++;r.last=t;r.due=ok?null:rtAddDays(t,2);S.dc.s[idx]=r;
  DC.bad.forEach(i=>{const w=(words[i]||'').toLowerCase().replace(/[^a-z']/g,'');if(!w)return;S.dc.sp[w]=(S.dc.sp[w]||0)+1;
    if(S.wd&&S.wd[w]){if(!S.sp||typeof S.sp!=='object')S.sp={};S.sp[w]=Object.assign({},S.sp[w]||{},{box:0,due:t});}});
  DC.res.push(ok);DC.bad=new Set();DC.chk={};save();
  if(DC.i<DC_N-1){DC.i++;DC.st='listen';dcDraw();return;}
  dcEnd();}
function dcEnd(){const dk=dkey(new Date()),n=DC.res.filter(Boolean).length,first=!S.dc.day[dk];S.dc.day[dk]=1;
  if(first){S.stars+=1;S.days[dk]=(S.days[dk]||0)+1;}
  rtLog('gram','写作工坊 · 听写',`听写 ${n} / ${DC_N} 句全对`,DC.list.map((i,j)=>(DC.res[j]?'✓ ':'✗ ')+dcPlain(DICT[i])).join(' | '),n===DC_N);save();
  DC.i=DC_N;$('dcDots').innerHTML=DC.res.map(r=>`<span class="${r?'ok':'no'}">${r?'✓':'·'}</span>`).join('');
  $('dcBody').innerHTML=`<div class="rt-panel" style="text-align:center"><b class="orf-big">${n} / ${DC_N} 句全对</b><p>${first?'+1 ★':'今天已经拿过星星了'}</p>
    <p class="rt-dim">${n<DC_N?'有错的句子两天后会再出现。':'明天再来 3 句。'}</p></div>
    <div class="dc-btns"><button class="rt-chip" id="dcMore">再写 3 句</button><button class="rt-go" id="dcHome">回到写作工坊</button></div>`;}
$('dcBack').addEventListener('click',()=>{try{speechSynthesis.cancel();}catch(e){}wwHome();});
$('dcBody').addEventListener('click',e=>{const t=e.target;
  if(t.closest('#dcPlay'))return dcSay(false);if(t.closest('#dcSlow'))return dcSay(true);
  if(t.closest('#dcWrote')){DC.st='check';return dcDraw();}
  if(t.closest('#dcOk'))return dcNext();
  if(t.closest('#dcMore'))return dcStart();if(t.closest('#dcHome'))return wwHome();
  const w=t.closest('[data-dw]');if(w){const k=+w.dataset.dw;DC.bad.has(k)?DC.bad.delete(k):DC.bad.add(k);return dcDraw();}
  const c=t.closest('[data-dc]');if(c){const k=c.dataset.dc;DC.chk[k]=DC.chk[k]===false?true:false;return dcDraw();}});
$('wwDcGo').addEventListener('click',dcStart);
function dcHomeStat(){rtSt();const el=$('wwDcNote');if(el)el.textContent=S.dc.day[dkey(new Date())]?'今天写过了 ✓ · 还可以再写':'写在纸上 · Bolt 读，你写，再对一对';}

/* ----- parent page: the two adult tools, the last reading result, the words he misspelt in dictation ----- */
HOOK.statsExtra.push(function(){rtSt();let el=$('rtStat');
  if(!el){$('stSum').insertAdjacentHTML('afterend','<div class="stcard" id="rtStat"></div>');el=$('rtStat');}
  {const first=el.parentElement.querySelector('.stcard');if(first&&first!==el)first.before(el);}
  const L=S.orf[S.orf.length-1],nd=Object.keys(S.rt.done).length,sp=Object.entries(S.dc.sp).sort((a,b)=>b[1]-a[1]).slice(0,10);
  el.innerHTML=`<div class="st-big"><b>大人陪读</b></div>
    <div class="rt-acts"><button class="rt-go" id="stRT">📖 一起读</button><button class="rt-go" id="stORF">⏱ 一分钟朗读</button></div>
    <p class="st-sub">一起读过 <b>${nd}</b> / ${RTP.length} 篇${L?` · 上次一分钟朗读（${L.d.slice(5).replace('-','/')}）：读对 <b>${L.ok}</b> 词`:''}</p>
    ${sp.length?`<p class="st-sub">听写里拼错过：${sp.map(([w,n])=>`${esc(w)}${n>1?' ×'+n:''}`).join('、')}</p>`:''}`;
  $('stRT').onclick=()=>rtOpen();$('stORF').onclick=()=>orfOpen();});
HOOK.home.push(dcHomeStat);
/* home: the read-together strip — which passage is next, how many read; opens that passage, Back returns home */
function rtHomeStat(){const el=$('rtHomeNext');if(!el)return;rtSt();const i=rtNextIdx(),n=Object.keys(S.rt.done).length;
  el.innerHTML=n>=RTP.length?`30 篇都读过了 🎉 · 可以挑喜欢的再读一遍`:`下一篇：第 ${i+1} 篇 · <b>${rtEsc(RTP[i].t)}</b> · 读过 ${n} / ${RTP.length}`;}
HOOK.home.push(rtHomeStat);
$('tRT').addEventListener('click',()=>rtOpen(null,'home'));
/* the handbook's “一起读” button opens english/?go=together: go straight to the next passage (home is built first, so Back lands on it) */
try{if(new URLSearchParams(location.search).get('go')==='together')setTimeout(()=>{if(!REMOTE)rtOpen(null,'home');},0);}catch(e){}
window.__rt={OR:()=>OR,DC:()=>DC,orfEnd:()=>{if(OR){OR.end=Date.now();orfTick();}},rtOpen,orfOpen,dcStart};
