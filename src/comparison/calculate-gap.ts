import type { Confidence, ConfidenceLevel, EntityId, EvidenceGrade, QuantitativeValue } from "../types/common.js";
import type { ActualComparisonMapping, UtilizationDepth } from "../types/scoring.js";

export interface PossibleComparisonCell {
  businessFunctionId: EntityId;
  taskId: EntityId;
  utilizationDepth: UtilizationDepth;
  geographyKey: string;
  value: QuantitativeValue;
  normalizedScaleId: string | null;
  weight: number;
}

export interface ActualComparisonCell {
  observationId: EntityId;
  mapping: ActualComparisonMapping;
  value: QuantitativeValue;
  evidenceGrade: EvidenceGrade;
}

export interface GapPolicy {
  numericMinimumCoverage: number;
  directionalMinimumCoverage: number;
  highGapMinimum: number;
  moderateGapMinimum: number;
}

export const GAP_POLICY_V0_1: GapPolicy = {
  numericMinimumCoverage: 0.75,
  directionalMinimumCoverage: 0.5,
  highGapMinimum: 40,
  moderateGapMinimum: 20,
};

interface GapResultBase {
  coverage: number;
  directCoverage: number;
  proxyCoverage: number;
  confidence: Confidence;
  observationIds: EntityId[];
}

export type ComparisonGapResult =
  | (GapResultBase & {
      status: "numeric";
      value: number;
      unit: "percentage_points";
      explanation: string;
    })
  | (GapResultBase & {
      status: "directional";
      direction: "high" | "moderate" | "low";
      explanation: string;
    })
  | (GapResultBase & {
      status: "insufficient";
      reasonCode: "missing_actual" | "incompatible_scale" | "insufficient_coverage" | "unaligned_evidence" | "missing_possible";
      reason: string;
    });

const confidenceRank: Record<ConfidenceLevel, number> = { unknown: 0, low: 1, medium: 2, high: 3 };
const gradeRank: Record<EvidenceGrade, number> = { insufficient: 0, D: 1, C: 2, B: 3, A: 4 };
const round = (value: number) => Math.round(value * 10) / 10;
const roundCoverage = (value: number) => Math.round(value * 1_000) / 1_000;

const pointValue = (value: QuantitativeValue): number | null => value.kind === "point" ? value.value : null;
const normalizedPoint = (value: QuantitativeValue): number | null => {
  const point = pointValue(value);
  return point !== null && Number.isFinite(point) && point >= 0 && point <= 100 ? point : null;
};

const requiredNormalizedPoint = (value: QuantitativeValue): number => {
  const point = normalizedPoint(value);
  if (point === null) throw new Error("Expected a normalized point value between 0 and 100");
  return point;
};

const lowerConfidence = (level: ConfidenceLevel): ConfidenceLevel => {
  if (level === "high") return "medium";
  if (level === "medium") return "low";
  return level;
};

const resultConfidence = (cells: ActualComparisonCell[]): Confidence => {
  let level = cells.reduce<ConfidenceLevel>((lowest, cell) => (
    confidenceRank[cell.mapping.evidenceConfidence.level] < confidenceRank[lowest]
      ? cell.mapping.evidenceConfidence.level
      : lowest
  ), "high");
  const proxy = cells.some(({ mapping }) => mapping.evidenceRelation === "proxy");
  const modeled = cells.some(({ mapping }) => mapping.estimateBasis === "modeled");
  if (proxy) level = lowerConfidence(level);
  if (modeled) level = lowerConfidence(level);
  return {
    level,
    rationale: [
      "Uses the lowest confidence among contributing observations.",
      proxy ? "Proxy evidence lowers the result by one confidence level." : "All contributing evidence is direct.",
      modeled ? "Modeled evidence lowers the result by one additional level." : "All contributing evidence is observed.",
    ].join(" "),
  };
};

const emptyBase = (): GapResultBase => ({
  coverage: 0,
  directCoverage: 0,
  proxyCoverage: 0,
  confidence: { level: "unknown", rationale: "No comparable evidence contributes to the result." },
  observationIds: [],
});

const coordinateMatches = (possible: PossibleComparisonCell, actual: ActualComparisonCell) => (
  actual.mapping.businessFunctionId === possible.businessFunctionId
  && actual.mapping.taskId === possible.taskId
  && actual.mapping.utilizationDepth === possible.utilizationDepth
  && (actual.mapping.geography.geographyId ?? actual.mapping.geography.label) === possible.geographyKey
);

const isTaskMeasure = (mapping: ActualComparisonMapping) => (
  mapping.measure === "task_utilization_rate" || mapping.measure === "task_coverage_rate"
);

const candidateQuality = (cell: ActualComparisonCell) => [
  cell.mapping.evidenceRelation === "direct" ? 1 : 0,
  cell.mapping.estimateBasis === "observed" ? 1 : 0,
  gradeRank[cell.evidenceGrade],
  confidenceRank[cell.mapping.evidenceConfidence.level],
] as const;

