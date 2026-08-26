export interface CountryAdoptionSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publicationDate: string;
  methodology: string;
}

export interface CountrySectorAdoptionObservation {
  id: string;
  countryId: string;
  sourceId: string;
  sectorLabel: string;
  value: number;
  measuredConcept: string;
  period: string;
  mappedIndustrySlugs: string[];
  mappingNote: string;
  evidenceGrade: "A" | "B";
  confidence: "High" | "Medium";
  comparison: ActualComparisonMapping;
  derivation?: string;
}

export const COUNTRY_ADOPTION_SOURCES: CountryAdoptionSource[] = [
  {
    id: "source-us-census-btos-sector-2026-16",
    title: "Business Trends and Outlook Survey — Sector Estimates",
    publisher: "United States Census Bureau",
    url: "https://www.census.gov/hfp/btos/data_downloads",
    publicationDate: "2026-08-13",
    methodology: "Biweekly, nationally representative firm survey across United States nonfarm sectors. The published sector table asks whether the business used AI in any business function in the previous two weeks.",
  },
  {
    id: "source-uk-ons-bics-wave-147",
    title: "Business Insights and Conditions Survey — Wave 147",
    publisher: "Office for National Statistics",
    url: "https://www.ons.gov.uk/economy/economicoutputandproductivity/output/datasets/businessinsightsandimpactontheukeconomy/bicswave147",
    publicationDate: "2026-01-08",
    methodology: "Weighted estimates from the voluntary UK Business Insights and Conditions Survey. The AI table covers businesses not permanently stopped trading and asks which AI technologies they currently use.",
  },
  {
    id: "source-ca-statcan-csbc-2025-q2",
    title: "Use of artificial intelligence by businesses and organizations, second quarter of 2025",
    publisher: "Statistics Canada",
    url: "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3310100401",
    publicationDate: "2025-05-27",
    methodology: "Canadian Survey on Business Conditions stratified random sample of establishments with employees. Results use calibrated weights; 9,103 businesses or organizations responded from a sample of 21,357.",
  },
  {
    id: "source-gh-world-bank-fat-2021",
    title: "Ghana — Firm Adoption of Technology Survey, 2021",
    publisher: "World Bank Group",
    url: "https://microdata.worldbank.org/catalog/8229",
    publicationDate: "2026-03-05",
    methodology: "Nationally representative 2021 survey of formal private-sector establishments with at least five employees, stratified by region, firm size and sector. It measures granular technologies but does not provide a current, directly comparable generic AI-use rate for every AIBI industry.",
  },
];

const mappings = {
  professional: {
    slugs: ["law-firms", "accounting-firms", "marketing-agencies"],
    note: "Broader than the selected industry: this sector also contains other professional, scientific and technical services.",
  },
  construction: {
    slugs: ["construction-contractors"],
    note: "Broad construction-sector evidence; it includes contractor types beyond the representative AIBI archetype.",
  },
  restaurants: {
    slugs: ["restaurants"],
    note: "Accommodation and food services is broader than restaurants and includes accommodation businesses.",
  },
  retail: {
    slugs: ["retail-stores"],
    note: "Broad retail-sector evidence; it is not limited to the representative store archetype.",
  },
  personalServices: {
    slugs: ["barbershops-salons"],
    note: "Other services is broader than barbershops and salons and should be treated as a sector proxy.",
  },
  healthcare: {
    slugs: ["healthcare-clinics"],
    note: "Health care and social assistance is broader than outpatient clinics and includes other care organizations.",
  },
};

type ObservationSeed = Omit<CountrySectorAdoptionObservation, "id" | "countryId" | "sourceId" | "measuredConcept" | "evidenceGrade" | "confidence" | "comparison">;

const makeObservations = (
  countryId: string,
  sourceId: string,
  metric: string,
  evidenceGrade: "A" | "B",
  confidence: "High" | "Medium",
  seeds: ObservationSeed[],
): CountrySectorAdoptionObservation[] => seeds.map((seed, index) => ({
  ...seed,
  id: `country-adoption-${countryId}-${index + 1}`,
  countryId,
  sourceId,
  measuredConcept: metric,
  evidenceGrade,
  confidence,
  comparison: {
    businessFunctionId: null,
    taskId: null,
    utilizationDepth: null,
    evidenceRelation: "proxy",
    geography: { level: "country", geographyId: countryId, label: countryId },
    evidenceConfidence: {
      level: confidence.toLowerCase() as "high" | "medium",
      rationale: "Confidence applies to the published broad-sector estimate, not to a task-level industry estimate.",
    },
    estimateBasis: "observed",
    measure: "broad_adoption_prevalence",
    normalizedScaleId: null,
    mappingRationale: "The source reports broad sector prevalence and no business-function, task, or utilization-depth breakdown; the industry link is proxy context only.",
  },
}));

