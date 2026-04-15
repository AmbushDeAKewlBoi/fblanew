import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { useResources } from '../hooks/useResources';
import ResourceCard from '../components/ResourceCard';
import FilterSidebar from '../components/FilterSidebar';

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

    if (filters.types.length > 0) {
      filtered = filtered.filter(r => filters.types.includes(r.resourceType));
    }
    if (filters.visibility.length > 0) {
      filtered = filtered.filter(r => filters.visibility.includes(r.visibilityLevel));
    }
    if (filters.tags.length > 0) {
      filtered = filtered.filter(r => filters.tags.some(t => r.tags.includes(t)));
    }

    if (filters.sort === 'popular') {
      filtered.sort((a, b) => b.upvoteCount - a.upvoteCount);
    } else if (filters.sort === 'downloads') {
      filtered.sort((a, b) => b.downloadCount - a.downloadCount);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }, [query, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400" />
          <input
            type="text"
            placeholder="Search resources, events, tags..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchParams(e.target.value.trim() ? { q: e.target.value.trim() } : {}); }}
            className="w-full rounded-xl border border-warm-200 bg-white py-3.5 pl-12 pr-4 text-base text-warm-900 placeholder:text-warm-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
            autoFocus
          />
        </div>
      </form>

      {query.trim() ? (
        <>
          <p className="mb-6 text-sm text-warm-500 dark:text-warm-400">
            {results.length} result{results.length !== 1 ? 's' : ''} for "<span className="font-medium text-warm-700 dark:text-warm-200">{query}</span>"
          </p>

          {loading ? (
            <div className="flex justify-center py-10 text-warm-500">Searching live database...</div>
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
                <div className="rounded-xl border border-warm-200 bg-white py-16 text-center dark:border-warm-800 dark:bg-warm-900">
                  <p className="text-warm-500 dark:text-warm-400">No resources found.</p>
                  <p className="mt-1 text-sm text-warm-400">Try a different search term.</p>
                </div>
              )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <SearchIcon size={48} className="mx-auto mb-4 text-warm-200 dark:text-warm-700" />
          <p className="text-warm-500 dark:text-warm-400">Start typing to search resources</p>
          <p className="mt-1 text-sm text-warm-400">
            Try "database", "marketing roleplay", or "python"
          </p>
        </div>
      )}
    </div>
  );
}
