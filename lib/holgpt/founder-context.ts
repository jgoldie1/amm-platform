import { buildBootstrapProjectHistory } from '@/lib/founder-archive/bootstrap-project-history';
import { retrieveGoogolplexMemory } from '@/lib/googolplex-memory';
import { recoveredLegacyDesigns } from '@/lib/legacy-design-vault/registry';
import type { StubbsAIRequest } from '@/lib/stubbs-ai/types';

export interface FounderContextItem {
  id: string;
  source: 'googolplex_memory' | 'founder_archive' | 'legacy_design_vault';
  confidence: 'working' | 'reconstructed' | 'verified' | 'partial' | 'reference_only';
  title: string;
  content: string;
  provenance?: string;
}

export interface FounderContextBundle {
  ownerId: string;
  query: string;
  items: FounderContextItem[];
  warnings: string[];
}

export async function assembleFounderContext(input: {
  ownerId: string;
  query: string;
  request: StubbsAIRequest;
  limit?: number;
}): Promise<FounderContextBundle> {
  const limit = Math.max(1, Math.min(input.limit ?? 24, 60));
  const warnings: string[] = [];
  const items: FounderContextItem[] = [];

  const working = await retrieveGoogolplexMemory(input.request, Math.min(12, limit));
  for (const memory of working) {
    items.push({
      id: memory.id,
      source: 'googolplex_memory',
      confidence: 'working',
      title: memory.kind,
      content: memory.summary,
      provenance: memory.source,
    });
  }

  // The bootstrap map is explicitly reconstructed navigation metadata. It is
  // owner-scoped and must never be represented as an original chat/source artifact.
  const bootstrap = buildBootstrapProjectHistory(input.ownerId);
  const normalizedTerms = input.query.toLowerCase().split(/\s+/).filter(Boolean);
  const matchingArchive = bootstrap.filter((record) => {
    const haystack = [record.title, record.summary, ...record.tags].join(' ').toLowerCase();
    return normalizedTerms.length === 0 || normalizedTerms.some((term) => haystack.includes(term));
  });
  for (const record of matchingArchive.slice(0, Math.min(24, limit))) {
    items.push({
      id: record.id,
      source: 'founder_archive',
      confidence: 'reconstructed',
      title: record.title,
      content: record.summary,
      provenance: record.sourceRef ?? record.source,
    });
  }

  const matchingDesigns = recoveredLegacyDesigns.filter((design) => {
    const haystack = [design.name, ...design.aliases, design.domain, design.summary].join(' ').toLowerCase();
    return normalizedTerms.length === 0 || normalizedTerms.some((term) => haystack.includes(term));
  });

  for (const design of matchingDesigns.slice(0, Math.min(8, limit))) {
    items.push({
      id: design.id,
      source: 'legacy_design_vault',
      confidence: design.recoveryConfidence,
      title: design.name,
      content: [
        design.summary,
        design.recoveredFacts.length ? `Recovered facts: ${design.recoveredFacts.join('; ')}` : '',
        design.unresolvedSpecs.length ? `Unresolved: ${design.unresolvedSpecs.join('; ')}` : '',
      ].filter(Boolean).join('\n'),
      provenance: design.authoritativeSource,
    });
  }

  if (matchingArchive.length) warnings.push('Founder-history bootstrap items are reconstructed summaries for navigation, not original source artifacts.');
  if (matchingDesigns.some((design) => design.recoveryConfidence !== 'verified')) warnings.push('Some legacy-design records remain partial/reference-only and must not be treated as verified engineering evidence.');

  return { ownerId: input.ownerId, query: input.query, items: items.slice(0, limit), warnings };
}
