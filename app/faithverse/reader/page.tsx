'use client';
import { useEffect, useState } from 'react';
type Note={id:string,reference:string,text:string,reflection:string,created:string};
const key='tryamm-faithverse-private-notes-v1';
export default function Reader(){
 const [reference,setReference]=useState('');const [text,setText]=useState('');const [reflection,setReflection]=useState('');
 const [notes,setNotes]=useState<Note[]>([]);const [message,setMessage]=useState('This is an offline-friendly personal study notebook.');
 useEffect(()=>{try{const raw=localStorage.getItem(key);if(raw){const n=JSON.parse(raw);if(Array.isArray(n))setNotes(n.filter(v=>typeof v?.reference==='string'&&typeof v?.id==='string').slice(0,100))}}catch{setMessage('Saved browser notes could not be loaded')}},[]);
 function save(){
  if(!reference.trim()||(!text.trim()&&!reflection.trim())){setMessage('Enter a passage reference and some study text or a reflection.');return}
  const entry:Note={id:crypto.randomUUID(),reference:reference.trim().slice(0,120),text:text.trim().slice(0,12000),reflection:reflection.trim().slice(0,12000),created:new Date().toISOString()};
  const next=[entry,...notes].slice(0,100);
  try{localStorage.setItem(key,JSON.stringify(next));setNotes(next);setReference('');setText('');setReflection('');setMessage('Study note saved in this browser only.')}catch{setMessage('Browser storage unavailable or full. Your note was not saved.')}
 }
 function remove(id:string){const next=notes.filter(n=>n.id!==id);try{localStorage.setItem(key,JSON.stringify(next));setNotes(next);setMessage('Note removed from this browser.')}catch{setMessage('Could not remove note.')}} 
 function exportNotes(){const data=JSON.stringify({app:'TRYAMM FaithVerse personal study',exported:new Date().toISOString(),notes},null,2);const u=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='faithverse-study-backup.json';a.click();URL.revokeObjectURL(u)}
 return <main style={{maxWidth:850,margin:'0 auto',padding:24,fontFamily:'system-ui',lineHeight:1.65}}>
  <a href="/faithverse">← FaithVerse</a><h1>Metaverse Bible — Personal Study Reader</h1>
  <p>Read a passage from a source you have permission to use, then record references and reflections. No Scripture translation is silently substituted or claimed as licensed.</p>
  <p style={{padding:14,border:'1px solid currentColor',borderRadius:10}}>Private on this device: notes are stored only in this browser. Clearing browser data or changing devices may erase them. Avoid entering confidential information. There is no account sync or publishing.</p>
  <section aria-labelledby="study-title"><h2 id="study-title">Add a study entry</h2>
   <label style={{display:'block'}}>Book, chapter and verses<input value={reference} onChange={e=>setReference(e.target.value)} maxLength={120} placeholder="Example: Genesis 1:1–5" style={{display:'block',width:'100%',minHeight:48,boxSizing:'border-box'}}/></label>
   <label style={{display:'block',marginTop:14}}>Passage text (optional; add from your own lawful source)<textarea value={text} onChange={e=>setText(e.target.value)} rows={5} maxLength={12000} style={{display:'block',width:'100%',boxSizing:'border-box'}}/></label>
   <label style={{display:'block',marginTop:14}}>My study notes<textarea value={reflection} onChange={e=>setReflection(e.target.value)} rows={5} maxLength={12000} style={{display:'block',width:'100%',boxSizing:'border-box'}}/></label>
   <button type="button" onClick={save} style={{minHeight:52,padding:'10px 20px',marginTop:14}}>Save study entry</button>
  </section><p role="status" aria-live="polite">{message}</p>
  <section aria-labelledby="saved-title"><h2 id="saved-title">My saved studies ({notes.length})</h2>
   <button type="button" disabled={!notes.length} onClick={exportNotes} style={{minHeight:48,padding:12}}>Download my notes as JSON</button>
   {notes.length===0?<p>No entries saved in this browser yet.</p>:notes.map(n=><article key={n.id} style={{border:'1px solid currentColor',borderRadius:12,padding:16,marginTop:14,overflowWrap:'anywhere'}}>
    <h3>{n.reference}</h3><p style={{whiteSpace:'pre-wrap'}}>{n.text}</p><p style={{whiteSpace:'pre-wrap'}}>{n.reflection}</p><small>{new Date(n.created).toLocaleDateString()}</small>
    <div><button type="button" onClick={()=>remove(n.id)} style={{minHeight:48,padding:12}}>Delete this entry</button></div>
   </article>)}
  </section>
  <p>FaithVerse AR/VR scenes and historical reenactments are separate planned features and are not represented as functioning here.</p>
 </main>;
}
