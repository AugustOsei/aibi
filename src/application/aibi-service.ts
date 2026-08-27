import archetypeSeeds from "../../data/seeds/business-archetypes.json" with { type: "json" };
import countrySeeds from "../../data/seeds/countries.json" with { type: "json" };

import { AI_CAPABILITIES, AI_CAPABILITY_VERSIONS, CAPABILITY_EVIDENCE } from "../data/ai-capabilities";
import { COUNTRY_ADOPTION_SOURCES, COUNTRY_SECTOR_ADOPTION_OBSERVATIONS, GHANA_EVIDENCE_NOTE } from "../data/country-adoption";
import { LAW_FIRM_ADOPTION_OBSERVATIONS, LAW_FIRM_ADOPTION_SOURCES } from "../data/law-firm-adoption";
import { LAW_FIRM_ARCHETYPE, LAW_FIRM_TASKS } from "../data/law-firm-model";
import { getIndustryOutlook } from "../data/industry-outlooks";
import { calculateLawFirmBaseline } from "../possible/law-firm-baseline";
import type { UtilizationDepth } from "../types/scoring";

export type DataStatus = "available" | "partial" | "insufficient_evidence" | "in_development";

export interface IndustrySummaryView {
  slug: string;
  name: string;
  description: string;
  status: DataStatus;
  statusLabel: string;
}

export interface CountrySummaryView {
  slug: string;
  name: string;
  iso2: string;
  status: DataStatus;
  statusLabel: string;
}

export interface CountrySectorObservationView {
  id: string;
  sectorLabel: string;
  value: number;
  measuredConcept: string;
  period: string;
  mappedIndustries: IndustrySummaryView[];
  mappingNote: string;
  evidenceGrade: string;
  confidence: string;
  derivation?: string;
}

export interface CountryEvidenceView {
  country: CountrySummaryView;
  status: "partial" | "insufficient_evidence";
  statusLabel: string;
  observations: CountrySectorObservationView[];
  source: EvidenceSourceView & { methodology: string };
  note: string;
}

interface StandardDestinationView {
  value: 100;
  unit: "percent";
  label: "Standard AI destination";
  definition: string;
}

export type IndustryAdoptionHeadroomView =
  | {
      status: "available";
      industry: IndustrySummaryView;
      country: CountrySummaryView;
      destination: StandardDestinationView;
      actual: Omit<CountrySectorObservationView, "mappedIndustries"> & {
        unit: "percent";
        evidenceRelation: "proxy";
        source: CountryEvidenceView["source"];
      };
      headroom: {
        value: number;
        unit: "percentage_points";
        formula: string;
      };
      snapshotNote: string;
    }
  | {
      status: "insufficient";
      industry: IndustrySummaryView;
      country: CountrySummaryView | null;
      destination: StandardDestinationView;
      actual: { value: null; unit: "percent" };
      headroom: { value: null; unit: "percentage_points" };
      reason: string;
    };

export interface EvidenceSourceView {
  title: string;
  publisher: string;
  publicationDate?: string;
  url?: string;
}

export interface CapabilityEvidenceView {
  id: string;
  name: string;
  version: string;
  effectiveDate: string;
  sources: EvidenceSourceView[];
}

export interface TaskBaselineView {
  id: string;
  name: string;
  description: string;
  practicality: number;
  utilizationDepth: UtilizationDepth;
  role: string;
  roleLabel: string;
  humanBoundary: string;
  limitingFactor: string;
  evidenceConfidence: string;
  capabilities: CapabilityEvidenceView[];
}

export interface FunctionBaselineView {
  id: string;
  name: string;
  practicality: number;
  tasks: TaskBaselineView[];
}

export interface WorkflowGroupView {
  id: UtilizationDepth;
  title: string;
  description: string;
  tasks: Array<Pick<TaskBaselineView, "id" | "name" | "description" | "practicality" | "roleLabel" | "humanBoundary">>;
}

export type IndustryGapView =
  | { status: "numeric"; value: number; unit: "percentage_points"; label: string; explanation: string }
  | { status: "directional"; direction: "High" | "Moderate" | "Low"; value: null; label: string; explanation: string }
  | { status: "insufficient"; value: null; label: "Insufficient evidence"; explanation: string };

export interface AdoptionObservationView {
  id: string;
  scopeLabel: string;
  label: string;
  value: number;
  unit: "percent";
  geography: string;
  period: string;
  evidenceGrade: string;
  confidence: string;
  aiDefinition: string;
  denominator: string;
  source: EvidenceSourceView;
  limitations: string[];
}

