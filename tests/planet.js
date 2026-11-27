// Science home v4.72: Space Mission + 5 tiles; star card opens my stars; a planet opens its steps;
// the 选择题 step gives 5 questions of that planet's units, ends with 回到星球, and ticks the step; quitting goes back to the planet.
const {chromium,devices}=require('playwright');const U='http://localhost:8767/science/';let pass=0,fail=0;
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
(async()=>{const b=await chromium.launch();const errs=[];const p=await (await b.newContext({...devices['iPad (gen 7) landscape']})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(U);await p.waitForTimeout(600);
const vis=await p.$$eval('#vHome .tile',x=>x.filter(e=>e.offsetParent).map(e=>e.dataset.mode).join(','));
ok(vis==='sp,tool,skill,cards,redo,lab','home shows Space Mission + 5 tiles ('+vis+')');
await p.click('.sm-board');await p.waitForTimeout(300);ok(await p.isVisible('#smShelf')||await p.isVisible('#vMe'),'star card opens my stars');
await p.goto(U);await p.waitForTimeout(500);
const mag=await p.evaluate(()=>{const L=[...Array(40).keys()];return 0;});
await p.evaluate(()=>__pl.plOpen(__pl.bodyIndex()));
const ts=await p.evaluate(()=>[...document.querySelectorAll('.pl-step')].map(b=>b.dataset.pl).join(','));ok(ts==='act,go,mc','人体星: act, go, mc ('+ts+')');
await p.click('[data-pl="mc"]');await p.waitForTimeout(300);ok(await p.isVisible('#vQuiz'),'选择题 starts a round');
let n=0,topics=new Set();while(await p.isVisible('#vQuiz')&&n<8){n++;topics.add(await p.evaluate(()=>document.querySelector('#vQuiz .tag, #qTag, .qtag')?.textContent||''));await p.click('#opts .opt');await p.waitForTimeout(150);await p.click('#bNext');await p.waitForTimeout(150);}
ok(n===5,'5 questions ('+n+')');
const bt=await p.textContent('#bAgain');ok(bt.includes('回到星球'),'result says 回到星球 ('+bt+')');
await p.click('#bAgain');await p.waitForTimeout(300);ok(await p.isVisible('#vPl')&&!!(await p.$('.pl-step.ok[data-pl="mc"]')),'back on the planet, 选择题 ticked');
const topicOk=await p.evaluate(()=>{const q=QB.topicQs(['magnets'],5);return q.length===5&&q.every(x=>/Magnets/.test(x.t));});ok(topicOk,'topic questions come from that unit only');
await p.click('[data-pl="mc"]');await p.waitForTimeout(200);await p.click('#bQuit');await p.waitForTimeout(200);ok(await p.isVisible('#vPl'),'quitting a 选择题 round goes back to the planet');
ok(!errs.length,'no page errors '+errs.slice(0,2).join(' | '));
await b.close();console.log(`${pass} passed, ${fail} failed`);process.exit(fail?1:0);})();
