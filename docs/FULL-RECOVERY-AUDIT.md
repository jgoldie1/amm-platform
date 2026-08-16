# TryAMM / Omniverse Full Recovery Audit

Last updated: 2026-08-15

This document is the permanent recovery ledger for work previously created across conversations, Library artifacts, `jgoldie1/Amm-project-`, and the clean integration target `jgoldie1/amm-platform`.

## Source-of-truth policy

Nothing is called complete merely because it appeared in chat. Every system moves through:

`RECOVERED -> SOURCE_VERIFIED -> WIRED -> TESTED -> DEPLOYED`

The large historical repository `jgoldie1/Amm-project-` is the primary recovery source. `jgoldie1/amm-platform` is the clean integration target. The connected Supabase Pro project is the shared backend/data layer.

## Recovered visual identity / app face

The final holographic app-face work was found in the ChatGPT Library and must not be regenerated unless intentionally redesigned.

1. `Futuristic branding for Stubbs AI system.png`
   - Library file id: `file_000000002d84722faf3850c6170c3c40`
   - Contains TRYAMM TV/monitor UI, Stubbs AI crest, HoloGPT Quantum Orchestrator branding, streaming, payments, gaming, marketplace, academy and wallet presentation.

2. `Futuristic AI brand identity design.png`
   - Library file id: `file_000000001c44720c8e8f711deebb7c84`
   - Contains square/round/minimal app icons, lion + American-flag + lamb crest, STUBBS AI / LYONS TECH AI branding, phone app preview with SIGN IN / CREATE ACCOUNT, TryAMM search and HoloGPT Assistant.

3. `Futuristic branding showcase with lion emblem.png`
   - Library file id: `file_0000000087e0720c80cef7a711adbaa5`
   - Contains JUDAH crowned lion, American flag across lion face, lamb, official app icon, favicon/shortcut concepts and holographic/Lottie animation storyboard.

4. `Crowned lion and lamb in holographic Americana.png`
   - Library file id: `file_00000000b26481f5a9fce1ab2baf96d3`

5. `Lion, Lamb, and the Crown of Judah.png`
   - Library file id: `file_0000000057c4820cb95516a9703a3789`

These five files have also been materialized into the current working environment under `/mnt/data/recovered-brand-assets/` for recovery work. Binary image upload into GitHub still needs a binary-capable Git path/action; the text-only GitHub connector cannot safely create PNG files.

## Historical source verified in `Amm-project-`

### Mobile / PWA shell
Commit: `95f7adac1b638bda978f606618600d4b59b1a608`

Recovered capabilities:
- mobile-first shell
- LIVE-room API integration
- persistent navigation
- installable PWA manifest
- offline service worker
- smoke tests

### Supabase / content / deployment wiring
Commit: `d34a6fa9e48e9438cb7cfe04567709313b083e26`

Recovered capabilities:
- authenticated content APIs
- founder dashboard
- Supabase REST wiring
- version-controlled schema
- Render/Replit configuration
- environment documentation

### Operating/release/security controls
Commit: `8901eff0c092c92ee602df9535857068be1dd4d1`

Recovered capabilities:
- 11-layer company operating model
- evidence tracking
- release gates
- admin controls
- contractor acceptance model
- deny-by-default blockchain AUDIT_HOLD

### Holo Fon / Satellite Fon / accessibility / translation
Commit: `f7bb77f29a6db2e138cf22c976f385efe7a8592c`

Recovered capabilities:
- device registry
- accessibility profiles
- translation request validation
- accessible SOS / communications concepts

### Holo Menu
Historical commits:
- `d02d596ba837306bc9e37828f9c7f7bb03081542` navigation manifest
- `91ebda2706db2b8fce63cb86decc3481f2e15dbf` adaptive Holo Menu client
- `119dc87cfa5673150cc230c93c59eef71447e6d9` server wiring

