import type { Metadata } from "next";
import { LandingScreen } from "@/features/public/features/landing/screen/landing-screen";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildPersonSchema } from "@/lib/seo/jsonld";
import { JsonLdScript } from "@/lib/seo/json-ld-script";
import { SITE } from "@/lib/seo/config";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  // Landing uses the default root title (no `|` suffix)
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLdScript data={buildPersonSchema()} />
      <LandingScreen />
    </>
  );
}
