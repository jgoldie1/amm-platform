import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FaithVerse | TRYAMM',
  description: 'Accessible Scripture learning, Paleo-Hebrew Academy, and historical exploration.',
};

const spaces = [
  ['Scripture Library', 'Read and compare rights-cleared Scripture and research texts.'],
  ["Strong's Research Desk", 'Study source-language words and verse references.'],
  ['Paleo-Hebrew Academy', 'Learn ancient letter forms and explore reviewed lessons.'],
  ['Kingdom HoloPress', 'Explore original workbooks and future printed editions.'],
  ['Time Machine + Holo Lab', 'Research historical contexts in simulated environments.'],
  ['AR / VR / Mixed Reality', 'Optional immersive modes with accessible 2D alternatives.'],
];

export default function FaithVersePage() {
  const configured = process.env.FAITHVERSE_PUBLIC_URL || '';
  let launchUrl: string | null = null;
  try {
    const url = new URL(configured);
    if (url.protocol === 'https:' && !url.username && !url.password) launchUrl = url.href;
  } catch {
    // An unconfigured destination must not redirect users or enable purchases.
  }
  return (
    <main id="main" style={{maxWidth:1000,margin:'0 auto',padding:'clamp(20px,5vw,64px)',fontFamily:'system-ui',lineHeight:1.6}}>
      <a href="/" style={{display:'inline-block',marginBottom:24}}>← TRYAMM Gateway</a>
      <h1 style={{fontSize:'clamp(2rem,5vw,3.5rem)'}}>FaithVerse</h1>
      <p>Metaverse Bible • Scripture Research • Paleo-Hebrew Academy</p>
      <p style={{maxWidth:720}}>A learning destination in the TRYAMM Super App. This entry is isolated from StreetVerse and does not process payments.</p>
      {launchUrl ? (
        <p><a href={launchUrl} rel="noopener noreferrer" style={{display:'inline-block',padding:'14px 20px',border:'2px solid currentColor',borderRadius:12}}>Open FaithVerse Reader</a></p>
      ) : (
        <p role="status" style={{padding:16,border:'1px solid currentColor',borderRadius:12}}>The hosted FaithVerse reader is being verified in Quantum Sandbox. The launch link will appear after an approved HTTPS deployment is configured.</p>
      )}
      <p><a href="/faithverse/reader" style={{display:"inline-block",padding:"14px 20px",border:"2px solid currentColor",borderRadius:12}}>Open Metaverse Bible Personal Reader</a></p>
      <p><a href="/faithverse/live" style={{display:"inline-block",padding:"14px 20px",border:"2px solid currentColor",borderRadius:12}}>Open TRYAMM LIVE Studio (broadcasting requires authorization)</a></p>
      <p><a href="/faithverse/house-of-ha-maschianh" style={{display:'inline-block',padding:'14px 20px',border:'2px solid currentColor',borderRadius:12}}>Join House of Ha Maschianh — Founding Ministry</a></p>
      <p><a href="/faithverse/founding-community" style={{display:'inline-block',padding:'14px 20px',border:'2px solid currentColor',borderRadius:12}}>Join Founding Believers or Request Ministry Support</a></p>
      <nav aria-label="FaithVerse learning and media" style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:20}}>
        <a href="/faithverse/academy" style={{padding:14,border:'1px solid currentColor',borderRadius:10}}>Paleo-Hebrew lesson</a>
        <a href="/faithverse/world" style={{padding:14,border:'1px solid currentColor',borderRadius:10}}>Explore 2D Bible World</a>
        <a href="/faithverse/ministries" style={{padding:14,border:'1px solid currentColor',borderRadius:10}}>Ministries &amp; SOC broadcasting</a>
        <a href="/faithverse/record" style={{padding:14,border:'1px solid currentColor',borderRadius:10}}>Record local lesson</a>
        <a href="/faithverse/soc" style={{padding:14,border:'1px solid currentColor',borderRadius:10}}>SOC Broadcasting Ministry</a>
      </nav>
      <h2>Explore the FaithVerse programs</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
        {spaces.map(([name,description])=>(
          <section key={name} style={{padding:20,border:'1px solid currentColor',borderRadius:12}}>
            <h3 style={{marginTop:0}}>{name}</h3><p>{description}</p>
          </section>
        ))}
      </div>
      <p style={{marginTop:28}}>Historical VR and pronunciation reconstructions are educational interpretations. Available texts and recordings must be separately identified and rights-reviewed.</p>
    </main>
  );
}
