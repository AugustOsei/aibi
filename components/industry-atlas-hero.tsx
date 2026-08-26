import Link from "next/link";
import {
  Calculator,
  HardHat,
  Megaphone,
  Scale,
  Scissors,
  ShoppingBag,
  Stethoscope,
  Utensils,
} from "lucide-react";

const COUNTRY_FLAGS: Record<string, string> = {
  CA: "🇨🇦",
  GB: "🇬🇧",
  GH: "🇬🇭",
  US: "🇺🇸",
};

const countryInSentence = (name: string) => ["United Kingdom", "United States"].includes(name) ? `the ${name}` : name;

const industryIcon = (name: string) => {
  if (name === "Law Firms") return Scale;
  if (name === "Accounting Firms") return Calculator;
  if (name === "Construction Contractors") return HardHat;
  if (name === "Restaurants") return Utensils;
  if (name === "Retail Stores") return ShoppingBag;
  if (name === "Barbershops & Salons") return Scissors;
  if (name === "Marketing Agencies") return Megaphone;
  return Stethoscope;
};

export function IndustryAtlasHero({
  name,
  description,
  archetype,
  countryName,
  countryCode,
  evaluationLabel,
}: {
  name: string;
  description: string;
  archetype: string;
  countryName?: string | undefined;
  countryCode?: string | undefined;
  evaluationLabel?: string | undefined;
}) {
  const IndustryIcon = industryIcon(name);
  const countryLabel = countryName ?? "Global outlook";
  const sentenceCountry = countryName ? countryInSentence(countryName) : undefined;
  const countryMarker = countryCode ? COUNTRY_FLAGS[countryCode] ?? countryCode : "◎";
  return (
    <section className="result-hero">
      <div className="shell">
        <div className="result-hero__topline">
          <Link href="/">← Change selections</Link>
          <span>AI industry outlook</span>
        </div>
        <div className="result-selection" aria-label={`Current view: ${countryLabel}, ${name}`}>
          <div className="result-selection__intro">
            <span>Current view</span>
            <strong>{sentenceCountry ? `Industry AI outlook for ${sentenceCountry}` : "Global industry AI outlook"}</strong>
          </div>
          <div className="result-selection__item">
            <span className="result-selection__marker result-selection__marker--country" aria-hidden="true">{countryMarker}</span>
            <div><small>Country</small><strong>{countryLabel}</strong></div>
          </div>
          <div className="result-selection__item">
            <span className="result-selection__marker" aria-hidden="true"><IndustryIcon size={20} strokeWidth={1.65} /></span>
            <div><small>Industry</small><strong>{name}</strong></div>
          </div>
        </div>
        <div className="result-hero__grid">
          <div>
            <p className="result-hero__kicker">AI in practice</p>
            <h1>What can {name.toLowerCase()}{sentenceCountry ? ` in ${sentenceCountry}` : ""} use AI for today?</h1>
          </div>
          <div className="result-hero__copy">
            <p>{description}</p>
            <small>{archetype}</small>
          </div>
        </div>
        <dl className="result-context" aria-label="Analysis details">
          <div><dt>Organization analyzed</dt><dd>{archetype}</dd></div>
          {evaluationLabel ? <div><dt>Last evaluated / Updated</dt><dd>{evaluationLabel}</dd></div> : null}
        </dl>
      </div>
    </section>
  );
}
