# TRYAMM Money Engine + Global Creator Markets

## Core flywheel
Top-Up + HoloGPT Credits + Marketplace + eligible LIVE/gifts + tickets/PPV + subscriptions + advertising/sponsorship + creator tools + authorized media distribution → Money Engine → creator/rightsholder/collaborator shares + TRYAMM share → analytics → CREATE AGAIN.

## One authoritative ledger
All monetization surfaces route through one server-authoritative Money Engine. Client applications may request checkout or display balances, but they cannot authoritatively set price, split, balance, payout status, refund state or entitlement.

### Separate balances
- HoloGPT Credits — platform/AI/creator-service usage credits.
- Streaming/Creator Top-Up — eligible prepaid production/streaming capacity.
- Coins/Gifts — audience interaction balance where permitted.
- Creator Earnings — payable creator proceeds.
- Pending/Reserve — funds held for fraud/refund/dispute/tax/provider reasons.

Never silently convert balances.

## Transaction envelope
Every transaction stores:
- immutable transaction ID;
- idempotency key;
- provider + provider event ID;
- user/account/creator IDs;
- product/service/license ID;
- gross amount + currency;
- provider fee where known;
- tax/withholding where applicable;
- TRYAMM platform share;
- creator share;
- rightsholder/collaborator shares;
- reserve/hold amount;
- refund/dispute state;
- payout state;
- territory/provider/category eligibility snapshot;
- security decision/audit reference;
- created/settled timestamps.

## Provider adapters
Provider-neutral interface:
createCheckout → verifyWebhook → normalizeEvent → postLedgerEntry → fulfillEntitlement → reconcile → refund/reverse → payout/transfer where supported.

Adapters may include Paystack, Flutterwave, Stripe or other eligible regional providers. An adapter remains DISABLED until the real merchant account, country, currency, transaction category, webhook signature verification and sandbox/production test are confirmed.

## Regional market graph
Africa LIVE Now:
Nigeria → South Africa → Ghana → Kenya → East Africa → West Africa → Southern Africa → Francophone Africa → Global.

Haiti/Diaspora:
Haiti → Haitian Diaspora → Caribbean → Chicago/US Diaspora → Canada → UK/Europe → Latin America → Africa ↔ Caribbean → Global.

Discovery lanes do not create separate wallets. One identity and Money Engine follow the user, while language, currency display, provider availability, rights and compliance adapt by territory.

## Low-bandwidth creator mode
Data saver → audio-only LIVE → offline drafts → resumable uploads → delayed HD/GLB fetch → low-poly asset variant → adaptive bitrate → regional CDN/edge → automatic Holographic-Level downgrade → reconnect/rejoin → durable checkpoint recovery.

A creator should never lose a draft or full upload because a network drops mid-transfer.

## Monetization surfaces
- Top-Up / production capacity
- HoloGPT usage
- HoloForge generation/rendering
- LIVE gifts where permitted
- tickets / PPV / premieres
- subscriptions/memberships
- Marketplace digital/physical goods
- authorized asset/world/license sales
- ads and sponsorships
- creator SaaS/pro tools
- media distribution / VOD / authorized royalties
- creator collaboration/revenue-share agreements

## Analytics feedback loop
Money Engine emits privacy-aware business events into analytics:
view → follow → conversion → transaction → refund/dispute → net creator proceeds → TRYAMM revenue → top-up/credit usage → retention → next creation.

Analytics can recommend actions but cannot fabricate earnings, silently change prices/splits, or manipulate users into spending.

## Security containment
Before privileged money actions:
account risk → step-up/passkey when required → Panic Mode/global security state → provider/category/territory check → idempotency/replay protection → ledger post.

Panic Mode can freeze new top-ups, gifts, payouts, automated commerce and privileged generation while preserving legitimate ledger history, pending balances, recordings/evidence and world checkpoints.

## Reconciliation
Daily/provider-cycle job:
provider settled events ↔ internal ledger ↔ refunds/disputes ↔ payouts ↔ unresolved exceptions.

Any mismatch creates a reconciliation exception and blocks affected payout until resolved. Never 'fix' accounting by editing historical entries; use compensating/reversal entries.

## Creator statement
Creator Studio should display:
- gross eligible sales;
- platform fees;
- provider/tax effects where available;
- collaborator/rightsholder allocations;
- pending/reserve;
- refunds/disputes;
- available creator earnings;
- payout history;
- HoloGPT/top-up usage separately.

## Proof gate
Do not mark the global money loop GREEN until tests prove:
1. one sandbox top-up creates exactly one credit;
2. duplicate webhook creates no duplicate credit;
3. one Marketplace purchase creates entitlement + split;
4. one LIVE/ticket transaction follows category rules;
5. creator + collaborator/rightsholder + TRYAMM allocations sum exactly to the distributable amount;
6. refund/reversal posts a compensating entry;
7. payout step-up works;
8. Panic Mode blocks configured money actions;
9. Paystack/Flutterwave/other adapter used is genuinely supported by the merchant/country/category configuration;
10. constrained-network client can finish checkout and resume content workflows;
11. creator statement reconciles to ledger;
12. CI, migrations, preview deployment and end-to-end tests pass.
