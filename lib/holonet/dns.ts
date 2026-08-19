export interface HoloDnsRecord {
  name: string;
  type: "A" | "AAAA" | "CNAME" | "TXT" | "SRV";
  value: string;
  ttlSeconds: number;
  visibility: "public" | "private";
}

export interface HoloDnsZone {
  zone: string;
  ownerId: string;
  dnssecRequired: boolean;
  records: HoloDnsRecord[];
}

export function validateHoloDnsZone(zone: HoloDnsZone): string[] {
  const errors: string[] = [];
  if (!zone.zone.includes(".")) errors.push("zone must be a valid delegated domain name");
  if (!zone.ownerId) errors.push("zone owner is required");
  if (!zone.dnssecRequired) errors.push("DNSSEC must remain enabled for production zones");
  for (const record of zone.records) {
    if (!record.name || !record.value) errors.push("DNS record name/value cannot be empty");
    if (record.ttlSeconds < 30) errors.push(`TTL too low for ${record.name}`);
  }
  return errors;
}
