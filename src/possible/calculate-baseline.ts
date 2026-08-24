import type { ConfidenceLevel } from "../types/common.js";
import type {
  AiCapabilityVersion,
  CapabilityEvidence,
  PossibleInputReference,
  TaskCapabilityMapping,
} from "../types/possible.js";
import type { WeightedBusinessFunction, LawFirmTask } from "../data/law-firm-model.js";
import { BASELINE_CONFIG_V0_1 } from "../config/baseline-v0.1";

export interface CapabilityContribution {
  capabilityVersionId: string;
  mappingId: string;
  contributionWeight: number;
  uncappedScore: number;
  evidenceIds: string[];
}

export interface TaskPracticalityResult {
  taskId: string;
  taskName: string;
  businessFunctionId: string;
  practicality: number;
  uncappedPracticality: number;
  recommendedRole: LawFirmTask["recommendedRole"];
  majorLimitingFactor: string;
  evidenceConfidence: ConfidenceLevel;
  capabilityContributions: CapabilityContribution[];
}

export interface FunctionPracticalityResult {
  businessFunctionId: string;
  name: string;
  practicality: number;
  weight: number;
  tasks: TaskPracticalityResult[];
}

export interface PossibleBaselineCalculation {
  archetypeId: string;
  archetypeName: string;
  version: string;
  effectiveDate: string;
  scoreConfigurationId: string;
  scoreConfigurationVersion: string;
  overallPracticality: number;
  functions: FunctionPracticalityResult[];
  inputs: PossibleInputReference[];
}

export interface PossibleBaselineDefinition {
  archetype: {
    id: string;
    name: string;
    effectiveFrom: string;
    version: string;
  };
  functions: WeightedBusinessFunction[];
  tasks: LawFirmTask[];
  capabilityVersions: AiCapabilityVersion[];
  capabilityEvidence: CapabilityEvidence[];
  mappings: TaskCapabilityMapping[];
}

type FactorName = keyof typeof BASELINE_CONFIG_V0_1.factorWeights;

const confidenceRank: Record<ConfidenceLevel, number> = { unknown: 0, low: 1, medium: 2, high: 3 };
const round = (value: number) => Math.round(value * 10) / 10;

const normalized = (value: number | undefined, label: string): number => {
  if (value === undefined || value < 0 || value > 1) {
    throw new Error(`${label} must have a normalized value between 0 and 1`);
  }
  return value;
};

const lowestConfidence = (levels: ConfidenceLevel[]): ConfidenceLevel =>
  levels.reduce<ConfidenceLevel>(
    (lowest, current) => confidenceRank[current] < confidenceRank[lowest] ? current : lowest,
    "high",
  );

