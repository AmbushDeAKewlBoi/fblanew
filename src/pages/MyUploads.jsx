import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThumbsUp, Download, Eye, Trash2, ExternalLink, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useResources } from '../hooks/useResources';
import VisibilityBadge from '../components/VisibilityBadge';
import AnimatedCounter from '../components/AnimatedCounter';
import PageTransition from '../components/PageTransition';
import PageHeader from '../components/ui/PageHeader';
import StatTile from '../components/ui/StatTile';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import { formatFileSize } from '../lib/formatters';
import { RESOURCE_TYPE_LABELS } from '../lib/resources';

export default function MyUploads() {
  const { user } = useAuth();
  const { resources, loading } = useResources();
  const myResources = user ? resources.filter((r) => r.uploaderId === user.id) : [];
  const [deletedIds, setDeletedIds] = useState([]);
  const active = myResources.filter((r) => !deletedIds.includes(r.id));

  const totals = active.reduce(
    (acc, r) => ({
      upvotes: acc.upvotes + (r.upvoteCount || 0),
      downloads: acc.downloads + (r.downloadCount || 0),
      views: acc.views + (r.viewCount || 0),
    }),
    { upvotes: 0, downloads: 0, views: 0 }
  );

  const handleDelete = (id) => setDeletedIds((prev) => [...prev, id]);

  if (loading) {
    return (
      <div className="atlas-page mx-auto max-w-5xl">
        <div className="mb-8 space-y-2">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-32" />
        </div>
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24" />)}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-20" />)}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="atlas-page mx-auto max-w-5xl">
        <PageHeader
          kicker="Library"
          title="My uploads"
          subtitle="Everything you've shared with the Atlas community."
          meta={`${active.length} resource${active.length === 1 ? '' : 's'} live`}
          actions={(
            <Link to="/upload" className="atlas-btn atlas-btn-primary">
              <Upload size={13} />
              Upload resource
            </Link>
          )}
          rightSlot={(
            <div className="grid grid-cols-3 gap-2">
              <StatTile label="Upvotes" value={<AnimatedCounter value={totals.upvotes} />} icon={<ThumbsUp size={14} />} tone="accent" />
              <StatTile label="Downloads" value={<AnimatedCounter value={totals.downloads} />} icon={<Download size={14} />} tone="gold" />
              <StatTile label="Views" value={<AnimatedCounter value={totals.views} />} icon={<Eye size={14} />} />
            </div>
          )}
        />

        <div className="mt-8">
          {active.length > 0 ? (
            <ul className="space-y-3">
              {active.map((r, i) => (
                <motion.li
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.3) }}
                  className="card-surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <Badge>{RESOURCE_TYPE_LABELS[r.resourceType] || RESOURCE_TYPE_LABELS.other}</Badge>
                      <VisibilityBadge level={r.visibilityLevel} />
                    </div>
                    <Link
                      to={`/resource/${r.id}`}
                      className="text-[15px] font-semibold text-[var(--atlas-fg)] transition-colors hover:text-[var(--atlas-accent)]"
                    >
                      {r.title}
                    </Link>
                    <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
                      {r.event} · {r.fileExtension.replace('.', '').toUpperCase()} · {formatFileSize(r.fileSizeBytes)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--atlas-muted)] tabular-nums">
                    <span className="flex items-center gap-1"><ThumbsUp size={12} /> {r.upvoteCount}</span>
                    <span className="flex items-center gap-1"><Download size={12} /> {r.downloadCount}</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {r.viewCount}</span>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <Link
                      to={`/resource/${r.id}`}
                      aria-label="Open resource"
                      className="border-2 border-transparent p-2 text-[var(--atlas-muted)] transition-colors hover:border-[var(--atlas-border)] hover:text-[var(--atlas-fg)]"
                      style={{ borderRadius: 2 }}
                    >
                      <ExternalLink size={15} />
                    </Link>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(r.id)}
                      aria-label={`Delete ${r.title}`}
                      className="border-2 border-transparent p-2 text-[var(--atlas-muted)] transition-colors hover:border-red-500/55 hover:text-red-600 dark:hover:text-red-400"
                      style={{ borderRadius: 2 }}
                    >
                      <Trash2 size={15} />
                    </motion.button>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<Upload size={20} />}
              title="No uploads yet"
              description="Share a resource to help your chapter and grow your reputation."
              action={
                <Link to="/upload" className="atlas-btn atlas-btn-primary">
                  Upload your first resource
                </Link>
              }
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
