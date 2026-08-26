import type { CountryPracticalContext, IndustryOutlook } from "../src/data/industry-outlooks";
import { AiDepthNavigator } from "./ai-depth-navigator";

const countryInSentence = (name: string) => ["United Kingdom", "United States"].includes(name) ? `the ${name}` : name;

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
        <AiDepthNavigator levels={levels} industryName={outlook.name} />

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

      {countryContext ? <CountryPracticalLens context={countryContext} industryName={outlook.name} /> : null}
    </>
  );
}

export function CountryPracticalLens({
  context,
  industryName,
}: {
  context: CountryPracticalContext;
  industryName: string;
}) {
  if (context.factors.length === 0 || context.sources.length === 0) return null;
  const sentenceCountry = countryInSentence(context.name);
  return (
    <section className="practical-lens" aria-labelledby={`practical-lens-${context.slug}`}>
      <header>
        <p className="eyebrow">Country considerations</p>
        <h2 id={`practical-lens-${context.slug}`}>Using AI in {context.name}</h2>
        <p>The opportunities above show what {industryName.toLowerCase()} could do with today’s AI tools. This section highlights a few country-specific factors that may shape how those ideas are put into practice in {sentenceCountry}—including privacy rules, local business conditions, infrastructure, tool availability, language, or sector constraints. {context.framing}</p>
      </header>
      <p className="practical-lens__disclaimer"><span>Method note</span> For now, these local factors are guidance only; they do not change the Possible analysis.</p>
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
        <span>Sources</span>
        {context.sources.map((source) => (
          <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.publisher}: {source.title} ↗</a>
        ))}
      </footer>
    </section>
  );
}
