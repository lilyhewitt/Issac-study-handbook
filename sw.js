/* Offline cache for the handbook and the three apps.
   Pages open from the saved copy straight away and are refreshed in the background, so a dead or slow
   hotel wifi never holds them up. The pages' own update check asks with cache:'reload'; that one goes to the
   network first and saves the new copy, so updates still arrive. Google Fonts: saved copy, or give up after
   1.5 s (the system font is used). Everything else (the sync database) is left alone. */
const CACHE='xx-offline-v2';
const FONTS=['https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap',
  'https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&family=Noto+Sans+SC:wght@400;600&display=swap'];
function saveFonts(c){return Promise.all(FONTS.map((u,i)=>fetch(u).then(r=>{if(!r.ok)return;const k=r.clone();return c.put(u,k).then(()=>i?0:r.text().then(css=>
  Promise.all((css.match(/https:\/\/fonts\.gstatic\.com\/[^)'"]+/g)||[]).map(f=>fetch(f).then(x=>x.ok&&c.put(f,x)).catch(()=>{})))));}).catch(()=>{})));}
const PAGES=['./','./index.html','./math/','./english/','./science/','./site.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./favicon.svg','./favicon-32.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>Promise.all(PAGES.map(u=>fetch(u,{cache:'reload'}).then(r=>r.ok&&c.put(u,r)).catch(()=>{}))).then(()=>saveFonts(c))));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('xx-offline-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));});
const key=req=>req.url.split('?')[0].split('#')[0];
const within=(ms,p)=>Promise.race([p,new Promise((_,no)=>setTimeout(()=>no(new Error('slow')),ms))]);
function save(req,r){if(r&&r.ok){const c=r.clone();return caches.open(CACHE).then(x=>x.put(key(req),c)).then(()=>r);}return r;}
function saved(req){return caches.match(key(req)).then(r=>r||(req.mode==='navigate'?caches.match(new URL('./',self.registration.scope).href):undefined));}
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.match(req.url).then(hit=>hit||within(1500,fetch(req)).then(r=>{if(r.ok||r.type==='opaque'){const c=r.clone();caches.open(CACHE).then(x=>x.put(req.url,c));}return r;})
      .catch(()=>u.hostname==='fonts.googleapis.com'?new Response('',{headers:{'Content-Type':'text/css'}}):Response.error())));return;}
  if(u.origin!==location.origin||!u.href.startsWith(self.registration.scope))return;
  if(req.mode!=='navigate'&&(req.cache==='reload'||req.cache==='no-store')){   /* the update check: network first */
    e.respondWith(within(8000,fetch(req)).then(r=>save(req,r)).catch(()=>saved(req).then(r=>r||Response.error())));return;}
  e.respondWith(saved(req).then(hit=>{
    const net=fetch(req).then(r=>save(req,r));
    if(hit){e.waitUntil(within(15000,net).catch(()=>{}));return hit;}
    return net.catch(()=>Response.error());
  }));
});
