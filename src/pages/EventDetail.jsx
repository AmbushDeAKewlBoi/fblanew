import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal, X, Search } from 'lucide-react';
import { getEventBySlug } from '../data/mockEvents';
import { useResources } from '../hooks/useResources';
import ResourceCard from '../components/ResourceCard';
import FilterSidebar from '../components/FilterSidebar';
import PageTransition from '../components/PageTransition';
import SkeletonCard from '../components/SkeletonCard';

export default function EventDetail() {
  const { slug } = useParams();
  const event = getEventBySlug(slug);
  const { resources, loading } = useResources();

  const allResources = useMemo(() => {
    if (!event) return [];
    return resources.filter(r => r.event === event.name);
  }, [resources, event]);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    types: [],
    visibility: [],
    tags: [],
    sort: 'recent',
  });

  const allTags = useMemo(() => {
    const tags = new Set();
    allResources.forEach(r => {
      if (r.tags) r.tags.forEach(t => tags.add(t));
    });
    return [...tags].sort();
  }, [allResources]);

  const filtered = useMemo(() => {
    let result = [...allResources];
    if (filters.types.length > 0) result = result.filter(r => filters.types.includes(r.resourceType));
    if (filters.visibility.length > 0) result = result.filter(r => filters.visibility.includes(r.visibilityLevel));
    if (filters.tags.length > 0) result = result.filter(r => r.tags && filters.tags.some(t => r.tags.includes(t)));
    if (filters.sort === 'recent') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (filters.sort === 'popular') result.sort((a, b) => b.upvoteCount - a.upvoteCount);
    else if (filters.sort === 'downloads') result.sort((a, b) => b.downloadCount - a.downloadCount);
    return result;
  }, [allResources, filters]);

  if (!event) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-warm-100 dark:bg-warm-800">
            <Search size={24} className="text-warm-400" />
          </div>
          <h1 className="text-xl font-bold text-warm-900 dark:text-white">Event not found</h1>
          <Link to="/events" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-navy-700 dark:text-navy-400 transition-colors hover:text-navy-600">
            <ArrowLeft size={14} /> Back to Events
          </Link>
        </div>
      </PageTransition>
    );
  }

  const activeFilterCount = filters.types.length + filters.visibility.length + filters.tags.length;

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
          <Link to="/events" className="mb-3 inline-flex items-center gap-1.5 text-sm text-warm-500 hover:text-warm-700 dark:text-warm-400 dark:hover:text-warm-200 transition-colors">
            <ArrowLeft size={14} /> Events
          </Link>
          <h1 className="text-2xl font-bold text-warm-900 dark:text-white">{event.name}</h1>
          {loading ? (
            <div className="mt-2 skeleton h-4 w-40" />
          ) : (
            <p className="mt-1 text-sm text-warm-500 dark:text-warm-400">
              {filtered.length} resource{filtered.length !== 1 ? 's' : ''} available
            </p>
          )}
        </motion.div>

        {/* Mobile filter toggle */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowFilters(!showFilters)}
          className="mb-4 flex items-center gap-2 rounded-xl border border-warm-200 px-4 py-2.5 text-sm font-medium text-warm-700 lg:hidden dark:border-warm-700 dark:text-warm-300 transition-colors hover:border-warm-300"
        >
          <SlidersHorizontal size={16} /> Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy-800 text-xs font-semibold text-white dark:bg-navy-500">
              {activeFilterCount}
            </span>
          )}
        </motion.button>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className={`${showFilters ? 'fixed inset-0 z-50 bg-black/30 lg:static lg:bg-transparent' : 'hidden lg:block'}`}>
            <div className={`${showFilters ? 'absolute right-0 top-0 h-full w-80 overflow-y-auto bg-white p-6 shadow-xl lg:static lg:w-auto lg:shadow-none lg:p-0 dark:bg-warm-900' : ''}`}>
              {showFilters && (
                <button
                  onClick={() => setShowFilters(false)}
                  className="mb-4 flex items-center gap-2 text-sm text-warm-500 lg:hidden transition-colors hover:text-warm-700"
                >
                  <X size={16} /> Close
                </button>
              )}
              <FilterSidebar filters={filters} setFilters={setFilters} tagOptions={allTags} />
            </div>
          </div>

          {/* Resource grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map(r => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-surface py-20 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-warm-100 dark:bg-warm-800">
                  <Search size={22} className="text-warm-400" />
                </div>
                <p className="text-warm-500 dark:text-warm-400">No resources match your filters.</p>
                <button
                  onClick={() => setFilters({ types: [], visibility: [], tags: [], sort: 'recent' })}
                  className="mt-3 text-sm font-semibold text-navy-700 hover:text-navy-600 dark:text-navy-400 transition-colors"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
