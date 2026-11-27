/* 人体大发现 Body Explorer (P4 Human Systems, textbook p22–41). Content: claude/人体大发现_考点与内容.md.
   Tap a part → it glows and shows the textbook sentence; food's / air's journey; a 12-question quiz; muscles in pairs; systems working together.
   Everything is drawn in code (body-anat.js), so it works offline. Progress in S.body. */
const BD_SYS=[['dig','🍎','Digestive','消化'],['res','🫁','Respiratory','呼吸'],['cir','❤️','Circulatory','循环'],['ske','🦴','Skeletal & Muscular','骨骼和肌肉']];
const BD_PART={
 mouth:{s:'dig',en:'Mouth',zh:'口',p:[150,94],pills:[['有消化液 has digestive juices',1]],t:[['Digestion <b>begins</b> here. Teeth break food into smaller pieces.','消化从这里开始，牙齿把食物咬碎。'],['Saliva is a digestive juice.','口水（唾液）是一种消化液。']],star:'Digestion begins in the mouth.'},
 gullet:{s:'dig',en:'Gullet',zh:'食道',p:[150,166],pills:[['没有消化 no digestion',0]],t:[['Carries food from the mouth to the stomach.','把食物从口送到胃。'],['<b>No digestion</b> takes place here.','食道里不消化食物（常考陷阱）。']]},
 stomach:{s:'dig',en:'Stomach',zh:'胃',p:[186,250],pills:[['有消化液 has digestive juices',1]],t:[['Food is mixed with digestive juices and broken down further.','食物和消化液搅拌，被进一步分解。']]},
 small:{s:'dig',en:'Small intestine',zh:'小肠',p:[150,334],pills:[['有消化液',1],['吸收养分进血液',1],['不是吸水的地方',0]],t:[['Digestion <b>ends</b> here. Digested food is <b>absorbed into the blood</b>.','消化在这里结束；消化后的食物被吸收进血液。'],['About <b>6.5 m</b> long in an adult.','成人约 6.5 米，盘在肚子里。']],star:'Digestion begins in the mouth and ends in the small intestine.'},
 large:{s:'dig',en:'Large intestine',zh:'大肠',p:[188,356],pills:[['吸收水分',1],['不吸收养分',0]],t:[['Water is absorbed from <b>undigested food</b>.','大肠从没消化的食物里吸收水分。'],['About <b>1.5 m</b> long in an adult.','成人约 1.5 米。']],star:'The large intestine absorbs water from undigested food.'},
 rectum:{s:'dig',en:'Rectum & anus',zh:'直肠和肛门',p:[152,386],pills:[],t:[['Undigested food is stored in the rectum and passes out through the anus.','没消化的食物存在直肠，从肛门排出体外。']]},
 nose:{s:'res',en:'Nose',zh:'鼻子',p:[150,60],pills:[],t:[['Air enters the body through the nose.','空气从鼻子进入身体。']]},
 wind:{s:'res',en:'Windpipe',zh:'气管',p:[150,162],pills:[],t:[['Carries air to and from the lungs.','把空气送进肺，也把空气从肺送出来。']]},
 lungs:{s:'res',en:'Lungs',zh:'肺',p:[136,226],pills:[['吸进 oxygen',1],['呼出 carbon dioxide',1]],t:[['Oxygen passes into the blood. Carbon dioxide passes out of the blood.','氧气进入血液，二氧化碳从血液出来。'],['Air breathed out still has some oxygen, but less than air breathed in.','呼出的气里还有氧气，只是比吸进的少（陷阱）。']],star:'We take in oxygen and give out carbon dioxide.'},
 heart:{s:'cir',en:'Heart',zh:'心脏',p:[160,226],pills:[['属于循环系统，不是呼吸系统',0]],t:[['Pumps blood to all parts of the body.','把血液泵到全身。']],star:'The heart pumps blood to all parts of the body.'},
 vessels:{s:'cir',en:'Blood vessels',zh:'血管',p:[62,330],pills:[],t:[['Carry blood around the body.','运送血液到身体各处。'],['Blood carries <b>oxygen and digested food</b> to all parts of the body, and takes away carbon dioxide.','血液把氧气和养分送到全身，把二氧化碳带走。']]},
 skull:{s:'ske',en:'Skull',zh:'头骨',p:[150,46],pills:[],t:[['Protects the brain.','保护大脑。']]},
 ribs:{s:'ske',en:'Rib cage',zh:'胸廓（肋骨）',p:[124,204],pills:[],t:[['Protects the heart and lungs.','保护心脏和肺。']]},
 spine:{s:'ske',en:'Backbone',zh:'脊柱',p:[150,320],pills:[],t:[['Supports the body and lets us bend.','支撑身体，让我们能弯腰。']]},
 bones:{s:'ske',en:'Other bones (e.g. femur)',zh:'其他骨头（如大腿骨）',p:[124,470],pills:[],t:[['The <b>femur</b> (thigh bone) is the longest and strongest bone.','大腿骨最长、最强壮。'],['The smallest bone is in the ear.','最小的骨头在耳朵里。']],star:'The skeleton supports the body, protects internal organs and allows movement.'},
 muscles:{s:'mus',en:'Muscles',zh:'肌肉',p:[150,288],pills:[['只会拉，不会推',0]],t:[['Muscles are attached to bones.','肌肉连在骨头上。'],['They work in <b>pairs</b>: when one contracts, the other relaxes, and the bone moves.','肌肉成对工作：一块收缩，另一块放松，骨头就动了。']],star:'Muscles work in pairs to move bones.'}
};
const BD_KEYS=Object.keys(BD_PART);
const BD_JR={food:{en:"Food's Journey",zh:'食物的旅程',icon:'🍎',sys:'dig',path:['mouth','gullet','stomach','small','large','rectum'],
  q:['Where does food enter the body?','Where does the food go after the mouth?','Where does the food go after the gullet?','Where does the food go after the stomach?','Where does the food go after the small intestine?','Where is undigested food stored before it leaves the body?'],
  end:'Digestion begins in the mouth and ends in the small intestine. The large intestine only absorbs water.',endZh:'食物在口开始消化，在小肠结束；大肠只吸水。'},
 air:{en:"Air's Journey",zh:'空气的旅程',icon:'💨',sys:'res',path:['nose','wind','lungs'],
  q:['Where does air enter the body?','Where does the air go after the nose?','Where does the air go after the windpipe?'],
  end:'In the lungs, oxygen passes into the blood. The heart pumps it to all parts of the body.',endZh:'在肺里氧气进入血液，再由心脏送到全身。'}};
