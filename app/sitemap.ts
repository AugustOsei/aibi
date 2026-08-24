import type { MetadataRoute } from "next";

import { getCountrySummaries, getIndustrySummaries } from "../src/application/aibi-service";
import { SITE_URL } from "../src/config/site";

const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/industries"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/countries"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/methodology"), changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/updates"), changeFrequency: "monthly", priority: 0.6 },
  ];
  const industryRoutes: MetadataRoute.Sitemap = getIndustrySummaries().map(({ slug }) => ({
    url: absoluteUrl(`/industries/${slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  const countryRoutes: MetadataRoute.Sitemap = getCountrySummaries().map(({ slug }) => ({
    url: absoluteUrl(`/countries/${slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...industryRoutes, ...countryRoutes];
}
