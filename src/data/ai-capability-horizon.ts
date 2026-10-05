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
  // Short product name, shown in the "reviewed against" line.
  label: string;
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
  version: "2026.10",
  effectiveDate: "2026-10-05",
  lastReviewed: "2026-10-05",
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
    { label: "GPT-6 Astra", title: "GPT-6 Astra: A new generation of intelligence", publisher: "OpenAI", url: "https://openai.com/index/gpt-6-astra/", supports: ["reasoning-language", "data-code", "computer-use", "agents"] },
    { label: "Claude Opus 5.5", title: "Introducing Claude Opus 5.5", publisher: "Anthropic", url: "https://www.anthropic.com/claude-opus-5-5", supports: ["reasoning-language", "data-code", "computer-use", "agents"] },
    { label: "Claude Fable 5.1", title: "Introducing Claude Fable 5.1 and Claude Mythos 5.1", publisher: "Anthropic", url: "https://www.anthropic.com/claude-fable-and-mythos-5-1", supports: ["reasoning-language", "data-code", "agents"] },
    { label: "Gemini 3.8 Flash", title: "Gemini 3.8 Flash", publisher: "Google", url: "https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash", supports: ["reasoning-language", "data-code", "agents"] },
    { label: "Gemini 4 Argon (limited release)", title: "Gemini 4 Argon: our next era of frontier intelligence", publisher: "Google", url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/", supports: ["reasoning-language", "data-code"] },
    { label: "OpenAI Realtime API", title: "Realtime API", publisher: "OpenAI", url: "https://platform.openai.com/docs/api-reference/realtime", supports: ["voice"] },
    { label: "ChatGPT Images 2.0", title: "Introducing ChatGPT Images 2.0", publisher: "OpenAI", url: "https://openai.com/index/introducing-chatgpt-images-2-0/", supports: ["vision-images"] },
    { label: "Veo 3.1", title: "Veo 3.1: consistency, creativity and control", publisher: "Google DeepMind", url: "https://blog.google/innovation-and-ai/technology/ai/veo-3-1-ingredients-to-video/", supports: ["video-audio"] },
    { label: "ElevenLabs voice agents", title: "What is an AI voice agent?", publisher: "ElevenLabs", url: "https://elevenlabs.io/blog/what-is-an-ai-voice-agent", supports: ["voice", "agents"] },
    { label: "Gemini Robotics 2", title: "Gemini Robotics 2", publisher: "Google DeepMind", url: "https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/", supports: ["physical-ai"] },
  ] satisfies CapabilityHorizonSource[],
} as const;

