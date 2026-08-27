import { COMMON_BUSINESS_FUNCTIONS } from "../src/data/ai-capability-horizon";

const depthLabels = {
  standard: "Standard · create and assist",
  integrated: "Integrated · connect and coordinate",
  advanced: "Advanced · monitor and act",
} as const;

export function CommonBusinessFunctions({ countryName }: { countryName?: string | undefined }) {
  return (
    <section className="common-functions" aria-labelledby="common-functions-title">
      <header>
        <div>
          <p className="eyebrow">Common across most businesses</p>
          <h2 id="common-functions-title">AI opportunities beyond the industry’s core work.</h2>
        </div>
        <p>Every business also markets, sells, serves customers, handles administration and runs internal operations. These shared functions are evaluated alongside the industry-specific opportunities below{countryName ? `, with ${countryName} considerations applied throughout` : ""}.</p>
      </header>

      <div className="common-functions__list">
        {COMMON_BUSINESS_FUNCTIONS.map((businessFunction, index) => (
          <details key={businessFunction.id} open={index === 0}>
            <summary>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{businessFunction.name}</strong>
              <small>{businessFunction.purpose}</small>
            </summary>
            <div className="common-functions__depths">
              {(["standard", "integrated", "advanced"] as const).map((depth) => {
                const opportunity = businessFunction.opportunities[depth];
                return (
                  <article key={depth}>
                    <span>{depthLabels[depth]}</span>
                    <h3>{opportunity.title}</h3>
                    <p>{opportunity.outcome}</p>
                    <details>
                      <summary>Human boundary</summary>
                      <p>{opportunity.humanBoundary}</p>
                    </details>
                  </article>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