/* quiz: t=tap a part / m=choose (first option correct) / l=letters on the diagram */
const BD_QZ=[
 {t:'tap',s:'dig',a:'mouth',q:'Tap the part where digestion begins.',zh:'点出消化开始的地方。',ex:'Digestion begins in the mouth.',exZh:'牙齿和唾液在口里开始消化。'},
 {t:'tap',s:'dig',a:'small',q:'Tap the part where digestion ends.',zh:'点出消化结束的地方。',ex:'Digestion ends in the small intestine.',exZh:'消化在小肠结束。'},
 {t:'tap',s:'dig',a:'large',q:'Tap the part that absorbs water from undigested food.',zh:'点出从未消化食物里吸收水分的地方。',ex:'The large intestine absorbs water from undigested food.',exZh:'大肠只吸水；养分在小肠就吸收了。'},
 {t:'m',q:'In which part of the digestive system are there NO digestive juices?',zh:'消化系统里，哪个部位没有消化液？',o:['Gullet','Mouth','Stomach','Small intestine'],ex:'The gullet only carries food to the stomach.',exZh:'食道只运送食物，不消化。'},
 {t:'l',s:'dig',L:{P:'mouth',Q:'stomach',R:'small',S:'large'},q:'Food passes through Q before it reaches R. How does the amount of digested food in R compare with that in Q?',zh:'食物先经过 Q 再到 R。R 里消化后的食物比 Q 里多、少，还是一样？',o:['There is more digested food in R than in Q.','There is less digested food in R than in Q.','The amount is the same.'],ex:'R is the small intestine. Food is digested more by the time it gets there.',exZh:'越往后走，消化得越多。'},
 {t:'l',s:'dig',L:{P:'gullet',Q:'stomach',R:'small',S:'large'},q:'Which part absorbs digested food into the blood?',zh:'哪个字母把消化后的食物吸收进血液？',o:['R','S','Q','P'],ex:'R is the small intestine.',exZh:'小肠吸收养分；S 大肠只吸水。'},
 {t:'tap',s:'res',a:'lungs',q:'Tap the organ where oxygen passes into the blood.',zh:'点出氧气进入血液的器官。',ex:'Oxygen passes into the blood in the lungs.',exZh:'在肺里，氧气进入血液。'},
 {t:'m',q:'Compared with air breathed in, air breathed out has ___.',zh:'和吸进的空气比，呼出的空气……',o:['more carbon dioxide and less oxygen','no oxygen at all','no carbon dioxide','only oxygen'],ex:'Air breathed out still has some oxygen.',exZh:'呼出的气里还有氧气，只是更少（陷阱）。'},
 {t:'tap',s:'cir',a:'heart',q:'Tap the organ that pumps blood around the body.',zh:'点出把血液泵到全身的器官。',ex:'The heart pumps blood to all parts of the body.',exZh:'心脏属于循环系统。'},
 {t:'m',q:'Which of these does blood carry from the lungs and the small intestine to all parts of the body?',zh:'血液从肺和小肠把什么送到全身？',o:['oxygen and digested food','carbon dioxide and undigested food','undigested food only','carbon dioxide only'],ex:'Blood carries oxygen and digested food, and takes away carbon dioxide.',exZh:'血液送氧气和养分，带走二氧化碳。'},
 {t:'tap',s:'ske',a:'ribs',q:'Tap the bones that protect the heart and lungs.',zh:'点出保护心脏和肺的骨头。',ex:'The rib cage protects the heart and lungs.',exZh:'胸廓保护心和肺；头骨保护脑。'},
 {t:'m',q:'When you bend your arm, the muscle at the front of your upper arm ___ and the muscle at the back of your upper arm ___.',zh:'弯手臂时，大臂前面的肌肉……大臂后面的肌肉……',o:['contracts, relaxes','relaxes, contracts','contracts, contracts','relaxes, relaxes'],ex:'Muscles work in pairs. The front muscle contracts and pulls the forearm up.',exZh:'前面收缩把前臂拉上来，后面放松。'}
];
const BD_PAIRS=[['🍎 Digestive + ❤️ Circulatory','Digested food goes into the blood and is carried around the body.',['Oxygen goes into the blood.','The body moves.']],
 ['🫁 Respiratory + ❤️ Circulatory','Oxygen goes into the blood and is carried around the body.',['Digested food goes into the blood.','The body moves.']],
 ['🦴 Skeletal + 💪 Muscular','Bones and muscles work together so the body can move.',['Oxygen goes into the blood.','Water is absorbed.']]];
const bdShuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
let BD={view:'ex',sys:'dig',sk:'ske',part:null};
function bdSt(){if(!S.body||typeof S.body!=='object')S.body={};const b=S.body;if(!b.seen||typeof b.seen!=='object')b.seen={};if(!b.done||typeof b.done!=='object')b.done={};return b;}
function bdGive(n,key,t,ok){S.stars=(S.stars||0)+n;const dk=dkey(new Date());S.days[dk]=(S.days[dk]||0)+1;
  if(!Array.isArray(S.log))S.log=[];S.log.push({d:dk,ts:Date.now(),c:'p4',t:'人体大发现 · Body Explorer',k:key,h:QB.hash('body:'+key),ok:ok?1:0});if(S.log.length>5000)S.log=S.log.slice(-5000);}
function bdTopCount(){const b=bdSt();$('bdSeen').textContent=BD_KEYS.filter(k=>b.seen[k]).length;$('bdAll').textContent=BD_KEYS.length;}
/* In journeys and the quiz, digestive and breathing pictures are cropped to head + body (no legs),
   so the parts are about 1.6× bigger to tap and the letter labels stay on screen. */
function bdFig(sys,hi,o){const svg=ANAT.body(sys,hi,o||{});
  if(BD.view!=='ex'&&(sys==='dig'||sys==='res'))return svg.replace('viewBox="0 -24 300 724"','viewBox="18 30 264 400"');return svg;}
/* Tapping: a finger is wide and some parts are thin (gullet, windpipe, vessels). Look at the tap point and 24 points
   around it (up to 22 px away): right on a part → that part; otherwise count which part is under the points around, nearer points counting more; if nothing is close,
   take the part whose centre is nearest (within 60 drawing units). */
