import type {
  AnalysisSegment,
  Confidence,
  EntityId,
  EvidenceGrade,
  IsoDate,
  IsoDateTime,
} from "./common.js";

export type ScoreKind = "baseline" | "adoption" | "gap";

/** Shared depth vocabulary used by both Possible use cases and Actual evidence. */
export type UtilizationDepth = "standard" | "integrated" | "advanced";

export type UtilizationMeasure =
  | "task_utilization_rate"
  | "task_coverage_rate"
  | "business_function_utilization_rate"
  | "broad_adoption_prevalence"
  | "tool_use_frequency"
  | "other";

export interface ComparisonGeography {
  level: "country" | "region" | "global" | "other";
  geographyId?: EntityId;
  label: string;
}

/**
 * Explicit bridge from a raw Actual observation into the Possible task/depth
 * taxonomy. Null coordinates are intentional: broad evidence must remain
 * visible without being misrepresented as task-aligned evidence.
 */
export interface ActualComparisonMapping {
  businessFunctionId: EntityId | null;
  taskId: EntityId | null;
  utilizationDepth: UtilizationDepth | null;
  evidenceRelation: "direct" | "proxy";
  geography: ComparisonGeography;
  evidenceConfidence: Confidence;
  estimateBasis: "observed" | "modeled";
  measure: UtilizationMeasure;
  normalizedScaleId: string | null;
  mappingRationale: string;
}

export interface ComparisonEvidenceSummary {
  observationIds: EntityId[];
  grades: EvidenceGrade[];
  directCoverage: number;
  proxyCoverage: number;
}

export interface ScoreVersion {
  id: EntityId;
  scoreKind: ScoreKind;
  version: string;
  status: "draft" | "active" | "retired";
  construct: string;
  outputScale: {
    unit: "index_points" | "percent" | "proportion" | "custom";
    minimum?: number;
    maximum?: number;
  };
  algorithmId: string;
  /** Experimental factors and weights live here, not in entity definitions. */
  configuration: Record<string, unknown>;
  compatibilityKey: string;
  inputDataCutoff?: IsoDate;
  effectiveFrom: IsoDate;
  releasedAt?: IsoDateTime;
  changelog: string;
  owner: string;
}

export interface CompatibilityCheck {
  dimension: "geography" | "industry" | "archetype" | "firm_size" | "period" | "construct" | "unit" | "score_version";
  compatible: boolean;
  notes?: string;
}

export type GapResult =
  | {
      status: "numeric";
      value: number;
      unit: "index_points" | "percentage_points" | "custom";
      coverage: number;
      explanation: string;
    }
  | {
      status: "directional";
      direction: "high" | "moderate" | "low";
      coverage: number;
      explanation: string;
    }
  | {
      status: "insufficient";
      reasonCode: "missing_actual" | "incompatible_scale" | "insufficient_coverage" | "unaligned_evidence" | "missing_possible";
      reason: string;
    };

export interface GapScore {
  id: EntityId;
  segment: AnalysisSegment;
  baselineScoreId: EntityId;
  adoptionScoreId?: EntityId;
  scoreVersionId: EntityId;
  result: GapResult;
  compatibilityChecks: CompatibilityCheck[];
  confidence: Confidence;
  evidenceSummary?: ComparisonEvidenceSummary;
  calculatedAt: IsoDateTime;
  notes?: string;
}

export interface ScoreHistory {
  id: EntityId;
  scoreKind: ScoreKind;
  scoreId: EntityId;
  segmentKey: string;
  scoreVersionId: EntityId;
  event: "created" | "superseded" | "withdrawn";
  occurredAt: IsoDateTime;
  previousScoreId?: EntityId;
  reason?: string;
  actor?: string;
}
