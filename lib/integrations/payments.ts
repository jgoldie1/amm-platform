import { requireCapability } from '@/lib/runtime/env';

export interface CheckoutRequest {
  orderId: string;
  customerId: string;
  amountMinor: number;
  currency: string;
  connectedAccountId?: string;
  applicationFeeMinor?: number;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  provider: 'stripe';
  checkoutUrl: string;
  externalId: string;
}

export async function createCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
  requireCapability('stripe');
  const endpoint = process.env.STRIPE_CHECKOUT_ADAPTER_URL;
  if (!endpoint) throw new Error('Stripe checkout adapter is not configured; refusing to create a fake checkout.');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
    body: JSON.stringify(request),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Stripe checkout adapter failed with ${response.status}`);
  const body = (await response.json()) as { url?: string; id?: string };
  if (!body.url || !body.id) throw new Error('Stripe checkout adapter returned an incomplete response');
  return { provider: 'stripe', checkoutUrl: body.url, externalId: body.id };
}
