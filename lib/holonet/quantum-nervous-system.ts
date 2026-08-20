export type QuantumTrafficClass =
  | 'safety'
  | 'accessibility'
  | 'live'
  | 'game-xr'
  | 'voice'
  | 'payments'
  | 'media'
  | 'background';

export type QuantumRouteRequest = {
  service: string;
  trafficClass: QuantumTrafficClass;
  territory?: string;
  language?: string;
  requiresRights?: boolean;
  requiresPaymentRail?: boolean;
};

export type QuantumRoutePlan = {
  controlPlane: 'holonet';
  identityPlane: 'holo-identity';
  securityPlane: 'quantum-security';
  optimizationPlane: 'quantum-lag-buster';
  statePlane: 'supabase';
  transportPlane: 'public-internet' | 'quantum-edge';
  mediaPlane?: 'livekit' | 'cdn';
  trafficClass: QuantumTrafficClass;
  failClosed: boolean;
  notes: string[];
};

/**
 * HoloNet is the brain/control plane; this policy is the nervous system that
 * carries intent to real services. It never claims ownership of physical
 * transport that is not actually deployed.
 */
export function planQuantumRoute(input: QuantumRouteRequest): QuantumRoutePlan {
  const realtime = ['live', 'game-xr', 'voice', 'accessibility', 'safety'].includes(input.trafficClass);
  const mediaService = ['live', 'pk', 'broadcast', 'debate', 'faith', 'news'].includes(input.service);

  return {
    controlPlane: 'holonet',
    identityPlane: 'holo-identity',
    securityPlane: 'quantum-security',
    optimizationPlane: 'quantum-lag-buster',
    statePlane: 'supabase',
    transportPlane: process.env.QUANTUM_EDGE_ENABLED === 'true' ? 'quantum-edge' : 'public-internet',
    mediaPlane: mediaService ? 'livekit' : realtime ? 'cdn' : undefined,
    trafficClass: input.trafficClass,
    failClosed: Boolean(input.requiresRights || input.requiresPaymentRail),
    notes: [
      'Security and identity gates cannot be bypassed by latency optimization.',
      input.requiresRights ? 'Territory/content-rights evidence required before distribution.' : 'No content-rights gate requested.',
      input.requiresPaymentRail ? 'Verified country/currency/payment rail required before settlement.' : 'No payment-rail gate requested.',
    ],
  };
}

export const quantumBodyMap = {
  brain: ['Stubbs AI', 'HoloGPT', 'HoloNet control plane'],
  spine: ['HoloNet gateway', 'service registry', 'event/API backbone'],
  nervousSystem: ['Quantum Lag Buster', 'realtime events', 'presence', 'routing', 'telemetry'],
  heart: ['Money Engine', 'creator earnings', 'royalties', 'Aniyah Cross-Border Payments'],
  lungs: ['LiveKit', 'HoloMusic', 'Omni Box', 'Free TV', 'Isaiah AI TV', 'CDN/media processing'],
  immuneSystem: ['Quantum Security', 'Guardian', 'moderation', 'ComplianceOS', 'rights gates'],
  memory: ['Supabase', 'private memory', 'media catalog', 'audit/evidence'],
} as const;