export const COMMON_BUSINESS_FUNCTIONS: CommonBusinessFunction[] = [
  {
    id: "personal-assistant", name: "Personal assistant for owners & staff", purpose: "Give each person a capable assistant for their own day-to-day workload.",
    opportunities: {
      standard: { title: "Use a personal AI assistant", outcome: "Ask a general assistant by text or voice to draft messages, summarize long documents and chats, plan the day, research a topic and prepare for meetings.", humanBoundary: "The person checks facts and decides what to send; confidential material is shared only inside approved tools." },
      integrated: { title: "Connect the assistant to email, calendar and files", outcome: "Let the assistant read approved inboxes, calendars and documents to sort messages, propose replies, schedule meetings and keep task lists current.", humanBoundary: "Access is limited per person; sending, accepting and deleting stay with the user." },
      advanced: { title: "Delegate errands to an always-on assistant", outcome: "Have the assistant watch for defined events, complete multi-step errands across apps and websites, then report what it did and what needs a decision.", humanBoundary: "Spending, commitments and anything irreversible require the person’s explicit approval." },
    },
  },
  {
    id: "marketing-brand", name: "Marketing, content & brand", purpose: "Create, publish and improve the material that helps a business get noticed and understood.",
    opportunities: {
      standard: { title: "Create posts, pictures and short videos", outcome: "Draft posts, articles, emails, captions, images, short videos, voice-overs and translations; turn one approved idea into versions for each channel and a simple content calendar.", humanBoundary: "People approve facts, claims, usage rights, use of anyone’s image, required disclosures, cultural fit and brand voice before publishing." },
      integrated: { title: "Link content to your products and calendar", outcome: "Use approved brand guidance, product or service details, promotions, events and past content to prepare and schedule approved material, with review steps built in.", humanBoundary: "Who can publish, who is targeted, what is offered and any outside commitment stay controlled and reviewable." },
      advanced: { title: "Run an approval-gated content agent", outcome: "Monitor performance and relevant trends, propose campaigns, produce multimodal variants, queue approved posts and recommend measured adjustments across channels.", humanBoundary: "Humans set strategy, approve publication and spend, and take over sensitive, controversial or crisis communication." },
    },
  },
  {
    id: "sales-growth", name: "Sales & business development", purpose: "Find, qualify and follow up with prospective customers without losing human judgment or trust.",
    opportunities: {
      standard: { title: "Write outreach messages and proposals", outcome: "Research the prospects you name, draft personal messages, prepare proposals and summarise calls with next steps.", humanBoundary: "People confirm relevance, claims, pricing, who receives it and the relationship history." },
      integrated: { title: "Link the sales process", outcome: "Use customer records, product details, availability and past conversations to rank leads, prepare follow-ups and keep the sales list up to date.", humanBoundary: "Consent, contact rules, pricing and significant commitments stay with staff." },
      advanced: { title: "Coordinate an approval-gated pipeline agent", outcome: "Monitor pipeline signals, prepare account plans, orchestrate bounded follow-up and route stalled or high-value opportunities.", humanBoundary: "AI does not impersonate a person or autonomously negotiate consequential terms." },
    },
  },
  {
    id: "customer-service", name: "Customer service, calls & appointments", purpose: "Answer questions and complete routine service work across phone, chat, email and messaging.",
    opportunities: {
      standard: { title: "Help answer customer questions", outcome: "Draft replies, summarise conversations, answer common questions from approved answers, and support customers by text or voice in several languages.", humanBoundary: "A person is always available to take over for sensitive, unclear or unhappy customers." },
      integrated: { title: "A phone and chat assistant linked to bookings", outcome: "Answer calls, confirm who is calling within set limits, look up account or booking details, schedule appointments and make approved routine changes.", humanBoundary: "Refunds, disputes, vulnerable customers and significant changes follow clear rules for passing to a person." },
      advanced: { title: "Coordinate omnichannel resolution", outcome: "Carry context across calls, chat, email and files, use connected tools and resolve bounded cases from request through confirmation.", humanBoundary: "The business owns monitoring, quality, redress and every policy boundary." },
    },
  },
  {
    id: "finance-admin", name: "Finance, billing & administration", purpose: "Reduce routine handling while keeping financial records and commitments accountable.",
    opportunities: {
      standard: { title: "Prepare routine finance paperwork", outcome: "Read receipts and invoices, draft descriptions for bills, explain why figures changed, and prepare payment reminders or working spreadsheets.", humanBoundary: "People check the source documents, calculations, categories and anything sent outside the business." },
      integrated: { title: "Link invoicing and payment follow-up", outcome: "Connect accounting, payment and customer systems to prepare invoices, match payments, follow approved steps for chasing late payers, and pass exceptions to staff.", humanBoundary: "Authority to post entries, make payments, give credit or write off debt stays tightly controlled." },
      advanced: { title: "Monitor cash and controls continuously", outcome: "Watch transaction, cash-flow and control signals, simulate scenarios and prepare bounded corrective actions.", humanBoundary: "Qualified people investigate anomalies and own financial decisions and sign-off." },
    },
  },
  {
    id: "people-training", name: "People, hiring & training", purpose: "Support employees and managers without turning employment decisions over to opaque automation.",
    opportunities: {
      standard: { title: "Write hiring and training material", outcome: "Draft job adverts, plans for new starters, policies, training guides, quizzes and learning content for each role.", humanBoundary: "People check accuracy, accessibility, fairness and employment law." },
      integrated: { title: "Answer staff questions from your own policies", outcome: "Use approved policies, rotas, skills records and training systems to answer staff questions and prepare development or cover plans.", humanBoundary: "Access depends on role; private employee information and managers’ decisions need proper controls." },
      advanced: { title: "Model workforce needs", outcome: "Simulate staffing and skills scenarios and coordinate approved learning or scheduling actions across systems.", humanBoundary: "AI does not make final hiring, firing, promotion, compensation or disciplinary decisions." },
    },
  },
  {
    id: "operations-procurement", name: "Operations & procurement", purpose: "Coordinate supplies, schedules and recurring work across the business.",
    opportunities: {
      standard: { title: "Prepare day-to-day operations paperwork", outcome: "Create step-by-step procedures, checklists, shift plans, supplier comparisons, work summaries and lists of problems to fix, from approved information.", humanBoundary: "Those in charge confirm real conditions, priorities, safety and cost assumptions." },
      integrated: { title: "Link stock, orders and schedules", outcome: "Connect stock, orders, schedules, job systems and supplier updates to predict needs and prepare coordinated actions.", humanBoundary: "Orders, substitutions, staffing changes and significant commitments need defined approval." },
      advanced: { title: "Run a bounded operations agent", outcome: "Monitor events continuously, diagnose exceptions and prepare or execute low-risk recovery steps within narrow authority.", humanBoundary: "People retain control of safety, supplier relationships, spending and customer impact." },
    },
  },
  {
    id: "knowledge-technology", name: "Knowledge, data & technology", purpose: "Help people find what the organization knows and use software more effectively.",
    opportunities: {
      standard: { title: "Find, analyse and build", outcome: "Search the business’s own information, summarise meetings, analyse files, create spreadsheets, draft simple software and explain internal processes.", humanBoundary: "Users check sources, calculations, permissions and anything put into real use." },
      integrated: { title: "Link your information and software", outcome: "Find the right information for each role and complete limited multi-step tasks across approved databases and applications.", humanBoundary: "Identity checks, access rules, testing, logging and a plan for exceptions are needed before any system is changed." },
      advanced: { title: "Use monitored computer and software agents", outcome: "Operate selected interfaces, investigate issues and coordinate long-running technical or analytical work across tools.", humanBoundary: "High-impact changes, credentials, security actions and irreversible operations require accountable approval." },
    },
  },
  {
    id: "compliance-risk", name: "Compliance, privacy & risk", purpose: "Make obligations easier to follow without mistaking automated checks for professional assurance.",
    opportunities: {
      standard: { title: "Explain rules and check against them", outcome: "Turn approved policies into checklists and training, do a first-pass review, and flag missing information or possible inconsistencies.", humanBoundary: "Qualified people interpret the rules and resolve anything unclear." },
      integrated: { title: "Build the rules into everyday work", outcome: "Apply approved rules, access controls, record-keeping steps, required notices and audit trails inside connected business processes.", humanBoundary: "Those responsible for each control check its design, its exceptions and proof that it works." },
      advanced: { title: "Monitor emerging risk", outcome: "Continuously watch defined signals, assemble evidence and prepare response options for review.", humanBoundary: "AI does not provide final legal, regulatory or assurance conclusions." },
    },
  },
];
