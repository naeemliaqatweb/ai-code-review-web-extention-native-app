export default function CreditBadge({ used = 0, total = 20 }) {
  const percentage = Math.min((used / total) * 100, 100);
  
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Credits Used</span>
        <span className="text-[10px] font-black text-indigo-400">{used}/{total}</span>
      </div>
      <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
