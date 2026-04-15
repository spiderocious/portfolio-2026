"use client";

interface LinkRow {
  key: string;
  value: string;
}

interface LinksEditorProps {
  value: LinkRow[];
  onChange: (rows: LinkRow[]) => void;
  addLabel?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export function LinksEditor({
  value,
  onChange,
  addLabel = "+ add link",
  keyPlaceholder = "label",
  valuePlaceholder = "https://...",
}: LinksEditorProps) {
  function update(index: number, field: "key" | "value", val: string) {
    const next = value.map((row, i) => (i === index ? { ...row, [field]: val } : row));
    onChange(next);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...value, { key: "", value: "" }]);
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        {value.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={row.key}
              onChange={(e) => update(i, "key", e.target.value)}
              placeholder={keyPlaceholder}
              className="w-40 h-10 bg-a-surface border border-[#222222] rounded px-3.5 font-mono text-[13px] text-a-ink-2 placeholder:text-a-ink-8 outline-none focus:border-a-border-act focus:[box-shadow:0_0_0_2px_rgba(255,255,255,0.04)] transition-all duration-150"
            />
            <input
              type="text"
              value={row.value}
              onChange={(e) => update(i, "value", e.target.value)}
              placeholder={valuePlaceholder}
              className="flex-1 h-10 bg-a-surface border border-[#222222] rounded px-3.5 font-mono text-[13px] text-a-ink-2 placeholder:text-a-ink-8 outline-none focus:border-a-border-act focus:[box-shadow:0_0_0_2px_rgba(255,255,255,0.04)] transition-all duration-150"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="w-10 h-10 flex items-center justify-center text-a-ink-7 hover:text-a-red transition-colors duration-150 font-mono text-[16px] bg-transparent border-none cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 font-mono text-[11px] text-a-ink-7 hover:text-a-ink-4 transition-colors duration-150 bg-transparent border-none cursor-pointer p-0"
      >
        {addLabel}
      </button>
    </div>
  );
}
