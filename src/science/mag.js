/* 磁铁实验室 Magnet Lab — P3 课本第 6–7 章 (Properties of Magnets / Making and Using Magnets).
   One thing per screen: first do it (drag / tap), then one question with three big buttons, then the textbook sentence.
   磁铁星: ① 磁铁侦探 ② 会不会被吸 ③ 磁极和指南   电磁铁星: ④ 做磁铁 ⑤ 生活中的磁铁
   Drawn in code, works offline. Progress in S.mag.done. */
const MG_SETS={mag:['a','b','c'],emag:['d','e']};
const MG_NAME={a:'🕵️ 磁铁侦探',b:'🗂️ 会不会被吸',c:'📍 磁极和指南',d:'🔧 做磁铁',e:'🏠 生活中的磁铁'};
const MG_BARS=[{id:'X',k:'magnet'},{id:'Y',k:'obj'},{id:'Z',k:'non'}];
const MG_OBJ=[['🔩','iron nail','铁钉',1],['🥫','aluminium can','铝罐',0],['📎','steel clip','钢夹子',1],['🧵','copper wire','铜线',0],['🥛','glass cup','玻璃杯',0],['📏','wooden ruler','木尺',0],['🥄','steel spoon','钢汤匙',1],['🧴','plastic bottle','塑料瓶',0]];
let MG=null;
function mgSt(){if(!S.mag||typeof S.mag!=='object')S.mag={};if(!S.mag.done||typeof S.mag.done!=='object')S.mag.done={};return S.mag;}
function mgDone(set){return (MG_SETS[set]||[]).every(k=>mgSt().done[k]);}
/* ---- steps of each experiment: {d:'kind', ...} 'q' = question (first option right) ---- */
function mgSteps(e){
  if(e==='a')return [].concat(...MG_BARS.map((b,i)=>[{d:'bar',bi:i},{d:'q',q:`What is bar ${b.id}?`,zh:`${b.id} 是什么？`,o:b.k==='magnet'?['a magnet 磁铁','a magnetic object 磁性物体','non-magnetic 非磁性']:b.k==='obj'?['a magnetic object 磁性物体','a magnet 磁铁','non-magnetic 非磁性']:['non-magnetic 非磁性','a magnet 磁铁','a magnetic object 磁性物体'],
    ex:b.k==='magnet'?'It repelled the magnet. Only a magnet can repel another magnet.':b.k==='obj'?'Both poles attracted it, and it was never pushed away. A magnet would repel one of the poles.':'Nothing happened. It is made of a non-magnetic material.',
    exZh:b.k==='magnet'?'被推开过 → 一定是磁铁。':b.k==='obj'?'两头都被吸、从来没被推开 → 只是磁性物体（他期末第 23 题）。':'两头都没反应 → 非磁性材料。',star:b.k==='magnet'?'You can confirm that an object is a magnet if it repels another magnet.':null}]));
  if(e==='b')return [{d:'sort'},{d:'q',q:'Who made the correct statement?',zh:'谁说对了？（课本第 109 页）',o:['Devi: Magnets attract magnetic materials.','Chen: Magnets repel non-magnetic materials.','Ali: Magnets attract all objects made of metals.'],ex:'Aluminium and copper are metals, but they are not attracted. Non-magnetic materials are not pushed away either — nothing happens.',exZh:'铝和铜是金属却不被吸；非磁性材料也不会被推开，只是没反应。',star:'Metals such as aluminium and copper are also non-magnetic.'}];
  if(e==='c')return [{d:'clips'},{d:'q',q:'Which parts of the magnet attracted the most clips?',zh:'磁铁的哪里吸的回形针最多？',o:['the two poles (the ends)','the middle','all parts the same'],ex:'A magnet has two poles where the attraction is the strongest.',exZh:'两头（磁极）吸力最强。',star:'A magnet has two poles where the attraction is the strongest.'},
    {d:'hang'},{d:'q',q:'A bar magnet hangs freely. In which direction does it come to rest?',zh:'吊起来的磁铁最后停在哪个方向？',o:['North–South','East–West','any direction'],ex:'Earth behaves like a magnet. A freely suspended magnet always points North–South.',exZh:'地球像一块大磁铁，吊起来的磁铁总是指南北。',star:'A freely suspended magnet comes to rest in the North-South direction.'}];
  if(e==='d')return [{d:'stroke',n:6},{d:'stroke',n:12},{d:'q',q:'What happens when the iron nail is stroked more times?',zh:'铁钉擦的次数越多，会怎样？',o:['It becomes a stronger magnet and attracts more clips.','It becomes weaker.','Nothing changes.'],ex:'Stroke with the same pole, in the same direction, more times → a stronger magnet.',exZh:'同一个极、同一个方向，擦得越多，磁性越强。',star:'The iron nail will become a stronger magnet when it is stroked more times.'},
    {d:'em',s:0},{d:'em',s:1},{d:'em',s:2},{d:'q',q:'To find out if the number of batteries affects the electromagnet, what must be kept the same?',zh:'要看电池数量有没有影响，什么要保持一样？',o:['the number of turns of wire','the number of batteries','the number of clips attracted'],ex:'Change only the number of batteries. Keep the turns, the nail and the clips the same. Count the clips.',exZh:'只改电池数；圈数、钉子、夹子不变；量吸了几个夹子（课本第 118 页）。',star:'To conduct a fair test, only one variable is changed. The other variables are kept the same.'},
    {d:'em',s:3},{d:'em',s:4},{d:'q',q:'What happens to the steel clips when the battery is removed?',zh:'拔掉电池，回形针会怎样？',o:['They drop off.','They stay on the nail.','They are pushed away.'],ex:'Without electricity, the electromagnet stops being a magnet.',exZh:'没有电，电磁铁就没有磁性了（课本第 124 页）。',star:'Objects made of iron and steel can be made into magnets using the stroke method or the electrical method.'}];
  if(e==='e')return [
    {d:'life',ic:'🧲',t:'Refrigerator door 冰箱门',q:'Why does the fridge door stay closed?',zh:'冰箱门为什么关得紧？',o:['The magnetic strip attracts the steel body of the fridge.','The magnetic strip repels the fridge.','The door is heavy.'],ex:'Magnets attract objects made of magnetic materials such as steel.',exZh:'门边的磁条吸住钢做的冰箱身。'},
    {d:'life',ic:'🏗️',t:'Scrapyard crane 废铁场起重机',q:'How can the crane drop the scrap metal where it wants?',zh:'起重机怎样把废铁放下来？',o:['It switches off the electromagnet.','It turns the magnet around.','It uses a bigger magnet.'],ex:'An electromagnet is a magnet only when electricity flows. Switch it off and the iron and steel drop.',exZh:'电磁铁断电就没有磁性，废铁就掉下来。'},
    {d:'life',ic:'🚄',t:'Maglev train 磁浮列车',q:'Why can a maglev train float above the track?',zh:'磁浮列车为什么能浮在轨道上？',o:['The magnets on the train and the track repel one another.','The magnets attract one another.','The train is very light.'],ex:'Like poles repel, so the train is pushed up and “floats”.',exZh:'同极相斥，把列车推起来。'},
    {d:'sep'},{d:'q',q:'Why do the steel cans fall into container Q, not P?',zh:'为什么钢罐掉进 Q，不掉进 P？（他期末第 34 题）',o:['Drum X is a magnet. It attracts the steel cans so they stay on the belt longer.','The steel cans are heavier.','The steel cans are darker.'],ex:'Steel is magnetic, so the magnet drum holds it longer. Aluminium is non-magnetic and falls off first into P.',exZh:'滚筒是磁铁，吸住钢罐让它多转一段才掉；铝不被吸，先掉进 P。',star:'Properties of magnets allow us to use magnets in everyday life.'}];
  return [];}
