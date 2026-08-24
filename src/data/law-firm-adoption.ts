import type { AdoptionObservation, AdoptionSource } from "../types/actual.js";

const ACCESSED_AT = "2026-08-23";
const CREATED_AT = "2026-08-23T00:00:00Z";

export const LAW_FIRM_ADOPTION_SOURCES: AdoptionSource[] = [
  {
    id: "adoption-source-wk-future-ready-lawyer-2024",
    title: "2024 Future Ready Lawyer Survey Report",
    publisher: "Wolters Kluwer",
    url: "https://assets.contenthub.wolterskluwer.com/api/public/content/2483857-2024-future-ready-lawyer-survey-report-8860a43609?v=251478cd",
    sourceType: "vendor",
    accessedAt: ACCESSED_AT,
    methodologySummary: "Online quantitative survey of 712 lawyers in law firms and corporate legal departments across the United States and nine European countries, conducted May 6–28, 2024 by an international research organization.",
    defaultAiDefinition: "Generative AI used in legal work.",
    notes: "The report publishes direct law-firm subgroup percentages but not the law-firm subgroup sample size for these observations.",
  },
  {
    id: "adoption-source-clio-legal-trends-2025",
    title: "2025 Legal Trends Report",
    publisher: "Clio",
    url: "https://www.clio.com/resources/legal-trends/read-online/",
    sourceType: "vendor",
    accessedAt: ACCESSED_AT,
    methodologySummary: "Report combining aggregated, anonymized Clio platform data from tens of thousands of United States legal professionals with survey research. The online methodology does not publish the sample size or geography for the AI-adoption items.",
    defaultAiDefinition: "Artificial intelligence used in a respondent's law firm; tool categories include generic and legal-specific AI.",
    notes: "AI-adoption items are treated as survey evidence, not product telemetry. Clio customers may differ from the wider legal market.",
  },
];

const wkEvidence = {
  grade: "B" as const,
  rationale: "Recent, direct law-firm subgroup evidence from a transparent multi-country legal-sector survey.",
  strengths: ["Direct law-firm subgroup", "Clear use-frequency construct", "Field dates and overall sample published"],
  limitations: ["Law-firm subgroup sample size not published", "United States and European countries pooled", "Vendor-sponsored survey"],
};

const wkConfidence = {
  level: "medium" as const,
  rationale: "The construct and fieldwork are clear, but subgroup size, weighting and country-level law-firm results are not published.",
};

const clioEvidence = {
  grade: "C" as const,
  rationale: "Direct legal-professional survey observations with a close industry fit but incomplete sampling details for the reported AI items.",
  strengths: ["Law-firm context", "Tool categories defined", "Recent industry-specific report"],
  limitations: ["AI-item sample size not published", "Geographic composition unclear for the item", "Potential vendor/customer selection effects"],
};

const clioConfidence = {
  level: "low" as const,
  rationale: "The percentages are clear, but the online report does not expose enough sampling detail to assess precision or representativeness.",
};

