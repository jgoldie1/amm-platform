'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authFetch } from '@/lib/supabase/client';

export default function CheckoutPage(){
 const params=useSearchParams(); const productId=params.get('product')??''; const [quantity,setQuantity]=useState(1); const [message,setMessage]=useState(productId?'Ready to create a server-verified order.':'Choose a product in Marketplace first.'); const [busy,setBusy]=useState(false);
 async function checkout(){if(!productId)return;setBusy(true);const r=await authFetch('/api/checkout',{method:'POST',body:JSON.stringify({productId,quantity})});const d=await r.json();setBusy(false);if(r.ok&&d.checkout?.checkoutUrl){window.location.href=d.checkout.checkoutUrl;return;}if(d.order&&d.error==='payment_provider_unavailable'){setMessage(`Order ${d.order.id} was created, but real payment is not configured yet. No charge was made.`);return;}setMessage(d.error??'Checkout could not start.');}
 return <main className="product-shell"><header className="product-header"><Link href="/" className="brand-link">TRYAMM</Link><nav className="product-nav"><Link href="/marketplace">Marketplace</Link><Link href="/wallet">Wallet</Link></nav></header><section className="product-hero"><p className="eyebrow">SERVER-VERIFIED CHECKOUT</p><h1>TRYAMM Checkout</h1><p className="lede">The browser never sets the authoritative price. TRYAMM re-reads the product, creates the order through RLS, then starts the configured payment provider.</p></section><section className="product-grid"><div className="backend-card"><p>Product: {productId||'None selected'}</p><label>Quantity<input min={1} max={99} type="number" value={quantity} onChange={e=>setQuantity(Math.max(1,Math.min(99,Number(e.target.value)||1)))} /></label><button disabled={!productId||busy} onClick={checkout}>{busy?'Preparing checkout…':'Continue to secure payment'}</button><p role="status" aria-live="polite">{message}</p></div><aside className="backend-card"><h2>Safety gates</h2><ul><li>Authenticated buyer</li><li>Database product price</li><li>Inventory check</li><li>Platform fee from server configuration</li><li>Payment provider must be configured</li><li>No fake successful payment state</li></ul></aside></section></main>;
}
