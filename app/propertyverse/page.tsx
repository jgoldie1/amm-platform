import { getRecoveredProduct } from '@/lib/recovered-products';

const phases=['Discover','Scan','Digital Twin','Renovation Plan','Budget','Build','Inspect','List / Rent / Sell'];

export default function PropertyVersePage(){
  const product=getRecoveredProduct('propertyverse')!;
  return <main className="container">
    <div className="kicker">Recovered Product • {product.stage}</div>
    <h1 style={{fontSize:'4rem'}}>PropertyVerse</h1>
    <p className="muted">Real estate, immersive tours and home flipping connected directly to SpaceOS digital twins and the manufacturing/contractor workflow.</p>
    <section className="card"><h2>Flip workflow</h2><div>{phases.map((x,i)=><span key={x} className="pill">{i+1}. {x}</span>)}</div></section>
    <div className="grid grid-3" style={{marginTop:16}}>
      <article className="card"><h2>Property Twin</h2><p className="muted">Capture rooms, dimensions, doors/windows and renovation zones so the property becomes a persistent project rather than a photo-only listing.</p></article>
      <article className="card"><h2>Renovation</h2><p className="muted">Scope work, estimate phases, attach contractors/vendors, route safe manufactured components to SpaceOS/Jarvis Forge, and preserve before/after evidence.</p></article>
      <article className="card"><h2>Immersive Listing</h2><p className="muted">Publish conventional photos/video first, then offer 3D/VR/MR/Holo modes when a title/property has compatible assets.</p></article>
    </div>
    <section className="card" style={{marginTop:16}}><h2>Recovered capabilities</h2>{product.capabilities.map(x=><span key={x} className="pill">{x}</span>)}</section>
  </main>;
}
