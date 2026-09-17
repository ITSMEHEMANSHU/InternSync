const AicteGuidelines = () => (
  <>
    {/* AICTE Rule 4.3 */}
    <div className="p-space-md rounded-xl bg-surface-container-low/70 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-secondary text-[20px]">policy</span>
        <h3 className="font-headline-sm text-headline-sm font-bold">Statutory AICTE Guideline 4.3</h3>
      </div>
      <p className="font-body-xs text-body-xs text-on-surface-variant leading-relaxed">
        Weekly logs must be submitted strictly prior to{' '}
        <strong className="text-on-surface">Friday 23:59 IST</strong>. Failure to lodge reports for 2 consecutive cycles
        automatically triggers an institutional review and freezes academic internship credit disbursement.
      </p>
      <div className="flex flex-col gap-2 pt-1">
        <a href="#" className="inline-flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">description</span>
            <span>Download AICTE LaTeX Template</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">download</span>
        </a>
        <a href="#" className="inline-flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[18px]">history_edu</span>
            <span>Rubric Assessment Criteria (v3.2)</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">open_in_new</span>
        </a>
      </div>
    </div>

    {/* TPO Support */}
    <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary-fixed/40 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">contact_support</span>
        </div>
        <div>
          <span className="font-label-md text-label-md font-bold text-on-surface block">Need Help Filing?</span>
          <span className="font-body-xs text-body-xs text-on-surface-variant">Campus Placement Cell Helpline</span>
        </div>
      </div>
      <button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold hover:bg-surface-container-high transition-colors">
        Contact TPO
      </button>
    </div>
  </>
);

export default AicteGuidelines;
