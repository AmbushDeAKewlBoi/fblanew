import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Users2 } from 'lucide-react';
import { useResources } from '../hooks/useResources';
import ResourceCard from '../components/ResourceCard';
import FilterSidebar from '../components/FilterSidebar';
import PageTransition from '../components/PageTransition';
import SkeletonCard from '../components/SkeletonCard';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { useSocial } from '../context/SocialContext';

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
  const { profiles } = useSocial();

  const allTags = useMemo(() => {
    const tags = new Set();
    resources.forEach((resource) => {
      if (resource.tags) resource.tags.forEach((tag) => tags.add(tag));
    });
    return [...tags].sort();
  }, [resources]);

  const resourceResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    let filtered = resources.filter((resource) =>
      (resource.title || '').toLowerCase().includes(q)
      || (resource.description || '').toLowerCase().includes(q)
      || (resource.tags && resource.tags.some((tag) => tag.toLowerCase().includes(q)))
      || (resource.event || '').toLowerCase().includes(q)
    );
    if (filters.types.length > 0) filtered = filtered.filter((r) => filters.types.includes(r.resourceType));
    if (filters.visibility.length > 0) filtered = filtered.filter((r) => filters.visibility.includes(r.visibilityLevel));
    if (filters.tags.length > 0) filtered = filtered.filter((r) => filters.tags.some((tag) => r.tags.includes(tag)));
    if (filters.sort === 'popular') filtered.sort((a, b) => b.upvoteCount - a.upvoteCount);
    else if (filters.sort === 'downloads') filtered.sort((a, b) => b.downloadCount - a.downloadCount);
    else filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return filtered;
  }, [filters, query, resources]);

  const peopleResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return profiles.filter((profile) =>
      profile.name.toLowerCase().includes(q)
      || profile.chapterName.toLowerCase().includes(q)
      || profile.headline.toLowerCase().includes(q)
      || profile.skills.some((skill) => skill.toLowerCase().includes(q))
    );
  }, [profiles, query]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  return (
    <PageTransition>
      <div className="atlas-page">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          onSubmit={handleSearch}
          className="mb-8"
          role="search"
        >
          <div className="atlas-kicker mb-2">Search Atlas</div>
          <div className="relative max-w-3xl">
            <SearchIcon
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--atlas-muted)]"
              aria-hidden="true"
            />
            <label htmlFor="atlas-search" className="sr-only">Search resources, events, chapters, people</label>
            <input
              id="atlas-search"
              type="search"
              placeholder="Search resources, events, chapters, people..."
              value={query}
              onChange={(event) => {
                const nextValue = event.target.value;
                setQuery(nextValue);
                setSearchParams(nextValue.trim() ? { q: nextValue.trim() } : {});
              }}
              className="atlas-input pl-10 text-base"
              autoFocus
            />
          </div>
        </motion.form>

        {query.trim() ? (
          <>
            <p className="atlas-kicker mb-6">
              {resourceResults.length} resource{resourceResults.length === 1 ? '' : 's'} ·{' '}
              {peopleResults.length} {peopleResults.length === 1 ? 'person' : 'people'} for "{query}"
            </p>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => <SkeletonCard key={item} />)}
              </div>
            ) : (
              <div className="grid gap-8 xl:grid-cols-[280px_1fr]">
                <aside className="hidden xl:block">
                  <FilterSidebar filters={filters} setFilters={setFilters} tagOptions={allTags} />
                </aside>

                <div className="space-y-10">
                  <section>
                    <SectionHeader
                      kicker="Resources"
                      title="Study guides, roleplays, and templates"
                      action={<SearchIcon size={16} className="text-[var(--atlas-accent)]" aria-hidden="true" />}
                    />
                    <div className="mt-5">
                      {resourceResults.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                          {resourceResults.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          title="No matching resources"
                          description="Try a different keyword or relax the filters in the sidebar."
                        />
                      )}
                    </div>
                  </section>

                  <section>
                    <SectionHeader
                      kicker="People"
                      title="Members you could study with"
                      action={<Users2 size={16} className="text-[var(--atlas-gold)]" aria-hidden="true" />}
                    />
                    <div className="mt-5">
                      {peopleResults.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          {peopleResults.map((profile) => (
                            <article key={profile.id} className="card-surface p-5">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-3">
                                  <Avatar name={profile.name} size="md" linkTo={`/profile/${profile.id}`} />
                                  <div className="min-w-0">
                                    <p className="truncate font-semibold text-[var(--atlas-fg)]">{profile.name}</p>
                                    <p className="truncate text-sm text-[var(--atlas-muted)]">{profile.chapterName}</p>
                                  </div>
                                </div>
                                {profile.year ? <Badge>{profile.year}</Badge> : null}
                              </div>
                              <p className="mt-4 line-clamp-2 text-sm leading-6 text-[var(--atlas-fg)]">{profile.headline}</p>
                              <div className="mt-4 flex flex-wrap gap-1.5">
                                {profile.skills.map((skill) => (
                                  <span key={skill} className="atlas-chip">{skill}</span>
                                ))}
                              </div>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          title="No people matched"
                          description="Try a chapter name, region, or skill keyword."
                        />
                      )}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={<SearchIcon size={20} />}
            title="Search resources and people"
            description='Try "database", "marketing", "graphic design", or "roleplay".'
          />
        )}
      </div>
    </PageTransition>
  );
}
