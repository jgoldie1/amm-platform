'use client';
import {useEffect,useRef,useState} from 'react';
export default function LocalRecording(){
 const stream=useRef<MediaStream|null>(null),recorder=useRef<MediaRecorder|null>(null),parts=useRef<Blob[]>([]),link=useRef<string|null>(null);
 const video=useRef<HTMLVideoElement>(null);const [status,setStatus]=useState('Camera and microphone are off.');const [recording,setRecording]=useState(false);const [download,setDownload]=useState('');
 function stopDevices(){stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;if(video.current)video.current.srcObject=null;}
 function clearDownload(){if(link.current){URL.revokeObjectURL(link.current);link.current=null;}setDownload('');}
 useEffect(()=>()=>{if(recorder.current?.state==='recording')recorder.current.stop();stopDevices();if(link.current)URL.revokeObjectURL(link.current);},[]);
 async function preview(){if(recording)return;stopDevices();try{if(!navigator.mediaDevices?.getUserMedia)throw Error('Camera capture is unavailable on this device or insecure connection.');const s=await navigator.mediaDevices.getUserMedia({audio:true,video:true});stream.current=s;if(video.current){video.current.srcObject=s;await video.current.play()}setStatus('Local preview only. Nothing is being broadcast.')}catch(e){stopDevices();setStatus(e instanceof Error?e.message:'Unable to access camera or microphone.');}}
 function start(){if(!stream.current||recording)return;if(typeof MediaRecorder==='undefined'){setStatus('Recording is not supported in this browser.');return;}clearDownload();try{const options=MediaRecorder.isTypeSupported('video/webm')?{mimeType:'video/webm'}:undefined;const r=new MediaRecorder(stream.current,options);recorder.current=r;parts.current=[];r.ondataavailable=e=>{if(e.data.size)parts.current.push(e.data)};r.onerror=()=>setStatus('Recording failed; try another browser.');r.onstop=()=>{setRecording(false);if(parts.current.length){const blob=new Blob(parts.current,{type:r.mimeType||'video/webm'});link.current=URL.createObjectURL(blob);setDownload(link.current);setStatus('Recording stopped. Download locally before leaving this page.')}else setStatus('Nothing recorded.');stopDevices();};r.start(1000);setRecording(true);setStatus('Recording locally. No file is uploaded or streamed.')}catch{setStatus('Could not begin local recording.')}}
 function stop(){if(recorder.current?.state==='recording')recorder.current.stop();else stopDevices();}
 return <main style={{maxWidth:800,margin:'auto',padding:24,fontFamily:'system-ui',lineHeight:1.6}}>
 <a href="/faithverse">← FaithVerse</a><h1>FaithVerse — Local Recording Lab</h1>
 <p>Record a personal lesson to your device with explicit camera and microphone permission. This is NOT broadcasting, cloud recording, an archive, or automated replay distribution.</p>
 <video ref={video} muted playsInline aria-label="Local camera preview" style={{width:'100%',background:'#151515',minHeight:180}} />
 <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:12}}>
 <button type="button" disabled={recording} onClick={preview} style={{minHeight:52,padding:12}}>Enable local preview</button>
 <button type="button" disabled={!stream.current||recording} onClick={start} style={{minHeight:52,padding:12}}>Start local recording</button>
 <button type="button" onClick={stop} style={{minHeight:52,padding:12}}>Stop recording and devices</button>
 </div><p role="status" aria-live="polite">{status}</p>
 {download&&<p><a href={download} download={'faithverse-local-recording-'+Date.now()+'.webm'}>Download my recording (WebM)</a></p>}
 <p>Browser support, storage availability and file playback vary. No upload, persistence, moderation or replay platform is connected.</p></main>
}