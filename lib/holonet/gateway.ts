import type { HoloNetEnvelope, HoloNetRouteDecision, HoloNetService } from "./types";

const registry: HoloNetService[] = [
  { id:"stubbs-ai", name:"Stubbs AI", kind:"ai", endpoint:"/api/stubbs-ai", public:false, version:"1", capabilities:["reasoning","routing","memory"] },
  { id:"holo-search", name:"Holo Search", kind:"search", endpoint:"/api/holonet/search", public:true, version:"1", capabilities:["TRYAMM discovery","public content search","service search"] },
  { id:"holo-advertise", name:"Holo Advertise", kind:"advertising", endpoint:"/api/holonet/ads", public:false, version:"1", capabilities:["campaign routing","creator placements","marketplace placements"] },
  { id:"marketplace", name:"TRYAMM Marketplace", kind:"commerce", endpoint:"/api/marketplace", public:true, version:"1", capabilities:["catalog","services","creator commerce"] },
  { id:"live", name:"LIVE + PK", kind:"realtime", endpoint:"/live", public:true, version:"1", capabilities:["live rooms","PK","chat"] },
  { id:"games", name:"Games + Living Worlds", kind:"games", endpoint:"/games", public:true, version:"1", capabilities:["multiplayer","persistent worlds","Quantum Beat"] },
  { id:"omni-box", name:"Omni Box", kind:"media", endpoint:"/omni-box", public:true, version:"1", capabilities:["episodes","reels","movies","interactive stories"] },
  { id:"mobility", name:"MobilityOS", kind:"mobility", endpoint:"/api/mobility/mission", public:false, version:"1", capabilities:["mission planning","fleet coordination"] },
];

export function listHoloNetServices() {
  return registry.slice();
}

export function routeHoloNetEnvelope(envelope: HoloNetEnvelope): HoloNetRouteDecision {
  const destination = registry.find((service) => service.id === envelope.destination);
  const reasons: string[] = [];
  if (!destination) reasons.push("unknown destination service");
  if (!envelope.traceId) reasons.push("missing trace id");
  if (!envelope.source) reasons.push("missing source service");

  const highImpact = destination?.kind === "payments" || destination?.kind === "mobility" || destination?.kind === "identity";
  if (highImpact && !envelope.signature) reasons.push("signed envelope required for high-impact route");

  return {
    allowed: reasons.length === 0,
    destination,
    reasons,
    requiresSignature: Boolean(highImpact),
    requiresAudit: !destination?.public || Boolean(highImpact),
  };
}
