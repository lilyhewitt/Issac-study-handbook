/* ---------- 写作工坊 · 基本功 Writing basics: rounds of 8, made fresh each time.
   Kinds: tense (past tense of the story verb), who (keep one person), brk (split a comma chain into sentences),
   feel (a feeling word / speech marks), word (what a composition phrase means).
   The sentences and names are NOT the ones in the paper packs (sets 1–18), so he can't learn the stories by heart.
   A round leans towards the kinds he gets wrong: his drill misses plus his mistakes in the picture sets (S.ww.err).
   Saved in S.ww.dr = {kind:[right,wrong]}; a round adds +1 ★ and one log line. ---------- */
const WDK={tense:'时态',who:'人称',brk:'断句',feel:'感觉和对话',word:'词组意思'};
const WDB=['Ali','Ben','Ravi','Jun Jie','Marcus','Hafiz','Ethan','Leo'],WDG=['Mei Ling','Aisha','Chloe','Nurul','Emma','Siti','Grace','Rachel'];
const WDT=['Yesterday,','Last Sunday,','One morning,','After school,','Last week,','That evening,','Suddenly,'];
// [base, past, rest]
const WDV=[['go','went','to the playground'],['see','saw','a big dog near the gate'],['run','ran','to the bus stop'],['fall','fell','down the stairs'],['find','found','a wallet on the floor'],
 ['take','took','the lift to the tenth floor'],['buy','bought','a storybook'],['eat','ate','noodles at the hawker centre'],['drink','drank','a cup of Milo'],['break','broke','the vase'],
 ['cry','cried','loudly'],['shout','shouted','for help'],['drop','dropped','the plate'],['catch','caught','the ball'],['throw','threw','the ball too hard'],['hide','hid','behind the door'],
 ['feel','felt','very nervous'],['hear','heard','a loud noise'],['leave','left','the classroom'],['lose','lost','the key'],['carry','carried','a heavy box'],['try','tried','to open the door'],
 ['stop','stopped','at the traffic light'],['slip','slipped','on the wet floor'],['rush','rushed','to the clinic'],['hurry','hurried','home'],['wake','woke','up late'],['bring','brought','an umbrella'],
 ['think','thought','of a good idea'],['say','said','sorry'],['tell','told','the teacher'],['sit','sat','on the bench'],['stand','stood','at the door'],['win','won','the race'],['spill','spilled','the water'],
 ['swim','swam','across the pool'],['write','wrote','a card'],['sing','sang','a song'],['hold','held','the rope tightly'],['knock','knocked','on the door'],['climb','climbed','the tree'],['cut','cut','the cake']];
const WDIRR=new Set(['went','saw','ran','fell','found','took','bought','ate','drank','broke','caught','threw','hid','felt','heard','left','lost','woke','brought','thought','said','told','sat','stood','won','swam','wrote','sang','held','cut']);
const WDBRK=[['woke up late','{h} rushed to the bus stop','the bus had already left'],['dropped {his} ice cream','{h} began to cry','{his} father bought {him} another one'],
 ['saw a kitten in the drain','{h} called {his} mother','they saved the kitten together'],['kicked the ball too hard','it flew over the fence','a neighbour threw it back'],
 ['forgot {his} lunch box','{h} felt hungry at recess','{his} friend shared some bread'],['heard a loud crash','{h} ran to the kitchen','a plate lay broken on the floor'],
 ['climbed onto a chair','{h} reached for the cookie jar','the chair wobbled'],['found a wallet on the floor','{h} looked inside','{h} handed it to the teacher'],
 ['was playing in the rain','{h} slipped on the wet floor','{his} knee started to bleed'],['carried a heavy box','{h} could not see the steps','{h} tripped and fell'],
 ['finished {his} homework','{h} went downstairs','{his} friends were playing football'],['waited at the traffic light','the light turned green','{h} crossed the road carefully'],
 ['opened the door','a big dog ran out','{h} screamed loudly'],['lost {his} way in the mall','{h} felt frightened','a guard helped {him} find {his} mother']];
