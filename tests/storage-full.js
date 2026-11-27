// When the iPad's storage is nearly full, a save that is refused drops the oldest answer records and tries again,
// so stars and progress are still kept (all three apps).
const {chromium}=require('playwright');let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
const KEYS={english:'xiaoxiao-english-v1',math:'xiaoxiao-math-v1',science:'xiaoxiao-science-v1'};
(async()=>{const b=await chromium.launch();
for(const app of ['english','math','science']){const ctx=await b.newContext();const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:8767/'+app+'/');await p.waitForTimeout(400);
  const K=KEYS[app];
  await p.evaluate(K=>{const S=JSON.parse(localStorage.getItem(K)||'{}');const big=[];
    for(let i=0;i<5000;i++)big.push({d:'2026-11-26',ts:i,c:'x',t:'filler record '+i,q:'x'.repeat(120),ok:1});S.log=big;S.stars=123;localStorage.setItem(K,JSON.stringify(S));},K);
  await p.addInitScript(()=>{const real=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(v).length>300000)throw new DOMException('full','QuotaExceededError');return real.call(this,k,v);};});
  await p.reload();await p.waitForTimeout(500);
  await p.evaluate(()=>{document.dispatchEvent(new Event('visibilitychange'));});
  // any answer saves; simplest common path: the app saves when it opens a stats view or finishes — call through the page's own save
  await p.evaluate(()=>{window.__save()});
  const s=await p.evaluate(K=>JSON.parse(localStorage.getItem(K)),K);
  ok(s.stars===123,app+': stars kept when storage is full');
  ok(s.log.length<5000&&s.log.length>200&&s.log[s.log.length-1].ts===4999,app+': oldest records dropped, newest kept ('+s.log.length+' left)');
  ok(!errs.length,app+': no page errors '+errs.slice(0,2).join(' | '));await ctx.close();}
await b.close();console.log(`${pass} passed, ${fail} failed`);process.exit(fail?1:0);})();
