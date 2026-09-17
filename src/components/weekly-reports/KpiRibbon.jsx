const KpiCard = ({ metric }) => {
  if (metric.id === 'credits') {
    return (
      <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">{metric.label}</span>
          <span className={`p-1.5 rounded-lg ${metric.iconBg}`}>
            <span className="material-symbols-outlined text-[18px]">{metric.icon}</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-numeric-metric text-numeric-metric text-on-surface">{metric.earned}</span>
            <span className="font-headline-sm text-headline-sm text-on-surface-variant">/ {metric.total}</span>
            <span className="font-body-xs text-body-xs text-on-surface-variant ml-1">Credits</span>
          </div>
          <span className="font-label-sm text-label-sm font-bold text-primary">{metric.percent}%</span>
        </div>
        <div className="mt-3">
          <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${metric.percent}%` }} />
          </div>
          <span className="text-[10px] font-body-xs text-on-surface-variant mt-1 block">Mapped: {metric.mapped}</span>
        </div>
      </div>
    );
  }

  if (metric.id === 'cadence') {
    return (
      <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">{metric.label}</span>
          <span className={`p-1.5 rounded-lg ${metric.iconBg}`}>
            <span className="material-symbols-outlined text-[18px]">{metric.icon}</span>
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-numeric-metric text-numeric-metric text-on-surface">{metric.value}</span>
          <span className="font-body-md text-body-md text-on-surface-variant">{metric.unit}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
            {metric.dueBadge}
          </span>
          <span className="font-body-xs text-body-xs text-on-surface-variant">{metric.dueTime}</span>
        </div>
      </div>
    );
  }

  if (metric.id === 'ai') {
    return (
      <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">{metric.label}</span>
          <span className={`p-1.5 rounded-lg ${metric.iconBg}`}>
            <span className="material-symbols-outlined text-[18px]">{metric.icon}</span>
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-numeric-metric text-numeric-metric text-on-surface">{metric.value}</span>
          <span className="font-body-xs text-body-xs text-on-surface-variant">{metric.unit}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-tertiary">
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            {metric.footerLeft}
          </span>
          <span className="text-on-surface-variant">{metric.footerRight}</span>
        </div>
      </div>
    );
  }

  // Default: score card
  return (
    <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="font-label-md text-label-md text-on-surface-variant font-medium">{metric.label}</span>
        <span className={`p-1.5 rounded-lg ${metric.iconBg}`}>
          <span className="material-symbols-outlined text-[18px]">{metric.icon}</span>
        </span>
      </div>
      <div className="flex items-baseline gap-2.5">
        <span className="font-numeric-metric text-numeric-metric text-on-surface">{metric.value}</span>
        <span className="font-headline-sm text-headline-sm text-on-surface-variant">{metric.unit}</span>
        {metric.badge && (
          <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${metric.badge.cls}`}>
            {metric.badge.text}
          </span>
        )}
      </div>
      {metric.footer && (
        <div className="mt-3 pt-2.5 flex items-center justify-between text-on-surface-variant text-[12px] bg-surface-container-low/50 px-2 py-1 rounded">
          <span>{metric.footer.left}</span>
          <span className="font-semibold text-on-surface">{metric.footer.right}</span>
        </div>
      )}
    </div>
  );
};

const KpiRibbon = ({ metrics }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
    {metrics.map((m) => <KpiCard key={m.id} metric={m} />)}
  </div>
);

export default KpiRibbon;
