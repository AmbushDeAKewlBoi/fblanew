import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagnifyingGlass, GridFour, BookOpen } from '@phosphor-icons/react';
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
    const normalizedSearch = search.trim().toLowerCase();
    return FBLA_EVENTS.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(normalizedSearch);
      const matchCategory = category === 'All' || e.category === category;
      const matchType = eventType === 'All Types' || e.testCategory === eventType;
      return matchSearch && matchCategory && matchType;
    });
  }, [search, category, eventType]);

  const resourceCountsByEvent = useMemo(() => {
    const counts = new Map();
    resources.forEach((resource) => {
      counts.set(resource.event, (counts.get(resource.event) || 0) + 1);
    });
    return counts;
  }, [resources]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center border border-[var(--atlas-accent)]/45 bg-[rgba(61,109,118,0.12)] text-[var(--atlas-accent)]" style={{ borderRadius: 10 }}>
              <BookOpen size={20} weight="regular" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--atlas-fg)]">Events</h1>
              <p className="text-sm text-[var(--atlas-muted)]">Browse resources by FBLA competitive event</p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }} className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md group">
              <MagnifyingGlass size={15} weight="regular" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--atlas-muted)] transition-colors group-focus-within:text-[var(--atlas-accent)]" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="atlas-input py-2.5 pl-10 pr-4"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {EVENT_CATEGORIES.map(cat => (
                <motion.button
                  key={cat}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategory(cat)}
                  className={`atlas-chip transition-all duration-200 ${
                    category === cat
                      ? 'atlas-chip-active'
                      : 'hover:border-[var(--atlas-accent)]/45 hover:text-[var(--atlas-fg)]'
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
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setEventType(type)}
                className={`atlas-chip transition-all duration-200 ${
                  eventType === type
                    ? 'atlas-chip-active'
                    : 'hover:border-[var(--atlas-accent)]/45 hover:text-[var(--atlas-fg)]'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.p {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }} className="mb-5 text-sm text-[var(--atlas-muted)]">
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </motion.p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((event, i) => {
            const count = resourceCountsByEvent.get(event.name) || 0;
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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--atlas-border)] bg-[var(--atlas-surface)] text-[var(--atlas-accent)] transition-colors group-hover:border-[var(--atlas-accent)]/50" style={{ borderRadius: 10 }}>
                    <GridFour size={18} weight="regular" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-[var(--atlas-fg)] leading-snug transition-colors group-hover:text-[var(--atlas-accent)]">
                      {event.name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="atlas-chip px-2 py-0.5 text-[10px]">
                        {event.category}
                      </span>
                      {count > 0 && (
                        <span className="text-xs text-[var(--atlas-muted)]">
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-[var(--atlas-border)] bg-[var(--atlas-elev)]" style={{ borderRadius: 12 }}>
              <MagnifyingGlass size={24} weight="regular" className="text-[var(--atlas-muted)]" />
            </div>
            <p className="text-[var(--atlas-muted)]">No events match your search.</p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
