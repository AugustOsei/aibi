export type OutlookTierId = "standard" | "integrated" | "advanced";

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
  factors: Array<{ title: string; detail: string }>;
  sources: IndustryOutlookSource[];
}

const tier = (id: OutlookTierId, useCases: Array<[string, string, string]>): IndustryOutlookTier => ({
  id,
  title: id === "standard" ? "Standard AI" : id === "integrated" ? "Integrated AI" : "Advanced & human-led AI",
  description: id === "standard"
    ? "Accessible assistance using mainstream tools, approved information and bounded workflows."
    : id === "integrated"
      ? "Connected workflows that depend on clean operational data, system access, controls and staff adoption."
      : "Higher-complexity analysis and automation where people retain judgment, approval and accountability.",
  useCases: useCases.map(([title, outcome, humanBoundary], index) => ({
    id: `${id}-${index + 1}`,
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

export const INDUSTRY_OUTLOOKS: IndustryOutlook[] = [
  {
    slug: "accounting-firms",
    name: "Accounting Firms",
    framing: "Use AI to reduce document handling and reconciliation work, strengthen exception detection, and give professionals more time for interpretation and advice.",
    archetype: "Small or medium accounting, bookkeeping, tax and advisory practice",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["Extract invoices, receipts and statements", "Turn supplied documents into structured draft entries and review queues.", "A person verifies amounts, accounts, tax treatment and source completeness."],
        ["Prepare reconciliation suggestions", "Match transactions and flag unmatched, duplicate or unusual items.", "A practitioner resolves exceptions and approves adjustments."],
        ["Draft client requests and explanations", "Prepare missing-information lists, routine emails and plain-language summaries.", "A professional checks accuracy, confidentiality and advice."],
        ["Build tax and close checklists", "Create engagement-specific working checklists from approved templates and known requirements.", "Qualified staff confirm jurisdiction, deadlines and applicability."],
      ]),
      tier("integrated", [
        ["Continuous close workflow", "Connect ledgers, document stores and task systems to prepare entries, evidence and exception queues throughout the month.", "Staff approve postings and control access to financial systems."],
        ["Audit-evidence triage", "Classify evidence, link it to procedures and surface gaps or contradictions for review.", "Auditors determine sufficiency, reliability and conclusions."],
        ["Cash-flow and variance analysis", "Explain movements, test assumptions and prepare scenario-ready management reporting.", "Professionals validate source data and communicate uncertainty."],
        ["Search firm methods and prior work", "Retrieve approved policies, templates and precedent work with source links.", "Practitioners confirm currency and engagement fit."],
      ]),
      tier("advanced", [
        ["Continuous controls monitoring", "Monitor transaction and control signals for emerging exceptions or breakdowns.", "Humans investigate alerts and own control conclusions."],
        ["Advisory scenario simulation", "Model operational, financing and tax scenarios from controlled assumptions.", "Advisers choose assumptions and own recommendations."],
        ["Complex research synthesis", "Build source-linked working analyses across accounting, tax and regulatory material.", "Qualified professionals verify authorities and final positions."],
        ["Engagement-quality challenge", "Challenge a working file for unsupported claims, inconsistent evidence and missed review steps.", "AI cannot issue an audit opinion or professional sign-off."],
      ]),
    ],
    sources: [onet("Accountants and Auditors", "13-2011.00", "Occupational basis for financial reporting, reconciliation, audit, tax, controls and advisory work."), nist],
  },
  {
    slug: "construction-contractors",
    name: "Construction Contractors",
    framing: "Use AI to make project information easier to act on—from estimates and daily records to schedule, procurement and site-risk signals.",
    archetype: "General or specialty contractor coordinating office and field operations",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["Summarize plans, specifications and addenda", "Extract scope, exclusions, materials and questions into a bid-review checklist.", "Estimators verify drawings, quantities and contractual meaning."],
        ["Draft RFIs, submittals and change records", "Prepare structured drafts from project correspondence and field notes.", "Project staff approve every contractual communication."],
        ["Turn field notes into daily reports", "Organize voice notes, photos and logs into consistent progress records.", "Supervisors confirm events, labour, conditions and incidents."],
        ["Prepare toolbox talks and safety paperwork", "Adapt approved safety material to the planned activity and site context.", "Competent site personnel determine hazards and controls."],
      ]),
      tier("integrated", [
        ["Schedule-risk detection", "Connect schedule, progress and issue data to flag slippage and dependency risks.", "Project leaders decide recovery actions and commitments."],
        ["Progress-image comparison", "Compare approved site imagery with plans or prior periods to route possible deviations.", "Qualified people inspect and determine compliance."],
        ["Procurement and lead-time alerts", "Link material schedules, purchase orders and supplier updates to forecast shortages.", "Buyers approve substitutions, orders and supplier action."],
        ["Change-order workflow", "Assemble notices, supporting records, cost inputs and status across connected systems.", "Commercial staff validate entitlement, pricing and submission."],
      ]),
      tier("advanced", [
        ["Alternative schedule generation", "Generate and compare feasible sequencing options under labour, equipment and access constraints.", "Construction leadership selects and validates the plan."],
        ["Predictive project controls", "Combine cost, schedule, production and risk signals to forecast likely outcomes.", "Forecasts support—not replace—professional judgment."],
        ["Site vision for quality and safety", "Route potential PPE, access, housekeeping or installation exceptions from imagery.", "AI is not a safety officer; humans verify and intervene."],
        ["Bid and portfolio simulation", "Test capacity, margin, risk and cash scenarios across prospective work.", "Executives own bid decisions and commercial assumptions."],
      ]),
    ],
    sources: [onet("Construction Managers", "11-9021.00", "Occupational basis for estimating, scheduling, budgeting, procurement, compliance and field coordination."), nist],
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    framing: "Use AI to improve demand planning, purchasing, staffing and guest communication while keeping food safety and hospitality firmly human-led.",
    archetype: "Independent or small multi-location food-service operation",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["Draft menus and guest communications", "Prepare descriptions, translations, FAQs and promotion drafts from approved facts.", "Staff verify allergens, prices, claims and cultural fit."],
        ["Summarize reviews and feedback", "Group recurring guest themes and route urgent service issues.", "Managers investigate context before acting."],
        ["Prepare staff schedules", "Draft shifts from availability, expected demand and defined labour rules.", "Managers approve fairness, coverage and legal compliance."],
        ["Create prep and inventory reminders", "Turn recipes, pars and known bookings into working prep or count lists.", "Kitchen staff confirm quantities, freshness and substitutions."],
      ]),
      tier("integrated", [
        ["Demand and prep forecasting", "Combine sales, reservations, weather and event history to forecast covers and item demand.", "Operators adjust for local knowledge and unusual events."],
        ["Waste and variance analysis", "Connect purchasing, recipes, counts and sales to identify likely waste or portion issues.", "Managers validate data and operational causes."],
        ["Purchasing recommendations", "Suggest replenishment quantities using forecasts, stock and supplier constraints.", "A person approves orders, substitutions and cash commitments."],
        ["Guest-recovery workflow", "Identify service failures and prepare policy-bounded recovery options for staff.", "People decide compensation and handle sensitive conversations."],
      ]),
      tier("advanced", [
        ["Menu and margin simulation", "Test price, recipe, demand and capacity changes before altering the menu.", "Operators own assumptions and guest-value decisions."],
        ["Kitchen vision assistance", "Detect possible queue, presentation or process exceptions from approved camera feeds.", "Food safety decisions require trained human verification."],
        ["Multi-location optimization", "Coordinate forecasts, labour, inventory and promotions across sites.", "Regional leaders approve transfers and operating changes."],
        ["Voice ordering with escalation", "Handle bounded orders and questions across phone or drive-through channels.", "Ambiguous, allergy-related or upset-customer interactions escalate to staff."],
      ]),
    ],
    sources: [onet("Food Service Managers", "11-9051.00", "Occupational basis for food-service operations, staffing, inventory, guest service and compliance."), nist],
  },
  {
    slug: "retail-stores",
    name: "Retail Stores",
    framing: "Use AI to improve merchandising, inventory decisions and customer service without losing control of pricing, fairness or the in-store experience.",
    archetype: "Independent or small multi-location consumer retail business",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["Create product content", "Draft descriptions, comparisons, translations and staff product briefs from approved specifications.", "Staff verify claims, price and availability."],
        ["Answer routine product questions", "Retrieve policy and catalog information for web or staff-assisted responses.", "Complex, safety-sensitive or complaint cases escalate."],
        ["Summarize reviews and returns", "Group recurring product, service and fit issues for buyers and managers.", "People validate causes before changing assortment."],
        ["Prepare shift and task plans", "Draft coverage and daily task lists from traffic patterns and availability.", "Managers approve labour rules, fairness and priorities."],
      ]),
      tier("integrated", [
        ["Demand and replenishment forecasting", "Connect sales, stock, promotions and lead times to suggest reorder quantities.", "Buyers approve orders and account for local events."],
        ["Assisted recommendations", "Use consented customer and product signals to rank useful options.", "Controls prevent sensitive inference, manipulation and unfair treatment."],
        ["Returns and fraud triage", "Route unusual return patterns or transaction exceptions for review.", "AI does not accuse customers or make final adverse decisions."],
        ["Campaign-to-inventory coordination", "Align promotion drafts and audiences with available stock, margin and fulfilment capacity.", "Teams approve audience, offer and channel execution."],
      ]),
      tier("advanced", [
        ["Store-vision assistance", "Detect shelf gaps, queue build-up or possible merchandising exceptions from approved feeds.", "People verify conditions; biometric identification is out of scope by default."],
        ["Pricing and assortment simulation", "Test price, promotion and assortment options against demand and margin scenarios.", "Merchants own pricing, fairness and brand decisions."],
        ["Supply-network exception agents", "Monitor suppliers, orders and fulfilment, then prepare bounded recovery actions.", "Material commitments require human approval."],
        ["Controlled merchandising experiments", "Generate variants and evaluate measured outcomes within predefined guardrails.", "Humans set hypotheses, exclusions and stopping rules."],
      ]),
    ],
    sources: [onet("First-Line Supervisors of Retail Sales Workers", "41-1011.00", "Occupational basis for merchandising, inventory, staffing, service and store operations."), nist],
  },
  {
    slug: "barbershops-salons",
    name: "Barbershops & Salons",
    framing: "Use AI around the appointment and client relationship—booking, follow-up, demand and stock—while the service itself stays personal and skilled.",
    archetype: "Independent barbershop, salon or small personal-care studio",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["Handle booking questions and reminders", "Answer routine availability, policy and preparation questions across approved channels.", "Unusual requests and complaints reach a person."],
        ["Summarize consultation notes", "Turn consented notes into a concise service history and preference checklist.", "The professional confirms accuracy directly with the client."],
        ["Draft follow-up and rebooking messages", "Prepare personalized aftercare and reminder drafts from approved templates.", "Staff verify advice, timing and consent."],
        ["Create local marketing content", "Draft posts, offers and service explanations in the business’s voice.", "Owners approve claims, imagery and promotions."],
      ]),
      tier("integrated", [
        ["Demand-aware scheduling", "Use appointment history, service duration and availability to reduce gaps and overrun risk.", "Managers control buffers, fairness and staff workload."],
        ["Product and supply planning", "Link appointments, service mix and stock to suggest replenishment.", "Staff verify product suitability and approve purchases."],
        ["Client-retention workflow", "Identify consented rebooking opportunities and prepare non-intrusive outreach.", "No sensitive profiling; staff control contact and offers."],
        ["Service-performance insights", "Summarize timing, rebooking and feedback patterns by service without ranking people unfairly.", "Owners interpret context and discuss performance humanely."],
      ]),
      tier("advanced", [
        ["Visual consultation mock-ups", "Generate clearly labelled style previews to support a conversation about options.", "A preview is not a promise; the professional assesses feasibility."],
        ["Voice receptionist with handoff", "Manage routine calls, bookings and changes while preserving a live escalation path.", "Sensitive or ambiguous interactions transfer to staff."],
        ["Multi-location capacity planning", "Coordinate staffing, demand, service mix and stock across locations.", "Leaders approve staffing and customer-impacting changes."],
        ["Consent-aware personalization", "Recommend services or content using declared preferences and service history.", "Avoid health inference and protected or highly sensitive traits."],
      ]),
    ],
    sources: [onet("Hairdressers, Hairstylists, and Cosmetologists", "39-5012.00", "Occupational basis for consultation, appointments, product use, client service and salon operations."), nist],
  },
  {
    slug: "marketing-agencies",
    name: "Marketing Agencies",
    framing: "Use AI to multiply research and production capacity, then connect it to measurement and controlled campaign operations without outsourcing strategy or truth.",
    archetype: "Small or medium strategy, creative, media and analytics agency",
    maturityLabel: "Qualitative capability outlook · scoring research in progress",
    tiers: [
      tier("standard", [
        ["Develop brief and concept options", "Generate structured territories, questions and early concepts from a client brief.", "Strategists select the direction and challenge assumptions."],
        ["Produce channel variants", "Adapt approved copy and creative concepts across formats, lengths and audiences.", "Humans protect the idea, claims and brand voice."],
        ["Summarize research and reporting", "Synthesize supplied sources, campaign results and meeting material with citations.", "Analysts verify data, attribution and conclusions."],
        ["Prepare proposals and status updates", "Draft scopes, timelines, recaps and next steps from approved information.", "Account teams approve commitments and commercial terms."],
      ]),
      tier("integrated", [
        ["Campaign operations workflow", "Connect briefs, assets, approvals, trafficking and reporting across systems.", "Humans approve publication, spend and audience settings."],
        ["Privacy-aware audience analysis", "Find patterns in consented first-party and campaign data without exposing identities.", "Teams enforce consent, minimization and prohibited-use rules."],
        ["Media optimization assistance", "Forecast delivery and recommend bounded budget or bid changes from live performance.", "Media owners approve material spend changes."],
        ["Brand knowledge system", "Retrieve approved claims, voice, visual rules and prior decisions during production.", "Brand owners resolve conflicts and exceptions."],
      ]),
      tier("advanced", [
        ["Synthetic concept testing", "Use simulated reactions to expose questions and hypotheses before real research.", "Synthetic responses are not evidence of real customer preference."],
        ["Marketing-mix scenario modelling", "Compare spend and outcome scenarios with explicit assumptions and uncertainty.", "Analysts validate the model and avoid causal overclaiming."],
        ["Guardrailed campaign agents", "Monitor, diagnose and prepare predefined actions across channels.", "Publication, targeting and material spend remain approval-gated."],
        ["Multimodal production systems", "Coordinate text, image, audio and video variants through brand and rights controls.", "Humans approve originality, rights, disclosure and final craft."],
      ]),
    ],
    sources: [onet("Marketing Managers", "11-2021.00", "Occupational basis for research, strategy, pricing, promotion, media and performance analysis."), nist],
  },
  {
    slug: "healthcare-clinics",
    name: "Healthcare Clinics",
    framing: "Use AI first to reduce administrative burden and improve information flow; clinical uses require validated tools, clear scope and accountable professionals.",
    archetype: "Outpatient clinic with clinicians, medical assistants and administrative staff",
    maturityLabel: "Qualitative capability outlook · clinical scoring requires additional validation",
    tiers: [
      tier("standard", [
        ["Draft visit documentation", "Turn consented encounter audio or notes into a structured draft for the record.", "The clinician verifies every clinical fact and signs the note."],
        ["Prepare patient communications", "Draft reminders, instructions and plain-language education from approved material.", "Clinical staff verify suitability and escalation advice."],
        ["Summarize incoming records", "Organize supplied histories, results and correspondence into a source-linked review aid.", "Clinicians confirm relevance, accuracy and omissions."],
        ["Support scheduling and intake", "Collect bounded intake fields, answer routine policy questions and route urgency signals.", "AI does not diagnose; urgent or ambiguous cases escalate."],
      ]),
      tier("integrated", [
        ["Referral and results workflow", "Connect documents, queues and task systems to classify, route and track follow-up.", "Clinical teams own prioritization and closure."],
        ["Coding and authorization assistance", "Prepare suggested codes, evidence packets and payer forms from the verified record.", "Qualified staff validate codes and representations."],
        ["Capacity and no-show forecasting", "Forecast appointment demand and likely gaps to improve access and staffing.", "Managers prevent discriminatory or punitive use."],
        ["Population-care worklists", "Identify patients potentially due for approved follow-up using defined clinical rules.", "Clinicians review eligibility and patient context."],
      ]),
      tier("advanced", [
        ["Validated clinical decision support", "Present patient-specific risk or diagnostic support within an approved intended use.", "A licensed clinician remains responsible for diagnosis and treatment."],
        ["Imaging or signal triage", "Use regulated or locally approved systems to prioritize possible abnormalities for review.", "AI output cannot substitute for qualified interpretation."],
        ["Remote-monitoring exception detection", "Route concerning changes from approved devices and patient-reported data.", "Clinical protocols define response, escalation and limitations."],
        ["Care-plan scenario support", "Compare guideline-linked options, interactions and patient constraints for discussion.", "Clinician and patient make the final care decision."],
      ]),
    ],
    sources: [
      onet("Medical and Health Services Managers", "11-9111.00", "Occupational basis for clinic operations, records, compliance, staffing and service coordination."),
      {
        title: "Ethics and governance of artificial intelligence for health",
        publisher: "World Health Organization",
        url: "https://www.who.int/publications/i/item/9789240029200",
        note: "Health-specific basis for human autonomy, safety, transparency, accountability and equity boundaries.",
      },
      nist,
    ],
  },
];

