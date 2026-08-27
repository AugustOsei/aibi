import type { UtilizationDepth } from "../types/scoring.js";

export interface CapabilityHorizonItem {
  id: string;
  name: string;
  status: "mainstream" | "commercially_available" | "integration_heavy" | "emerging";
  summary: string;
}

export interface CapabilityHorizonSource {
  title: string;
  publisher: string;
  url: string;
  supports: string[];
}

export interface CommonBusinessFunction {
  id: string;
  name: string;
  purpose: string;
  opportunities: Record<UtilizationDepth, {
    title: string;
    outcome: string;
    humanBoundary: string;
  }>;
}

export const AI_CAPABILITY_HORIZON = {
  version: "2026.08",
  effectiveDate: "2026-08-27",
  lastReviewed: "2026-08-27",
  title: "AI capability horizon",
  summary: "This outlook considers commercially available AI for advanced reasoning, language and documents, real-time voice, vision, image and video creation, data analysis, computer use, connected workflows, agents and selected physical-world applications.",
  limitation: "Availability does not guarantee reliability, affordability or suitability. Every use still depends on business systems, evidence quality, permissions, country rules and accountable human oversight.",
  capabilities: [
    { id: "reasoning-language", name: "Reasoning, language & documents", status: "mainstream", summary: "Analyze, draft, compare, translate and reason across long, mixed-format business material." },
    { id: "voice", name: "Real-time voice & calls", status: "commercially_available", summary: "Hold natural conversations, answer phones, collect information, transfer calls and complete bounded service actions." },
    { id: "vision-images", name: "Vision & image creation", status: "mainstream", summary: "Understand photos, screenshots and diagrams, and create or edit production-quality visual material." },
    { id: "video-audio", name: "Video, audio & synthetic media", status: "commercially_available", summary: "Create short-form video, narration, music and multilingual media, with rights, disclosure and brand controls." },
    { id: "data-code", name: "Data, code & models", status: "mainstream", summary: "Analyze structured data, build spreadsheets and software, simulate scenarios and prepare decision support." },
    { id: "computer-use", name: "Computer use", status: "integration_heavy", summary: "Operate existing websites and software through their interfaces when APIs or direct integrations are unavailable." },
    { id: "agents", name: "Connected & agentic workflows", status: "integration_heavy", summary: "Plan multi-step work, use tools, monitor events and coordinate bounded actions across business systems." },
    { id: "physical-ai", name: "Physical AI", status: "emerging", summary: "Apply vision, digital twins, edge models and robotics to selected real-world operations; readiness remains highly sector-specific." },
  ] satisfies CapabilityHorizonItem[],
  sources: [
    { title: "GPT-5.6: Frontier intelligence that scales with your ambition", publisher: "OpenAI", url: "https://openai.com/index/gpt-5-6/", supports: ["reasoning-language", "data-code", "computer-use", "agents"] },
    { title: "Realtime API", publisher: "OpenAI", url: "https://platform.openai.com/docs/api-reference/realtime", supports: ["voice"] },
    { title: "Introducing ChatGPT Images 2.0", publisher: "OpenAI", url: "https://openai.com/index/introducing-chatgpt-images-2-0/", supports: ["vision-images"] },
    { title: "Veo 3.1: consistency, creativity and control", publisher: "Google DeepMind", url: "https://blog.google/innovation-and-ai/technology/ai/veo-3-1-ingredients-to-video/", supports: ["video-audio"] },
    { title: "What is an AI voice agent?", publisher: "ElevenLabs", url: "https://elevenlabs.io/blog/what-is-an-ai-voice-agent", supports: ["voice", "agents"] },
    { title: "Gemini Robotics 2", publisher: "Google DeepMind", url: "https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/", supports: ["physical-ai"] },
  ] satisfies CapabilityHorizonSource[],
} as const;

