import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Copy, Check, RefreshCw, Shield, Users, FileText, ThumbsUp, Download,
  Eye, EyeOff, Trash2, ExternalLink,
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useResources } from '../hooks/useResources';
import { db } from '../config/firebase';
import VisibilityBadge from '../components/VisibilityBadge';
import AnimatedCounter from '../components/AnimatedCounter';
import PageTransition from '../components/PageTransition';
import PageHeader from '../components/ui/PageHeader';
import StatTile from '../components/ui/StatTile';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { RESOURCE_TYPE_LABELS } from '../lib/resources';

export default function AdminDashboard() {
  const { user, chapter } = useAuth();
  const [activeTab, setActiveTab] = useState('resources');
  const [keyCopied, setKeyCopied] = useState(false);
  const [hiddenIds, setHiddenIds] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);
  const { resources } = useResources();
  const [dbUsers, setDbUsers] = useState([]);

  useEffect(() => {
    if (!chapter?.id) return;
    const q = query(collection(db, 'users'), where('chapterId', '==', chapter.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDbUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [chapter?.id]);

  const chapterResources = chapter
    ? resources.filter((r) => r.chapterId === chapter.id && !deletedIds.includes(r.id))
    : [];
  const chapterStudents = dbUsers.filter((u) => u.id !== user?.id && !u.isAdvisor);

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
      <PageTransition>
        <div className="atlas-page">
          <EmptyState
            icon={<Shield size={20} />}
            title="Advisor access only"
            description="This page is restricted to chapter advisors. If you believe this is a mistake, contact support."
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="atlas-page mx-auto max-w-5xl">
        <PageHeader
          kicker="Admin"
          title="Chapter dashboard"
          subtitle="Manage your chapter, oversee uploads, and keep an eye on student activity."
          meta={chapter?.name}
          rightSlot={(
            <div className="grid grid-cols-3 gap-2">
              <StatTile label="Students" value={<AnimatedCounter value={chapterStudents.length} />} icon={<Users size={14} />} tone="accent" />
              <StatTile label="Uploads" value={<AnimatedCounter value={totalStats.uploads} />} icon={<FileText size={14} />} tone="gold" />
              <StatTile label="Upvotes" value={<AnimatedCounter value={totalStats.upvotes} />} icon={<ThumbsUp size={14} />} />
            </div>
          )}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-surface mt-8 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="atlas-kicker mb-1.5">Chapter key</p>
              <div className="flex items-center gap-2">
                <code className="font-[family-name:var(--font-mono)] text-lg font-bold tracking-wide text-[var(--atlas-accent)]">
                  {chapter?.masterKey}
                </code>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={copyKey}
                  aria-label="Copy chapter key"
                  className="border-2 border-transparent p-2 text-[var(--atlas-muted)] transition-colors hover:border-[var(--atlas-border)] hover:text-[var(--atlas-fg)]"
                  style={{ borderRadius: 2 }}
                >
                  {keyCopied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                </motion.button>
              </div>
            </div>
            <button className="atlas-btn atlas-btn-ghost">
              <RefreshCw size={13} /> Regenerate
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          role="tablist"
          aria-label="Admin sections"
          className="atlas-panel mt-6 flex gap-1 p-1"
        >
          {[
            { id: 'resources', label: 'Resources', count: chapterResources.length },
            { id: 'students', label: 'Students', count: chapterStudents.length },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 border-2 py-2.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                  active
                    ? 'border-[var(--atlas-accent)] bg-[rgba(61,109,118,0.10)] text-[var(--atlas-fg)] dark:bg-[rgba(109,158,168,0.14)]'
                    : 'border-transparent text-[var(--atlas-muted)] hover:text-[var(--atlas-fg)]'
                }`}
                style={{ borderRadius: 2 }}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </motion.div>

        <div className="mt-6">
          {activeTab === 'resources' ? (
            chapterResources.length === 0 ? (
              <EmptyState
                title="No chapter resources yet"
                description="Once students start uploading, they'll appear here for review."
              />
            ) : (
              <ul className="space-y-3">
                {chapterResources.map((r, i) => {
                  const hidden = hiddenIds.includes(r.id);
                  return (
                    <motion.li
                      key={r.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.3) }}
                      className={`card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center ${
                        hidden ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <Badge>{RESOURCE_TYPE_LABELS[r.resourceType] || RESOURCE_TYPE_LABELS.other}</Badge>
                          <VisibilityBadge level={r.visibilityLevel} />
                          {hidden ? <Badge tone="warn">Hidden</Badge> : null}
                        </div>
                        <p className="text-[15px] font-semibold text-[var(--atlas-fg)]">{r.title}</p>
                        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
                          by {r.isAnonymous ? 'Anonymous' : `User #${r.uploaderId}`} · {r.event}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--atlas-muted)] tabular-nums">
                        <span className="flex items-center gap-1"><ThumbsUp size={12} /> {r.upvoteCount || 0}</span>
                        <span className="flex items-center gap-1"><Download size={12} /> {r.downloadCount || 0}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Link
                          to={`/resource/${r.id}`}
                          aria-label="View resource"
                          className="border-2 border-transparent p-2 text-[var(--atlas-muted)] transition-colors hover:border-[var(--atlas-border)] hover:text-[var(--atlas-fg)]"
                          style={{ borderRadius: 2 }}
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setHiddenIds((prev) => prev.includes(r.id) ? prev.filter((id) => id !== r.id) : [...prev, r.id])}
                          aria-label={hidden ? 'Unhide' : 'Hide'}
                          className="border-2 border-transparent p-2 text-[var(--atlas-muted)] transition-colors hover:border-amber-500/55 hover:text-amber-600 dark:hover:text-amber-400"
                          style={{ borderRadius: 2 }}
                        >
                          {hidden ? <Eye size={15} /> : <EyeOff size={15} />}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeletedIds((prev) => [...prev, r.id])}
                          aria-label="Delete resource"
                          className="border-2 border-transparent p-2 text-[var(--atlas-muted)] transition-colors hover:border-red-500/55 hover:text-red-600 dark:hover:text-red-400"
                          style={{ borderRadius: 2 }}
                        >
                          <Trash2 size={15} />
                        </motion.button>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            )
          ) : (
            chapterStudents.length === 0 ? (
              <EmptyState
                title="No other students yet"
                description="Share your chapter key to invite the first members."
              />
            ) : (
              <div className="card-surface overflow-hidden p-0">
                <div className="grid grid-cols-12 gap-4 border-b border-[var(--atlas-border)] bg-[var(--atlas-surface)] px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--atlas-muted)]">
                  <div className="col-span-4">Student</div>
                  <div className="col-span-4">Email</div>
                  <div className="col-span-2 text-right">Uploads</div>
                  <div className="col-span-2 text-right">Joined</div>
                </div>
                {chapterStudents.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    className="grid grid-cols-12 items-center gap-4 border-b border-[var(--atlas-border)]/80 px-5 py-3 text-sm transition-colors last:border-0 hover:bg-[var(--atlas-surface)]"
                  >
                    <div className="col-span-4 flex items-center gap-2 font-semibold text-[var(--atlas-fg)]">
                      <Avatar name={s.name} size="sm" />
                      <span className="truncate">{s.name}</span>
                    </div>
                    <div className="col-span-4 truncate text-[var(--atlas-muted)]">{s.email}</div>
                    <div className="col-span-2 text-right font-[family-name:var(--font-mono)] text-[12px] tabular-nums text-[var(--atlas-fg)]">{s.uploadCount}</div>
                    <div className="col-span-2 text-right font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </PageTransition>
  );
}
