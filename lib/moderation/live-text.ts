export type LiveTextDecision = { allowed: true; normalized: string } | { allowed: false; reason: string };

export function moderateLiveText(input: string): LiveTextDecision {
  const normalized = input.normalize('NFKC').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  if (!normalized) return { allowed: false, reason: 'empty_message' };
  if (normalized.length > 1000) return { allowed: false, reason: 'message_too_long' };

  const links = normalized.match(/https?:\/\/|www\./gi)?.length ?? 0;
  if (links > 2) return { allowed: false, reason: 'excessive_links' };

  const repeated = /(.)\1{19,}/u.test(normalized);
  if (repeated) return { allowed: false, reason: 'spam_pattern' };

  const words = normalized.split(/\s+/);
  if (words.length > 12) {
    const uniqueRatio = new Set(words.map(word => word.toLowerCase())).size / words.length;
    if (uniqueRatio < 0.2) return { allowed: false, reason: 'repetitive_spam' };
  }

  return { allowed: true, normalized };
}
