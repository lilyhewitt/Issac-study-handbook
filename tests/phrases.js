/* English: the phrases deck (介词词组), the new grammar cells and cloze, spell-it skipping the sayings.
   Usage: node tests/phrases.js [baseURL] */
const {chromium,devices}=require('playwright');const H=process.argv[2]||'http://localhost:8767';
(async()=>{const b=await chromium.launch();const out=[],errs=[];const ok=(c,m)=>out.push((c?'PASS ':'FAIL ')+m);
const p=await (await b.newContext({...devices['iPad (gen 7)'],deviceScaleFactor:1})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(H+'/english/');await p.waitForTimeout(300);
const S=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('xiaoxiao-english-v1')||'{}'));
const tiles=await p.$$eval('#vHome .tile',a=>a.map(e=>e.id));ok(tiles.join()==='tCards,tPP,tWord,tGram,tRead,tRedo','home has six tiles in order: '+tiles.join());
const sq=await p.$$eval('#vHome .tile',a=>a.map(e=>Math.abs(e.offsetWidth-e.offsetHeight)<=2));ok(sq.every(Boolean),'tiles are square (phone)');
{const g=await p.evaluate(()=>{const r=e=>document.querySelector(e).getBoundingClientRect();return {tiles:r('.tiles').left,tasks:r('#tasks').right,me:r('#bStats').left,board:r('.board').left,glyph:document.querySelectorAll('#vHome .glyph').length,sub:getComputedStyle(document.querySelector('.hello-sub')).display};});
 ok(g.tiles>g.tasks&&Math.abs(g.me-g.board)<2,'iPad: board, tasks and my progress on the left, tiles on the right '+JSON.stringify(g));ok(g.glyph===6&&g.sub==='none','icons on the tiles, no “Pick one” line');
 const notes=await p.$$eval('#vHome .tnote',a=>a.map(e=>e.innerText));ok(notes.filter(Boolean).length===0,'nothing due → no small notes on the tiles: '+notes.join(' | '));}
ok(!(await p.isVisible('#mini'))&&!(await p.isVisible('#vHome .foot'))&&!(await p.isVisible('#bRedo')),'no score line, no tip line, no old try-again bar');
await p.click('#tCards');ok(await p.isVisible('#vMap'),'Word cards tile opens the word map');await p.click('#mBack');ok(await p.isVisible('#vHome'),'back from the map goes home');
await p.click('#tRedo');ok(await p.isVisible('#vHome'),'try again with no misses stays home: '+(await p.innerText('#tRedo')).replace(/\n/g,' '));
ok((await p.innerText('#tasks')).includes('学一组新词组'),'today’s tasks offer a new group of phrases');
/* answer a phrase question right: find the phrase the question is about */
const right=async()=>p.evaluate(()=>{const qt=document.querySelector('#qText').innerText.trim().replace(/\s+/g,' '),norm=x=>x.replace(/___/g,'').replace(/\s+/g,' ').trim(),pt=(document.querySelector('#qPass')||{}).innerText||'',chip=document.querySelector('#qChip').innerText;
  const P=QB.PP;let k=null;
  for(const x of P){if(norm(qt)===norm(`${x.blank}（${x.zh}）`)||norm(qt)===norm(x.exB.replace(/\*\*/g,''))){k=x.key;break;}}
  if(!k&&/blank \((\d)\)/.test(qt)){const n=+qt.match(/blank \((\d)\)/)[1];const g=QB.PPG.find(g=>{let i=0;return g.story.replace(/\{(\d)\}/g,()=>`___(${++i})`).replace(/___/g,'')===pt.replace(/\s*\n\s*/g,' ').replace(/ \(/g,'(').trim().replace(/___/g,'')||pt.includes(g.story.split('{')[0].trim());});
    if(g){const idx=[...g.story.matchAll(/\{(\d)\}/g)].map(m=>+m[1]);const gi=QB.PPG.indexOf(g);k=P.filter(x=>x.g===gi)[idx[n-1]].key;}}
  const bs=[...document.querySelectorAll('#opts .opt')];const t=bs.find(b=>b.querySelector('.otext').innerText.trim()===k);return t?+t.dataset.i:-1;});
const play=async(allRight)=>{let n=0,miss=0;while(await p.isVisible('#opts')&&n<20){n++;let i=allRight?await right():0;if(i<0){miss++;i=0;}await p.click('#opt'+i);await p.waitForTimeout(30);if(await p.isVisible('#bNext'))await p.click('#bNext');await p.waitForTimeout(30);}return {n,miss};};
await p.click('#tPP');await p.waitForTimeout(100);
ok(await p.isVisible('#vMap'),'phrases tile opens the phrase map');
await p.click('.mn[data-i="0"]',{force:true});for(let i=0;i<5;i++){ok(i>0||(await p.innerHTML('#ppcWord')).includes('pp-k'),'card shows the phrase with the small word marked');await p.click('#ppcNext');}
const r1=await play(true);ok(r1.n===5&&r1.miss===0,'learning round: 5 “which small word” questions, all answerable ('+JSON.stringify(r1)+')');
ok(await p.isVisible('#mRes'),'end of round shows the result on the phrase map');
await p.click('#mrGo');let s=await S();
ok(Object.keys(s.pp||{}).length===5&&Object.values(s.pp).every(x=>x.box===1),'5 phrases learned, all at the first step');
ok((s.misses||[]).length===0,'phrases are not added to the wrong-answer list');
ok(Object.keys(s.ppg||{}).length===1,'group recorded as learned');
/* a few weeks on: everything due and well known → sentences, a story, spot-the-mistake */
await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('xiaoxiao-english-v1'));S.ppg[QB.PPG[1].t]='2026-11-01';QB.PP.filter(x=>x.g<=1).forEach(x=>S.pp[x.id]={box:4,due:'2026-01-01',n:4,bad:0});localStorage.setItem('xiaoxiao-english-v1',JSON.stringify(S));});
await p.reload();await p.waitForTimeout(200);
ok((await p.innerText('#tasks')).includes('复习今天的词组'),'task: review today’s phrases');
const kinds=new Set();for(let k=0;k<6;k++){await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('xiaoxiao-english-v1'));Object.values(S.pp).forEach(x=>{x.due='2026-01-01';x.box=Math.max(x.box,4);});localStorage.setItem('xiaoxiao-english-v1',JSON.stringify(S));});
  await p.reload();await p.waitForTimeout(150);await p.click('[data-tk="pp"]');
  while(await p.isVisible('#opts')){kinds.add((await p.innerText('#qChip')).split(' · 第')[0]);let i=await right();if(i<0)i=0;await p.click('#opt'+i);await p.waitForTimeout(25);if(await p.isVisible('#bNext'))await p.click('#bNext');await p.waitForTimeout(25);}
  await p.click('#bAgain');}
