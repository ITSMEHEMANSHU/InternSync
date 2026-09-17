const STEP_STYLES = {
  completed: { dot: 'bg-tertiary text-on-tertiary', line: 'bg-tertiary', icon: 'check' },
  active:    { dot: 'bg-primary text-on-primary',   line: 'bg-outline-variant', icon: 'radio_button_checked' },
  pending:   { dot: 'bg-surface-container-high text-on-surface-variant', line: 'bg-outline-variant', icon: 'radio_button_unchecked' },
};

const Timeline = ({ steps }) => (
  <div className="flex flex-col">
    {steps.map((step, i) => {
      const s = STEP_STYLES[step.status] || STEP_STYLES.pending;
      return (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${s.dot}`}>
              <span className="material-symbols-outlined text-[16px]">{step.icon || s.icon}</span>
            </div>
            {i < steps.length - 1 && <div className={`w-0.5 flex-1 my-1 ${s.line}`} />}
          </div>
          <div className="pb-6 flex-1">
            <div className="flex items-center justify-between">
              <span className={`font-label-md text-label-md font-semibold ${step.status === 'active' ? 'text-primary' : 'text-on-surface'}`}>{step.label}</span>
              {step.date && <span className="font-body-xs text-body-xs text-on-surface-variant">{step.date}</span>}
            </div>
            {step.description && <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">{step.description}</p>}
          </div>
        </div>
      );
    })}
  </div>
);

export default Timeline;
