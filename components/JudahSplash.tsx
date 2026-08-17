'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './JudahSplash.module.css';

export default function JudahSplash({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const done = useRef(false);
  const retried = useRef(false);
  const lastProgress = useRef(Date.now());
  const [skip, setSkip] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [muted, setMuted] = useState(false);

  const finish = useCallback(() => { if (!done.current) { done.current = true; onComplete(); } }, [onComplete]);
  const recover = useCallback(() => {
    const video = videoRef.current;
    if (!video) return finish();
    if (!retried.current) {
      retried.current = true;
      video.currentTime = 0;
      void video.play().catch(() => { video.muted = true; setMuted(true); void video.play().catch(() => setFallback(true)); });
    } else { setFallback(true); window.setTimeout(finish, 450); }
  }, [finish]);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setFallback(true); const t = setTimeout(finish, 650); return () => clearTimeout(t); }
    const skipTimer = setTimeout(() => setSkip(true), 900);
    const hardStop = setTimeout(finish, 5200);
    const watchdog = setInterval(() => {
      const video = videoRef.current;
      if (video && !video.paused && !video.ended && Date.now() - lastProgress.current > 1800) recover();
    }, 300);
    return () => { clearTimeout(skipTimer); clearTimeout(hardStop); clearInterval(watchdog); };
  }, [finish, recover]);

  return <section className={styles.root} role="dialog" aria-label="TRYAMM opening screen">
    {fallback ? <img src="/brand/TRYAMM-Judah-Logo-App-Splash-Poster.jpg" alt="TRYAMM Lion of Judah emblem" /> :
      <video ref={videoRef} src="/brand/TRYAMM-Judah-Logo-App-Splash-POP.mp4" poster="/brand/TRYAMM-Judah-Logo-App-Splash-Poster.jpg" autoPlay playsInline preload="auto" onTimeUpdate={() => { lastProgress.current = Date.now(); }} onEnded={finish} onError={recover} />}
    <div className={styles.controls}>{!fallback && <button type="button" onClick={() => { const video=videoRef.current; if(video){video.muted=!video.muted;setMuted(video.muted);void video.play().catch(recover);}}}>{muted?'Play jingle':'Mute'}</button>}{skip&&<button type="button" onClick={finish}>Enter TRYAMM</button>}</div>
  </section>;
}
