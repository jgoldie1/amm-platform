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
