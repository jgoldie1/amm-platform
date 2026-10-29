'use client';
import { useEffect, useRef, useState } from 'react';
import { Room, RoomEvent, type RemoteTrackPublication, type RemoteParticipant } from 'livekit-client';

export default function BroadcastStudio(){
 const local=useRef<HTMLVideoElement>(null);
 const remote=useRef<HTMLVideoElement>(null);
 const previewStream=useRef<MediaStream|null>(null);
 const roomRef=useRef<Room|null>(null);
 const [status,setStatus]=useState('Not connected');
 const [enabled,setEnabled]=useState(false);
 const [busy,setBusy]=useState(false);
 const [consent,setConsent]=useState(false);
 const [role,setRole]=useState<'host'|'viewer'>('viewer');
 const [roomId,setRoomId]=useState('');
 const [jwt,setJwt]=useState('');
 useEffect(()=>{let mounted=true;fetch('/api/faithverse/live/status',{cache:'no-store'}).then(r=>r.json()).then(v=>{if(mounted)setEnabled(v.canJoin===true)}).catch(()=>{});return()=>{mounted=false;previewStream.current?.getTracks().forEach(t=>t.stop());void roomRef.current?.disconnect()}},[]);
 function stopPreview(){previewStream.current?.getTracks().forEach(t=>t.stop());previewStream.current=null;if(local.current)local.current.srcObject=null;}
 async function preview(){if(busy)return;setBusy(true);try{stopPreview();const s=await navigator.mediaDevices.getUserMedia({video:true,audio:true});previewStream.current=s;if(local.current){local.current.srcObject=s;await local.current.play()}setStatus('Camera preview only; not broadcasting');}catch{setStatus('Camera or microphone access denied')}finally{setBusy(false)}}
 function attachRemote(_pub:RemoteTrackPublication,participant:RemoteParticipant){for(const publication of participant.videoTrackPublications.values()){if(publication.track&&remote.current){publication.track.attach(remote.current);return}}}
 async function join(){if(!enabled||!consent||busy||!jwt.trim()||!/^[0-9a-f-]{36}$/i.test(roomId))return;setBusy(true);
 try{
   const response=await fetch('/api/faithverse/live/token',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+jwt.trim()},body:JSON.stringify({room:roomId,role})});
   if(!response.ok)throw new Error('Room authorization denied');
   const config=await response.json();
   const instance=new Room({adaptiveStream:true,dynacast:true});
   instance.on(RoomEvent.TrackSubscribed,(track)=>{if(track.kind==='video'&&remote.current)track.attach(remote.current);if(track.kind==='audio')track.attach()});
   instance.on(RoomEvent.ParticipantConnected,(participant)=>attachRemote({} as RemoteTrackPublication,participant));
   instance.on(RoomEvent.Disconnected,()=>setStatus('Disconnected from room'));
   await instance.connect(config.url,config.token,{autoSubscribe:true});
   roomRef.current=instance;
   if(role==='host'){stopPreview();await instance.localParticipant.enableCameraAndMicrophone();}
   setStatus(role==='host'?'Broadcast connected — camera and microphone publishing':'Viewer connected — receiving only');
 }catch(e){await roomRef.current?.disconnect();roomRef.current=null;setStatus(e instanceof Error?e.message:'Connection failed')}finally{setBusy(false)}}
 async function leave(){setBusy(true);try{await roomRef.current?.disconnect();roomRef.current=null;stopPreview();setStatus('Broadcast stopped and devices released')}finally{setBusy(false)}}
 return <main style={{maxWidth:800,margin:'auto',padding:24,fontFamily:'system-ui',lineHeight:1.6}}>
 <a href="/faithverse">← FaithVerse</a><h1>TRYAMM LIVE Studio</h1>
 <p>Live rooms are disabled unless the server authorizes them. Recording and replay publication are separate.</p>
 <label><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> I consent to camera/microphone use when hosting and understand this can transmit live to room viewers.</label>
 <video ref={local} muted playsInline style={{background:'#111',width:'100%',minHeight:180,marginTop:12}} aria-label="Local preview"/>
 <div style={{display:'flex',gap:12,flexWrap:'wrap'}}><button style={{minHeight:48,padding:12}} disabled={busy} onClick={preview}>Preview camera</button><button style={{minHeight:48,padding:12}} onClick={stopPreview}>Stop preview</button></div>
 <h2>Connect to broadcast room</h2><p>{enabled?'Server reports LIVE configured':'Live service disabled: credentials or activation missing'}</p>
 <label style={{display:'block'}}>Room ID <input value={roomId} onChange={e=>setRoomId(e.target.value)} placeholder="Approved room UUID" autoComplete="off"/></label>
 <label style={{display:'block'}}>Your Supabase session access token <input type="password" value={jwt} onChange={e=>setJwt(e.target.value)} placeholder="Session token" autoComplete="off"/></label>
 <label style={{display:'block'}}>Role <select value={role} onChange={e=>setRole(e.target.value as 'host'|'viewer')}><option value="viewer">Viewer</option><option value="host">Host (requires approval)</option></select></label>
 <button style={{minHeight:48,padding:12}} disabled={!enabled||!consent||!jwt||busy} onClick={join}>Connect to room</button>
 <button style={{minHeight:48,padding:12}} onClick={leave}>Disconnect and stop</button>
 <video ref={remote} autoPlay playsInline style={{background:'#111',width:'100%',minHeight:180,marginTop:12}} aria-label="Remote broadcast"/>
 <p role="status" aria-live="polite">{status}</p>
 <p>Recording requires separate, consent-based Egress setup. Never share your access token or stream keys.</p></main>;
}
