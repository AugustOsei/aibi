import { AI_CAPABILITY_HORIZON } from "../src/data/ai-capability-horizon";

const statusLabel = {
  mainstream: "Mainstream",
  commercially_available: "Commercially available",
  integration_heavy: "Integration-heavy",
  emerging: "Emerging",
} as const;

export function CapabilityHorizon() {
  const horizon = AI_CAPABILITY_HORIZON;
  return (
    <section className="capability-horizon" aria-labelledby="capability-horizon-title">
      <header>
        <div>
          <p className="eyebrow">Dated capability snapshot</p>
          <h2 id="capability-horizon-title">What AI can do now</h2>
        </div>
        <div className="capability-horizon__stamp" aria-label={`AI capability horizon version ${horizon.version}`}>
          <span>AI Horizon</span>
          <strong>{horizon.version}</strong>
          <small>Effective <time dateTime={horizon.effectiveDate}>August 27, 2026</time></small>
        </div>
        <p>{horizon.summary}</p>
      </header>

      <div className="capability-horizon__items">
        {horizon.capabilities.map((capability, index) => (
          <article key={capability.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <small>{statusLabel[capability.status]}</small>
              <h3>{capability.name}</h3>
              <p>{capability.summary}</p>
            </div>
          </article>
        ))}
      </div>

      <details className="capability-horizon__basis">
        <summary>Evidence, scope and limitations</summary>
        <div>
          <p>{horizon.limitation} Last reviewed <time dateTime={horizon.lastReviewed}>August 27, 2026</time>.</p>
          <ul>
            {horizon.sources.map((source) => (
              <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.publisher}: {source.title} ↗</a></li>
            ))}
          </ul>
        </div>
      </details>
    </section>
  );
}
