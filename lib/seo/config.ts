/**
 * Central SEO config — single source of truth for site-wide metadata,
 * structured-data identity, and social-card defaults.
 */

export const SITE = {
  name: "Feranmi Adeniji",
  shortName: "Feranmi",
  handle: "@devferanmi",
  url: "https://devferanmi.xyz",
  locale: "en_US",
  /** H1 / page title tagline */
  tagline: "Senior Software Engineer · Lagos, Nigeria",
  /** Long-form description used on the landing + OG fallback */
  description:
    "Oluwaferanmi Adeniji — senior software engineer in Lagos, Nigeria. 7+ years shipping fintech systems, developer tools, and AI-powered products. Currently at Moniepoint: frontend systems serving 10M+ users and processing $1B+ annually. Open-source maintainer of Connectic and Monie Utils.",
  /** Short punchy description for snippets / meta */
  shortDescription:
    "Senior software engineer in Lagos. Fintech, developer tools, AI. 10M+ users at Moniepoint. Open-source: Connectic, Monie Utils.",
  keywords: [
    "Oluwaferanmi Adeniji",
    "Feranmi Adeniji",
    "devferanmi",
    "senior software engineer",
    "senior frontend engineer",
    "fintech engineer",
    "Lagos software engineer",
    "Nigeria developer",
    "Moniepoint engineer",
    "Next.js engineer",
    "React engineer",
    "TypeScript engineer",
    "Node.js engineer",
    "developer tools",
    "AI engineer",
    "Connectic",
    "Monie Utils",
    "open source maintainer",
    "portfolio",
    "microfrontends",
    "payment systems",
    "kyc compliance",
    "system design",
  ] as string[],
  author: {
    name: "Oluwaferanmi Adeniji",
    alternateName: ["Feranmi Adeniji", "devferanmi", "Feranmi"],
    role: "Senior Software Engineer",
    company: "Moniepoint",
    location: {
      city: "Lagos",
      country: "Nigeria",
      countryCode: "NG",
    },
    sameAs: [
      "https://github.com/spiderocious",
      "https://www.linkedin.com/in/oluwaferanmi-adeniji-aba341179/",
      "https://devferanmi.hashnode.dev",
      "https://twitter.com/devferanmi",
    ],
    email: "devferanmi@gmail.com",
  },
  social: {
    github: "https://github.com/spiderocious",
    linkedin: "https://www.linkedin.com/in/oluwaferanmi-adeniji-aba341179/",
    blog: "https://devferanmi.hashnode.dev",
    twitter: "https://twitter.com/devferanmi",
  },
  /** Default OG image — generated dynamically by app/opengraph-image.tsx for the root */
  defaultOgImage: "/opengraph-image",
} as const;

/**
 * Build absolute URL for a given path.
 * Important: sitemap + OG require absolute URLs.
 */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  const base = SITE.url.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
