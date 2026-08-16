# TRYAMM / Omniverse Recovery Manifest

This file prevents historical work from disappearing during repository consolidation.

## Canonical rule

- `jgoldie1/Amm-project-` = historical recovery source.
- `jgoldie1/amm-platform` = clean integration target.
- No historical feature is considered complete merely because it was discussed or generated.
- Status lifecycle: `RECOVERED -> SOURCE_VERIFIED -> WIRED -> TESTED -> DEPLOYED`.

## Verified historical source found

### Mobile / PWA shell
Source commit: `95f7adac1b638bda978f606618600d4b59b1a608`

Verified capabilities:
- mobile-first TRYAMM app shell
- persistent bottom navigation
- live-room API integration
- PWA manifest
- service worker / offline shell
- smoke-test coverage

### Supabase content/deployment wiring
Source commit: `d34a6fa9e48e9438cb7cfe04567709313b083e26`

Verified capabilities:
- authenticated content APIs
- founder dashboard
- Supabase REST integration
- versioned schema/migration
- Render/Replit deployment configuration
- environment safety guidance

### Operating controls / release gates
Source commit: `8901eff0c092c92ee602df9535857068be1dd4d1`

Verified capabilities:
- 11-layer company operating model
- readiness/evidence APIs
- release gates
- admin protection
- blockchain AUDIT_HOLD controls

### Holo Fon / Satellite Fon / accessibility / translation
Source commit: `f7bb77f29a6db2e138cf22c976f385efe7a8592c`

Verified capabilities:
- Holo Fon and Satellite Fon registries
- accessibility profile service
- translation request contract
- one-hand/switch/caption/TTS/STT requirements

### Holo Menu / News
Verified historical commits include:
- `d02d596ba837306bc9e37828f9c7f7bb03081542` Holo Menu navigation manifest
- `91ebda2706db2b8fce63cb86decc3481f2e15dbf` adaptive Holo Menu client
- `119dc87cfa5673150cc230c93c59eef71447e6d9` Holo Menu + News server wiring

### Music / immersive media
Verified historical commits include:
- `64038f57268243110596cddd9178ce432fa6e277` music catalog/chart/payout/immersive API
- `68b38f39be9aa7d7d9f2cd6b964a624cc2347099` backend music/chart/payout/break-status wiring
- `0d31bfb1d530376638f88ac90d87e612e0d6af51` Music Hub frontend
- `4c776aa1d8fca4ff49f076d4371fb884b75fb9ef` catalog/playback/chart/upload UI

### Free TV / OTT / creator TV
Verified historical commits include:
- `70063f263f4ac9a84a156c53585c5fc7be0a914a` FAST/AVOD manifest
- `8a158fdc73341a7bfba9d8670701ba19fa8e3900` production/distribution operating system
- `7a6bf50c10a16b544f4dfeece01b5f42571b748f` catalog/submission manager
- `65db44390e1c78ec730371c972e4e8cf1d7b4a93` API routes
- `ebafcc98f9e1b9606a5e867e5c3ed246e86bb42f` server wiring
- `e7a23ebfc9e3ed5ff9811ae1d2759dae9ab2e4de` creator/viewer frontend
- `0acc39ebb7ce7667c18cd47090079146e61e545d` creator submission console
- `0ac61b32b9d760806813da5adeead8b9504a9f0f` persistence schema

### Reality / Originals network
Verified historical commits include:
- `1024d0d6b25031051db072e2b1bcdc14f2d92d98` reality production compliance OS
- `19cca4ebe9fa0bedf77a7f72caad5d389ff8086d` compliance manager
- `3289f8f2eeda7181d7e44b741c6c3aff387779ef` API routes
- `204197fe4b476afbf9fbbdafbcef5936ce231cff` creator template library

### Holo5DX / holographic runtime
Verified historical commits include:
- `99be0e768364664e6c85cac554ab630c08cd1d69` hardware profile registry
- `b4465ee20f0981b91485af16c90dfa2f8d9fabe6` hardware/calibration persistence
- `7f8e0abe1e7216c3c733d3eb67bef533a249bb17` render/calibration contracts
- `fb2c9bcc0dadfd2f1d26a4508a4253b6059fd59f` API routes
- `bd8bf03a67511151b8ddb1d7fea330076cc1fb1d` render/fallback contract
- `db7d459101782b18d893472a92930194ba4a4c8f` control/calibration console
- `78e5b8cea5b11608a9942b18a2ec39957d104ed9` server wiring
- `84e5390a8006090bee2ff601dccd9a0722733ae8` smoke test
- `812dff2d245537019f88747ec7e428e6674ed4ce` optical render planner
- `32d0b7c1516a081a5739daf5a94cbdebf1939b44` Quantum Cone calibration engine
- `46da041e46657702487c1f26897d3b85608d40d8` runtime manager
- `d468f95c9d6b3e2491cdd337c8100e03ffd64e5e` browser multi-view renderer scaffold

### Aniyah 64-Track Vocal Studio
Historical branch: `ai/fix-vocal-studio-foundation`

Branch status when recovered:
- 6 commits ahead of merge base
- diverged from current main

Recovered into integration branch:
- `public/vocal-studio.html`
- `public/vocal-studio-app.js`
- `public/vocal-studio-engine.js`
- `public/vocal-studio.css`

Current verified capability:
- up to 64 loaded tracks
- synchronized playback
- pause/resume/stop
- mute / solo / loop
- per-track volume and pan
- master volume
- safe cleanup

Not yet claimed complete:
- microphone recording
- waveform editing
- plug-ins/effects
- pitch correction/Auto-Tune
- cloud project persistence
- WAV/stem export/mastering

## Mandatory recovery targets still being reconciled

- exact final holographic splash/app-entry visual
- Judah lion/logo asset used as the app face
- WhatsApp-related UI/integration
- HoloGPT entry screen assets
- GameVerse and Living Worlds source beyond shared backend foundation
- final LIVE/PK frontend and provider wiring
- Marketplace production checkout/vendor UI
- OmniCash provider-side production flows
- StarVerse / Isaiah AI TV / Anyone Can Be a Star implementations
- Aniyah Cross-Border production adapters
- Jacobie Vision security implementation layer
- PropertyVerse/Home Flipping UI and workflow
- SpaceOS UI/source reconciliation
- Omni Box hardware/client packaging

## Merge policy

Do not merge the current integration PR into `main` until:
1. historical recovery is reconciled,
2. duplicate implementations are resolved,
3. TypeScript/build checks pass,
4. Supabase RLS/security review passes,
5. critical flows have smoke/integration tests,
6. production secrets remain outside source control.
