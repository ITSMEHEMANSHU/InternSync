const EmptyState = ({ icon = 'inbox', title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-surface-container-lowest rounded-xl shadow-sm">
    <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
      <span className="material-symbols-outlined text-[32px] text-on-surface-variant">{icon}</span>
    </div>
    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">{title}</h3>
    {description && <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-6">{description}</p>}
    {action && (
      <button onClick={action.onClick} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 transition-all">
        {action.icon && <span className="material-symbols-outlined text-[18px]">{action.icon}</span>}
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