const wdS=v=>/(s|sh|ch|x|o)$/.test(v)?v+'es':/[^aeiou]y$/.test(v)?v.slice(0,-1)+'ies':v+'s';
const wdPick=a=>a[Math.floor(Math.random()*a.length)];
const wdCap=s=>s.charAt(0).toUpperCase()+s.slice(1),wdLc=s=>s.charAt(0).toLowerCase()+s.slice(1);
function wdPerson(){const g=Math.random()<.5;return{n:wdPick(g?WDG:WDB),he:g?'She':'He',his:g?'her':'his',other:g?'He':'She'};}
// each maker returns {k, q (html), opts:[...], a (index of right one after shuffle is handled by caller via text), why}
const WDMAKE={
 tense(){const[v,p,r]=wdPick(WDV),P=wdPerson(),t=wdPick(WDT),opts=[p,wdS(v),'will '+v];
  if(Math.random()<.3){const pl=Math.random()<.5;return{k:'tense',q:`${t} ${pl?`${P.n} and ${wdPick(P.he==='She'?WDB:WDG)}`:P.n} ___ very tired.`,opts:pl?['were','are','was']:['was','is','were'],why:pl?'两个人 → were（过去）':'一个人 → was（过去）'};}
  return{k:'tense',q:`${t} ${P.n} ___ ${r}.`,opts,why:`故事发生在过去：${v} → <b>${p}</b>${WDIRR.has(p)?'（不规则，要背）':''}`};},
 who(){const P=wdPerson(),A=wdPick(WDB),B=wdPick(WDG),r=Math.random();
  if(r<.35)return{k:'who',q:`${P.n} dropped ${P.his} pencil. ___ picked it up quickly.`,opts:[P.he,P.other,'There'],why:`${P.n} 一直是 <b>${P.he.toLowerCase()}</b>。`};
  if(r<.55)return{k:'who',q:`${A} and ${B} played in the rain. ___ were drenched.`,opts:['They','There','We'],why:'写别人：两个人 → <b>They</b>（不是 There）。'};
  if(r<.7)return{k:'who',q:wdPick(['My cousin and I went to the zoo. ___ saw a tiger.','My brother and I went to the beach. ___ built a sandcastle.','My friends and I went to the library. ___ borrowed some books.','My sister and I went to the park. ___ flew a kite.','My classmates and I went on a trip. ___ took many photos.']),opts:['We','They','There'],why:'写自己：我和别人 → <b>We</b>。人称选好就不变。'};
  if(r<.85)return{k:'who',q:`I lost my ${wdPick(['water bottle','pencil case','key','cap'])}. ___ felt worried.`,opts:['I','He','Me'],why:'写自己就一直用 <b>I</b>（句子开头不用 me）。'};
  return{k:'who',q:`${P.n} fell and hurt ___ knee.`,opts:[P.his,P.he==='She'?'his':'her','their'],why:`${P.n} → <b>${P.his}</b> knee。`};},
 brk(){const P=wdPerson(),h=P.he,x=wdPick(WDBRK).map(t=>t.replace(/\{h\}/g,h.toLowerCase()).replace(/\{his\}/g,P.his).replace(/\{him\}/g,P.he==="She"?"her":"him"));
  const s1=`${P.n} ${x[0]}`;
  return{k:'brk',q:'哪一个分对了句子？',opts:[`${s1}. ${wdCap(x[1])}. ${wdCap(x[2])}.`,`${s1}, ${x[1]}, ${x[2]}.`,`${s1}. ${x[1]}. ${x[2]}.`],
   why:'一件事一句话：句号 <b>.</b> 结束，下一句开头<b>大写</b>。逗号不能把几件事连成一串。',long:1};},
 feel(){if(Math.random()<.6){const F=wdPick([['won the race','proud',['scared','bored']],['lost his new watch','upset',['proud','excited']],['saw a snake in the garden','frightened',['proud','bored']],
     ['broke the window','guilty',['excited','proud']],['got a present from Grandma','delighted',['angry','guilty']],['had to wait for an hour','bored',['proud','frightened']],
     ['was going to the zoo the next day','excited',['guilty','upset']],['fell in front of the whole class','embarrassed',['proud','delighted']],['was home alone during a storm','scared',['proud','delighted']],
     ['found the lost puppy','relieved',['guilty','bored']],['forgot his homework','worried',['delighted','proud']],['helped an old man cross the road','happy',['guilty','scared']]]),P=wdPerson();
    return{k:'feel',q:`${P.n} ${F[0].replace('his',P.his)}. ${P.he} felt ___.`,opts:[F[1],...F[2]],why:`想一想：发生这件事，心里会怎样？→ <b>${F[1]}</b>`};}
  const P=wdPerson(),[w,sp]=wdPick([['shouted','Help'],['cried','Watch out'],['asked','Are you all right?'],['said','I am sorry'],['whispered','Be quiet'],['exclaimed','What a mess']]),
   end=/[?]$/.test(sp)?'':(w==='said'||w==='whispered'?',':'!'),body=sp.replace(/[?]$/,'')+(sp.endsWith('?')?'?':end);
  return{k:'feel',q:'说的话写对了吗？选写对的一句。',opts:[`"${body}" ${w} ${P.n}.`,`${body} ${w} ${P.n}.`,`"${wdLc(body)}" ${wdCap(w)} ${P.n}.`],why:'说的话放在 <b>" "</b> 里，第一个字母大写，后面 said / shouted 小写。',long:1};},
 word(){const W=[['in a hurry','很匆忙'],['burst into tears','突然大哭'],['lost his balance','失去平衡'],['at the last minute','在最后一刻'],['heaved a sigh of relief','松了一口气'],['in the nick of time','刚好及时'],
   ['to his horror','让他害怕的是'],['scolded','骂、责备'],['apologised','道歉'],['grateful','感激的'],['nervous','紧张的'],['curious','好奇的'],['rushed','冲、赶快去'],['tiptoed','踮着脚走'],
   ['grabbed','一把抓住'],['peeped','偷看'],['a helping hand','帮一把'],['learnt a lesson','学到了教训'],['from then on','从那以后'],['all of a sudden','突然'],['without thinking','想都没想'],
   ['with a loud crash','哐当一声'],['in shock','吓呆了'],['comforted','安慰'],['praised','表扬'],['punished','惩罚'],['confessed','承认（做错事）'],['forgave','原谅了']];
  const w=wdPick(W),o=wwShuf(W.filter(x=>x!==w)).slice(0,2);return{k:'word',q:`<b>${w[0]}</b> 是什么意思？`,opts:[w[1],o[0][1],o[1][1]],why:`${w[0]} = <b>${w[1]}</b>`};}};
