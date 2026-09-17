const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => (
  <div className={`relative flex items-center ${className}`}>
    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px] pointer-events-none">search</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-9 pl-9 pr-8 rounded-lg bg-surface-container-low border border-outline-variant/60 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
    />
    {value && (
      <button onClick={() => onChange('')} className="absolute right-2.5 text-on-surface-variant hover:text-on-surface">
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    )}
  </div>
);

export default SearchBar;
