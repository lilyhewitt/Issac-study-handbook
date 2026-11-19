// 数学小岛 Math Island: home tiles and tasks, playing a station (4 steps, fading hints, wrong answers), trophies,
// campfire mixed review, treasure chest, challenge, island review task, trophy shelf, no calculation in mixed rounds.
const {chromium,devices}=require('playwright');
const U='http://localhost:8767/math/',KEY='xiaoxiao-math-v1';let pass=0,fail=0;
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
(async()=>{const b=await chromium.launch();const errs=[];
const p=await (await b.newContext({...devices['iPhone 13']})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(U);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(500);
const tiles=await p.$$eval('#vHome .tile',x=>x.map(e=>e.dataset.mode).join(','));
ok(tiles==='isl,bar,redo,p4,me','home tiles: island, bar models, try again, 4A, my stars ('+tiles+')');
ok(await p.isVisible('#tIsl .nw'),'NEW on the island tile');
const tk=await p.$$eval('#tasks .tk',x=>x.map(e=>e.dataset.tk));ok(tk.includes('isl')&&tk.includes('bar')&&tk.length===3&&!tk.includes('words'),'three tasks with the island and bar models, no word cards ('+tk+')');
ok(await p.evaluate(()=>{for(let i=0;i<300;i++)if(QB.pickCat()==='calc')return false;return true;}),'mixed rounds never pick calculation');
const S=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
const st=()=>p.evaluate(()=>{const P=__isl.IP();return P?{k:P.steps[P.sx],good:P.good,ft:P.q.ft,i:P.i,steps:P.steps,tag:P.tag}:null;});
/* answer the current step; wrong=true picks a wrong option first */
const KEEP=[];
async function step(wrong){const s=await st();
  if(s.k==='mk'){let g=0;while(g++<12){const m=await p.evaluate(()=>{const P=__isl.IP();return P&&P.steps[P.sx]==='mk'&&P.mkI<P.mk.length?{id:P.mk[P.mkI][0],dec:P.dec}:null;});if(!m)break;
      if(wrong&&g===1&&m.dec.length){await p.click(`.dg-sp[data-s="${m.dec[0]}"]`);await p.waitForTimeout(80);}
      await p.click(`.dg-sp[data-s="${m.id}"]`);await p.waitForTimeout(120);}await p.waitForTimeout(1800);return s;}
  if(s.k==='fig'){if(wrong){await p.click(`.isl-fig:not([data-f="${s.ft}"]) >> nth=0`);await p.waitForTimeout(80);}await p.click(`.isl-fig[data-f="${s.ft}"]`);await p.waitForTimeout(2400);return s;}
  if(await p.$('.isl-pc')){const seq=await p.evaluate(()=>__isl.IP().bq);for(const t of seq)await p.click(`.isl-pc:not([disabled])[data-t="${t.replace(/"/g,'\\"')}"]`);await p.waitForTimeout(900);return s;}
  if(s.k==='ans'&&s.tag!=='pa'&&(s.steps.includes('mk')||s.steps.includes('plan')))KEEP.push(await p.isVisible('.isl-keep'));
  const vals=await p.$$eval('.isl-o',x=>x.map(e=>e.dataset.v));
  if(wrong){const w=vals.find(v=>v!==s.good);await p.click(`.isl-o[data-v="${w.replace(/"/g,'\\"')}"]`);await p.waitForTimeout(80);}
  await p.click(`.isl-o[data-v="${s.good.replace(/"/g,'\\"')}"]`);await p.waitForTimeout(s.k==='ans'&&s.tag!=='pa'?1700:800);return s;}
async function playAll(wrongAt){const seen=[];let g=0;while(!(await p.isVisible('#islDone'))&&g++<120){const s=await st();if(!s)break;
  if(!seen[s.i])seen[s.i]=s.steps.join('>');await step(wrongAt&&wrongAt(s));}return seen;}
await p.click('#tIsl');await p.waitForTimeout(400);
ok(await p.isVisible('#vIsl'),'island tile opens the map');
const nodes=await p.$$eval('.isl-n',x=>x.length);ok(nodes>=24,'map has all stops ('+nodes+')');
ok(await p.$$eval('.isl-n.lock',x=>x.length)===nodes-2,'only the first station is open (and the lighthouse)');
await p.click('.isl-n.lock >> nth=0',{force:true});ok(await p.isVisible('#vIsl'),'a locked stop does not open');
await p.click('#islGo');await p.waitForTimeout(300);
ok(await p.isVisible('#vIslQ'),'Go opens station 1');
const seen=await playAll(s=>s.i===0&&s.k==='ans'&&s.tag!=='pa');
ok(seen[0]==='ask>plan>fig>mk>ans'&&seen[2]==='ask>fig>mk>ans'&&seen[4]==='ans>ask','hints fade, and step ③ puts the numbers on a drawn picture: '+seen.join(' | '));
ok(seen[1]==='ask>plan>fig>mk>ans','question 2 has the build-the-plan step');
ok(await p.isVisible('#islDone'),'trophy screen at the end');
let s=await S();ok(s.isl.st[0]===2,'one wrong answer out of 5 → 2 stars (silver)');
ok(s.isl.miss.includes('0:0'),'the wrong problem is remembered');
ok(s.stars>=2&&s.tk&&Object.values(s.tk).some(t=>t.isl),'stars added and the island task ticked');
ok(s.isl.sk.ans&&s.isl.sk.ans[0]>=5&&s.isl.sk.fig[0]>=4&&s.isl.sk.mk&&s.isl.sk.mk[0]>=10,'step counts kept ('+JSON.stringify(s.isl.sk)+')');
await p.click('#islAgain');await p.waitForTimeout(300);await playAll();s=await S();
ok(s.isl.st[0]===3,'playing again upgrades to 3 stars');
await p.click('#islNextStop');await p.waitForTimeout(1500);
ok(await p.evaluate(()=>__isl.cur())===1,'the boy walks to station 2');
/* jump ahead: stations 1–3 done → campfire */
await p.evaluate(k=>{const S=JSON.parse(localStorage.getItem(k));S.isl.st={0:3,1:2,2:3};S.isl.miss=['1:3'];localStorage.setItem(k,JSON.stringify(S));},KEY);
await p.reload();await p.waitForTimeout(400);await p.click('#tIsl');await p.waitForTimeout(300);
ok(await p.evaluate(()=>__isl.road()[__isl.cur()].t)==='r','after 3 stations the next stop is the campfire');
await p.click('#islGo');await p.waitForTimeout(300);
const camp=await p.evaluate(()=>__isl.IP().list.map(x=>x.si+':'+x.qi));
ok(camp.length===6&&camp[0]==='1:3'&&camp.every(x=>+x.split(':')[0]<=2),'campfire: 6 problems from stations 1–3, the missed one first ('+camp+')');
const cs=await playAll();ok(/^ask>fig>(mk>)?ans$/.test(cs[0]),'campfire asks him to pick the picture himself ('+cs[0]+')');
s=await S();ok(s.isl.rv[0]>=1,'campfire done');await p.click('#islNextStop');await p.waitForTimeout(1500);
/* chest beside the 2nd campfire */
await p.evaluate(k=>{const S=JSON.parse(localStorage.getItem(k));for(let i=0;i<6;i++)S.isl.st[i]=3;S.isl.rv={0:3,1:3};localStorage.setItem(k,JSON.stringify(S));},KEY);
await p.reload();await p.waitForTimeout(400);await p.click('#tIsl');await p.waitForTimeout(300);
ok(await p.$('.isl-c.ready[data-c="0"]'),'chest 0 is ready after the 2nd campfire');
await p.click('.isl-c[data-c="0"]',{force:true});await p.waitForTimeout(300);
for(let i=0;i<3;i++){const a=await p.evaluate(()=>{const C=__isl.ICP();return C.list[C.i].ans;});await p.click(`[data-cv="${a}"]`);await p.waitForTimeout(900);}
s=await S();ok(s.isl.ch[0]&&s.isl.ch[0].b==='gold','3 right → gold badge');
await p.click('#islNextStop');await p.waitForTimeout(600);ok(await p.$('.isl-c.got[data-c="0"]'),'the chest shows the badge on the map');
/* challenge: no hints, answer only */
await p.evaluate(k=>{const S=JSON.parse(localStorage.getItem(k));for(let i=0;i<9;i++)S.isl.st[i]=3;S.isl.rv={0:3,1:3,2:3};localStorage.setItem(k,JSON.stringify(S));},KEY);
await p.reload();await p.waitForTimeout(400);await p.click('#tIsl');await p.waitForTimeout(300);
ok(await p.evaluate(()=>{const n=__isl.road()[__isl.cur()];return n.t==='s'&&QB.ISLAND[n.i].ch;}),'after P3 the next stop is challenge 1');
await p.click('#islGo');await p.waitForTimeout(300);const ch=await playAll();ok(ch[0]==='ans','challenge: answer only');
s=await S();ok(s.isl.st[9]===3,'challenge done');await p.click('#islNextStop');await p.waitForTimeout(1500);
ok(await p.evaluate(()=>{const n=__isl.road()[__isl.cur()];return QB.ISLAND[n.i].name;})==='猜猜鸡兔','past the lighthouse into P4');
/* home: island review task, trophy shelf */
await p.click('#islBack');await p.waitForTimeout(300);
await p.evaluate(()=>{});await p.reload();await p.waitForTimeout(400);
await p.click('#bStats');await p.waitForTimeout(300);ok(await p.$$eval('#islShelf .isl-cup',x=>x.length)>=10,'trophy shelf in 我的进步');
await p.click('#bMeBack');await p.waitForTimeout(200);
await p.evaluate(k=>{const S=JSON.parse(localStorage.getItem(k));S.isl.miss=['3:1','4:2'];S.misses=[];localStorage.setItem(k,JSON.stringify(S));},KEY);await p.reload();await p.waitForTimeout(400);
ok((await p.innerText('#redoNote')).includes('2'),'错题重练 counts island mistakes');await p.click('#tRedo');await p.waitForTimeout(300);
ok(await p.evaluate(()=>__isl.IP().list.map(x=>x.si+':'+x.qi).join())==='3:1,4:2','错题重练 replays the island mistakes');await playAll();s=await S();ok(s.isl.miss.length===0,'right on the first try → off the mistake list');
ok(KEEP.length>=5&&KEEP.every(x=>x),'step ④ keeps the plan and the labelled picture on screen ('+KEEP.length+' checked)');
console.log('errors',errs);ok(errs.length===0,'no page errors');
console.log(`${pass} passed, ${fail} failed`);await b.close();process.exit(fail?1:0);})().catch(e=>{console.log('Error:',e.message);process.exit(1);});
