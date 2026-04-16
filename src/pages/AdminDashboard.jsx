import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Copy, Check, RefreshCw, Shield, Users, FileText, ThumbsUp, Download, Eye, EyeOff, Trash2, ExternalLink } from 'lucide-react';
import { useResources } from '../hooks/useResources';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import VisibilityBadge from '../components/VisibilityBadge';
import AnimatedCounter from '../components/AnimatedCounter';
import PageTransition from '../components/PageTransition';

const TYPE_LABELS = {
  presentation: 'Presentation', roleplay: 'Roleplay',
  questions: 'Questions', study_guide: 'Study Guide', other: 'Other',
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
    (acc, r) => ({ uploads: acc.uploads + 1, upvotes: acc.upvotes + (r.upvoteCount || 0), downloads: acc.downloads + (r.downloadCount || 0) }),
    { uploads: 0, upvotes: 0, downloads: 0 }
  );

  const copyKey = () => {
    navigator.clipboard.writeText(chapter?.masterKey || '');
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  if (!user?.isAdvisor) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-warm-100 dark:bg-warm-800">
            <Shield size={28} className="text-warm-400" />
          </div>
          <h1 className="text-xl font-bold text-warm-900 dark:text-white">Advisor Access Only</h1>
          <p className="mt-2 text-sm text-warm-500 dark:text-warm-400">This page is restricted to chapter advisors.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 text-white shadow-lg">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-warm-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-warm-500 dark:text-warm-400">{chapter?.name}</p>
          </div>
        </motion.div>

        {/* Chapter Key */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card-surface mb-6 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-warm-500 mb-1.5">Chapter Key</p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-bold text-navy-800 dark:text-navy-300 tracking-wide font-mono">
                  {chapter?.masterKey}
                </code>
                <motion.button whileTap={{ scale: 0.9 }} onClick={copyKey}
                  className="rounded-lg p-2 text-warm-400 hover:bg-warm-100 hover:text-warm-600 dark:hover:bg-warm-800 transition-colors" title="Copy key"
                >{keyCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}</motion.button>
              </div>
            </div>
            <button className="flex items-center gap-1.5 rounded-xl border border-warm-200 px-4 py-2.5 text-sm font-medium text-warm-600 transition-all duration-200 hover:border-warm-300 hover:shadow-sm dark:border-warm-700 dark:text-warm-400">
              <RefreshCw size={14} /> Regenerate
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Students', value: chapterStudents.length, icon: Users, gradient: 'from-navy-600 to-navy-800' },
            { label: 'Uploads', value: totalStats.uploads, icon: FileText, gradient: 'from-emerald-500 to-emerald-700' },
            { label: 'Upvotes', value: totalStats.upvotes, icon: ThumbsUp, gradient: 'from-gold-400 to-gold-500' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
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

        {/* Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mb-6 flex gap-1 rounded-2xl bg-warm-100 p-1 dark:bg-warm-800"
        >
          {['resources', 'students'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold capitalize transition-all duration-200 ${
                activeTab === t ? 'bg-white text-warm-900 shadow-sm dark:bg-warm-700 dark:text-warm-100' : 'text-warm-500 hover:text-warm-700 dark:text-warm-400'
              }`}
            >{t} ({t === 'resources' ? chapterResources.length : chapterStudents.length})</button>
          ))}
        </motion.div>

        {/* Content */}
        {activeTab === 'resources' ? (
          <div className="space-y-3">
            {chapterResources.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className={`card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center ${
                  hiddenIds.includes(r.id) ? '!border-amber-300/30 opacity-60 dark:!border-amber-500/20' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-warm-400 dark:text-warm-500">{TYPE_LABELS[r.resourceType]}</span>
                    <VisibilityBadge level={r.visibilityLevel} />
                    {hiddenIds.includes(r.id) && (
                      <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">HIDDEN</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-warm-900 dark:text-warm-100">{r.title}</p>
                  <p className="text-xs text-warm-400 dark:text-warm-500">by {r.isAnonymous ? 'Anonymous' : `User #${r.uploaderId}`} · {r.event}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-warm-500 dark:text-warm-400">
                  <span className="flex items-center gap-1"><ThumbsUp size={12} /> {r.upvoteCount || 0}</span>
                  <span className="flex items-center gap-1"><Download size={12} /> {r.downloadCount || 0}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link to={`/resource/${r.id}`} className="rounded-xl p-2.5 text-warm-400 hover:bg-warm-100 hover:text-warm-700 dark:hover:bg-warm-800 transition-colors" title="View">
                    <ExternalLink size={15} />
                  </Link>
                  <motion.button whileTap={{ scale: 0.9 }}
                    onClick={() => setHiddenIds(prev => prev.includes(r.id) ? prev.filter(i2 => i2 !== r.id) : [...prev, r.id])}
                    className="rounded-xl p-2.5 text-warm-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 transition-colors"
                    title={hiddenIds.includes(r.id) ? 'Unhide' : 'Hide'}
                  >{hiddenIds.includes(r.id) ? <Eye size={15} /> : <EyeOff size={15} />}</motion.button>
                  <motion.button whileTap={{ scale: 0.9 }}
                    onClick={() => setDeletedIds(prev => [...prev, r.id])}
                    className="rounded-xl p-2.5 text-warm-400 hover:bg-danger-light hover:text-danger dark:hover:bg-danger/10 transition-colors" title="Delete"
                  ><Trash2 size={15} /></motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card-surface overflow-hidden !p-0">
            <div className="grid grid-cols-12 gap-4 border-b border-warm-100 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-warm-500 dark:border-warm-800/60 dark:text-warm-400">
              <div className="col-span-4">Student</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-2 text-right">Uploads</div>
              <div className="col-span-2 text-right">Joined</div>
            </div>
            {chapterStudents.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className="grid grid-cols-12 gap-4 items-center border-b border-warm-100/80 px-5 py-4 text-sm last:border-0 dark:border-warm-800/40 hover:bg-warm-50/50 dark:hover:bg-warm-800/30 transition-colors"
              >
                <div className="col-span-4 font-semibold text-warm-900 dark:text-warm-100">{s.name}</div>
                <div className="col-span-4 text-warm-500 truncate dark:text-warm-400">{s.email}</div>
                <div className="col-span-2 text-right font-medium text-warm-600 dark:text-warm-400">{s.uploadCount}</div>
                <div className="col-span-2 text-right text-warm-400 text-xs dark:text-warm-500">
                  {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
