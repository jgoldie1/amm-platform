'use client';

import { useEffect, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';

type Props = { roomName: string; isHost: boolean };
type Recording = { egressId: string; status: unknown; startedAt?: string | null; endedAt?: string | null };

async function headers() {
  const { data: { session } } = await getBrowserSupabase().auth.getSession();
  if (!session?.access_token) throw new Error('Sign in required');
  return { authorization: `Bearer ${session.access_token}`, 'content-type': 'application/json' };
}

export default function RecordingControls({ roomName, isHost }: Props) {
  const [recording, setRecording] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('Checking recording status…');

  async function refresh() {
    try {
      const response = await fetch(`/api/live/recording?room=${encodeURIComponent(roomName)}`, { headers: await headers(), cache: 'no-store' });
      const body = await response.json();
      const active = (body.recordings ?? []).find((item: Recording) => !item.endedAt);
      setRecording(Boolean(body.recording));
      setActiveId(active?.egressId ?? '');
      setStatus(body.recording ? 'Recording in progress. Participants should be visibly informed.' : 'Not recording.');
    } catch {
      setStatus('Recording provider is not configured or unavailable.');
    }
  }

  useEffect(() => { refresh(); const timer = window.setInterval(refresh, 5000); return () => window.clearInterval(timer); }, [roomName]);

  async function start() {
    if (!consent) return setStatus('Confirm the recording notice before starting.');
    const response = await fetch('/api/live/recording', { method: 'POST', headers: await headers(), body: JSON.stringify({ roomName, consent: true }) });
    const body = await response.json().catch(() => ({}));
    setStatus(response.ok ? 'Recording started.' : body.error ?? 'Recording unavailable.');
    await refresh();
  }

  async function stop() {
    if (!activeId) return;
    const response = await fetch('/api/live/recording', { method: 'DELETE', headers: await headers(), body: JSON.stringify({ roomName, egressId: activeId }) });
    setStatus(response.ok ? 'Recording stopped. Processing/replay can begin.' : 'Recording could not be stopped.');
    await refresh();
  }

  return (
    <section className="holo-panel" aria-label="Recording controls">
      <div className="status-row"><h2>Recording & replay</h2><span className={recording ? 'live-badge' : 'status-chip'}>{recording ? '● REC' : 'OFF'}</span></div>
      <p className="muted" aria-live="polite">{status}</p>
      {isHost ? <>
        <label><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /> I will notify participants that this session is being recorded and follow applicable consent rules.</label>
        <div className="action-row">
          <button onClick={start} disabled={recording || !consent}>Start recording</button>
          <button onClick={stop} disabled={!recording || !activeId}>Stop recording</button>
        </div>
      </> : <p>{recording ? 'This LIVE room is being recorded.' : 'This LIVE room is not currently recording.'}</p>}
    </section>
  );
}
