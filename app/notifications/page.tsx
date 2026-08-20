'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/supabase/client';

type Notice={id:string;channel:string;type:string;title:string;body:string;status:string;created_at:string;read_at:string|null};
export default function NotificationsPage(){
 const [items,setItems]=useState<Notice[]>([]),[message,setMessage]=useState('Loading notifications…');
 async function load(){const r=await authFetch('/api/notifications');const d=await r.json();if(!r.ok){setMessage(d.error==='unauthorized'?'Sign in to view notifications.':d.error??'Unable to load notifications.');return;}setItems(d.notifications??[]);setMessage('');}
 useEffect(()=>{void load()},[]);
 async function mark(id:string,read:boolean){await authFetch('/api/notifications',{method:'PATCH',body:JSON.stringify({id,read})});await load();}
 return <main className="product-shell"><header className="product-header"><Link href="/" className="brand-link">TRYAMM</Link><nav className="product-nav"><Link href="/feed">Feed</Link><Link href="/live">LIVE</Link><Link href="/wallet">Wallet</Link></nav></header><section className="product-hero"><p className="eyebrow">STAY CONNECTED</p><h1>Notifications</h1><p className="lede">LIVE, orders, bookings, payouts, messages, episodes, game/world events and service alerts.</p></section><section className="world-grid"><p role="status">{message}</p><div className="cards">{items.map(n=><article key={n.id}><p className="eyebrow">{n.channel} • {n.type}</p><h2>{n.title}</h2><p>{n.body}</p><p className="muted">{new Date(n.created_at).toLocaleString()}</p><button onClick={()=>mark(n.id,!n.read_at)}>{n.read_at?'Mark unread':'Mark read'}</button></article>)}</div></section></main>;
}
