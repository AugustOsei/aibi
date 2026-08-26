import type { IndustryGapView } from "../src/application/aibi-service";

export function UtilizationGapPanel({ gap }: { gap: IndustryGapView }) {
  const headline = gap.status === "numeric"
    ? `${gap.value} percentage-point utilization gap`
    : gap.status === "directional"
      ? `${gap.direction} directional utilization gap`
      : "We can’t honestly put one number on it yet.";
  const observedLabel = gap.status === "numeric"
    ? "Task-aligned, normalized evidence"
    : gap.status === "directional"
      ? "Sufficient aligned evidence for direction only"
      : "Partial, differently defined evidence";
  return (
    <section id="utilization-gap" className="utilization-gap" aria-labelledby="utilization-gap-heading">
      <header>
        <p className="eyebrow">The gap</p>
        <h2 id="utilization-gap-heading">{headline}</h2>
        <p>AIBI compares evidence only when Possible and Actual map to the same business functions, tasks, utilization depth, geography, and scale. Numeric, directional, and insufficient results follow separate evidence thresholds.</p>
        <small>{gap.explanation}</small>
      </header>
      <div className="utilization-gap__comparison" aria-label={`Gap result: ${gap.label}`}>
        <div>
          <span>Possible utilization</span>
          <strong>Task-level opportunity spectrum</strong>
          <i aria-hidden="true" />
        </div>
        <div>
          <span>Observed utilization</span>
          <strong>{observedLabel}</strong>
          <i aria-hidden="true" />
        </div>
        <p><span aria-hidden="true">{gap.status === "numeric" ? "−" : gap.status === "directional" ? "→" : "≠"}</span> {gap.label}</p>
      </div>
    </section>
  );
}
