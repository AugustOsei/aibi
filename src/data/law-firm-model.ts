import type { SourceReference } from "../types/common.js";
import type {
  PracticalityOversight,
  PracticalityRisk,
  RecommendedAiRole,
  TaskCapabilityMapping,
} from "../types/possible.js";
import type { BusinessFunction, BusinessTask, Occupation } from "../types/reference.js";
import { EVIDENCE_SOURCES } from "./evidence-sources";

export interface WeightedBusinessFunction extends BusinessFunction {
  weight: number;
}

export interface LawFirmTask extends BusinessTask {
  occupationIds: string[];
  weightWithinFunction: number;
  recommendedRole: RecommendedAiRole;
  risk: PracticalityRisk;
  oversight: PracticalityOversight;
  roleRationale: string;
}

export const LAW_FIRM_ARCHETYPE = {
  id: "law-firm-small-medium-general-v0.1",
  businessArchetypeId: "archetype-law-firm",
  name: "Small/medium general law firm",
  description: "A pre-country representative technological/business baseline for a general-practice firm with lawyers, paralegal support, and legal administration.",
  firmSizeIds: ["firm-size-small", "firm-size-medium"],
  version: "0.1.0",
  effectiveFrom: "2026-08-23",
} as const;

export const LAW_FIRM_OCCUPATIONS: Occupation[] = [
  {
    id: "occupation-lawyer", name: "Lawyer", description: "Provides legal advice, analysis, drafting, negotiation, and representation.",
    classificationSystem: "O*NET-SOC", classificationVersion: "2026", classificationCode: "23-1011.00", active: true,
  },
  {
    id: "occupation-paralegal", name: "Paralegal / legal assistant", description: "Supports legal research, evidence and document preparation, client coordination, and matter administration.",
    classificationSystem: "O*NET-SOC", classificationVersion: "2026", classificationCode: "23-2011.00", active: true,
  },
  {
    id: "occupation-legal-admin", name: "Legal secretary / administrative assistant", description: "Supports legal correspondence, records, billing, calls, scheduling, and office workflows.",
    classificationSystem: "O*NET-SOC", classificationVersion: "2026", classificationCode: "43-6012.00", active: true,
  },
];

const functionSpecs: Array<[string, string, number, string]> = [
  ["legal-research", "Legal research", 0.11, "Finding, checking, and synthesizing relevant legal authorities."],
  ["document-review", "Document review", 0.10, "Examining records and agreements for relevant facts, clauses, and changes."],
  ["drafting", "Drafting", 0.12, "Preparing and revising legal and client-facing documents."],
  ["client-intake", "Client intake", 0.07, "Collecting prospective-client information and opening appropriate matters."],
  ["client-communication", "Client communication", 0.07, "Managing routine updates and preparing clear explanations for lawyer approval."],
  ["matter-administration", "Case/matter administration", 0.09, "Maintaining files, status, obligations, and procedural workflows."],
  ["knowledge-management", "Internal knowledge management", 0.07, "Organizing and retrieving the firm's approved work product and know-how."],
  ["billing-admin", "Billing/admin", 0.07, "Preparing billing inputs, invoices, expenses, and operational summaries."],
  ["scheduling", "Scheduling", 0.05, "Coordinating calendars, meetings, deadlines, and reminders."],
  ["business-development", "Marketing/business development", 0.05, "Preparing approved marketing materials and analyzing the opportunity pipeline."],
  ["legal-judgment", "Legal judgment/strategy", 0.12, "Applying professional judgment to advice, case assessment, and strategy."],
  ["negotiation-advocacy", "Negotiation/advocacy", 0.08, "Preparing for and personally conducting negotiation or legal advocacy."],
];

export const LAW_FIRM_FUNCTIONS: WeightedBusinessFunction[] = functionSpecs.map(([slug, name, weight, description]) => ({
  id: `function-${slug}`, slug, name, description, weight, active: true,
}));

const now = "2026-08-23T00:00:00Z";
const taskSources: Record<"lawyer" | "paralegal" | "admin", SourceReference[]> = {
  lawyer: [EVIDENCE_SOURCES.onetLawyers],
  paralegal: [EVIDENCE_SOURCES.onetParalegals],
  admin: [EVIDENCE_SOURCES.onetLegalAdmin],
};

