import type { Metadata } from "next";
import { ExperimentsScreen } from "@/features/public/features/experiments/screen/experiments-screen";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Experiments — Feranmi Adeniji",
  description: "Side projects and tinkering.",
};

export default function ExperimentsPage() {
  return <ExperimentsScreen />;
}
