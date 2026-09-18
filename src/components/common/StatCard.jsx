const StatCard = ({ icon, label, value, unit, trend, trendUp, iconBg, onClick, children }) => (
  <div
    onClick={onClick}
    className={`p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="font-label-md text-label-md text-on-surface-variant font-medium">{label}</span>
      {icon && (
        <span className={`p-1.5 rounded-lg ${iconBg || 'bg-primary-fixed/60 text-primary'}`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </span>
      )}
    </div>
    <div className="flex items-baseline gap-2">
      <span className="font-numeric-metric text-numeric-metric text-on-surface">{value}</span>
      {unit && <span className="font-body-md text-body-md text-on-surface-variant">{unit}</span>}
    </div>
    {trend && (
      <div className={`mt-2 text-[11px] font-label-sm font-semibold flex items-center gap-1 ${trendUp ? 'text-tertiary' : 'text-on-surface-variant'}`}>
        {trendUp !== undefined && (
          <span className="material-symbols-outlined text-[13px]">{trendUp ? 'trending_up' : 'trending_flat'}</span>
        )}
        {trend}
      </div>
    )}
    {children}
  </div>
);

export default StatCard;
