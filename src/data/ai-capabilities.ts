import type { ConfidenceLevel, SourceReference } from "../types/common.js";
import type { AiCapability, AiCapabilityVersion, CapabilityEvidence, RatedFactor } from "../types/possible.js";
import { EVIDENCE_SOURCES } from "./evidence-sources";

type CapabilitySpec = {
  id: string;
  name: string;
  description: string;
  category: string;
  technical: ["none" | "limited" | "partial" | "broad", number];
  maturity: ["experimental" | "emerging" | "mature", number];
  affordability: ["prohibitive" | "high_cost" | "moderate" | "accessible", number];
  reliability: ["unreliable" | "variable" | "reliable" | "highly_reliable", number];
  integration: ["low" | "moderate" | "high" | "very_high", number];
  oversight: ["minimal" | "routine" | "substantial" | "continuous", number];
  risk: ["low" | "moderate" | "high" | "unacceptable", number];
  providerSource: SourceReference;
  confidence: ConfidenceLevel;
  limitations: string[];
  includeLegalResearchEvidence?: boolean;
};

const specs: CapabilitySpec[] = [
  {
    id: "summarization", name: "Summarization", category: "language",
    description: "Produce condensed, source-grounded summaries of supplied text.",
    technical: ["broad", 0.94], maturity: ["mature", 0.9], affordability: ["accessible", 0.95],
    reliability: ["reliable", 0.76], integration: ["low", 0.86], oversight: ["routine", 0.76], risk: ["moderate", 0.74],
    providerSource: EVIDENCE_SOURCES.openAiApi, confidence: "medium",
    limitations: ["May omit qualifications or misstate details; source comparison and professional review remain necessary."],
  },
  {
    id: "drafting", name: "Drafting", category: "language",
    description: "Generate or revise text from instructions and supplied context.",
    technical: ["broad", 0.94], maturity: ["mature", 0.9], affordability: ["accessible", 0.95],
    reliability: ["variable", 0.68], integration: ["low", 0.84], oversight: ["substantial", 0.58], risk: ["moderate", 0.62],
    providerSource: EVIDENCE_SOURCES.openAiApi, confidence: "medium",
    limitations: ["Generated legal language can be inaccurate, incomplete, or unsuitable for the matter; lawyer review is mandatory."],
  },
  {
    id: "information-extraction", name: "Information extraction", category: "document intelligence",
    description: "Extract specified fields, clauses, entities, dates, and facts from supplied documents.",
    technical: ["broad", 0.91], maturity: ["mature", 0.86], affordability: ["accessible", 0.92],
    reliability: ["reliable", 0.8], integration: ["moderate", 0.75], oversight: ["routine", 0.78], risk: ["moderate", 0.74],
    providerSource: EVIDENCE_SOURCES.openAiApi, confidence: "medium",
    limitations: ["Scanned documents, unusual layouts, and ambiguous clauses require exception handling and verification."],
  },
  {
    id: "document-comparison", name: "Document comparison", category: "document intelligence",
    description: "Compare document versions and identify material textual or semantic differences.",
    technical: ["broad", 0.91], maturity: ["mature", 0.86], affordability: ["accessible", 0.92],
    reliability: ["reliable", 0.82], integration: ["low", 0.82], oversight: ["routine", 0.8], risk: ["moderate", 0.77],
    providerSource: EVIDENCE_SOURCES.openAiApi, confidence: "medium",
    limitations: ["Materiality judgments and effects of changes still require a qualified reviewer."],
  },
  {
    id: "semantic-search", name: "Semantic/document search", category: "retrieval",
    description: "Retrieve relevant passages by meaning from a controlled document collection.",
    technical: ["broad", 0.92], maturity: ["mature", 0.9], affordability: ["accessible", 0.92],
    reliability: ["reliable", 0.81], integration: ["moderate", 0.72], oversight: ["routine", 0.78], risk: ["moderate", 0.76],
    providerSource: EVIDENCE_SOURCES.openAiVectorStores, confidence: "medium",
    limitations: ["Retrieval quality depends on corpus completeness, access controls, chunking, metadata, and query design."],
  },
  {
    id: "research-assistance", name: "Research assistance", category: "retrieval and reasoning",
    description: "Help frame research, retrieve material, and synthesize supplied or linked authorities.",
    technical: ["broad", 0.85], maturity: ["emerging", 0.78], affordability: ["accessible", 0.86],
    reliability: ["variable", 0.52], integration: ["moderate", 0.64], oversight: ["substantial", 0.42], risk: ["high", 0.4],
    providerSource: EVIDENCE_SOURCES.openAiVectorStores, confidence: "medium", includeLegalResearchEvidence: true,
    limitations: ["Legal research systems can hallucinate or mischaracterize authorities; every proposition and citation must be verified."],
  },
  {
    id: "classification", name: "Classification", category: "document intelligence",
    description: "Assign documents, messages, or matters to a defined taxonomy.",
    technical: ["broad", 0.92], maturity: ["mature", 0.9], affordability: ["accessible", 0.95],
    reliability: ["reliable", 0.83], integration: ["low", 0.83], oversight: ["routine", 0.82], risk: ["low", 0.82],
    providerSource: EVIDENCE_SOURCES.openAiApi, confidence: "medium",
    limitations: ["Taxonomy quality, ambiguous cases, and distribution shift require monitoring and exception review."],
  },
  {
    id: "meeting-transcription", name: "Meeting transcription and summarization", category: "audio and language",
    description: "Transcribe recorded speech and produce structured meeting notes.",
    technical: ["broad", 0.91], maturity: ["mature", 0.9], affordability: ["accessible", 0.92],
    reliability: ["reliable", 0.82], integration: ["low", 0.82], oversight: ["routine", 0.74], risk: ["moderate", 0.68],
    providerSource: EVIDENCE_SOURCES.openAiAudio, confidence: "medium",
    limitations: ["Consent, privilege, confidentiality, speaker attribution, audio quality, and transcription errors require controls."],
  },
  {
    id: "email-assistance", name: "Email assistance", category: "language",
    description: "Draft, revise, summarize, and triage email under user control.",
    technical: ["broad", 0.92], maturity: ["mature", 0.9], affordability: ["accessible", 0.95],
    reliability: ["reliable", 0.74], integration: ["low", 0.84], oversight: ["routine", 0.7], risk: ["moderate", 0.64],
    providerSource: EVIDENCE_SOURCES.openAiApi, confidence: "medium",
    limitations: ["Recipients, commitments, tone, confidentiality, and legal substance require human review before sending."],
  },
  {
    id: "workflow-automation", name: "Scheduling/workflow automation", category: "automation",
    description: "Trigger deterministic workflows, route work, update systems, and coordinate schedules through tools.",
    technical: ["broad", 0.84], maturity: ["mature", 0.84], affordability: ["accessible", 0.86],
    reliability: ["reliable", 0.76], integration: ["high", 0.52], oversight: ["routine", 0.65], risk: ["moderate", 0.66],
    providerSource: EVIDENCE_SOURCES.openAiApi, confidence: "medium",
    limitations: ["System integration, permissions, exception paths, and deadline consequences require deterministic safeguards."],
  },
  {
    id: "conversational-assistance", name: "Conversational/voice assistance", category: "interaction",
    description: "Conduct bounded question-and-answer interactions and gather information through text or voice.",
    technical: ["broad", 0.87], maturity: ["mature", 0.84], affordability: ["accessible", 0.87],
    reliability: ["variable", 0.7], integration: ["moderate", 0.66], oversight: ["substantial", 0.55], risk: ["moderate", 0.58],
    providerSource: EVIDENCE_SOURCES.openAiApi, confidence: "medium",
    limitations: ["Must disclose appropriate use, avoid legal advice, protect confidentiality, and provide escalation to a person."],
  },
  {
    id: "data-analysis", name: "Data analysis", category: "analysis",
    description: "Analyze structured data, identify patterns, and create working summaries or calculations.",
    technical: ["broad", 0.87], maturity: ["mature", 0.84], affordability: ["accessible", 0.9],
    reliability: ["variable", 0.72], integration: ["moderate", 0.7], oversight: ["routine", 0.68], risk: ["moderate", 0.65],
    providerSource: EVIDENCE_SOURCES.openAiApi, confidence: "medium",
    limitations: ["Input quality, calculation verification, methodology, and misleading correlations require review."],
  },
  {
    id: "agentic-execution", name: "Agentic workflow execution", category: "automation",
    description: "Plan and execute multi-step work using connected tools and intermediate model decisions.",
    technical: ["partial", 0.76], maturity: ["emerging", 0.65], affordability: ["moderate", 0.74],
    reliability: ["variable", 0.54], integration: ["very_high", 0.38], oversight: ["continuous", 0.32], risk: ["high", 0.32],
    providerSource: EVIDENCE_SOURCES.openAiApi, confidence: "low",
    limitations: ["Non-deterministic planning, tool permissions, compounding errors, and legal consequences require narrow scope and approval gates."],
  },
];

