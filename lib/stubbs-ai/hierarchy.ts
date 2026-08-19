export type AgentTier =
  | "executive"
  | "critic"
  | "guardian"
  | "specialist"
  | "worker";

export interface HierarchyNode {
  id: string;
  tier: AgentTier;
  parentId?: string;
  domain: string;
  mayExecuteSideEffects: boolean;
  requiresDeterministicVerifier: boolean;
}

export const STUBBS_AI_HIERARCHY: HierarchyNode[] = [
  {
    id: "stubbs-ai-executive",
    tier: "executive",
    domain: "core",
    mayExecuteSideEffects: false,
    requiresDeterministicVerifier: true,
  },
  {
    id: "stubbs-ai-critic",
    tier: "critic",
    parentId: "stubbs-ai-executive",
    domain: "core",
    mayExecuteSideEffects: false,
    requiresDeterministicVerifier: true,
  },
  {
    id: "stubbs-ai-guardian",
    tier: "guardian",
    parentId: "stubbs-ai-executive",
    domain: "security",
    mayExecuteSideEffects: false,
    requiresDeterministicVerifier: true,
  },
];

export function registerSpecialist(
  id: string,
  domain: string,
  parentId = "stubbs-ai-executive",
): HierarchyNode {
  return {
    id,
    tier: "specialist",
    parentId,
    domain,
    mayExecuteSideEffects: false,
    requiresDeterministicVerifier: true,
  };
}

export function hierarchyPath(node: HierarchyNode): string[] {
  const nodes = new Map(STUBBS_AI_HIERARCHY.map((item) => [item.id, item]));
  const path = [node.id];
  let current = node;

  while (current.parentId) {
    path.unshift(current.parentId);
    const parent = nodes.get(current.parentId);
    if (!parent) break;
    current = parent;
  }

  return path;
}
