import {readFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve,join,basename,extname} from 'node:path';
const [manifest,outdir]=process.argv.slice(2);
if(!manifest||!outdir)throw Error('Usage: node scripts/media/batch-compress.mjs manifest.json output-dir');
const jobs=JSON.parse(await readFile(resolve(manifest),'utf8'));
if(!Array.isArray(jobs)||jobs.length>25||jobs.some(x=>typeof x!=='string'))throw Error('Expected array of <=25 input paths');
await mkdir(resolve(outdir),{recursive:true});
for(const [i,src] of jobs.entries()){
 const input=resolve(src), output=join(resolve(outdir),String(i+1).padStart(3,'0')+'-'+basename(src,extname(src))+'.mp4');
 const child=spawnSync(process.execPath,['scripts/media/compress.mjs',input,output],{stdio:'inherit',timeout:25*60*1000});
 if(child.status!==0)throw Error('Compression failed at item '+(i+1)+'; remaining items stopped');
}
console.log('Batch completed; review playback before publishing');
