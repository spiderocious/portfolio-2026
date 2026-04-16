import Link from "next/link";
import { getAllConversations } from "@/lib/services/chats";
import { AdminTable, Tr, Td } from "../_components/admin-table";
import { SectionLabel } from "../_components/section-label";

const COLS = "160px 1fr 100px 140px 70px";

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
    <div className="flex flex-col gap-4">
      <SectionLabel>all conversations</SectionLabel>

      <AdminTable
        columns={[
          { label: "session" },
          { label: "started" },
          { label: "messages", align: "right" },
          { label: "last active" },
          { label: "view", align: "right" },
        ]}
        columnWidths={COLS}
        isEmpty={conversations.length === 0}
        emptyText="no conversations yet."
      >
        {conversations.map((convo) => (
          <Tr key={convo.id} columnWidths={COLS} height="h-[52px]">
            <Td>
              <span className="font-mono text-[11px] font-semibold text-black">{convo.session_id.slice(0, 12)}…</span>
            </Td>
            <Td>
              <span className="font-mono text-[11px] text-[#666]">{formatDate(convo.started_at)}</span>
            </Td>
            <Td align="right">
              <span className="font-mono text-[12px] font-bold text-black">{convo.message_count}</span>
            </Td>
            <Td>
              <span className="font-mono text-[11px] text-[#666]">{timeAgo(convo.last_message_at)}</span>
            </Td>
            <Td align="right">
              <Link
                href={`/admin/chats/${convo.id}`}
                className="font-mono text-[11px] font-bold text-black hover:text-[#4ade80] transition-colors duration-150"
              >
                view →
              </Link>
            </Td>
          </Tr>
        ))}
      </AdminTable>
    </div>
  );
}
