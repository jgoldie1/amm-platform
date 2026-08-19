'use client';

import '@livekit/components-styles';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';

type Props = { roomName: string; role: 'host'|'viewer'; mode?: string };

export default function LiveRoomClient({ roomName, role, mode = 'general' }: Props) {
  const [token, setToken] = useState<string>();
  const [serverUrl, setServerUrl] = useState<string>();
  const [status, setStatus] = useState('Preparing secure LIVE session…');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = getBrowserSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error('Sign in before joining LIVE.');
        const response = await fetch('/api/live/token', {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ roomName, role, mode }),
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? 'Unable to create LIVE token');
        if (!cancelled) {
          setToken(body.token);
          setServerUrl(body.url);
          setStatus(role === 'host' ? 'Connecting camera and microphone…' : 'Joining LIVE…');
        }
      } catch (error) {
        if (!cancelled) setStatus(error instanceof Error ? error.message : 'LIVE unavailable');
      }
    })();
    return () => { cancelled = true; };
  }, [roomName, role, mode]);

  if (!token || !serverUrl) return <div className="holo-panel"><p aria-live="polite">{status}</p></div>;

  return (
    <div className="livekit-stage" data-lk-theme="default">
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect
        video={role === 'host'}
        audio={role === 'host'}
        onConnected={() => setStatus('LIVE connected')}
        onDisconnected={() => setStatus('LIVE disconnected')}
        onError={(error) => setStatus(error.message)}
      >
        <p className="sr-only" aria-live="polite">{status}</p>
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