const now = "2026-08-23T00:00:00Z";
const versionId = (id: string) => `capability-${id}-v2026-08`;
const evidenceIds = (id: string, includeLegalResearchEvidence = false) => [
  `evidence-${id}-provider-2026-08`,
  `evidence-${id}-nist-risk`,
  `evidence-${id}-aba-oversight`,
  ...(includeLegalResearchEvidence ? [`evidence-${id}-legal-reliability`] : []),
];

const rated = <TLevel extends string>(
  level: TLevel,
  normalizedValue: number,
  rationale: string,
  evidence: string[],
): RatedFactor<TLevel> => ({ level, normalizedValue, scaleId: "practicality-0-to-1-v0.1", rationale, evidenceIds: evidence });

export const AI_CAPABILITIES: AiCapability[] = specs.map((spec) => ({
  id: `capability-${spec.id}`,
  slug: spec.id,
  name: spec.name,
  description: spec.description,
  category: spec.category,
  active: true,
  createdAt: now,
  updatedAt: now,
}));

export const AI_CAPABILITY_VERSIONS: AiCapabilityVersion[] = specs.map((spec) => {
  const evidence = evidenceIds(spec.id, spec.includeLegalResearchEvidence);
  return {
    id: versionId(spec.id), capabilityId: `capability-${spec.id}`, version: "2026.08",
    status: "active", assessedAt: now, effectiveFrom: "2026-08-23",
    technicalApplicability: rated(...spec.technical, "Current production APIs support this capability for supplied digital content.", evidence),
    maturity: rated(...spec.maturity, "Assessed from current product availability and operational complexity.", evidence),
    affordability: rated(...spec.affordability, "Usage-priced APIs and business products make bounded use economically accessible; deployment costs still vary.", evidence),
    reliability: rated(...spec.reliability, "Reliability reflects current documented capability and known confabulation or execution limitations.", evidence),
    integrationDifficulty: rated(...spec.integration, "Normalized value is integration ease: higher means easier implementation.", evidence),
    humanOversightRequirement: rated(...spec.oversight, "Normalized value is oversight suitability: higher means less burdensome oversight.", evidence),
    risk: rated(...spec.risk, "Normalized value is risk suitability: higher means lower practical risk.", evidence),
    limitations: spec.limitations,
    evidenceIds: evidence,
  };
});