/* ---- open / flow ---- */
function mgOpen(set){mgSt();MG={set,list:MG_SETS[set],ei:0,si:0};const st=mgSt();const j=MG.list.findIndex(k=>!st.done[k]);MG.ei=j<0?0:j;mgStartExp();show('vMag');}
function mgStartExp(){const e=MG.list[MG.ei];MG.e=e;MG.steps=mgSteps(e);MG.si=0;mgStep();}
function mgStep(){const st=MG.steps[MG.si];MG.ans=null;MG.st={};
  $('mgTitle').innerHTML=`${esc(MG_NAME[MG.e])}<small>第 ${MG.ei+1} 个实验 · 共 ${MG.list.length} 个</small>`;
  $('mgDots').innerHTML=MG.list.map((k,i)=>`<i class="${i<MG.ei||mgSt().done[k]&&i!==MG.ei?'ok':i===MG.ei?'on':''}"></i>`).join('');
  if(!st){mgFinishExp();return;}
  const fn=MG_DRAW[st.d==='q'?'q':st.d];fn(st);}
function mgNext(){MG.si++;mgStep();}
function mgFinishExp(){const st=mgSt(),e=MG.e,first=!st.done[e];st.done[e]=1;
  if(first){S.stars=(S.stars||0)+1;const dk=dkey(new Date());S.days[dk]=(S.days[dk]||0)+1;if(!Array.isArray(S.log))S.log=[];
    S.log.push({d:dk,ts:Date.now(),c:'mat',t:'磁铁实验室 · Magnet Lab',k:MG_NAME[e],h:QB.hash('mag:'+e),ok:1});}
  save();const last=MG.ei>=MG.list.length-1;
  mgSide(`<div class="mg-big">🎉 ${esc(MG_NAME[e])} 完成！</div>${first?'<div class="mg-do">+1 ★</div>':''}<button class="mg-go" data-mg="${last?'back':'nextexp'}">${last?'回到星球 →':'下一个实验 →'}</button>`);
  $('mgStage').innerHTML=mgSvg(`<text x="240" y="190" text-anchor="middle" font-size="80">🧲</text>`);}
