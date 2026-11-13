/* ---------- 画线段图: he builds the bar model himself (units, extra pieces), puts the numbers and the ? on it, then uses it ---------- */
let BR=null;
function barTypes(){return QB.BAR||[];}
function barSt(){if(!S.bar||typeof S.bar!=='object')S.bar={};if(!S.bar.n||typeof S.bar.n!=='object')S.bar.n={};if(!(S.bar.cur>=0&&S.bar.cur<barTypes().length))S.bar.cur=0;return S.bar;}
function barNote(){document.body.classList.remove('br-wide');const el=$('brNote');if(el){const t=barTypes()[barSt().cur];el.textContent=t?'下一个：'+t.t:'';}}
function barStart(ti){const st=barSt();if(typeof ti==='number')st.cur=ti;const L=barTypes()[st.cur].f(),pre=L.build===false;
  BR={ti:st.cur,L,step:pre?'mark':'build',rows:L.rows.map(r=>({u:pre?r.u:1,x:pre?(r.x||0):0})),mi:0,ci:0,tries:0,help:0,lab:[],used:[],zh:false,sel:null,msg:pre?'这一种图已经画好了：先看懂它，再标数字。':''};
  show('vBar');document.body.classList.add('br-wide');barDraw();}
function barGeo(){const L=BR.L,rows=BR.step==='build'?BR.rows:L.rows.map(r=>({u:r.u,x:r.x||0})),n=rows.length;
  const maxX=Math.max(1,...L.rows.map(r=>r.x||0),...(L.xo||[0])),maxU=Math.max(...rows.map(r=>r.u),BR.step==='build'?4:1),hasX=rows.some(r=>r.x)||!!L.xo;
  const BU=Math.min(70,Math.floor(300/(maxU+(hasX?1.4:0)))),xw=rows.map(r=>r.x?Math.round(BU*(L.uv?Math.min(1.6,Math.max(.4,r.x/L.uv)):0.6+0.8*(r.x/maxX))):0),len=rows.map((r,j)=>r.u*BU+xw[j]);
  const NL=barNameW(L.rows.map(r=>r.n))+16,TM=34,RH=32,RG=46,maxLen=Math.max(...len,BU*(maxU+(hasX?1.4:0))),W=NL+maxLen+(L.regions.includes('all')?92:28),H=TM+n*(RH+RG)-RG+34;
  return {rows,n,BU,xw,len,NL,TM,RH,RG,maxLen,W,H,y:j=>TM+j*(RH+RG)};}
/* width of the longest row name, measured with the page font (an estimate if the canvas is not available) */
function barNameW(ns){let c=null;try{c=document.createElement('canvas').getContext('2d');c.font='800 15px '+getComputedStyle(document.body).fontFamily;}catch(e){c=null;}
  return Math.ceil(Math.max(48,...ns.map(n=>c?c.measureText(n).width:[...n].reduce((a,ch)=>a+(/[\u3000-\u9fff]/.test(ch)?16:ch===' '?5:10),0))));}
function barRects(id,g){const [k,s]=id.split(':'),i=+s;
  if(k==='row')return [[g.NL,g.y(i),g.len[i],g.RH]];
  if(k==='unit')return [[g.NL,g.y(i),g.BU,g.RH]];
  if(k==='x')return [[g.NL+g.rows[i].u*g.BU,g.y(i),g.xw[i],g.RH]];
  if(k==='diff')return [[g.NL+g.len[1],g.y(0),g.len[0]-g.len[1],g.RH]];
  return g.rows.map((r,j)=>[g.NL,g.y(j),g.len[j],g.RH]);}
function barLabel(l,g){const [k,s]=l.at.split(':'),i=+s,cls='br-l'+(l.q?' q':'');
  if(k==='all'){const x=g.NL+g.maxLen+12,y1=g.y(0),y2=g.y(g.n-1)+g.RH;return `<path d="M${x-5} ${y1}H${x}V${y2}H${x-5}" class="br-b"/><text x="${x+8}" y="${(y1+y2)/2+5}" class="${cls}">${esc(l.t)}</text>`;}
  const [[x,y,w]]=barRects(l.at,g);
  if(k==='row'){const yy=y+g.RH+7;return `<path d="M${x} ${yy-4}V${yy}H${x+w}V${yy-4}" class="br-b"/><text x="${x+w/2}" y="${yy+16}" text-anchor="middle" class="${cls}">${esc(l.t)}</text>`;}
  const yy=y-7;return `<path d="M${x} ${yy+4}V${yy}H${x+w}V${yy+4}" class="br-b"/><text x="${x+w/2}" y="${yy-5}" text-anchor="middle" class="${cls}">${esc(l.t)}</text>`;}
