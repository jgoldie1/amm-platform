'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Channel={id:string;name:string;slug:string;description:string|null;logo_url:string|null;playback_url:string|null;playback_type:string|null;channel_number:number|null;category:string|null;country_code:string|null;language_code:string|null;is_news:boolean|null;is_featured:boolean|null;worldwide_distribution:boolean|null;rights_expires_at:string|null};
export default function OmniBoxPage(){
 const [channels,setChannels]=useState<Channel[]>([]),[message,setMessage]=useState('Loading Free TV…');
 useEffect(()=>{fetch('/api/tv').then(async r=>({r,d:await r.json()})).then(({r,d})=>{if(!r.ok){setMessage(d.error??'TV unavailable.');return;}setChannels(d.channels??[]);setMessage(d.channels?.length?'':'No active channels are published yet.');}).catch(()=>setMessage('TV unavailable.'))},[]);
 return <main className="product-shell"><header className="product-header"><Link href="/" className="brand-link">TRYAMM</Link><nav className="product-nav"><Link href="/feed">Feed</Link><Link href="/live">LIVE</Link><Link href="/games">Games</Link><Link href="/holoforge">Create</Link></nav></header><section className="product-hero"><p className="eyebrow">FREE TV • SHORT DRAMA • CREATOR CHANNELS</p><h1>Omni Box</h1><p className="lede">Free/ad-supported TV, creator channels, short dramas, LIVE events and game/world programming. Playback is shown only for active channels whose distribution rights are recorded.</p></section><section className="world-grid"><p role="status">{message}</p><div className="cards">{channels.map(c=><article key={c.id}>{c.logo_url&&<img src={c.logo_url} alt="" style={{maxWidth:'100%',maxHeight:120}}/>}<p className="eyebrow">CH {c.channel_number??'—'} • {(c.language_code??'global').toUpperCase()}</p><h2>{c.name}</h2><p>{c.description}</p><p className="muted">{c.category??'TV'} {c.country_code?`• ${c.country_code}`:''} {c.worldwide_distribution?'• Worldwide':''}</p>{c.playback_url?<a className="button-link" href={c.playback_url} target="_blank" rel="noreferrer">Watch →</a>:<span className="muted">Playback not published</span>}</article>)}</div></section></main>;
}
