import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, MessageSquare, UserPlus } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PostCard from '../components/social/PostCard';
import PageHeader from '../components/ui/PageHeader';
import StatTile from '../components/ui/StatTile';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { useSocial } from '../context/SocialContext';

export default function Profile() {
  const { profileId } = useParams();
  const {
    currentProfile,
    getProfileById,
    posts,
    connectedProfiles,
    outgoingRequestProfiles,
    sendConnectionRequest,
    toggleLikePost,
    addCommentToPost,
  } = useSocial();

  const profile = getProfileById(profileId === 'me' ? currentProfile?.id : profileId);
  const profilePosts = profile ? posts.filter((post) => post.authorId === profile.id) : [];
  const isConnected = profile && connectedProfiles.some((candidate) => candidate.id === profile.id);
  const pending = profile && outgoingRequestProfiles.some((candidate) => candidate.id === profile.id);

  if (!profile) {
    return (
      <PageTransition>
        <div className="atlas-page">
          <EmptyState
            title="Profile not found"
            description="This profile may have been removed or the link may be wrong."
            action={
              <Link to="/connections" className="atlas-btn atlas-btn-primary">
                Browse network
              </Link>
            }
          />
        </div>
      </PageTransition>
    );
  }

  const isSelf = profile.id === currentProfile?.id;

  return (
    <PageTransition>
      <div className="atlas-page">
        <PageHeader
          kicker={isSelf ? 'Your profile' : 'Member profile'}
          title={profile.name}
          subtitle={profile.headline}
          meta={`${profile.chapterName} · ${profile.region}, ${profile.state}`}
          actions={
            !isSelf && (
              <>
                <button
                  onClick={() => sendConnectionRequest(profile.id)}
                  disabled={isConnected || pending}
                  className="atlas-btn atlas-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <UserPlus size={13} />
                  {isConnected ? 'Connected' : pending ? 'Request sent' : 'Connect'}
                </button>
                <Link to={`/messages?profile=${profile.id}`} className="atlas-btn atlas-btn-ghost">
                  <MessageSquare size={13} />
                  Message
                </Link>
              </>
            )
          }
          rightSlot={(
            <div className="flex items-center gap-3">
              <Avatar name={profile.name} size="xl" tone="gold" />
              <div className="grid grid-cols-2 gap-2">
                <StatTile label="Posts" value={profilePosts.length} tone="accent" />
                <StatTile label="Skills" value={profile.skills?.length ?? 0} tone="gold" />
              </div>
            </div>
          )}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="space-y-6">
            <div className="card-surface p-5">
              <SectionHeader
                kicker="Focus"
                title="What they want next"
              />
              <p className="mt-4 text-sm leading-6 text-[var(--atlas-fg)]">{profile.bio}</p>

              <ul className="mt-5 space-y-2">
                {(profile.goals || []).map((goal) => (
                  <li
                    key={goal}
                    className="atlas-panel border-l-2 border-l-[var(--atlas-accent)]/55 px-4 py-3 text-sm text-[var(--atlas-fg)]"
                  >
                    {goal}
                  </li>
                ))}
              </ul>

              {profile.skills?.length ? (
                <div className="mt-5">
                  <div className="atlas-kicker mb-2">Strengths</div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((skill) => (
                      <span key={skill} className="atlas-chip">{skill}</span>
                    ))}
                  </div>
                </div>
              ) : null}

              {profile.experience ? (
                <div className="atlas-panel mt-5 px-4 py-4">
                  <div className="atlas-kicker mb-2 flex items-center gap-2">
                    <BriefcaseBusiness size={12} />
                    Experience
                  </div>
                  <p className="text-sm leading-6 text-[var(--atlas-fg)]">{profile.experience}</p>
                </div>
              ) : null}

              {isSelf ? (
                <div className="mt-5">
                  <Badge tone="accent">This is you</Badge>
                </div>
              ) : null}
            </div>
          </section>

          <section>
            <SectionHeader
              kicker="Activity"
              title={`${profile.name.split(' ')[0]}'s posts`}
              action={!isSelf && (
                <Link
                  to={`/messages?profile=${profile.id}`}
                  className="group inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--atlas-accent)] hover:text-[var(--atlas-fg)]"
                >
                  Start conversation
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            />

            <div className="mt-5 space-y-5">
              {profilePosts.length > 0 ? (
                profilePosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentProfileId={currentProfile?.id}
                    getProfileById={getProfileById}
                    onToggleLike={toggleLikePost}
                    onComment={addCommentToPost}
                  />
                ))
              ) : (
                <EmptyState
                  title="No posts yet"
                  description={isSelf ? "Share your first update from the feed." : "When they post, you'll see it here."}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