const task = (
  id: string,
  name: string,
  description: string,
  functionSlug: string,
  occupations: Array<"lawyer" | "paralegal" | "admin">,
  weightWithinFunction: number,
  recommendedRole: RecommendedAiRole,
  risk: PracticalityRisk,
  oversight: PracticalityOversight,
  roleRationale: string,
): LawFirmTask => ({
  id: `task-${id}`, name, description, businessFunctionId: `function-${functionSlug}`,
  occupationIds: occupations.map((occupation) => `occupation-${occupation === "admin" ? "legal-admin" : occupation}`),
  weightWithinFunction, recommendedRole, risk, oversight, roleRationale,
  sourceReferences: [...new Map(occupations.flatMap((occupation) => taskSources[occupation]).map((source) => [source.sourceId, source])).values()],
  active: true, createdAt: now, updatedAt: now,
});

export const LAW_FIRM_TASKS: LawFirmTask[] = [
  task("find-authorities", "Find potentially relevant authorities", "Formulate searches and retrieve potentially relevant statutes, regulations, cases, and secondary material.", "legal-research", ["lawyer", "paralegal"], 0.45, "augment", "high", "substantial", "AI may broaden and accelerate search, but a legal professional must control sources and coverage."),
  task("synthesize-authorities", "Synthesize and verify legal authorities", "Compare retrieved authorities, test propositions, and prepare a source-linked research synthesis.", "legal-research", ["lawyer", "paralegal"], 0.55, "assist", "high", "continuous", "AI may prepare a working synthesis; every authority and proposition requires professional verification."),
  task("extract-document-facts", "Extract facts and provisions from document sets", "Identify requested dates, parties, obligations, clauses, and factual items in supplied records.", "document-review", ["lawyer", "paralegal"], 0.55, "partially_automate", "moderate", "substantial", "AI can conduct first-pass extraction with exception handling and reviewer confirmation."),
  task("compare-document-versions", "Compare document versions", "Identify textual and semantic differences and prepare a review checklist.", "document-review", ["lawyer", "paralegal"], 0.45, "partially_automate", "moderate", "substantial", "AI can surface changes; a professional determines legal effect and materiality."),
  task("draft-routine-documents", "Draft routine correspondence and standard documents", "Prepare first drafts from approved templates, instructions, and matter data.", "drafting", ["lawyer", "paralegal", "admin"], 0.45, "partially_automate", "moderate", "substantial", "Template-bounded first drafts are practical but require responsible-person review."),
  task("draft-substantive-legal", "Draft substantive legal documents", "Prepare a working draft of a contract, pleading, brief, opinion, or other substantive instrument.", "drafting", ["lawyer"], 0.55, "assist", "high", "continuous", "AI is a drafting aid only; the lawyer owns law, facts, citations, strategy, and final text."),
  task("capture-intake", "Capture prospective-client intake", "Gather contact details, matter facts, documents, urgency, and other predefined intake fields.", "client-intake", ["paralegal", "admin"], 0.6, "partially_automate", "moderate", "routine", "A bounded assistant can gather structured facts while avoiding advice and offering human escalation."),
  task("conflict-route-intake", "Prepare conflict-check and matter routing", "Extract names and matter attributes, initiate a conflict-search workflow, and route the intake for decision.", "client-intake", ["lawyer", "paralegal", "admin"], 0.4, "partially_automate", "high", "substantial", "AI may prepare and route inputs but cannot decide conflicts or engagement."),
  task("routine-client-updates", "Prepare routine client updates", "Draft status updates from approved matter information for review before sending.", "client-communication", ["lawyer", "paralegal", "admin"], 0.5, "assist", "moderate", "substantial", "Human review is required for accuracy, tone, privilege, and commitments."),
  task("explain-legal-options", "Prepare explanation of legal options", "Create a plain-language working explanation based on lawyer-supplied analysis and sources.", "client-communication", ["lawyer"], 0.5, "assist", "high", "continuous", "Only a lawyer provides final legal advice and selects what is communicated."),
  task("organize-matter-files", "Organize and classify matter files", "Apply a controlled taxonomy, extract metadata, and identify duplicates or filing exceptions.", "matter-administration", ["paralegal", "admin"], 0.55, "mostly_automate", "moderate", "routine", "Automation is practical with access controls, audit logs, and an exception queue."),
  task("track-matter-status", "Update matter status and procedural workflow", "Extract status changes, prepare reminders, and update connected matter-management workflows.", "matter-administration", ["lawyer", "paralegal", "admin"], 0.45, "partially_automate", "high", "substantial", "Deadline-bearing changes need deterministic rules and human confirmation."),
  task("search-firm-knowledge", "Search approved firm knowledge", "Retrieve relevant precedents, templates, checklists, and prior work from an access-controlled corpus.", "knowledge-management", ["lawyer", "paralegal"], 0.6, "partially_automate", "moderate", "routine", "Retrieval can be automated, while suitability and currency require review."),
  task("classify-work-product", "Classify and summarize approved work product", "Tag, summarize, and route approved material into the firm's knowledge taxonomy.", "knowledge-management", ["lawyer", "paralegal", "admin"], 0.4, "mostly_automate", "low", "routine", "Human spot checks and approval-state controls remain necessary."),
  task("prepare-billing", "Prepare time narratives and invoices", "Draft narratives, classify entries, and flag inconsistencies for billing review.", "billing-admin", ["lawyer", "paralegal", "admin"], 0.6, "partially_automate", "moderate", "routine", "Billing accuracy, reasonableness, and client rules require review."),
  task("analyze-firm-operations", "Analyze expenses and firm operations", "Summarize structured financial and operational data and flag anomalies for management.", "billing-admin", ["lawyer", "admin"], 0.4, "augment", "moderate", "routine", "AI supports analysis; source data and calculations must be checked."),
  task("coordinate-calendars", "Coordinate calendars and meetings", "Propose times, resolve routine conflicts, prepare invitations, and update calendars.", "scheduling", ["lawyer", "paralegal", "admin"], 0.55, "mostly_automate", "low", "routine", "Routine scheduling is highly automatable with permissions and confirmation rules."),
  task("deadline-reminders", "Prepare deadline and follow-up reminders", "Create reminders from confirmed dates and workflow states and escalate exceptions.", "scheduling", ["lawyer", "paralegal", "admin"], 0.45, "partially_automate", "high", "substantial", "AI must not independently calculate or alter legal deadlines; confirmed dates drive reminders."),
  task("draft-marketing", "Draft marketing content and proposals", "Prepare first drafts using approved claims, experience data, tone, and professional-conduct constraints.", "business-development", ["lawyer", "admin"], 0.55, "assist", "moderate", "routine", "Human approval is needed for accuracy, confidentiality, and advertising rules."),
  task("analyze-pipeline", "Analyze business-development pipeline", "Classify opportunities and summarize structured pipeline and relationship data.", "business-development", ["lawyer", "admin"], 0.45, "augment", "moderate", "routine", "Analysis may support decisions but should not autonomously contact or profile prospects."),
  task("assess-strategy", "Assess legal strategy and likely outcomes", "Weigh law, facts, procedure, client objectives, uncertainty, and professional judgment.", "legal-judgment", ["lawyer"], 0.6, "assist", "high", "continuous", "AI may challenge or organize analysis, but the responsible lawyer makes the judgment."),
  task("deliver-final-advice", "Deliver final legal advice", "Determine and communicate advice for the client's particular circumstances.", "legal-judgment", ["lawyer"], 0.4, "not_practically_appropriate", "unacceptable", "continuous", "Delegating final legal advice to AI is not practically appropriate; human professional responsibility is essential."),
  task("prepare-negotiation", "Prepare negotiation positions", "Organize facts, issues, alternatives, concessions, and draft talking points for lawyer review.", "negotiation-advocacy", ["lawyer"], 0.45, "assist", "high", "continuous", "AI can support preparation but cannot own objectives, judgment, or commitments."),
  task("conduct-advocacy", "Conduct negotiation or courtroom advocacy", "Interact in real time to represent a client, make commitments, question witnesses, or address a tribunal.", "negotiation-advocacy", ["lawyer"], 0.55, "not_practically_appropriate", "unacceptable", "continuous", "Autonomous AI representation is outside this practical baseline; responsibility remains human."),
];

