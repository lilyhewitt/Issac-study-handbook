/* ---------- 介词词组: its own deck, two groups a week. Learning = cards, then "which small word is missing?".
   Review moves on as a phrase gets known: the phrase → a sentence → a short story (and "spot the wrong small word"). ---------- */
const PPD=QB.PPG||[],PPL=QB.PP||[];
function ppSt(){if(!S.pp||typeof S.pp!=='object')S.pp={};if(!S.ppg||typeof S.ppg!=='object')S.ppg={};}
function ppDue(){ppSt();const t=dkey(new Date());return PPL.filter(p=>S.pp[p.id]&&S.pp[p.id].due<=t);}
function ppNext(){ppSt();return PPD.map((g,i)=>i).filter(i=>!S.ppg[PPD[i].t]||PPL.some(p=>p.g===i&&!S.pp[p.id])).slice(0,2);}
function ppStatus(id){const s=S.pp[id];return !s?'':s.box>=4?'s2':s.box===0?'s0':'s1';}
function ppHTML(p){const t=esc(p.id),re=new RegExp('\\b'+p.key+'\\b','g');let last=-1,m;while((m=re.exec(t)))last=m.index;
  return last<0?t:t.slice(0,last)+'<b class="pp-k">'+p.key+'</b>'+t.slice(last+p.key.length);}
function ppNote(){const d=ppDue().length,nx=ppNext();return d?`今天复习 ${d} 个`:nx.length?`下一组：${PPD[nx[0]].zh}`:'全部学完了';}
function ppView(){ppSt();show('vPP');const due=ppDue(),nx=ppNext(),learned=PPL.filter(p=>S.pp[p.id]).length,mast=PPL.filter(p=>ppStatus(p.id)==='s2').length;
  $('ppSum').innerHTML=`<div class="st-big"><b>${learned}</b> 个词组学过 · <b>${mast}</b> 个记住了</div><p class="st-sub">一周学两组，每组 5 个。复习时先补词组里的小词，熟了放进句子，再放进小故事。</p>`;
  $('ppReview').disabled=!due.length;$('ppReview').textContent=due.length?`复习今天的词组（${due.length} 个）`:'今天没有要复习的词组';
  $('ppSets').innerHTML=PPD.map((g,i)=>{const done=!!S.ppg[g.t],isNext=nx.includes(i);
    return `<div class="wset${isNext?' next':''}"><div class="wset-h"><span>${i+1}. ${esc(g.t)} <small>${esc(g.zh)}</small></span>${isNext?'<span class="wt-r">下一组</span>':done?`<small>${esc(S.ppg[g.t].slice(5).replace('-','/'))} 学的</small>`:''}</div>`
      +`<div class="chips2">${PPL.filter(p=>p.g===i).map(p=>`<span class="wchip ${ppStatus(p.id)}">${ppHTML(p)}</span>`).join('')}</div>`
      +(done||isNext?`<button class="sbtn${done?' ghost':''}" data-pplearn="${i}">${done?'再看一遍':'学这 5 个词组'}</button>`:'')+'</div>';}).join('');}
let PPC=null;
function ppCards(gi){PPC={gi,i:0,list:PPL.filter(p=>p.g===gi)};show('vPPCard');ppCard();}
function ppCard(){const p=PPC.list[PPC.i],g=PPD[PPC.gi];
  $('ppcSet').textContent=`${g.t} · ${g.zh} · ${PPC.i+1}/${PPC.list.length}`;
  $('ppcWord').innerHTML=ppHTML(p);$('ppcZh').textContent=p.zh;$('ppcEx').innerHTML=fmt(p.ex);
  $('ppcNext').textContent=PPC.i<PPC.list.length-1?'Next 下一个':'Check! 考考自己';
  $('ppcPips').innerHTML=PPC.list.map((x,j)=>`<span class="pip ${j<PPC.i?'ok':j===PPC.i?'now':''}"></span>`).join('');window.scrollTo(0,0);}
