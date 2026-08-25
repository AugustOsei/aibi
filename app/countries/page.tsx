import type { Metadata } from "next";
import Link from "next/link";

import { StatusChip } from "../../components/status-chip";
import { getCountrySummaries } from "../../src/application/aibi-service";
import { createPageMetadata } from "../../src/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "Countries",
  description: "Explore AIBI country coverage and official broad-sector evidence for AI utilization.",
  path: "/countries",
});

export default function CountriesPage() {
  const countries = getCountrySummaries();
  return (
    <div className="shell page-shell">
      <header className="page-intro">
        <p className="eyebrow">Explore countries</p>
        <h1>Start with the market you want to understand.</h1>
        <p>Country context helps explain the conditions businesses operate in. Where official data exists, AIBI also shows reported AI use by broad industry sector—without turning imperfect matches into invented scores.</p>
      </header>
      <section className="coverage-summary" aria-labelledby="country-coverage-heading">
        <div><p className="eyebrow">Initial coverage</p><h2 id="country-coverage-heading">United States, United Kingdom, Canada, and Ghana</h2></div>
        <p>More countries are being added over time. New profiles will appear only when there is enough context to present them honestly.</p>
      </section>
      <div className="country-directory">
        {countries.map((country, index) => (
          <Link href={`/countries/${country.slug}`} className="country-card" key={country.slug}>
            <div><span>{String(index + 1).padStart(2, "0")}</span><b>{country.iso2}</b></div>
            <h2>{country.name}</h2>
            <StatusChip status={country.status} />
            <p>{country.statusLabel}</p>
            <small>Open country profile →</small>
          </Link>
        ))}
      </div>
    </div>
  );
}
