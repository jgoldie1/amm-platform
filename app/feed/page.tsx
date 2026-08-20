'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { authFetch, createClient } from '@/lib/supabase/client';

type Post = { id:string; user_id:string; body:string|null; media_url:string|null; media_type:string|null; locale:string|null; visibility:string; created_at:string };

export default function FeedPage() {
  const [posts,setPosts]=useState<Post[]>([]);
  const [body,setBody]=useState('');
  const [mediaUrl,setMediaUrl]=useState('');
  const [message,setMessage]=useState('Loading feed…');
  const [busy,setBusy]=useState(false);

  async function load() {
    const { data:{ session } } = await createClient().auth.getSession();
    if (!session) { setMessage('Sign in to load your TRYAMM feed.'); return; }
    const res=await authFetch('/api/feed');
    const data=await res.json();
    if (!res.ok) { setMessage(data.error ?? 'Unable to load feed.'); return; }
    setPosts(data.posts ?? []); setMessage(data.posts?.length ? '' : 'No posts yet. Be the first to create one.');
  }
  useEffect(()=>{ void load(); },[]);

  async function publish(event:FormEvent){
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const res=await authFetch('/api/feed',{method:'POST',body:JSON.stringify({body,mediaUrl:mediaUrl||null,mediaType:mediaUrl?'video':null,visibility:'public',locale:navigator.language||'en'})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error ?? 'Could not publish.');
      setBody(''); setMediaUrl(''); setMessage('Published.'); await load();
    } catch(error){ setMessage(error instanceof Error?error.message:'Could not publish.'); }
    finally{setBusy(false)}
  }

  return <main className="product-shell">
    <header className="product-header"><Link href="/" className="brand-link">TRYAMM</Link><nav className="product-nav"><Link href="/live">LIVE</Link><Link href="/games">Games</Link><Link href="/omni-box">Omni Box</Link><Link href="/holoforge">HoloForge</Link></nav><Link href="/creator" className="pill-link">Creator</Link></header>
    <section className="product-hero"><p className="eyebrow">DISCOVER • CREATE • CONNECT</p><h1>TRYAMM Feed</h1><p className="lede">Creator posts, game moments, LIVE replays, Omni Box clips and marketplace discovery in one accessible feed.</p></section>
    <section className="product-grid">
      <div>
        <form className="backend-card" onSubmit={publish}><h2>Create a post</h2><label>Message<textarea value={body} onChange={e=>setBody(e.target.value)} rows={4} placeholder="What are you creating?" /></label><label>Media URL (optional)<input value={mediaUrl} onChange={e=>setMediaUrl(e.target.value)} type="url" placeholder="https://…" /></label><button disabled={busy}>{busy?'Publishing…':'Publish'}</button></form>
        <p role="status" aria-live="polite">{message}</p>
        <div className="feature-list">{posts.map(post=><article key={post.id}><p className="eyebrow">{post.locale ?? 'GLOBAL'} • {new Date(post.created_at).toLocaleString()}</p>{post.body&&<p>{post.body}</p>}{post.media_url&&<a href={post.media_url} target="_blank" rel="noreferrer">Open media →</a>}</article>)}</div>
      </div>
      <aside className="backend-card"><h2>Connected</h2><ul><li>Supabase Auth + RLS</li><li>Realtime-ready feed tables</li><li>LIVE/PK, Games and Omni Box entry points</li><li>Moderation and translation hooks</li></ul></aside>
    </section>
  </main>;
}
