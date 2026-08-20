import { findCelestialNode } from './celestial-registry';

export type MissionPlan = {
  destinationId: string;
  destinationName: string;
  timeline: 'present'|'historical'|'future-model'|'fictional'|'alternate-fictional';
  spatialMode: 'screen'|'ar'|'vr'|'mr'|'holo5dx';
  transition: Array<'checkpoint'|'security-check'|'entitlement-check'|'asset-stream'|'quantum-leap-fx'|'restore-state'|'realtime-join'>;
  objectives: string[];
  echoEnabled: boolean;
  economyEnabled: boolean;
};

export function buildMissionPlan(input: {
  destinationId: string;
  timeline?: MissionPlan['timeline'];
  spatialMode?: MissionPlan['spatialMode'];
}): MissionPlan {
  const node = findCelestialNode(input.destinationId);
  if (!node) throw new Error('UNKNOWN_DESTINATION');

  const spatialMode = input.spatialMode ?? 'screen';
  if (!node.spatialModes.includes(spatialMode)) throw new Error('UNSUPPORTED_SPATIAL_MODE');

  const timeline = input.timeline ?? 'present';
  const objectives = node.missionTags.map(tag => `Complete ${tag.replaceAll('-', ' ')} objective`);

  return {
    destinationId: node.id,
    destinationName: node.name,
    timeline,
    spatialMode,
    transition: [
      'checkpoint',
      'security-check',
      'entitlement-check',
      'asset-stream',
      'quantum-leap-fx',
      'restore-state',
      'realtime-join',
    ],
    objectives,
    echoEnabled: true,
    economyEnabled: true,
  };
}