function wdW(){const w=wwSt(),D=w.dr||{},E=w.err||{},m={tense:'tense',who:'who',brk:'order'};
  return Object.keys(WDK).map(k=>{const[r,x]=D[k]||[0,0];return[k,1+(r+x?2*x/(r+x):0)+Math.min(2,(E[m[k]]||0)/5)];});}
function wdRound(){const W=wdW(),n={},out=[];
  while(out.length<8){const tot=W.reduce((a,[k,v])=>a+(n[k]>=3?0:v),0);let x=Math.random()*tot,k;
    for(const[kk,v]of W){if(n[kk]>=3)continue;x-=v;if(x<=0){k=kk;break;}}k=k||W.find(([kk])=>!(n[kk]>=3))[0];
    let it,tries=0;do{it=WDMAKE[k]();}while(out.some(o=>o.q===it.q&&o.opts[0]===it.opts[0])&&++tries<9);
    n[k]=(n[k]||0)+1;it.right=it.opts[0];it.opts=wwShuf(it.opts);out.push(it);}
  return out;}
let WD=null;
function wdStart(){WD={qs:wdRound(),i:0,got:null,ok:0,res:{}};show('vWWDr');wdDraw();}
function wdDraw(){const q=WD.qs[WD.i];
  $('wwDrDots').innerHTML=WD.qs.map((x,i)=>`<span class="${i===WD.i?'on':i<WD.i?'done':''}">${i+1}</span>`).join('');
  $('wwDrBub').innerHTML=WD.got==null?`<small>${WDK[q.k]}</small><br>${q.k==='tense'?'这件事已经发生了，选对的动词。':q.k==='who'?'人称选好就不变。':''}`:WD.got===q.right?`✓ ${q.why}`:`再看看：${q.why}`;
  $('wwDrBody').innerHTML=`<div class="ww-dq${q.long?' long':''}"><p class="ww-dq-q">${q.q}</p><div class="ww-dopts">${q.opts.map((o,i)=>{
    const c=WD.got==null?'':o===q.right?' ok':o===WD.got?' no':'';return`<button class="ww-dopt${c}" data-wdo="${i}"${WD.got!=null?' disabled':''}>${esc(o)}</button>`;}).join('')}</div>
    ${WD.got!=null?`<button class="btn" id="wdNext">${WD.i<7?'下一题 →':'看结果'}</button>`:''}</div>`;}
