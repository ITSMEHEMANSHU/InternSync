import { useState, useRef, useEffect } from 'react';

const SearchableSelect = ({
    options = [],          // [{ value, label, sublabel? }]
    value,
    onChange,
    placeholder = 'Select…',
    disabled = false,
    emptyMessage = 'No results',
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    const selected = options.find((o) => o.value === value);

    const filtered = query.trim()
        ? options.filter((o) =>
            o.label.toLowerCase().includes(query.toLowerCase()) ||
            (o.sublabel || '').toLowerCase().includes(query.toLowerCase())
        )
        : options;

    const handleSelect = (opt) => {
        onChange(opt.value);
        setOpen(false);
        setQuery('');
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
        setQuery('');
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-left disabled:opacity-60"
            >
                <span className={`font-body-md ${selected ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {selected ? selected.label : placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {selected && !disabled && (
                        <span
                            onClick={handleClear}
                            className="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-on-surface cursor-pointer"
                        >
                            close
                        </span>
                    )}
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                        {open ? 'expand_less' : 'expand_more'}
                    </span>
                </div>
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-surface-container-lowest rounded-lg shadow-lg border border-outline-variant max-h-72 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-outline-variant/40">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">
                                search
                            </span>
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search…"
                                className="w-full pl-9 pr-3 py-2 rounded-md bg-surface-container text-sm text-on-surface focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-56">
                        {filtered.length === 0 && (
                            <div className="px-4 py-3 text-sm text-on-surface-variant text-center">
                                {emptyMessage}
                            </div>
                        )}
                        {filtered.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSelect(opt)}
                                className={`w-full text-left px-4 py-2.5 hover:bg-surface-container transition-colors ${value === opt.value ? 'bg-primary-container/20 font-semibold' : ''
                                    }`}
                            >
                                <div className="text-sm font-medium text-on-surface">{opt.label}</div>
                                {opt.sublabel && (
                                    <div className="text-xs text-on-surface-variant mt-0.5">{opt.sublabel}</div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;