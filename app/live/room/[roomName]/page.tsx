'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import LiveRoomClient from '@/components/live/LiveRoomClient';
import LiveInteractionPanel from '@/components/live/LiveInteractionPanel';
import { getBrowserSupabase } from '@/lib/supabase/browser';

export default function LiveRoomPage() {
  const params = useParams<{ roomName: string }>();
  const search = useSearchParams();
  const roomName = params.roomName;
  const mode = search.get('mode') || 'general';
  const [hostUserId, setHostUserId] = useState<string>();
  const [isHost, setIsHost] = useState(false);
  const [status, setStatus] = useState('Verifying LIVE room…');

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await getBrowserSupabase().auth.getSession();
        if (!session?.access_token) throw new Error('Sign in to enter LIVE.');
        const response = await fetch(`/api/live/rooms?room=${encodeURIComponent(roomName)}`, { headers: { authorization: `Bearer ${session.access_token}` }, cache: 'no-store' });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? 'LIVE room unavailable');
        setHostUserId(body.hostUserId);
        setIsHost(Boolean(body.isHost));
        setStatus(body.isHost ? 'Host controls verified.' : 'Viewer access verified.');
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'LIVE room unavailable');
      }
    })();
  }, [roomName]);

  return (
    <main className="page-shell live-immersive-shell">
      <section className="hero-panel holo-panel">
        <div>
          <p className="eyebrow">HOLOGRAPHIC LIVE ROOM</p>
          <h1>{mode.toUpperCase()} LIVE</h1>
          <p className="lede">One room for camera/mic, chat, PK, holographic gifts, recording, media uploads, reels and HoloForge assets.</p>
          <p className="muted" aria-live="polite">{status}</p>
        </div>
        <div className="action-row"><Link href="/live">Back to LIVE Nexus</Link><Link href="/creator-universe">Creator Universe</Link></div>
      </section>

      {hostUserId ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(300px,1fr)', gap: '1rem', alignItems: 'start' }}>
          <LiveRoomClient roomName={roomName} role={isHost ? 'host' : 'viewer'} mode={mode} />
          <LiveInteractionPanel roomName={roomName} hostUserId={hostUserId} isHost={isHost} />
        </div>
      ) : <section className="holo-panel"><p>Room connection is gated until authorization succeeds.</p></section>}
    </main>
  );
}
