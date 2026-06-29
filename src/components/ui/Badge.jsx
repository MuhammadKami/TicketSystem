const TONES = {
  new: { label: 'New', tone: 'blue' },
  in_progress: { label: 'In Progress', tone: 'amber' },
  auto_resolved: { label: 'Auto-Resolved', tone: 'green' },
  escalated: { label: 'Escalated', tone: 'red' },
  resolved: { label: 'Resolved', tone: 'green' },
  closed: { label: 'Closed', tone: 'gray' },
  low: { label: 'Low', tone: 'gray' },
  medium: { label: 'Medium', tone: 'blue' },
  high: { label: 'High', tone: 'amber' },
  urgent: { label: 'Urgent', tone: 'red' },
  positive: { label: 'Positive', tone: 'green' },
  neutral: { label: 'Neutral', tone: 'gray' },
  negative: { label: 'Negative', tone: 'amber' },
  frustrated: { label: 'Frustrated', tone: 'red' },
};

const TONE_CLASSES = {
  green: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export default function Badge({ value, tone, label, dot = false, icon: Icon = null, className = '' }) {
  const preset = (value && TONES[value]) || {};
  const finalTone = tone || preset.tone || 'gray';
  const finalLabel = label || preset.label || value || '';

  const cls = [
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
    TONE_CLASSES[finalTone],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={cls}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {Icon && <Icon size={12} strokeWidth={2} />}
      {finalLabel}
    </span>
  );
}