/* ---- drawing helpers ---- */
function mgSvg(inner){return `<svg viewBox="0 0 480 360" id="mgSvg">${inner}</svg>`;}
function mgBar(x,y,w,h,leftN,lab){const a=leftN?'#E8463C':'#3F5BD6',b=leftN?'#3F5BD6':'#E8463C';return `<g transform="translate(${x} ${y})"><rect width="${w/2}" height="${h}" rx="5" fill="${a}"/><rect x="${w/2}" width="${w/2}" height="${h}" rx="5" fill="${b}"/>${lab!==false?`<text x="${w/4}" y="${h/2+7}" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">${leftN?'N':'S'}</text><text x="${w*3/4}" y="${h/2+7}" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">${leftN?'S':'N'}</text>`:''}</g>`;}
function mgClip(x,y,r){return `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-4" y="-10" width="8" height="20" rx="4" fill="none" stroke="#7b8494" stroke-width="2"/><rect x="-2" y="-6" width="4" height="13" rx="2" fill="none" stroke="#7b8494" stroke-width="1.5"/></g>`;}
function mgSide(h){$('mgSide').innerHTML=h;}
function mgSay(t){try{speakText(t);}catch(e){}}
/* ---- the question screen (same for every experiment) ---- */
function mgQ(st){if(!MG.st.opts)MG.st.opts=st.o.map((t,i)=>({t,ok:i===0})).sort(()=>Math.random()-.5);const a=MG.ans;
  mgSide(`<div class="mg-card"><div class="mg-big">${esc(st.q)}</div><small>${esc(st.zh)}</small></div>
   ${MG.st.opts.map((o,i)=>`<button class="mg-opt${a!=null?(o.ok?' ok':i===a?' bad':''):''}" data-mgo="${i}">${esc(o.t)}${a!=null&&o.ok?' ✓':''}</button>`).join('')}
   ${a!=null?`<div class="mg-fb${MG.st.opts[a].ok?'':' bad'}"><b>${MG.st.opts[a].ok?'✓ 对了！':'✗ 再想想'}</b><div>${esc(st.ex)}</div><small>${esc(st.exZh)}</small></div>${st.star?`<div class="mg-star">★ ${esc(st.star)}</div>`:''}<button class="mg-go" data-mg="next">下一步 →</button>`:''}`);}
