import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  Search, Plus, Trophy, LayoutDashboard,
  LogOut, ChevronDown, Menu, X, Sun, Moon,
  FolderOpen, Shield, BookOpen
} from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode }) {
  const { user, isAuthenticated, logout, chapter } = useAuth();
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
    `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-navy-800/10 text-navy-800 dark:bg-navy-400/15 dark:text-navy-300'
        : 'text-warm-600 hover:text-warm-900 hover:bg-warm-100/80 dark:text-warm-400 dark:hover:text-warm-200 dark:hover:bg-warm-800/60'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-warm-200/60 dark:border-warm-800/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden transition-transform duration-200 group-hover:scale-105">
              <img src="/logo.png" alt="FBLA Hub" className="h-9 w-9 object-contain" />
            </div>
            <span className="text-lg font-bold tracking-tight text-navy-800 dark:text-navy-200 hidden sm:block font-[var(--font-display)]">
              FBLA Hub
            </span>
          </Link>

          {/* Search Bar */}
          {isAuthenticated && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
              <div className="relative group">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 transition-colors group-focus-within:text-navy-500" />
                <input
                  type="text"
                  placeholder="Search resources, events, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-warm-200/80 bg-warm-50/80 py-2.5 pl-10 pr-4 text-sm text-warm-900 placeholder:text-warm-400 transition-all duration-200 focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-400/20 dark:border-warm-700/60 dark:bg-warm-900/60 dark:text-warm-100 dark:placeholder:text-warm-500 dark:focus:border-navy-500 dark:focus:bg-warm-800 dark:focus:ring-navy-500/20"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden items-center gap-0.5 rounded-md border border-warm-200 bg-warm-100 px-1.5 py-0.5 text-[10px] font-medium text-warm-400 sm:inline-flex dark:border-warm-700 dark:bg-warm-800 dark:text-warm-500">
                  ⌘K
                </kbd>
              </div>
            </form>
          )}

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {isAuthenticated ? (
              <>
                {/* Nav links — desktop */}
                <div className="hidden lg:flex items-center gap-0.5">
                  <Link to="/events" className={navLinkClass('/events')}>
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={15} /> Events
                    </span>
                  </Link>
                  <Link to="/leaderboard" className={navLinkClass('/leaderboard')}>
                    <span className="flex items-center gap-1.5">
                      <Trophy size={15} /> Leaderboard
                    </span>
                  </Link>
                </div>

                {/* Upload button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/upload"
                    className="ml-1 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-navy-800 to-navy-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:from-navy-700 hover:to-navy-600 dark:from-navy-600 dark:to-navy-500 dark:hover:from-navy-500 dark:hover:to-navy-400"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    <span className="hidden sm:inline">Upload</span>
                  </Link>
                </motion.div>

                {/* Dark mode toggle */}
                <motion.button
                  whileTap={{ scale: 0.9, rotate: 15 }}
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-xl text-warm-500 hover:text-warm-700 hover:bg-warm-100/80 dark:text-warm-400 dark:hover:text-warm-200 dark:hover:bg-warm-800/60 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={darkMode ? 'sun' : 'moon'}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-3 hover:bg-warm-100/80 dark:hover:bg-warm-800/60 transition-all duration-200"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-navy-600 to-navy-800 text-white text-sm font-semibold shadow-sm">
                      {user?.name?.charAt(0)}
                    </div>
                    <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} className="text-warm-400" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-warm-200/80 bg-white p-2 shadow-xl shadow-warm-900/5 z-50 dark:border-warm-700/60 dark:bg-warm-900"
                        >
                          <div className="px-3 py-2.5 mb-1">
                            <p className="text-sm font-semibold text-warm-900 dark:text-warm-100">{user?.name}</p>
                            <p className="text-xs text-warm-500 dark:text-warm-400">{chapter?.name}</p>
                            {user?.isAdvisor && (
                              <span className="mt-1.5 inline-block rounded-full bg-gradient-to-r from-gold-400/20 to-gold-300/20 px-2.5 py-0.5 text-xs font-semibold text-gold-500 dark:text-gold-400">
                                Advisor
                              </span>
                            )}
                          </div>
                          <div className="border-t border-warm-100 dark:border-warm-800 my-1" />
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-warm-700 hover:bg-warm-50 transition-colors dark:text-warm-300 dark:hover:bg-warm-800"
                          >
                            <LayoutDashboard size={16} /> Dashboard
                          </Link>
                          <Link
                            to="/my-uploads"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-warm-700 hover:bg-warm-50 transition-colors dark:text-warm-300 dark:hover:bg-warm-800"
                          >
                            <FolderOpen size={16} /> My Uploads
                          </Link>
                          {user?.isAdvisor && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-warm-700 hover:bg-warm-50 transition-colors dark:text-warm-300 dark:hover:bg-warm-800"
                            >
                              <Shield size={16} /> Admin Panel
                            </Link>
                          )}
                          <div className="border-t border-warm-100 dark:border-warm-800 my-1" />
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-danger hover:bg-danger-light transition-colors dark:hover:bg-danger/10"
                          >
                            <LogOut size={16} /> Sign out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile menu toggle */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2.5 rounded-xl text-warm-500 hover:bg-warm-100/80 dark:hover:bg-warm-800/60 transition-colors"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mobileMenuOpen ? 'close' : 'open'}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileTap={{ scale: 0.9, rotate: 15 }}
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-xl text-warm-500 hover:text-warm-700 hover:bg-warm-100/80 dark:text-warm-400 dark:hover:text-warm-200 dark:hover:bg-warm-800/60 transition-colors"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-warm-700 hover:text-warm-900 dark:text-warm-300 dark:hover:text-warm-100 transition-colors"
                >
                  Log in
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/signup/student"
                    className="rounded-xl bg-gradient-to-r from-navy-800 to-navy-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 dark:from-navy-600 dark:to-navy-500"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && isAuthenticated && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden"
            >
              <div className="border-t border-warm-200/60 dark:border-warm-800/60 py-3 space-y-1">
                <form onSubmit={handleSearch} className="mb-3 md:hidden">
                  <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-warm-200/80 bg-warm-50/80 py-2.5 pl-10 pr-4 text-sm dark:border-warm-700/60 dark:bg-warm-900/60 dark:text-warm-100"
                    />
                  </div>
                </form>
                <Link
                  to="/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-warm-700 hover:bg-warm-100/80 dark:text-warm-300 dark:hover:bg-warm-800/60 transition-colors"
                >
                  <BookOpen size={16} /> Events
                </Link>
                <Link
                  to="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-warm-700 hover:bg-warm-100/80 dark:text-warm-300 dark:hover:bg-warm-800/60 transition-colors"
                >
                  <Trophy size={16} /> Leaderboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
