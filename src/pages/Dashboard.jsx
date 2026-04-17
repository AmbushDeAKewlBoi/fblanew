import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Download,
  Flame,
  Handshake,
  ThumbsUp,
  Upload,
  Users2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ResourceCard from '../components/ResourceCard';
import { useResources } from '../hooks/useResources';
import AnimatedCounter from '../components/AnimatedCounter';
import PageTransition from '../components/PageTransition';
import SkeletonCard from '../components/SkeletonCard';
import PageHeader from '../components/ui/PageHeader';
import StatTile from '../components/ui/StatTile';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { STUDY_CIRCLES } from '../data/mockCommunity';
import { useSocial } from '../context/SocialContext';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user, chapter } = useAuth();
  const { resources, loading } = useResources();
  const { currentProfile, profiles } = useSocial();

  const recentResources = [...resources]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);
  const popularResources = [...resources]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3);
  const myResources = user ? resources.filter((resource) => resource.uploaderId === user.id) : [];
  const suggestedConnections = profiles
    .filter((profile) => profile.id !== currentProfile?.id)
    .slice(0, 4);

  const myStats = {
    uploads: myResources.length,
    upvotes: myResources.reduce((sum, resource) => sum + (resource.upvoteCount || 0), 0),
    downloads: myResources.reduce((sum, resource) => sum + (resource.downloadCount || 0), 0),
  };

  if (loading) {
    return (
      <div className="atlas-page">
        <div className="mb-8 space-y-2">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-48" />
        </div>
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="skeleton h-24" />)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => <SkeletonCard key={item} />)}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="atlas-page">
        <PageHeader
          kicker="Dashboard"
          title={`Welcome back, ${user?.name?.split(' ')[0] || 'Atlas member'}.`}
          subtitle="Keep the chapter moving: publish better prep, meet stronger collaborators, and turn study time into momentum."
          meta={chapter ? `${chapter.name} · ${chapter.region}, ${chapter.state}` : null}
          actions={(
            <>
              <Link to="/upload" className="atlas-btn atlas-btn-primary">
                <Upload size={13} />
                Upload resource
              </Link>
              <Link to="/connections" className="atlas-btn atlas-btn-ghost">
                <Handshake size={13} />
                Grow your network
              </Link>
            </>
          )}
          rightSlot={(
            <div className="grid grid-cols-3 gap-2 sm:w-[420px]">
              <StatTile
                label="Shared"
                value={<AnimatedCounter value={myStats.uploads} />}
                hint="Resources"
                icon={<Upload size={14} />}
                tone="accent"
              />
              <StatTile
                label="Upvotes"
                value={<AnimatedCounter value={myStats.upvotes} />}
                hint="Earned"
                icon={<ThumbsUp size={14} />}
                tone="gold"
              />
              <StatTile
                label="Downloads"
                value={<AnimatedCounter value={myStats.downloads} />}
                hint="Driven"
                icon={<Download size={14} />}
              />
            </div>
          )}
        />

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.92fr]">
          <div className="space-y-8">
            <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.08 }}>
              <SectionHeader
                kicker="Suggested"
                title="People worth meeting this week"
                action={(
                  <Link
                    to="/connections"
                    className="group inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--atlas-accent)] hover:text-[var(--atlas-fg)]"
                  >
                    View network
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              />
              {suggestedConnections.length === 0 ? (
                <div className="mt-5">
                  <EmptyState title="No suggestions yet" description="Visit the network page to find people." />
                </div>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {suggestedConnections.map((profile, index) => (
                    <motion.article
                      key={profile.id}
                      {...fadeUp}
                      transition={{ duration: 0.35, delay: 0.1 + index * 0.05 }}
                      className="card-surface flex h-full flex-col p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <Link to={`/profile/${profile.id}`} className="flex min-w-0 items-center gap-3">
                          <Avatar name={profile.name} size="md" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[var(--atlas-fg)]">{profile.name}</p>
                            <p className="truncate text-sm text-[var(--atlas-muted)]">{profile.chapterName}</p>
                          </div>
                        </Link>
                        <Badge tone="success">Network fit</Badge>
                      </div>
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[var(--atlas-fg)]">{profile.headline}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {profile.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="atlas-chip">{skill}</span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-end justify-between gap-3 pt-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
                        <span>{profile.region}, {profile.state}</span>
                        <span>{profile.year}</span>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.section>

            <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
              <SectionHeader
                kicker="Trending"
                title="What the network is studying"
                action={<Flame size={16} className="text-[var(--atlas-gold)]" aria-hidden="true" />}
              />
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {popularResources.length === 0
                  ? [1, 2, 3].map((item) => <SkeletonCard key={item} />)
                  : popularResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
              </div>
            </motion.section>
          </div>

          <div className="space-y-8">
            <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.12 }} className="card-surface p-5">
              <SectionHeader
                kicker="Study circles"
                title="Find your accountability crew"
                action={<Users2 size={16} className="text-[var(--atlas-accent)]" aria-hidden="true" />}
              />
              <ul className="mt-5 space-y-3">
                {STUDY_CIRCLES.map((circle) => (
                  <li key={circle.id} className="atlas-panel border-l-2 border-l-[var(--atlas-accent)]/55 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[var(--atlas-fg)]">{circle.name}</h3>
                        <p className="text-xs text-[var(--atlas-muted)]">{circle.event}</p>
                      </div>
                      <Badge>{circle.members} mem</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--atlas-fg)]">{circle.focus}</p>
                    <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
                      {circle.cadence}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.section>

            <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.18 }}>
              <SectionHeader
                kicker="Fresh"
                title="Recently added"
                action={(
                  <Link
                    to="/events"
                    className="group inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--atlas-accent)] hover:text-[var(--atlas-fg)]"
                  >
                    <BookOpen size={12} />
                    Browse all
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              />
              <div className="mt-5 grid gap-4">
                {recentResources.length === 0
                  ? <EmptyState title="No resources yet" description="Be the first to upload one." />
                  : recentResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
