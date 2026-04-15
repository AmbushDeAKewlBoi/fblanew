import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, ThumbsUp, Download, TrendingUp, ArrowRight, Flame } from 'lucide-react';
import ResourceCard from '../components/ResourceCard';
import { useResources } from '../hooks/useResources';

export default function Dashboard() {
  const { user, chapter } = useAuth();
  const { resources, loading } = useResources();

  const recentResources = [...resources].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  const popularResources = [...resources].sort((a, b) => b.viewCount - a.viewCount).slice(0, 3);
  const myResources = user ? resources.filter(r => r.uploaderId === user.id) : [];

  const myStats = {
    uploads: myResources.length,
    upvotes: myResources.reduce((sum, r) => sum + (r.upvoteCount || 0), 0),
    downloads: myResources.reduce((sum, r) => sum + (r.downloadCount || 0), 0),
  };

  if (loading) return <div className="flex justify-center py-20 px-4 text-warm-500">Loading your dashboard...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-warm-900 dark:text-warm-100">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-warm-500 dark:text-warm-400">
          {chapter?.name} · {chapter?.region}, {chapter?.state}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Your Uploads', value: myStats.uploads, icon: Upload, color: 'text-navy-600 bg-navy-50 dark:bg-navy-900/30 dark:text-navy-300' },
          { label: 'Upvotes Received', value: myStats.upvotes, icon: ThumbsUp, color: 'text-success bg-success-light dark:bg-success/10 dark:text-green-400' },
          { label: 'Downloads Received', value: myStats.downloads, icon: Download, color: 'text-gold-500 bg-gold-100 dark:bg-gold-500/10 dark:text-gold-400' },
        ].map(stat => (
          <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-warm-200 bg-white p-5 dark:border-warm-800 dark:bg-warm-900">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-warm-900 dark:text-warm-100">{stat.value}</p>
              <p className="text-sm text-warm-500 dark:text-warm-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-10 flex flex-wrap gap-3">
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 dark:bg-navy-600 dark:hover:bg-navy-500"
        >
          <Upload size={16} /> Upload Resource
        </Link>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 rounded-lg border border-warm-200 bg-white px-5 py-2.5 text-sm font-medium text-warm-700 hover:bg-warm-50 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-300 dark:hover:bg-warm-700"
        >
          Browse Events
        </Link>
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-2 rounded-lg border border-warm-200 bg-white px-5 py-2.5 text-sm font-medium text-warm-700 hover:bg-warm-50 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-300 dark:hover:bg-warm-700"
        >
          <TrendingUp size={16} /> Leaderboard
        </Link>
      </div>

      {/* Trending */}
      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-warm-900 dark:text-warm-100">
            <Flame size={20} className="text-warning" /> Trending Resources
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularResources.map(r => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </div>

      {/* Recent */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-warm-900 dark:text-warm-100">
            Recently Added
          </h2>
          <Link to="/events" className="flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-600 dark:text-navy-400">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentResources.map(r => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
