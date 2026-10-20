import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const version=(await fs.readFile('VERSION','utf8')).trim();
if(!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version))throw Error('Invalid VERSION: expected MAJOR.MINOR.PATCH');
const changelog=await fs.readFile('CHANGELOG.md','utf8');
const marker='## ['+version+'] - ';
const headings=changelog.split('\n').filter(line=>line.startsWith(marker));
if(headings.length!==1||!/^\d{4}-\d{2}-\d{2}$/.test(headings[0].slice(marker.length)))throw Error('Add exactly one dated changelog heading for '+version);
const notes=changelog.split(headings[0]+'\n')[1].split('\n## ')[0].trim();
if(!notes)throw Error('Release notes cannot be empty');
let commit=process.env.GITHUB_SHA||'';
if(!commit){try{commit=execFileSync('git',['rev-parse','HEAD'],{stdio:['ignore','pipe','ignore']}).toString().trim()}catch{commit='local'}}
const metadata={version,commit};
await fs.writeFile('public/version.json',JSON.stringify(metadata,null,2)+'\n');
const script='('+function(info){document.querySelectorAll('[data-site-version]').forEach(el=>{el.textContent='v'+info.version;el.title='Build: '+info.commit})}.toString()+')('+JSON.stringify(metadata)+');\n';
await fs.writeFile('public/site-version.js',script);
await fs.writeFile('release-notes.generated.md',notes+'\n');
console.log('Validated '+version+'; generated version display, metadata and notes.');
