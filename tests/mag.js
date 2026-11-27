// 磁铁实验室 Magnet Lab (science): opened from 磁铁星 / 电磁铁星 as step ①; ① bars X/Y/Z by dragging the magnet (both poles before the question),
// ② sort 8 textbook objects, ③ poles + hanging magnet, ④ stroke 12 times in one direction + electromagnet one change at a time, ⑤ everyday uses + separator.
// Each experiment +1 ★ the first time, logged; the planet step is ticked; works on iPad and phone; no page errors.
const {chromium,devices}=require('playwright');const U='http://localhost:8767/science/',KEY='xiaoxiao-science-v1';let pass=0,fail=0;
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
const shots=process.env.SHOTS;
(async()=>{const b=await chromium.launch();const errs=[];
for(const dev of ['iPad (gen 7) landscape','iPhone 13']){
 const p=await (await b.newContext({...devices[dev]})).newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto(U);await p.evaluate(K=>{localStorage.clear();localStorage.setItem(K,JSON.stringify({stars:5,days:{},log:[]}));},KEY);await p.reload();await p.waitForTimeout(600);
 const S=()=>p.evaluate(K=>JSON.parse(localStorage.getItem(K)),KEY);
 const st=()=>p.evaluate(()=>{const M=__mag.MG();return M&&M.steps[M.si]?M.steps[M.si].d:'end';});
 const answerQ=async()=>{const i=await p.evaluate(()=>__mag.MG().st.opts.findIndex(o=>o.ok));await p.click(`[data-mgo="${i}"]`);await p.click('[data-mg="next"]');};
 const svgPt=(x,y)=>p.evaluate(([x,y])=>{const s=document.getElementById('mgSvg'),pt=s.createSVGPoint();pt.x=x;pt.y=y;const q=pt.matrixTransform(s.getScreenCTM());return [q.x,q.y];},[x,y]);
 await p.evaluate(()=>{document.getElementById('mgStage').scrollIntoView({block:'center'});});
 await p.evaluate(()=>__pl.plOpen(__pl.idx('mag')));
 ok(await p.$$eval('.pl-step',x=>x.map(b=>b.dataset.pl).join(','))==='act,go,mc',dev+': 磁铁星 has act, go, mc');
 await p.click('[data-pl="act"]');await p.waitForTimeout(200);ok(await p.isVisible('#vMag'),dev+': magnet lab opens');
 if(shots&&dev.startsWith('iPad'))await p.screenshot({path:shots+'/m1.png'});
 // ① three bars
 for(let k=0;k<3;k++){
   ok(await st()==='bar',dev+': bar '+k);
   const drag=async()=>{await p.evaluate(()=>document.getElementById('mgStage').scrollIntoView({block:'center'}));const [x,y]=await svgPt(115,182);await p.mouse.move(x,y);await p.mouse.down();const [x2]=await svgPt(260,182);for(let j=1;j<=8;j++)await p.mouse.move(x+(x2-x)*j/8,y);await p.mouse.up();await p.waitForTimeout(1300);};
   await drag();ok(await st()==='bar',dev+': one pole is not enough');
   await p.click('[data-mg="flip"]');await drag();await p.waitForTimeout(400);
   if(shots&&dev.startsWith('iPad')&&k===0)await p.screenshot({path:shots+'/m2.png'});
   ok(await st()==='q',dev+': both poles tried → question');
   if(k===1){const i=await p.evaluate(()=>__mag.MG().st.opts.findIndex(o=>/a magnet 磁铁/.test(o.t)&&!o.ok));await p.click(`[data-mgo="${i}"]`);ok(await p.isVisible('.mg-fb.bad'),dev+': wrong answer explains');await p.click('[data-mg="next"]');}
   else await answerQ();}
 ok(await p.isVisible('[data-mg="nextexp"]'),dev+': 磁铁侦探 done');await p.click('[data-mg="nextexp"]');
 // ② sort
 for(let i=0;i<8;i++){await p.evaluate(i=>document.querySelector(`[data-mgobj="${i}"]`).dispatchEvent(new MouseEvent('click',{bubbles:true})),i);await p.waitForTimeout(1250);}
 await p.waitForTimeout(500);ok(await st()==='q',dev+': all 8 sorted → who is right');await answerQ();
 await p.click('[data-mg="nextexp"]');
 // ③
 await p.click('[data-mg="dip"]');await p.click('[data-mg="next"]');await answerQ();
 await p.click('[data-mg="spin"]');await p.waitForTimeout(2400);await p.click('[data-mg="next"]');await answerQ();
 ok(await p.isVisible('[data-mg="back"]'),dev+': 磁铁星 lab done');
 let s=await S();ok(s.stars===8&&s.mag.done.a&&s.mag.done.b&&s.mag.done.c,dev+': 3 experiments +3 ★');
 await p.click('[data-mg="back"]');ok(await p.isVisible('#vPl')&&!!(await p.$('.pl-step.ok[data-pl="act"]')),dev+': back on 磁铁星, step ticked');
 // ④ ⑤ on 电磁铁星
 await p.evaluate(()=>__pl.plOpen(__pl.idx('emag')));await p.click('[data-pl="act"]');
 const stroke=async(back)=>{await p.evaluate(()=>document.getElementById('mgStage').scrollIntoView({block:'center'}));const [x,y]=await svgPt(110,110);const [x2]=await svgPt(380,110);await p.mouse.move(x,y);await p.mouse.down();
   if(back){for(let j=1;j<=6;j++)await p.mouse.move(x+(x2-x)*j/12,y);for(let j=6;j>=1;j--)await p.mouse.move(x+(x2-x)*j/12-40,y);}
   for(let j=1;j<=10;j++)await p.mouse.move(x+(x2-x)*j/10,y);await p.mouse.up();await p.waitForTimeout(350);};
 await stroke(true);ok((await p.textContent('#mgLog')).includes('同一个方向'),dev+': rubbing back and forth warns');
 for(let i=0;i<6;i++)await stroke();await p.click('[data-mg="test"]');ok((await p.textContent('#mgLog')).includes('2'),dev+': 6 strokes → 2 clips');await p.click('[data-mg="next"]');
 for(let i=0;i<6;i++)await stroke();await p.click('[data-mg="test"]');ok((await p.textContent('#mgLog')).includes('4'),dev+': 12 strokes → 4 clips');await p.click('[data-mg="next"]');await answerQ();
 for(let k=0;k<3;k++){await p.click('[data-mg="em"]');await p.click('#mgLog [data-mg="next"]');}
 if(shots&&dev.startsWith('iPad'))await p.screenshot({path:shots+'/m3.png'});
 await answerQ();for(let k=0;k<2;k++){await p.click('[data-mg="em"]');await p.click('#mgLog [data-mg="next"]');}await answerQ();
 ok(await p.isVisible('[data-mg="nextexp"]'),dev+': 做磁铁 done');await p.click('[data-mg="nextexp"]');
 for(let k=0;k<3;k++)await answerQ();await p.click('[data-mg="sep"]');await p.waitForTimeout(2900);await p.click('[data-mg="next"]');await answerQ();
 s=await S();ok(s.stars===10&&s.mag.done.d&&s.mag.done.e&&s.log.filter(l=>/Magnet Lab/.test(l.t)).length===5,dev+': all 5 experiments, +5 ★, logged');
 ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),dev+': nothing scrolls sideways');
}
ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));
await b.close();console.log(`${pass} passed, ${fail} failed`);process.exit(fail?1:0);})();
