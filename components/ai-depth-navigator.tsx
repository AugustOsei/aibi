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

interface CountryPractice {
  countryName: string;
  industryNote: string;
  tierGuidance: Record<string, string>;
}

export function AiDepthNavigator({
  levels,
  industryName,
  countryPractice,
}: {
  levels: AiDepthLevel[];
  industryName: string;
  countryPractice?: CountryPractice | undefined;
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
        <p>What’s possible today</p>
        <h2 id={`${instanceId}-heading`}>How {industryName.toLowerCase()} can use AI—from simple help to deeper integration</h2>
        <span>We’ve grouped the opportunities into three levels. Together, they show the range of practical AI use available to {industryName.toLowerCase()} today.</span>
      </header>

      <div className="ai-capability-range" aria-label="AI capabilities available today">
        <div>
          <p>Today’s AI range</p>
          <span>Technology type does not determine the level by itself. Voice or vision can be Standard; autonomy and system access create the deeper implementation.</span>
        </div>
        <ul>
          <li>Language & documents</li>
          <li>Voice & conversation</li>
          <li>Vision & multimodal</li>
          <li>Prediction & optimization</li>
          <li>Connected workflows</li>
          <li>Agentic systems</li>
        </ul>
      </div>

      <div className="simple-level-tabs" role="tablist" aria-label="AI utilization level">
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
              <div><strong>{level.title}</strong><small>{index === 0 ? "Mainstream, person-controlled" : index === 1 ? "Connected to your systems" : "Agentic, approval-gated"}</small></div>
            </button>
          );
        })}
      </div>

      <div className="simple-level-panel" id={`${instanceId}-panel-${activeLevel.id}`} role="tabpanel" aria-labelledby={`${instanceId}-tab-${activeLevel.id}`}>
        <header>
          <div><p>Showing</p><h3>{activeLevel.title}</h3></div>
          <p>{activeLevel.description}</p>
        </header>
        {countryPractice ? (
          <aside className="country-practice-note" aria-label={`${activeLevel.title} considerations for ${countryPractice.countryName}`}>
            <span>{countryPractice.countryName} · {activeLevel.title}</span>
            <p>{countryPractice.tierGuidance[activeLevel.id]}</p>
            <small>{countryPractice.industryNote}</small>
          </aside>
        ) : null}
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
