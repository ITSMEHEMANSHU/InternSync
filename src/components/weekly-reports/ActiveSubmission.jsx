const ActiveSubmission = ({ draft, draftContent, setDraftContent, isSaving, isSubmitting, onSave, onSubmit }) => (
  <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md relative overflow-hidden">
    {/* Top accent bar */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary-container" />

    {/* Card header */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm bg-surface-container-low/40 -mx-space-lg -mt-space-lg p-space-lg mb-1">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary text-on-primary">
            WEEK {String(draft.weekNumber).padStart(2, '0')} DRAFT
          </span>
          <span className="font-headline-md text-headline-md text-on-surface font-bold">{draft.title}</span>
        </div>
        <p className="font-body-xs text-body-xs text-on-surface-variant mt-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px] text-tertiary">cloud_done</span>
          <span>Draft auto-saved {draft.lastSaved}</span>
          <span>•</span>
          <span className="text-error font-semibold">Statutory Cut-off: {draft.deadline}</span>
        </p>
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
        <span className="material-symbols-outlined text-[15px] text-secondary">timelapse</span>
        <span>Est. Review: {draft.estimatedReview}</span>
      </div>
    </div>

    {/* Technical summary textarea */}
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1.5">
          Technical Synthesis & Accomplishments
          <span className="text-primary font-body-xs">(Markdown Enabled)</span>
        </label>
        <div className="flex items-center gap-2 text-on-surface-variant text-[12px]">
          <button className="hover:text-primary transition-colors">Format</button>
          <span>•</span>
          <button className="hover:text-primary transition-colors">Preview</button>
          <span>•</span>
          <span>{draftContent.split(' ').filter(Boolean).length} Words</span>
        </div>
      </div>
      <textarea
        value={draftContent}
        onChange={(e) => setDraftContent(e.target.value)}
        rows={5}
        className="w-full p-3.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md shadow-inner leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>

    {/* Git stats */}
    <div className="p-space-md rounded-xl bg-surface-container-low/60 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">source_environment</span>
          <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">Zoho Enterprise Git Linkage</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-container-high text-on-surface-variant">{draft.git.repo}</span>
        </div>
        <span className="text-tertiary font-label-sm text-label-sm font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-tertiary" />
          Webhooks Synced
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-2.5 rounded-lg bg-surface-container-lowest shadow-sm">
          <span className="text-on-surface-variant font-body-xs text-body-xs block">Active Commits</span>
          <span className="font-headline-md text-headline-md font-bold text-on-surface">{draft.git.commits} Verified</span>
          <span className="text-[11px] text-tertiary block mt-0.5">{draft.git.commits > 0 ? 'All GPG Signature Valid' : '—'}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-surface-container-lowest shadow-sm">
          <span className="text-on-surface-variant font-body-xs text-body-xs block">Pull Requests</span>
          <span className="font-headline-md text-headline-md font-bold text-on-surface">{draft.git.prs}</span>
          <span className="text-[11px] text-secondary block mt-0.5">{draft.git.prDetail}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-surface-container-lowest shadow-sm">
          <span className="text-on-surface-variant font-body-xs text-body-xs block">Code Velocity</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-headline-md text-headline-md font-bold text-tertiary">+{draft.git.additions}</span>
            <span className="font-body-sm text-body-sm text-error">-{draft.git.deletions}</span>
            <span className="font-body-xs text-body-xs text-on-surface-variant">Go lines</span>
          </div>
          <span className="text-[11px] text-on-surface-variant block mt-0.5">{draft.git.benchmarks}</span>
        </div>
      </div>
    </div>

    {/* AI Pre-flight audit */}
    <div className="p-space-md rounded-xl bg-gradient-to-br from-surface-container-lowest to-surface-container-low shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-primary text-on-primary">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          </div>
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">AI Pre-Flight Audit & Rubric Scoring</span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed uppercase">
          {draft.aiAudit.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container-lowest/80">
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim/30 flex items-center justify-center text-tertiary font-bold text-[15px]">
            {draft.aiAudit.authenticity.score}
          </div>
          <div>
            <span className="font-label-md text-label-md font-semibold text-on-surface block">Authenticity & Integrity</span>
            <span className="font-body-xs text-body-xs text-on-surface-variant">{draft.aiAudit.authenticity.detail}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container-lowest/80">
          <div className="w-10 h-10 rounded-full bg-primary-fixed/50 flex items-center justify-center text-primary font-bold text-[16px]">
            {draft.aiAudit.depth.grade}
          </div>
          <div>
            <span className="font-label-md text-label-md font-semibold text-on-surface block">Technical Depth Grade</span>
            <span className="font-body-xs text-body-xs text-on-surface-variant">{draft.aiAudit.depth.detail}</span>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-surface-container flex items-start gap-2.5">
        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">lightbulb</span>
        <div className="font-body-xs text-body-xs leading-relaxed">
          <span className="font-semibold text-on-surface">Actionable Recommendation: </span>
          {draft.aiAudit.recommendation}
        </div>
      </div>
    </div>

    {/* Action toolbar */}
    <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-2">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[16px]">{isSaving ? 'hourglass_empty' : 'save'}</span>
          <span>{isSaving ? 'Saving…' : 'Save Draft'}</span>
        </button>
        <button className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center">
          <span className="material-symbols-outlined text-[16px]">attach_file</span>
          <span>Attach Telemetry Logs</span>
        </button>
      </div>
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-60"
      >
        <span>{isSubmitting ? 'Submitting…' : 'Submit to Mentors for Endorsement'}</span>
        <span className="material-symbols-outlined text-[18px]">send</span>
      </button>
    </div>
  </div>
);

export default ActiveSubmission;
