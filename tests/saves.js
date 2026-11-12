const {chromium,devices}=require('playwright');
const U='http://localhost:8770/';
(async()=>{const b=await chromium.launch();const out=[];const errs=[];const ok=(c,m)=>out.push((c?'PASS ':'FAIL ')+m);
const ctx=await b.newContext({...devices['iPad (gen 7)'],deviceScaleFactor:1});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(p.url()+' '+e.message));
const play=async(tile,rounds)=>{for(let r=0;r<rounds;r++){await p.click(tile);for(let k=0;k<9;k++){if(!await p.isVisible('#opts'))break;await p.click('#opts button >> nth='+(k%2?1:0));await p.waitForTimeout(40);if(await p.isVisible('#bNext'))await p.click('#bNext');await p.waitForTimeout(40);}
  if(await p.isVisible('#bHome'))await p.click('#bHome');else if(await p.isVisible('#bQuit'))await p.click('#bQuit');await p.waitForTimeout(80);}};
const get=k=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),k);
for(const [app,key,tile,tileNew] of [['math','xiaoxiao-math-v1','#tMix','#tWp'],['english','xiaoxiao-english-v1','#tGram','#tGram'],['science','xiaoxiao-science-v1','#tMix','#tLife']]){
  await p.goto(U+'old/'+app+'.html');await p.waitForTimeout(250);await play(tile,2);
  /* the old app marks the first word set learned: S.sets[0]=date, its words in S.wd */
  await p.evaluate(k=>{const S=JSON.parse(localStorage.getItem(k));S.sets={[QB.WORDSETS[0]["title"]]:'2026-11-06'};QB.WORDSETS[0].words.forEach(w=>{S.wd[w[0]]={box:1,due:'2026-11-07',n:1,bad:0};});localStorage.setItem(k,JSON.stringify(S));},key);
  const firstOld=await p.evaluate(()=>QB.WORDSETS[0].title);const A=await get(key);
  await p.goto(U+'new/'+app+'.html');await p.waitForTimeout(250);
  const raw=await get(key);ok(JSON.stringify(raw)===JSON.stringify(A),app+': opening the new version changes nothing by itself');
  if(await p.isVisible('#tCards'))await p.click('#tCards');else await p.click('#tWords');await p.waitForTimeout(100);const wl=await p.innerText('#wSets');
  const heads=await p.$$eval('#wSets .wset-h',a=>a.map(e=>e.innerText.replace(/\s+/g,' ')));ok(heads.some(h=>h.includes(firstOld)&&/学的/.test(h)),app+': "'+firstOld+'" still shows as learned');
  await p.click('#bWordsBack');await p.waitForTimeout(80);if(await p.isVisible('#chBack'))await p.click('#chBack');
  await play(tileNew,1);const B=await get(key);
  ok(B.stars>=A.stars&&B.stars<=A.stars+5,app+': stars kept ('+A.stars+' → '+B.stars+')');
  ok(Object.keys(A.days).every(d=>B.days[d]),app+': days kept');
  ok((B.log||[]).length>=(A.log||[]).length,app+': session log kept ('+(A.log||[]).length+' → '+(B.log||[]).length+')');
  const ak=new Set(A.misses.map(m=>m.q)),kept=B.misses.filter(m=>ak.has(m.q)).length;ok(kept>=A.misses.length-2,app+': wrong answers kept ('+A.misses.length+' old, '+kept+' still there; a right redo removes one)');
  ok(Object.keys(A.wd).every(w=>B.wd[w]),app+': learned words kept');
  ok(B.sets[firstOld]==='2026-11-06',app+': learned set kept '+JSON.stringify(B.sets));ok(app!=='math'||(typeof B.ch==='number'),app+': chapter setting kept');
  ok(['stars','days','misses','by','wd'].every(f=>f in B),app+': all fields present');
}
/* handbook: old math ticks follow to the 4A steps */
await p.goto(U+'old/hb.html#math');await p.waitForTimeout(200);await p.evaluate(()=>localStorage.setItem('xx-4a-math',JSON.stringify({mw1:true,mw7:true})));
await p.goto(U+'new/hb.html#math');await p.waitForTimeout(250);const ticks=await p.$$eval('#mweeks input',a=>a.map(x=>x.checked?1:0).join(''));ok(ticks==='10000010','handbook: ticks kept (steps 1 and 7): '+ticks);
console.log(out.join('\n'));console.log('errors',errs);await b.close();})();
