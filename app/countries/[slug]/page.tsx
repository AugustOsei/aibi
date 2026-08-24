import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CountryEvidencePanel } from "../../../components/country-evidence-panel";
import { StatusChip } from "../../../components/status-chip";
import { getCountryEvidence, getCountrySummaries, getCountrySummary, getIndustrySummaries } from "../../../src/application/aibi-service";
import { createPageMetadata } from "../../../src/config/site";

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
  return (
    <div className="shell page-shell">
      <header className="country-profile-header">
        <div><p className="eyebrow">Country profile · {country.iso2}</p><h1>{country.name}</h1></div>
        <StatusChip status={country.status} label={evidence.statusLabel} />
      </header>
      <CountryEvidencePanel evidence={evidence} />
      <section className="country-industry-index">
        <div><p className="eyebrow">Continue by industry</p><h2>Apply the {country.name} evidence lens</h2></div>
        <ol>{industries.map((industry) => {
          const observation = evidence.observations.find(({ mappedIndustries }) => mappedIndustries.some(({ slug: industrySlug }) => industrySlug === industry.slug));
          return (
            <li key={industry.slug}>
              <Link href={`/industries/${industry.slug}?country=${country.slug}`}>
                <span>{industry.name}</span>
                <small>{observation ? `${observation.value}% broad-sector observation` : "No comparable sector observation"}</small>
                <b>→</b>
              </Link>
            </li>
          );
        })}</ol>
      </section>
    </div>
  );
}
