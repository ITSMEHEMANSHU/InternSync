const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40 transition-colors">
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onChange(p)} className={`w-8 h-8 rounded-lg text-[13px] font-semibold transition-all ${p === page ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40 transition-colors">
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;
