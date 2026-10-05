import type { UtilizationDepth } from "../types/scoring.js";

export type OutlookTierId = UtilizationDepth;

export interface IndustryUseCase {
  id: string;
  title: string;
  outcome: string;
  humanBoundary: string;
}

export interface IndustryOutlookTier {
  id: OutlookTierId;
  title: string;
  description: string;
  useCases: IndustryUseCase[];
}

export interface IndustryOutlookSource {
  title: string;
  publisher: string;
  url: string;
  note: string;
}

export interface IndustryOutlook {
  slug: string;
  name: string;
  framing: string;
  archetype: string;
  maturityLabel: string;
  tiers: IndustryOutlookTier[];
  sources: IndustryOutlookSource[];
}

export interface CountryPracticalContext {
  slug: string;
  name: string;
  framing: string;
  tierGuidance: Record<OutlookTierId, string>;
  industryNotes: Record<string, string>;
  factors: Array<{ title: string; detail: string }>;
  sources: IndustryOutlookSource[];
}

// The first item in each row is a permanent identifier. Saved self-check answers refer to it, so never change or reuse one.
const tier = (id: OutlookTierId, useCases: Array<[key: string, title: string, outcome: string, humanBoundary: string]>): IndustryOutlookTier => ({
  id,
  title: id === "standard" ? "Standard AI" : id === "integrated" ? "Integrated AI" : "Advanced AI & human control",
  description: id === "standard"
    ? "Mainstream language, document, voice or image assistance that a person starts, checks and controls."
    : id === "integrated"
      ? "AI connected to approved business data and systems for bounded, multi-step workflows with clear permissions."
      : "Continuous, multimodal or agentic systems that can plan and prepare actions across tools, with approval gates and accountable people.",
  useCases: useCases.map(([key, title, outcome, humanBoundary]) => ({
    id: key,
    title,
    outcome,
    humanBoundary,
  })),
});

const onet = (title: string, code: string, note: string): IndustryOutlookSource => ({
  title: `${code} — ${title}`,
  publisher: "O*NET OnLine / U.S. Department of Labor",
  url: `https://www.onetonline.org/link/summary/${code}`,
  note,
});

const nist: IndustryOutlookSource = {
  title: "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile",
  publisher: "National Institute of Standards and Technology",
  url: "https://doi.org/10.6028/NIST.AI.600-1",
  note: "Cross-industry basis for identifying generative-AI risks, testing, oversight and governance controls.",
};

const aiIndex2026: IndustryOutlookSource = {
  title: "2026 AI Index Report — Technical Performance",
  publisher: "Stanford Institute for Human-Centered Artificial Intelligence",
  url: "https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance",
  note: "Current capability horizon spanning language, speech, vision, video, reasoning and agentic systems.",
};

