const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
const m=html.match(/<script id="bank">([\s\S]*?)<\/script>/);const code=m?m[1]:html;   /* a built page, or src/english/bank.js */
eval(code);
const QB=globalThis.QB;
let bad=0,total=0;const seen={};const byCat={};
QB.GENS.forEach(g=>{
  for(let i=0;i<400;i++){const r=g.f();(Array.isArray(r)?r:[r]).forEach(q=>{total++;
    const k=QB.key(q);seen[g.t+g.l]=(seen[g.t+g.l]||new Set()).add(k);
    const errs=[];
    if(q.opts.length!==(g.t.startsWith('Subject and verb')?2:4))errs.push('opts');   /* subject–verb is two choices on purpose */
    if(new Set(q.opts).size!==q.opts.length)errs.push('dup');
    if(q.ans<0||q.ans>=q.opts.length)errs.push('ans');
    const all=[q.q,q.p||'',q.ex,...q.opts].join(' ');
    if(/undefined|NaN|null/.test(all))errs.push('undef');
    if(!q.ex)errs.push('noex');
    if(g.f!==undefined&&Array.isArray(r)&&!r.every(x=>x.step))errs.push('steps');
    if(errs.length){bad++; if(bad<15)console.log(g.t,g.l,errs.join(','),JSON.stringify(q).slice(0,300));}
  });}
  byCat[g.c+' L'+g.l]=(byCat[g.c+' L'+g.l]||0)+1;
});
console.log('generators',QB.GENS.length,'samples',total,'bad',bad);
console.log('gens per cat/level',byCat);
console.log('approx distinct questions',QB.size());
Object.entries(seen).forEach(([t,s])=>console.log(String(s.size).padStart(5),t));

/* phrases (介词词组): every phrase, sentence and story, and spot-the-mistake */
if(QB.PP){let pb=0,pn=0;const chk=(q,want)=>{pn++;if(q.opts.length!==4||new Set(q.opts).size!==4||q.ans<0||(want&&q.opts[q.ans]!==want)||/undefined|NaN/.test(JSON.stringify(q))){pb++;if(pb<6)console.log('phrase bad',JSON.stringify(q).slice(0,200));}};
  QB.PP.forEach(p=>{for(let i=0;i<40;i++){chk(QB.PPX.word(p),p.key);chk(QB.PPX.sentence(p),p.key);}});
  QB.PPG.forEach((g,gi)=>{for(let i=0;i<40;i++)QB.PPX.story(gi).forEach(q=>chk(q));});
  for(let i=0;i<400;i++)chk(QB.PPX.wrong(QB.PP));
  console.log('phrases',QB.PP.length,'checked',pn,'bad',pb);bad+=pb;}
/* word sets: no holes (a stray comma), five words each, an example with the word in ** */
QB.WORDSETS.forEach((st,i)=>{if(!st||st.words.length!==5||[...st.words].some(w=>!Array.isArray(w)||!/\*\*(.+?)\*\*/.test(w[3]))){bad++;console.log('word set bad',i,st&&st.title);}});
if(QB.WORDSETS.includes(undefined)||Object.keys(QB.WORDSETS).length!==QB.WORDSETS.length){bad++;console.log('word set list has a hole');}
console.log('word sets',QB.WORDSETS.length);
if(bad)process.exitCode=1;
