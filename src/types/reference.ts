import type { AuditFields, Confidence, EffectivePeriod, EntityId, SourceReference } from "./common.js";

export interface Country extends AuditFields {
  id: EntityId;
  name: string;
  iso2: string;
  iso3: string;
  aliases?: string[];
  active: boolean;
}

export interface Industry extends AuditFields {
  id: EntityId;
  name: string;
  description: string;
  parentIndustryId?: EntityId;
  active: boolean;
}

export interface IndustryClassificationMapping extends EffectivePeriod {
  id: EntityId;
  industryId: EntityId;
  system: "NAICS" | "UK_SIC" | "ISIC" | "NACE" | "OTHER";
  systemVersion: string;
  code: string;
  label: string;
  countryId?: EntityId;
  relation: "exact" | "broader" | "narrower" | "overlap";
  confidence: Confidence;
  notes?: string;
}

export interface BusinessArchetype extends AuditFields {
  id: EntityId;
  slug: string;
  name: string;
  description: string;
  relatedIndustryIds?: EntityId[];
  active: boolean;
}

export interface FirmSize {
  id: EntityId;
  slug: "micro" | "small" | "medium" | "large" | string;
  name: string;
  ordinal: number;
  description: string;
  active: boolean;
}

export interface FirmSizeDefinition extends EffectivePeriod {
  id: EntityId;
  firmSizeId: EntityId;
  countryId?: EntityId;
  sourceId?: EntityId;
  metric: "employees" | "annual_revenue" | "assets" | "custom";
  minimum?: number;
  maximum?: number;
  minimumInclusive?: boolean;
  maximumInclusive?: boolean;
  currency?: string;
  notes?: string;
}

export interface BusinessFunction {
  id: EntityId;
  slug: string;
  name: string;
  description: string;
  parentBusinessFunctionId?: EntityId;
  active: boolean;
}

export interface Occupation {
  id: EntityId;
  name: string;
  description: string;
  classificationSystem?: string;
  classificationVersion?: string;
  classificationCode?: string;
  countryId?: EntityId;
  active: boolean;
}

export interface BusinessTask extends AuditFields {
  id: EntityId;
  name: string;
  description: string;
  businessFunctionId: EntityId;
  parentTaskId?: EntityId;
  unitOfWork?: string;
  sourceReferences?: SourceReference[];
  active: boolean;
}

export interface OccupationTask {
  id: EntityId;
  occupationId: EntityId;
  taskId: EntityId;
  importance?: number;
  frequency?: string;
  basis?: string;
}
