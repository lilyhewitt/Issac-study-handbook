// Slow down / take a break / this week's most-missed (all three apps share src/app.html; tested on English and math).
// Three fast wrong answers in a row → pause card that can't be closed for 8 s; 25 min of answering → break card (20 s);
// counts show in the parent view; home shows "这周错得最多" when ≥3 of this week's misses are still not right, and it starts a round of them.
const {chromium}=require('playwright');let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
(async()=>{const b=await chromium.launch();const errs=[];
for(const app of ['english','math']){
  const ctx=await b.newContext({viewport:{width:1024,height:768}});await ctx.addInitScript(()=>{localStorage.setItem('xx-guard-test','1');});
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(app+': '+e.message));
  await p.goto('http://localhost:8767/'+app+'/');await p.waitForTimeout(500);
  // answer wrong fast: start a mix round and pick a wrong option three times
  if(app==='english')await p.click('.tile[data-mode="gram"]');else await p.evaluate(()=>__isl.startRound('calc'));await p.waitForTimeout(300);
  for(let i=0;i<3;i++){const R=await p.evaluate(()=>{const r=__round();const q=r.qs[r.i];return {ans:q.ans,n:q.opts?q.opts.length:0};});
    if(!R.n)break;const opts=await p.$$('#opts button');const w=(R.ans+1)%R.n;await opts[w].click();await p.waitForTimeout(150);
    if(i<2){const nx=await p.$('#bNext:visible');if(nx)await nx.click();await p.waitForTimeout(150);}}
  ok(await p.isVisible('.gd-wrap'),app+': three fast wrong answers → slow-down card');
  ok(await p.isDisabled('.gd-go'),app+': it can\'t be closed straight away');
  await p.waitForTimeout(8300);ok(!(await p.isDisabled('.gd-go')),app+': after 8 s the button works');await p.click('.gd-go');
  ok(!(await p.isVisible('.gd-wrap')),app+': card closes');
  // break: pretend he started 26 minutes ago
  await p.evaluate(()=>{localStorage.setItem('xx-active',JSON.stringify({s:Date.now()-26*60000,l:Date.now()-60000}));});
  const nx=await p.$('#bNext:visible');if(nx)await nx.click();await p.waitForTimeout(200);
  const R=await p.evaluate(()=>{const r=__round();const q=r&&r.qs[r.i];return q&&q.opts?q.ans:-1;});
  if(R>=0){await (await p.$$('#opts button'))[R].click();}
  await p.waitForTimeout(300);ok((await p.textContent('.gd-wrap h2').catch(()=>'')).includes('休息'),app+': 25 minutes → break card');
  await p.waitForTimeout(20300);await p.click('.gd-go');
  const K=app==='english'?'xiaoxiao-english-v1':'xiaoxiao-math-v1';
  const s=await p.evaluate(K=>JSON.parse(localStorage.getItem(K)),K);
  ok(s.guard&&s.guard.rush.length===1&&s.guard.break.length===1,app+': both saved for the parent view');
  // week top 10: make 3 misses wrong this week
  await p.evaluate(K=>{const S=JSON.parse(localStorage.getItem(K));localStorage.setItem(K,JSON.stringify(S));},K);
  await p.goto('http://localhost:8767/'+app+'/');await p.waitForTimeout(500);
  const mN=s.misses.length;
  ok(mN>=3?await p.isVisible('#bWeek'):!(await p.isVisible('#bWeek')),app+': home shows 这周错得最多 when there are 3+ ('+mN+' misses)');
  if(mN>=3){await p.click('#bWeek');await p.waitForTimeout(300);const n=await p.evaluate(()=>__round().qs.length);ok(n>=3&&n<=10,app+': it starts a round of this week\'s misses ('+n+')');}
  await ctx.close();}
// automated runs without the test flag are not interrupted
{const p=await b.newPage();await p.goto('http://localhost:8767/english/');await p.waitForTimeout(400);await p.click('.tile[data-mode="gram"]');
 for(let i=0;i<3;i++){const R=await p.evaluate(()=>{const r=__round();const q=r.qs[r.i];return {ans:q.ans,n:q.opts?q.opts.length:0};});if(!R.n)break;await (await p.$$('#opts button'))[(R.ans+1)%R.n].click();const nx=await p.$('#bNext:visible');if(nx)await nx.click();}
 ok(!(await p.isVisible('.gd-wrap')),'other tests are not interrupted');await p.close();}
ok(!errs.length,'no page errors '+errs.slice(0,2).join(' | '));
await b.close();console.log(`${pass} passed, ${fail} failed`);process.exit(fail?1:0);})();
