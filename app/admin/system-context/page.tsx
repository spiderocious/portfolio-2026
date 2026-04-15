import Link from "next/link";
import { getAllContextEntries } from "@/lib/services/system-context";
import type { SystemContextEntry, ContextCategory } from "@/lib/services/types";
import { SystemContextListClient } from "./_components/list-client";

const categoryBadge: Record<NonNullable<ContextCategory>, string> = {
  professional: "bg-[#0e1a2a] border-[#1a3a5c] text-a-blue",
  personal:     "bg-[#0e2a1a] border-[#1a5c30] text-a-green",
  opinions:     "bg-[#1a0e1a] border-[#4a1a5c] text-[#c084fc]",
  instructions: "bg-[#1a1a0e] border-[#5c4a00] text-[#facc15]",
};

export default async function SystemContextPage() {
  const entries = await getAllContextEntries();

  return <SystemContextListClient entries={entries} categoryBadge={categoryBadge} />;
}
