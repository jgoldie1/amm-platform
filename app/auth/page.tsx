'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin'|'signup'>('signin');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setMessage('');
    try {
      const supabase = createClient();
      const result = mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
      if (result.error) throw result.error;
      setMessage(mode === 'signup' && !result.data.session ? 'Account created. Check your email if confirmation is required.' : 'Signed in.');
      if (result.data.session) window.location.href = '/feed';
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Authentication failed.');
    } finally { setBusy(false); }
  }

  async function signOut() {
    await createClient().auth.signOut();
    setMessage('Signed out.');
  }

  return (
    <main className="product-shell">
      <header className="product-header"><Link href="/" className="brand-link">TRYAMM</Link><Link href="/settings">Accessibility + Language</Link></header>
      <section className="product-hero">
        <p className="eyebrow">SECURE ACCESS</p><h1>{signedIn ? 'You are signed in' : mode === 'signin' ? 'Sign in to TRYAMM' : 'Create your TRYAMM account'}</h1>
        <p className="lede">One account for Feed, LIVE/PK, Games, Stubbs AI, HoloForge, Marketplace, Omni Box, Wallet and creator tools.</p>
      </section>
      <section className="product-grid">
        <div>
          {!signedIn ? <form onSubmit={submit} className="backend-card" aria-label="Authentication form">
            <label>Email<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} /></label>
            <label>Password<input required minLength={8} type="password" autoComplete={mode==='signin'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)} /></label>
            <button disabled={busy} type="submit">{busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
            <button type="button" className="secondary" onClick={()=>setMode(mode==='signin'?'signup':'signin')}>{mode==='signin'?'Need an account? Sign up':'Already have an account? Sign in'}</button>
          </form> : <div className="backend-card"><Link href="/feed" className="button-link">Open Feed</Link><button type="button" className="secondary" onClick={signOut}>Sign out</button></div>}
          <p role="status" aria-live="polite">{message}</p>
        </div>
        <aside className="backend-card"><h2>Account protections</h2><ul><li>Supabase Auth session</li><li>RLS controls data access</li><li>Private wallet/history remains owner-only</li><li>Accessibility and multilingual settings follow your profile</li></ul></aside>
      </section>
    </main>
  );
}
