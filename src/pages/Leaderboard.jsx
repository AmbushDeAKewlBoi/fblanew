import { useState } from 'react';
import { Trophy, Medal, TrendingUp, Upload, ThumbsUp, Download } from 'lucide-react';
import { SCHOOL_LEADERBOARD, REGION_LEADERBOARD, STATE_LEADERBOARD } from '../data/mockLeaderboard';

const TABS = ['Schools', 'Regions', 'States'];
const METRICS = ['uploads', 'upvotes', 'downloads'];
const METRIC_ICONS = { uploads: Upload, upvotes: ThumbsUp, downloads: Download };
const TIME_FILTERS = ['All Time', 'This Month'];

function RankBadge({ rank }) {
  const medalColors = {
    1: 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-900',
    2: 'bg-gradient-to-br from-warm-300 to-warm-400 text-warm-700',
    3: 'bg-gradient-to-br from-amber-600 to-amber-700 text-amber-100',
  };

  if (rank <= 3) {
    return (
      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${medalColors[rank]}`}>
        {rank}
      </span>
    );
  }
  return <span className="flex h-7 w-7 items-center justify-center rounded-full bg-warm-100 text-xs font-bold text-warm-600 dark:bg-warm-800 dark:text-warm-400">{rank}</span>;
}

export default function Leaderboard() {
  const [tab, setTab] = useState('Schools');
  const [metric, setMetric] = useState('uploads');
  const [timeFilter, setTimeFilter] = useState('All Time');

  const data = tab === 'Schools'
    ? SCHOOL_LEADERBOARD
    : tab === 'Regions'
    ? REGION_LEADERBOARD
    : STATE_LEADERBOARD;

  // Sort by selected metric
  const sorted = [...data].sort((a, b) => {
    const key = `total${metric.charAt(0).toUpperCase() + metric.slice(1)}`;
    return b.metrics[key] - a.metrics[key];
  }).map((item, i) => ({ ...item, rank: i + 1 }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-500 dark:bg-gold-500/20 dark:text-gold-400">
          <Trophy size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-warm-900 dark:text-warm-100">Leaderboard</h1>
          <p className="text-sm text-warm-500 dark:text-warm-400">See which chapters are leading the way</p>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-warm-100 p-1 dark:bg-warm-800">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-white text-warm-900 shadow-sm dark:bg-warm-700 dark:text-warm-100'
                  : 'text-warm-500 hover:text-warm-700 dark:text-warm-400 dark:hover:text-warm-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Metric + Time */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {METRICS.map(m => {
              const Icon = METRIC_ICONS[m];
              return (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    metric === m
                      ? 'bg-navy-800 text-white dark:bg-navy-600'
                      : 'bg-white text-warm-600 hover:bg-warm-50 border border-warm-200 dark:bg-warm-800 dark:text-warm-400 dark:border-warm-700 dark:hover:bg-warm-700'
                  }`}
                >
                  <Icon size={13} /> {m}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            {TIME_FILTERS.map(tf => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  timeFilter === tf
                    ? 'bg-warm-900 text-white dark:bg-warm-200 dark:text-warm-900'
                    : 'text-warm-500 hover:text-warm-700 dark:text-warm-400 dark:hover:text-warm-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-warm-200 bg-white overflow-hidden dark:border-warm-800 dark:bg-warm-900">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-warm-100 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-warm-500 dark:border-warm-800 dark:text-warm-400">
          <div className="col-span-1">#</div>
          <div className="col-span-5">{tab === 'Schools' ? 'School' : tab === 'Regions' ? 'Region' : 'State'}</div>
          <div className="col-span-2 text-right">Uploads</div>
          <div className="col-span-2 text-right">Upvotes</div>
          <div className="col-span-2 text-right">Downloads</div>
        </div>

        {/* Rows */}
        {sorted.map(item => {
          const name = tab === 'Schools'
            ? item.chapter?.name
            : tab === 'Regions'
            ? item.region?.name
            : item.state?.name;
          const subtitle = tab === 'Schools'
            ? `${item.chapter?.region}, ${item.chapter?.state}`
            : tab === 'Regions'
            ? item.region?.state
            : null;
          const isCurrentUser = tab === 'Schools' ? item.is_user_chapter || item.chapter?.id === 1 : false;

          return (
            <div
              key={item.rank}
              className={`grid grid-cols-12 gap-4 items-center px-5 py-4 text-sm transition-colors ${
                isCurrentUser
                  ? 'bg-gold-100/50 dark:bg-gold-500/5'
                  : 'hover:bg-warm-50 dark:hover:bg-warm-800/50'
              } ${item.rank < sorted.length ? 'border-b border-warm-100 dark:border-warm-800' : ''}`}
            >
              <div className="col-span-1">
                <RankBadge rank={item.rank} />
              </div>
              <div className="col-span-5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-warm-900 dark:text-warm-100">{name}</span>
                  {isCurrentUser && (
                    <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-bold text-gold-500 dark:bg-gold-500/20 dark:text-gold-400">
                      YOU
                    </span>
                  )}
                </div>
                {subtitle && <p className="text-xs text-warm-400">{subtitle}</p>}
              </div>
              <div className={`col-span-2 text-right font-medium ${metric === 'uploads' ? 'text-navy-700 dark:text-navy-300' : 'text-warm-600 dark:text-warm-400'}`}>
                {item.metrics.totalUploads.toLocaleString()}
              </div>
              <div className={`col-span-2 text-right font-medium ${metric === 'upvotes' ? 'text-navy-700 dark:text-navy-300' : 'text-warm-600 dark:text-warm-400'}`}>
                {item.metrics.totalUpvotes.toLocaleString()}
              </div>
              <div className={`col-span-2 text-right font-medium ${metric === 'downloads' ? 'text-navy-700 dark:text-navy-300' : 'text-warm-600 dark:text-warm-400'}`}>
                {item.metrics.totalDownloads.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
