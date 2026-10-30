import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
const root=process.cwd();
const skipped=new Set(['.git','node_modules','.next','.env','.vercel','dist','coverage']);
const files=[];
async function walk(dir) {
  for(const item of await readdir(dir,{withFileTypes:true})) {
    if (skipped.has(item.name) || item.name.startsWith('.env')) continue;
    const abs=join(dir,item.name);
    if(item.isDirectory()) await walk(abs);
    else if(item.isFile()) {
      const bytes=await readFile(abs);
      files.push({path:relative(root,abs).replaceAll('\\','/'),sha256:createHash('sha256').update(bytes).digest('hex')});
    }
  }
}
await walk(root);
files.sort((a,b)=>a.path.localeCompare(b.path));
let commit='unknown';
try { commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(); } catch {}
await writeFile(join(root,'recovery-manifest.json'),JSON.stringify({version:1,commit,files},null,2));
console.log('Wrote manifest of '+files.length+' files. No database or storage backup was made.');
