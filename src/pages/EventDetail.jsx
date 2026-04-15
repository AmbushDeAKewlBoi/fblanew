import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react';
import { getEventBySlug } from '../data/mockEvents';
import { useResources } from '../hooks/useResources';
import ResourceCard from '../components/ResourceCard';
import FilterSidebar from '../components/FilterSidebar';

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

    if (filters.types.length > 0) {
      result = result.filter(r => filters.types.includes(r.resourceType));
    }
    if (filters.visibility.length > 0) {
      result = result.filter(r => filters.visibility.includes(r.visibilityLevel));
    }
    if (filters.tags.length > 0) {
      result = result.filter(r => r.tags && filters.tags.some(t => r.tags.includes(t)));
    }

    if (filters.sort === 'recent') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sort === 'popular') {
      result.sort((a, b) => b.upvoteCount - a.upvoteCount);
    } else if (filters.sort === 'downloads') {
      result.sort((a, b) => b.downloadCount - a.downloadCount);
    }

    return result;
  }, [allResources, filters]);

  if (!event) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-bold text-warm-900 dark:text-warm-100">Event not found</h1>
        <Link to="/events" className="mt-4 inline-flex items-center gap-2 text-sm text-navy-700 dark:text-navy-400">
          <ArrowLeft size={14} /> Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <Link to="/events" className="mb-3 inline-flex items-center gap-1.5 text-sm text-warm-500 hover:text-warm-700 dark:text-warm-400 dark:hover:text-warm-200">
          <ArrowLeft size={14} /> Events
        </Link>
        <h1 className="text-2xl font-bold text-warm-900 dark:text-warm-100">{event.name}</h1>
        {loading ? (
           <p className="mt-1 text-sm text-warm-500">Loading resources...</p>
        ) : (
           <p className="mt-1 text-sm text-warm-500 dark:text-warm-400">
             {filtered.length} resource{filtered.length !== 1 ? 's' : ''} available
           </p>
        )}
      </div>

      {/* Mobile filter toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4 flex items-center gap-2 rounded-lg border border-warm-200 px-4 py-2 text-sm font-medium text-warm-700 lg:hidden dark:border-warm-700 dark:text-warm-300"
      >
        <SlidersHorizontal size={16} /> Filters
        {(filters.types.length + filters.visibility.length + filters.tags.length) > 0 && (
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy-800 text-xs text-white">
            {filters.types.length + filters.visibility.length + filters.tags.length}
          </span>
        )}
      </button>

      <div className="flex gap-8">
        {/* Sidebar — desktop always, mobile toggled */}
        <div className={`${showFilters ? 'fixed inset-0 z-50 bg-black/30 lg:static lg:bg-transparent' : 'hidden lg:block'}`}>
          <div className={`${showFilters ? 'absolute right-0 top-0 h-full w-80 overflow-y-auto bg-white p-6 shadow-xl lg:static lg:w-auto lg:shadow-none lg:p-0 dark:bg-warm-900' : ''}`}>
            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="mb-4 flex items-center gap-2 text-sm text-warm-500 lg:hidden"
              >
                <X size={16} /> Close
              </button>
            )}
            <FilterSidebar filters={filters} setFilters={setFilters} tagOptions={allTags} />
          </div>
        </div>

        {/* Resource grid */}
        <div className="flex-1">
          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(r => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-warm-200 bg-white py-16 text-center dark:border-warm-800 dark:bg-warm-900">
              <p className="text-warm-500 dark:text-warm-400">No resources match your filters.</p>
              <button
                onClick={() => setFilters({ types: [], visibility: [], tags: [], sort: 'recent' })}
                className="mt-3 text-sm font-medium text-navy-700 hover:text-navy-600 dark:text-navy-400"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
