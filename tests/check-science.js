const fs=require('fs');eval(fs.readFileSync(process.argv[2],'utf8'));const QB=globalThis.QB;
let bad=0;const by={};
QB.GENS.forEach(g=>{by[g.c+' L'+g.l]=(by[g.c+' L'+g.l]||0)+1;for(let i=0;i<30;i++){const q=g.f();const e=[];
 if(q.opts.length!==4)e.push('n'+q.opts.length);if(new Set(q.opts).size!==q.opts.length)e.push('dup');if(q.zo.length!==q.opts.length)e.push('zo');
 if(q.ans<0)e.push('ans');if(/undefined|NaN|\?\s*\|/.test(JSON.stringify(q)))e.push('undef');if(!q.zh||!q.ex)e.push('noz');
 if(e.length){bad++;if(bad<10)console.log(g.t,e,q.q.slice(0,60));}}});
console.log('questions',QB.GENS.length,'bad',bad,by);
const t={};QB.GENS.forEach(g=>t[g.t]=(t[g.t]||0)+1);console.log(t);
