/* 家里实验室 Home Lab: list → one experiment in 4 steps (准备 · 先猜 · 动手记 · 写结论) → done.
   Save: S.lab = {done:{id:{n,at,best}}} — optional, added on first use; nothing else in the save changes.
   Stars: +3 the first time an experiment is finished, +1 each time after. */
function labSt(){if(!S.lab||typeof S.lab!=='object')S.lab={};if(!S.lab.done||typeof S.lab.done!=='object')S.lab.done={};return S.lab;}
let LX=null;
const LBSTEP=['① 准备','② 先猜','③ 动手记','④ 写结论'];
function labNext(){const d=labSt().done;const i=LAB.findIndex(x=>!d[x.id]);return i<0?-1:i;}
function labOpen(){labSt();show('vLab');$('labTot').textContent=S.stars||0;const d=S.lab.done,nx=labNext();
  $('labList').innerHTML=LAB.map((x,i)=>`<button class="lb-ex${i===nx?' next':''}" data-lab="${i}"><span class="ic">${x.icon}</span><h3>${esc(x.en)}</h3><span class="zh">${esc(x.zh)}</span>
    <span class="need"><b>要准备：</b>${esc(x.need.join('、'))}</span><span class="unit">${esc(x.unit)} · 句式 ${esc(x.tpl)}</span>
    <span class="st">${d[x.id]?`<span class="lb-ok">✓ 做过 ${d[x.id].n} 次</span><span class="lb-go">再做</span>`:`<span>${i===nx?'下一个做这个':''}</span><span class="lb-go">开始 →</span>`}</span></button>`).join('');}
function labStart(i){const x=LAB[i];LX={i,x,step:0,pic:1,need:new Set(),guess:null,rec:{},vars:{},bl:x.sent.blanks.map(()=>null),cur:0,tries:0};show('vLabX');$('labXTitle').innerHTML=`${x.icon} ${esc(x.en)}<small>${esc(x.zh)}</small>`;labDraw();}
function labStepsBar(){$('labSteps').innerHTML=LBSTEP.map((t,i)=>`<span class="${i===LX.step?'on':i<LX.step?'ok':''}">${t}${i<LX.step?' ✓':''}</span>`).join('');}
function labPic(k){return `<div class="lb-pic">${LABPIC[LX.x.id][k]}</div>`;}
function labRecDone(){const r=LX.x.rec;return r.rows.every(([k])=>LX.rec[k]!=null&&String(LX.rec[k]).trim()!=='')&&(!r.calc||String(LX.rec[r.calc[0]]||'').trim()!=='');}
function labChart(){const r=LX.x.rec;if(!r.chart)return'';const v=r.rows.map(([k])=>+LX.rec[k]||0),mx=Math.max(1,...v);
  return `<svg class="lb-chart" viewBox="0 0 300 150" width="100%"><line x1="30" y1="125" x2="295" y2="125" stroke="#5a63b8"/><line x1="30" y1="8" x2="30" y2="125" stroke="#5a63b8"/>`+
    v.map((n,i)=>{const h=n/mx*105,x=55+i*80;return `<rect x="${x}" y="${125-h}" width="50" height="${h}" fill="${i===v.length-1?'#ffd166':'#5aa7ff'}"/>${n?`<text x="${x+25}" y="${119-h}" text-anchor="middle" fill="#cdd3ff" font-size="12">${n}</text>`:''}<text x="${x+25}" y="142" text-anchor="middle" fill="#cdd3ff" font-size="12">${esc(r.rows[i][1])}</text>`;}).join('')+'</svg>';}
function labRecTable(){const r=LX.x.rec;let h=`<table class="lb-tbl"><tr><th>${esc(r.head[0])}</th><th>${esc(r.head[1])}</th></tr>`;
  h+=r.rows.map(([k,l])=>`<tr><td>${esc(l)}</td><td>${r.kind==='num'?`<input class="lb-in" inputmode="decimal" data-rk="${k}" value="${esc(LX.rec[k]??'')}" aria-label="${esc(l)}"> ${esc(r.unit)}`:
    `<span class="lb-pk">${r.opts.map(o=>`<button data-rk="${k}" data-rv="${esc(o)}" class="${LX.rec[k]===o?'on':''}">${esc(o)}</button>`).join('')}</span>`}</td></tr>`).join('');
  if(r.calc)h+=`<tr><td>${esc(r.calc[1])}</td><td><input class="lb-in" inputmode="decimal" data-rk="${r.calc[0]}" value="${esc(LX.rec[r.calc[0]]??'')}" aria-label="${esc(r.calc[1])}"> ${esc(r.calc[2])}</td></tr>`;
  return h+'</table>'+`<div id="labChart">${labChart()}</div>`;}
