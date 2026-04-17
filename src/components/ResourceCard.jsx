import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThumbsUp, Download, FileText, Clock, User as UserIcon } from 'lucide-react';
import VisibilityBadge from './VisibilityBadge';
import { getUserById, getChapterById } from '../data/mockUsers';
import { formatFileSize, timeAgo } from '../lib/formatters';
import { RESOURCE_TYPE_LABELS } from '../lib/resources';

const TYPE_COLORS = {
  presentation: 'border border-[var(--atlas-accent)]/35 bg-[rgba(109,158,168,0.1)] text-[var(--atlas-accent)]',
  roleplay: 'border border-[var(--atlas-gold)]/40 bg-[rgba(184,154,82,0.1)] text-[var(--atlas-gold)]',
  questions: 'border border-[var(--atlas-border)] bg-[var(--atlas-surface)] text-[var(--atlas-muted)]',
  study_guide: 'border border-emerald-800/30 bg-emerald-900/10 text-emerald-700 dark:text-emerald-400',
  other: 'border border-[var(--atlas-border)] text-[var(--atlas-muted)]',
};

export default function ResourceCard({ resource }) {
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(resource.upvoteCount);
  const [downloadCount, setDownloadCount] = useState(resource.downloadCount);

  const uploader = getUserById(resource.uploaderId);
  const chapter = getChapterById(resource.chapterId);

  const handleUpvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (upvoted) {
      setUpvoteCount(prev => prev - 1);
    } else {
      setUpvoteCount(prev => prev + 1);
    }
    setUpvoted(!upvoted);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDownloadCount(prev => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="card-surface group relative flex flex-col overflow-hidden"
    >
      {/* Top accent gradient — reveals on hover */}
      <div className="h-0.5 w-full bg-[var(--atlas-accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <Link to={`/resource/${resource.id}`} className="flex flex-1 flex-col p-5">
        {/* Header badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.12em] ${TYPE_COLORS[resource.resourceType] || TYPE_COLORS.other}`}>
            {RESOURCE_TYPE_LABELS[resource.resourceType] || RESOURCE_TYPE_LABELS.other}
          </span>
          <VisibilityBadge level={resource.visibilityLevel} />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-[15px] font-bold leading-snug text-[var(--atlas-fg)] transition-colors group-hover:text-[var(--atlas-accent)] line-clamp-2">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="mb-3 flex-1 text-sm leading-relaxed text-[var(--atlas-muted)] line-clamp-2">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 3).map(tag => (
            <span key={tag} className="border border-[var(--atlas-border)] bg-[var(--atlas-surface)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--atlas-muted)] transition-colors">
              {tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--atlas-muted)]">+{resource.tags.length - 3}</span>
          )}
        </div>

        {/* Meta row */}
        <div className="mb-3 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--atlas-muted)]">
          <span className="flex items-center gap-1">
            <UserIcon size={11} />
            {resource.isAnonymous ? 'Anonymous' : (
              <Link to={`/profile/${resource.uploaderId}`} className="text-[var(--atlas-fg)] transition-colors hover:text-[var(--atlas-accent)]">
                {uploader?.name}
              </Link>
            )}
          </span>
          <span className="text-[var(--atlas-border)]">·</span>
          <span className="truncate">{chapter?.name}</span>
          <span className="text-[var(--atlas-border)]">·</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {timeAgo(resource.createdAt)}
          </span>
        </div>
      </Link>

      {/* Actions footer */}
      <div className="flex items-center gap-2 border-t border-[var(--atlas-border)] px-5 py-3">
        <motion.button
          onClick={handleUpvote}
          whileTap={{ scale: 1.15 }}
          className={`flex items-center gap-1.5 border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-wide transition-all duration-200 ${
            upvoted
              ? 'border-emerald-700/40 bg-emerald-900/15 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-[var(--atlas-muted)] hover:border-[var(--atlas-border)] hover:text-[var(--atlas-fg)]'
          }`}
        >
          <ThumbsUp size={13} className={upvoted ? 'fill-current' : ''} />
          {upvoteCount}
        </motion.button>
        <motion.button
          onClick={handleDownload}
          whileTap={{ scale: 1.1 }}
          className="flex items-center gap-1.5 border border-transparent px-3 py-1.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-wide text-[var(--atlas-muted)] transition-all duration-200 hover:border-[var(--atlas-border)] hover:text-[var(--atlas-fg)]"
        >
          <Download size={13} />
          {downloadCount}
        </motion.button>
        <span className="ml-auto flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--atlas-muted)]">
          <FileText size={11} />
          {resource.fileExtension.replace('.', '').toUpperCase()} · {formatFileSize(resource.fileSizeBytes)}
        </span>
      </div>
    </motion.div>
  );
}
