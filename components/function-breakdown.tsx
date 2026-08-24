import type { FunctionBaselineView } from "../src/application/aibi-service";
import { EvidenceDisclosure } from "./evidence-disclosure";
import { ScoreBar } from "./score-bar";

export function FunctionBreakdown({ functions }: { functions: FunctionBaselineView[] }) {
  return (
    <section className="function-section" aria-labelledby="function-heading">
      <div className="section-heading section-heading--rule section-heading--split">
        <div>
          <p className="eyebrow">Explore every function</p>
          <h2 id="function-heading">See the tasks behind the potential</h2>
        </div>
        <p>Scores describe bounded practical use, not permission to automate professional responsibility.</p>
      </div>
      <div className="function-list">
        {functions.map((businessFunction, index) => (
          <details className="function-row" key={businessFunction.id} open={index < 2}>
            <summary>
              <span className="function-row__index">{String(index + 1).padStart(2, "0")}</span>
              <span className="function-row__name">{businessFunction.name}</span>
              <ScoreBar value={businessFunction.practicality} label={businessFunction.name} />
              <span className="function-row__action">Details</span>
            </summary>
            <div className="task-table">
              <div className="task-table__header" aria-hidden="true">
                <span>Task</span><span>Score</span><span>AI role</span><span>Primary constraint</span><span>Confidence</span>
              </div>
              {businessFunction.tasks.map((task) => (
                <article className="task-row" key={task.id}>
                  <div className="task-row__name">
                    <h3>{task.name}</h3>
                    <EvidenceDisclosure task={task} />
                  </div>
                  <p className="task-row__metric" data-label="Score"><strong>{task.practicality}</strong>/100</p>
                  <p data-label="AI role"><span className={`role-pill role-pill--${task.role}`}>{task.roleLabel}</span></p>
                  <p data-label="Primary constraint">{task.limitingFactor}</p>
                  <p data-label="Confidence"><span className="confidence-dot" aria-hidden="true" />{task.evidenceConfidence}</p>
                </article>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
