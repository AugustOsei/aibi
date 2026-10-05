import type { Metadata } from "next";

import { HomeSections } from "../components/home-sections";
import { StreetHero } from "../components/street-hero";
import { createPageMetadata } from "../src/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "AI Opportunity vs Adoption by Industry",
  description: "Pick a country and an industry to see practical ways a business can use today’s AI, check what yours already does, and see how many businesses report using AI.",
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
