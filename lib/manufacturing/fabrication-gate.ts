export type FabricationArtifact = "cad" | "step" | "stl" | "bom" | "material_spec" | "process_plan";

export interface FabricationPackage {
  designId: string;
  vehicleClass: string;
  artifacts: FabricationArtifact[];
  structuralAnalysisComplete: boolean;
  thermalAnalysisComplete: boolean;
  electricalAnalysisComplete: boolean;
  materialsVerified: boolean;
  manufacturingProcessVerified: boolean;
  humanEngineerApproval: boolean;
  regulatoryApprovalRequired: boolean;
  regulatoryApprovalRecorded: boolean;
}

export interface FabricationDecision {
  allowed: boolean;
  blockers: string[];
  requiredArtifacts: FabricationArtifact[];
}

const REQUIRED: FabricationArtifact[] = ["cad", "step", "bom", "material_spec", "process_plan"];

export function evaluateFabrication(packageData: FabricationPackage): FabricationDecision {
  const blockers: string[] = [];
  const missingArtifacts = REQUIRED.filter((artifact) => !packageData.artifacts.includes(artifact));

  if (missingArtifacts.length > 0) blockers.push(`missing fabrication artifacts: ${missingArtifacts.join(", ")}`);
  if (!packageData.structuralAnalysisComplete) blockers.push("structural analysis incomplete");
  if (!packageData.thermalAnalysisComplete) blockers.push("thermal analysis incomplete");
  if (!packageData.electricalAnalysisComplete) blockers.push("electrical analysis incomplete");
  if (!packageData.materialsVerified) blockers.push("materials not verified");
  if (!packageData.manufacturingProcessVerified) blockers.push("manufacturing process not verified");
  if (!packageData.humanEngineerApproval) blockers.push("human engineering approval required");
  if (packageData.regulatoryApprovalRequired && !packageData.regulatoryApprovalRecorded) {
    blockers.push("required regulatory approval not recorded");
  }

  return {
    allowed: blockers.length === 0,
    blockers,
    requiredArtifacts: missingArtifacts,
  };
}
