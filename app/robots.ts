import type { MetadataRoute } from "next";
import { SITE, absoluteUrl } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/admin", "/admin/", "/api/", "/*?*"],
      },
      // Explicitly welcome the big AI crawlers (opt-in, since many devs block them)
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "Google-Extended",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
        ],
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE.url,
  };
}