function labDraw(){labStepsBar();const x=LX.x,b=$('labBody');
  if(LX.step===0){b.innerHTML=`<div class="lb-two"><div class="lb-card">${labPic(0)}</div><div class="lb-card"><h4>要准备的东西（找到一样点一下）</h4><ul class="lb-need">${x.need.map((n,i)=>`<li><button data-need="${i}" class="${LX.need.has(i)?'on':''}"><i>${LX.need.has(i)?'✓':''}</i>${esc(n)}</button></li>`).join('')}</ul>${x.safe?`<div class="lb-safe">⚠ ${esc(x.safe)}</div>`:''}</div></div><button class="lb-big" data-go="1">准备好了 →</button>`;return;}
  if(LX.step===1){b.innerHTML=`<div class="lb-card"><h4>先猜一猜，再动手</h4><p class="lb-q">${esc(x.guess.q)}</p><div class="lb-opts">${x.guess.opts.map((o,i)=>`<button class="lb-opt${LX.guess===i?' on':''}" data-guess="${i}">${esc(o)}</button>`).join('')}</div><div class="lb-tip">猜错也没关系。科学家也是先猜，再做实验看看对不对。</div></div><button class="lb-big" data-go="2" ${LX.guess==null?'disabled':''}>开始做 →</button>`;return;}
  if(LX.step===2){const k=LX.pic,s=x.steps[k-1];
    b.innerHTML=`<div class="lb-two"><div class="lb-card"><div class="lb-hd"><h4>怎么做 · 第 ${k} 步 / 共 4 步</h4><div class="lb-dots">${[1,2,3,4].map(n=>`<button data-pic="${n}" class="${n===k?'on':''}" aria-label="第 ${n} 步">${n}</button>`).join('')}</div></div>${labPic(k)}<div class="lb-pt">${esc(s[0])}</div><div class="lb-pd">${esc(s[1])}</div>
      <div class="lb-nav"><button class="lb-btn" data-pic="${k-1}" ${k===1?'disabled':''}>← 上一步</button><button class="lb-btn pri" data-pic="${k+1}" ${k===4?'disabled':''}>下一步 →</button></div>
      <div class="lb-tip">你猜的：<b>${esc(x.guess.opts[LX.guess])}</b>。做完看看对不对。</div></div>
      <div class="lb-card"><h4>记下来</h4>${labRecTable()}</div></div><button class="lb-big" data-go="3" id="labRecGo" ${labRecDone()?'':'disabled'}>记好了 → 写结论</button>`;return;}
  if(LX.step===3){const warn=x.check(LX.rec);
    b.innerHTML=(warn?`<div class="lb-tip warn">${esc(warn)} <button class="lb-btn" data-go="2">回去再量一次</button></div>`:'')+
      (x.vars?`<div class="lb-card"><h4>这个实验里，哪个是改的、量的、不变的？</h4><div class="lb-vars">${x.vars.map(([t],i)=>`<div class="lb-var" data-vi="${i}"><span class="chip">${esc(t)}</span><span class="pick">${['c','m','k'].map(v=>`<button data-var="${i}" data-v="${v}" class="${LX.vars[i]===v?'on':''}">${LABV[v].split(' ').pop()}</button>`).join('')}</span></div>`).join('')}</div></div>`:'')+
      `<div class="lb-card" style="margin-top:.75rem"><h4>把结论句拼完整（句式 ${esc(x.tpl)}）</h4><div class="lb-sent" id="labSent"></div><div class="lb-opts" id="labPool"></div><div id="labMsg"></div></div><button class="lb-big" data-check="1">检查 ✓</button>`;
    labSentDraw();return;}
  if(LX.step===4){const d=labSt().done[x.id],first=d.n===1,res=x.sayRes(LX.rec),right=res===x.guess.opts[LX.guess];
    b.innerHTML=`<div class="lb-card lb-done"><div style="font-size:3rem">${x.icon}</div><div class="big">实验完成！ +${first?3:1} ★</div>
      <p>${right?`你猜的是“${esc(x.guess.opts[LX.guess])}”，做出来也是“${esc(res)}”：猜对了！`:`你猜的是“${esc(x.guess.opts[LX.guess])}”，做出来是“${esc(res)}”。猜错也没关系，科学家就是这样一步一步弄清楚的。`}</p>
      <div class="lb-must"><small>拿分魔法句 · 课本原话</small>${esc(x.must)}</div>
      <div class="lb-row"><button class="lb-btn" data-lab-again="1">再做一次</button><button class="lb-btn pri" data-lab-list="1">回实验室</button></div></div>`;confetti&&confetti();}
}
function labOpts(bl){return typeof bl.opts==='function'?bl.opts(LX.rec):bl.opts;}
function labSentDraw(){const x=LX.x,parts=x.sent.t.split(/\{(\d)\}/);
  $('labSent').innerHTML=parts.map((p,i)=>i%2?`<span class="lb-bl${+p===LX.cur?' cur':''}${LX.bad&&LX.bad.includes(+p)?' no':''}" data-bl="${p}">${esc(LX.bl[+p]||'＿＿')}</span>`:esc(p)).join('');
  const bl=x.sent.blanks[LX.cur];$('labPool').innerHTML=labOpts(bl).map(o=>`<button class="lb-opt${LX.bl[LX.cur]===o?' on':''}" data-pick="${esc(o)}">${esc(o)}</button>`).join('');}
