/* 答题本领 Answer skills: four kinds of science questions that train how to answer, not just what.
   dir   — tap the direction word first (increase / decrease / NOT ...), then choose.
   build — put word chunks in order to make a 拿分魔法句 (magic sentence).
   sort  — sort the variables of an experiment: change / measure / keep the same.
   chart — read a bar chart: True / False / Not possible to tell.
   Every kind still goes through choose(), so stars, misses, log and saves work as before.
   The questions use the existing categories (life / mat / p4), so old saves need nothing new. */
const SK={};window.SK=SK;
SK.cards=/*__CARDS__*/[];
SK.cat=code=>{const n=+code.split('·')[1],p4=code.startsWith('P4');return p4?'p4':(n<=4?'life':'mat');};
SK.DIR=[
 ['Ali wants to find out if a **bigger** magnet can attract **more** paper clips. What should he change?','阿里想知道更大的磁铁能不能吸更多回形针。他要改变什么?','bigger',['The size of the magnet|磁铁的大小','The number of paper clips|回形针的数量','The material of the paper clips|回形针的材料','The shape of the table|桌子的形状'],'The question says "bigger magnet", so he changes the size of the magnet. The paper clips are what he counts.','mat'],
 ['Which material would **NOT** be attracted to a magnet?','哪种材料**不会**被磁铁吸引?','NOT',['Copper|铜','Iron|铁','Steel|钢','Nickel|镍'],'Circle NOT first! Iron, steel, nickel and cobalt are magnetic. Copper is not.','mat'],
 ['When the temperature **decreases**, what happens to the time the mealworm takes to become a beetle?','温度**降低**时,黄粉虫变成甲虫的时间会怎样?','decreases',['It becomes longer|变长','It becomes shorter|变短','It stays the same|不变','It stops at once|马上停止'],'Circle "decreases". Colder means slower growth, so the time becomes longer.','life'],
 ['Which of these is **NOT** a characteristic of all living things?','下面哪个**不是**所有生物的特征?','NOT',['They can move from place to place|会从一处移动到另一处','They grow|会生长','They reproduce|会繁殖','They respond to changes|会对变化作出反应'],'Plants are living but do not move from place to place. Circle NOT before you choose.','life'],
 ['The object is moved **nearer** to the torch. What happens to the shadow?','物体被移得**更靠近**手电筒。影子会怎样?','nearer',['It becomes bigger|变大','It becomes smaller|变小','It stays the same|不变','It disappears|消失'],'Nearer to the light → the object blocks more light → the shadow becomes bigger.','p4'],
 ['Which material is the **poorest** conductor of heat?','哪种材料是**最差的**热导体?','poorest',['Wood|木头','Steel|钢','Copper|铜','Aluminium|铝'],'"Poorest conductor" = best insulator. Metals are good conductors; wood is a poor conductor of heat.','p4'],
 ['The number of coils of wire around the iron nail is **increased**. What happens?','铁钉上绕的线圈数**增加**了。会怎样?','increased',['The electromagnet attracts more pins|电磁铁吸更多大头针','The electromagnet attracts fewer pins|吸更少大头针','The nail becomes copper|铁钉变成铜','Nothing changes|没有变化'],'More coils of wire → stronger electromagnet → more pins attracted.','p4'],
 ['Which part of the plant does **NOT** need light to carry out its job?','植物的哪个部分做它的工作**不需要**光?','NOT',['The roots|根','The leaves|叶','The green stem|绿色的茎','None of the parts|没有'],'Roots take in water and mineral salts from the soil. They do not make food, so they do not need light.','p4'],
 ['The mass of the ice **remains the same** when it melts. What happens to its volume?','冰融化时质量**保持不变**。它的体积会怎样?','same',['It becomes smaller|变小','It becomes bigger|变大','It disappears|消失','It becomes zero|变成零'],'Mass stays the same. Water takes up less space than the same ice, so the volume becomes smaller.','p4'],
 ['Which animal does **NOT** have a pupa stage in its life cycle?','哪种动物的生命周期**没有**蛹期?','NOT',['Cockroach|蟑螂','Butterfly|蝴蝶','Mosquito|蚊子','Beetle|甲虫'],'Cockroach: egg → nymph → adult. 3 stages, no pupa.','life'],
 ['The torch is moved **further** from the screen but the object stays still. What happens to the shadow?','手电筒离屏幕**更远**,物体不动。影子会怎样?','further',['It becomes smaller|变小','It becomes bigger|变大','It disappears|消失','It changes colour|变颜色'],'The torch moves further away from the object, so the object blocks less of the light cone. The shadow becomes smaller.','p4'],
 ['Which of these is **NOT** a source of light?','下面哪个**不是**光源?','NOT',['The Moon|月亮','The Sun|太阳','A lit candle|点燃的蜡烛','A firefly|萤火虫'],'The Moon only reflects light from the Sun. It does not give off its own light.','p4'],
];
SK.SORT=[
 {aim:'Ali wants to find out if the **type of soil** affects **how tall** the plant grows.',az:'阿里想知道土壤种类会不会影响植物长多高。',v:[['Type of soil|土壤种类',0],['Height of the plant|植物的高度',1],['Amount of water given|浇水的量',2],['Type of plant|植物种类',2]],c:'life'},
 {aim:'Mei wants to find out if the **size of a magnet** affects **the number of paper clips** it attracts.',az:'小美想知道磁铁大小会不会影响吸的回形针数量。',v:[['Size of the magnet|磁铁大小',0],['Number of paper clips|回形针数量',1],['Type of paper clips|回形针种类',2],['Distance from the clips|离回形针的距离',2]],c:'mat'},
 {aim:'Ben wants to find out if the **number of coils** affects **the strength of an electromagnet**.',az:'阿本想知道线圈数会不会影响电磁铁的强弱。',v:[['Number of coils of wire|线圈数',0],['Number of pins attracted|吸住的大头针数',1],['Number of batteries|电池数量',2],['Size of the iron nail|铁钉大小',2]],c:'p4'},
 {aim:'Sam wants to find out if the **type of material** affects **how fast hot water cools**.',az:'小山想知道材料种类会不会影响热水冷却的快慢。',v:[['Type of material of the cup|杯子的材料',0],['Temperature of water after 10 min|10分钟后的水温',1],['Amount of water|水量',2],['Starting temperature of water|开始的水温',2]],c:'p4'},
 {aim:'Lin wants to find out if **light** affects **the growth of bread mould**.',az:'小林想知道光会不会影响面包霉菌的生长。',v:[['Amount of light|光的多少',0],['Size of the mould patch|霉斑的大小',1],['Type of bread|面包种类',2],['Amount of water added|加的水量',2]],c:'life'},
 {aim:'Kai wants to find out if **the distance between the torch and the object** affects **the size of the shadow**.',az:'小凯想知道手电筒和物体的距离会不会影响影子的大小。',v:[['Distance of torch from object|手电筒到物体的距离',0],['Size of the shadow|影子的大小',1],['Object used|使用的物体',2],['Distance of object from screen|物体到屏幕的距离',2]],c:'p4'},
];
SK.BIN=['I change 我改变','I measure 我测量','Keep the same 不变'];
SK.CHART=[
 {t:'Paper clips attracted by magnets A, B, C, D',tz:'磁铁A、B、C、D吸住的回形针数',l:['A','B','C','D'],d:[12,5,9,2],u:'clips',c:'mat',qs:[
  ['Magnet A is the strongest.','A是最强的磁铁。',0,'A attracts the most clips (12), so it is the strongest.'],
  ['Magnet D is the biggest magnet.','D是最大的磁铁。',2,'The chart shows strength, not size. We cannot tell which magnet is biggest.'],
  ['Magnet B attracts more clips than magnet C.','B比C吸的回形针多。',1,'B attracts 5, C attracts 9. So this is false.']]},
 {t:'Height of plant after 2 weeks in different light',tz:'不同光照下2周后植物的高度',l:['Dark','Dim','Bright'],d:[3,8,14],u:'cm',c:'life',qs:[
  ['The plant in bright light grew the tallest.','亮光下的植物长得最高。',0,'Bright: 14 cm, the tallest bar.'],
  ['The plant in the dark died.','黑暗中的植物死了。',2,'The chart only shows height (3 cm). It does not say the plant died.'],
  ['The plant in dim light grew taller than the plant in bright light.','弱光下的植物比亮光下的高。',1,'Dim 8 cm is shorter than bright 14 cm. False.']]},
 {t:'Time for ice to melt in cups of different materials',tz:'不同材料杯子里冰融化所需时间',l:['Metal','Glass','Plastic','Foam'],d:[10,18,25,40],u:'min',c:'p4',qs:[
  ['Ice melted fastest in the metal cup.','冰在金属杯里融化得最快。',0,'Metal: 10 min, the shortest time = fastest. Metal is a good conductor of heat.'],
  ['Foam is the best conductor of heat.','泡沫是最好的热导体。',1,'Ice lasted longest in foam, so foam is the poorest conductor (best insulator). False.'],
  ['The foam cup is the most expensive.','泡沫杯最贵。',2,'The chart says nothing about price. Not possible to tell.']]},
 {t:'Number of eggs laid by an insect in each week',tz:'某昆虫每周产卵数',l:['Wk 1','Wk 2','Wk 3','Wk 4'],d:[20,35,15,5],u:'eggs',c:'life',qs:[
  ['The insect laid the most eggs in week 2.','第2周产卵最多。',0,'Week 2: 35, the tallest bar.'],
  ['The number of eggs increased every week.','产卵数每周都在增加。',1,'It went up in week 2, then went down. False.'],
  ['All the eggs hatched.','所有卵都孵化了。',2,'The chart shows eggs laid, not hatched. Not possible to tell.']]},
];
SK.TF=['True|对','False|错','Not possible to tell|无法判断'];
SK.svg=function(ch){const W=300,H=170,b=26,mx=Math.max(...ch.d)*1.15,w=(W-40)/ch.l.length;let s=`<svg viewBox="0 0 ${W} ${H+22}" style="width:100%;max-width:340px" role="img" aria-label="bar chart"><text x="${W/2}" y="12" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">${ch.t}</text><line x1="32" y1="${H}" x2="${W}" y2="${H}" stroke="currentColor"/><line x1="32" y1="20" x2="32" y2="${H}" stroke="currentColor"/>`;
  ch.d.forEach((v,i)=>{const h=(H-b)*v/mx,x=40+i*w;s+=`<rect x="${x}" y="${H-h}" width="${w*0.6}" height="${h}" rx="3" fill="var(--p4,#7c5cff)" opacity=".85"/><text x="${x+w*0.3}" y="${H-h-4}" text-anchor="middle" font-size="11" fill="currentColor">${v}</text><text x="${x+w*0.3}" y="${H+14}" text-anchor="middle" font-size="11" fill="currentColor">${ch.l[i]}</text>`;});
  return s+`<text x="4" y="${H/2}" font-size="9" fill="currentColor" transform="rotate(-90 10 ${H/2})">${ch.u}</text></svg>`;};
