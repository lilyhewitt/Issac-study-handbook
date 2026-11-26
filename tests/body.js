// 人体大发现 Body Explorer (science): an old save opens and shows the small tile; 4 system tabs (+ bones/muscles toggle);
// tapping parts lights them up (16 → +2 ★); food's and air's journey in order (wrong tap explains, finish +1 ★);
// 12-question quiz (tap / choose / letters) gives stars at the end; muscles slider; systems pairs; saved in S.body; works offline; no page errors.
const {chromium,devices}=require('playwright');
const U='http://localhost:8767/science/',KEY='xiaoxiao-science-v1';let pass=0,fail=0;
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
(async()=>{const b=await chromium.launch();const errs=[];
for(const dev of ['iPad (gen 7) landscape','iPhone 13']){
  const ctx=await b.newContext({...devices[dev]});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
  await p.goto(U);await p.evaluate(K=>{localStorage.clear();localStorage.setItem(K,JSON.stringify({stars:10,days:{},log:[],sets:{},wd:{},sp:{}}));},KEY);await p.reload();await p.waitForTimeout(600);
  const S=()=>p.evaluate(K=>JSON.parse(localStorage.getItem(K)),KEY);
  ok(await p.isVisible('#tBody'),dev+': old save opens, Body Explorer tile is under 更多练习');
  await p.click('#tBody');ok(await p.isVisible('#vBody .bd-stage svg'),dev+': the body picture shows');
  const keys=await p.evaluate(()=>Object.keys(__body.BD_PART));
  for(const [sys,sk] of [['dig'],['res'],['cir'],['ske','ske'],['ske','mus']]){
    await p.click(`[data-sys="${sys}"]`);if(sk)await p.click(`[data-sk="${sk}"]`);
    for(const c of await p.$$eval('.bd-chip',a=>a.map(x=>x.dataset.part))){await p.click(`.bd-chip[data-part="${c}"]`);}
  }
  await p.click('[data-sys="dig"]');await p.click('#bdStage .bd-hit[data-part="stomach"]');
  ok((await p.textContent('.bd-card h3'))==='Stomach',dev+': tapping the picture opens the card');
  ok(await p.$('#bdStage [data-part="stomach"][filter]'),dev+': the tapped part glows');
  let s=await S();ok(keys.every(k=>s.body.seen[k])&&s.stars===12,dev+': all 16 parts lit → +2 ★');
  await p.click('[data-jr="food"]');await p.click('#bdStage .bd-hit[data-part="small"]');
  ok((await p.textContent('.bd-fb')).includes('Not yet'),dev+': a part out of order explains why');
  for(const k of ['mouth','gullet','stomach','small','large','rectum'])await p.click(`#bdStage .bd-hit[data-part="${k}"]`);
  ok(await p.isVisible('.bd-done'),dev+': food journey finishes');
  await p.click('[data-go="ex"]');await p.click('[data-jr="air"]');for(const k of ['nose','wind','lungs'])await p.click(`#bdStage .bd-hit[data-part="${k}"]`);
  s=await S();ok(s.stars===14&&s.body.done.food&&s.body.done.air,dev+': both journeys +1 ★ each');
  await p.click('[data-go="ex"]');await p.click('[data-go="quiz"]');
  const QZ=await p.evaluate(()=>__body.BD_QZ);let wrong=true;
  for(const q of QZ){if(q.t==='tap')await p.click(`#bdStage .bd-hit[data-part="${q.a}"]`);
    else{const ops=await p.$$eval('.bd-opt',a=>a.map(x=>x.textContent.slice(3)));let n=ops.indexOf(q.o[0]);if(wrong){n=(n+1)%ops.length;wrong=false;}await p.click(`[data-opt="${n}"]`);}
    ok(await p.isVisible('.bd-fb'),dev+': quiz answer shows the reason');await p.click('[data-go="next"]');}
  ok((await p.textContent('.bd-done')).includes('11 / 12'),dev+': quiz score 11/12');
  s=await S();ok(s.stars===15&&s.log.some(l=>l.t.includes('人体大发现')),dev+': quiz +1 ★ and logged');
  await p.click('[data-go="ex"]');await p.click('[data-go="mus"]');await p.fill('#bdArmR','100');await p.dispatchEvent('#bdArmR','input');
  ok((await p.textContent('#bdArmTx')).includes('Bent'),dev+': slider bends the arm');
  await p.click('[data-go="ex"]');await p.click('[data-go="pair"]');
  const P=await p.evaluate(()=>[['Digested food'],['Oxygen goes into the blood and is carried'],['Bones and muscles']]);
  for(let i=0;i<3;i++){const ops=await p.$$eval(`[data-pr^="${i}:"]`,a=>a.map(x=>x.textContent));await p.click(`[data-pr="${i}:${ops.findIndex(t=>t.startsWith(P[i][0]))}"]`);}
  s=await S();ok(s.stars===17&&s.body.done.pair&&s.body.done.mus,dev+': muscles +1 ★, systems pairs +1 ★');
  ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),dev+': nothing scrolls sideways');
  await p.click('#bdBack');await p.click('#bdBack');ok(await p.isVisible('#tBody')&&(await p.textContent('#bdNote')).includes('16 / 16'),dev+': back home, tile shows progress');
  await ctx.close();
}
ok(errs.length===0,'no page errors '+JSON.stringify(errs.slice(0,3)));
await b.close();console.log(`${pass} passed, ${fail} failed`);process.exit(fail?1:0);})();
