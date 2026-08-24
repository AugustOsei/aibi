import type { CountryPracticalContext, IndustryOutlook } from "../src/data/industry-outlooks";
import { AiDepthNavigator } from "./ai-depth-navigator";

export function IndustryCapabilityOutlook({
  outlook,
  countryContext,
}: {
  outlook: IndustryOutlook;
  countryContext?: CountryPracticalContext | undefined;
}) {
  const levels = outlook.tiers.map((outlookTier) => ({
    id: outlookTier.id,
    title: outlookTier.title,
    description: outlookTier.description,
    items: outlookTier.useCases.map((useCase) => ({
      id: useCase.id,
      title: useCase.title,
      outcome: useCase.outcome,
      boundary: useCase.humanBoundary,
    })),
  }));

  return (
    <>
      <section className="capability-outlook" aria-labelledby="capability-outlook-heading">
        <h2 id="capability-outlook-heading" className="sr-only">Complete possible AI utilization spectrum</h2>
        <AiDepthNavigator levels={levels} />

        <details className="capability-basis">
          <summary>Research basis and limitations</summary>
          <p>This is a qualitative capability outlook, not an adoption claim or a completed numeric baseline. Use cases are grounded in the industry&apos;s work and current general AI capabilities; scoring requires task weights and sector-specific validation.</p>
          <ul>
            {outlook.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>
                <span>{source.publisher} · {source.note}</span>
              </li>
            ))}
          </ul>
        </details>
      </section>

      {countryContext ? <CountryPracticalLens context={countryContext} /> : null}
    </>
  );
}

export function CountryPracticalLens({ context }: { context: CountryPracticalContext }) {
  return (
    <section className="practical-lens" aria-labelledby={`practical-lens-${context.slug}`}>
      <header>
        <p className="eyebrow">Deployment context · {context.name}</p>
        <h2 id={`practical-lens-${context.slug}`}>Deployment context in {context.name}</h2>
        <p>{context.framing}</p>
      </header>
      <p className="practical-lens__disclaimer">This context does not currently change the Possible AI Utilization analysis or any experimental score.</p>
      <div className="practical-lens__factors">
        {context.factors.map((factor, index) => (
          <article key={factor.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{factor.title}</h3>
            <p>{factor.detail}</p>
          </article>
        ))}
      </div>
      <footer>
        <span>Country basis</span>
        {context.sources.map((source) => (
          <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.publisher}: {source.title} ↗</a>
        ))}
      </footer>
    </section>
  );
}
