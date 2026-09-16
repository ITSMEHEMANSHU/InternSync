import { useState } from 'react';
import { NOTIFICATIONS_LIST } from '../../data/mockData.js';
import { statusClass } from '../../constants/statusColors.js';

const TYPE_ICONS = { approval: 'approval', report: 'description', task: 'task_alt', evaluation: 'grade', system: 'info' };

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_LIST);

  const markAll = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markOne = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const today = notifications.filter((n) => n.time.startsWith('2024-11-10'));
  const earlier = notifications.filter((n) => !n.time.startsWith('2024-11-10'));
  const unread = notifications.filter((n) => !n.read).length;

  const NItem = ({ n }) => (
    <div
      onClick={() => markOne(n.id)}
      className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${n.read ? 'bg-surface-container-lowest' : 'bg-primary-fixed/20 border border-primary/10'} hover:bg-surface-container-low`}
    >
      <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[18px] text-primary">{TYPE_ICONS[n.type] || 'notifications'}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-label-md text-label-md font-bold text-on-surface">{n.title}</span>
          {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{n.message}</p>
        <span className="font-body-xs text-body-xs text-on-surface-variant mt-1 block">{n.time}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-space-lg">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">Notifications</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="px-4 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60 font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-all">
            Mark all read
          </button>
        )}
      </div>

      {today.length > 0 && (
        <div className="mb-space-lg">
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-3">Today</p>
          <div className="flex flex-col gap-2">{today.map((n) => <NItem key={n.id} n={n} />)}</div>
        </div>
      )}
      {earlier.length > 0 && (
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-3">Earlier</p>
          <div className="flex flex-col gap-2">{earlier.map((n) => <NItem key={n.id} n={n} />)}</div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
