import { statusClass } from '../../constants/statusColors.js';

const StatusBadge = ({ status, className = '' }) => {
  const statusStr = typeof status === 'object' && status !== null ? (status.status || status.stage || 'pending') : (status || 'pending');
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-label-sm font-bold capitalize ${statusClass(statusStr)} ${className}`}>
      {statusStr?.replace(/-/g, ' ')}
    </span>
  );
};

export default StatusBadge;
