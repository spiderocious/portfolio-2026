import { SITE, absoluteUrl } from "./config";

/**
 * Build a Person + WebSite schema for the landing page.
 * Both objects use @id-based referencing so Google recognizes them as one entity.
 */
export function buildPersonSchema() {
  const personId = `${SITE.url}#person`;
  const websiteId = `${SITE.url}#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: SITE.author.name,
        alternateName: SITE.author.alternateName,
        url: SITE.url,
        image: absoluteUrl("/feranmi.png"),
        jobTitle: SITE.author.role,
        worksFor: {
          "@type": "Organization",
          name: SITE.author.company,
          url: "https://moniepoint.com",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE.author.location.city,
          addressCountry: SITE.author.location.countryCode,
        },
        email: `mailto:${SITE.author.email}`,
        sameAs: SITE.author.sameAs,
        knowsAbout: [
          "Software Engineering",
          "Frontend Development",
          "Fintech Systems",
          "Developer Tools",
          "AI Applications",
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "System Design",
          "Payment Processing",
          "KYC and Compliance",
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE.url,
        name: SITE.name,
        description: SITE.shortDescription,
        inLanguage: "en-US",
        publisher: { "@id": personId },
      },
    ],
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished: string;
  dateModified?: string;
  tags?: string[];
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.url),
    image: input.image ? absoluteUrl(input.image) : absoluteUrl(SITE.defaultOgImage),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Person",
      "@id": `${SITE.url}#person`,
      name: SITE.author.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Person",
      "@id": `${SITE.url}#person`,
      name: SITE.author.name,
    },
    inLanguage: "en-US",
    keywords: input.tags?.join(", "),
    mainEntityOfPage: absoluteUrl(input.url),
  };
}

interface ProjectSchemaInput {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  repo?: string | null;
  deployedUrl?: string | null;
  datePublished?: string;
  dateModified?: string;
  programmingLanguage?: string[];
}

/**
 * For portfolio projects — uses CreativeWork with SoftwareSourceCode.
 * This helps Google surface the project as a developer work product.
 */
export function buildProjectSchema(input: ProjectSchemaInput) {
  const sameAs: string[] = [];
  if (input.repo) sameAs.push(input.repo);
  if (input.deployedUrl) sameAs.push(input.deployedUrl);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.url),
    image: input.image ? absoluteUrl(input.image) : undefined,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Person",
      "@id": `${SITE.url}#person`,
      name: SITE.author.name,
    },
    creator: {
      "@type": "Person",
      "@id": `${SITE.url}#person`,
      name: SITE.author.name,
    },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    programmingLanguage: input.programmingLanguage,
  };
}

interface CollectionSchemaInput {
  name: string;
  description: string;
  url: string;
}

export function buildCollectionSchema(input: CollectionSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE.url}#website`,
    },
    about: {
      "@type": "Person",
      "@id": `${SITE.url}#person`,
    },
  };
}
