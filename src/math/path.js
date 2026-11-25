/* ---------- 线段图路线 Bar Path: the bar-model kinds in teaching order, simplest first. A stop is done when 5 of its last 6
   lessons were done without help; nothing is locked, the next stop not yet done is suggested. Lessons are the existing ones
   (build-it-yourself BAR by index, ready-drawn BAR2 by id); results kept in S.bar.path = {h:{stop:[1,0,…]}, done:{stop:date}}. ---------- */
const PATH=[
 {g:'P3',t:'部分和整体',s:'一共、剩下：先画整条，再分段',k:['pw']},
 {g:'P3',t:'比多比少',s:'more / fewer：先圈谁多，长的画在上面',k:['cmp']},
 {g:'P3',t:'几倍 · 知道小的',s:'twice as many as：as 后面的是 1 份',k:[0]},
 {g:'P3',t:'几倍 · 知道大的',s:'知道几份是多少，先求 1 份',k:[1]},
 {g:'P3',t:'和差',s:'一共和相差：先去掉多出的一段',k:[3]},
 {g:'P3',t:'几倍和相差',s:'多出来的是几份',k:[2]},
 {g:'P3',t:'三个量',s:'三根线段比长短',k:[4]},
 {g:'P3',t:'前后变化',s:'给出去、买进来：差不变、总数不变',k:['same','move',6,7]},
 {g:'P3',t:'倒推',s:'从最后往回走',k:[5,'flow']},
 {g:'P4',t:'几分之几',s:'把整体平均分，取其中几份',k:['pie']},
 {g:'P4',t:'剩下的再取几分之几',s:'先取一部分，剩下的再分',k:['branch']},
 {g:'P4',t:'假设法 · 猜测检查',s:'列表一行一行试',k:['table']}];
let PTH=null;
function pathSt(){const b=barSt();if(!b.path||typeof b.path!=='object')b.path={};const p=b.path;
  if(!p.h||typeof p.h!=='object')p.h={};if(!p.done||typeof p.done!=='object')p.done={};return p;}
function pathRight(i){return (pathSt().h[i]||[]).slice(-6).filter(x=>x).length;}
function pathNext(){const p=pathSt();const i=PATH.findIndex((x,j)=>!p.done[j]);return i<0?null:i;}
function pathOpen(){PTH=null;BR=null;BD=null;document.body.classList.remove('br-wide');show('vPath');const p=pathSt(),nx=pathNext();
  let h='',g='';PATH.forEach((x,i)=>{if(x.g!==g){g=x.g;h+=`<h3 class="pt-g">${g==='P3'?'P3 学过的线段图':'P4 上半学期 · 先见一见'}</h3>`;}
    const n=(p.h[i]||[]).length,done=!!p.done[i];
    h+=`<button class="pt-st${done?' done':''}${i===nx?' now':''}" data-pt="${i}"><b>${done?'✓':i+1}</b><span class="t">${esc(x.t)}<small>${esc(x.s)}</small></span><span class="r">${done?'会了':n?'最近 6 题对 '+pathRight(i):''}</span></button>`;});
  $('ptList').innerHTML=h;
  $('ptGo').textContent=nx==null?'全部走完了！再练一题 ▶':'下一站：'+PATH[nx].t+' ▶';$('ptGo').dataset.pt=nx==null?Math.floor(Math.random()*PATH.length):nx;}
function pathGo(i){PTH=i;const ks=PATH[i].k,n=(pathSt().h[i]||[]).length;barStart(ks[n%ks.length]);}
/* after a lesson in the path: remember it, say how the stop is going; a stop done moves on to the next one */
function pathRec(ok){const i=PTH,p=pathSt();(p.h[i]=p.h[i]||[]).push(ok?1:0);if(p.h[i].length>30)p.h[i]=p.h[i].slice(-30);
  const r=pathRight(i);
  if(!p.done[i]&&r>=5){p.done[i]=dkey(new Date());const nx=pathNext();PTH=nx==null?i:nx;
    return `这一站会了！${nx==null?'整条路线都走完了。':'下一题开始：'+PATH[nx].t+'。'}`;}
  return `「${PATH[i].t}」最近 6 题自己做对 ${r} 题${p.done[i]?'。':'，做对 5 题这一站就会了。'}`;}
const barFinishP=barFinish;barFinish=function(){const r=barFinishP();if(PTH!=null&&BR)BR.msg+=' '+pathRec(!BR.help);return r;};
const bdFinishP=bdFinish;bdFinish=function(){if(PTH!=null&&BD)BD.msg=(BD.msg?BD.msg+' ':'')+pathRec(!BD.help);return bdFinishP();};
const barStartP=barStart;barStart=function(k){if(k==null&&PTH!=null)return pathGo(PTH);return barStartP(k);};
const barCatP=barCat;barCat=function(){PTH=null;return barCatP();};
$('vPath').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.id==='ptQuit'){home();return;}
  if(t.id==='ptBook'){barCat();return;}
  if(t.dataset.pt!=null)pathGo(+t.dataset.pt);});
HOOK.tile.bar=()=>pathOpen();
HOOK.home.push(()=>{PTH=null;const el=$('brNote');if(!el)return;const p=pathSt(),nx=pathNext(),n=Object.keys(p.done).length;
  el.textContent=nx==null?`路线走完了 · ${n}/${PATH.length}`:`路线 ${n}/${PATH.length} · 下一站：${PATH[nx].t}`;});
window.__path={PATH,pathSt,pathGo,pathRec,cur:()=>PTH};