export const calculatePossibleBaseline = (
  definition: PossibleBaselineDefinition,
): PossibleBaselineCalculation => {
  const allowedDefinitionKeys = new Set([
    "archetype", "functions", "tasks", "capabilityVersions", "capabilityEvidence", "mappings",
  ]);
  const unexpectedKeys = Object.keys(definition).filter((key) => !allowedDefinitionKeys.has(key));
  if (unexpectedKeys.length > 0) {
    throw new Error(`Possible baseline received unsupported inputs: ${unexpectedKeys.join(", ")}`);
  }

  const capabilityById = new Map(definition.capabilityVersions.map((capability) => [capability.id, capability]));
  const evidenceById = new Map(definition.capabilityEvidence.map((evidence) => [evidence.id, evidence]));
  const mappingsByTask = new Map<string, TaskCapabilityMapping[]>();

  for (const mapping of definition.mappings) {
    const mappings = mappingsByTask.get(mapping.taskId) ?? [];
    mappings.push(mapping);
    mappingsByTask.set(mapping.taskId, mappings);
  }

  const functionWeightTotal = definition.functions.reduce((sum, item) => sum + item.weight, 0);
  if (Math.abs(functionWeightTotal - 1) > 0.000_001) {
    throw new Error(`Business-function weights must sum to 1; received ${functionWeightTotal}`);
  }

  const taskResults = definition.tasks.map((task): TaskPracticalityResult => {
    const mappings = mappingsByTask.get(task.id) ?? [];
    if (mappings.length === 0) {
      return {
        taskId: task.id, taskName: task.name, businessFunctionId: task.businessFunctionId,
        practicality: 0, uncappedPracticality: 0,
        recommendedRole: task.recommendedRole,
        majorLimitingFactor: "No applicable AI capability",
        evidenceConfidence: "unknown", capabilityContributions: [],
      };
    }

    const mappingWeightTotal = mappings.reduce((sum, mapping) => sum + mapping.contributionWeight, 0);
    if (Math.abs(mappingWeightTotal - 1) > 0.000_001) {
      throw new Error(`Capability contribution weights for ${task.id} must sum to 1; received ${mappingWeightTotal}`);
    }

    const factorTotals: Record<FactorName, number> = {
      technicalApplicability: 0, maturity: 0, affordability: 0, reliability: 0,
      integrationEase: 0, oversightSuitability: 0, riskSuitability: 0,
    };
    const confidenceLevels: ConfidenceLevel[] = [];

    const capabilityContributions = mappings.map((mapping): CapabilityContribution => {
      const capability = capabilityById.get(mapping.capabilityVersionId);
      if (!capability) throw new Error(`Missing capability version ${mapping.capabilityVersionId}`);
      const factorValues: Record<FactorName, number> = {
        technicalApplicability:
          normalized(capability.technicalApplicability.normalizedValue, "technical applicability") *
          normalized(mapping.applicability.normalizedValue, "task applicability"),
        maturity: normalized(capability.maturity.normalizedValue, "maturity"),
        affordability: normalized(capability.affordability.normalizedValue, "affordability"),
        reliability: normalized(capability.reliability.normalizedValue, "reliability"),
        integrationEase: normalized(capability.integrationDifficulty.normalizedValue, "integration ease"),
        oversightSuitability: normalized(capability.humanOversightRequirement.normalizedValue, "oversight suitability"),
        riskSuitability: normalized(capability.risk.normalizedValue, "risk suitability"),
      };
      for (const factor of Object.keys(factorTotals) as FactorName[]) {
        factorTotals[factor] += factorValues[factor] * mapping.contributionWeight;
      }
      const evidence = capability.evidenceIds.map((id) => evidenceById.get(id));
      if (evidence.some((item) => !item)) throw new Error(`Capability ${capability.id} has unresolved evidence`);
      confidenceLevels.push(...evidence.map((item) => item?.confidence.level ?? "unknown"));
      const uncappedScore = Object.entries(BASELINE_CONFIG_V0_1.factorWeights).reduce(
        (sum, [factor, weight]) => sum + factorValues[factor as FactorName] * weight,
        0,
      ) * 100;
      return {
        capabilityVersionId: capability.id, mappingId: mapping.id,
        contributionWeight: mapping.contributionWeight, uncappedScore: round(uncappedScore),
        evidenceIds: capability.evidenceIds,
      };
    });

    const uncappedPracticality = Object.entries(BASELINE_CONFIG_V0_1.factorWeights).reduce(
      (sum, [factor, weight]) => sum + factorTotals[factor as FactorName] * weight,
      0,
    ) * 100;
    const caps = {
      "Task risk": BASELINE_CONFIG_V0_1.riskCaps[task.risk],
      "Required human oversight": BASELINE_CONFIG_V0_1.oversightCaps[task.oversight],
      "Recommended AI role": BASELINE_CONFIG_V0_1.roleCaps[task.recommendedRole],
    };
    const [capName, capValue] = Object.entries(caps).sort((a, b) => a[1] - b[1])[0] ?? ["None", 100];
    const lowestFactor = (Object.entries(factorTotals) as Array<[FactorName, number]>).sort((a, b) => a[1] - b[1])[0];
    const practicality = Math.min(uncappedPracticality, capValue);
    const majorLimitingFactor = capValue < uncappedPracticality
      ? `${capName} cap (${capValue})`
      : `${lowestFactor?.[0] ?? "Unknown"} (${round((lowestFactor?.[1] ?? 0) * 100)})`;

    return {
      taskId: task.id, taskName: task.name, businessFunctionId: task.businessFunctionId,
      practicality: round(practicality), uncappedPracticality: round(uncappedPracticality),
      recommendedRole: task.recommendedRole, majorLimitingFactor,
      evidenceConfidence: lowestConfidence(confidenceLevels), capabilityContributions,
    };
  });

  const functions = definition.functions.map((businessFunction): FunctionPracticalityResult => {
    const tasks = taskResults.filter((task) => task.businessFunctionId === businessFunction.id);
    const taskDefinitions = definition.tasks.filter((task) => task.businessFunctionId === businessFunction.id);
    if (tasks.length === 0) throw new Error(`Business function ${businessFunction.id} has no tasks`);
    const taskWeightTotal = taskDefinitions.reduce((sum, task) => sum + task.weightWithinFunction, 0);
    if (Math.abs(taskWeightTotal - 1) > 0.000_001) {
      throw new Error(`Task weights for ${businessFunction.id} must sum to 1; received ${taskWeightTotal}`);
    }
    const practicality = tasks.reduce((sum, result) => {
      const taskDefinition = taskDefinitions.find((task) => task.id === result.taskId);
      if (!taskDefinition) throw new Error(`Missing task definition ${result.taskId}`);
      return sum + result.practicality * taskDefinition.weightWithinFunction;
    }, 0);
    return { businessFunctionId: businessFunction.id, name: businessFunction.name, practicality: round(practicality), weight: businessFunction.weight, tasks };
  });

  const overallPracticality = functions.reduce(
    (sum, businessFunction) => sum + businessFunction.practicality * businessFunction.weight,
    0,
  );

  const inputs: PossibleInputReference[] = [
    { entityType: "possible_score_configuration", entityId: BASELINE_CONFIG_V0_1.id, version: BASELINE_CONFIG_V0_1.version },
    ...definition.functions.map((item) => ({ entityType: "business_function" as const, entityId: item.id })),
    ...definition.tasks.map((item) => ({ entityType: "business_task" as const, entityId: item.id })),
    ...definition.capabilityVersions.map((item) => ({ entityType: "ai_capability_version" as const, entityId: item.id, version: item.version })),
    ...definition.capabilityEvidence.map((item) => ({ entityType: "capability_evidence" as const, entityId: item.id })),
    ...definition.mappings.map((item) => ({ entityType: "task_capability_mapping" as const, entityId: item.id, version: item.version })),
  ];

  return {
    archetypeId: definition.archetype.id, archetypeName: definition.archetype.name,
    version: definition.archetype.version, effectiveDate: definition.archetype.effectiveFrom,
    scoreConfigurationId: BASELINE_CONFIG_V0_1.id,
    scoreConfigurationVersion: BASELINE_CONFIG_V0_1.version,
    overallPracticality: round(overallPracticality), functions, inputs,
  };
};
