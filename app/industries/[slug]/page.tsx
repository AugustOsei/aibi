import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdoptionHeadroomPanel } from "../../../components/adoption-headroom-panel";
import { CountryPracticalLens, IndustryCapabilityOutlook } from "../../../components/industry-capability-outlook";
import { FunctionBreakdown } from "../../../components/function-breakdown";
import { IndustryAtlasHero } from "../../../components/industry-atlas-hero";
import { ResearchDrawer } from "../../../components/research-drawer";
import {
  getIndustrySummaries,
  getIndustrySummary,
  getIndustryAdoptionHeadroom,
  getLawFirmIndustryView,
  getCountrySummary,
} from "../../../src/application/aibi-service";
import { getCountryPracticalContext, getIndustryOutlook } from "../../../src/data/industry-outlooks";
import { createPageMetadata } from "../../../src/config/site";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ country?: string }>;
};

export function generateStaticParams() {
  return getIndustrySummaries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustrySummary(slug);
  if (!industry) return createPageMetadata({
    title: "Industry AI Outlook",
    description: "Explore possible AI utilization and observed adoption evidence by industry.",
    path: `/industries/${slug}`,
  });
  return createPageMetadata({
    title: `${industry.name} AI Opportunity vs Adoption`,
    description: `See what today’s AI could practically be used for in ${industry.name.toLowerCase()}, then review credible observed utilization and the evidence gap.`,
    path: `/industries/${industry.slug}`,
  });
}

function DevelopmentState({
  slug,
  countrySlug,
}: {
  slug: string;
  countrySlug?: string | undefined;
}) {
  const industry = getIndustrySummary(slug);
  if (!industry) notFound();
  const outlook = getIndustryOutlook(slug);
  if (!outlook) notFound();
  const countryContext = countrySlug ? getCountryPracticalContext(countrySlug) : undefined;
  const selectedCountry = countrySlug ? getCountrySummary(countrySlug) : undefined;
  return (
    <>
      <IndustryAtlasHero
        name={industry.name}
        description={outlook.framing}
        archetype={outlook.archetype}
        countryName={selectedCountry?.name}
        countryCode={selectedCountry?.iso2}
      />
      <div className="shell industry-content">
        <IndustryCapabilityOutlook outlook={outlook} countryContext={countryContext} />
        <AdoptionHeadroomPanel view={getIndustryAdoptionHeadroom(slug, countrySlug)} />
        {countryContext ? <CountryPracticalLens context={countryContext} industryName={industry.name} /> : null}
      </div>
    </>
  );
}

export default async function IndustryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { country: countrySlug } = await searchParams;
  if (slug !== "law-firms") return <DevelopmentState slug={slug} countrySlug={countrySlug} />;
  const view = getLawFirmIndustryView();
  const outlook = getIndustryOutlook(slug);
  if (!outlook) notFound();
  const countryContext = countrySlug ? getCountryPracticalContext(countrySlug) : undefined;
  const selectedCountry = countrySlug ? getCountrySummary(countrySlug) : undefined;
  return (
    <>
      <IndustryAtlasHero
        name={view.name}
        description="AI in a law firm can mean something as simple as helping organize files or prepare client intake, or something much deeper, like connecting AI to firm systems or assisting with complex legal research. We’ve mapped those possibilities from easier-to-adopt uses through more integrated and advanced ones. Further down, you can compare the Standard AI destination with the closest available reported adoption rate for the selected country."
        archetype={view.archetypeName}
        countryName={selectedCountry?.name}
        countryCode={selectedCountry?.iso2}
        evaluationLabel={`${view.possible.effectiveDate} · Baseline v${view.possible.version}`}
      />
      <div className="shell industry-content">
        <IndustryCapabilityOutlook outlook={outlook} countryContext={countryContext} />
        <AdoptionHeadroomPanel view={getIndustryAdoptionHeadroom(slug, countrySlug)} />
        {countryContext ? <CountryPracticalLens context={countryContext} industryName={view.name} /> : null}
        <ResearchDrawer label="See experimental scoring and methodology">
          <div className="score-explainer">
            <p className="eyebrow">About the experimental index</p>
            <h2>52.3 is an experimental summary index—not adoption or automation.</h2>
            <p>It combines task importance with current AI capability, reliability, integration, risk and human-oversight constraints for a representative law firm. It does not mean 52.3% of legal work can be automated, it is not country-specific, and it is not used as the observed-utilization measure. <Link href="/methodology">Read the methodology →</Link></p>
          </div>
          <FunctionBreakdown functions={view.functions} />
        </ResearchDrawer>
      </div>
    </>
  );
}
