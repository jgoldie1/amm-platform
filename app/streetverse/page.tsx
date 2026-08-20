import Link from 'next/link';
import { getRecoveredProduct } from '@/lib/recovered-products';

const faithDeck=['Courage','Wisdom Guard','Unity Pulse','Restoration'];
const holoDeck=['Holo Decoy','Photon Lance','Prism Wall','Quantum Scan'];

export default function StreetVersePage(){
  const product=getRecoveredProduct('streetverse-holo-deck')!;
  return <main className="container">
    <div className="kicker">Recovered Open-World Prototype • {product.stage}</div>
    <h1 style={{fontSize:'4rem'}}>StreetVerse: Holo Deck</h1>
    <p className="muted">The original GTA-style TryAMM open-world experience. It is an original system, not a copy of GTA maps, characters, missions, music, artwork or code.</p>
    <section className="card" style={{margin:'20px 0'}}>
      <div className="kicker">ACTIVE COMPLETION SLICE</div>
      <h2>District 01: TRYAMM Reality Lab</h2>
      <p className="muted">The immersive attraction is the controlled finish-and-prove venue for controllers, accessibility, panic, persistence, multiplayer, performance and commerce isolation.</p>
      <p><Link href="/streetverse/reality-lab"><strong>Enter the Reality Lab →</strong></Link></p>
    </section>
    <div className="grid grid-3">
      <section className="card"><h2>Combat</h2><p className="muted">Attack, heavy attack, shield, timed block, dodge, enemy counterattacks, health, stamina, faith energy, combos and victory/defeat state.</p></section>
      <section className="card"><h2>Faith Deck</h2>{faithDeck.map(x=><span className="pill" key={x}>{x}</span>)}</section>
      <section className="card"><h2>Holo Deck</h2>{holoDeck.map(x=><span className="pill" key={x}>{x}</span>)}</section>
      <section className="card"><h2>Controls & Feel</h2><p className="muted">Touch, keyboard and Gamepad architecture with browser vibration/haptic impact patterns where supported.</p></section>
      <section className="card"><h2>Living Worlds Bridge</h2><p className="muted">Player state, missions, NPC relationships, inventory and world progress are intended to persist through Omni Core/Supabase and travel through GameVerse Nexus.</p></section>
      <section className="card"><h2>Commercial completion gate</h2><p className="muted">A playable prototype exists, but full city assets, vehicle physics, production police/enemy AI, complete campaign, authoritative online multiplayer and optimization still separate prototype from a finished commercial open-world game.</p></section>
    </div>
  </main>;
}
