import type { LawFirmIndustryView } from "../src/application/aibi-service";

export function AdoptionEvidencePanel({ actual }: { actual: LawFirmIndustryView["actual"] }) {
  return (
    <section className="adoption-evidence" aria-labelledby="adoption-evidence-heading">
      <div className="section-heading section-heading--rule section-heading--split">
        <div>
          <p className="eyebrow">Observed utilization</p>
          <h2 id="adoption-evidence-heading">What law firms appear to be doing</h2>
        </div>
        <p>{actual.detail}</p>
      </div>

      <div className="adoption-note">
        <strong>No combined Observed Utilization score yet.</strong>
        <span>These percentages answer different questions. They are not averaged or subtracted from the Possible AI Utilization analysis.</span>
      </div>

      <div className="adoption-observation-list">
        {actual.observations.map((observation, index) => (
          <article key={observation.id} className="adoption-observation">
            <p className="adoption-observation__index">{String(index + 1).padStart(2, "0")}</p>
            <div className="adoption-observation__value">
              <strong>{observation.value}</strong><span>%</span>
            </div>
            <div className="adoption-observation__copy">
              <p className="adoption-observation__scope">{observation.scopeLabel}</p>
              <h3>{observation.label}</h3>
              <p>{observation.geography}</p>
              <details>
                <summary>Method and source</summary>
                <dl>
                  <div><dt>Measured population</dt><dd>{observation.denominator}</dd></div>
                  <div><dt>AI definition</dt><dd>{observation.aiDefinition}</dd></div>
                  <div><dt>Observation period</dt><dd>{observation.period}</dd></div>
                  <div><dt>Evidence</dt><dd>Grade {observation.evidenceGrade} · {observation.confidence} confidence</dd></div>
                  {observation.limitations.length > 0 ? (
                    <div><dt>Limitations</dt><dd>{observation.limitations.join("; ")}</dd></div>
                  ) : null}
                </dl>
                {observation.source.url ? (
                  <a href={observation.source.url} target="_blank" rel="noreferrer">
                    {observation.source.title} · {observation.source.publisher} ↗
                  </a>
                ) : (
                  <p>{observation.source.title} · {observation.source.publisher}</p>
                )}
              </details>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
