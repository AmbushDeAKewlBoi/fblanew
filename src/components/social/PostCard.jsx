import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Trash2 } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { timeAgoShort } from '../../lib/formatters';

export default function PostCard({ post, currentProfile, getProfileById, onToggleLike, onComment, onDeletePost }) {
  const [commentText, setCommentText] = useState('');
  const currentProfileId = currentProfile?.id;
  const author = getProfileById(post.authorId);
  const authorName = author?.name || post.authorNameSnapshot || 'Atlas Member';
  const authorHeadline = author?.headline || post.authorHeadlineSnapshot || '';
  const likedByCurrentUser = post.likes.includes(currentProfileId);
  const profileLink = author ? `/profile/${post.authorId}` : null;

  const isAuthor = currentProfileId === post.authorId;
  const isChapterAdvisor = currentProfile?.isAdvisor && currentProfile?.chapterId === post.chapterId;
  const canDelete = isAuthor || isChapterAdvisor;

  const submitComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    await onComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <article className="card-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar name={authorName} size="lg" linkTo={profileLink || undefined} />
          <div className="min-w-0">
            {profileLink ? (
              <Link
                to={profileLink}
                className="block font-semibold text-[var(--atlas-fg)] hover:text-[var(--atlas-accent)]"
              >
                {authorName}
              </Link>
            ) : (
              <p className="block font-semibold text-[var(--atlas-fg)]">
                {authorName}
              </p>
            )}
            <p className="truncate text-sm text-[var(--atlas-muted)]">{authorHeadline}</p>
            {post.authorChapterNameSnapshot ? (
              <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
                {post.authorChapterNameSnapshot}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex flex-wrap justify-end gap-1.5">
            <Badge tone="accent">{post.category.replace('-', ' ')}</Badge>
            {post.scopeType === 'event' && post.eventName ? (
              <Badge tone="gold">{post.eventName}</Badge>
            ) : (
              <Badge>Global</Badge>
            )}
          </div>
          <span className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--atlas-muted)]">
            {timeAgoShort(post.createdAt)}
            {canDelete && (
              <button 
                onClick={() => onDeletePost(post.id)}
                className="text-[var(--atlas-muted)] hover:text-red-500 transition-colors"
                title={isAuthor ? 'Delete your post' : 'Delete as Advisor'}
              >
                <Trash2 size={12} />
              </button>
            )}
          </span>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-[var(--atlas-fg)]">{post.content}</p>

      <div className="atlas-divider mt-5" />
      <div className="mt-4 flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onToggleLike(post.id)}
          aria-pressed={likedByCurrentUser}
          aria-label={likedByCurrentUser ? 'Unlike post' : 'Like post'}
          className={`inline-flex items-center gap-2 border-2 px-3 py-1.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
            likedByCurrentUser
              ? 'border-emerald-500/60 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
              : 'border-[var(--atlas-border)] text-[var(--atlas-muted)] hover:border-[var(--atlas-accent)] hover:text-[var(--atlas-fg)]'
          }`}
          style={{ borderRadius: 2 }}
        >
          <ThumbsUp size={13} className={likedByCurrentUser ? 'fill-current' : ''} />
          {post.likes.length}
        </motion.button>
        <span className="inline-flex items-center gap-2 px-2 py-1.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--atlas-muted)]">
          <MessageSquare size={13} />
          {post.comments.length} comments
        </span>
      </div>

      {post.comments.length > 0 && (
        <ul className="mt-4 space-y-3">
          {post.comments.map((comment) => {
            const commentAuthor = getProfileById(comment.authorId);
            const commentAuthorName = commentAuthor?.name || comment.authorNameSnapshot || 'Atlas Member';
            const commentProfileLink = commentAuthor ? `/profile/${comment.authorId}` : null;

            return (
              <li key={comment.id} className="border-l-2 border-[var(--atlas-accent)]/45 bg-[var(--atlas-surface)] px-4 py-3" style={{ borderRadius: 2 }}>
                <div className="flex items-center justify-between gap-3">
                  {commentProfileLink ? (
                    <Link
                      to={commentProfileLink}
                      className="text-sm font-semibold text-[var(--atlas-fg)] hover:text-[var(--atlas-accent)]"
                    >
                      {commentAuthorName}
                    </Link>
                  ) : (
                    <p className="text-sm font-semibold text-[var(--atlas-fg)]">
                      {commentAuthorName}
                    </p>
                  )}
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--atlas-muted)]">
                    {timeAgoShort(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--atlas-fg)]">{comment.content}</p>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={submitComment} className="mt-4 flex gap-2">
        <label htmlFor={`comment-${post.id}`} className="sr-only">Add a comment</label>
        <input
          id={`comment-${post.id}`}
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder="Add a comment"
          className="atlas-input"
        />
        <button type="submit" className="atlas-btn atlas-btn-primary shrink-0">
          Post
        </button>
      </form>
    </article>
  );
}
