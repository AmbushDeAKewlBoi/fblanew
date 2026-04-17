import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { timeAgoShort } from '../../lib/formatters';

export default function PostCard({ post, currentProfileId, getProfileById, onToggleLike, onComment }) {
  const [commentText, setCommentText] = useState('');
  const author = getProfileById(post.authorId);
  const likedByCurrentUser = post.likes.includes(currentProfileId);

  const submitComment = (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <article className="card-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <Avatar name={author?.name} size="lg" linkTo={`/profile/${post.authorId}`} />
          <div className="min-w-0">
            <Link
              to={`/profile/${post.authorId}`}
              className="block font-semibold text-[var(--atlas-fg)] hover:text-[var(--atlas-accent)]"
            >
              {author?.name || 'Atlas Member'}
            </Link>
            <p className="truncate text-sm text-[var(--atlas-muted)]">{author?.headline}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge tone="accent">{post.category.replace('-', ' ')}</Badge>
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--atlas-muted)]">
            {timeAgoShort(post.createdAt)}
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
            return (
              <li key={comment.id} className="border-l-2 border-[var(--atlas-accent)]/45 bg-[var(--atlas-surface)] px-4 py-3" style={{ borderRadius: 2 }}>
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to={`/profile/${comment.authorId}`}
                    className="text-sm font-semibold text-[var(--atlas-fg)] hover:text-[var(--atlas-accent)]"
                  >
                    {commentAuthor?.name || 'Atlas Member'}
                  </Link>
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
