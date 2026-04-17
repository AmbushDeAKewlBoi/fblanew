// Section title with optional kicker and trailing action (link/button).
export default function SectionHeader({ kicker, title, description, action, className = '' }) {
  return (
    <div className={`flex items-end justify-between gap-4 ${className}`}>
      <div className="space-y-1">
        {kicker ? <div className="atlas-kicker">{kicker}</div> : null}
        {title ? (
          <h2 className="text-xl font-semibold tracking-tight text-[var(--atlas-fg)] sm:text-2xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="text-sm text-[var(--atlas-muted)]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
