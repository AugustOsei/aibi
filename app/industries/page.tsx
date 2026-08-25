import type { Metadata } from "next";
import Link from "next/link";

import { StatusChip } from "../../components/status-chip";
import { getIndustrySummaries } from "../../src/application/aibi-service";
import { createPageMetadata } from "../../src/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "Industries",
  description: "Explore practical AI opportunity, observed utilization, and evidence gaps across the industries currently covered by AIBI.",
  path: "/industries",
});

export default function IndustriesPage() {
  const industries = getIndustrySummaries();
  return (
    <div className="shell page-shell">
      <header className="page-intro">
        <p className="eyebrow">Explore industries</p>
        <h1>Choose an industry. See what AI could help with today.</h1>
        <p>Each outlook starts with the work businesses actually do. It then shows practical AI uses from simple everyday assistance to connected systems and more advanced, human-led applications.</p>
      </header>
      <section className="coverage-summary" aria-labelledby="industry-coverage-heading">
        <div><p className="eyebrow">Initial industry coverage</p><h2 id="industry-coverage-heading">The first set, not the finished index.</h2></div>
        <p>The industries below are the beginning of broader coverage. Additional industries will be added as their work, evidence base, and practical AI opportunities can be represented responsibly.</p>
      </section>
      <div className="industry-directory">
        {industries.map((industry, index) => (
          <Link href={`/industries/${industry.slug}`} key={industry.slug} className="directory-row">
            <span className="directory-row__number">{String(index + 1).padStart(2, "0")}</span>
            <div><h2>{industry.name}</h2><p>{industry.description}</p></div>
            <StatusChip status={industry.status} label={industry.statusLabel} />
            <span className="directory-row__arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
