"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagsInput({ value, onChange, placeholder = "add tag, press enter" }: TagsInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(tag: string) {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div
      className="min-h-[44px] bg-white border border-[#d0d0d0] rounded px-2.5 py-2 flex flex-wrap gap-1.5 items-center cursor-text focus-within:border-[#4ade80] focus-within:[box-shadow:0_0_0_3px_rgba(74,222,128,0.2)] transition-all duration-150"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-[#f4f4f4] border border-[#d0d0d0] text-black font-mono text-[11px] px-2 py-0.5 rounded"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            className="text-[#999] hover:text-[#ef4444] transition-colors duration-150 leading-none"
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input.trim()) addTag(input); }}
        placeholder={value.length === 0 ? placeholder : ""}
        className="bg-transparent border-none outline-none font-mono text-[12px] text-black placeholder:text-[#888] min-w-[120px] flex-1"
      />
    </div>
  );
}