const MG_DRAW={
 q(st){if(!$('mgSvg'))$('mgStage').innerHTML=mgSvg('');mgQ(st);},
 /* ① a bar: drag (or tap) the magnet to it; ⟲ turns the magnet round */
 bar(st){const b=MG_BARS[st.bi];MG.st={b,face:'N',tried:{},x:40,bx:300};mgBarDraw();
   mgSide(`<div class="mg-card"><div class="mg-big">把磁铁推过去碰 ${b.id}。</div>N 极、S 极两头都试。<small>Drag the magnet to bar ${b.id}. Try both poles.</small></div><div class="mg-card mg-log" id="mgLog"></div>`);mgBarLog();},
 sort(){MG.st={i:0,done:[]};mgSortDraw();mgSide(`<div class="mg-card"><div class="mg-big">点一样东西，拿去碰磁铁。</div><small>Tap an object to test it with the magnet.</small></div><div class="mg-card mg-log" id="mgLog">还没试</div>`);},
 clips(){MG.st={down:false};mgClipsDraw();mgSide(`<div class="mg-card"><div class="mg-big">把磁铁放进回形针里，再拿起来。</div><small>Hold a bar magnet over some steel clips.</small></div><button class="mg-go" data-mg="dip">⬇ 放下去</button>`);},
 hang(){MG.st={ang:-70,spun:false};mgHangDraw();mgSide(`<div class="mg-card"><div class="mg-big">把磁铁吊起来，放手。</div><small>Let the bar magnet hang freely.</small></div><button class="mg-go" data-mg="spin">放手 ✋</button>`);},
 stroke(st){MG.st={n:st.n===6?0:(MG.strokes||0),goal:st.n,x:110,drag:false,tested:false};if(st.n===6)MG.strokes=0;mgStrokeDraw();
   mgSide(`<div class="mg-card"><div class="mg-big">${st.n===6?'用磁铁的 S 极擦铁钉 6 次。':'再擦 6 次，一共 12 次。'}</div>从钉头往钉尖拖，每次都同一个方向。<small>Stroke the iron nail with one pole, in the same direction each time.</small></div><div class="mg-card mg-log" id="mgLog"></div>`);mgStrokeLog();},
 em(st){MG.st={s:st.s,did:false};const T=MG_EM[st.s];mgEmDraw(T.before);
   mgSide(`<div class="mg-card"><div class="mg-big">${T.ask}</div><small>${T.en}</small></div><button class="mg-go" data-mg="em">${T.btn}</button><div class="mg-card mg-log" id="mgLog"></div>`);},
 life(st){if(!MG.st.opts)MG.st.opts=st.o.map((t,i)=>({t,ok:i===0})).sort(()=>Math.random()-.5);$('mgStage').innerHTML=mgSvg(`<text x="240" y="190" text-anchor="middle" font-size="120">${st.ic}</text><text x="240" y="300" text-anchor="middle" font-size="24" font-weight="900" fill="#2a2550">${esc(st.t)}</text>`);mgQ(st);},
 sep(){MG.st={run:false};mgSepDraw(0);mgSide(`<div class="mg-card"><div class="mg-big">磁选机：钢罐和铝罐一起放上传送带。</div>滚筒 X 是磁铁。看它们掉进哪个箱子。<small>Drum X is a magnet.</small></div><button class="mg-go" data-mg="sep">▶ 开动</button>`);}
};
/* ① bars */
function mgBarDraw(){const s=MG.st;$('mgStage').innerHTML=mgSvg(`<text x="20" y="40" font-size="16" font-weight="800" fill="#6b5fae">你的磁铁 · 朝 ${s.b.id} 的是 ${s.face} 极</text>
  <g id="mgMag" style="cursor:grab">${mgBar(s.x,160,150,44,s.face==='S')}</g>
  <g transform="translate(${s.bx} 160)"><rect width="130" height="44" rx="6" fill="#9aa3b5"/><text x="65" y="30" text-anchor="middle" font-weight="900" fill="#fff" font-size="22">${s.b.id}</text></g>
  ${s.msg?`<text x="290" y="140" text-anchor="middle" font-size="22" font-weight="900" fill="${s.msgc}">${s.msg}</text>`:''}
  <text x="40" y="335" font-size="17" font-weight="800" fill="#2a2550">N 极：${({repel:'推开 ↔',attract:'吸住',none:'没反应'})[s.tried.N]||'?'}　　S 极：${({repel:'推开 ↔',attract:'吸住',none:'没反应'})[s.tried.S]||'?'}</text>
  <g data-mg="flip" style="cursor:pointer"><rect x="40" y="250" width="150" height="46" rx="14" fill="#7a4fe0"/><text x="115" y="280" text-anchor="middle" font-size="18" font-weight="900" fill="#fff">⟲ 翻面</text></g>
  <g data-mg="push" style="cursor:pointer"><rect x="210" y="250" width="150" height="46" rx="14" fill="#ff7b39"/><text x="285" y="280" text-anchor="middle" font-size="18" font-weight="900" fill="#fff">推过去 →</text></g>`);}
function mgBarLog(){const t=MG.st.tried,e=x=>x==='repel'?'<b style="color:#d23a2f">推开 ↔</b>':x==='attract'?'<b style="color:#157446">吸住</b>':x==='none'?'<b style="color:#6b5fae">没反应</b>':'还没试';
  const el=$('mgLog');if(el)el.innerHTML=`N 极 → ${e(t.N)}<br>S 极 → ${e(t.S)}`;}
