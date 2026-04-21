import { PageViewTracker } from "@/features/public/shared/utils/page-view-tracker";
import { PageHeader } from "@/features/public/ui/page-header/page-header";
import { PageShell } from "@/features/public/ui/page-shell/page-shell";
import { LlmPopup } from "../../features/public/ui/llm-popup/llm-popup";

export default function LLMScreen() {
  return (
    <>
      <PageShell>
        <LlmPopup defaultOpen />
        <PageViewTracker />
        <PageHeader path="/llm" title="llm" subtitle="chat with feranmi.ai" />
      </PageShell>
    </>
  );
}
