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
              className="w-40 h-10 bg-white border border-[#d0d0d0] rounded px-3.5 font-mono text-[13px] text-black placeholder:text-[#888] outline-none focus:border-[#4ade80] focus:[box-shadow:0_0_0_3px_rgba(74,222,128,0.2)] transition-all duration-150"
            />
            <input
              type="text"
              value={row.value}
              onChange={(e) => update(i, "value", e.target.value)}
              placeholder={valuePlaceholder}
              className="flex-1 h-10 bg-white border border-[#d0d0d0] rounded px-3.5 font-mono text-[13px] text-black placeholder:text-[#888] outline-none focus:border-[#4ade80] focus:[box-shadow:0_0_0_3px_rgba(74,222,128,0.2)] transition-all duration-150"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="w-10 h-10 flex items-center justify-center text-[#666] hover:text-[#ef4444] transition-colors duration-150 font-mono text-[16px] bg-transparent border-none cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 font-mono text-[11px] text-black hover:text-black transition-colors duration-150 bg-transparent border-none cursor-pointer p-0"
      >
        {addLabel}
      </button>
    </div>
  );
}
