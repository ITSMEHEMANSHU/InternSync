const RISK_CONFIG = {
  low:    { cls: 'bg-tertiary-fixed text-on-tertiary-fixed', icon: 'check_circle' },
  medium: { cls: 'bg-secondary-fixed text-on-secondary-fixed', icon: 'warning' },
  high:   { cls: 'bg-error-container text-on-error-container', icon: 'error' },
};

const RiskIndicator = ({ level = 'low', showLabel = true }) => {
  const cfg = RISK_CONFIG[level] || RISK_CONFIG.low;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${cfg.cls}`}>
      <span className="material-symbols-outlined text-[13px]">{cfg.icon}</span>
      {showLabel && <span className="capitalize">{level}</span>}
    </span>
  );
};

export default RiskIndicator;
