export function UtilizationGapPanel({ reason }: { reason: string }) {
  return (
    <section id="utilization-gap" className="utilization-gap" aria-labelledby="utilization-gap-heading">
      <header>
        <p className="eyebrow">The gap</p>
        <h2 id="utilization-gap-heading">We can’t honestly put one number on it yet.</h2>
        <p>AIBI maps AI opportunity task by task, while today’s adoption studies often measure broader things such as whether businesses use AI or how often they use it. Until those measures line up, we’d rather show the evidence clearly than manufacture a precise gap score.</p>
        <small>{reason}</small>
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
