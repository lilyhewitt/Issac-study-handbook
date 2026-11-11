const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
const code=html.match(/<script id="bank">([\s\S]*?)<\/script>/)[1];
eval(code);
const QB=globalThis.QB;
let bad=0,total=0;const seen={};const byCat={};
QB.GENS.forEach(g=>{
  for(let i=0;i<400;i++){const q=g.f();total++;
    const k=QB.key(q);seen[g.t+g.l]=(seen[g.t+g.l]||new Set()).add(k);
    const errs=[];
    if(q.opts.length!==4)errs.push('opts!=4');
    if(new Set(q.opts).size!==q.opts.length)errs.push('dup');
    if(q.ans<0||q.ans>=q.opts.length)errs.push('ans');
    const all=[q.q,q.p||'',q.ex,...q.opts].join(' ');
    if(/undefined|NaN|null/.test(all))errs.push('undef');
    if(!q.ex)errs.push('noex');
    if(errs.length){bad++; if(bad<15)console.log(g.t,g.l,errs.join(','),JSON.stringify(q).slice(0,300));}
  }
  byCat[g.c+' L'+g.l]=(byCat[g.c+' L'+g.l]||0)+1;
});
console.log('generators',QB.GENS.length,'samples',total,'bad',bad);
console.log('gens per cat/level',byCat);
console.log('approx distinct questions',QB.size());
Object.entries(seen).forEach(([t,s])=>console.log(String(s.size).padStart(5),t));
