import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.shortDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#000000",
    theme_color: "#000000",
    lang: "en-US",
    categories: ["portfolio", "developer", "technology", "productivity"],
    icons: [
      { src: "/feranmi.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/feranmi.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/feranmi.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    ],
  };
}
