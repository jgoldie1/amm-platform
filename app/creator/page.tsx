'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/supabase/client';

type Profile={id:string;name:string|null;email:string|null;avatar_url:string|null;subscription_tier:string|null;subscription_active:boolean|null;amm_tokens:number|null;is_creator:boolean|null};

export default function CreatorPage(){
  const [profile,setProfile]=useState<Profile|null>(null); const [name,setName]=useState(''); const [avatarUrl,setAvatarUrl]=useState(''); const [message,setMessage]=useState('Loading profile…');
  async function load(){const res=await authFetch('/api/profile');const data=await res.json();if(!res.ok){setMessage(data.error==='unauthorized'?'Sign in to edit your creator profile.':data.error??'Unable to load profile.');return;}setProfile(data.profile);setName(data.profile?.name??'');setAvatarUrl(data.profile?.avatar_url??'');setMessage('');}
  useEffect(()=>{void load()},[]);
  async function save(e:FormEvent){e.preventDefault();const res=await authFetch('/api/profile',{method:'PATCH',body:JSON.stringify({name,avatarUrl,isCreator:true})});const data=await res.json();if(!res.ok){setMessage(data.error??'Unable to save.');return;}setProfile(data.profile);setMessage('Creator profile saved.');}
  return <main className="product-shell"><header className="product-header"><Link href="/" className="brand-link">TRYAMM</Link><nav className="product-nav"><Link href="/feed">Feed</Link><Link href="/live">LIVE</Link><Link href="/holoforge">HoloForge</Link><Link href="/marketplace">Store</Link><Link href="/wallet">Earnings</Link></nav></header>
  <section className="product-hero"><p className="eyebrow">BUILD YOUR WORLD</p><h1>Creator Profile</h1><p className="lede">Your public creator identity and launch point for LIVE, HoloForge, Omni Box, games, music, store and earnings.</p></section>
  <section className="product-grid"><div><form className="backend-card" onSubmit={save}><label>Display name<input value={name} maxLength={100} onChange={e=>setName(e.target.value)} /></label><label>Avatar URL<input value={avatarUrl} type="url" onChange={e=>setAvatarUrl(e.target.value)} /></label><button>Save creator profile</button></form><p role="status" aria-live="polite">{message}</p></div><aside className="backend-card"><h2>Creator status</h2><p>{profile?.email??'Sign in required'}</p><ul><li>Creator: {profile?.is_creator?'Yes':'Not enabled yet'}</li><li>Subscription: {profile?.subscription_tier??'free'}</li><li>TRYAMM tokens: {profile?.amm_tokens??0}</li></ul><div className="actions"><Link className="button-link" href="/live">Go LIVE</Link><Link className="button-link secondary" href="/holoforge">Create in HoloForge</Link></div></aside></section></main>
}