export interface LawFirmIndustryView {
  slug: "law-firms";
  name: "Law Firms";
  archetypeName: string;
  archetypeDescription: string;
  status: "available";
  possible: {
    status: "available";
    value: number;
    effectiveDate: string;
    version: string;
    configurationVersion: string;
  };
  actual: {
    status: "partial";
    value: null;
    label: "Evidence available; score pending";
    detail: string;
    observations: AdoptionObservationView[];
  };
  gap: IndustryGapView;
  functions: FunctionBaselineView[];
  workflowGroups: WorkflowGroupView[];
}

const INDUSTRY_PRESENTATION: Record<string, Omit<IndustrySummaryView, "status" | "statusLabel">> = {
  "law-firm": { slug: "law-firms", name: "Law Firms", description: "Legal services, matter work, client service, and firm operations." },
  "accounting-firm": { slug: "accounting-firms", name: "Accounting Firms", description: "Accounting, tax, audit, bookkeeping, and advisory work." },
  "construction-contractor": { slug: "construction-contractors", name: "Construction Contractors", description: "Construction delivery, estimating, field operations, and project administration." },
  restaurant: { slug: "restaurants", name: "Restaurants", description: "Food service operations, customer experience, procurement, and administration." },
  "retail-store": { slug: "retail-stores", name: "Retail Stores", description: "Merchandising, customer service, inventory, and store operations." },
  "barbershop-salon": { slug: "barbershops-salons", name: "Barbershops & Salons", description: "Appointment-led personal services, customer relationships, and local operations." },
  "marketing-agency": { slug: "marketing-agencies", name: "Marketing Agencies", description: "Strategy, creative production, media, analytics, and client service." },
  "healthcare-clinic": { slug: "healthcare-clinics", name: "Healthcare Clinics", description: "Outpatient clinical services, patient administration, and practice operations." },
};

const COUNTRY_SLUGS: Record<string, string> = {
  "country-us": "united-states",
  "country-gb": "united-kingdom",
  "country-ca": "canada",
  "country-gh": "ghana",
};

const roleLabel = (role: string) => role
  .split("_")
  .map((word, index) => index === 0 ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : word)
  .join(" ");

const PUBLIC_FACTOR_LABELS: Record<string, string> = {
  technicalApplicability: "Technical fit",
  maturity: "Technology maturity",
  affordability: "Cost and accessibility",
  reliability: "Reliability",
  integrationEase: "Integration complexity",
  oversightSuitability: "Human oversight requirements",
  riskSuitability: "Professional and risk constraints",
};

const PUBLIC_CONSTRAINT_LABELS: Record<string, string> = {
  "Task risk cap": "Risk constraint",
  "Required human oversight cap": "Human oversight constraint",
  "Recommended AI role cap": "Recommended AI role",
};

const publicFactorLabel = (factor: string) => {
  const internalConstraint = Object.keys(PUBLIC_CONSTRAINT_LABELS).find((label) => factor.startsWith(`${label} (`));
  if (internalConstraint) return factor.replace(internalConstraint, PUBLIC_CONSTRAINT_LABELS[internalConstraint] ?? internalConstraint);
  const internalName = Object.keys(PUBLIC_FACTOR_LABELS).find((name) => factor.startsWith(`${name} (`));
  return internalName ? factor.replace(internalName, PUBLIC_FACTOR_LABELS[internalName] ?? internalName) : factor;
};

const taskUtilizationDepth = (practicality: number, role: string): UtilizationDepth => {
  if (practicality >= 65 && ["partially_automate", "mostly_automate"].includes(role)) return "standard";
  if (practicality >= 45 && ["partially_automate", "mostly_automate"].includes(role)) return "integrated";
  return "advanced";
};

const industries: IndustrySummaryView[] = archetypeSeeds.map((seed) => {
  const presentation = INDUSTRY_PRESENTATION[seed.slug];
  if (!presentation) throw new Error(`Missing industry presentation for ${seed.slug}`);
  const available = seed.slug === "law-firm";
  const qualitativeOutlookAvailable = getIndustryOutlook(presentation.slug) !== undefined;
  return {
    ...presentation,
    status: available ? "available" : qualitativeOutlookAvailable ? "partial" : "in_development",
    statusLabel: available ? "Scored baseline available" : qualitativeOutlookAvailable ? "Three-level outlook available" : "Baseline in development",
  };
});

