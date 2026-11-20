// 一起读 · 一分钟朗读 · 短句听写 (English): the adult tools from the parent page, a passage finished (+2 ★ once),
// a one-minute reading (misses, time up, last word → words read right, saved, shown in the monthly record),
// a dictation round (wrong word + missing full stop → the sentence comes back in two days, +1 ★ once a day),
// and an old save without any of these fields opening cleanly.
const {chromium,devices}=require('playwright');
const NAME=process.env.WW_NAME||'';
const U='http://localhost:8767/english/',KEY='xiaoxiao-english-v1';let pass=0,fail=0;
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
(async()=>{const b=await chromium.launch();const errs=[];
for(const dev of ['iPad (gen 7) landscape','iPhone 13']){
const p=await (await b.newContext({...devices[dev]})).newPage();p.on('pageerror',e=>errs.push(e.message));
// an old save: none of the new fields
await p.goto(U);await p.evaluate(K=>{localStorage.clear();localStorage.setItem(K,JSON.stringify({stars:10,days:{},log:[],sets:{},wd:{},sp:{}}));},KEY);await p.reload();await p.waitForTimeout(500);
const S=()=>p.evaluate(K=>JSON.parse(localStorage.getItem(K)),KEY);
await p.click('#bStats');await p.click('#bParent');await p.waitForTimeout(300);
ok(await p.isVisible('#stRT')&&await p.isVisible('#stORF'),dev+': the parent page has 一起读 and 一分钟朗读');
// read together
await p.click('#stRT');ok(await p.isVisible('#vRT')&&(await p.textContent('#rtText')).includes('Darren'),dev+': read together opens on the first passage');
ok((await p.$$('#rtQs .rt-q')).length===3&&(await p.$$('#rtWords .rt-w')).length>=3,dev+': three questions and the words');
await p.click('#rtDone');let s=await S();
ok(s.stars===12&&s.rt.done.r1,dev+': finished → +2 ★, saved');
await p.click('#rtDone');s=await S();ok(s.stars===12,dev+': reading it again gives no more stars');
await p.click('#rtNext');ok((await p.textContent('#rtText')).includes('lion'),dev+': next passage');
// one-minute reading
await p.click('#rtToOrf');ok(await p.isVisible('#vORF'),dev+': one-minute reading opens');
await p.click('#orfGo');await p.waitForTimeout(300);await p.click('[data-ow="3"]');await p.click('[data-ow="9"]');await p.click('[data-ow="9"]');await p.click('[data-ow="12"]');
ok((await p.$$('.ow.x')).length===2,dev+': tapping marks a missed word, tapping again clears it');
await p.evaluate(()=>__rt.orfEnd());await p.waitForTimeout(150);
ok((await p.textContent('#orfStepH')).includes('时间到'),dev+': time up asks for the last word');
await p.click('[data-ow="40"]');s=await S();const r=s.orf[s.orf.length-1];
ok(r&&r.n===41&&r.ok===39,dev+': 41 words reached, 2 missed → 39 read right, saved '+JSON.stringify(r));
ok((await p.textContent('#orfHist')).includes('39'),dev+': the monthly record shows it');
await p.click('[data-ow="44"]');s=await S();ok(s.orf.length===1&&s.orf[0].n===45,dev+': moving the last word fixes the same record');
await p.click('#orfBack');await p.waitForTimeout(200);ok((await p.textContent('#rtStat')).includes('读对'),dev+': the parent page shows the last reading');
// dictation (behind the workshop's name lock)
if(NAME){await p.click('#bStatsBack');await p.goto(U);await p.waitForTimeout(400);
  await p.click('#tWW');await p.waitForFunction(()=>QB.WW);await p.waitForTimeout(300);if(await p.isVisible('#wwName')){await p.fill('#wwName',NAME);await p.click('#wwOpen');}await p.waitForSelector('#wwHome:not([hidden])');
  await p.click('#wwDcGo');ok(await p.isVisible('#vDict')&&(await p.$$('#dcDots span')).length===3,dev+': dictation: 3 sentences');
  await p.click('#dcWrote');await p.click('[data-dw="0"]');await p.click('[data-dc="end"]');
  ok(await p.isVisible('.dc-w.x')&&await p.isVisible('.dc-c.no'),dev+': a wrong word and a missing full stop are marked');
  await p.click('#dcOk');await p.click('#dcWrote');await p.click('#dcOk');await p.click('#dcWrote');await p.click('#dcOk');
  s=await S();const first=s.dc.s[0];
  ok(first&&first.bad===1&&first.due>s.dc.s[0].last&&s.dc.s[1].bad===0&&!s.dc.s[1].due,dev+': the missed sentence comes back in two days, the right ones do not');
  ok(s.dc.sp.the===1,dev+': the misspelt word is kept');
  ok((await p.textContent('#dcBody')).includes('2 / 3')&&s.stars===13,dev+': 2 of 3 right, +1 ★');
  await p.click('#dcMore');for(let i=0;i<3;i++){await p.click('#dcWrote');await p.click('#dcOk');}s=await S();ok(s.stars===13,dev+': a second round the same day gives no more stars');
  ok(s.log.some(e=>e.t==='写作工坊 · 听写')&&s.log.some(e=>e.t==='一起读 · Read together'),dev+': both are in the log');
  await p.click('#dcHome');ok((await p.textContent('#wwDcNote')).includes('今天写过了'),dev+': the workshop shows today is done');}
const wide=await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);ok(wide,dev+': nothing scrolls sideways');
}
ok(!errs.length,'no page errors '+errs.join(' | '));
console.log(pass,'passed',fail,'failed');await b.close();process.exit(fail?1:0);})();
