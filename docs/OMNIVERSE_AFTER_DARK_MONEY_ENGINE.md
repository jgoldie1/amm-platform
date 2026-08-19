# Omniverse After Dark — Money Engine Structure

> Working recovered label. If an earlier exact product name is recovered from project history, preserve it as an alias or rename without changing the underlying payment architecture.

## Purpose
Omniverse After Dark is TRYAMM's age-gated mature/nightlife entertainment lane. It may host lawful late-night LIVE shows, music/DJ events, comedy, clubs, adult-audience talk, mature movies/programming, ticketed virtual events, creator fan rooms, nightlife discovery and other provider-permitted mature entertainment.

It does **not** create a separate shadow wallet or bypass TRYAMM safety/compliance. It uses the common Money Engine and stricter eligibility gates.

## Monetization
Supported transaction types are enabled only where lawful and supported by the configured payment provider:
- creator/channel subscriptions;
- event tickets;
- pay-per-view / unlocks;
- Holographic Gifts 2.0 and tips where supported;
- creator merchandise and Marketplace sales;
- authorized digital media purchases/rentals;
- premium rooms / fan-club access;
- nightlife venue/service bookings when the underlying provider is lawful and qualified;
- advertising/sponsorship inventory approved for the age-gated lane;
- music/media royalties;
- creator earnings and supported Aniyah Cross-Border payouts.

## Money flow
Viewer/customer → provider authorization → TRYAMM order/payment intent → gross funds → processor/provider fees → refunds/chargebacks/reserves → applicable taxes/withholding → TRYAMM platform fee → creator/provider payable balance → Money Engine ledger → payout eligibility gate → domestic or Aniyah Cross-Border payout.

Every value movement must be ledgered exactly once with immutable reference IDs and reconciliation evidence. Client applications never calculate or directly post final creator earnings.

## Pricing model
The catalog stores price and revenue-share rules server-side. Client requests reference product/offer IDs only. Optional structures:
- monthly subscription tiers;
- one-time ticket/PPV price;
- timed room access;
- gift/token catalog;
- merchandise price;
- sponsor/ad package;
- platform service fee;
- creator/provider share;
- reserve percentage where required by provider/risk model.

Rates are configuration, not hard-coded promises. They can vary by product, territory, provider and risk tier.

## Age/identity gate
- 18+ minimum for mature content; 21+ or higher where a specific regulated activity/jurisdiction requires it.
- Age assurance must occur before entry/payment where required.
- Do not expose government-ID images to creators or other users.
- Restricted/minor accounts cannot discover, enter, purchase, receive recommendations from, or appear in After Dark rooms.
- Age state is a protected eligibility claim, not public profile metadata.

## Content/payment eligibility gate
A technically valid payment is not automatically allowed. Before checkout, evaluate:
1. user age/identity eligibility;
2. seller/creator eligibility;
3. content/product category;
4. territory/local-law policy;
5. payment-provider/card-network policy;
6. sanctions/KYC/KYB/risk requirements where applicable;
7. rights/license status for media;
8. moderation/safety status.

Unsupported categories fail closed. TRYAMM must not route a prohibited transaction through a different merchant category, account, country or provider to evade restrictions.

## Creator earnings
Creator dashboard separates:
- gross sales/gifts/subscriptions;
- refunds/chargebacks;
- processor/provider fees;
- platform fees;
- taxes/withholding when applicable;
- reserve/hold balance;
- pending earnings;
- available earnings;
- paid-out earnings;
- royalty earnings.

Financial-literacy cards explain each line item without presenting individualized tax/investment/legal advice.

## Refunds / disputes / reserves
All payment types define cancellation/refund rules before purchase. Chargebacks and fraud disputes post compensating ledger transactions rather than deleting history. High-risk or new creators may have configurable payout delays/reserves where allowed and disclosed.

## Privacy and discretion
- After Dark activity is not public by default.
- Purchase/watch history has separate privacy controls.
- Notifications must not reveal sensitive room/title details on lock screens unless the user opts in.
- Search/recommendation boundaries prevent accidental exposure on teen/general lanes.

## LIVE integration
Age gate → verified LIVE room → recording-consent state → chat/moderation → gifts/tips → ticket/PPV/subscription entitlement → creator earnings → replay rights gate → Money Engine → payout.

## Global release matrix
Enable independently per territory and provider. United States, Nigeria, South Africa, China, Russia and other markets are not assumed equivalent. Mature-content, payments, media, advertising, privacy and local licensing rules are independently gated.

## GREEN gate
Omniverse After Dark is GREEN for a transaction path only after evidence proves:
- age gate;
- content/category eligibility;
- provider acceptance;
- successful payment authorization/capture;
- webhook verification;
- exactly-once ledger posting;
- creator allocation;
- refund/chargeback behavior;
- payout/reconciliation;
- privacy/access-control tests;
- territory eligibility.

Otherwise the capability remains YELLOW (visible/gated) or RED (disabled/hidden).
