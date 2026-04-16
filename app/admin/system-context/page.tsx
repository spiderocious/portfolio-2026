import Link from "next/link";
import { getAllContextEntries } from "@/lib/services/system-context";
import type { SystemContextEntry, ContextCategory } from "@/lib/services/types";
import { SystemContextListClient } from "./_components/list-client";

const categoryBadge: Record<NonNullable<ContextCategory>, string> = {
  professional: "bg-blue-50 border-blue-300 text-blue-700",
  personal:     "bg-[#dcfce7] border-[#4ade80] text-[#15803d]",
  opinions:     "bg-purple-50 border-purple-300 text-purple-700",
  instructions: "bg-yellow-50 border-yellow-300 text-yellow-700",
};

export default async function SystemContextPage() {
  const entries = await getAllContextEntries();

  return <SystemContextListClient entries={entries} categoryBadge={categoryBadge} />;
}
