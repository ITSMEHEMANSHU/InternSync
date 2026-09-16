const Tabs = ({ tabs, activeTab, onChange }) => (
  <div className="flex items-center gap-2 p-1.5 bg-surface-container-low rounded-xl flex-wrap">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-4 py-2 rounded-lg text-[13px] flex items-center gap-2 transition-all ${
          activeTab === tab.id
            ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
            : 'text-on-surface-variant hover:text-on-surface font-medium'
        }`}
      >
        {tab.icon && <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>}
        {tab.label}
        {tab.count !== undefined && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-surface-container text-on-surface">{tab.count}</span>
        )}
      </button>
    ))}
  </div>
);

export default Tabs;
