import type { Metadata } from "next";
import Link from "next/link";

import { createPageMetadata } from "../../src/config/site";
import "../../components/home.css";
import "../../components/pages.css";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: "Why the Artificial Intelligence Business Index tracks possible AI utilization, observed industry adoption, and the evidence gap between them.",
  path: "/about",
});

const indexLayers = [
  ["01", "List what is possible", "For each industry, AIBI lists practical uses of today’s AI, starting with ready-made tools that need no special setup."],
  ["02", "Keep the country in mind", "Cost, connectivity, language and local rules differ by country, so each page carries guidance for the country you choose."],
  ["03", "Show reported use where it exists", "Where a credible survey exists, we show how many businesses report using AI. Missing evidence is shown as unavailable, not as zero."],
] as const;

export default function AboutPage() {
  return (
    <div className="home-flat pg">
      <header className="pg-head shell">
        <p className="home-label">About AIBI</p>
        <h1>What can a business actually use AI for today?</h1>
        <p>AIBI began with that question. AI models have become very capable, but it is hard for a business owner to see what that means for their own kind of work. The index tries to answer it plainly, industry by industry.</p>
      </header>

      <section className="shell" aria-label="How AIBI works">
        <ol className="pg-steps">
          {indexLayers.map(([number, title, description]) => (
            <li key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pg-split shell" aria-labelledby="about-scope-heading">
        <div>
          <p className="home-label">Scope</p>
          <h2 id="about-scope-heading">Industries, not individual companies.</h2>
        </div>
        <div>
          <p>AIBI describes a representative business in each industry. It is a guide to what is possible, not an audit of any company and not a claim about what businesses already do.</p>
          <p>The gap between what is possible and what businesses report using is shown as a rough indicator, and only where the evidence allows a fair comparison.</p>
          <p><Link href="/methodology">Read the methodology →</Link></p>
        </div>
      </section>

      <section className="pg-split shell" aria-labelledby="living-index-heading">
        <div>
          <p className="home-label">Designed to change</p>
          <h2 id="living-index-heading">AIBI is a living index.</h2>
        </div>
        <div>
          <p>The index is reviewed as AI capabilities improve, costs change, tools become easier to use, rules shift and better adoption evidence appears. Review dates are shown on the pages they apply to.</p>
          <p><Link href="/updates">See update notes →</Link></p>
        </div>
      </section>

      <section className="pg-split shell" aria-labelledby="founder-origin-heading">
        <div>
          <p className="home-label">Origin</p>
          <h2 id="founder-origin-heading">About the founder</h2>
        </div>
        <div>
          <p>AIBI was created by Augustine Osei, founder and publisher of <strong>The August Dispatch</strong>, an independent publication covering artificial intelligence, emerging technology, and how these tools are being used in practice.</p>
          <p>The project grew from a recurring question: as AI capabilities advance, how much of what is already possible is actually being adopted by businesses and industries?</p>
          <p><a href="https://www.theaugustdispatch.com" target="_blank" rel="noreferrer">Read The August Dispatch ↗</a></p>
        </div>
      </section>
    </div>
  );
}
