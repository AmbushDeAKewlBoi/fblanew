import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Copy, Check, RefreshCw, Shield, Users, FileText, ThumbsUp, Download, Eye, EyeOff, Trash2, ExternalLink, BarChart3 } from 'lucide-react';
import { useResources } from '../hooks/useResources';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import VisibilityBadge from '../components/VisibilityBadge';

const TYPE_LABELS = {
  presentation: 'Presentation',
  roleplay: 'Roleplay',
  questions: 'Questions',
  study_guide: 'Study Guide',
  other: 'Other',
};

export default function AdminDashboard() {
  const { user, chapter } = useAuth();
  const [activeTab, setActiveTab] = useState('resources');
  const [keyCopied, setKeyCopied] = useState(false);
  const [hiddenIds, setHiddenIds] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);

  const { resources, loading } = useResources();
  const [dbUsers, setDbUsers] = useState([]);

  useEffect(() => {
    if (!chapter?.id) return;
    const q = query(collection(db, 'users'), where('chapterId', '==', chapter.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDbUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [chapter?.id]);

  const chapterResources = chapter ? resources.filter(r => r.chapterId === chapter.id && !deletedIds.includes(r.id)) : [];
  const chapterStudents = dbUsers.filter(u => u.id !== user?.id && !u.isAdvisor);

  const totalStats = chapterResources.reduce(
    (acc, r) => ({
      uploads: acc.uploads + 1,
      upvotes: acc.upvotes + (r.upvoteCount || 0),
      downloads: acc.downloads + (r.downloadCount || 0),
    }),
    { uploads: 0, upvotes: 0, downloads: 0 }
  );

  const copyKey = () => {
    navigator.clipboard.writeText(chapter?.masterKey || '');
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  if (!user?.isAdvisor) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <Shield size={48} className="mx-auto mb-4 text-warm-300 dark:text-warm-700" />
        <h1 className="text-xl font-bold text-warm-900 dark:text-warm-100">Advisor Access Only</h1>
        <p className="mt-2 text-sm text-warm-500">This page is restricted to chapter advisors.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-700 dark:bg-navy-900/30 dark:text-navy-300">
          <Shield size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-warm-900 dark:text-warm-100">Admin Dashboard</h1>
          <p className="text-sm text-warm-500 dark:text-warm-400">{chapter?.name}</p>
        </div>
      </div>

      {/* Chapter Key */}
      <div className="mb-6 rounded-xl border border-warm-200 bg-white p-5 dark:border-warm-800 dark:bg-warm-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-warm-500 mb-1">Chapter Key</p>
            <div className="flex items-center gap-2">
              <code className="text-lg font-bold text-navy-800 dark:text-navy-300 tracking-wide">
                {chapter?.masterKey}
              </code>
              <button
                onClick={copyKey}
                className="rounded-md p-1.5 text-warm-400 hover:bg-warm-100 hover:text-warm-600 dark:hover:bg-warm-800"
                title="Copy key"
              >
                {keyCopied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-warm-200 px-3 py-2 text-sm font-medium text-warm-600 hover:bg-warm-50 dark:border-warm-700 dark:text-warm-400 dark:hover:bg-warm-800">
            <RefreshCw size={14} /> Regenerate
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-warm-200 bg-white p-4 text-center dark:border-warm-800 dark:bg-warm-900">
          <Users size={18} className="mx-auto mb-1 text-navy-600 dark:text-navy-400" />
          <p className="text-xl font-bold text-warm-900 dark:text-warm-100">{chapterStudents.length}</p>
          <p className="text-xs text-warm-500">Students</p>
        </div>
        <div className="rounded-xl border border-warm-200 bg-white p-4 text-center dark:border-warm-800 dark:bg-warm-900">
          <FileText size={18} className="mx-auto mb-1 text-success" />
          <p className="text-xl font-bold text-warm-900 dark:text-warm-100">{totalStats.uploads}</p>
          <p className="text-xs text-warm-500">Uploads</p>
        </div>
        <div className="rounded-xl border border-warm-200 bg-white p-4 text-center dark:border-warm-800 dark:bg-warm-900">
          <ThumbsUp size={18} className="mx-auto mb-1 text-gold-500" />
          <p className="text-xl font-bold text-warm-900 dark:text-warm-100">{totalStats.upvotes}</p>
          <p className="text-xs text-warm-500">Upvotes</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-warm-100 p-1 dark:bg-warm-800">
        {['resources', 'students'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === t
                ? 'bg-white text-warm-900 shadow-sm dark:bg-warm-700 dark:text-warm-100'
                : 'text-warm-500 hover:text-warm-700 dark:text-warm-400 dark:hover:text-warm-200'
            }`}
          >
            {t} ({t === 'resources' ? chapterResources.length : chapterStudents.length})
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'resources' ? (
        <div className="space-y-3">
          {chapterResources.map(r => (
            <div
              key={r.id}
              className={`flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center dark:bg-warm-900 ${
                hiddenIds.includes(r.id)
                  ? 'border-warning/30 opacity-60 dark:border-warning/20'
                  : 'border-warm-200 dark:border-warm-800'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-warm-400">{TYPE_LABELS[r.resourceType]}</span>
                  <VisibilityBadge level={r.visibilityLevel} />
                  {hiddenIds.includes(r.id) && (
                    <span className="rounded-full bg-warning-light px-2 py-0.5 text-[10px] font-bold text-warning dark:bg-warning/10">HIDDEN</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-warm-900 dark:text-warm-100">{r.title}</p>
                <p className="text-xs text-warm-400">
                  by {r.isAnonymous ? 'Anonymous' : `User #${r.uploaderId}`} · {r.event}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-warm-500">
                <span className="flex items-center gap-1"><ThumbsUp size={12} /> {r.upvoteCount || 0}</span>
                <span className="flex items-center gap-1"><Download size={12} /> {r.downloadCount || 0}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link to={`/resource/${r.id}`} className="rounded-lg p-2 text-warm-400 hover:bg-warm-100 hover:text-warm-700 dark:hover:bg-warm-800" title="View">
                  <ExternalLink size={15} />
                </Link>
                <button
                  onClick={() => setHiddenIds(prev => prev.includes(r.id) ? prev.filter(i => i !== r.id) : [...prev, r.id])}
                  className="rounded-lg p-2 text-warm-400 hover:bg-warning-light hover:text-warning dark:hover:bg-warning/10"
                  title={hiddenIds.includes(r.id) ? 'Unhide' : 'Hide'}
                >
                  {hiddenIds.includes(r.id) ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => setDeletedIds(prev => [...prev, r.id])}
                  className="rounded-lg p-2 text-warm-400 hover:bg-danger-light hover:text-danger dark:hover:bg-danger/10"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-warm-200 bg-white overflow-hidden dark:border-warm-800 dark:bg-warm-900">
          <div className="grid grid-cols-12 gap-4 border-b border-warm-100 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-warm-500 dark:border-warm-800">
            <div className="col-span-4">Student</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2 text-right">Uploads</div>
            <div className="col-span-2 text-right">Joined</div>
          </div>
          {chapterStudents.map(s => (
            <div key={s.id} className="grid grid-cols-12 gap-4 items-center border-b border-warm-100 px-5 py-4 text-sm last:border-0 dark:border-warm-800">
              <div className="col-span-4 font-medium text-warm-900 dark:text-warm-100">{s.name}</div>
              <div className="col-span-4 text-warm-500 truncate">{s.email}</div>
              <div className="col-span-2 text-right text-warm-600 dark:text-warm-400">{s.uploadCount}</div>
              <div className="col-span-2 text-right text-warm-400 text-xs">
                {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
