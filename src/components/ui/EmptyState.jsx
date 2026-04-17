// Brutalist empty / not-found / no-results state.
// Use inside an `atlas-panel` content area or as a dropped-in placeholder.
export default function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div className={`atlas-panel flex flex-col items-center gap-3 px-6 py-12 text-center ${className}`}>
      {icon ? (
        <div className="flex h-12 w-12 items-center justify-center border-2 border-[var(--atlas-border)] text-[var(--atlas-accent)]" style={{ borderRadius: 2 }}>
          {icon}
        </div>
      ) : null}
      {title ? (
        <h3 className="text-lg font-semibold text-[var(--atlas-fg)]">{title}</h3>
      ) : null}
      {description ? (
        <p className="max-w-md text-sm text-[var(--atlas-muted)]">{description}</p>
      ) : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
