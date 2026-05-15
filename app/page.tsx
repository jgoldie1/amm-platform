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

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  return (
    <div className="container">
      {/* Page heading - using semantic HTML */}
      <h1>{t('home.title')}</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        <em>{t('home.subtitle')}</em>
      </p>

      {/* Main introduction section */}
      <section aria-labelledby="intro-heading">
        <h2 id="intro-heading">About AMM Platform</h2>
        <p>{t('home.description')}</p>
      </section>

      {/* Call to action buttons */}
      <section aria-labelledby="cta-heading" style={{ marginTop: '40px' }}>
        <h2 id="cta-heading">Get Started</h2>
        
        {/* Buttons with proper spacing for accessibility */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
          <Link href="/marketplace">
            <button type="button">
              {t('home.exploreMarketplace')}
            </button>
          </Link>
          
          <Link href="/streaming">
            <button type="button">
              {t('home.startStreaming')}
            </button>
          </Link>
          
          <Link href="/ai">
            <button type="button">
              {t('home.tryAI')}
            </button>
          </Link>
          
          <Link href="/academy">
            <button type="button">
              {t('home.learnMore')}
            </button>
          </Link>
        </div>
      </section>

      {/* Features section */}
      <section aria-labelledby="features-heading" style={{ marginTop: '60px' }}>
        <h2 id="features-heading">Why Choose AMM?</h2>
        
        {/* Feature cards with semantic HTML */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {/* Feature 1 */}
          <article style={{ 
            padding: '20px', 
            border: '1px solid #dee2e6', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>🎯 Accessibility-First Design</h3>
            <p>Built from the ground up for inclusive design, ensuring all creators can participate.</p>
          </article>

          {/* Feature 2 */}
          <article style={{ 
            padding: '20px', 
            border: '1px solid #dee2e6', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>🤖 AI-Powered Tools</h3>
            <p>Leverage accessible AI assistance to create better content, faster.</p>
          </article>

          {/* Feature 3 */}
          <article style={{ 
            padding: '20px', 
            border: '1px solid #dee2e6', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>🌍 Multi-Language Support</h3>
            <p>Create and consume content in your preferred language.</p>
          </article>

          {/* Feature 4 */}
          <article style={{ 
            padding: '20px', 
            border: '1px solid #dee2e6', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>📱 Mobile Friendly</h3>
            <p>Works great on phones, tablets, and computers with full keyboard support.</p>
          </article>

          {/* Feature 5 */}
          <article style={{ 
            padding: '20px', 
            border: '1px solid #dee2e6', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>🔐 Privacy First</h3>
            <p>Your data is yours. We respect your privacy from day one.</p>
          </article>

          {/* Feature 6 */}
          <article style={{ 
            padding: '20px', 
            border: '1px solid #dee2e6', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>🎓 Free Learning</h3>
            <p>Access our creator academy to learn accessibility best practices.</p>
          </article>
        </div>
      </section>

      {/* Call to action */}
      <section style={{ marginTop: '60px', marginBottom: '60px', textAlign: 'center' }}>
        <h2>Ready to Start Creating?</h2>
        <p>Join thousands of accessible creators building a better internet.</p>
        <Link href="/academy">
          <button type="button" style={{ marginTop: '20px', padding: '15px 40px', fontSize: '18px' }}>
            Learn More in Academy
          </button>
        </Link>
      </section>
    </div>
  );
}
