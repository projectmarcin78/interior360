import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const source=fs.readFileSync('backend/Code.gs','utf8');
const phone='+48603760320';
function fixture(){
 let now=Date.parse('2026-10-21T10:00:00Z'),owner=true,dialog='',reads=0;
 const properties={SPREADSHEET_ID:'private-db',SC_AUTH_SECRET:crypto.randomUUID()};
 const tables={Members:[['Phone','Name','Status'],[phone,'Marcin','Active']],Tradespeople:[['headers'],['real','Local contact','Painter','Palermo','','','','Useful contact','Approved']],Reviews:[['headers']]};
 const props={getProperty:k=>properties[k]??null,setProperty:(k,v)=>{properties[k]=v;return props},deleteProperty:k=>{delete properties[k];return props},getProperties:()=>({...properties})};
 const tab=name=>({getName:()=>name,getDataRange:()=>({getDisplayValues:()=>{reads++;return tables[name]}}),getRange:(row,col,nr,nc)=>({getDisplayValues:()=>tables[name].slice(row-1,row-1+nr).map(r=>r.slice(col-1,col-1+nc))}),appendRow:row=>tables[name].push(row)});
 const sheet={getId:()=> 'private-db',getSheetByName:name=>tables[name]?tab(name):null,getActiveRange:()=>({getSheet:()=>tab('Members'),getRow:()=>2,getNumRows:()=>1})};
 class Clock extends Date{constructor(...args){super(...(args.length?args:[now]))}static now(){return now}}
 const c=vm.createContext({Date:Clock,console,PropertiesService:{getScriptProperties:()=>props},Session:{getActiveUser:()=>({getEmail:()=>owner?'owner@example.com':''}),getEffectiveUser:()=>({getEmail:()=> 'owner@example.com'})},Utilities:{getUuid:()=>crypto.randomUUID(),computeDigest:(_,v)=>crypto.createHash('sha256').update(v).digest(),computeHmacSha256Signature:(v,k)=>crypto.createHmac('sha256',k).update(v).digest(),base64EncodeWebSafe:v=>Buffer.from(v).toString('base64url'),DigestAlgorithm:{SHA_256:'SHA_256'}},SpreadsheetApp:{openById:()=>sheet,getActiveSpreadsheet:()=>sheet,getUi:()=>({showModalDialog:html=>{dialog=html.value}})},HtmlService:{createHtmlOutput:value=>({value,setWidth(){return this},setHeight(){return this}})},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},CacheService:{getScriptCache:()=>({get(){},put(){}})}});
 vm.runInContext(source,c);
 const run=s=>vm.runInContext(s,c);
 function issue(){owner=true;run('generateWhatsAppCode()');const code=dialog.match(/font-weight:700">(\d{8})</)?.[1];assert(code);owner=false;return code}
 function login(code=issue()){return run(`verifyAccessCode(${JSON.stringify(phone)},${JSON.stringify(code)})`)}
 return {run,issue,login,tables,properties,advance:ms=>now+=ms,setOwner:v=>owner=v,dialog:()=>dialog,reads:()=>reads};
}
test('anonymous and forged tokens cannot read contacts or submit anything',()=>{const f=fixture();for(const call of ['getDirectory()','getDirectory("'+ 'a'.repeat(64)+'")','submitEntry({type:"profile"})','getAccessSession("")'])assert.throws(()=>f.run(call),/SIGN_IN_REQUIRED/);assert.equal(f.reads(),0)});
test('visitor cannot generate codes or run owner setup',()=>{const f=fixture();f.setOwner(false);assert.throws(()=>f.run('generateWhatsAppCode()'),/owner/);assert.throws(()=>f.run('setupSicilyCrew()'),/owner/)});
test('owner creates a one-use code, no plaintext stored; phone+code yields protected directory',()=>{const f=fixture(),code=f.issue();assert(!JSON.stringify(f.properties).includes(code));assert(f.dialog().includes('https://wa.me/48603760320?text='));assert(f.dialog().includes('Nothing has been sent automatically'));const session=f.login(code);assert.equal(session.phone,phone);assert.equal(session.token.length,64);assert.equal(session.expires-Date.parse('2026-10-21T10:00:00Z'),7776000000);assert.equal(f.run(`getDirectory('${session.token}')[0].name`),'Local contact');assert.throws(()=>f.login(code),/incorrect/)});
test('code bound to phone, normalized formatting, no membership enumeration in errors',()=>{const f=fixture(),code=f.issue();assert.throws(()=>f.run(`verifyAccessCode('+391234567890','${code}')`),/incorrect/);const s=f.run(`verifyAccessCode('00 48 (603) 760-320','${code}')`);assert.equal(s.phone,phone)});
test('expired, replaced and five-times incorrect codes are rejected',()=>{
 const f=fixture(),old=f.issue(),latest=f.issue();assert.throws(()=>f.login(old),/incorrect/);assert(f.login(latest).token);
 const g=fixture(),code=g.issue();g.advance(1800001);assert.throws(()=>g.login(code),/incorrect/);
 const h=fixture(),correct=h.issue();const wrong=correct==='00000000'?'00000001':'00000000';for(let i=0;i<5;i++)assert.throws(()=>h.login(wrong),/incorrect/);assert.throws(()=>h.login(correct),/incorrect/);
});
test('blocking a member revokes active sessions for both reads and writes',()=>{const f=fixture(),s=f.login();f.tables.Members[1][2]='Blocked';assert.throws(()=>f.run(`getDirectory('${s.token}')`),/SIGN_IN_REQUIRED/);assert.throws(()=>f.run(`submitEntry({},'${s.token}')`),/SIGN_IN_REQUIRED/);f.tables.Members[1][2]='Active';assert.throws(()=>f.run(`getDirectory('${s.token}')`),/SIGN_IN_REQUIRED/)});
test('logout, 90-day expiration, missing tab, malformed header and duplicate member fail closed',()=>{
 const f=fixture(),s=f.login();f.run(`signOut('${s.token}')`);assert.throws(()=>f.run(`getDirectory('${s.token}')`),/SIGN_IN_REQUIRED/);
 const g=fixture(),t=g.login();g.advance(7776000001);assert.throws(()=>g.run(`getAccessSession('${t.token}')`),/SIGN_IN_REQUIRED/);
 for(const mutate of [f=>delete f.tables.Members,f=>f.tables.Members[0][0]='Email',f=>f.tables.Members.push([...f.tables.Members[1]])]){const h=fixture(),u=h.login();mutate(h);assert.throws(()=>h.run(`getDirectory('${u.token}')`),/SIGN_IN_REQUIRED/)}
});
test('no messaging service, no public code-request API and client passes token for all data calls',()=>{
 assert(!/MailApp|GmailApp|api\.twilio/.test(source));assert(!source.includes('function requestAccessCode('));
 const html=fs.readFileSync('public/sicily-tradespeople/index.html','utf8');assert(html.includes('.getDirectory(token)'));assert(html.includes('.submitEntry(payload,requestToken)'));assert(html.includes('body class="locked"'));assert(!html.includes('<a href="#directory">Crew finder</a>'));assert(html.includes('membersOnlyReady!==true'));
});
test('client clears contact data on logout and ignores late directory responses',()=>{
 const html=fs.readFileSync('public/sicily-tradespeople/index.html','utf8');const script=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('function visibleProfiles'));
 const nodes=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],{value:'',hidden:false,innerHTML:'',textContent:'',replaceChildren(){this.innerHTML=''},reset(){},focus(){}}]));
 const classes=new Set(['locked']),queue=[],storage=new Map();
 const rpc=new Proxy({}, {get(_,key){if(key==='withSuccessHandler')return fn=>{rpc.success=fn;return rpc};if(key==='withFailureHandler')return fn=>{rpc.failure=fn;return rpc};if(key==='success'||key==='failure')return _[key];return (...args)=>queue.push({method:key,args,success:_.success,failure:_.failure})}});
 const c=vm.createContext({console,window:{google:{script:{run:rpc}}},google:{script:{run:rpc}},document:{hidden:false,getElementById:id=>nodes[id],body:{classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}},querySelectorAll:()=>[],addEventListener(){}},localStorage:{setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k),getItem:k=>storage.get(k)},setTimeout:()=>1,clearTimeout(){},setInterval(){}});
 vm.runInContext(script.slice(0,script.indexOf("options('category',")),c);
 vm.runInContext('accessOpen({phone:"+48603760320",expires:Date.now()+10000},"token")',c);
 assert(!classes.has('locked'));assert(storage.has('sicilycrew.session'));const pending=queue.find(q=>q.method==='getDirectory');assert.equal(pending.args[0],'token');
 nodes.cards.innerHTML='private contacts';nodes.profileBody.innerHTML='private details';vm.runInContext('logOut()',c);assert(classes.has('locked'));assert.equal(nodes.cards.innerHTML,'');assert.equal(nodes.profileBody.innerHTML,'');assert.equal(storage.size,0);assert(queue.some(q=>q.method==='signOut'));
 pending.success([{id:'stale',name:'Stale private data'}]);assert.equal(vm.runInContext('profiles.length',c),0);
});

test('90-day access has explicit renewal instructions and uses bounded browser timers',()=>{const html=fs.readFileSync('public/sicily-tradespeople/index.html','utf8');assert(html.includes('After 90 days, you must ask the PM on WhatsApp for a new access code.'));assert(html.includes('Your 90-day sign-in has expired. Ask the PM on WhatsApp for a new access code.'));assert(html.includes('Math.min(remaining,86400000)'));});
