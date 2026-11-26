/* 人体大发现 Body Explorer drawings: the child figure (5 systems) and the arm for muscles in pairs. Drawn in code, no images, so it works offline. */
(function(){
/* Body Explorer anatomy v2 — textbook illustration style, front view. viewBox 0 0 300 700.
   Viewer's left = the body's right side. Systems: dig, res, cir, ske, mus. */
(function(){
const MX=x=>300-x;
/* ---------- outline (left half, mirrored) ---------- */
const HALF=[[150.0,-13.4],[126.6,-9.5],[109.7,7.4],[103.2,33.4],[104.5,51.6],[96.7,49.0],[94.1,62.0],[98.0,73.7],[105.8,77.6],[111.0,91.9],[121.4,103.6],[131.8,111.4],[136,120],[124,126],[106,130],[92,136],[82,146],[76,160],[72,180],[68,210],[63,240],[59,270],[55,300],[52,330],[50,352],[50,366],[69,369],[72,350],[76,322],[81,292],[86,264],[90,238],[94,212],[98,192],[102,184],[104,210],[106,240],[107,270],[106,296],[104,320],[103,344],[103,372],[102,400],[103,440],[106,480],[109,514],[110,536],[107,562],[108,592],[112,622],[116,650],[135,652],[136,632],[138,604],[139,576],[140,548],[141,520],[143,490],[145,456],[147,420],[149,398],[150,392]];
const PTS=HALF.concat(HALF.slice(1,-1).reverse().map(([x,y])=>[MX(x),y]));
function cr(p,closed){const n=p.length;let d=`M${p[0][0]} ${p[0][1]}`;const g=i=>closed?p[(i+n)%n]:p[Math.max(0,Math.min(n-1,i))];
 for(let i=0;i<(closed?n:n-1);i++){const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);d+=` C${(p1[0]+(p2[0]-p0[0])/6).toFixed(1)} ${(p1[1]+(p2[1]-p0[1])/6).toFixed(1)} ${(p2[0]-(p3[0]-p1[0])/6).toFixed(1)} ${(p2[1]-(p3[1]-p1[1])/6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;}return d+(closed?' Z':'');}
const SIL=cr(PTS,true);
function limbs(fill,edge){let o='';for(const m of [x=>x,MX]){const fl=(x1,y1,x2,y2,w)=>`<path d="M${m(x1)} ${y1} Q${m((x1+x2)/2+ (x2<x1?-1:1))} ${(y1+y2)/2} ${m(x2)} ${y2}" stroke="${edge}" stroke-width="${w+2.4}" stroke-linecap="round" fill="none"/>`;
  const ff=(x1,y1,x2,y2,w)=>`<path d="M${m(x1)} ${y1} Q${m((x1+x2)/2+(x2<x1?-1:1))} ${(y1+y2)/2} ${m(x2)} ${y2}" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
  const F=[[51,390,44,414,5.2],[55,393,51,420,5.4],[60,394,59,421,5.4],[64,392,66,416,5.2],[67,378,75,394,5.6]];
  const palm=`<path d="M${m(52)} 364 C${m(46)} 372 ${m(46)} 388 ${m(52)} 396 C${m(58)} 400 ${m(66)} 398 ${m(69)} 390 C${m(71)} 380 ${m(70)} 370 ${m(68)} 364 Z"`;
  o+=palm+` fill="${edge}" transform="translate(0 0)" stroke="${edge}" stroke-width="2.4"/>`+F.map(f=>fl(...f)).join('')+palm+` fill="${fill}"/>`+F.map(f=>ff(...f)).join('');
  const foot=`<path d="M${m(117)} 644 C${m(114)} 662 ${m(108)} 676 ${m(110)} 686 C${m(116)} 694 ${m(134)} 695 ${m(142)} 689 C${m(146)} 680 ${m(140)} 664 ${m(136)} 646 Z"`;
  o+=foot+` fill="${fill}" stroke="${edge}" stroke-width="1.4"/>`+[0,1,2,3,4].map(i=>`<ellipse cx="${m(114+i*6.6)}" cy="${690-Math.abs(i-1)*.8}" rx="${i==4?3:3.4}" ry="3" fill="${fill}" stroke="${edge}" stroke-width="1"/>`).join('');}
 return o;}
/* ---------- defs ---------- */
function defs(id){const R=(n,a,b,c)=>`<radialGradient id="${id}${n}" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="${a}"/><stop offset=".45" stop-color="${b}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
 return `<defs><linearGradient id="${id}sk" x1="0" x2="1"><stop offset="0" stop-color="#F2AE82"/><stop offset=".3" stop-color="#F9C7A2"/><stop offset=".7" stop-color="#F9C7A2"/><stop offset="1" stop-color="#F2AE82"/></linearGradient>
 ${R('st','#F8C0AE','#EE9A86','#CD6652')}${R('lu','#B8434E','#A3313D','#8A2430')}${R('ht','#EE6B5E','#D43D30','#8E1E16')}${R('lv','#C2564A','#A4402F','#74271C')}${R('si','#F9B4A4','#EE8A78','#D2604F')}${R('li','#F4AFAA','#E68A86','#C9615C')}${R('bn','#FFFFFF','#F6F1E6','#E3D8C0')}${R('mu','#F08C80','#E0705F','#C4554A')}
 <filter id="${id}gl" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#FFC400"/><feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#FFC400"/></filter>
 <filter id="${id}sh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="1.2" stdDeviation="1.2" flood-color="#6b2a1a" flood-opacity=".35"/></filter>
 <pattern id="${id}fb" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(75)"><path d="M0 0 V4" stroke="#F6B3A8" stroke-width=".7" opacity=".7"/></pattern><clipPath id="${id}cl"><path d="${SIL}"/></clipPath></defs>`;}
function skin(id,tone){return `<path d="${SIL}" fill="${tone||`url(#${id}sk)`}" stroke="#E59C70" stroke-width="1.5"/>${limbs(tone||'#F7BF97','#E59C70')}
 <g fill="none" stroke="#EBA892" stroke-width="1.2" opacity=".8"><path d="M110 70 q3 6 1 11 M190 70 q-3 6 -1 11"/><path d="M106 300 C112 330 122 350 144 374 M194 300 C188 330 178 350 156 374" opacity=".6"/><path d="M150 140 v70" opacity=".35"/><path d="M148 330 q2 3 4 0"/></g>`;}
function face(){return `<g transform="translate(150 114) scale(1.3) translate(-150 -114)" fill="none" stroke="#C88466" stroke-width="1.3" stroke-linecap="round"><path d="M136 56 q5 -3 10 0 M154 56 q5 -3 10 0"/><path d="M150 62 q-3 10 0 14 q2 1 4 -1"/><path d="M143 88 q7 4 14 0"/></g>`;}
const W=(id,hi,k,el)=>`<g data-part="${k}" class="pt"${hi===k?` filter="url(#${id}gl)"`:''}>${el}</g>`;
const tube=(d,w,c,dk,hl=true)=>`<path d="${d}" fill="none" stroke="${dk}" stroke-width="${w+2.4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>${hl?`<path d="${d}" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="${(w*.28).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" transform="translate(-${(w*.2).toFixed(1)} -${(w*.15).toFixed(1)})"/>`:''}`;
const S={};
/* ---------- digestive ---------- */
S.dig=(id,hi)=>{let s='';
 s+=W(id,hi,'mouth',`<ellipse cx="150" cy="94" rx="10" ry="8" fill="#A92A2A" stroke="#6E1515" stroke-width="1.2"/><path d="M142 92 q8 -5 16 0" fill="#F4F4F4"/><ellipse cx="150" cy="98" rx="5.5" ry="3" fill="#E07A7A"/>`);
 s+=W(id,hi,'gullet',tube('M150 100 C150 122 149 150 149 178 C149 204 152 216 160 226',5,'#C63A3A','#7E1E1E'));
 s+=W(id,hi,'stomach',`<g transform="translate(0 -8)"><path d="M158 232 C172 220 200 226 204 252 C208 282 192 306 166 308 C150 309 140 302 142 292 C152 294 168 290 176 278 C183 264 177 252 162 250 Z" fill="url(#${id}st)" stroke="#9E4637" stroke-width="1.3"/><g stroke="#C76B5B" stroke-width=".9" fill="none" opacity=".75"><path d="M166 256 C182 260 192 274 186 290"/><path d="M172 250 C188 254 198 270 194 286"/><path d="M156 298 C170 298 182 292 190 282"/></g></g>`);
 /* small intestine: packed loops */
 let si=`<path d="M120 304 C150 296 184 300 186 330 C188 360 162 370 140 368 C116 366 110 336 120 304 Z" fill="#F7B3A6" opacity=".75"/>`;
 {let pts=[[124,308]];const rows=[312,321,330,339,348,357];
  rows.forEach((y,k)=>{const L=126+Math.abs(k-2.5)*2,Rr=178-Math.abs(k-2.5)*2;const xs=k%2?[Rr,L]:[L,Rr];
   const n=4;for(let j=0;j<=n;j++){const t=j/n;const x=xs[0]+(xs[1]-xs[0])*t;pts.push([x,y+Math.sin(t*Math.PI*3)*2.2]);}});
  pts.push([128,362]);
  const e=pts[pts.length-1];const d=cr(pts,false);const duo=`M141 286 C128 286 120 294 124 308`;const ile=`M${e[0].toFixed(1)} ${e[1].toFixed(1)} C${(e[0]+4).toFixed(1)} 368 132 372 121 372`;si+=tube(duo,6,`url(#${id}si)`,'#B4644E')+tube(ile,6,`url(#${id}si)`,'#B4644E')+tube(d,7.5,`url(#${id}si)`,'#A9433A')+`<path d="${d}" fill="none" stroke="#FFE1D6" stroke-width="1.1" transform="translate(-.8 -1.2)" opacity=".7"/>`;}
 s+=W(id,hi,'small',si);
 const LI='M116 376 C113 368 113 362 113 352 L113 306 C113 296 121 292 134 293 L168 294 C182 294 189 298 189 310 L189 348 C189 362 182 370 170 372 C160 374 154 378 152 382';
 s+=W(id,hi,'large',`<path d="${LI}" fill="none" stroke="#A84A48" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="${LI}" fill="none" stroke="url(#${id}li)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="${LI}" fill="none" stroke="#C2615D" stroke-width="13" stroke-dasharray="1.2 5.5" stroke-linejoin="round"/><path d="${LI}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="3" transform="translate(-2 -2)"/><path d="M116 378 C112 382 110 388 112 392" stroke="#A84A48" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M116 378 C112 382 110 388 112 392" stroke="#E68A86" stroke-width="2.2" stroke-linecap="round" fill="none"/>`);
 s+=W(id,hi,'rectum',`<path d="M152 382 L151 390" stroke="#A84A48" stroke-width="8" stroke-linecap="round"/><path d="M152 382 L151 390" stroke="#E68A86" stroke-width="5.5" stroke-linecap="round"/><circle cx="151" cy="391.5" r="2.2" fill="#7A3E22"/>`);
 return s;};
/* ---------- respiratory ---------- */
S.res=(id,hi)=>{let s='';
 s+=W(id,hi,'nose',`<g transform="translate(150 114) scale(1.3) translate(-150 -114)"><path d="M144 62 C140 72 139 78 144 81 L156 81 C161 78 160 72 156 62 Z" fill="#F0A792" stroke="#B06A50" stroke-width="1.1"/></g><path d="M150 70 C156 74 158 84 154 94 C152 100 150 104 150 108" stroke="#C77B7B" stroke-width="7.5" stroke-linecap="round" fill="none"/><path d="M150 70 C156 74 158 84 154 94 C152 100 150 104 150 108" stroke="#EFA9A4" stroke-width="5" stroke-linecap="round" fill="none"/>`);
 let br='';const b=(x,y,a,l,w,dp)=>{if(dp>6)return;const x2=x+Math.sin(a)*l,y2=y+Math.cos(a)*l;br+=`<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#F7FBFD" stroke-width="${w.toFixed(2)}" stroke-linecap="round" opacity=".9"/>`;b(x2,y2,a-.42,l*.74,w*.72,dp+1);b(x2,y2,a+.42,l*.74,w*.72,dp+1);};
 b(144,204,-0.8,17,3.6,0);b(156,204,0.8,17,3.6,0);b(140,214,-1.6,12,2.6,1);b(160,214,1.6,12,2.6,1);
 const RL='M139 134 C128 132 110 158 103 198 C97 236 97 274 103 302 C114 288 130 282 145 292 C147 250 147 188 139 134 Z';
 const LL='M161 134 C172 132 190 158 197 198 C203 236 203 274 197 302 C186 288 172 282 162 290 C162 276 168 266 166 254 C164 244 159 238 158 228 C156 200 155 168 161 134 Z';
 s+=W(id,hi,'lungs',`<path d="${RL}" fill="url(#${id}lu)" stroke="#6E1A24" stroke-width="1.3"/><path d="${LL}" fill="url(#${id}lu)" stroke="#6E1A24" stroke-width="1.3"/><g stroke="#7A1E2A" stroke-width="1" fill="none"><path d="M102 238 C118 232 132 222 144 208"/><path d="M104 266 C120 262 134 252 145 242"/><path d="M198 234 C184 242 172 252 163 272"/></g><g clip-path="url(#${id}cl)">${br}</g>`);
 let rings='';for(let y=110;y<198;y+=5.5)rings+=`<path d="M145.5 ${y} q4.5 2 9 0" stroke="#FFFFFF" stroke-width="1.5" fill="none" opacity=".9"/>`;
 s+=W(id,hi,'wind',`<path d="M150 104 L150 196" stroke="#8C9096" stroke-width="12" stroke-linecap="round"/><path d="M150 104 L150 200" stroke="#C9CCD1" stroke-width="10" stroke-linecap="round"/>${rings}<path d="M150 198 Q143 202 136 212 M150 198 Q157 202 164 212" stroke="#C9CCD1" stroke-width="7" fill="none" stroke-linecap="round"/>`);
 s+=`<path d="M100 306 C112 282 136 284 150 296 C164 284 188 282 200 306" stroke="#D99A7A" stroke-width="1.6" fill="none" opacity=".8"/>`;
 return s;};
/* ---------- circulatory ---------- */
S.cir=(id,hi)=>{let s='';
 const AP=[[[156,228],[160,262],[158,300],[155,330],[154,350]],
  [[154,350],[142,368],[132,398],[126,450],[121,500],[119,530],[121,580],[123,630],[124,684]],[[154,350],[166,368],[170,398],[175,450],[180,500],[181,530],[179,580],[177,630],[176,684]],
  [[152,200],[144,170],[140,140],[139,110],[138,82]],[[160,200],[159,170],[160,140],[161,110],[162,82]],
  [[150,204],[128,188],[110,166],[96,158],[88,186],[82,230],[76,282],[68,330],[61,372],[56,406]],[[162,204],[182,188],[192,166],[204,158],[212,186],[218,230],[224,282],[232,330],[239,372],[244,406]]];
 const A=AP.map(p=>cr(p,false));A.push('M152 214 C148 198 160 190 170 198 C176 206 170 216 160 230');
 const V=AP.map(p=>cr(p.map(([x,y])=>[x-5,y+2]),false));
 let v='';V.forEach(d=>v+=`<path d="${d}" fill="none" stroke="#1F4FA8" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#3E73D2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`);
 A.forEach(d=>v+=`<path d="${d}" fill="none" stroke="#8E1A12" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#D8362A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`);
 let sm='';const tr=(x,y,a,l,w,dp)=>{if(dp>2)return;const x2=x+Math.cos(a)*l,y2=y+Math.sin(a)*l,qx=(x+x2)/2+Math.sin(a)*l*.15,qy=(y+y2)/2-Math.cos(a)*l*.15;
  sm+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#D8362A" stroke-width="${w.toFixed(1)}" fill="none" stroke-linecap="round"/><path d="M${(x-3).toFixed(1)} ${(y+2.5).toFixed(1)} Q${(qx-3).toFixed(1)} ${(qy+2.5).toFixed(1)} ${(x2-3).toFixed(1)} ${(y2+2.5).toFixed(1)}" stroke="#3E73D2" stroke-width="${(w*.85).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
  tr(x2,y2,a-.5,l*.6,w*.7,dp+1);tr(x2,y2,a+.5,l*.6,w*.7,dp+1);};
 const D=Math.PI/180;
 [[158,250,-15,16],[157,282,200,16],[156,312,-10,14],[155,330,195,14],[156,240,195,14],[124,460,190,12],[176,460,-10,12],[121,570,195,11],[179,570,-15,11],[80,232,160,10],[220,232,20,10],[70,320,165,9],[230,320,15,9],[142,112,200,8],[158,112,-20,8]].forEach(([x,y,a,l])=>tr(x,y,a*D,l,1.8,0));
 [[56,406],[244,406]].forEach(([x,y])=>{for(const a of [70,90,110])tr(x,y,a*D,10,1.3,1);});
 [[124,684],[176,684]].forEach(([x,y])=>{for(const a of [150,30])tr(x,y-4,a*D,8,1.3,1);});
 s+=W(id,hi,'vessels',v+sm);
 s+=W(id,hi,'heart',`<g transform="translate(161 230) rotate(-28) scale(.8) translate(-161 -232)"><path d="M142 214 C138 200 152 192 162 200 C170 194 186 200 186 216 C186 240 168 258 152 268 C144 256 138 236 142 214 Z" fill="url(#${id}ht)" stroke="#6E140E" stroke-width="1.5"/><path d="M160 204 C166 222 164 244 154 262" stroke="#7A1810" stroke-width="1.3" fill="none" opacity=".7"/><path d="M168 212 C172 222 176 228 182 230" stroke="#F4A09A" stroke-width="1" fill="none" opacity=".6"/></g>`);
 return s;};
/* ---------- skeleton ---------- */
S.ske=(id,hi)=>{let s='';const B='#FFFFFF',ST='#F7DCD3',CA='#FFFFFF';
 const bone=(x1,y1,x2,y2,w,e1=1,e2=1)=>{const a=Math.atan2(y2-y1,x2-x1),nx=Math.sin(a),ny=-Math.cos(a),k=w/2,mx=(x1+x2)/2,my=(y1+y2)/2,kw=k*.62;
  const P=(x,y,f)=>`${(x+nx*f).toFixed(1)} ${(y+ny*f).toFixed(1)}`;
  const d=`M${P(x1,y1,k)} Q${P(mx,my,kw*1.05)} ${P(x2,y2,k*.9)} L${P(x2,y2,-k*.9)} Q${P(mx,my,-kw*1.05)} ${P(x1,y1,-k)} Z`;
  const knob=(x,y,e)=>`<circle cx="${(x+nx*k*.45).toFixed(1)}" cy="${(y+ny*k*.45).toFixed(1)}" r="${(w*.62*e).toFixed(1)}" fill="${B}" stroke="${ST}"/><circle cx="${(x-nx*k*.45).toFixed(1)}" cy="${(y-ny*k*.45).toFixed(1)}" r="${(w*.62*e).toFixed(1)}" fill="${B}" stroke="${ST}"/>`;
  return `${knob(x1,y1,e1)}${knob(x2,y2,e2)}<path d="${d}" fill="${B}" stroke="${ST}" stroke-width="1"/><path d="M${P(x1,y1,k*.5)} Q${P(mx,my,kw*.6)} ${P(x2,y2,k*.45)}" fill="none" stroke="${B}" stroke-width="${(w*.5).toFixed(1)}"/>`;};
 const cbone=(x1,y1,x2,y2,w,bend,e1=1.5,e2=1.5)=>{const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len,cx=(x1+x2)/2+nx*bend,cy=(y1+y2)/2+ny*bend;
  const d=`M${x1} ${y1} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}`;const ux=dx/len,uy=dy/len;
  const end=(x,y,e,dir)=>`<ellipse cx="${(x+ux*dir*w*.2).toFixed(1)}" cy="${(y+uy*dir*w*.2).toFixed(1)}" rx="${(w*e*.62).toFixed(1)}" ry="${(w*.55).toFixed(1)}" transform="rotate(${(Math.atan2(nx,-ny)*180/Math.PI).toFixed(1)} ${(x).toFixed(1)} ${(y).toFixed(1)})" fill="${B}" stroke="${ST}"/>`;
  return `${end(x1,y1,e1,1)}${end(x2,y2,e2,-1)}<path d="${d}" fill="none" stroke="${ST}" stroke-width="${w+1.6}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${B}" stroke-width="${w}" stroke-linecap="round"/>${end(x1,y1,e1,1).replace(/stroke="[^"]+"/,'stroke="none"')}${end(x2,y2,e2,-1).replace(/stroke="[^"]+"/,'stroke="none"')}`;};
 /* skull */
 s+=W(id,hi,'skull',`<g transform="translate(150 114) scale(1.3) translate(-150 -114)"><path d="M118 58 C116 28 132 18 150 18 C168 18 184 28 182 58 C182 72 178 80 172 84 L170 96 C166 108 158 112 150 112 C142 112 134 108 130 96 L128 84 C122 80 118 72 118 58 Z" fill="${B}" stroke="${ST}" stroke-width="1.3"/><path d="M128 84 C134 90 142 92 150 92 C158 92 166 90 172 84" stroke="${ST}" fill="none"/><path d="M129 56 C132 50 144 50 146 56 C147 64 142 68 137 68 C132 68 128 64 129 56 Z" fill="#F2B7A6"/><path d="M171 56 C168 50 156 50 154 56 C153 64 158 68 163 68 C168 68 172 64 171 56 Z" fill="#F2B7A6"/><path d="M146 70 L150 81 L154 70 Q150 67 146 70 Z" fill="#F2B7A6"/><g stroke="${ST}" stroke-width=".8">${[138,142,146,150,154,158,162].map(x=>`<line x1="${x}" y1="92" x2="${x}" y2="100"/>`).join('')}</g><path d="M136 96 h28" stroke="${ST}"/><path d="M122 50 C126 40 134 36 140 36" stroke="${ST}" fill="none" opacity=".6"/></g>`);
 /* backbone */
 let sp='';for(let i=0;i<7;i++)sp+=`<rect x="145" y="${112+i*4.2}" width="10" height="3.4" rx="1.4" fill="${B}" stroke="${ST}" stroke-width=".7"/>`;
 for(let i=0;i<5;i++)sp+=`<path d="M141 ${292+i*13} h18 l2 4 l-2 6 h-18 l-2 -6 Z" fill="${B}" stroke="${ST}" stroke-width=".9"/><path d="M138 ${297+i*13} h-4 M162 ${297+i*13} h4" stroke="${ST}" stroke-width="2"/>`;
 s+=W(id,hi,'spine',sp);
 /* ribs, sternum, collarbones */
 let rb='';for(let i=0;i<12;i++){const y=146+i*11,w=24+Math.min(i,6)*6.4-(i>7?(i-7)*6:0)-(i>9?6:0),drop=24+i*1.6;
  for(const sg of [-1,1]){const x0=150+sg*5,xo=150+sg*(w+8),xe=150+sg*(i<7?9:i<10?w-10:w-2),ye=y+drop+(i<7?8:12);
   const d=`M${x0} ${y-2} C${150+sg*w*.6} ${y-10} ${xo} ${y-2} ${150+sg*(w+4)} ${y+drop*.6} C${150+sg*(w-2)} ${y+drop} ${150+sg*(w-8)} ${ye} ${xe} ${ye}`;
   rb+=`<path d="${d}" fill="none" stroke="${ST}" stroke-width="5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="3.8" stroke-linecap="round"/>`;
   if(i<10)rb+=`<path d="M${xe} ${ye} Q${150+sg*8} ${ye-4} ${150+sg*5} ${Math.min(y+8+i*2,238)}" stroke="${CA}" stroke-width="3" fill="none" stroke-linecap="round"/>`;}}
 rb+=`<path d="M143 132 L157 132 L156 148 L154 150 L155 236 L150 246 L145 236 L146 150 L144 148 Z" fill="${B}" stroke="${ST}"/>`;
 for(const sg of [-1,1]){const d=`M${150+sg*7} 132 C${150+sg*24} 124 ${150+sg*46} 128 ${150+sg*62} 140`;rb+=`<path d="${d}" stroke="${ST}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#FFFFFF" stroke-width="5.2" fill="none" stroke-linecap="round"/>`;}
 s+=W(id,hi,'ribs',rb);
 /* limbs and pelvis */
 let lb='';
 lb+=`<path d="M150 356 C140 336 112 326 104 340 C98 354 104 370 116 380 C120 388 126 398 136 402 C142 404 146 400 148 396 L150 386 L152 396 C154 400 158 404 164 402 C174 398 180 388 184 380 C196 370 202 354 196 340 C188 326 160 336 150 356 Z" fill="${B}" stroke="${ST}" stroke-width="1.2"/><ellipse cx="134" cy="388" rx="6" ry="8" fill="#F4BCA8"/><ellipse cx="166" cy="388" rx="6" ry="8" fill="#F4BCA8"/><path d="M143 352 h14 l-1 30 l-6 6 l-6 -6 Z" fill="#FBEDE8" stroke="${ST}"/>`;
 for(const m of [x=>x,MX]){
  lb+=`<path d="M${m(92)} 142 C${m(100)} 150 ${m(104)} 170 ${m(100)} 196" stroke="${ST}" stroke-width="3" fill="none" opacity=".5"/>`;/* shoulder blade edge */
  lb+=`<circle cx="${m(90)}" cy="150" r="6.5" fill="${B}" stroke="${ST}"/>`+cbone(m(89),156,m(72),258,6,m===MX?-3:3,1.3,1.9);
  lb+=cbone(m(69),266,m(56),358,3.2,m===MX?-2.5:2.5,1.2,1.4)+cbone(m(76),266,m(63),360,3.2,m===MX?2:-2,1.4,1.2);
  lb+=`<g fill="${B}" stroke="${ST}" stroke-width=".6">${[[56,368],[61,367],[66,368],[58,374],[64,374]].map(([x,y])=>`<circle cx="${m(x)}" cy="${y}" r="2.8"/>`).join('')}</g>`;
  lb+=[[50,380,47,398,45,411],[54,382,52,402,51,417],[59,383,59,404,59,418],[64,382,65,400,66,413],[66,374,70,386,73,392]].map(([a,b2,c,d,e,f])=>`<path d="M${m(a)} ${b2} Q${m(c)} ${d} ${m(e)} ${f}" stroke="${ST}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${m(a)} ${b2} Q${m(c)} ${d} ${m(e)} ${f}" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  lb+=`<circle cx="${m(127)}" cy="381" r="6.5" fill="${B}" stroke="${ST}"/>`+cbone(m(117),390,m(127),518,8,m===MX?4:-4,1.4,2.0)+`<path d="M${m(126)} 382 L${m(114)} 384" stroke="${ST}" stroke-width="7" stroke-linecap="round"/><path d="M${m(126)} 382 L${m(114)} 384" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>`;
  lb+=`<ellipse cx="${m(127)}" cy="530" rx="6.5" ry="7" fill="${B}" stroke="${ST}"/>`;
  lb+=cbone(m(127),540,m(126),648,6.5,m===MX?-2:2,2.0,1.5)+cbone(m(117),544,m(118),646,2.8,m===MX?-1.5:1.5,1.6,1.6);
  lb+=`<path d="M${m(116)} 654 L${m(132)} 654 L${m(136)} 668 L${m(114)} 670 Z" fill="${B}" stroke="${ST}"/>`+[0,1,2,3,4].map(i=>`<path d="M${m(115+i*4.6)} 670 L${m(114+i*5.6)} 682 L${m(114+i*5.8)} 690" stroke="${ST}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${m(115+i*4.6)} 670 L${m(114+i*5.6)} 682 L${m(114+i*5.8)} 690" stroke="#FFFFFF" stroke-width="1.8" fill="none" stroke-linecap="round"/>`).join('');
 }
 s+=W(id,hi,'bones',lb);
 return s;};
/* ---------- muscles (whole figure) ---------- */
S.mus=(id,hi)=>{const M='#EC9184',EDGE='#F9D2C9';const P=d=>`<path d="${d}" fill="${M}" stroke="${EDGE}" stroke-width="1.3" stroke-linejoin="round"/>`;
 const half=[
 'M137 102 C141 110 145 118 147 125 C145 127 142 127 140 125 C137 118 133 110 131 105 C132 102 135 101 137 102 Z',
 'M138 122 C124 127 106 131 93 139 C100 141 110 140 120 137 C129 134 136 130 141 126 Z',
 'M91 139 C78 143 72 160 74 180 C75 188 76 192 78 194 C86 186 94 172 99 158 C101 148 97 140 91 139 Z',
 'M147 141 C148 160 148 180 147 197 C134 203 116 201 104 192 C99 186 99 166 104 152 C109 142 120 138 132 138 C138 138 143 139 147 141 Z',
 'M77 194 C67 210 64 234 66 252 C68 260 76 261 80 255 C87 242 91 224 90 210 C89 200 84 194 77 194 Z',
 'M89 218 C93 232 93 246 88 258 C84 260 80 257 81 251 C84 240 86 228 89 218 Z',
 'M68 260 C61 284 56 316 55 346 C56 355 63 358 68 353 C73 330 78 296 80 266 C77 259 72 258 68 260 Z',
 'M81 263 C84 290 82 320 77 348 C79 354 84 352 85 346 C88 316 88 288 84 266 C83 263 82 262 81 263 Z',
 'M103 200 C106 200 110 203 111 207 C110 211 106 213 102 211 C101 207 101 202 103 200 Z','M103 216 C107 216 111 219 111 224 C110 228 106 229 103 227 C101 223 101 218 103 216 Z','M104 232 C108 232 112 236 111 240 C110 244 106 245 104 243 C102 239 102 234 104 232 Z',
 'M105 249 C103 270 105 288 111 302 C116 306 122 307 126 305 C123 282 121 260 118 244 C114 243 108 245 105 249 Z',
 'M131 206 C137 204 144 205 148 206 L148 226 C142 228 135 228 130 226 C127 220 127 212 131 206 Z','M130 231 C136 229 144 230 148 231 L148 251 C142 253 135 253 130 251 C127 245 127 237 130 231 Z','M130 256 C136 254 144 255 148 256 L148 274 C142 276 135 276 130 274 C127 268 127 261 130 256 Z','M130 279 C136 278 144 278 148 279 L148 328 C146 332 143 335 141 335 C135 320 130 302 129 288 C129 284 129 281 130 279 Z',
 'M116 344 C104 380 101 440 107 492 C111 506 121 506 125 496 C129 460 128 410 124 372 C122 360 119 350 116 344 Z',
 'M131 352 C122 392 121 446 126 494 C130 504 138 502 140 492 C144 462 143 414 139 380 C137 368 134 358 131 352 Z',
 'M142 438 C153 456 155 490 145 510 C137 513 132 503 133 491 C134 472 137 454 142 438 Z',
 'M121 340 C131 376 140 428 145 494 C146 497 149 497 149 494 C146 428 137 376 126 338 C124 337 122 338 121 340 Z',
 'M117 528 C106 556 106 594 113 622 C117 630 125 628 127 618 C131 590 129 556 123 534 C121 530 119 528 117 528 Z',
 'M127 532 C134 560 136 596 131 630 C129 640 125 640 125 630 C125 600 125 564 127 532 Z',
 'M146 398 C141 420 139 450 141 476 C143 482 147 480 148 472 C149 450 149 422 149 400 C148 397 147 397 146 398 Z'];
 let s='';half.forEach(d=>{s+=P(d)+P(d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g,(m,x,y)=>m)) });
 /* mirror by transform for the right half */
 const L=half.map(d=>P(d)+`<path d="${d}" fill="url(#${id}fb)"/>`).join('');
 const body=`<path d="${SIL}" fill="#E27B6F"/>${limbs("#E8897D","#D0665B")}`+L+`<g transform="translate(300 0) scale(-1 1)">${L}</g>`+`<g transform="translate(150 114) scale(1.3) translate(-150 -114)"><path d="M120 40 C130 22 170 22 180 40 C174 52 160 55 150 55 C140 55 126 52 120 40 Z" fill="${M}" stroke="${EDGE}" stroke-width="1"/><path d="M120 40 C130 22 170 22 180 40 C174 52 160 55 150 55 C140 55 126 52 120 40 Z" fill="url(#${id}fb)"/><ellipse cx="137" cy="61" rx="8" ry="6.5" fill="none" stroke="${EDGE}" stroke-width="2.2"/><ellipse cx="163" cy="61" rx="8" ry="6.5" fill="none" stroke="${EDGE}" stroke-width="2.2"/><path d="M146 66 L150 80 L154 66" fill="#F9E3DC"/><ellipse cx="150" cy="90" rx="11" ry="5" fill="none" stroke="${EDGE}" stroke-width="2"/>${[[124,72,132,98],[176,72,168,98]].map(([a,b,c,d])=>`<path d="M${a} ${b} C${a+2} ${b+12} ${c-2} ${d-8} ${c} ${d}" stroke="${EDGE}" stroke-width="1.6" fill="none"/>`).join('')}</g>`+`<g stroke="#FBE7E1" stroke-linecap="round" fill="none"><path d="M150 140 V334" stroke-width="2.6"/><path d="M144 104 L147 124 M156 104 L153 124" stroke-width="2"/>${[x=>x,MX].map(m=>`<path d="M${m(58)} 350 L${m(59)} 366 M${m(65)} 352 L${m(66)} 367" stroke-width="1.6"/><path d="M${m(126)} 506 L${m(126)} 538" stroke-width="3.2"/><path d="M${m(124)} 628 L${m(125)} 650 M${m(130)} 628 L${m(130)} 650" stroke-width="1.8"/><path d="M${m(84)} 252 L${m(76)} 266" stroke-width="2"/>`).join('')}</g>`+`<g fill="#F6C2AE">${'<ellipse cx="117" cy="522" rx="7" ry="8"/><ellipse cx="183" cy="522" rx="7" ry="8"/>'}</g>`;
 return W(id,hi,'muscles',body);};
function body(sys,hi,opts={}){const id='b'+Math.random().toString(36).slice(2,7);
 let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -24 300 724" width="100%" height="100%" class="anat">${defs(id)}`;
 if(sys==='mus')s+=S.mus(id,hi);
 else{s+=skin(id,sys==='ske'?'#F4BCA8':null);if(sys!=='ske')s+=face();s+=S[sys](id,hi);}
 if(opts.labels)for(const [x,y,tx,ty,t,on] of opts.labels){const Lf=tx<150,w=t.length*6.2+14;s+=`<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${on?'#E0A800':'#6b6f8e'}" stroke-width="1.3"/><circle cx="${x}" cy="${y}" r="2.6" fill="${on?'#FFC400':'#fff'}" stroke="#6b6f8e" stroke-width=".8"/><rect x="${Lf?tx-w:tx}" y="${ty-10}" width="${w}" height="20" rx="7" fill="${on?'#FFC400':'#2B2F55'}"/><text x="${Lf?tx-w/2:tx+w/2}" y="${ty+4.5}" text-anchor="middle" font-size="12" font-weight="700" font-family="system-ui,sans-serif" fill="${on?'#3a2a00':'#fff'}">${t}</text>`;}
 return s+'</svg>';}
window.ANAT={body,SIL};
})();
const SK='#F8D0B4',SE='#E2A07C',BN='#FFFFFF',BE='#D8C6AE',MC='#D9493A',MR='#F3A196',ME='#A8352A';
function armBent(){return `
<path d="M40 28 C34 90 38 160 48 205 C52 232 70 246 92 242 C140 230 190 150 226 118 L244 100 C262 92 268 70 256 56 C244 44 224 48 214 60 L200 74 C170 104 140 150 124 168 C142 128 146 80 128 28 Z" fill="${SK}" stroke="${SE}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M76 36 C74 100 76 160 80 206" stroke="${BE}" stroke-width="15" stroke-linecap="round" fill="none"/><path d="M76 36 C74 100 76 160 80 206" stroke="${BN}" stroke-width="12" stroke-linecap="round" fill="none"/>
<path d="M86 214 L216 98 M92 224 L222 110" stroke="${BE}" stroke-width="8" stroke-linecap="round"/><path d="M86 214 L216 98 M92 224 L222 110" stroke="${BN}" stroke-width="5.5" stroke-linecap="round"/>
<path d="M88 40 C124 70 140 120 124 160 C118 172 112 178 106 190 L102 192 C100 170 92 120 86 40 Z" fill="${MC}" stroke="${ME}" stroke-width="1.6"/>
<path d="M98 70 C112 90 118 120 112 150" stroke="#F07A6A" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M66 40 C58 100 58 160 66 206 C68 212 74 214 76 208 C72 160 70 100 72 40 Z" fill="${MR}" stroke="${ME}" stroke-width="1.4"/>
<path d="M106 190 L118 196" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><path d="M70 208 L76 220" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
<path d="M226 64 C236 62 246 66 250 74 M222 74 C232 72 242 76 246 84 M220 84 C228 84 236 88 240 94" stroke="${SE}" stroke-width="2" fill="none" stroke-linecap="round"/>`;}
function armStraight(){return `
<path d="M40 28 C32 90 36 160 44 210 C46 260 52 310 58 340 C50 352 50 378 64 388 C80 398 102 392 108 378 C114 364 110 350 104 340 C108 300 112 250 112 210 C116 160 114 90 110 28 Z" fill="${SK}" stroke="${SE}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M76 36 C74 100 76 160 78 206" stroke="${BE}" stroke-width="15" stroke-linecap="round" fill="none"/><path d="M76 36 C74 100 76 160 78 206" stroke="${BN}" stroke-width="12" stroke-linecap="round" fill="none"/>
<path d="M72 218 L78 336 M86 218 L90 336" stroke="${BE}" stroke-width="8" stroke-linecap="round"/><path d="M72 218 L78 336 M86 218 L90 336" stroke="${BN}" stroke-width="5.5" stroke-linecap="round"/>
<path d="M88 40 C100 90 104 150 98 210 L92 214 C92 150 90 90 84 40 Z" fill="${MR}" stroke="${ME}" stroke-width="1.4"/>
<path d="M68 40 C42 90 40 150 58 200 C62 210 66 214 70 216 C72 160 72 100 72 40 Z" fill="${MC}" stroke="${ME}" stroke-width="1.6"/>
<path d="M58 80 C50 110 50 140 56 170" stroke="#F07A6A" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M92 214 L92 226" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><path d="M68 216 L70 226" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
<path d="M62 362 C72 366 92 366 102 360 M64 374 C74 378 92 378 100 372" stroke="${SE}" stroke-width="2" fill="none" stroke-linecap="round"/>`;}
window.ARM={armBent,armStraight};
})();