/* rounds, answers, tasks and the end of a round go through the shared app's HOOK */
HOOK.round=mode=>{
  if(/^pplearn:\d+$/.test(mode)){const gi=+mode.slice(8);ppSt();if(!S.ppg[PPD[gi].t])S.ppg[PPD[gi].t]=dkey(new Date());return QB.shuf(PPL.filter(p=>p.g===gi)).map(p=>QB.PPX.word(p));}
  if(mode==='ppreview'){const qs=[];let story=false;
    QB.shuf(ppDue()).slice(0,ROUND).forEach(p=>{const b=S.pp[p.id].box;
      if(b>=4&&!story&&Math.random()<.5){story=true;qs.push(...QB.PPX.story(p.g));}
      else qs.push(b<=1?QB.PPX.word(p):QB.PPX.sentence(p));});
    const learned=PPL.filter(p=>S.pp[p.id]);
    if(learned.length>=8&&qs.length&&ppDue().some(p=>S.pp[p.id].box>=3)){const w=QB.PPX.wrong(learned);if(w)qs.push(w);}
    return qs;}
  return null;};
HOOK.answer.push((q,ok)=>{if(!q.pp)return;ppSt();const t=dkey(new Date()),s=S.pp[q.pp]||(S.pp[q.pp]={box:0,due:t,n:0,bad:0});s.n++;
  if(ok){s.box=Math.min(s.box+1,INTV.length-1);s.due=addDays(INTV[s.box]);}else{s.bad++;s.box=0;s.due=addDays(1);}});
HOOK.side=mode=>mode==='ppreview'?{label:'Phrases 回介词词组',task:'pp',sub:' 答对的词组会隔更久再考，熟了会放进句子和小故事。',back:ppView}
  :/^pplearn:/.test(mode)?{label:'Phrases 回介词词组',task:'ppnew',sub:' 这几个词组过两天会再考一次。',back:ppView}:null;
HOOK.tasks.push(t=>{const due=ppDue().length;
  if(due||t.pp)return {k:'pp',name:'复习今天的词组 · Phrases'+(due?'（'+due+' 个）':''),done:!due&&!!t.pp};
  const thisWeek=Object.values(S.ppg||{}).filter(d=>d>=addDays(-6)).length;
  if(t.ppnew||(thisWeek<2&&ppNext().length))return {k:'ppnew',name:'学一组新词组 · New phrases',done:!!t.ppnew};
  return null;});
HOOK.task.pp=()=>{if(ppDue().length)startRound('ppreview');else ppView();};
HOOK.task.ppnew=()=>{const nx=ppNext();if(nx.length)ppCards(nx[0]);else ppView();};
$('ppBack').addEventListener('click',home);
$('ppReview').addEventListener('click',()=>{if(ppDue().length)startRound('ppreview');});
$('ppSets').addEventListener('click',e=>{const b=e.target.closest('[data-pplearn]');if(b)ppCards(+b.dataset.pplearn);});
$('ppcQuit').addEventListener('click',()=>{try{speechSynthesis.cancel();}catch(e){}ppView();});
$('ppcSay').addEventListener('click',()=>{const p=PPC.list[PPC.i];speakText(`${p.id}. ${p.ex.replace(/\*\*/g,'')}`);});
$('ppcNext').addEventListener('click',()=>{if(PPC.i<PPC.list.length-1){PPC.i++;ppCard();}else startRound('pplearn:'+PPC.gi);});

/* Home: six square tiles. Word cards, phrases and try-again open from their tile; Words is a round with spell-it mixed in. */
function tileNotes(){const by=c=>{const x=S.by[c]||[0,0];return x[0]?`${x[0]} 题 · 对 ${Math.round(x[1]/x[0]*100)}%`:'还没做';};
  const L=WL.filter(w=>S.wd[w.w]).length,dn=dueWords().length,nx=nextSet();
  $('tnCards').textContent=dn?`今天复习 ${dn} 个`:L?`学过 ${L}/${WL.length}`:nx>=0?`下一组：${WS[nx].title}`:'';
  ppSt();const pl=PPL.filter(p=>S.pp[p.id]).length,pd=ppDue().length,pn=ppNext();
  $('tnPP').textContent=pd?`今天复习 ${pd} 个`:pl?`学过 ${pl}/${PPL.length}`:pn.length?`下一组：${PPD[pn[0]].zh}`:'';
  $('tnWord').textContent=by('word');$('tnGram').textContent=by('gram');$('tnRead').textContent=by('read');
  const n=S.misses.length;$('redoNote').textContent=n?n+' 题':'现在没有错题';$('tRedo').classList.toggle('empty',!n);}
HOOK.tile.cards=wordsView;HOOK.tile.pp=ppView;HOOK.tile.redo=()=>{if(S.misses.length)startRound('redo');};
HOOK.home.push(tileNotes);
