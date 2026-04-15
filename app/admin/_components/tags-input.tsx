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
      className="min-h-[44px] bg-a-surface border border-[#222222] rounded px-2.5 py-2 flex flex-wrap gap-1.5 items-center cursor-text focus-within:border-a-border-act focus-within:[box-shadow:0_0_0_2px_rgba(255,255,255,0.04)] transition-all duration-150"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] text-a-ink-3 font-mono text-[11px] px-2 py-0.5 rounded"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            className="text-a-ink-6 hover:text-a-red transition-colors duration-150 leading-none"
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
        className="bg-transparent border-none outline-none font-mono text-[12px] text-a-ink-2 placeholder:text-a-ink-8 min-w-[120px] flex-1"
      />
    </div>
  );
}
