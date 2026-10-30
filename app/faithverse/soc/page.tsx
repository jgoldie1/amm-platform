import type {Metadata} from 'next';
export const metadata:Metadata={title:'SOC Broadcasting Ministry | FaithVerse',description:'Servants of Christ ministry broadcasting preview and ministry partner onboarding.'};
const services=[
 ['Worship and teaching','Publish an approved service schedule, sermons and Bible lessons.'],
 ['FaithVerse connection','Link learners to Scripture study, Paleo-Hebrew Academy and personal reading.'],
 ['Broadcast studio','Authorized ministers may use TRYAMM LIVE after room and identity verification.'],
 ['Replay archive','On-demand sermon playback will require approved recordings and storage.'],
 ['Ministry support','Connect approved donation links controlled by the ministry, not TRYAMM.'],
 ['Outreach and accessibility','Mobile-ready pages, readable text, keyboard access and clear service inquiries.']
];
export default function SocMinistry(){
 return <main style={{maxWidth:1050,margin:'auto',padding:'clamp(18px,4vw,46px)',fontFamily:'system-ui',lineHeight:1.65}}>
 <a href="/faithverse">← FaithVerse</a>
 <header style={{padding:'24px 0',borderBottom:'2px solid #8a70c9'}}>
 <p style={{fontWeight:700,color:'#7453b0'}}>TRYAMM · FaithVerse Partner Ministry</p>
 <h1 style={{fontSize:'clamp(2rem,5vw,3.4rem)'}}>Servants of Christ — SOC Broadcasting Ministry</h1>
 <p>Ministry broadcasting, teaching, community outreach and a future on-demand sermon library.</p>
 <p role="status" style={{padding:14,border:'2px solid #a888bd',borderRadius:12}}>PREVIEW: No SOC public livestream, recorded archive, donations or account onboarding are activated here.</p>
 <a href="/faithverse/reader" style={{display:'inline-block',padding:14,marginRight:12,border:'1px solid #8069b0',borderRadius:10}}>Open Scripture Reader</a>
 <a href="/faithverse/live" style={{display:'inline-block',padding:14,border:'1px solid #8069b0',borderRadius:10}}>View LIVE Studio Status</a></header>
 <h2>Inside the SOC Broadcasting Mansion</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(235px,1fr))',gap:15}}>
 {services.map(([title,description])=><section key={title} style={{border:'1px solid #8a70c9',borderRadius:15,padding:20}}><h3>{title}</h3><p>{description}</p></section>)}
 </div>
 <h2>Open the network to other ministers</h2>
 <p>Church administrators and ministers can request a dedicated channel with their own approved hosts, schedule and content rights. Provisioning and payments are not automatic.</p>
 <ol><li>Confirm the ministry identity, authorized administrator and permission to publish its content.</li><li>Agree on a service tier, program rights, accessibility requirements and storage allowance.</li><li>Configure a dedicated branded channel and restrict host roles to verified individuals.</li><li>Run private camera, sound, viewer, moderation and recording tests before going public.</li><li>Publish a verified broadcast schedule and an authorized donation destination if desired.</li></ol>
 <h2>Request SOC or ministry onboarding</h2>
 <p>For now, ministry representatives can prepare an inquiry using the TRYAMM Website OS request page. This does not create an account or charge money.</p>
 <a href="/tryamm-website-os-order.html" style={{display:'inline-block',padding:'14px 22px',minHeight:48,borderRadius:10,background:'#e1d3ff',color:'#281549',fontWeight:700}}>Prepare Ministry Website Request</a>
 <p style={{marginTop:22}}>No sermon recording, retransmission, music usage, charitable or tax status, public viewing, or streaming availability is implied by this preview. Ministries retain control over their approved content and account permissions.</p>
 </main>;
}