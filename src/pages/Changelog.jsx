import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Shield, Sparkle, Bug, Calendar, Clock, Terminal } from '@phosphor-icons/react';
import PageTransition from '../components/PageTransition';
import PageHeader from '../components/ui/PageHeader';
import SkeletonCard from '../components/SkeletonCard';
import Badge from '../components/ui/Badge';

function timeAgo(dateString) {
  if (!dateString) return 'Just now';
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
}

const TYPE_CONFIG = {
  security: { icon: Shield, tone: 'danger', label: 'Security' },
  feature: { icon: Sparkle, tone: 'accent', label: 'Feature' },
  bugfix: { icon: Bug, tone: 'gold', label: 'Bug Fix' },
  event: { icon: Calendar, tone: 'neutral', label: 'Event' },
  system: { icon: Terminal, tone: 'accent', label: 'System' }
};

export default function Changelog() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'changelog'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUpdates(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching changelog:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <PageTransition>
      <div className="atlas-page max-w-4xl mx-auto">
        <PageHeader 
          kicker="System Log" 
          title="Changelog" 
          subtitle="Real-time log of security patches, major features, and system updates." 
        />
        
        <div className="mt-8 space-y-4">
          {loading ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : updates.length === 0 ? (
            <div className="card-surface p-10 text-center text-[var(--atlas-muted)]">
              No updates have been posted yet.
            </div>
          ) : (
            updates.map(update => {
              const config = TYPE_CONFIG[update.type] || TYPE_CONFIG.system;
              const Icon = config.icon;
              return (
                <article key={update.id} className="card-surface p-6 flex gap-5 flex-col sm:flex-row items-start">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[var(--atlas-border)] bg-[var(--atlas-elev)] text-[var(--atlas-fg)]">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-[family-name:var(--font-display)] font-semibold tracking-tight text-[var(--atlas-fg)] text-lg">{update.title}</h3>
                      <Badge tone={config.tone}>{config.label}</Badge>
                    </div>
                    <p className="text-[var(--atlas-muted)] text-[15px] leading-relaxed whitespace-pre-wrap">{update.description}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-[0.14em] text-[var(--atlas-muted)]">
                      <Clock size={12} />
                      {timeAgo(update.createdAt)}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </PageTransition>
  );
}
