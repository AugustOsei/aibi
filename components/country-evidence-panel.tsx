import Link from "next/link";

import type { CountryEvidenceView } from "../src/application/aibi-service";

export function CountryEvidencePanel({
  evidence,
  industrySlug,
}: {
  evidence: CountryEvidenceView;
  industrySlug?: string;
}) {
  const observations = industrySlug
    ? evidence.observations.filter(({ mappedIndustries }) => mappedIndustries.some(({ slug }) => slug === industrySlug))
    : evidence.observations;

  return (
    <section className="country-evidence" aria-labelledby={`country-evidence-${evidence.country.slug}`}>
      <div className="country-evidence__heading">
        <div>
          <p className="eyebrow">{evidence.country.name} evidence · {evidence.country.iso2}</p>
          <h2 id={`country-evidence-${evidence.country.slug}`}>
            {industrySlug ? "What the closest official sector reports" : "Reported AI use by broad industry sector"}
          </h2>
        </div>
        <p>{evidence.note}</p>
      </div>

      {observations.length > 0 ? (
        <div className="country-evidence__list">
          {observations.map((observation) => (
            <article className="country-evidence-row" key={observation.id}>
              <div className="country-evidence-row__value"><strong>{observation.value}</strong><span>%</span></div>
              <div className="country-evidence-row__main">
                <h3>{observation.sectorLabel}</h3>
                <p>{observation.measuredConcept}</p>
                {!industrySlug ? (
                  <div className="country-evidence-row__links">
                    {observation.mappedIndustries.map((industry) => (
                      <Link href={`/industries/${industry.slug}?country=${evidence.country.slug}`} key={industry.slug}>{industry.name} ↗</Link>
                    ))}
                  </div>
                ) : null}
              </div>
              <details>
                <summary>Scope and source</summary>
                <p><strong>Period</strong>{observation.period}</p>
                <p><strong>Industry mapping</strong>{observation.mappingNote}</p>
                <p><strong>Evidence</strong>Grade {observation.evidenceGrade} at the source-sector level · {observation.confidence} confidence. The mapped AIBI industry is a broader-sector proxy.</p>
                {observation.derivation ? <p><strong>Calculation</strong>{observation.derivation}</p> : null}
              </details>
            </article>
          ))}
        </div>
      ) : (
        <div className="country-evidence__missing">
          <p>No numeric estimate is displayed.</p>
          <span>{evidence.note}</span>
        </div>
      )}

      <footer className="country-evidence__source">
        <div><span>Source</span><strong>{evidence.source.publisher}</strong></div>
        <p>{evidence.source.methodology}</p>
        {evidence.source.url ? <a href={evidence.source.url} target="_blank" rel="noreferrer">Open source data ↗</a> : null}
      </footer>
    </section>
  );
}
