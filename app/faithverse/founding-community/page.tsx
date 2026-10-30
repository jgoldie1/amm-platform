'use client';
import {useState} from 'react';
type Path='believer'|'minister'|'volunteer';
const programs=[
 ['House of Ha Maschianh','Sabbath fellowship, Scripture study, founding-community invitations'],
 ['Bible Academy','Introductory Paleo-Hebrew lessons, personal study notes and historical learning'],
 ['Broadcasting Ministry','Private host/viewer rehearsals and future approved live teaching'],
 ['Technology Ministry','Help with website setup, accessible media, captions and digital training']
];
export default function FoundingCommunity(){
 const [path,setPath]=useState<Path>('believer');const [name,setName]=useState('');const [contact,setContact]=useState('');const [ministry,setMinistry]=useState('');const [need,setNeed]=useState('');const [draft,setDraft]=useState('');const [status,setStatus]=useState('');
 function prepare(){if(!name.trim()||!/^\S+@\S+\.\S+$/.test(contact)){setStatus('Enter your name and a valid email address.');return;}const msg=['FaithVerse founding community — '+path,'Name: '+name.trim().slice(0,100),'Email: '+contact.trim().slice(0,180),path==='minister'?'Ministry: '+ministry.trim().slice(0,120):'', 'Interest: '+need.trim().slice(0,600),'Please contact me about approved opportunities and next steps. This form did not submit or create an account.'].filter(Boolean).join('\n');setDraft(msg);setStatus('Request prepared. Copy it and send it through a verified TRYAMM contact channel. No data was transmitted.');}
 return <main style={{maxWidth:940,margin:'auto',padding:'clamp(20px,5vw,52px)',fontFamily:'system-ui',lineHeight:1.65}}>
 <a href="/faithverse">← FaithVerse</a><header style={{padding:24,borderRadius:18,background:'linear-gradient(120deg,#21163f,#153c45)',color:'white'}}>
 <p>TRYAMM LLC presents • Coming soon</p><h1>FaithVerse Founding Believers &amp; Ministry Support</h1>
 <p>House of Ha Maschianh welcomes believers, ministers and technology volunteers. FaithVerse provides accessible Scripture resources and is developing responsible broadcast services.</p></header>
 <h2>Four founding programs</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:12}}>
 {programs.map(([n,d])=><section key={n} style={{border:'1px solid currentColor',borderRadius:12,padding:16}}><h3>{n}</h3><p>{d}</p></section>)}</div>
 <h2>How we can assist other ministers</h2><p>Free initial ministry introduction and directory consideration; $499 standard TRYAMM website preview where appropriate; optional training, approved content publishing and broadcasting setup quoted separately after testing. Each minister retains their name, teaching materials, audience and accounts; no automatic affiliation or ownership transfer.</p>
 <p>Public LIVE, cloud recording, payments and donations are not currently active here. Ministry participation is voluntary and does not require payment.</p>
 <h2>Prepare an interest request</h2>
 <form onSubmit={e=>{e.preventDefault();prepare()}}>
 <fieldset style={{padding:14,borderRadius:12}}><legend>I am joining as</legend>
 {([['believer','Founding believer'],['minister','Minister requesting support'],['volunteer','Technology or ministry volunteer']] as const).map(([value,label])=><label key={value} style={{display:'block',padding:8}}><input type="radio" checked={path===value} onChange={()=>{setPath(value);setDraft('')}}/> {label}</label>)}</fieldset>
 <label style={{display:'block',marginTop:12}}>Name <input required value={name} maxLength={100} onChange={e=>setName(e.target.value)} style={{display:'block',width:'100%',minHeight:48}}/></label>
 <label style={{display:'block',marginTop:12}}>Email <input required type="email" value={contact} maxLength={180} onChange={e=>setContact(e.target.value)} style={{display:'block',width:'100%',minHeight:48}}/></label>
 {path==='minister'&&<label style={{display:'block',marginTop:12}}>Ministry name (optional) <input value={ministry} maxLength={120} onChange={e=>setMinistry(e.target.value)} style={{display:'block',width:'100%',minHeight:48}}/></label>}
 <label style={{display:'block',marginTop:12}}>What would you like help with? (optional) <textarea value={need} maxLength={600} rows={4} onChange={e=>setNeed(e.target.value)} style={{display:'block',width:'100%'}}/></label>
 <button type="submit" style={{padding:'14px 20px',minHeight:52,marginTop:14}}>Prepare request</button>
 </form>
 <p role="status" aria-live="polite">{status}</p>
 {draft&&<section><h3>Your request — copy to send</h3><textarea aria-label="Prepared ministry request" readOnly value={draft} rows={9} style={{width:'100%'}}/><p>Only send this message to an independently verified official TRYAMM contact. We do not collect it through this page.</p></section>}
 <h2>Our commitments</h2><p>No pay-to-join requirement, no promises of tax-deductible contributions, accessible 2D learning, appropriate moderation, rights-cleared content, ministry-owned accounts, and no unlicensed security or law-enforcement claims.</p>
 </main>;
}