function bdPick(ev,stage,want){const svg=stage.querySelector('svg');if(!svg)return null;const sv=bdSvgNow();if(!sv)return null;
  const own=k=>BD_PART[k]&&BD_PART[k].s===sv;const score={};
  const add=(x,y,w)=>{for(const el of document.elementsFromPoint(x,y)){if(!stage.contains(el))continue;const g=el.closest('[data-part]');if(g&&own(g.dataset.part)){score[g.dataset.part]=(score[g.dataset.part]||0)+w;break;}}};
  const X=ev.clientX,Y=ev.clientY;add(X,Y,1);const c0=Object.keys(score)[0];
  [[8,4],[15,2],[22,1]].forEach(([r,w])=>{for(let i=0;i<8;i++){const a=i*Math.PI/4+(r===15?Math.PI/8:0);add(X+Math.cos(a)*r,Y+Math.sin(a)*r,w);}});
  if(c0)return c0;                     /* finger right on a part: that part (even in the quiz, so tapping the large intestine never counts as the small one) */
  if(want&&score[want])return want;   /* journey / quiz: finger off every part but the right one is just next to it → count it */
  if(want&&BD_PART[want]){const m=svg.getScreenCTM(),pt=svg.createSVGPoint();[pt.x,pt.y]=BD_PART[want].p;const q=pt.matrixTransform(m);if(Math.hypot(q.x-X,q.y-Y)<28)return want;}   /* …or within 28 px of its middle */
  let best=null,bs=0;for(const k in score)if(score[k]>bs){bs=score[k];best=k;}
  if(best)return best;
  const m=svg.getScreenCTM();if(!m)return null;const pt=svg.createSVGPoint();pt.x=X;pt.y=Y;const q=pt.matrixTransform(m.inverse());
  let nd=60;BD_KEYS.filter(own).forEach(k=>{const [x,y]=BD_PART[k].p,d=Math.hypot(x-q.x,y-q.y);if(d<nd){nd=d;best=k;}});return best;}
function bdWant(){if(BD.view==='jr'){const J=BD_JR[BD.jr];return J.path[BD.step];}if(BD.view==='quiz'){const q=BD.qz.list[BD.qz.i];return q&&q.t==='tap'&&!BD.qz.ans?q.a:null;}return null;}
function bdSvgNow(){if(BD.view==='ex')return bdSvgSys();if(BD.view==='jr')return BD_JR[BD.jr].sys;if(BD.view==='quiz'){const q=BD.qz.list[BD.qz.i];return q&&q.s;}return null;}
function bdSvgSys(){return BD.sys==='ske'?BD.sk:BD.sys;}
function bdLabels(L,hi){return Object.entries(L).map(([ch,k])=>{const [x,y]=BD_PART[k].p,left=x<150;return [x,y,left?40:262,y,ch,hi===ch];});}
function bdOpen(from){BD.from=from==='pl'?'pl':null;bdSt();show('vBody');BD.view='ex';BD.part=null;bdDraw();}
function bdTitle(en,zh){$('bdTitle').innerHTML=`${esc(en)}<small>${esc(zh)}</small>`;}
function bdCard(k){if(!k)return `<div class="bd-card"><h3>Tap a part 点一个部位</h3><div class="zh">点人体图，或者点下面的名字</div><div class="bd-do">每个部位第一次点开就会点亮。16 个都点亮 +2 ★。</div></div>`;
  const p=BD_PART[k];return `<div class="bd-card"><button class="bd-spk" data-say="${esc(p.en+'. '+p.t.map(x=>x[0].replace(/<[^>]+>/g,'')).join(' '))}" aria-label="Read aloud">🔊</button><h3>${esc(p.en)}</h3><div class="zh">${esc(p.zh)}</div>
  ${p.pills.map(([t,g])=>`<span class="bd-pill${g?'':' no'}">${g?'✓':'✗'} ${esc(t)}</span>`).join('')}
  ${p.t.map(([e,z])=>`<div class="bd-do">${e}<small>${esc(z)}</small></div>`).join('')}${p.star?`<div class="bd-star">★ ${esc(p.star)}</div>`:''}</div>`;}
