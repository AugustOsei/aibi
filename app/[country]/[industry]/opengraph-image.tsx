import { ImageResponse } from "next/og";

import { getCountrySummaries, getCountrySummary, getIndustrySummaries, getIndustrySummary } from "../../../src/application/aibi-service";
import { industryQuestion } from "../../../src/config/phrases";
import { COMMON_BUSINESS_FUNCTIONS } from "../../../src/data/ai-capability-horizon";
import { getIndustryOutlook } from "../../../src/data/industry-outlooks";

export const alt = "AI Business Index";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getCountrySummaries().flatMap((country) =>
    getIndustrySummaries().map((industry) => ({ country: country.slug, industry: industry.slug })));
}

export default async function Image({ params }: { params: Promise<{ country: string; industry: string }> }) {
  const { country: countrySlug, industry: industrySlug } = await params;
  const country = getCountrySummary(countrySlug);
  const industry = getIndustrySummary(industrySlug);
  const uses = COMMON_BUSINESS_FUNCTIONS.length
    + (getIndustryOutlook(industrySlug)?.tiers.find(({ id }) => id === "standard")?.useCases.length ?? 0);
  const question = industry ? industryQuestion(industry.slug, industry.name, country?.name) : "What can your business use AI for today?";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f5f3ee", color: "#16151a" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "56px 64px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26 }}>
            <div style={{ display: "flex", alignItems: "center", fontWeight: 700, letterSpacing: -1 }}>AIBI</div>
            <div style={{ display: "flex", color: "#615e68" }}>AI Business Index</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 64, fontSize: 24, letterSpacing: 3, textTransform: "uppercase" }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#d9481f", marginRight: 14 }} />
            {`${industry?.name ?? ""}${country ? ` · ${country.name}` : ""}`}
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: question.length > 62 ? 62 : 76, lineHeight: 1.06, letterSpacing: -2.5 }}>
            {question}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 64px", background: "#f5b83d", fontSize: 30 }}>
          <div style={{ display: "flex" }}>{uses} practical uses, with tools available today</div>
          <div style={{ display: "flex" }}>knowaibi.com</div>
        </div>
      </div>
    ),
    size,
  );
}
