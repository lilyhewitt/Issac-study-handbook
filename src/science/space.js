/* ---------- 太空探险 Space Mission: science long answers as a space map (questions: claude/太空探险_闯关题目设计.md).
   Every long answer goes the same 4 steps: ① 看问句 (which of the 10 answer patterns + the direction words) → ② 找证据 (tap the row, number or words)
   → ③ 写任务报告 (tier 1: put word blocks into the pattern; tier 2: write it on paper from a starter and a word bank) → ④ 三查 (compare with the model answer).
   Hints fade: Q2 of a planet gets all four steps, Q1/Q3/Q6 skip the evidence step, Q8 (the experiment) and the meteor belts and space stations
   are written on paper with only a “give me a start” button, and afterwards he says which pattern he used. ---------- */
const SM=QB.SPACE||[];
const TPL=[['🔢','读数','Read the number','How many / What was…','写数字和单位：28°C · 4 cm'],['🏷️','写特征','State / What is','Based on the table / State…','X has / does not have ___. （只抄图上的词）'],
  ['💡','解释原因','Explain why','Explain why / Why / How…','___, so ___. · ___ because ___.（要有科学词）'],['⚖️','比较','Compare','difference / similarity / Compare','A ___, but B ___. · A ___er than B, because ___.'],
  ['📈','读规律','Relationship','relationship / How did … change','As ___ increases, ___ increases / decreases.'],['🧪','目的变量','Aim & variables','aim / changed / kept the same','To find out how ___ affects ___. · 改 ___ 量 ___ 不变 ___'],
  ['🏆','选最合适','Most suitable','most suitable / strongest / best','X. 数据证据. X is ___, so ___.'],['❓','对错判断','True / False','True, False or Not possible to tell','图上有这个信息吗？轴量的是什么？'],
  ['🔮','预测','Predict','Predict / What will happen / Will…','___ will ___ because ___.'],['🛠️','建议','Suggest','Suggest…','___ so that ___.']];
const SMCHK=t=>['方向对吗？（多 / 少，相同 / 不同）','有科学词吗？',t===3?'两边都写了吗？':t===4?'两样东西都写了吗？':t===5?'写的是变量吗？（改 / 量 / 不变）':t===0?'写单位了吗？':'有证据或 because / so 吗？'];
const SMSTEPS=[['🔍','看问句','Read'],['👆','找证据','Find'],['📝','写任务报告','Write'],['✅','三查','Check']];
const smCirc=n=>'⓪①②③④⑤⑥⑦⑧⑨'[n];

function smSt(){if(!S.sp||typeof S.sp!=='object'||Array.isArray(S.sp))S.sp={};const s=S.sp;
  for(const k of['st','rv','tpl','sk'])if(!s[k]||typeof s[k]!=='object'||Array.isArray(s[k]))s[k]={};if(!Array.isArray(s.miss))s.miss=[];return s;}
/* the road: planets two by two with a space station after each pair, a meteor belt at the end of each galaxy, the wormhole between P3 and P4 */
function smRoad(){const L=[];let rv=0,run=[];
  const stn=()=>{L.push({t:'r',r:rv,from:run.slice()});rv++;run=[];};
  SM.forEach((p,i)=>{if(p.meteor){if(run.length)stn();L.push({t:'s',i});if(p.seg==='P3')L.push({t:'w'});return;}
    L.push({t:'s',i});run.push(i);if(run.length===2)stn();});
  if(run.length)stn();return L;}
function smDone(n){const s=smSt();if(n.t==='s')return!!s.st[n.i];if(n.t==='r')return!!s.rv[n.r];return true;}
function smCur(){const L=smRoad();for(let i=0;i<L.length;i++){if(L[i].t==='w')continue;if(!smDone(L[i]))return i;}return L.length;}
function smName(n){return n.t==='s'?SM[n.i].name:n.t==='r'?'太空站复习':'虫洞 → P4 星系';}
function smEn(n){return n.t==='s'?SM[n.i].en:n.t==='r'?'Space Station':'Wormhole';}
function smIcon(n){return n.t==='s'?SM[n.i].icon:n.t==='r'?'🛰️':'🌀';}
function smCol(n){return n.t==='s'?SM[n.i].c:n.t==='r'?['#dfe6ff','#7f8bc9']:['#b49cff','#5b3fc4'];}
function smStars(){const s=smSt();return Object.values(s.st).reduce((a,b)=>a+b,0)+Object.values(s.rv).reduce((a,b)=>a+b,0);}

