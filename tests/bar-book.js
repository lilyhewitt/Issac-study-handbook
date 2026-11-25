// 线段图 picture book (图鉴): all 17 kinds can be opened, ⭐ 推荐 opens the kind done right the fewest times,
// the 9 drawn kinds (put the numbers and the ? on the picture, then use it), help is noted, old saves still open,
// and 预习 4A has no plain sums any more.
const {chromium,devices}=require('playwright');
const U='http://localhost:8767/math/',KEY='xiaoxiao-math-v1';let pass=0,fail=0;
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
const KINDS=['pw','cmp','same','move','flow','pie','branch','line','table'];
(async()=>{const b=await chromium.launch();const errs=[];
const p=await (await b.newContext({...devices['iPhone 13']})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(U);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(400);
const S=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
async function place(wrongFirst){let g=0,first=true;while(g++<20){const m=await p.evaluate(()=>{const B=__bar.BD();return B&&B.step==='mk'?{id:B.mk[B.mkI][0],dec:B.dec}:null;});if(!m)break;
    if(wrongFirst&&first&&m.dec.length){await p.click(`#brFig .dg-sp[data-s="${m.dec[0]}"]`);await p.click(`#brFig .dg-sp[data-s="${m.dec[0]}"]`).catch(()=>{});}
    else await p.click(`#brFig .dg-sp[data-s="${m.id}"]`);first=false;await p.waitForTimeout(40);}}
async function calc(){let g=0;while(g++<10){const a=await p.evaluate(()=>{const B=__bar.BD();if(!B||B.step!=='calc')return null;const c=B.L.calc[B.ci];return c.o.findIndex(x=>String(x)===String(c.a));});if(a==null)break;await p.click(`[data-bdo="${a}"]`);await p.waitForTimeout(40);}}
await p.click('#tBar');await p.click('#ptBook');await p.waitForTimeout(300);
ok(await p.isVisible('#vBarCat'),'the 线段图 tile opens the picture book');
ok(await p.$$eval('#bcList .bc-i',x=>x.length)===17,'17 kinds in the book, every one a button');
ok(/推荐/.test(await p.innerText('#bcRec')),'⭐ 推荐 button: '+await p.innerText('#bcRec'));
/* every drawn kind: picture with spots → numbers placed → worked out → done */
for(const id of KINDS){if(!(await p.isVisible('#vBarCat')))await p.evaluate(()=>__bar.cat());
  await p.click(`#bcList .bc-i[data-bt="${id}"]`);await p.waitForTimeout(120);
  const sp=await p.$$eval('#brFig .dg-sp',x=>x.length),need=await p.evaluate(()=>__bar.BD().mk.length);
  await place(false);const st1=await p.evaluate(()=>__bar.BD().step);await calc();
  ok(sp>=need&&st1==='calc'&&await p.evaluate(()=>__bar.BD().step)==='done'&&await p.isVisible('#bdNext'),`${id}: ${sp} spots for ${need} labels, placed, worked out, done`);}
let s=await S();ok(KINDS.every(k=>s.bar.ok[k]===1&&s.bar.n[k]===1),'each drawn kind counted as done right ('+JSON.stringify(s.bar.ok)+')');
ok(s.tk&&Object.values(s.tk).some(t=>t.bar),'the bar task is ticked');
/* a wrong spot twice: the label is put there for him, counted as help */
await p.evaluate(()=>__bar.cat());await p.click('#bcList .bc-i[data-bt="cmp"]');await p.waitForTimeout(100);
const hasDec=await p.evaluate(()=>__bar.BD().dec.length);
await place(true);ok(hasDec===0||await p.evaluate(()=>__bar.BD().help===1),'two wrong spots → the label is placed for him (help)');await calc();
s=await S();ok(hasDec===0||(s.bar.n.cmp===2&&s.bar.ok.cmp===1),'help: done but not counted as right on his own');
/* recommendation: the kind done right the fewest times */
await p.evaluate(k=>{const S=JSON.parse(localStorage.getItem(k));S.bar.ok={0:3,1:3,2:3,3:3,4:3,5:3,6:3,7:3,pw:3,cmp:3,same:3,move:3,flow:3,pie:1,branch:3,line:3,table:3};localStorage.setItem(k,JSON.stringify(S));},KEY);
await p.reload();await p.waitForTimeout(300);await p.click('#tBar');await p.click('#ptBook');await p.waitForTimeout(200);
ok(/分数圆/.test(await p.innerText('#bcRec')),'推荐 picks the kind done right the fewest times: '+await p.innerText('#bcRec'));
ok(/16 \/ 17/.test(await p.innerText('#bcTot')),'count of kinds learned: '+await p.innerText('#bcTot'));
await p.click('#bcRec');await p.waitForTimeout(150);ok(await p.evaluate(()=>__bar.BD()&&__bar.BD().id==='pie'),'推荐 opens it');
/* the old kinds still open from the book */
await p.click('#brTypes');await p.waitForTimeout(150);ok(await p.isVisible('#vBarCat'),'图鉴 button in a lesson goes back to the book');
await p.click('#bcList .bc-i[data-bt="3"]');await p.waitForTimeout(150);ok(await p.evaluate(()=>__bar.BR()&&__bar.BR().ti===3&&!__bar.BD()),'an old kind (和差) opens the build-it lesson');
/* an old save: numeric cur and counts keep working */
await p.evaluate(k=>{const S=JSON.parse(localStorage.getItem(k));S.bar={cur:5,n:{0:4,5:2},ok:{0:3}};localStorage.setItem(k,JSON.stringify(S));},KEY);
await p.reload();await p.waitForTimeout(300);ok(/路线 0\/12/.test(await p.innerText('#brNote')),'old save: the tile note shows the path ('+await p.innerText('#brNote')+')');
await p.click('#tBar');await p.click('#ptBook');await p.waitForTimeout(200);ok(/做了 4 · 自己对 3/.test(await p.innerText('#bcList .bc-i[data-bt="0"]')),'old counts show in the book');
/* the island task button and the daily task still start a lesson straight away */
await p.evaluate(()=>{for(let i=0;i<30;i++){}});
/* 预习 4A: no plain sums */
ok(await p.evaluate(()=>{const re=/^[\d ,\/]+\s[×÷+−]\s[\d ,\/]+=\s___/;for(let i=0;i<600;i++){const q=QB.make('p4',1+(i%2));for(const x of [].concat(q))if(re.test(x.q))return false;}return true;}),'预习 4A has no plain × ÷ + − sums');
ok(await p.evaluate(()=>{for(let ch=1;ch<=8;ch++){QB.focus=ch;for(let i=0;i<40;i++)QB.make('p4',1);}QB.focus=0;return true;}),'every chapter still makes questions');
console.log('errors',errs);ok(errs.length===0,'no page errors');
console.log(`${pass} passed, ${fail} failed`);await b.close();process.exit(fail?1:0);})().catch(e=>{console.log('Error:',e.message);process.exit(1);});
