import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { IndustryPageBody } from "../../../components/industry-page";
import { getCountrySummaries, getCountrySummary, getIndustrySummaries, getIndustrySummary } from "../../../src/application/aibi-service";
import { industryQuestion } from "../../../src/config/phrases";
import { createPageMetadata } from "../../../src/config/site";

type Props = { params: Promise<{ country: string; industry: string }> };

// Only real country and industry pairs exist here; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getCountrySummaries().flatMap((country) =>
    getIndustrySummaries().map((industry) => ({ country: country.slug, industry: industry.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: countrySlug, industry: industrySlug } = await params;
  const country = getCountrySummary(countrySlug);
  const industry = getIndustrySummary(industrySlug);
  if (!country || !industry) return {};
  const question = industryQuestion(industry.slug, industry.name, country.name);
  return createPageMetadata({
    title: question,
    socialTitle: question,
    description: `Practical ways ${industry.name.toLowerCase()} in ${country.name} can use today’s AI, starting with tools that need no special setup.`,
    path: `/${country.slug}/${industry.slug}`,
  });
}

export default async function CountryIndustryPage({ params }: Props) {
  const { country, industry } = await params;
  if (!getCountrySummary(country) || !getIndustrySummary(industry)) notFound();
  return <IndustryPageBody industrySlug={industry} countrySlug={country} />;
}
