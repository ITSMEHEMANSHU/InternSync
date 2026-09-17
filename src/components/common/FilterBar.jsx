const FilterBar = ({ filters = [], activeFilters = {}, onChange, onClear }) => {
  if (!Array.isArray(filters)) return null;

  const hasActive = Object.values(activeFilters || {}).some(Boolean);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((f) => (
        <button
          key={`${f.key}-${f.value}`}
          onClick={() => onChange?.(f.key, f.value)}
          className={`px-3 py-1.5 rounded-full text-[12px] font-label-md font-semibold border transition-all ${activeFilters?.[f.key] === f.value
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-surface-container-lowest text-on-surface border-outline-variant/60 hover:bg-surface-container-low'
            }`}
        >
          {f.label}
        </button>
      ))}
      {hasActive && onClear && (
        <button
          onClick={onClear}
          className="px-3 py-1.5 rounded-full text-[12px] font-label-md font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default FilterBar;