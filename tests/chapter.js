const {chromium,devices}=require('playwright');const H='http://localhost:8767';
const dump=async()=>JSON.parse(await (await fetch('http://localhost:8766/__dump')).text());
const out=[];const errs=[];const ok=(c,m)=>out.push((c?'PASS ':'FAIL ')+m);
async function newCtx(b,dev){const ctx=await b.newContext({...devices[dev],deviceScaleFactor:1});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(dev+': '+e.message));return p;}
async function round(p,tile){await p.click(tile);let n=0;while(await p.isVisible('#opts')&&n<14){n++;await p.click('#opts button >> nth=0');await p.waitForTimeout(40);if(await p.isVisible('#bNext'))await p.click('#bNext');await p.waitForTimeout(40);}if(await p.isVisible('#bHome'))await p.click('#bHome');await p.waitForTimeout(100);}
const chOn=p=>p.$eval('.chpick [aria-pressed="true"]',e=>e.textContent).catch(()=>'(none)');
(async()=>{const b=await chromium.launch();await fetch('http://localhost:8766/__reset');
 const mom=await newCtx(b,'iPhone 13');await mom.goto(H+'/#practice');await mom.waitForTimeout(300);
 await mom.click('[data-s="new"]');await mom.waitForTimeout(400);const code=(await mom.innerText('#syncBox summary')).replace(/[^A-Z0-9]/g,'').slice(-8);
 ok(!(await mom.isVisible('.chpick button')),'no chapter buttons before the iPad has sent math records: '+(await mom.innerText('.chpick').catch(()=>'')).replace(/\n/g,' '));
 const pad=await newCtx(b,'iPad (gen 7)');await pad.goto(H+'/math/');await pad.waitForTimeout(300);
 await pad.click('#bStats');await pad.click('#bParent');await pad.waitForTimeout(200);await pad.fill('#syncIn',code);await pad.click('[data-sync="go"]');await pad.waitForTimeout(700);
 await pad.click('#bStatsBack');if(await pad.isVisible('#bMeBack'))await pad.click('#bMeBack');await round(pad,'#tMix');await pad.waitForTimeout(2000);
 let d=await dump();ok(!!(d.sync&&d.sync[code]&&d.sync[code].math&&d.sync[code].math.v),'iPad sent math records');
 await mom.reload();await mom.waitForTimeout(500);ok(await mom.isVisible('.chpick'),'handbook shows the chapter picker');out.push('   selected: '+await chOn(mom));
 await mom.click('.chpick [data-ch="3"]');await mom.waitForTimeout(500);d=await dump();
 ok(d.sync[code].math.cfg&&d.sync[code].math.cfg.ch===3,'choice saved next to math records '+JSON.stringify(d.sync[code].math.cfg));
 ok((await chOn(mom)).includes('第3章'),'handbook shows 第3章 selected');out.push('   status: '+(await mom.innerText('.chpick [role="status"]')));
 await pad.reload();await pad.waitForTimeout(900);
 ok((await pad.innerText('#tP4')).includes('这周：第3章'),'iPad picked it up on opening: '+(await pad.innerText('#tP4')).replace(/\n/g,' '));
 await round(pad,'#tMix');await pad.waitForTimeout(2000);d=await dump();
 ok(d.sync[code].math.cfg&&d.sync[code].math.cfg.ch===3,'iPad syncing records keeps the choice (PATCH)');ok(JSON.parse(d.sync[code].math.v).ch===3,'iPad records now say chapter 3');
 await mom.reload();await mom.waitForTimeout(500);out.push('   status after iPad used it: '+(await mom.innerText('.chpick [role="status"]')));
 ok(/现在用这一章/.test(await mom.innerText('.chpick [role="status"]')),'handbook says the iPad is using it');
 /* a later choice on the iPad itself wins over the older handbook one */
 await pad.click('#bStats');await pad.click('#bParent');await pad.waitForTimeout(200);await pad.click('#chCard [data-ch="5"]');await pad.click('#bStatsBack');if(await pad.isVisible('#bMeBack'))await pad.click('#bMeBack');
 await round(pad,'#tMix');await pad.waitForTimeout(2000);await pad.reload();await pad.waitForTimeout(900);
 ok((await pad.innerText('#tP4')).includes('第5章'),'choice made on the iPad stays after reopening');
 await mom.reload();await mom.waitForTimeout(500);ok((await chOn(mom)).includes('第5章'),'handbook follows the newer iPad choice: '+await chOn(mom));
 /* then the handbook again */
 await mom.click('.chpick [data-ch="1"]');await mom.waitForTimeout(400);await pad.reload();await pad.waitForTimeout(900);ok((await pad.innerText('#tP4')).includes('第1章'),'handbook again → iPad 第1章');
 /* database refusing */
 await fetch('http://localhost:8766/__deny');await mom.click('.chpick [data-ch="2"]');await mom.waitForTimeout(400);out.push('   when refused: '+(await mom.innerText('.chpick [role="status"]').catch(()=>'(picker gone)')));await fetch('http://localhost:8766/__deny');
 /* PATCH refused: records still sync and the choice is carried over */
 await fetch('http://localhost:8766/__nopatch');const n0=(await dump()).sync[code].math.n;await round(pad,'#tMix');await pad.waitForTimeout(2200);d=await dump();
 ok(d.sync[code].math.n>n0&&d.sync[code].math.cfg&&d.sync[code].math.cfg.ch===1,'PATCH refused: records still synced ('+n0+' → '+d.sync[code].math.n+'), choice kept '+JSON.stringify(d.sync[code].math.cfg));await fetch('http://localhost:8766/__nopatch');
 /* English and science ignore it */
 await pad.goto(H+'/english/');await pad.waitForTimeout(600);ok(!(await pad.isVisible('#chCard')),'english app unaffected');
 console.log(out.join('\n'));console.log('errors',errs);await b.close();})();
