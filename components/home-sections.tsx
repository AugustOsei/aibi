import Link from "next/link";

import {
  getCountrySummaries,
  getIndustryAdoptionHeadroom,
  getIndustrySummaries,
} from "../src/application/aibi-service";
import { HomeExplorer } from "./home-explorer";
import { VisualFlow } from "./visual-flow";
import "./home.css";

const GAP_INDUSTRY = "retail-stores";
const GAP_COUNTRIES = ["ghana", "united-kingdom", "united-states", "canada"];

export function HomeSections() {
  const countries = getCountrySummaries();
  const industries = getIndustrySummaries();
  const gaps = GAP_COUNTRIES.map((country) => getIndustryAdoptionHeadroom(GAP_INDUSTRY, country));
  const publishers = [...new Set(gaps.flatMap((view) => (view.status === "available" ? [view.actual.source.publisher] : [])))];

  return (
    <div className="home-flat">
      <section className="home-about shell" aria-labelledby="home-about-heading">
        <p className="home-label">What AIBI is</p>
        <h2 id="home-about-heading">
          The Artificial Intelligence Business Index lists practical ways a business could use today’s AI, industry by industry, from simple everyday help to advanced automation, with the country in mind.
        </h2>
        <VisualFlow />
      </section>

      <section className="home-explore" id="explore" aria-labelledby="home-explore-heading">
        <HomeExplorer countries={countries} industries={industries} />
      </section>

      <section className="home-gap shell" aria-labelledby="home-gap-heading">
        <div>
          <p className="home-label">The gap</p>
          <h2 id="home-gap-heading">Where reliable data exists, we show how many businesses report using AI.</h2>
          <p>Missing evidence is shown as unavailable, never as zero.</p>
          <Link href="/methodology">How we measure it →</Link>
        </div>
        <figure>
          <figcaption>Businesses reporting AI use · {gaps[0]?.industry.name}, closest sector</figcaption>
          <ul>
            {gaps.map((view) => (
              <li key={view.country?.slug}>
                <span>{view.country?.name}</span>
                {view.status === "available" ? (
                  <>
                    <span className="home-gap__bar"><i style={{ width: `${view.actual.value}%` }} /></span>
                    <strong>{view.actual.value.toFixed(1)}%</strong>
                  </>
                ) : (
                  <>
                    <span className="home-gap__bar home-gap__bar--empty" />
                    <strong className="is-empty">Not yet measured</strong>
                  </>
                )}
              </li>
            ))}
          </ul>
          <p>Broad-sector survey rates used as a proxy, from different survey periods. Sources: {publishers.join("; ")}.</p>
        </figure>
      </section>

      <section className="home-close" aria-label="Coverage and updates">
        <div className="shell">
          <p>
            <b>{countries.length} countries and {industries.length} industries so far.</b> More are being added, and the index is revised when AI capabilities or adoption evidence change.
          </p>
          <Link href="/updates">Update notes →</Link>
        </div>
      </section>
    </div>
  );
}