ok(kinds.has('Phrases in sentences · 词组放进句子')&&kinds.has('Phrases in a story · 小故事')&&kinds.has('Phrases: spot the mistake · 找错'),'review moves on to sentences, stories and spot-the-mistake: '+[...kinds].join(' / '));
/* grammar rounds: the new cells and the step-by-step pronoun cloze */
await p.click('#ppBack');const topics=new Set();let broken=0;
for(let r=0;r<30;r++){await p.click('.tile[data-mode="gram"]');const chips=[];while(await p.isVisible('#opts')){chips.push(await p.innerText('#qChip'));await p.click('#opt0');await p.waitForTimeout(20);if(await p.isVisible('#bNext'))await p.click('#bNext');await p.waitForTimeout(20);}
  chips.forEach(c=>topics.add(c.split(' · 第')[0]));for(let i=0;i<chips.length;i++){const m=chips[i].match(/第 1 步，共 (\d) 步/);if(m)for(let k=1;k<+m[1];k++)if(!new RegExp('第 '+(k+1)+' 步').test(chips[i+k]||''))broken++;}
  if(await p.isVisible('#bHome'))await p.click('#bHome');await p.waitForTimeout(30);}
const want=['were · 复数主语','was · 单数主语','While … · 过去进行时','many · a few · 可数','much · a little · 不可数','Pronoun cloze · 代词完形','Subject and verb · 主谓一致'];
ok(want.every(w=>topics.has(w)),'grammar rounds include the new cells: '+want.filter(w=>!topics.has(w)).join(',')+' missing');
ok(broken===0,'pronoun cloze steps stay together');
/* spell it never offers a saying */
await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('xiaoxiao-english-v1'));S.wd=S.wd||{};QB.WORDSETS.find(s=>s.title==='Sayings').words.forEach(w=>S.wd[w[0]]={box:1,due:'2030-01-01',n:1,bad:0});localStorage.setItem('xiaoxiao-english-v1',JSON.stringify(S));});
await p.reload();await p.waitForTimeout(150);
await p.click('#tWord');{let k=0,sp=0;while((await p.isVisible('#opts'))&&k<8){k++;await p.click('#opt0');if(await p.isVisible('#bNext'))await p.click('#bNext');await p.waitForTimeout(20);}ok(k===5&&await p.isVisible('#vDone'),'Words round with nothing to spell: 5 questions ('+k+')');await p.click('#bHome');}
/* learned words: the Words round mixes in two spell-it questions */
await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('xiaoxiao-english-v1'));QB.WORDSETS[1].words.forEach(w=>S.wd[w[0]]={box:1,due:'2030-01-01',n:1,bad:0});localStorage.setItem('xiaoxiao-english-v1',JSON.stringify(S));});
await p.reload();await p.waitForTimeout(150);
{const s0=(await S()).stars;await p.click('#tWord');const seq=[];let steps=0;
 while(steps<40){steps++;
  if(await p.isVisible('#vSpell')&&await p.isVisible('#spPlay')){seq.push('S'+(await p.innerText('#spNo')));
    /* first try: tap tiles in order (likely wrong), then copy the spelling shown */
    const n=(await p.$$('#spSlots .sp-slot')).length;for(let j=0;j<n;j++)await p.click('#spTiles [data-tile="'+j+'"]');
    if(await p.isVisible('#spCopy')){const w=(await p.innerText('#spModel')).trim();await p.click('#spCopy');
      for(const c of w){const ts=await p.$$('#spTiles .sp-tile:not(.used)');for(const t of ts){if((await t.innerText()).trim()===c){await t.click();break;}}}}
    await p.click('#spNext');await p.waitForTimeout(30);continue;}
  if(await p.isVisible('#opts')){seq.push('Q'+(await p.innerText('#qNo')));await p.click('#opt0');if(await p.isVisible('#bNext'))await p.click('#bNext');await p.waitForTimeout(20);continue;}
  break;}
 ok(seq.filter(x=>x[0]==='S').length===2&&seq.length===5&&await p.isVisible('#vDone'),'Words round: 3 questions + 2 spell-it mixed, then the score: '+seq.join(' '));
 const st=await p.innerText('#dStars');ok((await p.$$('#dStars svg')).length===5,'score shows 5');
 const S1=await S();ok(Object.keys(S1.sp||{}).length===2,'spell-it progress recorded');
 ok(!S1.misses.some(m=>m.sp),'spell-it never goes to the misses');await p.click('#bHome');}
/* words due today: grammar, reading and word rounds stay on their own kind (no word-card question slipped in) */
await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('xiaoxiao-english-v1'));QB.WORDSETS[0].words.forEach(w=>S.wd[w[0]]={box:1,due:'2026-01-01',n:1,bad:0});localStorage.setItem('xiaoxiao-english-v1',JSON.stringify(S));});
await p.reload();await p.waitForTimeout(150);let wc=0,firsts=[];
for(const t of ['#tGram','#tRead','#tGram','#tRead']){await p.click(t);let k=0;while(await p.isVisible('#opts')&&k<12){const c=await p.innerText('#qChip');if(!k)firsts.push(c.slice(0,20));if(/单词卡/.test(c))wc++;await p.click('#opt0');await p.waitForTimeout(25);if(await p.isVisible('#bNext'))await p.click('#bNext');await p.waitForTimeout(25);k++;}if(await p.isVisible('#bHome'))await p.click('#bHome');await p.waitForTimeout(60);}
ok(wc===0,'grammar and reading rounds have no word-card questions even with words due (first: '+firsts.join(' / ')+')');
await p.screenshot({path:'/tmp/pp-home.png'});
console.log(out.join('\n'));console.log('errors',errs);await b.close();})();