function mgBarHit(){const s=MG.st;if(s.busy)return;s.busy=true;const k=s.b.k,r=k==='magnet'?(s.face==='N'?'repel':'attract'):k==='obj'?'attract':'none';
  s.x=s.bx-150-6;s.msg=r==='repel'?'push!':r==='attract'?'pull!':'…';s.msgc=r==='repel'?'#E8463C':r==='attract'?'#157446':'#6b5fae';
  if(r==='repel'){s.bx=360;}if(r==='attract'){s.x=s.bx-150;}mgBarDraw();s.tried[s.face]=r;mgBarLog();mgSay(r==='repel'?'push':r==='attract'?'pull':'');
  setTimeout(()=>{s.x=40;s.bx=300;s.msg='';s.busy=false;mgBarDraw();if(s.tried.N&&s.tried.S){setTimeout(mgNext,300);}else{mgSide($('mgSide').innerHTML.replace(/把磁铁推过去碰/,'换另一头再试：碰'));mgBarLog();}},1100);}
/* ② sort */
function mgSortDraw(){const s=MG.st;let h=mgBar(170,20,140,36,true)+`<rect x="20" y="250" width="200" height="100" rx="14" fill="#e8fff2" stroke="#6fe3a1" stroke-width="3"/><text x="120" y="272" text-anchor="middle" font-weight="900" fill="#157446">被吸 Magnetic</text>
  <rect x="260" y="250" width="200" height="100" rx="14" fill="#fff0ea" stroke="#ff9a6b" stroke-width="3"/><text x="360" y="272" text-anchor="middle" font-weight="900" fill="#b44a17">不吸 Non-magnetic</text>`;
  let inM=0,inN=0;MG_OBJ.forEach((o,i)=>{const d=s.done.includes(i);let x,y;
    if(d){if(o[3]){x=30+(inM%2)*95;y=285+Math.floor(inM/2)*20;inM++;}else{x=270+(inN%2)*95;y=285+Math.floor(inN/2)*20;inN++;}
      h+=`<g transform="translate(${x} ${y})"><rect width="90" height="18" rx="8" fill="#fff" stroke="#c9c2ea"/><text x="45" y="13" text-anchor="middle" font-size="10" font-weight="800" fill="#2a2550">${o[0]} ${o[1]}</text></g>`;}
    else{x=20+(i%4)*115;y=110+Math.floor(i/4)*62;h+=`<g data-mgobj="${i}" style="cursor:pointer" transform="translate(${x} ${y})"><rect width="105" height="52" rx="12" fill="#fff3c4" stroke="#e0c26a" stroke-width="2"/><text x="52" y="24" text-anchor="middle" font-size="20">${o[0]}</text><text x="52" y="44" text-anchor="middle" font-size="11" font-weight="800" fill="#2a2550">${o[1]}</text></g>`;}});
  if(s.test!=null){const o=MG_OBJ[s.test];h+=`<g transform="translate(240 ${o[3]?78:110})"><text text-anchor="middle" font-size="34">${o[0]}</text></g><text x="240" y="${o[3]?66:150}" text-anchor="middle" font-size="18" font-weight="900" fill="${o[3]?'#157446':'#6b5fae'}">${o[3]?'吸住了！':'没反应'}</text>`;}
  $('mgStage').innerHTML=mgSvg(h);}
function mgSortTap(i){const s=MG.st;if(s.busy||s.done.includes(i))return;s.busy=true;s.test=i;mgSortDraw();const o=MG_OBJ[i];
  $('mgLog').innerHTML=`<b>${o[0]} ${o[1]} ${o[2]}</b>：${o[3]?'<b style="color:#157446">被吸住 → magnetic</b>':'<b style="color:#6b5fae">没反应 → non-magnetic</b>'}${!o[3]&&/aluminium|copper/.test(o[1])?'<br><small>是金属，但不被吸！</small>':''}`;
  setTimeout(()=>{s.test=null;s.done.push(i);s.busy=false;mgSortDraw();if(s.done.length===MG_OBJ.length)setTimeout(mgNext,400);},1100);}
/* ③ poles and North-South */
function mgClipsDraw(){const s=MG.st;let h=`<rect x="60" y="250" width="360" height="70" rx="12" fill="#eef1f7" stroke="#c8cede"/>`;
  for(let i=0;i<22;i++)h+=mgClip(80+(i*37)%330,265+(i*13)%40,(i*47)%180);
  if(!s.down)h+=mgBar(140,60,200,46,true);else{h+=mgBar(140,140,200,46,true);for(let i=0;i<6;i++){h+=mgClip(140+((i%3)-1)*9,196+Math.floor(i/3)*16,(i-3)*14);h+=mgClip(340+((i%3)-1)*9,196+Math.floor(i/3)*16,(i-3)*14);}h+=mgClip(240,196,8);
   h+=`<text x="140" y="250" text-anchor="middle" font-weight="900" fill="#157446" font-size="18">6</text><text x="240" y="240" text-anchor="middle" font-weight="900" fill="#6b5fae" font-size="18">1</text><text x="340" y="250" text-anchor="middle" font-weight="900" fill="#157446" font-size="18">6</text>`;}
  $('mgStage').innerHTML=mgSvg(h);}
