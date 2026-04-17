// Brutalist Atlas badge — small uppercase mono pill with tonal variants.
const TONE_MAP = {
  default: 'border-[var(--atlas-border)] text-[var(--atlas-muted)] bg-[var(--atlas-surface)]',
  accent:  'border-[var(--atlas-accent)]/55 text-[var(--atlas-fg)] bg-[rgba(61,109,118,0.12)] dark:bg-[rgba(109,158,168,0.18)]',
  gold:    'border-[var(--atlas-gold)]/55 text-[var(--atlas-gold)] bg-[rgba(184,154,82,0.10)]',
  success: 'border-emerald-500/55 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10',
  warn:    'border-amber-500/55 text-amber-700 dark:text-amber-300 bg-amber-500/10',
  danger:  'border-red-500/55 text-red-700 dark:text-red-300 bg-red-500/10',
};

export default function Badge({ tone = 'default', icon, children, className = '' }) {
  const cls = TONE_MAP[tone] || TONE_MAP.default;
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.18em] ${cls} ${className}`}
      style={{ borderRadius: 2 }}
    >
      {icon ? <span aria-hidden="true" className="inline-flex">{icon}</span> : null}
      {children}
    </span>
  );
}
