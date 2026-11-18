/* ---------- 线段图 tile, part 2: the 9 kinds of picture that are drawn for him (看图标数: put the numbers and the ? on it, then use it),
   and the picture book (图鉴) of all 17 kinds, every one can be opened; ⭐ 推荐 opens the kind done right the fewest times. ---------- */
let BD=null;
const BIC=['unit','unit','cmp','sd','three','ba','move','ba'];   /* icons for the 8 build-it-yourself kinds */
function bar2(){return QB.BAR2||[];}
function barKinds(){return barTypes().map((t,i)=>i).concat(bar2().map(t=>t.id));}
function barName(k){return typeof k==='number'?(barTypes()[k]||{}).t:(bar2().find(t=>t.id===k)||{}).t;}
/* recommended: done right (without help) the fewest times; ties go to the first in the book */
function barRec(){const st=barSt(),ok=k=>st.ok[k]||0,ks=barKinds(),lo=Math.min(...ks.map(ok));return ks.find(k=>ok(k)===lo);}
function barRand(){const st=barSt(),ok=k=>st.ok[k]||0,ks=barKinds(),lo=Math.min(...ks.map(ok)),c=ks.filter(k=>ok(k)===lo);return c[Math.floor(Math.random()*c.length)];}
const barStart0=barStart;
barStart=function(k){BD=null;if(k==null)k=barRand();if(typeof k==='string')return bdStart(k);return barStart0(k);};
function barCat(){BR=null;BD=null;document.body.classList.remove('br-wide');show('vBarCat');const st=barSt(),n=k=>st.n[k]||0,ok=k=>st.ok[k]||0,rec=barRec();
  const card=(k,ic)=>`<button class="bc-i${ok(k)>=3?' got':''}" data-bt="${k}"><svg viewBox="0 0 60 46" aria-hidden="true">${FIGSVG[ic]||''}</svg><b>${esc(barName(k))}</b><small>${n(k)?`做了 ${n(k)} · 自己对 ${ok(k)}`:'还没做'}${ok(k)>=3?' ⭐':''}</small></button>`;
  const got=barKinds().filter(k=>ok(k)>=3).length;
  $('bcRec').innerHTML=`⭐ 推荐：${esc(barName(rec))}`;$('bcRec').dataset.bt=rec;
  $('bcTot').textContent=`${got} / ${barKinds().length} 种会了（自己做对 3 次）`;
  $('bcList').innerHTML=`<h3>自己搭格子 <small>先搭格子，再标数字和问号</small></h3><div class="bc-g">${barTypes().map((t,i)=>card(i,BIC[i]||'unit')).join('')}</div>
    <h3>看图标数 <small>图已经画好了，把数字和问号放上去</small></h3><div class="bc-g">${bar2().map(t=>card(t.id,t.id)).join('')}</div>`;}
function bdStart(id){const T=bar2().find(t=>t.id===id);if(!T){barCat();return;}const st=barSt();st.cur=id;BR=null;const L=T.f();
  BD={id,T,L,step:'mk',mk:L.dg.mk.map(x=>x.slice()),mkI:0,pl:[],tries:0,help:0,ci:0,used:[],zh:false,dec:dgDecoys(L.dg,dgLay(L.dg)),msg:'图已经画好了。把数字和问号放上去。'};
  show('vBar');document.body.classList.add('br-wide');bdDraw();}
function bdDraw(bad){const L=BD.L;$('brType').textContent=BD.T.t;$('brP').innerHTML=lines(L.p);$('brZh').textContent=L.zh;$('brZh').hidden=!BD.zh;$('brZhB').setAttribute('aria-pressed',BD.zh?'true':'false');
  const order=['mk','calc','done'],ci=order.indexOf(BD.step);
  $('brSteps').innerHTML=[['mk','① 标数字和问号'],['calc','② 用图算']].map(([k,t])=>{const i=order.indexOf(k);return`<li class="${i===ci?'on':i<ci?'ok':''}">${t}</li>`;}).join('');
  const spots=BD.step==='mk'?BD.mk.slice(BD.mkI).map(x=>x[0]).concat(BD.dec):[];
  $('brFig').innerHTML=dgSvg({...L.dg,mk:[]},BD.pl,spots,bad);$('brMsg').textContent=BD.msg||'';
  let h='';
  if(BD.step==='mk'){const c=BD.mk[BD.mkI];
    h=(c[1]==='?'?'<p class="br-p">问号 <span class="isl-chip q">?</span> 放在哪里？</p><p class="br-zh">题目问的是图上哪一段？点图上的虚线框。</p>'
      :`<p class="br-p">把 <span class="isl-chip">${esc(c[1])}</span> 放到图上</p><p class="br-zh">它是图上哪一段？点图上的虚线框。</p>`)+
      `<div class="isl-chips2">${BD.mk.map((x,i)=>`<span class="${i<BD.mkI?'done':i===BD.mkI?'now':''}">${esc(x[1])}</span>`).join('')}</div>`;}
  else if(BD.step==='calc'){const c=L.calc[BD.ci];h=`<p class="br-p">${esc(c.q)}</p><div class="br-opts">`+c.o.map((x,i)=>`<button class="br-o" data-bdo="${i}"${BD.used.includes(i)?' disabled':''}>${esc(x)}</button>`).join('')+'</div>';}
  else h=`<p class="br-sum">${esc(L.sum)}</p><p class="br-p">在纸上照这个图再画一遍。</p><button class="sbtn" id="bdNext">再来一题</button><button class="br-other" id="brTypes2">图鉴 · 换一种图</button><button class="br-other" id="brHome">回首页</button>`;
  $('brCtl').innerHTML=h;}
