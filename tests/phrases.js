/* English: the phrases deck (介词词组), the new grammar cells and cloze, spell-it skipping the sayings.
   Usage: node tests/phrases.js [baseURL] */
const {chromium,devices}=require('playwright');const H=process.argv[2]||'http://localhost:8767';
(async()=>{const b=await chromium.launch();const out=[],errs=[];const ok=(c,m)=>out.push((c?'PASS ':'FAIL ')+m);
const p=await (await b.newContext({...devices['iPad (gen 7)'],deviceScaleFactor:1})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(H+'/english/');await p.waitForTimeout(300);
const S=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('xiaoxiao-english-v1')||'{}'));
ok(await p.isVisible('#tPP'),'home has the Phrases tile: '+(await p.innerText('#tPP')).replace(/\n/g,' '));
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
const list=await p.innerText('#ppSets');ok((list.match(/这周学这组/g)||[]).length===2,'two groups marked for this week');
await p.click('[data-pplearn="0"]');for(let i=0;i<5;i++){ok(i>0||(await p.innerHTML('#ppcWord')).includes('pp-k'),'card shows the phrase with the small word marked');await p.click('#ppcNext');}
const r1=await play(true);ok(r1.n===5&&r1.miss===0,'learning round: 5 “which small word” questions, all answerable ('+JSON.stringify(r1)+')');
ok((await p.innerText('#bAgain')).includes('介词词组'),'end of round leads back to the phrases');
await p.click('#bAgain');let s=await S();
ok(Object.keys(s.pp||{}).length===5&&Object.values(s.pp).every(x=>x.box===1),'5 phrases learned, all at the first step');
ok((s.misses||[]).length===0,'phrases are not added to the wrong-answer list');
ok(Object.keys(s.ppg||{}).length===1,'group recorded as learned');
/* a few weeks on: everything due and well known → sentences, a story, spot-the-mistake */
await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('xiaoxiao-english-v1'));S.ppg[QB.PPG[1].t]='2026-11-01';QB.PP.filter(x=>x.g<=1).forEach(x=>S.pp[x.id]={box:4,due:'2026-01-01',n:4,bad:0});localStorage.setItem('xiaoxiao-english-v1',JSON.stringify(S));});
await p.reload();await p.waitForTimeout(200);
ok((await p.innerText('#tasks')).includes('复习今天的词组'),'task: review today’s phrases');
const kinds=new Set();for(let k=0;k<6;k++){await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('xiaoxiao-english-v1'));Object.values(S.pp).forEach(x=>{x.due='2026-01-01';x.box=Math.max(x.box,4);});localStorage.setItem('xiaoxiao-english-v1',JSON.stringify(S));});
  await p.reload();await p.waitForTimeout(150);await p.click('#tPP');await p.click('#ppReview');
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
await p.reload();await p.waitForTimeout(150);ok(!(await p.isVisible('#tSpell'))||!(await p.innerText('#spNote')).match(/学过 [1-9]/),'only sayings learned → nothing to spell');
await p.screenshot({path:'/tmp/pp-home.png'});
console.log(out.join('\n'));console.log('errors',errs);await b.close();})();
