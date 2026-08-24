import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";

import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import "./globals.css";
import "./atlas.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: { default: "AI Applications by Industry | Artificial Intelligence Business Index", template: "%s | AIBI" },
  description: "Explore practical AI applications by industry, from standard automation to advanced human-led workflows, with regional context and adoption evidence.",
  keywords: [
    "AI applications by industry",
    "how industries use AI",
    "artificial intelligence industry impact",
    "AI operations improvement",
    "AI adoption by industry",
    "AI utilization gap",
  ],
  openGraph: {
    title: "AI Applications by Industry | AIBI",
    description: "See how today’s AI can improve industry operations—from everyday tools to advanced, human-led applications.",
    type: "website",
    siteName: "Artificial Intelligence Business Index",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Applications by Industry | AIBI",
    description: "Explore what today’s AI makes possible across industries and regions.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f2ea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
