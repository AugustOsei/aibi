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
      <section className="method-principles" aria-labelledby="ai-depth-method">
        <div><p className="eyebrow">AI in practice</p><h2 id="ai-depth-method">The levels describe implementation depth—not the media AI uses.</h2></div>
        <ul>
          <li><strong>Standard AI</strong> covers mainstream language, document, voice or image assistance that a person starts, checks and controls.</li>
          <li><strong>Integrated AI</strong> connects approved business data and systems for bounded multi-step workflows with defined access and ownership.</li>
          <li><strong>Advanced AI</strong> covers continuous, multimodal or agentic systems that can plan and prepare actions across tools, with approval gates and accountable people.</li>
          <li>Voice, vision or multimodal generation is not automatically Advanced. Depth depends on integration, autonomy, risk and operational control.</li>
          <li>Country guidance describes the practical implementation path for the selected industry; it does not change the underlying global capability assessment.</li>
        </ul>
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
      <section className="method-principles" aria-labelledby="hypothetical-headroom-method">
        <div><p className="eyebrow">Illustrative snapshot</p><h2 id="hypothetical-headroom-method">How the hypothetical adoption gap works.</h2></div>
        <ul>
          <li>The Standard AI destination is fixed at 100%: businesses in the industry using at least one applicable Standard AI opportunity. It is not 100% automation or task coverage.</li>
          <li>Actual is one reported country-industry rate, or the closest disclosed broad-sector proxy when no narrower rate is available.</li>
          <li>The displayed headroom is 100% minus that reported Actual, expressed in percentage points. It is not the scientific task-utilization Gap Score.</li>
          <li>Rates with different questions or periods are not combined, averaged, or silently converted.</li>
          <li>If no suitable current reported rate exists, Actual and the hypothetical gap remain empty.</li>
          <li>Every result is a dated snapshot and can change as newer or more specific evidence is found.</li>
        </ul>
      </section>
    </div>
  );
}
