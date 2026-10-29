import { spawnSync } from 'node:child_process';
import { statSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
const [source,target]=process.argv.slice(2);
if(!source||!target) {
 console.error('Usage: node scripts/media/compress.mjs input.mp4 output.mp4');
 process.exit(2);
}
const input=resolve(source), output=resolve(target);
if(input===output) throw new Error('Output must differ from input: originals are preserved');
if(!['.mp4','.mov','.mkv','.webm'].includes(extname(input).toLowerCase())) throw new Error('Unsupported input extension');
if(extname(output).toLowerCase()!=='.mp4') throw new Error('Output must be .mp4');
if(!statSync(input).isFile()) throw new Error('Input is not a file');
if(existsSync(output)) throw new Error('Output exists: refusing overwrite');
mkdirSync(dirname(output),{recursive:true});
const args=['-nostdin','-hide_banner','-loglevel','error','-n','-i',input,
'-map','0:v:0','-map','0:a?','-vf','scale=w=1280:h=720:force_original_aspect_ratio=decrease',
'-c:v','libx264','-preset','medium','-crf','27','-pix_fmt','yuv420p',
'-c:a','aac','-b:a','128k','-movflags','+faststart',output];
const run=spawnSync('ffmpeg',args,{stdio:'inherit',timeout:20*60*1000});
if(run.error) throw run.error;
if(run.status!==0) process.exit(run.status||1);
console.log('Compressed copy created. Verify playback before publishing: '+output);
