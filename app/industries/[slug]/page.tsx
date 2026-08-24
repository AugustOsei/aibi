import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdoptionEvidencePanel } from "../../../components/adoption-evidence-panel";
import { ComparisonPanel } from "../../../components/comparison-panel";
import { CountryEvidencePanel } from "../../../components/country-evidence-panel";
import { CountryPracticalLens, IndustryCapabilityOutlook } from "../../../components/industry-capability-outlook";
import { FunctionBreakdown } from "../../../components/function-breakdown";
import { IndustryAtlasHero } from "../../../components/industry-atlas-hero";
import { ResearchDrawer } from "../../../components/research-drawer";
import { WorkflowGroups } from "../../../components/workflow-groups";
import {
  getIndustrySummaries,
  getIndustrySummary,
  getCountryEvidence,
  getLawFirmIndustryView,
} from "../../../src/application/aibi-service";
import { getCountryPracticalContext, getIndustryOutlook } from "../../../src/data/industry-outlooks";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ country?: string; level?: string }>;
};

const LEVEL_NAMES: Record<string, string> = {
  standard: "Standard AI",
  integrated: "Integrated AI",
  advanced: "Advanced & human-led AI",
};

export function generateStaticParams() {
  return getIndustrySummaries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustrySummary(slug);
  if (!industry) return { title: "Industry AI Outlook" };
  return {
    title: `${industry.name} AI Applications and Industry Impact`,
    description: `Explore practical AI applications for ${industry.name.toLowerCase()}, from standard tools to integrated and advanced workflows, with evidence and regional context.`,
  };
}

function DevelopmentState({
  slug,
  countrySlug,
  levelId,
}: {
  slug: string;
  countrySlug?: string | undefined;
  levelId?: string | undefined;
}) {
  const industry = getIndustrySummary(slug);
  if (!industry) notFound();
  const outlook = getIndustryOutlook(slug);
  if (!outlook) notFound();
  const countryEvidence = countrySlug ? getCountryEvidence(countrySlug) : undefined;
  const countryContext = countrySlug ? getCountryPracticalContext(countrySlug) : undefined;
  return (
    <>
      <IndustryAtlasHero
        name={industry.name}
        description={outlook.framing}
        archetype={outlook.archetype}
        countryName={countryContext?.name}
        levelName={levelId ? LEVEL_NAMES[levelId] : undefined}
      />
      <div className="shell industry-content">
        <IndustryCapabilityOutlook outlook={outlook} countryContext={countryContext} initialLevelId={levelId} />
        {countryEvidence ? (
          <ResearchDrawer label="See reported AI use and the gap">
            <CountryEvidencePanel evidence={countryEvidence} industrySlug={slug} />
            <div className="simple-gap-note">
              <strong>AI use gap</strong>
              <p>A numeric gap is not shown yet because the reported country data does not measure the same tasks as the AI-use outlook above. Missing or incompatible evidence is not treated as zero.</p>
            </div>
          </ResearchDrawer>
        ) : (
          <section className="simple-usage-note">
            <p>Reported AI use and gap</p>
            <h2>Choose a country to see available usage statistics.</h2>
            <span>A global industry-wide gap is not calculated from incompatible reports.</span>
          </section>
        )}
      </div>
    </>
  );
}

export default async function IndustryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { country: countrySlug, level: levelId } = await searchParams;
  if (slug !== "law-firms") return <DevelopmentState slug={slug} countrySlug={countrySlug} levelId={levelId} />;
  const view = getLawFirmIndustryView();
  const countryEvidence = countrySlug ? getCountryEvidence(countrySlug) : undefined;
  const countryContext = countrySlug ? getCountryPracticalContext(countrySlug) : undefined;
  return (
    <>
      <IndustryAtlasHero
        name={view.name}
        description="Explore where AI can accelerate legal work, connect firm operations and support complex analysis—while professional judgment and responsibility remain human."
        archetype={view.archetypeName}
        countryName={countryContext?.name}
        levelName={levelId ? LEVEL_NAMES[levelId] : undefined}
      />
      <div className="shell industry-content">
        <WorkflowGroups groups={view.workflowGroups} initialLevelId={levelId} />
        {countryContext ? <CountryPracticalLens context={countryContext} /> : null}
        <ResearchDrawer label="See task scoring, reported use and methodology">
          <div className="score-explainer">
            <p className="eyebrow">About the experimental index</p>
            <h2>The 52.3 figure is a research model—not an adoption rate.</h2>
            <p>It combines task importance with current AI capability, reliability, integration, risk and human-oversight constraints for a representative law firm. It does not mean 52.3% of legal work can be automated, and it is not country-specific.</p>
          </div>
          <FunctionBreakdown functions={view.functions} />
          {countryEvidence ? <CountryEvidencePanel evidence={countryEvidence} industrySlug={slug} /> : null}
          <ComparisonPanel view={view} />
          <AdoptionEvidencePanel actual={view.actual} />
        </ResearchDrawer>
      </div>
    </>
  );
}