function mgHangDraw(){const s=MG.st,a=s.ang;$('mgStage').innerHTML=mgSvg(`<line x1="240" y1="20" x2="240" y2="140" stroke="#555" stroke-width="2"/>
  <g transform="translate(240 160) rotate(${a})">${mgBar(-90,-18,180,36,true)}</g>
  <g transform="translate(240 280)"><circle r="54" fill="#fff" stroke="#2a2550" stroke-width="3"/><text y="-34" text-anchor="middle" font-weight="900" fill="#E8463C">N</text><text y="46" text-anchor="middle" font-weight="900" fill="#2a2550">S</text><text x="-42" y="6" text-anchor="middle" font-weight="900" fill="#2a2550">W</text><text x="42" y="6" text-anchor="middle" font-weight="900" fill="#2a2550">E</text><path d="M0 -26 L6 0 L0 26 L-6 0Z" fill="#E8463C"/></g>
  ${s.spun?'<text x="400" y="80" font-weight="900" fill="#157446" font-size="18">北 ↑ 南</text>':''}`);}
/* ④ stroke + electromagnet */
function mgStrokeDraw(){const s=MG.st;let h=`<rect x="90" y="200" width="300" height="12" rx="6" fill="#8a93a3"/><circle cx="90" cy="206" r="11" fill="#6b7383"/><path d="M390 200 L410 206 L390 212Z" fill="#8a93a3"/>
  <path d="M120 175 H380" stroke="#157446" stroke-width="3" stroke-dasharray="7 6"/><path d="M380 175 l-10 -6 v12z" fill="#157446"/>
  <g id="mgMag" style="cursor:grab" transform="translate(${s.x-35} 110)"><g transform="rotate(90 35 0)">${mgBar(-20,-18,90,36,false)}</g></g>
  <text x="20" y="40" font-size="18" font-weight="900" fill="#2a2550">擦了 ${s.n} 次</text>`;
  if(s.tested){const c=Math.min(Math.floor(s.n/3),6);for(let i=0;i<c;i++)h+=mgClip(412+(i%3)*10,226+Math.floor(i/3)*18,(i-2)*14);h+=`<text x="420" y="290" text-anchor="middle" font-weight="900" fill="#157446">${c} 个</text>`;}
  $('mgStage').innerHTML=mgSvg(h);}
function mgStrokeLog(){const s=MG.st,el=$('mgLog');if(!el)return;el.innerHTML=s.warn?`<b style="color:#b44a17">${s.warn}</b>`:s.n>=s.goal?(s.tested?`测试：吸了 <b>${Math.min(Math.floor(s.n/3),6)}</b> 个回形针。<button class="mg-go" data-mg="next">下一步 →</button>`:`<button class="mg-go" data-mg="test">📎 拿去碰回形针</button>`):`再擦 ${s.goal-s.n} 次`;}
const MG_EM=[
 {before:{t:10,b:1,nail:'iron',on:false},after:{t:10,b:1,nail:'iron',on:true},ask:'接上电池，看铁钉能吸几个回形针。',en:'Connect the battery.',btn:'🔌 接上电池',say:'10 圈、1 个电池：吸了 3 个。'},
 {before:{t:10,b:1,nail:'iron',on:true},after:{t:20,b:1,nail:'iron',on:true},ask:'只改一样：线圈从 10 圈加到 20 圈。',en:'Increase the turns of wire: 10 → 20.',btn:'🌀 加到 20 圈',say:'20 圈：吸了 6 个，变多了！'},
 {before:{t:10,b:1,nail:'iron',on:true},after:{t:10,b:2,nail:'iron',on:true},ask:'圈数回到 10 圈，这次只改电池：1 个 → 2 个。',en:'Keep 10 turns. Use 2 batteries.',btn:'🔋 加一个电池',say:'2 个电池：吸了 6 个，也变多了！'},
 {before:{t:10,b:1,nail:'iron',on:true},after:{t:10,b:1,nail:'copper',on:true},ask:'把铁钉换成铜钉。',en:'Use a copper nail instead.',btn:'🟠 换成铜钉',say:'铜钉：一个都吸不起来。铜不是磁性材料。'},
 {before:{t:10,b:1,nail:'iron',on:true},after:{t:10,b:1,nail:'iron',on:false},ask:'换回铁钉，然后拔掉电池。',en:'Remove the battery.',btn:'✂ 拔掉电池',say:'拔掉电池：回形针全掉下来了。'}];
