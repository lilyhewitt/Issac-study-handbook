const {chromium,devices}=require('playwright');const D='/tmp/claude-0/-home-claude/60c0acd7-8046-599f-865a-8a82898312e8/scratchpad/ipad';
const H='http://localhost:8767';const dump=async()=>JSON.parse(await (await fetch('http://localhost:8766/__dump')).text());
const out=[];const errs=[];const ok=(c,m)=>out.push((c?'PASS ':'FAIL ')+m);
async function newCtx(b,dev){const ctx=await b.newContext({...devices[dev],deviceScaleFactor:1});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(dev+': '+e.message));return [ctx,p];}
async function round(p,tile){await p.click(tile);let n=0;while(await p.isVisible('#vQuiz')&&n<14){n++;await p.click('#opt0');await p.click('#bNext');}await p.click('#bHome');return n;}
async function link(p,code){await p.click('#bStats');await p.click('#bParent');await p.waitForTimeout(200);if(!(await p.isVisible('#syncIn'))){out.push('  (already linked in this container)');return (await p.innerText('#syncCard')).replace(/\n+/g,' | ');}await p.fill('#syncIn',code);await p.click('[data-sync="go"]');await p.waitForTimeout(600);return (await p.innerText('#syncCard')).replace(/\n+/g,' | ');}
(async()=>{const b=await chromium.launch();
 // mom's phone: generate a code
 const [cm,mom]=await newCtx(b,'iPhone 13');await mom.goto(H+'/#practice');await mom.waitForTimeout(400);
 ok(await mom.isVisible('#syncSec'),'handbook shows sync section');
 
 await mom.click('[data-s="new"]');await mom.waitForTimeout(400);
 const code=(await mom.innerText('#syncBox summary')).replace('同步码','').trim();ok(/^[2-9A-Z]{4}-[2-9A-Z]{4}$/.test(code),'code generated '+code);
 await mom.screenshot({path:D+'/sync-mom-linked-empty.png',fullPage:true});
 // kid's iPad, english: practise first, then link
 const [ck,kid]=await newCtx(b,'iPad (gen 7)');await kid.goto(H+'/english/');await kid.waitForTimeout(300);
 const n1=await round(kid,'#tGram');
 await kid.click('#bStats');await kid.click('#bParent');ok(await kid.isVisible('#syncCard'),'iPad 家长看 shows sync card');
 await kid.screenshot({path:D+'/sync-kid-unlinked.png'});
 await kid.fill('#syncIn','abc');await kid.click('[data-sync="go"]');ok(/8 位/.test(await kid.innerText('#syncMsg')),'short code rejected');
 await kid.fill('#syncIn',code.toLowerCase());await kid.click('[data-sync="go"]');await kid.waitForTimeout(800);
 const card=(await kid.innerText('#syncCard')).replace(/\n+/g,' | ');ok(/已同步/.test(card)&&card.includes(code),'iPad english linked: '+card);
 await kid.screenshot({path:D+'/sync-kid-linked.png'});
 let d=await dump();const c=code.replace('-','');ok(d.sync&&d.sync[c]&&d.sync[c].english&&d.sync[c].english.n===n1,'cloud has english n='+(d.sync&&d.sync[c]&&d.sync[c].english&&d.sync[c].english.n)+' (answered '+n1+')');
 ok(!JSON.parse(d.sync[c].english.v).seen,'seen list not uploaded');
 // science: link first, then practise (push after round)
 await kid.goto(H+'/science/');await kid.waitForTimeout(300);await link(kid,code);await kid.click('#bStatsBack');await kid.click('#bMeBack');
 const n2=await round(kid,'#tMix');await kid.waitForTimeout(2000);
 d=await dump();ok(d.sync[c].science&&d.sync[c].science.n===n2,'cloud has science n='+(d.sync[c].science&&d.sync[c].science.n));
 // math: word card round too
 await kid.goto(H+'/math/');await kid.waitForTimeout(300);await link(kid,code);await kid.click('#bStatsBack');await kid.click('#bMeBack');
 const n3=await round(kid,'#tWp');await kid.click('#tWords');await kid.click('[data-learn="0"]');for(let i=0;i<5;i++)await kid.click('#cNext');for(let i=0;i<5;i++){await kid.click('#opt0');await kid.click('#bNext');}
 await kid.waitForTimeout(2000);d=await dump();ok(d.sync[c].math&&d.sync[c].math.n===n3+5,'cloud has math n='+(d.sync[c].math&&d.sync[c].math.n)+' expected '+(n3+5));
 // mom's phone sees it
 await mom.reload();await mom.waitForTimeout(800);
 const prog=(await mom.innerText('#syncBox')).replace(/\n+/g,' | ');out.push('  mom progress: '+prog);
 ok(/练了 1 天/.test(prog)&&/今天练过了/.test(prog),'mom sees practice days');
 const rows=(await mom.innerText('#syncBox .prog')).replace(/\n+/g,' | ');out.push('  mom sync rows: '+rows);ok((rows.match(/今天 \d\d:\d\d · \d+ 题/g)||[]).length===3,'all three apps show latest practice');
 await mom.screenshot({path:D+'/sync-mom-linked.png',fullPage:true});
 await mom.click('#syncBox a[href^="english/"]');await mom.waitForTimeout(800);
 const rv=(await mom.innerText('#vStats')).slice(0,300).replace(/\n+/g,' | ');out.push('  mom remote english: '+rv);
 ok(/小小的练习记录/.test(rv)&&new RegExp(n1+' 题').test(rv),'remote view shows the iPad records');
 const momLocal=await mom.evaluate(()=>localStorage.getItem('xiaoxiao-english-v1'));ok(!momLocal,'remote view did not write to the phone');
 await mom.screenshot({path:D+'/sync-mom-remote.png'});
 await mom.click('#bStatsBack');await mom.waitForTimeout(500);ok(/\/(#.*)?$/.test(new URL(mom.url()).pathname+new URL(mom.url()).hash)&&await mom.isVisible('#v-practice'),'back goes to the 练习 tab');
 // restore: a fresh english copy on the iPad picks up the cloud records
 const [cr,kid2]=await newCtx(b,'iPad (gen 7)');await kid2.goto(H+'/english/');await kid2.waitForTimeout(300);
 const card2=await link(kid2,code);const tot=(await kid2.innerText('#stSum')).replace(/\n+/g,' ');ok(new RegExp(n1+' 题').test(tot),'fresh copy restored: '+tot);
 // stale guard: the first iPad copy plays more; the restored copy plays 1 question and must not overwrite
 await kid.goto(H+'/english/');await kid.waitForTimeout(300);const n4=await round(kid,'#tGram');await kid.waitForTimeout(2000);
 d=await dump();const after=d.sync[c].english.n;ok(after===n1+n4,'cloud english n='+after);
 await kid2.click('#bStatsBack');await kid2.click('#bMeBack');await kid2.click('#tGram');await kid2.click('#opt0');await kid2.click('#bNext');await kid2.click('#bQuit');await kid2.waitForTimeout(2200);
 d=await dump();ok(d.sync[c].english.n===after,'stale copy did not overwrite (cloud n='+d.sync[c].english.n+')');
 await kid2.click('#bStats');await kid2.click('#bParent');ok(/记录比这里多/.test(await kid2.innerText('#syncCard')),'stale copy says so');
 // phone without a code opening remote view
 const [cx,px]=await newCtx(b,'iPhone 13');await px.goto(H+'/english/?remote=1');await px.waitForTimeout(500);ok(/还没连上/.test(await px.innerText('#syncCard')),'remote without code explains');
 // aunt's phone enters the same code
 const [ca,aunt]=await newCtx(b,'iPhone 13');await aunt.goto(H+'/#practice');await aunt.waitForTimeout(300);
 await aunt.click('#syncBox summary');await aunt.fill('#sIn',code);await aunt.click('[data-s="use"]');await aunt.waitForTimeout(800);
 ok((( await aunt.innerText('#syncBox .prog')).match(/ 题/g)||[]).length>=3,'aunt sees the same records');
 // change code flow
 await aunt.click('#syncBox details.inl summary');await aunt.click('[data-s="ask"]');ok(/重新输入新码/.test(await aunt.innerText('#syncBox')),'change code asks first');await aunt.click('[data-s="keep"]');ok(!(await aunt.isVisible('[data-s="reset"]')),'keep code');
 await fetch('http://localhost:8766/__deny');
 const [cd,kd]=await newCtx(b,'iPad (gen 7)');await kd.goto(H+'/science/');await kd.waitForTimeout(300);await kd.click('#bStats');await kd.click('#bParent');await kd.fill('#syncIn',code);await kd.click('[data-sync="go"]');await kd.waitForTimeout(600);
 ok(/规则/.test(await kd.innerText('#syncMsg')),'iPad explains rules problem: '+await kd.innerText('#syncMsg'));
 await aunt.reload();await aunt.waitForTimeout(700);ok(/规则/.test(await aunt.innerText('#syncBox')),'handbook explains rules problem');
 await fetch('http://localhost:8766/__deny');
 console.log(out.join('\n'));console.log('errors',errs);await b.close();})();
