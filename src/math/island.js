/* ---------- 数学小岛 Math Island: word problems as a map. Each problem goes 4 fixed steps:
   ① 侦探看问题 (what is asked) → ② 划重点 + 提炼 (key words, plan) → ③ 画线段 (which picture) → ④ 闪电算 (answer).
   Hints fade: at the start of a station all four steps, later only step ①, the last problem none.
   Campfires mix the stations before them and ask him to pick the picture himself. ---------- */
const ISL=QB.ISLAND||[],ICH=QB.ISLAND_CHEST||[];
const ISLICON={'果园摘果':'fruit','糖果铺':'sweet','跷跷板':'seesaw','长颈鹿家':'giraffe','小蚂蚁洞':'ant','双胞胎桥':'bridge','积木城堡':'castle','时光隧道':'tunnel','宝藏洞':'gem',
  '挑战关 1':'flag','猜猜鸡兔':'bunny','披萨店':'pizza','面包房':'bread','小卖部':'coin','风车坡':'windmill','花园小路':'flower','气象站':'chart','钟楼':'clock','挑战关 2':'flag'};
const FIGS={pw:['部分-整体','Part-whole'],cmp:['比较图','Comparison'],unit:['单位图','Units'],three:['三个量','Three people'],sd:['和差图','Sum & difference'],
  ba:['前后图','Before & after'],same:['差不变','Same difference'],move:['转移箭头','Give & take'],flow:['倒推流程','Work backwards'],pie:['分数圆','Fraction circle'],
  branch:['剩余分支','The remainder'],line:['间隔图','Intervals'],table:['猜测检查表','Guess & check'],angle:['角','Angles'],rect:['长方形','Rectangles'],chart:['读图表','Graphs'],time:['时间线','Time line']};
const FIGSVG={ /* tiny pictures for the “which picture?” step */
  pw:'<rect x="4" y="16" width="34" height="12" rx="2" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><rect x="38" y="16" width="18" height="12" rx="2" fill="#FDE8DD" stroke="#E25F2A" stroke-width="2"/><path d="M4 10h52" stroke="#17203B" stroke-width="2"/>',
  cmp:'<rect x="4" y="10" width="40" height="10" rx="2" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><rect x="4" y="26" width="26" height="10" rx="2" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><path d="M30 31h14" stroke="#E25F2A" stroke-width="2" stroke-dasharray="3 2"/>',
  unit:'<g fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"><rect x="4" y="10" width="12" height="10"/><rect x="4" y="26" width="12" height="10"/><rect x="16" y="26" width="12" height="10"/><rect x="28" y="26" width="12" height="10"/></g>',
  three:'<g fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"><rect x="4" y="6" width="14" height="8"/><rect x="4" y="18" width="42" height="8"/><rect x="4" y="30" width="28" height="8"/></g>',
  sd:'<rect x="4" y="10" width="30" height="10" rx="2" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><rect x="4" y="26" width="30" height="10" rx="2" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><rect x="34" y="26" width="14" height="10" rx="2" fill="#FDE8DD" stroke="#E25F2A" stroke-width="2"/><path d="M52 10v26" stroke="#17203B" stroke-width="2"/>',
  ba:'<rect x="4" y="8" width="34" height="9" rx="2" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><path d="M30 22v6" stroke="#17203B" stroke-width="2"/><rect x="4" y="30" width="24" height="9" rx="2" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><rect x="28" y="30" width="10" height="9" rx="2" fill="none" stroke="#E25F2A" stroke-width="2" stroke-dasharray="3 2"/>',
  same:'<rect x="4" y="10" width="40" height="10" rx="2" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><rect x="4" y="26" width="24" height="10" rx="2" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><rect x="44" y="10" width="10" height="10" fill="#FDE8DD" stroke="#E25F2A" stroke-width="2"/><rect x="28" y="26" width="10" height="10" fill="#FDE8DD" stroke="#E25F2A" stroke-width="2"/>',
  move:'<rect x="4" y="8" width="44" height="10" rx="2" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><rect x="4" y="28" width="24" height="10" rx="2" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><path d="M42 20q0 10-8 13" stroke="#E25F2A" stroke-width="2.5" fill="none"/><path d="M34 33l3-5 2 6z" fill="#E25F2A"/>',
  flow:'<rect x="2" y="16" width="14" height="14" rx="3" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><path d="M17 23h7" stroke="#17203B" stroke-width="2"/><rect x="24" y="16" width="14" height="14" rx="3" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><path d="M39 23h7" stroke="#17203B" stroke-width="2"/><rect x="46" y="16" width="12" height="14" rx="3" fill="#FFF2D0" stroke="#FFB400" stroke-width="2"/>',
  pie:'<circle cx="30" cy="23" r="17" fill="#eef1f6" stroke="#17203B" stroke-width="2"/><path d="M30 23V6A17 17 0 0 1 47 23z" fill="#E25F2A"/><path d="M30 23h17A17 17 0 0 1 30 40z" fill="#2F66F0"/>',
  branch:'<g stroke="#2F66F0" stroke-width="2" fill="#E2EAFE"><rect x="4" y="8" width="13" height="10"/><rect x="17" y="8" width="13" height="10"/><rect x="30" y="8" width="13" height="10"/><rect x="43" y="8" width="13" height="10"/><rect x="17" y="30" width="13" height="10"/><rect x="30" y="30" width="13" height="10"/><rect x="43" y="30" width="13" height="10"/></g><rect x="4" y="8" width="13" height="10" fill="#FDE8DD" stroke="#E25F2A" stroke-width="2"/><path d="M17 19v10M56 19v10" stroke="#17203B" stroke-dasharray="2 2"/>',
  line:'<path d="M4 30h52" stroke="#17203B" stroke-width="2"/><g fill="#FFC02E" stroke="#B07C12" stroke-width="1.5">'+[6,20,34,48].map(x=>`<circle cx="${x}" cy="22" r="4"/>`).join('')+'</g><path d="M6 34q7 5 14 0M20 34q7 5 14 0M34 34q7 5 14 0" stroke="#E25F2A" stroke-width="1.6" fill="none"/>',
  table:'<rect x="4" y="6" width="52" height="34" rx="3" fill="#fff" stroke="#9aa3b5" stroke-width="2"/><path d="M4 16h52M4 26h52M21 6v34M38 6v34" stroke="#9aa3b5" stroke-width="1.5"/><rect x="5" y="27" width="50" height="12" fill="#E1F5E9"/>',
  angle:'<path d="M6 36h48M30 36L46 10" stroke="#17203B" stroke-width="2.5" fill="none"/><path d="M40 36a10 10 0 0 0-4-8" stroke="#E25F2A" stroke-width="2" fill="none"/>',
  rect:'<rect x="6" y="8" width="48" height="30" fill="#E2EAFE" stroke="#2F66F0" stroke-width="2"/><rect x="12" y="14" width="36" height="18" fill="#fff" stroke="#2F66F0" stroke-width="1.5" stroke-dasharray="3 2"/>',
  chart:'<path d="M6 6v32h50" stroke="#17203B" stroke-width="2" fill="none"/><rect x="12" y="22" width="8" height="16" fill="#5a8cff"/><rect x="25" y="12" width="8" height="26" fill="#ff7b39"/><rect x="38" y="18" width="8" height="20" fill="#3fb24f"/>',
  time:'<path d="M4 24h52" stroke="#17203B" stroke-width="2"/><g fill="#2F66F0"><circle cx="6" cy="24" r="3"/><circle cx="24" cy="24" r="3"/><circle cx="44" cy="24" r="3"/><circle cx="56" cy="24" r="3"/></g><path d="M6 18q9-8 18 0M24 18q10-8 20 0" stroke="#E25F2A" stroke-width="1.6" fill="none"/>'};
