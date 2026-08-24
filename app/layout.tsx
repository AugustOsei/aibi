import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter, Newsreader } from "next/font/google";

import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { SITE_NAME, SITE_URL } from "../src/config/site";
import "./globals.css";
import "./atlas.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: "Artificial Intelligence Business Index — AI Opportunity vs Adoption", template: "%s | AIBI" },
  description: "See what industries could be doing with today’s AI, what credible evidence says they are doing, and the utilization gap.",
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
    description: "Explore possible AI utilization by country and industry, review observed utilization evidence, and see where a gap can—or cannot—be measured.",
    type: "website",
    siteName: SITE_NAME,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Opportunity vs Adoption by Industry | AIBI",
    description: "See possible AI utilization, observed industry use, and the evidence gap.",
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
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