function bdDraw(){bdTopCount();const m=$('bdMain'),b=bdSt();
 if(BD.view==='ex'){bdTitle('Body Explorer','人体大发现 · P4 Human Systems');
  const sv=bdSvgSys(),keys=BD_KEYS.filter(k=>BD_PART[k].s===sv||(BD.sys==='ske'&&BD_PART[k].s===(BD.sk==='ske'?'ske':'mus')));
  m.innerHTML=`<div class="bd-tabs">${BD_SYS.map(([k,i,en,zh])=>`<button class="bd-tab${BD.sys===k?' on':''}" data-sys="${k}"><b>${i}</b>${esc(en)} ${zh}</button>`).join('')}</div>
  <div class="bd-grid"><div class="bd-stage" id="bdStage">${BD.sys==='ske'?`<div class="bd-tog"><button data-sk="ske" class="${BD.sk==='ske'?'on':''}">🦴 骨骼</button><button data-sk="mus" class="${BD.sk==='mus'?'on':''}">💪 肌肉</button></div>`:''}${bdFig(sv,BD.part)}</div>
  <div>${bdCard(BD.part)}<div class="bd-chips">${keys.map(k=>`<button class="bd-chip${BD.part===k?' on':b.seen[k]?' seen':''}" data-part="${k}">${esc(BD_PART[k].en)}${b.seen[k]?' ✓':''}</button>`).join('')}</div>
  <div class="bd-acts"><button class="bd-act" data-jr="food">🍎 食物的旅程</button><button class="bd-act" data-jr="air">💨 空气的旅程</button><button class="bd-act" data-go="mus">💪 肌肉成对</button><button class="bd-act" data-go="pair">🤝 系统合作</button><button class="bd-act go" data-go="quiz">🎯 考考你 ${BD_QZ.length} 题</button></div></div></div>`;return;}
 if(BD.view==='jr'){const J=BD_JR[BD.jr],i=BD.step,fin=i>=J.path.length;bdTitle(J.icon+' '+J.en,J.zh+' · 按顺序点');
  m.innerHTML=`<div class="bd-grid"><div class="bd-stage" id="bdStage">${bdFig(J.sys,fin?null:BD.hint)}</div><div>
  ${fin?`<div class="bd-done">🎉 走完啦！${BD.gave?`<br>+${BD.gave} ★`:''}</div><div class="bd-star">★ ${esc(J.end)}<br><small>${esc(J.endZh)}</small></div>`:`<div class="bd-q">第 ${i+1} 步：${esc(J.q[i])}<small>点人体图上的部位</small></div>`}
  ${BD.msg||''}<div class="bd-steps">${J.path.map((k,n)=>`<span class="${n<i?'ok':n===i&&!fin?'cur':''}">${n+1} ${n<i?esc(BD_PART[k].en)+' ✓':'?'}</span>`).join('')}</div>
  <div class="bd-acts"><button class="bd-act" data-go="ex">‹ 回人体图</button>${fin?`<button class="bd-act go" data-jr="${BD.jr}">再走一次</button>`:''}</div></div></div>`;return;}
 if(BD.view==='quiz'){const Z=BD.qz,q=Z.list[Z.i];bdTitle('🎯 Quiz','考考你 · 第 '+(Z.i+1)+' / '+Z.list.length+' 题');
  if(Z.i>=Z.list.length){m.innerHTML=`<div class="bd-done">答对 ${Z.ok} / ${Z.list.length} 题 ${Z.ok===Z.list.length?'🎉 全对！':''}<br>${Z.gave?`+${Z.gave} ★`:''}</div><div class="bd-acts"><button class="bd-act" data-go="ex">‹ 回人体图</button><button class="bd-act go" data-go="quiz">再考一次</button></div>`;return;}
  const lab=q.t==='l'?bdLabels(q.L):null,stage=q.t!=='m'?`<div class="bd-stage" id="bdStage">${bdFig(q.s,Z.ans&&q.t==='tap'?q.a:null,lab?{labels:lab}:{})}</div>`:'';
  const opts=q.t!=='tap'?Z.opts.map((o,n)=>`<button class="bd-opt${Z.ans?(o===q.o[0]?' ok':n===Z.pick?' bad':''):''}" data-opt="${n}">${String.fromCharCode(65+n)}. ${esc(o)}${Z.ans&&o===q.o[0]?' ✓':''}</button>`).join(''):'';
  const fb=Z.ans?`<div class="bd-fb${Z.right?'':' bad'}"><b>${Z.right?'✓ 对了！':'✗ '+esc(Z.wrongMsg||'再看看')}</b><div>${esc(q.ex)}</div><small>${esc(q.exZh)}</small></div><div class="bd-acts"><button class="bd-act go" data-go="next">下一题 →</button></div>`:'';
  m.innerHTML=`<div class="${stage?'bd-grid':''}">${stage}<div><div class="bd-q">${esc(q.q)}<small>${esc(q.zh)}</small></div>${opts}${fb}</div></div>`;return;}
 if(BD.view==='mus'){bdTitle('💪 Muscles in pairs','肌肉成对 · 拖动滑块弯手臂');const v=BD.arm||0;
  m.innerHTML=`<div class="bd-grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)"><div class="bd-arm"><svg viewBox="0 0 320 420" id="bdArm">${bdArmSvg(v)}</svg>
  <input type="range" min="0" max="100" value="${v}" id="bdArmR" aria-label="Bend the arm"><div style="display:flex;justify-content:space-between;font-weight:700;color:#6b5fae"><span>伸直 straight</span><span>弯曲 bent</span></div></div>
  <div><div class="bd-card" id="bdArmTx">${bdArmTx(v)}</div><div class="bd-star">★ Muscles work in pairs to move bones.</div><div class="bd-do" style="color:#c7cdf5">肌肉只会<b>拉</b>（收缩变短），不会推。所以要两块一组：一块把骨头拉过来，另一块把它拉回去。</div>
  <div class="bd-acts"><button class="bd-act" data-go="ex">‹ 回人体图</button></div></div></div>`;return;}
 if(BD.view==='pair'){bdTitle('🤝 Systems work together','系统合作 · 两个系统一起做什么？');const P=BD.pr;
  m.innerHTML=`${BD_PAIRS.map(([h,a,w],i)=>`<div class="bd-pair"><b>${esc(h)} →</b>${P.opts[i].map((o,n)=>`<button class="bd-opt${P.ans[i]!=null?(o===a?' ok':n===P.ans[i]?' bad':''):''}" data-pr="${i}:${n}">${esc(o)}${P.ans[i]!=null&&o===a?' ✓':''}</button>`).join('')}</div>`).join('')}
  ${P.ans.every(x=>x!=null)?`<div class="bd-done" style="margin-top:.75rem">${P.ok===3?'🎉 全对！':'答对 '+P.ok+' / 3'}${P.gave?' +'+P.gave+' ★':''}</div>`:''}<div class="bd-acts"><button class="bd-act" data-go="ex">‹ 回人体图</button></div>`;}
}
function bdArmSvg(v){const t=v/100;return `<g opacity="${(1-t).toFixed(2)}" transform="translate(20 10)">${ARM.armStraight()}</g><g opacity="${t.toFixed(2)}" transform="translate(40 10)">${ARM.armBent()}</g>`;}
function bdArmTx(v){return v>=50?`<h3>手臂弯曲 Bent</h3><div class="bd-do">The muscle in <b>front contracts</b> (shorter, thicker) and pulls the forearm up.<small>前面的肌肉收缩：变短变粗，把前臂拉上来。</small></div><div class="bd-do">The muscle at the <b>back relaxes</b>.<small>后面的肌肉放松。</small></div>`
 :`<h3>手臂伸直 Straight</h3><div class="bd-do">The muscle at the <b>back contracts</b> and pulls the forearm down.<small>后面的肌肉收缩，把前臂拉直。</small></div><div class="bd-do">The muscle in <b>front relaxes</b> (longer, thinner).<small>前面的肌肉放松：变长变细。</small></div>`;}