### Music Hub
Historical commits include:
- `64038f57268243110596cddd9178ce432fa6e277` catalog/chart/payout/immersive API
- `68b38f39be9aa7d7d9f2cd6b964a624cc2347099` backend wiring
- `0d31bfb1d530376638f88ac90d87e612e0d6af51` frontend
- `4c776aa1d8fca4ff49f076d4371fb884b75fb9ef` catalog/playback/chart/upload wiring

### Free TV / FAST / AVOD / creator television
Historical commits include:
- `70063f263f4ac9a84a156c53585c5fc7be0a914a` FAST/AVOD manifest
- `8a158fdc73341a7bfba9d8670701ba19fa8e3900` production/distribution OS
- `7a6bf50c10a16b544f4dfeece01b5f42571b748f` catalog/submission manager
- `65db44390e1c78ec730371c972e4e8cf1d7b4a93` APIs
- `ebafcc98f9e1b9606a5e867e5c3ed246e86bb42f` server wiring
- `e7a23ebfc9e3ed5ff9811ae1d2759dae9ab2e4de` creator/viewer frontend
- `0acc39ebb7ce7667c18cd47090079146e61e545d` creator submission console
- `b37f74e8b76673ff3833c5e1566b782bb2f6295e` release-gate test
- `0ac61b32b9d760806813da5adeead8b9504a9f0f` persistence schema

### Holo5DX / holographic rendering stack
Historical commits include:
- hardware profile registry
- hardware/calibration persistence
- render/calibration contracts
- APIs
- fallback contract
- control/calibration console
- server wiring
- smoke tests
- optical render planner
- Quantum Cone calibration engine
- runtime manager
- browser multi-view renderer

Known commits: `99be0e768364664e6c85cac554ab630c08cd1d69`, `b4465ee20f0981b91485af16c90dfa2f8d9fabe6`, `7f8e0abe1e7216c3c733d3eb67bef533a249bb17`, `fb2c9bcc0dadfd2f1d26a4508a4253b6059fd59f`, `bd8bf03a67511151b8ddb1d7fea330076cc1fb1d`, `db7d459101782b18d893472a92930194ba4a4c8f`, `78e5b8cea5b11608a9942b18a2ec39957d104ed9`, `84e5390a8006090bee2ff601dccd9a0722733ae8`, `812dff2d245537019f88747ec7e428e6674ed4ce`, `32d0b7c1516a081a5739daf5a94cbdebf1939b44`, `46da041e46657702487c1f26897d3b85608d40d8`, `d468f95c9d6b3e2491cdd337c8100e03ffd64e5e`.

### Aniyah / Vocal Studio
Branch: `ai/fix-vocal-studio-foundation`

The branch is 6 commits ahead of its merge base and contains:
- `public/vocal-studio.html`
- `public/vocal-studio-app.js`
- `public/vocal-studio-engine.js`
- `public/vocal-studio.css`
- smoke-test updates

Recovered into the clean integration branch. Current verified foundation supports 64 tracks, synchronized playback, pause/resume/stop, mute, solo, loop, track volume/pan and master volume. Recording, waveform editing, plugins, pitch correction, cloud saving and mastered export remain future implementation work until source is recovered or rebuilt.

## Isaiah AI TV / StarVerse / Anyone Can Be a Star

Library recovery confirms a previously built `isaiah-ai-starverse` application was reported as compiling clean with 20 pages and 6 API routes.

Recovered specification includes:
- Home
- StarVerse
- Online Showcase
- Higfield Dance 2.0
- Mythos Blender Studio
- Live TV Production Studio
- Isaiah AI TV
- Movies
- Profile
- Audition
- Admin
- judges API
- live fan voting
- five-judge scoring
- parent/child enrollment and consent
- four Isaiah AI TV show concepts
- 30–120 minute film production catalog
- product placement rate card
- holographic ad triggers
- live run-of-show controls
- live rankings/viewer counters/chat

Library source evidence is in file id `file_000000006988722fa0daedeb4ac0dc49` (`Pasted text.txt`). The original generated source folder/ZIP itself has not yet been located as a standalone Library file or GitHub repository, so this system is classified `RECOVERED_SPEC / SOURCE_PACKAGE_MISSING` and must be rebuilt from the recovered specification if the original package cannot be found.

