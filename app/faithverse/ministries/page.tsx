'use client';
import {useState} from 'react';
const offerings=[
 {title:'Free Ministry Directory',price:'Free',features:'Ministry profile, public contact information and approved links'},
 {title:'Ministry Website',price:'From $499 one-time',features:'Mobile-friendly ministry landing page, ministry-approved copy, event information and one promotional reel (scope confirmed before purchase)'},
 {title:'SOC Broadcast Pilot',price:'Custom quote',features:'Authorized host onboarding, moderated event page and a private host/viewer rehearsal once LIVE infrastructure is ready'},
 {title:'Ministry Media Care',price:'Custom monthly quote',features:'Optional media publishing and technical support; storage, bandwidth, recording and moderation costs disclosed'}
];
export default function MinistryPartner(){
 const [ministry,setMinistry]=useState('');const [email,setEmail]=useState('');const [goal,setGoal]=useState('Website and program schedule');
 const [request,setRequest]=useState('');
 function prepare(){if(!ministry.trim()||!email.trim()||!/^\S+@\S+\.\S+$/.test(email))return;
 setRequest('TRYAMM FaithVerse ministry partnership inquiry\nMinistry: '+ministry.trim()+'\nReply email: '+email.trim()+'\nRequested service: '+goal+'\nPlease contact us about a scope, permissions and onboarding. No purchase or broadcast is activated.');}
 return <main style={{maxWidth:920,margin:'auto',padding:24,fontFamily:'system-ui',lineHeight:1.6}}>
 <a href="/faithverse">← FaithVerse</a><h1>FaithVerse Ministry Broadcasting Network</h1>
 <p>Invite your ministry to teach, publish approved programming and reach viewers through a future authorized TRYAMM LIVE network. Servants of Christ (SOC) is the proposed first pilot—not a currently activated station.</p>
 <p style={{border:'1px solid currentColor',padding:16,borderRadius:12}}>Public broadcasting, archives, donations, ticketing and paid subscriptions are NOT currently connected here. The LIVE provider must be configured, host permissions approved and rehearsals passed before any on-air announcement.</p>
 <h2>Ministry membership and service options</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(235px,1fr))',gap:12}}>
 {offerings.map(o=><section key={o.title} style={{border:'1px solid currentColor',borderRadius:12,padding:18}}><h3>{o.title}</h3><p><strong>{o.price}</strong></p><p>{o.features}</p></section>)}</div>
 <h2>Servants of Christ (SOC) pilot</h2>
 <ol><li>Confirm authorized ministry owner, designated broadcast host and public ministry contact.</li><li>Obtain written rights to video, music, artwork and guest appearances; establish safeguarding and moderation.</li><li>Launch a free ministry page with service schedule and approved links.</li><li>Test camera preview, authenticated host/viewer, network quality and accessibility in a private room.</li><li>After successful tests, explicitly approve live broadcasts and viewer access.</li><li>Consider recording, replay and donor support only after rights, storage, access and payment arrangements are implemented.</li></ol>
 <h2>Prepare a ministry inquiry</h2><p>This form works locally and does not send or store personal information.</p>
 <form onSubmit={e=>{e.preventDefault();prepare()}}>
 <label style={{display:'block'}}>Ministry name<input required maxLength={120} value={ministry} onChange={e=>setMinistry(e.target.value)} style={{display:'block',width:'100%',minHeight:48}}/></label>
 <label style={{display:'block',marginTop:14}}>Contact email<input required type="email" maxLength={200} value={email} onChange={e=>setEmail(e.target.value)} style={{display:'block',width:'100%',minHeight:48}}/></label>
 <label style={{display:'block',marginTop:14}}>First goal<select value={goal} onChange={e=>setGoal(e.target.value)} style={{display:'block',width:'100%',minHeight:48}}><option>Website and program schedule</option><option>SOC broadcasting pilot</option><option>Existing video library publishing</option><option>Ministry website and media care</option></select></label>
 <button type="submit" style={{minHeight:52,padding:'12px 18px',marginTop:16}}>Prepare ministry request</button>
 </form>
 {request&&<section aria-live="polite"><h3>Copy this request</h3><textarea value={request} readOnly rows={8} aria-label="Ministry inquiry text" style={{width:'100%',maxWidth:780}}/><p>Copy it into an email to TRYAMM. Submission and delivery are not yet connected.</p></section>}
 <p>Important: ministry profiles and streaming belong to their own authorized organizations; TRYAMM may provide technical services, not ownership of a ministry's copyrighted content, contributions or private member data.</p>
 </main>;
}