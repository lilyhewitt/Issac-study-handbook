/* ---------- 线段图路线 Bar Path: the bar-model kinds in the order of Math Island (and the mini papers). A stop is done when 5 of its last 6
   lessons were done without help; nothing is locked, the next stop not yet done is suggested. Lessons are the existing ones
   (build-it-yourself BAR by index, ready-drawn BAR2 by id); results kept in S.bar.path = {h:{stop:[1,0,…]}, done:{stop:date}}. ---------- */
const PATH=[   /* same order as Math Island (and the holiday mini papers); isl = the island it goes with */
 {id:'pw',g:'P3',t:'部分和整体 · Part-whole model',isl:'果园摘果、糖果铺',s:'一共、剩下：先画整条，再分段',k:['pw']},
 {id:'cmp',g:'P3',t:'比较 · Comparison model',isl:'跷跷板',s:'more / fewer：先圈谁多，长的画在上面',k:['cmp']},
 {id:'x1',g:'P3',t:'几格（知道小的） · Comparison model (units)',isl:'长颈鹿家',s:'twice as many as：as 后面的是 1 份',k:[0]},
 {id:'x2',g:'P3',t:'几格（知道大的） · Comparison model (units)',isl:'小蚂蚁洞',s:'知道几份是多少，先求 1 份',k:[1]},
 {id:'sd',g:'P3',t:'和差 · Comparison model (total and difference)',isl:'双胞胎桥',s:'一共和相差：先去掉多出的一段',k:[3]},
 {id:'xd',g:'P3',t:'几格的一共和相差 · Comparison model (units)',isl:'积木城堡',s:'多出来的是几份',k:[2]},
 {id:'ba',g:'P3',t:'前后变化、往回推 · Part-whole / Comparison (before and after)',isl:'时光隧道',s:'给出去、买进来，从最后往回走',k:['same',5,'move','flow',6,7]},
 {id:'three',g:'P3',t:'三个量 · Comparison model (three items)',isl:'宝藏洞',s:'三根线段比长短',k:[4]},
 {id:'gc',g:'P4',t:'猜测检查 · Guess and check (table)',isl:'猜猜鸡兔',s:'列表一行一行试',k:['table']},
 {id:'fr',g:'P4',t:'几分之几 · Part-whole model (fractions)',isl:'披萨店',s:'把整体平均分，取其中几份',k:['pie']},
 {id:'frba',g:'P4',t:'剩下的再取几分之几 · Part-whole model (fractions)',isl:'面包房',s:'先取一部分，剩下的再分',k:['branch']}];
let PTH=null;
function pathSt(){const b=barSt();if(!b.path||typeof b.path!=='object')b.path={};const p=b.path;
  if(!p.h||typeof p.h!=='object')p.h={};if(!p.done||typeof p.done!=='object')p.done={};return p;}
function pathRight(i){return (pathSt().h[PATH[i].id]||[]).slice(-6).filter(x=>x).length;}
function pathNext(){const p=pathSt();const i=PATH.findIndex(x=>!p.done[x.id]);return i<0?null:i;}
function pathOpen(){PTH=null;BR=null;BD=null;document.body.classList.remove('br-wide');show('vPath');const p=pathSt(),nx=pathNext();
  let h='',g='';PATH.forEach((x,i)=>{if(x.g!==g){g=x.g;h+=`<h3 class="pt-g">${g==='P3'?'P3 学过的线段图':'P4 上半学期 · 先见一见'}</h3>`;}
    const n=(p.h[x.id]||[]).length,done=!!p.done[x.id];
    h+=`<button class="pt-st${done?' done':''}${i===nx?' now':''}" data-pt="${i}"><b>${done?'✓':i+1}</b><span class="t">${esc(x.t.split(' · ')[0])} <em class="pt-en">${esc(x.t.split(' · ').slice(1).join(' · '))}</em><small>${esc(x.s)} · 小岛：${esc(x.isl)}</small></span><span class="r">${done?'会了':n?'最近 6 题对 '+pathRight(i):''}</span></button>`;});
  $('ptList').innerHTML=h;
  $('ptGo').textContent=nx==null?'全部走完了！再练一题 ▶':'下一站：'+PATH[nx].t.split(' · ')[0]+' ▶';$('ptGo').dataset.pt=nx==null?Math.floor(Math.random()*PATH.length):nx;}
function pathGo(i){PTH=i;const ks=PATH[i].k,n=(pathSt().h[PATH[i].id]||[]).length;barStart(ks[n%ks.length]);}
/* after a lesson in the path: remember it, say how the stop is going; a stop done moves on to the next one */
function pathRec(ok){const i=PTH,id=PATH[i].id,p=pathSt();(p.h[id]=p.h[id]||[]).push(ok?1:0);if(p.h[id].length>30)p.h[id]=p.h[id].slice(-30);
  const r=pathRight(i);
  if(!p.done[id]&&r>=5){p.done[id]=dkey(new Date());const nx=pathNext();PTH=nx==null?i:nx;
    return `这一站会了！${nx==null?'整条路线都走完了。':'下一题开始：'+PATH[nx].t.split(' · ')[0]+'。'}`;}
  return `「${PATH[i].t.split(' · ')[0]}」最近 6 题自己做对 ${r} 题${p.done[id]?'。':'，做对 5 题这一站就会了。'}`;}
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
  el.textContent=nx==null?`路线走完了 · ${n}/${PATH.length}`:`路线 ${n}/${PATH.length} · 下一站：${PATH[nx].t.split(' · ')[0]}`;});
window.__path={PATH,pathSt,pathGo,pathRec,cur:()=>PTH};
