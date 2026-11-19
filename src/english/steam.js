/* ---------- English home, steampunk: the level as a pressure gauge with a rank name, and the Word Railway card
   (two tickets showing the next stop of the word cards and of the phrases; Go opens the railway). ---------- */
const SPRANK=['学徒','技工','工匠','机械师','工程师','发明家','大发明家','总工程师','发明大师'];
function spRank(l){return SPRANK[Math.min(SPRANK.length-1,l-1)];}
function spGauge(){const b=document.querySelector('#vHome .board');if(!b)return;let g=$('spGauge');
  if(!g){const ticks=[];for(let a=-130;a<=130;a+=26)ticks.push(`<path d="M0 -50V-41" transform="rotate(${a})"/>`);
    b.insertAdjacentHTML('afterbegin',`<svg class="sp-gauge" id="spGauge" viewBox="-62 -62 124 124" aria-hidden="true"><circle r="57" fill="#f5e9cc" stroke="#a8761f" stroke-width="7"/><circle r="57" fill="none" stroke="#f6d98a" stroke-width="1.5"/>
      <path d="M-38.3 32.1A50 50 0 1 1 38.3 32.1" fill="none" stroke="#d9cfb2" stroke-width="8"/><path id="spArc" fill="none" stroke="#4fb3a0" stroke-width="8"/>
      <g stroke="#3a2306" stroke-width="2">${ticks.join('')}</g><g class="ndl" id="spNdl"><path d="M0 6L-4 0 0 -44 4 0z" fill="#c8683a" stroke="#8f3f1c"/></g><circle r="7" fill="#a8761f" stroke="#6b4612" stroke-width="2"/>
      <text y="31" text-anchor="middle" font-size="14" font-weight="800" fill="#3a2306" id="spLv"></text></svg>`);g=$('spGauge');}
  const f=(S.stars%PER)/PER,a=-130+260*f,lvl=Math.floor(S.stars/PER)+1,r=50,rad=d=>(d-90)*Math.PI/180;
  $('spNdl').style.transform=`rotate(${a}deg)`;$('spLv').textContent='LV '+lvl;
  $('spArc').setAttribute('d',f>0.005?`M${(r*Math.cos(rad(-130))).toFixed(1)} ${(r*Math.sin(rad(-130))).toFixed(1)}A${r} ${r} 0 ${a+130>180?1:0} 1 ${(r*Math.cos(rad(a))).toFixed(1)} ${(r*Math.sin(rad(a))).toFixed(1)}`:'');
  let rk=$('spRank');if(!rk){$('hLevel').insertAdjacentHTML('afterend','<span class="sp-rank" id="spRank"></span>');rk=$('spRank');}
  rk.textContent='· '+spRank(lvl);$('hLvlNote').textContent=`${PER-S.stars%PER} ★ to Level ${lvl+1} · 下一级：${spRank(lvl+1)}`;}
function spRail(){if($('railW'))$('railW').textContent=mapNextName('w');
  if($('railP')){if(TR.p)$('railP').textContent=mapNextName('p');else $('tPP').hidden=true;}}
HOOK.home.push(spGauge,spRail);
$('tRail').addEventListener('click',()=>mapOpen('w'));
