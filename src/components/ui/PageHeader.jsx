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
      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-4xl space-y-4">
          {kicker ? (
            <div className="atlas-kicker">{kicker}</div>
          ) : null}
          {title ? (
            <h1 className="text-[clamp(2.3rem,5vw,4.8rem)] leading-[0.96]">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="max-w-[68ch] text-[clamp(1rem,1.4vw,1.18rem)] leading-relaxed text-[var(--atlas-muted)]">
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
