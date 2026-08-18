'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './JudahSplash.module.css';

const MIN_SPLASH_MS = 4200;
const MAX_SPLASH_MS = 9000;

export default function JudahSplash({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mountedAt = useRef(Date.now());
  const done = useRef(false);
  const [canEnter, setCanEnter] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [muted, setMuted] = useState(true);

  const finish = useCallback(() => {
    if (done.current) return;
    const remaining = Math.max(0, MIN_SPLASH_MS - (Date.now() - mountedAt.current));
    window.setTimeout(() => {
      if (done.current) return;
      done.current = true;
      onComplete();
    }, remaining);
  }, [onComplete]);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setCanEnter(true), 1200);
    const hardStop = window.setTimeout(finish, MAX_SPLASH_MS);
    const video = videoRef.current;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFallback(true);
    } else if (video) {
      // Start muted so mobile Safari/Chrome autoplay policies cannot hide the splash.
      video.muted = true;
      setMuted(true);
      video.currentTime = 0;
      void video.play().catch(() => setFallback(true));
    }

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(hardStop);
    };
  }, [finish]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    void video.play().catch(() => undefined);
  };

  return (
    <section className={styles.root} role="dialog" aria-modal="true" aria-label="TRYAMM Judah opening screen">
      <div className={styles.backdrop} />
      {fallback ? (
        <img className={styles.media} src="/brand/TRYAMM-Judah-Logo-App-Splash-Poster.jpg" alt="TRYAMM Lion of Judah holographic emblem" />
      ) : (
        <video
          ref={videoRef}
          className={styles.media}
          src="/brand/TRYAMM-Judah-Logo-App-Splash-POP.mp4"
          poster="/brand/TRYAMM-Judah-Logo-App-Splash-Poster.jpg"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={finish}
          onError={() => setFallback(true)}
        />
      )}

      <div className={styles.brandLockup} aria-hidden="true">
        <span className={styles.crown}>♛</span>
        <strong>TRYAMM</strong>
        <span>THE HOLOGRAPHIC GATEWAY</span>
      </div>

      <div className={styles.controls}>
        {!fallback && <button type="button" onClick={toggleSound}>{muted ? 'Play jingle' : 'Mute'}</button>}
        {canEnter && <button type="button" className={styles.enter} onClick={finish}>Enter TRYAMM</button>}
      </div>
    </section>
  );
}
