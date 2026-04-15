import Link from "next/link";
import { notFound } from "next/navigation";
import { getConversationById, getMessagesByConversationId } from "@/lib/services/chats";

interface Props {
  params: Promise<{ id: string }>;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default async function ChatThreadPage({ params }: Props) {
  const { id } = await params;
  const [convo, messages] = await Promise.all([
    getConversationById(id),
    getMessagesByConversationId(id),
  ]);

  if (!convo) notFound();

  return (
    <div className="max-w-[640px] mx-auto">
      {/* Back link */}
      <div className="mb-4">
        <Link href="/admin/chats" className="font-mono text-[11px] text-a-ink-7 hover:text-a-ink-4 transition-colors duration-150">
          ← back
        </Link>
      </div>

      {/* Session meta */}
      <div className="bg-a-card border border-a-border rounded-md px-4 py-3.5 flex items-center gap-6 mb-3 flex-wrap">
        {[
          { label: "session", value: convo.session_id.slice(0, 16) + "..." },
          { label: "started", value: formatDate(convo.started_at) },
          { label: "messages", value: convo.message_count.toString() },
        ].map(({ label, value }) => (
          <div key={label}>
            <span className="font-mono text-[10px] text-a-ink-6">{label} </span>
            <span className="font-mono text-[10px] text-a-ink-4">{value}</span>
          </div>
        ))}
      </div>

      {/* Thread */}
      <div className="flex flex-col gap-4">
        {messages.length === 0 ? (
          <p className="font-mono text-[11px] text-a-ink-7 text-center py-8">no messages in this conversation.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={["flex flex-col", msg.role === "user" ? "items-end" : "items-start"].join(" ")}>
              <p className={["font-mono text-[9px] uppercase tracking-[0.1em] mb-1", msg.role === "user" ? "text-a-ink-7 text-right" : "text-a-green"].join(" ")}>
                {msg.role === "user" ? "visitor" : "feranmi.ai"}
              </p>
              <div
                className={[
                  "max-w-[75%] px-4 py-3",
                  msg.role === "user"
                    ? "bg-[#1a1a1a] border border-[#252525] rounded-[8px_8px_0_8px]"
                    : "bg-a-card border border-a-border rounded-[8px_8px_8px_0]",
                ].join(" ")}
              >
                <p className={["font-mono text-[12px] leading-relaxed", msg.role === "user" ? "text-a-ink-3" : "text-a-ink-4"].join(" ")}>
                  {msg.content}
                </p>
                <p className={["font-mono text-[10px] mt-1", msg.role === "user" ? "text-a-ink-7 text-right" : "text-a-ink-8"].join(" ")}>
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
