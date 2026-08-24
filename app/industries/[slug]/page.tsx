import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdoptionEvidencePanel } from "../../../components/adoption-evidence-panel";
import { CountryEvidencePanel } from "../../../components/country-evidence-panel";
import { CountryPracticalLens, IndustryCapabilityOutlook } from "../../../components/industry-capability-outlook";
import { FunctionBreakdown } from "../../../components/function-breakdown";
import { IndustryAtlasHero } from "../../../components/industry-atlas-hero";
import { ResearchDrawer } from "../../../components/research-drawer";
import { UtilizationGapPanel } from "../../../components/utilization-gap-panel";
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
  searchParams: Promise<{ country?: string }>;
};

export function generateStaticParams() {
  return getIndustrySummaries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustrySummary(slug);
  if (!industry) return { title: "Industry AI Outlook" };
  return {
    title: `${industry.name} AI Opportunity vs Adoption`,
    description: `See what today’s AI could practically be used for in ${industry.name.toLowerCase()}, then review credible observed utilization and the evidence gap.`,
  };
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
  const countryEvidence = countrySlug ? getCountryEvidence(countrySlug) : undefined;
  const countryContext = countrySlug ? getCountryPracticalContext(countrySlug) : undefined;
  return (
    <>
      <IndustryAtlasHero
        name={industry.name}
        description={outlook.framing}
        archetype={outlook.archetype}
        countryName={countryContext?.name}
      />
      <div className="shell industry-content">
        <IndustryCapabilityOutlook outlook={outlook} countryContext={countryContext} />
        {countryEvidence ? (
          <CountryEvidencePanel evidence={countryEvidence} industrySlug={slug} />
        ) : (
          <section className="simple-usage-note">
            <p>Observed utilization</p>
            <h2>Choose a country to see available evidence.</h2>
            <span>A global industry-wide rate is not inferred from incompatible reports.</span>
          </section>
        )}
        <UtilizationGapPanel reason="The possible-utilization outlook describes tasks and workflows, while current country evidence measures broader sectors or differently defined forms of AI use. Missing or incompatible evidence is not treated as zero." />
      </div>
    </>
  );
}

export default async function IndustryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { country: countrySlug } = await searchParams;
  if (slug !== "law-firms") return <DevelopmentState slug={slug} countrySlug={countrySlug} />;
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
        evaluationLabel={`${view.possible.effectiveDate} · Baseline v${view.possible.version}`}
      />
      <div className="shell industry-content">
        <WorkflowGroups groups={view.workflowGroups} />
        {countryContext ? <CountryPracticalLens context={countryContext} /> : null}
        <AdoptionEvidencePanel actual={view.actual} />
        {countryEvidence ? (
          <CountryEvidencePanel evidence={countryEvidence} industrySlug={slug} />
        ) : (
          <section className="simple-usage-note">
            <p>Country evidence</p>
            <h2>Choose a country to add the closest official sector evidence.</h2>
            <span>The law-firm observations above remain visible because their published geographies are broader than one selected country.</span>
          </section>
        )}
        <UtilizationGapPanel reason="The opportunity analysis is task-level, while observed reports measure tool use, frequency, or broad-sector adoption. Those constructs cannot be subtracted honestly, so no numeric gap is shown." />
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
