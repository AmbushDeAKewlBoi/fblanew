import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, Download, Eye, Trash2, ExternalLink, FolderOpen, Upload } from 'lucide-react';
import { useResources } from '../hooks/useResources';
import VisibilityBadge from '../components/VisibilityBadge';
import AnimatedCounter from '../components/AnimatedCounter';
import PageTransition from '../components/PageTransition';

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const TYPE_LABELS = {
  presentation: 'Presentation', roleplay: 'Roleplay',
  questions: 'Questions', study_guide: 'Study Guide', other: 'Other',
};

export default function MyUploads() {
  const { user } = useAuth();
  const { resources, loading } = useResources();
  const myResources = user ? resources.filter(r => r.uploaderId === user.id) : [];
  const [deletedIds, setDeletedIds] = useState([]);
  const active = myResources.filter(r => !deletedIds.includes(r.id));

  const totalStats = active.reduce(
    (acc, r) => ({ upvotes: acc.upvotes + r.upvoteCount, downloads: acc.downloads + r.downloadCount, views: acc.views + r.viewCount }),
    { upvotes: 0, downloads: 0, views: 0 }
  );

  const handleDelete = (id) => setDeletedIds(prev => [...prev, id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8 space-y-2"><div className="skeleton h-8 w-48" /><div className="skeleton h-4 w-32" /></div>
        <div className="grid grid-cols-3 gap-4 mb-8">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 text-white shadow-lg">
              <FolderOpen size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-warm-900 dark:text-white">My Uploads</h1>
              <p className="text-sm text-warm-500 dark:text-warm-400">{active.length} resource{active.length !== 1 ? 's' : ''} uploaded</p>
            </div>
          </div>
        </motion.div>

        {/* Summary stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: 'Total Upvotes', value: totalStats.upvotes, icon: ThumbsUp, gradient: 'from-emerald-500 to-emerald-700' },
            { label: 'Total Downloads', value: totalStats.downloads, icon: Download, gradient: 'from-navy-600 to-navy-800' },
            { label: 'Total Views', value: totalStats.views, icon: Eye, gradient: 'from-gold-400 to-gold-500' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (i + 1) }}
              className="card-surface p-5 text-center"
            >
              <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-lg`}>
                <s.icon size={18} />
              </div>
              <p className="text-xl font-bold text-warm-900 dark:text-white"><AnimatedCounter value={s.value} /></p>
              <p className="text-xs text-warm-500 dark:text-warm-400">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Resources list */}
        {active.length > 0 ? (
          <div className="space-y-3">
            {active.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="card-surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="rounded-lg bg-warm-100 px-2 py-0.5 text-xs font-medium text-warm-600 dark:bg-warm-800 dark:text-warm-400">
                      {TYPE_LABELS[r.resourceType]}
                    </span>
                    <VisibilityBadge level={r.visibilityLevel} />
                  </div>
                  <Link to={`/resource/${r.id}`} className="text-sm font-semibold text-warm-900 hover:text-navy-700 dark:text-warm-100 dark:hover:text-navy-300 transition-colors">
                    {r.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-warm-400 dark:text-warm-500">
                    {r.event} · {r.fileExtension.replace('.', '').toUpperCase()} · {formatFileSize(r.fileSizeBytes)}
                  </p>
                </div>

                <div className="flex items-center gap-5 text-sm text-warm-500 dark:text-warm-400">
                  <span className="flex items-center gap-1"><ThumbsUp size={13} /> {r.upvoteCount}</span>
                  <span className="flex items-center gap-1"><Download size={13} /> {r.downloadCount}</span>
                  <span className="flex items-center gap-1"><Eye size={13} /> {r.viewCount}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link to={`/resource/${r.id}`}
                    className="rounded-xl p-2.5 text-warm-400 hover:bg-warm-100 hover:text-warm-700 dark:hover:bg-warm-800 dark:hover:text-warm-300 transition-colors" title="View"
                  ><ExternalLink size={16} /></Link>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDelete(r.id)}
                    className="rounded-xl p-2.5 text-warm-400 hover:bg-danger-light hover:text-danger dark:hover:bg-danger/10 transition-colors" title="Delete"
                  ><Trash2 size={16} /></motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-surface py-20 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-warm-100 dark:bg-warm-800">
              <Upload size={22} className="text-warm-400" />
            </div>
            <p className="text-warm-500 dark:text-warm-400">No uploads yet.</p>
            <Link to="/upload" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-navy-600 dark:text-navy-400 transition-colors">
              Upload your first resource
            </Link>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
