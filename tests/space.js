// 太空探险 Space Mission (science): home tiles and tasks, the map, a planet's 4 steps (pattern + direction words, evidence, word blocks, check),
// tier 2 on paper, experiments on paper with “which pattern”, wrong answers → try again, space station review, toolbox, my progress.
const {chromium,devices}=require('playwright');
const U='http://localhost:8767/science/',KEY='xiaoxiao-science-v1';let pass=0,fail=0;
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
const STEP=wrong=>{const Q=__sp.SQ();if(!Q)return'none';if(!document.getElementById('smDone').hidden)return'done';const f=Q.flow[Q.fx];if(!f)return'nof';
  const q=Q.q,p=f.j!=null?q.parts[f.j]:null,c=s=>{const e=document.querySelector(s);if(!e)return'miss '+s;e.click();return f.s;};
  const words=t=>t.split(/\s+/).filter(Boolean),norm=w=>w.toLowerCase().replace(/[^a-z0-9°²³.]/g,'').replace(/\.$/,'');
  const find=(w,ph)=>{const pw=words(ph).map(norm),nw=w.map(norm);for(let i=0;i+pw.length<=nw.length;i++)if(pw.every((x,k)=>nw[i+k]===x))return i;return-1;};
  if(f.s==='mcq'){if(wrong&&!Q.tries)return c(`.sm-o:not([data-o="${q.ans}"])`)+'-wrong';return c(`.sm-o[data-o="${q.ans}"]`);}
  if(f.s==='mc'){if(wrong&&!Q.tries){const b=[...document.querySelectorAll('.sm-o')].find(x=>x.dataset.v!==p.ans);b.click();return'mc-wrong';}return c(`.sm-o[data-v="${p.ans.replace(/"/g,'\\"')}"]`);}
  if(f.s==='one'){const tpl=f.pre?q.pre.tpl:p.tpl,dir=f.pre?q.pre.dir:p.dir,ask=f.pre?q.pre.ask:p.ask;
    if(!Q.tplOk)return c(`.sm-tp[data-t="${tpl}"]`);const w=words(ask);for(let k=0;k<dir.length;k++){if(Q.dirFound.has(k))continue;return c(`.sm-ask [data-w="${find(w,dir[k])}"]`);}return'wait';}
  if(f.s==='ev'){const ev=p.ev;if(ev[0]==='txt'){const w=words(q.q.replace(/\n/g,' \n '));return c(`[data-ev="${find(w,ev[1])}"]`);}return c(`.sm-c[data-r="${ev[1]}"][data-c="${ev[0]==='row'?1:ev[2]}"]`);}
  if(f.s==='tiles'){const sl=[...p.frame.matchAll(/\{([^}]+)\}/g)].map(m=>m[1]),want=sl[Q.fill.length];if(want==null)return'wait';
    if(wrong&&!Q.partBad&&p.extra.length){const b=[...document.querySelectorAll('.sm-chip')].find(x=>!x.disabled&&x.textContent===p.extra[0][0]);if(b){b.click();return'tiles-wrong';}}
    const b=[...document.querySelectorAll('.sm-chip')].find(x=>!x.disabled&&x.textContent===want);if(!b)return'nochip '+want;b.click();return'tiles';}
  if(f.s==='paper')return c('#smWrote');
  if(f.s==='chk'){const n=document.getElementById('smNextPart');if(n){document.querySelectorAll('.sm-ck:not(.on)').forEach(x=>x.click());return c('#smNextPart');}return c(wrong?'[data-rate="1"]':'[data-rate="2"]');}
  if(f.s==='which')return c(`.sm-tp[data-t="${p.tpl}"]`);
  return'unknown '+f.s;};
