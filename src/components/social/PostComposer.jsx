import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { SOCIAL_POST_CATEGORIES } from '../../data/mockSocial';

export default function PostComposer({ onSubmit }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(SOCIAL_POST_CATEGORIES[0].value);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    onSubmit({ content, category });
    setContent('');
    setCategory(SOCIAL_POST_CATEGORIES[0].value);
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-5">
      <div className="atlas-kicker mb-3">Compose</div>
      <div role="radiogroup" aria-label="Post category" className="flex flex-wrap gap-1.5">
        {SOCIAL_POST_CATEGORIES.map((option) => {
          const active = category === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setCategory(option.value)}
              className={`atlas-chip ${active ? 'atlas-chip-active' : 'hover:border-[var(--atlas-accent)]/55'}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <label htmlFor="post-composer-textarea" className="sr-only">Post content</label>
      <textarea
        id="post-composer-textarea"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Share a win, ask for help, post a study resource, or invite people into a practice session..."
        className="atlas-textarea mt-4 min-h-32"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--atlas-muted)]">
          Practical &middot; Specific &middot; Inviting
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={!content.trim()}
          className="atlas-btn atlas-btn-primary disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
        >
          <Send size={13} />
          Post
        </motion.button>
      </div>
    </form>
  );
}
