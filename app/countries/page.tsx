import type { Metadata } from "next";
import Link from "next/link";

import { StatusChip } from "../../components/status-chip";
import { getCountrySummaries } from "../../src/application/aibi-service";

export const metadata: Metadata = { title: "Countries" };

export default function CountriesPage() {
  const countries = getCountrySummaries();
  return (
    <div className="shell page-shell">
      <header className="page-intro">
        <p className="eyebrow">Geographic index</p>
        <h1>Different markets. Different practical conditions.</h1>
        <p>Explore official AI-use observations by broad industry sector. Sector mappings are shown as context—not converted into invented industry scores.</p>
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
