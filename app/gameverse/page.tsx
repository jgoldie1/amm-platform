import { recoveredProducts } from '@/lib/recovered-products';

const keys=['gameverse-sports','quantum-tag','omniverse-duel-realms','creature-capture','volcano-racers','streetverse-holo-deck','kingdom-district','living-worlds-runtime'];

export default function GameVersePage(){
  const games=keys.map(key=>recoveredProducts.find(p=>p.key===key)).filter(Boolean);
  return <main className="container">
    <div className="kicker">GameVerse Nexus</div>
    <h1 style={{fontSize:'4rem'}}>All games. One player. Every reality.</h1>
    <p className="muted">Recovered GameVerse catalog spanning sports, open world, racing, card battles, creature capture, Quantum Tag and 13 Living Worlds. Standard, AR, VR, MR and holographic modes reuse one identity, progression, accessibility and multiplayer foundation.</p>
    <div className="grid grid-3" style={{marginTop:24}}>{games.map(game=>game&&<article className="card" key={game.key}><div className="kicker">{game.stage}</div><h2>{game.name}</h2><p className="muted">{game.summary}</p>{game.capabilities.slice(0,6).map(x=><span className="pill" key={x}>{x}</span>)}</article>)}</div>
    <section className="card" style={{marginTop:20}}><h2>Shared GameVerse services</h2>{['Omni ID','player profile','shared avatar','progression','inventory','matchmaking','leaderboards','replays','accessibility','anti-cheat/moderation','Omni Multiplayer','Living Worlds portals','Holo5DX spectator/replay'].map(x=><span className="pill" key={x}>{x}</span>)}</section>
  </main>;
}
