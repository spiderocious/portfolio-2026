"use client";

import { useState } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  height = 320,
  placeholder = "write markdown here...",
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const tabBarH = 36;
  const bodyH = height - tabBarH;

  return (
    <div
      className="bg-a-surface border border-[#222222] rounded overflow-hidden"
      style={{ height }}
    >
      {/* Tab bar */}
      <div className="flex items-center h-9 bg-a-base border-b border-a-border">
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={[
              "font-mono text-[11px] px-4 h-full border-b-2 transition-colors duration-150",
              tab === t
                ? "text-a-ink border-a-ink"
                : "text-a-ink-7 border-transparent hover:text-a-ink-4",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Body */}
      {tab === "write" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ height: bodyH }}
          className="w-full bg-a-surface px-4 py-4 font-mono text-[13px] text-a-ink-2 leading-relaxed resize-none outline-none placeholder:text-[#2a2a2a] border-none"
        />
      ) : (
        <div
          className="overflow-y-auto px-4 py-4"
          style={{ height: bodyH }}
        >
          <MarkdownPreview content={value} />
        </div>
      )}
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  if (!content.trim()) {
    return (
      <p className="font-mono text-[11px] text-a-ink-7 italic">nothing to preview yet.</p>
    );
  }

  // Simple markdown renderer
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="font-mono text-[14px] font-semibold text-[#aaa8a0] mb-2 mt-4">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="font-mono text-[17px] font-semibold text-a-ink-3 mb-2 mt-5">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="font-mono text-[20px] font-semibold text-a-ink mb-3 mt-6">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-a-base border border-a-border rounded p-3 mb-3 overflow-x-auto">
          <code className="font-mono text-[12px] text-a-ink-3 leading-relaxed">
            {codeLines.join("\n")}
          </code>
        </pre>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={i} className="font-mono text-[13px] text-a-ink-4 leading-relaxed ml-5 list-disc mb-1">
          {renderInline(line.slice(2))}
        </li>
      );
    } else if (/^\d+\. /.test(line)) {
      elements.push(
        <li key={i} className="font-mono text-[13px] text-a-ink-4 leading-relaxed ml-5 list-decimal mb-1">
          {renderInline(line.replace(/^\d+\. /, ""))}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-3" />);
    } else {
      elements.push(
        <p key={i} className="font-mono text-[13px] text-a-ink-4 leading-[1.7] mb-2">
          {renderInline(line)}
        </p>
      );
    }

    i++;
  }

  return <div>{elements}</div>;
}

function renderInline(text: string): React.ReactNode {
  // Handle inline code, bold, etc. with a simple regex split
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="bg-a-base text-a-green px-1 rounded font-mono text-[12px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-a-ink-3 font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
