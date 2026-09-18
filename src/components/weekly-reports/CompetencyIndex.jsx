const CompetencyIndex = ({ skills }) => (
  <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[20px]">query_stats</span>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Curricular Competency Index</h3>
      </div>
      <span className="font-label-sm text-[11px] font-bold text-secondary uppercase">Weeks 1-7</span>
    </div>
    <p className="font-body-xs text-body-xs text-on-surface-variant -mt-2">
      Autonomous skill extraction synthesized from submitted weekly logs, Git code revisions, and mentor evaluations.
    </p>

    <div className="flex flex-col gap-3 pt-1">
      {skills.map((skill) => (
        <div key={skill.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface font-semibold">{skill.label}</span>
            <span className="text-primary font-bold">{skill.percent}%</span>
          </div>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${skill.barCls}`} style={{ width: `${skill.percent}%` }} />
          </div>
          <span className={`text-[10px] font-body-xs ${skill.noteCls}`}>{skill.note}</span>
        </div>
      ))}
    </div>

    <div className="p-2.5 rounded-lg bg-surface-container-low text-center">
      <span className="text-[11px] text-on-surface-variant">Capstone Qualification Status: </span>
      <span className="text-[11px] font-bold text-tertiary">100% On Track for A+ Grade</span>
    </div>
  </div>
);

export default CompetencyIndex;
