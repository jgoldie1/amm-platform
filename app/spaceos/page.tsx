import { getRecoveredProduct } from '@/lib/recovered-products';

const flow=['Scan Room','Recognize Objects','Build Digital Twin','Drag / Edit','Safety Check','Generate Parts','BUILD Job','Manufacture / Install'];

export default function SpaceOSPage(){
  const product=getRecoveredProduct('spaceos')!;
  return <main className="container">
    <div className="kicker">Recovered Product • {product.stage}</div>
    <h1 style={{fontSize:'4rem'}}>SpaceOS</h1>
    <p className="muted">The locked physical-world workflow: scan → understand → edit → safety gate → manufacture.</p>
    <section className="card"><h2>Workflow</h2>{flow.map((x,i)=><span className="pill" key={x}>{i+1}. {x}</span>)}</section>
    <div className="grid grid-3" style={{marginTop:16}}>
      <article className="card"><h2>Digital Twin Editor</h2><p className="muted">Persistent rooms, objects, dimensions, doors, windows and no-go zones. 3D object dragging is part of the recovered baseline.</p></article>
      <article className="card"><h2>Private Household Data</h2><p className="muted">Supabase Auth/RLS, private photo storage and household ownership are required before scan assets are treated as production data.</p></article>
      <article className="card"><h2>BUILD</h2><p className="muted">A BUILD action creates a manufacturing job only after structural/safety checks. Parametric SpaceBlock parts can target STL/STEP export and later Jarvis Forge/12D manufacturing.</p></article>
    </div>
    <section className="card" style={{marginTop:16}}><h2>Recovered capabilities</h2>{product.capabilities.map(x=><span key={x} className="pill">{x}</span>)}</section>
  </main>;
}