/* ---------- map ---------- */
let SMWALK=null;
function smOpen(walk){smSt();show('vSp');smDraw(walk);}
function smStar(x,y,on){return`<path transform="translate(${x} ${y}) scale(.55)" d="M0-12l3.5 7.2 8 1.1-5.8 5.6 1.4 7.9L0 6 -7.1 9.8l1.4-7.9-5.8-5.6 8-1.1z" fill="${on?'#ffd23f':'#3d4685'}" stroke="${on?'#b07c12':'#5b64a8'}" stroke-width="2"/>`;}
function smDraw(walk){const s=smSt(),L=smRoad(),cur=smCur(),wide=innerWidth>=900,P=[];let W,H;
  if(wide){const X=[130,410,690];W=820;const rows=Math.ceil(L.length/3);H=140+rows*190;L.forEach((n,i)=>{const r=Math.floor(i/3),c=i%3;P.push([r%2?X[2-c]:X[c],110+r*190]);});}
  else{W=390;H=150+L.length*100;L.forEach((n,i)=>P.push([i%2?270:120,90+i*100]));}
  let path=`M${P[0][0]} ${P[0][1]}`;
  for(let i=1;i<P.length;i++){const [ax,ay]=P[i-1],[bx,by]=P[i];if(wide&&ay===by)path+=` L ${bx} ${by}`;else if(wide){const dx=ax>W/2?140:-140;path+=` C ${ax+dx} ${ay}, ${bx+dx} ${by}, ${bx} ${by}`;}else{const my=(ay+by)/2;path+=` C ${ax} ${my}, ${bx} ${my}, ${bx} ${by}`;}}
  let g='';for(let i=0;i<Math.round(W*H/2600);i++){const x=(i*97)%W,y=(i*173)%H;g+=`<circle cx="${x}" cy="${y}" r="${i%5?.9:1.7}" fill="#fff" opacity="${.25+(i%4)*.15}"/>`;}
  g+=`<path d="${path}" fill="none" stroke="#5c68c9" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>`;
  L.forEach((n,i)=>{const [x,y]=P[i],done=smDone(n)&&n.t!=='w',lock=i>cur&&n.t!=='w',isCur=i===cur,stn=n.t==='r',r=stn?27:33,[c1,c2]=smCol(n);
    const st=n.t==='s'?s.st[n.i]:n.t==='r'?s.rv[n.r]:0;
    const side=wide?0:(i%2?-1:1),lx=wide?0:side*(r+(isCur?24:14)),anc=wide?'middle':side<0?'end':'start',ly=wide?r+(st?40:24):-6;
    g+=`<g class="sm-n${lock?' lock':''}${isCur?' cur':''}" data-i="${i}" transform="translate(${x} ${y})"${lock?' opacity=".5"':''}>
    <defs><radialGradient id="smP${i}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs>
    ${isCur?'<circle class="sm-pulse" r="46" fill="none" stroke="#ffd23f" stroke-width="4" stroke-dasharray="6 6"/>':''}
    ${stn?`<rect x="-27" y="-21" width="54" height="42" rx="12" fill="url(#smP${i})" stroke="#c9d2ff" stroke-width="3"/>`:`<circle r="${r}" fill="url(#smP${i})"/><ellipse rx="${r+10}" ry="8" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="3" transform="rotate(-18)"/>`}
    <text y="10" font-size="${stn?24:28}" text-anchor="middle">${lock&&n.t==='s'?'🔒':smIcon(n)}</text>
    <text class="sm-en" x="${lx}" y="${ly}" text-anchor="${anc}">${esc(smEn(n))}</text><text class="sm-zh" x="${lx}" y="${ly+19}" text-anchor="${anc}">${esc(smName(n))}</text>
    ${st?`<g transform="translate(${wide?0:lx+side*22} ${wide?r+16:36})">${[-14,0,14].map((dx,k)=>smStar(dx,0,k<st)).join('')}</g>`:''}</g>`;
    if(n.t==='w'&&!wide)g+=`<text class="sm-gal" x="${W/2}" y="${y+62}" text-anchor="middle">— P4 星系 —</text>`;});
  const kp=P[Math.min(cur,P.length-1)],from=walk&&SMWALK!=null&&P[SMWALK]?P[SMWALK]:kp;
  g+=`<g class="sm-kid" style="transform:translate(${from[0]}px,${from[1]-44}px)"><g transform="scale(.5)"><use href="#smAstro"/></g></g>`;
  $('smMap').innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;max-width:${W}px;margin:0 auto">${g}</svg>`;
  if(walk&&from!==kp){const k=$('smMap').querySelector('.sm-kid');k.classList.add('going');requestAnimationFrame(()=>requestAnimationFrame(()=>{k.style.transform=`translate(${kp[0]}px,${kp[1]-44}px)`;}));setTimeout(()=>k.classList.remove('going'),1300);}
  SMWALK=null;
  if(!wide){const c=$('smMap').querySelector('.sm-n.cur');if(c&&cur>1)setTimeout(()=>c.scrollIntoView({block:'center',behavior:walk?'smooth':'auto'}),walk?300:0);}
  $('smTot').textContent=smStars();
  const n=L[cur];
  $('smNext').innerHTML=n?`<span class="sm-ic">${smIcon(n)}</span><div><b>${esc(smEn(n))}</b><span>${esc(smName(n))} · 下一站${n.t==='s'&&!SM[n.i].meteor?' · 8 题':''}</span></div><button class="sm-go" id="smGo">🚀 发射 Go!</button>`
    :'<div><b>全部完成！</b><span>每颗星都可以再玩，拿满 3 颗星。</span></div>';}

/* ---------- playing ---------- */
let SQ=null;
const smShuf=a=>QB.shuf(a.slice());
function smWords(t){return t.split(/\s+/).filter(Boolean);}
const smNorm=w=>w.toLowerCase().replace(/[^a-z0-9°²³.]/g,'').replace(/\.$/,'');
function smFind(words,ph){const pw=smWords(ph).map(smNorm),nw=words.map(smNorm);for(let i=0;i+pw.length<=nw.length;i++){if(pw.every((w,k)=>nw[i+k]===w))return[i,i+pw.length-1];}return null;}
/* what one item turns into on screen: a list of steps */
function smMode(it){const p=SM[it.pi];if(SQ.kind==='t'||SQ.kind==='d')return'one';if(SQ.kind==='r'||p.meteor)return'exp';if(it.qi===7)return'exp';if(it.qi===1)return'full';return'one';}
function smFlow(it){const q=SM[it.pi].qs[it.qi],mode=smMode(it),tier=SQ.tier,F=[];
  if(q.k==='mcq')return[{s:'mcq'}];
  if(q.pre&&mode!=='exp')F.push({s:'one',pre:true});
  q.parts.forEach((p,j)=>{if(SQ.only!=null&&j!==SQ.only)return;
    if(p.k==='mc'){F.push({s:'mc',j});return;}
    if(mode==='exp'){F.push({s:'paper',j,hint:true},{s:'chk',j},{s:'which',j});return;}
    F.push({s:'one',j});if(mode==='full'&&p.ev)F.push({s:'ev',j});
    F.push(tier>=2?{s:'paper',j}:{s:'tiles',j},{s:'chk',j});});
  return F;}
function smStart(node,opt){const s=smSt(),L=smRoad(),n=typeof node==='number'?L[node]:node;let list=[],kind;
  if(n.t==='s'){kind='s';list=SM[n.i].qs.map((q,qi)=>({pi:n.i,qi}));}
  else if(n.t==='r'){kind='r';list=smMix(n.from,6);}
  else if(n.t==='d'){kind='d';list=s.miss.slice(0,6).map(k=>({pi:SM.findIndex(p=>p.id===k.split(':')[0]),qi:+k.split(':')[1]})).filter(x=>x.pi>=0&&SM[x.pi].qs[x.qi]);}
  else if(n.t==='t'){kind='t';list=n.list;}
  else return;
  if(!list.length)return;
  const tier=kind==='s'?(SM[n.i].meteor?3:(s.st[n.i]||0)>=2?2:1):kind==='r'?3:1;
  SQ={n,kind,list,i:0,ok:0,mcOk:0,mcN:0,tier,used:{},again:kind==='s'&&!!s.st[n.i]};show('vSpQ');smQ();}
