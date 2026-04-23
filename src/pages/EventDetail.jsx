import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal, X, Search, MessagesSquare } from 'lucide-react';
import { getEventBySlug } from '../data/mockEvents';
import { EVENT_INFO } from '../data/eventInfo';
import { useResources } from '../hooks/useResources';
import { useSocial } from '../context/SocialContext';
import ResourceCard from '../components/ResourceCard';
import FilterSidebar from '../components/FilterSidebar';
import PageTransition from '../components/PageTransition';
import SkeletonCard from '../components/SkeletonCard';
import PostComposer from '../components/social/PostComposer';
import PostCard from '../components/social/PostCard';
import EmptyState from '../components/ui/EmptyState';
import SectionHeader from '../components/ui/SectionHeader';

export default function EventDetail() {
  const { slug } = useParams();
  const event = getEventBySlug(slug);
  const { resources, loading } = useResources();
  const {
    currentProfile,
    postsLoading,
    createPost,
    toggleLikePost,
    addCommentToPost,
    getProfileById,
    getEventPosts,
    deletePost,
  } = useSocial();

  const allResources = useMemo(() => {
    if (!event) return [];
    return resources.filter((r) => r.event === event.name);
  }, [resources, event]);

  const eventPosts = useMemo(
    () => (event ? getEventPosts(event.slug) : []),
    [event, getEventPosts],
  );

  const [activeTab, setActiveTab] = useState('info');
  const [showFilters, setShowFilters] = useState(false);
  const eventInfoData = event ? EVENT_INFO[event.slug] : null;

  const [filters, setFilters] = useState({
    types: [],
    visibility: [],
    tags: [],
    sort: 'recent',
  });

  const allTags = useMemo(() => {
    const tags = new Set();
    allResources.forEach((r) => {
      if (r.tags) r.tags.forEach((t) => tags.add(t));
    });
    return [...tags].sort();
  }, [allResources]);

  const filtered = useMemo(() => {
    let result = [...allResources];
    if (filters.types.length > 0) result = result.filter((r) => filters.types.includes(r.resourceType));
    if (filters.visibility.length > 0) result = result.filter((r) => filters.visibility.includes(r.visibilityLevel));
    if (filters.tags.length > 0) result = result.filter((r) => r.tags && filters.tags.some((t) => r.tags.includes(t)));
    if (filters.sort === 'recent') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (filters.sort === 'popular') result.sort((a, b) => b.upvoteCount - a.upvoteCount);
    else if (filters.sort === 'downloads') result.sort((a, b) => b.downloadCount - a.downloadCount);
    return result;
  }, [allResources, filters]);

  if (!event) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--atlas-elev)] dark:bg-[var(--atlas-elev)]">
            <Search size={24} className="text-[var(--atlas-muted)]" />
          </div>
          <h1 className="text-xl font-bold text-[var(--atlas-fg)]">Event not found</h1>
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
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
          <Link to="/events" className="mb-3 inline-flex items-center gap-1.5 text-sm text-[var(--atlas-muted)] hover:text-[var(--atlas-fg)] dark:text-[var(--atlas-muted)] dark:hover:text-warm-200 transition-colors">
            <ArrowLeft size={14} /> Events
          </Link>
          <h1 className="text-2xl font-bold text-[var(--atlas-fg)]">{event.name}</h1>
          {loading ? (
            <div className="mt-2 skeleton h-4 w-40" />
          ) : (
            <p className="mt-1 text-sm text-[var(--atlas-muted)]">
              {filtered.length} resource{filtered.length !== 1 ? 's' : ''} available · {eventPosts.length} discussion post{eventPosts.length === 1 ? '' : 's'}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          role="tablist"
          className="atlas-panel mb-8 flex gap-1 p-1 xl:w-2/3"
        >
          {[
            { id: 'info', label: 'Overview' },
            { id: 'resources', label: `Resources (${filtered.length})` },
            { id: 'discussion', label: `Discussion (${eventPosts.length})` },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 border-2 py-2.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                  active
                    ? 'border-[var(--atlas-accent)] bg-[rgba(61,109,118,0.10)] text-[var(--atlas-fg)] dark:bg-[rgba(109,158,168,0.14)]'
                    : 'border-transparent text-[var(--atlas-muted)] hover:text-[var(--atlas-fg)]'
                }`}
                style={{ borderRadius: 2 }}
              >
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {activeTab === 'resources' && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowFilters(!showFilters)}
            className="mb-4 flex items-center gap-2 rounded-xl border border-[var(--atlas-border)] px-4 py-2.5 text-sm font-medium text-[var(--atlas-fg)] lg:hidden dark:border-warm-700 text-[var(--atlas-muted)] transition-colors hover:border-warm-300"
          >
            <SlidersHorizontal size={16} /> Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy-800 text-xs font-semibold text-white dark:bg-navy-500">
                {activeFilterCount}
              </span>
            )}
          </motion.button>
        )}

        <div className="flex gap-8">
          {activeTab === 'resources' && (
            <div className={`${showFilters ? 'fixed inset-0 z-50 bg-black/30 lg:static lg:bg-transparent' : 'hidden lg:block'}`}>
              <div className={`${showFilters ? 'absolute right-0 top-0 h-full w-80 overflow-y-auto bg-white p-6 shadow-xl lg:static lg:w-auto lg:shadow-none lg:p-0 dark:bg-[var(--atlas-surface)]' : ''}`}>
                {showFilters && (
                  <button
                    onClick={() => setShowFilters(false)}
                    className="mb-4 flex items-center gap-2 text-sm text-[var(--atlas-muted)] lg:hidden transition-colors hover:text-[var(--atlas-fg)]"
                  >
                    <X size={16} /> Close
                  </button>
                )}
                <FilterSidebar filters={filters} setFilters={setFilters} tagOptions={allTags} />
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-10">
            {activeTab === 'info' && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {eventInfoData ? (
                  <div className="card-surface p-6 sm:p-10">
                    <div className="flex flex-wrap gap-8 mb-10 border-b border-[var(--atlas-border)] pb-8">
                      <div><span className="atlas-kicker mb-1.5 block">Type</span><span className="text-xl font-serif text-[var(--atlas-fg)]">{eventInfoData.type || 'Unknown'}</span></div>
                      <div><span className="atlas-kicker mb-1.5 block">Category</span><span className="text-xl font-serif text-[var(--atlas-fg)]">{eventInfoData.testCategory || 'Unknown'}</span></div>
                    </div>
                    <div className="max-w-none">
                      <p className="text-xl sm:text-2xl font-serif leading-relaxed mb-12 text-[var(--atlas-fg)] border-l-4 border-[var(--atlas-accent)] pl-6">
                        {eventInfoData.description}
                      </p>
                      <div className="mt-8 rounded-xl overflow-hidden border border-[var(--atlas-border)]">
                        <iframe
                          src={`/pdfs/${event.slug}.pdf`}
                          className="w-full h-[800px] border-none"
                          title={`${event.name} Study Guide`}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState title="No detailed info available" description="This event does not have an attached study guide yet." />
                )}
              </motion.section>
            )}

            {activeTab === 'resources' && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <SectionHeader
                  kicker="Resources"
                  title={`Prep material for ${event.name}`}
                />

              <div className="mt-5">
                {loading ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
                  </div>
                ) : filtered.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((r) => (
                      <ResourceCard key={r.id} resource={r} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card-surface py-20 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--atlas-elev)] dark:bg-[var(--atlas-elev)]">
                      <Search size={22} className="text-[var(--atlas-muted)]" />
                    </div>
                    <p className="text-[var(--atlas-muted)]">No resources match your filters.</p>
                    <button
                      onClick={() => setFilters({ types: [], visibility: [], tags: [], sort: 'recent' })}
                      className="mt-3 text-sm font-semibold text-navy-700 hover:text-navy-600 dark:text-navy-400 transition-colors"
                    >
                      Clear filters
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.section>
            )}

            {activeTab === 'discussion' && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <SectionHeader
                  kicker="Discussion"
                title={`${event.name} feed`}
                description="Ask questions, compare strategy, and find people working on the same event."
                action={<MessagesSquare size={16} className="text-[var(--atlas-accent)]" aria-hidden="true" />}
              />

              <div className="mt-5 space-y-5">
                <PostComposer onSubmit={createPost} mode="event" event={event} />

                {postsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((item) => <div key={item} className="skeleton h-56" />)}
                  </div>
                ) : eventPosts.length > 0 ? (
                  eventPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentProfile={currentProfile}
                      getProfileById={getProfileById}
                      onToggleLike={toggleLikePost}
                      onComment={addCommentToPost}
                      onDeletePost={deletePost}
                    />
                  ))
                ) : (
                  <EmptyState
                    icon={<MessagesSquare size={18} />}
                    title={`No ${event.name} discussion yet`}
                    description="Kick things off with a question, a prep tactic, or an open invite for practice."
                  />
                )}
              </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
