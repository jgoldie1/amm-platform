import { NextResponse } from 'next/server';

function cfg(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/,'');
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url&&key?{url,key}:null;
}
async function rest(path:string){
  const c=cfg(); if(!c) throw new Error('SUPABASE_PUBLIC_CONFIG_MISSING');
  const r=await fetch(`${c.url}/rest/v1/${path}`,{headers:{apikey:c.key,Authorization:`Bearer ${c.key}`},cache:'no-store'});
  if(!r.ok) throw new Error(`SUPABASE_${r.status}:${await r.text()}`);
  return r.json();
}
export async function GET(){
  try{
    const [sessions,listings,auctions,bids]=await Promise.all([
      rest('commerce_live_sessions?select=*&status=in.(scheduled,live)&order=starts_at.asc.nullslast&limit=50'),
      rest('commerce_listings?select=*&status=in.(active,live,scheduled)&order=created_at.desc&limit=100'),
      rest('commerce_auctions?select=*&status=in.(scheduled,live,open,ended)&order=ends_at.asc.nullslast&limit=100'),
      rest('commerce_bids?select=listing_id,amount,created_at&order=created_at.desc&limit=500'),
    ]);
    const highest=new Map<string,number>();
    for(const b of bids as any[]){const v=Number(b.amount);if(Number.isFinite(v)) highest.set(b.listing_id,Math.max(highest.get(b.listing_id)??0,v));}
    return NextResponse.json({sessions,listings,auctions:(auctions as any[]).map(a=>({...a,current_bid:highest.get(a.listing_id)??null}))});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'live_commerce_unavailable'},{status:503});}
}