export const COUNTRY_PRACTICAL_CONTEXTS: CountryPracticalContext[] = [
  {
    slug: "united-states",
    name: "United States",
    framing: "The technical use cases remain available, but deployment should be governed by sector rules, state law and a documented risk process.",
    factors: [
      { title: "Govern by use case", detail: "Apply the NIST Govern, Map, Measure and Manage functions proportionately to the impact of each workflow." },
      { title: "Keep sector obligations", detail: "Professional, health, employment, consumer and privacy duties still apply when AI assists the work." },
      { title: "Test before scale", detail: "Evaluate accuracy, harmful bias, security, privacy and human fallback using representative local inputs." },
    ],
    sources: [{ ...nist, title: "Artificial Intelligence Risk Management Framework (AI RMF 1.0)", url: "https://doi.org/10.6028/NIST.AI.100-1" }],
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    framing: "AI workflows using personal data need a lawful, fair and transparent design under the UK data-protection regime, with extra care around consequential decisions.",
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
    framing: "The opportunity set is similar, but organizations need accountable handling of personal information under applicable federal and provincial privacy requirements.",
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
    framing: "The same AI capabilities can be useful, but practical deployment should prioritize local relevance, connectivity-aware workflows, skills and Ghana's evolving governance framework.",
    factors: [
      { title: "Localize the system", detail: "Test language, examples, terminology and user experience for Ghanaian markets rather than assuming foreign defaults transfer cleanly." },
      { title: "Design for operating reality", detail: "Offer low-bandwidth fallbacks, clear manual continuation and workflows that do not collapse when cloud access is interrupted." },
      { title: "Build responsible local capacity", detail: "Pair adoption with staff training, data protection, fairness, transparency and locally accountable ownership." },
    ],
    sources: [
      { title: "Republic of Ghana National Artificial Intelligence Strategy 2025–2035", publisher: "Ministry of Communication, Digital Technology and Innovations", url: "https://moc.gov.gh/downloads/", note: "National direction for responsible, inclusive and locally grounded AI adoption." },
      { title: "Ghana Digital Economy Diagnostic", publisher: "World Bank Group", url: "https://documents1.worldbank.org/curated/en/523231597379719030/pdf/Ghana-Digital-Economy-Diagnostic-Stock-Taking-Report.pdf", note: "Context for connectivity, digital skills and business digitalization constraints." },
    ],
  },
];

export const getIndustryOutlook = (slug: string) => INDUSTRY_OUTLOOKS.find((outlook) => outlook.slug === slug);
export const getCountryPracticalContext = (slug: string) => COUNTRY_PRACTICAL_CONTEXTS.find((context) => context.slug === slug);