function bdTap(k){const b=bdSt();
 if(BD.view==='ex'){if(!BD_PART[k])return;BD.part=k;if(!b.seen[k]){b.seen[k]=1;if(BD_KEYS.every(x=>b.seen[x])&&!b.done.all){b.done.all=1;bdGive(2,'all parts',1,1);}save();}bdDraw();return;}
 if(BD.view==='jr'){const J=BD_JR[BD.jr];if(BD.step>=J.path.length)return;const want=J.path[BD.step];
  if(k===want){BD.step++;BD.hint=k;BD.msg='';if(BD.step>=J.path.length){if(!b.done[BD.jr]){b.done[BD.jr]=1;BD.gave=1;bdGive(1,BD.jr+' journey',1,1);save();}else BD.gave=0;}}
  else{const at=J.path.indexOf(k);BD.msg=`<div class="bd-fb bad"><b>刚才点了 ${esc(BD_PART[k]?BD_PART[k].en:k)}</b><div>${at>BD.step?`Not yet! It goes to the <b>${esc(BD_PART[want].en)}</b> first.`:at>=0?'Already passed — it has been there.':'Food and air do not go there.'}</div><small>${at>BD.step?'还没到哦，先去 '+BD_PART[want].zh+'。':at>=0?'已经走过这里了。':'这一步不经过这里。'}</small></div>`;}
  bdDraw();return;}
 if(BD.view==='quiz'){const Z=BD.qz,q=Z.list[Z.i];if(Z.ans||q.t!=='tap'||!BD_PART[k])return;bdAnswer(k===q.a,k===q.a?'':'你点了 '+BD_PART[k].en);}
}
function bdAnswer(right,msg){const Z=BD.qz;Z.ans=1;Z.right=right;Z.wrongMsg=msg;if(right)Z.ok++;bdDraw();}
function bdQuiz(){BD.view='quiz';BD.qz={list:BD_QZ.slice(),i:0,ok:0};bdQNew();bdDraw();}
function bdQNew(){const Z=BD.qz,q=Z.list[Z.i];Z.ans=0;Z.pick=null;Z.opts=q&&q.o?bdShuf(q.o):[];}
function bdQNext(){const Z=BD.qz,b=bdSt();Z.i++;if(Z.i>=Z.list.length){const n=Z.ok===Z.list.length?3:1;Z.gave=n;b.done.quiz=Math.max(b.done.quiz||0,Z.ok);bdGive(n,'quiz '+Z.ok+'/'+Z.list.length,1,Z.ok===Z.list.length);save();}else bdQNew();bdDraw();}
$('bdMain').addEventListener('click',e=>{const t=e.target;let x;
 if(x=t.closest('[data-say]')){speakText(x.dataset.say);return;}
 if(x=t.closest('[data-sys]')){BD.sys=x.dataset.sys;BD.part=null;bdDraw();return;}
 if(x=t.closest('[data-sk]')){BD.sk=x.dataset.sk;BD.part=null;bdDraw();return;}
 if(x=t.closest('[data-jr]')){BD.view='jr';BD.jr=x.dataset.jr;BD.step=0;BD.hint=null;BD.msg='';BD.gave=0;bdDraw();return;}
 if(x=t.closest('[data-go]')){const g=x.dataset.go;if(g==='quiz')return bdQuiz();if(g==='next')return bdQNext();
  if(g==='pair'){BD.view='pair';BD.pr={opts:BD_PAIRS.map(([,a,w])=>bdShuf([a,...w])),ans:[null,null,null],ok:0};}else{BD.view=g;if(g==='mus')BD.arm=0;}bdDraw();return;}
 if(x=t.closest('[data-opt]')){const Z=BD.qz;if(!Z||Z.ans)return;const n=+x.dataset.opt,q=Z.list[Z.i];Z.pick=n;bdAnswer(Z.opts[n]===q.o[0],'');return;}
 if(x=t.closest('[data-pr]')){const P=BD.pr,[i,n]=x.dataset.pr.split(':').map(Number);if(P.ans[i]!=null)return;P.ans[i]=n;if(P.opts[i][n]===BD_PAIRS[i][1])P.ok++;
  if(P.ans.every(v=>v!=null)){const b=bdSt();if(!b.done.pair&&P.ok===3){b.done.pair=1;P.gave=1;bdGive(1,'systems together',1,1);save();}}bdDraw();return;}
 {const st=t.closest('#bdStage');if(st&&!t.closest('.bd-tog')){const k=bdPick(e,st,bdWant());if(k)bdTap(k);return;}}
 if(x=t.closest('[data-part]')){bdTap(x.dataset.part);}
});
$('bdMain').addEventListener('input',e=>{if(e.target.id!=='bdArmR')return;const v=+e.target.value;BD.arm=v;$('bdArm').innerHTML=bdArmSvg(v);$('bdArmTx').innerHTML=bdArmTx(v);
 const b=bdSt();if(v>=95&&!b.done.mus){b.done.mus=1;bdGive(1,'muscles in pairs',1,1);save();}});
$('bdBack').addEventListener('click',()=>{if(BD.view!=='ex'){BD.view='ex';bdDraw();}else if(BD.from==='pl'&&window.__pl)__pl.plOpen();else home();});
HOOK.tile.body=()=>bdOpen();
HOOK.home.push(()=>{const el=$('bdNote');if(!el)return;const n=BD_KEYS.filter(k=>bdSt().seen[k]).length;el.textContent=n?`点亮 ${n} / ${BD_KEYS.length}`:'新！';});
window.__body={BD_PART,BD_QZ,BD_JR,bdOpen,BD:()=>BD};
