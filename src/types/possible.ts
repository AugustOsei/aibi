import type {
  AuditFields,
  Confidence,
  EffectivePeriod,
  EntityId,
  IsoDate,
  IsoDateTime,
  ScoreResult,
  SourceReference,
} from "./common.js";

export interface AiCapability extends AuditFields {
  id: EntityId;
  slug: string;
  name: string;
  description: string;
  category: string;
  active: boolean;
}

export interface RatedFactor<TLevel extends string = string> {
  level: TLevel;
  normalizedValue?: number;
  scaleId?: string;
  rationale: string;
  evidenceIds: EntityId[];
}

export interface AiCapabilityVersion extends EffectivePeriod {
  id: EntityId;
  capabilityId: EntityId;
  version: string;
  status: "draft" | "reviewed" | "active" | "retired";
  assessedAt: IsoDateTime;
  technicalApplicability: RatedFactor<"none" | "limited" | "partial" | "broad">;
  maturity: RatedFactor<"experimental" | "emerging" | "mature">;
  affordability: RatedFactor<"prohibitive" | "high_cost" | "moderate" | "accessible">;
  reliability: RatedFactor<"unreliable" | "variable" | "reliable" | "highly_reliable">;
  integrationDifficulty: RatedFactor<"low" | "moderate" | "high" | "very_high">;
  humanOversightRequirement: RatedFactor<"minimal" | "routine" | "substantial" | "continuous">;
  risk: RatedFactor<"low" | "moderate" | "high" | "unacceptable">;
  limitations: string[];
  evidenceIds: EntityId[];
}

export interface CapabilityEvidence {
  id: EntityId;
  capabilityVersionId: EntityId;
  source: SourceReference;
  evidenceType: "benchmark" | "product_documentation" | "independent_test" | "research" | "professional_guidance" | "other";
  supportsFactors: Array<
    | "technical_applicability"
    | "maturity"
    | "affordability"
    | "reliability"
    | "integration_difficulty"
    | "human_oversight"
    | "risk"
  >;
  confidence: Confidence;
  notes?: string;
}

export interface TaskCapabilityMapping extends EffectivePeriod {
  id: EntityId;
  taskId: EntityId;
  capabilityVersionId: EntityId;
  version: string;
  supportMode: RecommendedAiRole;
  contributionWeight: number;
  applicability: RatedFactor<"none" | "limited" | "partial" | "broad">;
  coverageNotes: string;
  prerequisites?: string[];
  constraints?: string[];
  humanRole: string;
  evidenceIds: EntityId[];
}

export type RecommendedAiRole =
  | "assist"
  | "augment"
  | "partially_automate"
  | "mostly_automate"
  | "not_practically_appropriate";

export type PracticalityRisk = "low" | "moderate" | "high" | "unacceptable";
export type PracticalityOversight = "minimal" | "routine" | "substantial" | "continuous";

export interface PossibleAnalysisSegment {
  businessArchetypeId: EntityId;
  firmSizeIds: EntityId[];
  industryId?: EntityId;
  /** Omitted for the pre-country technological/business baseline. */
  countryId?: EntityId;
}

export type PossibleInputReference =
  | { entityType: "ai_capability_version"; entityId: EntityId; version: string }
  | { entityType: "capability_evidence"; entityId: EntityId }
  | { entityType: "business_task"; entityId: EntityId }
  | { entityType: "business_function"; entityId: EntityId }
  | { entityType: "task_capability_mapping"; entityId: EntityId; version: string }
  | { entityType: "industry_task_weight"; entityId: EntityId; version: string }
  | { entityType: "possible_score_configuration"; entityId: EntityId; version: string };

export interface IndustryTaskWeight extends EffectivePeriod {
  id: EntityId;
  industryId?: EntityId;
  businessArchetypeId?: EntityId;
  firmSizeId?: EntityId;
  taskId: EntityId;
  version: string;
  weight: number;
  scaleId: string;
  basis: string;
  evidence: SourceReference[];
}

export interface CountryModifier extends EffectivePeriod {
  id: EntityId;
  countryId: EntityId;
  factor: "language_coverage" | "digital_infrastructure" | "labor_economics" | "regulation" | "data_access" | "product_availability" | "custom";
  scope: {
    capabilityId?: EntityId;
    taskId?: EntityId;
    industryId?: EntityId;
    businessArchetypeId?: EntityId;
    firmSizeId?: EntityId;
  };
  version: string;
  direction: "increase" | "decrease" | "neutral";
  value?: number;
  range?: { lower: number; upper: number };
  scaleId: string;
  rationale: string;
  evidence: SourceReference[];
  confidence: Confidence;
}

export interface BaselineScore {
  id: EntityId;
  segment: PossibleAnalysisSegment;
  asOfDate: IsoDate;
  scoreVersionId: EntityId;
  result: ScoreResult;
  confidence: Confidence;
  inputs: PossibleInputReference[];
  contributions?: Array<{ input: PossibleInputReference; value: number; notes?: string }>;
  calculatedAt: IsoDateTime;
  supersedesScoreId?: EntityId;
}