type MapSpec = [taskId: string, capability: string, weight: number, applicability: number];
const mapSpecs: MapSpec[] = [
  ["find-authorities", "research-assistance", 0.55, 0.9], ["find-authorities", "semantic-search", 0.45, 0.9],
  ["synthesize-authorities", "research-assistance", 0.6, 0.82], ["synthesize-authorities", "summarization", 0.4, 0.8],
  ["extract-document-facts", "information-extraction", 0.7, 0.95], ["extract-document-facts", "classification", 0.3, 0.85],
  ["compare-document-versions", "document-comparison", 0.75, 0.95], ["compare-document-versions", "summarization", 0.25, 0.8],
  ["draft-routine-documents", "drafting", 0.7, 0.92], ["draft-routine-documents", "information-extraction", 0.3, 0.86],
  ["draft-substantive-legal", "drafting", 0.65, 0.82], ["draft-substantive-legal", "research-assistance", 0.35, 0.65],
  ["capture-intake", "conversational-assistance", 0.45, 0.9], ["capture-intake", "information-extraction", 0.35, 0.9], ["capture-intake", "workflow-automation", 0.2, 0.8],
  ["conflict-route-intake", "information-extraction", 0.4, 0.9], ["conflict-route-intake", "semantic-search", 0.35, 0.78], ["conflict-route-intake", "workflow-automation", 0.25, 0.78],
  ["routine-client-updates", "email-assistance", 0.7, 0.92], ["routine-client-updates", "summarization", 0.3, 0.86],
  ["explain-legal-options", "drafting", 0.6, 0.78], ["explain-legal-options", "summarization", 0.4, 0.76],
  ["organize-matter-files", "classification", 0.55, 0.95], ["organize-matter-files", "information-extraction", 0.25, 0.9], ["organize-matter-files", "workflow-automation", 0.2, 0.88],
  ["track-matter-status", "information-extraction", 0.35, 0.86], ["track-matter-status", "workflow-automation", 0.45, 0.82], ["track-matter-status", "agentic-execution", 0.2, 0.55],
  ["search-firm-knowledge", "semantic-search", 0.7, 0.95], ["search-firm-knowledge", "summarization", 0.3, 0.82],
  ["classify-work-product", "classification", 0.55, 0.95], ["classify-work-product", "summarization", 0.25, 0.9], ["classify-work-product", "workflow-automation", 0.2, 0.86],
  ["prepare-billing", "drafting", 0.35, 0.82], ["prepare-billing", "classification", 0.35, 0.9], ["prepare-billing", "data-analysis", 0.3, 0.82],
  ["analyze-firm-operations", "data-analysis", 0.8, 0.9], ["analyze-firm-operations", "summarization", 0.2, 0.85],
  ["coordinate-calendars", "workflow-automation", 0.75, 0.95], ["coordinate-calendars", "conversational-assistance", 0.25, 0.82],
  ["deadline-reminders", "workflow-automation", 0.8, 0.84], ["deadline-reminders", "information-extraction", 0.2, 0.68],
  ["draft-marketing", "drafting", 0.7, 0.92], ["draft-marketing", "summarization", 0.3, 0.86],
  ["analyze-pipeline", "data-analysis", 0.55, 0.86], ["analyze-pipeline", "classification", 0.45, 0.9],
  ["assess-strategy", "research-assistance", 0.45, 0.55], ["assess-strategy", "data-analysis", 0.25, 0.55], ["assess-strategy", "summarization", 0.3, 0.62],
  ["prepare-negotiation", "summarization", 0.45, 0.72], ["prepare-negotiation", "data-analysis", 0.3, 0.6], ["prepare-negotiation", "drafting", 0.25, 0.68],
];

