import { getRecoveredProduct } from '@/lib/recovered-products';

const shows = [
  ['Anyone Can Be A Star','Competition','12 episodes','45 min'],
  ['Messiah AI MD Life Coaching Live','Talk show','26 episodes','30 min'],
  ['Higfield Dance 2.0 The Series','Reality','8 episodes','30 min'],
  ['StarVerse Showcase LIVE','Variety / Live','52 episodes','60 min'],
];

const movies = [
  ['Star Born — The Isaiah Story','Drama','90 min'],
  ['Kingdom Rhythm','Musical','120 min'],
  ['My Kid Is A Star','Documentary','90 min'],
  ['Mythos: The Sound of Tomorrow','Short','30 min'],
];

export default function IsaiahAiTvPage(){
  const product=getRecoveredProduct('isaiah-ai-tv')!;
  return <main className="container">
    <div className="kicker">Recovered Product • {product.stage}</div>
    <h1 style={{fontSize:'4rem'}}>Isaiah AI TV</h1>
    <p className="muted">The recovered entertainment network combines AI-assisted production, talent discovery, live television, movies, holographic advertising and product placement.</p>
    <h2>Shows</h2>
    <div className="grid grid-3">{shows.map(([title,type,episodes,length])=><article className="card" key={title}><h3>{title}</h3><p className="muted">{type} • {episodes} • {length}</p><span className="pill">Holo ads compatible</span></article>)}</div>
    <h2 style={{marginTop:28}}>Movies</h2>
    <div className="grid grid-3">{movies.map(([title,type,length])=><article className="card" key={title}><h3>{title}</h3><p className="muted">{type} • {length}</p><span className="pill">Product placement</span><span className="pill">Spatial/Holo manifest</span></article>)}</div>
    <section className="card" style={{marginTop:20}}><h2>Production system</h2><p className="muted">Recovered specification includes a live run-of-show console, five-judge scoring, live rankings, audience voting, viewer count, chat and timed holographic ad triggers. These controls are being reconnected to Omni Realtime rather than left as isolated demo state.</p></section>
  </main>;
}
