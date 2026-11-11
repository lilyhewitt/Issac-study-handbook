// Minimal stand-in for the Firebase Realtime Database REST API: GET/PUT <path>.json with CORS.
const http=require('http');let DBX={};const log=[];
function walk(path,create){const parts=path.split('/').filter(Boolean);let o=DBX;for(let i=0;i<parts.length-1;i++){if(o[parts[i]]==null||typeof o[parts[i]]!=='object'){if(!create)return [null,null];o[parts[i]]={};}o=o[parts[i]];}return [o,parts[parts.length-1]];}
http.createServer((req,res)=>{res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET,PUT,PATCH,DELETE,OPTIONS');res.setHeader('Access-Control-Allow-Headers','*');
 if(req.method==='OPTIONS'){res.end();return;}
 const u=new URL(req.url,'http://x');let p=u.pathname;
 if(p==='/__nopatch'){global.NOPATCH=!global.NOPATCH;res.end(String(global.NOPATCH));return;}
 if(req.method==='PATCH'&&global.NOPATCH){res.statusCode=405;res.end('{"error":"no patch"}');return;}
 if(p==='/__deny'){global.DENY=!global.DENY;res.end(String(global.DENY));return;}
 if(global.DENY&&p!=='/__reset'){res.statusCode=401;res.end('{"error":"Permission denied"}');return;}
 if(p==='/__dump'){res.end(JSON.stringify(DBX));return;} if(p==='/__reset'){DBX={};res.end('ok');return;}
 if(!p.endsWith('.json')){res.statusCode=404;res.end();return;} p=p.slice(0,-5);
 // rules: only /sync/<code len>=8>/<english|science|math> readable/writable, no listing above
 const parts=p.split('/').filter(Boolean);
 if(parts[0]!=='sync'||parts.length<2||parts[1].length<8||(parts.length>=3&&!['english','science','math'].includes(parts[2]))){res.statusCode=401;res.end('{"error":"Permission denied"}');return;}
 let body='';req.on('data',c=>body+=c);req.on('end',()=>{log.push(req.method+' '+p+' '+body.length);
  if(req.method==='GET'){const [o,k]=walk(p,false);const v=o?o[k]:null;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(v===undefined?null:v));}
  else if(req.method==='PUT'||req.method==='PATCH'){const v=JSON.parse(body);
   /* like the real rules: the app node must keep at and v after the write */
   if(parts.length===3){const [o,k]=walk(p,false);const cur=o&&o[k]||{};const nv=req.method==='PATCH'?Object.assign({},cur,v):v;if(!(nv&&nv.at!=null&&nv.v!=null)){res.statusCode=400;res.end('{"error":"validate"}');return;}const [o2,k2]=walk(p,true);o2[k2]=nv;res.end(body);return;}
   if(parts.length>=4){const [o,k]=walk('/'+parts.slice(0,3).join('/'),false);const node=o&&o[k];if(!(node&&node.at!=null&&node.v!=null)){res.statusCode=400;res.end('{"error":"validate"}');return;}}
   const [o,k]=walk(p,true);o[k]=req.method==='PATCH'?Object.assign({},o[k]||{},v):v;res.end(body);}
  else {res.statusCode=405;res.end();}});
}).listen(8766,()=>console.log('mock firebase on 8766'));
