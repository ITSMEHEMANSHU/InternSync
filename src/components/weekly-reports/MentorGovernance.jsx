import { MENTORS_GOVERNANCE } from '../../constants/mockData.js';

const MentorGovernance = () => (
  <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-secondary text-[20px]">supervisor_account</span>
      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Dual Mentor Governance</h3>
    </div>

    <div className="flex flex-col gap-3 mt-1">
      {MENTORS_GOVERNANCE.map((mentor) => (
        <div key={mentor.initials} className="p-3 rounded-lg bg-surface-container-low flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0 ${mentor.avatarCls}`}>
              {mentor.initials}
            </div>
            <div>
              <span className="font-label-md text-label-md font-bold text-on-surface block">{mentor.name}</span>
              <span className="text-[11px] text-on-surface-variant block">{mentor.org}</span>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${mentor.badgeCls}`}>
            {mentor.badge}
          </span>
        </div>
      ))}
    </div>

    <div className="pt-2 flex items-center justify-between text-[11px] text-on-surface-variant">
      <span>Escalation Protocol: Tier-1 TPO</span>
      <button className="text-primary font-semibold hover:underline">Message Mentors</button>
    </div>
  </div>
);

export default MentorGovernance;
