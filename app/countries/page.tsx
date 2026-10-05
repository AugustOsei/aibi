import type { Metadata } from "next";
import Link from "next/link";

import { Flag } from "../../components/home-explorer";
import { getCountrySummaries } from "../../src/application/aibi-service";
import { createPageMetadata } from "../../src/config/site";
import "../../components/home.css";
import "../../components/pages.css";

export const metadata: Metadata = createPageMetadata({
  title: "Countries",
  description: "Explore AIBI country coverage and official broad-sector evidence for AI utilization.",
  path: "/countries",
});

export default function CountriesPage() {
  const countries = [...getCountrySummaries()].sort((a, b) => Number(b.slug === "ghana") - Number(a.slug === "ghana"));
  return (
    <div className="home-flat pg">
      <header className="pg-head shell">
        <p className="home-label">Countries</p>
        <h1>{countries.length} countries so far.</h1>
        <p>The country shapes what is practical: cost, connectivity, language and local rules. Where official surveys exist, we also show how many businesses report using AI. More countries are being added.</p>
      </header>
      <section className="shell" aria-label="Countries covered">
        <ul className="pg-rows">
          {countries.map(({ slug, name, iso2, status }) => (
            <li key={slug}>
              <Link href={`/countries/${slug}`}>
                <Flag iso2={iso2} />
                <strong>{name}</strong>
                <small>{status === "insufficient_evidence" ? "Reported AI use not yet measured" : "Reported AI use available by sector"}</small>
                <b aria-hidden="true">→</b>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
