import type { LawFirmIndustryView } from "../src/application/aibi-service";

export function ComparisonPanel({ view }: { view: LawFirmIndustryView }) {
  return (
    <section className="comparison" aria-labelledby="comparison-heading">
      <div className="section-heading section-heading--rule">
        <p className="eyebrow">Adoption and opportunity</p>
        <h2 id="comparison-heading">What is measured—and what is not yet comparable</h2>
      </div>
      <div className="comparison__grid">
        <article className="comparison-card comparison-card--possible">
          <p className="comparison-card__index">01</p>
          <p className="comparison-card__label">Experimental task-practicality index</p>
          <p className="comparison-card__score">{view.possible.value}<span>/100</span></p>
          <p>A weighted research index for this representative law firm. It is not an automation percentage or adoption rate.</p>
          <p className="comparison-card__meta">Effective {view.possible.effectiveDate} · Baseline v{view.possible.version}</p>
        </article>
        <article className="comparison-card comparison-card--unknown">
          <p className="comparison-card__index">02</p>
          <p className="comparison-card__label">Actual</p>
          <p className="comparison-card__state">{view.actual.label}</p>
          <p>{view.actual.detail}</p>
          <p className="comparison-card__meta">{view.actual.observations.length} direct observations · not normalized</p>
        </article>
        <article className="comparison-card comparison-card--unknown">
          <p className="comparison-card__index">03</p>
          <p className="comparison-card__label">Gap</p>
          <p className="comparison-card__state">{view.gap.label}</p>
          <p>The utilization gap will appear only after compatible adoption evidence is available.</p>
          <p className="comparison-card__meta">Unknown ≠ zero</p>
        </article>
      </div>
    </section>
  );
}
