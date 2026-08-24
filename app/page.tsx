import type { Metadata } from "next";

import { AtlasExplorer } from "../components/atlas-explorer";
import { UpdatesCta } from "../components/updates-cta";
import { getCountrySummaries, getIndustrySummaries } from "../src/application/aibi-service";

export const metadata: Metadata = {
  title: "AI Opportunity vs Adoption by Industry",
  description: "Choose a country and industry to explore the complete range of practical AI uses, credible observed utilization, and the evidence gap.",
};

export default function OverviewPage() {
  return (
    <>
      <AtlasExplorer countries={getCountrySummaries()} industries={getIndustrySummaries()} />
      <div className="shell home-continuation">
        <section className="initial-coverage" aria-labelledby="initial-coverage-heading">
          <div>
            <p className="eyebrow">Initial coverage</p>
            <h2 id="initial-coverage-heading">Four countries. A growing industry index.</h2>
          </div>
          <ul aria-label="Countries currently covered">
            <li>United States</li>
            <li>United Kingdom</li>
            <li>Canada</li>
            <li>Ghana</li>
          </ul>
          <p>More countries are being added over time. The current industry list is the beginning of broader coverage, not a claim of completeness.</p>
        </section>
        <UpdatesCta />
      </div>
    </>
  );
}
