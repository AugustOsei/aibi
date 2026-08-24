export function ScoreBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="score-bar" aria-label={`${label}: ${value} out of 100`}>
      <div className="score-bar__track" aria-hidden="true">
        <span className="score-bar__fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      <span className="score-bar__value">{value.toFixed(1)}</span>
    </div>
  );
}
