import type { IndustryAdoptionHeadroomView } from "../src/application/aibi-service";

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export function AdoptionHeadroomPanel({ view }: { view: IndustryAdoptionHeadroomView }) {
  if (view.status === "insufficient") {
    return (
      <section className="adoption-headroom" aria-labelledby="adoption-headroom-heading">
        <header className="adoption-headroom__intro">
          <div>
            <p className="eyebrow">Actual reported AI use</p>
            <h2 id="adoption-headroom-heading">Where the industry is now</h2>
          </div>
          <p>We look for one credible country-specific rate covering this industry or its closest reported sector. We do not turn missing evidence into zero.</p>
        </header>
        <div className="adoption-headroom__grid adoption-headroom__grid--empty">
          <article className="adoption-headroom__actual">
            <span className="adoption-headroom__label">Reported Actual</span>
            <strong aria-label="No reported value available">—</strong>
            <h3>No suitable reported rate available</h3>
            <p>{view.reason}</p>
          </article>
          <article className="adoption-headroom__gap">
            <span className="adoption-headroom__label">Hypothetical adoption gap</span>
            <strong aria-label="Gap not calculated">—</strong>
            <h3>Not calculated</h3>
            <p>The Standard AI destination is set at 100%, but the reported Actual ingredient is missing. A gap would be misleading.</p>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="adoption-headroom" aria-labelledby="adoption-headroom-heading">
      <header className="adoption-headroom__intro">
        <div>
          <p className="eyebrow">Actual reported AI use</p>
          <h2 id="adoption-headroom-heading">Where the industry is now</h2>
        </div>
        <p>We use the closest suitable reported adoption rate for {view.industry.name.toLowerCase()} in {view.country.name}, then compare it with the Standard AI destination shown above.</p>
      </header>

      <div className="adoption-headroom__grid">
        <article className="adoption-headroom__actual">
          <span className="adoption-headroom__label">Reported Actual · sector proxy</span>
          <strong>{formatPercent(view.actual.value)}</strong>
          <h3>{view.actual.sectorLabel}</h3>
          <p>{view.actual.measuredConcept}</p>
          <dl>
            <div><dt>Country</dt><dd>{view.country.name}</dd></div>
            <div><dt>Period</dt><dd>{view.actual.period}</dd></div>
            <div><dt>Evidence</dt><dd>Grade {view.actual.evidenceGrade} · {view.actual.confidence} confidence</dd></div>
          </dl>
        </article>

        <article className="adoption-headroom__gap">
          <span className="adoption-headroom__label">Hypothetical adoption gap</span>
          <strong>{view.headroom.value.toFixed(1)}<small> pp</small></strong>
          <h3>Headroom to the Standard AI destination</h3>
          <div className="adoption-headroom__formula">
            <span>Destination {view.destination.value}%</span>
            <span>− Actual {formatPercent(view.actual.value)}</span>
            <b>= {view.headroom.value.toFixed(1)} percentage points</b>
          </div>
          <p>{view.snapshotNote}</p>
        </article>
      </div>

      <details className="adoption-headroom__evidence">
        <summary>How this snapshot was assembled</summary>
        <div>
          <p><strong>What 100% means.</strong> {view.destination.definition} It does not mean 100% automation or task coverage.</p>
          <p><strong>Why this rate was selected.</strong> {view.actual.mappingNote}</p>
          {view.actual.derivation ? <p><strong>Derivation.</strong> {view.actual.derivation}</p> : null}
          <p><strong>Source method.</strong> {view.actual.source.methodology}</p>
          {view.actual.source.url ? (
            <a href={view.actual.source.url} target="_blank" rel="noreferrer">
              {view.actual.source.publisher}: {view.actual.source.title} ↗
            </a>
          ) : null}
        </div>
      </details>
    </section>
  );
}