const taskById = new Map(LAW_FIRM_TASKS.map((item) => [item.id, item]));

export const LAW_FIRM_TASK_CAPABILITY_MAPPINGS: TaskCapabilityMapping[] = mapSpecs.map(([taskSlug, capabilitySlug, contributionWeight, applicability]) => {
  const mappedTask = taskById.get(`task-${taskSlug}`);
  if (!mappedTask) throw new Error(`Unknown law-firm task: ${taskSlug}`);
  const capabilityVersionId = `capability-${capabilitySlug}-v2026-08`;
  const evidenceIds = [
    `evidence-${capabilitySlug}-provider-2026-08`,
    `evidence-${capabilitySlug}-nist-risk`,
    `evidence-${capabilitySlug}-aba-oversight`,
  ];
  if (capabilitySlug === "research-assistance") evidenceIds.push(`evidence-${capabilitySlug}-legal-reliability`);
  return {
    id: `mapping-${taskSlug}-${capabilitySlug}-v0.1`, taskId: mappedTask.id, capabilityVersionId,
    version: "0.1.0", effectiveFrom: "2026-08-23", supportMode: mappedTask.recommendedRole,
    contributionWeight,
    applicability: {
      level: applicability >= 0.85 ? "broad" : applicability >= 0.6 ? "partial" : "limited",
      normalizedValue: applicability, scaleId: "practicality-0-to-1-v0.1",
      rationale: "Task-specific applicability judgment for the first law-firm vertical slice.", evidenceIds,
    },
    coverageNotes: `Maps ${mappedTask.name} to the ${capabilitySlug} capability.`,
    constraints: [mappedTask.roleRationale], humanRole: mappedTask.roleRationale, evidenceIds,
  };
});
