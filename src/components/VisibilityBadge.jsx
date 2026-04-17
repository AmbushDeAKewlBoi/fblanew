import { School, MapPin, Map, Globe } from 'lucide-react';

const badgeConfig = {
  school: {
    label: 'School',
    icon: School,
    classes: 'bg-blue-500/10 text-blue-500 dark:bg-blue-400/15 dark:text-blue-400 ring-blue-500/20',
    dotColor: 'bg-blue-500',
  },
  region: {
    label: 'Region',
    icon: MapPin,
    classes: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400 ring-emerald-500/20',
    dotColor: 'bg-emerald-500',
  },
  state: {
    label: 'State',
    icon: Map,
    classes: 'bg-orange-500/10 text-orange-600 dark:bg-orange-400/15 dark:text-orange-400 ring-orange-500/20',
    dotColor: 'bg-orange-500',
  },
  public: {
    label: 'Public',
    icon: Globe,
    classes: 'border border-[var(--atlas-border)] bg-[var(--atlas-surface)] text-[var(--atlas-muted)] ring-[var(--atlas-border)]',
    dotColor: 'bg-[var(--atlas-muted)]',
  },
};

export default function VisibilityBadge({ level, size = 'sm' }) {
  const c = badgeConfig[level] || badgeConfig.public;
  const Icon = c.icon;
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-wide ${c.classes} ${
        isSmall ? '' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${c.dotColor} opacity-50`} />
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${c.dotColor}`} />
      </span>
      <Icon size={isSmall ? 12 : 14} />
      {c.label}
    </span>
  );
}
