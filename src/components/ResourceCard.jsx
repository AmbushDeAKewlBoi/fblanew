import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThumbsUp, Download, FileText, Clock, User as UserIcon, Eye } from 'lucide-react';
import VisibilityBadge from './VisibilityBadge';
import { getUserById, getChapterById } from '../data/mockUsers';

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

const TYPE_LABELS = {
  presentation: 'Presentation',
  roleplay: 'Roleplay',
  questions: 'Questions',
  study_guide: 'Study Guide',
  other: 'Other',
};

const TYPE_COLORS = {
  presentation: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  roleplay: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  questions: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  study_guide: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  other: 'bg-warm-200/60 text-warm-600 dark:bg-warm-800 dark:text-warm-400',
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
      <div className="h-0.5 w-full bg-gradient-to-r from-navy-600 via-navy-400 to-gold-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <Link to={`/resource/${resource.id}`} className="flex flex-1 flex-col p-5">
        {/* Header badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[resource.resourceType]}`}>
            {TYPE_LABELS[resource.resourceType]}
          </span>
          <VisibilityBadge level={resource.visibilityLevel} />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-[15px] font-semibold leading-snug text-warm-900 transition-colors group-hover:text-navy-700 dark:text-warm-100 dark:group-hover:text-navy-300 line-clamp-2">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="mb-3 flex-1 text-sm leading-relaxed text-warm-500 dark:text-warm-400 line-clamp-2">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 3).map(tag => (
            <span key={tag} className="rounded-md bg-warm-100 px-2 py-0.5 text-xs font-medium text-warm-600 dark:bg-warm-800 dark:text-warm-400 transition-colors">
              {tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="text-xs text-warm-400 dark:text-warm-500">+{resource.tags.length - 3}</span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-warm-400 dark:text-warm-500 mb-3">
          <span className="flex items-center gap-1">
            <UserIcon size={11} />
            {resource.isAnonymous ? 'Anonymous' : uploader?.name}
          </span>
          <span className="text-warm-300 dark:text-warm-700">·</span>
          <span className="truncate">{chapter?.name}</span>
          <span className="text-warm-300 dark:text-warm-700">·</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {timeAgo(resource.createdAt)}
          </span>
        </div>
      </Link>

      {/* Actions footer */}
      <div className="flex items-center gap-2 border-t border-warm-100 px-5 py-3 dark:border-warm-800/60">
        <motion.button
          onClick={handleUpvote}
          whileTap={{ scale: 1.15 }}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
            upvoted
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'text-warm-500 hover:bg-warm-100 hover:text-warm-700 dark:hover:bg-warm-800 dark:hover:text-warm-300'
          }`}
        >
          <ThumbsUp size={13} className={upvoted ? 'fill-current' : ''} />
          {upvoteCount}
        </motion.button>
        <motion.button
          onClick={handleDownload}
          whileTap={{ scale: 1.1 }}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-warm-500 transition-all duration-200 hover:bg-warm-100 hover:text-warm-700 dark:hover:bg-warm-800 dark:hover:text-warm-300"
        >
          <Download size={13} />
          {downloadCount}
        </motion.button>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-warm-400 dark:text-warm-500">
          <FileText size={11} />
          {resource.fileExtension.replace('.', '').toUpperCase()} · {formatFileSize(resource.fileSizeBytes)}
        </span>
      </div>
    </motion.div>
  );
}
