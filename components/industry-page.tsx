import Link from "next/link";
import { notFound } from "next/navigation";

import { getCountrySummary, getIndustrySummary, getLawFirmIndustryView } from "../src/application/aibi-service";
import { getCountryPracticalContext, getIndustryOutlook } from "../src/data/industry-outlooks";
import { FunctionBreakdown } from "./function-breakdown";
import { IndustryView } from "./industry-view";
import { ResearchDrawer } from "./research-drawer";

export function IndustryPageBody({ industrySlug, countrySlug }: { industrySlug: string; countrySlug?: string | undefined }) {
  if (!getIndustrySummary(industrySlug)) notFound();
  const outlook = getIndustryOutlook(industrySlug);
  if (!outlook) notFound();
  const country = countrySlug ? getCountrySummary(countrySlug) : undefined;
  if (countrySlug && !country) notFound();
  const countryContext = country ? getCountryPracticalContext(country.slug) : undefined;

  if (industrySlug !== "law-firms") return <IndustryView outlook={outlook} country={country} countryContext={countryContext} />;

  const view = getLawFirmIndustryView();
  return (
    <IndustryView outlook={outlook} country={country} countryContext={countryContext}>
      <ResearchDrawer label="See experimental scoring and methodology">
        <div className="score-explainer">
          <p className="eyebrow">About the experimental index</p>
          <h2>52.3 is an experimental summary index—not adoption or automation.</h2>
          <p>It combines task importance with current AI capability, reliability, integration, risk and human-oversight constraints for a representative law firm. It does not mean 52.3% of legal work can be automated, it is not country-specific, and it is not used as the observed-utilization measure. <Link href="/methodology">Read the methodology →</Link></p>
        </div>
        <FunctionBreakdown functions={view.functions} />
      </ResearchDrawer>
    </IndustryView>
  );
}
