interface StackTagsProps {
  tags: string[];
  max?: number;
}

export function StackTags({ tags, max = 3 }: StackTagsProps) {
  const shown = tags.slice(0, max);
  const extra = tags.length - max;
  return (
    <div className="flex items-center gap-1 overflow-hidden">
      {shown.map((tag) => (
        <span
          key={tag}
          className="font-mono text-[10px] font-medium text-black bg-[#f0f0f0] border border-[#d0d0d0] px-1.5 py-0.5 rounded whitespace-nowrap"
        >
          {tag}
        </span>
      ))}
      {extra > 0 && (
        <span className="font-mono text-[10px] text-[#999] whitespace-nowrap">
          +{extra}
        </span>
      )}
    </div>
  );
}
