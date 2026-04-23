import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Grid3X3, BookOpen } from 'lucide-react';
import { FBLA_EVENTS, EVENT_CATEGORIES } from '../data/mockEvents';
import { useResources } from '../hooks/useResources';
import PageTransition from '../components/PageTransition';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function Events() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { resources, loading } = useResources();

  const EVENT_TYPES = ['All Types', 'Objective Test', 'Presentation', 'Role Play', 'Production'];
  const [eventType, setEventType] = useState('All Types');

  const filtered = useMemo(() => {
    return FBLA_EVENTS.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || e.category === category;
      const matchType = eventType === 'All Types' || e.testCategory === eventType;
      return matchSearch && matchCategory && matchType;
    });
  }, [search, category, eventType]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 text-white shadow-lg">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--atlas-fg)]">Events</h1>
              <p className="text-sm text-[var(--atlas-muted)]">Browse resources by FBLA competitive event</p>
            </div>
          </div>
        </motion.div>

        {/* Search + Filters */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }} className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md group">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--atlas-muted)] transition-colors group-focus-within:text-navy-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[var(--atlas-border)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--atlas-fg)] placeholder:text-[var(--atlas-muted)] transition-all duration-200 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-400/20 dark:border-[var(--atlas-border)] dark:bg-[var(--atlas-surface)] dark:text-warm-100 dark:focus:border-navy-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {EVENT_CATEGORIES.map(cat => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    category === cat
                      ? 'bg-navy-800 text-white shadow-sm dark:bg-navy-600'
                      : 'bg-[var(--atlas-elev)] text-[var(--atlas-muted)] hover:bg-warm-200 dark:bg-[var(--atlas-elev)] dark:text-[var(--atlas-muted)] dark:hover:bg-warm-700'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map(type => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEventType(type)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  eventType === type
                    ? 'bg-navy-800 text-white shadow-sm dark:bg-navy-600'
                    : 'bg-[var(--atlas-elev)] text-[var(--atlas-muted)] hover:bg-warm-200 dark:bg-[var(--atlas-elev)] dark:text-[var(--atlas-muted)] dark:hover:bg-warm-700'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <motion.p {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }} className="mb-5 text-sm text-[var(--atlas-muted)]">
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </motion.p>

        {/* Events Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((event, i) => {
            const count = resources.filter(r => r.event === event.name).length;
            return (
              <motion.div
                key={event.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4) }}
              >
                <Link
                  to={`/events/${event.slug}`}
                  className="card-surface group flex items-start gap-3 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-500/10 text-navy-700 transition-colors group-hover:bg-navy-500/15 dark:bg-navy-400/10 dark:text-navy-300">
                    <Grid3X3 size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-[var(--atlas-fg)] leading-snug transition-colors group-hover:text-navy-700 dark:text-warm-100 dark:group-hover:text-navy-300">
                      {event.name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="rounded-lg bg-[var(--atlas-elev)] px-2 py-0.5 text-xs font-medium text-[var(--atlas-muted)] dark:bg-[var(--atlas-elev)] dark:text-[var(--atlas-muted)]">
                        {event.category}
                      </span>
                      {count > 0 && (
                        <span className="text-xs text-[var(--atlas-muted)] dark:text-[var(--atlas-muted)]">
                          {count} resource{count !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--atlas-elev)] dark:bg-[var(--atlas-elev)]">
              <Search size={24} className="text-[var(--atlas-muted)]" />
            </div>
            <p className="text-[var(--atlas-muted)]">No events match your search.</p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
