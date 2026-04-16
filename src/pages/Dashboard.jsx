import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Upload, ThumbsUp, Download, TrendingUp, ArrowRight, Flame, Sparkles } from 'lucide-react';
import ResourceCard from '../components/ResourceCard';
import { useResources } from '../hooks/useResources';
import AnimatedCounter from '../components/AnimatedCounter';
import PageTransition from '../components/PageTransition';
import SkeletonCard from '../components/SkeletonCard';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

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

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 space-y-2">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-48" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Your Uploads', value: myStats.uploads, icon: Upload, gradient: 'from-navy-600 to-navy-800', bg: 'bg-navy-500/10 dark:bg-navy-400/10' },
    { label: 'Upvotes Received', value: myStats.upvotes, icon: ThumbsUp, gradient: 'from-emerald-500 to-emerald-700', bg: 'bg-emerald-500/10 dark:bg-emerald-400/10' },
    { label: 'Downloads Received', value: myStats.downloads, icon: Download, gradient: 'from-gold-400 to-gold-500', bg: 'bg-gold-400/10 dark:bg-gold-400/10' },
  ];

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome */}
        <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-warm-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <motion.div
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, delay: 0.5 }}
              className="text-2xl"
            >
              👋
            </motion.div>
          </div>
          <p className="text-sm text-warm-500 dark:text-warm-400">
            {chapter?.name} · {chapter?.region}, {chapter?.state}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...fadeUp}
              transition={{ duration: 0.4, delay: 0.1 * (i + 1) }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="card-surface group relative overflow-hidden p-5"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warm-900 dark:text-white">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="text-sm text-warm-500 dark:text-warm-400">{stat.label}</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-navy-400/5 blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.4 }} className="mb-10 flex flex-wrap gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-navy-800 to-navy-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md dark:from-navy-600 dark:to-navy-500"
            >
              <Upload size={16} /> Upload Resource
            </Link>
          </motion.div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-xl border border-warm-200 bg-white px-5 py-2.5 text-sm font-medium text-warm-700 transition-all duration-200 hover:border-warm-300 hover:shadow-sm dark:border-warm-700 dark:bg-warm-800 dark:text-warm-300"
          >
            Browse Events
          </Link>
          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-2 rounded-xl border border-warm-200 bg-white px-5 py-2.5 text-sm font-medium text-warm-700 transition-all duration-200 hover:border-warm-300 hover:shadow-sm dark:border-warm-700 dark:bg-warm-800 dark:text-warm-300"
          >
            <TrendingUp size={16} /> Leaderboard
          </Link>
        </motion.div>

        {/* Trending */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.5 }} className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-warm-900 dark:text-white">
              <Flame size={20} className="text-orange-500" /> Trending Resources
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularResources.map(r => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </motion.div>

        {/* Recent */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.6 }}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-warm-900 dark:text-white">
              <Sparkles size={18} className="text-navy-500" /> Recently Added
            </h2>
            <Link to="/events" className="group flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-600 dark:text-navy-400 transition-colors">
              View all <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentResources.map(r => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
