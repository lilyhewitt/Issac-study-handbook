// English grammar cells: a cell whose last 20 P3 answers (at least 10) are 80% right moves to P4-level questions (S.p4);
// old saves (no S.p4, no level on log entries) open and stay on P3; a cell below 80% or with fewer than 10 answers stays; the round-end
// screen says so; the handbook button "打开下一篇短文" opens english/?go=together straight on the next passage.
const {chromium,devices}=require('playwright');const U='http://localhost:8767/english/',KEY='xiaoxiao-english-v1';let pass=0,fail=0;
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
const A='were · 复数主语',B='was · 单数主语',C='many · a few · 可数',D='Happening now · 进行时';
const ent=(t,n,good)=>Array.from({length:n},(_,i)=>({d:'2026-11-20',ts:1e12+i,c:'gram',t,h:'x'+t+i,ok:i<good?1:0}));
(async()=>{const b=await chromium.launch();const errs=[];
const p=await (await b.newContext({...devices['iPad (gen 7) landscape']})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(U);
const log=[...ent(A,12,12),...ent(B,12,6),...ent(C,5,5),...ent(D,20,16)];
await p.evaluate(([K,log])=>{localStorage.clear();localStorage.setItem(K,JSON.stringify({stars:10,days:{},misses:[],recent:[],by:{},log}));},[KEY,log]);
await p.reload();await p.waitForTimeout(500);
const S=()=>p.evaluate(K=>JSON.parse(localStorage.getItem(K)),KEY);
ok(await p.isVisible('#tGram'),'old save (no S.p4, log entries without a level) opens');
ok(await p.evaluate(()=>QB.P4CELLS.length)>=10,'P4 questions exist for the cells');
await p.click('.tile[data-mode="gram"]');await p.waitForTimeout(100);
let s=await S();
ok(s.p4&&s.p4[A]&&s.p4[D],'12/12 and 16/20 right → those cells move to P4: '+JSON.stringify(s.p4));
ok(!(s.p4&&s.p4[B]),'6/12 right → stays on P3');
ok(!(s.p4&&s.p4[C]),'5/5 right but fewer than 10 answered → stays on P3');
// play rounds; right after the switch, questions of a P4 cell come at level 3, others at levels 1–2
const play=async()=>{let n=0;while(await p.isVisible('#opts')&&n<12){n++;const a=await p.evaluate(()=>__round().qs[__round().i].ans);await p.click('#opt'+a);await p.waitForTimeout(15);if(await p.isVisible('#bNext'))await p.click('#bNext');await p.waitForTimeout(15);}};
await play();
for(let r=0;r<14;r++){if(await p.isVisible('#bAgain'))await p.click('#bAgain');else if(await p.isVisible('#bHome'))await p.click('#bHome');await p.waitForTimeout(40);if(await p.isVisible('.tile[data-mode="gram"]'))await p.click('.tile[data-mode="gram"]');await play();}
s=await S();const nw=s.log.filter(e=>e.ts>1.7e12&&e.c==='gram');
ok(nw.length>40,'played many grammar questions ('+nw.length+')');
const a=nw.filter(e=>e.t===A||e.t===D),bb=nw.filter(e=>e.t===B);
ok(a.length>0&&a.every(e=>e.l===3),'P4 cells only gave level-3 questions ('+a.length+')');
ok(bb.length>0&&bb.every(e=>e.l===1||e.l===2),'a P3 cell kept levels 1–2 ('+bb.length+')');
// a cell reaches 80% during play: the end-of-round screen says so
await p.evaluate(([K,log])=>{const S=JSON.parse(localStorage.getItem(K));S.p4={};S.log=log;localStorage.setItem(K,JSON.stringify(S));},[KEY,[...ent(B,9,9)]]);
await p.reload();await p.waitForTimeout(400);
let said=false;
for(let r=0;r<40&&!said;r++){if(await p.isVisible('.tile[data-mode="gram"]'))await p.click('.tile[data-mode="gram"]');await play();
  if(await p.isVisible('#vDone')){const t=await p.innerText('#dSub');if(t.includes('80%')&&t.includes('P4'))said=true;}
  if(!said){if(await p.isVisible('#bHome'))await p.click('#bHome');await p.waitForTimeout(40);}}
s=await S();ok(!!(s.p4&&s.p4[B]),'was · 单数主语 reached 80% over 10+ answers → P4');
ok(said,'the end-of-round screen tells the child the cell moved to P4');
// every cell has at least 10 different P4 questions; the P4-length passages are 250+ words, three questions each, in their own scrolling box
{const r=await p.evaluate(()=>{const keep=QB.p4;QB.p4={};QB.P4CELLS.forEach(t=>QB.p4[t]=1);const seen={};for(let i=0;i<30000;i++){const q=QB.make('gram',1+(i%2));const a=Array.isArray(q)?q[0]:q;if(a.l===3)(seen[a.t]=seen[a.t]||new Set()).add(a.q);}QB.p4=keep;
  const g=QB.GENS.find(g=>g.t==='P4 reading · 长文阅读'),ch=g.f();return {cells:QB.P4CELLS.map(t=>[t,seen[t]?seen[t].size:0]),words:ch[0].p.split(/\s+/).length,n:ch.length};});
 ok(r.cells.every(c=>c[1]>=10),'every grammar cell has 10+ P4 questions: '+r.cells.map(c=>c[1]).join(','));
 ok(r.words>=250&&r.n===3,'a P4 reading passage has '+r.words+' words and 3 questions');}
// the handbook's button
const q=await (await b.newContext({...devices['iPad (gen 7) landscape']})).newPage();q.on('pageerror',e=>errs.push(e.message));
await q.goto('http://localhost:8767/english/?from=handbook&go=together');await q.waitForTimeout(600);
ok(await q.isVisible('#vRT')&&(await q.textContent('#rtText')).length>50,'english/?go=together opens the next passage');
await q.click('#rtBack').catch(()=>{});await q.waitForTimeout(150);
ok(await q.isVisible('#vHome')||await q.isVisible('#vStats'),'Back from the passage lands on a normal screen');
const q2=await (await b.newContext({...devices['iPad (gen 7) landscape']})).newPage();await q2.goto('http://localhost:8767/english/?from=handbook');await q2.waitForTimeout(400);
ok(await q2.isVisible('#vHome')&&!(await q2.isVisible('#vRT')),'without go=together the app opens on home');
ok(!errs.length,'no page errors '+errs.join(' | '));
console.log(pass,'passed',fail,'failed');await b.close();process.exit(fail?1:0);})();
