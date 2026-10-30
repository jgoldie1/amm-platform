'use client';
import {useState} from 'react';
const locations=[
 {title:'Scripture Library',details:'Choose a rights-cleared text and keep personal study notes.',href:'/faithverse/reader',action:'Open personal reader'},
 {title:'Paleo-Hebrew Academy',details:'Visit the introductory letter lesson and explore historic letterforms.',href:'/faithverse/academy',action:'Start introductory lesson'},
 {title:'Broadcast Hall',details:'Visit the authorized studio. Public broadcasts require server configuration and approval.',href:'/faithverse/live',action:'Open LIVE studio'}
];
export default function World(){
 const [index,setIndex]=useState(0);const s=locations[index];
 return <main style={{maxWidth:900,margin:'auto',padding:24,fontFamily:'system-ui',lineHeight:1.7}}>
 <a href="/faithverse">← FaithVerse</a><h1>Metaverse Bible — Accessible World Preview</h1>
 <p>This is an interactive 2D location navigator, not a verified AR or VR simulation. It works without a headset, motion tracking or paid graphics services.</p>
 <div aria-label="FaithVerse location" style={{padding:28,borderRadius:20,border:'2px solid #8261c9',background:'linear-gradient(130deg,#241c48,#102e3c)',color:'white',minHeight:210}}>
 <p>FaithVerse location {index+1} of {locations.length}</p><h2>{s.title}</h2><p>{s.details}</p><a href={s.href} style={{display:'inline-block',minHeight:48,padding:12,background:'#e6d2ff',color:'#21143a',borderRadius:10}}>{s.action}</a>
 </div><div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:16}}>
 <button type="button" disabled={index===0} onClick={()=>setIndex(v=>v-1)} style={{minHeight:52,padding:12}}>Previous location</button>
 <button type="button" disabled={index===locations.length-1} onClick={()=>setIndex(v=>v+1)} style={{minHeight:52,padding:12}}>Next location</button>
 </div><p>Optional 3D, WebXR headset access, period environments and avatar movement are future phases. Historical reconstructions will be labeled interpretations and screened for accuracy and content rights.</p>
 </main>
}