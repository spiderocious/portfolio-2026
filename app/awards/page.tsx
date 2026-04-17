import type { Metadata } from "next";
import { AwardsScreen } from "@/features/public/features/awards/screen/awards-screen";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Awards — Feranmi Adeniji",
  description: "Recognition and honours.",
};

export default function AwardsPage() {
  return <AwardsScreen />;
}
