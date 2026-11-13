const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const [dn,dev] of [['iPhone',devices['iPhone 13']],['iPad',devices['iPad (gen 7)']]]){
 const p=await (await b.newContext({...dev,deviceScaleFactor:1})).newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8767/math/');await p.waitForTimeout(300);await p.click('#tBar');
 let bad=0,checked=0;const ex=[];
 for(let ti=0;ti<8;ti++)for(let r=0;r<25;r++){await p.click('#brTypes');await p.click(`[data-bt="${ti}"]`);
   if(await p.isVisible('#brDone'))for(let k=0;k<2;k++)await p.click('#brDone');   /* two tries → the right model is shown */
   for(let k=0;k<6&&await p.isVisible('button[data-br]');k++){const ids=await p.$$eval('button[data-br]:not([disabled])',a=>a.map(x=>x.dataset.br));await p.click(`button[data-br="${ids[0]}"]`);}
   const res=await p.$eval('#brFig svg',s=>{const vb=s.viewBox.baseVal,out=[];s.querySelectorAll('text').forEach(t=>{const bb=t.getBBox();if(bb.x<-0.5||bb.y<-0.5||bb.x+bb.width>vb.width+0.5||bb.y+bb.height>vb.height+0.5)out.push(t.textContent+' @'+Math.round(bb.x)+','+Math.round(bb.y)+' w'+Math.round(bb.width)+' / '+vb.width+'x'+vb.height);});return out;});
   checked++;if(res.length){bad++;if(ex.length<4)ex.push(ti+': '+res.join(' | '));}}
 console.log(dn,'pictures checked',checked,'with text cut off:',bad,ex.join('\n  '));
 if(dn==='iPhone'){await p.click('#brTypes');await p.click('[data-bt="5"]');await p.click('button[data-br="x:0"]');await p.click('button[data-br="row:0"]');await p.waitForTimeout(80);await p.screenshot({path:'phone-transfer.png'});}}
console.log('errors',errs);await b.close();})();
