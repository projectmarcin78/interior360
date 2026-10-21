import fs from 'node:fs/promises';
// Run from repository root after changing taxonomy or the public directory page.
const groups=JSON.parse(await fs.readFile('public/assets/services.json','utf8'));
const ids=groups.flatMap(g=>g.services.map(s=>s.id));
if(new Set(ids).size!==ids.length)throw Error('Duplicate service ID');
const data='/* SERVICE_DATA_START */\nconst SERVICE_GROUPS='+JSON.stringify(groups)+';\nconst SERVICE_IDS=SERVICE_GROUPS.flatMap(g=>g.services.map(s=>s.id));\n/* SERVICE_DATA_END */';
const pattern=/\/\* SERVICE_DATA_START \*\/[\s\S]*?\/\* SERVICE_DATA_END \*\//;
let backend=await fs.readFile('backend/Code.gs','utf8');
const towns=backend.match(/^const TOWNS=.*?;/)[0];
let html=await fs.readFile('public/sicily-tradespeople/index.html','utf8');
html=html.replace(pattern,data+'\n'+towns);
// Replace a previous generated town declaration when rerunning.
html=html.replace(/(const TOWNS=.*?;)\s*const TOWNS=.*?;/,'$1');
await fs.writeFile('public/sicily-tradespeople/index.html',html);
backend=backend.slice(0,backend.indexOf('const PAGE_HTML=')).replace(pattern,data);
let app=html.replace(/<aside class="preview-note">[\s\S]*?<\/aside>/,'').replace('<script src="./config.js"></script>','').replace('<script src="../site-version.js"></script>','').replace('<span data-site-version></span>','SicilyCrew '+(await fs.readFile('VERSION','utf8')).trim());
app=app.replaceAll('../assets/','https://projectmarcin78.github.io/interior360/assets/').replaceAll('../legal/','https://projectmarcin78.github.io/interior360/legal/');
app=app.replace("if(!window.google?.script?.run){profiles=[];render();return;}",'');
app=app.replace(/if\(!window\.google\?\.script\?\.run\)\{f\.querySelector\('\.error'\)\.textContent='Preview only\.[^']*';return;\}/,'');
app=app.slice(0,app.indexOf('const appUrl='))+'initAuth();\n</script></body></html>';
app=app.replace('Contacts are coming soon','No contacts yet').replace('Explore the services or suggest a contact using the form preview. Reviews will open with the directory.','Suggest a useful local contact to get the directory started.');
app=app.replace('Browse the services below. To suggest someone, use Add a contact in the header. Reviews will open with the directory.','Browse services or suggest someone using Add a contact in the header.');
await fs.writeFile('backend/Code.gs',backend+'const PAGE_HTML='+JSON.stringify(app)+';\n');
console.log('Synced '+groups.length+' categories and '+ids.length+' services into public and Apps Script pages.');
