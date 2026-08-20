'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import LiveRoomClient from '@/components/live/LiveRoomClient';
import LiveInteractionPanel from '@/components/live/LiveInteractionPanel';
import RecordingControls from '@/components/live/RecordingControls';
import { getBrowserSupabase } from '@/lib/supabase/browser';

export default function LiveRoomPage() {
  const params = useParams<{ roomName: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const roomName = params.roomName;
  const mode = search.get('mode') || 'general';
  const [hostUserId, setHostUserId] = useState<string>();
  const [isHost, setIsHost] = useState(false);
  const [status, setStatus] = useState('Verifying LIVE room…');
  const [ending, setEnding] = useState(false);

  async function accessToken() {
    const { data: { session } } = await getBrowserSupabase().auth.getSession();
    if (!session?.access_token) throw new Error('Sign in to enter LIVE.');
    return session.access_token;
  }

  useEffect(() => {
    (async () => {
      try {
        const token = await accessToken();
        const response = await fetch(`/api/live/rooms?room=${encodeURIComponent(roomName)}`, { headers: { authorization: `Bearer ${token}` }, cache: 'no-store' });
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

  async function endLive() {
    if (!isHost || ending) return;
    setEnding(true);
    try {
      const token = await accessToken();
      const response = await fetch('/api/live/rooms', { method: 'DELETE', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify({ roomName }) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? 'Unable to end LIVE');
      setStatus('LIVE ended and discovery presence cleared.');
      router.push('/live');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to end LIVE');
      setEnding(false);
    }
  }

  return (
    <main className="page-shell live-immersive-shell">
      <section className="hero-panel holo-panel">
        <div>
          <p className="eyebrow">HOLOGRAPHIC LIVE ROOM</p>
          <h1>{mode.toUpperCase()} LIVE</h1>
          <p className="lede">Camera/mic, chat, PK, transaction-backed holographic gifts, recording/replay, creator media, GLB assets, reels and HoloForge share one verified room.</p>
          <p className="muted" aria-live="polite">{status}</p>
        </div>
        <div className="action-row">
          <Link href="/live">Back to LIVE Nexus</Link>
          <Link href="/creator-universe">Creator Universe</Link>
          {isHost && <button onClick={endLive} disabled={ending}>{ending ? 'Ending…' : 'End LIVE'}</button>}
        </div>
      </section>

      {hostUserId ? <>
        <RecordingControls roomName={roomName} isHost={isHost} />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(300px,1fr)', gap: '1rem', alignItems: 'start' }}>
          <LiveRoomClient roomName={roomName} role={isHost ? 'host' : 'viewer'} mode={mode} />
          <LiveInteractionPanel roomName={roomName} hostUserId={hostUserId} isHost={isHost} />
        </div>
      </> : <section className="holo-panel"><p>Room connection is gated until authorization succeeds.</p></section>}
    </main>
  );
}
