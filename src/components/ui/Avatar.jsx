import { Link } from 'react-router-dom';
import { initials } from '../../lib/formatters';

// Brutalist Atlas avatar: square-ish with a hard accent border and mono initials.
// Sizes map to typical placements: sm (32), md (40), lg (48), xl (64).
const SIZE_MAP = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-[12px]',
  lg: 'h-12 w-12 text-[14px]',
  xl: 'h-16 w-16 text-lg',
};

export default function Avatar({
  name,
  size = 'md',
  linkTo,
  tone = 'steel', // 'steel' | 'gold'
  className = '',
}) {
  const sizeCls = SIZE_MAP[size] || SIZE_MAP.md;
  const toneCls = tone === 'gold'
    ? 'border-[var(--atlas-gold)]/70 bg-[rgba(184,154,82,0.12)] text-[var(--atlas-gold)]'
    : 'border-[var(--atlas-accent)]/55 bg-[rgba(109,158,168,0.12)] text-[var(--atlas-fg)]';

  const content = (
    <span
      aria-hidden={linkTo ? 'true' : undefined}
      className={`inline-flex shrink-0 items-center justify-center border-2 font-[family-name:var(--font-mono)] font-bold tracking-[0.08em] ${sizeCls} ${toneCls} ${className}`}
    >
      {initials(name)}
    </span>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} aria-label={name || 'Profile'} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
