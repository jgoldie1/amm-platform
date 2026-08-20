'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '@/lib/supabase/browser';

const modes = ['music','news','debate','faith','shopping','game','tv','starverse','showcase','talent','karaoke','mic','vocal-box','general'] as const;

export default function StartLiveButton() {
  const router = useRouter();
  const [mode, setMode] = useState<(typeof modes)[number]>('general');
  const [headline, setHeadline] = useState('');
  const [status, setStatus] = useState('');
  const [starting, setStarting] = useState(false);

  async function start() {
    setStarting(true);
    try {
      const { data: { session } } = await getBrowserSupabase().auth.getSession();
      if (!session?.access_token) throw new Error('Sign in before going LIVE.');
      const response = await fetch('/api/live/rooms', {
        method: 'POST',
        headers: { authorization: `Bearer ${session.access_token}`, 'content-type': 'application/json' },
        body: JSON.stringify({ mode, headline }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? 'Unable to start LIVE');
      router.push(`/live/room/${encodeURIComponent(body.roomName)}?mode=${encodeURIComponent(mode)}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to start LIVE');
      setStarting(false);
    }
  }

  return (
    <div className="holo-panel">
      <h2>Start a verified LIVE</h2>
      <div className="filter-row">
        <label>Broadcast mode <select value={mode} onChange={e => setMode(e.target.value as (typeof modes)[number])}>{modes.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
        <label>Headline <input value={headline} onChange={e => setHeadline(e.target.value)} maxLength={180} placeholder="What are you broadcasting?" /></label>
      </div>
      <button onClick={start} disabled={starting}>{starting ? 'Securing room…' : 'GO LIVE'}</button>
      {status && <p className="muted" aria-live="polite">{status}</p>}
    </div>
  );
}
