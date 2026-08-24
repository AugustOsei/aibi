export type EntityId = string;
export type IsoDate = string;
export type IsoDateTime = string;

export interface AuditFields {
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface EffectivePeriod {
  effectiveFrom: IsoDate;
  effectiveTo?: IsoDate;
}

export type EvidenceGrade = "A" | "B" | "C" | "D" | "insufficient";
export type ConfidenceLevel = "high" | "medium" | "low" | "unknown";

export interface NumericInterval {
  lower: number;
  upper: number;
  confidenceLevelPercent?: number;
  method: string;
}

export interface Confidence {
  level: ConfidenceLevel;
  rationale: string;
  interval?: NumericInterval;
}

export interface EvidenceAssessment {
  grade: EvidenceGrade;
  rationale: string;
  strengths?: string[];
  limitations?: string[];
}

export type QuantitativeValue =
  | {
      kind: "point";
      value: number;
      interval?: NumericInterval;
    }
  | {
      kind: "range";
      lower: number;
      upper: number;
    }
  | {
      kind: "missing";
      reason:
        | "not_collected"
        | "not_published"
        | "not_applicable"
        | "insufficient_evidence"
        | "suppressed"
        | "unknown";
      details?: string;
    };

export interface SourceReference {
  sourceId?: EntityId;
  title: string;
  publisher: string;
  url?: string;
  publicationDate?: IsoDate;
  accessedAt?: IsoDate;
  locator?: string;
}

export interface ScoreResult {
  value: QuantitativeValue;
  unit: "index_points" | "percent" | "proportion" | "custom";
  scale?: { minimum: number; maximum: number };
}

export interface AnalysisSegment {
  countryId: EntityId;
  industryId?: EntityId;
  businessArchetypeId?: EntityId;
  firmSizeId?: EntityId;
}

export interface InputReference {
  entityType: string;
  entityId: EntityId;
  version?: string;
  contentHash?: string;
}
