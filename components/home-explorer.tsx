"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CA, GB, GH, US } from "country-flag-icons/react/1x1";

import type { CountrySummaryView, IndustrySummaryView } from "../src/application/aibi-service";

const FLAGS: Record<string, typeof GH> = { GH, US, GB, CA };
const COMING_SOON: string[] = [];

export function Flag({ iso2 }: { iso2: string }) {
  const Icon = FLAGS[iso2];
  return <span className="home-flag" aria-hidden="true">{Icon ? <Icon /> : iso2}</span>;
}

// Two rows that slide in opposite directions as the page scrolls past them.
function RollingBand({ countries, industries }: { countries: CountrySummaryView[]; industries: IndustrySummaryView[] }) {
  const band = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = band.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = element.getBoundingClientRect();
      const progress = (window.innerHeight - box.top) / (window.innerHeight + box.height);
      element.style.setProperty("--roll", String(Math.max(0, Math.min(1, progress))));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const repeat = [0, 1, 2, 3];
  return (
    <div ref={band} className="home-roll" aria-hidden="true">
      <div className="home-roll__row">
        {repeat.flatMap((round) => countries.map(({ slug, name, iso2 }) => (
          <span key={`${round}-${slug}`}><Flag iso2={iso2} />{name}</span>
        )))}
      </div>
      <div className="home-roll__row home-roll__row--reverse">
        {repeat.slice(0, 2).flatMap((round) => industries.map(({ slug, name }) => (
          <span key={`${round}-${slug}`}>{name}</span>
        )))}
      </div>
    </div>
  );
}

export function IndustryPicker({ countries, industries, defaultCountry = "ghana", showHeader = true }: {
  countries: CountrySummaryView[];
  industries: IndustrySummaryView[];
  defaultCountry?: string;
  showHeader?: boolean;
}) {
  const ordered = [...countries].sort((a, b) => Number(b.slug === defaultCountry) - Number(a.slug === defaultCountry));
  const [country, setCountry] = useState(defaultCountry);
  const active = ordered.find(({ slug }) => slug === country) ?? ordered[0];

  return (
    <div className="shell home-picker">
      {showHeader ? (
        <header>
          <p className="home-label">The index</p>
          <h2 id="home-explore-heading">Where is the business?</h2>
        </header>
      ) : null}

      <div className="home-picker__countries" role="radiogroup" aria-label="Country">
        {ordered.map(({ slug, name, iso2, status }) => (
          <button key={slug} type="button" role="radio" aria-checked={country === slug} onClick={() => setCountry(slug)}>
            <Flag iso2={iso2} />
            <strong>{name}</strong>
            <small>{status === "insufficient_evidence" ? "Reported use not yet measured" : "Reported-use data available"}</small>
          </button>
        ))}
      </div>

      <div className="home-picker__industries">
        <h3>
          {active ? <Flag iso2={active.iso2} /> : null}
          What kind of business in {active?.name}?
        </h3>
        <ol aria-label={`Industries in ${active?.name}`}>
          {industries.map(({ slug, name, description }, index) => (
            <li key={slug}>
              <Link href={`/${country}/${slug}`}>
                <span className="home-picker__number">{String(index + 1).padStart(2, "0")}</span>
                <strong>{name}</strong>
                <span className="home-picker__arrow" aria-hidden="true">→</span>
                <span className="home-picker__about">{description}</span>
              </Link>
            </li>
          ))}
          {COMING_SOON.map((name, index) => (
            <li key={name} className="is-soon">
              <span>
                <span className="home-picker__number">{String(industries.length + index + 1).padStart(2, "0")}</span>
                <strong>{name}</strong>
                <span className="home-picker__about">In preparation</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function HomeExplorer({ countries, industries }: { countries: CountrySummaryView[]; industries: IndustrySummaryView[] }) {
  const ordered = [...countries].sort((a, b) => Number(b.slug === "ghana") - Number(a.slug === "ghana"));
  return (
    <>
      <RollingBand countries={ordered} industries={industries} />
      <IndustryPicker countries={countries} industries={industries} />
    </>
  );
}
