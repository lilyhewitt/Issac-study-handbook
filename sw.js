/* Offline cache for the handbook and the three apps.
   Pages: network first (so updates still arrive), cached copy when offline or the network is too slow.
   Google Fonts: cache first. Everything else (sync database) is left alone. */
const CACHE='xx-offline-v1';
const PAGES=['./','./index.html','./math/','./english/','./science/','./site.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./favicon.svg','./favicon-32.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>Promise.all(PAGES.map(u=>fetch(u,{cache:'reload'}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})))));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('xx-offline-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));});
function fromCache(req){return caches.match(req,{ignoreSearch:true}).then(r=>r||(req.mode==='navigate'?caches.match(new URL('./index.html',self.registration.scope).href):undefined));}
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(req,c));return r;})));return;}
  if(u.origin!==location.origin||!u.href.startsWith(self.registration.scope))return;
  e.respondWith(new Promise(resolve=>{
    let done=false;const fall=()=>fromCache(req).then(r=>{if(r&&!done){done=true;resolve(r);}return r;});
    const t=setTimeout(fall,5000);   /* slow hotel wifi: show the saved copy after 5 s */
    fetch(req).then(r=>{clearTimeout(t);if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(req.url.split('?')[0],c));}if(!done){done=true;resolve(r);}})
      .catch(()=>{clearTimeout(t);fall().then(r=>{if(!done){done=true;resolve(r||Response.error());}});});
  }));
});