## SpaceOS

Recovered design baseline:
- phone/camera/room scanning
- persistent digital twin
- AI object recognition/inventory
- 3D object dragging
- door/window/no-go-zone editing
- Supabase Auth/RLS/private photo storage
- vision-analysis API
- BUILD workflow/manufacturing jobs
- safety/structural gates
- SpaceBlock modular storage
- STL/STEP export
- Jarvis Forge / 12D manufacturing integration
- accessibility-aware layouts
- retailer/product integration
- moving-day/whole-home workflows

SpaceOS is `RECOVERED_SPEC`; no complete standalone source repository has yet been verified in GitHub.

## PropertyVerse / Real Estate / Home Flipping

Recovered architecture:
- property discovery
- buy/sell/rent workflows
- immersive tours
- room/property scans
- digital twins
- renovation planning
- contractor/manufacturing workflow
- home-flip cost/phase tracking
- SpaceOS integration
- listing/re-listing after renovation

Status: `RECOVERED_SPEC / SOURCE_NOT_VERIFIED`.

## WhatsApp / communications

Recovered evidence confirms WhatsApp was included in global social/campaign platform presets alongside Facebook, Instagram, TikTok, YouTube, Telegram, X, LinkedIn, Reddit, LINE, KakaoTalk, WeChat, Weibo, Douyin, Xiaohongshu and Bilibili.

A production WhatsApp Business/Cloud API implementation has not yet been source-verified. It must remain `REQUIRES_PROVIDER_CREDENTIALS` until a Meta/WhatsApp Business account, approved sender/phone number and API credentials are configured. The app should use the shared Omni Communications abstraction so WhatsApp is one channel rather than a separate identity/database.

## Connected Supabase work already added during recovery

The connected Supabase Pro project has been extended with:
- `omni_system_registry`
- `legacy_ownership_registry`
- `worlds`
- `world_instances`
- `world_members`
- `world_player_state`
- `world_saves`
- `omni_devices`
- `omni_handoffs`
- `holo_services`
- `media_catalog`

RLS is enabled on the new tables. Legacy ownership records are server-only by default.

## Victor-equivalent engineering scope

The work previously expected from a contractor is being replaced by this controlled engineering queue:

1. Recover historical source before rewriting it.
2. Consolidate one canonical repo structure.
3. Keep Supabase as the shared auth/database/realtime backend.
4. Wire frontend -> authenticated APIs -> Supabase.
5. Complete realtime multiplayer/shared-state transport.
6. Complete persistent player/world saves and inventory ownership.
7. Wire Omni Box device registration and handoff.
8. Recover/wire Music Hub, Free TV/FAST, LIVE and creator systems.
9. Recover/rebuild Isaiah AI TV / StarVerse from the recovered clean specification if the source package is not found.
10. Recover/rebuild SpaceOS and PropertyVerse from the locked specifications if source is not found.
11. Add OmniCash ledger APIs using existing wallet/payment tables; never trust browser balance changes.
12. Wire provider webhooks with idempotency and reconciliation.
13. Add communications abstraction including WhatsApp as a provider-backed channel.
14. Restore the final holographic app face and app icon assets into the binary asset pipeline.
15. Complete RLS/security review and rate limiting.
16. Run install, typecheck/build, unit/smoke and integration tests.
17. Stage deploy before merging to production.
18. Keep blockchain/token/on-chain financial systems on AUDIT_HOLD until independently reviewed.

## External dependencies that code alone cannot complete

The following require real accounts/approvals/credentials:
- WhatsApp/Meta Business messaging credentials
- Stripe/Paystack/Flutterwave production credentials and approvals
- LIVE/video provider credentials where applicable
- app-store/TV-store developer accounts
- maps/dispatch providers
- drone/operator regulatory approvals
- content/music/movie licensing rights
- physical holographic and Omni Box manufacturing/certification

## Merge rule

Do not merge the recovery PR into `main` until recovered code has been reconciled, tested and security-reviewed. Do not delete `Amm-project-` until all valuable history has been migrated or explicitly archived.