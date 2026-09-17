const PageHeader = ({ onExport, onDraftNew, weekNumber }) => (
  <div className="flex flex-col gap-space-sm mb-space-lg">
    {/* Breadcrumb */}
    <nav className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
      {['Portal', 'Student', 'My Internship'].map((crumb) => (
        <span key={crumb} className="flex items-center gap-2">
          <span className="hover:text-on-surface cursor-pointer transition-colors">{crumb}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        </span>
      ))}
      <span className="text-primary font-semibold">Weekly Reports & AI Evaluation</span>
    </nav>

    {/* Title row */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mt-1">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
            Weekly Progress Reports & AI Analysis
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
            AICTE Reg 4.3
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-4xl">
          Statutory AICTE weekly log submission, autonomous Git commit synthesis, code quality audits, and dual mentor evaluation scoring for Aarav Sharma (Zoho Corp).
        </p>
      </div>

      <div className="flex items-center gap-space-sm shrink-0">
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container-low transition-all"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary">download_for_offline</span>
          <span>Export Dossier (PDF)</span>
        </button>
        <button
          onClick={onDraftNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold shadow-sm hover:opacity-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Draft Week {weekNumber} Report</span>
        </button>
      </div>
    </div>
  </div>
);

export default PageHeader;
