import type {
  AnalysisSegment,
  Confidence,
  EntityId,
  EvidenceAssessment,
  InputReference,
  IsoDate,
  IsoDateTime,
  QuantitativeValue,
  ScoreResult,
} from "./common.js";
import type { ActualComparisonMapping } from "./scoring.js";

export interface AdoptionSource {
  id: EntityId;
  title: string;
  publisher: string;
  url?: string;
  sourceType: "official_statistics" | "academic" | "industry" | "independent_research" | "vendor" | "other";
  publicationDate?: IsoDate;
  accessedAt: IsoDate;
  methodologySummary?: string;
  defaultAiDefinition?: string;
  notes?: string;
}

export interface ObservationPeriod {
  start?: IsoDate;
  end?: IsoDate;
  referenceDate?: IsoDate;
  sourceLabel?: string;
}

export interface ObservationGeography {
  level: "country" | "region" | "global" | "other";
  countryId?: EntityId;
  sourceLabel: string;
}

export interface ObservationIndustry {
  sourceCategory: string;
  industryId?: EntityId;
  businessArchetypeId?: EntityId;
  mappingId?: EntityId;
}

export interface SampleMetadata {
  totalSampleSize?: number;
  subgroupSampleSize?: number;
  samplingFrame?: string;
  weightingNotes?: string;
  representativenessNotes?: string;
}

export type ObservationProvenance =
  | {
      kind: "observed";
      directness: "direct";
    }
  | {
      kind: "inherited";
      directness: "inherited";
      parentObservationId: EntityId;
      mismatchedDimensions: Array<"geography" | "industry" | "firm_size" | "time" | "construct" | "other">;
      rationale: string;
      adjustmentDescription?: string;
    }
  | {
      kind: "modeled";
      directness: "modeled";
      modelVersionId: EntityId;
      inputObservationIds: EntityId[];
      method: string;
      validationNotes?: string;
    };

export interface AdoptionObservation {
  id: EntityId;
  sourceId: EntityId;
  sourceLocator?: string;
  questionWording?: string;
  observationPeriod: ObservationPeriod;
  publicationDate?: IsoDate;
  geography: ObservationGeography;
  industry: ObservationIndustry;
  firmSizeId?: EntityId;
  sourceFirmSizeLabel?: string;
  sample: SampleMetadata;
  aiDefinition: string;
  measuredConcept: string;
  denominator: string;
  methodologyNotes?: string;
  value: QuantitativeValue;
  unit: "percent" | "proportion" | "count" | "index_points" | "custom";
  provenance: ObservationProvenance;
  evidence: EvidenceAssessment;
  confidence: Confidence;
  comparison: ActualComparisonMapping;
  extractionNotes?: string;
  extractedBy?: string;
  reviewedBy?: string;
  createdAt: IsoDateTime;
  reviewedAt?: IsoDateTime;
}

export interface AppliedTransformation {
  id: EntityId;
  name: string;
  version: string;
  description: string;
  assumptions: string[];
  inputObservationIds: EntityId[];
}

export interface AdoptionScore {
  id: EntityId;
  segment: AnalysisSegment;
  observationPeriod: ObservationPeriod;
  asOfDate: IsoDate;
  scoreVersionId: EntityId;
  result: ScoreResult;
  evidence: EvidenceAssessment;
  confidence: Confidence;
  inputs: InputReference[];
  transformations: AppliedTransformation[];
  calculatedAt: IsoDateTime;
  supersedesScoreId?: EntityId;
}
