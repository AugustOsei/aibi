import type { Metadata } from "next";

import { IndustryPicker } from "../../components/home-explorer";
import { getCountrySummaries, getIndustrySummaries } from "../../src/application/aibi-service";
import { createPageMetadata } from "../../src/config/site";
import "../../components/home.css";
import "../../components/pages.css";

export const metadata: Metadata = createPageMetadata({
  title: "Industries",
  description: "Explore practical AI opportunity, observed utilization, and evidence gaps across the industries currently covered by AIBI.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <div className="home-flat pg">
      <header className="pg-head shell">
        <p className="home-label">Industries</p>
        <h1>Pick a country, then an industry.</h1>
        <p>Each page starts with practical ways that kind of business can use AI today. More industries are being added.</p>
      </header>
      <div className="pg-picker">
        <IndustryPicker countries={getCountrySummaries()} industries={getIndustrySummaries()} showHeader={false} />
      </div>
    </div>
  );
}