const STEPS=[['ask','🔍','侦探看问题','Detective'],['plan','✏️','划重点','Spot it'],['fig','📏','画线段','Draw it'],['ans','⚡','闪电算','Solve it']];

function islSt(){if(!S.isl||typeof S.isl!=='object'||Array.isArray(S.isl))S.isl={};const s=S.isl;
  for(const k of['st','rv','ch','sk'])if(!s[k]||typeof s[k]!=='object'||Array.isArray(s[k]))s[k]={};if(!Array.isArray(s.miss))s.miss=[];return s;}
/* the road: stations, a campfire after every 3 stations of a part (and at the end of a part), a challenge at the end of each part,
   the lighthouse between P3 and P4; a chest beside every 2nd campfire */
function islRoad(){const L=[];let rv=0,run=[];
  const camp=()=>{L.push({t:'r',r:rv,from:run.slice()});rv++;run=[];};
  ISL.forEach((s,i)=>{
    if(s.ch){if(run.length)camp();L.push({t:'s',i});if(s.seg==='P3')L.push({t:'l'});return;}
    L.push({t:'s',i});run.push(i);if(run.length===3)camp();});
  if(run.length)camp();
  return L;}
function islDone(n){const s=islSt();if(n.t==='s')return!!s.st[n.i];if(n.t==='r')return!!s.rv[n.r];return true;}
function islCur(){const L=islRoad();for(let i=0;i<L.length;i++){if(L[i].t==='l')continue;if(!islDone(L[i]))return i;}return L.length;}
function islName(n){if(n.t==='s')return ISL[n.i].name;if(n.t==='r')return'营火复习';return'灯塔';}
function islEn(n){if(n.t==='s')return ISL[n.i].en;if(n.t==='r')return'Campfire';return'Lighthouse';}
function islIcon(n){return n.t==='s'?ISLICON[ISL[n.i].name]||'gem':n.t==='r'?'camp':'light';}
const islChestOf=r=>r%2===1?(r-1)/2:-1;

