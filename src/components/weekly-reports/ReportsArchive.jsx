const MentorCard = ({ mentor }) => (
  <div className="p-3 rounded-xl bg-surface-container-low/40 flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${mentor.avatarCls}`}>
            {mentor.initials}
          </div>
          <div>
            <span className="font-label-md text-label-md font-bold text-on-surface block">{mentor.name}</span>
            <span className="font-body-xs text-[11px] text-on-surface-variant block">{mentor.role}</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-surface-container text-primary">
          {mentor.score} / 5.0
        </span>
      </div>
      <p className="font-body-xs text-body-xs text-on-surface italic leading-relaxed">"{mentor.feedback}"</p>
    </div>
    <span className="text-[10px] text-on-surface-variant mt-2 block">Signed: {mentor.signedAt}</span>
  </div>
);

const ExpandedReportCard = ({ report }) => (
  <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all">
    <div className="p-space-md bg-surface-container-low/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-lg bg-tertiary-fixed-dim/30 text-tertiary flex flex-col items-center justify-center shrink-0">
          <span className="text-[10px] font-bold uppercase leading-none">WK</span>
          <span className="text-[16px] font-bold leading-tight">{String(report.weekNumber).padStart(2, '0')}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{report.title}</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed">
              Dual Signed & Accredited
            </span>
          </div>
          <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">
            Submitted {report.submittedAt} • Endorsed within {report.endorsedIn} • AICTE Log #{report.aicteLog}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block font-bold">Grade</span>
          <div className="flex items-baseline justify-end gap-1">
            <span className="font-headline-lg text-headline-lg font-bold text-primary">{report.grade}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">/ 10</span>
          </div>
        </div>
        <button className="p-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors" title="Download Verified Slip">
          <span className="material-symbols-outlined text-[18px]">file_download</span>
        </button>
      </div>
    </div>

    <div className="p-space-md flex flex-col gap-space-md">
      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{report.abstract}</p>

      <div className="p-3 rounded-lg bg-surface-container-low flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
        <div className="flex-1 font-body-xs text-body-xs text-on-surface">
          <span className="font-bold">Autonomous Synthesis Engine: </span>
          {report.synthesis.commits} Git commits verified, zero memory leaks detected, test coverage at {report.synthesis.testCoverage}%.
        </div>
        <span className="font-label-sm text-[11px] font-mono text-on-surface-variant">SHA: {report.synthesis.sha}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-1">
        {report.mentors.map((m) => <MentorCard key={m.type} mentor={m} />)}
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {report.badges.map((badge) => (
            <span key={badge} className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-surface-container text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-tertiary">trending_up</span>
              {badge}
            </span>
          ))}
        </div>
        <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline">
          <span>View Cryptographic Certificate Slip</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
);

const CondensedReportRow = ({ report }) => (
  <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-low/50 transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-surface-container text-on-surface flex flex-col items-center justify-center shrink-0">
        <span className="text-[9px] font-bold uppercase leading-none">WK</span>
        <span className="text-[14px] font-bold">{String(report.weekNumber).padStart(2, '0')}</span>
      </div>
      <div>
        <h4 className="text-[14px] font-bold text-on-surface">{report.title}</h4>
        <p className="font-body-xs text-body-xs text-on-surface-variant">
          Signed {report.submittedAt} • {report.commits} Verified Commits • {report.detail}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right">
        <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{report.grade}</span>
        <span className="font-body-xs text-body-xs text-on-surface-variant"> / 10</span>
      </div>
      <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container font-semibold transition-colors">
        View Log
      </button>
    </div>
  </div>
);

const ReportsArchive = ({ reports }) => (
  <div className="flex flex-col gap-space-md">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Evaluated Weekly Reports Archive</h2>
        <p className="font-body-xs text-body-xs text-on-surface-variant">Certified weekly logs endorsed by Industry and University mentors.</p>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
        Showing {reports.length} of 7 Archived
      </span>
    </div>

    {reports.map((report) =>
      report.expanded
        ? <ExpandedReportCard key={report.id} report={report} />
        : <CondensedReportRow key={report.id} report={report} />
    )}
  </div>
);

export default ReportsArchive;