function mgEmCount(c){return !c.on||c.nail==='copper'?0:c.t===20||c.b===2?6:3;}
function mgEmDraw(c){let h=`<rect x="90" y="110" width="300" height="12" rx="6" fill="${c.nail==='copper'?'#c8783a':'#8a93a3'}"/><text x="240" y="100" text-anchor="middle" font-size="13" font-weight="800" fill="#6b5fae">${c.nail==='copper'?'copper nail 铜钉':'iron nail 铁钉'}</text>`;
  for(let i=0;i<c.t;i++)h+=`<path d="M${150+i*(c.t===20?7:12)} 104 v24" stroke="#d1492f" stroke-width="3"/>`;
  h+=`<path d="M150 116 C70 116 70 290 170 290 M${c.t===20?283:258} 116 C410 116 410 290 ${c.b===2?330:290} 290" stroke="#8a2f22" stroke-width="2.5" fill="none"/>`;
  for(let k=0;k<c.b;k++)h+=`<rect x="${180+k*80}" y="${c.on?274:300}" width="${c.on?72:60}" height="30" rx="6" fill="#F5B93E" opacity="${c.on?1:.5}"/><rect x="${180+k*80+(c.on?66:54)}" y="${c.on?280:306}" width="8" height="18" fill="#555"/>`;
  h+=`<text x="245" y="335" text-anchor="middle" font-size="14" font-weight="800" fill="#2a2550">${c.t} 圈 · ${c.b} 个电池${c.on?'':' · 没接上'}</text>`;
  const n=mgEmCount(c);for(let i=0;i<n;i++)h+=mgClip(400+(i%3)*10,132+Math.floor(i/3)*18,(i-2)*14);
  if(!n&&MG.st.did)for(let i=0;i<3;i++)h+=mgClip(390+i*14,330,80);
  h+=`<text x="420" y="${n?185:220}" text-anchor="middle" font-weight="900" fill="${n?'#157446':'#b44a17'}" font-size="18">${n} 个</text>`;
  $('mgStage').innerHTML=mgSvg(h);}
/* ⑤ separator */
function mgSepDraw(t){let h=`<rect x="20" y="120" width="300" height="16" rx="8" fill="#444"/><circle cx="320" cy="128" r="34" fill="#E8463C" stroke="#8a2f22" stroke-width="3"/><text x="320" y="134" text-anchor="middle" font-weight="900" fill="#fff">X</text>
  <rect x="300" y="270" width="70" height="70" rx="6" fill="#fff0ea" stroke="#ff9a6b" stroke-width="3"/><text x="335" y="312" text-anchor="middle" font-weight="900" fill="#b44a17" font-size="20">P</text>
  <rect x="200" y="270" width="70" height="70" rx="6" fill="#e8fff2" stroke="#6fe3a1" stroke-width="3"/><text x="235" y="312" text-anchor="middle" font-weight="900" fill="#157446" font-size="20">Q</text>`;
  const items=[['🥫','steel',0],['🥤','alu',1],['🥫','steel',2],['🥤','alu',3]];
  items.forEach(([e,k,i])=>{const p=Math.max(0,Math.min(1,t*1.6-i*.25));let x,y;
    if(p<.55){x=40+p/.55*270;y=110;}else if(k==='alu'){const q=(p-.55)/.45;x=345+q*0;y=110+q*190;}else{const q=(p-.55)/.45;const ang=q*Math.PI*.9;x=320+Math.sin(ang)*46;y=128-Math.cos(ang)*46;if(q>.75){const r=(q-.75)/.25;x=x+(235-x)*r;y=y+(300-y)*r;}}
    h+=`<text x="${x}" y="${y}" text-anchor="middle" font-size="26">${e}</text><text x="${x}" y="${y+14}" text-anchor="middle" font-size="9" font-weight="800" fill="#2a2550">${k==='steel'?'steel':'aluminium'}</text>`;});
  $('mgStage').innerHTML=mgSvg(h);}
