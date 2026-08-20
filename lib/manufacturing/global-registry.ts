export type ManufacturingEntityType =
  | 'holding'
  | 'industrial_os'
  | 'foundry'
  | 'microfoundry'
  | 'robotics'
  | 'energy'
  | 'resources'
  | 'project_spv'
  | 'logistics'
  | 'training';

export interface ManufacturingEntity {
  id: string;
  name: string;
  entityType: ManufacturingEntityType;
  jurisdiction?: string;
  status: 'concept' | 'formed' | 'pilot' | 'operating' | 'blocked';
  capabilities: string[];
  complianceGates: string[];
}

export const globalManufacturingRegistry: ManufacturingEntity[] = [
  {
    id: 'tryamm-industrial-os',
    name: 'TRYAMM Industrial OS',
    entityType: 'industrial_os',
    status: 'pilot',
    capabilities: ['entity registry','BOM/product records','work orders','quality evidence','digital thread','audit events'],
    complianceGates: ['IAM','RLS','QMS integration','change control','audit retention'],
  },
  {
    id: 'omnifoundry',
    name: 'OmniFoundry',
    entityType: 'foundry',
    status: 'concept',
    capabilities: ['additive manufacturing','CNC/robotic cells','inspection','repair/remanufacture','digital product passports'],
    complianceGates: ['site permits','machine safety','QMS','worker safety','product-specific certification'],
  },
  {
    id: 'microfoundries',
    name: 'MicroFoundry Network',
    entityType: 'microfoundry',
    status: 'concept',
    capabilities: ['localized manufacturing','repair','contract production','training','spare-parts production'],
    complianceGates: ['local permits','machine qualification','QMS','supplier qualification','release testing'],
  },
  {
    id: 'fintech-robotics',
    name: 'FinTech Robotics',
    entityType: 'robotics',
    status: 'concept',
    capabilities: ['factory robotics','inspection automation','material handling','digital-twin integration'],
    complianceGates: ['functional safety','OT security','robot-cell validation','human override'],
  },
  {
    id: 'blue-energy',
    name: 'Blue Energy',
    entityType: 'energy',
    status: 'concept',
    capabilities: ['energy R&D','storage research','power-management integration'],
    complianceGates: ['independent testing','electrical safety','claims verification','environmental compliance'],
  },
  {
    id: 'omniresources',
    name: 'OmniResources',
    entityType: 'resources',
    status: 'concept',
    capabilities: ['resource diligence','offtake coordination','provenance','resource passports'],
    complianceGates: ['title diligence','ESIA/environmental review','anti-bribery','sanctions','operator qualification','host-country permits'],
  },
  {
    id: 'quantum-treaty-spv',
    name: 'Quantum Treaty Project SPVs',
    entityType: 'project_spv',
    status: 'concept',
    capabilities: ['country/project JVs','factory-resource integration','local workforce programs','infrastructure coordination'],
    complianceGates: ['entity formation','host-law counsel','beneficial ownership','tax','FX/repatriation','community obligations'],
  },
  {
    id: 'aamu-industrial-training',
    name: 'AAMU Industrial Training',
    entityType: 'training',
    status: 'concept',
    capabilities: ['operator training','quality training','maintenance training','digital-work instructions'],
    complianceGates: ['curriculum approval where required','safety training','credential integrity'],
  },
];

export function manufacturableNow(entity: ManufacturingEntity): boolean {
  return entity.status === 'operating' && entity.complianceGates.length === 0;
}