function labCheck(){const x=LX.x;LX.tries++;const badV=x.vars?x.vars.map(([,v],i)=>LX.vars[i]===v?-1:i).filter(i=>i>=0):[];
  LX.bad=x.sent.blanks.map((bl,i)=>LX.bl[i]===bl.ans(LX.rec)?-1:i).filter(i=>i>=0);
  document.querySelectorAll('.lb-var').forEach(el=>el.classList.toggle('no',badV.includes(+el.dataset.vi)));labSentDraw();
  const msg=$('labMsg');
  if(!badV.length&&!LX.bad.length){labFinish();return;}
  const miss=x.vars?x.vars.filter(([,v],i)=>LX.vars[i]==null).length:0;
  let t=miss?'每一行都要选：改的、量的，还是不变的。':badV.length?'红框的那几行再想一想：改的只有一个，量的就是你填进表里的数，其他都要保持不变。':'';
  if(LX.bad.length)t+=(t?'<br>':'')+(LX.tries>=2?'红色的空：答案是 '+LX.bad.map(i=>'<b>'+esc(x.sent.blanks[i].ans(LX.rec))+'</b>').join('、')+'。':'红色的空再想一想。看看你记下来的数字。');
  msg.innerHTML=`<div class="lb-tip warn">${t}</div>`;}
function labFinish(){const x=LX.x,st=labSt(),d=st.done[x.id]||(st.done[x.id]={n:0});d.n++;d.at=Date.now();d.best=Math.max(d.best||0,LX.tries<=1?3:2);
  S.stars=(S.stars||0)+(d.n===1?3:1);const dk=dkey(new Date());S.days[dk]=(S.days[dk]||0)+1;
  if(!Array.isArray(S.log))S.log=[];S.log.push({d:dk,ts:Date.now(),c:x.unit.startsWith('P3')?'life':'p4',t:'家里实验室 · Home Lab',k:x.en,h:QB.hash('lab:'+x.id),ok:LX.tries<=1?1:0});
  if(S.log.length>5000)S.log=S.log.slice(-5000);save();LX.step=4;labDraw();}
$('labBack').addEventListener('click',home);
$('labXBack').addEventListener('click',()=>{LX=null;labOpen();});
$('labList').addEventListener('click',e=>{const b=e.target.closest('[data-lab]');if(b)labStart(+b.dataset.lab);});
$('labBody').addEventListener('click',e=>{const t=e.target.closest('button,[data-bl]');if(!t||!LX)return;const D=t.dataset;
  if(D.need!=null){const i=+D.need;LX.need.has(i)?LX.need.delete(i):LX.need.add(i);labDraw();return;}
  if(D.guess!=null){LX.guess=+D.guess;labDraw();return;}
  if(D.go!=null){LX.step=+D.go;if(LX.step===2)LX.pic=1;labDraw();window.scrollTo(0,0);return;}
  if(D.pic!=null){const k=+D.pic;if(k>=1&&k<=4){LX.pic=k;labDraw();}return;}
  if(D.rk!=null&&D.rv!=null){LX.rec[D.rk]=D.rv;labDraw();return;}
  if(D.var!=null){LX.vars[+D.var]=D.v;t.closest('.lb-var').classList.remove('no');t.parentNode.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===t));return;}
  if(D.bl!=null){LX.cur=+D.bl;labSentDraw();return;}
  if(D.pick!=null){LX.bl[LX.cur]=D.pick;if(LX.bad)LX.bad=LX.bad.filter(i=>i!==LX.cur);const nx=LX.bl.findIndex(v=>v==null);if(nx>=0)LX.cur=nx;labSentDraw();return;}
  if(D.check!=null){labCheck();return;}
  if(D.labAgain!=null){labStart(LX.i);return;}
  if(D.labList!=null){LX=null;labOpen();return;}
});
$('labBody').addEventListener('input',e=>{const t=e.target.closest('.lb-in');if(!t||!LX)return;LX.rec[t.dataset.rk]=t.value.replace(/[^\d.]/g,'');
  const c=$('labChart');if(c)c.innerHTML=labChart();const g=$('labRecGo');if(g)g.disabled=!labRecDone();});
HOOK.tile.lab=labOpen;
HOOK.home.push(()=>{const el=$('labNote');if(!el)return;const d=labSt().done,n=LAB.filter(x=>d[x.id]).length;el.textContent=n?`做过 ${n} / ${LAB.length} 个`:`${LAB.length} 个实验 · 用家里的东西做`;});
window.__lab={LAB,LABPIC,labOpen,labStart};