function bdTap(id){const L=dgLay(BD.L.dg),s=L.spot(id),cur=BD.mk[BD.mkI];if(!s||!cur)return;
  const j=BD.mk.findIndex((m,i)=>i>=BD.mkI&&m[1]===cur[1]&&L.spot(m[0]).key===s.key);
  const put=msg=>{BD.pl.push(BD.mk[BD.mkI]);BD.mkI++;BD.tries=0;BD.msg=msg;if(BD.mkI>=BD.mk.length){BD.step='calc';BD.ci=0;BD.used=[];BD.msg=(msg?msg+' ':'')+'图标好了！现在用图来算。';}bdDraw();};
  if(j>=0){if(j!==BD.mkI){const t=BD.mk[j];BD.mk[j]=BD.mk[BD.mkI];BD.mk[BD.mkI]=t;}beep(true);put('对！');return;}
  beep(false);if(++BD.tries>=2){BD.help=1;put(`看一看：「${cur[1]}」放在这里。`);return;}
  BD.msg=cur[1]==='?'?'再读最后一句：问的是谁、问什么？':`再读一读题目：「${cur[1]}」是谁的？`;bdDraw(id);}
function bdCalc(i){const c=BD.L.calc[BD.ci],ok=String(c.o[i])===String(c.a);
  if(ok||++BD.tries>=2){if(!ok)BD.help=1;BD.msg=ok?'对！':`是 ${c.a}。看一看图。`;BD.used=[];BD.tries=0;if(++BD.ci>=BD.L.calc.length){bdFinish();return;}}
  else{BD.used.push(i);BD.msg='再看看图。';}
  bdDraw();}
function bdFinish(){const L=BD.L,st=barSt(),dk=dkey(new Date());BD.step='done';st.n[BD.id]=(st.n[BD.id]||0)+1;
  S.days[dk]=(S.days[dk]||0)+1;S.stars++;
  const e={d:dk,ts:Date.now(),c:'wp',t:'Bar models · 画线段图',h:QB.hash('bar:'+L.p),ok:BD.help?0:1};
  if(BD.help){e.q=L.p.slice(0,160);e.a='标图时用了提示';e.r=L.sum.slice(0,120);}
  if(!Array.isArray(S.log))S.log=[];S.log.push(e);if(S.log.length>5000)S.log=S.log.slice(-5000);
  tkDay().bar=1;if(!BD.help)st.ok[BD.id]=(st.ok[BD.id]||0)+1;
  BD.msg=(BD.msg?BD.msg+' ':'')+(BD.help?'做完了！下次自己试试看。':'做完了，全是自己做的！');save();beep(true);bdDraw();}
$('vBar').addEventListener('click',e=>{if(!BD)return;const t=e.target.closest('button,.dg-sp');if(!t)return;
  if(t.classList.contains('dg-sp')){if(BD.step==='mk')bdTap(t.dataset.s);return;}
  const id=t.id,d=t.dataset;
  if(id==='brQuit'||id==='brHome'){BD=null;home();return;}
  if(id==='brSay'){speakText(BD.L.p);return;}
  if(id==='brZhB'){BD.zh=!BD.zh;bdDraw();return;}
  if(id==='brTypes'||id==='brTypes2'){barCat();return;}
  if(id==='bdNext'){barStart();return;}
  if(d.bdo!=null)bdCalc(+d.bdo);});
$('vBarCat').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.id==='bcQuit'){home();return;}
  const k=t.dataset.bt;if(k==null)return;barStart(/^\d+$/.test(k)?+k:k);});
HOOK.tile.bar=()=>barCat();
/* tile note: how many kinds he can already do on his own (after barNote, which only names the last one) */
HOOK.home.push(()=>{const el=$('brNote');if(!el)return;const st=barSt(),got=barKinds().filter(k=>(st.ok[k]||0)>=3).length;el.textContent=`图鉴 · 会了 ${got}/${barKinds().length} 种`;});
window.__bar={BD:()=>BD,BR:()=>BR,cat:barCat,rec:barRec};   /* for the tests */
