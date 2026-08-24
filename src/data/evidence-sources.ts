import type { SourceReference } from "../types/common.js";

const accessedAt = "2026-08-23";

export const EVIDENCE_SOURCES = {
  onetLawyers: {
    sourceId: "source-onet-lawyers-2026",
    title: "23-1011.00 — Lawyers",
    publisher: "O*NET OnLine, National Center for O*NET Development / U.S. Department of Labor",
    url: "https://www.onetonline.org/link/details/23-1011.00",
    accessedAt,
  },
  onetParalegals: {
    sourceId: "source-onet-paralegals-2026",
    title: "23-2011.00 — Paralegals and Legal Assistants",
    publisher: "O*NET OnLine, National Center for O*NET Development / U.S. Department of Labor",
    url: "https://www.onetonline.org/link/summary/23-2011.00",
    accessedAt,
  },
  onetLegalAdmin: {
    sourceId: "source-onet-legal-admin-2026",
    title: "43-6012.00 — Legal Secretaries and Administrative Assistants",
    publisher: "O*NET OnLine, National Center for O*NET Development / U.S. Department of Labor",
    url: "https://www.onetonline.org/link/details/43-6012.00",
    accessedAt,
  },
  openAiApi: {
    sourceId: "source-openai-api-quickstart-2026-08",
    title: "OpenAI API developer quickstart",
    publisher: "OpenAI",
    url: "https://platform.openai.com/docs/quickstart",
    accessedAt,
  },
  openAiPricing: {
    sourceId: "source-openai-api-pricing-2026-08",
    title: "OpenAI API Pricing",
    publisher: "OpenAI",
    url: "https://openai.com/api/pricing/",
    accessedAt,
  },
  openAiVectorStores: {
    sourceId: "source-openai-vector-stores-2026-08",
    title: "Vector stores API reference",
    publisher: "OpenAI",
    url: "https://platform.openai.com/docs/api-reference/vector-stores",
    accessedAt,
  },
  openAiAudio: {
    sourceId: "source-openai-audio-2026-08",
    title: "Audio API reference",
    publisher: "OpenAI",
    url: "https://platform.openai.com/docs/api-reference/audio",
    accessedAt,
  },
  openAiBusinessData: {
    sourceId: "source-openai-business-data-2026-08",
    title: "Business data privacy, security, and compliance",
    publisher: "OpenAI",
    url: "https://openai.com/business-data/",
    accessedAt,
  },
  nistGenAi: {
    sourceId: "source-nist-ai-600-1",
    title: "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile",
    publisher: "National Institute of Standards and Technology",
    url: "https://doi.org/10.6028/NIST.AI.600-1",
    publicationDate: "2024-07-26",
    accessedAt,
  },
  abaOpinion512: {
    sourceId: "source-aba-formal-opinion-512",
    title: "Formal Opinion 512 — Generative Artificial Intelligence Tools",
    publisher: "American Bar Association Standing Committee on Ethics and Professional Responsibility",
    url: "https://www.americanbar.org/content/dam/aba/administrative/professional_responsibility/ethics-opinions/aba-formal-opinion-512.pdf",
    publicationDate: "2024-07-29",
    accessedAt,
  },
  legalResearchReliability: {
    sourceId: "source-magesh-legal-rag-hallucinations-2024",
    title: "Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools",
    publisher: "Stanford RegLab research authors",
    url: "https://arxiv.org/abs/2405.20362",
    publicationDate: "2024-05-31",
    accessedAt,
  },
} as const satisfies Record<string, SourceReference>;
