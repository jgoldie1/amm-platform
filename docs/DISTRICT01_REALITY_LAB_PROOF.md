# StreetVerse District 01 — Reality Lab Finish-and-Prove Gate

## Locked Rule

NO NEW MAJOR WORLD OR ENGINE UNTIL THE ACTIVE COMPLETION SLICE IS GREEN.

RECOVER → ADAPT → WIRE → MIGRATE → TEST → REPAIR → BENCHMARK → DEPLOY.

## Active Vertical Slice

Street outside → Reality Lab entry → AI/player checkpoint → seven interactive rooms → shared multiplayer challenge → non-cash progression reward → recording moment → exit → save → disconnect → rejoin → restore state.

## Required Gates

| Gate | Required evidence | Green condition |
| --- | --- | --- |
| Build | CI logs | `npm ci`, `npm run typecheck`, and `npm run build` pass |
| Controllers | keyboard, touch, gamepad device evidence | movement, interaction, panic and navigation work without duplicate input |
| Multiplayer | 2+ real clients | shared event state is synchronized and server-authoritative |
| Save/Rejoin | authenticated user + Supabase | room progress, XP, inventory/unlocks and checkpoint survive disconnect/rejoin |
| Panic | keyboard/touch/gamepad | safe state blocks interaction immediately and resumes safely |
| Accessibility | VoiceOver/NVDA or equivalent + one-handed/reduced-motion/high-contrast checks | complete slice remains operable and understandable |
| Mobile | real phone evidence | no blocker layout/input failures; target frame budget documented |
| XR | supported test device or explicit unsupported result | interaction contract works or gate stays yellow/red |
| Commerce isolation | server/API review | attraction cannot directly change payable wallet balances |
| Regression | rerun after every repair | previously green gates remain green |

## Reality Lab Rooms

1. Holographic Welcome Hall — identity, accessibility, mission and checkpoint proof.
2. Infinite Light Chamber — controls, movement, effects and mobile proof.
3. Quantum Mirror Room — safe player-state rendering and privacy proof.
4. Holo Music Lab — synchronized shared-state and late-join proof.
5. Collective Puzzle Room — authoritative multiplayer and anti-cheat proof.
6. Living Chicago Illusion Room — effects budget, recording and reduced-motion proof.
7. Judah Portal — completion, progression reward, world travel and save/rejoin proof.

## Evidence Policy

A UI label, stub, mocked response or localStorage checkpoint is not sufficient evidence for a real external gate. Supabase, deployed multiplayer, physical controller, mobile/XR and commerce gates remain unproven until exercised in the target environment.

## Reward Boundary

Reality Lab may award XP, mission completion, badges, collectibles or eligibility events. It must never directly mutate payable earnings, cash balances or ledger entries. Any future monetary reward must flow through server eligibility → Money Engine → ledger/internal chain → payable earnings controls.

## Release Decision

- Any required RED gate: BLOCK release and expansion.
- Any required YELLOW/UNPROVEN gate: BLOCK claim of completion.
- All required gates GREEN with current evidence: active slice may be called finished-and-proven and promoted toward release.