export const COMMON_BUSINESS_FUNCTIONS: CommonBusinessFunction[] = [
  {
    id: "marketing-brand", name: "Marketing, content & brand", purpose: "Create, publish and improve the material that helps a business get noticed and understood.",
    opportunities: {
      standard: { title: "Create and repurpose content", outcome: "Draft posts, articles, emails, captions, images, short videos, narration and translations; turn one approved idea into channel-ready variants and a working content calendar.", humanBoundary: "People approve facts, claims, rights, likeness, disclosure, cultural fit and brand voice before publication." },
      integrated: { title: "Connect content to the business", outcome: "Use approved brand guidance, product or service data, promotions, events, content libraries and review workflows to prepare and schedule approved material.", humanBoundary: "Publishing access, audience rules, offers and external commitments stay permissioned and reviewable." },
      advanced: { title: "Run an approval-gated content agent", outcome: "Monitor performance and relevant trends, propose campaigns, produce multimodal variants, queue approved posts and recommend measured adjustments across channels.", humanBoundary: "Humans set strategy, approve publication and spend, and take over sensitive, controversial or crisis communication." },
    },
  },
  {
    id: "sales-growth", name: "Sales & business development", purpose: "Find, qualify and follow up with prospective customers without losing human judgment or trust.",
    opportunities: {
      standard: { title: "Prepare outreach and proposals", outcome: "Research supplied prospects, draft personalized outreach, prepare proposals and summarize calls or next steps.", humanBoundary: "People confirm relevance, claims, pricing, recipients and relationship context." },
      integrated: { title: "Connect the sales workflow", outcome: "Use CRM, product, availability and interaction data to prioritize leads, prepare follow-ups and keep opportunities current.", humanBoundary: "Consent, contact policy, pricing and material commitments remain controlled by staff." },
      advanced: { title: "Coordinate an approval-gated pipeline agent", outcome: "Monitor pipeline signals, prepare account plans, orchestrate bounded follow-up and route stalled or high-value opportunities.", humanBoundary: "AI does not impersonate a person or autonomously negotiate consequential terms." },
    },
  },
  {
    id: "customer-service", name: "Customer service, calls & appointments", purpose: "Answer questions and complete routine service work across phone, chat, email and messaging.",
    opportunities: {
      standard: { title: "Assist routine conversations", outcome: "Draft replies, summarize conversations, answer approved FAQs and support multilingual text or voice interactions.", humanBoundary: "A clear live handoff remains available for sensitive, ambiguous or dissatisfied customers." },
      integrated: { title: "Connect a voice and service agent", outcome: "Answer calls, authenticate within defined limits, access account or booking context, schedule appointments and complete approved routine changes.", humanBoundary: "Refunds, disputes, vulnerable customers and consequential changes follow explicit escalation rules." },
      advanced: { title: "Coordinate omnichannel resolution", outcome: "Carry context across calls, chat, email and files, use connected tools and resolve bounded cases from request through confirmation.", humanBoundary: "The business owns monitoring, quality, redress and every policy boundary." },
    },
  },
  {
    id: "finance-admin", name: "Finance, billing & administration", purpose: "Reduce routine handling while keeping financial records and commitments accountable.",
    opportunities: {
      standard: { title: "Prepare routine financial work", outcome: "Extract receipts and invoices, draft billing narratives, explain variances and prepare reminders or working spreadsheets.", humanBoundary: "People verify source documents, calculations, coding and external representations." },
      integrated: { title: "Connect billing and collections", outcome: "Link accounting, payment and customer systems to prepare invoices, reconcile activity, follow approved collection steps and route exceptions.", humanBoundary: "Posting, payment, credit and write-off authority remains explicitly controlled." },
      advanced: { title: "Monitor cash and controls continuously", outcome: "Watch transaction, cash-flow and control signals, simulate scenarios and prepare bounded corrective actions.", humanBoundary: "Qualified people investigate anomalies and own financial decisions and sign-off." },
    },
  },
  {
    id: "people-training", name: "People, hiring & training", purpose: "Support employees and managers without turning employment decisions over to opaque automation.",
    opportunities: {
      standard: { title: "Create people and learning material", outcome: "Draft job descriptions, onboarding plans, policies, training guides, quizzes and role-specific learning content.", humanBoundary: "People verify accuracy, accessibility, fairness and employment-law implications." },
      integrated: { title: "Connect employee support", outcome: "Use approved policies, scheduling, skills and learning systems to answer staff questions and prepare development or coverage plans.", humanBoundary: "Access is role-based; private employee data and manager decisions require appropriate controls." },
      advanced: { title: "Model workforce needs", outcome: "Simulate staffing and skills scenarios and coordinate approved learning or scheduling actions across systems.", humanBoundary: "AI does not make final hiring, firing, promotion, compensation or disciplinary decisions." },
    },
  },
  {
    id: "operations-procurement", name: "Operations & procurement", purpose: "Coordinate supplies, schedules and recurring work across the business.",
    opportunities: {
      standard: { title: "Prepare operational work", outcome: "Create SOPs, checklists, shift plans, vendor comparisons, work summaries and exception lists from approved information.", humanBoundary: "Operators confirm real conditions, priorities, safety and commercial assumptions." },
      integrated: { title: "Connect operational signals", outcome: "Link inventory, orders, schedules, work systems and vendor updates to forecast needs and prepare coordinated actions.", humanBoundary: "Orders, substitutions, staffing changes and material commitments require defined approval." },
      advanced: { title: "Run a bounded operations agent", outcome: "Monitor events continuously, diagnose exceptions and prepare or execute low-risk recovery steps within narrow authority.", humanBoundary: "People retain control of safety, supplier relationships, spending and customer impact." },
    },
  },
  {
    id: "knowledge-technology", name: "Knowledge, data & technology", purpose: "Help people find what the organization knows and use software more effectively.",
    opportunities: {
      standard: { title: "Search, analyze and build", outcome: "Search approved knowledge, summarize meetings, analyze files, create spreadsheets, draft code and explain internal processes.", humanBoundary: "Users verify sources, calculations, permissions and anything placed into production." },
      integrated: { title: "Connect knowledge and software", outcome: "Retrieve role-appropriate information and complete bounded multi-step work across approved databases, applications and APIs.", humanBoundary: "Identity, access, testing, logging and exception paths are required before system changes." },
      advanced: { title: "Use monitored computer and software agents", outcome: "Operate selected interfaces, investigate issues and coordinate long-running technical or analytical work across tools.", humanBoundary: "High-impact changes, credentials, security actions and irreversible operations require accountable approval." },
    },
  },
  {
    id: "compliance-risk", name: "Compliance, privacy & risk", purpose: "Make obligations easier to follow without mistaking automated checks for professional assurance.",
    opportunities: {
      standard: { title: "Explain and check requirements", outcome: "Turn approved policies into checklists, training and first-pass reviews; flag missing information or possible inconsistencies.", humanBoundary: "Qualified people interpret obligations and resolve ambiguity." },
      integrated: { title: "Embed controls in workflows", outcome: "Apply approved rules, access controls, retention steps, disclosures and audit trails inside connected business processes.", humanBoundary: "Control owners validate design, exceptions and evidence of operation." },
      advanced: { title: "Monitor emerging risk", outcome: "Continuously watch defined signals, assemble evidence and prepare response options for review.", humanBoundary: "AI does not provide final legal, regulatory or assurance conclusions." },
    },
  },
];
