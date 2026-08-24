import Link from "next/link";

export function IndustryAtlasHero({
  name,
  description,
  archetype,
  countryName,
  levelName,
}: {
  name: string;
  description: string;
  archetype: string;
  countryName?: string | undefined;
  levelName?: string | undefined;
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
            <p className="result-hero__kicker">AI uses for</p>
            <h1>{name}</h1>
          </div>
          <div className="result-hero__copy">
            <p>{description}</p>
            <small>{archetype}</small>
          </div>
        </div>
        <dl className="result-context" aria-label="Selected view">
          <div><dt>Country</dt><dd>{countryName ?? "Global outlook"}</dd></div>
          <div><dt>Industry</dt><dd>{name}</dd></div>
          <div><dt>Starting level</dt><dd>{levelName ?? "Standard AI"}</dd></div>
        </dl>
      </div>
    </section>
  );
}
