"use client";

import { useRouter } from "next/navigation";
import { PageViewTracker } from "@/features/public/shared/utils/page-view-tracker";
import { LlmPopup } from "../../features/public/ui/llm-popup/llm-popup";

export default function LLMScreen() {
  const router = useRouter();
  return (
    <>
      <PageViewTracker />
      <LlmPopup defaultOpen onClose={() => router.push("/")} />
    </>
  );
}
