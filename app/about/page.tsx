import type { Metadata } from "next";

import { UpdatesCta } from "../../components/updates-cta";
import { createPageMetadata } from "../../src/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: "Why the Artificial Intelligence Business Index tracks possible AI utilization, observed industry adoption, and the evidence gap between them.",
  path: "/about",
});

const indexLayers = [
  ["01", "Map what is possible", "AIBI organizes practical AI opportunities from simple, standard uses through integrated systems and advanced, human-led applications."],
  ["02", "Review what is observed", "Those possibilities are set beside credible evidence of how an industry is actually using AI, with scope and limitations kept visible."],
  ["03", "Identify the presumed gap", "A utilization gap is surfaced only where the evidence supports a meaningful comparison. Incompatible or missing evidence is not treated as zero."],
] as const;

export default function AboutPage() {
  return (
    <div className="shell page-shell about-page">
      <header className="page-intro about-intro">
        <p className="eyebrow">About AIBI</p>
        <h1>Why AIBI starts with what AI can do today.</h1>
        <p>AIBI began with a simple question: given the capabilities of today&apos;s AI, what could businesses in an industry reasonably be using it for?</p>
      </header>

      <section className="about-definition" aria-labelledby="about-definition-heading">
        <p className="eyebrow">The index</p>
        <h2 id="about-definition-heading">Industry opportunity first. Adoption evidence second.</h2>
        <p>AIBI looks at industries, not individual companies. It maps practical uses across representative business work, then compares that picture with credible evidence of what is actually being adopted.</p>
      </section>

      <section className="about-layers" aria-label="How AIBI works">
        {indexLayers.map(([number, title, description]) => (
          <article key={number}>
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className="living-index" aria-labelledby="living-index-heading">
        <div>
          <p className="eyebrow">Designed to change</p>
          <h2 id="living-index-heading">AIBI is a living index.</h2>
        </div>
        <div>
          <p>Analyses should be reevaluated as AI capabilities improve, costs change, tools become easier to deploy, regulatory or operational constraints shift, and better adoption evidence becomes available.</p>
          <p>Versions and evaluation dates are shown where the underlying data supports them. The index should become more useful over time without pretending that every market or industry is already fully measured.</p>
        </div>
      </section>

      <section className="founder-origin" aria-labelledby="founder-origin-heading">
        <div>
          <p className="eyebrow">Origin</p>
          <h2 id="founder-origin-heading">About the founder</h2>
        </div>
        <div>
          <p>AIBI was created by Augustine Osei, founder and publisher of <strong>The August Dispatch</strong>, an independent publication covering artificial intelligence, emerging technology, and how these tools are being used in practice.</p>
          <p>The project grew from a recurring question: as AI capabilities advance, how much of what is already possible is actually being adopted by businesses and industries?</p>
          <p>AIBI is an attempt to track that gap systematically over time.</p>
          <a href="https://www.theaugustdispatch.com" target="_blank" rel="noreferrer">Read The August Dispatch →</a>
        </div>
      </section>

      <UpdatesCta />
    </div>
  );
}
