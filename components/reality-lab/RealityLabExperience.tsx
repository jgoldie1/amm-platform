'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  REALITY_LAB_STORAGE_KEY,
  realityLabRooms,
  type RealityLabRoomId
} from '@/lib/reality-lab';

type SavedState = {
  currentRoom: RealityLabRoomId;
  completed: RealityLabRoomId[];
  xp: number;
  reducedMotion: boolean;
  oneHanded: boolean;
  highContrast: boolean;
};

const defaultState: SavedState = {
  currentRoom: 'welcome-hall',
  completed: [],
  xp: 0,
  reducedMotion: false,
  oneHanded: false,
  highContrast: false
};

export default function RealityLabExperience() {
  const [state, setState] = useState<SavedState>(defaultState);
  const [panic, setPanic] = useState(false);
  const [message, setMessage] = useState('Checkpoint ready. Enter the Reality Lab.');
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const gamepadButtons = useRef<boolean[]>([]);

  const currentIndex = Math.max(0, realityLabRooms.findIndex(room => room.id === state.currentRoom));
  const current = realityLabRooms[currentIndex];
  const progress = Math.round((state.completed.length / realityLabRooms.length) * 100);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(REALITY_LAB_STORAGE_KEY);
      if (raw) setState({ ...defaultState, ...(JSON.parse(raw) as SavedState) });
    } catch {
      setMessage('Local checkpoint could not be restored; using a safe fresh state.');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(REALITY_LAB_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const moveTo = useCallback((index: number) => {
    const bounded = Math.min(realityLabRooms.length - 1, Math.max(0, index));
    setState(prev => ({ ...prev, currentRoom: realityLabRooms[bounded].id }));
    setMessage(`Entered ${realityLabRooms[bounded].name}.`);
  }, []);

  const completeCurrent = useCallback(() => {
    if (panic) return;
    setState(prev => {
      if (prev.completed.includes(current.id)) return prev;
      return {
        ...prev,
        completed: [...prev.completed, current.id],
        xp: prev.xp + current.xp
      };
    });
    setMessage(`${current.name} proof interaction recorded. No cash balance was changed.`);
  }, [current, panic]);

  const triggerPanic = useCallback(() => {
    setPanic(true);
    setMessage('PANIC SAFE STATE: interaction and progression are paused.');
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') triggerPanic();
      if (panic) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') moveTo(currentIndex + 1);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') moveTo(currentIndex - 1);
      if (event.key === 'Enter') completeCurrent();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [completeCurrent, currentIndex, moveTo, panic, triggerPanic]);

  useEffect(() => {
    const connected = () => setGamepadConnected(true);
    const disconnected = () => setGamepadConnected(false);
    window.addEventListener('gamepadconnected', connected);
    window.addEventListener('gamepaddisconnected', disconnected);
    setGamepadConnected(Boolean(navigator.getGamepads?.().some(Boolean)));

    let frame = 0;
    const poll = () => {
      const pad = navigator.getGamepads?.()[0];
      if (pad) {
        const now = pad.buttons.map(button => button.pressed);
        const before = gamepadButtons.current;
        const pressed = (index: number) => now[index] && !before[index];
        if (pressed(0) && !panic) completeCurrent();
        if (pressed(1)) triggerPanic();
        if (pressed(14) && !panic) moveTo(currentIndex - 1);
        if (pressed(15) && !panic) moveTo(currentIndex + 1);
        gamepadButtons.current = now;
      }
      frame = requestAnimationFrame(poll);
    };
    frame = requestAnimationFrame(poll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('gamepadconnected', connected);
      window.removeEventListener('gamepaddisconnected', disconnected);
    };
  }, [completeCurrent, currentIndex, moveTo, panic, triggerPanic]);

  const completedAll = state.completed.length === realityLabRooms.length;
  const roomButtons = useMemo(() => realityLabRooms.map((room, index) => (
    <button
      key={room.id}
      onClick={() => moveTo(index)}
      aria-current={room.id === state.currentRoom ? 'step' : undefined}
      style={{
        minHeight: 56,
        textAlign: 'left',
        borderRadius: 14,
        border: room.id === state.currentRoom ? '2px solid currentColor' : '1px solid #7777',
        padding: 12,
        background: 'transparent',
        color: 'inherit',
        cursor: 'pointer'
      }}
    >
      <strong>{index + 1}. {room.name}</strong><br />
      <span>{state.completed.includes(room.id) ? 'GREEN interaction' : 'Not yet proven'}</span>
    </button>
  )), [moveTo, state.completed, state.currentRoom]);

  return (
    <section
      aria-label="StreetVerse District 01 Reality Lab"
      style={{
        borderRadius: 24,
        padding: 20,
        background: state.highContrast ? '#000' : 'linear-gradient(145deg,#08121f,#111827)',
        color: state.highContrast ? '#fff200' : '#f8fafc',
        boxShadow: state.reducedMotion ? 'none' : '0 24px 80px #0008'
      }}
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div>
          <div style={{ opacity: .8 }}>District 01 • Immersive Attraction Proof Venue</div>
          <h2 style={{ marginTop: 6, fontSize: 'clamp(2rem,6vw,4rem)' }}>TRYAMM Reality Lab</h2>
        </div>
        <button onClick={triggerPanic} style={{ minHeight: 56, padding: '0 20px', fontWeight: 800 }}>
          PANIC / SAFE STATE
        </button>
      </div>

      <p aria-live="polite"><strong>{message}</strong></p>
      <p>Progress {progress}% • XP {state.xp} • Gamepad {gamepadConnected ? 'connected' : 'not detected'}</p>
      <progress max={100} value={progress} style={{ width: '100%', minHeight: 18 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, marginTop: 20 }}>
        {roomButtons}
      </div>

      <article style={{ marginTop: 24, border: '1px solid #ffffff33', borderRadius: 18, padding: 18 }}>
        <div style={{ opacity: .75 }}>Current proof room</div>
        <h3 style={{ fontSize: '2rem', margin: '8px 0' }}>{current.name}</h3>
        <p>{current.purpose}</p>
        <p>{current.proof.map(item => <span key={item} style={{ display: 'inline-block', margin: 4, padding: '6px 9px', border: '1px solid #ffffff55', borderRadius: 999 }}>{item}</span>)}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button disabled={panic} onClick={() => moveTo(currentIndex - 1)}>Previous</button>
          <button disabled={panic || state.completed.includes(current.id)} onClick={completeCurrent}>
            {state.completed.includes(current.id) ? 'Interaction recorded' : `Complete interaction +${current.xp} XP`}
          </button>
          <button disabled={panic} onClick={() => moveTo(currentIndex + 1)}>Next</button>
        </div>
      </article>

      <fieldset style={{ marginTop: 24, borderRadius: 18, padding: 16 }}>
        <legend>Accessibility controls</legend>
        <label style={{ display: 'block', minHeight: 44 }}><input type="checkbox" checked={state.oneHanded} onChange={e => setState(prev => ({ ...prev, oneHanded: e.target.checked }))} /> One-handed interaction mode</label>
        <label style={{ display: 'block', minHeight: 44 }}><input type="checkbox" checked={state.reducedMotion} onChange={e => setState(prev => ({ ...prev, reducedMotion: e.target.checked }))} /> Reduced motion</label>
        <label style={{ display: 'block', minHeight: 44 }}><input type="checkbox" checked={state.highContrast} onChange={e => setState(prev => ({ ...prev, highContrast: e.target.checked }))} /> High contrast</label>
      </fieldset>

      {panic && (
        <div role="alert" style={{ marginTop: 20, padding: 18, border: '3px solid currentColor', borderRadius: 16 }}>
          <strong>SAFE STATE ACTIVE.</strong> Movement and completion are disabled.
          <div><button onClick={() => { setPanic(false); setMessage('Safe state cleared. Resume when ready.'); }}>Resume experience</button></div>
        </div>
      )}

      {completedAll && (
        <div style={{ marginTop: 20, padding: 18, border: '2px solid currentColor', borderRadius: 16 }}>
          <strong>Local interaction loop complete.</strong> This does not mark District 01 GREEN by itself; authoritative multiplayer, Supabase save/rejoin, mobile/XR benchmarks, commerce isolation and deployed evidence still require external proof.
        </div>
      )}
    </section>
  );
}
