import { getRecoveredProduct } from '@/lib/recovered-products';

const judges = ['Coach Titan','Pastor Grace','DJ Starmaker','Queen Vision','Industry Judge'];
const categories = ['Singing','Dance','Rap','Acting','Comedy','Instrumental','Parent-Child Duo'];

export default function StarVersePage(){
  const product=getRecoveredProduct('starverse')!;
  return <main className="container">
    <div className="kicker">Recovered Product • {product.stage}</div>
    <h1 style={{fontSize:'4rem'}}>StarVerse</h1>
    <p className="muted">Anyone Can Be a Star — auditions, showcases, judges, fan voting and creator progression under one Omni identity.</p>
    <div className="grid grid-3" style={{marginTop:24}}>
      <section className="card"><h2>Audition</h2><p className="muted">Register talent, category and profile. Youth participation requires the parent/guardian workflow before public showcase access.</p><div>{categories.map(x=><span key={x} className="pill">{x}</span>)}</div></section>
      <section className="card"><h2>5-Judge Panel</h2><p className="muted">Recovered scoring model with live averages and judge personalities.</p><div>{judges.map(x=><span key={x} className="pill">{x}</span>)}</div></section>
      <section className="card"><h2>Fan Vote</h2><p className="muted">Realtime audience voting and rankings connect to the shared identity/realtime layer. Production anti-abuse controls remain required before public voting.</p></section>
    </div>
    <section className="card" style={{marginTop:16}}><h2>Recovered capabilities</h2>{product.capabilities.map(x=><span className="pill" key={x}>{x}</span>)}</section>
  </main>;
}
