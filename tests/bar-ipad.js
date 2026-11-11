const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [name,dev,land] of [['iPad 竖屏',devices['iPad (gen 7)'],0],['iPad 横屏',devices['iPad (gen 7) landscape'],1],['iPad mini 竖屏',devices['iPad Mini'],0]]){
 const p=await (await b.newContext({...dev,deviceScaleFactor:1})).newPage();await p.goto('http://localhost:8767/math/');await p.waitForTimeout(300);
 await p.click('#tBar');await p.click('#brTypes');await p.click('[data-bt="4"]');await p.waitForTimeout(100);
 const geo=async label=>{const r=await p.evaluate(()=>{const vh=innerHeight,q=s=>{const e=document.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();return [Math.round(b.top),Math.round(b.bottom),Math.round(b.height)];};
   const btns=[...document.querySelectorAll('#vBar button')].filter(x=>x.offsetParent).map(x=>x.getBoundingClientRect()).map(b=>Math.round(Math.min(b.width,b.height)));
   const ctl=[...document.querySelectorAll('#brCtl button')].filter(x=>x.offsetParent).map(x=>x.getBoundingClientRect().bottom);
   return {vh,fig:q('#brFig'),msg:q('#brMsg'),lastBtn:Math.round(Math.max(...ctl)),minBtn:Math.min(...btns),page:document.documentElement.scrollHeight};});
   console.log(name,label,JSON.stringify(r),r.fig&&r.lastBtn<=r.vh?'→ 一屏看得到':'→ 要滚动');};
 await geo('画格子');if(!land)await p.screenshot({path:'ipad-build-'+name.slice(0,4)+'.png'});
 await p.click('[data-bx="0"]');await p.click('[data-bx="2"]');await p.click('[data-bx="2"]');await p.click('#brDone');await p.waitForTimeout(80);
 await geo('标数字');if(land)await p.screenshot({path:'ipad-mark-land.png'});
 await p.click('[data-br="all"]');await p.click('[data-br="row:1"]').catch(()=>{});await p.waitForTimeout(80);if(await p.isVisible('[data-br]'))await p.click('[data-br="row:0"]');
 await geo('用图算');
}
await b.close();})();
