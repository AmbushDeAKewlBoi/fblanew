import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid3X3, List } from 'lucide-react';
import { FBLA_EVENTS, EVENT_CATEGORIES } from '../data/mockEvents';
import { useResources } from '../hooks/useResources';

export default function Events() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { resources, loading } = useResources();

  const filtered = useMemo(() => {
    return FBLA_EVENTS.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || e.category === category;
      return matchSearch && matchCategory;
    });
  }, [search, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-warm-900 dark:text-warm-100">Events</h1>
        <p className="mt-1 text-sm text-warm-500 dark:text-warm-400">
          Browse resources by FBLA competitive event
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-warm-200 bg-white py-2.5 pl-10 pr-4 text-sm text-warm-900 placeholder:text-warm-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {EVENT_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                category === cat
                  ? 'bg-navy-800 text-white dark:bg-navy-600'
                  : 'bg-warm-100 text-warm-600 hover:bg-warm-200 dark:bg-warm-800 dark:text-warm-400 dark:hover:bg-warm-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-warm-500 dark:text-warm-400">
        {filtered.length} event{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Events Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(event => {
          const count = resources.filter(r => r.event === event.name).length;
          return (
            <Link
              key={event.slug}
              to={`/events/${event.slug}`}
              className="group flex items-start gap-3 rounded-xl border border-warm-200 bg-white p-4 transition-all duration-200 hover:border-warm-300 dark:border-warm-800 dark:bg-warm-900 dark:hover:border-warm-700"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700 dark:bg-navy-900/30 dark:text-navy-300">
                <Grid3X3 size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-warm-900 leading-snug dark:text-warm-100">
                  {event.name}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-warm-100 px-2 py-0.5 text-xs text-warm-500 dark:bg-warm-800 dark:text-warm-400">
                    {event.category}
                  </span>
                  {count > 0 && (
                    <span className="text-xs text-warm-400">
                      {count} resource{count !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-warm-500 dark:text-warm-400">No events match your search.</p>
        </div>
      )}
    </div>
  );
}
