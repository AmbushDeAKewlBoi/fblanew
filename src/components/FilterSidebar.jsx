import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'downloads', label: 'Most Downloads' },
];

const TYPE_OPTIONS = [
  { value: 'study_guide', label: 'Study Guide' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'questions', label: 'Questions' },
  { value: 'roleplay', label: 'Roleplay' },
  { value: 'other', label: 'Other' },
];

const VISIBILITY_OPTIONS = [
  { value: 'school', label: 'School' },
  { value: 'region', label: 'Region' },
  { value: 'state', label: 'State' },
  { value: 'public', label: 'Public' },
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--atlas-border)] pb-4 dark:border-[var(--atlas-border)] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-[var(--atlas-fg)] transition-colors"
      >
        {title}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-[var(--atlas-muted)]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-1 space-y-1.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckboxItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-[var(--atlas-bg)] dark:hover:bg-[var(--atlas-elev)]/40 transition-colors group">
      <div className={`flex h-4.5 w-4.5 items-center justify-center rounded-md border-2 transition-all duration-200 ${
        checked
          ? 'border-navy-600 bg-navy-600 dark:border-navy-400 dark:bg-navy-400'
          : 'border-warm-300 group-hover:border-warm-400 dark:border-warm-600'
      }`}>
        <motion.svg
          initial={false}
          animate={checked ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
          width="10" height="10" viewBox="0 0 10 10" fill="none"
        >
          <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </div>
      <span className="text-sm text-[var(--atlas-muted)]">{label}</span>
    </label>
  );
}

export default function FilterSidebar({ filters, setFilters, tagOptions = [] }) {
  const toggleFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }));
  };

  const activeCount = filters.types.length + filters.visibility.length + filters.tags.length;

  return (
    <div className="w-64 shrink-0 space-y-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--atlas-muted)] dark:text-[var(--atlas-muted)]">Filters</h3>
        {activeCount > 0 && (
          <button
            onClick={() => setFilters({ types: [], visibility: [], tags: [], sort: 'recent' })}
            className="text-xs font-medium text-navy-600 hover:text-navy-700 dark:text-navy-400 dark:hover:text-navy-300 transition-colors"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterSection title="Sort by" defaultOpen={true}>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilters(prev => ({ ...prev, sort: opt.value }))}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-all duration-200 ${
                filters.sort === opt.value
                  ? 'bg-navy-800/10 text-navy-800 font-medium dark:bg-navy-400/15 dark:text-navy-300'
                  : 'text-[var(--atlas-muted)] hover:bg-[var(--atlas-bg)] dark:text-[var(--atlas-muted)] dark:hover:bg-[var(--atlas-elev)]/40'
              }`}
            >
              <ArrowUpDown size={13} />
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Type */}
      <FilterSection title="Resource Type">
        {TYPE_OPTIONS.map(opt => (
          <CheckboxItem
            key={opt.value}
            label={opt.label}
            checked={filters.types.includes(opt.value)}
            onChange={() => toggleFilter('types', opt.value)}
          />
        ))}
      </FilterSection>

      {/* Visibility */}
      <FilterSection title="Visibility">
        {VISIBILITY_OPTIONS.map(opt => (
          <CheckboxItem
            key={opt.value}
            label={opt.label}
            checked={filters.visibility.includes(opt.value)}
            onChange={() => toggleFilter('visibility', opt.value)}
          />
        ))}
      </FilterSection>

      {/* Tags */}
      {tagOptions.length > 0 && (
        <FilterSection title="Tags" defaultOpen={false}>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tagOptions.map(tag => (
              <button
                key={tag}
                onClick={() => toggleFilter('tags', tag)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
                  filters.tags.includes(tag)
                    ? 'bg-navy-800 text-white dark:bg-navy-500'
                    : 'bg-[var(--atlas-elev)] text-[var(--atlas-muted)] hover:bg-warm-200 dark:bg-[var(--atlas-elev)] dark:text-[var(--atlas-muted)] dark:hover:bg-warm-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
}
