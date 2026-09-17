const Stepper = ({ steps, currentStep }) => (
  <div className="flex items-center w-full">
    {steps.map((step, i) => {
      const done = i < currentStep;
      const active = i === currentStep;
      return (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${done ? 'bg-tertiary text-on-tertiary' : active ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
              {done ? <span className="material-symbols-outlined text-[16px]">check</span> : i + 1}
            </div>
            <span className={`text-[10px] font-label-sm text-center whitespace-nowrap ${active ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 ${done ? 'bg-tertiary' : 'bg-outline-variant/40'}`} />
          )}
        </div>
      );
    })}
  </div>
);

export default Stepper;
