import Link from 'next/link';

const entries = [
  ['WATCH','HoloDrama, Originals, Isaiah AI TV, clips and OTT'],
  ['LIVE','Creator LIVE, premieres, after-shows and events'],
  ['PLAY','GameVerse, Living Worlds and multiplayer'],
  ['WORLDS','Holoverse and Planetary Omniverse portals'],
  ['SHOP','Marketplace and immersive commerce'],
  ['MUSIC','HoloMusic and Aniyah 64-Track Studio'],
  ['AI','Stubbs AI, HoloGPT and HoloSearch'],
  ['HOME','SpaceOS, digital twins and device control']
] as const;

export default function OmniBoxPage() {
  return (
    <main style={{maxWidth:1180,margin:'0 auto',padding:24}}>
      <h1>Omni Box</h1>
      <p>Your whole ecosystem on one screen.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
        {entries.map(([name,description]) => (
          <article key={name} style={{border:'1px solid #334',borderRadius:16,padding:16}}>
            <h2>{name}</h2>
            <p>{description}</p>
            {name === 'PLAY' && <Link href="/worlds">Launch Worlds</Link>}
          </article>
        ))}
      </div>
    </main>
  );
}
