export interface HoloFederatedNode {
  id: string;
  origin: string;
  operatorId: string;
  publicKeyId: string;
  capabilities: string[];
  trustLevel: "untrusted" | "limited" | "trusted";
  healthy: boolean;
}

export interface FederationRequest {
  sourceNodeId: string;
  destinationNodeId: string;
  capability: string;
  signed: boolean;
}

export function authorizeFederation(nodes: HoloFederatedNode[], request: FederationRequest) {
  const source = nodes.find((node) => node.id === request.sourceNodeId);
  const destination = nodes.find((node) => node.id === request.destinationNodeId);
  const reasons: string[] = [];
  if (!source || !destination) reasons.push("federation node is unknown");
  if (source && (!source.healthy || source.trustLevel === "untrusted")) reasons.push("source node is not trusted/healthy");
  if (destination && (!destination.healthy || !destination.capabilities.includes(request.capability))) reasons.push("destination cannot accept requested capability");
  if (!request.signed) reasons.push("federated requests must be signed");
  return { allowed: reasons.length === 0, reasons };
}
