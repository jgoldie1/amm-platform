export type CelestialKind = 'planet'|'moon'|'star'|'star_cluster'|'constellation'|'deep_sky'|'historical_world'|'fictional_world';

export type CelestialNode = {
  id: string;
  name: string;
  kind: CelestialKind;
  parentId?: string;
  scienceMode: 'observed'|'modeled'|'reconstructed'|'fictional';
  missionTags: string[];
  spatialModes: Array<'screen'|'ar'|'vr'|'mr'|'holo5dx'>;
};

export const CELESTIAL_NODES: CelestialNode[] = [
  { id:'earth', name:'Earth', kind:'planet', scienceMode:'observed', missionTags:['twin-earth','history','live','creator'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'moon', name:'Moon', kind:'moon', parentId:'earth', scienceMode:'observed', missionTags:['landing','exploration','science','base-building'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'mercury', name:'Mercury', kind:'planet', scienceMode:'observed', missionTags:['surface','solar-observation'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'venus', name:'Venus', kind:'planet', scienceMode:'observed', missionTags:['atmosphere','orbital','science'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'mars', name:'Mars', kind:'planet', scienceMode:'observed', missionTags:['landing','rover','drone','settlement','science','rescue'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'ceres', name:'Ceres', kind:'planet', scienceMode:'observed', missionTags:['asteroid-belt','mining-sim','science'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'jupiter', name:'Jupiter', kind:'planet', scienceMode:'observed', missionTags:['orbital','storm-science','moon-gateway'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'europa', name:'Europa', kind:'moon', parentId:'jupiter', scienceMode:'observed', missionTags:['ice','ocean-science','robotics'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'ganymede', name:'Ganymede', kind:'moon', parentId:'jupiter', scienceMode:'observed', missionTags:['surface','science'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'saturn', name:'Saturn', kind:'planet', scienceMode:'observed', missionTags:['rings','orbital','moon-gateway'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'titan', name:'Titan', kind:'moon', parentId:'saturn', scienceMode:'observed', missionTags:['atmosphere','surface','drone'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'enceladus', name:'Enceladus', kind:'moon', parentId:'saturn', scienceMode:'observed', missionTags:['ice','plumes','science'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'uranus', name:'Uranus', kind:'planet', scienceMode:'observed', missionTags:['orbital','science'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'neptune', name:'Neptune', kind:'planet', scienceMode:'observed', missionTags:['orbital','storm-science'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'pluto', name:'Pluto', kind:'planet', scienceMode:'observed', missionTags:['kuiper-belt','surface','science'], spatialModes:['screen','ar','vr','mr','holo5dx'] },

  { id:'sun', name:'Sun', kind:'star', scienceMode:'observed', missionTags:['solar-observation','space-weather'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'sirius', name:'Sirius', kind:'star', scienceMode:'observed', missionTags:['stellar-navigation','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'betelgeuse', name:'Betelgeuse', kind:'star', scienceMode:'observed', missionTags:['stellar-evolution','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'vega', name:'Vega', kind:'star', scienceMode:'observed', missionTags:['stellar-navigation','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'polaris', name:'Polaris', kind:'star', scienceMode:'observed', missionTags:['navigation','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'pleiades', name:'Pleiades (M45)', kind:'star_cluster', scienceMode:'observed', missionTags:['cluster-tour','stellar-education','creator-worlds'], spatialModes:['screen','ar','vr','mr','holo5dx'] },

  { id:'orion', name:'Orion', kind:'constellation', scienceMode:'reconstructed', missionTags:['sky-map','mythology','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'ursa-major', name:'Ursa Major', kind:'constellation', scienceMode:'reconstructed', missionTags:['sky-map','navigation','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'ursa-minor', name:'Ursa Minor', kind:'constellation', scienceMode:'reconstructed', missionTags:['sky-map','navigation','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'cassiopeia', name:'Cassiopeia', kind:'constellation', scienceMode:'reconstructed', missionTags:['sky-map','mythology','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'scorpius', name:'Scorpius', kind:'constellation', scienceMode:'reconstructed', missionTags:['sky-map','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'leo', name:'Leo', kind:'constellation', scienceMode:'reconstructed', missionTags:['sky-map','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'aquarius', name:'Aquarius', kind:'constellation', scienceMode:'reconstructed', missionTags:['sky-map','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'taurus', name:'Taurus', kind:'constellation', scienceMode:'reconstructed', missionTags:['sky-map','pleiades-gateway','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },

  { id:'orion-nebula', name:'Orion Nebula (M42)', kind:'deep_sky', scienceMode:'observed', missionTags:['nebula-tour','stellar-formation'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'andromeda-galaxy', name:'Andromeda Galaxy (M31)', kind:'deep_sky', scienceMode:'observed', missionTags:['galaxy-tour','astronomy'], spatialModes:['screen','ar','vr','mr','holo5dx'] },

  { id:'ancient-jerusalem', name:'Ancient Jerusalem', kind:'historical_world', scienceMode:'reconstructed', missionTags:['history','faith','education'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
  { id:'africa-trade-kingdom', name:'Africa Trade Kingdom', kind:'historical_world', scienceMode:'reconstructed', missionTags:['history','trade','education'], spatialModes:['screen','ar','vr','mr','holo5dx'] },
];

export function findCelestialNode(id: string) {
  return CELESTIAL_NODES.find(node => node.id === id) ?? null;
}

export function listCelestialByKind(kind: CelestialKind) {
  return CELESTIAL_NODES.filter(node => node.kind === kind);
}
