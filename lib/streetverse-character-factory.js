// StreetVerse Universal Character Factory — additive integration module.
// No GLB asset or animation is bundled; attach verified assets separately.
export const CHARACTER_IDS = ["bj-stubbs", "jacobie-stubbs", "lateasia", "marcus", "isaiah"];
export const REQUIRED_BONES = ["hips", "spine", "head", "leftUpperArm", "rightUpperArm", "leftUpperLeg", "rightUpperLeg"];
export const ANIMATIONS = { idle:"Idle", walk:"Walking", injured:"Limp", fall:"Falling", sit:"Sitting", recover:"GettingUp" };
export function createCharacter(id, options = {}) {
  if (!CHARACTER_IDS.includes(id) && !/^[a-z0-9-]{1,64}$/.test(id)) throw new Error("Invalid character id");
  return { id, appearance:{weightDeltaLb:0,heightDeltaCm:0,muscle:50,...options.appearance},
    health:100, injuries:[], events:[], animation:"idle", assetStatus:"awaiting-verified-glb" };
}
export function setAppearance(character, patch) {
  const next={...character.appearance,...patch};
  if (!Number.isFinite(next.weightDeltaLb)||next.weightDeltaLb < -60||next.weightDeltaLb > 60) throw new Error("Invalid visual weight delta");
  if (!Number.isFinite(next.heightDeltaCm)||Math.abs(next.heightDeltaCm)>15) throw new Error("Invalid height delta");
  if (!Number.isFinite(next.muscle)||next.muscle<0||next.muscle>100) throw new Error("Invalid muscle value");
  character.appearance=next; return character;
}
export function applyInjury(character, {eventId,type,location,severity=1}) {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(eventId||"")) throw new Error("eventId required");
  if (character.events.includes(eventId)) return false;
  if (!["fracture","stab","gunshot","fall","bruise"].includes(type)) throw new Error("Unsupported injury");
  if (!["arm","leg","torso","head"].includes(location)) throw new Error("Unsupported location");
  if (!Number.isInteger(severity)||severity<1||severity>3) throw new Error("Invalid severity");
  character.events.push(eventId);
  character.injuries.push({eventId,type,location,severity,status:"untreated"});
  character.health=Math.max(0,character.health-severity*10);
  character.animation=location==="leg"?"injured":"idle";
  return true;
}
export function triage(character) {
  const max=Math.max(0,...character.injuries.filter(i=>i.status==="untreated").map(i=>i.severity));
  return {priority:max===3?"urgent":max===2?"moderate":max===1?"minor":"none",fictional:true};
}
export function treat(character,eventId) {
  const injury=character.injuries.find(i=>i.eventId===eventId);
  if (!injury) return false;
  if (injury.status==="treated") return false;
  injury.status="treated";
  character.health=Math.min(100,character.health+injury.severity*10);
  character.animation=character.injuries.some(i=>i.status==="untreated"&&i.location==="leg")?"injured":"idle";
  return true;
}
export function inspectGltf(gltf) {
  const nodes=gltf?.parser?.json?.nodes||gltf?.nodes||[];
  const names=new Set(nodes.map(n=>String(n.name||"").toLowerCase().replace(/[^a-z]/g,"")));
  const missing=REQUIRED_BONES.filter(b=>!names.has(b.toLowerCase()));
  return {boneCount:nodes.length,missingBones:missing,compatible:missing.length===0,
    animationCount:gltf?.animations?.length||0};
}
export function animationFor(character,availableClips=[]) {
  const wanted=ANIMATIONS[character.animation]||ANIMATIONS.idle;
  return availableClips.includes(wanted)?wanted:availableClips.includes("Idle")?"Idle":null;
}
