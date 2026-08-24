import type { Metadata } from "next";
import Link from "next/link";

import { StatusChip } from "../../components/status-chip";
import { getIndustrySummaries } from "../../src/application/aibi-service";

export const metadata: Metadata = { title: "Industries" };

export default function IndustriesPage() {
  const industries = getIndustrySummaries();
  return (
    <div className="shell page-shell">
      <header className="page-intro">
        <p className="eyebrow">Industry index</p>
        <h1>Where practical AI meets real business work.</h1>
        <p>Each industry baseline starts with its functions and tasks, then tests current AI against the realities of cost, reliability, implementation, oversight, and risk.</p>
      </header>
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