/* ---- events ---- */
$('vMag').addEventListener('click',e=>{const t=e.target;let x;
  if(x=t.closest('[data-mgo]')){if(MG.ans!=null)return;MG.ans=+x.dataset.mgo;const st=MG.steps[MG.si];mgQ(st);return;}
  if(x=t.closest('[data-mgobj]')){mgSortTap(+x.dataset.mgobj);return;}
  if(!(x=t.closest('[data-mg]')))return;const a=x.dataset.mg,s=MG.st;
  if(a==='next')return mgNext();if(a==='nextexp'){MG.ei++;mgStartExp();return;}if(a==='back'){mgBackOut();return;}
  if(a==='flip'){if(s.busy)return;s.face=s.face==='N'?'S':'N';mgBarDraw();return;}
  if(a==='push'){mgBarHit();return;}
  if(a==='dip'){s.down=true;mgClipsDraw();mgSide(`<div class="mg-card"><div class="mg-big">两头各吸了 6 个，中间只有 1 个。</div><small>The poles of the bar magnet attract the most clips.</small></div><button class="mg-go" data-mg="next">下一步 →</button>`);return;}
  if(a==='spin'){if(s.spun)return;let k=0;const iv=setInterval(()=>{k++;s.ang=-70+Math.sin(k/3)*(90*Math.exp(-k/12))+70*(1-Math.exp(-k/10));if(k>40){clearInterval(iv);s.ang=90;s.spun=true;mgSide(`<div class="mg-card"><div class="mg-big">停下来了：N 极指北，S 极指南。</div><small>It points North–South, like a compass.</small></div><button class="mg-go" data-mg="next">下一步 →</button>`);}mgHangDraw();},50);return;}
  if(a==='test'){s.tested=true;mgStrokeDraw();mgStrokeLog();MG.strokes=s.n;return;}
  if(a==='em'){if(s.did)return;s.did=true;const T=MG_EM[s.s];mgEmDraw(T.after);$('mgLog').innerHTML=`<b>${T.say}</b><button class="mg-go" data-mg="next">下一步 →</button>`;x.remove();return;}
  if(a==='sep'){if(s.run)return;s.run=true;let t=0;const iv=setInterval(()=>{t+=.02;mgSepDraw(t);if(t>=1.25){clearInterval(iv);mgSide(`<div class="mg-card"><div class="mg-big">钢罐掉进 Q，铝罐掉进 P。</div><small>The steel cans fall into Q. The aluminium cans fall into P.</small></div><button class="mg-go" data-mg="next">下一步 →</button>`);}},40);return;}
});
/* drag: the magnet in ① (towards the bar) and in ④ (along the nail) */
$('mgStage').addEventListener('pointerdown',e=>{const g=e.target.closest('#mgMag');if(!g||!MG)return;const st=MG.steps[MG.si];if(!st)return;
  const toX=ev=>{const svg=$('mgSvg'),pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse()).x;};   /* the picture is redrawn while dragging: always measure the current one */
  const s=MG.st,x0=toX(e),sx=s.x;let moved=false;e.preventDefault();if(st.d==='stroke'&&s.warn){s.warn='';mgStrokeLog();}
  const mv=ev=>{const dx=toX(ev)-x0;if(Math.abs(dx)>4)moved=true;
    if(st.d==='bar'){if(s.busy)return;s.x=Math.max(10,Math.min(s.bx-150,sx+dx));mgBarDraw();if(s.x>=s.bx-152){end();mgBarHit();}}
    else if(st.d==='stroke'){const nx=Math.max(110,Math.min(380,sx+dx));if(nx<s.x-25&&s.x>200){s.warn='要同一个方向！从钉头往钉尖擦，擦完把磁铁拿起来再回到钉头。';mgStrokeLog();}s.x=nx;mgStrokeDraw();
      if(s.x>=375&&!s.counted){s.counted=true;if(s.n<s.goal&&!s.warn)s.n++;mgStrokeLog();setTimeout(()=>{s.x=110;s.counted=false;mgStrokeDraw();},250);end();}}};
  const end=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);};
  const up=()=>{end();if(!moved&&st.d==='bar')mgBarHit();if(st.d==='stroke'&&!s.counted){s.x=110;mgStrokeDraw();}};
  addEventListener('pointermove',mv);addEventListener('pointerup',up);});
function mgBackOut(){if(window.__pl&&__pl.PLN()!=null)__pl.plOpen();else home();}
$('mgBack').addEventListener('click',mgBackOut);
window.__mag={MG:()=>MG,mgOpen,MG_OBJ,MG_BARS,mgDone};
