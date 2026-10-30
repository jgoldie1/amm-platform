'use client';
import {useState} from 'react';
const pathways=[
 {title:'Founding Believers',detail:'Join introductory online gatherings and ministry announcements.'},
 {title:'Scripture Study',detail:'Start with the FaithVerse reader and introductory study lessons.'},
 {title:'Ministry Volunteers',detail:'Help with welcoming, accessibility, teaching support and moderation.'},
 {title:'Media & Technology',detail:'Support authorized filming, broadcast testing, captions and secure operations.'}
];
export default function HouseOfHaMaschianh(){
 const [name,setName]=useState('');const [email,setEmail]=useState('');const [interest,setInterest]=useState('Founding Believers');const [draft,setDraft]=useState('');
 function prepare(){setDraft('House of Ha Maschianh founding community interest\nName: '+name.trim()+'\nEmail: '+email.trim()+'\nInterest: '+interest+'\nPlease send verified launch and fellowship details. No contribution or account was created.');}
 return <main style={{maxWidth:960,margin:'auto',padding:'clamp(20px,5vw,56px)',fontFamily:'system-ui',lineHeight:1.65}}>
 <a href="/faithverse">← FaithVerse</a>
 <header style={{padding:'28px 22px',border:'2px solid #9d89d8',borderRadius:18,background:'linear-gradient(130deg,#231843,#10343c)',color:'#fff'}}>
 <p style={{textTransform:'uppercase',letterSpacing:2}}>Founding community • Coming soon</p>
 <h1 style={{fontSize:'clamp(2rem,5vw,3.5rem)',marginBottom:12}}>House of Ha Maschianh</h1>
 <p>Scripture • Fellowship • Learning • Responsible broadcasting</p>
 <p>Join our founding community and help shape an accessible ministry powered by FaithVerse.</p>
 </header>
 <h2>Find your place in the ministry</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
 {pathways.map(p=><section key={p.title} style={{border:'1px solid currentColor',padding:18,borderRadius:14}}><h3>{p.title}</h3><p>{p.detail}</p></section>)}</div>
 <h2>Ministry technology</h2>
 <p>Our <a href="/faithverse/reader">Scripture study notebook</a>, <a href="/faithverse/academy">introductory Paleo-Hebrew academy</a> and <a href="/faithverse/world">accessible Bible world navigator</a> are available as development implementations. LIVE teaching requires secure broadcast configuration and successful testing; no public livestream is claimed here.</p>
 <h2>Prepare a founding community inquiry</h2>
 <p>This form prepares text locally for you to copy; it does not transmit or store a registration. Do not enter sensitive information.</p>
 <form onSubmit={e=>{e.preventDefault();prepare()}}>
 <label style={{display:'block',marginBottom:12}}>Name<input required maxLength={100} value={name} onChange={e=>setName(e.target.value)} style={{display:'block',width:'100%',minHeight:48}}/></label>
 <label style={{display:'block',marginBottom:12}}>Email<input required type="email" maxLength={180} value={email} onChange={e=>setEmail(e.target.value)} style={{display:'block',width:'100%',minHeight:48}}/></label>
 <label style={{display:'block'}}>Interest<select value={interest} onChange={e=>setInterest(e.target.value)} style={{display:'block',width:'100%',minHeight:48}}>{pathways.map(p=><option key={p.title} value={p.title}>{p.title}</option>)}</select></label>
 <button type="submit" style={{minHeight:52,padding:'12px 18px',marginTop:14}}>Prepare my invitation response</button>
 </form>
 {draft&&<section aria-live="polite"><h3>Copy your inquiry</h3><textarea readOnly value={draft} rows={7} style={{width:'100%'}}/><p>Copy and send using a separately confirmed ministry contact channel.</p></section>}
 <h2>Broadcasting commitments</h2><p>Authorized ministry hosts only, consent for guests and recorded content, clear community conduct, accessible captions wherever practical, separate ministry accounts, and no undisclosed donation fees. A technology minister can manage the studio while ministry leadership approves content and access.</p>
 <p>Tax-exempt status, donation deductibility, public streaming, recordings and ministry registration have not been verified or activated by this page.</p>
 </main>;
}