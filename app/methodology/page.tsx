import type { Metadata } from "next";
import { createPageMetadata } from "../../src/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "Methodology",
  description: "How AIBI separates possible AI utilization from observed adoption evidence and calculates a gap only when measures are compatible.",
  path: "/methodology",
});

const stages = [
  ["01", "Current AI capability", "Stable capability identities receive dated assessments of maturity, affordability, reliability, integration difficulty, oversight, and risk."],
  ["02", "Business tasks", "Capabilities are mapped to concrete work rather than broad claims about replacing jobs or industries."],
  ["03", "Practicality", "Transparent weights and safety caps convert capability-task mappings into a reproducible task score."],
  ["04", "Industry baseline / Possible", "Task scores roll into business functions and then a representative industry archetype."],
  ["05", "Actual adoption evidence", "Government surveys, credible studies, and other observations are normalized without entering the Possible calculation."],
  ["06", "AI Utilization Gap", "A gap is calculated only when Possible and Actual measure compatible populations, periods, constructs, and scales."],
  ["07", "Evidence confidence", "Grades and confidence communicate directness, source quality, uncertainty, and limitations without false precision."],
  ["08", "Versioning over time", "Capabilities, evidence, methods, and scores are timestamped so the index can change transparently as AI changes."],
] as const;

export default function MethodologyPage() {
  return (
    <div className="shell page-shell methodology-page">
      <header className="page-intro">
        <p className="eyebrow">Methodology</p>
        <h1>How AIBI keeps what’s possible separate from what’s observed.</h1>
        <p>AIBI first maps what today’s AI can reasonably do, then reviews credible evidence of what industries report using. Keeping those questions separate prevents adoption data from changing the assessment of what is technically and practically possible.</p>
      </header>
      <section className="method-contrast" aria-label="Possible and Actual distinction">
        <article><span>Possible</span><h2>What could reasonably be done?</h2><p>Built from current capabilities, business tasks, firm context, and practical constraints.</p></article>
        <div aria-hidden="true">≠</div>
        <article><span>Actual</span><h2>What is credibly observed?</h2><p>Built from external adoption evidence, normalization, evidence grades, and uncertainty.</p></article>
      </section>
      <section className="method-stages">
        {stages.map(([number, title, description]) => (
          <article key={number}><span>{number}</span><h2>{title}</h2><p>{description}</p></article>
        ))}
      </section>
      <section className="method-principles">
        <div><p className="eyebrow">Non-negotiable rules</p><h2>Missing is a finding, not a zero.</h2></div>
        <ul>
          <li>Missing adoption evidence remains missing unless a separately labeled model is introduced.</li>
          <li>Modeled estimates and observed values are never presented as the same thing.</li>
          <li>Evidence quality may vary by country, industry, population, and measured concept.</li>
          <li>Every score must be reproducible from dated inputs and a declared score version.</li>
          <li>Scores change as capabilities, costs, reliability, and evidence change.</li>
        </ul>
      </section>
    </div>
  );
}
