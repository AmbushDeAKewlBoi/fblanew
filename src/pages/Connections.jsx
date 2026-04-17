import { Check, UserPlus, X } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ProfilePreviewCard from '../components/social/ProfilePreviewCard';
import PageHeader from '../components/ui/PageHeader';
import StatTile from '../components/ui/StatTile';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { useSocial } from '../context/SocialContext';

export default function Connections() {
  const {
    currentProfile,
    profiles,
    connectedProfiles,
    incomingRequestProfiles,
    outgoingRequestProfiles,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
  } = useSocial();

  const suggestions = profiles
    .filter((profile) => profile.id !== currentProfile?.id)
    .filter((profile) => !connectedProfiles.some((connected) => connected.id === profile.id))
    .filter((profile) => !incomingRequestProfiles.some((request) => request.id === profile.id))
    .filter((profile) => !outgoingRequestProfiles.some((request) => request.id === profile.id))
    .slice(0, 6);

  return (
    <PageTransition>
      <div className="atlas-page">
        <PageHeader
          kicker="Atlas / Network"
          title="Build the graph before you need the graph."
          subtitle="Find roleplay reps, event partners, honest feedback, and the people who keep your momentum alive between competitions."
          rightSlot={(
            <div className="grid grid-cols-3 gap-2">
              <StatTile label="Connections" value={connectedProfiles.length} tone="accent" />
              <StatTile label="Incoming" value={incomingRequestProfiles.length} tone="gold" />
              <StatTile label="Pending" value={outgoingRequestProfiles.length} />
            </div>
          )}
        />

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section>
            <SectionHeader
              kicker="Suggested"
              title="Who should you add next?"
              description="Based on chapter and event overlap."
            />
            {suggestions.length === 0 ? (
              <div className="mt-5">
                <EmptyState
                  title="No new suggestions"
                  description="You've already connected with the most relevant people right now."
                />
              </div>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {suggestions.map((profile) => (
                  <ProfilePreviewCard
                    key={profile.id}
                    profile={profile}
                    onAction={() => sendConnectionRequest(profile.id)}
                  />
                ))}
              </div>
            )}
          </section>

          <div className="space-y-8">
            <section className="card-surface p-5">
              <SectionHeader
                kicker="Incoming"
                title="People waiting on you"
              />
              <div className="mt-5 space-y-3">
                {incomingRequestProfiles.length > 0 ? incomingRequestProfiles.map((profile) => (
                  <div key={profile.id} className="atlas-panel p-4">
                    <div className="flex items-start gap-3">
                      <Avatar name={profile.name} size="md" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-[var(--atlas-fg)]">{profile.name}</h3>
                        <p className="text-sm text-[var(--atlas-muted)]">{profile.chapterName}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--atlas-fg)]">{profile.headline}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => acceptConnectionRequest(profile.id)}
                        className="atlas-btn atlas-btn-primary px-3 py-1.5 text-[11px]"
                      >
                        <Check size={13} />
                        Accept
                      </button>
                      <button
                        onClick={() => declineConnectionRequest(profile.id)}
                        className="atlas-btn atlas-btn-ghost px-3 py-1.5 text-[11px]"
                      >
                        <X size={13} />
                        Decline
                      </button>
                    </div>
                  </div>
                )) : (
                  <p className="atlas-panel px-4 py-5 text-sm text-[var(--atlas-muted)]">
                    No incoming requests right now.
                  </p>
                )}
              </div>
            </section>

            <section className="card-surface p-5">
              <SectionHeader
                kicker="Connected"
                title="Your active network"
              />
              <ul className="mt-5 space-y-2">
                {connectedProfiles.length === 0 ? (
                  <li className="atlas-panel px-4 py-5 text-sm text-[var(--atlas-muted)]">
                    You're not connected with anyone yet.
                  </li>
                ) : connectedProfiles.map((profile) => (
                  <li key={profile.id} className="atlas-panel flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={profile.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[var(--atlas-fg)]">{profile.name}</p>
                        <p className="truncate text-xs text-[var(--atlas-muted)]">{profile.chapterName}</p>
                      </div>
                    </div>
                    <Badge tone="success" icon={<Check size={11} />}>Active</Badge>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card-surface p-5">
              <SectionHeader
                kicker="Outbound"
                title="Requests you already sent"
              />
              <ul className="mt-5 space-y-2">
                {outgoingRequestProfiles.length > 0 ? outgoingRequestProfiles.map((profile) => (
                  <li key={profile.id} className="atlas-panel flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={profile.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[var(--atlas-fg)]">{profile.name}</p>
                        <p className="truncate text-xs text-[var(--atlas-muted)]">{profile.chapterName}</p>
                      </div>
                    </div>
                    <Badge tone="warn" icon={<UserPlus size={11} />}>Pending</Badge>
                  </li>
                )) : (
                  <li className="atlas-panel px-4 py-5 text-sm text-[var(--atlas-muted)]">
                    No pending requests.
                  </li>
                )}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