export const INDUSTRY_OUTLOOKS: IndustryOutlook[] = [
  {
    slug: "law-firms",
    name: "Law Firms",
    framing: "Use today’s language, voice, document and agentic AI to reduce matter administration and strengthen professional work—without transferring legal judgment or responsibility to a machine.",
    archetype: "Small or medium general law firm",
    maturityLabel: "Current capability outlook · experimental scoring available separately",
    tiers: [
      tier("standard", [
        ["write-first-drafts-and-summarise-documents", "Write first drafts and summarise documents", "Get a first draft of a letter or agreement, compare two versions to see what changed, and get a short summary of a long document that points back to the original.", "A lawyer checks the facts, the law and whether it fits the client before anything is used."],
        ["ask-questions-across-the-firms-own-files", "Ask questions across the firm’s own files", "Type a question in everyday words and get answers from the firm’s past work, templates and research sources, with links to where each answer came from.", "Lawyers confirm the material is current and complete before relying on it."],
        ["turn-calls-and-meetings-into-notes", "Turn calls and meetings into notes", "With the client’s consent, record a call or meeting and get tidy notes, the details needed to open a file, and a draft follow-up message.", "Staff confirm consent, confidentiality, who the client is, any conflicts of interest, and that the notes are accurate."],
        ["keep-files-and-client-updates-in-order", "Keep files and client updates in order", "Sort documents into the right folders, draft routine updates to clients, and build to-do checklists from information already on file.", "People approve who receives what, any promises or deadlines, and the content itself."],
      ]),
      tier("integrated", [
        ["an-assistant-that-works-across-the-firms", "An assistant that works across the firm’s systems", "Lets staff find and prepare work across the firm’s documents, past work, email and case-management software, with each person seeing only what they are allowed to.", "The firm controls who can see what, how long records are kept, and anything sent outside the firm."],
        ["open-new-client-files-with-fewer-manual", "Open new client files with fewer manual steps", "Collects a new client’s details, searches the firm’s records for possible conflicts of interest, and passes anything unusual to staff.", "Qualified staff resolve conflicts and decide whether to take on the client."],
        ["track-deadlines-progress-and-billing", "Track deadlines, progress and billing", "Picks out court and filing dates, prepares reminders, updates the status of each case in draft, and prepares the wording for bills.", "People confirm official dates, filings, invoices and any change to the firm’s records."],
        ["draft-from-the-firms-own-templates-and", "Draft from the firm’s own templates and facts", "Combines approved templates, the facts of the case and checked legal sources into a working draft that shows where each part came from.", "The responsible lawyer decides the strategy, the legal analysis and the final wording."],
      ]),
      tier("advanced", [
        ["agentic-due-diligence-and-discovery-review", "Agentic due-diligence and discovery review", "Plan and execute bounded multi-step review across large document sets, then produce traceable issue lists and exception queues.", "Scope, privilege calls, responsiveness and conclusions remain lawyer-controlled."],
        ["multimodal-evidence-chronology", "Multimodal evidence chronology", "Connect documents, images, audio and video to prepare a source-linked chronology and identify possible inconsistencies.", "Humans authenticate evidence and decide relevance, weight and admissibility."],
        ["strategy-and-outcome-simulation", "Strategy and outcome simulation", "Stress-test arguments, negotiation options and procedural scenarios against explicit assumptions and verified material.", "AI does not predict with certainty or make professional decisions for the client."],
        ["approval-gated-matter-agents", "Approval-gated matter agents", "Monitor defined matter events and prepare coordinated next actions across research, drafting, scheduling and client-service tools.", "No filing, advice, commitment or client communication occurs without accountable approval."],
      ]),
    ],
    sources: [onet("Lawyers", "23-1011.00", "Occupational basis for legal research, drafting, client advice, negotiation, advocacy and professional responsibility."), aiIndex2026, nist],
  },
  {
    slug: "accounting-firms",
    name: "Accounting Firms",
    framing: "Use AI to reduce document handling and reconciliation work, strengthen exception detection, and give professionals more time for interpretation and advice.",
    archetype: "Small or medium accounting, bookkeeping, tax and advisory practice",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["read-invoices-receipts-and-statements", "Read invoices, receipts and statements", "Turn photos or PDFs of invoices, receipts and bank statements into draft bookkeeping entries, with a list of anything that needs a second look.", "A person checks the amounts, the accounts used, the tax treatment and that nothing is missing."],
        ["spot-what-doesnt-match-in-the-books", "Spot what doesn’t match in the books", "Match bank transactions against the records and flag items that are unmatched, duplicated or unusual.", "An accountant resolves each flagged item and approves any correction."],
        ["draft-messages-and-explanations-for-clients", "Draft messages and explanations for clients", "Prepare lists of missing documents, routine emails and plain-language summaries of what the numbers mean.", "A professional checks accuracy, confidentiality and any advice given."],
        ["build-checklists-for-tax-and-month-end", "Build checklists for tax and month-end", "Create a working checklist for each client from the firm’s templates and the known requirements.", "Qualified staff confirm which rules and deadlines apply."],
      ]),
      tier("integrated", [
        ["keep-the-books-up-to-date-through", "Keep the books up to date through the month", "Links the accounts, stored documents and task lists so entries, supporting documents and items needing review are prepared continuously, not only at month-end.", "Staff approve what is posted and control who can access the financial systems."],
        ["sort-audit-evidence", "Sort audit evidence", "Files each piece of evidence against the audit step it supports and points out gaps or contradictions.", "Auditors decide whether the evidence is sufficient and reliable, and reach the conclusions."],
        ["explain-cash-flow-and-changes-in-the", "Explain cash flow and changes in the numbers", "Explains why figures moved, tests assumptions and prepares management reports with what-if scenarios.", "Professionals check the source data and are clear about uncertainty."],
        ["search-the-firms-methods-and-past-work", "Search the firm’s methods and past work", "Finds approved policies, templates and earlier work, with links to the source.", "Practitioners confirm it is current and fits the client."],
      ]),
      tier("advanced", [
        ["continuous-controls-monitoring", "Continuous controls monitoring", "Monitor transaction and control signals for emerging exceptions or breakdowns.", "Humans investigate alerts and own control conclusions."],
        ["advisory-scenario-simulation", "Advisory scenario simulation", "Model operational, financing and tax scenarios from controlled assumptions.", "Advisers choose assumptions and own recommendations."],
        ["complex-research-synthesis", "Complex research synthesis", "Build source-linked working analyses across accounting, tax and regulatory material.", "Qualified professionals verify authorities and final positions."],
        ["engagement-quality-challenge", "Engagement-quality challenge", "Challenge a working file for unsupported claims, inconsistent evidence and missed review steps.", "AI cannot issue an audit opinion or professional sign-off."],
      ]),
    ],
    sources: [onet("Accountants and Auditors", "13-2011.00", "Occupational basis for financial reporting, reconciliation, audit, tax, controls and advisory work."), aiIndex2026, nist],
  },
  {
    slug: "construction-contractors",
    name: "Construction Contractors",
    framing: "Use AI to make project information easier to act on—from estimates and daily records to schedule, procurement and site-risk signals.",
    archetype: "General or specialty contractor coordinating office and field operations",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["summarise-drawings-and-specifications", "Summarise drawings and specifications", "Pull out the scope of work, what is excluded, the materials and open questions into a checklist for preparing a bid.", "Estimators check the drawings, quantities and what the contract actually says."],
        ["draft-formal-project-paperwork", "Draft formal project paperwork", "Prepare draft questions to the designer, material approval requests and records of changes from emails and site notes.", "Project staff approve every communication that affects the contract."],
        ["turn-site-notes-into-daily-reports", "Turn site notes into daily reports", "Combine voice notes, photos and logs into a consistent daily progress record.", "Supervisors confirm what happened, who was on site, the conditions and any incidents."],
        ["prepare-safety-briefings-and-paperwork", "Prepare safety briefings and paperwork", "Adapt approved safety material to the day’s work and the site.", "A competent person on site decides the hazards and controls."],
      ]),
      tier("integrated", [
        ["spot-schedule-risks-early", "Spot schedule risks early", "Links the programme, progress records and reported problems to flag delays and tasks that depend on each other.", "Project leaders decide how to recover and what to commit to."],
        ["compare-site-photos-with-the-plans", "Compare site photos with the plans", "Compares approved site photos with the drawings or with earlier photos and flags possible differences for inspection.", "Qualified people inspect and decide whether the work complies."],
        ["warn-about-material-shortages", "Warn about material shortages", "Links material schedules, purchase orders and supplier updates to predict shortages before they hold up work.", "Buyers approve substitutions, orders and any action with suppliers."],
        ["manage-change-requests", "Manage change requests", "Gathers notices, supporting records, cost inputs and status for each change to the contract, across the systems in use.", "Commercial staff confirm entitlement, pricing and what is submitted."],
      ]),
      tier("advanced", [
        ["alternative-schedule-generation", "Alternative schedule generation", "Generate and compare feasible sequencing options under labour, equipment and access constraints.", "Construction leadership selects and validates the plan."],
        ["predictive-project-controls", "Predictive project controls", "Combine cost, schedule, production and risk signals to forecast likely outcomes.", "Forecasts support—not replace—professional judgment."],
        ["site-vision-for-quality-and-safety", "Site vision for quality and safety", "Route potential PPE, access, housekeeping or installation exceptions from imagery.", "AI is not a safety officer; humans verify and intervene."],
        ["bid-and-portfolio-simulation", "Bid and portfolio simulation", "Test capacity, margin, risk and cash scenarios across prospective work.", "Executives own bid decisions and commercial assumptions."],
      ]),
    ],
    sources: [onet("Construction Managers", "11-9021.00", "Occupational basis for estimating, scheduling, budgeting, procurement, compliance and field coordination."), aiIndex2026, nist],
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    framing: "Use AI to improve demand planning, purchasing, staffing and guest communication while keeping food safety and hospitality firmly human-led.",
    archetype: "Independent or small multi-location food-service operation",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["write-menus-and-messages-to-guests", "Write menus and messages to guests", "Draft dish descriptions, translations, answers to common questions and promotions from facts you provide.", "Staff check allergens, prices, claims and that the wording suits your customers."],
        ["summarise-reviews-and-feedback", "Summarise reviews and feedback", "Group what guests keep saying, good and bad, and flag urgent complaints.", "Managers look into the context before acting."],
        ["draft-staff-rotas", "Draft staff rotas", "Prepare a shift plan from staff availability, expected busy times and your labour rules.", "Managers approve fairness, cover and legal compliance."],
        ["make-prep-and-stock-count-lists", "Make prep and stock-count lists", "Turn recipes, minimum stock levels and known bookings into a working list of what to prepare or count.", "Kitchen staff confirm quantities, freshness and substitutions."],
      ]),
      tier("integrated", [
        ["forecast-how-busy-you-will-be", "Forecast how busy you will be", "Uses past sales, bookings, weather and local events to predict customer numbers and which dishes will sell.", "Operators adjust for local knowledge and unusual events."],
        ["find-where-food-and-money-are-being", "Find where food and money are being lost", "Links purchases, recipes, stock counts and sales to show likely waste or portion problems.", "Managers check the data and the real cause."],
        ["suggest-what-to-order", "Suggest what to order", "Recommends how much to reorder, using the forecast, current stock and supplier limits.", "A person approves orders, substitutions and spending."],
        ["take-phone-orders-into-your-ordering-system", "Take phone orders into your ordering system", "Handles straightforward phone or drive-through orders and passes confirmed items into the ordering system.", "Anything about allergies, anything unclear, or an upset customer goes to staff."],
      ]),
      tier("advanced", [
        ["menu-and-margin-simulation", "Menu and margin simulation", "Test price, recipe, demand and capacity changes before altering the menu.", "Operators own assumptions and guest-value decisions."],
        ["kitchen-vision-assistance", "Kitchen vision assistance", "Detect possible queue, presentation or process exceptions from approved camera feeds.", "Food safety decisions require trained human verification."],
        ["multi-location-optimization", "Multi-location optimization", "Coordinate forecasts, labour, inventory and promotions across sites.", "Regional leaders approve transfers and operating changes."],
        ["approval-gated-restaurant-operations-agent", "Approval-gated restaurant operations agent", "Monitor reservations, demand, stock and staffing signals, then prepare coordinated actions across systems.", "People approve purchases, staffing changes, guest commitments and food-safety decisions."],
      ]),
    ],
    sources: [onet("Food Service Managers", "11-9051.00", "Occupational basis for food-service operations, staffing, inventory, guest service and compliance."), aiIndex2026, nist],
  },
  {
    slug: "retail-stores",
    name: "Retail Stores",
    framing: "Use AI to improve merchandising, inventory decisions and customer service without losing control of pricing, fairness or the in-store experience.",
    archetype: "Independent or small multi-location consumer retail business",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["write-product-descriptions", "Write product descriptions", "Draft descriptions, comparisons, translations and short product guides for staff from the product details you provide.", "Staff check claims, price and availability."],
        ["answer-everyday-product-questions", "Answer everyday product questions", "Find the right answer from your policies and product list, for your website or for staff helping a customer.", "Complicated, safety-related or complaint cases go to a person."],
        ["summarise-reviews-and-returns", "Summarise reviews and returns", "Group recurring problems with products, service or sizing so buyers and managers can see patterns.", "People confirm the cause before changing what the shop stocks."],
        ["plan-shifts-and-daily-tasks", "Plan shifts and daily tasks", "Draft staff cover and daily task lists from how busy the shop usually is and who is available.", "Managers approve labour rules, fairness and priorities."],
      ]),
      tier("integrated", [
        ["forecast-demand-and-suggest-reorders", "Forecast demand and suggest reorders", "Links sales, stock, promotions and delivery times to suggest how much to reorder.", "Buyers approve orders and allow for local events."],
        ["suggest-products-to-customers", "Suggest products to customers", "Uses information customers have agreed to share, plus product details, to suggest useful options.", "Controls prevent guessing sensitive things about people, manipulation and unfair treatment."],
        ["flag-unusual-returns", "Flag unusual returns", "Passes unusual return patterns or odd transactions to staff for review.", "AI does not accuse customers or make final decisions against them."],
        ["match-promotions-to-what-is-in-stock", "Match promotions to what is in stock", "Checks promotion drafts and target audiences against available stock, profit margin and delivery capacity.", "Teams approve the audience, the offer and where it runs."],
      ]),
      tier("advanced", [
        ["store-vision-assistance", "Store-vision assistance", "Detect shelf gaps, queue build-up or possible merchandising exceptions from approved feeds.", "People verify conditions; biometric identification is out of scope by default."],
        ["pricing-and-assortment-simulation", "Pricing and assortment simulation", "Test price, promotion and assortment options against demand and margin scenarios.", "Merchants own pricing, fairness and brand decisions."],
        ["supply-network-exception-agents", "Supply-network exception agents", "Monitor suppliers, orders and fulfilment, then prepare bounded recovery actions.", "Material commitments require human approval."],
        ["controlled-merchandising-experiments", "Controlled merchandising experiments", "Generate variants and evaluate measured outcomes within predefined guardrails.", "Humans set hypotheses, exclusions and stopping rules."],
      ]),
    ],
    sources: [onet("First-Line Supervisors of Retail Sales Workers", "41-1011.00", "Occupational basis for merchandising, inventory, staffing, service and store operations."), aiIndex2026, nist],
  },
  {
    slug: "barbershops-salons",
    name: "Barbershops & Salons",
    framing: "Use AI around the appointment and client relationship—booking, follow-up, demand and stock—while the service itself stays personal and skilled.",
    archetype: "Independent barbershop, salon or small personal-care studio",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["answer-booking-questions-and-send-reminders", "Answer booking questions and send reminders", "Reply to routine questions about availability, prices and how to prepare, on the channels you choose, and remind clients of appointments.", "Unusual requests and complaints go to a person."],
        ["keep-short-notes-on-each-client", "Keep short notes on each client", "With the client’s consent, turn your notes into a brief service history and a list of their preferences.", "The stylist or barber confirms the details with the client."],
        ["draft-follow-up-and-rebooking-messages", "Draft follow-up and rebooking messages", "Prepare personal aftercare tips and reminders to book again, using your approved wording.", "Staff check the advice, the timing and that the client agreed to be contacted."],
        ["show-style-previews-and-create-local-content", "Show style previews and create local content", "Generate clearly labelled previews of a style, plus posts, offers and service explanations, from reference pictures you approve.", "A preview is not a promise; the professional approves what is achievable, and all claims, images and promotions."],
      ]),
      tier("integrated", [
        ["smarter-appointment-scheduling", "Smarter appointment scheduling", "Uses past appointments, how long each service takes and staff availability to reduce empty gaps and overruns.", "Managers control buffer time, fairness and staff workload."],
        ["plan-products-and-supplies", "Plan products and supplies", "Links upcoming appointments and services to stock levels to suggest what to reorder.", "Staff check product suitability and approve purchases."],
        ["remind-clients-who-are-due-to-return", "Remind clients who are due to return", "Spots clients who have agreed to be contacted and may be due a visit, and prepares a gentle reminder.", "No sensitive profiling; staff control who is contacted and what is offered."],
        ["a-phone-receptionist-that-can-hand-over", "A phone receptionist that can hand over to a person", "Answers routine calls and makes or changes bookings in the appointment system, with a clear way to reach a person.", "Sensitive, unclear or unhappy-client calls are transferred to staff."],
      ]),
      tier("advanced", [
        ["approval-gated-client-service-agent", "Approval-gated client-service agent", "Coordinate consented reminders, waitlists, rebooking and routine follow-up across channels and systems.", "Staff control contact rules, exceptions, complaints and customer-impacting changes."],
        ["demand-and-pricing-simulation", "Demand and pricing simulation", "Test service mix, timing, promotion and capacity options against explicit assumptions.", "Owners decide pricing, fairness, brand positioning and staff impact."],
        ["multi-location-capacity-planning", "Multi-location capacity planning", "Coordinate staffing, demand, service mix and stock across locations.", "Leaders approve staffing and customer-impacting changes."],
        ["consent-aware-personalization", "Consent-aware personalization", "Recommend services or content using declared preferences and service history.", "Avoid health inference and protected or highly sensitive traits."],
      ]),
    ],
    sources: [onet("Hairdressers, Hairstylists, and Cosmetologists", "39-5012.00", "Occupational basis for consultation, appointments, product use, client service and salon operations."), aiIndex2026, nist],
  },
  {
    slug: "marketing-agencies",
    name: "Marketing Agencies",
    framing: "Use AI to multiply research and production capacity, then connect it to measurement and controlled campaign operations without outsourcing strategy or truth.",
    archetype: "Small or medium strategy, creative, media and analytics agency",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["explore-ideas-from-a-client-brief", "Explore ideas from a client brief", "Generate possible directions, questions to ask and early concepts from the brief.", "Strategists choose the direction and challenge the assumptions."],
        ["adapt-one-idea-for-every-channel", "Adapt one idea for every channel", "Turn an approved concept into text, image, audio and video versions in different lengths and for different audiences.", "People protect the idea, the claims, usage rights and the brand’s voice."],
        ["summarise-research-and-results", "Summarise research and results", "Combine supplied sources, campaign results and meeting notes into a summary that shows where each point came from.", "Analysts check the data, what caused what, and the conclusions."],
        ["draft-proposals-and-progress-updates", "Draft proposals and progress updates", "Prepare scopes of work, timelines, meeting recaps and next steps from approved information.", "Account teams approve commitments and commercial terms."],
      ]),
      tier("integrated", [
        ["run-campaign-logistics-across-systems", "Run campaign logistics across systems", "Links briefs, creative files, approvals, ad set-up and reporting so work moves between systems with less manual copying.", "People approve what is published, the spend and the audience settings."],
        ["analyse-audiences-without-exposing-individuals", "Analyse audiences without exposing individuals", "Finds patterns in campaign data and in customer data collected with consent, without revealing who anyone is.", "Teams enforce consent, collect only what is needed, and block prohibited uses."],
        ["suggest-budget-changes-from-live-results", "Suggest budget changes from live results", "Forecasts how ads will deliver and recommends limited budget or bid changes based on current performance.", "Media owners approve any significant change in spend."],
        ["a-brand-rulebook-the-tools-can-consult", "A brand rulebook the tools can consult", "Lets tools look up approved claims, tone of voice, visual rules and past decisions while work is being produced.", "Brand owners resolve conflicts and exceptions."],
      ]),
      tier("advanced", [
        ["synthetic-concept-testing", "Synthetic concept testing", "Use simulated reactions to expose questions and hypotheses before real research.", "Synthetic responses are not evidence of real customer preference."],
        ["marketing-mix-scenario-modelling", "Marketing-mix scenario modelling", "Compare spend and outcome scenarios with explicit assumptions and uncertainty.", "Analysts validate the model and avoid causal overclaiming."],
        ["guardrailed-campaign-agents", "Guardrailed campaign agents", "Monitor, diagnose and prepare predefined actions across channels.", "Publication, targeting and material spend remain approval-gated."],
        ["cross-channel-production-agents", "Cross-channel production agents", "Coordinate bounded research, generation, review routing and adaptation across creative tools and channels.", "Humans approve originality, rights, disclosure, publication and final craft."],
      ]),
    ],
    sources: [onet("Marketing Managers", "11-2021.00", "Occupational basis for research, strategy, pricing, promotion, media and performance analysis."), aiIndex2026, nist],
  },
  {
    slug: "healthcare-clinics",
    name: "Healthcare Clinics",
    framing: "Use AI first to reduce administrative burden and improve information flow; clinical uses require validated tools, clear scope and accountable professionals.",
    archetype: "Outpatient clinic with clinicians, medical assistants and administrative staff",
    maturityLabel: "Qualitative capability outlook · clinical scoring requires additional validation",
    tiers: [
      tier("standard", [
        ["draft-notes-from-a-patient-visit", "Draft notes from a patient visit", "With consent, turn a recording or notes of the visit into a structured draft for the patient record.", "The clinician checks every clinical fact and signs the note."],
        ["write-messages-to-patients", "Write messages to patients", "Draft reminders, instructions and plain-language health information from approved material.", "Clinical staff check it suits the patient and that advice on when to seek help is right."],
        ["summarise-incoming-records", "Summarise incoming records", "Organise a patient’s history, results and letters into a summary that points back to each source.", "Clinicians confirm what is relevant, accurate and missing."],
        ["help-with-scheduling-and-registration", "Help with scheduling and registration", "Collect basic registration details, answer routine questions about the clinic, and flag anything that sounds urgent.", "AI does not diagnose; urgent or unclear cases go straight to staff."],
      ]),
      tier("integrated", [
        ["track-referrals-and-test-results", "Track referrals and test results", "Links documents, work queues and task lists to sort, route and follow up referrals and results.", "Clinical teams decide priority and when an item is closed."],
        ["help-with-billing-codes-and-insurer-approvals", "Help with billing codes and insurer approvals", "Prepares suggested billing codes, supporting documents and insurer forms from the verified patient record.", "Qualified staff check the codes and everything submitted."],
        ["forecast-demand-and-missed-appointments", "Forecast demand and missed appointments", "Predicts appointment demand and likely gaps to improve access and staffing.", "Managers make sure it is never used to discriminate against or penalise patients."],
        ["lists-of-patients-due-for-follow-up", "Lists of patients due for follow-up", "Identifies patients who may be due an approved follow-up, using defined clinical rules.", "Clinicians review eligibility and each patient’s situation."],
      ]),
      tier("advanced", [
        ["validated-clinical-decision-support", "Validated clinical decision support", "Present patient-specific risk or diagnostic support within an approved intended use.", "A licensed clinician remains responsible for diagnosis and treatment."],
        ["imaging-or-signal-triage", "Imaging or signal triage", "Use regulated or locally approved systems to prioritize possible abnormalities for review.", "AI output cannot substitute for qualified interpretation."],
        ["remote-monitoring-exception-detection", "Remote-monitoring exception detection", "Route concerning changes from approved devices and patient-reported data.", "Clinical protocols define response, escalation and limitations."],
        ["care-plan-scenario-support", "Care-plan scenario support", "Compare guideline-linked options, interactions and patient constraints for discussion.", "Clinician and patient make the final care decision."],
      ]),
    ],
    sources: [
      onet("Medical and Health Services Managers", "11-9111.00", "Occupational basis for clinic operations, records, compliance, staffing and service coordination."),
      aiIndex2026,
      {
        title: "Ethics and governance of artificial intelligence for health",
        publisher: "World Health Organization",
        url: "https://www.who.int/publications/i/item/9789240029200",
        note: "Health-specific basis for human autonomy, safety, transparency, accountability and equity boundaries.",
      },
      nist,
    ],
  },
  {
    slug: "tourism-hospitality",
    name: "Tourism & Hospitality",
    framing: "Use AI to answer guests faster, keep listings and bookings accurate and plan staffing and supplies, while hospitality, safety and guest care stay with people.",
    archetype: "Independent hotel, guesthouse or tour operator",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["answer-guest-questions-before-and-during-a", "Answer guest questions before and during a stay", "Draft replies about rooms, prices, directions, check-in times and local attractions, by text or voice and in several languages.", "Staff confirm availability, prices and anything promised to a guest."],
        ["write-listings-itineraries-and-guest-information", "Write listings, itineraries and guest information", "Draft room and tour descriptions, day-by-day itineraries, welcome notes and house rules from facts you provide.", "Staff check that descriptions, photos and claims are accurate and current."],
        ["summarise-guest-reviews", "Summarise guest reviews", "Group what guests praise and complain about across booking sites, and draft polite replies.", "Managers look into issues and approve replies before posting."],
        ["prepare-housekeeping-and-staff-rotas", "Prepare housekeeping and staff rotas", "Draft cleaning lists and shift plans from arrivals, departures and staff availability.", "Managers approve fairness, cover and labour rules."],
      ]),
      tier("integrated", [
        ["keep-availability-and-prices-in-step-across", "Keep availability and prices in step across booking sites", "Links your booking calendar with online travel sites so rooms or tour places and prices stay the same everywhere.", "Staff approve price changes and resolve double bookings."],
        ["forecast-how-busy-you-will-be", "Forecast how busy you will be", "Uses past bookings, seasons, holidays and local events to predict occupancy and plan staff and supplies.", "Managers adjust for local knowledge and unusual events."],
        ["a-booking-assistant-linked-to-your-reservation", "A booking assistant linked to your reservation system", "Answers enquiries by phone or chat, checks real availability and makes or changes straightforward bookings, with a clear way to reach a person.", "Refunds, complaints, group bookings and special needs go to staff."],
        ["plan-maintenance-and-supplies", "Plan maintenance and supplies", "Links room status, reported faults and stock levels to schedule repairs and suggest what to reorder.", "Staff confirm safety issues and approve spending."],
      ]),
      tier("advanced", [
        ["price-and-occupancy-simulation", "Price and occupancy simulation", "Test different prices, packages and minimum stays against expected demand before changing rates.", "Owners decide pricing and fairness to guests."],
        ["personalised-stay-planning", "Personalised stay planning", "Prepare tailored itineraries and offers from preferences a guest has agreed to share.", "No sensitive profiling; staff approve offers and partner commitments."],
        ["multi-property-coordination", "Multi-property coordination", "Coordinate forecasts, staffing, supplies and promotions across several properties or tours.", "Managers approve transfers and operating changes."],
        ["approval-gated-guest-operations-agent", "Approval-gated guest-operations agent", "Monitor bookings, guest requests, staffing and supplies, then prepare coordinated actions across systems.", "People approve refunds, purchases, staffing changes, guest commitments and safety decisions."],
      ]),
    ],
    sources: [onet("Lodging Managers", "11-9081.00", "Occupational basis for guest services, reservations, staffing, housekeeping, maintenance and property operations."), aiIndex2026, nist],
  },
  {
    slug: "agriculture",
    name: "Agriculture",
    framing: "Use AI to get practical advice faster, keep better records and plan around weather and markets, while decisions about land, animals, chemicals and money stay with the farmer.",
    archetype: "Small or medium farm or agribusiness",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["ask-farming-questions-in-everyday-language", "Ask farming questions in everyday language", "Ask by text or voice about planting times, crop care, storage or animal health and get general guidance, including in local languages where the tool supports them.", "The farmer checks advice against local conditions, and with an extension officer or vet, before acting."],
        ["identify-possible-pests-and-diseases-from-a", "Identify possible pests and diseases from a photo", "Take a photo of a leaf, plant or animal and get a list of possible causes and what to look for next.", "A photo result is not a diagnosis; an agronomist or vet confirms before any treatment."],
        ["keep-simple-farm-records", "Keep simple farm records", "Turn spoken or typed notes and photos of receipts into records of inputs, labour, harvests and sales.", "The farmer checks amounts and dates."],
        ["write-messages-to-buyers-and-suppliers", "Write messages to buyers and suppliers", "Draft price enquiries, offers, delivery notices and simple agreements from details you provide.", "The farmer confirms prices, quantities and anything promised."],
      ]),
      tier("integrated", [
        ["plan-work-around-the-weather-forecast", "Plan work around the weather forecast", "Links local weather forecasts to your crop calendar to suggest when to plant, spray, irrigate or harvest.", "The farmer decides, allowing for what they see in the field."],
        ["track-costs-and-profit-for-each-crop", "Track costs and profit for each crop or field", "Links purchase, labour and sales records to show what each crop or field costs and earns.", "The farmer checks the figures before using them for loans or decisions."],
        ["follow-market-prices-and-prepare-sales", "Follow market prices and prepare sales", "Brings together market price information and your stock to suggest when and where to sell.", "The farmer decides when to sell and at what price."],
        ["keep-the-records-buyers-and-certifiers-ask", "Keep the records buyers and certifiers ask for", "Organises records of inputs, treatments and harvest dates so they can be shown to buyers, lenders or certification schemes.", "The farmer confirms the records are true and complete."],
      ]),
      tier("advanced", [
        ["field-monitoring-from-drone-or-satellite-images", "Field monitoring from drone or satellite images", "Analyse images of fields to flag areas of possible stress, pests or water problems for inspection.", "A person inspects the field and decides on treatment."],
        ["yield-and-season-simulation", "Yield and season simulation", "Test planting dates, varieties and input levels against weather and price scenarios.", "Forecasts support, and do not replace, the farmer’s judgement."],
        ["sensor-guided-irrigation-and-feeding", "Sensor-guided irrigation and feeding", "Use soil, weather or animal sensors to recommend or adjust watering and feeding within set limits.", "People set the limits and check equipment and animal welfare."],
        ["approval-gated-farm-operations-agent", "Approval-gated farm-operations agent", "Monitor weather, stock, prices and tasks, then prepare coordinated purchases, work plans and sales for approval.", "People approve spending, chemical use, sales and anything affecting safety or animals."],
      ]),
    ],
    sources: [onet("Farmers, Ranchers, and Other Agricultural Managers", "11-9013.00", "Occupational basis for crop and livestock planning, purchasing, record-keeping, labour and sales."), aiIndex2026, nist],
  },
];

