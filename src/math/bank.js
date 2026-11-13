(function(W){
'use strict';
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;};
const N=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const pad=n=>String(n).padStart(2,'0');
const $c=c=>'$'+(c/100).toFixed(2);
const D=n=>'$'+n;
const S_=String;
const gcd=(a,b)=>b?gcd(b,a%b):a;
const BOY=['Ali','Ben','Ravi','Kai','Jun Jie','Kumar','Ahmad','Wei Ming','Daniel','Arjun'];
const GIRL=['Siti','Mei Ling','Hui Min','Priya','Farah','Aisha','Li Ting','Nur','Emma','Kavya'];
function kid(){return Math.random()<.5?{n:pick(BOY),P:'He',p:'he',h:'his',z:'他'}:{n:pick(GIRL),P:'She',p:'she',h:'her',z:'她'};}
function two(){const a=kid();let b;do{b=kid();}while(b.n===a.n);return[a,b];}
const GENS=[];
const G=(c,t,l,w,f)=>GENS.push({c,t,l,w,f});

/* Mistake types. Every wrong option carries one, so the parent view can count them. */
const ERRS={
 who:'答的不是题目问的（问的是谁、要找什么）',
 step1:'停在第一步，没有算完',
 leftadd:'卖掉、剩下、用掉：该减的用了加法',
 pour:'倒满几杯：没有先乘再减',
 perim:'绕一圈：只算一条边，或算成了面积',
 unit:'单位没换就算',
 keyword:'看到词就配运算（times 就除、more 就加）',
 calc:'计算：进位、借位、乘法表',
 time:'时间：60 分钟进位，或漏了一段',
 round:'余数和分组：要不要多加一个',
 sense:'没检查答案说不说得通',
 place:'数位、四舍五入看错位',
 frac:'分数：分子分母弄混',
 fm:'因数和倍数弄混',
 gap:'间隔：段数和个数差 1'
};

/* options: a = answer; d = list of [value, mistake, why-in-Chinese, Chinese option text] */
function mk(o){
  const a=S_(o.a),seen=new Set([a]),all=[[a,null,null,o.az||null]];
  for(const x of (o.d||[])){const [v,e,w,z]=Array.isArray(x)?x:[x];if(v===null||v===undefined)continue;const s=S_(v);
    if(s===''||/NaN|undefined|Infinity/.test(s)||/^-|\s-\d|\$-|\(-/.test(s)||seen.has(s))continue;
    seen.add(s);all.push([s,e||null,w||null,z||null]);if(all.length===4)break;}
  /* not enough different wrong answers: make near numbers in the same form ($, units) */
  if(all.length<4&&!o.fill){const m=/^(\$?)(\d+)(\D*)$/.exec(a);if(m){const v=+m[2];o.fill={n:v,step:v>=40&&v%5===0?5:1,f:x=>m[1]+x+m[3]};}}
  if(all.length<4&&o.fill){let k=1;while(all.length<4&&k<80){for(const v of [o.fill.n+k*o.fill.step,o.fill.n-k*o.fill.step]){if(all.length<4&&v>0){const s=o.fill.f(v);if(!seen.has(s)){seen.add(s);all.push([s,null,null,null]);}}}k++;}}
  const idx=shuf(all.map((_,i)=>i));
  const dot=t=>typeof t==='string'?t.replace(/\b([ap])\.m\.\./g,'$1.m.'):t; /* "2.40 p.m.." -> "2.40 p.m." */
  const q={q:dot(o.q),p:dot(o.p)||null,zh:o.zh||null,opts:idx.map(i=>all[i][0]),ans:idx.indexOf(0),ex:dot(o.ex)||''};
  if(all.some(x=>x[1]))q.err=idx.map(i=>all[i][1]);
  if(all.some(x=>x[2]))q.why=idx.map(i=>all[i][2]);
  if(all.some(x=>x[3]))q.zo=idx.map(i=>all[i][3]||all[i][0]);
  if(o.fig)q.fig=o.fig;
  return q;}
/* a word problem split into steps: the story stays on top without its final question (that question is the last step), one small question per step */
function chain(p,pz,steps,ask){const st=p.replace(/\s*[^.?!]*\?\s*$/,''),sz=pz.replace(/[^。？！]*？\s*$/,''),fq=(p.match(/[^.?!]*\?\s*$/)||[''])[0].trim();
  const all=(ask?[null]:[]).concat(steps),n=all.length;
  return all.map((s,i)=>{let q;
    if(s===null){q=mk({p,zh:pz+'\n\n先读整道题：这题要你求什么？',q:'What does the question ask you to find?',a:ask[0],az:ask[0],d:ask.slice(1).map(x=>[x,'who',null,x]),
      ex:`最后一句问：${fq}\n所以要求的是：${ask[0]}。`});q.ask=true;}
    else q=mk(Object.assign({},s,{p:st,zh:sz+'\n\n'+(s.qz||'')}));
    q.step=(i+1)+'/'+n;return q;});}

/* helpers */
function carry(a,b){while(a||b){if(a%10+b%10>=10)return true;a=Math.floor(a/10);b=Math.floor(b/10);}return false;}
function noCarry(a,b){let r=0,p=1;while(a||b){r+=((a%10+b%10)%10)*p;p*=10;a=Math.floor(a/10);b=Math.floor(b/10);}return r;}
function borrow(a,b){while(b){if(a%10<b%10)return true;a=Math.floor(a/10);b=Math.floor(b/10);}return false;}
function absDig(a,b){let r=0,p=1;while(a||b){r+=Math.abs(a%10-b%10)*p;p*=10;a=Math.floor(a/10);b=Math.floor(b/10);}return r;}
function mulNoCarry(a,b){let r=0,p=1;while(a){r+=((a%10)*b%10)*p;p*=10;a=Math.floor(a/10);}return r;}
function perms(s){if(s.length<=1)return[s];const o=new Set();for(let i=0;i<s.length;i++)for(const p of perms(s.slice(0,i)+s.slice(i+1)))o.add(s[i]+p);return[...o];}
const ONES=['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const w2=n=>n<20?ONES[n]:TENS[Math.floor(n/10)]+(n%10?'-'+ONES[n%10]:'');
function words(n){const th=Math.floor(n/1000),h=Math.floor(n%1000/100),r=n%100,parts=[];if(th)parts.push(w2(th)+' thousand');if(h)parts.push(ONES[h]+' hundred');let s=parts.join(', ');if(r)s+=(s?' and ':'')+w2(r);return s;}
const t12=t=>{const h=Math.floor(t/60)%24,m=t%60;return `${h%12||12}.${pad(m)} ${h<12?'a.m.':'p.m.'}`;};
const dur=m=>{const h=Math.floor(m/60),r=m%60;return h&&r?`${h} h ${r} min`:h?`${h} h`:`${r} min`;};
const kgf=x=>{const k=Math.floor(x/1000),g=x%1000;return k&&g?`${k} kg ${g} g`:k?`${k} kg`:`${g} g`;};
const STK=[['stickers','张贴纸'],['marbles','颗弹珠'],['stamps','张邮票'],['cards','张卡片']];
const PAIRS=[[['pen','支','笔'],['bag','个','书包']],[['ruler','把','尺'],['book','本','书']],[['pencil','支','铅笔'],['box of paints','盒','颜料']],[['cap','顶','帽子'],['T-shirt','件','T 恤']],[['bottle of water','瓶','水'],['sandwich','个','三明治']]];
const MAT=[['wire','铁丝'],['ribbon','丝带'],['string','绳子']];
const ITEMS=[['a storybook','一本故事书'],['a water bottle','一个水壶'],['a pencil case','一个笔袋'],['a toy car','一辆玩具车'],['a T-shirt','一件 T 恤']];

const T={pv:'Place value · 数位',as:'Add & subtract · 加减',md:'Times & divide · 乘除',mon:'Money · 钱',fr:'Fractions · 分数',meas:'Measures · 单位换算',tm:'Time · 时间',
 one:'One-step problems · 一步应用题',left:'Left & sold · 剩下和卖掉',pour:'Pouring · 倒满几杯',round:'Going round · 绕一圈',sd:'Sum & difference · 和差',times:'Times as many · 几倍',
 cmp:'More & fewer · 比多比少',grp:'Groups · 分组',wtime:'Time problems · 时间应用题',wmon:'Money problems · 钱的应用题',mass:'Mass problems · 质量应用题',len:'Length problems · 长度应用题',ap:'Area & perimeter · 面积周长',btd:'Times & difference · 几倍和相差',bbs:'Bigger to smaller · 知道大的求小的',b3:'Three amounts · 三个量',bba:'Before & after · 前后变化',sense:'Does it make sense? · 说得通吗',
 p4n:'Ch1 Numbers to 100 000 · 第1章 十万以内的数',p4pat:'Ch1 Number patterns · 第1章 数的规律',p4r:'Ch1 Rounding · 第1章 四舍五入',p4f:'Ch2 Factors & multiples · 第2章 因数和倍数',
 p4m:'Ch3 Multiplication · 第3章 乘法',p4d:'Ch3 Division · 第3章 除法',p4t:'Ch4 Tables & line graphs · 第4章 表格和折线图',p4fr:'Ch5 Fractions (I) · 第5章 分数（一）',p4fr2:'Ch6 Fractions (II) · 第6章 分数（二）',
 p4a:'Ch7 Angles · 第7章 角',p4rs:'Ch8 Rectangles & squares · 第8章 长方形和正方形'};
const CH=['十万以内的数','因数和倍数','整数四则','表格和折线图','分数（一）','分数（二）','角','长方形和正方形'];

/* ================= CALCULATION ================= */
G('calc',T.pv,1,.7,()=>{let s;do{s=S_(ri(1000,9999));}while(new Set(s).size<4||s.includes('0'));const n=+s,pos=ri(0,3),d=+s[pos],v=d*10**(3-pos),zpl=['千','百','十','个'][pos];
  return mk({q:`In ${N(n)}, the digit ${d} stands for ___.`,zh:`在 ${N(n)} 里，数字 ${d} 代表多少？`,a:N(v),d:[d,d*10,d*100,d*1000].filter(x=>x!==v).map(x=>[N(x),'place','看清楚 '+d+' 在哪一位：从右往左是个、十、百、千。']),ex:`${d} 在${zpl}位，所以代表 ${N(v)}。`});});
G('calc',T.as,1,1,()=>{let a,b;do{a=ri(1200,7600);b=ri(150,Math.min(2400,9999-a));}while(!carry(a,b));const s=a+b;
  return mk({q:`${N(a)} + ${N(b)} = ___`,a:N(s),d:[[N(noCarry(a,b)),'calc','满十要向前一位进 1，这里忘了进位。'],[N(s+100),'calc'],[N(s-10),'calc'],[N(s+10),'calc']],ex:`从个位加起，满十进一：${N(a)} + ${N(b)} = ${N(s)}`});});
G('calc',T.as,1,1,()=>{let a,b;do{a=ri(2000,9800);b=ri(300,a-200);}while(!borrow(a,b));const d=a-b;
  return mk({q:`${N(a)} − ${N(b)} = ___`,a:N(d),d:[[N(absDig(a,b)),'calc','不够减要向前一位借 1 当 10，不能倒过来用下面的数减上面的数。'],[N(d+100),'calc','借了 1 之后，前一位要少 1。'],[N(d+10),'calc'],[N(d-10),'calc']],ex:`从个位减起，不够减就借 1 当 10：${N(a)} − ${N(b)} = ${N(d)}`});});
G('calc',T.md,1,1.2,()=>{const a=pick([6,7,8,9]),b=ri(3,10),p=a*b;
  return mk({q:Math.random()<.5?`${a} × ${b} = ___`:`${b} × ${a} = ___`,a:p,d:[[a*(b+1),'calc'],[a*(b-1),'calc'],[(a+1)*b,'calc'],[a+b,'keyword','× 是乘，不是加。']],fill:{n:p,step:1,f:S_},ex:`${a} × ${b} = ${p}。忘了的话：${a} × ${b-1} = ${a*(b-1)}，再加一个 ${a}。`});});
G('calc',T.md,1,.6,()=>{const a=pick([6,7,8,9]),b=ri(3,10),p=a*b;
  if(Math.random()<.5)return mk({q:`___ × ${a} = ${p}`,zh:'空格里填几？',a:b,d:[[b+1,'calc'],[b-1,'calc'],[p-a,'keyword','想：几个 '+a+' 是 '+p+'？']],fill:{n:b,step:1,f:S_},ex:`${b} × ${a} = ${p}，所以填 ${b}。`});
  return mk({q:`${p} ÷ ${a} = ___`,a:b,d:[[b+1,'calc'],[b-1,'calc'],[p-a,'keyword','÷ 是除，不是减。']],fill:{n:b,step:1,f:S_},ex:`想乘法：${a} × ${b} = ${p}，所以 ${p} ÷ ${a} = ${b}。`});});
G('calc',T.mon,1,.8,()=>{const T2=pick([10,20,50]);let p;do{p=ri(21,(T2*100-150)/5|0)*5;}while(p%100===0);const ans=T2*100-p;
  return mk({q:`$${T2}.00 − ${$c(p)} = ___`,a:$c(ans),d:[[$c(ans+100),'calc','借位：元那一位也要少 1。'],[$c(ans+10),'calc'],[$c(ans-10),'calc']],fill:{n:ans,step:5,f:$c},ex:`$${T2}.00 − ${$c(p)} = ${$c(ans)}。也可以先算 $${T2} − $${Math.ceil(p/100)} = $${T2-Math.ceil(p/100)}，再加回 ${$c(Math.ceil(p/100)*100-p)}。`});});
G('calc',T.md,2,1,()=>{const b=ri(3,9),a=ri(105,Math.min(999,Math.floor(9999/b))),p=a*b;
  return mk({q:`${N(a)} × ${b} = ___`,a:N(p),d:[[N(mulNoCarry(a,b)),'calc','每一位乘完要加上进位。'],[N(p+10),'calc'],[N(p-100),'calc'],[N(p+a),'calc']],ex:`先算个位，再算十位、百位，记得加上进位：${N(a)} × ${b} = ${N(p)}`});});
G('calc',T.md,2,1,()=>{const d=ri(3,9),q=ri(12,99),r=ri(1,d-1),n=d*q+r;
  return mk({q:`${N(n)} ÷ ${d} = ___`,zh:'R 是余数（remainder）。',a:`${q} R ${r}`,d:[[`${q-1} R ${r+d}`,'round',`余数 ${r+d} 比 ${d} 大，还能再分一次。余数一定要比除数小。`],[`${q} R ${r+1<d?r+1:r-1}`,'calc'],[`${q+1} R ${r}`,'calc'],[`${q} R ${d-r}`,'calc']],ex:`${d} × ${q} = ${d*q}，${n} − ${d*q} = ${r}。余数 ${r} 比 ${d} 小。`});});
G('calc',T.mon,2,.6,()=>{const a=ri(21,598)*5,b=ri(21,598)*5,s=a+b;
  return mk({q:`${$c(a)} + ${$c(b)} = ___`,a:$c(s),d:[[$c((a%100+b%100)>=100?s-100:s+100),'calc','分加起来满 100，要进 $1。'],[$c(s+10),'calc'],[$c(s-10),'calc']],ex:`${$c(a)} + ${$c(b)} = ${$c(s)}`});});
G('calc',T.fr,2,.8,()=>{const [a,b]=pick([[1,2],[1,3],[2,3],[1,4],[3,4],[1,5],[2,5],[3,5],[1,6],[5,6]]),k=ri(2,Math.max(2,Math.floor(12/b)));
  if(Math.random()<.5)return mk({q:`${a}/${b} = ___/${b*k}`,zh:'空格里填几？',a:a*k,d:[[a+k,'frac','分子分母要乘同一个数，不是加。'],[a*k+1,'calc'],[b*k-a*k,'frac']],fill:{n:a*k,step:1,f:S_},ex:`分母 × ${k}，分子也要 × ${k}：${a} × ${k} = ${a*k}。`});
  return mk({q:`Which fraction is equal to ${a}/${b}?`,zh:`哪个分数和 ${a}/${b} 一样大？`,a:`${a*k}/${b*k}`,d:[[`${a+k}/${b+k}`,'frac','分子分母要乘同一个数，不是加同一个数。'],[`${a}/${b*k}`,'frac','只乘了分母，分子也要乘。'],[`${a+1}/${b+1}`,'frac']],ex:`分子分母同时乘 ${k}：${a}/${b} = ${a*k}/${b*k}。`});});
G('calc',T.fr,2,.6,()=>{const g=Math.random()<.5,ds=shuf([2,3,4,5,6,8,10,12]).slice(0,4),ans=g?Math.min(...ds):Math.max(...ds),wrong=g?Math.max(...ds):Math.min(...ds);
  return mk({q:`Which fraction is the ${g?'greatest':'smallest'}?`,zh:`哪个分数${g?'最大':'最小'}？`,a:`1/${ans}`,d:ds.filter(x=>x!==ans).map(x=>[`1/${x}`,x===wrong?'frac':null,x===wrong?'分子都是 1 时，分母越大，每一份越小。':null]),ex:`分子都是 1：分母越大，每一份越小。所以${g?'最大':'最小'}的是 1/${ans}。`});});
G('calc',T.fr,2,.6,()=>{const b=ri(5,12),a=ri(1,b-2),c=ri(1,b-1-a),s=a+c,g=gcd(s,b),A=`${s/g}/${b/g}`;
  return mk({q:`${a}/${b} + ${c}/${b} = ___`,zh:'答案化成最简分数。',a:A,d:[[`${s}/${b*2}`,'frac','分母一样时只加分子，分母不变。'],[`${s+1}/${b}`,'calc'],[`${Math.max(1,s-1)}/${b}`,'calc'],[`${a*c}/${b}`,'frac']],ex:`分母一样，只加分子：${a} + ${c} = ${s}，得 ${s}/${b}${g>1?` = ${A}`:''}。`});});
G('calc',T.meas,2,1.2,()=>{const [U,u,f]=pick([['m','cm',100],['km','m',1000],['ℓ','ml',1000],['kg','g',1000]]),big=ri(1,9);let sm;
  if(f===100)sm=Math.random()<.4?ri(1,9):ri(10,99);else{const r=Math.random();sm=r<.3?ri(1,9):r<.6?ri(10,99):ri(100,999);}
  const ans=big*f+sm,cat=+(S_(big)+S_(sm)),fu=x=>`${N(x)} ${u}`;
  return mk({q:`${big} ${U} ${sm} ${u} = ___ ${u}`,zh:`${big} ${U} ${sm} ${u} 是多少 ${u}？`,a:fu(ans),d:[[fu(cat),'unit',`1 ${U} = ${N(f)} ${u}，要乘 ${N(f)}，不能把数字直接接在一起。`],[fu(big*(f===100?1000:100)+sm),'unit',`1 ${U} = ${N(f)} ${u}。`],[fu(big*f+sm*10),'calc'],[fu(ans+f),'calc']],ex:`1 ${U} = ${N(f)} ${u}，${big} ${U} = ${N(big*f)} ${u}，再加 ${sm} ${u} → ${N(ans)} ${u}。`});});
G('calc',T.tm,2,.8,()=>{const m=ri(0,11)*5,h=ri(1,11);
  if(Math.random()<.6)return mk({q:`${h}.${pad(m)} p.m. in 24-hour clock time is ___.`,zh:`下午 ${h}.${pad(m)} 用 24 小时制怎么写？`,a:`${h+12} ${pad(m)}`,d:[[`${pad(h)} ${pad(m)}`,'time','下午的钟点要 + 12。'],[`${pad(h+11)} ${pad(m)}`,'time'],[`${pad(h+10)} ${pad(m)}`,'time']],ex:`下午 + 12：${h} + 12 = ${h+12}，写成 ${h+12} ${pad(m)}。`});
  const H=ri(13,23);return mk({q:`${H} ${pad(m)} is the same as ___.`,zh:`24 小时制的 ${H} ${pad(m)} 是几点？`,a:`${H-12}.${pad(m)} p.m.`,d:[[`${H-12}.${pad(m)} a.m.`,'time','13 点以后是下午，用 p.m.。'],[`${((H-11)%12)||12}.${pad(m)} p.m.`,'time'],[`${((H-13+12)%12)||12}.${pad(m)} p.m.`,'time']],ex:`${H} − 12 = ${H-12}，是下午 ${H-12}.${pad(m)} p.m.`});});
G('calc',T.tm,2,.8,()=>{let t;do{t=ri(13,46)*5;}while(t%60===0);const h=Math.floor(t/60),mm=t%60;
  if(Math.random()<.5)return mk({q:`${t} min = ___`,zh:`${t} 分钟是几小时几分钟？`,a:dur(t),d:[[t>=100&&t%100<60&&Math.floor(t/100)!==h?`${Math.floor(t/100)} h ${t%100} min`:null,'time','1 小时是 60 分钟，不是 100 分钟。'],[dur(t+60),'time'],[dur(t+10),'calc'],[dur(Math.max(5,t-10)),'calc']],ex:`1 h = 60 min。${t} = 60 × ${h} + ${mm} → ${dur(t)}。`});
  return mk({q:`${dur(t)} = ___ min`,zh:`${dur(t)} 是多少分钟？`,a:t,d:[[h*100+mm,'time','1 小时是 60 分钟，不是 100 分钟。'],[t+10,'calc'],[t-10,'calc'],[h+mm,'time']],fill:{n:t,step:5,f:S_},ex:`${h} h = ${h*60} min，再加 ${mm} min → ${t} min。`});});

/* ================= WORD PROBLEMS: one step (easy) ================= */
G('wp',T.one,1,1,()=>{const k=kid(),a=ri(30,95),b=ri(8,a-10),ans=a-b;
  return mk({q:`${k.n} had ${a} stickers. ${k.P} gave ${b} stickers to ${k.h} friend. How many stickers does ${k.p} have now?`,zh:`${k.n} 有 ${a} 张贴纸，送给朋友 ${b} 张。${k.z}现在有多少张？`,a:ans,d:[[a+b,'leftadd','送出去会变少，要用减法。'],[b,'who','这是送出去的，题目问现在有多少。']],fill:{n:ans,step:10,f:S_},ex:`送出去会变少 → 减法：${a} − ${b} = ${ans}。`});});
G('wp',T.one,1,1,()=>{const r=ri(6,9),c=ri(6,12),ans=r*c;
  return mk({q:`There are ${r} rows of chairs in the hall. Each row has ${c} chairs. How many chairs are there in all?`,zh:`大厅里有 ${r} 排椅子，每排 ${c} 张。一共有多少张？`,a:ans,d:[[r+c,'keyword','“每排几张、有几排”要用乘法。'],[ans+r,'calc'],[ans-c,'calc']],ex:`${r} 排 × 每排 ${c} 张 = ${ans}。`});});
G('wp',T.one,1,.8,()=>{const k=kid(),g=ri(3,6),q=ri(11,25),T2=g*q;
  return mk({q:`${k.n} shared ${T2} marbles equally among ${g} friends. How many marbles did each friend get?`,zh:`${k.n} 把 ${T2} 颗弹珠平均分给 ${g} 个朋友。每人几颗？`,a:q,d:[[T2-g,'keyword','“平均分”要用除法。'],[T2+g,'keyword','“平均分”要用除法。'],[q+1,'calc']],ex:`平均分 → 除法：${T2} ÷ ${g} = ${q}。`});});
G('wp',T.times,1,1,()=>{const [x,y]=pick(PAIRS),a=ri(2,9),k=ri(3,6);
  return mk({q:`A ${x[0]} costs $${a}. A ${y[0]} costs ${k} times as much as the ${x[0]}. How much does the ${y[0]} cost?`,zh:`一${x[1]}${x[2]} $${a}。${y[2]}的价钱是${x[2]}的 ${k} 倍。${y[2]}多少钱？`,a:D(a*k),d:[[D(a+k),'keyword','“几倍”要用乘法，不是加。'],[D(a*k+a),'who','这是两样一共的价钱，题目只问'+y[2]+'。'],[D(a*(k-1)),'calc']],fill:{n:a*k,step:1,f:D},ex:`${k} times as much = ${k} 倍：$${a} × ${k} = $${a*k}。`});});
G('wp',T.cmp,1,.8,()=>{const [A,B]=two(),it=pick(STK),a=ri(15,60),d=ri(4,15);
  return mk({q:`${B.n} has ${a} ${it[0]}. ${A.n} has ${d} more ${it[0]} than ${B.n}. How many ${it[0]} does ${A.n} have?`,zh:`${B.n} 有 ${a} ${it[1]}。${A.n} 比 ${B.n} 多 ${d} ${it[1]}。${A.n} 有多少？`,a:a+d,d:[[a-d,'keyword',`${A.n} 比 ${B.n} 多，${A.n} 比较多，要加。`],[d,'who','这是多出来的，不是 '+A.n+' 有的。'],[a,'who']],fill:{n:a+d,step:1,f:S_},ex:`多 → ${A.n} 比较多：${a} + ${d} = ${a+d}。`});});
G('wp',T.wmon,1,.8,()=>{const k=kid(),T2=pick([10,20,50]),it=pick(ITEMS);let p;do{p=ri(21,(T2*100-150)/5|0)*5;}while(p%100===0);const ans=T2*100-p;
  return mk({q:`${k.n} had $${T2}. ${k.P} bought ${it[0]} for ${$c(p)}. How much money did ${k.p} have left?`,zh:`${k.n} 有 $${T2}，花 ${$c(p)} 买了${it[1]}。${k.z}还剩多少钱？`,a:$c(ans),d:[[$c(T2*100+p),'leftadd','花了钱会变少，要减。'],[$c(ans+100),'calc','借位：元那一位也要少 1。'],[$c(p),'who','这是花掉的，题目问还剩多少。'],[$c(ans+10),'calc']],fill:{n:ans,step:10,f:$c},ex:`还剩 → 减法：$${T2}.00 − ${$c(p)} = ${$c(ans)}。`});});

/* ================= WORD PROBLEMS: harder (single question) ================= */
G('wp',T.left,2,1.2,()=>{const k=kid(),v=ri(0,2);
  if(v===0){const it=pick([['muffins','个松饼'],['cookies','块饼干'],['cupcakes','个纸杯蛋糕'],['egg tarts','个蛋挞']]),made=ri(40,150),left=ri(8,made-15),ans=made-left;
    return mk({q:`${k.n} baked ${made} ${it[0]}. After selling some, ${k.p} had ${left} ${it[0]} left. How many ${it[0]} did ${k.p} sell?`,zh:`${k.n} 烤了 ${made} ${it[1]}，卖掉一些后还剩 ${left} ${it[1]}。${k.z}卖掉了多少？`,a:ans,d:[[made+left,'leftadd','卖掉的不会比做的还多。卖掉 = 做的 − 剩下的。'],[left,'who','这是剩下的，题目问卖掉多少。'],[made,'who']],fill:{n:ans,step:10,f:S_},ex:`卖掉的 = 做的 − 剩下的：${made} − ${left} = ${ans}。`});}
  if(v===1){const a=ri(60,240),u=ri(9,a-20),ans=a-u;
    return mk({q:`A shop had ${a} curry puffs. At the end of the day, ${u} curry puffs were unsold. How many curry puffs were sold?`,zh:`店里有 ${a} 个咖喱角，晚上还有 ${u} 个没卖出去（unsold）。卖出了多少个？`,a:ans,d:[[a+u,'leftadd','卖出的不会比原来的多。卖出 = 原来的 − 没卖出的。'],[u,'who','unsold 是没卖出去的，题目问卖出多少。']],fill:{n:ans,step:10,f:S_},ex:`unsold = 没卖出去的。卖出 = ${a} − ${u} = ${ans}。`});}
  const a=ri(120,480),b=ri(25,a-40),ans=a-b;
  return mk({q:`There were ${a} people in a hall. Then ${b} people left the hall. How many people were still in the hall?`,zh:`大厅里有 ${a} 人，后来 ${b} 人离开了（left the hall）。还剩多少人？`,a:ans,d:[[a+b,'leftadd','left the hall = 离开了大厅，人会变少，要减。'],[b,'who','这是离开的人，题目问还在大厅的。']],fill:{n:ans,step:10,f:S_},ex:`这里的 left 是“离开了”：${a} − ${b} = ${ans}。`});});
G('wp',T.pour,2,1,()=>{const k=kid(),Tl=pick([1,2,3]),each=pick([100,150,200,250,300,400]);let c;do{c=ri(2,6);}while(c*each>Tl*1000-100);const tot=Tl*1000,used=c*each,ans=tot-used,ml=x=>N(x)+' ml';
  return mk({q:`A jug had ${Tl} ℓ of water. ${k.n} filled ${c} cups with water from the jug. Each cup holds ${each} ml. How much water was left in the jug?`,zh:`水壶里有 ${Tl} ℓ 水。${k.n} 用壶里的水倒满了 ${c} 个杯子，每个杯子装 ${each} ml。壶里还剩多少水？`,a:ml(ans),d:[[ml(tot-each),'pour',`倒满的是 ${c} 个杯子：要先算 ${c} × ${each}，再减。`],[ml(used),'who','这是倒走的水，题目问剩下多少。'],[tot%c===0?ml(tot/c):ml(tot+used),tot%c===0?'pour':'leftadd',tot%c===0?'不是平均分：先乘，再减。':'倒走了会变少，要减。']],fill:{n:ans,step:50,f:ml},ex:`倒走的水 = ${c} × ${each} = ${N(used)} ml。${Tl} ℓ = ${N(tot)} ml，${N(tot)} − ${N(used)} = ${N(ans)} ml。`});});
G('wp',T.round,2,1,()=>{const k=kid(),m=pick([1,2]),tot=m*100,mat=pick(MAT),cm=x=>N(x)+' cm';
  if(Math.random()<.5){let s;do{s=pick([8,10,12,15,18,20,25]);}while(4*s>=tot-4);const used=4*s,ans=tot-used;
    return mk({q:`${k.n} had a piece of ${mat[0]} ${m} m long. ${k.P} used part of it to make a square with sides of ${s} cm. How much ${mat[0]} was left?`,zh:`${k.n} 有一根 ${m} m 长的${mat[1]}，用一部分围成边长 ${s} cm 的正方形。还剩多少？`,a:cm(ans),d:[[cm(tot-s),'perim','围一圈是 4 条边，不是 1 条。'],[tot-s*s>0?cm(tot-s*s):null,'perim','围成正方形用的是周长，不是面积。'],[cm(used),'who','这是用掉的，题目问剩下多少。'],[cm(m*10-s>0?m*10-s:used+5),'unit','1 m = 100 cm。']],fill:{n:ans,step:5,f:cm},ex:`围一圈 = 4 × ${s} = ${used} cm。${m} m = ${tot} cm，${tot} − ${used} = ${ans} cm。`});}
  let l,b;do{l=ri(10,40);b=ri(5,l-2);}while(2*(l+b)>=tot-4);const used=2*(l+b),ans=tot-used;
  return mk({q:`${k.n} had a piece of ${mat[0]} ${m} m long. ${k.P} used part of it to make a rectangle ${l} cm long and ${b} cm wide. How much ${mat[0]} was left?`,zh:`${k.n} 有一根 ${m} m 长的${mat[1]}，用一部分围成长 ${l} cm、宽 ${b} cm 的长方形。还剩多少？`,a:cm(ans),d:[[cm(tot-(l+b)),'perim','长方形一圈是 长 + 宽 + 长 + 宽。'],[tot-l*b>0?cm(tot-l*b):null,'perim','这是面积。围一圈用的是周长。'],[cm(used),'who','这是用掉的，题目问剩下多少。']],fill:{n:ans,step:2,f:cm},ex:`一圈 = ${l} + ${b} + ${l} + ${b} = ${used} cm。${tot} − ${used} = ${ans} cm。`});});
G('wp',T.ap,2,1,()=>{const s=ri(5,12),P=4*s,u=pick(['cm','m']);
  if(Math.random()<.5)return mk({q:`A square has a perimeter of ${P} ${u}. What is its area?`,zh:`正方形的周长是 ${P} ${u}。面积是多少？`,a:`${s*s} ${u}²`,d:[[`${P} ${u}²`,'perim','这是周长，不是面积。'],[`${s} ${u}²`,'step1','这是边长，还要算面积：边长 × 边长。'],[`${2*s} ${u}²`,'calc','面积 = 边长 × 边长。']],ex:`边长 = ${P} ÷ 4 = ${s} ${u}；面积 = ${s} × ${s} = ${s*s} ${u}²。`});
  const l=ri(6,14),b=ri(2,l-1),A=l*b;
  return mk({q:`A rectangle has an area of ${A} ${u}². Its length is ${l} ${u}. What is its breadth?`,zh:`长方形面积 ${A} ${u}²，长 ${l} ${u}。宽（breadth）是多少？`,a:`${b} ${u}`,d:[[`${A-l} ${u}`,'keyword','面积 = 长 × 宽，所以宽 = 面积 ÷ 长，不是减。'],[`${A+l} ${u}`,'keyword'],[`${b+1} ${u}`,'calc']],ex:`宽 = ${A} ÷ ${l} = ${b} ${u}。`});});
G('wp',T.sd,2,1,()=>{const [A,B]=two(),it=pick(STK),s=ri(8,40),d=ri(3,15),T2=2*s+d,big=Math.random()<.5,ans=big?s+d:s,who=big?A.n:B.n;
  return mk({q:`${A.n} and ${B.n} have ${T2} ${it[0]} altogether. ${A.n} has ${d} more ${it[0]} than ${B.n}. How many ${it[0]} does ${who} have?`,zh:`${A.n} 和 ${B.n} 一共有 ${T2} ${it[1]}。${A.n} 比 ${B.n} 多 ${d} ${it[1]}。${who} 有多少？`,a:ans,
    d:big?[[s,'who',`${s} 是 ${B.n} 的（少的那个）。题目问 ${A.n}，还要加回 ${d}。`],[T2-d,'step1','这是两份合起来，还要 ÷ 2。'],[Math.floor(T2/2),'keyword','不能直接平分，要先减掉多出来的。']]:[[s+d,'who',`${s+d} 是 ${A.n} 的（多的那个）。题目问 ${B.n}。`],[T2-d,'step1','这是两份合起来，还要 ÷ 2。'],[d,'who']],
    fill:{n:ans,step:1,f:S_},ex:`${T2} − ${d} = ${T2-d}（两份一样多的），${T2-d} ÷ 2 = ${s} 是 ${B.n} 的。${big?`${A.n} 多 ${d}：${s} + ${d} = ${s+d}。`:''}`});});
G('wp',T.cmp,2,1,()=>{const [A,B]=two(),it=pick(STK),a=ri(25,90),d=ri(5,20),more=Math.random()<.5,ans=more?a-d:a+d;
  return mk({q:`${A.n} has ${a} ${it[0]}. ${A.P} has ${d} ${more?'more':'fewer'} ${it[0]} than ${B.n}. How many ${it[0]} does ${B.n} have?`,zh:`${A.n} 有 ${a} ${it[1]}。${A.z}比 ${B.n} ${more?'多':'少'} ${d} ${it[1]}。${B.n} 有多少？`,a:ans,
    d:[[more?a+d:a-d,'keyword',more?`${A.n} 比 ${B.n} 多，说明 ${B.n} 比较少，要减。不是看到 more 就加。`:`${A.n} 比 ${B.n} 少，说明 ${B.n} 比较多，要加。`],[a,'who','这是 '+A.n+' 的。'],[d,'who','这是相差多少。']],fill:{n:ans,step:1,f:S_},
    ex:more?`${A.n} 多，${B.n} 少：${a} − ${d} = ${ans}。`:`${A.n} 少，${B.n} 多：${a} + ${d} = ${ans}。`});});
G('wp',T.times,2,1,()=>{const [x,y]=pick(PAIRS),a=ri(2,9),k=ri(3,6);
  if(Math.random()<.5)return mk({q:`A ${x[0]} costs $${a}. A ${y[0]} costs ${k} times as much as the ${x[0]}. How much more does the ${y[0]} cost than the ${x[0]}?`,zh:`一${x[1]}${x[2]} $${a}。${y[2]}的价钱是${x[2]}的 ${k} 倍。${y[2]}比${x[2]}贵多少？`,a:D(a*(k-1)),d:[[D(a*k),'who','这是'+y[2]+'的价钱，题目问贵多少。'],[D(a*(k+1)),'who','这是两样一共。'],[D(k-1),'step1']],fill:{n:a*(k-1),step:1,f:D},ex:`${x[2]} 1 份，${y[2]} ${k} 份，多 ${k-1} 份：$${a} × ${k-1} = $${a*(k-1)}。`});
  const T2=a*(k+1);return mk({q:`A ${x[0]} and a ${y[0]} cost $${T2} altogether. The ${y[0]} costs ${k} times as much as the ${x[0]}. How much does the ${y[0]} cost?`,zh:`一${x[1]}${x[2]}和一${y[1]}${y[2]}一共 $${T2}。${y[2]}是${x[2]}的 ${k} 倍。${y[2]}多少钱？`,a:D(a*k),d:[[D(a),'step1',`$${a} 是 1 份（${x[2]}），${y[2]}是 ${k} 份。`],[T2%k===0?D(T2/k):D(T2-k),'keyword',`一共是 ${k+1} 份，不是 ${k} 份。`],[D(T2),'who','这是两样一共。']],fill:{n:a*k,step:1,f:D},ex:`一共 ${k+1} 份：$${T2} ÷ ${k+1} = $${a}；${y[2]} = $${a} × ${k} = $${a*k}。`});});
G('wp',T.grp,2,.9,()=>{const k=kid(),g=pick([4,5,6]);let n;do{n=ri(17,58);}while(n%g===0);const q=Math.floor(n/g),r=n%g;
  if(Math.random()<.5)return mk({q:`${n} children are going on a trip. Each car can take ${g} children. What is the smallest number of cars needed?`,zh:`${n} 个孩子去旅行，每辆车坐 ${g} 人。最少要几辆车？`,a:q+1,d:[[q,'round',`还剩 ${r} 个孩子也要坐车，要多一辆。`],[`${q} R ${r}`,'round','车不能有余数：剩下的孩子要再坐一辆。'],[q+2,'calc']],ex:`${n} ÷ ${g} = ${q} R ${r}。剩下的 ${r} 个孩子也要坐车：${q} + 1 = ${q+1} 辆。`});
  return mk({q:`${k.n} has ${n} cupcakes. ${k.P} puts ${g} cupcakes in each box. How many boxes can ${k.p} fill completely?`,zh:`${k.n} 有 ${n} 个纸杯蛋糕，每盒装 ${g} 个。能装满几盒？`,a:q,d:[[q+1,'round',`剩下的 ${r} 个装不满一盒。`],[`${q} R ${r}`,'round','盒子数不写余数。'],[n-g,'keyword','“每盒装几个”要用除法。']],ex:`${n} ÷ ${g} = ${q} R ${r}。剩下 ${r} 个装不满，所以装满 ${q} 盒。`});});
G('wp',T.mass,2,.7,()=>{const kT=ri(2,5),gT=ri(1,8)*100+pick([0,50]),kP=ri(1,kT-1),gP=ri(Math.floor(gT/50)+1,19)*50,T2=kT*1000+gT,p=kP*1000+gP,ans=T2-p;
  return mk({q:`A bag of rice and a bag of sugar have a total mass of ${kgf(T2)}. The bag of rice has a mass of ${kgf(p)}. What is the mass of the bag of sugar?`,zh:`一袋米和一袋糖一共 ${kgf(T2)}。米重 ${kgf(p)}。糖有多重？`,a:kgf(ans),d:[[`${kT-kP} kg ${gP-gT} g`,'calc','不够减要借 1 kg = 1 000 g，不能倒过来减。'],[kgf(T2+p),'leftadd','一共的里面拿掉米，要减。'],[kgf(ans+1000),'calc'],[kgf(ans+100),'calc']],fill:{n:ans,step:100,f:kgf},ex:`都换成 g：${N(T2)} − ${N(p)} = ${N(ans)} g = ${kgf(ans)}。`});});
G('wp',T.wtime,2,1,()=>{const A=pick([['A movie','一部电影'],['A concert','一场音乐会'],['A swimming lesson','游泳课'],['A football match','一场足球赛']]);let t0,d,e;
  do{t0=pick([ri(96,138)*5,ri(156,210)*5]);d=ri(5,30)*5;e=t0+d;}while((t0<720&&e>=720)||e>=22*60||((d%60+t0%60)<60&&Math.random()<.6));
  const H=Math.floor(d/60),M=d%60;
  return mk({q:`${A[0]} started at ${t12(t0)}. It lasted ${dur(d)}. At what time did it end?`,zh:`${A[1]} ${t12(t0)} 开始，进行了 ${dur(d)}。几点结束？`,a:t12(e),d:[[t12(e-60),'time','分钟加起来满 60，要进 1 小时。'],[t12(e+60),'time'],[t12(e+10),'calc']],ex:H&&M?`先加 ${H} h → ${t12(t0+H*60)}，再加 ${M} min → ${t12(e)}。`:`${t12(t0)} 加 ${dur(d)} → ${t12(e)}。`});});
G('wp',T.wtime,2,.8,()=>{const k=kid(),A=pick([['reading','read','看书'],['drawing','draw','画画'],['practising the piano','practise','练琴'],['doing homework','work','做功课']]);let t0,d;
  do{t0=pick([ri(96,138)*5,ri(156,210)*5]);d=ri(5,33)*5;}while((t0<720&&t0+d>=720)||((t0%60+d%60)<60&&Math.random()<.6));const t1=t0+d;
  const a24=Math.floor(t1/60)*100+t1%60,b24=Math.floor(t0/60)*100+t0%60,x=a24-b24,nv=x%100>=60?`${Math.floor(x/100)} h ${x%100} min`:null,m1=(60-t0%60)%60;
  return mk({q:`${k.n} started ${A[0]} at ${t12(t0)} and stopped at ${t12(t1)}. How long did ${k.p} ${A[1]}?`,zh:`${k.n} ${t12(t0)} 开始${A[2]}，${t12(t1)} 停下。${k.z}${A[2]}了多久？`,a:dur(d),d:[[nv,'time','分钟不能超过 60：借 1 小时 = 60 分钟。'],[dur(d+15),'calc'],[dur(d>15?d-15:d+30),'calc'],[dur(d+60),'time']],ex:m1&&m1<d?`从 ${t12(t0)} 到 ${t12(t0+m1)} 是 ${m1} min，再到 ${t12(t1)} 是 ${dur(d-m1)}，一共 ${dur(d)}。`:`${t12(t0)} 到 ${t12(t1)} 是 ${dur(d)}。`});});
G('wp',T.len,2,.7,()=>{const k=kid(),m=ri(3,6),cut=ri(105,m*100-60),ans=m*100-cut;
  return mk({q:`${k.n} had a ribbon ${m} m long. ${k.P} cut off ${cut} cm. How long was the ribbon left, in centimetres?`,zh:`${k.n} 有一条 ${m} m 长的丝带，剪掉了 ${cut} cm。还剩多少 cm？`,a:`${ans} cm`,d:[[cut-m>0?`${cut-m} cm`:null,'unit',`${m} m 要先换成 ${m*100} cm，再减。`],[`${m*100+cut} cm`,'leftadd','剪掉了会变少，要减。'],[`${cut} cm`,'who','这是剪掉的，题目问剩下多少。']],fill:{n:ans,step:5,f:x=>x+' cm'},ex:`${m} m = ${m*100} cm。${m*100} − ${cut} = ${ans} cm。`});});
/* does the answer make sense? */
G('wp',T.sense,2,1,()=>{const k=kid(),v=ri(0,3),good=Math.random()<.45;
  if(v===0){const M=ri(150,320),L=ri(20,90),X=good?M-L:M+L;
    const q=`${k.n} baked ${M} buns and had ${L} left. ${k.P} says ${k.p} sold ${X} buns. Does this answer make sense?`,zh=`${k.n} 烤了 ${M} 个面包，剩下 ${L} 个。${k.z}说卖了 ${X} 个。这个答案说得通吗？`;
    return good?mk({q,zh,a:`Yes. ${X} is less than ${M}, and ${X} + ${L} = ${M}.`,az:`说得通。${X} 比 ${M} 少，而且 ${X} + ${L} = ${M}。`,d:[[`No. ${k.P} should add ${M} and ${L}.`,'leftadd','卖掉的不会比做的多，不能加。',`说不通，应该把 ${M} 和 ${L} 加起来。`],[`No. The answer must be bigger than ${M}.`,'sense','卖掉的不可能比做的还多。',`说不通，答案应该比 ${M} 大。`],[`No. ${k.P} should multiply.`,'keyword',null,'说不通，应该用乘法。']],ex:`卖掉的 + 剩下的 = 做的：${X} + ${L} = ${M}，说得通。`})
      :mk({q,zh,a:`No. ${k.P} cannot sell more buns than ${k.p} baked.`,az:'说不通，卖掉的不可能比做的还多。',d:[[`Yes. ${M} + ${L} = ${X}.`,'leftadd','剩下的要减，不是加。',`说得通，${M} + ${L} = ${X}。`],['Yes. It is a big number.','sense','答案大不代表对，要想想合不合理。','说得通，因为数字很大。'],[`No. ${k.P} should multiply.`,'keyword',null,'说不通，应该用乘法。']],ex:`只做了 ${M} 个，不可能卖出 ${X} 个。应该是 ${M} − ${L} = ${M-L}。`});}
  if(v===1){const Tl=2,c=3,each=250,tot=2000,X=good?tot-c*each:tot+c*each;
    const q=`A jug had 2 ℓ of water. ${k.n} filled 3 cups of 250 ml from the jug. ${k.P} says ${N(X)} ml of water was left. Does this make sense?`,zh=`壶里有 2 ℓ 水。${k.n} 倒满了 3 杯，每杯 250 ml。${k.z}说还剩 ${N(X)} ml。说得通吗？`;
    return good?mk({q,zh,a:'Yes. 3 × 250 = 750, and 2 000 − 750 = 1 250.',az:'说得通。3 × 250 = 750，2 000 − 750 = 1 250。',d:[['No. Water was added, so there should be more.','leftadd','倒出去了，水只会变少。','说不通，加了水，应该更多。'],['No. 2 000 − 250 = 1 750.','pour','倒满的是 3 杯，要先乘。','说不通，2 000 − 250 = 1 750。'],['No. The answer should be 2 ℓ.','sense',null,'说不通，答案应该是 2 ℓ。']],ex:'先算倒走的：3 × 250 = 750 ml，再减：2 000 − 750 = 1 250 ml。说得通。'})
      :mk({q,zh,a:'No. Water was poured out, so there should be less than 2 000 ml.',az:'说不通。水倒出去了，应该比 2 000 ml 少。',d:[['Yes. 2 000 + 750 = 2 750.','leftadd','倒出去会变少，要减。','说得通，2 000 + 750 = 2 750。'],['Yes. The number looks right.','sense','要想想：倒出去以后，水会比原来多吗？','说得通，数字看起来对。'],['No. 2 000 − 250 = 1 750.','pour','倒满的是 3 杯：3 × 250 = 750。','说不通，2 000 − 250 = 1 750。']],ex:'倒出去的水不可能让壶里的水变多。应该是 2 000 − 750 = 1 250 ml。'});}
  if(v===2){const q=`A movie started at 2.45 p.m. and lasted 1 h 30 min. ${k.n} says it ended at ${good?'4.15 p.m.':'3.75 p.m.'} Does this make sense?`,zh=`电影 2.45 p.m. 开始，放了 1 h 30 min。${k.n} 说 ${good?'4.15 p.m.':'3.75 p.m.'} 结束。说得通吗？`;
    return good?mk({q,zh,a:'Yes. 2.45 + 1 h = 3.45, then + 30 min = 4.15 p.m.',az:'说得通。2.45 加 1 小时是 3.45，再加 30 分钟是 4.15 p.m.。',d:[['No. It should be 3.75 p.m.','time','分钟最多到 59，满 60 要进 1 小时。','说不通，应该是 3.75 p.m.。'],['No. It should be 3.15 p.m.','time','先加 1 小时到 3.45，再加 30 分钟。','说不通，应该是 3.15 p.m.。'],['No. A movie cannot end in the afternoon.','sense',null,'说不通，电影不能在下午结束。']],ex:'2.45 p.m. + 1 h = 3.45 p.m.，再 + 30 min = 4.15 p.m.。'})
      :mk({q,zh,a:'No. There is no such time as 3.75. It should be 4.15 p.m.',az:'说不通。没有 3.75 这个时间，应该是 4.15 p.m.。',d:[['Yes. 2.45 + 1.30 = 3.75.','time','时间不能像小数那样加：分钟满 60 要进 1 小时。','说得通，2.45 + 1.30 = 3.75。'],['Yes. The movie is long.','sense',null,'说得通，电影很长。'],['No. It should be 3.15 p.m.','time','先加 1 小时到 3.45，再加 30 分钟。','说不通，应该是 3.15 p.m.。']],ex:'分钟最多到 59。3.45 再加 30 分钟 = 4.15 p.m.。'});}
  const n=pick([22,26,30,34,38]),g=4,q2=Math.floor(n/g),r=n%g,X=good?q2+1:q2;
  const q=`${n} children are going on a trip. Each car can take 4 children. ${k.n} says they need ${X} cars. Does this make sense?`,zh=`${n} 个孩子去旅行，每辆车坐 4 人。${k.n} 说要 ${X} 辆车。说得通吗？`;
  return good?mk({q,zh,a:`Yes. ${q2} cars take ${q2*4} children, and 1 more car takes the other ${r}.`,az:`说得通。${q2} 辆车坐 ${q2*4} 人，再 1 辆坐剩下的 ${r} 人。`,d:[[`No. ${n} ÷ 4 = ${q2} R ${r}, so ${q2} cars.`,'round','剩下的孩子也要坐车。',`说不通，${n} ÷ 4 = ${q2} R ${r}，所以 ${q2} 辆。`],[`No. ${n} − 4 = ${n-4} cars.`,'keyword',null,`说不通，${n} − 4 = ${n-4} 辆。`],['No. They need 4 cars.','who',null,'说不通，要 4 辆车。']],ex:`${n} ÷ 4 = ${q2} R ${r}，剩下 ${r} 个孩子还要 1 辆：${q2+1} 辆。`})
    :mk({q,zh,a:`No. ${q2} cars take only ${q2*4} children. ${r} children have no seat.`,az:`说不通。${q2} 辆车只坐得下 ${q2*4} 人，还有 ${r} 个孩子没位子。`,d:[[`Yes. ${n} ÷ 4 = ${q2} R ${r}.`,'round','余数代表还有孩子没坐上车。',`说得通，${n} ÷ 4 = ${q2} R ${r}。`],['Yes. The cars will be full.','sense',null,'说得通，车都坐满了。'],[`No. They need ${n} cars.`,'who',null,`说不通，要 ${n} 辆车。`]],ex:`剩下的 ${r} 个孩子也要坐车，所以要 ${q2+1} 辆。`});});

/* ================= WORD PROBLEMS: step by step (one problem, 2-3 small questions) ================= */
G('wp',T.sd,3,1,()=>{const [A,B]=two(),it=pick(STK),s=ri(8,40),d=ri(3,15),T2=2*s+d,big=Math.random()<.5,ans=big?s+d:s,who=big?A.n:B.n;
  return chain(`${A.n} and ${B.n} have ${T2} ${it[0]} altogether. ${A.n} has ${d} more ${it[0]} than ${B.n}. How many ${it[0]} does ${who} have?`,`${A.n} 和 ${B.n} 一共有 ${T2} ${it[1]}。${A.n} 比 ${B.n} 多 ${d} ${it[1]}。${who} 有多少？`,[
   {q:'Who has more?',qz:'第 1 步：谁比较多？',a:A.n,az:A.n,d:[[B.n,'keyword',`题目说 ${A.n} has ${d} more than ${B.n}：多的是 ${A.n}。`,B.n],['They have the same number.','keyword','一个比另一个多 '+d+'，不会一样多。','一样多'],['We cannot tell.','who',null,'看不出来']],ex:`“${A.n} has ${d} more than ${B.n}” → ${A.n} 比较多。`},
   {q:'What should you work out first?',qz:'第 2 步：先算什么？',a:`${T2} − ${d} = ${T2-d}`,d:[[`${T2} + ${d} = ${T2+d}`,'keyword','多出来的要先拿掉，是减。'],[`${T2} ÷ 2 = ${Math.floor(T2/2)}${T2%2?' R 1':''}`,'keyword',`不能直接平分，要先把多出来的 ${d} 拿掉。`],[`${T2} − ${d} − ${d} = ${T2-2*d}`,'calc','多出来的只拿掉一次。']],ex:`先把多出来的 ${d} 拿掉：${T2} − ${d} = ${T2-d}，剩下两份一样多。`},
   {q:`How many ${it[0]} does ${who} have?`,qz:`第 3 步：${who} 有多少？`,a:ans,d:big?[[s,'who',`${s} 是 ${B.n} 的。${A.n} 比较多，还要加回 ${d}。`],[T2-d,'step1','这是两份合起来，还要 ÷ 2。'],[s+2*d,'calc']]:[[s+d,'who',`${s+d} 是 ${A.n} 的。题目问 ${B.n}（少的那个）。`],[T2-d,'step1','这是两份合起来，还要 ÷ 2。'],[d,'who']],fill:{n:ans,step:1,f:S_},ex:`${T2-d} ÷ 2 = ${s}，这是 ${B.n} 的。${big?`${A.n} 多 ${d}：${s} + ${d} = ${s+d}。`:''}`}],[`${who} 有多少`,'两人一共有多少',`${big?B.n:A.n} 有多少`,`${A.n} 比 ${B.n} 多多少`]);});
G('wp',T.pour,3,1,()=>{const k=kid(),Tl=pick([1,2,3]),each=pick([150,200,250,300]);let c;do{c=ri(2,6);}while(c*each>Tl*1000-100);const tot=Tl*1000,used=c*each,ans=tot-used,ml=x=>N(x)+' ml';
  return chain(`A jug had ${Tl} ℓ of water. ${k.n} filled ${c} cups with water from the jug. Each cup holds ${each} ml. How much water was left in the jug?`,`水壶里有 ${Tl} ℓ 水。${k.n} 用壶里的水倒满了 ${c} 个杯子，每个杯子装 ${each} ml。壶里还剩多少水？`,[
   {q:'How much water was poured into the cups altogether?',qz:'第 1 步：倒进杯子的水一共多少？',a:ml(used),d:[[ml(each),'pour',`倒满的是 ${c} 个杯子：${c} × ${each}。`],[ml(c+each),'keyword','几个杯子、每杯多少，要用乘法。'],[tot%c===0?ml(tot/c):ml(used+each),'pour','不是平均分，是算倒走了多少。']],fill:{n:used,step:50,f:ml},ex:`${c} 杯 × ${each} ml = ${N(used)} ml。`},
   {q:'How much water was left in the jug?',qz:'第 2 步：壶里还剩多少水？',a:ml(ans),d:[[ml(tot-each),'pour',`倒走的是 ${N(used)} ml，不是一杯。`],[ml(tot+used),'leftadd','倒走了会变少，要减。'],[ml(used),'who','这是倒走的，题目问剩下多少。']],fill:{n:ans,step:50,f:ml},ex:`${Tl} ℓ = ${N(tot)} ml。${N(tot)} − ${N(used)} = ${N(ans)} ml。`}],['壶里还剩多少水','倒进杯子的水一共多少','每个杯子装多少水','壶里原来有多少水']);});
G('wp',T.round,3,1,()=>{const k=kid(),m=pick([1,2]),tot=m*100,mat=pick(MAT),cm=x=>N(x)+' cm';let s;do{s=pick([8,10,12,15,18,20,25]);}while(4*s>=tot-4);const used=4*s,ans=tot-used;
  return chain(`${k.n} had a piece of ${mat[0]} ${m} m long. ${k.P} bent part of it to make a square with sides of ${s} cm. How much ${mat[0]} was left?`,`${k.n} 有一根 ${m} m 长的${mat[1]}，用一部分围成边长 ${s} cm 的正方形。还剩多少？`,[
   {q:`${m} m = ___ cm`,qz:`第 1 步：${m} m 是多少 cm？`,a:cm(tot),d:[[cm(m*10),'unit','1 m = 100 cm。'],[cm(m*1000),'unit','1 m = 100 cm，不是 1 000 cm。'],[cm(m),'unit',`要换成 cm，才能和 ${s} cm 一起算。`]],ex:m===1?'1 m = 100 cm。':`1 m = 100 cm，所以 ${m} m = ${tot} cm。`},
   {q:'How much is used to make the square?',qz:'第 2 步：围正方形用了多少？',a:cm(used),d:[[cm(s),'perim','围一圈是 4 条边，不是 1 条。'],[cm(s*s),'perim','这是面积。围一圈用的是周长。'],[cm(2*s),'perim','正方形有 4 条边。']],ex:`围一圈 = 4 × ${s} = ${used} cm。`},
   {q:`How much ${mat[0]} was left?`,qz:'第 3 步：还剩多少？',a:cm(ans),d:[[cm(tot-s),'perim',`用掉的是 4 条边：${used} cm。`],[cm(used),'who','这是用掉的，题目问剩下多少。'],[cm(tot+used),'leftadd','用掉了会变少，要减。']],fill:{n:ans,step:5,f:cm},ex:`${tot} − ${used} = ${ans} cm。`}],[`还剩多少${mat[1]}`,'正方形的一条边多长',`围正方形用了多少${mat[1]}`,`原来的${mat[1]}有多长`]);});
G('wp',T.times,3,1,()=>{const [x,y]=pick(PAIRS),a=ri(3,12),k=ri(2,5),T2=a*(k+1);
  return chain(`A ${x[0]} and a ${y[0]} cost $${T2} altogether. The ${y[0]} costs ${k} times as much as the ${x[0]}. How much does the ${y[0]} cost?`,`一${x[1]}${x[2]}和一${y[1]}${y[2]}一共 $${T2}。${y[2]}的价钱是${x[2]}的 ${k} 倍。${y[2]}多少钱？`,[
   {q:`If the ${x[0]} is 1 unit, how many units are there altogether?`,qz:`第 1 步：${x[2]}是 1 份，一共有几份？`,a:`${k+1} units`,az:`${k+1} 份`,d:[[`${k} units`,'keyword',`${y[2]}是 ${k} 份，还要加上${x[2]}的 1 份。`,`${k} 份`],[`${k+2} units`,'calc',null,`${k+2} 份`],['1 unit','keyword',null,'1 份']],ex:`${x[2]} 1 份 + ${y[2]} ${k} 份 = ${k+1} 份。`},
   {q:'How much is 1 unit?',qz:'第 2 步：1 份是多少钱？',a:D(a),d:[[D(Math.floor(T2/k)),'keyword',`一共是 ${k+1} 份，要 ÷ ${k+1}，不是 ÷ ${k}。`],[D(T2-k),'keyword','几倍不是减。'],[D(a+1),'calc']],fill:{n:a,step:1,f:D},ex:`$${T2} ÷ ${k+1} = $${a}。`},
   {q:`How much does the ${y[0]} cost?`,qz:`第 3 步：${y[2]}多少钱？`,a:D(a*k),d:[[D(a),'step1',`$${a} 是 1 份，是${x[2]}的价钱。${y[2]}是 ${k} 份。`],[D(T2),'who','这是两样一共的。'],[D(a*k+k),'calc']],fill:{n:a*k,step:1,f:D},ex:`$${a} × ${k} = $${a*k}。`}],[`${y[2]}多少钱`,`${x[2]}多少钱`,'两样一共多少钱',`${y[2]}比${x[2]}贵多少`]);});
G('wp',T.ap,3,.8,()=>{const s=ri(5,12),P=4*s,u=pick(['cm','m']);
  return chain(`A square garden has a perimeter of ${P} ${u}. What is its area?`,`正方形花园的周长是 ${P} ${u}。面积是多少？`,[
   {q:'How long is one side?',qz:'第 1 步：一条边多长？',a:`${s} ${u}`,d:[[`${P/2} ${u}`,'perim','正方形有 4 条边，要 ÷ 4。'],[`${P} ${u}`,'step1','这是周长（4 条边加起来）。'],[`${s+4} ${u}`,'calc']],ex:`周长 ÷ 4：${P} ÷ 4 = ${s} ${u}。`},
   {q:'What is the area?',qz:'第 2 步：面积是多少？',a:`${s*s} ${u}²`,d:[[`${P} ${u}²`,'perim','这是周长的数，不是面积。'],[`${s*4} ${u}`,'perim',`面积 = 边长 × 边长，单位是 ${u}²。`],[`${s*2} ${u}²`,'calc','面积 = 边长 × 边长，不是 × 2。']],ex:`面积 = ${s} × ${s} = ${s*s} ${u}²。`}],['花园的面积是多少','花园的周长是多少','一条边有多长','花园有几条边']);});
G('wp',T.wmon,3,.8,()=>{const a=ri(12,40),d=ri(5,30),it=pick([[['shirt','件','衬衫'],['pair of shoes','双','鞋']],[['cap','顶','帽子'],['bag','个','包']],[['book','本','书'],['board game','盒','棋']]]);
  return chain(`A ${it[0][0]} costs $${a}. A ${it[1][0]} costs $${d} more than the ${it[0][0]}. How much do the two things cost altogether?`,`一${it[0][1]}${it[0][2]} $${a}。一${it[1][1]}${it[1][2]}比${it[0][2]}贵 $${d}。两样一共多少钱？`,[
   {q:`How much does the ${it[1][0]} cost?`,qz:`第 1 步：${it[1][2]}多少钱？`,a:D(a+d),d:[[a>d?D(a-d):null,'keyword',`贵 $${d} = 比${it[0][2]}多，要加。`],[D(d),'who',`$${d} 是贵多少，不是价钱。`],[D(2*a+d),'step1','这已经是两样一共了，这一步只问一样。']],fill:{n:a+d,step:1,f:D},ex:`$${a} + $${d} = $${a+d}。`},
   {q:'How much do the two things cost altogether?',qz:'第 2 步：两样一共多少钱？',a:D(2*a+d),d:[[D(a+d),'step1',`这只是${it[1][2]}的价钱，还要加上${it[0][2]}。`],[D(a+2*d),'calc'],[D(2*a),'who']],fill:{n:2*a+d,step:1,f:D},ex:`$${a} + $${a+d} = $${2*a+d}。`}],['两样一共多少钱',`${it[1][2]}多少钱`,`${it[1][2]}比${it[0][2]}贵多少`,`${it[0][2]}多少钱`]);});
G('wp',T.left,3,1,()=>{const k=kid(),a=ri(40,90),b=ri(30,80),la=ri(5,a-20),lb=ri(5,b-20),sa=a-la,sb=b-lb,tot=sa+sb;
  return chain(`${k.n} made ${a} curry puffs and ${b} sardine puffs. At the end of the day, ${la} curry puffs and ${lb} sardine puffs were left. How many puffs did ${k.p} sell altogether?`,`${k.n} 做了 ${a} 个咖喱角和 ${b} 个沙丁鱼角。晚上还剩 ${la} 个咖喱角和 ${lb} 个沙丁鱼角。${k.z}一共卖了多少个？`,[
   {q:'How many curry puffs were sold?',qz:'第 1 步：卖了多少个咖喱角？',a:sa,d:[[a+la,'leftadd','卖掉的不会比做的多。卖掉 = 做的 − 剩下的。'],[la,'who','这是剩下的。'],[a,'who','这是做的。']],fill:{n:sa,step:10,f:S_},ex:`${a} − ${la} = ${sa}。`},
   {q:'How many sardine puffs were sold?',qz:'第 2 步：卖了多少个沙丁鱼角？',a:sb,d:[[b+lb,'leftadd','卖掉 = 做的 − 剩下的。'],[lb,'who','这是剩下的。'],[b,'who','这是做的。']],fill:{n:sb,step:10,f:S_},ex:`${b} − ${lb} = ${sb}。`},
   {q:'How many puffs were sold altogether?',qz:'第 3 步：一共卖了多少个？',a:tot,d:[[a+b,'who','这是一共做了多少。'],[la+lb,'who','这是一共剩下多少。'],[sa,'step1','这只是咖喱角，还要加上沙丁鱼角。']],fill:{n:tot,step:10,f:S_},ex:`${sa} + ${sb} = ${tot}。`}],[`${k.z}一共卖了多少个`,'一共做了多少个','一共剩下多少个','卖了多少个咖喱角']);});
G('wp',T.wtime,3,.9,()=>{const k=kid();let t0,g,mv,t1,t2;do{t0=ri(156,186)*5;g=ri(3,8)*5;mv=ri(18,26)*5;t1=t0+g;t2=t1+mv;}while(t2>=21*60||((t0%60+g)<60&&Math.random()<.7));
  return chain(`${k.n} left home at ${t12(t0)}. ${k.P} took ${g} minutes to reach the cinema. The movie started as soon as ${k.p} arrived and lasted ${dur(mv)}. At what time did the movie end?`,`${k.n} ${t12(t0)} 出门，走了 ${g} 分钟到电影院。${k.z}一到电影就开始，放了 ${dur(mv)}。电影几点结束？`,[
   {q:`At what time did ${k.n} reach the cinema?`,qz:`第 1 步：${k.n} 几点到电影院？`,a:t12(t1),d:[[t12(t0),'who','这是出门的时间。'],[t12(t1-60),'time','分钟满 60 要进 1 小时。'],[t12(t1+10),'calc']],ex:`${t12(t0)} + ${g} min = ${t12(t1)}。`},
   {q:'At what time did the movie end?',qz:'第 2 步：电影几点结束？',a:t12(t2),d:[[t12(t0+mv),'time',`漏了路上的 ${g} 分钟：电影是到了以后才开始的。`],[t12(t2-60),'time','先加小时，再加分钟；分钟满 60 进 1 小时。'],[t12(t2+10),'calc']],ex:`${t12(t1)} + ${dur(mv)} = ${t12(t2)}。`}],['电影几点结束','电影几点开始','电影放了多久',`${k.n} 几点出门`]);});

/* ================= P4 PREVIEW ================= */
G('p4',T.p4n,1,1,()=>{let s;do{s=S_(ri(10000,99999));}while(new Set(s).size<5||s.includes('0'));const n=+s,pos=ri(0,4),d=+s[pos],v=d*10**(4-pos),zpl=['万','千','百','十','个'][pos];
  return mk({q:`In ${N(n)}, the digit ${d} stands for ___.`,zh:`在 ${N(n)} 里，数字 ${d} 代表多少？`,a:N(v),d:[d,d*10,d*100,d*1000,d*10000].filter(x=>x!==v).slice(0,4).map(x=>[N(x),'place','从右往左数：个、十、百、千、万。']),ex:`${d} 在${zpl}位，代表 ${N(v)}。`});});
G('p4',T.p4n,2,1,()=>{const th=ri(11,99),h=Math.random()<.4?0:ri(1,9),r=Math.random()<.3?ri(1,9):ri(10,99),n=th*1000+h*100+r,s=S_(n);
  const w=`${w2(th)} thousand${h?', '+ONES[h]+' hundred':''}${r?' and '+w2(r):''}`;
  const ps=shuf(perms(s).filter(x=>x[0]!=='0'&&x!==s)).slice(0,2).map(x=>[N(+x),'place','对照每一位：万、千、百、十、个。']);
  return mk({q:`Write in numerals: ${w}`,zh:`把这个数写成数字：${w}`,a:N(n),d:[[N(th*100+(h?h*10:0)+r%10),'place','没有的位要写 0。'],...ps,[N(th*10000+h*100+r),'place',`“${w2(th)} thousand” 是 ${N(th*1000)}。`]],ex:`${w2(th)} thousand = ${N(th*1000)}${h?`，${ONES[h]} hundred = ${h*100}`:''}${r?`，再加 ${r}`:''} → ${N(n)}。没有的位写 0。`});});
G('p4',T.p4n,1,.7,()=>{let s;do{s=S_(ri(10000,99999));}while(new Set(s).size<5);const four=shuf(perms(s).filter(x=>x[0]!=='0')).slice(0,4).map(Number),g=Math.random()<.5,ans=g?Math.max(...four):Math.min(...four);
  return mk({q:`Which number is the ${g?'greatest':'smallest'}?`,zh:`哪个数${g?'最大':'最小'}？`,a:N(ans),d:four.filter(x=>x!==ans).map(x=>[N(x),'place','先比最高位（万位），一样再比下一位。']),ex:`先比万位，一样再比千位……${g?'最大':'最小'}的是 ${N(ans)}。`});});
G('p4',T.p4r,2,1,()=>{const pl=pick([10,100,1000]);let n;do{n=ri(1000,99999);}while(n%pl===pl/2||n%pl===0);const r=Math.round(n/pl)*pl,other=r>n?Math.floor(n/pl)*pl:Math.ceil(n/pl)*pl,nm={10:'ten',100:'hundred',1000:'thousand'}[pl],zm={10:'十',100:'百',1000:'千'}[pl];
  return mk({q:`Round ${N(n)} to the nearest ${nm}.`,zh:`把 ${N(n)} 四舍五入到最接近的${zm}。`,a:N(r),d:[[N(other),'place',`看${zm}位的下一位：5 或以上进一，4 或以下舍去。`],[pl<1000?N(Math.round(n/(pl*10))*pl*10):N(Math.round(n/100)*100),'place','看清楚是四舍五入到哪一位。'],[N(Math.trunc(n/pl)*pl+pl*2),'calc']],fill:{n:r,step:pl,f:N},ex:`看${zm}位后面那一位（${{10:'个',100:'十',1000:'百'}[pl]}位），是 ${Math.floor(n%pl/(pl/10))}：${Math.floor(n%pl/(pl/10))>=5?'5 或以上，进一':'4 或以下，舍去'} → ${N(r)}。`});});
G('p4',T.p4f,1,1,()=>{const n=pick([12,18,20,24,30,36,40,42,48]),fs=[];for(let i=2;i<n;i++)if(n%i===0)fs.push(i);const f=pick(fs);const non=shuf([5,7,9,11,13,14,16,25,27,32].filter(x=>n%x!==0&&x<n)).slice(0,2);
  if(Math.random()<.5)return mk({q:`Which of these is a factor of ${n}?`,zh:`哪一个是 ${n} 的因数？`,a:f,d:[...non.map(x=>[x,'calc',`${n} ÷ ${x} 有余数，所以 ${x} 不是因数。`]),[n*2,'fm',`${n*2} 是 ${n} 的倍数，不是因数。因数比 ${n} 小（或等于）。`]],ex:`${n} ÷ ${f} = ${n/f}，没有余数，所以 ${f} 是 ${n} 的因数。`});
  const k=pick([3,4,6,7,8]),m=k*ri(3,9);
  return mk({q:`Which of these is a multiple of ${k}?`,zh:`哪一个是 ${k} 的倍数？`,a:m,d:[[m+1,'calc',`${m+1} ÷ ${k} 有余数。`],[m-2,'calc'],[k===8?2:k===6?3:1,'fm',`这是 ${k} 的因数，不是倍数。倍数是 ${k} × 几。`]],ex:`${k} × ${m/k} = ${m}，所以 ${m} 是 ${k} 的倍数。`});});
G('p4',T.p4f,2,.9,()=>{const v=ri(0,3);
  if(v===3){const [x,y]=pick([[12,18],[16,24],[12,20],[18,27],[15,25],[20,30],[24,36],[14,21]]),fx=[],fy=[];for(let i=2;i<=y;i++){if(x%i===0)fx.push(i);if(y%i===0)fy.push(i);}
    const cf=fx.filter(i=>fy.includes(i)),a=pick(cf),ox=fx.filter(i=>!fy.includes(i)),oy=fy.filter(i=>!fx.includes(i));
    return mk({q:`Which of these is a common factor of ${x} and ${y}?`,zh:`哪一个是 ${x} 和 ${y} 的公因数？`,a,d:[[pick(ox),'fm',`它只是 ${x} 的因数，不是 ${y} 的因数。`],[pick(oy),'fm',`它只是 ${y} 的因数，不是 ${x} 的因数。`],[x*y/gcd(x,y),'fm','这是公倍数，不是公因数。']],ex:`${x} ÷ ${a} = ${x/a}，${y} ÷ ${a} = ${y/a}，都没有余数，所以 ${a} 是公因数。`});}
  if(v===0){const n=pick([24,30,36,40,48]);let x;do{x=ri(5,n-1);}while(n%x===0);const fs=[];for(let i=2;i<n;i++)if(n%i===0)fs.push(i);const ds=shuf(fs).slice(0,3);
    return mk({q:`Which of these is NOT a factor of ${n}?`,zh:`哪一个“不是” ${n} 的因数？`,a:x,d:ds.map(y=>[y,'calc',`${n} ÷ ${y} = ${n/y}，没有余数，${y} 是因数。题目问的是“不是”。`]),ex:`${n} ÷ ${x} 有余数，所以 ${x} 不是 ${n} 的因数。`});}
  if(v===1){const [a,b,c]=pick([[4,6,12],[3,4,12],[2,5,10],[3,5,15],[4,10,20],[6,8,24]]),m=c*pick([1,2]);
    return mk({q:`Which of these is a common multiple of ${a} and ${b}?`,zh:`哪一个是 ${a} 和 ${b} 的公倍数？`,a:m,d:[[a*b+a!==m?a*b+a:a*3,'fm',`要同时是 ${a} 的倍数和 ${b} 的倍数。`],[b*(a+1)!==m&&(b*(a+1))%a!==0?b*(a+1):b*5+1,'fm',`要同时是 ${a} 和 ${b} 的倍数。`],[a+b,'keyword','公倍数不是把两个数加起来。']],ex:`${m} ÷ ${a} = ${m/a}，${m} ÷ ${b} = ${m/b}，都没有余数。`});}
  const n=pick([12,16,18,20,24,30]),fs=[];for(let i=1;i<=n;i++)if(n%i===0)fs.push(i);
  return mk({q:`How many factors does ${n} have?`,zh:`${n} 有几个因数？`,a:fs.length,d:[[fs.length-2,'fm','别忘了 1 和它自己也是因数。'],[fs.length-1,'fm','1 和它自己都要算。'],[fs.length+1,'calc']],fill:{n:fs.length,step:1,f:S_},ex:`${n} 的因数：${fs.join('、')}，一共 ${fs.length} 个。`});});
G('p4',T.p4m,1,1,()=>{const b=ri(3,9),a=ri(1012,Math.floor(99999/b)),p=a*b;
  return mk({q:`${N(a)} × ${b} = ___`,a:N(p),d:[[N(mulNoCarry(a,b)),'calc','每一位乘完要加上进位。'],[N(p+100),'calc'],[N(p-10),'calc']],fill:{n:p,step:1000,f:N},ex:`从个位乘起，记得进位：${N(a)} × ${b} = ${N(p)}`});});
G('p4',T.p4m,2,1,()=>{const a=ri(102,499),b=ri(12,39),t=Math.floor(b/10),o=b%10,p=a*b;
  return mk({q:`${a} × ${b} = ___`,a:N(p),d:[[N(a*t+a*o),'place',`乘十位上的 ${t} 时，其实是乘 ${t*10}，结果后面要补 0。`],[N(a*o+a*t*100),'place','十位乘出来只要往左移一位。'],[N(p+a),'calc']],fill:{n:p,step:100,f:N},ex:`${a} × ${o} = ${N(a*o)}；${a} × ${t*10} = ${N(a*t*10)}；加起来 = ${N(p)}。`});});
const ANG=[
 ['A right angle is ___.','直角是多少度？',['90°','180°','45°','360°'],'直角 = 90°。',1],
 ['The angle on a straight line is ___.','一条直线（平角）是多少度？',['180°','90°','360°','100°'],'直线上的角 = 180°。',1],
 ['A complete turn is ___.','转一整圈是多少度？',['360°','180°','90°','100°'],'一整圈 = 360°。',1],
 ['A half turn is ___.','转半圈是多少度？',['180°','90°','360°','50°'],'半圈 = 180°。',1],
 ['A quarter turn is ___.','转四分之一圈是多少度？',['90°','45°','180°','25°'],'四分之一圈 = 90°。',1],
 ['Which angle is an acute angle?','哪一个是锐角？',['35°','90°','120°','180°'],'比 90° 小的是锐角（acute）。',1],
 ['Which angle is an obtuse angle?','哪一个是钝角？',['130°','60°','90°','30°'],'比 90° 大、比 180° 小的是钝角（obtuse）。',1],
 ['An angle of 150° is ___.','150° 的角是什么角？',['an obtuse angle','an acute angle','a right angle','a straight angle'],'150° 比 90° 大、比 180° 小 → 钝角。',2],
 ['An angle of 89° is ___.','89° 的角是什么角？',['an acute angle','a right angle','an obtuse angle','a straight angle'],'89° 比 90° 小一点点 → 还是锐角。',2],
 ['Two angles make a straight line. One is 70°. What is the other?','两个角合起来是一条直线。一个是 70°，另一个是多少？',['110°','20°','290°','70°'],'直线 = 180°：180° − 70° = 110°。',2],
 ['How many right angles make a complete turn?','几个直角合起来是一整圈？',['4','2','3','360'],'90° × 4 = 360°。',2],
 ['Which tool do we use to measure an angle?','量角要用什么工具？',['a protractor','a ruler','a weighing scale','a thermometer'],'量角器（protractor）。',1],
];
[1,2].forEach(l=>{const sub=ANG.filter(x=>x[4]===l);G('p4',T.p4a,l,.9,()=>{const [q,zh,o,ex]=pick(sub);return mk({q,zh,a:o[0],d:o.slice(1).map(x=>[x,'place']),ex});});});
G('p4',T.p4t,2,1,()=>{const names=shuf(['Ali','Siti','Ben','Mei','Ravi','Farah']).slice(0,4),it=pick([['books read','读的书','books'],['laps swum','游的圈数','laps'],['stickers collected','收集的贴纸','stickers']]),vals=shuf([...Array(30)].map((_,i)=>i+5)).slice(0,4);
  const p=`The table shows the number of ${it[0]} by four children.\n`+names.map((n,i)=>`${n}: ${vals[i]}`).join('\n'),pz=`表格是四个孩子${it[1]}的数量：`+names.map((n,i)=>`${n} ${vals[i]}`).join('，')+'。';
  const v=ri(0,2),mx=vals.indexOf(Math.max(...vals)),mn=vals.indexOf(Math.min(...vals));
  if(v===0){const g=Math.random()<.5,i=g?mx:mn;return mk({p,q:`Who has the ${g?'most':'fewest'} ${it[2]}?`,zh:pz+`\n\n谁的最${g?'多':'少'}？`,a:names[i],d:names.filter((_,j)=>j!==i).map(n=>[n,'who','看清楚题目问最多还是最少。']),ex:`${names[i]} 有 ${vals[i]}，是最${g?'多':'少'}的。`});}
  if(v===1){const [i,j]=shuf([0,1,2,3]).slice(0,2),hi=vals[i]>vals[j]?i:j,lo=hi===i?j:i;return mk({p,q:`How many more ${it[2]} does ${names[hi]} have than ${names[lo]}?`,zh:pz+`\n\n${names[hi]} 比 ${names[lo]} 多多少？`,a:vals[hi]-vals[lo],d:[[vals[hi]+vals[lo],'keyword','“多多少”要用减法。'],[vals[hi],'who','这是 '+names[hi]+' 的数量。'],[vals[lo],'who']],fill:{n:vals[hi]-vals[lo],step:1,f:S_},ex:`${vals[hi]} − ${vals[lo]} = ${vals[hi]-vals[lo]}。`});}
  const tot=vals.reduce((a,b)=>a+b,0);return mk({p,q:`How many ${it[2]} do the four children have altogether?`,zh:pz+'\n\n四个孩子一共多少？',a:tot,d:[[tot-vals[0],'step1','四个人都要加上。'],[Math.max(...vals),'who'],[tot+10,'calc']],fill:{n:tot,step:1,f:S_},ex:`${vals.join(' + ')} = ${tot}。`});});
G('p4',T.p4fr,2,1,()=>{const v=ri(0,2);
  if(v===2){const n=pick([1,2,3]),ds=shuf([4,5,6,7,8,9,10,12]).slice(0,4),g=Math.random()<.5,ad=g?Math.min(...ds):Math.max(...ds);
    return mk({q:`Which fraction is the ${g?'greatest':'smallest'}?`,zh:`哪一个分数${g?'最大':'最小'}？`,a:`${n}/${ad}`,d:ds.filter(d=>d!==ad).map(d=>[`${n}/${d}`,'frac','分子一样时，分母越大，每一份越小。']),ex:`分子都是 ${n}。分母越小，每一份越大，所以${g?'最大':'最小'}的是 ${n}/${ad}。`});}
  if(v===0){const b=pick([3,4,5,6,8]),w=ri(1,3);let a;do{a=ri(1,b-1);}while(gcd(a,b)>1);const top=w*b+a;return mk({q:`Write ${top}/${b} as a mixed number.`,zh:`把 ${top}/${b} 写成带分数。`,a:`${w} ${a}/${b}`,d:[[`${a} ${w}/${b}`,'frac','整数部分是 '+top+' ÷ '+b+' 的商。'],[`${w+1} ${a}/${b}`,'calc'],[`${w} ${b-a}/${b}`,'frac','余数才是新的分子。'],[`${w+2} ${a}/${b}`,'calc'],[`${w} ${a}/${b+1}`,'frac','分母不变。']],ex:`${top} ÷ ${b} = ${w} 余 ${a}，所以 ${top}/${b} = ${w} ${a}/${b}。`});}
  if(v===1){const b=pick([3,4,5,6,8]),w=ri(1,3);let a;do{a=ri(1,b-1);}while(gcd(a,b)>1);const top=w*b+a;return mk({q:`Write ${w} ${a}/${b} as an improper fraction.`,zh:`把 ${w} ${a}/${b} 写成假分数。`,a:`${top}/${b}`,d:[[`${w+a}/${b}`,'frac',`整数 ${w} 要先变成 ${w*b}/${b}，再加 ${a}/${b}。`],[`${w*a}/${b}`,'frac'],[`${top}/${b+w}`,'frac','分母不变。'],[`${top+1}/${b}`,'calc'],[`${top-1}/${b}`,'calc']],ex:`${w} = ${w*b}/${b}，${w*b}/${b} + ${a}/${b} = ${top}/${b}。`});}
  const b=pick([3,4,5]),n=b*ri(3,8),a=ri(1,b-1),one=n/b;return mk({q:`What is ${a}/${b} of ${n}?`,zh:`${n} 的 ${a}/${b} 是多少？`,a:one*a,d:[[one,'step1',`${one} 是 1/${b}，题目问的是 ${a}/${b}，还要 × ${a}。`],[n*a,'frac',`要先 ÷ ${b}。`],[n-a,'keyword']],fill:{n:one*a,step:1,f:S_},ex:`${n} ÷ ${b} = ${one}（1 份），× ${a} = ${one*a}。`});});

/* ---- more of 4A: patterns, division, line graphs, fractions (II), angles and shapes with pictures ---- */
const DAYS=['Mon','Tue','Wed','Thu','Fri'],DAYZ=['星期一','星期二','星期三','星期四','星期五'];
function frS(n,d){const g=gcd(n,d);n/=g;d/=g;if(n%d===0)return S_(n/d);if(n>d)return `${Math.floor(n/d)} ${n%d}/${d}`;return `${n}/${d}`;}
function lineG(vals,xl){const SW=300,SH=190,L=40,B=30,T0=12,R=16,mx=Math.ceil(Math.max(...vals)/10)*10+10,sy=(SH-B-T0)/mx,sx=(SW-L-R)/(vals.length-1);let o='';
  for(let v=0;v<=mx;v+=10){const y=SH-B-v*sy;o+=`<line x1="${L}" y1="${y.toFixed(1)}" x2="${SW-R}" y2="${y.toFixed(1)}" class="fg-g"/><text x="${L-6}" y="${(y+4).toFixed(1)}" text-anchor="end" class="fg-s">${v}</text>`;}
  xl.forEach((t,i)=>{o+=`<text x="${(L+i*sx).toFixed(1)}" y="${SH-B+18}" text-anchor="middle" class="fg-s">${t}</text>`;});
  const pts=vals.map((v,i)=>[(L+i*sx).toFixed(1),(SH-B-v*sy).toFixed(1)]);
  o+=`<line x1="${L}" y1="${T0-4}" x2="${L}" y2="${SH-B}" class="fg-ax"/><line x1="${L}" y1="${SH-B}" x2="${SW-R}" y2="${SH-B}" class="fg-ax"/><polyline points="${pts.map(p=>p.join(',')).join(' ')}" class="fg-ln"/>`+pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" class="fg-pt"/>`).join('');
  return `<svg viewBox="0 0 ${SW} ${SH}" role="img" aria-label="line graph">${o}</svg>`;}
/* angles side by side: [degrees, arm length, label] */
function angG(list){const mxl=Math.max(...list.map(a=>a[1])),w=2*mxl+20,H=mxl+50,y0=mxl+16;let o='';
  list.forEach(([dg,len,lab],i)=>{const x0=i*w+w/2-(list.length===1?mxl/2:0),r=dg*Math.PI/180,x2=x0+len*Math.cos(r),y2=y0-len*Math.sin(r);
    o+=`<path d="M${(x0+len).toFixed(1)} ${y0}L${x0.toFixed(1)} ${y0}L${x2.toFixed(1)} ${y2.toFixed(1)}" class="fg-ang"/>`;
    o+=dg===90?`<path d="M${(x0+12).toFixed(1)} ${y0}V${y0-12}H${x0.toFixed(1)}" class="fg-ax"/>`:`<path d="M${(x0+16).toFixed(1)} ${y0}A16 16 0 0 0 ${(x0+16*Math.cos(r)).toFixed(1)} ${(y0-16*Math.sin(r)).toFixed(1)}" class="fg-arc"/>`;
    if(lab)o+=`<text x="${x0.toFixed(1)}" y="${H-6}" text-anchor="middle" class="fg-l">${lab}</text>`;});
  return `<svg viewBox="0 0 ${list.length*w} ${H}" role="img" aria-label="angles">${o}</svg>`;}
const RCN=(xs,ys,lab)=>xs.map((x,i)=>`<text x="${x}" y="${ys[i]}" text-anchor="middle" class="fg-l">${lab[i]}</text>`).join('');

/* Ch1 number patterns */
G('p4',T.p4pat,1,1,()=>{const st=pick([10,100,1000]),up=Math.random()<.7,sg=up?1:-1,s0=up?ri(10000,99999-4*st):ri(10000+4*st,99999),seq=[0,1,2,3,4].map(i=>s0+sg*i*st),bi=ri(1,4),a=seq[bi],show=seq.map((x,i)=>i===bi?'___':N(x)).join(', ');
  return mk({p:show,q:'What is the missing number?',zh:`找规律，空格里是几？\n${show}`,a:N(a),d:[[N(a+sg*st*10),'place','看清楚每次变的是哪一位。'],[N(a+sg*st/10),'place','看清楚每次变的是哪一位。'],[N(seq[bi-1]-sg*st),'calc',`这串数是越来越${up?'大':'小'}的。`]],fill:{n:a,step:st,f:N},ex:`每次${up?'多':'少'} ${N(st)}：${N(seq[bi-1])} ${up?'+':'−'} ${N(st)} = ${N(a)}。`});});
G('p4',T.p4pat,2,1,()=>{
  if(Math.random()<.5){const x=pick([10,100,1000,10000]),more=Math.random()<.5;let n;do{n=ri(10000,89999);}while(!more&&n-x<10000);const a=more?n+x:n-x,xz={10:'十',100:'百',1000:'千',10000:'万'}[x];
    return mk({q:`What is ${N(x)} ${more?'more':'less'} than ${N(n)}?`,zh:`比 ${N(n)} ${more?'多':'少'} ${N(x)} 的数是多少？`,a:N(a),d:[[N(more?n-x:n+x),'keyword',`“${more?'more than':'less than'}”是${more?'加':'减'}。`],[N(more?n+x*10:n-x*10),'place',`只改${xz}位。`],[N(more?n+x/10:n-x/10),'place',`只改${xz}位。`]],fill:{n:a,step:x,f:N},ex:`${more?'多':'少'} ${N(x)}，就是${xz}位${more?'加':'减'} 1：${N(n)} ${more?'+':'−'} ${N(x)} = ${N(a)}。`});}
  const st=pick([200,250,500,2000,5000]),up=Math.random()<.6,sg=up?1:-1,s0=up?ri(10,60)*1000+pick([0,100,500]):ri(50,95)*1000,seq=[0,1,2,3,4].map(i=>s0+sg*i*st),bi=ri(2,4),a=seq[bi],show=seq.map((x,i)=>i===bi?'___':N(x)).join(', ');
  return mk({p:show,q:'What is the missing number?',zh:`找规律，空格里是几？\n${show}`,a:N(a),d:[[N(seq[bi-1]+sg*st*2),'calc','先看前两个数差多少。'],[N(seq[bi-1]+sg*Math.round(st/2)),'calc','先看前两个数差多少。'],[N(seq[bi-1]-sg*st),'calc',`这串数是越来越${up?'大':'小'}的。`]],fill:{n:a,step:st,f:N},ex:`前后两个数差 ${N(st)}，每次${up?'多':'少'} ${N(st)}：${N(seq[bi-1])} ${up?'+':'−'} ${N(st)} = ${N(a)}。`});});

/* Ch3 division by a 1-digit number */
G('p4',T.p4d,1,1,()=>{const b=ri(2,9);let qn;do{qn=Math.random()<.5?ri(1,19)*100+ri(1,9):ri(102,1999);}while(qn*b<1000||qn*b>9999);const a=qn*b,dz=+S_(qn).replace(/0/g,'');
  return mk({q:`${N(a)} ÷ ${b} = ___`,zh:`${N(a)} ÷ ${b} 等于多少？`,a:N(qn),d:[dz!==qn?[N(dz),'place','有一位不够除时，商要写 0，不能漏。']:[N(qn+10),'calc'],[N(qn+1),'calc'],[N(qn-10),'calc'],[N(qn*10),'place','先看最高位够不够除，商的位数才对。']],fill:{n:qn,step:1,f:N},ex:`${N(a)} ÷ ${b} = ${N(qn)}。检查：${N(qn)} × ${b} = ${N(a)}。`});});
G('p4',T.p4d,2,1,()=>{const b=ri(3,9);let qn;do{qn=ri(102,1999);}while(qn*b+b>9999||qn*b<1000);const r=ri(1,b-1),a=qn*b+r,RR=(x,y)=>`${N(x)} R ${y}`;
  return mk({q:`${N(a)} ÷ ${b} = ___ (R = remainder)`,zh:`${N(a)} ÷ ${b} 等于多少？R 表示余数。`,a:RR(qn,r),d:[[RR(qn-1,r+b),'round',`余数 ${r+b} 比除数 ${b} 大，说明还能再分一次。余数一定要比除数小。`],[RR(qn+1,r),'calc'],[RR(qn,b-r),'calc'],[N(qn),'step1','还有余数没写。']],ex:`${N(qn)} × ${b} = ${N(qn*b)}，${N(a)} − ${N(qn*b)} = ${r}，所以是 ${RR(qn,r)}。余数 ${r} 比 ${b} 小。`});});

/* Ch4 line graphs */
const LGI=[['cups of juice sold','卖出的果汁','cups'],['visitors to a library','图书馆的访客','visitors'],['books borrowed','借出的书','books']];
G('p4',T.p4t,1,1,()=>{const it=pick(LGI),vals=shuf([10,20,30,40,50,60,70]).slice(0,5),fig=lineG(vals,DAYS),p=`The line graph shows the number of ${it[0]} from Monday to Friday.`,pz=`折线图是星期一到星期五${it[1]}的数量。`;
  if(Math.random()<.5){const g=Math.random()<.5,i=vals.indexOf(g?Math.max(...vals):Math.min(...vals));
    return mk({p,fig,q:`On which day were there the ${g?'most':'fewest'} ${it[2]}?`,zh:pz+`\n\n哪一天最${g?'多':'少'}？`,a:DAYS[i],az:DAYZ[i],d:shuf(DAYS.map((d,j)=>[d,'who',`问的是最${g?'多（最高的点）':'少（最低的点）'}。`,DAYZ[j]]).filter((_,j)=>j!==i)),ex:`最${g?'高':'低'}的点在 ${DAYS[i]}（${DAYZ[i]}），是 ${vals[i]}。`});}
  const i=ri(0,4);
  return mk({p,fig,q:`How many ${it[2]} were there on ${DAYS[i]}?`,zh:pz+`\n\n${DAYZ[i]}有多少？`,a:vals[i],d:[[vals[i]+10,'place','从点往左看，对准横线读数。'],[vals[i]-10,'place','从点往左看，对准横线读数。'],[vals[(i+1)%5],'who','这是另一天的数。']],fill:{n:vals[i],step:10,f:S_},ex:`在 ${DAYS[i]} 上面找到点，往左对到 ${vals[i]}。`});});
G('p4',T.p4t,2,.8,()=>{const it=pick(LGI),vals=shuf([10,20,30,40,50,60,70,80]).slice(0,5),fig=lineG(vals,DAYS);let [i,j]=shuf([0,1,2,3,4]).slice(0,2);if(vals[i]<vals[j])[i,j]=[j,i];const df=vals[i]-vals[j];
  return mk({p:`The line graph shows the number of ${it[0]} from Monday to Friday.`,fig,q:`How many more ${it[2]} were there on ${DAYS[i]} than on ${DAYS[j]}?`,zh:`折线图是星期一到星期五${it[1]}的数量。\n\n${DAYZ[i]}比${DAYZ[j]}多多少？`,a:df,d:[[vals[i]+vals[j],'keyword','“多多少”要用减法。'],[vals[i],'step1',`这是 ${DAYS[i]} 的数，还要减去 ${DAYS[j]} 的。`],[vals[j],'who']],fill:{n:df,step:10,f:S_},ex:`${DAYS[i]} 是 ${vals[i]}，${DAYS[j]} 是 ${vals[j]}：${vals[i]} − ${vals[j]} = ${df}。`});});

/* Ch5 fractions (I), easy */
G('p4',T.p4fr,1,1,()=>{const b=pick([3,4,5,6,8]);
  if(Math.random()<.5){const a=b+ri(1,b-1);return mk({q:'Which of these is an improper fraction?',zh:'哪一个是假分数？',a:`${a}/${b}`,d:[[`${a-b}/${b}`,'frac','分子比分母小，是真分数。'],[`${b}/${a}`,'frac','分子比分母小，是真分数。'],[`${b}/${a+1}`,'frac','分子比分母小，是真分数。'],[`1/${b}`,'frac','分子比分母小，是真分数。']],ex:`分子 ${a} 比分母 ${b} 大，所以 ${a}/${b} 是假分数。`});}
  const ns=shuf([...Array(2*b-1)].map((_,i)=>i+1)).slice(0,4),g=Math.random()<.5,an=g?Math.max(...ns):Math.min(...ns);
  return mk({q:`Which fraction is the ${g?'greatest':'smallest'}?`,zh:`哪一个分数${g?'最大':'最小'}？`,a:`${an}/${b}`,d:ns.filter(n=>n!==an).map(n=>[`${n}/${b}`,'frac','分母一样，比分子：分子越大，分数越大。']),ex:`分母都是 ${b}，比分子：${g?'最大':'最小'}的是 ${an}/${b}。`});});

/* Ch6 fractions (II) */
G('p4',T.p4fr2,1,1,()=>{const b=pick([3,4,5]),n=b*ri(3,8),a=ri(1,b-1),one=n/b;
  return mk({q:`What is ${a}/${b} of ${n}?`,zh:`${n} 的 ${a}/${b} 是多少？`,a:one*a,d:[[one,'step1',`${one} 是 1/${b}，题目问的是 ${a}/${b}，还要 × ${a}。`],[n*a,'frac',`要先 ÷ ${b}。`],[n-a,'keyword']],fill:{n:one*a,step:1,f:S_},ex:`${b} 份 = ${n}，1 份 = ${n} ÷ ${b} = ${one}，${a} 份 = ${one} × ${a} = ${one*a}。`});});
G('p4',T.p4fr2,2,1,()=>{const k=kid(),b=pick([3,4,5,6]),n=b*ri(3,7),a=ri(1,b-1),one=n/b,left=Math.random()<.5,ans=left?n-one*a:one*a;
  return mk({q:`${k.n} had ${n} stickers. ${k.P} gave ${a}/${b} of them to a friend. How many stickers did ${k.p} ${left?'have left':'give away'}?`,zh:`${k.n} 有 ${n} 张贴纸，把 ${a}/${b} 送给朋友。${k.z}${left?'还剩几张':'送出了几张'}？`,a:ans,d:[[left?one*a:n-one*a,'who',left?'这是送出去的，题目问的是剩下的。':'这是剩下的，题目问的是送出去的。'],[one,'step1',`${one} 只是 1 份（1/${b}）。`],[n-a,'keyword','不是减去分子。']],fill:{n:ans,step:1,f:S_},ex:`1 份 = ${n} ÷ ${b} = ${one}；送出 ${a} 份 = ${one*a}${left?`；剩下 ${n} − ${one*a} = ${ans}`:''}。`});});
G('p4',T.p4fr2,2,.9,()=>{const d1=pick([2,3,4,5]),k=d1<=4?pick([2,3]):2,d2=d1*k,a=ri(1,d1-1),add=Math.random()<.6;let c;
  if(add)c=ri(1,d2-1);else{do{c=ri(1,d2-1);}while(c>=a*k);}
  const n=add?a*k+c:a*k-c,ans=frS(n,d2);
  const cand=[[add?a+c:Math.max(Math.abs(a-c),1),d1+d2,'frac','分母不能相加或相减。先把分母变成一样。'],[add?a+c:Math.max(Math.abs(a-c),1),d2,'frac',`先把 ${a}/${d1} 变成 ${a*k}/${d2}，再${add?'加':'减'}。`],[n+1,d2,'calc'],[n+2,d2,'calc'],[Math.max(n-1,1),d2,'calc'],[add?a*k-c:a*k+c,d2,'calc','看清楚是加还是减。'],[n+3,d2,'calc']].filter(([x,y])=>x*d2!==n*y).filter((x,i,arr)=>arr.findIndex(z=>z[0]*x[1]===x[0]*z[1])===i);
  return mk({q:`${a}/${d1} ${add?'+':'−'} ${c}/${d2} = ___`,zh:`${a}/${d1} ${add?'+':'−'} ${c}/${d2} 等于多少？（最简分数；比 1 大就写成带分数）`,a:ans,d:cand.map(([x,y,e,w])=>[frS(x,y),e,w||null]),ex:`${a}/${d1} = ${a*k}/${d2}；${a*k}/${d2} ${add?'+':'−'} ${c}/${d2} = ${n}/${d2}${ans!==n+'/'+d2?` = ${ans}`:''}。`});});

/* Ch7 angles with pictures */
G('p4',T.p4a,1,1,()=>{const k=ri(0,2),dg=[ri(25,70),90,ri(110,160)][k],nm=['an acute angle','a right angle','an obtuse angle'],zm=['锐角','直角','钝角'];
  return mk({fig:angG([[dg,90,'']]),q:'What kind of angle is this?',zh:'这是什么角？',a:nm[k],az:zm[k],d:[0,1,2].filter(x=>x!==k).map(x=>[nm[x],'place',k===1?'有小方块记号的是直角（90°）。':'和直角（90°）比一比：比它小是锐角，比它大是钝角。',zm[x]]).concat([['a straight angle','place','一条直线才是 180°（平角）。','平角']]),ex:k===1?'有小方块记号，是直角，90°。':`这个角${k===0?'比直角小，是锐角':'比直角大，是钝角'}。`});});
G('p4',T.p4a,1,.9,()=>{const ds=shuf([ri(20,45),ri(55,80),ri(95,130)]),big=Math.max(...ds),mi=ds.indexOf(big),labs=['a','b','c'];
  return mk({fig:angG(ds.map((d,i)=>[d,d===big?42:ri(66,74),labs[i]])),q:'Which angle is the biggest?',zh:'哪一个角最大？',a:`Angle ${labs[mi]}`,az:`角 ${labs[mi]}`,d:[...labs.filter((_,i)=>i!==mi).map(l=>[`Angle ${l}`,'place','角的大小看两条边张开多少，不看边画得多长。',`角 ${l}`]),['They are the same.','place','张开的程度不一样。','一样大']],ex:`角 ${labs[mi]} 张得最开，所以最大。边画得短，角不一定小。`});});
G('p4',T.p4a,2,.9,()=>{const P={A:[40,30],B:[250,20],C:[280,150],D:[20,140]},nm=['A','B','C','D'],v=ri(0,3),nb=i=>[nm[(i+3)%4],nm[i],nm[(i+1)%4]],ang=i=>'∠'+nb(i).join('');
  const [pn,vn,rn]=nb(v),V=P[vn],u=n=>{const d=[P[n][0]-V[0],P[n][1]-V[1]],l=Math.hypot(d[0],d[1]);return [d[0]/l,d[1]/l];},u1=u(pn),u2=u(rn),sw=(u1[0]*u2[1]-u1[1]*u2[0])>0?1:0,R=24;
  const fig=`<svg viewBox="0 0 310 175" role="img" aria-label="angle"><polygon points="${nm.map(n=>P[n].join(',')).join(' ')}" class="fg-ang"/><path d="M${(V[0]+R*u1[0]).toFixed(1)} ${(V[1]+R*u1[1]).toFixed(1)}A${R} ${R} 0 0 ${sw} ${(V[0]+R*u2[0]).toFixed(1)} ${(V[1]+R*u2[1]).toFixed(1)}" class="fg-arc"/>`+RCN([28,258,290,10],[24,14,166,156],nm)+'</svg>';
  return mk({fig,q:'Name the marked angle.',zh:'标出来的角叫什么？',a:ang(v),d:[0,1,2,3].filter(i=>i!==v).map(i=>[ang(i),'place','中间的字母要是角的顶点（画弧线的那个点）。']),ex:`弧线在 ${vn} 点，${vn} 要写在中间：${ang(v)}（也可以写成 ∠${rn}${vn}${pn}）。`});});

/* Ch8 rectangles and squares */
const RSF=[
 ['A rectangle has ___ right angles.','长方形有几个直角？',['4','2','3','1'],'长方形的 4 个角都是直角（90°）。'],
 ['A square has ___ equal sides.','正方形有几条边一样长？',['4','2','3','0'],'正方形 4 条边都一样长。'],
 ['In a rectangle, the opposite sides are ___.','长方形的对边怎么样？',['equal','different','longer','shorter'],'长方形的对边一样长。'],
 ['Which is true for every square?','哪一句对所有正方形都成立？',['All 4 sides are equal and all 4 angles are right angles.','Only 2 sides are equal.','It has 3 right angles.','All its angles are 60°.'],'正方形：4 条边一样长，4 个角都是直角。'],
 ['Each angle of a rectangle is ___.','长方形的每个角是多少度？',['90°','180°','60°','360°'],'每个角都是直角，90°。']];
G('p4',T.p4rs,1,.7,()=>{const [q,zh,o,ex]=pick(RSF);return mk({q,zh,a:o[0],d:o.slice(1).map(x=>[x,'place']),ex});});
G('p4',T.p4rs,1,1,()=>{const sq=Math.random()<.4,a=ri(6,15),b=sq?a:ri(3,a-2),askCD=sq?false:Math.random()<.5,ans=askCD?a:b;
  const w=sq?120:180,h=sq?120:Math.min(140,Math.max(55,Math.round(180*b/a))),x0=40,y0=30,x1=x0+w,y1=y0+h,m=10;
  let o=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" class="fg-ang"/>`+[[x0,y0,1,1],[x1,y0,-1,1],[x1,y1,-1,-1],[x0,y1,1,-1]].map(([x,y,sx,sy])=>`<path d="M${x+sx*m} ${y}V${y+sy*m}H${x}" class="fg-ax"/>`).join('')
    +RCN([x0-12,x1+12,x1+12,x0-12],[y0-4,y0-4,y1+14,y1+14],['A','B','C','D'])+`<text x="${x0+w/2}" y="${y0-8}" text-anchor="middle" class="fg-s">${a} cm</text>`+(sq?'':`<text x="${x1+8}" y="${y0+h/2+4}" class="fg-s">${b} cm</text>`);
  const fig=`<svg viewBox="0 0 ${x1+60} ${y1+24}" role="img" aria-label="${sq?'square':'rectangle'}">${o}</svg>`;
  if(sq)return mk({fig,q:`ABCD is a square. AB = ${a} cm. What is the length of BC?`,zh:`ABCD 是正方形，AB = ${a} cm。BC 多长？`,a:a+' cm',d:[[a*4+' cm','perim','这是一圈的长度，题目只问一条边。'],[a*2+' cm','keyword'],[a+4+' cm','calc']],fill:{n:a,step:1,f:x=>x+' cm'},ex:`正方形 4 条边一样长：BC = AB = ${a} cm。`});
  return mk({fig,q:`ABCD is a rectangle. AB = ${a} cm and BC = ${b} cm. What is the length of ${askCD?'CD':'AD'}?`,zh:`ABCD 是长方形，AB = ${a} cm，BC = ${b} cm。${askCD?'CD':'AD'} 多长？`,a:ans+' cm',d:[[(askCD?b:a)+' cm','who',`${askCD?'CD 和 AB':'AD 和 BC'} 是对边，对边一样长。`],[a+b+' cm','keyword','不用加起来，对边一样长。'],[2*ans+' cm','perim']],fill:{n:ans,step:1,f:x=>x+' cm'},ex:`长方形的对边一样长：${askCD?`CD = AB = ${a}`:`AD = BC = ${b}`} cm。`});});
G('p4',T.p4rs,2,1,()=>{const t=pick([30,35,40,45,50,55,60,65]),x=90-t,px=20+130/Math.tan(t*Math.PI/180),lab=(r,an,tx)=>`<text x="${(20+r*Math.cos(an*Math.PI/180)).toFixed(1)}" y="${(154-r*Math.sin(an*Math.PI/180)).toFixed(1)}" text-anchor="middle" class="fg-l">${tx}</text>`;
  const fig=`<svg viewBox="0 0 300 172" role="img" aria-label="rectangle"><rect x="20" y="20" width="260" height="130" class="fg-ang"/><line x1="20" y1="150" x2="${px.toFixed(1)}" y2="20" class="fg-ang"/>`+lab(54,t/2,t+'°')+lab(54,(t+90)/2,'x')+RCN([10,290,290,10],[16,16,166,166],['A','B','C','D'])+'</svg>';
  return mk({fig,q:'ABCD is a rectangle. Find ∠x.',zh:'ABCD 是长方形。求 ∠x。',a:x+'°',d:[[(180-t)+'°','keyword','这里不是一条直线。D 是长方形的角，是 90°。'],[t+'°','who',`${t}° 是另一个角，题目问的是 x。`],[(90+t)+'°','calc','两个角合起来是 90°，要用减法。']],fill:{n:x,step:5,f:v=>v+'°'},ex:`长方形的每个角都是 90°：∠x = 90° − ${t}° = ${x}°。`});});

/* ---------- the four kinds of bar-model problems from the end-of-year paper, in small steps with the model shown ---------- */
function tws(k){return k===2?'twice':k+' times';}
const U1=k=>Array.from({length:k},()=>[1,'','a']);
G('wp',T.bbs,2,1.4,()=>{const [A,B]=two(),it=pick(STK),k=ri(2,5),b=ri(6,25),a=b*k,tot=Math.random()<.5,ans=tot?a+b:b;
  const fig=bm([[A.n,U1(k)],[B.n,[[1,'?','a']]]],[{row:0,from:0,to:k,top:1,text:String(a)}]);
  return chain(`${A.n} has ${a} ${it[0]}. ${A.P} has ${tws(k)} as many ${it[0]} as ${B.n}. How many ${it[0]} ${tot?'do they have altogether':`does ${B.n} have`}?`,`${A.n} 有 ${a} ${it[1]}，是 ${B.n} 的 ${k} 倍。${tot?'两人一共有多少？':`${B.n} 有多少？`}`,[
   {q:`${a} is how many units?`,qz:`第 1 步：看图，${a} 是几格？`,fig,a:k,d:[[1,'who',`${a} 是 ${A.n} 整条，${A.n} 有 ${k} 格，不是 1 格。`],[k+1,'calc',`只数 ${A.n} 那一条。`],[2*k,'calc']],ex:`${A.n} 是 ${B.n} 的 ${k} 倍，画 ${k} 格；${a} 是这 ${k} 格。`},
   {q:'What is 1 unit?',qz:'第 2 步：1 格是多少？',fig,a:b,d:[[a*k,'keyword',`${a} 是 ${k} 格，要 ÷ ${k}，不是 ×。`],[a-k,'keyword',`是 ÷ ${k}，不是 − ${k}。`],[a+k,'keyword']],fill:{n:b,step:1,f:S_},ex:`${a} ÷ ${k} = ${b}。`},
   tot?{q:`How many ${it[0]} do they have altogether?`,qz:'第 3 步：两人一共有多少？',fig,a:ans,d:[[a,'who',`这只是 ${A.n} 的。`],[b,'who',`这只是 ${B.n} 的。`],[a*(k+1),'keyword','1 格是 '+b+'，一共 '+(k+1)+' 格。']],fill:{n:ans,step:1,f:S_},ex:`${a} + ${b} = ${ans}（一共 ${k+1} 格）。`}
      :{q:`Whose number is ${b}?`,qz:`第 3 步：${b} 是谁的？`,fig,a:B.n,d:[[A.n,'who',`${A.n} 有 ${k} 格；1 格是 ${B.n} 的。`],['both of them','who',null,'两人一共'],['We cannot tell yet.','who',null,'还看不出来']],ex:`1 格 = ${b}，是 ${B.n} 的，就是答案。`}],
   [tot?'两人一共有多少':`${B.n} 有多少`,`${A.n} 有多少`,tot?`${B.n} 有多少`:'两人一共有多少',`${A.n} 比 ${B.n} 多多少`]);});
G('wp',T.btd,3,1.6,()=>{const [A,B]=two(),it=pick(STK),k=ri(3,7),b=ri(8,30),d=(k-1)*b,tot=b*(k+1);
  const fig=bm([[A.n,U1(k)],[B.n,[[1,'','a']]]],[{row:0,from:1,to:k,top:1,text:String(d)}]);
  return chain(`${A.n} has ${tws(k)} as many ${it[0]} as ${B.n}. ${A.n} has ${d} more ${it[0]} than ${B.n}. How many ${it[0]} do they have altogether?`,`${A.n} 的是 ${B.n} 的 ${k} 倍，${A.n} 比 ${B.n} 多 ${d} ${it[1]}。两人一共有多少？`,[
   {q:`${d} is how many units?`,qz:`第 1 步：看图，多出来的 ${d} 是几格？`,fig,a:k-1,d:[[k,'who',`${A.n} 有 ${k} 格，比 ${B.n} 多的是 ${k} − 1 = ${k-1} 格。`],[k+1,'calc'],[1,'who']],ex:`${A.n} ${k} 格，${B.n} 1 格，多出来 ${k-1} 格 = ${d}。`},
   {q:'What is 1 unit?',qz:'第 2 步：1 格是多少？',fig,a:b,d:[[Math.floor(d/k),'step1',`多出来的是 ${k-1} 格，要 ÷ ${k-1}。`],[d,'step1',`${d} 是 ${k-1} 格，还要 ÷ ${k-1}。`],[d*(k-1),'keyword','是除，不是乘。']],fill:{n:b,step:1,f:S_},ex:`${d} ÷ ${k-1} = ${b}。`},
   {q:`How many ${it[0]} do they have altogether?`,qz:'第 3 步：一共几格？一共多少？',fig,a:tot,d:[[b*k,'who',`这是 ${A.n} 的 ${k} 格，还要加 ${B.n} 的 1 格。`],[d,'who','这只是多出来的那段。'],[tot+b,'calc']],fill:{n:tot,step:1,f:S_},ex:`一共 ${k} + 1 = ${k+1} 格：${k+1} × ${b} = ${tot}。`}],
   ['两人一共有多少',`${A.n} 有多少`,`${B.n} 有多少`,`${A.n} 比 ${B.n} 多多少`]);});
G('wp',T.b3,3,1.5,()=>{const p=pick([20,25,30,35,40]),q=pick([5,10,15].filter(x=>x<p)),s=ri(8,30)*5,c=p-q,T2=3*s+p+c,cm=x=>x+' cm';
  const fig=bm([['A',[[2,'','a'],[1.2,'+'+p,'b']]],['B',[[2,'?','a']]],['C',[[2,'','a'],[Math.max(.7,1.2*c/p),'+'+c,'b']]]]);
  return chain(`Three ropes, A, B and C, are ${T2} cm long altogether. Rope A is ${p} cm longer than Rope B. Rope C is ${q} cm shorter than Rope A. How long is Rope B?`,`A、B、C 三根绳一共长 ${T2} cm。A 比 B 长 ${p} cm，C 比 A 短 ${q} cm。B 多长？`,[
   {q:'How much longer than Rope B is Rope C?',qz:'第 1 步：C 比 B 长多少？',fig,a:cm(c),d:[[cm(q),'who',`C 比 A 短 ${q}，A 比 B 长 ${p}：C 比 B 长 ${p} − ${q}。`],[cm(p),'who','这是 A 比 B 长的。'],[cm(p+q),'keyword','“shorter” 要减。']],fill:{n:c,step:5,f:cm},ex:`A = B + ${p}，C = A − ${q} = B + ${c}。`},
   {q:'How long are the 3 equal units altogether?',qz:'第 2 步：去掉多的两段，剩下 3 格一共多长？',fig,a:cm(3*s),d:[[cm(T2-p),'step1','C 多的那段也要去掉。'],[cm(T2+p+c),'keyword','多的部分要减掉。'],[cm(T2-p-q),'who',`C 多的是 ${c}，不是 ${q}。`]],fill:{n:3*s,step:5,f:cm},ex:`${T2} − ${p} − ${c} = ${3*s} cm。`},
   {q:'How long is Rope B?',qz:'第 3 步：1 格多长？是哪一根？',fig,a:cm(s),d:[[cm(3*s),'step1','这是 3 格，还要 ÷ 3。'],[cm(s+p),'who','这是 Rope A。'],[cm(s+c),'who','这是 Rope C。']],fill:{n:s,step:5,f:cm},ex:`${3*s} ÷ 3 = ${s} cm，1 格就是 Rope B。`}],
   ['B 多长','A 多长','三根一共多长','A 比 B 长多少']);});
G('wp',T.bba,3,1.5,()=>{const [J,R]=two(),it=pick(STK),d=ri(10,40),rb=ri(40,150),jb=rb+d,g=ri(20,Math.min(jb-1,150)),aft=rb+g;
  const fig=bm([[R.n,[[2.4,'at first ?','a'],[1.6,'+'+g,'b']]]],[{row:0,from:0,to:4,top:1,text:'after: '+aft}]);
  return chain(`${J.n} had ${d} more ${it[0]} than ${R.n}. ${J.n} gave ${R.n} ${g} ${it[0]}. Then ${R.n} had ${aft} ${it[0]}. How many ${it[0]} did ${J.n} have at first?`,`${J.n} 原来比 ${R.n} 多 ${d}。${J.n} 给了 ${R.n} ${g}。之后 ${R.n} 有 ${aft}。${J.n} 原来有多少？`,[
   {q:`How many ${it[0]} did ${R.n} have at first?`,qz:`第 1 步：倒推，${R.n} 原来有多少？`,fig,a:rb,d:[[aft+g,'keyword',`${R.n} 收到 ${g} 才变成 ${aft}，倒推要减。`],[aft-d,'who',`先倒推 ${R.n}：${aft} − ${g}。`],[aft,'step1','这是后来的，不是原来的。']],fill:{n:rb,step:1,f:S_},ex:`${R.n} 后来 ${aft}，其中 ${g} 是收到的：${aft} − ${g} = ${rb}。`},
   {q:`How many ${it[0]} did ${J.n} have at first?`,qz:`第 2 步：${J.n} 原来比 ${R.n} 原来多 ${d}，${J.n} 原来有多少？`,a:jb,d:[[rb-d,'keyword',`${J.n} 比较多，要加 ${d}。`],[rb,'who',`这是 ${R.n} 原来的。`],[jb-g,'calc',`问的是给之前，不用再减 ${g}。`]],fill:{n:jb,step:1,f:S_},ex:`${rb} + ${d} = ${jb}。题目里的 ${d}、${g}、${aft} 都用上了。`}],
   [`${J.n} 原来有多少`,`${R.n} 原来有多少`,`${R.n} 后来有多少`,`${J.n} 给了多少`]);});

/* ---------- 画线段图: lessons where he builds the model himself, labels it, then uses it ---------- */
function nopt(a,ws){const s=new Set([a]);(ws||[]).forEach(w=>{if(s.size<4&&w>0&&Number.isInteger(w))s.add(w);});let k=1;while(s.size<4){if(a+k>0)s.add(a+k);if(s.size<4&&a-k>0)s.add(a-k);k++;}return shuf([...s]).map(String);}
/* ======== from the 2024–25 P3/P4 papers: the kinds that keep coming back ======== */
Object.assign(T,{pic:'Which picture? · 哪张图画对了',op:'Add, subtract, times or divide? · 用哪种算法',most:'Most & how many more · 最多几个',assume:'Cars and bikes · 假设法',gap:'Gaps · 间隔',two:'Two sets of prices · 两组价钱',deal:'Offers · 优惠',gave:'Gave some away · 给出以后',same:'Same at first · 一开始一样多',scale:'Reading a scale · 读刻度',tfn:'Ch4 True, False or Not possible to tell · 第4章 对、错、看不出'});
const cap=s=>s[0].toUpperCase()+s.slice(1);
const OPS=[['Add +','加 +'],['Subtract −','减 −'],['Multiply ×','乘 ×'],['Divide ÷','除 ÷']];
const opQ=(p,pz,k,why)=>mk({p,zh:pz+'\n\n用哪种算法？',q:'Which do you use?',a:OPS[k][0],az:OPS[k][1],d:OPS.filter((_,j)=>j!==k).map(o=>[o[0],'keyword',why,o[1]]),ex:why});
/* a short sentence about two people, and three bar pictures: which one is drawn right? */
G('wp',T.pic,1,1.3,()=>{const [A,B]=two(),it=pick(STK),v=ri(0,2),k=ri(2,4),d=ri(5,40);
  const u=n=>Array(n).fill([1,'','a']),pics=[];let s,sz,ok,why;
  if(v===0){s=`${A.n} has ${tws(k)} as many ${it[0]} as ${B.n}.`;sz=`${A.n} 的${it[0]==='marbles'?'弹珠':'数量'}是 ${B.n} 的 ${k} 倍。`;
    pics.push([[A.n,u(k)],[B.n,u(1)]],[[A.n,u(1)],[B.n,u(k)]],[[A.n,u(k+1)],[B.n,u(1)]]);why=`${A.n} 是 ${B.n} 的 ${k} 倍：${B.n} 1 格，${A.n} ${k} 格。“as many as”后面的人画 1 格。`;}
  else if(v===1){s=`${A.n} has ${d} more ${it[0]} than ${B.n}.`;sz=`${A.n} 比 ${B.n} 多 ${d}。`;
    pics.push([[A.n,[[2,'','a'],[1.3,'+'+d,'b']]],[B.n,[[2,'','a']]]],[[A.n,[[2,'','a']]],[B.n,[[2,'','a'],[1.3,'+'+d,'b']]]],[[A.n,[[2,'','a'],[1.3,'+'+d,'b']]],[B.n,[[2,'','a'],[1.3,'+'+d,'b']]]]);why=`${A.n} 多，${A.n} 那条长出 ${d}。`;}
  else{s=`${A.n} has ${d} fewer ${it[0]} than ${B.n}.`;sz=`${A.n} 比 ${B.n} 少 ${d}。`;
    pics.push([[A.n,[[2,'','a']]],[B.n,[[2,'','a'],[1.3,'+'+d,'b']]]],[[A.n,[[2,'','a'],[1.3,'+'+d,'b']]],[B.n,[[2,'','a']]]],[[A.n,[[2,'','a'],[1.3,'−'+d,'b']]],[B.n,[[2,'','a']]]]);why=`${A.n} 少 ${d}，就是 ${B.n} 多 ${d}：${B.n} 那条长。`;}
  const ord=shuf([0,1,2]),L=['①','②','③'],fig='<div class="pics">'+ord.map((pi,j)=>`<figure><b>${L[j]}</b>${bm(pics[pi])}</figure>`).join('')+'</div>',ai=ord.indexOf(0);
  return mk({fig,q:s+'\nWhich picture shows this?',zh:sz+'\n\n哪张图画对了？',a:L[ai],d:L.filter((_,j)=>j!==ai).map(x=>[x,'keyword',why]).concat([['都不对','keyword',why]]),ex:why});});
/* which operation: the sentence decides, not the key word */
G('wp',T.op,1,1.2,()=>{const [A,B]=two(),it=pick(STK),a=ri(30,90),g=ri(5,25),n=ri(3,9),m=ri(4,12),v=ri(0,6);
  if(v===0)return opQ(`${A.n} had ${a} ${it[0]}. ${A.P} gave ${g} ${it[0]} to ${B.n}. How many ${it[0]} does ${A.n} have now?`,`${A.n} 有 ${a}，给了 ${B.n} ${g}。${A.n} 现在有多少？`,1,`${A.n} 给出去，自己的变少：减。`);
  if(v===1)return opQ(`${A.n} had ${a} ${it[0]}. ${B.n} gave ${A.z==='他'?'him':'her'} ${g} more. How many ${it[0]} does ${A.n} have now?`,`${A.n} 有 ${a}，${B.n} 又给了${A.z} ${g}。${A.n} 现在有多少？`,0,`别人给${A.z}，${A.n} 的变多：加。`);
  if(v===2)return opQ(`There are ${n} boxes. Each box has ${m} ${it[0]}. How many ${it[0]} are there altogether?`,`${n} 个盒子，每盒 ${m}。一共多少？`,2,'每份一样多，有几份：乘。');
  if(v===3)return opQ(`${n*m} ${it[0]} are shared equally among ${n} children. How many ${it[0]} does each child get?`,`${n*m} 平均分给 ${n} 个孩子。每人几个？`,3,'平均分给几个人：除。');
  if(v===4)return opQ(`${A.n} has ${g} fewer ${it[0]} than ${B.n}. ${B.n} has ${a}. How many ${it[0]} does ${A.n} have?`,`${A.n} 比 ${B.n} 少 ${g}。${B.n} 有 ${a}。${A.n} 有多少？`,1,`${A.n} 比 ${B.n} 少，${A.n} 是小的：减。`);
  if(v===5)return opQ(`${A.n} has ${g} fewer ${it[0]} than ${B.n}. ${A.n} has ${a}. How many ${it[0]} does ${B.n} have?`,`${A.n} 比 ${B.n} 少 ${g}。${A.n} 有 ${a}。${B.n} 有多少？`,0,`句子里有 fewer，可是问的是多的那个人 ${B.n}：加。看到 fewer 不一定减。`);
  return opQ(`${A.n} has ${tws(n>4?3:n)} as many ${it[0]} as ${B.n}. ${A.n} has ${a*(n>4?3:n)}. How many ${it[0]} does ${B.n} have?`,`${A.n} 是 ${B.n} 的 ${n>4?3:n} 倍。${A.n} 有 ${a*(n>4?3:n)}。${B.n} 有多少？`,3,`知道大的（${A.n}），求 1 格（${B.n}）：除。看到 times 不一定乘。`);});
/* most you can make / how many more for one more */
G('wp',T.most,2,1,()=>{const k=kid(),g=pick([4,5,6,7,8]);let n;do{n=ri(30,99);}while(n%g===0);const q=Math.floor(n/g),r=n%g,v=Math.random()<.5;
  if(v)return mk({q:`A baker has ${n} eggs. He needs ${g} eggs to bake a cake. What is the greatest number of cakes he can bake?`,zh:`有 ${n} 个蛋，每个蛋糕要 ${g} 个。最多能做几个蛋糕？`,a:q,d:[[q+1,'round',`剩下 ${r} 个蛋不够做一个蛋糕，不能多加一个。`],[`${q} R ${r}`,'round','蛋糕个数不写余数。'],[n-g,'keyword','“每个要几个”用除法。']],ex:`${n} ÷ ${g} = ${q} R ${r}。剩 ${r} 个不够，最多 ${q} 个。“最多能做”去掉余数；“至少要几个盒子”才要多加一个。`});
  return mk({q:`A baker has ${n} eggs. He needs ${g} eggs to bake a cake. He bakes as many cakes as he can. How many more eggs does he need to bake 1 more cake?`,zh:`有 ${n} 个蛋，每个蛋糕要 ${g} 个，能做几个就做几个。再做 1 个还要几个蛋？`,a:g-r,d:[[r,'step1',`${r} 是剩下的蛋，还差 ${g} − ${r}。`],[g,'step1','已经有剩下的蛋了，不用 ${g} 个都买。'],[q+1,'who','问的是蛋，不是蛋糕。']],ex:`${n} ÷ ${g} = ${q} R ${r}。剩 ${r} 个，再做 1 个要 ${g} 个：${g} − ${r} = ${g-r}。`});});
/* assume: all of one kind first */
const ASM=[['cars','motorcycles','wheels',4,2,'汽车','摩托车','轮子'],['tricycles','bicycles','wheels',3,2,'三轮车','自行车','轮子'],['squares','triangles','sides',4,3,'正方形','三角形','条边'],['$5 notes','$2 notes','dollars',5,2,'5 元纸币','2 元纸币','元']];
G('wp',T.assume,3,1,()=>{const [bN,sN,uN,b,s,bz,sz,uz]=pick(ASM),n=ri(10,30),nb=ri(3,n-3),tot=nb*b+(n-nb)*s,money=uN==='dollars',askB=Math.random()<.6;
  const P=money?`A wallet has ${n} notes. They are $${b} notes and $${s} notes. They are worth $${tot} altogether. How many ${askB?bN:sN} are there?`:`There are ${n} ${bN} and ${sN} altogether. There are ${tot} ${uN} in total. How many ${askB?bN:sN} are there?`;
  const PZ=money?`钱包里有 ${n} 张 ${b} 元和 ${s} 元的纸币，一共 ${tot} 元。${askB?bz:sz}有几张？`:`${bz}和${sz}一共 ${n} 个，一共 ${tot} ${uz}。${askB?bz:sz}有几个？`;
  const all=n*s,ex=tot-all,per=b-s;
  return chain(P,PZ,[
    {q:`Pretend they are all ${sN}. How many ${uN} would that be?`,qz:`先假设全是${sz}：一共多少？`,a:all,d:[[n*b,'who',`假设全是${sz}，每个 ${s}。`],[tot,'step1','这是真正的总数，不是假设的。'],[n+s,'calc','要乘：个数 × 每个几。']],ex:`${n} × ${s} = ${all}。`},
    {q:`How many more ${uN} are there really?`,qz:`真正的比假设的多多少？`,a:ex,d:[[tot+all,'leftadd','求多出来多少，要减。'],[all,'step1','这是假设的总数。'],[ex+per,'calc']],ex:`${tot} − ${all} = ${ex}。`},
    {q:`Each ${bN.replace(/s$/,'').replace(/notes?$/,'note')} has ${per} more than each ${sN.replace(/s$/,'').replace(/notes?$/,'note')}. How many ${askB?bN:sN} are there?`,qz:`每换成一个${bz}多 ${per}。${askB?bz:sz}有几个？`,a:askB?nb:n-nb,d:[[askB?n-nb:nb,'who',`问的是${askB?bz:sz}。`],[ex,'step1',`还要 ÷ ${per}。`],[Math.floor(ex/b),'calc',`每换一个多 ${per}，不是 ${b}。`]],ex:`${ex} ÷ ${per} = ${nb} 个${bz}。`+(askB?'':`${sz}：${n} − ${nb} = ${n-nb}。`)}]);});
/* gaps: posts and pieces */
G('wp',T.gap,2,1,()=>{const v=ri(0,2);
  if(v===0){const n=ri(5,15),d=pick([4,5,6,8,10,12]);return mk({q:`${n} lamp posts stand in a straight row. They are ${d} m apart. What is the distance between the first and the last lamp post?`,zh:`一排 ${n} 根路灯，每两根相距 ${d} m。第一根到最后一根多远？`,a:`${(n-1)*d} m`,d:[[`${n*d} m`,'gap',`${n} 根灯之间只有 ${n-1} 段。`],[`${(n-2)*d} m`,'gap','少算了一段。'],[`${n+d} m`,'calc']],ex:`画几根灯数一数：${n} 根灯之间有 ${n-1} 段，${n-1} × ${d} = ${(n-1)*d} m。`});}
  if(v===1){const n=ri(4,9),g=pick([12,15,18,20,24,25,30]),L=(n-1)*g;return mk({q:`${n} balloons are tied on a string ${L} cm long, from one end to the other. They are an equal distance apart. What is the distance between two balloons next to each other?`,zh:`一根 ${L} cm 的绳子上，从头到尾等距系了 ${n} 个气球。相邻两个气球相距多少？`,a:`${g} cm`,d:[[`${Math.round(L/n)} cm`,'gap',`${n} 个气球之间是 ${n-1} 段，要 ÷ ${n-1}。`],[`${L-n} cm`,'keyword','平均分要除。'],[`${g+3} cm`,'calc']],ex:`${n} 个气球之间有 ${n-1} 段：${L} ÷ ${n-1} = ${g} cm。`});}
  const c=ri(2,6),g=pick([15,20,25,30,40,45]),L=(c+1)*g;return mk({q:`A ribbon is ${L} cm long. It is cut ${c} times into pieces of equal length. How long is each piece?`,zh:`一条 ${L} cm 的丝带剪了 ${c} 刀，剪成同样长的几段。每段多长？`,a:`${g} cm`,d:[[`${L/c} cm`,'gap',`剪 ${c} 刀是 ${c+1} 段。`],[`${L-c} cm`,'keyword','平均分要除。'],[`${(c+2)>0&&L%(c+2)===0?L/(c+2):g+5} cm`,'gap']],ex:`剪 ${c} 刀变成 ${c+1} 段：${L} ÷ ${c+1} = ${g} cm。`});});
/* two sets of prices: take away what is the same */
const TWO=[['whistle','whistles','哨子'],['cap','caps','帽子'],['book','books','书'],['bag','bags','书包'],['pen','pens','笔'],['file','files','文件夹'],['T-shirt','T-shirts','T 恤'],['pair of shorts','pairs of shorts','短裤']];
G('wp',T.two,3,1,()=>{let [X,Y]=shuf(TWO).slice(0,2);const a=ri(1,4),b1=ri(3,6),b2=ri(1,b1-1),x=ri(3,20),y=ri(2,15),P1=a*x+b1*y,P2=a*x+b2*y,db=b1-b2,dp=P1-P2;
  const nm=(n,w)=>`${n} ${n===1?w[0]:w[1]}`;
  const P=`${cap(nm(a,X))} and ${nm(b1,Y)} cost $${P1}. ${cap(nm(a,X))} and ${nm(b2,Y)} cost $${P2}. How much does 1 ${Y[0]} cost?`,PZ=`${a} 个${X[2]}和 ${b1} 个${Y[2]}一共 $${P1}。${a} 个${X[2]}和 ${b2} 个${Y[2]}一共 $${P2}。1 个${Y[2]}多少钱？`;
  return chain(P,PZ,[
    {q:`Both lists have ${nm(a,X)}. How many more ${Y[1]} are in the first list?`,qz:`两组都有 ${a} 个${X[2]}。第一组多几个${Y[2]}？`,a:db,d:[[b1+b2,'leftadd','求多几个，要减。'],[b1,'step1','要和第二组比。'],[db+a,'calc']],ex:`一样的部分（${a} 个${X[2]}）去掉，只差${Y[2]}：${b1} − ${b2} = ${db}。`},
    {q:`How much more does the first list cost?`,qz:'第一组贵多少？',a:'$'+dp,d:[['$'+(P1+P2),'leftadd','求贵多少，要减。'],['$'+P1,'step1','要和第二组比。'],['$'+(dp+10),'calc']],ex:`$${P1} − $${P2} = $${dp}。这 $${dp} 就是多出来的 ${db} 个${Y[2]}的钱。`},
    {q:`How much does 1 ${Y[0]} cost?`,qz:`1 个${Y[2]}多少钱？`,a:'$'+y,d:[['$'+dp,'step1',`$${dp} 是 ${db} 个的钱，还要 ÷ ${db}。`],['$'+(dp*db),'keyword',`${db} 个 $${dp}，求 1 个要除。`],['$'+(y+1),'calc']],ex:`$${dp} ÷ ${db} = $${y}。`}]);});
/* buy 3, get 1 free */
G('wp',T.deal,2,.8,()=>{const k=kid(),p=pick([4,5,6,7,9]),g=ri(2,6),n=4*g,it=pick([['cookies','块饼干'],['pencils','支铅笔'],['erasers','块橡皮']]);
  return mk({q:`A shop sells 3 ${it[0]} for $${p}. For every 3 ${it[0]} bought, you get 1 more free. ${k.n} went home with ${n} ${it[0]}. How much did ${k.p} pay?`,zh:`3 ${it[1].slice(1)}卖 $${p}，每买 3 个送 1 个。${k.n} 带回家 ${n} 个，付了多少钱？`,a:'$'+g*p,d:[['$'+Math.round(n/3*p),'keyword','送的不用付钱：4 个一组只付 3 个的钱。'],['$'+n*p,'keyword',`$${p} 是 3 个的价钱，不是 1 个。`],['$'+(g+1)*p,'calc']],ex:`买 3 送 1，4 个一组付 $${p}。${n} ÷ 4 = ${g} 组，${g} × $${p} = $${g*p}。`});});
/* gave some away: the difference gets smaller twice */
G('wp',T.gave,2,1.2,()=>{const [A,B]=two(),it=pick(STK),d=ri(20,90),g=ri(3,Math.floor((d-2)/2)),ans=d-2*g;
  const fig=bm([[A.n+' first',[[2,'','a'],[2.8,'+'+d,'b']]],[B.n+' first',[[2,'','a']]],[A.n+' end',[[2.9,'','a'],[1,'?','b'],[0.9,'−'+g,'g']]],[B.n+' end',[[2,'','a'],[0.9,'+'+g,'b']]]]);
  return mk({fig,q:`${A.n} had ${d} more ${it[0]} than ${B.n}. ${A.n} gave ${g} ${it[0]} to ${B.n}. How many more ${it[0]} did ${A.n} have than ${B.n} in the end?`,zh:`${A.n} 比 ${B.n} 多 ${d}。${A.n} 给了 ${B.n} ${g}。最后 ${A.n} 比 ${B.n} 多几个？`,a:ans,d:[[d-g,'step1',`${A.n} 少了 ${g}，${B.n} 也多了 ${g}：差要减两次。`],[d+g,'leftadd','给出去，差变小。'],[d,'step1','给了以后差会变。']],ex:`${A.n} 少 ${g}，${B.n} 多 ${g}，差少了 ${g} + ${g} = ${2*g}。${d} − ${2*g} = ${ans}。`});});
/* same at first, then one gets more, the other gives some away: k times */
G('wp',T.same,3,1,()=>{const [A,B]=two(),it=pick(STK),k=ri(2,4);let u,bb,aa;do{u=ri(6,20);bb=ri(3,u);aa=(k-1)*u-bb;}while(aa<3);const first=u+bb;
  const P=`${A.n} and ${B.n} had the same number of ${it[0]} at first. ${A.n} bought ${aa} more ${it[0]} and ${B.n} gave away ${bb} ${it[0]}. Then ${A.n} had ${tws(k)} as many ${it[0]} as ${B.n}. How many ${it[0]} did each of them have at first?`,PZ=`${A.n} 和 ${B.n} 原来一样多。${A.n} 又买了 ${aa}，${B.n} 送出 ${bb}。这时 ${A.n} 是 ${B.n} 的 ${k} 倍。原来每人有多少？`;
  const fig=bm([[A.n+' end',Array(k).fill([1.5,'','a'])],[B.n+' end',[[1.5,'','a'],[1.5*(k-1),`${bb} + ${aa}`,'g']]]]);
  return chain(P,PZ,[
    {fig,q:`In the end, ${A.n} is ${k} units and ${B.n} is 1 unit. Put back the ${bb} ${B.n} gave away and take off the ${aa} ${A.n} bought. Now they are the same. How many units is ${bb} + ${aa}?`,qz:`最后 ${A.n} ${k} 格，${B.n} 1 格。${B.n} 加回送出的 ${bb}，${A.n} 去掉买的 ${aa}，两人又一样多。${bb} + ${aa} 是几格？`,a:k-1,d:[[k,'who','两人都有 1 格是一样的，多出来的是 ${k} − 1 格。'],[1,'step1',`${A.n} 比 ${B.n} 多 ${k-1} 格。`],[k+1,'calc']],ex:`${A.n} ${k} 格，${B.n} 1 格，差 ${k-1} 格，这 ${k-1} 格就是 ${bb} + ${aa} = ${aa+bb}。`},
    {fig,q:'What is 1 unit?',qz:'1 格是多少？',a:u,d:[[aa+bb,'step1',`${aa+bb} 是 ${k-1} 格，还要 ÷ ${k-1}。`],[Math.round((aa+bb)/k),'calc',`是 ${k-1} 格，不是 ${k} 格。`],[u+bb,'step1','这一步只求 1 格。']],ex:`(${bb} + ${aa}) ÷ ${k-1} = ${aa+bb} ÷ ${k-1} = ${u}。`},
    {fig,q:'How many did each of them have at first?',qz:'原来每人有多少？',a:first,d:[[u,'step1',`1 格是 ${B.n} 最后的，原来还要加回送出的 ${bb}。`],[u-bb>0?u-bb:u*k,'leftadd',`送出去之前更多：加回 ${bb}。`],[u*k,'who',`${u*k} 是 ${A.n} 最后的。`]],ex:`${B.n} 最后 ${u}，加回送出的 ${bb}：${u} + ${bb} = ${first}。两人原来都是 ${first}。`}]);});
/* reading a scale: first the small mark */
function scaleSvg(mx,maj,sub,val,unit){const W=320,L=20,R=20,y=60,sx=(W-L-R)/mx;let o=`<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" class="sc-l"/>`;const st=maj/sub;
  for(let v=0;v<=mx+1e-9;v+=st){const x=L+v*sx,big=Math.abs(v/maj-Math.round(v/maj))<1e-6;o+=`<line x1="${x.toFixed(1)}" y1="${y}" x2="${x.toFixed(1)}" y2="${y-(big?16:8)}" class="sc-l"/>`;if(big)o+=`<text x="${x.toFixed(1)}" y="${y+18}" text-anchor="middle" class="sc-t">${N(Math.round(v))}</text>`;}
  const px=L+val*sx;o+=`<path d="M${px.toFixed(1)} ${y-18}l-7 -14h14z" class="sc-p"/><text x="${W-R}" y="${y+36}" text-anchor="end" class="sc-t">${unit}</text>`;
  return `<svg viewBox="0 0 ${W} 100" role="img" aria-label="scale">${o}</svg>`;}
G('calc',T.scale,2,1,()=>{const [maj,sub,unit,zu,what]=pick([[100,5,'g','g','a bag of nuts'],[100,4,'g','g','a bag of beans'],[200,4,'mℓ','mℓ','the water in a jug'],[100,2,'mℓ','mℓ','the juice in a cup'],[1000,5,'g','g','a bag of rice'],[50,5,'cm','cm','a stick']]);
  const mx=maj*ri(4,5),st=maj/sub;let val;do{val=st*ri(1,mx/st-1);}while(val%maj===0);const fig=scaleSvg(mx,maj,sub,val,unit),p=`The scale shows ${what}.`,pz=`刻度显示的是${what.replace(/^(a|the) /,'')}。`;
  return chain(p+' What is the reading?',pz+'读数是多少？',[
    {fig,q:`Each small mark stands for how many ${unit}?`,qz:'先看：1 小格是多少？',a:`${N(st)} ${unit}`,d:[['1 '+unit,'place',`一大格 ${N(maj)} 分成 ${sub} 小格。`],[`${N(maj)} ${unit}`,'place','这是一大格。'],[`${N(maj/(sub+1)|0)} ${unit}`,'place','数“格”，不是数刻度线。']],ex:`两个数字之间是 ${N(maj)} ${unit}，分成 ${sub} 小格：${N(maj)} ÷ ${sub} = ${N(st)} ${unit}。`},
    {fig,q:'What is the reading?',qz:'读数是多少？',a:`${N(val)} ${unit}`,d:[[`${N(Math.floor(val/maj)*maj+(val%maj)/st)} ${unit}`,'place',`每小格是 ${N(st)}，不是 1。`],[`${N(val+st)} ${unit}`,'place','多数了一格。'],[`${N(val-st)} ${unit}`,'place','少数了一格。']],ex:`从 ${N(Math.floor(val/maj)*maj)} 往后数 ${(val%maj)/st} 小格，每格 ${N(st)}：${N(val)} ${unit}。`}]);});
/* line graph: true, false or not possible to tell */
const TFN=[['True','对'],['False','错'],['Not possible to tell','看不出']];
G('p4',T.tfn,2,1,()=>{const it=pick(LGI),vals=shuf([10,20,30,40,50,60,70]).slice(0,5),fig=lineG(vals,DAYS),p=`The line graph shows the number of ${it[0]} from Monday to Friday.`,pz=`折线图是星期一到星期五${it[1]}的数量。`;
  const v=ri(0,2);let s,sz,k,ex;
  if(v<2){const [i,j]=shuf([0,1,2,3,4]).slice(0,2),t=vals[i]>vals[j];k=t===(v===0)?0:1;s=`There were ${v===0?'more':'fewer'} ${it[2]} on ${DAYS[i]} than on ${DAYS[j]}.`;sz=`${DAYZ[i]}比${DAYZ[j]}${v===0?'多':'少'}。`;ex=`${DAYS[i]} 是 ${vals[i]}，${DAYS[j]} 是 ${vals[j]}，所以这句话${k===0?'对':'错'}。`;}
  else{const [i,j]=shuf([0,1,2,3,4]).slice(0,2);k=2;const o=pick([[`More boys than girls came on ${DAYS[i]}.`,`${DAYZ[i]}来的男生比女生多。`,'图上没有分男生女生'],[`It rained on ${DAYS[i]}.`,`${DAYZ[i]}下雨了。`,'图上没有天气'],[`There were more ${it[2]} on Saturday than on ${DAYS[i]}.`,`星期六比${DAYZ[i]}多。`,'图上没有星期六']]);s=o[0];sz=o[1];ex=o[2]+'，所以是 Not possible to tell（看不出）。';}
  const q=mk({p,fig,q:s+'\nTrue, False or Not possible to tell?',zh:pz+'\n\n'+sz+' 对、错，还是看不出？',a:TFN[k][0],az:TFN[k][1],d:TFN.filter((_,j)=>j!==k).map(o=>[o[0],k===2?'sense':'place',ex,o[1]]),ex});
  return q;});
/* Ch6: fraction left, in simplest form */
G('p4',T.p4fr2,2,1,()=>{const k=kid(),n=pick([12,15,16,18,20,24,30,36]);let a,b,l;do{a=ri(1,n/2|0);b=ri(1,n/2|0);l=n-a-b;}while(l<1||gcd(l,n)===1);
  const it=pick([['grapes','颗葡萄'],['sweets','颗糖'],['stickers','张贴纸']]);
  return mk({q:`${k.n} had ${n} ${it[0]}. ${k.P} gave ${a} to ${k.h} brother and ${b} to ${k.h} sister. What fraction of the ${it[0]} did ${k.p} have left? Give your answer in the simplest form.`,zh:`${k.n} 有 ${n} ${it[1]}，给哥哥 ${a}，给姐姐 ${b}。剩下的是几分之几？写成最简分数。`,a:frS(l,n),d:[[`${l}/${n}`,'frac',`${l}/${n} 还能约分。题目要 simplest form。`],[frS(a+b,n),'who','这是给出去的部分，问的是剩下的。'],[frS(l,n-a)===frS(l,n)?`${l}/${n-l}`:frS(l,n-a),'frac','分母是全部的个数。'],[frS(n,l).includes(' ')||frS(n,l)===S_(n/l)?`${l+1}/${n}`:`${n}/${l}`,'frac','分子是剩下的，分母是全部。']],ex:`剩下 ${n} − ${a} − ${b} = ${l}，是 ${l}/${n}，约分得 ${frS(l,n)}。写完问一句：还能约分吗？`});});
/* Ch7: angles on a straight line */
G('p4',T.p4a,2,1,()=>{const x=ri(25,155),y=180-x,a=x*Math.PI/180,X=150+110*Math.cos(a),Y=150-110*Math.sin(a);
  const fig=`<svg viewBox="0 0 300 170" role="img" aria-label="angles on a straight line"><line x1="20" y1="150" x2="280" y2="150" class="fg-ang"/><line x1="150" y1="150" x2="${X.toFixed(1)}" y2="${Y.toFixed(1)}" class="fg-ang"/><text x="${(150+42*Math.cos(a/2)).toFixed(1)}" y="${(150-42*Math.sin(a/2)+5).toFixed(1)}" text-anchor="middle" class="sc-t">${x}°</text><text x="${(150+42*Math.cos((a+Math.PI)/2)).toFixed(1)}" y="${(150-42*Math.sin((a+Math.PI)/2)+5).toFixed(1)}" text-anchor="middle" class="sc-t">y</text></svg>`;
  return mk({fig,q:'The two angles are on a straight line. Find ∠y.',zh:'两个角在一条直线上。求 ∠y。',a:y+'°',d:[[(90-x>0?90-x:x+90)+'°','place','直线是 180°，不是 90°。'],[x+'°','who','这是已知的角。'],[(360-x)+'°','place','一条直线上合起来是 180°。']],ex:`一条直线是 180°：180° − ${x}° = ${y}°。`});});
/* Ch8: perimeter back to a side; path around a field; square from its area */
G('p4',T.p4rs,2,1,()=>{const v=ri(0,2);
  if(v===0){const b=ri(4,15),l=b+ri(3,30),P=2*(l+b);return mk({q:`A rectangle is ${b} cm wide. Its perimeter is ${P} cm. What is its length?`,zh:`长方形宽 ${b} cm，周长 ${P} cm。长是多少？`,a:l+' cm',d:[[(P-b)+' cm','step1','周长里有两条宽。'],[(P/2)+' cm','step1',`${P/2} 是一条长加一条宽，还要减宽。`],[(P-2*b)+' cm','step1','还要 ÷ 2：剩下的是两条长。']],ex:`周长 ÷ 2 = 一条长 + 一条宽：${P} ÷ 2 = ${P/2}，${P/2} − ${b} = ${l} cm。`});}
  if(v===1){const w=pick([1,2]),B=ri(8,20),L=B+ri(4,20),inA=(L-2*w)*(B-2*w),ans=L*B-inA;return mk({q:`A rectangular field is ${L} m by ${B} m. There is a path ${w} m wide all around the inside edge of the field. What is the area of the path?`,zh:`长方形场地 ${L} m × ${B} m，沿着场地里面四周有一条宽 ${w} m 的小路。小路的面积是多少？`,a:ans+' m²',d:[[(L*B-(L-w)*(B-w))+' m²','step1',`路在两边都有：里面是 ${L} − ${2*w}、${B} − ${2*w}。`],[inA+' m²','who','这是里面草地的面积，问的是路。'],[(2*(L+B)*w)+' m²','calc','四个角被算了两次。']],ex:`里面：${L} − ${2*w} = ${L-2*w}，${B} − ${2*w} = ${B-2*w}，面积 ${inA} m²。路 = ${L*B} − ${inA} = ${ans} m²。`});}
  const s=ri(4,12);return mk({q:`A square has an area of ${s*s} cm². What is its perimeter?`,zh:`正方形面积 ${s*s} cm²。周长是多少？`,a:4*s+' cm',d:[[s+' cm','step1',`${s} cm 是一条边，周长是 4 条边。`],[(s*s/4)+' cm','calc','面积不是 4 条边。'],[4*s+' cm²','place','周长用 cm，不是 cm²。']],ex:`几乘几得 ${s*s}？${s} × ${s}，边长 ${s} cm。周长 4 × ${s} = ${4*s} cm。`});});
/* time: a slow watch, and past midnight */
G('wp',T.wtime,3,.8,()=>{const k=kid(),v=Math.random()<.5;
  if(v){const slow=pick([5,10,15,20]),d=ri(5,14)*10,show=ri(16*12,20*12)*5,real=show+slow,start=real-d;
    return mk({q:`${k.n}'s watch is ${slow} minutes slow. ${k.P} finished a run when ${k.h} watch showed ${t12(show)}. The run lasted ${dur(d)}. What was the actual time ${k.p} started?`,zh:`${k.n} 的手表慢 ${slow} 分钟。跑完时手表显示 ${t12(show)}，跑了 ${dur(d)}。真正开始的时间是几点？`,a:t12(start),d:[[t12(show-d),'time',`手表慢 ${slow} 分钟：真正的时间要加 ${slow}。`],[t12(start-2*slow),'time','手表慢，真正的时间比手表晚，要加。'],[t12(real),'step1','这是真正结束的时间，还要往前推。']],ex:`手表慢 ${slow} 分钟，真正结束 = ${t12(show)} + ${slow} 分钟 = ${t12(real)}。往前推 ${dur(d)}：${t12(start)}。`});}
  const s=ri(22*12+6,23*12+10)*5,d=ri(9,25)*10,e=(s+d)%1440,h=t=>`${pad(Math.floor(t/60)%24)} ${pad(t%60)}`;
  return mk({q:`A match started at ${h(s)} and ended at ${h(e)} the next day. How long was the match?`,zh:`比赛 ${h(s)} 开始，第二天 ${h(e)} 结束。比赛多长时间？`,a:dur(d),d:[[dur(1440-d),'time','过了午夜，不能大减小。'],[dur(d+60),'time','先算到 24 00，再加上第二天的。'],[dur(d-20>0?d-20:d+20),'time']],ex:`${h(s)} 到 24 00 是 ${dur(1440-s)}，再到 ${h(e)} 是 ${dur(e)}，一共 ${dur(d)}。`});});

const BAR=[
 {t:'几倍 · 知道小的',f:()=>{const [A,B]=two(),it=pick(STK),k=ri(2,5),b=ri(6,25),tot=Math.random()<.4,ans=tot?b*(k+1):b*k;
   return {p:`${B.n} has ${b} ${it[0]}. ${A.n} has ${tws(k)} as many ${it[0]} as ${B.n}. How many ${it[0]} ${tot?'do they have altogether':`does ${A.n} have`}?`,
     zh:`${B.n} 有 ${b} ${it[1]}。${A.n} 的是 ${B.n} 的 ${k} 倍。${tot?'两人一共有多少？':`${A.n} 有多少？`}`,
     rows:[{n:A.n,u:k,x:0},{n:B.n,u:1,x:0}],hint:`${A.n} 是 ${B.n} 的 ${k} 倍：${B.n} 画 1 格，${A.n} 画 ${k} 格，每格一样长。`,
     marks:[{v:b,at:'row:1',hint:`${b} 是 ${B.n} 的，标在 ${B.n} 那一条。`}],
     ask:{at:tot?'all':'row:0',hint:tot?'问两人一共，问号标在“全部合起来”。':`问 ${A.n} 有多少，问号标在 ${A.n} 那一条。`},
     regions:['row:0','row:1','diff','all'],
     calc:[{q:'1 格是多少？ · 1 unit = ?',a:b,o:nopt(b,[b*k,k,b+k])},
       tot?{q:'一共有几格？ · How many units altogether?',a:k+1,o:nopt(k+1,[k,1,k+2])}:{q:`${A.n} 有几格？ · How many units?`,a:k,o:nopt(k,[1,k+1,2])},
       {q:tot?`一共 = ${k+1} × ${b} = ?`:`${A.n} = ${k} × ${b} = ?`,a:ans,o:nopt(ans,[ans+b,b+k,ans-b])}],
     sum:`1 格 = ${b}。${tot?`一共 ${k+1} 格：${k+1} × ${b} = ${ans}`:`${A.n} 有 ${k} 格：${k} × ${b} = ${ans}`}。`};}},
 {t:'几倍 · 知道大的',f:()=>{const [A,B]=two(),it=pick(STK),k=ri(2,5),b=ri(6,25),a=b*k,tot=Math.random()<.5,ans=tot?a+b:b;
   return {p:`${A.n} has ${a} ${it[0]}. ${A.P} has ${tws(k)} as many ${it[0]} as ${B.n}. How many ${it[0]} ${tot?'do they have altogether':`does ${B.n} have`}?`,
     zh:`${A.n} 有 ${a} ${it[1]}，是 ${B.n} 的 ${k} 倍。${tot?'两人一共有多少？':`${B.n} 有多少？`}`,
     rows:[{n:A.n,u:k,x:0},{n:B.n,u:1,x:0}],hint:`${A.n} 是 ${B.n} 的 ${k} 倍：${B.n} 画 1 格，${A.n} 画 ${k} 格。`,
     marks:[{v:a,at:'row:0',hint:`${a} 是 ${A.n} 一共有的，标在 ${A.n} 整条（${k} 格），不是 1 格。`}],
     ask:{at:tot?'all':'row:1',hint:tot?'问两人一共，问号标在“全部合起来”。':`问 ${B.n} 有多少，问号标在 ${B.n} 那一条。`},
     regions:['row:0','row:1','diff','all'],
     calc:[{q:`${a} 是几格？ · How many units is ${a}?`,a:k,o:nopt(k,[1,k+1,2])},
       {q:`1 格 = ${a} ÷ ${k} = ?`,a:b,o:nopt(b,[a*k,a-k,a+k])},
       {q:`1 格（${b}）是谁的？ · Whose number is ${b}?`,a:B.n,o:shuf([B.n,A.n,'两人一共'])}].concat(tot?[{q:`一共 = ${a} + ${b} = ?`,a:ans,o:nopt(ans,[a,a*(k+1),a+k])}]:[]),
     sum:`${a} 是 ${k} 格，1 格 = ${a} ÷ ${k} = ${b}，是 ${B.n} 的。${tot?`一共 ${a} + ${b} = ${ans}。`:''}`};}},
 {t:'几倍 + 相差',f:()=>{const [A,B]=two(),it=pick(STK),k=ri(3,7),b=ri(8,30),d=(k-1)*b,v=ri(0,2),ans=[b*(k+1),b*k,b][v],fewer=Math.random()<.5;
   return {p:`${A.n} has ${tws(k)} as many ${it[0]} as ${B.n}. ${fewer?`${B.n} has ${d} fewer ${it[0]} than ${A.n}`:`${A.n} has ${d} more ${it[0]} than ${B.n}`}. How many ${it[0]} ${['do they have altogether',`does ${A.n} have`,`does ${B.n} have`][v]}?`,
     zh:`${A.n} 的是 ${B.n} 的 ${k} 倍。${fewer?`${B.n} 比 ${A.n} 少 ${d}`:`${A.n} 比 ${B.n} 多 ${d}`} ${it[1]}。${['两人一共有多少？',`${A.n} 有多少？`,`${B.n} 有多少？`][v]}`,
     rows:[{n:A.n,u:k,x:0},{n:B.n,u:1,x:0}],hint:`${k} 倍：${B.n} 画 1 格，${A.n} 画 ${k} 格。`,
     marks:[{v:d,at:'diff',hint:`${fewer?'少':'多'} ${d}，就是 ${A.n} 比 ${B.n} 长出来的那段。`}],
     ask:{at:['all','row:0','row:1'][v],hint:['问两人一共，问号标在“全部合起来”。',`问 ${A.n}，问号标在 ${A.n} 那一条。`,`问 ${B.n}，问号标在 ${B.n} 那一条。`][v]},
     regions:['row:0','row:1','diff','all'],
     calc:[{q:'长出来的那段是几格？ · How many units is the difference?',a:k-1,o:nopt(k-1,[k,k+1,1])},
       {q:`1 格 = ${d} ÷ ${k-1} = ?`,a:b,o:nopt(b,[Math.floor(d/k),d,d+k])}].concat([
        [{q:'一共有几格？ · How many units altogether?',a:k+1,o:nopt(k+1,[k,k-1])},{q:`一共 = ${k+1} × ${b} = ?`,a:ans,o:nopt(ans,[b*k,d,ans+b])}],
        [{q:`${A.n} 有几格？ · How many units?`,a:k,o:nopt(k,[k-1,k+1])},{q:`${A.n} = ${k} × ${b} = ?`,a:ans,o:nopt(ans,[b*(k+1),d,b])}],
        [{q:`1 格（${b}）是谁的？ · Whose number is ${b}?`,a:B.n,o:shuf([B.n,A.n,'两人一共'])}]][v]),
     sum:`长出来的 ${k-1} 格 = ${d}，1 格 = ${d} ÷ ${k-1} = ${b}。${[`一共 ${k+1} 格 = ${ans}`,`${A.n} 有 ${k} 格 = ${ans}`,`${B.n} 有 1 格 = ${b}`][v]}。`};}},
 {t:'和差 · 多一段',f:()=>{const [A,B]=two(),it=pick(STK),s=ri(10,45),d=ri(4,20),T2=2*s+d,big=Math.random()<.5,who=big?A.n:B.n;
   return {p:`${A.n} and ${B.n} have ${T2} ${it[0]} altogether. ${A.n} has ${d} more ${it[0]} than ${B.n}. How many ${it[0]} does ${who} have?`,
     zh:`${A.n} 和 ${B.n} 一共有 ${T2} ${it[1]}。${A.n} 比 ${B.n} 多 ${d}。${who} 有多少？`,
     rows:[{n:A.n,u:1,x:d},{n:B.n,u:1,x:0}],xo:[d],uv:s,hint:`${A.n} 比 ${B.n} 多 ${d}：两人都画 1 格，${A.n} 后面再多一段（+${d}）。`,
     marks:[{v:T2,at:'all',hint:`${T2} 是两人一共的，标在“全部合起来”。`}],
     ask:{at:big?'row:0':'row:1',hint:`问 ${who}，问号标在 ${who} 那一条。`},
     regions:['row:0','row:1','x:0','all'],
     calc:[{q:`先去掉多的那段：${T2} − ${d} = ?`,a:T2-d,o:nopt(T2-d,[T2+d,T2,d])},
       {q:`剩下 2 格一样长，1 格 = ${T2-d} ÷ 2 = ?`,a:s,o:nopt(s,[T2-d,s+d,Math.floor(T2/2)])},
       {q:`1 格（${s}）是谁的？ · Whose number is ${s}?`,a:B.n,o:shuf([B.n,A.n,'两人一共'])}].concat(big?[{q:`${A.n} = ${s} + ${d} = ?`,a:s+d,o:nopt(s+d,[s,T2-s,s+2*d])}]:[]),
     sum:`${T2} − ${d} = ${T2-d}，÷ 2 = ${s}，这是 ${B.n} 的。${big?`${A.n} 再加 ${d}：${s} + ${d} = ${s+d}。`:''}`};}},
 {t:'三个量',f:()=>{const p=pick([20,25,30,35,40]),q=pick([5,10,15].filter(x=>x<p)),s=ri(8,30)*5,c=p-q,T2=3*s+p+c,askA=Math.random()<.4;
   return {p:`Three ropes, A, B and C, are ${T2} cm long altogether. Rope A is ${p} cm longer than Rope B. Rope C is ${q} cm shorter than Rope A. How long is Rope ${askA?'A':'B'}?`,
     zh:`A、B、C 三根绳一共长 ${T2} cm。A 比 B 长 ${p} cm，C 比 A 短 ${q} cm。${askA?'A':'B'} 多长？`,
     rows:[{n:'Rope A',u:1,x:p},{n:'Rope B',u:1,x:0},{n:'Rope C',u:1,x:c}],xo:[p,c,q],uv:s,
     hint:`B 最短，画 1 格。A 比 B 长 ${p}：1 格再多 ${p}。C 比 A 短 ${q}，所以 C 比 B 长 ${p} − ${q} = ${c}：1 格再多 ${c}。`,
     marks:[{v:T2+' cm',at:'all',hint:'一共的长度，标在“全部合起来”。'}],
     ask:{at:askA?'row:0':'row:1',hint:`问 Rope ${askA?'A':'B'}，问号标在那一条。`},
     regions:['row:0','row:1','row:2','all'],
     calc:[{q:`去掉多的两段：${T2} − ${p} − ${c} = ?`,a:3*s,o:nopt(3*s,[T2-p-q,T2-p,T2-c])},
       {q:`剩下 3 格一样长，1 格 = ${3*s} ÷ 3 = ?`,a:s,o:nopt(s,[3*s,s+p,s+c])},
       {q:`1 格（${s} cm）是哪一根？ · Which rope is ${s} cm?`,a:'Rope B',o:shuf(['Rope B','Rope A','Rope C'])}].concat(askA?[{q:`Rope A = ${s} + ${p} = ?`,a:s+p,o:nopt(s+p,[s,s+c,s+q])}]:[]),
     sum:`${T2} − ${p} − ${c} = ${3*s}，÷ 3 = ${s} cm，这是 Rope B。${askA?`Rope A 再加 ${p}：${s+p} cm。`:''}`};}},
 {t:'前后变化 · 倒推',f:()=>{const [J,R]=two(),it=pick(STK),d=ri(10,40),rb=ri(40,150),jb=rb+d,g=ri(20,Math.min(jb-1,150)),aft=rb+g;
   return {p:`${J.n} had ${d} more ${it[0]} than ${R.n}. ${J.n} gave ${R.n} ${g} ${it[0]}. Then ${R.n} had ${aft} ${it[0]}. How many ${it[0]} did ${J.n} have at first?`,
     zh:`${J.n} 原来比 ${R.n} 多 ${d}。${J.n} 给了 ${R.n} ${g}。之后 ${R.n} 有 ${aft}。${J.n} 原来有多少？`,
     rows:[{n:R.n+' 后来',u:1,x:g,hx:1}],build:false,uv:rb,
     marks:[{v:g,at:'x:0',hint:`${g} 是 ${J.n} 给的，接在 ${R.n} 原来那段的后面。`},{v:aft,at:'row:0',hint:`${aft} 是 ${R.n} 后来一共有的，标整条。`}],
     ask:{at:'unit:0',q:`题目问 ${J.n}，要先倒推 ${R.n} 原来有多少。${R.n} 原来的那段，问号标在哪里？`,hint:`${R.n} 原来的那段，就是收到 ${g} 之前、前面那一段。`},
     regions:['row:0','unit:0','x:0'],
     calc:[{q:`倒推：${R.n} 原来 = ${aft} − ${g} = ?`,a:rb,o:nopt(rb,[aft+g,aft,g])},
       {q:`${J.n} 原来比 ${R.n} 原来多 ${d}：${J.n} 原来 = ${rb} + ${d} = ?`,a:jb,o:nopt(jb,[rb-d,rb,jb+g])},
       {q:'题目里每个数都用上了吗？ · Did you use every number?',a:`${d}、${g}、${aft} 都用上了`,o:shuf([`${d}、${g}、${aft} 都用上了`,`只用了 ${g} 和 ${aft}`,`只用了 ${aft}`])}],
     sum:`倒推：${R.n} 原来 = ${aft} − ${g} = ${rb}；${J.n} 原来比他多 ${d}：${rb} + ${d} = ${jb}。`};}},
 {t:'给多少才一样多',f:()=>{const [A,B]=two(),it=pick(STK);
   if(Math.random()<.5){const b=ri(30,300),h=ri(8,90),d=2*h,a=b+d;
     return {p:`${A.n} has ${a} ${it[0]}. ${B.n} has ${b} ${it[0]}. How many ${it[0]} must ${A.n} give ${B.n} so that they have the same number of ${it[0]}?`,
       zh:`${A.n} 有 ${a}，${B.n} 有 ${b}。${A.n} 要给 ${B.n} 多少，两人才一样多？`,
       rows:[{n:A.n,u:1,x:d},{n:B.n,u:1,x:0}],xo:[d],uv:b,hint:`${A.n} 多：两人都画 1 格，${A.n} 后面再多一段。`,
       marks:[{v:a,at:'row:0',hint:`${a} 是 ${A.n} 一共有的，标在 ${A.n} 整条。`},{v:b,at:'row:1',hint:`${b} 是 ${B.n} 的，标在 ${B.n} 那一条。`}],
       ask:{at:'x:0',q:`先找 ${A.n} 比 ${B.n} 多出来的那段。问号标在哪里？`,hint:`${A.n} 多出来的那段，就是要分一半给 ${B.n} 的地方。`},
       regions:['row:0','row:1','x:0','all'],
       calc:[{q:`多出来的那段 = ${a} − ${b} = ?`,a:d,o:nopt(d,[a+b,h,d+10])},
         {q:`多出来的那段平分两半，给 ${B.n} 一半就一样长：${d} ÷ 2 = ?`,a:h,o:nopt(h,[d,h+b,2*d])},
         {q:`给了以后每人有多少？ ${b} + ${h} = ?`,a:b+h,o:nopt(b+h,[a-d,b,a])}],
       sum:`多出来 ${a} − ${b} = ${d}。给一半：${d} ÷ 2 = ${h}。两人都变成 ${b+h}。`};}
   const k=ri(2,5),u=2*ri(3,25),T2=u*(k+1),df=u*(k-1),g=df/2;
   return {p:`${A.n} has ${tws(k)} as many ${it[0]} as ${B.n}. They have ${T2} ${it[0]} altogether. How many ${it[0]} must ${A.n} give ${B.n} so that they have the same number of ${it[0]}?`,
     zh:`${A.n} 的是 ${B.n} 的 ${k} 倍，两人一共 ${T2}。${A.n} 要给 ${B.n} 多少，两人才一样多？`,
     rows:[{n:A.n,u:k,x:0},{n:B.n,u:1,x:0}],hint:`${k} 倍：${B.n} 画 1 格，${A.n} 画 ${k} 格。`,
     marks:[{v:T2,at:'all',hint:`${T2} 是两人一共的，标在“全部合起来”。`}],
     ask:{at:'diff',q:`要给的，跟 ${A.n} 比 ${B.n} 多出来的那段有关。先在图上找到这段，问号标在哪里？`,hint:`${A.n} 比 ${B.n} 长出来的 ${k-1} 格。`},
     regions:['row:0','row:1','diff','all'],
     calc:[{q:`一共几格？1 格 = ${T2} ÷ ${k+1} = ?`,a:u,o:nopt(u,[T2/k|0,T2,u*k])},
       {q:`多出来 ${k-1} 格 = ${k-1} × ${u} = ?`,a:df,o:nopt(df,[u*k,u,df+u])},
       {q:`给一半，两人就一样长：${df} ÷ 2 = ?`,a:g,o:nopt(g,[df,u,g+u])}],
     sum:`1 格 = ${T2} ÷ ${k+1} = ${u}。多出来 ${k-1} 格 = ${df}。给一半：${g}。`};}},
 {t:'买了以后反过来多',f:()=>{const [A,B]=two(),it=pick(STK),a=ri(100,900),b=a+ri(50,700),d=ri(20,300),fin=b+d,buy=fin-a;
   return {p:`${A.n} had ${a} ${it[0]}. ${B.n} had ${b} ${it[0]}. Then ${A.n} bought some more ${it[0]}. In the end, ${A.n} had ${d} more ${it[0]} than ${B.n}. How many ${it[0]} did ${A.n} buy?`,
     zh:`${A.n} 有 ${a}，${B.n} 有 ${b}。${A.n} 又买了一些，最后 ${A.n} 比 ${B.n} 多 ${d}。${A.n} 买了多少？`,
     rows:[{n:B.n,u:1,x:0},{n:A.n+' 最后',u:1,x:d}],xo:[d],uv:b,hint:`最后 ${A.n} 比 ${B.n} 多 ${d}：两人都画 1 格，${A.n} 最后那条再多一段。`,
     marks:[{v:b,at:'row:0',hint:`${b} 是 ${B.n} 的，${B.n} 没有变。`},{v:d,at:'x:1',hint:`多 ${d}，就是 ${A.n} 最后比 ${B.n} 长出来的那段。`}],
     ask:{at:'row:1',q:`先求 ${A.n} 最后有多少。问号标在哪里？`,hint:`${A.n} 最后的整条。`},
     regions:['row:0','row:1','x:1','all'],
     calc:[{q:`${A.n} 最后 = ${b} + ${d} = ?`,a:fin,o:nopt(fin,[b-d,b,a+d])},
       {q:`${A.n} 原来有 ${a}，买了多少？ ${fin} − ${a} = ?`,a:buy,o:nopt(buy,[fin+a,b-a,d])},
       {q:'题目里每个数都用上了吗？ · Did you use every number?',a:`${a}、${b}、${d} 都用上了`,o:shuf([`${a}、${b}、${d} 都用上了`,`只用了 ${b} 和 ${d}`,`只用了 ${a} 和 ${b}`])}],
     sum:`${A.n} 最后 = ${b} + ${d} = ${fin}。买了 ${fin} − ${a} = ${buy}。`};}}];

/* ---------- word cards: maths words in English ---------- */
/* a small bar model for a word card: rows of [name, [[units,label,style]...]], marks over or under a row */
function bm(rows,marks){const U=34,X0=rows.some(r=>r[0])?Math.max(64,Math.max(...rows.map(r=>(r[0]||'').length))*8+12):8,H=28,G=26;const top=(marks||[]).some(m=>m.top&&m.row===0)?24:4;
  let y=top,out='',maxx=0;const ys=[];
  rows.forEach(([name,parts])=>{ys.push(y);let x=X0;if(name)out+=`<text x="${X0-8}" y="${y+H/2+5}" text-anchor="end" class="bm-n">${name}</text>`;
    parts.forEach(([w,t,c])=>{out+=`<rect x="${x}" y="${y}" width="${w*U}" height="${H}" rx="4" class="bm-${c||'a'}"/>`;if(t)out+=`<text x="${x+w*U/2}" y="${y+H/2+5}" text-anchor="middle" class="bm-t">${t}</text>`;x+=w*U;});
    maxx=Math.max(maxx,x);y+=H+G;});
  let bottom=y-G;(marks||[]).forEach(m=>{const x1=X0+m.from*U,x2=X0+m.to*U,mid=(x1+x2)/2;
    if(m.top){const yy=ys[m.row]-6;out+=`<path d="M${x1} ${yy+4}V${yy}H${x2}V${yy+4}" class="bm-l"/><text x="${mid}" y="${yy-5}" text-anchor="middle" class="bm-t">${m.text}</text>`;}
    else{const yy=ys[m.row]+H+6;out+=`<path d="M${x1} ${yy-4}V${yy}H${x2}V${yy-4}" class="bm-l"/><text x="${mid}" y="${yy+15}" text-anchor="middle" class="bm-t">${m.text}</text>`;bottom=Math.max(bottom,yy+20);}});
  return `<svg viewBox="0 0 ${maxx+8} ${bottom+6}" role="img" aria-label="bar model">${out}</svg>`;}
const WORDSETS=[
{title:'4A words 1',zh:'4A 常用词 1（第1–2章）',words:[
 ['digit','数字（一位上的 0–9）','one of the numbers 0 to 9 in a bigger number','In 45 678, the **digit** 6 stands for 600.'],
 ['round off','四舍五入','change a number to a close, easy number','**Round off** 4 362 to the nearest hundred: 4 400.'],
 ['nearest','最接近的','the closest one','4 362 is **nearest** to 4 400.'],
 ['factor','因数','a number that divides another number with no remainder','3 is a **factor** of 12 because 12 ÷ 3 = 4.'],
 ['multiple','倍数','what you get when you multiply a number by 1, 2, 3 …','12 is a **multiple** of 3 because 3 × 4 = 12.']]},
{title:'4A words 2',zh:'4A 常用词 2（第2–4章）',words:[
 ['common','公共的（两个都有）','shared by two or more numbers','4 is a **common** factor of 8 and 12.'],
 ['product','积（乘出来的数）','the answer to a multiplication','The **product** of 6 and 7 is 42.'],
 ['quotient','商（除出来的数）','the answer to a division','In 17 ÷ 5 = 3 R 2, the **quotient** is 3.'],
 ['remainder','余数','what is left over after dividing equally','In 17 ÷ 5 = 3 R 2, the **remainder** is 2.'],
 ['line graph','折线图','a graph with points joined by straight lines','The **line graph** shows how many cups were sold each day.']]},
{title:'4A words 3',zh:'4A 常用词 3（第5–8章）',words:[
 ['improper fraction','假分数','a fraction whose top number is bigger than or equal to the bottom number','7/4 is an **improper fraction**.'],
 ['mixed number','带分数','a whole number and a fraction together','1 3/4 is a **mixed number**.'],
 ['acute angle','锐角','an angle smaller than a right angle','A 40° angle is an **acute angle**.'],
 ['obtuse angle','钝角','an angle bigger than a right angle but smaller than 180°','A 120° angle is an **obtuse angle**.'],
 ['opposite sides','对边','sides that face each other','In a rectangle, the **opposite sides** are equal.']]},
{title:'Word problems 1',zh:'应用题常用词 1',words:[
 ['altogether','一共','all added together','How many sweets do they have **altogether**?',bm([['',[[2.5,'5','a'],[1.5,'3','b']]]],[{row:0,from:0,to:4,top:1,text:'altogether = ?'}])],
 ['left','剩下','what is still there after some are taken away','She ate 3 apples. How many apples are **left**?',bm([['',[[1.5,'ate 3','c'],[3.5,'left = ?','a']]]],[{row:0,from:0,to:5,top:1,text:'all the apples'}])],
 ['each','每个','every one','**Each** box has 6 eggs.',bm([['',[[1.6,'6','a'],[1.6,'6','a'],[1.6,'6','a']]]],[{row:0,from:0,to:1.6,top:0,text:'each box'}])],
 ['more than','比……多','a bigger number than','Ali has 5 **more than** Ben.',bm([['Ali',[[3,'','a'],[1.5,'5 more','b']]],['Ben',[[3,'','a']]]])],
 ['fewer than','比……少','a smaller number than','Ben has 5 **fewer than** Ali.',bm([['Ali',[[3,'','a'],[1.5,'','a']]],['Ben',[[3,'','a'],[1.5,'5 fewer','g']]]])]]},
{title:'Word problems 2',zh:'应用题常用词 2',words:[
 ['total','总数','the amount when everything is added','The **total** cost is $25.',bm([['',[[2,'$10','a'],[1.6,'$8','b'],[1.4,'$7','a']]]],[{row:0,from:0,to:5,top:1,text:'total = $25'}])],
 ['difference','差','how much bigger one number is than another','The **difference** between 9 and 4 is 5.',bm([['9',[[4.5,'','a']]],['4',[[2,'','a'],[2.5,'difference','g']]]])],
 ['twice','两倍','two times','Kai is **twice** as tall as his little brother.',bm([['Kai',[[2,'1','a'],[2,'1','a']]],['brother',[[2,'1','a']]]])],
 ['times as many','几倍','used to say one amount is a number of times another','Siti has 3 **times as many** stamps as Mei.',bm([['Siti',[[1.5,'1','a'],[1.5,'1','a'],[1.5,'1','a']]],['Mei',[[1.5,'1','a']]]])],
 ['equally','平均地','into parts that are the same size','Share the cake **equally** among 4 children.',bm([['',[[1.4,'?','a'],[1.4,'?','a'],[1.4,'?','a'],[1.4,'?','a']]]],[{row:0,from:0,to:5.6,top:1,text:'the whole cake'},{row:0,from:0,to:1.4,top:0,text:'each child'}])]]},
{title:'Word problems 3',zh:'应用题常用词 3',words:[
 ['at first','起初、一开始','how many there were before anything changed','**At first**, Mei had 20 stickers. Then she gave away 5.',bm([['',[[1.5,'gave 5','c'],[3.5,'now','a']]]],[{row:0,from:0,to:5,top:1,text:'at first = 20'}])],
 ['in the end','最后','after everything has happened','**In the end**, Mei had 15 stickers.',bm([['at first',[[5,'20','a']]],['in the end',[[3.75,'?','a'],[1.25,'gave 5','g']]]])],
 ['how many more','多多少','the difference: how much bigger one is','Ali has 12 cards and Ben has 8. **How many more** cards does Ali have?',bm([['Ali',[[4.8,'12','a']]],['Ben',[[3.2,'8','a'],[1.6,'?','g']]]])],
 ['remaining','剩下的','what is still there after some is used','He spent $6. How much money is **remaining**?',bm([['',[[2,'spent $6','c'],[3,'remaining = ?','a']]]],[{row:0,from:0,to:5,top:1,text:'all his money'}])],
 ['per','每（一个）','for each one','Apples cost $3 **per** kg.',bm([['',[[1.5,'$3','a'],[1.5,'$3','a'],[1.5,'$3','a']]]],[{row:0,from:0,to:1.5,top:0,text:'1 kg'}])]]},
{title:'Calculation',zh:'计算',words:[
 ['sum','和','the answer when you add','The **sum** of 3 and 4 is 7.'],
 ['product','积','the answer when you multiply','The **product** of 3 and 4 is 12.'],
 ['quotient','商','the answer when you divide','The **quotient** of 12 ÷ 3 is 4.'],
 ['remainder','余数','what is left over after dividing','13 ÷ 4 = 3 with a **remainder** of 1.'],
 ['divide','除','share into equal groups','**Divide** 20 by 5.']]},
{title:'Length and area',zh:'长度和面积',words:[
 ['length','长','how long something is','The **length** of the table is 2 m.'],
 ['breadth','宽','how wide something is','The **breadth** of the rectangle is 4 cm.'],
 ['perimeter','周长','the distance all the way round a shape','The **perimeter** of the square is 20 cm.'],
 ['area','面积','how much flat space a shape covers','The **area** of the square is 25 cm².'],
 ['rectangle','长方形','a shape with 4 sides and 4 right angles','A door is shaped like a **rectangle**.']]},
{title:'Measures',zh:'测量',words:[
 ['mass','质量','how heavy something is','The **mass** of the bag is 2 kg.'],
 ['volume','体积、容量','how much liquid something holds','The **volume** of water in the jug is 1 ℓ.'],
 ['capacity','容量（最多装多少）','the most a container can hold','The **capacity** of the bottle is 500 ml.'],
 ['convert','换算','change from one unit to another','**Convert** 2 m to centimetres.'],
 ['measure','量','find the size of something','Use a ruler to **measure** the line.']]},
{title:'Time',zh:'时间',words:[
 ['duration','经过的时间','how long something lasts','The **duration** of the movie is 2 hours.'],
 ['earlier','更早','before, at a time before','The bus came 10 minutes **earlier**.'],
 ['later','更晚','after, at a time after','We will eat 30 minutes **later**.'],
 ['noon','中午 12 点','12 o’clock in the day','We eat lunch at **noon**.'],
 ['midnight','半夜 12 点','12 o’clock at night','The clock struck **midnight**.']]},
{title:'P4 numbers',zh:'四年级的数',words:[
 ['digit','数字（0–9）','one of the numbers 0 to 9 that make up a number','The **digit** 5 is in the tens place.'],
 ['value','数值','how much a digit stands for','The **value** of the digit 3 in 300 is 300.'],
 ['round off','四舍五入','change a number to the nearest ten, hundred or thousand','**Round off** 47 to the nearest ten.'],
 ['nearest','最接近的','closest','48 is 50 to the **nearest** ten.'],
 ['estimate','估算','work out a number that is close to the answer','**Estimate** the answer before you work it out.']]},
{title:'P4 factors and angles',zh:'因数倍数和角',words:[
 ['factor','因数','a number that divides another number with no remainder','3 is a **factor** of 12.'],
 ['multiple','倍数','the answer when you multiply a number by 1, 2, 3 …','12 is a **multiple** of 3.'],
 ['angle','角','the space between two lines that meet','A square has four right **angles**.'],
 ['degree','度（°）','the unit for measuring angles','A right angle is 90 **degrees**.'],
 ['protractor','量角器','a tool for measuring angles','Use a **protractor** to measure the angle.']]},
];

/* ---------- engine ---------- */
const CATW={wp:.45,calc:.25,p4:.3};
function wpick(arr,wf){let t=0;arr.forEach(x=>t+=wf(x));let r=Math.random()*t;for(const x of arr){r-=wf(x);if(r<=0)return x;}return arr[arr.length-1];}
function pickCat(){return wpick(Object.keys(CATW),k=>CATW[k]);}
function key(q){return (q.p||'')+'|'+q.q+(q.fig?'|'+hash(q.fig):'')+'|'+q.opts.slice().sort().join('|');}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
function make(c,l,fresh,ok2){let pool=GENS.filter(g=>g.c===c&&g.l===l);if(!pool.length)pool=GENS.filter(g=>g.c===c);let q;
  const F=W.QB&&W.QB.focus;if(c==='p4'&&F){const ch=g=>+((/^Ch(\d)/.exec(g.t)||[])[1]||0),cur=GENS.filter(g=>g.c==='p4'&&ch(g)===F),lv=cur.filter(g=>g.l===l),prev=pool.filter(g=>ch(g)<F);
    if(cur.length)pool=(Math.random()<.7||!prev.length)?(lv.length?lv:cur):prev;}
  const one=()=>{const g=wpick(pool,x=>x.w);const x=g.f();(Array.isArray(x)?x:[x]).forEach(y=>{y.c=c;y.t=g.t;y.l=g.l;});return x;};
  const k0=x=>key(Array.isArray(x)?x[x.length-1]:x);
  for(let k=0;k<60;k++){q=one();if(!fresh||fresh(k0(q)))return q;}
  if(ok2)for(let k=0;k<30;k++){q=one();if(ok2(k0(q)))return q;}
  return q;}
/* every round: a calculation warm-up first, at most two harder items, an easy one to finish */
function plan(mode){
  if(mode==='calc')return[['calc',1],['calc',1],['calc',2],['calc',2],['calc',1]];
  if(mode==='p4')return[['p4',1],['p4',1],['p4',2],['p4',2],['p4',1]];
  if(mode==='wp')return[['wp',1],['wp',1],['wp',3],['wp',2],['wp',1]];
  /* the holiday is mainly a 4A preview: three 4A questions and two word problems */
  return[['p4',1],['wp',2],['p4',2],['p4',2],['wp',3]];}
function size(){return GENS.length;}
/* write it down: the step-by-step problem from this round (or a fresh one), full working on paper */
W.QB={GENS,make,pickCat,key,hash,shuf,size,WORDSETS,ERRS,plan,missSlot:3,lines:true,CH,BAR,
  /* word-set order before the 4A sets were put in front; old saves kept learned sets by this position */
  OLDSETS:WORDSETS.map(x=>x.title).filter(t=>!/^4A words/.test(t))};
})(typeof window!=='undefined'?window:globalThis);
