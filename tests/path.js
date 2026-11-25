// 线段图路线 (math): old save opens; the Bar models tile opens the path with 12 stops (9 P3, 3 P4); a stop opens a lesson of its kind;
// 5 right out of the last 6 marks the stop done and moves on; the home tile shows progress; Back and 图鉴 still work; no sideways scroll.
const {chromium,devices}=require('playwright');const U='http://localhost:8767/math/',KEY='xiaoxiao-math-v1';let pass=0,fail=0;
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
(async()=>{const b=await chromium.launch();const errs=[];
for(const dev of ['iPad (gen 7) landscape','iPhone 13']){
const p=await (await b.newContext({...devices[dev]})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(U);await p.evaluate(K=>{localStorage.clear();localStorage.setItem(K,JSON.stringify({stars:5,days:{},log:[],bar:{n:{0:2},ok:{0:1},cur:0}}));},KEY);await p.reload();await p.waitForTimeout(500);
ok((await p.textContent('#brNote')).includes('0/12'),dev+': old save opens, tile shows the path');
await p.click('#tBar');ok((await p.$$('.pt-st')).length===12&&(await p.$$('.pt-g')).length===2,dev+': 12 stops in two groups');
ok((await p.textContent('#ptGo')).includes('部分和整体'),dev+': suggests the first stop');
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),dev+': no sideways scroll');
await p.click('[data-pt="2"]');await p.waitForTimeout(200);ok(await p.isVisible('#vBar')&&(await p.textContent('#brType')).includes('几倍'),dev+': stop 3 opens a times-as-many lesson');
const r=await p.evaluate(()=>{const P=__path;P.pathGo(0);const m=[];for(const v of [1,0,1,1,1])m.push(P.pathRec(v));return {m,done:!!P.pathSt().done[0],cur:P.cur()};});
ok(!r.done&&r.m[3].includes('对 3'),dev+': 3 right so far → not done yet');
const r2=await p.evaluate(()=>{const P=__path;const s=P.pathRec(1);return {s,done:!!P.pathSt().done[0],cur:P.cur()};});
ok(r2.done&&r2.s.includes('会了')&&r2.cur===1,dev+': 5 of the last 6 right → stop done, next is stop 2');
await p.click('#brQuit');await p.waitForTimeout(200);ok((await p.textContent('#brNote')).includes('1/12')&&(await p.textContent('#brNote')).includes('比多比少'),dev+': home tile shows 1/12 and the next stop');
await p.click('#tBar');ok(await p.isVisible('.pt-st.done')&&(await p.textContent('#ptGo')).includes('比多比少'),dev+': done stop ticked, next suggested');
await p.click('#ptBook');ok(await p.isVisible('#vBarCat'),dev+': 图鉴 still opens');
const s=await p.evaluate(K=>JSON.parse(localStorage.getItem(K)),KEY);ok(s.bar.path&&s.bar.ok[0]===1&&s.stars>=5,dev+': saved in S.bar.path, old bar records kept');}
ok(!errs.length,'no page errors '+errs.join('|'));console.log(pass,'passed',fail,'failed');await b.close();process.exit(fail?1:0);})();
