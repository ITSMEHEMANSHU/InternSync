const ProgressRing = ({ value = 0, size = 64, strokeWidth = 6, color = 'stroke-primary', label }) => {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={strokeWidth} className="stroke-surface-container-high fill-none" />
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className={`fill-none transition-all duration-700 ${color}`} />
      </svg>
      {label && <span className="font-label-sm text-label-sm text-on-surface-variant text-center">{label}</span>}
    </div>
  );
};

export default ProgressRing;
