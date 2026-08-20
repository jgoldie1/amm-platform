'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import translations from '@/lib/translations';
import { getAccessibilitySettings } from '@/lib/a11y';

export default function Home() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const settings = getAccessibilitySettings();
    setLanguage(settings.language);
  }, []);

  const t = (key: string) => translations[language]?.[key] || translations.en[key] || key;

  return (
    <div className="container">
      <h1>{t('home.title')}</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}><em>{t('home.subtitle')}</em></p>

      <section aria-labelledby="intro-heading">
        <h2 id="intro-heading">About AMM Platform</h2>
        <p>{t('home.description')}</p>
      </section>

      <section aria-labelledby="cta-heading" style={{ marginTop: '40px' }}>
        <h2 id="cta-heading">Get Started</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
          <Link href="/streetverse"><button type="button">Enter StreetVerse</button></Link>
          <Link href="/marketplace"><button type="button">{t('home.exploreMarketplace')}</button></Link>
          <Link href="/streaming"><button type="button">{t('home.startStreaming')}</button></Link>
          <Link href="/ai"><button type="button">{t('home.tryAI')}</button></Link>
          <Link href="/academy"><button type="button">{t('home.learnMore')}</button></Link>
        </div>
      </section>

      <section aria-labelledby="features-heading" style={{ marginTop: '60px' }}>
        <h2 id="features-heading">Why Choose AMM?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <article className="card"><h3>🎯 Accessibility-First Design</h3><p>Built so creators can participate with keyboard, touch, assistive technology and adaptable interaction modes.</p></article>
          <article className="card"><h3>🤖 AI-Powered Tools</h3><p>Accessible AI assistance for creation and navigation.</p></article>
          <article className="card"><h3>🌍 Multi-Language Support</h3><p>Create and consume content in supported languages.</p></article>
          <article className="card"><h3>🎮 Immersive Worlds</h3><p>StreetVerse and the Reality Lab provide the active finish-and-prove game slice.</p></article>
          <article className="card"><h3>🔐 Privacy First</h3><p>Player-safe state boundaries and server-side controls are part of the architecture.</p></article>
          <article className="card"><h3>🎓 Learning</h3><p>Creator learning and accessibility guidance remain part of the platform.</p></article>
        </div>
      </section>
    </div>
  );
}
