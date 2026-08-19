'use client';

import { FormEvent, useEffect, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';

type Message = { id: string; sender_id: string; message: string; created_at: string };
type Battle = { id: string; challenger_id: string; opponent_id: string; status: string; challenger_score: number; opponent_score: number };
type Gift = { gift_type: string; display_name: string; token_amount: number; animation_key: string };

type Props = { roomName: string; hostUserId?: string; isHost: boolean };

async function authHeaders() {
  const { data: { session } } = await getBrowserSupabase().auth.getSession();
  if (!session?.access_token) throw new Error('Sign in required');
  return { authorization: `Bearer ${session.access_token}`, 'content-type': 'application/json' };
}

export default function LiveInteractionPanel({ roomName, hostUserId, isHost }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [battles, setBattles] = useState<Battle[]>([]);
  const [opponentId, setOpponentId] = useState('');
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [status, setStatus] = useState('LIVE controls ready');
  const [uploading, setUploading] = useState(false);

  async function load() {
    try {
      const headers = await authHeaders();
      const [chatRes, pkRes, giftsRes] = await Promise.all([
        fetch(`/api/live/chat?room=${encodeURIComponent(roomName)}`, { headers, cache: 'no-store' }),
        fetch(`/api/live/pk?room=${encodeURIComponent(roomName)}`, { headers, cache: 'no-store' }),
        fetch('/api/live/gifts', { headers, cache: 'no-store' }),
      ]);
      if (chatRes.ok) setMessages((await chatRes.json()).messages ?? []);
      if (pkRes.ok) setBattles((await pkRes.json()).battles ?? []);
      if (giftsRes.ok) setGifts((await giftsRes.json()).gifts ?? []);
    } catch {
      setStatus('Some LIVE interactions are temporarily unavailable.');
    }
  }

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 2500);
    return () => window.clearInterval(timer);
  }, [roomName]);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;
    const headers = await authHeaders();
    const response = await fetch('/api/live/chat', { method: 'POST', headers, body: JSON.stringify({ roomName, message: text, languageCode: 'en' }) });
    if (!response.ok) return setStatus('Message could not be sent.');
    setMessage('');
    await load();
  }

  async function challengePk() {
    if (!opponentId.trim()) return;
    const headers = await authHeaders();
    const response = await fetch('/api/live/pk', { method: 'POST', headers, body: JSON.stringify({ roomName, opponentId: opponentId.trim() }) });
    setStatus(response.ok ? 'PK challenge sent.' : 'PK challenge could not be sent.');
    if (response.ok) await load();
  }

  async function updatePk(id: string, action: 'accept'|'decline'|'end') {
    const headers = await authHeaders();
    const response = await fetch('/api/live/pk', { method: 'PATCH', headers, body: JSON.stringify({ id, action }) });
    setStatus(response.ok ? `PK ${action} successful.` : `PK ${action} failed.`);
    if (response.ok) await load();
  }

  async function sendGift(giftType: string) {
    if (!hostUserId || isHost) return setStatus('Choose another creator to send a gift.');
    const headers = await authHeaders();
    const response = await fetch('/api/live/gifts', { method: 'POST', headers, body: JSON.stringify({ receiverId: hostUserId, giftType, sessionId: roomName }) });
    const result = await response.json().catch(() => ({}));
    setStatus(response.ok ? `Gift sent. Transaction ${result.giftId ?? ''}` : 'Gift failed or balance is insufficient.');
  }

  async function uploadCreatorMedia(file: File) {
    setUploading(true);
    try {
      const supabase = getBrowserSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sign in required');
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120);
      const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
      const { error } = await supabase.storage.from('creator-media-private').upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (error) throw error;
      setStatus(`Private upload complete: ${safeName}. Processing can begin after migration 012 is live.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <aside className="holo-panel" aria-label="LIVE interaction controls">
      <h2>LIVE interaction nexus</h2>
      <p className="muted" aria-live="polite">{status}</p>

      <section>
        <h3>Realtime chat</h3>
        <div style={{ maxHeight: 220, overflow: 'auto' }}>
          {messages.map(item => <p key={item.id}><strong>{item.sender_id.slice(0, 8)}</strong> {item.message}</p>)}
        </div>
        <form onSubmit={sendMessage} className="action-row">
          <label className="sr-only" htmlFor="live-chat-message">Chat message</label>
          <input id="live-chat-message" value={message} onChange={e => setMessage(e.target.value)} maxLength={1000} placeholder="Say something…" />
          <button type="submit">Send</button>
        </form>
      </section>

      <section>
        <h3>PK battle</h3>
        <div className="action-row">
          <input value={opponentId} onChange={e => setOpponentId(e.target.value)} placeholder="Creator user ID" aria-label="PK opponent user ID" />
          <button onClick={challengePk}>Challenge</button>
        </div>
        {battles.map(battle => (
          <div key={battle.id} className="status-row">
            <span className="status-chip">{battle.status}</span>
            <span>{battle.challenger_score}–{battle.opponent_score}</span>
            {battle.status === 'pending' && <><button onClick={() => updatePk(battle.id, 'accept')}>Accept</button><button onClick={() => updatePk(battle.id, 'decline')}>Decline</button></>}
            {battle.status === 'live' && <button onClick={() => updatePk(battle.id, 'end')}>End PK</button>}
          </div>
        ))}
      </section>

      <section>
        <h3>Holographic gifts 2.0</h3>
        <div className="action-row">
          {gifts.map(gift => <button key={gift.gift_type} onClick={() => sendGift(gift.gift_type)} disabled={isHost}>{gift.display_name} · {gift.token_amount}</button>)}
        </div>
      </section>

      <section>
        <h3>Record / upload / GLB asset intake</h3>
        <p className="muted">Private origin storage accepts creator media after the secure storage migration is applied. GLB/GLTF assets then enter HoloForge validation and the Global Asset Library rather than becoming public automatically.</p>
        <input type="file" disabled={uploading} accept="video/mp4,video/webm,audio/*,image/*,.glb,.gltf,model/gltf-binary,model/gltf+json" onChange={e => { const file = e.target.files?.[0]; if (file) uploadCreatorMedia(file); }} />
      </section>
    </aside>
  );
}
