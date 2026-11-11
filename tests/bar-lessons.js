const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const out=[];const errs=[];const ok=(c,m)=>out.push((c?'PASS ':'FAIL ')+m);
const p=await (await b.newContext({...devices['iPad (gen 7)'],deviceScaleFactor:1})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8767/math/');await p.waitForTimeout(300);
ok(await p.isVisible('#tBar'),'home has the 画线段图 tile: '+(await p.innerText('#tBar')).replace(/\n/g,' '));
ok((await p.innerText('#tasks')).includes('画一题线段图'),'today\'s tasks include 画一题线段图');
const txt=s=>p.innerText(s);const msg=()=>txt('#brMsg');
const ev=q=>{const m=q.match(/=\s*([\d\s×÷+−-]+)=\s*\?/)||q.match(/[:：]\s*([\d\s×÷+−-]+)=\s*\?/);if(!m)return null;try{return String(eval(m[1].replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-')));}catch(e){return null;}};
async function solve(ti,right,shot){if(!(await p.isVisible('#vBar')))await p.click('#tBar');await p.click('#brTypes');await p.click(`[data-bt="${ti}"]`);await p.waitForTimeout(80);
  const P=(await txt('#brP')).replace(/\n/g,' ');const nm=(P.match(/^(.+?) (?:has|and|had) /)||[0,''])[1];
  if(await p.isVisible('#brDone')){
    if(right){const k=/twice/.test(P)?2:+(P.match(/(\d) times/)||[0,1])[1];
      if(ti<=2)for(let i=1;i<k;i++)await p.click('[data-bu="0"][data-d="1"]');
      if(ti===3)await p.click('[data-bx="0"]');
      if(ti===4){await p.click('[data-bx="0"]');await p.click('[data-bx="2"]');await p.click('[data-bx="2"]');}
      if(shot)await p.screenshot({path:'bar-build.png'});
      await p.click('#brDone');ok(/画对了/.test(await msg()),ti+': built right → '+await msg());}
    else{await p.click('#brDone');const m1=await msg();await p.click('#brDone');ok(/应该这样画/.test(await msg()),ti+': two wrong builds → shown how: '+m1.slice(0,40));}}
  const wantMark=(i,v)=>{if(ti===0)return 'row:1';if(ti===1)return 'row:0';if(ti===2)return 'diff';if(ti===3||ti===4)return 'all';return i===0?'x:0':'row:0';};
  const wantAsk=()=>{if(/altogether\?/.test(P))return 'all';if(ti===4)return /Rope A\?/.test(P)?'row:0':'row:1';if(ti===5)return 'unit:0';
    const who=(P.match(/does (.+?) have\?/)||[])[1];if(ti===0)return 'row:0';if(ti===1)return 'row:1';return who===nm?'row:0':'row:1';};
  let i=0;while(await p.isVisible('button[data-br]')){const askStep=(await txt('.br-p')).includes('问号');const w=askStep?wantAsk():wantMark(i);
    if(right)await p.click(`button[data-br="${w}"]`);else{const ids=await p.$$eval('button[data-br]:not([disabled])',a=>a.map(x=>x.dataset.br));const wr=ids.filter(x=>x!==w);await p.click(`button[data-br="${wr[0]}"]`);await p.waitForTimeout(50);if(await p.isVisible(`button[data-br="${wr[1]||wr[0]}"]:not([disabled])`))await p.click(`button[data-br="${wr[1]||wr[0]}"]`);}
    if(!askStep)i++;await p.waitForTimeout(60);if(i>4)break;}
  let n=0;while(await p.isVisible('[data-bo]')&&n<12){n++;const q=await txt('.br-p');const opts=await p.$$eval('[data-bo]:not([disabled])',a=>a.map(x=>[x.dataset.bo,x.textContent]));
    let pickI=null;if(right){const e=ev(q);const hit=e&&opts.find(o=>o[1]===e);if(hit)pickI=hit[0];}
    if(pickI==null)pickI=opts[0][0];await p.click(`[data-bo="${pickI}"]`);await p.waitForTimeout(40);}
  const done=await p.isVisible('#brNext');const fig=await p.$eval('#brFig svg',s=>s.querySelectorAll('text.br-l').length);
  if(shot)await p.screenshot({path:'bar-done-'+ti+'.png'});
  return {done,fig,m:await msg()};}
for(let ti=0;ti<6;ti++){const r=await solve(ti,true,[2,3,4,5].includes(ti));ok(r.done&&r.fig>=2,`type ${ti}: finished, ${r.fig} labels on the model — ${r.m}`);}
const S1=await p.evaluate(()=>JSON.parse(localStorage.getItem('xiaoxiao-math-v1')));
ok(Object.values(S1.bar.n).reduce((a,b)=>a+b,0)===6,'6 lessons counted '+JSON.stringify(S1.bar));
const bl=S1.log.filter(e=>e.t==='Bar models · 画线段图');ok(bl.length===6,'6 lessons in the record; done without help: '+bl.filter(e=>e.ok).length);
for(let ti=0;ti<6;ti++){const r=await solve(ti,false,false);ok(r.done,`type ${ti} all wrong: still finishes with help — ${r.m}`);}
const S2=await p.evaluate(()=>JSON.parse(localStorage.getItem('xiaoxiao-math-v1')));const bl2=S2.log.filter(e=>e.t==='Bar models · 画线段图');
ok(bl2.slice(6).every(e=>e.ok===0&&e.q),'help lessons recorded as needing help, with the problem text');
await p.click('#brHome');await p.waitForTimeout(150);ok((await txt('#tasks')).includes('✓')&&/画一题线段图/.test(await txt('#tasks')),'back home; task ticked');
ok(S2.bar.cur>=0,'next type: '+(await txt('#brNote')));
/* the daily round now has the four exam types */
const seen=new Set();for(let r=0;r<12;r++){await p.click('#tMix');for(let k=0;k<12;k++){if(!await p.isVisible('#opts'))break;await p.click('#opts button >> nth=0');await p.waitForTimeout(30);if(await p.isVisible('#bNext'))await p.click('#bNext');await p.waitForTimeout(30);}if(await p.isVisible('#bHome'))await p.click('#bHome');else if(await p.isVisible('#bQuit'))await p.click('#bQuit');}
const S3=await p.evaluate(()=>JSON.parse(localStorage.getItem('xiaoxiao-math-v1')));S3.log.forEach(e=>seen.add(e.t));
ok(['几倍和相差','知道大的','三个量','前后变化'].filter(k=>[...seen].some(t=>t.includes(k))).length>=3,'mixed rounds include the exam types: '+[...seen].filter(t=>/几倍和相差|知道大的|三个量|前后变化/.test(t)).join(' / '));
console.log(out.join('\n'));console.log('errors',errs);await b.close();})();
