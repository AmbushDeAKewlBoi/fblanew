import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ThumbsUp,
  Download,
  FileText,
  Clock,
  User as UserIcon,
  Eye,
  Tag,
} from '@phosphor-icons/react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useResources } from '../hooks/useResources';
import { db } from '../config/firebase';
import VisibilityBadge from '../components/VisibilityBadge';
import PageTransition from '../components/PageTransition';
import { getUserById } from '../data/mockUsers';
import { formatFileSize, formatDateLong } from '../lib/formatters';
import { RESOURCE_TYPE_LABELS_LONG } from '../lib/resources';

export default function ResourceDetail() {
  const { id } = useParams();
  const { resources, loading } = useResources();
  const resource = resources.find(r => String(r.id) === String(id));
  const related = resource ? resources.filter(r => r.event === resource.event && r.id !== resource.id).slice(0, 3) : [];
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(resource?.upvoteCount || 0);
  const [downloadCount, setDownloadCount] = useState(resource?.downloadCount || 0);
  const uploader = resource ? getUserById(resource.uploaderId) : null;

  useEffect(() => {
    if (!resource) return;
    setUpvoteCount(resource.upvoteCount || 0);
    setDownloadCount(resource.downloadCount || 0);
    setUpvoted(false);
  }, [resource?.id, resource?.upvoteCount, resource?.downloadCount]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="skeleton h-4 w-32 mb-6" />
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="skeleton h-64" style={{ borderRadius: 12 }} />
          </div>
          <div className="w-full lg:w-80 space-y-3">
            <div className="skeleton h-4 w-40" />
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-24" style={{ borderRadius: 12 }} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-[var(--atlas-border)] bg-[var(--atlas-elev)] dark:bg-[var(--atlas-elev)]" style={{ borderRadius: 12 }}>
            <FileText size={24} weight="regular" className="text-[var(--atlas-muted)]" />
          </div>
          <h1 className="text-xl font-bold text-[var(--atlas-fg)]">Resource not found</h1>
          <Link to="/dashboard" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--atlas-accent)] transition-colors hover:text-[var(--atlas-fg)]">
            <ArrowLeft size={14} weight="regular" /> Back to dashboard
          </Link>
        </div>
      </PageTransition>
    );
  }

  const handleUpvote = async () => {
    try {
      const modifier = upvoted ? -1 : 1;
      setUpvoted(!upvoted);
      setUpvoteCount((prev) => Math.max(0, prev + modifier));
      await updateDoc(doc(db, 'resources', resource.id), { upvoteCount: increment(modifier) });
    } catch (err) {
      setUpvoted((prev) => !prev);
      setUpvoteCount(resource.upvoteCount || 0);
      console.error(err);
    }
  };

  const handleDownload = async () => {
    if (!resource.downloadUrl) return;
    setDownloadCount((prev) => prev + 1);
    try {
      await updateDoc(doc(db, 'resources', resource.id), { downloadCount: increment(1) });
      window.open(resource.downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setDownloadCount(resource.downloadCount || 0);
      console.error(err);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link to={`/events/${resource.eventSlug}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--atlas-muted)] transition-colors hover:text-[var(--atlas-fg)]">
            <ArrowLeft size={14} weight="regular" /> {resource.event}
          </Link>
        </motion.div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main content */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex-1">
            <div className="card-surface p-6 sm:p-8">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="atlas-chip atlas-chip-active">
                  {RESOURCE_TYPE_LABELS_LONG[resource.resourceType] || RESOURCE_TYPE_LABELS_LONG.other}
                </span>
                <VisibilityBadge level={resource.visibilityLevel} size="md" />
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-[var(--atlas-fg)] leading-snug sm:text-2xl">
                {resource.title}
              </h1>

              {/* Meta */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--atlas-muted)]">
                <span className="flex items-center gap-1.5">
                  <UserIcon size={14} weight="regular" />
                  {resource.isAnonymous ? 'Anonymous' : (
                    <Link to={`/profile/${resource.uploaderId}`} className="transition-colors hover:text-[var(--atlas-accent)]">
                      {uploader?.name || 'Community Member'}
                    </Link>
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} weight="regular" />
                  {formatDateLong(resource.createdAt)}
                </span>
              </div>

              {/* Description */}
              <div className="mt-6 text-sm leading-relaxed text-[var(--atlas-fg)]">
                {resource.description}
              </div>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {resource.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-[var(--atlas-elev)] px-2.5 py-1 text-xs font-medium text-[var(--atlas-muted)] dark:bg-[var(--atlas-elev)] dark:text-[var(--atlas-muted)]">
                    <Tag size={10} weight="regular" /> {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 flex items-center gap-6 border-t border-[var(--atlas-border)] pt-6 dark:border-[var(--atlas-border)]">
                <div className="flex items-center gap-1.5 text-sm text-[var(--atlas-muted)]">
                  <ThumbsUp size={16} weight="regular" /> {upvoteCount} upvotes
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[var(--atlas-muted)]">
                  <Download size={16} weight="regular" /> {downloadCount} downloads
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[var(--atlas-muted)]">
                  <Eye size={16} weight="regular" /> {resource.viewCount || 0} views
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={handleUpvote}
                  className={`atlas-btn ${
                    upvoted
                      ? 'atlas-btn-primary'
                      : 'atlas-btn-ghost'
                  }`}
                >
                  <ThumbsUp size={16} weight={upvoted ? 'fill' : 'regular'} />
                  {upvoted ? 'Upvoted' : 'Upvote'}
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  disabled={!resource.downloadUrl}
                  className="atlas-btn atlas-btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                  title={resource.downloadUrl ? 'Download resource' : 'File preview unavailable'}
                >
                  <Download size={16} weight="regular" /> Download {(resource.fileExtension || '').replace('.', '').toUpperCase()} {resource.fileSizeBytes ? `(${formatFileSize(resource.fileSizeBytes)})` : ''}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="w-full lg:w-80 shrink-0">
            <h3 className="mb-4 text-sm font-semibold text-[var(--atlas-fg)]">
              More from {resource.event}
            </h3>
            {related.length > 0 ? (
              <div className="space-y-3">
                {related.map(r => (
                  <Link key={r.id} to={`/resource/${r.id}`}
                    className="card-surface block p-4 group"
                  >
                    <h4 className="text-sm font-medium text-[var(--atlas-fg)] leading-snug transition-colors group-hover:text-[var(--atlas-accent)]">
                      {r.title}
                    </h4>
                    <div className="mt-2 flex items-center gap-3 text-xs text-[var(--atlas-muted)]">
                      <span className="flex items-center gap-1"><ThumbsUp size={10} weight="regular" /> {r.upvoteCount || 0}</span>
                      <span className="flex items-center gap-1"><Download size={10} weight="regular" /> {r.downloadCount || 0}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--atlas-muted)]">No related resources yet.</p>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
