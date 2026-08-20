export type ProofGateStatus = 'RED' | 'YELLOW' | 'GREEN';

export type RealityLabRoomId =
  | 'welcome-hall'
  | 'infinite-light'
  | 'quantum-mirror'
  | 'holo-music'
  | 'collective-puzzle'
  | 'living-chicago'
  | 'judah-portal';

export type RealityLabRoom = {
  id: RealityLabRoomId;
  name: string;
  purpose: string;
  proof: string[];
  xp: number;
};

export const realityLabRooms: RealityLabRoom[] = [
  {
    id: 'welcome-hall',
    name: 'Holographic Welcome Hall',
    purpose: 'Load player identity, accessibility profile, mission state and a safe checkpoint.',
    proof: ['auth', 'player-state', 'accessibility', 'checkpoint'],
    xp: 25
  },
  {
    id: 'infinite-light',
    name: 'Infinite Light Chamber',
    purpose: 'Prove responsive movement, touch/keyboard/gamepad input and synchronized environmental reactions.',
    proof: ['movement', 'controllers', 'mobile', 'world-state'],
    xp: 25
  },
  {
    id: 'quantum-mirror',
    name: 'Quantum Mirror Room',
    purpose: 'Render only player-safe avatar, achievement, mission and unlock state.',
    proof: ['privacy', 'inventory', 'missions', 'avatar-state'],
    xp: 25
  },
  {
    id: 'holo-music',
    name: 'Holo Music Lab',
    purpose: 'Build one shared composition from spatial zones so every connected player sees the same state.',
    proof: ['realtime', 'shared-state', 'spatial-audio', 'late-join'],
    xp: 50
  },
  {
    id: 'collective-puzzle',
    name: 'Collective Puzzle Room',
    purpose: 'Require multiple verified participants before a server-authoritative completion event is accepted.',
    proof: ['authoritative-multiplayer', 'anti-cheat', 'presence', 'mission-event'],
    xp: 75
  },
  {
    id: 'living-chicago',
    name: 'Living Chicago Illusion Room',
    purpose: 'Stress reactive city presentation, effects budgets, accessibility alternatives and mobile rendering.',
    proof: ['performance', 'effects-budget', 'reduced-motion', 'recording'],
    xp: 50
  },
  {
    id: 'judah-portal',
    name: 'Judah Portal',
    purpose: 'Complete the slice, issue eligible non-cash progression rewards and save the return checkpoint.',
    proof: ['reward-eligibility', 'save-rejoin', 'world-travel', 'regression'],
    xp: 100
  }
];

export type RealityLabProofEvidence = {
  buildPassed: boolean;
  controllerPassed: boolean;
  multiplayerPassed: boolean;
  saveRejoinPassed: boolean;
  panicPassed: boolean;
  accessibilityPassed: boolean;
  mobilePassed: boolean;
  commerceIsolationPassed: boolean;
};

export function evaluateRealityLabProof(evidence: RealityLabProofEvidence) {
  const entries = Object.entries(evidence) as Array<[keyof RealityLabProofEvidence, boolean]>;
  const gates = Object.fromEntries(
    entries.map(([gate, passed]) => [gate, passed ? 'GREEN' : 'RED'])
  ) as Record<keyof RealityLabProofEvidence, ProofGateStatus>;

  const green = entries.every(([, passed]) => passed);
  return {
    status: green ? ('GREEN' as const) : ('RED' as const),
    gates,
    canExpand: green
  };
}

export const REALITY_LAB_STORAGE_KEY = 'tryamm.streetverse.district01.reality-lab.v1';
