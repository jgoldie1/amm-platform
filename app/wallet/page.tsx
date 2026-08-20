'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/supabase/client';

type Wallet={id:string;currency:string;available_minor:number;pending_minor:number;reserve_minor:number;lifetime_earned_minor:number};
type Tx={id:string;currency:string;amount_minor:number;kind:string;reference:string|null;status:string;created_at:string};
const money=(minor:number,currency:string)=>new Intl.NumberFormat(undefined,{style:'currency',currency:currency||'USD'}).format((minor||0)/100);

export default function WalletPage(){
 const [wallets,setWallets]=useState<Wallet[]>([]),[txs,setTxs]=useState<Tx[]>([]),[message,setMessage]=useState('Loading wallet…');
 useEffect(()=>{(async()=>{const r=await authFetch('/api/wallet');const d=await r.json();if(!r.ok){setMessage(d.error==='unauthorized'?'Sign in to view Wallet + History.':d.error??'Unable to load wallet.');return;}setWallets(d.wallets??[]);setTxs(d.transactions??[]);setMessage('');})()},[]);
 return <main className="product-shell"><header className="product-header"><Link href="/" className="brand-link">TRYAMM</Link><nav className="product-nav"><Link href="/marketplace">Marketplace</Link><Link href="/creator">Creator</Link><Link href="/notifications">Notifications</Link></nav></header><section className="product-hero"><p className="eyebrow">MONEY ENGINE</p><h1>Wallet + History</h1><p className="lede">Purchases, creator earnings, gifts, provider payouts, refunds and ledger-backed history. Money-changing actions stay server-side and compliance-gated.</p></section><section className="product-grid"><div><p role="status">{message}</p><div className="feature-list">{wallets.map(w=><article key={w.id}><h2>{w.currency}</h2><p>Available: {money(w.available_minor,w.currency)}</p><p>Pending: {money(w.pending_minor,w.currency)}</p><p>Reserve: {money(w.reserve_minor,w.currency)}</p><p>Lifetime earned: {money(w.lifetime_earned_minor,w.currency)}</p></article>)}</div><h2>Recent activity</h2><div className="feature-list">{txs.map(t=><article key={t.id}><strong>{t.kind}</strong><p>{money(t.amount_minor,t.currency)} • {t.status}</p><p className="muted">{new Date(t.created_at).toLocaleString()} {t.reference?`• ${t.reference}`:''}</p></article>)}</div></div><aside className="backend-card"><h2>Protected by</h2><ul><li>Owner-only RLS reads</li><li>Money Engine ledger authority</li><li>Stripe/regulated payment gates</li><li>Quantum Security audit controls</li></ul></aside></section></main>;
}
