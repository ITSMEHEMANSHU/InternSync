import { TABS } from '../../hooks/useWeeklyReports.js';

const TAB_CONFIG = [
  { id: TABS.ACTIVE,    icon: 'edit_note',    label: 'Active Submission (Week 8)', dot: true },
  { id: TABS.HISTORY,   icon: 'history_edu',  label: 'Weekly Submissions History (7)' },
  { id: TABS.AI_AUDIT,  icon: 'psychology',   label: 'AI Competency Audit' },
];

const TabSwitcher = ({ activeTab, onTabChange }) => (
  <div className="flex items-center gap-2 p-1.5 bg-surface-container-low rounded-xl">
    {TAB_CONFIG.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-lg text-[13px] flex items-center gap-2 transition-all ${
            isActive
              ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
          <span>{tab.label}</span>
          {tab.dot && isActive && <span className="w-2 h-2 rounded-full bg-primary" />}
        </button>
      );
    })}
  </div>
);

export default TabSwitcher;
