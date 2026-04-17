// Atlas page hero. Replaces the rounded-2xl gradient hero blocks
// previously used on Feed/Connections/Profile/Messages/Notifications.
//
// Layout: kicker line + display-styled title + subtitle on the left,
// optional content (stats, actions) on the right.
export default function PageHeader({
  kicker,
  title,
  subtitle,
  meta,           // small metadata line shown beneath subtitle
  actions,        // node — typically buttons
  rightSlot,      // arbitrary node aligned to the right (stats, etc.)
  className = '',
}) {
  return (
    <header className={`atlas-hero ${className}`}>
      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-2xl space-y-3">
          {kicker ? (
            <div className="atlas-kicker">{kicker}</div>
          ) : null}
          {title ? (
            <h1 className="text-3xl leading-[1.05] sm:text-4xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="text-[15px] leading-relaxed text-[var(--atlas-muted)]">
              {subtitle}
            </p>
          ) : null}
          {meta ? (
            <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--atlas-muted)]">
              {meta}
            </div>
          ) : null}
          {actions ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">{actions}</div>
          ) : null}
        </div>
        {rightSlot ? (
          <div className="shrink-0">{rightSlot}</div>
        ) : null}
      </div>
    </header>
  );
}
