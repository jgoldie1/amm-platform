'use client';

import { useEffect, useRef, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { WorldRealtime, type Movement } from '@/lib/world-realtime';

type RemotePlayer = { id: string; name: string; x: number; y: number };

export default function WorldsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('Player');
  const [instanceId, setInstanceId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [players, setPlayers] = useState<Record<string, RemotePlayer>>({});
  const [selfPos, setSelfPos] = useState({ x: 50, y: 50 });
  const realtime = useRef<WorldRealtime | null>(null);
  const sequence = useRef(0);
  const db = useRef(supabaseBrowser());

  useEffect(() => {
    db.current.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    return () => { void realtime.current?.disconnect(); };
  }, []);

  async function room(action: 'create' | 'join') {
    const { data } = await db.current.auth.getSession();
    const token = data.session?.access_token;
    if (!token || !user) {
      alert('Sign in through Supabase Auth first.');
      return;
    }

    const body = action === 'create'
      ? { action, worldSlug: 'planetary-omniverse', displayName: name }
      : { action, joinCode, displayName: name };

    const response = await fetch('/api/worlds', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    if (!response.ok) {
      alert(typeof result.error === 'string' ? result.error : 'Room request failed');
      return;
    }

    setInstanceId(result.id);
    setJoinCode(result.join_code);
    realtime.current = new WorldRealtime(db.current, result.id);
    await realtime.current.connect(
      user.id,
      name,
      (movement: Movement) => {
        setPlayers(current => ({
          ...current,
          [movement.userId]: {
            id: movement.userId,
            name: movement.displayName,
            x: movement.position.x,
            y: movement.position.z
          }
        }));
      },
      () => undefined
    );
  }

  async function move(dx: number, dy: number) {
    const next = {
      x: Math.max(2, Math.min(98, selfPos.x + dx)),
      y: Math.max(2, Math.min(98, selfPos.y + dy))
    };
    setSelfPos(next);
    if (!user || !realtime.current) return;
    sequence.current += 1;
    await realtime.current.sendMove({
      userId: user.id,
      displayName: name,
      position: { x: next.x, y: 0, z: next.y },
      rotation: { x: 0, y: 0, z: 0 },
      animation: 'walk',
      seq: sequence.current,
      sentAt: Date.now()
    });
  }

  return (
    <main style={{maxWidth:1180,margin:'0 auto',padding:24}}>
      <h1>Planetary Omniverse</h1>
      <p>Realtime shared-world Alpha using Supabase Broadcast + Presence architecture.</p>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:16}}>
        <input value={name} onChange={event => setName(event.target.value)} placeholder="Display name" />
        <button onClick={() => room('create')}>Create World Room</button>
        <input value={joinCode} onChange={event => setJoinCode(event.target.value.toUpperCase())} placeholder="Join code" />
        <button onClick={() => room('join')}>Join</button>
      </div>
      <div style={{position:'relative',height:500,border:'1px solid #334',borderRadius:18,overflow:'hidden'}}>
        <Player name={`${name} (you)`} x={selfPos.x} y={selfPos.y} />
        {Object.values(players).filter(player => player.id !== user?.id).map(player => (
          <Player key={player.id} name={player.name} x={player.x} y={player.y} />
        ))}
      </div>
      <div style={{display:'flex',gap:8,marginTop:16,flexWrap:'wrap'}}>
        <button onClick={() => move(0,-3)}>↑</button>
        <button onClick={() => move(-3,0)}>←</button>
        <button onClick={() => move(3,0)}>→</button>
        <button onClick={() => move(0,3)}>↓</button>
        <span>Room: {instanceId || 'not connected'} • Code: {joinCode || '—'}</span>
      </div>
    </main>
  );
}

function Player({name,x,y}:{name:string;x:number;y:number}) {
  return (
    <>
      <div style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:34,height:34,borderRadius:'50%',background:'#e8b944',border:'2px solid #4fe3ff',transform:'translate(-50%,-50%)'}} />
      <div style={{position:'absolute',left:`${x}%`,top:`${y}%`,transform:'translate(-50%,calc(-50% - 31px))',fontSize:12,whiteSpace:'nowrap'}}>{name}</div>
    </>
  );
}
