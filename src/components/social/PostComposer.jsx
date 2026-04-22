import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { FBLA_EVENTS } from '../../data/mockEvents';
const SOCIAL_POST_CATEGORIES = [
  { value: 'general', label: 'General update' },
  { value: 'study-win', label: 'Study win' },
  { value: 'opportunity', label: 'Looking for help' },
  { value: 'portfolio', label: 'Project or portfolio' },
  { value: 'practice', label: 'Practice session' },
];
export default function PostComposer({
  onSubmit,
  mode = 'global',
  event = null,
}) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(SOCIAL_POST_CATEGORIES[0].value);
  const [scopeType, setScopeType] = useState(event ? 'event' : 'global');
  const [selectedEventSlug, setSelectedEventSlug] = useState(event?.slug || '');

  const selectedEvent = useMemo(
    () => FBLA_EVENTS.find((entry) => entry.slug === selectedEventSlug) || null,
    [selectedEventSlug],
  );

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    if (!content.trim()) return;

    const finalScopeType = event ? 'event' : scopeType;
    const finalEvent = event || selectedEvent;

    await onSubmit({
      content,
      category,
      scopeType: finalScopeType,
      eventSlug: finalScopeType === 'event' ? finalEvent?.slug || null : null,
      eventName: finalScopeType === 'event' ? finalEvent?.name || null : null,
    });

    setContent('');
    setCategory(SOCIAL_POST_CATEGORIES[0].value);
    if (!event) {
      setScopeType('global');
      setSelectedEventSlug('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-5">
      <div className="atlas-kicker mb-3">
        {event ? `Post to ${event.name}` : 'Compose'}
      </div>

      {!event ? (
        <div className="mb-4 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setScopeType('global')}
            className={`atlas-chip ${scopeType === 'global' ? 'atlas-chip-active' : 'hover:border-[var(--atlas-accent)]/55'}`}
          >
            Global feed
          </button>
          <button
            type="button"
            onClick={() => setScopeType('event')}
            className={`atlas-chip ${scopeType === 'event' ? 'atlas-chip-active' : 'hover:border-[var(--atlas-accent)]/55'}`}
          >
            Event feed
          </button>
        </div>
      ) : null}

      {scopeType === 'event' ? (
        event ? (
          <p className="mb-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--atlas-accent)]">
            Discussion for {event.name}
          </p>
        ) : (
          <div className="mb-4">
            <label htmlFor="post-event-select" className="sr-only">Choose event</label>
            <select
              id="post-event-select"
              value={selectedEventSlug}
              onChange={(submitEvent) => setSelectedEventSlug(submitEvent.target.value)}
              className="atlas-input"
            >
              <option value="">Choose an event feed</option>
              {FBLA_EVENTS.map((entry) => (
                <option key={entry.slug} value={entry.slug}>{entry.name}</option>
              ))}
            </select>
          </div>
        )
      ) : null}

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
        onChange={(submitEvent) => setContent(submitEvent.target.value)}
        placeholder={
          scopeType === 'event'
            ? 'Ask a question, share a prep tactic, or find people working on this event...'
            : 'Share a win, ask for help, post a study resource, or invite people into a practice session...'
        }
        className="atlas-textarea mt-4 min-h-32"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--atlas-muted)]">
          {scopeType === 'event' ? 'Specific to the event feed' : 'Practical · Specific · Inviting'}
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={!content.trim() || (scopeType === 'event' && !event && !selectedEventSlug)}
          className="atlas-btn atlas-btn-primary disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
        >
          <Send size={13} />
          Post
        </motion.button>
      </div>
    </form>
  );
}
