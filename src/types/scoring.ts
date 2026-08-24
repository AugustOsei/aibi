import type {
  AnalysisSegment,
  Confidence,
  EntityId,
  IsoDate,
  IsoDateTime,
} from "./common.js";

export type ScoreKind = "baseline" | "adoption" | "gap";

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
      status: "calculated";
      value: number;
      unit: "index_points" | "percentage_points" | "custom";
    }
  | {
      status: "missing_adoption";
      reason: string;
    }
  | {
      status: "not_comparable";
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
