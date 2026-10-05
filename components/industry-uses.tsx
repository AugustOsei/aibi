"use client";

import { useEffect, useMemo, useState } from "react";

import type { CommonBusinessFunction } from "../src/data/ai-capability-horizon";
import type { IndustryOutlookTier, OutlookTierId } from "../src/data/industry-outlooks";

const FURTHER: Array<{ id: OutlookTierId; name: string }> = [
  { id: "integrated", name: "Connected to your systems" },
];

// `id` is the permanent identifier saved with a visitor's ticks.
type Row = { id: string; title: string; outcome: string; boundary: string; area?: string };

const rowsFor = (tier: IndustryOutlookTier, commonFunctions: CommonBusinessFunction[]) => ({
  specific: tier.useCases.map((useCase): Row => ({
    id: useCase.id, title: useCase.title, outcome: useCase.outcome, boundary: useCase.humanBoundary,
  })),
  shared: commonFunctions.map((item): Row => {
    const opportunity = item.opportunities[tier.id];
    return { id: `fn-${item.id}`, area: item.name, title: opportunity.title, outcome: opportunity.outcome, boundary: opportunity.humanBoundary };
  }),
});

function Rows({ rows, ticked, onToggle }: { rows: Row[]; ticked?: Set<string>; onToggle?: (id: string) => void }) {
  return (
    <ol data-checkable={onToggle ? true : undefined}>
      {rows.map((row, index) => (
        <li key={row.id}>
          {onToggle ? (
            <button
              type="button"
              className="ind-tick"
              role="checkbox"
              aria-checked={ticked?.has(row.id) ?? false}
              aria-label={`We already do this: ${row.title}`}
              onClick={() => onToggle(row.id)}
            />
          ) : null}
          <details>
            <summary>
              {onToggle ? null : <span>{String(index + 1).padStart(2, "0")}</span>}
              <strong>{row.area ? <small>{row.area}</small> : null}{row.title}</strong>
              <i aria-hidden="true" />
            </summary>
            <div>
              <p>{row.outcome}</p>
              <p className="ind-uses__people"><b>People stay in charge</b>{row.boundary}</p>
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}

export function IndustryUses({ tiers, industryName, commonFunctions, countryName, tierGuidance, storageKey, shareUrl, shareSubject }: {
  tiers: IndustryOutlookTier[];
  industryName: string;
  commonFunctions: CommonBusinessFunction[];
  countryName?: string | undefined;
  tierGuidance?: Record<OutlookTierId, string> | undefined;
  storageKey: string;
  shareUrl: string;
  shareSubject: string;
}) {
  const standard = tiers.find(({ id }) => id === "standard");
  const main = useMemo(() => (standard ? rowsFor(standard, commonFunctions) : { specific: [], shared: [] }), [standard, commonFunctions]);
  const all = useMemo(() => [...main.specific, ...main.shared], [main]);
  const [ticked, setTicked] = useState<Set<string>>(new Set());
  const [started, setStarted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Ticks stay in this browser only; nothing is sent anywhere.
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) ?? "null") as unknown;
      if (Array.isArray(saved)) {
        const valid = new Set(all.map(({ id }) => id));
        setTicked(new Set(saved.filter((id): id is string => typeof id === "string" && valid.has(id))));
        setStarted(true);
      }
    } catch {
      // Storage can be unavailable in private windows; the check still works for this visit.
    }
  }, [storageKey, all]);

  const persist = (next: Set<string>) => {
    try { window.localStorage.setItem(storageKey, JSON.stringify([...next])); } catch { /* see above */ }
  };
  // Built from the previous state so quick successive taps are never lost.
  const toggle = (id: string) => {
    setStarted(true);
    setTicked((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
      persist(next);
      return next;
    });
  };
  const clear = () => {
    setTicked(new Set());
    setStarted(false);
    try { window.localStorage.removeItem(storageKey); } catch { /* see above */ }
  };

  if (!standard) return null;

  const count = ticked.size;
  const total = all.length;
  const next = all.filter(({ id }) => !ticked.has(id)).slice(0, 3);
  const shareText = `We already use ${count} of ${total} everyday AI uses for ${shareSubject}. Check your business: ${shareUrl}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="ind-uses">
      <div className="ind-uses__panel">
        <p className="ind-uses__about">These use ready-made AI tools that a person starts, checks and controls. No special setup is needed.</p>
        {countryName && tierGuidance ? (
          <p className="ind-uses__local"><b>In {countryName}</b>{tierGuidance.standard}</p>
        ) : null}
        <p className="ind-uses__prompt">
          <span>Tick the ones your business already does.</span>
          <b aria-live="polite">{count} of {total}</b>
        </p>

        <h3>In the core work of {industryName.toLowerCase()}</h3>
        <Rows rows={main.specific} ticked={ticked} onToggle={toggle} />

        <h3>Across the rest of the business</h3>
        <Rows rows={main.shared} ticked={ticked} onToggle={toggle} />
      </div>

      <section className="ind-result" aria-labelledby="ind-result-heading" data-started={started}>
        <p className="home-label">Your result</p>
        {started ? (
          <>
            <h3 id="ind-result-heading">You already use <strong>{count} of {total}</strong>.</h3>
            <div className="ind-result__bar" role="img" aria-label={`${count} of ${total} uses ticked`}>
              {all.map(({ id }) => <i key={id} data-on={ticked.has(id)} />)}
            </div>
            {next.length > 0 ? (
              <div className="ind-result__next">
                <p>{count === 0 ? "Three to start with" : "Three to try next"}</p>
                <ul>{next.map(({ id, title }) => <li key={id}>{title}</li>)}</ul>
              </div>
            ) : (
              <p className="ind-result__done">That is every use on this list. “Going further” below shows what comes after.</p>
            )}
            <div className="ind-result__actions">
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer">Share on WhatsApp</a>
              <button type="button" onClick={copy}>{copied ? "Copied" : "Copy result"}</button>
              <button type="button" className="is-quiet" onClick={clear}>Clear my ticks</button>
            </div>
            <p className="ind-result__note">Your ticks stay on this device. Nothing is sent to AIBI.</p>
          </>
        ) : (
          <h3 id="ind-result-heading">Tick what your business already does to see where you stand.</h3>
        )}
      </section>

      <details className="ind-uses__further">
        <summary>
          <strong>Going further</strong>
          <span>For businesses already comfortable with the basics: AI connected to your own records and software.</span>
        </summary>
        {FURTHER.map(({ id, name }) => {
          const tier = tiers.find((item) => item.id === id);
          if (!tier) return null;
          const { specific, shared } = rowsFor(tier, commonFunctions);
          return (
            <div key={id} className="ind-uses__panel" data-level={id}>
              <h3>{name}</h3>
              <p className="ind-uses__about">{tier.description}</p>
              {countryName && tierGuidance ? (
                <p className="ind-uses__local"><b>In {countryName}</b>{tierGuidance[id]}</p>
              ) : null}
              <Rows rows={[...specific, ...shared]} />
            </div>
          );
        })}
      </details>
    </div>
  );
}
