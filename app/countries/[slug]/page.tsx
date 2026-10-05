import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Flag } from "../../../components/home-explorer";
import { getCountryEvidence, getCountrySummaries, getCountrySummary, getIndustrySummaries } from "../../../src/application/aibi-service";
import { createPageMetadata } from "../../../src/config/site";
import "../../../components/home.css";
import "../../../components/pages.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCountrySummaries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountrySummary(slug);
  const name = country?.name ?? "Country";
  return createPageMetadata({
    title: name,
    description: `Explore available AI utilization evidence and industry context for ${name}.`,
    path: `/countries/${slug}`,
  });
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const country = getCountrySummary(slug);
  if (!country) notFound();
  const evidence = getCountryEvidence(slug);
  if (!evidence) notFound();
  const industries = getIndustrySummaries();
  const period = evidence.observations[0]?.period;

  return (
    <div className="home-flat pg">
      <header className="pg-head shell">
        <Link className="ind-back" href="/countries">← All countries</Link>
        <p className="home-label">Country</p>
        <h1><Flag iso2={country.iso2} />{country.name}</h1>
      </header>

      <section className="shell" aria-labelledby="country-industries-heading">
        <p className="home-label">Industries</p>
        <h2 id="country-industries-heading">What kind of business in {country.name}?</h2>
        <ul className="pg-rows pg-rows--plain" style={{ marginTop: 24 }}>
          {industries.map((industry) => {
            const observation = evidence.observations.find(({ mappedIndustries }) => mappedIndustries.some((item) => item.slug === industry.slug));
            return (
              <li key={industry.slug}>
                <Link href={`/${country.slug}/${industry.slug}`}>
                  <strong>{industry.name}</strong>
                  <small>{observation ? `${observation.value}% report using AI (closest sector)` : "Reported use not yet measured"}</small>
                  <b aria-hidden="true">→</b>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="shell" aria-labelledby="country-reported-heading">
        <p className="home-label">Reported use</p>
        <h2 id="country-reported-heading">Businesses reporting AI use, by sector</h2>
        {evidence.observations.length > 0 ? (
          <figure className="home-gap pg-chart" style={{ display: "block", marginTop: 24 }}>
            <ul style={{ borderTop: "2px solid var(--flat-rule)" }}>
              {evidence.observations.map((observation) => (
                <li key={observation.id}>
                  <span>{observation.sectorLabel}</span>
                  <span className="home-gap__bar"><i style={{ width: `${observation.value}%` }} /></span>
                  <strong>{observation.value.toFixed(1)}%</strong>
                </li>
              ))}
            </ul>
            <p className="pg-note">{evidence.source.publisher}{period ? `, ${period}` : ""}. {evidence.source.methodology} {evidence.source.url ? <a href={evidence.source.url} target="_blank" rel="noreferrer">Open the source ↗</a> : null}</p>
          </figure>
        ) : (
          <div className="pg-empty" style={{ marginTop: 24 }}>
            <strong>Not yet measured.</strong>
            <p>{evidence.note} We show this as unavailable, never as zero.</p>
          </div>
        )}
      </section>
    </div>
  );
}