export const LAW_FIRM_ADOPTION_OBSERVATIONS: AdoptionObservation[] = [
  {
    id: "adoption-observation-law-firms-genai-weekly-2024",
    sourceId: "adoption-source-wk-future-ready-lawyer-2024",
    sourceLocator: "Report pages 3 and 5",
    observationPeriod: { start: "2024-05-06", end: "2024-05-28", sourceLabel: "Survey fieldwork" },
    geography: { level: "region", sourceLabel: "United States and nine European countries" },
    industry: { sourceCategory: "Law firms", businessArchetypeId: "archetype-law-firm" },
    sample: {
      totalSampleSize: 712,
      samplingFrame: "Lawyers in law firms and corporate legal departments surveyed online.",
      representativenessNotes: "The law-firm subgroup size and country distribution are not published.",
    },
    aiDefinition: "Generative AI used in legal work.",
    measuredConcept: "Law-firm respondents using generative AI in legal work at least once a week",
    denominator: "Law-firm respondents to the 2024 Future Ready Lawyer Survey",
    methodologyNotes: "Direct law-firm percentage; pooled across surveyed countries.",
    value: { kind: "point", value: 68 },
    unit: "percent",
    provenance: { kind: "observed", directness: "direct" },
    evidence: wkEvidence,
    confidence: wkConfidence,
    extractionNotes: "Extracted from the report's law-firm versus corporate legal department comparison.",
    extractedBy: "Codex research pass",
    createdAt: CREATED_AT,
  },
  {
    id: "adoption-observation-law-firms-genai-daily-2024",
    sourceId: "adoption-source-wk-future-ready-lawyer-2024",
    sourceLocator: "Report pages 3 and 5",
    observationPeriod: { start: "2024-05-06", end: "2024-05-28", sourceLabel: "Survey fieldwork" },
    geography: { level: "region", sourceLabel: "United States and nine European countries" },
    industry: { sourceCategory: "Law firms", businessArchetypeId: "archetype-law-firm" },
    sample: {
      totalSampleSize: 712,
      samplingFrame: "Lawyers in law firms and corporate legal departments surveyed online.",
      representativenessNotes: "The law-firm subgroup size and country distribution are not published.",
    },
    aiDefinition: "Generative AI used in legal work.",
    measuredConcept: "Law-firm respondents using generative AI in legal work daily",
    denominator: "Law-firm respondents to the 2024 Future Ready Lawyer Survey",
    methodologyNotes: "Daily use is a narrower construct than weekly use and is not additive to it.",
    value: { kind: "point", value: 33 },
    unit: "percent",
    provenance: { kind: "observed", directness: "direct" },
    evidence: wkEvidence,
    confidence: wkConfidence,
    extractionNotes: "Extracted from the report's law-firm versus corporate legal department comparison.",
    extractedBy: "Codex research pass",
    createdAt: CREATED_AT,
  },
  {
    id: "adoption-observation-law-firms-any-ai-2025",
    sourceId: "adoption-source-clio-legal-trends-2025",
    sourceLocator: "Part 3, Chart 3.1 and accompanying text",
    observationPeriod: { sourceLabel: "2025 report; field dates not published for this item" },
    geography: { level: "other", sourceLabel: "Legal professionals surveyed for the 2025 Legal Trends Report; item geography not separately published" },
    industry: { sourceCategory: "Law firms / legal professionals", businessArchetypeId: "archetype-law-firm" },
    sample: {
      samplingFrame: "Legal professionals included in Clio's Legal Trends research.",
      representativenessNotes: "Sample size, weighting and geographic composition are not published for this item in the online report.",
    },
    aiDefinition: "Any artificial intelligence used in the respondent's firm.",
    measuredConcept: "Legal professionals reporting use of artificial intelligence in their firms",
    denominator: "Legal-professional respondents to the 2025 Legal Trends Report",
    value: { kind: "point", value: 79 },
    unit: "percent",
    provenance: { kind: "observed", directness: "direct" },
    evidence: clioEvidence,
    confidence: clioConfidence,
    extractionNotes: "The value is stated directly; precise question wording is not published in the online text.",
    extractedBy: "Codex research pass",
    createdAt: CREATED_AT,
  },
  {
    id: "adoption-observation-law-firms-legal-specific-ai-2025",
    sourceId: "adoption-source-clio-legal-trends-2025",
    sourceLocator: "Part 3, legal-specific AI section",
    observationPeriod: { sourceLabel: "2025 report; field dates not published for this item" },
    geography: { level: "other", sourceLabel: "Legal professionals surveyed for the 2025 Legal Trends Report; item geography not separately published" },
    industry: { sourceCategory: "Law firms / legal professionals", businessArchetypeId: "archetype-law-firm" },
    sample: {
      samplingFrame: "Legal professionals included in Clio's Legal Trends research.",
      representativenessNotes: "Sample size, weighting and geographic composition are not published for this item in the online report.",
    },
    aiDefinition: "Legal-specific AI including legal research, document drafting or automation, e-discovery, contract review or analysis, and predictive legal analytics.",
    measuredConcept: "Legal professionals using a legal-specific AI solution",
    denominator: "Legal-professional respondents to the 2025 Legal Trends Report",
    value: { kind: "point", value: 40 },
    unit: "percent",
    provenance: { kind: "observed", directness: "direct" },
    evidence: clioEvidence,
    confidence: clioConfidence,
    extractionNotes: "The report defines the included legal-specific tool categories.",
    extractedBy: "Codex research pass",
    createdAt: CREATED_AT,
  },
];
