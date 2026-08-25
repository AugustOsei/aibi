import Link from "next/link";

export function IndustryAtlasHero({
  name,
  description,
  archetype,
  countryName,
  evaluationLabel,
}: {
  name: string;
  description: string;
  archetype: string;
  countryName?: string | undefined;
  evaluationLabel?: string | undefined;
}) {
  return (
    <section className="result-hero">
      <div className="shell">
        <div className="result-hero__topline">
          <Link href="/">← Change selections</Link>
          <span>AI industry outlook</span>
        </div>
        <div className="result-hero__grid">
          <div>
            <p className="result-hero__kicker">AI in practice</p>
            <h1>What can {name.toLowerCase()} use AI for today?</h1>
          </div>
          <div className="result-hero__copy">
            <p>{description}</p>
            <small>{archetype}</small>
          </div>
        </div>
        <dl className="result-context" aria-label="Selected view">
          <div><dt>Country</dt><dd>{countryName ?? "Global outlook"}</dd></div>
          <div><dt>Industry</dt><dd>{name}</dd></div>
          <div><dt>Organization analyzed</dt><dd>{archetype}</dd></div>
          {evaluationLabel ? <div><dt>Last evaluated / Updated</dt><dd>{evaluationLabel}</dd></div> : null}
        </dl>
      </div>
    </section>
  );
}
