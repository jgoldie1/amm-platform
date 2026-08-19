import { NextResponse } from 'next/server';

function config(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/,'');
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url&&key?{url,key}:null;
}
async function publicRest(path:string){
  const c=config(); if(!c) throw new Error('SUPABASE_PUBLIC_CONFIG_MISSING');
  const res=await fetch(`${c.url}/rest/v1/${path}`,{headers:{apikey:c.key,Authorization:`Bearer ${c.key}`},cache:'no-store'});
  if(!res.ok) throw new Error(`SUPABASE_${res.status}`);
  return res.json();
}
export async function GET(){
  try{
    const channels=await publicRest('tv_channels?select=id,name,slug,description,logo_url,playback_url,playback_type,channel_number,category,country_code,language_code,is_news,is_featured,worldwide_distribution,allowed_territories,blocked_territories,rights_expires_at&is_active=eq.true&order=sort_order.asc.nullslast,channel_number.asc.nullslast&limit=200');
    return NextResponse.json({channels});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'tv_unavailable'},{status:503});}
}