const evidenceRecord = (
  id: string,
  capabilityVersionId: string,
  source: SourceReference,
  supportsFactors: CapabilityEvidence["supportsFactors"],
  evidenceType: CapabilityEvidence["evidenceType"],
  level: ConfidenceLevel,
  notes: string,
): CapabilityEvidence => ({
  id, capabilityVersionId, source, supportsFactors, evidenceType,
  confidence: { level, rationale: notes }, notes,
});

export const CAPABILITY_EVIDENCE: CapabilityEvidence[] = specs.flatMap((spec) => {
  const id = spec.id;
  const version = versionId(id);
  const records = [
    evidenceRecord(
      `evidence-${id}-provider-2026-08`, version, spec.providerSource,
      ["technical_applicability", "maturity", "affordability", "integration_difficulty"],
      "product_documentation", spec.confidence,
      "Provider documentation establishes present availability and implementation surface; it does not independently establish legal-work reliability.",
    ),
    evidenceRecord(
      `evidence-${id}-nist-risk`, version, EVIDENCE_SOURCES.nistGenAi,
      ["reliability", "human_oversight", "risk"], "research", "high",
      "NIST documents generative-AI confabulation and governance risks; factor judgments remain application-specific.",
    ),
    evidenceRecord(
      `evidence-${id}-aba-oversight`, version, EVIDENCE_SOURCES.abaOpinion512,
      ["human_oversight", "risk"], "professional_guidance", "high",
      "ABA Formal Opinion 512 supports competence, confidentiality, supervision, candor, communication, and fee-related oversight constraints.",
    ),
  ];
  if (spec.includeLegalResearchEvidence) {
    records.push(evidenceRecord(
      `evidence-${id}-legal-reliability`, version, EVIDENCE_SOURCES.legalResearchReliability,
      ["reliability", "human_oversight", "risk"], "independent_test", "high",
      "Independent testing reported material hallucination rates in leading AI legal-research products, supporting conservative reliability and oversight ratings.",
    ));
  }
  return records;
});
