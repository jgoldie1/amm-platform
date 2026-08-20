export interface HoloEdgeNode {
  id: string;
  region: string;
  baseUrl: string;
  healthy: boolean;
  load: number;
  p95LatencyMs: number;
  supports: string[];
}

export interface EdgeRequestProfile {
  capability: string;
  preferredRegion?: string;
  maxP95LatencyMs: number;
}

export function selectHoloEdge(nodes: HoloEdgeNode[], request: EdgeRequestProfile): HoloEdgeNode | undefined {
  return nodes
    .filter((node) => node.healthy && node.supports.includes(request.capability) && node.p95LatencyMs <= request.maxP95LatencyMs)
    .sort((a, b) => {
      const regionScoreA = a.region === request.preferredRegion ? -1000 : 0;
      const regionScoreB = b.region === request.preferredRegion ? -1000 : 0;
      return (a.p95LatencyMs + a.load + regionScoreA) - (b.p95LatencyMs + b.load + regionScoreB);
    })[0];
}
