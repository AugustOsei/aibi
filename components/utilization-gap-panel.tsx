export function UtilizationGapPanel({ reason }: { reason: string }) {
  return (
    <section id="utilization-gap" className="utilization-gap" aria-labelledby="utilization-gap-heading">
      <header>
        <p className="eyebrow">Utilization gap</p>
        <h2 id="utilization-gap-heading">Gap: Not yet quantifiable</h2>
        <p>{reason}</p>
      </header>
      <div className="utilization-gap__comparison" aria-label="Possible and observed utilization cannot yet be compared numerically">
        <div>
          <span>Possible utilization</span>
          <strong>Task-level opportunity spectrum</strong>
          <i aria-hidden="true" />
        </div>
        <div>
          <span>Observed utilization</span>
          <strong>Partial, differently defined evidence</strong>
          <i aria-hidden="true" />
        </div>
        <p><span aria-hidden="true">≠</span> Not comparable yet</p>
      </div>
    </section>
  );
}
