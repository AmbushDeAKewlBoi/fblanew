import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';
import { useSocial } from '../context/SocialContext';
import { formatDateTime, timeAgoShort } from '../lib/formatters';

export default function Messages() {
  const [searchParams] = useSearchParams();
  const selectedFromQuery = searchParams.get('profile');
  const {
    currentProfile,
    threads,
    getProfileById,
    connectedProfiles,
    sendMessage,
  } = useSocial();

  const orderedThreads = useMemo(() => {
    return [...threads].sort((a, b) => {
      const aLast = a.messages[a.messages.length - 1];
      const bLast = b.messages[b.messages.length - 1];
      return new Date(bLast.createdAt) - new Date(aLast.createdAt);
    });
  }, [threads]);

  const initialProfileId = selectedFromQuery || orderedThreads[0]?.profileId || connectedProfiles[0]?.id;
  const [selectedProfileId, setSelectedProfileId] = useState(initialProfileId);
  const [draft, setDraft] = useState('');

  const selectedThread = orderedThreads.find((thread) => thread.profileId === selectedProfileId);
  const selectedProfile = getProfileById(selectedProfileId);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [selectedThread?.messages?.length, selectedProfileId]);

  const handleSend = (event) => {
    event.preventDefault();
    if (!draft.trim() || !selectedProfileId) return;
    sendMessage(selectedProfileId, draft);
    setDraft('');
  };

  return (
    <PageTransition>
      <div className="atlas-page">
        <PageHeader
          kicker="Atlas / Inbox"
          title="Keep the conversation warm."
          subtitle="Move from connection to collaboration. Swap docs, line up practice sessions, and follow up on help requests."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <section className="card-surface flex max-h-[70vh] flex-col p-3">
            <div className="atlas-kicker px-3 pb-2 pt-1">Threads</div>
            <ul className="space-y-1.5 overflow-y-auto pr-1">
              {orderedThreads.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-[var(--atlas-muted)]">
                  No conversations yet. Connect with someone to start.
                </li>
              ) : orderedThreads.map((thread) => {
                const profile = getProfileById(thread.profileId);
                const lastMessage = thread.messages[thread.messages.length - 1];
                const active = selectedProfileId === thread.profileId;

                return (
                  <li key={thread.profileId}>
                    <button
                      onClick={() => setSelectedProfileId(thread.profileId)}
                      className={`w-full border-2 p-3 text-left transition ${
                        active
                          ? 'border-[var(--atlas-accent)]/60 bg-[rgba(61,109,118,0.08)] dark:bg-[rgba(109,158,168,0.10)]'
                          : 'border-transparent hover:border-[var(--atlas-border)] hover:bg-[var(--atlas-surface)]'
                      }`}
                      style={{ borderRadius: 2 }}
                      aria-current={active ? 'true' : undefined}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar name={profile?.name} size="md" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="truncate font-semibold text-[var(--atlas-fg)]">
                              {profile?.name || 'Atlas Member'}
                            </p>
                            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
                              {timeAgoShort(lastMessage?.createdAt)}
                            </span>
                          </div>
                          <p className="truncate text-xs text-[var(--atlas-muted)]">{profile?.chapterName}</p>
                          <p className="mt-1.5 line-clamp-1 text-sm text-[var(--atlas-fg)]">{lastMessage?.text}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="card-surface flex max-h-[70vh] flex-col p-5">
            {selectedProfile ? (
              <>
                <header className="flex items-center gap-3 border-b border-[var(--atlas-border)] pb-4">
                  <Avatar name={selectedProfile.name} size="md" linkTo={`/profile/${selectedProfile.id}`} />
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-[var(--atlas-fg)]">{selectedProfile.name}</h2>
                    <p className="truncate text-sm text-[var(--atlas-muted)]">{selectedProfile.headline}</p>
                  </div>
                </header>

                <div className="flex-1 space-y-3 overflow-y-auto py-5">
                  {selectedThread?.messages.map((message) => {
                    const mine = message.senderId === currentProfile?.id || message.senderId === 'me';
                    return (
                      <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] border-2 px-4 py-2.5 text-sm leading-6 ${
                            mine
                              ? 'border-[var(--atlas-accent)]/60 bg-[rgba(61,109,118,0.14)] dark:bg-[rgba(109,158,168,0.20)] text-[var(--atlas-fg)]'
                              : 'border-[var(--atlas-border)] bg-[var(--atlas-surface)] text-[var(--atlas-fg)]'
                          }`}
                          style={{ borderRadius: 2 }}
                        >
                          <p>{message.text}</p>
                          <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
                            {formatDateTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="flex gap-2 border-t border-[var(--atlas-border)] pt-4">
                  <label htmlFor="message-input" className="sr-only">Send a message</label>
                  <input
                    id="message-input"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Send a message"
                    className="atlas-input"
                  />
                  <button type="submit" disabled={!draft.trim()} className="atlas-btn atlas-btn-primary shrink-0 disabled:opacity-50">
                    <Send size={13} />
                    Send
                  </button>
                </form>
              </>
            ) : (
              <EmptyState
                title="Pick a conversation"
                description="Choose a thread on the left, or connect with someone new to start messaging."
                className="my-auto border-0"
              />
            )}
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