(async()=>{const b=await chromium.launch();const errs=[];
const p=await (await b.newContext({...devices['iPad (gen 7) landscape']})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(U);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(500);
const tiles=await p.$$eval('#vHome .tile',x=>x.map(e=>e.dataset.mode).join(','));
ok(tiles==='sp,tool,redo,p4,me,lab,cards,life,mat,skill','home tiles: Space Mission first, toolbox, try again, P4, my stars, Home Lab, then the small ones ('+tiles+')');
ok(await p.isVisible('#tSp .nw'),'NEW on the Space Mission tile');
ok((await p.textContent('#smNote')).includes('Living and Non-living Things'),'the big tile names the next planet');
const tk=await p.$$eval('#tasks .tk',x=>x.map(e=>e.dataset.tk));ok(tk[0]==='sp'&&tk[1]==='tool'&&tk.length===3&&!tk.includes('words'),'tasks: next planet, toolbox, one more; no word review ('+tk+')');
const S=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
const flows=[];
async function playAll(wrongAt){let g=0,last='';while(g++<500){const st=await p.evaluate(()=>{const Q=__sp.SQ();if(!Q)return null;return{i:Q.i,fx:Q.fx,flow:Q.flow.map(f=>f.s).join('>'),done:!document.getElementById('smDone').hidden};});
    if(!st||st.done)return true;flows[st.i]=st.flow;
    const r=await p.evaluate(STEP,!!(wrongAt&&wrongAt(st)));if(/^(miss|nochip|unknown|none|nof)/.test(r)){console.log('stuck',r,JSON.stringify(st));return false;}
    await p.waitForTimeout(/mcq|^mc|ev/.test(r)?(r.endsWith('wrong')?250:r==='ev'?3000:2500):r==='tiles-wrong'?150:r==='tiles'||r==='one'?200:r==='which'?1400:r==='chk'?(await p.$('[data-rate]')?2400:300):1300);
    if(r==='tiles'){const st2=await p.evaluate(()=>{const Q=__sp.SQ();return Q&&Q.flow[Q.fx]&&Q.flow[Q.fx].s;});if(st2==='tiles')continue;await p.waitForTimeout(1300);}
    if(r==='one')await p.waitForTimeout(700);}
  return false;}
await p.click('#tSp');await p.waitForTimeout(400);
ok(await p.isVisible('#vSp'),'the tile opens the map');
const nodes=await p.$$eval('.sm-n',x=>x.length);ok(nodes===26,'map: 15 planets, 2 meteor belts, 8 space stations, the wormhole ('+nodes+')');
ok(await p.$$eval('.sm-n.lock',x=>x.length)===nodes-2,'only the first planet is open (and the wormhole)');
await p.click('.sm-n.lock >> nth=0',{force:true});ok(await p.isVisible('#vSp'),'a locked planet does not open');
await p.click('#smGo');await p.waitForTimeout(300);ok(await p.isVisible('#vSpQ'),'Go opens planet 1');
const played=await playAll(st=>st.i===1&&st.flow.includes('tiles'));
ok(played&&await p.isVisible('#smDone'),'medal screen at the end of the planet');
ok(flows[0]==='mc>one>tiles>chk'&&flows[1]==='one>ev>tiles>chk'&&flows[2]==='one>tiles>chk'&&flows[3]==='mcq','hints fade: Q2 gets all four steps, Q1/Q3 skip the evidence ('+flows.slice(0,4).join(' | ')+')');
ok(flows[7]==='paper>chk>which>paper>chk>which>paper>chk>which','the experiment is written on paper, then “which pattern” ('+flows[7]+')');
let s=await S();ok(s.sm.st[0]===2,'one wrong block out of 8 questions → 2 stars ('+s.sm.st[0]+')');
ok(s.sm.miss.includes('living:1'),'the wrong question is remembered ('+s.sm.miss+')');
ok(s.sm.sk.tpl[0]>=4&&s.sm.sk.dir[0]>=6&&s.sm.sk.ev[0]===1&&s.sm.sk.wr[1]<s.sm.sk.wr[0],'step counts kept ('+JSON.stringify(s.sm.sk)+')');
ok(s.sm.tpl[2]&&s.sm.tpl[5]&&s.sm.tpl[9],'pattern counts kept ('+JSON.stringify(s.sm.tpl)+')');
ok(s.stars>=2&&Object.values(s.tk).some(t=>t.sp),'stars added and the planet task ticked');
{const dn=Math.max(0,...Object.values(s.days||{}));ok(dn>=8,'the planet counts for today (days in a row) ('+dn+')');
 const lg=s.log.filter(e=>e.t.startsWith('太空探险'));ok(lg.length===8&&lg.some(e=>!e.ok&&e.q&&e.r),'each question goes into the practice record, the wrong one with its answer');}
/* playing again with 2 stars: tier 2, written on paper */
await p.click('#smAgain');await p.waitForTimeout(400);
const t2=await p.evaluate(()=>{const Q=__sp.SQ();return{tier:Q.tier,title:document.getElementById('smQTitle').textContent};});
ok(t2.tier===2&&t2.title.includes('第 2 层'),'the second time is tier 2 ('+t2.title+')');
await playAll();ok(flows[1]==='one>ev>paper>chk'&&flows[0]==='mc>one>paper>chk','tier 2: the word blocks become writing on paper ('+flows[1]+')');
ok(await p.isVisible('.sm-stars .on >> nth=2'),'all right on paper → 3 stars');s=await S();ok(s.sm.st[0]===3&&!s.sm.miss.includes('living:1'),'3 stars kept; done right again leaves the wrong list');
await p.click('#smNextStop');await p.waitForTimeout(2200);
ok(await p.evaluate(()=>__sp.cur())===1,'next planet: Classification');
ok(await p.isVisible('#vSpQ')&&(await p.textContent('#smQTitle')).includes('Classification'),'“next planet” starts it after the walk');
/* jump ahead: planets 1–2 done → space station */
await p.evaluate(k=>{const S=JSON.parse(localStorage.getItem(k));S.sm.st={0:3,1:2};S.sm.miss=['class:1'];localStorage.setItem(k,JSON.stringify(S));},KEY);
await p.reload();await p.waitForTimeout(500);await p.click('#tSp');await p.waitForTimeout(300);
ok((await p.textContent('#smNext')).includes('Space Station'),'after two planets comes a space station');
await p.click('#smGo');await p.waitForTimeout(300);
const rv=await p.evaluate(()=>{const Q=__sp.SQ();return{kind:Q.kind,n:Q.list.length,first:Q.list[0],tier:Q.tier};});
ok(rv.kind==='r'&&rv.n===6&&rv.first.pi===1&&rv.first.qi===1,'station: 6 questions, the wrong one first ('+JSON.stringify(rv)+')');
await playAll();ok(flows.slice(0,6).every(f=>!f.includes('tiles')&&!f.includes('one')),'station questions are written on paper without the step-by-step help');
s=await S();ok(s.sm.rv[0]>=1&&!s.sm.miss.includes('class:1'),'station done, the wrong one fixed');
/* try again tile takes Space Mission mistakes */
await p.evaluate(k=>{const S=JSON.parse(localStorage.getItem(k));S.sm.miss=['fungi:5','mat:1'];S.misses=[];localStorage.setItem(k,JSON.stringify(S));},KEY);
await p.reload();await p.waitForTimeout(500);
ok((await p.textContent('#redoNote')).includes('2'),'try again counts the planet mistakes');
const tk2=await p.$$eval('#tasks .tk',x=>x.map(e=>e.dataset.tk));ok(tk2.includes('spr'),'a try-again task for the planet mistakes ('+tk2+')');
await p.click('#tRedo');await p.waitForTimeout(300);
const d=await p.evaluate(()=>{const Q=__sp.SQ();return{kind:Q.kind,n:Q.list.length,flow:Q.flow.map(f=>f.s).join('>')};});
ok(d.kind==='d'&&d.n===2&&d.flow==='one>tiles>chk','try again replays them with the word blocks ('+JSON.stringify(d)+')');
await playAll();s=await S();ok(s.sm.miss.length===0,'fixed mistakes leave the list');
await p.click('#smHome');await p.waitForTimeout(300);ok(await p.isVisible('#vHome'),'back home after try again');
/* toolbox */
await p.click('#tTool');await p.waitForTimeout(300);
ok(await p.isVisible('#vTool')&&await p.$$eval('.sm-tcard',x=>x.length)===10,'toolbox shows the 10 patterns');
ok(await p.isVisible('.sm-btn.rec'),'one pattern is recommended');
await p.click('#toolTabs [data-tab="must"]');ok(await p.$$eval('.sm-mcard:not(.lock)',x=>x.length)>=3,'must-know sentences of the planets reached');
await p.click('#toolTabs [data-tab="tpl"]');await p.click('.sm-btn.rec');await p.waitForTimeout(300);
const tb=await p.evaluate(()=>{const Q=__sp.SQ();return{kind:Q.kind,n:Q.list.length,t:Q.n.tpl,all:Q.list.every(x=>QB.SPACE[x.pi].qs[x.qi].parts[x.part].tpl===Q.n.tpl)};});
ok(tb.kind==='t'&&tb.n>=1&&tb.all,'toolbox practice: questions of one pattern only ('+JSON.stringify(tb)+')');
await playAll();await p.click('#smHome');await p.waitForTimeout(300);ok(await p.isVisible('#vTool'),'back to the toolbox');
s=await S();ok(Object.values(s.tk).some(t=>t.tool),'toolbox task ticked');
/* my progress */
await p.click('#toolBack');await p.click('#tMe');await p.waitForTimeout(300);
ok(await p.isVisible('#smShelf .sm-med'),'medals in my progress');
/* a save from v4.32 kept the planets in S.sp: it moves to S.sm */
await p.evaluate(k=>{const S=JSON.parse(localStorage.getItem(k));S.sp={st:{0:3,1:1},rv:{},tpl:{2:[3,2]},sk:{},miss:['class:2']};delete S.sm;localStorage.setItem(k,JSON.stringify(S));},KEY);
await p.reload();await p.waitForTimeout(500);await p.click('#tSp');await p.waitForTimeout(300);
s=await p.evaluate(()=>JSON.parse(JSON.stringify(__sp.S())));ok(s.sm&&s.sm.st[0]===3&&s.sm.st[1]===1&&s.sm.miss[0]==='class:2'&&!(s.sp&&s.sp.st),'a v4.32 save moves its planets over ('+JSON.stringify(s.sm&&s.sm.st)+')');
ok(await p.evaluate(()=>__sp.cur())===2,'and the map continues where he was');
/* phone: map labels and a question fit */
const q=await (await b.newContext({...devices['iPhone 13']})).newPage();q.on('pageerror',e=>errs.push(e.message));
await q.goto(U);await q.waitForTimeout(400);await q.click('#tSp');await q.waitForTimeout(300);
ok(await q.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'phone: the map does not scroll sideways');
await q.click('#smGo');await q.waitForTimeout(300);ok(await q.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'phone: a question does not scroll sideways');
ok(errs.length===0,'no page errors '+JSON.stringify(errs));
console.log(`${pass} passed, ${fail} failed`);await b.close();process.exit(fail?1:0);})();
