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

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  return (
    <div className="container">
      <h1>{t('accessibility.title')}</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        <em>{t('accessibility.description')}</em>
      </p>

      {/* Key Features */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading">{t('accessibility.features')}</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {/* Keyboard Navigation */}
          <article>
            <h3>{t('accessibility.keyboardNav')}</h3>
            <p>{t('accessibility.keyboardNavDesc')}</p>
          </article>

          {/* High Contrast */}
          <article>
            <h3>{t('accessibility.highContrastMode')}</h3>
            <p>{t('accessibility.highContrastDesc')}</p>
          </article>

          {/* Large Text */}
          <article>
            <h3>{t('accessibility.largeTextMode')}</h3>
            <p>{t('accessibility.largeTextDesc')}</p>
          </article>

          {/* Multi-Language */}
          <article>
            <h3>{t('accessibility.multiLanguage')}</h3>
            <p>{t('accessibility.multiLanguageDesc')}</p>
          </article>

          {/* Screen Reader */}
          <article>
            <h3>{t('accessibility.screenReader')}</h3>
            <p>{t('accessibility.screenReaderDesc')}</p>
          </article>

          {/* Mobile Friendly */}
          <article>
            <h3>📱 Mobile Friendly</h3>
            <p>Works perfectly on phones, tablets, and computers with full accessibility.</p>
          </article>
        </div>
      </section>

      {/* Keyboard Shortcuts Table */}
      <section aria-labelledby="shortcuts-heading" style={{ marginTop: '60px' }}>
        <h2 id="shortcuts-heading">{t('accessibility.shortcuts')}</h2>
        
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #ddd'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                  Shortcut
                </th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                  Action
                </th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map((shortcut, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>
                    <code style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
                      {shortcut.key}
                    </code>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {shortcut.route ? (
                      <a href={shortcut.route}>{shortcut.description}</a>
                    ) : (
                      shortcut.description
                    )}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                    {shortcut.route 
                      ? `Navigate to ${shortcut.description}`
                      : 'Use this key to interact with focused element'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Screen Reader Guidance */}
      <section aria-labelledby="screenreader-heading" style={{ marginTop: '60px', backgroundColor: '#f8f9fa', padding: '24px', borderRadius: '8px' }}>
        <h2 id="screenreader-heading">Screen Reader Support</h2>
        <p>AMM Platform is fully compatible with:</p>
        <ul style={{ marginLeft: '20px', marginTop: '12px', lineHeight: '1.8' }}>
          <li><strong>NVDA</strong> (Windows - Free)</li>
          <li><strong>JAWS</strong> (Windows - Professional)</li>
          <li><strong>VoiceOver</strong> (Mac, iOS, iPad)</li>
          <li><strong>TalkBack</strong> (Android)</li>
          <li><strong>Narrator</strong> (Windows)</li>
        </ul>
      </section>

      {/* Accessibility Standards */}
      <section aria-labelledby="standards-heading" style={{ marginTop: '60px' }}>
        <h2 id="standards-heading">Accessibility Standards</h2>
        <p>AMM Platform meets or exceeds WCAG 2.1 Level AA compliance:</p>
        <ul style={{ marginLeft: '20px', marginTop: '12px', lineHeight: '1.8' }}>
          <li><strong>Perceivable:</strong> Content is visible and readable for everyone</li>
          <li><strong>Operable:</strong> Full keyboard navigation, no time limits</li>
          <li><strong>Understandable:</strong> Clear language, consistent design</li>
          <li><strong>Robust:</strong> Works with all assistive technologies</li>
        </ul>
      </section>

      {/* Feedback */}
      <section aria-labelledby="feedback-heading" style={{ marginTop: '60px', backgroundColor: '#e8f4f8', padding: '24px', borderRadius: '8px' }}>
        <h2 id="feedback-heading">Found an Accessibility Issue?</h2>
        <p>
          We're committed to continuous improvement. If you encounter any barriers or have suggestions, please{' '}
          <a href="https://github.com/jgoldie1/amm-platform/issues" target="_blank" rel="noopener noreferrer">
            report it on GitHub
          </a>
          {' '}or send us feedback.
        </p>
      </section>

      {/* Tips */}
      <section aria-labelledby="tips-heading" style={{ marginTop: '60px' }}>
        <h2 id="tips-heading">Tips for Best Experience</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          <article>
            <h3>🎯 Use Keyboard Navigation</h3>
            <p>Press Tab to move forward, Shift+Tab to move backward through all interactive elements.</p>
          </article>

          <article>
            <h3>🌓 Enable High Contrast</h3>
            <p>Use the High Contrast option in the header for better visibility in bright or low light.</p>
          </article>

          <article>
            <h3>📖 Enable Large Text</h3>
            <p>Use the Large Text option to increase font size by 25% for easier reading.</p>
          </article>

          <article>
            <h3>🌍 Change Language</h3>
            <p>Select your preferred language (EN, ES, FR, DE) to see content in your language.</p>
          </article>

          <article>
            <h3>🔊 Use Screen Reader</h3>
            <p>Enable your device's screen reader to have all content read aloud.</p>
          </article>

          <article>
            <h3>⌨️ Learn Shortcuts</h3>
            <p>Use keyboard shortcuts (Alt+Key) for quick navigation to different sections.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
