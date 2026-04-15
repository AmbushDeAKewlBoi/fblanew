import { School, MapPin, Map, Globe } from 'lucide-react';

export default function VisibilityBadge({ level, size = 'sm' }) {
  const config = {
    school: {
      label: 'School',
      Icon: School,
      className: 'bg-vis-school-bg text-vis-school dark:bg-vis-school/20 dark:text-blue-300',
    },
    region: {
      label: 'Region',
      Icon: MapPin,
      className: 'bg-vis-region-bg text-vis-region dark:bg-vis-region/20 dark:text-green-300',
    },
    state: {
      label: 'State',
      Icon: Map,
      className: 'bg-vis-state-bg text-vis-state dark:bg-vis-state/20 dark:text-orange-300',
    },
    public: {
      label: 'Public',
      Icon: Globe,
      className: 'bg-vis-public-bg text-vis-public dark:bg-warm-800 dark:text-warm-400',
    },
  };

  const c = config[level] || config.public;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  const iconSize = size === 'sm' ? 10 : 13;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses} ${c.className}`}>
      <c.Icon size={iconSize} />
      {c.label}
    </span>
  );
}
