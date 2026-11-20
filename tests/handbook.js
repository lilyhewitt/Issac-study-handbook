// Handbook pages: every entry on a tab opens its second-level page, Back returns to the tab, the bottom bar keeps
// the tab highlighted, segmented controls show one pane at a time, the reading level still saves, nothing scrolls
// sideways (light and dark), and no half-width punctuation is left next to Chinese text.
const {chromium,devices}=require('playwright');
const U='http://localhost:8767/';let pass=0,fail=0;
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
(async()=>{const b=await chromium.launch();const errs=[];
for(const [dev,scheme] of [['iPhone 13','light'],['iPad (gen 7) landscape','dark']]){
  const p=await (await b.newContext({...devices[dev],colorScheme:scheme})).newPage();p.on('pageerror',e=>errs.push(e.message));
  await p.goto(U);await p.waitForTimeout(400);
  ok(await p.isVisible('#v-overview')&&(await p.textContent('#hdTitle'))==='小小假期学习手册',dev+': opens on the overview');
  ok(!(await p.textContent('#v-overview')).includes('每天做什么'),dev+': no daily schedule on the overview');
  const bg=await p.evaluate(()=>getComputedStyle(document.body).backgroundColor);
  ok(scheme==='dark'?bg==='rgb(20, 24, 23)':bg==='rgb(245, 245, 242)',dev+': '+scheme+' colours '+bg);
  let wide=0,bad=[];
  for(const tab of ['overview','english','science','math']){
    await p.click(`nav.tabs a[data-view="${tab}"]`);await p.waitForTimeout(150);
    const links=await p.$$eval(`#v-${tab} a.ent`,a=>a.map(x=>x.getAttribute('href')));
    for(const h of links){
      await p.click(`#v-${tab} a.ent[href="${h}"]`);await p.waitForTimeout(120);
      const id=h==='#praise'?'v-praise':'v-'+h.slice(1);
      const okPage=await p.isVisible('#'+id)&&!(await p.isVisible('#hd'))&&(await p.getAttribute(`nav.tabs a[data-view="${tab}"]`,'aria-current'))==='page';
      if(!okPage)bad.push(h);
      if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))wide++;
      await p.click('#'+id+' .bar .bk');await p.waitForTimeout(120);
      if(!(await p.isVisible('#v-'+tab)))bad.push(h+' back');
    }
    ok(links.length>=3,dev+': '+tab+' has '+links.length+' entries');
  }
  ok(!bad.length,dev+': every entry opens its page, keeps its tab lit, and Back returns '+bad.join(','));
  ok(!wide,dev+': no page scrolls sideways');
  // segmented control
  await p.goto(U+'#english-writing');await p.waitForTimeout(200);
  ok(await p.isVisible('[data-pane="w1"].pane')&&!(await p.isVisible('[data-pane="w2"].pane')),dev+': writing opens on 怎么写');
  await p.click('#v-english-writing .segc button[data-pane="w2"]');
  ok(!(await p.isVisible('[data-pane="w1"].pane'))&&await p.isVisible('[data-pane="w2"].pane')&&(await p.getAttribute('.segc button[data-pane="w2"]','aria-selected'))==='true',dev+': 大人怎么改 shows its pane only');
  // reading level picked on the reading page shows on the overview
  await p.goto(U+'#english-reading');await p.waitForTimeout(200);await p.click('#v-english-reading .segc button[data-pane="r2"]');
  await p.click('#v-english-reading [data-lv="3"]');await p.goto(U+'#overview');await p.waitForTimeout(200);
  ok((await p.textContent('#prog')).includes('他读大部分'),dev+': reading level set on the reading page shows on the overview');
  await p.click('#prog [data-lv="1"]');
  // progress rows go to the right pages
  await p.click('#prog a[href="#math-4a"]');await p.waitForTimeout(150);ok(await p.isVisible('#mweeks'),dev+': 预习 4A row opens the 8 steps');
  // read-together entry on the English tab, and the science textbook pane under 下学期学什么
  await p.goto(U+'#english');await p.waitForTimeout(150);
  ok((await p.textContent('#v-english a.ent')).includes('一起读'),dev+': 一起读 is the first entry on the English tab');
  await p.click('#v-english a.ent[href="#english-together"]');await p.waitForTimeout(120);
  ok(await p.isVisible('#v-english-together a.btn[href^="english/"]')&&(await p.textContent('#v-english-together')).includes('30 篇'),dev+': the read-together page opens with the app button');
  await p.goto(U+'#overview-next');await p.waitForTimeout(150);
  ok(await p.isVisible('[data-pane="n1"].pane')&&!(await p.isVisible('[data-pane="n2"].pane')),dev+': 下学期学什么 opens on 三科概览');
  await p.click('#v-overview-next .segc button[data-pane="n2"]');await p.waitForTimeout(100);
  ok(await p.isVisible('[data-pane="n2"].pane')&&(await p.textContent('[data-pane="n2"].pane')).includes('热的效应')&&(await p.$$('[data-pane="n2"] .li')).length>=10,dev+': 科学课本 pane lists the seven P4 chapters');
  await p.goto(U+'#updates');await p.waitForTimeout(150);ok(await p.isVisible('#v-updates .bar')&&(await p.textContent('#v-updates')).includes('v4.4'),dev+': update log opens with a Back bar');
  await p.goto(U+'#nowhere');await p.waitForTimeout(150);ok(await p.isVisible('#v-overview'),dev+': an unknown link falls back to the overview');
}
// punctuation: no ASCII , : ; ( ) ? ! touching Chinese in the visible text
const html=require('fs').readFileSync(__dirname+'/../index.html','utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g,'').replace(/<[^>]+>/g,'');
const half=html.match(/.{0,8}([㐀-鿿][,:;()?!]|[,:;()?!][㐀-鿿]).{0,8}/g)||[];
ok(!half.length,'full-width punctuation next to Chinese '+half.slice(0,5).join(' | '));
ok(!errs.length,'no page errors '+errs.join(' | '));
console.log(pass,'passed',fail,'failed');await b.close();process.exit(fail?1:0);})();
