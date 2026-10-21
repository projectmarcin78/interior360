import fs from 'node:fs/promises';
const version=(await fs.readFile('VERSION','utf8')).trim();
const tag='v'+version,commit=process.env.GITHUB_SHA,repo=process.env.GITHUB_REPOSITORY,token=process.env.GH_TOKEN;
if(!commit||!repo||!token)throw Error('Run inside the release workflow');
const api=async(path,method='GET',body)=>{const response=await fetch('https://api.github.com/repos/'+repo+path,{method,headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},...(body?{body:JSON.stringify(body)}:{})});if(response.status===404&&method==='GET')return null;if(!response.ok)throw Error('GitHub API '+method+' '+path+': '+response.status);return response.json()};
const ref=await api('/git/ref/tags/'+tag);
if(ref){if(ref.object.type!=='commit'||ref.object.sha!==commit)throw Error('Version '+tag+' points to another commit; increment VERSION');}
else await api('/git/refs','POST',{ref:'refs/tags/'+tag,sha:commit});
const existing=await api('/releases/tags/'+tag);
if(existing)console.log('Release already exists: '+existing.html_url);
else {const release=await api('/releases','POST',{tag_name:tag,target_commitish:commit,name:'SicilyCrew '+tag,body:await fs.readFile('release-notes.generated.md','utf8'),draft:false,prerelease:false});console.log('Published '+release.html_url);}
