import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Styled markdown renderer using react-markdown + remark-gfm.
 * Used for project/experiment/experience descriptions and bodies.
 */
export function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="flex flex-col gap-4 markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

const components: Components = {
  h1: ({ children }) => (
    <h1
      className="text-[26px] md:text-[30px] font-semibold mt-3"
      style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      className="text-[22px] md:text-[24px] font-semibold mt-3"
      style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="text-[18px] md:text-[20px] font-semibold mt-2"
      style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4
      className="text-[16px] md:text-[17px] font-semibold mt-2"
      style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
    >
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p
      className="text-[14px] md:text-[15px] leading-[1.75]"
      style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}
    >
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong style={{ color: "var(--ink)", fontWeight: 700 }}>{children}</strong>
  ),
  em: ({ children }) => <em style={{ color: "var(--ink-2)" }}>{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="underline underline-offset-2 transition-colors"
      style={{ color: "var(--ink)" }}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="space-y-2 pl-1 list-none">{children}</ul>,
  ol: ({ children, start }) => (
    <ol className="space-y-2 pl-1 list-decimal list-inside" start={start}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => {
    // ordered list items render plain; unordered use our custom bullet
    if ((props as { ordered?: boolean }).ordered) {
      return (
        <li
          className="text-[14px] leading-[1.65]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}
        >
          {children}
        </li>
      );
    }
    return (
      <li
        className="flex items-start gap-3 text-[14px] leading-[1.65]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}
      >
        <span
          className="mt-2.25 w-1 h-1 rounded-full shrink-0"
          style={{ background: "var(--ink-3)" }}
        />
        <span className="flex-1 min-w-0">{children}</span>
      </li>
    );
  },
  blockquote: ({ children }) => (
    <blockquote
      className="pl-4 py-1 text-[14px] md:text-[15px] leading-[1.7] italic"
      style={{
        fontFamily: "var(--font-mono)",
        color: "var(--ink-3)",
        borderLeft: "2px solid var(--ink-4)",
      }}
    >
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr
      className="my-2 border-t border-dashed"
      style={{ borderColor: "var(--border)" }}
    />
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = /language-/.test(className ?? "");
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="px-1.5 py-0.5 text-[13px]"
        style={{
          fontFamily: "var(--font-mono)",
          background: "var(--bg-alt)",
          color: "var(--ink)",
          border: "1px solid var(--border-soft)",
          borderRadius: 2,
        }}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre
      className="p-4 overflow-x-auto text-[12.5px] leading-[1.6]"
      style={{
        fontFamily: "var(--font-mono)",
        background: "var(--bg-alt)",
        border: "1px dashed var(--border)",
        borderRadius: 2,
        color: "var(--ink-2)",
      }}
    >
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table
        className="w-full text-[13px] border-collapse"
        style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th
      className="text-left px-3 py-2 border-b"
      style={{ borderColor: "var(--border)", color: "var(--ink)", fontWeight: 600 }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      className="px-3 py-2 border-b"
      style={{ borderColor: "var(--border-soft)" }}
    >
      {children}
    </td>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      className="w-full rounded-sm"
      style={{ border: "1px dashed var(--border)" }}
    />
  ),
};