function barSvg(){const g=barGeo(),L=BR.L;let o='';
  g.rows.forEach((r,j)=>{const y=g.y(j);o+=`<text x="${g.NL-8}" y="${y+g.RH/2+5}" text-anchor="end" class="br-n">${esc(L.rows[j].n)}</text>`;
    for(let k=0;k<r.u;k++)o+=`<rect x="${g.NL+k*g.BU}" y="${y}" width="${g.BU}" height="${g.RH}" class="br-u"/>`;
    if(r.x){const x0=g.NL+r.u*g.BU;o+=`<rect x="${x0}" y="${y}" width="${g.xw[j]}" height="${g.RH}" class="br-x"/>`;if(!L.rows[j].hx)o+=`<text x="${x0+g.xw[j]/2}" y="${y+g.RH/2+5}" text-anchor="middle" class="br-xt">+${r.x}</text>`;}});
  if(BR.sel)barRects(BR.sel.id,g).forEach(([x,y,w,h])=>{o+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${BR.sel.bad?'br-bad':'br-hl'}"/>`;});
  BR.lab.forEach(l=>{o+=barLabel(l,g);});
  /* while numbers or the ? are being placed, the parts of the picture can be tapped too (larger parts first, smaller ones on top) */
  if((BR.step==='mark'||BR.step==='ask')&&!L.regions.includes('unit:0')){
    const ord=['all','row:0','row:1','row:2','x:0','x:1','x:2','diff'].filter(id=>L.regions.includes(id));
    ord.forEach(id=>{const rs=id==='all'?[[g.NL+g.maxLen+2,g.y(0)-6,g.W-g.NL-g.maxLen-2,g.y(g.n-1)+g.RH+12-g.y(0)]]:barRects(id,g);rs.forEach(([x,y,w,h])=>{o+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="br-tap" data-br="${id}" role="button" aria-label="${esc(regName(id))}"/>`;});});}
  return `<svg viewBox="0 0 ${g.W} ${g.H}" role="img" aria-label="bar model">${o}</svg>`;}
function regName(id){const [k,s]=id.split(':'),r=BR.L.rows[+s],pre=BR.L.build===false;
  return k==='row'?`${r.n} 整条`:k==='unit'?(pre?`${r.n.replace(/ 后来$/,'')} 原来那段`:`${r.n} 的 1 格`):k==='x'?(pre?'后面接上的那段':`${r.n} 多出来的那段`):k==='diff'?'长出来的那段':'全部合起来';}
function barDraw(){const L=BR.L,TY=barTypes(),st=barSt(),step=BR.step==='list'?BR.prev:BR.step;
  $('brType').textContent=TY[BR.ti].t;$('brP').innerHTML=lines(L.p);$('brZh').textContent=L.zh;$('brZh').hidden=!BR.zh;$('brZhB').setAttribute('aria-pressed',BR.zh?'true':'false');
  const order=['build','mark','ask','calc','done'],ci=order.indexOf(step);
  $('brSteps').innerHTML=[['build','① 画格子'],['mark','② 标数字'],['ask','③ 标问号'],['calc','④ 用图算']].filter(x=>!(x[0]==='build'&&L.build===false)).map(([k,t])=>{const i=order.indexOf(k);return `<li class="${i===ci?'on':i<ci?'ok':''}">${t}</li>`;}).join('');
  $('brFig').innerHTML=barSvg();$('brMsg').textContent=BR.msg||'';
  let h='';
  if(BR.step==='build')h=`<p class="br-p">照题目画：每人画几格？${L.xo?'谁后面要多一段？':''}</p>`+BR.rows.map((r,j)=>`<div class="br-row"><span class="br-rn">${esc(L.rows[j].n)}</span><button class="br-pm" data-bu="${j}" data-d="-1" aria-label="少一格">−</button><span class="br-cnt">${r.u} 格</span><button class="br-pm" data-bu="${j}" data-d="1" aria-label="多一格">+</button>${L.xo?`<button class="br-xb${r.x?' on':''}" data-bx="${j}">${r.x?'多一段 +'+r.x:'多一段？'}</button>`:''}</div>`).join('')+'<button class="sbtn" id="brDone">画好了 ✓</button>';
  else if(BR.step==='mark'||BR.step==='ask'){const m=BR.step==='mark'?L.marks[BR.mi]:null;
    h=`<p class="br-p">${m?`「${esc(m.v)}」标在哪里？ · Where does ${esc(m.v)} go?`:esc(L.ask.q||'题目问的是哪一段？问号标在哪里？')}</p>${L.regions.includes('unit:0')?'':'<p class="br-zh">点图上的那一段，或者点下面的字。</p>'}<div class="br-opts">`+L.regions.map(id=>`<button class="br-o" data-br="${id}"${BR.used.includes(id)?' disabled':''}>${esc(regName(id))}</button>`).join('')+'</div>';}
  else if(BR.step==='calc'){const c=L.calc[BR.ci];h=`<p class="br-p">${esc(c.q)}</p><div class="br-opts">`+c.o.map((x,i)=>`<button class="br-o" data-bo="${i}"${BR.used.includes(i)?' disabled':''}>${esc(x)}</button>`).join('')+'</div>';}
  else if(BR.step==='done')h=`<p class="br-sum">${esc(L.sum)}</p><p class="br-p">在纸上照这个图再画一遍。</p>`+(BR.note?`<p class="br-msg">${esc(BR.note)}</p>`:'')+'<button class="sbtn" id="brNext">再来一题</button><button class="br-other" id="brTypes2">换一种图</button><button class="br-other" id="brHome">回首页</button>';
  else if(BR.step==='list')h='<p class="br-p">'+TY.length+' 种线段图</p><div class="br-list">'+TY.map((t,i)=>`<button class="br-li${i===st.cur?' cur':''}" data-bt="${i}"><span>${i+1}. ${esc(t.t)}</span><small>做了 ${st.n[i]||0} 题</small></button>`).join('')+'</div>'+(BR.prev!=='done'?'<button class="br-other" id="brBack">回到这一题</button>':'');
  $('brCtl').innerHTML=h;}
function barCheck(){const L=BR.L,bad=BR.rows.findIndex((r,j)=>r.u!==L.rows[j].u||(r.x||0)!==(L.rows[j].x||0));
  if(bad<0){BR.step='mark';BR.tries=0;BR.msg='画对了！';}
  else if(++BR.tries>=2){BR.rows=L.rows.map(r=>({u:r.u,x:r.x||0}));BR.help=1;BR.step='mark';BR.tries=0;BR.msg='看一看，应该这样画：'+L.hint;}
  else BR.msg='再读一读题目。'+L.hint;
  barDraw();}
function barPick(id){const L=BR.L,ask=BR.step==='ask',want=ask?L.ask.at:L.marks[BR.mi].at,hint=ask?L.ask.hint:L.marks[BR.mi].hint;
  const place=auto=>{BR.lab.push({at:want,t:ask?'?':String(L.marks[BR.mi].v),q:ask});BR.used=[];BR.tries=0;BR.sel=null;
    if(ask){BR.step='calc';BR.ci=0;}else if(++BR.mi>=L.marks.length)BR.step='ask';BR.msg=auto?'看一看：'+hint:'对！';};
  if(id===want)place(false);
  else if(++BR.tries>=2){BR.help=1;place(true);}
  else{BR.used.push(id);BR.sel={id,bad:1};BR.msg='不是这里。'+hint;setTimeout(()=>{if(BR&&BR.sel&&BR.sel.id===id){BR.sel=null;barDraw();}},900);}
  barDraw();}
function barCalc(i){const L=BR.L,c=L.calc[BR.ci],ok=c.o[i]===String(c.a);
  if(ok||++BR.tries>=2){if(!ok)BR.help=1;BR.msg=ok?'对！':`是 ${c.a}。看一看图。`;BR.used=[];BR.tries=0;if(++BR.ci>=L.calc.length)barFinish();}
  else{BR.used.push(i);BR.msg='再看看图。';}
  barDraw();}
function barFinish(){const L=BR.L,st=barSt(),dk=dkey(new Date());BR.step='done';st.n[BR.ti]=(st.n[BR.ti]||0)+1;
  S.days[dk]=(S.days[dk]||0)+1;S.stars++;
  const e={d:dk,ts:Date.now(),c:'wp',t:'Bar models · 画线段图',h:QB.hash('bar:'+L.p),ok:BR.help?0:1};
  if(BR.help){e.q=L.p.slice(0,160);e.a='画图时用了提示';e.r=L.sum.slice(0,120);}
  if(!Array.isArray(S.log))S.log=[];S.log.push(e);if(S.log.length>5000)S.log=S.log.slice(-5000);
  tkDay().bar=1;BR.note='';
  if(BR.ti===st.cur&&st.n[BR.ti]>=3&&st.cur<barTypes().length-1){st.cur++;BR.note=`这一种已经做了 ${st.n[BR.ti]} 题。下一题换：${barTypes()[st.cur].t}。`;}
  BR.msg=BR.help?'做完了！下次自己试试看。':'做完了，全是自己做的！';save();beep(true);}
$('vBar').addEventListener('click',e=>{const t=e.target.closest('button,[data-br]');if(!t||!BR)return;const d=t.dataset;if(t.tagName!=='BUTTON'&&BR.used.includes(d.br))return;
  if(t.id==='brQuit'||t.id==='brHome'){BR=null;home();return;}
  if(t.id==='brSay'){speakText(BR.L.p);return;}
  if(t.id==='brZhB'){BR.zh=!BR.zh;barDraw();return;}
  if(t.id==='brTypes'||t.id==='brTypes2'){if(BR.step!=='list'){BR.prev=BR.step;BR.step='list';}barDraw();return;}
  if(t.id==='brBack'){BR.step=BR.prev;barDraw();return;}
  if(t.id==='brNext'){barStart();return;}
  if(t.id==='brDone'){barCheck();return;}
  if(d.bt!=null){barStart(+d.bt);return;}
  if(d.bu!=null){const r=BR.rows[+d.bu];r.u=Math.max(1,Math.min(9,r.u+(+d.d)));BR.msg='';barDraw();return;}
  if(d.bx!=null){const r=BR.rows[+d.bx],op=[0].concat(BR.L.xo||[]);r.x=op[(op.indexOf(r.x)+1)%op.length];BR.msg='';barDraw();return;}
  if(d.br!=null){barPick(d.br);return;}
  if(d.bo!=null){barCalc(+d.bo);}});
HOOK.tile.bar=()=>barStart();
HOOK.home.push(barNote);HOOK.task.bar=()=>barStart();
