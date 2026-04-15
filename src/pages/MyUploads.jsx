import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, Download, Eye, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { useResources } from '../hooks/useResources';
import VisibilityBadge from '../components/VisibilityBadge';

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const TYPE_LABELS = {
  presentation: 'Presentation',
  roleplay: 'Roleplay',
  questions: 'Questions',
  study_guide: 'Study Guide',
  other: 'Other',
};

export default function MyUploads() {
  const { user } = useAuth();
  const { resources, loading } = useResources();
  const myResources = user ? resources.filter(r => r.uploaderId === user.id) : [];
  const [deletedIds, setDeletedIds] = useState([]);

  const active = myResources.filter(r => !deletedIds.includes(r.id));

  const totalStats = active.reduce(
    (acc, r) => ({
      upvotes: acc.upvotes + r.upvoteCount,
      downloads: acc.downloads + r.downloadCount,
      views: acc.views + r.viewCount,
    }),
    { upvotes: 0, downloads: 0, views: 0 }
  );

  const handleDelete = (id) => {
    setDeletedIds(prev => [...prev, id]);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-warm-900 dark:text-warm-100">My Uploads</h1>
        <p className="mt-1 text-sm text-warm-500 dark:text-warm-400">
          {active.length} resource{active.length !== 1 ? 's' : ''} uploaded
        </p>
      </div>

      {/* Summary stats */}
      {loading ? (
        <div className="flex justify-center py-20 px-4 text-warm-500">Loading your uploads...</div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: 'Total Upvotes', value: totalStats.upvotes, icon: ThumbsUp, color: 'text-success' },
          { label: 'Total Downloads', value: totalStats.downloads, icon: Download, color: 'text-navy-600 dark:text-navy-400' },
          { label: 'Total Views', value: totalStats.views, icon: Eye, color: 'text-gold-500' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-warm-200 bg-white p-4 text-center dark:border-warm-800 dark:bg-warm-900">
            <s.icon size={18} className={`mx-auto mb-1 ${s.color}`} />
            <p className="text-xl font-bold text-warm-900 dark:text-warm-100">{s.value.toLocaleString()}</p>
            <p className="text-xs text-warm-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Resources list */}
      {active.length > 0 ? (
        <div className="space-y-3">
          {active.map(r => (
            <div
              key={r.id}
              className="flex flex-col gap-4 rounded-xl border border-warm-200 bg-white p-5 sm:flex-row sm:items-center dark:border-warm-800 dark:bg-warm-900"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-warm-100 px-2 py-0.5 text-xs font-medium text-warm-600 dark:bg-warm-800 dark:text-warm-400">
                    {TYPE_LABELS[r.resourceType]}
                  </span>
                  <VisibilityBadge level={r.visibilityLevel} />
                </div>
                <Link to={`/resource/${r.id}`} className="text-sm font-semibold text-warm-900 hover:text-navy-700 dark:text-warm-100 dark:hover:text-navy-300">
                  {r.title}
                </Link>
                <p className="mt-0.5 text-xs text-warm-400">
                  {r.event} · {r.fileExtension.replace('.', '').toUpperCase()} · {formatFileSize(r.fileSizeBytes)}
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm text-warm-500">
                <span className="flex items-center gap-1"><ThumbsUp size={13} /> {r.upvoteCount}</span>
                <span className="flex items-center gap-1"><Download size={13} /> {r.downloadCount}</span>
                <span className="flex items-center gap-1"><Eye size={13} /> {r.viewCount}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/resource/${r.id}`}
                  className="rounded-lg p-2 text-warm-400 hover:bg-warm-100 hover:text-warm-700 dark:hover:bg-warm-800 dark:hover:text-warm-300"
                  title="View"
                >
                  <ExternalLink size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="rounded-lg p-2 text-warm-400 hover:bg-danger-light hover:text-danger dark:hover:bg-danger/10"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-warm-200 bg-white py-16 text-center dark:border-warm-800 dark:bg-warm-900">
          <p className="text-warm-500 dark:text-warm-400">No uploads yet.</p>
          <Link
            to="/upload"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-navy-600 dark:text-navy-400"
          >
            Upload your first resource
          </Link>
        </div>
      )}
      </>
      )}
    </div>
  );
}
