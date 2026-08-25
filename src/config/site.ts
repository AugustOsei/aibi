import type { Metadata } from "next";

export const SITE_NAME = "Artificial Intelligence Business Index";
export const SITE_URL = "https://www.knowaibi.com";

export const createPageMetadata = ({
  title,
  description,
  path,
  socialTitle = `${title} | AIBI`,
}: {
  title: string;
  description: string;
  path: string;
  socialTitle?: string;
}): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title: socialTitle,
    description,
    url: path,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description,
  },
});