export const COUNTRY_PRACTICAL_CONTEXTS: CountryPracticalContext[] = [
  {
    slug: "united-states",
    name: "United States",
    framing: "In the United States, implementation conditions vary by state and sector, so businesses need to identify the rules, contracts and professional duties that apply to each use case.",
    tierGuidance: {
      standard: "Start with approved tools, non-sensitive or minimized data, clear staff review and a written policy for acceptable use.",
      integrated: "Map data flows, permissions and vendor responsibilities before connecting AI to operational systems or customer records.",
      advanced: "Use narrow authority, testing, monitoring, audit logs, human approval and reliable fallback for agents or consequential decisions.",
    },
    industryNotes: {
      "law-firms": "Protect privilege and confidentiality, verify every authority and keep filings, advice and client commitments lawyer-controlled.",
      "accounting-firms": "Protect taxpayer and financial information, preserve work-paper evidence and keep professional conclusions and attest decisions with qualified staff.",
      "construction-contractors": "Treat site vision and predictive alerts as decision support; state safety rules, contracts and competent-person duties still govern field action.",
      restaurants: "Keep food-safety, allergy, wage-and-hour and customer remedies with trained people even when ordering or operations are AI-assisted.",
      "retail-stores": "Review state privacy, consumer-protection, pricing, employment and biometric requirements before personalization, fraud or vision uses.",
      "barbershops-salons": "Use consented client preferences sparingly and preserve a person for consultations, complaints and sensitive service questions.",
      "marketing-agencies": "Control claims, rights, endorsements, audience data and publication; synthetic content and targeting still carry advertiser and agency responsibility.",
      "healthcare-clinics": "Apply the relevant health-privacy, clinical, payer and medical-device requirements; clinicians remain responsible for patient care.",
      "tourism-hospitality": "Keep refund, accessibility, pricing-disclosure and guest-safety decisions with staff, and check state consumer-protection and privacy rules for guest data.",
      agriculture: "Check pesticide-label, food-safety and farm-labour rules locally, and confirm advice with extension services before acting.",
    },
    factors: [
      { title: "Rules vary by use", detail: "Identify applicable federal, state, sector and professional requirements rather than assuming one national rule covers every workflow." },
      { title: "Test before trust", detail: "Measure accuracy, bias, security and failure modes in the specific business context before expanding access or authority." },
      { title: "Keep authority bounded", detail: "Limit connected tools, data and actions; consequential outputs need review, challenge and an accountable owner." },
    ],
    sources: [{ title: "Artificial Intelligence Risk Management Framework", publisher: "National Institute of Standards and Technology", url: "https://www.nist.gov/itl/ai-risk-management-framework", note: "United States framework for governing, mapping, measuring and managing AI risk across sectors." }],
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    framing: "In the UK, workflows using personal data need a lawful, fair and transparent design, with extra care around consequential decisions.",
    tierGuidance: {
      standard: "Use approved tools, minimize personal data and keep a person responsible for checking content and decisions.",
      integrated: "Define lawful purpose, access, retention and vendor roles before AI reads from or writes to business systems.",
      advanced: "Complete proportionate impact assessment and testing, preserve meaningful review and tightly constrain agent permissions and actions.",
    },
    industryNotes: {
      "law-firms": "Preserve confidentiality and professional duties, verify legal sources and prevent autonomous advice, filing or client commitments.",
      "accounting-firms": "Protect client financial data and audit evidence; professional judgment, conclusions and sign-off remain with qualified people.",
      "construction-contractors": "Keep statutory safety and competent-person decisions human-led; validate project, image and workforce data before relying on alerts.",
      restaurants: "Use staff review for allergens, food safety, employment decisions and guest remedies even when voice ordering or forecasting is connected.",
      "retail-stores": "Assess profiling, worker monitoring, pricing and vision carefully, especially where automated outputs may significantly affect people.",
      "barbershops-salons": "Use consented appointment and preference data only for clear purposes; maintain human consultation and easy live handoff.",
      "marketing-agencies": "Respect UK data, advertising, rights and transparency duties across targeting, synthetic content and agent-assisted publication.",
      "healthcare-clinics": "Treat health information and clinical outputs as high impact; use validated systems, defined purpose and accountable clinical review.",
      "tourism-hospitality": "Apply UK consumer-rights, package-travel and data-protection rules to bookings and guest data, and keep refunds and complaints with staff.",
      agriculture: "Check plant-protection, animal-welfare and assurance-scheme requirements locally, and confirm advice with a qualified adviser.",
    },
    factors: [
      { title: "Establish a lawful basis", detail: "Define purpose, necessity and lawful processing before supplying personal data to an AI system." },
      { title: "Minimise and explain", detail: "Use only necessary data and be able to explain significant AI-assisted processes and decisions to affected people." },
      { title: "Assess higher-risk uses", detail: "Use impact assessment, meaningful human review and documented controls where rights or freedoms may be affected." },
    ],
    sources: [{ title: "Artificial intelligence and data protection", publisher: "Information Commissioner's Office", url: "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/", note: "UK regulator guidance for lawful, fair, transparent and accountable AI processing." }],
  },
  {
    slug: "canada",
    name: "Canada",
    framing: "In Canada, organizations need accountable handling of personal information under the federal or provincial privacy requirements that apply to them.",
    tierGuidance: {
      standard: "Begin with approved business tools, minimized data and human-reviewed language, document, voice or image assistance.",
      integrated: "Map federal or provincial privacy duties, consent, vendor handling, access and retention before connecting operational systems.",
      advanced: "Pilot agents and consequential models narrowly, with impact assessment, testing, auditability, human approval and a manual fallback.",
    },
    industryNotes: {
      "law-firms": "Protect privilege and confidentiality, verify Canadian authorities and keep advice, filings, deadlines and client commitments lawyer-controlled.",
      "accounting-firms": "Protect financial and taxpayer information, preserve traceable evidence and keep assurance, tax and advisory conclusions with qualified professionals.",
      "construction-contractors": "Account for provincial safety, building and contractual requirements; voice and vision can assist records but cannot replace competent field judgment.",
      restaurants: "Keep allergen, food-safety, employment and guest-remedy decisions with people; verify bilingual or locally adapted customer content where relevant.",
      "retail-stores": "Review provincial privacy, consumer, employment and language requirements before personalization, fraud triage, biometrics or dynamic pricing.",
      "barbershops-salons": "Use appointment and preference data with clear consent, avoid sensitive inference and keep a person available for consultations and complaints.",
      "marketing-agencies": "Apply privacy, commercial-message, advertising, language and intellectual-property controls to targeting and synthetic media workflows.",
      "healthcare-clinics": "Provincial health-information rules and Health Canada requirements can apply; clinical AI needs validated intended use and accountable clinician review.",
      "tourism-hospitality": "Apply federal and provincial consumer and privacy rules to bookings and guest data, and verify bilingual guest content where relevant.",
      agriculture: "Check provincial and federal rules on pesticides, animal health and food safety, and confirm advice with local extension services or a vet.",
    },
    factors: [
      { title: "Accountability follows the data", detail: "The organization remains responsible for personal information handled by AI providers and connected systems." },
      { title: "Purpose and consent matter", detail: "Define appropriate purposes, use meaningful consent where required and avoid secondary use that people would not reasonably expect." },
      { title: "Protect sensitive information", detail: "Health, financial, biometric and other sensitive data require stronger minimization, security and human oversight." },
    ],
    sources: [{ title: "Privacy and artificial intelligence", publisher: "Office of the Privacy Commissioner of Canada", url: "https://www.priv.gc.ca/en/privacy-topics/ai-technology-and-innovation/artificial-intelligence/", note: "Canadian privacy guidance for businesses using AI and generative AI." }],
  },
  {
    slug: "ghana",
    name: "Ghana",
    framing: "In Ghana, implementation should account for local language and data relevance, connectivity, staff skills and the country’s evolving AI governance framework.",
    tierGuidance: {
      standard: "Prioritize affordable mobile-friendly tools, local-language testing, small data loads and a clear manual way to continue when service is unavailable.",
      integrated: "Connect only dependable digital records and essential systems; minimize data, plan for intermittent connectivity and train a local owner for exceptions.",
      advanced: "Treat agents, continuous monitoring and high-impact models as controlled pilots until local data, infrastructure, skills and oversight are strong enough.",
    },
    industryNotes: {
      "law-firms": "Start with document, research and intake assistance that works on available records; protect client confidentiality and verify Ghanaian authorities and procedure locally.",
      "accounting-firms": "Prioritize document capture, reconciliation and client communication that can tolerate mixed paper and digital records; keep tax and assurance judgments professional-led.",
      "construction-contractors": "Voice notes, photo-supported reporting and document summaries may offer early value; preserve offline field processes and human safety supervision.",
      restaurants: "Focus on mobile customer communication, review summaries, schedules and practical stock reminders before data-intensive optimization across systems.",
      "retail-stores": "Product content, customer questions and simple stock support can start with modest infrastructure; advanced personalization requires reliable consented data and connectivity.",
      "barbershops-salons": "Mobile booking, reminders, voice support and local-language content are practical starting points; keep low-cost manual fallback and live customer handoff.",
      "marketing-agencies": "Multilingual text, image, audio and video production can be immediately useful; verify local cultural fit, rights, claims and the affordability of production tools.",
      "healthcare-clinics": "Administrative drafting and record summaries may help first, but patient data, connectivity, local validation and clinical accountability make connected or diagnostic uses more demanding.",
      "tourism-hospitality": "Start with fast replies to guest enquiries on messaging apps and booking sites, clear listings and review summaries; keep payments, refunds and guest safety with staff and plan for patchy connectivity.",
      agriculture: "Voice and photo tools on a basic smartphone are the practical starting point; test local-language support, check advice with an extension officer, and keep a manual record in case service is unavailable.",
    },
    factors: [
      { title: "Localize the system", detail: "Test language, examples, terminology and user experience for Ghanaian markets rather than assuming foreign defaults transfer cleanly." },
      { title: "Design for operating reality", detail: "Offer low-bandwidth fallbacks, clear manual continuation and workflows that do not collapse when cloud access is interrupted." },
      { title: "Build responsible local capacity", detail: "Pair adoption with staff training, data protection, fairness, transparency and locally accountable ownership." },
    ],
    sources: [
      { title: "Republic of Ghana National Artificial Intelligence Strategy 2025–2035", publisher: "Ministry of Communication, Digital Technology and Innovations", url: "https://moc.gov.gh/downloads/", note: "National direction for responsible, inclusive and locally grounded AI adoption." },
      { title: "Ghana Digital Economy Diagnostic", publisher: "World Bank Group", url: "https://documents1.worldbank.org/curated/en/523231597379719030/pdf/Ghana-Digital-Economy-Diagnostic-Stock-Taking-Report.pdf", note: "Context for connectivity, digital skills and business digitalization constraints." },
      { title: "Data Protection Impact Assessment guidance", publisher: "Ghana Data Protection Commission", url: "https://dataprotection.org.gh/wp-content/uploads/2025/07/DPC-DPIA.pdf", note: "Local guidance identifying AI and other new technology as a trigger for data-protection impact assessment." },
    ],
  },
];

export const getIndustryOutlook = (slug: string) => INDUSTRY_OUTLOOKS.find((outlook) => outlook.slug === slug);
export const getCountryPracticalContext = (slug: string) => COUNTRY_PRACTICAL_CONTEXTS.find(
  (context) => context.slug === slug && context.factors.length > 0 && context.sources.length > 0,
);