/* ---------- map ---------- */
let ISLWALK=null;
function islOpen(walk){islSt();show('vIsl');islDraw(walk);}
function islStarSvg(x,y,on){return`<path transform="translate(${x} ${y}) scale(.55)" d="M0-12l3.5 7.2 8 1.1-5.8 5.6 1.4 7.9L0 6 -7.1 9.8l1.4-7.9-5.8-5.6 8-1.1z" fill="${on?'#ffc02e':'#d7dde8'}" stroke="${on?'#b07c12':'#aab3c4'}" stroke-width="2"/>`;}
function islDraw(walk){const s=islSt(),L=islRoad(),cur=islCur(),wide=innerWidth>=900;
  const P=[];let W,H;
  if(wide){const X=[110,300,490,680];W=820;const rows=Math.ceil(L.length/4);H=120+rows*205;
    L.forEach((n,i)=>{const r=Math.floor(i/4),c=i%4;P.push([r%2?X[3-c]:X[c],110+r*205]);});}
  else{W=390;H=170+L.length*96;L.forEach((n,i)=>P.push([i%2?272:118,120+i*96]));}
  let path=`M${wide?30:60} ${wide?P[0][1]:40} L ${P[0][0]} ${P[0][1]}`;
  for(let i=1;i<P.length;i++){const [ax,ay]=P[i-1],[bx,by]=P[i];
    if(wide&&ay===by)path+=` L ${bx} ${by}`;else if(wide){const dx=ax>W/2?150:-150;path+=` C ${ax+dx} ${ay}, ${bx+dx} ${by}, ${bx} ${by}`;}
    else{const my=(ay+by)/2;path+=` C ${ax} ${my}, ${bx} ${my}, ${bx} ${by}`;}}
  let g=`<rect width="${W}" height="${H}" fill="#8fd3f7"/><rect width="${W}" height="${H}" fill="url(#islWv)"/>
  <rect x="14" y="20" width="${W-28}" height="${H-34}" rx="${wide?120:90}" fill="#f6e3b3"/><rect x="28" y="34" width="${W-56}" height="${H-62}" rx="${wide?110:80}" fill="#8fd47a"/>
  <path d="${path}" fill="none" stroke="#e9cf8f" stroke-width="30" stroke-linecap="round"/><path d="${path}" fill="none" stroke="#f8e7b8" stroke-width="22" stroke-linecap="round"/>
  <path d="${path}" fill="none" stroke="#e9cf8f" stroke-width="3" stroke-dasharray="2 16" stroke-linecap="round"/>
  <g transform="translate(${wide?36:58} ${wide?P[0][1]-40:36})">${ISLI.boat}</g>`;
  L.forEach((n,i)=>{const [x,y]=P[i],done=islDone(n)&&n.t!=='l',lock=i>cur&&n.t!=='l',isCur=i===cur,r=n.t==='r'?30:38;
    const st=n.t==='s'?s.st[n.i]:n.t==='r'?s.rv[n.r]:0,ch=n.t==='s'&&ISL[n.i].ch;
    g+=`<g class="isl-n${lock?' lock':''}${isCur?' cur':''}" data-i="${i}" transform="translate(${x} ${y})" ${lock?'opacity=".55"':''}>
    ${isCur?'<circle class="isl-pulse" r="48" fill="none" stroke="#ffc02e" stroke-width="5"/>':''}
    <circle r="${r+4}" fill="rgba(0,0,0,.18)" cy="5"/><circle r="${r+4}" fill="${n.t==='r'?'#ffe7c2':n.t==='l'?'#dff3ff':isCur?'#fff8d8':lock?'#eef1f6':'#fff'}" stroke="${n.t==='r'?'#c4421a':n.t==='l'?'#4a7fb5':isCur?'#ffb400':lock?'#aab3c4':ch?'#e5383b':'#3fb24f'}" stroke-width="4"/>
    <g transform="scale(${n.t==='r'?.85:1})" ${lock?'style="filter:grayscale(1)"':''}>${ISLI[islIcon(n)]}</g>
    ${lock&&n.t==='s'?`<g transform="translate(${r-4} ${-r+6})"><circle r="11" fill="#56607C"/><rect x="-5" y="-2" width="10" height="8" rx="1.5" fill="#fff"/><path d="M-3-2v-3a3 3 0 0 1 6 0v3" stroke="#fff" stroke-width="2" fill="none"/></g>`:''}
    ${st?`<g transform="translate(0 ${r+14})">${[-14,0,14].map((dx,k)=>islStarSvg(dx,0,k<st)).join('')}</g>`:''}
    <g transform="translate(0 ${r+(st?44:28)})" text-anchor="middle"><text class="isl-en" y="0">${esc(islEn(n))}</text><text class="isl-zh" y="18">${esc(islName(n))}</text></g></g>`;
    const c=n.t==='r'?islChestOf(n.r):-1;
    if(c>=0){const cx=wide?x:(x<200?x+120:x-120),cy=wide?y+105:y,got=s.ch[c],ok=islDone(n);
      g+=`<g class="isl-c${ok?' ready':' lock'}${got?' got':''}" data-c="${c}" data-r="${n.r}" transform="translate(${cx} ${cy})"><circle r="30" fill="rgba(255,255,255,.6)"/><g transform="scale(.9)">${ISLI.chest}</g>
      <text class="isl-zh" text-anchor="middle" y="46">${got?(got.b==='gold'?'金徽章':'银徽章'):'挑战宝箱'}</text></g>`;}});
  const kp=P[Math.min(cur,P.length-1)],from=walk&&ISLWALK!=null&&P[ISLWALK]?P[ISLWALK]:kp;
  g+=`<g class="isl-kid" style="transform:translate(${from[0]-60}px,${from[1]+6}px)">${ISLKID}</g>`;
  $('islMap').innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;max-width:${W}px;margin:0 auto"><defs><pattern id="islWv" width="60" height="26" patternUnits="userSpaceOnUse"><path d="M4 14q8-6 16 0t16 0" stroke="#bfe4fb" stroke-width="2.5" fill="none" stroke-linecap="round"/></pattern></defs>${g}</svg>`;
  if(walk&&from!==kp){const k=$('islMap').querySelector('.isl-kid');k.classList.add('going');requestAnimationFrame(()=>requestAnimationFrame(()=>{k.style.transform=`translate(${kp[0]-60}px,${kp[1]+6}px)`;}));setTimeout(()=>k.classList.remove('going'),1300);}
  ISLWALK=null;
  if(innerWidth<900){const c=$('islMap').querySelector('.isl-n.cur');if(c&&cur>1)setTimeout(()=>c.scrollIntoView({block:'center',behavior:walk?'smooth':'auto'}),walk?300:0);}
  /* side card: the next stop */
  const n=L[cur],tot=Object.values(s.st).reduce((a,b)=>a+b,0)+Object.values(s.rv).reduce((a,b)=>a+b,0);
  $('islTot').textContent=tot;
  if(n){const q=n.t==='s'?ISL[n.i].qs[0]:null;
    $('islNext').innerHTML=`<div class="isl-lab">下一站</div><div class="isl-now"><svg viewBox="-35 -35 70 70" width="64" height="64">${ISLI[islIcon(n)]}</svg><div><b>${esc(islEn(n))}</b><span>${esc(islName(n))}${n.t==='s'?' · '+esc(ISL[n.i].topic):''}</span></div></div>
    ${q&&q.kw?`<p class="isl-ex">${islMark(q.q.split('. ').slice(0,2).join('. ')+'.',q.kw)}</p>`:''}<button class="isl-go" id="islGo">出发 Go!</button>`;}
  else $('islNext').innerHTML='<div class="isl-lab">全部走完了！</div><p>每一站都可以再玩，把奖杯升级成金的。</p>';
}
function islMark(t,kw){let h=esc(t);[...kw].sort((a,b)=>b.length-a.length).forEach(k=>{const e=esc(k).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');h=h.replace(new RegExp('('+e+')(?![^<]*>)','i'),'<u class="kw">$1</u>');});return h;}

/* ---------- playing a stop ---------- */
let IP=null;
function islShuf(a){return QB.shuf(a.slice());}
function islSteps(si,qi,kind){const q=ISL[si].qs[qi],p3=ISL[si].seg==='P3';let st;
  if(kind==='r'||kind==='d')st=['ask','fig','ans'];
  else if(ISL[si].ch)st=['ans'];
  else if(p3)st=qi<2?['ask','plan','fig','ans']:qi===4?['ans','ask']:['ask','fig','ans'];
  else st=['ask','fig','ans'];
  if(q.build&&kind==='s'&&!st.includes('plan'))st.splice(st.indexOf('ask')+1||0,0,'plan');
  /* a drawn picture: after picking the kind of picture he puts the numbers and the ? on it */
  if(q.dg&&st.includes('fig'))st.splice(st.indexOf('fig')+1,0,'mk');
  return st;}
function islStart(node){const s=islSt(),L=islRoad(),n=typeof node==='number'?L[node]:node;let list=[],kind;
  if(n.t==='s'){kind='s';list=ISL[n.i].qs.map((q,qi)=>({si:n.i,qi}));}
  else if(n.t==='r'){kind='r';list=islMix(n.from,6);}
  else if(n.t==='d'&&n.miss){kind='d';list=islSt().miss.slice(0,6).map(k=>({si:+k.split(':')[0],qi:+k.split(':')[1]})).filter(x=>ISL[x.si]&&ISL[x.si].qs[x.qi]);}
  else if(n.t==='d'){kind='d';list=islMix(n.from,5);}
  else return;
  if(!list.length)return;IP={n,kind,list,i:0,ok:0,combo:0,first:true,again:n.t==='s'&&!!s.st[n.i]};show('vIslQ');islQ();}
/* mixed review: problems he got wrong first, then the rest, from the given stations */
function islMix(from,k){const s=islSt(),all=[];from.forEach(si=>ISL[si].qs.forEach((q,qi)=>all.push({si,qi})));
  const miss=islShuf(all.filter(x=>s.miss.includes(x.si+':'+x.qi))),rest=islShuf(all.filter(x=>!s.miss.includes(x.si+':'+x.qi)));
  return miss.concat(rest).slice(0,k);}
function islQ(){const it=IP.list[IP.i],q=ISL[it.si].qs[it.qi];
  IP.q=q;IP.steps=islSteps(it.si,it.qi,IP.kind);IP.sx=0;IP.first=true;IP.pa=!!q.pa;IP.kwFound=new Set();IP.keep={};
  $('islQTitle').innerHTML=`${esc(IP.kind==='s'?ISL[it.si].en:IP.kind==='r'?'Campfire':'Island review')}<small>${esc(IP.kind==='s'?ISL[it.si].name+' · '+ISL[it.si].topic:IP.kind==='r'?'营火复习 · 前面几站混在一起':'小岛复习')}</small>`;
  $('islQCount').textContent=(IP.i+1)+' / '+IP.list.length;
  $('islQProb').innerHTML=islProb(q,false);
  $('islDone').hidden=true;islStep();}
function islProb(q,mark){return(q.ft==='branch'&&IP&&!ISL[IP.list[IP.i].si].ch?'<span class="isl-chtag">⭐ 挑战题 · 五年级常用的方法</span><br>':'')+islProb0(q,mark);}
function islProb0(q,mark){let t=q.q;if(q.pa&&!/\(a\)/.test(t)){const k=t.lastIndexOf('. ');t=k>0?t.slice(0,k+1)+' (a) '+q.pa.q+' (b) '+t.slice(k+2):t;}
  let h=mark?islMark(t,q.kw):esc(t);
  /* the question sentence gets a blue box in step ① */
  return h;}
function islStepBar(){const eff=IP.steps.map(x=>x==='mk'?'fig':x),cur=eff[IP.sx];
  $('islSteps').innerHTML=STEPS.map(([k,ic,zh,en],i)=>{const on=eff.includes(k),idx=eff.lastIndexOf(k),done=on&&idx<IP.sx,now=k===cur;
    return`<div class="isl-sp${done?' ok':''}${now?' on':''}${on?'':' off'}"><span class="ic">${ic}</span><b>${zh}</b><i>${i+1} ${en}</i></div>`;}).join('');}
function islStep(){const q=IP.q,k=IP.steps[IP.sx];islStepBar();const box=$('islStep');IP.tries=0;
  $('islQProb').innerHTML=islProb(q,k==='plan'||k==='fig'||k==='ans'&&IP.steps.includes('plan'));
  if(k==='ask'){const after=IP.steps.indexOf('ask')>IP.steps.indexOf('ans');
    islBox(after?'你刚才求的是什么？':'这题要你求什么？',after?'答对了！回头想一想：题目问的是什么？':'先别算，找到问句（最后一句）。',islShuf(q.ask),q.ask[0]);}
  else if(k==='plan'){if(q.build)islBuild();else{const pre=IP.kind==='s'&&IP.list[IP.i].qi===0;
    $('islQProb').innerHTML=islProb(q,true);
    islBox('哪一句是这题的意思？',(pre?'关键词已经帮你划好了。':'看划线的词。')+' 把文字变成数学。',islShuf(q.plan),q.plan[0]);}}
  else if(k==='fig'){const others=islShuf(['pw','cmp','unit','sd','ba','move','flow','pie','branch','line','table','same'].filter(x=>x!==q.ft)).slice(0,3);
    const L=islShuf([q.ft,...others]);
    box.innerHTML=`<div class="isl-qq">这题该画哪种图？<small>选一种图。</small></div><div class="isl-figs">${L.map(f=>`<button class="isl-fig" data-f="${f}"><svg viewBox="0 0 60 46">${FIGSVG[f]||''}</svg><b>${FIGS[f][0]}</b><i>${FIGS[f][1]}</i></button>`).join('')}</div><div class="isl-tip" id="islTip" hidden></div>`;}
  else if(k==='mk')islMk();
  else if(k==='ans'){if(IP.pa){islBox('(a) '+q.pa.q,'先做 (a)。',islShuf(q.pa.opts),q.pa.ans,'pa');}else islBox((q.pa?'(b) ':'')+'答案是多少？','⚡ 闪电算！',islShuf(q.opts),q.ans,'ans');}}
/* what he worked out in the earlier steps stays on the screen while he calculates (the plan he chose or built, the picture with his numbers) */
function islKeep(){const K=IP&&IP.keep;if(!K||(!K.plan&&!K.fig))return'';
  return`<div class="isl-keep"><div class="isl-lab">刚才做的 · 照着算</div>${K.fig?`<div class="isl-dg">${K.fig}</div>`:''}${K.plan?`<p class="isl-kp">${esc(K.plan)}</p>`:''}</div>`;}
function islBox(title,sub,opts,good,tag){$('islStep').innerHTML=`<div class="isl-qq">${esc(title)}<small>${esc(sub)}</small></div>${tag==='ans'||tag==='pa'?islKeep():''}<div class="isl-opts">${opts.map(o=>`<button class="isl-o" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div><div class="isl-tip" id="islTip" hidden></div>`;IP.good=good;IP.tag=tag||'';}
function islBuild(){const q=IP.q,[seq,extra]=q.build;IP.bq=seq;IP.bat=[];
  const pieces=islShuf(seq.map((t,i)=>({t,i})).concat(extra.map(t=>({t,i:-1}))));
  $('islQProb').innerHTML=islProb(q,true);
  $('islStep').innerHTML=`<div class="isl-qq">🧩 拼出提炼<small>按顺序点小块，拼成这题的意思。有 2 块用不上。</small></div><div class="isl-built" id="islBuilt"></div><div class="isl-pieces">${pieces.map((p,j)=>`<button class="isl-pc" data-j="${j}" data-t="${esc(p.t)}">${esc(p.t)}</button>`).join('')}</div><div class="isl-tip" id="islTip" hidden></div>`;}
/* step ③ part 2: put the numbers and the ? on the drawn picture, one at a time */
function islMk(){const d=IP.q.dg;IP.mk=d.mk.map(x=>x.slice());IP.mkI=0;IP.mkPl=[];IP.mkTries=0;IP.dec=dgDecoys(d,dgLay(d));$('islQProb').innerHTML=islProb(IP.q,true);islMkDraw();}
function islMkDraw(bad,tip,good){const d=IP.q.dg,done=IP.mkI>=IP.mk.length,cur=IP.mk[IP.mkI];
  const spots=done?[]:IP.mk.slice(IP.mkI).map(x=>x[0]).concat(IP.dec);
  const fig={...d,mk:[]};
  const head=done?'<div class="isl-qq">✓ 图标好了！<small>在纸上也这样画。</small></div>'
    :cur[1]==='?'?'<div class="isl-qq">问号 <span class="isl-chip q">?</span> 放在哪里？<small>题目问的是图上哪一段？点那个虚线框。</small></div>'
    :`<div class="isl-qq">把 <span class="isl-chip">${esc(cur[1])}</span> 放到图上<small>它是图上哪一段？点那个虚线框。</small></div>`;
  $('islStep').innerHTML=head+`<div class="isl-dg">${dgSvg(fig,IP.mkPl,spots,bad)}</div><div class="isl-chips2">${IP.mk.map((x,i)=>`<span class="${i<IP.mkI?'done':i===IP.mkI?'now':''}">${esc(x[1])}</span>`).join('')}</div><div class="isl-tip${good?' good':''}" id="islTip"${tip?'':' hidden'}>${tip?esc(tip):''}</div>`;}
function islMkTap(id){const d=IP.q.dg,L=dgLay(d),cur=IP.mk[IP.mkI],s=L.spot(id);if(!s||!cur)return;
  const j=IP.mk.findIndex((m,i)=>i>=IP.mkI&&m[1]===cur[1]&&L.spot(m[0]).key===s.key);
  const put=(auto)=>{IP.mkPl.push(IP.mk[IP.mkI]);IP.mkI++;IP.mkTries=0;
    if(IP.mkI>=IP.mk.length){IP.keep.fig=dgSvg({...IP.q.dg,mk:[]},IP.mkPl,[],null);beep(true);islMkDraw(null,auto?'看一看：'+auto+' 图标好了。':'✓ 全放对了！'+(IP.q.fig?' '+IP.q.fig.split('：')[0]:''),!auto);
      setTimeout(()=>{if(!IP||IP.steps[IP.sx]!=='mk')return;IP.sx++;IP.sx<IP.steps.length?islStep():islNextQ();},IP.kind==='s'?1600:1100);}
    else islMkDraw(null,auto||null,!auto);};
  if(j>=0){if(j!==IP.mkI){const t=IP.mk[j];IP.mk[j]=IP.mk[IP.mkI];IP.mk[IP.mkI]=t;}islSk('mk',IP.mkTries===0);if(!IP.mkTries)beep(true);put(null);return;}
  beep(false);IP.mkTries++;
  if(IP.mkTries>=2){islSk('mk',false);put(`「${cur[1]}」应该放在这里。`);return;}
  islMkDraw(id,cur[1]==='?'?'再读一读最后一句：问的是谁、问什么？':`再读一读题目：「${cur[1]}」是谁的？`);}
function islSk(k,ok){const s=islSt();const a=s.sk[k]||[0,0];a[0]++;if(ok)a[1]++;s.sk[k]=a;}
function islRight(btn){beep(true);if(btn){btn.classList.add('good','pop');islSpark(btn);}
  const k=IP.steps[IP.sx];
  if(k==='ans'&&IP.tag==='pa'){IP.pa=false;setTimeout(islStep,650);return;}
  if(k==='ans'){if(IP.first){const sv=islSt(),key=IP.list[IP.i].si+':'+IP.list[IP.i].qi;if(IP.kind!=='s'||IP.again)sv.miss=sv.miss.filter(x=>x!==key);IP.ok++;IP.combo++;islFly();if(IP.combo%3===0)islToast('Combo ×'+IP.combo+'!');}else IP.combo=0;
    const tip=$('islTip');tip.hidden=false;tip.className='isl-tip good';tip.innerHTML='✓ 答：'+esc(IP.q.say);islFlash();}
  setTimeout(()=>{IP.sx++;if(IP.sx<IP.steps.length)islStep();else islNextQ();},k==='ans'?1500:650);}
function islWrong(btn,why){beep(false);IP.tries++;const k=IP.steps[IP.sx];if(k==='ans'&&IP.tag!=='pa'){IP.first=false;const s=islSt(),key=IP.list[IP.i].si+':'+IP.list[IP.i].qi;if(!s.miss.includes(key))s.miss.push(key);}
  if(btn){btn.classList.add('bad','shake');btn.disabled=true;setTimeout(()=>btn.classList.remove('shake'),400);}
  const tip=$('islTip');if(tip){tip.hidden=false;tip.className='isl-tip';tip.textContent=why||'再看一遍题目。';}}
function islHint(){const q=IP.q,k=IP.steps[IP.sx];
  if(k==='ask')return'看最后一句问句，它问的是谁、问什么？';
  if(k==='plan')return'看划线的关键词，它们告诉你要加、减、乘还是除。';
  if(k==='fig')return'提示：'+q.fig.split('：')[0]+'。';
  if(k==='mk')return'再读一读题目。';
  return'提示：'+q.plan[0];}
function islNextQ(){{const dk=dkey(new Date());S.days[dk]=(S.days[dk]||0)+1;}IP.i++;if(IP.i<IP.list.length)islQ();else islFinish();}
function islFinish(){const s=islSt(),n=IP.n,tot=IP.list.length,ok=IP.ok,stars=ok===tot?3:ok/tot>=.75?2:1;let first=false;
  if(n.t==='s'){first=!s.st[n.i];s.st[n.i]=Math.max(s.st[n.i]||0,stars);}
  else if(n.t==='r'){first=!s.rv[n.r];s.rv[n.r]=Math.max(s.rv[n.r]||0,stars);}
  /* problems done right in a later round leave the wrong list */
  S.stars=(S.stars||0)+stars;const t=tkDay();t[n.t==='d'?'isr':'isl']=1;
  const L=islRoad();ISLWALK=first?L.findIndex(x=>x.t===n.t&&(x.t==='s'?x.i===n.i:x.r===n.r)):null;save();
  const tro=stars===3?['gold','金奖杯']:stars===2?['silver','银奖杯']:['bronze','铜奖杯'];
  $('islDone').hidden=false;
  $('islDone').innerHTML=`<div class="isl-win"><div class="isl-rays"></div><div class="isl-stars">${[0,1,2].map(k=>`<svg viewBox="-14 -14 28 28" class="${k<stars?'on':''}" style="animation-delay:${.2+k*.25}s"><path d="M0-12l3.5 7.2 8 1.1-5.8 5.6 1.4 7.9L0 6 -7.1 9.8l1.4-7.9-5.8-5.6 8-1.1z"/></svg>`).join('')}</div>
    <svg class="isl-trophy t-${tro[0]}" viewBox="-80 -90 160 190">${islTrophy()}</svg>
    <div class="isl-card"><h2>${ok===tot?'Perfect! 全对！':ok/tot>=.75?'Great! 很棒！':'Good try! 再接再厉！'}</h2><p>${esc(n.t==='s'?ISL[n.i].name+' · '+ISL[n.i].en:n.t==='r'?'营火复习':'小岛复习')}　一次做对 ${ok} / ${tot} 题</p>
    <div class="isl-chips"><span>+${stars} ★</span><span>🏆 ${tro[1]}</span></div>
    <button class="isl-go" id="islNextStop">${n.t==='d'?'回首页':'回地图，去下一站 →'}</button><button class="isl-back2" id="islAgain">再玩一次，升级奖杯</button></div></div>`;
  if(ok>=tot*.75)confetti();}
function islTrophy(){return`<ellipse cx="0" cy="92" rx="70" ry="10" fill="rgba(0,0,0,.12)"/><rect x="-44" y="62" width="88" height="26" rx="6" fill="#7a4f1c"/><rect x="-30" y="66" width="60" height="16" rx="3" class="tr-m"/>
<path d="M-12 30h24l6 32h-36z" class="tr-d"/><path d="M-56-60c-14 0-20 18-10 34 8 12 22 18 34 20M56-60c14 0 20 18 10 34-8 12-22 18-34 20" fill="none" class="tr-h" stroke-width="10" stroke-linecap="round"/>
<path d="M-50-74h100v18c0 50-28 80-50 80s-50-30-50-80z" class="tr-m tr-o" stroke-width="5" stroke-linejoin="round"/><path d="M-34-60v14c0 26 10 44 22 54" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/><path d="M0-48l7 14 15 2-11 11 3 15-14-7-14 7 3-15-11-11 15-2z" fill="#fff" opacity=".9"/>`;}
function islSpark(el){const r=el.getBoundingClientRect();for(let k=0;k<6;k++){const d=document.createElement('i');d.className='isl-spk';d.textContent='✦';d.style.left=(r.left+r.width*Math.random())+'px';d.style.top=(r.top+r.height*Math.random())+'px';d.style.setProperty('--dx',(Math.random()*60-30)+'px');d.style.setProperty('--dy',(-Math.random()*50-10)+'px');document.body.appendChild(d);setTimeout(()=>d.remove(),700);}}
function islFly(){const a=$('islQCount').getBoundingClientRect(),d=document.createElement('i');d.className='isl-fly';d.textContent='★';d.style.left=(innerWidth/2)+'px';d.style.top=(innerHeight*.6)+'px';d.style.setProperty('--tx',(a.left-innerWidth/2)+'px');d.style.setProperty('--ty',(a.top-innerHeight*.6)+'px');document.body.appendChild(d);setTimeout(()=>d.remove(),900);}
function islFlash(){const f=$('islFlash');f.classList.remove('go');void f.offsetWidth;f.classList.add('go');}
function islToast(t){const d=document.createElement('div');d.className='isl-toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1400);}

/* ---------- treasure chest: 3 thinking puzzles ---------- */
let ICP=null;
function islChest(c){const s=islSt();ICP={c,list:islShuf(ICH).slice(0,3),i:0,ok:0,first:true};show('vIslQ');islChestQ();}
function islChestQ(){const q=ICP.list[ICP.i];ICP.first=true;IP=null;
  $('islQTitle').innerHTML='Treasure chest<small>挑战宝箱 · 3 道思维题，全对得金徽章</small>';$('islQCount').textContent=(ICP.i+1)+' / 3';
  $('islSteps').innerHTML='';$('islQProb').innerHTML=esc(q.q);$('islDone').hidden=true;
  $('islStep').innerHTML=`<div class="isl-qq">答案是多少？<small>想一想，可以点提示。</small></div><div class="isl-opts">${islShuf(q.opts).map(o=>`<button class="isl-o" data-cv="${esc(o)}">${esc(o)}</button>`).join('')}</div><button class="isl-hint" id="islCHint">💡 提示</button><div class="isl-tip" id="islTip" hidden></div>`;}
function islChestEnd(){const s=islSt(),b=ICP.ok===3?'gold':'silver',old=s.ch[ICP.c];if(!old||old.b!=='gold')s.ch[ICP.c]={b,d:dkey(new Date())};save();
  $('islDone').hidden=false;$('islDone').innerHTML=`<div class="isl-win"><div class="isl-rays"></div><svg class="isl-trophy t-${b==='gold'?'gold':'silver'}" viewBox="-80 -90 160 190">${islTrophy()}</svg>
  <div class="isl-card"><h2>${b==='gold'?'金徽章！':'银徽章'}</h2><p>做对 ${ICP.ok} / 3 题。${b==='gold'?'':'再开一次宝箱，全对就升级成金的。'}</p><button class="isl-go" id="islNextStop">回地图 →</button></div></div>`;
  if(b==='gold')confetti();ICP=null;}

/* ---------- events ---------- */
$('islBack').addEventListener('click',home);
$('islQBack').addEventListener('click',()=>{IP=null;ICP=null;islOpen();});
$('islSide').addEventListener('click',e=>{if(e.target.closest('#islGo'))islStart(islCur());if(e.target.closest('#islBar'))barStart();});
$('islMap').addEventListener('click',e=>{const n=e.target.closest('.isl-n'),c=e.target.closest('.isl-c');
  if(c){if(c.classList.contains('lock')){c.classList.remove('shake');void c.getBBox();c.classList.add('shake');return;}islChest(+c.dataset.c);return;}
  if(!n)return;const i=+n.dataset.i,L=islRoad();if(L[i].t==='l')return;if(n.classList.contains('lock')){n.classList.remove('shake');void n.getBBox();n.classList.add('shake');return;}islStart(i);});
$('vIslQ').addEventListener('click',e=>{
  if(e.target.closest('#islNextStop')){if(IP&&IP.n.t==='d'){home();return;}islOpen(true);return;}
  if(e.target.closest('#islAgain')){islStart(IP.n);return;}
  if(ICP){const b=e.target.closest('[data-cv]'),h=e.target.closest('#islCHint'),q=ICP.list[ICP.i];
    if(h){const t=$('islTip');t.hidden=false;t.className='isl-tip';t.textContent='提示：'+q.fig;return;}
    if(!b||b.disabled)return;
    if(b.dataset.cv===q.ans){beep(true);b.classList.add('good','pop');islSpark(b);if(ICP.first)ICP.ok++;setTimeout(()=>{ICP.i++;if(ICP.i<3)islChestQ();else islChestEnd();},800);}
    else{beep(false);ICP.first=false;b.classList.add('bad','shake');b.disabled=true;const t=$('islTip');t.hidden=false;t.className='isl-tip';t.textContent='提示：'+q.fig;}
    return;}
  if(!IP)return;const k=IP.steps[IP.sx];
  const o=e.target.closest('.isl-o');
  if(o&&!o.disabled){const ok=o.dataset.v===IP.good;islSk(k==='ans'&&IP.tag==='pa'?'pa':k,ok&&IP.tries===0);if(ok&&k==='plan')IP.keep.plan=IP.good;if(ok)islRight(o);else islWrong(o,islHint());return;}
  const f=e.target.closest('.isl-fig');
  if(f&&!f.disabled){const ok=f.dataset.f===IP.q.ft;islSk('fig',ok&&IP.tries===0);if(ok){const t=$('islTip');t.hidden=false;t.className='isl-tip good';t.textContent=IP.q.dg?'✓ 对！图已经画好了，下面把数字放上去。':'✓ 怎么画：'+IP.q.fig;f.classList.add('good','pop');islSpark(f);beep(true);setTimeout(()=>{IP.sx++;IP.sx<IP.steps.length?islStep():islNextQ();},IP.q.dg?900:IP.kind==='s'?2200:1200);}else islWrong(f,'不是这种图。'+islHint());return;}
  const sp=e.target.closest('.dg-sp');if(sp&&k==='mk'){islMkTap(sp.dataset.s);return;}
  const pc=e.target.closest('.isl-pc');
  if(pc&&!pc.disabled){const want=IP.bq[IP.bat.length];
    if(pc.dataset.t===want){IP.bat.push(want);pc.disabled=true;pc.classList.add('used');$('islBuilt').innerHTML=IP.bat.map(t=>`<span>${esc(t)}</span>`).join(' ');
      if(IP.bat.length===IP.bq.length){IP.keep.plan=IP.bq.join(' ');islSk('plan',IP.tries===0);islRight(null);const t=$('islTip');t.hidden=false;t.className='isl-tip good';t.textContent='✓ 拼好了！';}}
    else islWrong(pc,'这一块还不是下一块。下一块应该是：'+(IP.tries>=2?want:'想一想先写谁'));return;}
});

/* ---------- home tile, tasks, my progress ---------- */
HOOK.tile.isl=()=>islOpen();
HOOK.home.push(()=>{const el=$('islNote');if(!el)return;const L=islRoad(),c=islCur();el.textContent=c<L.length?'下一站：'+islName(L[c]):'全部走完了！';});
HOOK.noWordTasks=true;
HOOK.tasks.push(t=>{const L=islRoad(),c=islCur();if(c>=L.length&&!t.isl)return null;const n=L[Math.min(c,L.length-1)];
  return{k:'isl',name:'小岛下一站 · '+islName(n)+(n.t==='s'?'（'+ISL[n.i].qs.length+' 题）':''),done:!!t.isl};});
HOOK.task.isl=()=>{const c=islCur(),L=islRoad();if(c<L.length)islStart(c);else islOpen();};
/* fallback task: a short mixed review of the stations he has done */
HOOK.fill.push(t=>{const s=islSt(),done=ISL.map((x,i)=>i).filter(i=>s.st[i]&&!ISL[i].ch);if(!done.length&&!t.isr)return null;return{k:'isr',name:'小岛复习 · Island review（5 题）',done:!!t.isr};});
HOOK.task.isr=()=>{const s=islSt(),done=ISL.map((x,i)=>i).filter(i=>s.st[i]&&!ISL[i].ch);islStart({t:'d',from:done.length?done:[0]});};
/* no calculation questions in mixed rounds any more */
if(QB.pickCat){const f=QB.pickCat;QB.pickCat=()=>{let k,n=0;do{k=f();}while(k==='calc'&&++n<50);return k==='calc'?'wp':k;};}
HOOK.meExtra.push(()=>{const s=islSt();let el=$('islShelf');if(!el){el=document.createElement('div');el.id='islShelf';el.className='stcard';$('meWords').after(el);}
  const cls=v=>v===3?'gold':v===2?'silver':'bronze';
  const cups=ISL.map((x,i)=>s.st[i]?`<span class="isl-cup t-${cls(s.st[i])}" title="${esc(x.name)}"><svg viewBox="-80 -90 160 190">${islTrophy()}</svg><i>${esc(x.name)}</i></span>`:'').join('');
  const badges=Object.keys(s.ch).map(c=>`<span class="isl-cup t-${s.ch[c].b}"><svg viewBox="-35 -35 70 70">${ISLI.chest}</svg><i>宝箱 ${+c+1}</i></span>`).join('');
  el.innerHTML=`<h3>奖杯柜 · Trophies</h3>${cups||badges?`<div class="isl-shelf">${cups}${badges}</div>`:'<p class="muted">在数学小岛上通关，奖杯会摆在这里。</p>'}`;});
/* the picture on the home tile: a bit of the island with the next stop */
HOOK.home.push(()=>{const a=$('islArt');if(!a)return;const L=islRoad(),c=Math.min(islCur(),L.length-1),prev=L[Math.max(0,c-1)],n=L[c],nx=L[Math.min(L.length-1,c+1)];
  const ic=x=>ISLI[islIcon(x)];
  a.innerHTML=`<svg viewBox="0 0 300 120" preserveAspectRatio="xMaxYMid slice" width="100%" height="100%"><g transform="${innerWidth<700?'translate(150 40) scale(.55)':'translate(60 0) scale(.85)'}"><ellipse cx="190" cy="78" rx="150" ry="62" fill="#f6e3b3"/><ellipse cx="190" cy="74" rx="134" ry="52" fill="#8fd47a"/>
  <path d="M70 70 C110 40 150 100 190 64 S 260 40 290 70" stroke="#f8e7b8" stroke-width="12" fill="none" stroke-linecap="round"/>
  ${c>0?`<g transform="translate(108 56) scale(.62)"><circle r="40" fill="#fff" stroke="#3fb24f" stroke-width="5"/>${ic(prev)}</g>`:''}<g transform="translate(190 64) scale(.62)"><circle r="40" fill="#fff8d8" stroke="#ffb400" stroke-width="5"/>${ic(n)}</g><g transform="translate(262 50) scale(.55)" opacity=".7"><circle r="40" fill="#eef1f6" stroke="#aab3c4" stroke-width="5"/>${ic(nx)}</g><g transform="translate(40 92) scale(.7)">${ISLI.boat}</g></g></svg>`;});
window.__isl={IP:()=>IP,ICP:()=>ICP,road:islRoad,cur:islCur,startRound,S:()=>S};   /* for the tests */
/* 错题重练 also takes the island problems he got wrong */
{const f=HOOK.tile.redo;HOOK.tile.redo=()=>{if(S.misses.length)return f();if(islSt().miss.length)islStart({t:'d',miss:true});};}
HOOK.home.push(()=>{const m=islSt().miss.length,n=S.misses.length+m;const el=$('redoNote');if(el)el.textContent=n?n+' 题':'';const t=$('tRedo');if(t)t.classList.toggle('empty',!n);});
