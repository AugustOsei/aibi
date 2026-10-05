import type { CommonBusinessFunction } from "../src/data/ai-capability-horizon";
import type { IndustryOutlookTier, OutlookTierId } from "../src/data/industry-outlooks";

const FURTHER: Array<{ id: OutlookTierId; name: string }> = [
  { id: "integrated", name: "Connected to your systems" },
];

type Row = { key: string; title: string; outcome: string; boundary: string; area?: string };

const rowsFor = (tier: IndustryOutlookTier, commonFunctions: CommonBusinessFunction[]) => ({
  specific: tier.useCases.map((useCase): Row => ({
    key: `${tier.id}-${useCase.id}`, title: useCase.title, outcome: useCase.outcome, boundary: useCase.humanBoundary,
  })),
  shared: commonFunctions.map((item): Row => {
    const opportunity = item.opportunities[tier.id];
    return { key: `${tier.id}-${item.id}`, area: item.name, title: opportunity.title, outcome: opportunity.outcome, boundary: opportunity.humanBoundary };
  }),
});

function Rows({ rows }: { rows: Row[] }) {
  return (
    <ol>
      {rows.map((row, index) => (
        <li key={row.key}>
          <details>
            <summary>
              <span>{String(index + 1).padStart(2, "0")}</span>
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

export function IndustryUses({ tiers, industryName, commonFunctions, countryName, tierGuidance }: {
  tiers: IndustryOutlookTier[];
  industryName: string;
  commonFunctions: CommonBusinessFunction[];
  countryName?: string | undefined;
  tierGuidance?: Record<OutlookTierId, string> | undefined;
}) {
  const standard = tiers.find(({ id }) => id === "standard");
  if (!standard) return null;
  const main = rowsFor(standard, commonFunctions);

  return (
    <div className="ind-uses">
      <div className="ind-uses__panel">
        <p className="ind-uses__about">These use ready-made AI tools that a person starts, checks and controls. No special setup is needed.</p>
        {countryName && tierGuidance ? (
          <p className="ind-uses__local"><b>In {countryName}</b>{tierGuidance.standard}</p>
        ) : null}

        <h3>In the core work of {industryName.toLowerCase()}</h3>
        <Rows rows={main.specific} />

        <h3>Across the rest of the business</h3>
        <Rows rows={main.shared} />
      </div>

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
