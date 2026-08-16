import { getRecoveredProduct } from '@/lib/recovered-products';

const missions=['Answer the Summons','Bread for the City','Ring the Bells','Escort the Elder','Crown Procession'];

export default function KingdomDistrictPage(){
  const product=getRecoveredProduct('kingdom-district')!;
  return <main className="container">
    <div className="kicker">Recovered Living World • {product.stage}</div>
    <h1 style={{fontSize:'4rem'}}>Kingdom District</h1>
    <p className="muted">Faith-forward drivable district with Crown-of-Judah identity, checkpoint missions, persistence and accessible one-hand controls.</p>
    <section className="card"><h2>Five-mission vertical slice</h2>{missions.map((m,i)=><span className="pill" key={m}>{i+1}. {m}</span>)}</section>
    <div className="grid grid-3" style={{marginTop:16}}>
      <article className="card"><h2>Drive</h2><p className="muted">Three.js driving foundation with keyboard and large hold-to-press touch controls.</p></article>
      <article className="card"><h2>Persist</h2><p className="muted">Mission completion, cash, XP and faith rewards were designed to persist and avoid duplicate rewards. Production target is canonical Supabase player_state/world_sessions.</p></article>
      <article className="card"><h2>Accessible</h2><p className="muted">Mission assist mode, easier steering, larger targets, no timers and gentler camera behavior.</p></article>
    </div>
  </main>;
}
