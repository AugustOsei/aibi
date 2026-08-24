"use client";

import { useId, useRef, useState } from "react";

export interface AiDepthItem {
  id: string;
  title: string;
  outcome: string;
  boundary: string;
  signal?: string;
}

export interface AiDepthLevel {
  id: string;
  title: string;
  description: string;
  items: AiDepthItem[];
}

export function AiDepthNavigator({
  levels,
}: {
  levels: AiDepthLevel[];
}) {
  const [activeLevelIndex, setActiveLevelIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const instanceId = useId().replaceAll(":", "");
  const activeLevel = levels[activeLevelIndex];

  if (!activeLevel) return null;

  const selectLevel = (index: number) => {
    setActiveLevelIndex(index);
    tabRefs.current[index]?.focus();
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? levels.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + levels.length) % levels.length;
    selectLevel(nextIndex);
  };

  return (
    <section id="possible-utilization" className="simple-ai-guide" aria-labelledby={`${instanceId}-heading`}>
      <header className="simple-ai-guide__header">
        <p>Possible AI utilization</p>
        <h2 id={`${instanceId}-heading`}>What today’s AI could practically be used for</h2>
        <span>Standard, Integrated and Advanced form one complete opportunity spectrum. Explore each depth below.</span>
      </header>

      <div className="simple-level-tabs" role="tablist" aria-label="Possible AI utilization depth">
        {levels.map((level, index) => {
          const isActive = index === activeLevelIndex;
          return (
            <button
              key={level.id}
              ref={(node) => { tabRefs.current[index] = node; }}
              id={`${instanceId}-tab-${level.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${instanceId}-panel-${level.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectLevel(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              <span>{index + 1}</span>
              <div><strong>{level.title}</strong><small>{index === 0 ? "Easy to start" : index === 1 ? "Connected to your systems" : "More advanced, with human control"}</small></div>
            </button>
          );
        })}
      </div>

      <div className="simple-level-panel" id={`${instanceId}-panel-${activeLevel.id}`} role="tabpanel" aria-labelledby={`${instanceId}-tab-${activeLevel.id}`}>
        <header>
          <div><p>Showing</p><h3>{activeLevel.title}</h3></div>
          <p>{activeLevel.description}</p>
        </header>
        <ol className="simple-use-list">
          {activeLevel.items.map((item, index) => (
            <li key={item.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="simple-use-list__title"><h4>{item.title}</h4>{item.signal ? <small>{item.signal}</small> : null}</div>
                <p>{item.outcome}</p>
                <details>
                  <summary>What people still decide</summary>
                  <p>{item.boundary}</p>
                </details>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
