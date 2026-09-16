const AIMatchBadge = ({ percent }) => {
  const color = percent >= 85 ? 'text-tertiary' : percent >= 70 ? 'text-secondary' : 'text-on-surface-variant';
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={`relative w-12 h-12 flex items-center justify-center rounded-full border-2 ${percent >= 85 ? 'border-tertiary-fixed-dim' : percent >= 70 ? 'border-secondary-fixed-dim' : 'border-outline-variant'}`}>
        <span className={`font-bold text-[13px] ${color}`}>{percent}%</span>
      </div>
      <span className="text-[9px] font-label-sm text-on-surface-variant uppercase tracking-wider">AI Match</span>
    </div>
  );
};

export default AIMatchBadge;
