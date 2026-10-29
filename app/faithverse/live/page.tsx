'use client';
import { useEffect, useRef, useState } from 'react';
import { Room, RoomEvent, Track, type RemoteTrack, type RemoteTrackPublication } from 'livekit-client';

const roomPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const projectRef='fxluchtdfpediivhoksl';
function storedSessionToken():string|null {
  try {
    const stored=window.localStorage.getItem('sb-'+projectRef+'-auth-token');
    if(!stored)return null;
    const session=JSON.parse(stored);
    if(typeof session?.access_token!=='string'||!session.access_token)return null;
    if(typeof session.expires_at==='number'&&session.expires_at<=Date.now()/1000+30)return null;
    return session.access_token;
  }catch{return null;}
}
export default function BroadcastStudio(){
 const previewEl=useRef<HTMLVideoElement>(null);
 const remoteVideoEl=useRef<HTMLDivElement>(null);
 const remoteAudioEl=useRef<HTMLDivElement>(null);
 const previewRef=useRef<MediaStream|null>(null);
 const roomRef=useRef<Room|null>(null);
 const [status,setStatus]=useState('Not connected');
 const [enabled,setEnabled]=useState(false);
 const [busy,setBusy]=useState(false);
 const [connected,setConnected]=useState(false);
 const [consent,setConsent]=useState(false);
 const [role,setRole]=useState<'host'|'viewer'>('viewer');
 const [roomId,setRoomId]=useState('');
 function releasePreview(){previewRef.current?.getTracks().forEach(t=>t.stop());previewRef.current=null;if(previewEl.current)previewEl.current.srcObject=null;}
 function clearRemote(){remoteVideoEl.current?.replaceChildren();remoteAudioEl.current?.replaceChildren();}
 useEffect(()=>{
  let mounted=true;
  fetch('/api/faithverse/live/status',{cache:'no-store'}).then(r=>r.json()).then(v=>{if(mounted)setEnabled(v.canJoin===true)}).catch(()=>{});
  return()=>{mounted=false;previewRef.current?.getTracks().forEach(t=>t.stop());void roomRef.current?.disconnect()};
 },[]);
 async function preview(){
  if(busy||connected)return;setBusy(true);
  try{releasePreview();const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true});previewRef.current=stream;if(previewEl.current){previewEl.current.srcObject=stream;await previewEl.current.play()}setStatus('Local preview; not broadcasting')}
  catch{releasePreview();setStatus('Camera or microphone permission denied')}
  finally{setBusy(false)}
 }
 function onTrack(track:RemoteTrack,_publication:RemoteTrackPublication){
  const target=track.kind===Track.Kind.Video?remoteVideoEl.current:remoteAudioEl.current;
  if(!target)return;
  const el=track.attach();
  if(el instanceof HTMLMediaElement){el.autoplay=true;if(track.kind===Track.Kind.Video)el.setAttribute('playsinline','true');target.appendChild(el)}
 }
 async function disconnect(){
  const room=roomRef.current;roomRef.current=null;
  if(room)await room.disconnect();
  releasePreview();clearRemote();setConnected(false);setStatus('Disconnected; camera and microphone stopped');
 }
 async function join(){
  if(!enabled||!consent||busy||connected||!roomPattern.test(roomId))return;
  setBusy(true);setStatus('Authenticating...');
  let pending:Room|null=null;
  try{
   const session=storedSessionToken();
   if(!session)throw new Error('Sign in to TRYAMM first. Session unavailable or expired.');
   const response=await fetch('/api/faithverse/live/token',{
    method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+session},
    body:JSON.stringify({room:roomId,role}),cache:'no-store'
   });
   if(!response.ok)throw new Error('Room access denied or LIVE is unavailable');
   const config=await response.json();
   pending=new Room({adaptiveStream:true,dynacast:true});
   const room=pending;
   room.on(RoomEvent.TrackSubscribed,onTrack);
   room.on(RoomEvent.TrackUnsubscribed,track=>{track.detach().forEach(el=>el.remove())});
   room.on(RoomEvent.Disconnected,()=>{if(roomRef.current===room){roomRef.current=null;setConnected(false);clearRemote();setStatus('Broadcast disconnected')}});
   await room.connect(config.url,config.token,{autoSubscribe:true});
   roomRef.current=room;
   for(const participant of room.remoteParticipants.values()){
    for(const publication of participant.trackPublications.values()){
     if(publication.track&&publication.isSubscribed)onTrack(publication.track,publication);
    }
   }
   if(role==='host'){releasePreview();await room.localParticipant.enableCameraAndMicrophone()}
   setConnected(true);setStatus(role==='host'?'Live: publishing camera and microphone':'Live: viewer connected');
  }catch(e){
   if(pending)await pending.disconnect().catch(()=>{});
   if(roomRef.current===pending)roomRef.current=null;
   releasePreview();clearRemote();setConnected(false);
   setStatus(e instanceof Error?e.message:'Could not connect');
  }finally{setBusy(false)}
 }
 async function leave(){if(busy)return;setBusy(true);try{await disconnect()}finally{setBusy(false)}}
 return <main style={{maxWidth:800,margin:'auto',padding:24,fontFamily:'system-ui',lineHeight:1.6}}>
  <a href="/faithverse">← FaithVerse</a>
  <h1>TRYAMM LIVE Studio</h1>
  <p>Host or watch an authorized live room. Recording and distribution are not enabled.</p>
  <label style={{display:'block',marginBottom:12}}><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> I understand that hosting broadcasts my camera and microphone to room participants.</label>
  <video ref={previewEl} muted playsInline aria-label="Local camera preview" style={{width:'100%',minHeight:180,background:'#111'}}/>
  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
   <button disabled={busy||connected} onClick={preview} style={{minHeight:48,padding:12}}>Preview camera</button>
   <button onClick={releasePreview} disabled={connected} style={{minHeight:48,padding:12}}>Stop preview</button>
  </div>
  <h2>Connect</h2>
  <p>{enabled?'LIVE is configured on the server':'LIVE is disabled until server setup and testing are complete'}</p>
  <label style={{display:'block'}}>Approved room UUID <input value={roomId} disabled={connected} onChange={e=>setRoomId(e.target.value)} autoComplete="off" style={{width:'100%',minHeight:44}}/></label>
  <label style={{display:'block'}}>Your role <select disabled={connected} value={role} onChange={e=>setRole(e.target.value as 'host'|'viewer')} style={{minHeight:44}}><option value="viewer">Viewer</option><option value="host">Host (approval required)</option></select></label>
  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}>
   <button onClick={join} disabled={!enabled||!consent||busy||connected||!roomPattern.test(roomId)} style={{minHeight:48,padding:12}}>Join LIVE</button>
   <button onClick={leave} disabled={busy||!connected} style={{minHeight:48,padding:12}}>Leave and stop devices</button>
  </div>
  <div ref={remoteVideoEl} aria-label="Remote video feeds"/>
  <div ref={remoteAudioEl} aria-label="Remote audio feeds"/>
  <p role="status" aria-live="polite">{status}</p>
  <p>Camera and microphone permissions are controlled by your browser. Recording requires additional explicit consent and a separately approved service.</p>
 </main>;
}
