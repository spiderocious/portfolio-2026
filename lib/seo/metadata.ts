import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./config";

interface BuildMetadataInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
}

/**
 * Shared helper that produces a full `Metadata` object for any page.
 * Handles: canonical URL, OG, Twitter, robots, keywords.
 */
export function buildPageMetadata(input: BuildMetadataInput = {}): Metadata {
  const path = input.path ?? "/";
  const url = absoluteUrl(path);
  const title = input.title ?? SITE.name;
  const description = input.description ?? SITE.shortDescription;
  const image = input.image ?? SITE.defaultOgImage;
  const absoluteImage = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [...SITE.keywords, ...(input.tags ?? [])],
    authors: [{ name: SITE.author.name, url: SITE.url }],
    creator: SITE.author.name,
    publisher: SITE.author.name,
    robots: input.noindex
      ? { index: false, follow: false }
      : {
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
    openGraph: {
      type: input.type === "article" ? "article" : "website",
      siteName: SITE.name,
      title,
      description,
      url,
      locale: SITE.locale,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(input.type === "article"
        ? {
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime,
            authors: [SITE.author.name],
            tags: input.tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SITE.handle,
      site: SITE.handle,
      images: [absoluteImage],
    },
  };
}
