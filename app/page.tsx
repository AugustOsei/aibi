import type { Metadata } from "next";

import { HomeSections } from "../components/home-sections";
import { StreetHero } from "../components/street-hero";
import { createPageMetadata } from "../src/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "AI Opportunity vs Adoption by Industry",
  description: "Choose a country and industry to explore the complete range of practical AI uses, credible observed utilization, and the evidence gap.",
  path: "/",
  socialTitle: "Artificial Intelligence Business Index — AI Opportunity vs Adoption",
});

export default function OverviewPage() {
  return (
    <>
      <StreetHero />
      <HomeSections />
    </>
  );
}