function wdTap(e){if(e.target.closest('#wdNext')){WD.got=null;if(WD.i<7){WD.i++;wdDraw();}else wdEnd();return;}
  if(e.target.closest('#wdAgain')){wdStart();return;}if(e.target.closest('#wdBack')){wwHome();return;}
  const b=e.target.closest('[data-wdo]');if(!b||WD.got!=null)return;const q=WD.qs[WD.i];WD.got=q.opts[+b.dataset.wdo];
  const r=WD.res[q.k]=WD.res[q.k]||[0,0],good=WD.got===q.right;r[good?0:1]++;if(good)WD.ok++;beep(good);wdDraw();}
function wdEnd(){const w=wwSt(),dk=dkey(new Date());if(!w.dr||typeof w.dr!=='object'||Array.isArray(w.dr))w.dr={};
  for(const k in WD.res){const d=Array.isArray(w.dr[k])?w.dr[k]:[0,0];w.dr[k]=[d[0]+WD.res[k][0],d[1]+WD.res[k][1]];}
  S.days[dk]=(S.days[dk]||0)+1;S.stars+=1;
  if(!Array.isArray(S.log))S.log=[];S.log.push({d:dk,ts:Date.now(),c:'gram',t:'写作工坊 · 基本功',h:QB.hash('wwdr:'+Date.now()),ok:WD.ok>=6?1:0,q:`基本功 ${WD.ok} / 8`,a:Object.entries(WD.res).map(([k,v])=>`${WDK[k]} ${v[0]}/${v[0]+v[1]}`).join(', ')});
  if(S.log.length>5000)S.log=S.log.slice(-5000);save();
  const miss=Object.entries(WD.res).filter(([k,v])=>v[1]).map(([k])=>WDK[k]);
  $('wwDrDots').innerHTML='';$('wwDrBub').innerHTML=miss.length?`下一轮会多练：${miss.join('、')}`:'全对！🎉';
  $('wwDrBody').innerHTML=`<div class="ww-end" style="text-align:center"><h4 style="font-size:1.6rem">${WD.ok} / 8 ✓</h4><p>+1 ★</p><p class="ww-legend">${Object.entries(WD.res).map(([k,v])=>`${WDK[k]} ${v[0]}/${v[0]+v[1]}`).join(' · ')}</p></div>
    <div class="ww-dopts"><button class="btn" id="wdAgain">再来一轮</button><button class="btn ghost" id="wdBack">回到写作工坊</button></div>`;}
function wdHomeStat(){const D=wwSt().dr||{},el=$('wwDk');if(!el)return;
  el.innerHTML=Object.keys(WDK).map(k=>{const[r,x]=Array.isArray(D[k])?D[k]:[0,0];return r+x?`<span>${WDK[k]} ${Math.round(100*r/(r+x))}%</span>`:'';}).join('');}
$('wwDrGo').addEventListener('click',wdStart);
$('wwDrQuit').addEventListener('click',()=>wwHome());
$('wwDrBody').addEventListener('click',wdTap);
window.__wd={WD:()=>WD,round:wdRound,start:wdStart};
