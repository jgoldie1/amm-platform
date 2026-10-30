'use client';
import {useState} from 'react';
export default function ZionProposal(){
 const [draft,setDraft]=useState('');
 return <main style={{maxWidth:850,margin:'auto',padding:24,fontFamily:'system-ui',lineHeight:1.6}}>
 <a href="/faithverse/ministries">← Ministry network</a><h1>Daughter of Zion — Ministry Website Proposal</h1>
 <p>Private planning preview only. The creator's identity, TikTok username, account ownership, consent, teaching materials and ministry affiliation must be confirmed before public advertising or publishing.</p>
 <div style={{border:'1px solid currentColor',borderRadius:14,padding:20,background:'linear-gradient(140deg,#251b4b,#12383f)',color:'#fff'}}>
 <h2>Faith • Teaching • Community</h2><p>A proposed mobile-first site bringing short-form teaching audiences into a ministry-owned home for approved recordings, event schedules and follower inquiries.</p></div>
 <h2>Proposed features</h2><ul>
 <li>TikTok profile link after verified account approval — no unauthorized embedding or scraping.</li>
 <li>Original ministry introduction, approved video clips and accessible captions.</li>
 <li>Calendar for teachings and gatherings once dates are confirmed.</li>
 <li>Free FaithVerse Scripture study access and optional online ministry directory listing.</li>
 <li>Privacy-respecting contact and partnership inquiry once destination is verified.</li>
 </ul>
 <h2>Website offers</h2><p>TRYAMM Preview: $499 one-time (approved standard website package). Ministry broadcast integrations require a separate written quote and completed provider tests. No subscription, discount, donation page or guaranteed livestream is activated.</p>
 <button type="button" onClick={()=>setDraft('Shabbat Shalom! I would love to introduce a possible Daughter of Zion ministry website through TRYAMM FaithVerse. We can create a mobile-friendly home for your approved TikTok videos, Scripture teaching, events and community, starting with a $499 website preview package. This is an invitation, not an existing partnership. Would you be interested in reviewing a private preview?')} style={{minHeight:52,padding:12}}>Prepare respectful invitation</button>
 {draft&&<section aria-live="polite"><h3>Copy and send after verifying the recipient</h3><textarea readOnly rows={7} value={draft} style={{width:'100%',padding:12}}/></section>}
 </main>;
}