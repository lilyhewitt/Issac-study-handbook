// 家里实验室 Home Lab (science): an old save opens cleanly and shows the tile; each of the 5 experiments can be done
// through its 4 steps (get ready, guess, do with 4 step pictures and a record table, sort variables + finish the sentence);
// wrong answers turn red and the answer shows on the second try; a measurement that goes the wrong way asks to measure again;
// first finish +3 ★, again +1 ★; saved in S.lab; logged; nothing scrolls sideways; no page errors.
const {chromium,devices}=require('playwright');
const U='http://localhost:8767/science/',KEY='xiaoxiao-science-v1';let pass=0,fail=0;
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
const REC={shadow:{d30:'9',d20:'13',d10:'22'},spoons:{metal:'烫',plastic:'不热',wood:'不热'},stone:{before:'200',after:'260',vol:'60'},
  magnet:{clip:'吸住',pin:'吸住',foil:'没吸住',chop:'没吸住',ruler:'没吸住',band:'没吸住'},air:{airml:'6',waterml:'10'}};
(async()=>{const b=await chromium.launch();const errs=[];
for(const dev of ['iPad (gen 7) landscape','iPhone 13']){
  const p=await (await b.newContext({...devices[dev]})).newPage();p.on('pageerror',e=>errs.push(e.message));
  await p.goto(U);await p.evaluate(K=>{localStorage.clear();localStorage.setItem(K,JSON.stringify({stars:10,days:{},log:[],sets:{},wd:{},sp:{}}));},KEY);await p.reload();await p.waitForTimeout(600);
  const S=()=>p.evaluate(K=>JSON.parse(localStorage.getItem(K)),KEY);
  ok(await p.isVisible('#tLab')&&(await p.textContent('#labNote')).includes('5 个实验'),dev+': old save opens, the Home Lab tile is on the home screen');
  await p.click('#tLab');ok((await p.$$('#labList .lb-ex')).length===5,dev+': 5 experiments in the list');
  ok(await p.evaluate(()=>Object.values(__lab.LABPIC).every(a=>a.length===5&&a.every(s=>s.startsWith('<svg')))),dev+': every experiment has a setup picture and 4 step pictures');
  let stars=10;
  for(let i=0;i<5;i++){const id=await p.evaluate(i=>__lab.LAB[i].id,i);
    await p.click(`[data-lab="${i}"]`);
    ok(await p.isVisible('.lb-pic svg')&&(await p.$$('.lb-need button')).length>=3,dev+' '+id+': step 1 shows the setup picture and the list');
    await p.click('[data-need="0"]');ok(await p.isVisible('[data-need="0"].on'),dev+' '+id+': ticking a thing to get ready');
    await p.click('[data-go="1"]');ok(await p.isDisabled('[data-go="2"]'),dev+' '+id+': must guess before going on');
    await p.click('[data-guess="0"]');await p.click('[data-go="2"]');
    let pics=new Set();for(let k=1;k<=4;k++){await p.click(`.lb-dots [data-pic="${k}"]`);pics.add(await p.innerHTML('.lb-pic'));}
    ok(pics.size===4,dev+' '+id+': 4 different step pictures');
    ok(await p.isDisabled('#labRecGo'),dev+' '+id+': cannot go on before writing everything down');
    for(const [k,v] of Object.entries(REC[id])){if(await p.$(`input[data-rk="${k}"]`))await p.fill(`input[data-rk="${k}"]`,v);else await p.click(`[data-rk="${k}"][data-rv="${v}"]`);}
    ok(!(await p.isDisabled('#labRecGo')),dev+' '+id+': all written down → can go on');
    await p.click('#labRecGo');
    ok(!(await p.isVisible('.lb-tip.warn')),dev+' '+id+': sensible measurements → no “measure again”');
    const L=await p.evaluate(i=>{const x=__lab.LAB[i];return{vars:x.vars?x.vars.map(v=>v[1]):null,n:x.sent.blanks.length};},i);
    // first try: one blank wrong
    if(L.vars)for(let j=0;j<L.vars.length;j++)await p.click(`[data-var="${j}"][data-v="${L.vars[j]}"]`);
    const ans=await p.evaluate(([i,r])=>__lab.LAB[i].sent.blanks.map(bl=>bl.ans(r)),[i,REC[id]]);
    for(let j=0;j<ans.length;j++){await p.click(`[data-bl="${j}"]`);const wrong=await p.evaluate(([i,j,r,a])=>{const bl=__lab.LAB[i].sent.blanks[j];const o=typeof bl.opts==='function'?bl.opts(r):bl.opts;return o.find(x=>x!==a);},[i,j,REC[id],ans[j]]);
      await p.click(`[data-pick="${j===0?wrong:ans[j]}"]`);}
    await p.click('[data-check]');ok(await p.isVisible('.lb-bl.no')&&await p.isVisible('.lb-tip.warn'),dev+' '+id+': a wrong blank turns red');
    await p.click('[data-bl="0"]');await p.click(`[data-pick="${ans[0]}"]`);await p.click('[data-check]');
    ok(await p.isVisible('.lb-done'),dev+' '+id+': right answers → experiment done');
    const s=await S();stars+=3;ok(s.stars===stars&&s.lab.done[id].n===1,dev+' '+id+': +3 ★ the first time, saved');
    await p.click('[data-lab-list]');}
  // redo one: +1
  await p.click('[data-lab="0"]');await p.click('[data-go="1"]');await p.click('[data-guess="0"]');await p.click('[data-go="2"]');
  for(const [k,v] of Object.entries(REC.shadow))await p.fill(`input[data-rk="${k}"]`,v);await p.click('#labRecGo');
  for(const [j,v] of [[0,'c'],[1,'m'],[2,'k'],[3,'k']])await p.click(`[data-var="${j}"][data-v="${v}"]`);await p.click('[data-pick="bigger"]');await p.click('[data-check]');
  let s=await S();ok(s.stars===stars+1&&s.lab.done.shadow.n===2,dev+': doing it again gives +1 ★');
  ok(s.log.filter(e=>e.t==='家里实验室 · Home Lab').length===6,dev+': each finish is in the practice record');
  // a measurement that goes the wrong way asks to measure again; the second wrong try shows the answer
  await p.click('[data-lab-again]');await p.click('[data-go="1"]');await p.click('[data-guess="0"]');await p.click('[data-go="2"]');
  for(const [k,v] of Object.entries({d30:'20',d20:'15',d10:'10'}))await p.fill(`input[data-rk="${k}"]`,v);await p.click('#labRecGo');
  ok(await p.isVisible('.lb-tip.warn')&&(await p.textContent('.lb-tip.warn')).includes('再量一次'),dev+': shadow getting smaller → asked to measure again');
  await p.click('[data-pick="darker"]');await p.click('[data-check]');await p.click('[data-check]');
  ok((await p.textContent('#labMsg')).includes('答案是'),dev+': second wrong try shows the answer');
  await p.click('#labXBack');await p.click('#labBack');await p.waitForTimeout(200);
  ok((await p.textContent('#labNote')).includes('5 / 5'),dev+': the tile shows 5 / 5 done');
  ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),dev+': nothing scrolls sideways');
}
ok(!errs.length,'no page errors '+errs.join(' | '));
console.log(pass,'passed',fail,'failed');await b.close();process.exit(fail?1:0);})();
