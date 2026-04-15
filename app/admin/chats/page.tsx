import Link from "next/link";
import { getAllConversations } from "@/lib/services/chats";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).replace(",", "");
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default async function ChatsPage() {
  const conversations = await getAllConversations();

  return (
    <>
      <div className="mb-3 pb-2 border-b border-a-border-sub">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-8">all conversations</p>
      </div>

      <div className="bg-a-card border border-a-border rounded-md overflow-hidden">
        <div className="grid bg-a-surface h-9 border-b border-a-border-sub" style={{ gridTemplateColumns: "160px 1fr 90px 140px 60px" }}>
          {["session", "started", "messages", "last active", "view"].map((h, i) => (
            <div key={h} className={["font-mono text-[9px] uppercase tracking-[0.14em] text-a-ink-7 font-medium flex items-center px-4", i === 4 ? "justify-end" : ""].join(" ")}>
              {h}
            </div>
          ))}
        </div>

        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-[120px]">
            <p className="font-mono text-[11px] text-a-ink-7">no conversations yet.</p>
          </div>
        ) : (
          conversations.map((convo) => (
            <div
              key={convo.id}
              className="grid h-12 border-b border-[#191919] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-100 items-center"
              style={{ gridTemplateColumns: "160px 1fr 90px 140px 60px" }}
            >
              <div className="px-4">
                <span className="font-mono text-[11px] text-a-ink-6">{convo.session_id.slice(0, 12)}...</span>
              </div>
              <div className="px-4">
                <span className="font-mono text-[11px] text-a-ink-5">{formatDate(convo.started_at)}</span>
              </div>
              <div className="px-4 text-right">
                <span className="font-mono text-[11px] text-a-ink-4">{convo.message_count}</span>
              </div>
              <div className="px-4">
                <span className="font-mono text-[11px] text-a-ink-6">{timeAgo(convo.last_message_at)}</span>
              </div>
              <div className="px-4 flex justify-end">
                <Link
                  href={`/admin/chats/${convo.id}`}
                  className="font-mono text-[11px] text-a-ink-7 hover:text-a-ink-3 transition-colors duration-150"
                >
                  view →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
