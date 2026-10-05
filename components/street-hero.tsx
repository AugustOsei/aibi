"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import "./street-hero.css";


type Building = { name: string; slug: string | null; left: number; top: number; width: number; height: number };
type Scene = {
  id: "wide" | "tall";
  viewBox: string;
  wire: string;
  drops: Array<[x: number, from: number, to: number]>;
  // Positions are percentages of the artwork.
  buildings: Building[];
};

const SCENES: Scene[] = [
  {
    id: "wide",
    viewBox: "0 0 1920 1080",
    wire: "M0,478 L72,468 L192,481 L288,492 L384,499 L480,505 L576,512 L672,516 L768,519 L864,520 L960,519 L1056,517 L1110,516 M1290,511 L1392,508 L1488,503 L1584,496 L1680,488 L1776,478 L1840,470 L1920,484",
    drops: [[145, 475, 652], [333, 496, 642], [520, 508, 675], [698, 517, 642], [870, 520, 562], [1041, 517, 678], [1410, 507, 630], [1587, 496, 660], [1777, 478, 660]],
    buildings: [
      { name: "Restaurants", slug: "restaurants", left: 1.2, top: 60.8, width: 12.2, height: 22.8 },
      { name: "Barbershops & Salons", slug: "barbershops-salons", left: 13.4, top: 59.4, width: 9.4, height: 24 },
      { name: "Retail Stores", slug: "retail-stores", left: 22.8, top: 62.5, width: 9.4, height: 21 },
      { name: "Accounting Firms", slug: "accounting-firms", left: 32.3, top: 59.4, width: 8.3, height: 24 },
      { name: "Law Firms", slug: "law-firms", left: 40.6, top: 51.4, width: 9.6, height: 32 },
      { name: "Healthcare Clinics", slug: "healthcare-clinics", left: 50.2, top: 63.2, width: 8, height: 20.2 },
      { name: "Tourism & Hospitality", slug: "tourism-hospitality", left: 58.2, top: 46.1, width: 8.6, height: 37.3 },
      { name: "Construction Contractors", slug: "construction-contractors", left: 66.8, top: 58.6, width: 12.2, height: 24.8 },
      { name: "Marketing Agencies", slug: "marketing-agencies", left: 79.1, top: 61.1, width: 9.2, height: 22.3 },
      { name: "Agriculture", slug: "agriculture", left: 88.4, top: 61.4, width: 10.8, height: 22 },
    ],
  },
  {
    id: "tall",
    viewBox: "0 0 1080 1920",
    wire: "M0,1209 L54,1203 L135,1218 L243,1237 L351,1252 L459,1258 L567,1256 L648,1248 L729,1236 L745,1233 M918,1234 L972,1228 L1010,1222 L1080,1240",
    drops: [[118, 1214, 1366], [270, 1240, 1346], [410, 1258, 1382], [570, 1256, 1280], [702, 1240, 1394], [1000, 1226, 1400]],
    buildings: [
      { name: "Restaurants", slug: "restaurants", left: 0.6, top: 71.1, width: 18, height: 12.2 },
      { name: "Barbershops & Salons", slug: "barbershops-salons", left: 18.6, top: 70.1, width: 12.9, height: 13.2 },
      { name: "Retail Stores", slug: "retail-stores", left: 31.5, top: 71.9, width: 14.4, height: 11.4 },
      { name: "Law Firms", slug: "law-firms", left: 45.9, top: 66.1, width: 13.7, height: 17.2 },
      { name: "Healthcare Clinics", slug: "healthcare-clinics", left: 59.6, top: 72.6, width: 10.6, height: 10.7 },
      { name: "Tourism & Hospitality", slug: "tourism-hospitality", left: 70.2, top: 62.8, width: 13.6, height: 20.5 },
      { name: "Agriculture", slug: "agriculture", left: 84.3, top: 72.9, width: 15.2, height: 10.4 },
    ],
  },
];

const STILLS = ["off", "integrated"] as const;

export function StreetHero({ countrySlug = "ghana" }: { countrySlug?: string }) {
  const root = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const [selected, setSelected] = useState<Building | null>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const measure = () => section.style.setProperty("--street-top", `${section.offsetTop}px`);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section ref={root} className="street-hero" data-on={on} aria-labelledby="street-hero-heading">
      <div className="street-hero__art">
        {STILLS.map((name, index) => (
          <picture key={name} className="street-hero__still" data-visible={index === 0 || on}>
            <source media="(max-aspect-ratio: 4/5)" srcSet={`/images/hero/street-tall-${name}.webp`} />
            <img
              src={`/images/hero/street-wide-${name}.webp`}
              alt={index === 0 ? "A street of small businesses in Accra at dusk, including a chop bar, salon, shop, law office, clinic, guesthouse and agro store." : ""}
              aria-hidden={index === 0 ? undefined : true}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
            />
          </picture>
        ))}

        {SCENES.map((scene) => (
          <div key={scene.id} className={`street-hero__scene street-hero__scene--${scene.id}`}>
            <svg className="street-hero__wires" viewBox={scene.viewBox} preserveAspectRatio="none" aria-hidden="true">
              <path className="street-hero__wire" pathLength={1000} d={scene.wire} />
              {scene.drops.map(([x, from, to], index) => (
                <path key={x} className="street-hero__drop" pathLength={100} style={{ animationDelay: `${index * -0.37}s` }} d={`M${x},${from} V${to}`} />
              ))}
            </svg>
            {scene.buildings.map((item) => (
              <button
                key={item.name}
                type="button"
                className="street-hero__building"
                style={{ left: `${item.left}%`, top: `${item.top}%`, width: `${item.width}%`, height: `${item.height}%` }}
                aria-label={item.name}
                aria-pressed={selected?.name === item.name}
                onClick={() => setSelected(selected?.name === item.name ? null : item)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="street-hero__clouds" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="street-hero__copy">
        <p className="street-hero__kicker">The first AI Business Index for Ghana</p>
        <h1 id="street-hero-heading">
          <span>If AI is the new electricity,</span> what can it do for your business?
        </h1>
      </div>

      <div className="street-hero__dock">
        {selected ? (
          selected.slug ? (
            <Link className="street-hero__go" href={`/${countrySlug}/${selected.slug}`}>
              <span>{selected.name}</span>
              <b>See AI uses →</b>
            </Link>
          ) : (
            <p className="street-hero__go street-hero__go--soon">
              <span>{selected.name}</span>
              <b>Coming soon</b>
            </p>
          )
        ) : null}
        <button type="button" className="street-hero__glass" role="switch" aria-checked={on} onClick={() => setOn((value) => !value)}>
          <span className="street-hero__power" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 4v8M6.6 7.4a8 8 0 1 0 10.8 0" /></svg>
          </span>
          <span className="street-hero__glass-text">{on ? "AI is on" : "Switch on AI"}</span>
        </button>
        {selected ? null : (
          <p className="street-hero__line" aria-live="polite">
            {on ? "Tap a building to see what AI can do there." : "Switch it on and watch the street light up."}
          </p>
        )}
      </div>
    </section>
  );
}
