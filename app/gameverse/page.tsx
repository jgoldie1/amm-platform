import { gameVerseSystems, sharedQuantumSystems, worldTwinLayers } from '@/lib/gameverse-registry';

export default function GameVersePage() {
  return (
    <main className="container">
      <div className="kicker">GameVerse Nexus</div>
      <h1 style={{fontSize:'3.4rem'}}>All games. One player. One world state.</h1>
      <p className="muted">Original game families connected to Omni ID, shared progression, Living Worlds, Holoverse and the World Twin layers. Familiar genres are inspiration only; characters, names, maps, music, art and lore remain original.</p>

      <section style={{marginTop:24}}>
        <h2>Game systems</h2>
        <div className="grid grid-3">
          {gameVerseSystems.map(game => (
            <article className="card" key={game.key}>
              <div className="kicker">{game.category}</div>
              <h2>{game.name}</h2>
              <span className="pill">{game.stage}</span>
              {game.inspirationNote ? <p className="muted">{game.inspirationNote}</p> : null}
              <div>{game.capabilities.map(cap => <span className="pill" key={cap}>{cap}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section style={{marginTop:32}}>
        <h2>World Twin → Middleverse → Metaverse → Multiverse → Omniverse</h2>
        <div className="grid grid-3">
          {worldTwinLayers.map(layer => <article className="card" key={layer.key}><h3>{layer.name}</h3><p className="muted">{layer.purpose}</p></article>)}
        </div>
      </section>

      <section className="card" style={{marginTop:32}}>
        <h2>Shared Quantum/Holo foundation</h2>
        <div>{sharedQuantumSystems.map(x => <span className="pill" key={x}>{x}</span>)}</div>
      </section>
    </main>
  );
}
