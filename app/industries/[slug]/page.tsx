import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { IndustryPageBody } from "../../../components/industry-page";
import { getCountrySummary, getIndustrySummaries, getIndustrySummary } from "../../../src/application/aibi-service";
import { industryQuestion } from "../../../src/config/phrases";
import { createPageMetadata } from "../../../src/config/site";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ country?: string }>;
};

export function generateStaticParams() {
  return getIndustrySummaries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustrySummary(slug);
  if (!industry) return createPageMetadata({
    title: "Industry AI Outlook",
    description: "Explore possible AI utilization and observed adoption evidence by industry.",
    path: `/industries/${slug}`,
  });
  return createPageMetadata({
    title: industryQuestion(industry.slug, industry.name),
    description: `Practical ways ${industry.name.toLowerCase()} can use today’s AI, starting with tools that need no special setup.`,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { country } = await searchParams;
  if (!getIndustrySummary(slug)) notFound();
  // Older links carried the country as a query string; send them to the clean address.
  if (country && getCountrySummary(country)) permanentRedirect(`/${country}/${slug}`);
  return <IndustryPageBody industrySlug={slug} />;
}
