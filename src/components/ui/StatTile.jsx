// Compact brutalist stat tile — used in headers, dashboards, profile.
export default function StatTile({ label, value, hint, icon, tone = 'default', className = '' }) {
  const accent = tone === 'gold'
    ? 'text-[var(--atlas-gold)]'
    : tone === 'accent'
    ? 'text-[var(--atlas-accent)]'
    : 'text-[var(--atlas-fg)]';

  return (
    <div
      className={`atlas-panel flex min-w-[120px] flex-col gap-1 px-4 py-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="atlas-kicker">{label}</span>
        {icon ? <span className={`opacity-70 ${accent}`}>{icon}</span> : null}
      </div>
      <div className={`font-[family-name:var(--font-display)] text-2xl leading-none ${accent}`}>
        {value}
      </div>
      {hint ? (
        <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
          {hint}
        </div>
      ) : null}
    </div>
  );
}
