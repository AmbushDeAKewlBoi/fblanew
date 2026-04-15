import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, Download, FileText, Clock, User as UserIcon, Eye, Tag, Share2 } from 'lucide-react';
import { getResourceById, getResourcesByEvent } from '../data/mockResources';
import { getUserById, getChapterById } from '../data/mockUsers';
import VisibilityBadge from '../components/VisibilityBadge';
import ResourceCard from '../components/ResourceCard';

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

const TYPE_LABELS = {
  presentation: 'Presentation',
  roleplay: 'Roleplay Script',
  questions: 'Practice Questions',
  study_guide: 'Study Guide',
  other: 'Other',
};

export default function ResourceDetail() {
  const { id } = useParams();
  const resource = getResourceById(parseInt(id));
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(resource?.upvoteCount || 0);

  if (!resource) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-bold text-warm-900 dark:text-warm-100">Resource not found</h1>
        <Link to="/dashboard" className="mt-4 inline-flex items-center gap-2 text-sm text-navy-700 dark:text-navy-400">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const uploader = getUserById(resource.uploaderId);
  const chapter = getChapterById(resource.chapterId);
  const related = getResourcesByEvent(resource.eventSlug).filter(r => r.id !== resource.id).slice(0, 3);

  const handleUpvote = () => {
    if (upvoted) {
      setUpvoteCount(prev => prev - 1);
    } else {
      setUpvoteCount(prev => prev + 1);
    }
    setUpvoted(!upvoted);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to={`/events/${resource.eventSlug}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-warm-500 hover:text-warm-700 dark:text-warm-400 dark:hover:text-warm-200">
        <ArrowLeft size={14} /> {resource.event}
      </Link>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1">
          <div className="rounded-xl border border-warm-200 bg-white p-6 sm:p-8 dark:border-warm-800 dark:bg-warm-900">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700 dark:bg-navy-900/30 dark:text-navy-300">
                {TYPE_LABELS[resource.resourceType]}
              </span>
              <VisibilityBadge level={resource.visibilityLevel} size="md" />
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-warm-900 leading-snug sm:text-2xl dark:text-warm-100">
              {resource.title}
            </h1>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-warm-500 dark:text-warm-400">
              <span className="flex items-center gap-1.5">
                <UserIcon size={14} />
                {resource.isAnonymous ? 'Anonymous' : uploader?.name}
              </span>
              <span>{chapter?.name}</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {formatDate(resource.createdAt)}
              </span>
            </div>

            {/* Description */}
            <div className="mt-6 text-sm leading-relaxed text-warm-700 dark:text-warm-300">
              {resource.description}
            </div>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {resource.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-warm-100 px-2.5 py-1 text-xs text-warm-600 dark:bg-warm-800 dark:text-warm-400">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-6 flex items-center gap-6 border-t border-warm-100 pt-6 dark:border-warm-800">
              <div className="flex items-center gap-1.5 text-sm text-warm-500">
                <ThumbsUp size={16} /> {upvoteCount} upvotes
              </div>
              <div className="flex items-center gap-1.5 text-sm text-warm-500">
                <Download size={16} /> {resource.downloadCount} downloads
              </div>
              <div className="flex items-center gap-1.5 text-sm text-warm-500">
                <Eye size={16} /> {resource.viewCount} views
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                  upvoted
                    ? 'bg-success text-white'
                    : 'border border-warm-200 text-warm-700 hover:bg-warm-100 dark:border-warm-700 dark:text-warm-300 dark:hover:bg-warm-800'
                }`}
              >
                <ThumbsUp size={16} className={upvoted ? 'fill-current upvote-animate' : ''} />
                {upvoted ? 'Upvoted' : 'Upvote'}
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 dark:bg-navy-600 dark:hover:bg-navy-500">
                <Download size={16} />
                Download {resource.fileExtension.replace('.', '').toUpperCase()} ({formatFileSize(resource.fileSizeBytes)})
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar — related resources */}
        <div className="w-full lg:w-80 shrink-0">
          <h3 className="mb-4 text-sm font-semibold text-warm-900 dark:text-warm-100">
            More from {resource.event}
          </h3>
          {related.length > 0 ? (
            <div className="space-y-3">
              {related.map(r => (
                <Link
                  key={r.id}
                  to={`/resource/${r.id}`}
                  className="block rounded-xl border border-warm-200 bg-white p-4 transition-all hover:border-warm-300 dark:border-warm-800 dark:bg-warm-900 dark:hover:border-warm-700"
                >
                  <h4 className="text-sm font-medium text-warm-900 leading-snug dark:text-warm-100">
                    {r.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-3 text-xs text-warm-400">
                    <span className="flex items-center gap-1"><ThumbsUp size={10} /> {r.upvoteCount}</span>
                    <span className="flex items-center gap-1"><Download size={10} /> {r.downloadCount}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-warm-400">No related resources yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
