import { useState } from 'react';
import EmptyState from './EmptyState.jsx';
import Skeleton from './Skeleton.jsx';

const DataTable = ({ columns = [], data = [], loading, onRowClick, emptyIcon, emptyTitle, emptyDescription, emptyAction }) => {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const getKey = (col) => col.key || col.accessor;
  const getLabel = (col) => col.label || col.header;

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        return sortDir === 'asc' ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
      })
    : data;

  if (loading) return <Skeleton variant="table" rows={5} />;

  if (!data || !data.length)
    return (
      <EmptyState
        icon={emptyIcon || 'inbox'}
        title={emptyTitle || 'No data'}
        description={emptyDescription || ''}
        action={emptyAction}
      />
    );

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/40 bg-surface-container-low/50">
              {columns.map((col, idx) => {
                const key = getKey(col) || idx;
                const label = getLabel(col);
                return (
                  <th
                    key={key}
                    onClick={() => col.sortable && handleSort(key)}
                    className={`px-4 py-3 text-left font-label-md text-label-md text-on-surface-variant font-semibold ${
                      col.sortable ? 'cursor-pointer hover:text-on-surface select-none' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {col.sortable && sortKey === key && (
                        <span className="material-symbols-outlined text-[14px]">
                          {sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-outline-variant/20 last:border-0 transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-surface-container-low/50' : ''
                }`}
              >
                {columns.map((col, j) => {
                  const key = getKey(col);
                  const val = key && typeof row === 'object' && row !== null ? row[key] : undefined;
                  return (
                    <td key={key || j} className="px-4 py-3 font-body-md text-body-md text-on-surface">
                      {col.render ? col.render(row, val) : (val ?? '—')}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