const countries: CountrySummaryView[] = countrySeeds.map((seed) => {
  const observationCount = COUNTRY_SECTOR_ADOPTION_OBSERVATIONS.filter(({ countryId }) => countryId === seed.id).length;
  return {
    slug: COUNTRY_SLUGS[seed.id] ?? seed.name.toLowerCase().replaceAll(" ", "-"),
    name: seed.name,
    iso2: seed.iso2,
    status: observationCount > 0 ? "partial" : "insufficient_evidence",
    statusLabel: observationCount > 0
      ? `${observationCount} official sector observations available.`
      : "Sources reviewed; no comparable current sector rate found.",
  };
});

const capabilityVersionById = new Map(AI_CAPABILITY_VERSIONS.map((item) => [item.id, item]));
const capabilityById = new Map(AI_CAPABILITIES.map((item) => [item.id, item]));
const evidenceById = new Map(CAPABILITY_EVIDENCE.map((item) => [item.id, item]));
const adoptionSourceById = new Map(LAW_FIRM_ADOPTION_SOURCES.map((item) => [item.id, item]));

export const getIndustrySummaries = (): IndustrySummaryView[] => industries.map((industry) => ({ ...industry }));
export const getCountrySummaries = (): CountrySummaryView[] => countries.map((country) => ({ ...country }));
export const getIndustrySummary = (slug: string) => getIndustrySummaries().find((industry) => industry.slug === slug);
export const getCountrySummary = (slug: string) => getCountrySummaries().find((country) => country.slug === slug);

const standardDestination = (): StandardDestinationView => ({
  value: 100,
  unit: "percent",
  label: "Standard AI destination",
  definition: "A reference destination where businesses in this industry use at least one applicable Standard AI opportunity shown above.",
});

export const getIndustryAdoptionHeadroom = (
  industrySlug: string,
  countrySlug?: string,
): IndustryAdoptionHeadroomView => {
  const industry = getIndustrySummary(industrySlug);
  if (!industry) throw new Error(`Unknown industry ${industrySlug}`);
  const destination = standardDestination();
  const country = countrySlug ? getCountrySummary(countrySlug) ?? null : null;

  if (!country) {
    return {
      status: "insufficient",
      industry,
      country: null,
      destination,
      actual: { value: null, unit: "percent" },
      headroom: { value: null, unit: "percentage_points" },
      reason: countrySlug
        ? "The selected country is not part of the current AIBI coverage. Without a country-specific reported rate, Actual and the hypothetical gap remain empty."
        : "Choose a country to see the closest suitable reported AI-adoption rate. Without that Actual ingredient, the hypothetical gap remains empty.",
    };
  }

  const evidence = getCountryEvidence(country.slug);
  const matches = evidence?.observations.filter((observation) =>
    observation.mappedIndustries.some(({ slug }) => slug === industry.slug),
  ) ?? [];

  if (matches.length === 0 || !evidence) {
    return {
      status: "insufficient",
      industry,
      country,
      destination,
      actual: { value: null, unit: "percent" },
      headroom: { value: null, unit: "percentage_points" },
      reason: `No suitable current reported AI-adoption rate was found for ${industry.name.toLowerCase()} or its closest sector in ${country.name}. Actual is not treated as zero, so the hypothetical gap cannot be calculated.`,
    };
  }

  if (matches.length > 1) {
    throw new Error(`Multiple country-sector adoption observations map to ${industry.slug} in ${country.slug}`);
  }

  const match = matches[0];
  if (!match) throw new Error(`Missing matched country-sector observation for ${industry.slug} in ${country.slug}`);
  const { mappedIndustries: _mappedIndustries, ...observation } = match;
  const headroomValue = Math.round((destination.value - observation.value) * 10) / 10;
  return {
    status: "available",
    industry,
    country,
    destination,
    actual: {
      ...observation,
      unit: "percent",
      evidenceRelation: "proxy",
      source: evidence.source,
    },
    headroom: {
      value: headroomValue,
      unit: "percentage_points",
      formula: `${destination.value.toFixed(1)} − ${observation.value.toFixed(1)} = ${headroomValue.toFixed(1)} percentage points`,
    },
    snapshotNote: "This is a hypothetical adoption gap, not a scientific utilization measure. It is a snapshot based on the currently available report and may change when newer or more specific evidence is found.",
  };
};

