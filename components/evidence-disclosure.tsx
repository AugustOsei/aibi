import type { TaskBaselineView } from "../src/application/aibi-service";

export function EvidenceDisclosure({ task }: { task: TaskBaselineView }) {
  return (
    <details className="evidence-disclosure">
      <summary>Inspect evidence</summary>
      <div className="evidence-disclosure__body">
        {task.capabilities.length === 0 ? (
          <p>No capability is mapped because this work is not considered practically appropriate for AI execution.</p>
        ) : task.capabilities.map((capability) => (
          <article key={capability.id} className="evidence-item">
            <div>
              <p className="evidence-item__capability">{capability.name}</p>
              <p>Capability v{capability.version} · effective {capability.effectiveDate}</p>
            </div>
            <ul>
              {capability.sources.map((source) => (
                <li key={`${capability.id}-${source.title}`}>
                  {source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> : source.title}
                  <span>{source.publisher}{source.publicationDate ? ` · ${source.publicationDate}` : ""}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </details>
  );
}
