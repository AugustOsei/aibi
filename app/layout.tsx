import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Instrument_Sans, Inter, Newsreader } from "next/font/google";

import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { SITE_NAME, SITE_URL } from "../src/config/site";
import "./globals.css";
import "./atlas.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-plain", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: "Artificial Intelligence Business Index — AI Opportunity vs Adoption", template: "%s | AIBI" },
  description: "Practical ways a business can use today’s AI, industry by industry and country by country, with reported AI use shown where official surveys exist.",
  keywords: [
    "AI applications by industry",
    "how industries use AI",
    "artificial intelligence industry impact",
    "AI operations improvement",
    "AI adoption by industry",
    "AI utilization gap",
    "AI opportunity vs adoption",
  ],
  openGraph: {
    title: "Artificial Intelligence Business Index — AI Opportunity vs Adoption",
    description: "Pick a country and an industry to see practical uses of today’s AI, check what your business already does, and see how many businesses report using AI.",
    type: "website",
    siteName: SITE_NAME,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Opportunity vs Adoption by Industry | AIBI",
    description: "Practical AI uses by industry and country, with reported business use where surveys exist.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f2ea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} ${instrument.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
