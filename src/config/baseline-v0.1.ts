import type { PracticalityOversight, PracticalityRisk, RecommendedAiRole } from "../types/possible.js";

export const BASELINE_CONFIG_V0_1 = {
  id: "possible-config-v0.1",
  version: "0.1.0",
  label: "Version 0.1 experimental weights",
  effectiveFrom: "2026-08-23",
  scoreScale: { minimum: 0, maximum: 100 },
  factorWeights: {
    technicalApplicability: 0.25,
    maturity: 0.15,
    affordability: 0.1,
    reliability: 0.15,
    integrationEase: 0.1,
    oversightSuitability: 0.1,
    riskSuitability: 0.15,
  },
  riskCaps: {
    low: 100,
    moderate: 78,
    high: 45,
    unacceptable: 0,
  } satisfies Record<PracticalityRisk, number>,
  oversightCaps: {
    minimal: 100,
    routine: 88,
    substantial: 62,
    continuous: 40,
  } satisfies Record<PracticalityOversight, number>,
  roleCaps: {
    assist: 68,
    augment: 74,
    partially_automate: 88,
    mostly_automate: 100,
    not_practically_appropriate: 0,
  } satisfies Record<RecommendedAiRole, number>,
  notes: [
    "These weights and caps are explicit experimental judgments, not validated scientific estimates.",
    "Higher normalized factor values always mean greater practicality; difficulty, oversight, and risk are stored as suitability values.",
    "Task-level risk, oversight, and recommended-role caps prevent strong technical capability from implying inappropriate automation.",
  ],
} as const;

const factorWeightTotal = Object.values(BASELINE_CONFIG_V0_1.factorWeights).reduce(
  (sum, weight) => sum + weight,
  0,
);

if (Math.abs(factorWeightTotal - 1) > Number.EPSILON) {
  throw new Error(`Baseline factor weights must sum to 1; received ${factorWeightTotal}`);
}