export const getIndustryGapAssessment = (industrySlug: string, countrySlug?: string): IndustryGapView => {
  const industry = getIndustrySummary(industrySlug);
  if (!industry) throw new Error(`Unknown industry ${industrySlug}`);
  const countryEvidence = countrySlug ? getCountryEvidence(countrySlug) : undefined;
  if (industrySlug === "law-firms") {
    return {
      status: "insufficient", value: null, label: "Insufficient evidence",
      explanation: "The current Possible result is a task-practicality index, while the law-firm Actual observations measure respondent or firm tool use and frequency without task or depth allocation. Their scales are incompatible; broad country-sector percentages remain proxy context and cannot fill the task-level evidence requirement.",
    };
  }
  const actualState = countryEvidence?.observations.length
    ? "The selected country evidence is broad-sector adoption prevalence with no business-function, task, or depth breakdown."
    : "No task-aligned Actual observation is available for the selected scope.";
  return {
    status: "insufficient", value: null, label: "Insufficient evidence",
    explanation: `Possible is currently a qualitative Standard / Integrated / Advanced outlook rather than a normalized utilization scale. ${actualState} Neither side supplies compatible task-level values with enough coverage.`,
  };
};

export const getCountryEvidence = (slug: string): CountryEvidenceView | undefined => {
  const country = getCountrySummary(slug);
  if (!country) return undefined;
  const seed = countrySeeds.find((item) => COUNTRY_SLUGS[item.id] === slug);
  if (!seed) return undefined;
  const observations = COUNTRY_SECTOR_ADOPTION_OBSERVATIONS.filter(({ countryId }) => countryId === seed.id);
  const sourceId = observations[0]?.sourceId ?? (seed.id === "country-gh" ? "source-gh-world-bank-fat-2021" : undefined);
  const source = COUNTRY_ADOPTION_SOURCES.find(({ id }) => id === sourceId);
  if (!source) return undefined;
  return {
    country,
    status: observations.length > 0 ? "partial" : "insufficient_evidence",
    statusLabel: observations.length > 0 ? "Official sector evidence available" : "Comparable current evidence unavailable",
    observations: observations.map((observation) => ({
      id: observation.id,
      sectorLabel: observation.sectorLabel,
      value: observation.value,
      measuredConcept: observation.measuredConcept,
      period: observation.period,
      mappedIndustries: observation.mappedIndustrySlugs
        .map((industrySlug) => getIndustrySummary(industrySlug))
        .filter((industry): industry is IndustrySummaryView => industry !== undefined),
      mappingNote: observation.mappingNote,
      evidenceGrade: observation.evidenceGrade,
      confidence: observation.confidence,
      ...(observation.derivation ? { derivation: observation.derivation } : {}),
    })),
    source: {
      title: source.title,
      publisher: source.publisher,
      publicationDate: source.publicationDate,
      url: source.url,
      methodology: source.methodology,
    },
    note: observations.length > 0
      ? "These are country-level broad-sector observations. Industry links are transparent mappings, not claims about every business in that industry."
      : GHANA_EVIDENCE_NOTE,
  };
};

