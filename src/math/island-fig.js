/* ---------- 数学小岛 step ③: a picture already drawn for the problem; he puts the numbers and the ? on it.
   q.dg = {k:'bar'|'flow'|'pie'|'br'|'line', ...shape, mk:[[spot,text],...] (placed in this order), fx:[[spot,text]] (already written)}
   Spots: bar  a<r>[:i[-j]] above part of a row · b<r>[:i[-j]] below · R<a>-<b> bracket on the right
          flow B<i> box · O<i> the step between box i and i+1
          pie  P<k> part k · Pr what is left · T the whole
          br   T whole · C first cut · R the rest · C2 the cut from the rest · L what is left at the end
          line G<r>:<i> one gap · A<r>:<a>-<b> from point a to point b · N<r> how many points ---------- */
const DGW=360,DGRH=28;
function dgTw(t){return[...String(t)].reduce((a,ch)=>a+(/[　-鿿＀-￯]/.test(ch)?14:ch===' '?4:8.2),0);}
function dgAll(d){return(d.mk||[]).concat(d.fx||[]).map(x=>x[0]);}
/* layout: the drawing, and for every possible spot where its label goes {x,y,a:anchor,br:brace path,key} */
function dgLay(d){
  if(d.k==='bar')return dgBar(d);if(d.k==='flow')return dgFlow(d);if(d.k==='pie')return dgPie(d);if(d.k==='br')return dgBr(d);if(d.k==='tbl')return dgTbl(d);return dgLine(d);}
