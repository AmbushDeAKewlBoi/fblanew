import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ThumbsUp, Download, FileText, Clock, User as UserIcon, Eye, Tag } from 'lucide-react';
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
  const uploader = resource ? getUserById(resource.uploaderId) : null;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="skeleton h-4 w-32 mb-6" />
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="skeleton h-64 rounded-2xl" />
          </div>
          <div className="w-full lg:w-80 space-y-3">
            <div className="skeleton h-4 w-40" />
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--atlas-elev)] dark:bg-[var(--atlas-elev)]">
            <FileText size={24} className="text-[var(--atlas-muted)]" />
          </div>
          <h1 className="text-xl font-bold text-[var(--atlas-fg)]">Resource not found</h1>
          <Link to="/dashboard" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-navy-700 dark:text-navy-400 transition-colors hover:text-navy-600">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
      </PageTransition>
    );
  }

  const handleUpvote = async () => {
    try {
      const modifier = upvoted ? -1 : 1;
      setUpvoted(!upvoted);
      await updateDoc(doc(db, 'resources', resource.id), { upvoteCount: increment(modifier) });
    } catch (err) { console.error(err); }
  };

  const handleDownload = async () => {
    try {
      await updateDoc(doc(db, 'resources', resource.id), { downloadCount: increment(1) });
      if (resource.downloadUrl) window.open(resource.downloadUrl, '_blank');
    } catch (err) { console.error(err); }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link to={`/events/${resource.eventSlug}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--atlas-muted)] hover:text-[var(--atlas-fg)] dark:text-[var(--atlas-muted)] dark:hover:text-warm-200 transition-colors">
            <ArrowLeft size={14} /> {resource.event}
          </Link>
        </motion.div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main content */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex-1">
            <div className="card-surface p-6 sm:p-8">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="rounded-lg bg-navy-500/10 px-3 py-1 text-xs font-semibold text-navy-700 dark:bg-navy-400/15 dark:text-navy-300">
                  {RESOURCE_TYPE_LABELS_LONG[resource.resourceType] || RESOURCE_TYPE_LABELS_LONG.other}
                </span>
                <VisibilityBadge level={resource.visibilityLevel} size="md" />
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-[var(--atlas-fg)] leading-snug sm:text-2xl dark:text-white">
                {resource.title}
              </h1>

              {/* Meta */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--atlas-muted)]">
                <span className="flex items-center gap-1.5">
                  <UserIcon size={14} />
                  {resource.isAnonymous ? 'Anonymous' : (
                    <Link to={`/profile/${resource.uploaderId}`} className="hover:text-navy-700 dark:hover:text-navy-300 transition-colors">
                      {uploader?.name || 'Community Member'}
                    </Link>
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
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
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 flex items-center gap-6 border-t border-[var(--atlas-border)] pt-6 dark:border-[var(--atlas-border)]">
                <div className="flex items-center gap-1.5 text-sm text-[var(--atlas-muted)]">
                  <ThumbsUp size={16} /> {resource.upvoteCount || 0} upvotes
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[var(--atlas-muted)]">
                  <Download size={16} /> {resource.downloadCount || 0} downloads
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[var(--atlas-muted)]">
                  <Eye size={16} /> {resource.viewCount || 0} views
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <motion.button whileTap={{ scale: 1.05 }} onClick={handleUpvote}
                  className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                    upvoted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'border border-[var(--atlas-border)] text-[var(--atlas-fg)] hover:border-warm-300 hover:shadow-sm dark:border-warm-700 text-[var(--atlas-muted)]'
                  }`}
                >
                  <ThumbsUp size={16} className={upvoted ? 'fill-current' : ''} />
                  {upvoted ? 'Upvoted' : 'Upvote'}
                </motion.button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleDownload}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-navy-800 to-navy-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md dark:from-navy-600 dark:to-navy-500"
                >
                  <Download size={16} />
                  Download {(resource.fileExtension || '').replace('.', '').toUpperCase()} {resource.fileSizeBytes ? `(${formatFileSize(resource.fileSizeBytes)})` : ''}
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
                    <h4 className="text-sm font-medium text-[var(--atlas-fg)] leading-snug transition-colors group-hover:text-navy-700 dark:text-warm-100 dark:group-hover:text-navy-300">
                      {r.title}
                    </h4>
                    <div className="mt-2 flex items-center gap-3 text-xs text-[var(--atlas-muted)] dark:text-[var(--atlas-muted)]">
                      <span className="flex items-center gap-1"><ThumbsUp size={10} /> {r.upvoteCount || 0}</span>
                      <span className="flex items-center gap-1"><Download size={10} /> {r.downloadCount || 0}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--atlas-muted)] dark:text-[var(--atlas-muted)]">No related resources yet.</p>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
