import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { useResources } from '../hooks/useResources';
import ResourceCard from '../components/ResourceCard';
import FilterSidebar from '../components/FilterSidebar';
import PageTransition from '../components/PageTransition';
import SkeletonCard from '../components/SkeletonCard';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    types: [],
    visibility: [],
    tags: [],
    sort: 'recent',
  });

  const { resources, loading } = useResources();

  const allTags = useMemo(() => {
    const tags = new Set();
    resources.forEach(r => {
      if (r.tags) r.tags.forEach(t => tags.add(t));
    });
    return [...tags].sort();
  }, [resources]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    let filtered = resources.filter(r =>
      (r.title || '').toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(q))) ||
      (r.event || '').toLowerCase().includes(q)
    );
    if (filters.types.length > 0) filtered = filtered.filter(r => filters.types.includes(r.resourceType));
    if (filters.visibility.length > 0) filtered = filtered.filter(r => filters.visibility.includes(r.visibilityLevel));
    if (filters.tags.length > 0) filtered = filtered.filter(r => filters.tags.some(t => r.tags.includes(t)));
    if (filters.sort === 'popular') filtered.sort((a, b) => b.upvoteCount - a.upvoteCount);
    else if (filters.sort === 'downloads') filtered.sort((a, b) => b.downloadCount - a.downloadCount);
    else filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return filtered;
  }, [query, filters, resources]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Search bar */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSearch}
          className="mb-8"
        >
          <div className="relative max-w-2xl group">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400 transition-colors group-focus-within:text-navy-500" />
            <input
              type="text"
              placeholder="Search resources, events, tags..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearchParams(e.target.value.trim() ? { q: e.target.value.trim() } : {}); }}
              className="w-full rounded-2xl border border-warm-200/80 bg-white py-4 pl-12 pr-4 text-base text-warm-900 placeholder:text-warm-400 transition-all duration-200 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-400/20 dark:border-warm-700/60 dark:bg-warm-900 dark:text-warm-100 dark:focus:border-navy-500"
              autoFocus
            />
          </div>
        </motion.form>

        {query.trim() ? (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 text-sm text-warm-500 dark:text-warm-400"
            >
              {results.length} result{results.length !== 1 ? 's' : ''} for "<span className="font-semibold text-warm-700 dark:text-warm-200">{query}</span>"
            </motion.p>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="flex gap-8">
                <div className="hidden lg:block">
                  <FilterSidebar filters={filters} setFilters={setFilters} tagOptions={allTags} />
                </div>
                <div className="flex-1">
                  {results.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {results.map(r => (
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
                        <SearchIcon size={22} className="text-warm-400" />
                      </div>
                      <p className="text-warm-500 dark:text-warm-400">No resources found.</p>
                      <p className="mt-1 text-sm text-warm-400">Try a different search term.</p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="py-20 text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-warm-100 dark:bg-warm-800">
              <SearchIcon size={32} className="text-warm-300 dark:text-warm-600" />
            </div>
            <p className="text-lg font-medium text-warm-500 dark:text-warm-400">Start typing to search resources</p>
            <p className="mt-2 text-sm text-warm-400 dark:text-warm-500">
              Try "database", "marketing roleplay", or "python"
            </p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
