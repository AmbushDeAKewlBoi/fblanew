import { Bell, CheckCheck } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageHeader from '../components/ui/PageHeader';
import StatTile from '../components/ui/StatTile';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';
import { useSocial } from '../context/SocialContext';
import { formatDateTime } from '../lib/formatters';

export default function Notifications() {
  const {
    notifications,
    getProfileById,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationCount,
  } = useSocial();

  return (
    <PageTransition>
      <div className="atlas-page mx-auto max-w-5xl">
        <PageHeader
          kicker="Atlas / Alerts"
          title="Stay on top of the network."
          subtitle="Follow up quickly. Most of Atlas's value comes from the speed between a notification and a real conversation."
          rightSlot={(
            <StatTile
              label="Unread"
              value={unreadNotificationCount}
              icon={<Bell size={14} />}
              tone="gold"
            />
          )}
          actions={(
            <button
              onClick={markAllNotificationsRead}
              disabled={unreadNotificationCount === 0}
              className="atlas-btn atlas-btn-ghost disabled:opacity-50"
            >
              <CheckCheck size={13} />
              Mark all read
            </button>
          )}
        />

        <section className="mt-8">
          {notifications.length === 0 ? (
            <EmptyState
              icon={<Bell size={18} />}
              title="You're all caught up"
              description="When someone connects, comments, or messages you, it'll show up here."
            />
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification) => {
                const actor = getProfileById(notification.actorId);
                const unread = !notification.read;
                return (
                  <li key={notification.id}>
                    <button
                      onClick={() => markNotificationRead(notification.id)}
                      className={`relative w-full border-l-2 px-4 py-3 text-left transition ${
                        unread
                          ? 'border-[var(--atlas-accent)] bg-[rgba(61,109,118,0.08)] dark:bg-[rgba(109,158,168,0.10)]'
                          : 'border-[var(--atlas-border)] bg-[var(--atlas-surface)] hover:border-[var(--atlas-accent)]/55'
                      }`}
                      style={{ borderRadius: 2 }}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar name={actor?.name || 'Atlas'} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="font-semibold text-[var(--atlas-fg)]">{actor?.name || 'Atlas activity'}</p>
                            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
                              {formatDateTime(notification.createdAt)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-[var(--atlas-fg)]">{notification.message}</p>
                        </div>
                        {unread ? (
                          <span aria-label="Unread" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--atlas-accent)]" />
                        ) : null}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
