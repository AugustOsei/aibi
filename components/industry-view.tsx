import Link from "next/link";
import type { ReactNode } from "react";

import {
  getCountrySummaries,
  getIndustryAdoptionHeadroom,
  type CountrySummaryView,
} from "../src/application/aibi-service";
import { AI_CAPABILITY_HORIZON, COMMON_BUSINESS_FUNCTIONS } from "../src/data/ai-capability-horizon";
import type { CountryPracticalContext, IndustryOutlook } from "../src/data/industry-outlooks";
import { countryInSentence as inSentence, industrySubject } from "../src/config/phrases";
import { Flag } from "./home-explorer";
import { IndustryUses } from "./industry-uses";
import "./home.css";
import "./industry.css";

export function IndustryView({ outlook, country, countryContext, children }: {
  outlook: IndustryOutlook;
  country?: CountrySummaryView | undefined;
  countryContext?: CountryPracticalContext | undefined;
  children?: ReactNode;
}) {
  const countries = [...getCountrySummaries()].sort((a, b) => Number(b.slug === "ghana") - Number(a.slug === "ghana"));
  const own = country ? getIndustryAdoptionHeadroom(outlook.slug, country.slug) : undefined;
  const industry = industrySubject(outlook.slug, outlook.name);
  const reviewed = new Date(`${AI_CAPABILITY_HORIZON.lastReviewed}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <div className="home-flat ind">
      <header className="ind-head shell">
        <Link className="ind-back" href="/#explore">← All industries</Link>
        <p className="home-label">{country ? `${outlook.name} · ${country.name}` : `${outlook.name} · All countries`}</p>
        <h1>What can {industry}{country ? ` in ${inSentence(country.name)}` : ""} use AI for today?</h1>
        <p className="ind-head__framing">{countryContext?.industryNotes[outlook.slug] ?? outlook.framing}</p>
        <nav className="ind-countries" aria-label="Country">
          {countries.map(({ slug, name, iso2 }) => (
            <Link key={slug} href={`/${slug}/${outlook.slug}`} aria-current={country?.slug === slug ? "page" : undefined}>
              <Flag iso2={iso2} />
              {name}
            </Link>
          ))}
        </nav>
      </header>

      <section className="ind-ai shell" aria-labelledby="ind-ai-heading">
        <p className="home-label">Today’s AI · reviewed {reviewed}</p>
        <h2 id="ind-ai-heading">What current AI can do, in plain terms.</h2>
        <ul>
          {AI_CAPABILITY_HORIZON.capabilities.map((capability) => (
            <li key={capability.id}>
              <strong>{capability.name}</strong>
              <span>{capability.summary}</span>
            </li>
          ))}
        </ul>
        <p className="ind-ai__models">
          <b>Models and products reviewed</b>
          {AI_CAPABILITY_HORIZON.sources.map((source, index) => (
            <span key={source.url}>{index > 0 ? ", " : ""}<a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></span>
          ))}
          . Availability and price differ by country.
        </p>
      </section>

      <section className="shell" aria-labelledby="ind-uses-heading">
        <p className="home-label">Where to start</p>
        <h2 id="ind-uses-heading" className="ind-uses__heading">{COMMON_BUSINESS_FUNCTIONS.length + (outlook.tiers.find(({ id }) => id === "standard")?.useCases.length ?? 0)} practical uses, with tools available today.</h2>
        <IndustryUses tiers={outlook.tiers} industryName={industry} commonFunctions={COMMON_BUSINESS_FUNCTIONS} countryName={countryContext?.name} tierGuidance={countryContext?.tierGuidance} />
        <p className="ind-basis">Based on a representative {outlook.archetype.toLowerCase()}. These are possibilities, not a claim about what businesses already do.</p>
      </section>

      <section className="ind-reported shell" aria-labelledby="ind-reported-heading">
        <p className="home-label">Reported use{country ? ` in ${inSentence(country.name)}` : ""}</p>
        {own?.status === "available" ? (
          <>
            <h2 id="ind-reported-heading"><strong>{own.actual.value.toFixed(1)}%</strong> of businesses in the closest sector report using AI.</h2>
            <span className="home-gap__bar"><i style={{ width: `${own.actual.value}%` }} /></span>
            <p>A rough indicator from a broad-sector survey ({own.actual.source.publisher}), not a measurement of {industry}. <Link href="/methodology">How we measure it →</Link></p>
          </>
        ) : (
          <>
            <h2 id="ind-reported-heading">{country ? "Not yet measured." : "Choose a country above to see reported use."}</h2>
            {country ? <p>No comparable current figure has been published for {inSentence(country.name)}, so we show it as unavailable, not as zero. <Link href="/methodology">How we measure it →</Link></p> : null}
          </>
        )}
      </section>

      <aside className="ind-cta shell" aria-label="A separate note from August Engine">
        <p className="ind-cta__tag">Not part of the index</p>
        <p>Want to close this gap in your business? Talk to August Engine.</p>
        <a href="https://augustengine.com" target="_blank" rel="noreferrer">augustengine.com ↗</a>
      </aside>

      <section className="ind-more shell" aria-label="Sources and method">
        <details>
          <summary>Sources and method</summary>
          <div>
            <p>This is a qualitative outlook of what current AI makes possible, not an adoption claim. Country guidance shapes how to apply it; it does not change the underlying analysis. <Link href="/methodology">Read the methodology →</Link></p>
            <ul>
              {[...outlook.sources, ...(countryContext?.sources ?? [])].map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>
                  <span>{source.publisher} · {source.note}</span>
                </li>
              ))}
            </ul>
            {children}
          </div>
        </details>
      </section>
    </div>
  );
}
