interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="bg-white border-2 border-black rounded-md px-5 pt-5 pb-4 hover:bg-[#f9f9f9] transition-colors duration-150">
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-black mb-3">
        {label}
      </p>
      <p className="font-mono text-[32px] font-black text-black leading-none mb-2">
        {value}
      </p>
      {sub && (
        <p className="font-mono text-[10px] font-medium text-[#888]">{sub}</p>
      )}
    </div>
  );
}
