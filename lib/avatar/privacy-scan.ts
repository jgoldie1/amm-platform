export type AvatarQuality = 'lite'|'standard'|'high'|'cinematic';
export type AvatarCaptureView = 'front'|'left'|'right'|'back'|'full_body';

export type AvatarScanPolicy = {
  purpose: 'avatar_rendering_only';
  identityMatching: false;
  biometricAuthentication: false;
  rawCaptureUpload: false;
  rawCaptureRetention: false;
  reusableFaceTemplate: false;
  cloudFaceEmbedding: false;
  localProcessingPreferred: true;
  consentRequired: true;
  jurisdictionGate: true;
};

export const PRIVACY_FIRST_AVATAR_POLICY: AvatarScanPolicy = {
  purpose: 'avatar_rendering_only',
  identityMatching: false,
  biometricAuthentication: false,
  rawCaptureUpload: false,
  rawCaptureRetention: false,
  reusableFaceTemplate: false,
  cloudFaceEmbedding: false,
  localProcessingPreferred: true,
  consentRequired: true,
  jurisdictionGate: true,
};

export const AVATAR_QUALITY_BUDGETS = {
  lite: { targetTriangles: 15_000, textureSize: 1024, lods: 3, target: 'mobile/live' },
  standard: { targetTriangles: 45_000, textureSize: 2048, lods: 4, target: 'mobile/web/tv' },
  high: { targetTriangles: 100_000, textureSize: 4096, lods: 5, target: 'desktop/ar/vr' },
  cinematic: { targetTriangles: 250_000, textureSize: 8192, lods: 6, target: 'studio/movie/offline-render' },
} as const;

export function jurisdictionAllowsAvatarGeometry(input: { country?: string; region?: string; counselApproved?: boolean }) {
  // Fail closed for face/body geometry until jurisdiction-specific review is complete.
  if (!input.counselApproved) return { allowed: false, reason: 'jurisdiction_review_required' } as const;
  return { allowed: true, reason: 'approved_for_avatar_rendering_only' } as const;
}

export function validateCapturePlan(views: AvatarCaptureView[]) {
  const unique = new Set(views);
  if (!unique.has('front')) return { ok:false, error:'front_view_required' } as const;
  if (![...unique].some(v => v === 'left' || v === 'right')) return { ok:false, error:'side_view_required' } as const;
  return { ok:true } as const;
}

export const avatarPrivacyRules = [
  'Never use avatar geometry to identify or authenticate a person.',
  'Never retain raw camera frames/photos after local mesh derivation unless the user explicitly chooses a separate photo-save feature.',
  'Never create or store face embeddings, recognition vectors, voiceprints, or identity templates from avatar capture.',
  'Derived GLB assets must not contain raw source images, EXIF/GPS metadata, hidden camera frames, or recognition embeddings.',
  'Strip metadata and scan exported GLB/GLTF before it enters the HoloForge Asset Library.',
  'Provide Delete Avatar that removes user-owned derived avatar assets and associated processing metadata where retention is not legally required.',
  'Minors require the applicable age/guardian gate; mature/After Dark use is never inferred from an avatar scan.',
  'Jurisdictions with biometric restrictions remain disabled until the applicable legal/consent flow is approved.',
] as const;