const compareCandidates = (left: ActualComparisonCell, right: ActualComparisonCell) => {
  const a = candidateQuality(left);
  const b = candidateQuality(right);
  for (let index = 0; index < a.length; index += 1) {
    const difference = (b[index] ?? 0) - (a[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return left.observationId.localeCompare(right.observationId);
};

export const calculateComparisonGap = (
  possibleCells: PossibleComparisonCell[],
  actualCells: ActualComparisonCell[],
  policy: GapPolicy = GAP_POLICY_V0_1,
): ComparisonGapResult => {
  const weightedPossible = possibleCells.filter(({ weight }) => Number.isFinite(weight) && weight > 0);
  const totalWeight = weightedPossible.reduce((sum, { weight }) => sum + weight, 0);
  const availablePossible = weightedPossible.filter(({ value, normalizedScaleId }) => normalizedPoint(value) !== null && normalizedScaleId !== null);
  if (totalWeight === 0 || availablePossible.length === 0) {
    return { ...emptyBase(), status: "insufficient", reasonCode: "missing_possible", reason: "No normalized Possible task cells are available for comparison." };
  }

  const hasAnyActualValue = actualCells.some(({ value }) => pointValue(value) !== null);
  if (!hasAnyActualValue) {
    return { ...emptyBase(), status: "insufficient", reasonCode: "missing_actual", reason: "Actual evidence is missing; missing values are not treated as zero." };
  }

  const hasAlignedCoordinates = availablePossible.some((possible) => actualCells.some((actual) => coordinateMatches(possible, actual)));
  if (!hasAlignedCoordinates) {
    return { ...emptyBase(), status: "insufficient", reasonCode: "unaligned_evidence", reason: "Actual evidence does not map to the same business functions, tasks, depth, and geography as Possible." };
  }

  const selected = availablePossible.flatMap((possible) => {
    const compatible = actualCells
      .filter((actual) => coordinateMatches(possible, actual))
      .filter(({ mapping, value, evidenceGrade }) => (
        normalizedPoint(value) !== null
        && isTaskMeasure(mapping)
        && mapping.normalizedScaleId !== null
        && mapping.normalizedScaleId === possible.normalizedScaleId
        && gradeRank[evidenceGrade] >= gradeRank.C
        && mapping.evidenceConfidence.level !== "unknown"
      ))
      .sort(compareCandidates);
    const actual = compatible[0];
    return actual ? [{ possible, actual }] : [];
  });

  if (selected.length === 0) {
    return { ...emptyBase(), status: "insufficient", reasonCode: "incompatible_scale", reason: "Aligned observations do not measure task utilization on a scale compatible with Possible." };
  }

  const coverageWeight = selected.reduce((sum, { possible }) => sum + possible.weight, 0);
  const directWeight = selected.reduce((sum, { possible, actual }) => sum + (actual.mapping.evidenceRelation === "direct" ? possible.weight : 0), 0);
  const proxyWeight = coverageWeight - directWeight;
  const coverageRatio = coverageWeight / totalWeight;
  const coverage = roundCoverage(coverageRatio);
  const directCoverage = roundCoverage(directWeight / totalWeight);
  const proxyCoverage = roundCoverage(proxyWeight / totalWeight);
  const usedActual = selected.map(({ actual }) => actual);
  const base: GapResultBase = {
    coverage, directCoverage, proxyCoverage,
    confidence: resultConfidence(usedActual),
    observationIds: usedActual.map(({ observationId }) => observationId),
  };

  const numericPairs = selected.filter(({ actual }) => (
    actual.mapping.evidenceRelation === "direct"
    && actual.mapping.estimateBasis === "observed"
    && gradeRank[actual.evidenceGrade] >= gradeRank.B
  ));
  const numericWeight = numericPairs.reduce((sum, { possible }) => sum + possible.weight, 0);
  const numericCoverage = numericWeight / totalWeight;
  if (numericCoverage >= policy.numericMinimumCoverage) {
    const value = numericPairs.reduce((sum, { possible, actual }) => (
      sum + (requiredNormalizedPoint(possible.value) - requiredNormalizedPoint(actual.value)) * possible.weight
    ), 0) / numericWeight;
    return {
      ...base,
      coverage: roundCoverage(numericCoverage),
      directCoverage: roundCoverage(numericCoverage),
      proxyCoverage: 0,
      confidence: resultConfidence(numericPairs.map(({ actual }) => actual)),
      observationIds: numericPairs.map(({ actual }) => actual.observationId),
      status: "numeric", value: round(value), unit: "percentage_points",
      explanation: `Numeric because directly observed task-level evidence shares the normalized scale and covers ${Math.round(numericCoverage * 100)}% of the weighted Possible task set.`,
    };
  }

  if (coverageRatio >= policy.directionalMinimumCoverage) {
    const weightedGap = selected.reduce((sum, { possible, actual }) => (
      sum + (requiredNormalizedPoint(possible.value) - requiredNormalizedPoint(actual.value)) * possible.weight
    ), 0) / coverageWeight;
    const direction = weightedGap >= policy.highGapMinimum
      ? "high" as const
      : weightedGap >= policy.moderateGapMinimum ? "moderate" as const : "low" as const;
    return {
      ...base,
      status: "directional", direction,
      explanation: `Directional ${direction} under v0.1 rules: comparable task evidence covers ${Math.round(coverage * 100)}%; weighted difference is classified as high at ≥${policy.highGapMinimum}, moderate at ≥${policy.moderateGapMinimum}, otherwise low.`,
    };
  }

  return {
    ...base,
    status: "insufficient", reasonCode: "insufficient_coverage",
    reason: `Comparable task evidence covers ${Math.round(coverage * 100)}%, below the ${Math.round(policy.directionalMinimumCoverage * 100)}% minimum for a directional result.`,
  };
};
