import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "feranmi.ai — ask me anything",
  description:
    "An AI trained on Feranmi's actual work, experience, and opinions. Ask about his projects, tech stack, fintech background, open-source work, or whether he's open to new roles.",
  openGraph: {
    title: "feranmi.ai — ask me anything",
    description:
      "An AI trained on Feranmi's actual work, experience, and opinions. Ask about his projects, tech stack, fintech background, open-source work, or whether he's open to new roles.",
    url: absoluteUrl("/llm"),
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
    images: [
      {
        url: absoluteUrl("/llm/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "feranmi.ai — ask me anything",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "feranmi.ai — ask me anything",
    description:
      "An AI trained on Feranmi's actual work, experience, and opinions. Ask about his projects, tech stack, fintech background, open-source work, or whether he's open to new roles.",
    images: [absoluteUrl("/llm/opengraph-image")],
    creator: SITE.handle,
  },
};

export default function LlmLayout({ children }: { children: React.ReactNode }) {
  return children;
}
