import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.hashnode.com" },
      { protocol: "https", hostname: "hashnode.com" },
      { protocol: "https", hostname: "**.hashnode.dev" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },

  async headers() {
    return [
      // ─── All public routes: open CORS + explicit indexability ────────────
      // Crawlers (Googlebot, Bingbot, GPTBot, ClaudeBot) don't use CORS,
      // but external tools that audit/preview your pages do. Opening it
      // up removes any friction for SEO tooling and link previews.
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
          { key: "Access-Control-Expose-Headers", value: "*" },
          // Reinforce indexability so any CDN layer can't accidentally
          // send a noindex header on top of our HTML.
          { key: "X-Robots-Tag", value: "all" },
          // Security best-practice that doesn't break SEO
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Helps GSC + social unfurlers render embedded content
          { key: "Permissions-Policy", value: "interest-cohort=()" },
        ],
      },

      // ─── Public JSON APIs (used by client + 3rd-party tooling) ───────────
      // Open CORS + allow POST for analytics/LLM endpoints.
      {
        source: "/api/:path((?!admin).*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, HEAD, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },

      // ─── Sitemap / robots / feeds — must never be cached stale ──────────
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
          { key: "X-Robots-Tag", value: "all" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Content-Type", value: "application/manifest+json; charset=utf-8" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },

      // ─── OG / social card images — let any platform fetch them ──────────
      {
        source: "/opengraph-image",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
          { key: "X-Robots-Tag", value: "all" },
        ],
      },
      {
        source: "/twitter-image",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
          { key: "X-Robots-Tag", value: "all" },
        ],
      },

      // ─── Admin — keep crawlers out (defence in depth) ────────────────────
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },

  // ─── Redirects to clean indexable URLs ───────────────────────────────────
  async redirects() {
    return [
      // Surface common aliases → canonical
      { source: "/sitemap", destination: "/sitemap.xml", permanent: true },
      { source: "/robots", destination: "/robots.txt", permanent: true },
      // Trailing-slash on the root blog index — keep canonical
      { source: "/blog/", destination: "/blog", permanent: true },
      { source: "/projects/", destination: "/projects", permanent: true },
    ];
  },
};

export default nextConfig;