function smMix(from,k){const s=smSt(),all=[];from.forEach(pi=>SM[pi].qs.forEach((q,qi)=>all.push({pi,qi})));
  const key=x=>SM[x.pi].id+':'+x.qi,miss=smShuf(all.filter(x=>s.miss.includes(key(x)))),rest=smShuf(all.filter(x=>!s.miss.includes(key(x))));return miss.concat(rest).slice(0,k);}
function smQ(){const it=SQ.list[SQ.i],p=SM[it.pi];SQ.it=it;SQ.q=p.qs[it.qi];SQ.only=it.part!=null?it.part:null;SQ.flow=smFlow(it);SQ.fx=0;SQ.qok=true;SQ.built={};
  const k=SQ.kind;
  $('smQTitle').innerHTML=k==='s'?`${esc(p.en)}<small>${esc(p.name)} · 第 ${it.qi+1} 题 / ${p.qs.length}${p.meteor?' · 只给题目':smMode(it)==='exp'?' · 实验题：在纸上写':p.qs[it.qi].k==='mcq'?' · 选择题':SQ.tier>=2?' · 第 2 层：在纸上写':' · 第 1 层：拼小块'}</small>`
    :k==='r'?'Space Station<small>太空站复习 · 前面几颗星混在一起</small>':k==='t'?`句式工具箱<small>${smCirc(SQ.n.tpl)} ${TPL[SQ.n.tpl][1]} · 练 ${SQ.list.length} 题</small>`:'Try again<small>错题重练 · 太空探险</small>';
  $('smQCount').textContent=(SQ.i+1)+' / '+SQ.list.length;$('smDone').hidden=true;smStep();}
