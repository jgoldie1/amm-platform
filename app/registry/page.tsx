import { systems } from '@/lib/registry';

export default function RegistryPage() {
  return (
    <main style={{maxWidth:1180,margin:'0 auto',padding:24}}>
      <h1>Master Omniverse Registry</h1>
      <p>Permanent source-of-truth map for the ecosystem.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
        {systems.map(system => (
          <article key={system.key} style={{border:'1px solid #334',borderRadius:16,padding:16}}>
            <small>{system.division}</small>
            <h2>{system.name}</h2>
            <p>{system.summary}</p>
            <strong>{system.status}</strong>
          </article>
        ))}
      </div>
    </main>
  );
}
