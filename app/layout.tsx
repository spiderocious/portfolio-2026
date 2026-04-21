import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { ThemeToggle } from "@/components/theme-toggle";
import { LlmPopupMount } from "@/features/public/ui/llm-popup/llm-popup-mount";
import { SITE } from "@/lib/seo/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author.name, url: SITE.url }],
  creator: SITE.author.name,
  publisher: SITE.author.name,
  keywords: SITE.keywords,
  category: "technology",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE.url,
    languages: { "en-US": SITE.url },
    types: {
      "application/rss+xml": `${SITE.social.blog}/rss.xml`,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    creator: SITE.handle,
    site: SITE.handle,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/feranmi.png", type: "image/png", sizes: "any" },
    ],
    apple: [{ url: "/feranmi.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon.png"],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.BING_SITE_VERIFICATION ?? "",
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F0E8" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ThemeToggle />
          {children}
          <LlmPopupMount />
        </ThemeProvider>
      </body>
    </html>
  );
}
