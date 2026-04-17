import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Upload, ThumbsUp, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useResources } from '../hooks/useResources';
import { CHAPTERS } from '../data/mockUsers';
import AnimatedCounter from '../components/AnimatedCounter';
import PageTransition from '../components/PageTransition';

const TABS = ['Schools', 'Regions', 'States'];
const METRICS = ['uploads', 'upvotes', 'downloads'];
const METRIC_ICONS = { uploads: Upload, upvotes: ThumbsUp, downloads: Download };
const TIME_FILTERS = ['All Time', 'This Month'];

function RankBadge({ rank }) {
  const medalColors = {
    1: 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-900 shadow-sm shadow-amber-200/50',
    2: 'bg-gradient-to-br from-warm-300 to-warm-400 text-[var(--atlas-fg)] shadow-sm shadow-warm-200/50',
    3: 'bg-gradient-to-br from-amber-600 to-amber-700 text-amber-100 shadow-sm shadow-amber-300/30',
  };
  if (rank <= 3) {
    return <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${medalColors[rank]}`}>{rank}</span>;
  }
  return <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--atlas-elev)] text-xs font-bold text-[var(--atlas-muted)] dark:bg-[var(--atlas-elev)] dark:text-[var(--atlas-muted)]">{rank}</span>;
}

export default function Leaderboard() {
  const { user } = useAuth();
  const { resources, loading } = useResources();
  const [tab, setTab] = useState('Schools');
  const [metric, setMetric] = useState('uploads');
  const [timeFilter, setTimeFilter] = useState('All Time');

  const data = useMemo(() => {
    const statsByChapter = {};
    CHAPTERS.forEach(c => { statsByChapter[c.id] = { uploads: 0, upvotes: 0, downloads: 0, chapter: c }; });
    resources.forEach(r => {
      const cId = r.chapterId || 1;
      if (statsByChapter[cId]) { statsByChapter[cId].uploads++; statsByChapter[cId].upvotes += (r.upvoteCount || 0); statsByChapter[cId].downloads += (r.downloadCount || 0); }
    });
    if (tab === 'Schools') {
      return Object.values(statsByChapter).map(stat => ({ chapter: stat.chapter, is_user_chapter: stat.chapter.id === user?.chapterId, metrics: { totalUploads: stat.uploads, totalUpvotes: stat.upvotes, totalDownloads: stat.downloads } }));
    } else if (tab === 'Regions') {
      const regionsMap = {};
      Object.values(statsByChapter).forEach(stat => {
        const rName = stat.chapter.region;
        if (!regionsMap[rName]) regionsMap[rName] = { region: { name: rName, state: stat.chapter.state }, metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 } };
        regionsMap[rName].metrics.totalUploads += stat.uploads; regionsMap[rName].metrics.totalUpvotes += stat.upvotes; regionsMap[rName].metrics.totalDownloads += stat.downloads;
      });
      return Object.values(regionsMap);
    } else {
      const statesMap = {};
      Object.values(statsByChapter).forEach(stat => {
        const sName = stat.chapter.state;
        if (!statesMap[sName]) statesMap[sName] = { state: { name: sName }, metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 } };
        statesMap[sName].metrics.totalUploads += stat.uploads; statesMap[sName].metrics.totalUpvotes += stat.upvotes; statesMap[sName].metrics.totalDownloads += stat.downloads;
      });
      return Object.values(statesMap);
    }
  }, [resources, tab, user?.chapterId]);

  const sorted = [...data].sort((a, b) => {
    const key = `total${metric.charAt(0).toUpperCase() + metric.slice(1)}`;
    return b.metrics[key] - a.metrics[key];
  }).map((item, i) => ({ ...item, rank: i + 1 }));

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-200/30">
            <Trophy size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--atlas-fg)]">Leaderboard</h1>
            <p className="text-sm text-[var(--atlas-muted)]">See which chapters are leading the way</p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="mb-6 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 rounded-2xl bg-[var(--atlas-elev)] p-1 dark:bg-[var(--atlas-elev)]">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                  tab === t ? 'bg-white text-[var(--atlas-fg)] shadow-sm dark:bg-warm-700 dark:text-warm-100' : 'text-[var(--atlas-muted)] hover:text-[var(--atlas-fg)] dark:text-[var(--atlas-muted)] dark:hover:text-warm-200'
                }`}
              >{t}</button>
            ))}
          </div>

          {/* Metric + Time */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {METRICS.map(m => {
                const Icon = METRIC_ICONS[m];
                return (
                  <motion.button key={m} whileTap={{ scale: 0.95 }} onClick={() => setMetric(m)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold capitalize transition-all duration-200 ${
                      metric === m ? 'bg-navy-800 text-white shadow-sm dark:bg-navy-600' : 'bg-white text-[var(--atlas-muted)] hover:bg-[var(--atlas-bg)] border border-[var(--atlas-border)] dark:bg-[var(--atlas-elev)] dark:text-[var(--atlas-muted)] dark:border-warm-700'
                    }`}
                  ><Icon size={13} /> {m}</motion.button>
                );
              })}
            </div>
            <div className="flex gap-2">
              {TIME_FILTERS.map(tf => (
                <button key={tf} onClick={() => setTimeFilter(tf)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                    timeFilter === tf ? 'bg-warm-900 text-white dark:bg-warm-200 dark:text-[var(--atlas-fg)]' : 'text-[var(--atlas-muted)] hover:text-[var(--atlas-fg)] dark:text-[var(--atlas-muted)] dark:hover:text-warm-200'
                  }`}
                >{tf}</button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="card-surface overflow-hidden !p-0"
        >
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-[var(--atlas-border)] px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--atlas-muted)] dark:border-[var(--atlas-border)] dark:text-[var(--atlas-muted)]">
            <div className="col-span-1">#</div>
            <div className="col-span-5">{tab === 'Schools' ? 'School' : tab === 'Regions' ? 'Region' : 'State'}</div>
            <div className="col-span-2 text-right">Uploads</div>
            <div className="col-span-2 text-right">Upvotes</div>
            <div className="col-span-2 text-right">Downloads</div>
          </div>

          {/* Rows */}
          {sorted.map((item, i) => {
            const name = tab === 'Schools' ? item.chapter?.name : tab === 'Regions' ? item.region?.name : item.state?.name;
            const subtitle = tab === 'Schools' ? `${item.chapter?.region}, ${item.chapter?.state}` : tab === 'Regions' ? item.region?.state : null;
            const isCurrentUser = tab === 'Schools' ? item.is_user_chapter || item.chapter?.id === 1 : false;
            return (
              <motion.div key={item.rank} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.03, 0.4) }}
                className={`grid grid-cols-12 gap-4 items-center px-5 py-4 text-sm transition-colors ${
                  isCurrentUser ? 'bg-amber-50/60 dark:bg-amber-500/5' : 'hover:bg-[var(--atlas-bg)]/50 dark:hover:bg-[var(--atlas-elev)]/30'
                } ${item.rank < sorted.length ? 'border-b border-[var(--atlas-border)]/80 dark:border-[var(--atlas-border)]/40' : ''}`}
              >
                <div className="col-span-1"><RankBadge rank={item.rank} /></div>
                <div className="col-span-5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--atlas-fg)]">{name}</span>
                    {isCurrentUser && (
                      <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">YOU</span>
                    )}
                  </div>
                  {subtitle && <p className="text-xs text-[var(--atlas-muted)] dark:text-[var(--atlas-muted)]">{subtitle}</p>}
                </div>
                <div className={`col-span-2 text-right font-semibold ${metric === 'uploads' ? 'text-navy-700 dark:text-navy-300' : 'text-[var(--atlas-muted)]'}`}>
                  {item.metrics.totalUploads.toLocaleString()}
                </div>
                <div className={`col-span-2 text-right font-semibold ${metric === 'upvotes' ? 'text-navy-700 dark:text-navy-300' : 'text-[var(--atlas-muted)]'}`}>
                  {item.metrics.totalUpvotes.toLocaleString()}
                </div>
                <div className={`col-span-2 text-right font-semibold ${metric === 'downloads' ? 'text-navy-700 dark:text-navy-300' : 'text-[var(--atlas-muted)]'}`}>
                  {item.metrics.totalDownloads.toLocaleString()}
                </div>
              </motion.div>
            );
          })}
          {loading && <div className="p-10 text-center text-[var(--atlas-muted)]">Calculating rankings from database...</div>}
        </motion.div>
      </div>
    </PageTransition>
  );
}
