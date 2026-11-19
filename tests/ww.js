// 写作工坊 Writing Workshop (English): the big tile, the name lock (wrong name, any capitals), the list of 9 sets,
// a whole set (wrong picture → hint, owners, three sentences with a wrong block, the paper checks), the save, “Hi, <name>!” on home,
// and the key staying on the iPad after a reload. Pictures must decrypt to real images.
const {chromium,devices}=require('playwright');
const NAME=process.env.WW_NAME||'';if(!NAME){console.log('PASS skipped: no WW_NAME (tools/ws/.names)');process.exit(0);}
const CAP=NAME.charAt(0).toUpperCase()+NAME.slice(1).toLowerCase(),MIX=[...NAME].map((c,i)=>i%2?c.toUpperCase():c.toLowerCase()).join('');
const U='http://localhost:8767/english/',KEY='xiaoxiao-english-v1';let pass=0,fail=0;
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
(async()=>{const b=await chromium.launch();const errs=[];
for(const dev of ['iPad (gen 7) landscape','iPhone 13']){
const p=await (await b.newContext({...devices[dev]})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(U);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(500);
const tiles=await p.$$eval('#vHome .tile',x=>x.map(e=>e.dataset.mode).join(','));
ok(tiles.startsWith('ww,'),dev+': Writing Workshop is the first, big tile ('+tiles+')');
ok(await p.isVisible('#tWW .nw'),dev+': NEW on the workshop tile');
await p.click('#tWW');await p.waitForSelector('#wwLock:not([hidden])',{timeout:8000});
ok(await p.isVisible('#wwName'),dev+': the door asks for his English name');
await p.fill('#wwName','Tom');await p.click('#wwOpen');await p.waitForTimeout(2500);
ok((await p.textContent('#wwLockBub')).includes('不是这个名字')&&await p.isVisible('#wwLock'),dev+': a wrong name keeps the door shut');
await p.fill('#wwName',MIX);await p.click('#wwOpen');await p.waitForSelector('#wwHome:not([hidden])',{timeout:15000});
ok((await p.textContent('#wwHi')).includes(CAP),dev+': any capitals open it and he is greeted by name');
ok((await p.$$('[data-wwset]')).length===9,dev+': nine P3 picture sets');
const S=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
ok((await S()).name===CAP,dev+': the name is saved');
await p.click('[data-wwset="1"]');await p.waitForTimeout(800);
const imgs=await p.$$eval('.ww-cell img',x=>x.map(i=>i.naturalWidth));ok(imgs.length===3&&imgs.every(w=>w>200),dev+': the three exam pictures decrypt ('+imgs+')');
// a wrong picture first, twice → the right picture lights up
await p.evaluate(()=>{const W=__ww.WW(),j=W.order[0],k=[1,2,3,4].find(k=>!W.st.phrases[j][1].includes(k));document.querySelector(`[data-wwt="${j}"]`).click();document.querySelector(`[data-wwp="${k}"]`).click();});
ok((await p.textContent('#wwBub')).includes('不在第'),dev+': wrong picture → “not in picture N, look at the picture”');
await p.evaluate(()=>{const W=__ww.WW(),j=W.order[0],k=[1,2,3,4].find(k=>!W.st.phrases[j][1].includes(k));document.querySelector(`[data-wwt="${j}"]`).click();document.querySelector(`[data-wwp="${k}"]`).click();});
ok(await p.isVisible('.ww-cell.hl'),dev+': second miss lights up the right picture');
const placed=await p.evaluate(async()=>{const W=__ww.WW(),st=W.st,w=()=>new Promise(r=>setTimeout(r,20));
  for(const j of W.order){if(j in W.placed)continue;document.querySelector(`[data-wwt="${j}"]`).click();await w();document.querySelector(`[data-wwp="${st.phrases[j][1][0]}"]`).click();await w();
    if(W.own!=null){const bad=st.owners.findIndex((o,k)=>!st.phrases[j][2].includes(k));if(bad>=0&&j===W.order[1]){document.querySelector(`[data-wwo="${bad}"]`).click();await w();}
      if(W.own!=null)document.querySelector(`[data-wwo="${st.phrases[j][2][0]}"]`).click();await w();}}
  return Object.values(W.placed).every(x=>x.o!=null);});
ok(placed&&await p.isVisible('#wwNext1'),dev+': every word placed with its owner, next step offered');
await p.click('#wwNext1');
await p.evaluate(()=>{const W=__ww.WW(),i=W.pool.findIndex(b=>b.bad==='who'),r=[i,W.pool.findIndex(b=>b.r===1),W.pool.findIndex(b=>b.r===2)];r.forEach(x=>document.querySelector(`[data-wwq="${x}"]`).click());});
ok((await p.textContent('#wwBub')).includes('he / she / they'),dev+': There / We block → the pronoun hint');
for(let s=0;s<3;s++){await p.evaluate(()=>{const W=__ww.WW();[0,1,2].forEach(r=>document.querySelector(`[data-wwq="${W.pool.findIndex(b=>b.r===r&&!b.bad)}"]`).click());});
  ok(await p.isVisible('#wwNext2'),dev+': sentence '+(s+1)+' built');await p.click('#wwNext2');}
ok(await p.isDisabled('#wwDone'),dev+': “done” waits for the three checks');
for(const c of await p.$$('.wwc'))await c.click();await p.click('#wwDone');
const s=await S();ok(s.ww&&s.ww.done.p3s2&&s.ww.err.panel===2&&s.ww.err.who===1,dev+': set saved with its mistakes '+JSON.stringify(s.ww&&s.ww.err));
ok(s.log.some(e=>e.t==='写作工坊 · Writing'),dev+': it is in the log');
await p.click('#wwBackList');ok(await p.isVisible('.ww-set.done'),dev+': the list ticks the set');
await p.click('#wwBack');ok((await p.textContent('#vHome .hello'))==='Hi, '+CAP+'!',dev+': home greets him by name');
await p.reload();await p.waitForTimeout(500);await p.click('#tWW');await p.waitForSelector('#wwHome:not([hidden])',{timeout:8000});
ok(await p.isHidden('#wwLock'),dev+': after a reload the iPad remembers the key');
const wide=await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);ok(wide,dev+': nothing scrolls sideways');
}
ok(!errs.length,'no page errors '+errs.join(' | '));
console.log(pass,'passed',fail,'failed');await b.close();process.exit(fail?1:0);})();