SK.mk=function(o){const ops=o.opts.map(x=>x.split('|'));const q={c:o.c,t:o.t,lv:2,q:o.q,qz:o.qz,opts:ops.map(x=>x[0]),zo:ops.map(x=>x[1]||x[0]),ans:0,ex:o.ex,ui:o.ui};
  if(o.fig)q.fig=o.fig;if(o.data)q.sk=o.data;
  if(o.ui==='dir'||o.ui==='chart'){if(o.ui==='dir'){const idx=QB.shuf(q.opts.map((_,i)=>i));['opts','zo'].forEach(f=>q[f]=idx.map(i=>q[f][i]));q.ans=idx.indexOf(0);}else q.ans=o.ans;}
  return q;};
SK.gen={
 dir(){const d=SK.DIR[Math.floor(Math.random()*SK.DIR.length)];return SK.mk({c:d[5],t:'答题本领 · 圈方向词',q:d[0],qz:d[1],opts:d[3],ex:d[4],ui:'dir',data:{w:d[2]}});},
 build(){const c=SK.cards[Math.floor(Math.random()*SK.cards.length)],w=c[5].split(' '),ch=[];const n=w.length<=6?2:3;
   for(let i=0;i<w.length;i+=n)ch.push(w.slice(i,i+n).join(' '));
   return SK.mk({c:SK.cat(c[0]),t:'答题本领 · 拼魔法句',q:c[3],qz:c[4],opts:[c[5]+'|'+'按顺序拼好','(wrong order)|顺序不对'],ex:'Say it aloud 大声读一遍: '+c[5],ui:'build',data:{ch}});},
 sort(){const e=SK.SORT[Math.floor(Math.random()*SK.SORT.length)];return SK.mk({c:e.c,t:'答题本领 · 变量分类',q:e.aim,qz:e.az+' 把每个变量放进对的盒子。',opts:['All sorted correctly|全部分对','Some wrong|有分错'],ex:'变量三问: What do I change? What do I measure? What must I keep the same? Only ONE thing changes in a fair test.',ui:'sort',data:{v:e.v}});},
 chart(){const ch=SK.CHART[Math.floor(Math.random()*SK.CHART.length)],k=ch.qs[Math.floor(Math.random()*ch.qs.length)];
   return SK.mk({c:ch.c,t:'答题本领 · 读图表',q:'Based only on the chart: **'+k[0]+'**',qz:'只根据图表:'+k[1]+' 对、错,还是无法判断?',opts:SK.TF,ex:k[3]+' (Based only on the chart = 只看图上有的。)',ui:'chart',ans:k[2],fig:SK.svg(ch)});}
};
SK.round=function(){const ks=QB.shuf(['dir','build','sort','chart','dir','build','chart','sort']).slice(0,5);return ks.map(k=>SK.gen[k]());};
/* draw the widget after the normal question screen */
SK.fail=q=>q.ans===0?1:0;
SK.draw=function(){const q=R&&R.qs[R.i];if(!q||!q.ui)return;const box=$('opts');
 if(q.ui==='dir'&&!q.again){const opts=[...box.children];opts.forEach(b=>b.style.display='none');
   const tip=document.createElement('div');tip.className='skw';tip.innerHTML='<p class="skh">先圈方向词 👆 Tap the direction word</p>';
   const words=q.q.replace(/\*\*/g,'').split(/\s+/),p=document.createElement('p');p.className='skwords';
   words.forEach(w=>{const s=document.createElement('button');s.className='skword';s.textContent=w;s.onclick=()=>{const hit=w.replace(/[^A-Za-z]/g,'').toLowerCase()===q.sk.w.toLowerCase();
     if(hit){s.classList.add('on');tip.remove();opts.forEach(b=>b.style.display='');$('qText').innerHTML=$('qText').innerHTML;}else{s.classList.add('nope');setTimeout(()=>s.classList.remove('nope'),500);}};p.appendChild(s);});
   tip.appendChild(p);box.prepend(tip);}
 if(q.ui==='build'){box.innerHTML='';const ord=q.sk.ch,pool=QB.shuf(ord.map((_,i)=>i));let got=[];
   const out=document.createElement('div');out.className='skout';const bank=document.createElement('div');bank.className='skbank';
   const paint=()=>{out.innerHTML=got.length?got.map(i=>`<span class="skchip on">${esc(ord[i])}</span>`).join(' '):'<span class="skh">点下面的词块,按顺序拼句子</span>';};
   pool.forEach(i=>{const b=document.createElement('button');b.className='skchip';b.textContent=ord[i];b.onclick=()=>{if(b.disabled)return;b.disabled=true;b.classList.add('used');got.push(i);paint();if(got.length===ord.length){const ok=got.every((g,j)=>ord[g]===ord[j]);choose(ok?q.ans:SK.fail(q));if(!ok)$('fbS').innerHTML='正确顺序:'+esc(ord.join(' '));}};bank.appendChild(b);});
   const undo=document.createElement('button');undo.className='skundo';undo.textContent='↩ 退一步';undo.onclick=()=>{const i=got.pop();if(i===undefined)return;[...bank.children].find(b=>b.textContent===ord[i]&&b.disabled).disabled=false;[...bank.children].forEach(b=>{if(!b.disabled)b.classList.remove('used');});paint();};
   paint();box.append(out,bank,undo);}
 if(q.ui==='sort'){box.innerHTML='';const v=q.sk.v,pick={};const list=document.createElement('div');list.className='sksort';
   v.forEach((x,i)=>{const r=document.createElement('div');r.className='skrow';const [en,zh]=x[0].split('|');r.innerHTML=`<div class="skvar">${esc(en)}<small>${esc(zh)}</small></div>`;
     const bs=document.createElement('div');bs.className='skbins';SK.BIN.forEach((n,k)=>{const b=document.createElement('button');b.className='skbin';b.textContent=n;b.onclick=()=>{pick[i]=k;[...bs.children].forEach((c,j)=>c.classList.toggle('on',j===k));};bs.appendChild(b);});r.appendChild(bs);list.appendChild(r);});
   const go=document.createElement('button');go.className='opt skgo';go.textContent='Check 检查';go.onclick=()=>{if(Object.keys(pick).length<v.length){go.textContent='每个都要选哦 · Sort them all';return;}
     const ok=v.every((x,i)=>pick[i]===x[1]);choose(ok?q.ans:SK.fail(q));
     $('fbS').innerHTML=v.map(x=>esc(x[0].split('|')[1])+' → '+SK.BIN[x[1]].split(' ').pop()).join('<br>');};
   box.append(list,go);}
};
HOOK.round=(function(old){return function(mode){if(mode==='skill')return SK.round();return old?old(mode):null;};})(HOOK.round);
/* also mix one skill question into normal topic rounds */
HOOK.answer=HOOK.answer||[];
(function(){const _s=showQ;showQ=function(){_s();try{SK.draw();}catch(e){}};})();
(function(){const _st=startRound;startRound=function(mode){_st(mode);try{if(R&&R.qs&&['life','mat','p4'].includes(mode)&&!R.qs.some(q=>q.ui)){const ks=['dir','chart','build','sort'];let q,n=0;do{q=SK.gen[ks[Math.floor(Math.random()*4)]]();}while(q.c!==mode&&++n<30);if(q.c===mode){R.qs[R.qs.length-1]=q;pips();if(R.i===R.qs.length-1)showQ();}}}catch(e){}};})();
