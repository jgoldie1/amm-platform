# TRYAMM Quantum Haptic Device Bus

## Purpose
Provide one permission-scoped device-control layer for TRYAMM immersive experiences without coupling device hardware directly to identity, payments, private memory, or unrestricted AI control.

## Device families
- Quantum Beat haptics and beat-synced effects
- Bluetooth / Web Bluetooth peripherals where browser/platform permissions allow
- Gamepads and console-style controllers
- XR controllers and spatial input
- Wearable haptic vests/suits/gloves/belts
- Mobile vibration/haptics
- Smart lighting / stage effects adapters
- Casting companion devices
- Lovense-compatible adult-device adapters only through official supported interfaces and only in age-gated, explicit-consent contexts

## Common event model
Experience event → permission check → age/territory/content gate when applicable → device capability negotiation → safe intensity/rate limits → user consent state → haptic pattern renderer → device adapter → telemetry/acknowledgement.

Example event categories:
- music beat / tempo pulse
- LIVE gift burst
- PK score / win effect
- game impact / engine / environment event
- VR/MR spatial cue
- accessibility navigation cue
- creator-authored stage effect
- adult/private haptic event, only when explicitly enabled by an adult user in an eligible environment

## Security boundaries
- No device adapter receives Supabase service-role keys, payment secrets, LiveKit API secrets, private Stubbs AI memory, raw identity credentials, or wallet signing authority.
- Pairing tokens are short-lived and scoped to one user/device/session.
- Device control is disabled by default and requires explicit user opt-in.
- Provide immediate stop/panic control and disconnect-all command.
- Rate/intensity limits are enforced server/client side according to device capability.
- Never infer consent from presence in a room, purchase, relationship, prior session, or device pairing.
- Remote control requires a separately authorized session and can be revoked instantly.
- Record audit events for pairing, permission grants/revocations, control-session start/end, and safety stops without storing sensitive content unnecessarily.

## Adult/nightlife integration
Omniverse After Dark may expose eligible adult-device integrations only to verified adults and only where provider/platform/territory rules allow. Public rooms never automatically control a private device. Viewer gifts, tips, chat messages, AI responses, ads, or purchases cannot directly trigger device output unless the user has separately enabled a constrained mapping for that session.

## Accessibility
Haptics can also serve non-sexual accessibility use cases: navigation, alerts, captions-to-vibration cues, beat/music perception, game direction cues, and notification patterns. Accessibility profiles must be user-configurable and never overridden by entertainment effects.

## Quantum Beat mapping
Audio/beat analyzer → normalized tempo/onset events → Haptic Bus → device-specific rendition. The same beat event can render as phone vibration, vest pulse, XR controller feedback, lighting, or another authorized haptic adapter without duplicating application logic.

## XR/world integration
LIVE / PK / Karaoke / Vocal Box / Showcase / StarVerse / Games / My World / We Are the World / Kingdom / New Yahisrale / Metaverse / Middleverse / Multiverse / Holoverse → Quantum Haptic Bus → authorized device adapters.

## GREEN gate
A device integration is GREEN only after real hardware tests prove pairing, reconnect, latency, stop control, permission revocation, safe rate/intensity bounds, battery/disconnect handling, no credential leakage, and expected behavior on supported OS/browser/device combinations.