export const getLawFirmIndustryView = (): LawFirmIndustryView => {
  const baseline = calculateLawFirmBaseline();
  const taskModelById = new Map(LAW_FIRM_TASKS.map((task) => [task.id, task]));
  const functions: FunctionBaselineView[] = baseline.functions.map((businessFunction) => ({
    id: businessFunction.businessFunctionId,
    name: businessFunction.name,
    practicality: businessFunction.practicality,
    tasks: businessFunction.tasks.map((task) => {
      const taskModel = taskModelById.get(task.taskId);
      if (!taskModel) throw new Error(`Missing law-firm task model ${task.taskId}`);
      return {
        id: task.taskId,
        name: task.taskName,
        description: taskModel.description,
        practicality: task.practicality,
        utilizationDepth: taskUtilizationDepth(task.practicality, task.recommendedRole),
        role: task.recommendedRole,
        roleLabel: roleLabel(task.recommendedRole),
        humanBoundary: taskModel.roleRationale,
        limitingFactor: publicFactorLabel(task.majorLimitingFactor),
        evidenceConfidence: roleLabel(task.evidenceConfidence),
        capabilities: task.capabilityContributions.map((contribution) => {
          const version = capabilityVersionById.get(contribution.capabilityVersionId);
          if (!version) throw new Error(`Missing capability version ${contribution.capabilityVersionId}`);
          const capability = capabilityById.get(version.capabilityId);
          if (!capability) throw new Error(`Missing capability ${version.capabilityId}`);
          const sources = contribution.evidenceIds.map((id) => evidenceById.get(id)).filter((item) => item !== undefined);
          const deduplicated = [...new Map(sources.map((item) => [item.source.sourceId ?? item.source.title, item.source])).values()];
          return {
            id: version.id,
            name: capability.name,
            version: version.version,
            effectiveDate: version.effectiveFrom,
            sources: deduplicated.map((source) => ({
              title: source.title,
              publisher: source.publisher,
              ...(source.publicationDate ? { publicationDate: source.publicationDate } : {}),
              ...(source.url ? { url: source.url } : {}),
            })),
          };
        }),
      };
    }),
  }));

  const allTasks = functions.flatMap((businessFunction) => businessFunction.tasks);
  const workflowGroups: WorkflowGroupView[] = [
    {
      id: "standard", title: "Standard AI",
      description: "Mature, accessible assistance and bounded automation available with today’s mainstream tools.",
      tasks: allTasks.filter((task) => task.utilizationDepth === "standard")
        .map(({ id, name, description, practicality, roleLabel: label, humanBoundary }) => ({ id, name, description, practicality, roleLabel: label, humanBoundary })),
    },
    {
      id: "integrated", title: "Integrated AI",
      description: "Useful workflows that need stronger systems integration, organizational readiness, controls, or professional review.",
      tasks: allTasks.filter((task) => task.utilizationDepth === "integrated")
        .map(({ id, name, description, practicality, roleLabel: label, humanBoundary }) => ({ id, name, description, practicality, roleLabel: label, humanBoundary })),
    },
    {
      id: "advanced", title: "Advanced & human-led AI",
      description: "AI may prepare, organize, simulate, or challenge high-complexity work, while legal responsibility and judgment remain decisively human.",
      tasks: allTasks.filter((task) => task.utilizationDepth === "advanced")
        .map(({ id, name, description, practicality, roleLabel: label, humanBoundary }) => ({ id, name, description, practicality, roleLabel: label, humanBoundary })),
    },
  ];

  const adoptionObservations: AdoptionObservationView[] = LAW_FIRM_ADOPTION_OBSERVATIONS.map((observation) => {
    const source = adoptionSourceById.get(observation.sourceId);
    if (!source) throw new Error(`Missing adoption source ${observation.sourceId}`);
    if (observation.value.kind !== "point") throw new Error(`Published observation ${observation.id} must be a point value`);
    const period = observation.observationPeriod.start && observation.observationPeriod.end
      ? `${observation.observationPeriod.start} to ${observation.observationPeriod.end}`
      : observation.observationPeriod.sourceLabel ?? "Period not published";
    return {
      id: observation.id,
      scopeLabel: observation.industry.sourceCategory === "Law firms"
        ? "Direct law-firm evidence"
        : "Broader legal-profession evidence",
      label: observation.measuredConcept,
      value: observation.value.value,
      unit: "percent",
      geography: observation.geography.sourceLabel,
      period,
      evidenceGrade: observation.evidence.grade,
      confidence: roleLabel(observation.confidence.level),
      aiDefinition: observation.aiDefinition,
      denominator: observation.denominator,
      source: {
        title: source.title,
        publisher: source.publisher,
        ...(source.publicationDate ? { publicationDate: source.publicationDate } : {}),
        ...(source.url ? { url: source.url } : {}),
      },
      limitations: observation.evidence.limitations ?? [],
    };
  });

  return {
    slug: "law-firms", name: "Law Firms",
    archetypeName: LAW_FIRM_ARCHETYPE.name,
    archetypeDescription: LAW_FIRM_ARCHETYPE.description,
    status: "available",
    possible: {
      status: "available", value: baseline.overallPracticality,
      effectiveDate: baseline.effectiveDate, version: baseline.version,
      configurationVersion: baseline.scoreConfigurationVersion,
    },
    actual: {
      status: "partial", value: null, label: "Evidence available; score pending",
      detail: "Direct adoption observations are available, but they measure different constructs—tool use, use frequency, and tool type. They cannot yet be normalized into a task-coverage score comparable with Possible.",
      observations: adoptionObservations,
    },
    gap: getIndustryGapAssessment("law-firms"),
    functions, workflowGroups,
  };
};