function dgBar(d){const rows=d.rows,n=rows.length,used=dgAll(d);
  const NL=Math.max(34,...rows.map(r=>dgTw(r.n)))+12,useR=used.some(s=>s[0]==='R')||n>1,RB=useR?84:18;
  const tot=r=>(r.o||0)+r.s.reduce((a,s)=>a+s[0],0),maxW=Math.max(...rows.map(tot)),BU=(DGW-NL-RB)/maxW;
  const ys=[];let y=34;rows.forEach((r,j)=>{if(r.h&&j)y+=14;ys.push(y);y+=DGRH+52;});const H=y-52+40;
  const sx=(j,i)=>NL+((rows[j].o||0)+rows[j].s.slice(0,i).reduce((a,s)=>a+s[0],0))*BU;
  let g='';
  rows.forEach((r,j)=>{const yy=ys[j];if(r.h)g+=`<text x="${NL-8}" y="${yy-14}" text-anchor="end" class="dg-h">${esc(r.h)}</text>`;
    g+=`<text x="${NL-8}" y="${yy+DGRH/2+5}" text-anchor="end" class="dg-n">${esc(r.n)}</text>`;
    r.s.forEach((s,i)=>{const x=sx(j,i),w=s[0]*BU;g+=`<rect x="${x}" y="${yy}" width="${w}" height="${DGRH}" class="dg-${s[1]}"/>`;
      if(s[2])g+=`<text x="${x+w/2}" y="${yy+DGRH/2+4.5}" text-anchor="middle" class="dg-st">${esc(s[2])}</text>`;});});
  (d.ar||[]).forEach(([a,b])=>{const [r1,i1]=a.split(':').map(Number),[r2,i2]=b.split(':').map(Number);
    const x1=sx(r1,i1)+rows[r1].s[i1][0]*BU/2,y1=ys[r1]+DGRH+3,x2=sx(r2,i2)+rows[r2].s[i2][0]*BU/2,y2=ys[r2]-3,up=y2<y1;
    g+=`<path d="M${x1} ${up?ys[r1]-3:y1} C${x1+(up?0:0)} ${(y1+y2)/2}, ${x2} ${(y1+y2)/2}, ${x2} ${up?ys[r2]+DGRH+3:y2}" class="dg-ar" marker-end="url(#dgAr)"/>`;});
  const avoid=(d.ar||[]).map(([a,b])=>{const [r1,i1]=a.split(':').map(Number),[r2,i2]=b.split(':').map(Number),xa=sx(r1,i1)+rows[r1].s[i1][0]*BU/2,xb=sx(r2,i2)+rows[r2].s[i2][0]*BU/2;
    return[Math.min(xa,xb)-12,Math.min(ys[r1],ys[r2])+DGRH,Math.abs(xa-xb)+24,Math.abs(ys[r1]-ys[r2])-DGRH];});
  const spot=id=>{let m=id.match(/^([ab])(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if(m){const j=+m[2];if(!rows[j])return null;const last=rows[j].s.length-1,i1=m[3]==null?0:+m[3],i2=m[4]!=null?+m[4]:m[3]!=null?i1:last;
      if(i2>last)return null;const x1=sx(j,i1),x2=sx(j,i2)+rows[j].s[i2][0]*BU,yy=ys[j],up=m[1]==='a';
      const by=up?yy-4:yy+DGRH+4,bt=up?by-5:by+5;
      return{x:(x1+x2)/2,y:up?yy-14:yy+DGRH+21,a:'middle',br:`M${x1+1} ${by}V${bt}H${x2-1}V${by}`,key:j+':'+i1+'-'+i2,bd:m[1]+j,r:[x1,x2]};}
    m=id.match(/^R(\d+)-(\d+)$/);
    if(m){const a=+m[1],b=+m[2];if(!rows[b])return null;const x=NL+maxW*BU+8,y1=ys[a],y2=ys[b]+DGRH;
      return{x:x+9,y:(y1+y2)/2+5,a:'start',br:`M${x-5} ${y1}H${x}V${y2}H${x-5}`,key:'R'+a+'-'+b,bd:'R',r:[y1,y2]};}
    return null;};
  const cand=[];if(n>1)cand.push('R0-'+(n-1));rows.forEach((r,j)=>{cand.push('b'+j);r.s.forEach((s,i)=>{if(s[1]!=='g'||1)cand.push('a'+j+':'+i);});});
  return{W:DGW,H,g,spot,cand,avoid};}
function dgFlow(d){const n=d.n,BW=60,BH=40,AW=(DGW-20-n*BW)/(n-1),y=44;let g='';
  const bx=i=>10+i*(BW+AW);
  for(let i=0;i<n;i++){g+=`<rect x="${bx(i)}" y="${y}" width="${BW}" height="${BH}" rx="8" class="dg-box"/>`;
    if(i<n-1)g+=`<path d="M${bx(i)+BW+4} ${y+BH/2}H${bx(i+1)-6}" class="dg-ar" marker-end="url(#dgAr)"/>`;}
  const spot=id=>{let m=id.match(/^B(\d+)$/);if(m&&+m[1]<n){const i=+m[1];return{x:bx(i)+BW/2,y:y+BH/2+5,a:'middle',br:'',key:id,box:1};}
    m=id.match(/^O(\d+)$/);if(m&&+m[1]<n-1){const i=+m[1];return{x:bx(i)+BW+AW/2,y:y-6,a:'middle',br:'',key:id};}return null;};
  const cand=[];for(let i=0;i<n;i++){cand.push('B'+i);if(i<n-1)cand.push('O'+i);}
  return{W:DGW,H:y+BH+26,g,spot,cand};}
function dgPie(d){const n=d.n,cx=DGW/2,cy=112,r=68,P=d.p,cls=['x','a','k'];let g='',s=0;const parts=[];
  P.forEach(c=>{parts.push([s,c]);s+=c;});const rest=n-s;if(rest>0)parts.push([s,rest]);
  const pt=(k,rr)=>{const a=-Math.PI/2+2*Math.PI*k/n;return[cx+rr*Math.cos(a),cy+rr*Math.sin(a)];};
  for(let k=0;k<n;k++){const pi=parts.findIndex(([a,c])=>k>=a&&k<a+c),c=pi<P.length?cls[pi%3]:'w',[x1,y1]=pt(k,r),[x2,y2]=pt(k+1,r);
    g+=n===1?`<circle cx="${cx}" cy="${cy}" r="${r}" class="dg-${c}"/>`:`<path d="M${cx} ${cy}L${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}Z" class="dg-${c}"/>`;}
  const spot=id=>{let pi=id==='Pr'?(rest>0?parts.length-1:-1):id[0]==='P'?+id.slice(1):-1;
    if(id==='T')return{x:cx,y:22,a:'middle',br:'',key:'T'};
    if(pi<0||pi>=parts.length||(id!=='Pr'&&pi>=P.length))return null;
    const [a,c]=parts[pi],m=a+c/2,[lx,ly]=pt(m,r+34),[ax,ay]=pt(m,r*.62),[bx2,by2]=pt(m,r+12);
    return{x:Math.max(40,Math.min(DGW-40,lx)),y:ly+5,a:'middle',br:`M${ax} ${ay}L${bx2} ${by2}`,lead:1,key:id==='Pr'?'P'+pi:id};};
  const cand=['T'].concat(P.map((c,i)=>'P'+i),rest>0?['Pr']:[]);
  return{W:DGW,H:cy+r+42,g,spot,cand};}
function dgBr(d){const x0=24,x1=DGW-24,uw=(x1-x0)/d.n,y1=44,y2=136,BH=30,rx=x0+d.c*uw,sw=(x1-rx)/d.m;let g='';
  for(let i=0;i<d.n;i++)g+=`<rect x="${x0+i*uw}" y="${y1}" width="${uw}" height="${BH}" class="dg-${i<d.c?'x':'u'}"/>`;
  g+=`<path d="M${rx} ${y1+BH}V${y2}M${x1} ${y1+BH}V${y2}" class="dg-drop"/>`;
  for(let i=0;i<d.m;i++)g+=`<rect x="${rx+i*sw}" y="${y2}" width="${sw}" height="${BH}" class="dg-${i<d.c2?'a':'w'}"/>`;
  const tx=(t,x,w,y)=>t?`<text x="${x+w/2}" y="${y+BH/2+4.5}" text-anchor="middle" class="dg-st">${esc(t)}</text>`:'';
  g+=tx(d.ct,x0,d.c*uw,y1)+tx(d.c2t,rx,d.c2*sw,y2)+tx(d.lt,rx+d.c2*sw,(d.m-d.c2)*sw,y2);
  const below=(a,b,y,key)=>({x:(a+b)/2,y:y+BH+21,a:'middle',br:`M${a+1} ${y+BH+4}V${y+BH+9}H${b-1}V${y+BH+4}`,key,bd:'b'+y,r:[a,b]});
  const spot=id=>id==='T'?{x:(x0+x1)/2,y:y1-14,a:'middle',br:`M${x0+1} ${y1-4}V${y1-9}H${x1-1}V${y1-4}`,key:'T'}
    :id==='C'?below(x0,rx,y1,'C'):id==='R'?below(rx,x1,y1,'R'):id==='C2'?below(rx,rx+d.c2*sw,y2,'C2'):id==='L'?below(rx+d.c2*sw,x1,y2,'L'):null;
  return{W:DGW,H:y2+BH+40,g,spot,cand:['T','C','R','C2','L']};}
function dgLine(d){const RH=96,XL=26,XR=DGW-86;let g='';const rows=d.rows.map(r=>r.p||Array.from({length:r.n},(_,i)=>''));
  const px=(j,i)=>XL+i*(XR-XL)/Math.max(1,rows[j].length-1),py=j=>46+j*RH;
  rows.forEach((p,j)=>{const y=py(j);g+=`<path d="M${XL-10} ${y}H${XR+10}" class="dg-ln"/>`;
    p.forEach((t,i)=>{const x=px(j,i);if(t==='…'){g+=`<text x="${x}" y="${y+5}" text-anchor="middle" class="dg-n">…</text>`;return;}
      g+=`<circle cx="${x}" cy="${y}" r="6" class="dg-pt"/>`;if(t)g+=`<text x="${x}" y="${y+22}" text-anchor="middle" class="dg-pl">${esc(t)}</text>`;});});
  const spot=id=>{let m=id.match(/^G(\d+):(\d+)$/);if(m){const j=+m[1],i=+m[2];if(!rows[j]||i+1>=rows[j].length)return null;const a=px(j,i),b=px(j,i+1),y=py(j);
      return{x:(a+b)/2,y:y-20,a:'middle',br:`M${a+2} ${y-8}Q${(a+b)/2} ${y-16} ${b-2} ${y-8}`,key:id,bd:'G'+j,r:[a,b]};}
    m=id.match(/^A(\d+):(\d+)-(\d+)$/);if(m){const j=+m[1];if(!rows[j]||+m[3]>=rows[j].length)return null;const a=px(j,+m[2]),b=px(j,+m[3]),y=py(j)+30;
      return{x:(a+b)/2,y:y+16,a:'middle',br:`M${a} ${y-4}V${y}H${b}V${y-4}`,key:id,bd:'A'+j,r:[a,b]};}
    m=id.match(/^N(\d+)$/);if(m&&rows[+m[1]])return{x:XR+22,y:py(+m[1])+5,a:'start',br:'',key:id};return null;};
  const cand=[];rows.forEach((p,j)=>{cand.push('N'+j,'G'+j+':0','A'+j+':0-'+(p.length-1));});
  return{W:DGW,H:46+rows.length*RH-20,g,spot,cand};}
function dgTbl(d){const nc=d.cols.length,cw=(DGW-20)/nc,rh=38,y0=8;let g='';
  d.cols.forEach((c,i)=>{g+=`<rect x="${10+i*cw}" y="${y0}" width="${cw}" height="${rh}" class="dg-th"/><text x="${10+i*cw+cw/2}" y="${y0+rh/2+5}" text-anchor="middle" class="dg-n">${esc(c)}</text>`;});
  d.rows.forEach((r,j)=>r.forEach((t,i)=>{const y=y0+(j+1)*rh;g+=`<rect x="${10+i*cw}" y="${y}" width="${cw}" height="${rh}" class="dg-w"/>`;if(t)g+=`<text x="${10+i*cw+cw/2}" y="${y+rh/2+5}" text-anchor="middle" class="dg-l fx">${esc(t)}</text>`;}));
  const spot=id=>{const m=id.match(/^C(\d+):(\d+)$/);if(!m||!d.rows[+m[1]]||+m[2]>=nc)return null;return{x:10+(+m[2])*cw+cw/2,y:y0+(+m[1]+1)*rh+rh/2+5,a:'middle',br:'',key:id,box:1};};
  const cand=[];d.rows.forEach((r,j)=>r.forEach((t,i)=>{if(!t)cand.push('C'+j+':'+i);}));
  return{W:DGW,H:y0+(d.rows.length+1)*rh+8,g,spot,cand};}
/* the box a label takes, to keep spots from sitting on top of each other */
function dgBox(s,t){const w=Math.max(40,dgTw(t||'000')+14),x=s.a==='start'?s.x-4:s.x-w/2;return[x,s.y-16,w,22];}
function dgHit(a,b){return a[0]<b[0]+b[2]&&b[0]<a[0]+a[2]&&a[1]<b[1]+b[3]&&b[1]<a[1]+a[3];}
/* extra empty spots (up to 2) so the last number is still a real choice */
function dgDecoys(d,L){const mk=d.mk||[],fx=d.fx||[],keys=new Set(),boxes=(L.avoid||[]).slice(),bands=[];
  const clash=s=>s.bd&&bands.some(b=>b.bd===s.bd&&s.r[0]<b.r[1]-2&&b.r[0]<s.r[1]-2);
  mk.concat(fx).forEach(([id,t])=>{const s=L.spot(id);if(s){keys.add(s.key);boxes.push(dgBox(s,t));if(s.bd)bands.push(s);}});
  const out=[];for(const id of L.cand){if(out.length>=2)break;const s=L.spot(id);if(!s||keys.has(s.key)||clash(s))continue;const b=dgBox(s,'000');if(boxes.some(x=>dgHit(x,b)))continue;out.push(id);keys.add(s.key);boxes.push(b);if(s.bd)bands.push(s);}
  return out;}
/* draw: fixed labels, placed labels, empty spots (tappable) */
function dgSvg(d,placed,spots,bad){const L=dgLay(d);let o=L.g;
  const lab=(id,t,cls)=>{const s=L.spot(id);if(!s)return'';let h=s.br?`<path d="${s.br}" class="${s.lead?'dg-lead':'dg-br'}"/>`:'';
    if(s.box&&t==null)return'';return h+`<text x="${s.x}" y="${s.y}" text-anchor="${s.a}" class="dg-l${t==='?'?' q':''}${cls||''}">${esc(t)}</text>`;};
  (d.fx||[]).forEach(([id,t])=>{o+=lab(id,t,' fx');});
  placed.forEach(([id,t])=>{o+=lab(id,t,' new');});
  spots.forEach(id=>{const s=L.spot(id);if(!s)return;const b=s.box?[s.x-28,s.y-23,56,36]:dgBox(s,'000');
    if(s.br)o+=`<path d="${s.br}" class="${s.lead?'dg-lead':'dg-br'} e"/>`;
    o+=`<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="7" class="dg-sp${bad===id?' bad':''}" data-s="${id}" role="button" aria-label="放在这里"/>`;});
  return`<svg viewBox="0 0 ${L.W} ${L.H}" class="dg" role="img" aria-label="diagram"><defs><marker id="dgAr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="dg-arh"/></marker></defs>${o}</svg>`;}
function dgKey(d,id){const s=dgLay(d).spot(id);return s?s.key:id;}
window.__dg={lay:dgLay,dec:dgDecoys,svg:dgSvg};   /* for the tests */
