import type { ForgeRequest, ForgeResult } from "./types";

const PHYSICAL_TYPES = new Set(["cad", "stl", "step", "bom"]);

export function planForgeRequest(request: ForgeRequest): ForgeResult {
  const reasons: string[] = [];
  const nextActions: string[] = [
    "route generation through Stubbs AI and the configured generation provider",
    "preserve provenance and source-asset references",
    "run moderation/IP/commercial-use checks before public publishing",
  ];

  if (!request.prompt.trim()) {
    return {
      requestId: request.id,
      status: "blocked",
      assetIds: [],
      reasons: ["forge prompt is required"],
      nextActions: [],
    };
  }

  if (request.accessibility?.captions) nextActions.push("generate and verify captions");
  if (request.accessibility?.altText) nextActions.push("generate and verify alt text");
  if (request.accessibility?.transcript) nextActions.push("generate and verify transcript");
  if (request.accessibility?.reducedMotionVariant) nextActions.push("generate reduced-motion variant");

  if (request.commercialUseIntended) {
    nextActions.push("verify commercial-use rights and marketplace policy before monetization");
  }

  if (request.manufacturingUseIntended || PHYSICAL_TYPES.has(request.assetType)) {
    reasons.push("physical/manufacturing output requires deterministic ManufacturingOS review");
    nextActions.push("send CAD/STL/STEP/BOM outputs through the fabrication safety gate before BUILD");
    return {
      requestId: request.id,
      status: "needs_review",
      assetIds: [],
      reasons,
      nextActions,
    };
  }

  return {
    requestId: request.id,
    status: "queued",
    assetIds: [],
    reasons,
    nextActions,
  };
}
