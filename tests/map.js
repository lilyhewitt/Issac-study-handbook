/* English word map: old saves land on the map, a set is played as a level, reviews requeue misses,
   chests give badges, the daily word review replaces the old tasks, and back buttons return to the map. */
const {chromium,devices}=require('playwright');const H='http://localhost:8767';
let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({...devices['iPad (gen 7) landscape'],deviceScaleFactor:1})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
const S=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('xiaoxiao-english-v1')));
await p.goto(H+'/english/');await p.waitForTimeout(300);
await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('xiaoxiao-english-v1')||'{}');S.wd={};S.sets={};S.stars=40;
  QB.WORDSETS.slice(0,5).forEach((s,i)=>{S.sets[s.title]='2026-11-0'+(i+1);s.words.forEach(w=>S.wd[w[0]]={box:i%4,due:'2026-11-20',n:2,bad:i%2});});localStorage.setItem('xiaoxiao-english-v1',JSON.stringify(S));});
await p.reload();await p.waitForTimeout(300);
const tasks=await p.innerText('#tasks');ok(tasks.includes('复习单词')&&!tasks.includes('拼一拼')&&!tasks.includes('复习今天的词'),'tasks: one word review, no spell-it, no old word task: '+tasks.replace(/\n/g,' '));
await p.click('#tCards');await p.waitForTimeout(300);ok(await p.isVisible('#vMap'),'word cards tile opens the map');
let st=await S();ok(Object.keys(st.map.w.lv).length===5&&st.map.w.rv[0]===0,'old save: 5 learned sets walked, first review counted');
const n=await p.$$eval('.mn',a=>a.map(e=>e.classList.contains('lock')));ok(n.filter(x=>!x).length===7,'7 stops open (5 sets + 1 review + the next one)');
/* play the next level */
const cur=await p.$$eval('.mn',a=>a.findIndex(e=>e.querySelector('.mn-pulse')));
await p.click(`.mn[data-i="${cur}"]`,{force:true});ok(await p.isVisible('#vCard'),'tap the glowing stop: the word cards');
await p.click('#bCardQuit');ok(await p.isVisible('#vMap'),'back from the cards returns to the map');
await p.click(`.mn[data-i="${cur}"]`,{force:true});for(let i=0;i<5;i++)await p.click('#cNext');
const answer=async(right)=>{let k=0;while(k<30){k++;
  if(await p.isVisible('#spPlay')&&await p.isVisible('#vSpell')){const n2=(await p.$$('#spSlots .sp-slot')).length;for(let j=0;j<n2;j++)await p.click('#spTiles [data-tile="'+j+'"]');
    if(await p.isVisible('#spCopy')){const w=(await p.innerText('#spModel')).trim();await p.click('#spCopy');for(const c of w){const ts=await p.$$('#spTiles .sp-tile:not(.used)');for(const t of ts){if((await t.innerText()).trim()===c){await t.click();break;}}}}
    await p.click('#spNext');await p.waitForTimeout(30);continue;}
  if(await p.isVisible('#opts')){const i=right?await p.evaluate(()=>__map.R().qs[__map.R().i].ans):await p.evaluate(()=>(__map.R().qs[__map.R().i].ans+1)%__map.R().qs[__map.R().i].opts.length);
    await p.click('#opt'+i);if(await p.isVisible('#bNext'))await p.click('#bNext');await p.waitForTimeout(20);continue;}break;}return k;};
