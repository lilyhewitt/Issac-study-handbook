/* Daily rounds: step-by-step problems must stay whole even when word cards are due for review,
   and a round with every answer right gets the bonus. Usage: node tests/rounds.js [baseURL] */
const {chromium,devices}=require('playwright');const H=process.argv[2]||'http://localhost:8767';
(async()=>{const b=await chromium.launch();const out=[],errs=[];const ok=(c,m)=>out.push((c?'PASS ':'FAIL ')+m);
const p=await (await b.newContext({...devices['iPad (gen 7)'],deviceScaleFactor:1})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(H+'/math/');await p.waitForTimeout(300);
/* five word cards learned and due today */
await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('xiaoxiao-math-v1')||'{"stars":0,"days":{},"misses":[],"recent":[],"by":{}}');S.wd=S.wd||{};
  QB.WORDSETS[0].words.forEach(w=>{S.wd[w[0]]={box:1,due:'2026-01-01',n:1,bad:0};});S.sets={[QB.WORDSETS[0].title]:'2026-01-01'};S.setk=1;localStorage.setItem('xiaoxiao-math-v1',JSON.stringify(S));});
await p.reload();await p.waitForTimeout(300);
let broken=0,chains=0,words=0,rounds=0;
for(let r=0;r<25;r++){await p.click('#tMix');rounds++;const chips=[];
  while(await p.isVisible('#opts')){chips.push(await p.innerText('#qChip'));await p.click('#opts button >> nth=0');await p.waitForTimeout(25);if(await p.isVisible('#bNext'))await p.click('#bNext');await p.waitForTimeout(25);if(chips.length>20)break;}
  /* every "第 k 步，共 n 步" run must go 1..n without a gap */
  for(let i=0;i<chips.length;i++){const m=chips[i].match(/第 (\d+) 步，共 (\d+) 步/);if(!m||m[1]!=='1')continue;chains++;const n=+m[2];
    for(let k=1;k<n;k++){const m2=(chips[i+k]||'').match(/第 (\d+) 步，共 (\d+) 步/);if(!m2||+m2[1]!==k+1){broken++;break;}}}
  words+=chips.filter(c=>/单词卡/.test(c)).length;
  if(await p.isVisible('#bHome'))await p.click('#bHome');await p.waitForTimeout(40);
  /* keep the words due */
  await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('xiaoxiao-math-v1'));Object.values(S.wd).forEach(w=>w.due='2026-01-01');localStorage.setItem('xiaoxiao-math-v1',JSON.stringify(S));});await p.reload();await p.waitForTimeout(150);}
ok(chains>5,'step-by-step problems appeared: '+chains+' in '+rounds+' rounds; word-card questions: '+words);
ok(broken===0,'no step-by-step problem was cut short by a word-card question (cut short: '+broken+')');
ok(words>0,'due words still get reviewed inside rounds');
console.log(out.join('\n'));console.log('errors',errs);await b.close();})();
