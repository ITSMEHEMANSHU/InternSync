export const STATUS_COLORS = {
  approved:    { bg: 'bg-tertiary-fixed',       text: 'text-on-tertiary-fixed' },
  active:      { bg: 'bg-tertiary-fixed',       text: 'text-on-tertiary-fixed' },
  completed:   { bg: 'bg-tertiary-fixed',       text: 'text-on-tertiary-fixed' },
  verified:    { bg: 'bg-tertiary-fixed',       text: 'text-on-tertiary-fixed' },
  pending:     { bg: 'bg-secondary-fixed',      text: 'text-on-secondary-fixed' },
  review:      { bg: 'bg-secondary-fixed',      text: 'text-on-secondary-fixed' },
  shortlisted: { bg: 'bg-primary-fixed',        text: 'text-on-primary-fixed' },
  inprogress:  { bg: 'bg-primary-fixed',        text: 'text-on-primary-fixed' },
  rejected:    { bg: 'bg-error-container',      text: 'text-on-error-container' },
  atrisk:      { bg: 'bg-error-container',      text: 'text-on-error-container' },
  high:        { bg: 'bg-error-container',      text: 'text-on-error-container' },
  medium:      { bg: 'bg-secondary-fixed',      text: 'text-on-secondary-fixed' },
  low:         { bg: 'bg-tertiary-fixed',       text: 'text-on-tertiary-fixed' },
  draft:       { bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
  inactive:    { bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
};

export const statusClass = (status) => {
  const key = status?.toLowerCase().replace(/[\s-]/g, '') || 'draft';
  const s = STATUS_COLORS[key] || STATUS_COLORS.draft;
  return `${s.bg} ${s.text}`;
};
