'use client';

import { useState, useEffect } from 'react';
import translations from '@/lib/translations';
import { getAccessibilitySettings, getKeyboardShortcuts } from '@/lib/a11y';

export default function AccessibilityPage() {
  const [language, setLanguage] = useState('en');
  const shortcuts = getKeyboardShortcuts();

  useEffect(() => {
    const settings = getAccessibilitySettings();
    setLanguage(settings.language);
  }, []);

  const t = (key: string) => translations[language]?.[key] || translations.en[key] || key;

  return (
    <div className="container">
      <h1>{t('accessibility.title')}</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        <em>{t('accessibility.description')}</em>
      </p>

      <section aria-labelledby="features-heading">
        <h2 id="features-heading">{t('accessibility.features')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <article><h3>{t('accessibility.keyboardNav')}</h3><p>{t('accessibility.keyboardNavDesc')}</p></article>
          <article><h3>{t('accessibility.highContrastMode')}</h3><p>{t('accessibility.highContrastDesc')}</p></article>
          <article><h3>{t('accessibility.largeTextMode')}</h3><p>{t('accessibility.largeTextDesc')}</p></article>
          <article><h3>{t('accessibility.multiLanguage')}</h3><p>{t('accessibility.multiLanguageDesc')}</p></article>
          <article><h3>{t('accessibility.screenReader')}</h3><p>{t('accessibility.screenReaderDesc')}</p></article>
          <article><h3>📱 Mobile Friendly</h3><p>Works on phones, tablets, and computers with accessibility support.</p></article>
        </div>
      </section>

      <section aria-labelledby="shortcuts-heading" style={{ marginTop: '60px' }}>
        <h2 id="shortcuts-heading">{t('accessibility.shortcuts')}</h2>
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead><tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Shortcut</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Action</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Description</th>
            </tr></thead>
            <tbody>{shortcuts.map((shortcut, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}><code style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>{shortcut.key}</code></td>
                <td style={{ padding: '12px' }}>{shortcut.route ? <a href={shortcut.route}>{shortcut.description}</a> : shortcut.description}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>{shortcut.route ? `Navigate to ${shortcut.description}` : 'Use this key to interact with focused element'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="screenreader-heading" style={{ marginTop: '60px', backgroundColor: '#f8f9fa', padding: '24px', borderRadius: '8px' }}>
        <h2 id="screenreader-heading">Screen Reader Support</h2>
        <p>AMM Platform is designed to work with NVDA, JAWS, VoiceOver, TalkBack and Narrator.</p>
      </section>

      <section aria-labelledby="standards-heading" style={{ marginTop: '60px' }}>
        <h2 id="standards-heading">Accessibility Standards</h2>
        <p>Accessibility is tested against WCAG 2.1 AA goals; conformance claims should only be made after current audit evidence passes.</p>
      </section>

      <section aria-labelledby="feedback-heading" style={{ marginTop: '60px', backgroundColor: '#e8f4f8', padding: '24px', borderRadius: '8px' }}>
        <h2 id="feedback-heading">Found an Accessibility Issue?</h2>
        <p><a href="https://github.com/jgoldie1/amm-platform/issues" target="_blank" rel="noopener noreferrer">Report it on GitHub</a>.</p>
      </section>
    </div>
  );
}
