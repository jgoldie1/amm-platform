'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import StartLiveButton from '@/components/live/StartLiveButton';

type Creator = {
  user_id: string;
  display_name: string;
  avatar_url?: string | null;
  country_code?: string | null;
  language_code?: string | null;
  is_online: boolean;
  is_live: boolean;
  accepts_pk: boolean;
  mode: string;
  room_name?: string | null;
  headline?: string | null;
  viewer_count: number;
};

const modes = ['all','live','pk','shopping','game','music','starverse','showcase','talent','karaoke','mic','vocal-box','news','debate','faith','movie','tv'];

export default function LivePage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [mode, setMode] = useState('all');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [status, setStatus] = useState('Loading LIVE presence…');

  useEffect(() => {
    const params = new URLSearchParams();
    if (mode !== 'all' && mode !== 'live' && mode !== 'pk') params.set('mode', mode);
    if (country) params.set('country', country);
    if (language) params.set('language', language);
    fetch(`/api/live/discovery?${params.toString()}`, { cache: 'no-store' })
      .then(async r => {
        if (!r.ok) throw new Error('LIVE presence unavailable');
        const data = await r.json();
        let next: Creator[] = data.creators ?? [];
        if (mode === 'live') next = next.filter(c => c.is_live);
        if (mode === 'pk') next = next.filter(c => c.accepts_pk);
        setCreators(next);
        setStatus(next.length ? `${next.length} creators online` : 'No creators match this filter yet.');
      })
      .catch(() => setStatus('LIVE discovery is temporarily unavailable.'));
  }, [mode, country, language]);

  const liveCount = useMemo(() => creators.filter(c => c.is_live).length, [creators]);

  return (
    <main className="page-shell live-immersive-shell">
      <section className="hero-panel holo-panel live-command-deck">
        <div>
          <p className="eyebrow">GLOBAL LIVE NEXUS</p>
          <h1>See the world LIVE.</h1>
          <p className="lede">Discover creators by country, language and experience: LIVE, PK, Showcase, Talent, Karaoke, Mic, Vocal Box, shopping, games, music, news, debate, faith, StarVerse, movies and Isaiah AI TV.</p>
        </div>
        <div className="live-orb" aria-label={`${liveCount} live creators`}>
          <strong>{liveCount}</strong>
          <span>LIVE NOW</span>
        </div>
      </section>

      <StartLiveButton />

      <section className="holo-panel live-controls" aria-label="LIVE discovery controls">
        <div className="mode-strip">
          {modes.map(m => <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m}>{m.toUpperCase()}</button>)}
        </div>
        <div className="filter-row">
          <label>Country <input value={country} onChange={e => setCountry(e.target.value.toUpperCase())} placeholder="NG, ZA, US…" maxLength={2} /></label>
          <label>Language <input value={language} onChange={e => setLanguage(e.target.value.toLowerCase())} placeholder="en, fr, yo…" /></label>
        </div>
        <p className="muted" aria-live="polite">{status}</p>
      </section>

      <section className="live-grid" aria-label="Creators online">
        {creators.map(creator => (
          <article key={creator.user_id} className="holo-panel live-card">
            <div className="live-card-top">
              <div className="creator-avatar" aria-hidden="true">{creator.avatar_url ? <img src={creator.avatar_url} alt="" /> : creator.display_name.slice(0,1).toUpperCase()}</div>
              <div>
                <h2>{creator.display_name}</h2>
                <p>{creator.country_code || 'GLOBAL'} · {(creator.language_code || 'en').toUpperCase()}</p>
              </div>
              <span className={creator.is_live ? 'live-badge' : 'online-badge'}>{creator.is_live ? 'LIVE' : 'ONLINE'}</span>
            </div>
            <p>{creator.headline || `${creator.mode} session`}</p>
            <div className="status-row">
              <span className="status-chip">{creator.mode}</span>
              {creator.accepts_pk && <span className="status-chip">PK OPEN</span>}
              <span className="status-chip">{creator.viewer_count} watching</span>
            </div>
            <div className="action-row">
              {creator.is_live && creator.room_name ? (
                <Link href={`/live/room/${encodeURIComponent(creator.room_name)}?mode=${encodeURIComponent(creator.mode)}`}>Watch LIVE</Link>
              ) : <button disabled>Watch LIVE</button>}
              {creator.accepts_pk && creator.room_name ? <Link href={`/live/room/${encodeURIComponent(creator.room_name)}?mode=${encodeURIComponent(creator.mode)}`}>Challenge PK</Link> : null}
              <Link href="/creator-universe">Creator Universe</Link>
            </div>
          </article>
        ))}
      </section>

      <section className="holo-panel">
        <h2>Start creating</h2>
        <p>Go LIVE, sing through Mic/Karaoke/Vocal Box, compete in Showcase/Talent, turn highlights into reels, audition in StarVerse, create music in Aniyah 64-Track Studio, package shows for Isaiah AI TV, build movies in Omni Box, sell through Live Shopping and bring fans into Games/Living Worlds.</p>
        <div className="action-row">
          <Link href="/creator-universe">Open Creator Universe</Link>
          <Link href="/live-shopping">Open Live Shopping</Link>
          <Link href="/games">Enter Games</Link>
        </div>
        <p className="muted">Actual video publishing/joining becomes GREEN only after LiveKit credentials and a two-device camera/mic/chat/join/leave test pass. Until then, presence/discovery may work while video remains safely gated.</p>
      </section>
    </main>
  );
}