ok(await p.evaluate(()=>__map.R()&&__map.R().mode==='mlv:5'&&__map.R().qs.length===8),'level round: 8 questions');
const kinds=await p.evaluate(()=>__map.R().qs.map(q=>q.sp?'F':q.say?'B':q.t));ok(kinds.includes('F')&&kinds.includes('B'),'level has listening and spelling: '+kinds.join(','));
await answer(true);ok(await p.isVisible('#mRes')&&(await p.$$('#mRes .mr-s.on')).length>=1,'result over the map with stars: '+(await p.innerText('#mRes')).replace(/\n/g,' '));
st=await S();ok(st.map.w.lv[st.map.w&&Object.keys(st.map.w.lv)[5]]!=null&&!!st.sets['Describing things'],'level saved (map + word sets)');
await p.click('#mrGo');await p.waitForTimeout(1500);
const walker=await p.$eval('.walker',e=>e.style.transform);ok(/translate/.test(walker),'the boy walks to the next stop');
/* review station: wrong answers come back */
const rv=await p.$$eval('.mn',a=>a.findIndex(e=>e.querySelector('.mn-pulse')));
await p.click(`.mn[data-i="${rv}"]`,{force:true});ok(await p.evaluate(()=>__map.R().mode.startsWith('mrv:w:')&&__map.R().qs.length===10),'review station: 10 questions from the 3 sets before it');
const set3=await p.evaluate(()=>{const r=+__map.R().mode.split(':')[2];return __map.R().qs.every(q=>{const w=__map.WL().find(x=>x.w===(q.wd||(q.sp&&q.sp.w)));return w&&Math.floor(w.set/3)===r;});});ok(set3,'all review words come from those 3 sets');
await p.evaluate(()=>{});let first=true;
/* answer the first one wrong, the rest right */
{const i=await p.evaluate(()=>__map.R().qs[__map.R().i].sp?-1:(__map.R().qs[__map.R().i].ans+1)%__map.R().qs[__map.R().i].opts.length);if(i>=0){await p.click('#opt'+i);await p.click('#bNext');}}
ok(await p.evaluate(()=>__map.R().qs.length>=10&&__map.R().qs.some(q=>q.again)||__map.R().qs[0].sp),'a missed word is asked again at the end');
await answer(true);ok(await p.isVisible('#mRes'),'review result');await p.click('#mrGo');await p.waitForTimeout(1300);
st=await S();ok(st.map.w.rv[1]!=null,'review saved');
/* chest beside review 1 */
const ch=await p.$('.mc.ready');ok(!!ch,'the chest beside the 2nd review is ready');
await p.click('.mc.ready',{force:true});ok(await p.evaluate(()=>__map.R().mode==='mch:w:0'&&__map.R().qs.length===10&&__map.R().qs.every(q=>q.t.startsWith('In a sentence'))),'chest: 10 new-sentence questions');
const sameCard=await p.evaluate(()=>__map.R().qs.some(q=>{const w=__map.WL().find(x=>x.w===q.wd);return w&&q.q.includes(w.ex.replace(/\*\*(.+?)\*\*/,'___'));}));ok(!sameCard,'chest sentences are not the card sentences');
await answer(true);await p.waitForTimeout(900);ok(await p.isVisible('.ch-st.open'),'chest opens with the animation');
st=await S();ok(st.badges.length===1&&st.badges[0].g===true&&st.map.w.ch[0]==='g','gold badge saved');
await p.click('#mrGo');await p.click('#mBack');
/* daily word review */
await p.click('[data-tk="mrw"]');ok(await p.evaluate(()=>__map.R().mode==='mrw'&&__map.R().qs.length===10),'daily word review: 10 questions');
const fsp=await p.evaluate(()=>__map.R().qs.filter(q=>q.sp).length);ok(fsp<=2,'at most 2 spelling in the daily review');
await answer(true);st=await S();ok(Object.values(st.tk).some(t=>t.mrw),'daily task ticked');await p.click('#bHome');
/* badges in 我的进步, phrases map */
await p.click('#bStats');ok((await p.innerText('#stBadges')).includes('1/12'),'badge wall in 我的进步');await p.click('#bMeBack');
await p.click('#tPP');ok(await p.isVisible('#vMap')&&await p.evaluate(()=>__map.MAP.k==='p'),'phrases tile opens the phrases map');
const pcur=await p.$$eval('.mn',a=>a.findIndex(e=>e.querySelector('.mn-pulse')));await p.click(`.mn[data-i="${pcur}"]`,{force:true});ok(await p.isVisible('#vPPCard'),'phrase stop opens the phrase cards');
await p.click('#ppcQuit');ok(await p.isVisible('#vMap'),'back from phrase cards returns to the map');
/* quit in the middle returns to the map */
await p.click(`.mn[data-i="${pcur}"]`,{force:true});for(let i=0;i<5;i++)await p.click('#ppcNext');ok(await p.isVisible('#vQuiz'),'phrase level round');
await p.click('#bQuit');ok(await p.isVisible('#vMap'),'quit a level: back to the map');
ok(!errs.length,'no page errors '+errs.join(' | '));
console.log(`\n${pass} passed, ${fail} failed`);await b.close();process.exit(fail?1:0);})();
