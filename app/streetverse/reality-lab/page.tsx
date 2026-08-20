import Link from 'next/link';
import RealityLabExperience from '@/components/reality-lab/RealityLabExperience';

export default function RealityLabPage() {
  return (
    <main className="container" style={{ paddingBottom: 64 }}>
      <div className="kicker">StreetVerse • District 01 • Finish-and-Prove Slice</div>
      <h1 style={{ fontSize: 'clamp(2.6rem,8vw,5.5rem)', marginBottom: 8 }}>Reality Lab</h1>
      <p className="muted" style={{ maxWidth: 900 }}>
        An original immersive attraction proof venue inspired by the idea of interactive museums, not a copy of any third-party attraction, exhibit, brand, artwork or protected experience.
      </p>
      <p className="muted" style={{ maxWidth: 900 }}>
        Keyboard: arrows move between rooms, Enter completes the current interaction, Escape triggers the panic safe state. Gamepad: A interacts, B triggers panic, D-pad changes rooms.
      </p>
      <RealityLabExperience />
      <p style={{ marginTop: 24 }}><Link href="/streetverse">← Back to StreetVerse</Link></p>
    </main>
  );
}
