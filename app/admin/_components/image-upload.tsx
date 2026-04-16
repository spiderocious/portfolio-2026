"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<{ url: string } | { error: string }>;
  height?: number;
  square?: boolean;
}

export function ImageUpload({ value, onChange, onUpload, height = 120, square = false }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      setError("file too large — max 2mb");
      return;
    }
    setUploading(true);
    setError(null);
    const result = await onUpload(file);
    setUploading(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      onChange(result.url);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  if (value) {
    return (
      <div className="relative rounded overflow-hidden border border-[#2a2a2a]" style={{ height }}>
        <img
          src={value}
          alt="uploaded"
          className={["w-full h-full", square ? "object-contain" : "object-cover"].join(" ")}
        />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-[#ef4444] font-mono text-[12px] rounded flex items-center justify-center hover:bg-black/80 transition-colors duration-150"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={[
        "flex flex-col items-center justify-center rounded border border-dashed cursor-pointer transition-colors duration-150",
        dragging ? "border-[#4ade80] bg-[#dcfce7]" : "border-[#d0d0d0] bg-white hover:border-[#4ade80] hover:bg-white",
      ].join(" ")}
      style={{ height }}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      {uploading ? (
        <p className="font-mono text-[11px] text-[#666]">uploading...</p>
      ) : (
        <>
          <UploadIcon />
          <p className="font-mono text-[11px] text-black mt-2">drag & drop or click to upload</p>
          <p className="font-mono text-[10px] text-[#666] mt-1">png, jpg, webp — max 2mb</p>
          {error && <p className="font-mono text-[10px] text-[#ef4444] mt-1">{error}</p>}
        </>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#666]">
      <path d="M10 14V4M10 4L6 8M10 4l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 16h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