function smPart(){const f=SQ.flow[SQ.fx];return f&&f.j!=null?SQ.q.parts[f.j]:null;}
/* left side: the question, the table, the question line of the part being done */
function smProb(opt){opt=opt||{};const q=SQ.q,f=SQ.flow[SQ.fx],p=smPart();let h='';
  if(!opt.hl&&SQ.evDone&&p&&p.ev&&p.ev[0]!=='txt'&&f&&f.s!=='ev')opt.hl=p.ev[0]==='cell'?[[p.ev[1],p.ev[2]]]:[[p.ev[1],null]];
  const stem=q.k==='mcq'?q.q:q.q;
  if(opt.evTxt){const w=smWords(stem.replace(/\n/g,' \n '));h+=`<div class="sm-stem">${w.map((x,i)=>x==='\n'?'<br>':`<span class="sm-w" data-ev="${i}">${esc(x)}</span>`).join(' ')}</div>`;}
  else if(stem)h+=`<div class="sm-stem">${esc(stem).replace(/\n/g,'<br>')}</div>`;
  const T=q.tbl;
  if(T)h+=`<div class="sm-tw"><table class="sm-t">${T.map((r,ri)=>`<tr>${r.map((c,ci)=>{const th=ri===0||ci===0,on=opt.hl&&opt.hl.some(([a,b])=>a===ri&&(b==null?ci>0:b===ci)),tap=opt.cells&&!th;
    return`<${th?'th':'td'}${tap?` class="sm-c${on?' hl':''}" data-r="${ri}" data-c="${ci}"`:on?' class="hl"':''}>${esc(c)}</${th?'th':'td'}>`;}).join('')}</tr>`).join('')}</table></div>`;
  const ask=f&&f.pre?q.pre.ask:p?p.ask:null;
  if(ask&&q.k!=='mcq'){const lab=q.parts.length>1&&p&&SQ.only==null?'('+'abcdef'[f.j]+') ':'',marks=p&&p.k==='op'?' ['+(p.score.length||(p.tpl===6||p.frame.length>90?2:1))+']':'';
    if(opt.dirTap){const w=smWords(ask),dir=(f.pre?q.pre.dir:p.dir).map(d=>smFind(w,d));
      h+=`<div class="sm-ask"><span class="sm-q">问</span> ${lab}${w.map((x,i)=>{const hit=dir.findIndex((r,k)=>r&&i>=r[0]&&i<=r[1]&&SQ.dirFound.has(k));return`<span class="sm-w${hit>=0?' mk':''}" data-w="${i}">${esc(x)}</span>`;}).join(' ')}${marks}</div>`;}
    else{let a=esc(ask);if(opt.mark){(f.pre?q.pre.dir:p.dir).forEach(d=>{const e=esc(d).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');a=a.replace(new RegExp('('+e+')','i'),'<span class="mk">$1</span>');});}
      h+=`<div class="sm-ask"><span class="sm-q">问</span> ${lab}${a}${marks}</div>`;}}
  if(q.note&&SQ.kind!=='r')h+=`<div class="sm-note">📌 ${esc(q.note)}</div>`;
  $('smProb').innerHTML=h;}
function smBar(){const f=SQ.flow[SQ.fx];if(!f||f.s==='mc'||f.s==='mcq'){$('smSteps').innerHTML='';return;}
  const map={one:0,ev:1,tiles:2,paper:2,chk:3,which:3},cur=map[f.s],have=new Set(SQ.flow.filter(x=>x.j===f.j||x.pre).map(x=>map[x.s]));
  $('smSteps').innerHTML=SMSTEPS.map(([ic,zh,en],i)=>{const on=have.has(i),done=on&&i<cur,now=i===cur;
    const sub=done&&i===0&&SQ.tplDone!=null?smCirc(SQ.tplDone)+' '+TPL[SQ.tplDone][1]:done&&i===1&&SQ.evDone?SQ.evDone:done&&i===2?'写好了':en;
    return`<div class="sm-sp${done?' ok':''}${now?' on':''}${on?'':' off'}"><span class="ic">${ic}</span><div><b>${smCirc(i+1)} ${zh}</b><i>${esc(sub)}</i></div></div>`;}).join('');}
function smStep(){const f=SQ.flow[SQ.fx];SQ.tries=0;if(!f){smNextQ();return;}
  if(f.s==='one'||f.s==='paper'&&f.hint){SQ.tplDone=null;SQ.evDone=null;}
  smBar();const box=$('smStep'),p=smPart(),q=SQ.q;
  if(f.s==='mcq'){smProb();const idx=q.opts.map((o,i)=>i);
    box.innerHTML=`<div class="sm-qq">选一个答案<small>圈方向词 → 每个选项想 ✓ 或 ✗ → 选</small></div><div class="sm-opts">${smShuf(idx).map(i=>`<button class="sm-o" data-o="${i}">${esc(q.opts[i])}</button>`).join('')}</div><div class="sm-tip" id="smTip" hidden></div>`;return;}
  if(f.s==='mc'){smProb();box.innerHTML=`<div class="sm-qq">${esc(p.ask)}<small>${p.opts.length===3&&p.opts[2]==='Not possible to tell'?'图上有这个信息吗？轴量的是什么？':'看表，算一算'}</small></div><div class="sm-opts">${(p.opts.length===3&&p.opts[0]==='True'?p.opts:smShuf(p.opts)).map(o=>`<button class="sm-o" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div><div class="sm-tip" id="smTip" hidden></div>`;return;}
  if(f.s==='one'){SQ.dirFound=new Set();SQ.tplOk=false;smProb({});smOne();return;}
  if(f.s==='ev'){const ev=p.ev;smProb({evTxt:ev[0]==='txt',cells:ev[0]!=='txt',mark:true});
    box.innerHTML=`<div class="sm-qq">👆 证据在哪？<small>${ev[0]==='txt'?'在题目里点出证据：是哪几个词告诉你的？':ev[0]==='row'?'在表上点：哪一行的数字告诉你答案？':'在表上点一个格子：哪个数字是证据？'}</small></div><div class="sm-tip" id="smTip" hidden></div>`;return;}
  if(f.s==='tiles'){smProb({mark:true});smTiles();return;}
  if(f.s==='paper'){smProb({mark:!f.hint});smPaper(f.hint&&!SQ.hintOn);return;}
  if(f.s==='chk'){smProb({mark:true});smChk();return;}
  if(f.s==='which'){smProb({mark:true});box.innerHTML=`<div class="sm-qq">你刚才写的是哪一种句式？<small>想一想，再选一个</small></div>${smTplGrid()}<div class="sm-tip" id="smTip" hidden></div>`;}}
function smTplGrid(sel){return`<div class="sm-tg">${TPL.map((t,i)=>`<button class="sm-tp${sel===i?' sel':''}" data-t="${i}"><span class="e">${t[0]}</span><b>${t[1]}</b><i>${i}</i></button>`).join('')}</div>`;}
/* step ①: pick the pattern, then tap the direction words in the question line */
function smOne(){const f=SQ.flow[SQ.fx],q=SQ.q,p=smPart(),dir=f.pre?q.pre.dir:p.dir,full=smMode(SQ.it)==='full';
  if(!SQ.tplOk){$('smStep').innerHTML=`<div class="sm-qq">🔍 这题要写哪一种？<small>先选一个句式${full?'。看问句里的词：Explain why、difference、most suitable…':''}</small></div>${smTplGrid()}<div class="sm-tip" id="smTip" hidden></div>`;return;}
  smProb({dirTap:true});
  const left=dir.filter((d,k)=>!SQ.dirFound.has(k));
  $('smStep').innerHTML=`<div class="sm-qq">🔍 点出方向词<small>在左边蓝框的问句里点：${dir.length>1?'还差 '+left.length+' 个':'1 个'}</small></div>${smTplGrid(SQ.tplDone)}<div class="sm-tip good" id="smTip">✓ ${smCirc(SQ.tplDone)} ${TPL[SQ.tplDone][1]}：${esc(TPL[SQ.tplDone][4])}</div>${full?'<div class="sm-hint">💡 方向词告诉你要写什么：要多的还是少的？一样的还是不一样的？要写原因吗？</div>':''}`;}
function smOneTpl(t,btn){const f=SQ.flow[SQ.fx],want=f.pre?SQ.q.pre.tpl:smPart().tpl,s=smSt(),a=s.tpl[want]||[0,0];
  if(t===want){if(!SQ.tries){a[1]++;}a[0]++;s.tpl[want]=a;smSk('tpl',!SQ.tries);beep(true);SQ.tplOk=true;SQ.tplDone=want;SQ.tries=0;smOne();return;}
  beep(false);SQ.tries++;if(btn){btn.classList.add('bad','shake');btn.disabled=true;}
  const tip=$('smTip');tip.hidden=false;tip.className='sm-tip';
  tip.innerHTML=SQ.tries>=2?`提示：问句里的词是「${esc((f.pre?SQ.q.pre.dir:smPart().dir)[0])}」，这是 ${smCirc(want)} ${TPL[want][1]}（${esc(TPL[want][3])}）。`:`不是 ${smCirc(t)} ${TPL[t][1]}。再读一读问句：它要你做什么？`;}
function smOneWord(i){const f=SQ.flow[SQ.fx],w=smWords(f.pre?SQ.q.pre.ask:smPart().ask),dir=(f.pre?SQ.q.pre.dir:smPart().dir).map(d=>smFind(w,d));
  const k=dir.findIndex(r=>r&&i>=r[0]&&i<=r[1]);
  if(k>=0){if(SQ.dirFound.has(k))return;SQ.dirFound.add(k);beep(true);smSk('dir',!SQ.tries);
    if(dir.every((r,kk)=>!r||SQ.dirFound.has(kk))){smProb({dirTap:true});const tip=$('smTip');tip.className='sm-tip good';tip.innerHTML='✓ 方向词都找到了！';setTimeout(()=>{if(SQ&&SQ.flow[SQ.fx]===f)smAdv();},800);return;}
    smOne();return;}
  beep(false);SQ.tries++;const tip=$('smTip');tip.hidden=false;tip.className='sm-tip';
  if(SQ.tries>=2){const nk=dir.findIndex((r,kk)=>r&&!SQ.dirFound.has(kk));if(nk>=0){SQ.dirFound.add(nk);smOne();const t2=$('smTip');t2.className='sm-tip';t2.innerHTML='方向词是这里，已经帮你标出来了。';
      if(dir.every((r,kk)=>!r||SQ.dirFound.has(kk)))setTimeout(()=>{if(SQ&&SQ.flow[SQ.fx]===f)smAdv();},1200);return;}}
  tip.textContent='这个词不告诉你方向。找 Explain、most、least、difference、relationship 这样的词。';}
/* step ②: the evidence */
function smEvTap(kind,a,b,el){const p=smPart(),ev=p.ev;let ok=false;
  if(kind==='c'){ok=ev[0]==='cell'?(a===ev[1]&&b===ev[2]):ev[0]==='row'?a===ev[1]:false;}
  else if(kind==='w'&&ev[0]==='txt'){const w=smWords(SQ.q.q.replace(/\n/g,' \n ')),r=smFind(w,ev[1]);ok=!!r&&a>=r[0]&&a<=r[1];}
  smSk('ev',ok&&!SQ.tries);
  if(ok){beep(true);SQ.evDone=ev[0]==='txt'?ev[1]:ev[0]==='row'?SQ.q.tbl[ev[1]][0]:SQ.q.tbl[0][ev[2]]+' · '+SQ.q.tbl[ev[1]][ev[2]];smEvShow(true);setTimeout(smAdv,SQ.kind==='s'?2600:1500);return;}
  beep(false);SQ.tries++;if(el)el.classList.add('bad');
  const tip=$('smTip');tip.hidden=false;tip.className='sm-tip';
  if(SQ.tries>=2){smEvShow(false);setTimeout(smAdv,3200);return;}
  tip.textContent=p.tpl===6?'这个不是证据。题目问的是最合适的那一个：找最多或最少的那个数。':p.tpl===4?'看一整行的数字是怎么变的。':'这个不是证据。再读一读问句，想想答案靠哪一句、哪个数字。';}
function smEvShow(good){const p=smPart(),ev=p.ev;
  smProb({evTxt:ev[0]==='txt',cells:ev[0]!=='txt',mark:true,hl:ev[0]==='cell'?[[ev[1],ev[2]]]:ev[0]==='row'?[[ev[1],null]]:null});
  if(ev[0]==='txt'){const w=smWords(SQ.q.q.replace(/\n/g,' \n ')),r=smFind(w,ev[1]);if(r)for(let i=r[0];i<=r[1];i++){const e=$('smProb').querySelector(`[data-ev="${i}"]`);if(e)e.classList.add('hl');}}
  const tip=$('smTip');tip.hidden=false;tip.className='sm-tip'+(good?' good':'');tip.innerHTML=(good?'✓ ':'证据在这里：')+esc(p.evtip||'这就是证据，答案里要用上它。');}
/* step ③ tier 1: word blocks into the pattern */
function smSlots(fr){const out=[];let m;const re=/\{([^}]+)\}/g;while((m=re.exec(fr)))out.push(m[1]);return out;}
function smTiles(){const p=smPart(),sl=smSlots(p.frame);SQ.fill=[];SQ.chips=smShuf(sl.map(t=>({t,ok:1})).concat(p.extra.map(([t,why])=>({t,why}))));SQ.chipUsed=new Set();SQ.chipBad=new Set();smTilesDraw();}
function smFrameHtml(fr,fill,blank){let k=0;return esc(fr).replace(/\{([^}]+)\}/g,()=>{const v=fill?fill[k]:null,cur=fill&&k===fill.length;k++;
  return v!=null?`<span class="sm-slot">${esc(v)}</span>`:blank?'<span class="sm-ln"></span>':`<span class="sm-slot empty${cur?' now':''}"></span>`;});}
function smTilesDraw(tip,good){const p=smPart();
  $('smStep').innerHTML=`<div class="sm-qq">📝 写任务报告<small>${smCirc(p.tpl)} ${TPL[p.tpl][1]}：按顺序点小块放进空格。有的小块用不上。</small></div>
  <div class="sm-tpl">${smFrameHtml(p.frame,SQ.fill)}</div>
  <div class="sm-chips">${SQ.chips.map((c,i)=>`<button class="sm-chip${SQ.chipUsed.has(i)?' used':''}${SQ.chipBad.has(i)?' bad':''}" data-k="${i}"${SQ.chipUsed.has(i)?' disabled':''}>${esc(c.t)}</button>`).join('')}</div>
  <div class="sm-tip${good?' good':''}" id="smTip"${tip?'':' hidden'}>${tip||''}</div>`;}
function smChip(i){const p=smPart(),sl=smSlots(p.frame),want=sl[SQ.fill.length],c=SQ.chips[i];if(want==null||SQ.chipUsed.has(i))return;
  if(c.t===want){SQ.chipUsed.add(i);SQ.fill.push(want);beep(true);SQ.tries=0;
    if(SQ.fill.length===sl.length){smSk('wr',!SQ.partBad);SQ.built[SQ.flow[SQ.fx].j]=smFrameHtml(p.frame,SQ.fill);smTilesDraw('✓ 拼好了！读一遍你的任务报告。',true);setTimeout(smAdv,1300);}
    else smTilesDraw();return;}
  beep(false);SQ.tries++;SQ.partBad=true;SQ.qok=false;
  if(c.why)SQ.chipBad.add(i);
  if(SQ.tries>=2&&!c.why){const j=SQ.chips.findIndex((x,k)=>x.t===want&&!SQ.chipUsed.has(k));SQ.chipUsed.add(j);SQ.fill.push(want);SQ.tries=0;
    if(SQ.fill.length===sl.length){SQ.built[SQ.flow[SQ.fx].j]=smFrameHtml(p.frame,SQ.fill);smTilesDraw('这一块应该放「'+esc(want)+'」。拼好了，读一遍。');setTimeout(smAdv,1800);return;}
    smTilesDraw('这一块应该放「'+esc(want)+'」，已经帮你放好了。');return;}
  smTilesDraw(c.why?'「'+esc(c.t)+'」不对：'+esc(c.why):'这一块不放在这里。读一读空格前后的词。');}
/* step ③ tier 2 / experiments: write on paper */
function smPaper(bare){const p=smPart(),bank=smShuf([...new Set(smSlots(p.frame).concat(p.extra.map(e=>e[0])))]);
  $('smStep').innerHTML=bare?`<div class="sm-qq">📝 在纸上写完整的句子<small>先想：这一问要写哪一种句式？写好了点“写好了”</small></div><div class="sm-paper sm-blank"></div>
    <div class="sm-row"><button class="sm-btn ok" id="smWrote">✍️ 写好了</button><button class="sm-btn gh" id="smStartHint">💡 给我开头</button></div>`
  :`<div class="sm-qq">📝 在纸上写完整的句子<small>照下面的开头写，写好了点“写好了”</small></div><div class="sm-paper">${smFrameHtml(p.frame,null,true)}</div>
    <div class="sm-hint">词库（可能用得上）：</div><div class="sm-bank">${bank.map(t=>`<span>${esc(t)}</span>`).join('')}</div>
    <div class="sm-hint">💡 ${smCirc(p.tpl)} ${TPL[p.tpl][1]}：${esc(TPL[p.tpl][4])}</div><div class="sm-row"><button class="sm-btn ok" id="smWrote">✍️ 写好了</button></div>`;}
/* step ④: compare with the model answer */
function smAnsHtml(a){return esc(a).replace(/\*\*(.+?)\*\*/g,'<em>$1</em>');}
function smChk(){const f=SQ.flow[SQ.fx],p=smPart(),tiles=SQ.built[f.j]!=null,chk=SMCHK(p.tpl);SQ.ticks=new Set();
  $('smStep').innerHTML=`${tiles?`<div class="sm-qq">你的任务报告</div><div class="sm-ans mine">${SQ.built[f.j]}</div>`:''}
  <div class="sm-qq">参考答案<small>绿色是老师找的关键词</small></div><div class="sm-ans">${smAnsHtml(p.ans)}</div>
  ${p.score.length?`<div class="sm-score">老师怎么给分<br>${p.score.map(x=>`<b>${esc(x.split('：')[0])}</b>　${esc(x.split('：').slice(1).join('：'))}`).join('<br>')}</div>`:''}
  <div class="sm-qq" style="margin-top:12px">✅ 三查<small>${tiles?'对照参考答案，自己打勾':'对照参考答案，看你纸上写的'}</small></div>
  <div class="sm-chk">${chk.map((c,i)=>`<button class="sm-ck" data-ck="${i}"><span class="box"></span>${esc(c)}</button>`).join('')}</div>
  ${tiles?`<div class="sm-row"><button class="sm-btn" id="smNextPart" disabled>下一步 →</button></div>`
  :`<div class="sm-hint">你纸上写的：</div><div class="sm-row"><button class="sm-btn ok" data-rate="2">✓ 和参考答案一样</button><button class="sm-btn gh" data-rate="1">差一点（少了关键词）</button><button class="sm-btn gh" data-rate="0">没写出来</button></div>`}`;}
function smRate(v){smSk('wr',v===2);if(v<2)SQ.qok=false;beep(v===2);
  const tip=document.createElement('div');tip.className='sm-tip'+(v===2?' good':'');tip.textContent=v===2?'🌟 很棒！关键词都有，这一问拿满分。':v===1?'没关系，把绿色的关键词在纸上补上去。':'没关系，照参考答案在纸上抄一遍，下次就会了。';
  $('smStep').querySelectorAll('[data-rate]').forEach(b=>b.disabled=true);$('smStep').appendChild(tip);setTimeout(smAdv,v===2?1100:2200);}
function smWhich(t,btn){const p=smPart(),want=p.tpl,s=smSt(),a=s.tpl[want]||[0,0];
  if(t===want){if(!SQ.tries)a[1]++;a[0]++;s.tpl[want]=a;beep(true);const tip=$('smTip');tip.hidden=false;tip.className='sm-tip good';tip.innerHTML=`✓ 对，是 ${smCirc(want)} ${TPL[want][1]}：${esc(TPL[want][4])}`;setTimeout(smAdv,1200);return;}
  beep(false);SQ.tries++;if(btn){btn.classList.add('bad');btn.disabled=true;}
  if(SQ.tries>=2){a[0]++;s.tpl[want]=a;const tip=$('smTip');tip.hidden=false;tip.className='sm-tip';tip.innerHTML=`是 ${smCirc(want)} ${TPL[want][1]}：问句里有「${esc(p.dir[0])}」。`;setTimeout(smAdv,2200);return;}
  const tip=$('smTip');tip.hidden=false;tip.className='sm-tip';tip.textContent='再看一看问句里的方向词。';}
function smSk(k,ok){const s=smSt(),a=s.sk[k]||[0,0];a[0]++;if(ok)a[1]++;s.sk[k]=a;}
function smAdv(){if(!SQ)return;SQ.partBad=false;SQ.fx++;SQ.hintOn=false;if(SQ.fx<SQ.flow.length)smStep();else smNextQ();}
function smMc(btn){const f=SQ.flow[SQ.fx],q=SQ.q,tip=$('smTip');let ok,say;
  if(f.s==='mcq'){ok=+btn.dataset.o===q.ans;say=q.why;}else{const p=smPart();ok=btn.dataset.v===p.ans;say=p.say;}
  if(f.s==='mcq'||f.s==='mc'){SQ.mcN+=SQ.tries?0:1;if(ok&&!SQ.tries)SQ.mcOk++;}
  tip.hidden=false;
  if(ok){beep(true);btn.classList.add('good','pop');tip.className='sm-tip good';tip.innerHTML='✓ '+(f.s==='mcq'?'答案：'+esc(q.opts[q.ans])+'。':'')+esc(say||'对了！');
    $('smStep').querySelectorAll('.sm-o').forEach(b=>b.disabled=true);setTimeout(smAdv,f.s==='mcq'?2200:1300);return;}
  beep(false);SQ.tries++;SQ.qok=false;btn.classList.add('bad','shake');btn.disabled=true;tip.className='sm-tip';
  tip.textContent=SQ.tries>=2?'答案是：'+(f.s==='mcq'?q.opts[q.ans]:smPart().ans)+'。'+(say||''):(f.s==='mcq'?'再想一想：每个选项打 ✓ 或 ✗。':'再看一看表和问句。');
  if(SQ.tries>=2){$('smStep').querySelectorAll('.sm-o').forEach(b=>b.disabled=true);setTimeout(smAdv,3200);}}
function smNextQ(){const s=smSt(),it=SQ.it,key=SM[it.pi].id+':'+it.qi;
  if(SQ.kind!=='t'){if(SQ.qok){SQ.ok++;if(SQ.kind!=='s'||SQ.again)s.miss=s.miss.filter(x=>x!==key);}else if(!s.miss.includes(key))s.miss.push(key);}
  else if(SQ.qok)SQ.ok++;
  save();SQ.i++;if(SQ.i<SQ.list.length)smQ();else smFinish();}
function smFinish(){const s=smSt(),n=SQ.n,tot=SQ.list.length,ok=SQ.ok,stars=ok===tot?3:ok/tot>=.6?2:1;let first=false;
  if(n.t==='s'){first=!s.st[n.i];s.st[n.i]=Math.max(s.st[n.i]||0,stars);}
  else if(n.t==='r'){first=!s.rv[n.r];s.rv[n.r]=Math.max(s.rv[n.r]||0,stars);}
  S.stars=(S.stars||0)+stars;const t=tkDay();t[n.t==='s'||n.t==='r'?'sp':n.t==='t'?'tool':'spr']=1;
  const L=smRoad();SMWALK=first?L.findIndex(x=>x.t===n.t&&(x.t==='s'?x.i===n.i:x.r===n.r)):null;save();
  const L2=smRoad(),nx=L2[smCur()],p=n.t==='s'?SM[n.i]:null;
  $('smSteps').innerHTML='';$('smDone').hidden=false;
  $('smDone').innerHTML=`<div class="sm-win"><svg viewBox="-80 -90 160 200" width="190" height="238" style="overflow:visible">${p||n.t==='r'?`<circle cx="0" cy="58" r="44" fill="${(p?p.c:['#dfe6ff','#7f8bc9'])[1]}"/><ellipse cx="0" cy="56" rx="62" ry="10" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="3"/>`:''}<g transform="translate(0 4)"><use href="#smAstro"/></g>${n.t==='s'||n.t==='r'?'<path d="M22 -52v-30" stroke="#c9d2ff" stroke-width="3"/><path d="M22 -82h30l-8 8 8 8h-30z" fill="#ffd23f"/>':''}</svg>
    <h2>${n.t==='s'||n.t==='r'?'插上旗子了！':ok===tot?'全对！':'练完了！'}</h2><div class="sm-stars">${[0,1,2].map(k=>`<span class="${k<stars?'on':''}" style="animation-delay:${.2+k*.25}s">★</span>`).join('')}</div>
    <div class="sm-rows"><div><b>${ok} / ${tot}</b>第一次就对</div>${SQ.mcN?`<div><b>${SQ.mcOk} / ${SQ.mcN}</b>选择题和读数</div>`:''}</div>
    ${p?`<div class="sm-medal"><span>🏅</span><div><b>星星勋章 · ${esc(p.en)}</b><small>${ok<tot?'做错的题放进错题重练了，太空站复习时会先出它们。':'这颗星全对！'}</small></div></div>`:''}
    <div class="sm-row c">${n.t==='s'||n.t==='r'?`<button class="sm-btn" id="smNextStop">${nx&&nx.t!=='w'?'🚀 下一站：'+esc(smEn(nx))+' '+esc(smName(nx)):'回地图'}</button><button class="sm-btn gh" id="smToMap">回地图</button>`:`<button class="sm-btn" id="smHome">回首页</button>`}${n.t==='s'?'<button class="sm-btn gh" id="smAgain">再玩一次</button>':''}</div></div>`;
  if(ok>=tot*.75)confetti();}

/* ---------- 句式工具箱 Answer toolbox ---------- */
let TOOLTAB='tpl';
function smRec(){const s=smSt();let best=-1,bv=2;
  TPL.forEach((t,i)=>{if(i===0||i===7)return;const a=s.tpl[i];const v=a&&a[0]?a[1]/a[0]:-1;if(v<bv&&smPool(i).length){bv=v;best=i;}});return best;}
function smPool(t){const s=smSt(),L=smRoad(),cur=smCur(),open=new Set();L.forEach((n,i)=>{if(n.t==='s'&&(i<=cur||s.st[n.i]))open.add(n.i);});
  const out=[];SM.forEach((p,pi)=>{if(!open.has(pi))return;p.qs.forEach((q,qi)=>{if(q.k!=='pr')return;q.parts.forEach((x,j)=>{if(x.k==='op'&&x.tpl===t)out.push({pi,qi,part:j});});});});return out;}
function toolOpen(){show('vTool');toolDraw();}
function toolDraw(){const s=smSt(),rec=smRec();
  document.querySelectorAll('#toolTabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===TOOLTAB));
  if(TOOLTAB==='tpl'){$('toolBody').innerHTML=`${rec>=0?`<button class="sm-btn rec" data-tool="${rec}">⭐ 推荐练：${smCirc(rec)} ${TPL[rec][1]}</button>`:''}
    <div class="sm-tgrid">${TPL.map((t,i)=>{const a=s.tpl[i]||[0,0],n=smPool(i).length;return`<button class="sm-tcard${a[1]>=3?' got':''}${i===rec?' rec':''}" data-tool="${i}"${n?'':' disabled'}>
      <span class="n">${i}</span><h4>${t[0]} ${t[1]}</h4><p class="q">${esc(t[3])}</p><div class="s">${esc(t[4])}</div><small>${a[0]?`做了 ${a[0]} · 自己对 ${a[1]}${a[1]>=3?' ⭐':''}`:'还没做'}${n?` · 能练 ${n} 题`:i===0||i===7?' · 在闯关里练':' · 闯关后解锁'}</small></button>`;}).join('')}</div>`;}
  else{const L=smRoad(),cur=smCur();$('toolBody').innerHTML=`<div class="sm-must">${SM.filter(p=>p.must&&p.must.length).map(p=>{const pi=SM.indexOf(p),i=L.findIndex(n=>n.t==='s'&&n.i===pi),open=i<=cur||s.st[pi];
    return`<div class="sm-mcard${open?'':' lock'}"><b>${p.icon} ${esc(p.name)} · ${esc(p.en)}</b>${open?p.must.map(m=>`<p>${esc(m)}</p>`).join(''):'<p class="muted">到了这颗星就解锁。</p>'}</div>`;}).join('')}</div>`;}}
function toolPlay(t){const pool=smShuf(smPool(t)).slice(0,5);if(!pool.length)return;smStart({t:'t',tpl:t,list:pool});}

/* ---------- events ---------- */
$('smBack').addEventListener('click',home);$('toolBack').addEventListener('click',home);
$('smQBack').addEventListener('click',()=>{const k=SQ&&SQ.kind;SQ=null;if(k==='t')toolOpen();else if(k==='d')home();else smOpen();});
$('smNext').addEventListener('click',e=>{if(e.target.closest('#smGo'))smStart(smCur());});
$('smMap').addEventListener('click',e=>{const n=e.target.closest('.sm-n');if(!n)return;const i=+n.dataset.i,L=smRoad();if(L[i].t==='w')return;
  if(n.classList.contains('lock')){n.classList.remove('shake');void n.getBBox();n.classList.add('shake');return;}smStart(i);});
$('toolTabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b){TOOLTAB=b.dataset.tab;toolDraw();}});
$('toolBody').addEventListener('click',e=>{const b=e.target.closest('[data-tool]');if(b&&!b.disabled)toolPlay(+b.dataset.tool);});
$('vSpQ').addEventListener('click',e=>{
  if(e.target.closest('#smNextStop')){smOpen(true);const L=smRoad(),c=smCur();if(c<L.length&&L[c].t!=='w')setTimeout(()=>smStart(c),SMWALK!=null?1400:0);return;}
  if(e.target.closest('#smToMap')){smOpen(true);return;}
  if(e.target.closest('#smHome')){const k=SQ&&SQ.kind;SQ=null;if(k==='t')toolOpen();else home();return;}
  if(e.target.closest('#smAgain')){smStart(SQ.n);return;}
  if(!SQ)return;const f=SQ.flow[SQ.fx];if(!f)return;
  const o=e.target.closest('.sm-o');if(o&&!o.disabled){smMc(o);return;}
  const tp=e.target.closest('.sm-tp');if(tp&&!tp.disabled){if(f.s==='one'&&!SQ.tplOk)smOneTpl(+tp.dataset.t,tp);else if(f.s==='which')smWhich(+tp.dataset.t,tp);return;}
  const w=e.target.closest('.sm-w');
  if(w&&f.s==='one'&&SQ.tplOk&&w.dataset.w!=null){smOneWord(+w.dataset.w);return;}
  if(w&&f.s==='ev'&&w.dataset.ev!=null){smEvTap('w',+w.dataset.ev,0,w);return;}
  const c=e.target.closest('.sm-c');if(c&&f.s==='ev'){smEvTap('c',+c.dataset.r,+c.dataset.c,c);return;}
  const ch=e.target.closest('.sm-chip');if(ch&&!ch.disabled&&f.s==='tiles'){smChip(+ch.dataset.k);return;}
  if(e.target.closest('#smStartHint')){SQ.hintOn=true;smPaper(false);return;}
  if(e.target.closest('#smWrote')){beep(true);smAdv();return;}
  const ck=e.target.closest('.sm-ck');if(ck){ck.classList.toggle('on');const i=+ck.dataset.ck;SQ.ticks.has(i)?SQ.ticks.delete(i):SQ.ticks.add(i);const nb=$('smNextPart');if(nb)nb.disabled=SQ.ticks.size<3;return;}
  if(e.target.closest('#smNextPart')){beep(true);smAdv();return;}
  const r=e.target.closest('[data-rate]');if(r&&!r.disabled){smRate(+r.dataset.rate);return;}
});

/* ---------- home: the big Space Mission tile, the toolbox, tasks, my progress ---------- */
HOOK.tile.sp=()=>smOpen();HOOK.tile.tool=toolOpen;HOOK.tile.me=()=>$('bStats').click();
HOOK.noWordTasks=true;
HOOK.home.push(()=>{const L=smRoad(),c=smCur(),n=L[Math.min(c,L.length-1)],el=$('smNote');
  const done=SM.filter((p,i)=>smSt().st[i]&&!p.meteor).length,tot=SM.filter(p=>!p.meteor).length;
  if(el)el.innerHTML=c<L.length?`${done} / ${tot} 颗星 · 下一站 <b>${smIcon(n)} ${esc(smEn(n))} ${esc(smName(n))}</b>`:'全部完成！每颗星都能再玩。';
  const bar=$('smBar');if(bar)bar.style.width=Math.round(done/tot*100)+'%';
  const r=smRec(),tn=$('toolNote');if(tn)tn.textContent=r>=0?'⭐ 推荐：'+smCirc(r)+' '+TPL[r][1]:'';});
HOOK.tasks.push(t=>{const L=smRoad(),c=smCur();if(c>=L.length&&!t.sp)return null;const n=L[Math.min(c,L.length-1)];
  return{k:'sp',name:'太空探险下一站 · '+smName(n)+(n.t==='s'?'（'+SM[n.i].qs.length+' 题）':''),done:!!t.sp};});
HOOK.task.sp=()=>{const c=smCur(),L=smRoad();if(c<L.length)smStart(c);else smOpen();};
HOOK.tasks.push(t=>{const r=smRec();if(r<0&&!t.tool)return null;return{k:'tool',name:'句式工具箱 · '+(r>=0?smCirc(r)+' '+TPL[r][1]:'练一个句式'),done:!!t.tool};});
HOOK.task.tool=()=>{const r=smRec();if(r>=0)toolPlay(r);else toolOpen();};
/* 错题重练 also takes the planet questions he got wrong */
{const f=HOOK.tile.redo;HOOK.tile.redo=()=>{if(S.misses.length)return f&&f();if(smSt().miss.length)smStart({t:'d'});};}
HOOK.fill.push(t=>{const m=smSt().miss.length;if(!m&&!t.spr)return null;return{k:'spr',name:'错题重练 · 太空探险（'+Math.min(m,6)+' 题）',done:!!t.spr&&!m};});
HOOK.task.spr=()=>{if(smSt().miss.length)smStart({t:'d'});};
HOOK.home.push(()=>{const m=smSt().miss.length,n=S.misses.length+m;const el=$('redoNote');if(el)el.textContent=n?n+' 题':'';const t=$('tRedo');if(t)t.classList.toggle('empty',!n);});
HOOK.meExtra.push(()=>{const s=smSt();let el=$('smShelf');if(!el){el=document.createElement('div');el.id='smShelf';el.className='stcard';$('meWords').after(el);}
  const med=SM.map((p,i)=>s.st[i]?`<span class="sm-med"><b>${p.icon}</b><i>${esc(p.name)}</i><em>${'★'.repeat(s.st[i])}</em></span>`:'').join('');
  const tp=TPL.map((t,i)=>{const a=s.tpl[i];return a&&a[0]?`<span>${smCirc(i)} ${t[1]} · ${a[1]}/${a[0]}</span>`:'';}).join('');
  el.innerHTML=`<h3>星星勋章 · Space Mission</h3>${med?`<div class="sm-shelf">${med}</div>`:'<p class="muted">在太空探险里过关，勋章会摆在这里。</p>'}${tp?`<h3>句式 · 第一次选对 / 做过</h3><div class="sm-tps">${tp}</div>`:''}`;});
window.__sp={SQ:()=>SQ,road:smRoad,cur:smCur,start:smStart,S:()=>S,st:smSt};   /* for the tests */
