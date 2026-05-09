import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import {
  MagnifyingGlass,
  Plus,
  Trophy,
  SquaresFour,
  SignOut,
  CaretDown,
  List,
  X,
  FolderOpen,
  Shield,
  BookOpen,
  UsersThree,
  Bell,
  ChatCircle,
  Newspaper,
  Terminal,
} from '@phosphor-icons/react';

export default function Navbar() {
  const { user, isAuthenticated, logout, chapter } = useAuth();
  const { unreadNotificationCount, currentProfile } = useSocial();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `group flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] border transition-all duration-200 ${
      isActive(path)
        ? 'border-[var(--atlas-accent)] bg-[var(--atlas-fg)] text-[var(--atlas-bg)]'
        : 'border-transparent text-[var(--atlas-muted)] hover:border-[var(--atlas-border)] hover:bg-[var(--atlas-elev)] hover:text-[var(--atlas-fg)]'
    }`;

  const iconBtn = (path) =>
    `relative rounded-full p-2.5 border transition-all duration-200 ${
      isActive(path)
        ? 'border-[var(--atlas-accent)] bg-[var(--atlas-fg)] text-[var(--atlas-bg)]'
        : 'border-transparent text-[var(--atlas-muted)] hover:border-[var(--atlas-border)] hover:bg-[var(--atlas-elev)] hover:text-[var(--atlas-fg)]'
    }`;

  return (
    <nav className="sticky top-3 z-50 px-3">
      <div className="mx-auto max-w-7xl rounded-full border border-[var(--atlas-border)] bg-[var(--atlas-surface)]/82 px-3 shadow-[0_24px_70px_-48px_rgba(0,0,0,0.78)] backdrop-blur-2xl sm:px-4">
        <div className="flex h-[4.35rem] items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--atlas-accent)] bg-[var(--atlas-fg)] text-sm font-bold text-[var(--atlas-bg)] font-[family-name:var(--font-mono)] transition-transform group-hover:scale-105">
              A
            </div>
            <div className="hidden sm:block">
              <span className="block font-[family-name:var(--font-display)] text-lg tracking-tight text-[var(--atlas-fg)]">Atlas</span>
              <span className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[var(--atlas-muted)]">FBLA network</span>
            </div>
          </Link>

          {isAuthenticated && (
            <form onSubmit={handleSearch} className="hidden max-w-md flex-1 md:block">
              <div className="relative">
                <MagnifyingGlass size={15} weight="regular" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--atlas-muted)]" />
                <input
                  type="text"
                  placeholder="Search resources, people, chapters…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="atlas-input w-full py-2.5 pl-10 pr-14"
                />
                <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 border border-[var(--atlas-border)] bg-[var(--atlas-elev)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--atlas-muted)] sm:inline-flex">
                  ⌘K
                </kbd>
              </div>
            </form>
          )}

          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-0.5 lg:flex">
                  <Link to="/feed" className={navLinkClass('/feed')}>
                    <Newspaper size={15} weight="regular" /> Feed
                  </Link>
                  <Link to="/updates" className={navLinkClass('/updates')}>
                    <Terminal size={15} weight="regular" /> Log
                  </Link>
                  <Link to="/events" className={navLinkClass('/events')}>
                    <BookOpen size={15} weight="regular" /> Events
                  </Link>
                  <Link to="/connections" className={navLinkClass('/connections')}>
                    <UsersThree size={15} weight="regular" /> Network
                  </Link>
                  <Link to="/leaderboard" className={navLinkClass('/leaderboard')}>
                    <Trophy size={15} weight="regular" /> Board
                  </Link>
                </div>

                <Link to="/messages" className={iconBtn('/messages')} aria-label="Messages">
                  <ChatCircle size={18} weight="regular" />
                </Link>
                <Link to="/notifications" className={iconBtn('/notifications')} aria-label="Notifications">
                  <Bell size={18} weight="regular" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center border border-[var(--atlas-bg)] bg-red-600 px-1 font-[family-name:var(--font-mono)] text-[10px] font-bold text-white">
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/upload"
                    className="ml-1 flex items-center gap-2 rounded-full border border-[var(--atlas-fg)] bg-[var(--atlas-fg)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--atlas-bg)] transition-transform hover:-translate-y-0.5"
                  >
                    <Plus size={16} weight="bold" />
                    <span className="hidden sm:inline">Upload</span>
                  </Link>
                </motion.div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-full border border-transparent py-1.5 pl-1.5 pr-2 transition-colors hover:border-[var(--atlas-border)] hover:bg-[var(--atlas-elev)]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--atlas-border)] bg-[var(--atlas-elev)] text-sm font-semibold text-[var(--atlas-fg)] font-[family-name:var(--font-mono)]">
                      {user?.name?.charAt(0)}
                    </div>
                    <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <CaretDown size={14} weight="bold" className="text-[var(--atlas-muted)]" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute right-0 top-full z-50 mt-2 w-64 border border-[var(--atlas-border)] bg-[var(--atlas-surface)] p-2 shadow-[6px_6px_0_rgba(0,0,0,0.12)] dark:shadow-[6px_6px_0_rgba(0,0,0,0.45)]"
                        >
                          <div className="mb-2 px-3 py-2">
                            <p className="text-sm font-semibold text-[var(--atlas-fg)]">{user?.name}</p>
                            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--atlas-muted)]">{chapter?.name}</p>
                            {user?.isAdvisor ? (
                              <span className="mt-2 inline-block border border-[var(--atlas-gold)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--atlas-gold)]">
                                Advisor
                              </span>
                            ) : user?.role === 'officer' ? (
                              <span className="mt-2 inline-block border border-[var(--atlas-accent)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--atlas-accent)]">
                                Officer
                              </span>
                            ) : null}
                          </div>
                          <div className="my-2 border-t border-[var(--atlas-border)]" />
                          {[
                            ['/dashboard', <SquaresFour size={16} weight="regular" />, 'Dashboard'],
                            [`/profile/${currentProfile?.id ?? 'me'}`, <UsersThree size={16} weight="regular" />, 'My profile'],
                            ['/feed', <Newspaper size={16} weight="regular" />, 'Feed'],
                            ['/connections', <UsersThree size={16} weight="regular" />, 'My network'],
                            ['/messages', <ChatCircle size={16} weight="regular" />, 'Messages'],
                            ['/notifications', <Bell size={16} weight="regular" />, 'Notifications'],
                            ['/my-uploads', <FolderOpen size={16} weight="regular" />, 'My uploads'],
                          ].map(([to, icon, label]) => (
                            <Link
                              key={to}
                              to={to}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--atlas-fg)] transition-colors hover:bg-[rgba(109,158,168,0.1)]"
                            >
                              {icon} {label}
                            </Link>
                          ))}
                          {(user?.isAdvisor || user?.role === 'officer') && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--atlas-fg)] transition-colors hover:bg-[rgba(109,158,168,0.1)]"
                            >
                              <Shield size={16} weight="regular" /> Management
                            </Link>
                          )}
                          <div className="my-2 border-t border-[var(--atlas-border)]" />
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-500/10"
                          >
                            <SignOut size={16} weight="regular" /> Sign out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="rounded-full border border-transparent p-2.5 text-[var(--atlas-muted)] transition-colors hover:border-[var(--atlas-border)] hover:bg-[var(--atlas-elev)] lg:hidden"
                >
                  {mobileMenuOpen ? <X size={20} weight="regular" /> : <List size={20} weight="regular" />}
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--atlas-muted)] transition-colors hover:text-[var(--atlas-fg)]"
                >
                  Log in
                </Link>
                <Link
                  to="/signup/student"
                  className="rounded-full border border-[var(--atlas-fg)] bg-[var(--atlas-fg)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--atlas-bg)] transition-transform hover:-translate-y-0.5"
                >
                  Join Atlas
                </Link>
              </>
            )}
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && isAuthenticated && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden lg:hidden"
            >
              <div className="space-y-1 border-t border-[var(--atlas-border)] py-3">
                <form onSubmit={handleSearch} className="mb-3 md:hidden">
                  <div className="relative">
                    <MagnifyingGlass size={15} weight="regular" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--atlas-muted)]" />
                    <input
                      type="text"
                      placeholder="Search…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="atlas-input w-full py-2.5 pl-10 pr-4"
                    />
                  </div>
                </form>
                {[
                  ['/feed', <Newspaper size={16} weight="regular" />, 'Feed'],
                  ['/updates', <Terminal size={16} weight="regular" />, 'System Log'],
                  ['/events', <BookOpen size={16} weight="regular" />, 'Events'],
                  ['/connections', <UsersThree size={16} weight="regular" />, 'Network'],
                  ['/leaderboard', <Trophy size={16} weight="regular" />, 'Leaderboard'],
                  ['/messages', <ChatCircle size={16} weight="regular" />, 'Messages'],
                  ['/notifications', <Bell size={16} weight="regular" />, 'Notifications'],
                ].map(([to, icon, label]) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--atlas-fg)] transition-colors hover:bg-[rgba(109,158,168,0.08)]"
                  >
                    {icon} {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
