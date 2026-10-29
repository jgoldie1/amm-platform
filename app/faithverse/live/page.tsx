'use client';
import { useEffect, useRef, useState } from 'react';
export default function BroadcastStudio(){
 const video=useRef<HTMLVideoElement>(null);
 const stream=useRef<MediaStream|null>(null);
 const [state,setState]=useState('Idle — not broadcasting');
 const [consent,setConsent]=useState(false);
 const [allowed,setAllowed]=useState(false);
 const [busy,setBusy]=useState(false);
 useEffect(()=>{fetch('/api/faithverse/live/status',{cache:'no-store'}).then(r=>r.json()).then(v=>setAllowed(v.canJoin===true)).catch(()=>setAllowed(false));return()=>{stream.current?.getTracks().forEach(t=>t.stop())}},[]);
 async function preview(){
  if(busy)return;setBusy(true);
  try{
   if(!navigator.mediaDevices?.getUserMedia)throw new Error('Camera unavailable in this browser');
   const s=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
   stream.current?.getTracks().forEach(t=>t.stop());stream.current=s;
   if(video.current){video.current.srcObject=s;await video.current.play();}
   setState('Local camera preview — not broadcasting or recording');
  }catch(e){setState(e instanceof Error?e.message:'Camera permission denied');}
  finally{setBusy(false)}
 }
 function stop(){stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;if(video.current)video.current.srcObject=null;setState('Preview stopped');}
 return <main style={{maxWidth:800,margin:'auto',padding:24,fontFamily:'system-ui',lineHeight:1.6}}>
  <a href="/faithverse">← FaithVerse</a><h1>TRYAMM LIVE Studio</h1>
  <p>Safe local preview. No publishing, recording, or broadcasting begins on this screen.</p>
  <label style={{display:'block',marginBottom:16}}><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> I understand camera and microphone access is local until a broadcast is explicitly started.</label>
  <video ref={video} muted playsInline controls={false} style={{background:'#111',width:'100%',minHeight:220,borderRadius:14}} aria-label="Local camera preview"/>
  <p role="status" aria-live="polite">{state}</p>
  <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
   <button style={{padding:14,minHeight:48}} disabled={!consent||busy} onClick={preview}>Preview camera and microphone</button>
   <button style={{padding:14,minHeight:48}} onClick={stop}>Stop camera</button>
  </div>
  <h2>Live room</h2>
  <p>{allowed?'Live service reports configured, but the studio is waiting for a verified connection and publishing flow.':'Broadcasting unavailable: server configuration or activation is missing.'}</p>
  <button disabled style={{padding:14,minHeight:48}}>Start broadcast — verification required</button>
  <h2>Recording safeguards</h2>
  <p>Recordings require explicit host and participant notice, a separately authorized Egress worker, private storage, and moderation. Nothing here starts Egress or publishes media.</p>
 </main>
}
