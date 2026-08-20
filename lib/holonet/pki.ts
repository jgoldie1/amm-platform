export type HoloCertificatePurpose = "service" | "device" | "user" | "node" | "signing";

export interface HoloCertificate {
  id: string;
  subject: string;
  issuer: string;
  purpose: HoloCertificatePurpose;
  notBefore: string;
  notAfter: string;
  fingerprint: string;
  revoked: boolean;
}

export interface HoloTrustPolicy {
  trustedIssuers: string[];
  requireMutualTls: boolean;
  requireShortLivedServiceCerts: boolean;
  maxServiceCertLifetimeHours: number;
}

export function evaluateCertificate(cert: HoloCertificate, policy: HoloTrustPolicy, now = new Date()): { allowed: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (cert.revoked) reasons.push("certificate is revoked");
  if (!policy.trustedIssuers.includes(cert.issuer)) reasons.push("issuer is not trusted");
  if (now < new Date(cert.notBefore) || now > new Date(cert.notAfter)) reasons.push("certificate is outside its validity window");
  return { allowed: reasons.length === 0, reasons };
}
