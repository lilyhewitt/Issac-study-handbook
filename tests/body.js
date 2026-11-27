// 人体大发现 Body Explorer (science): an old save opens and shows the small tile; 4 system tabs (+ bones/muscles toggle);
// tapping parts lights them up (16 → +2 ★); food's and air's journey in order (wrong tap explains, finish +1 ★);
// 12-question quiz (tap / choose / letters) gives stars at the end; muscles slider; systems pairs; saved in S.body; works offline; no page errors.
const {chromium,devices}=require('playwright');
const U='http://localhost:8767/science/',KEY='xiaoxiao-science-v1';let pass=0,fail=0;
const tapAt=async(p,k,dx=0,dy=0)=>{const c=await p.evaluate(k=>{const svg=document.querySelector('#bdStage svg');const st=document.querySelector('#bdStage');const r0=st.getBoundingClientRect();if(r0.top<0||r0.bottom>innerHeight)st.scrollIntoView({block:'center'});const [x,y]=__body.BD_PART[k].p;const pt=svg.createSVGPoint();pt.x=x;pt.y=y;const q=pt.matrixTransform(svg.getScreenCTM());return [q.x,q.y];},k);await p.mouse.click(c[0]+dx,c[1]+dy);await p.waitForTimeout(40);};
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
  {const bad=[];for(const [sys,sk] of [['dig'],['res'],['cir'],['ske','ske'],['ske','mus']]){await p.click(`[data-sys="${sys}"]`);if(sk)await p.click(`[data-sk="${sk}"]`);
    const ks=await p.evaluate(([sys,sk])=>Object.keys(__body.BD_PART).filter(k=>__body.BD_PART[k].s===(sys==='ske'?sk:sys)),[sys,sk]);
    for(const k of ks)for(const [dx,dy] of [[0,0]]){await tapAt(p,k,dx,dy);const got=await p.evaluate(()=>__body.BD().part);if(got!==k)bad.push(k+'@'+dx+','+dy+'→'+got);}}
   ok(!bad.length,dev+': every part can be tapped, right on it ('+bad.slice(0,6).join(' ')+')');}
  await p.click('[data-sys="dig"]');await tapAt(p,'stomach');
  ok((await p.textContent('.bd-card h3'))==='Stomach',dev+': tapping the picture opens the card');
  ok(await p.$('#bdStage [data-part="stomach"][filter]'),dev+': the tapped part glows');
  let s=await S();ok(keys.every(k=>s.body.seen[k])&&s.stars===12,dev+': all 16 parts lit → +2 ★');
  await p.click('[data-jr="food"]');await tapAt(p,'small');
  ok((await p.textContent('.bd-fb')).includes('Not yet'),dev+': a part out of order explains why');
  {let n=0;for(const k of ['mouth','gullet','stomach','small','large','rectum'])await tapAt(p,k,(n++%2?12:-12),8);}
  ok(await p.isVisible('.bd-done'),dev+': food journey finishes even when each tap is a finger-width off');
  await p.click('[data-go="ex"]');await p.click('[data-jr="air"]');for(const k of ['nose','wind','lungs'])await tapAt(p,k);
  s=await S();ok(s.stars===14&&s.body.done.food&&s.body.done.air,dev+': both journeys +1 ★ each');
  await p.click('[data-go="ex"]');await p.click('[data-go="quiz"]');
  const QZ=await p.evaluate(()=>__body.BD_QZ);let wrong=true;
  {await tapAt(p,'mouth');await p.click('[data-go="next"]');await tapAt(p,'large');const r=await p.evaluate(()=>__body.BD().qz);ok(r.ans&&!r.right,dev+': in the quiz, tapping right on the large intestine is not counted as the small intestine');await p.click('#bdBack');await p.click('[data-go="quiz"]');}
  for(const q of QZ){if(q.t==='tap')await tapAt(p,q.a);
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
