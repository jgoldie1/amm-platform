import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';
import { createCheckout } from '@/lib/integrations/payments';

export async function POST(request: Request) {
  const token=bearerToken(request);
  if(!token) return NextResponse.json({error:'unauthorized'},{status:401});
  const user=await verifySupabaseUser(token);
  if(!user) return NextResponse.json({error:'invalid_session'},{status:401});
  const body=await request.json();
  if(!body.productId) return NextResponse.json({error:'missing_product'},{status:400});
  const products=await userRest(token,`products?select=id,creator_id,name,price,currency,inventory,status&id=eq.${encodeURIComponent(body.productId)}&status=eq.active&limit=1`);
  const product=Array.isArray(products)?products[0]:null;
  if(!product) return NextResponse.json({error:'product_not_found'},{status:404});
  const quantity=Math.max(1,Math.min(99,Number.isInteger(body.quantity)?body.quantity:1));
  if(typeof product.inventory==='number' && product.inventory<quantity) return NextResponse.json({error:'insufficient_inventory'},{status:409});
  const amount=Number(product.price)*quantity;
  if(!Number.isFinite(amount)||amount<0) return NextResponse.json({error:'invalid_catalog_price'},{status:500});
  const feeBps=Math.max(0,Math.min(10000,Number(process.env.TRYAMM_MARKETPLACE_FEE_BPS??0)||0));
  const ammCut=Math.round(amount*feeBps)/10000;
  const sellerCut=amount-ammCut;
  const orders=await userRest(token,'orders',{method:'POST',prefer:'return=representation',body:{product_id:product.id,buyer_id:user.id,seller_id:product.creator_id,amount,amm_cut:ammCut,seller_cut:sellerCut,status:'payment_pending',currency:product.currency??'USD',quantity}});
  const order=Array.isArray(orders)?orders[0]:null;
  if(!order) return NextResponse.json({error:'order_creation_failed'},{status:500});
  try{
    const origin=new URL(request.url).origin;
    const checkout=await createCheckout({orderId:order.id,customerId:user.id,amountMinor:Math.round(amount*100),currency:String(product.currency??'USD').toLowerCase(),applicationFeeMinor:Math.round(ammCut*100),successUrl:`${origin}/wallet?checkout=success`,cancelUrl:`${origin}/marketplace?checkout=cancelled`});
    await userRest(token,`orders?id=eq.${encodeURIComponent(order.id)}&buyer_id=eq.${encodeURIComponent(user.id)}`,{method:'PATCH',prefer:'return=representation',body:{stripe_checkout_session_id:checkout.externalId}}).catch(()=>undefined);
    return NextResponse.json({order,checkout});
  }catch(error){
    return NextResponse.json({order,error:'payment_provider_unavailable',detail:error instanceof Error?error.message:'checkout unavailable'},{status:503});
  }
}
