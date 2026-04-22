import { motion } from 'framer-motion';
import { Sparkles, Users2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PostComposer from '../components/social/PostComposer';
import PostCard from '../components/social/PostCard';
import ProfilePreviewCard from '../components/social/ProfilePreviewCard';
import PageHeader from '../components/ui/PageHeader';
import StatTile from '../components/ui/StatTile';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import { useSocial } from '../context/SocialContext';

export default function Feed() {
  const {
    currentProfile,
    postsLoading,
    createPost,
    toggleLikePost,
    addCommentToPost,
    getProfileById,
    connectedProfiles,
    outgoingRequestProfiles,
    sendConnectionRequest,
    profiles,
    getGlobalPosts,
    deletePost,
  } = useSocial();

  const posts = getGlobalPosts();

  const suggestions = profiles
    .filter((profile) => profile.id !== currentProfile?.id)
    .filter((profile) => !connectedProfiles.some((connected) => connected.id === profile.id))
    .filter((profile) => !outgoingRequestProfiles.some((pending) => pending.id === profile.id))
    .slice(0, 3);

  return (
    <PageTransition>
      <div className="atlas-page">
        <PageHeader
          kicker="Atlas / Global feed"
          title="What the whole network is talking about."
          subtitle="This is the cross-chapter stream for wins, questions, collaboration, and useful momentum."
          rightSlot={(
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
              <StatTile
                label="Connections"
                value={connectedProfiles.length}
                hint="Active"
                icon={<Users2 size={14} />}
                tone="accent"
              />
              <StatTile
                label="Posts"
                value={posts.length}
                hint="Global"
                tone="gold"
              />
            </div>
          )}
        />

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <PostComposer onSubmit={createPost} mode="global" />

            {postsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => <div key={item} className="skeleton h-56" />)}
              </div>
            ) : posts.length === 0 ? (
              <EmptyState
                title="No global posts yet"
                description="Be the first to kick off the conversation across chapters."
              />
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.25) }}
                >
                  <PostCard
                    post={post}
                    currentProfile={currentProfile}
                    getProfileById={getProfileById}
                    onToggleLike={toggleLikePost}
                    onComment={addCommentToPost}
                    onDeletePost={deletePost}
                  />
                </motion.div>
              ))
            )}
          </div>

          <aside className="space-y-4">
            <SectionHeader
              kicker="Suggested"
              title="Strengthen your network"
              description="Active competitors near your event area."
            />
            {suggestions.length === 0 ? (
              <EmptyState
                icon={<Sparkles size={18} />}
                title="You're well-connected"
                description="No new suggestions right now. Check back after the next round of events."
              />
            ) : (
              <div className="space-y-4">
                {suggestions.map((profile) => (
                  <ProfilePreviewCard
                    key={profile.id}
                    profile={profile}
                    onAction={() => sendConnectionRequest(profile.id)}
                  />
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