export const COUNTRY_SECTOR_ADOPTION_OBSERVATIONS: CountrySectorAdoptionObservation[] = [
  ...makeObservations(
    "country-us",
    "source-us-census-btos-sector-2026-16",
    "Businesses reporting AI use in any business function during the previous two weeks",
    "A",
    "High",
    [
      { sectorLabel: "Professional, scientific and technical services (NAICS 54)", value: 39.3, period: "2026-07-13 to 2026-07-26", mappedIndustrySlugs: mappings.professional.slugs, mappingNote: mappings.professional.note },
      { sectorLabel: "Construction (NAICS 23)", value: 14.9, period: "2026-07-13 to 2026-07-26", mappedIndustrySlugs: mappings.construction.slugs, mappingNote: mappings.construction.note },
      { sectorLabel: "Accommodation and food services (NAICS 72)", value: 8.3, period: "2026-07-13 to 2026-07-26", mappedIndustrySlugs: mappings.restaurants.slugs, mappingNote: mappings.restaurants.note },
      { sectorLabel: "Retail trade (NAICS 44–45)", value: 15.5, period: "2026-07-13 to 2026-07-26", mappedIndustrySlugs: mappings.retail.slugs, mappingNote: mappings.retail.note },
      { sectorLabel: "Other services (NAICS 81)", value: 11.3, period: "2026-07-13 to 2026-07-26", mappedIndustrySlugs: mappings.personalServices.slugs, mappingNote: mappings.personalServices.note },
      { sectorLabel: "Health care and social assistance (NAICS 62)", value: 23.5, period: "2026-07-13 to 2026-07-26", mappedIndustrySlugs: mappings.healthcare.slugs, mappingNote: mappings.healthcare.note },
    ],
  ),
  ...makeObservations(
    "country-gb",
    "source-uk-ons-bics-wave-147",
    "Businesses currently using at least one listed AI technology",
    "B",
    "Medium",
    [
      { sectorLabel: "Professional, scientific and technical activities", value: 42.1, period: "2025-12-15 to 2025-12-28", mappedIndustrySlugs: mappings.professional.slugs, mappingNote: mappings.professional.note, derivation: "Official weighted response table: 100% minus 52.2% not using AI and 5.7% not sure." },
      { sectorLabel: "Construction", value: 14.7, period: "2025-12-15 to 2025-12-28", mappedIndustrySlugs: mappings.construction.slugs, mappingNote: mappings.construction.note, derivation: "Official weighted response table: 100% minus 80.6% not using AI and 4.7% not sure." },
      { sectorLabel: "Accommodation and food service activities", value: 8.1, period: "2025-12-15 to 2025-12-28", mappedIndustrySlugs: mappings.restaurants.slugs, mappingNote: mappings.restaurants.note, derivation: "Official weighted response table: 100% minus 86.9% not using AI and 5.0% not sure." },
      { sectorLabel: "Wholesale and retail trade; repair of motor vehicles", value: 18.3, period: "2025-12-15 to 2025-12-28", mappedIndustrySlugs: mappings.retail.slugs, mappingNote: mappings.retail.note, derivation: "Official weighted response table: 100% minus 71.1% not using AI and 10.6% not sure." },
      { sectorLabel: "Other service activities", value: 11.6, period: "2025-12-15 to 2025-12-28", mappedIndustrySlugs: mappings.personalServices.slugs, mappingNote: mappings.personalServices.note, derivation: "Official weighted response table: 100% minus 73.0% not using AI and 15.4% not sure." },
      { sectorLabel: "Human health and social work activities", value: 34.4, period: "2025-12-15 to 2025-12-28", mappedIndustrySlugs: mappings.healthcare.slugs, mappingNote: mappings.healthcare.note, derivation: "Official weighted response table: 100% minus 57.8% not using AI and 7.8% not sure." },
    ],
  ),
  ...makeObservations(
    "country-ca",
    "source-ca-statcan-csbc-2025-q2",
    "Businesses or organizations using AI to produce goods or deliver services during the previous 12 months",
    "A",
    "High",
    [
      { sectorLabel: "Professional, scientific and technical services (NAICS 54)", value: 31.7, period: "2024-04-01 to 2025-05-05", mappedIndustrySlugs: mappings.professional.slugs, mappingNote: mappings.professional.note },
      { sectorLabel: "Construction (NAICS 23)", value: 3.6, period: "2024-04-01 to 2025-05-05", mappedIndustrySlugs: mappings.construction.slugs, mappingNote: mappings.construction.note },
      { sectorLabel: "Accommodation and food services (NAICS 72)", value: 1.5, period: "2024-04-01 to 2025-05-05", mappedIndustrySlugs: mappings.restaurants.slugs, mappingNote: mappings.restaurants.note },
      { sectorLabel: "Retail trade (NAICS 44–45)", value: 6.6, period: "2024-04-01 to 2025-05-05", mappedIndustrySlugs: mappings.retail.slugs, mappingNote: mappings.retail.note },
      { sectorLabel: "Other services except public administration (NAICS 81)", value: 7.3, period: "2024-04-01 to 2025-05-05", mappedIndustrySlugs: mappings.personalServices.slugs, mappingNote: mappings.personalServices.note },
      { sectorLabel: "Health care and social assistance (NAICS 62)", value: 17.4, period: "2024-04-01 to 2025-05-05", mappedIndustrySlugs: mappings.healthcare.slugs, mappingNote: mappings.healthcare.note },
    ],
  ),
];

export const GHANA_EVIDENCE_NOTE = "No recent national source was found that reports a comparable current AI-use rate for the planned AIBI industries. The World Bank's nationally representative 2021 Firm Adoption of Technology survey is retained as reviewed context, but it is not presented as a current adoption percentage.";
import type { ActualComparisonMapping } from "../types/scoring.js";
