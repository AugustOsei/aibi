import type { Metadata } from "next";

import { AtlasExplorer } from "../components/atlas-explorer";
import { getCountrySummaries, getIndustrySummaries } from "../src/application/aibi-service";

export const metadata: Metadata = {
  title: "AI Applications by Industry: Uses & Impact | AIBI",
  description: "Discover how industries can use today’s AI to improve operations, from standard tools to integrated and advanced applications, with regional context.",
};

export default function OverviewPage() {
  return <AtlasExplorer countries={getCountrySummaries()} industries={getIndustrySummaries()} />;
}
