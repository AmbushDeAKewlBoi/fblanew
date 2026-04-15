import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, Download, FileText, Clock, User as UserIcon } from 'lucide-react';
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
  presentation: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  roleplay: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  questions: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  study_guide: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  other: 'bg-warm-200 text-warm-600 dark:bg-warm-800 dark:text-warm-400',
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
    <Link
      to={`/resource/${resource.id}`}
      className="block rounded-xl border border-warm-200 bg-white p-5 transition-all duration-200 hover:border-warm-300 dark:border-warm-800 dark:bg-warm-900 dark:hover:border-warm-700"
    >
      {/* Header badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[resource.resourceType]}`}>
          {TYPE_LABELS[resource.resourceType]}
        </span>
        <VisibilityBadge level={resource.visibilityLevel} />
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-warm-900 leading-snug mb-2 dark:text-warm-100">
        {resource.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-warm-500 leading-relaxed mb-3 line-clamp-2 dark:text-warm-400">
        {resource.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {resource.tags.slice(0, 4).map(tag => (
          <span key={tag} className="rounded-md bg-warm-100 px-2 py-0.5 text-xs text-warm-600 dark:bg-warm-800 dark:text-warm-400">
            {tag}
          </span>
        ))}
        {resource.tags.length > 4 && (
          <span className="text-xs text-warm-400">+{resource.tags.length - 4}</span>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 text-xs text-warm-400 mb-4">
        <span className="flex items-center gap-1">
          <UserIcon size={12} />
          {resource.isAnonymous ? 'Anonymous' : uploader?.name}
        </span>
        <span>•</span>
        <span>{chapter?.name}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {timeAgo(resource.createdAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-warm-100 dark:border-warm-800">
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            upvoted
              ? 'bg-success/10 text-success'
              : 'text-warm-500 hover:bg-warm-100 hover:text-warm-700 dark:hover:bg-warm-800 dark:hover:text-warm-300'
          }`}
        >
          <ThumbsUp size={14} className={upvoted ? 'upvote-animate fill-current' : ''} />
          {upvoteCount}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-warm-500 hover:bg-warm-100 hover:text-warm-700 dark:hover:bg-warm-800 dark:hover:text-warm-300 transition-colors"
        >
          <Download size={14} />
          {downloadCount}
        </button>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-warm-400">
          <FileText size={12} />
          {resource.fileExtension.replace('.', '').toUpperCase()} · {formatFileSize(resource.fileSizeBytes)}
        </span>
      </div>
    </Link>
  );
}
