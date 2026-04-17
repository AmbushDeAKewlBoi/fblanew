import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Clock3, UserPlus } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

export default function ProfilePreviewCard({
  profile,
  connected = false,
  pending = false,
  actionLabel = 'Connect',
  onAction,
}) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className="card-surface flex h-full flex-col p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <Link to={`/profile/${profile.id}`} className="flex min-w-0 items-start gap-3">
          <Avatar name={profile.name} size="lg" />
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--atlas-fg)]">{profile.name}</h3>
            <p className="truncate text-sm text-[var(--atlas-muted)]">{profile.chapterName}</p>
          </div>
        </Link>
        {profile.year ? <Badge>{profile.year}</Badge> : null}
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--atlas-fg)]">
        {profile.headline}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(profile.skills || []).slice(0, 3).map((skill) => (
          <span key={skill} className="atlas-chip">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--atlas-muted)]">
          {profile.region}{profile.region && profile.state ? ' · ' : ''}{profile.state}
        </div>
        {connected ? (
          <Badge tone="success" icon={<Check size={11} />}>Connected</Badge>
        ) : pending ? (
          <Badge tone="warn" icon={<Clock3 size={11} />}>Pending</Badge>
        ) : (
          <button
            onClick={onAction}
            className="atlas-btn atlas-btn-primary px-3 py-1.5 text-[11px]"
          >
            <UserPlus size={13} />
            {actionLabel}
          </button>
        )}
      </div>
    </motion.article>
  );
}
