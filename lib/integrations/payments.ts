import { randomBytes } from 'node:crypto';
import { requireCapability } from '@/lib/runtime/env';

export interface CheckoutRequest {
  orderId: string;
  customerId: string;
  productName: string;
  amountMinor: number;
  currency: string;
  connectedAccountId?: string;
  applicationFeeMinor?: number;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult { provider:'stripe'; checkoutUrl:string; externalId:string; }

export async function createCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
  requireCapability('stripe');
  const key=process.env.STRIPE_RESTRICTED_KEY ?? process.env.STRIPE_SECRET_KEY;
  if(!key) throw new Error('Stripe key unavailable');
  const form=new URLSearchParams();
  form.set('mode','payment');
  form.set('success_url',request.successUrl);
  form.set('cancel_url',request.cancelUrl);
  form.set('client_reference_id',request.orderId);
  form.set('metadata[order_id]',request.orderId);
  form.set('metadata[customer_id]',request.customerId);
  form.set('line_items[0][price_data][currency]',request.currency.toLowerCase());
  form.set('line_items[0][price_data][unit_amount]',String(request.amountMinor));
  form.set('line_items[0][price_data][product_data][name]',request.productName.slice(0,250));
  form.set('line_items[0][quantity]','1');
  form.set('integration_identifier',`tryamm_checkout_${randomBytes(4).toString('hex')}`);
  if(request.connectedAccountId){
    form.set('payment_intent_data[transfer_data][destination]',request.connectedAccountId);
    if((request.applicationFeeMinor??0)>0) form.set('payment_intent_data[application_fee_amount]',String(request.applicationFeeMinor));
  }
  const response=await fetch('https://api.stripe.com/v1/checkout/sessions',{
    method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/x-www-form-urlencoded','Stripe-Version':'2026-06-24.dahlia'},body:form,cache:'no-store'
  });
  const body=await response.json() as {id?:string;url?:string;error?:{message?:string}};
  if(!response.ok||!body.id||!body.url) throw new Error(body.error?.message??`Stripe checkout failed with ${response.status}`);
  return {provider:'stripe',checkoutUrl:body.url,externalId:body.id};
}
