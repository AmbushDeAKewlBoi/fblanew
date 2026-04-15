import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Search, Plus, BookOpen, Trophy, LayoutDashboard,
  LogOut, User, ChevronDown, Menu, X, Sun, Moon,
  Upload, FolderOpen, Shield
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
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-warm-200 bg-white/80 backdrop-blur-md dark:bg-warm-950/80 dark:border-warm-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden">
              <img src="/logo.png" alt="FBLA Hub" className="h-9 w-9 object-contain" />
            </div>
            <span className="text-lg font-bold text-navy-800 dark:text-navy-200 hidden sm:block">
              FBLA Hub
            </span>
          </Link>

          {/* Search Bar — only when logged in */}
          {isAuthenticated && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                <input
                  type="text"
                  placeholder="Search resources, events, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-warm-200 bg-warm-50 py-2 pl-10 pr-4 text-sm text-warm-900 placeholder:text-warm-400 focus:border-navy-400 focus:bg-white focus:outline-none dark:border-warm-700 dark:bg-warm-900 dark:text-warm-100 dark:placeholder:text-warm-500 dark:focus:border-navy-500 dark:focus:bg-warm-800"
                />
              </div>
            </form>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Nav links — desktop */}
                <div className="hidden lg:flex items-center gap-1">
                  <Link
                    to="/events"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/events')
                        ? 'bg-navy-50 text-navy-800 dark:bg-navy-900/30 dark:text-navy-300'
                        : 'text-warm-600 hover:text-warm-900 hover:bg-warm-100 dark:text-warm-400 dark:hover:text-warm-200 dark:hover:bg-warm-800'
                    }`}
                  >
                    Events
                  </Link>
                  <Link
                    to="/leaderboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/leaderboard')
                        ? 'bg-navy-50 text-navy-800 dark:bg-navy-900/30 dark:text-navy-300'
                        : 'text-warm-600 hover:text-warm-900 hover:bg-warm-100 dark:text-warm-400 dark:hover:text-warm-200 dark:hover:bg-warm-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Trophy size={15} /> Leaderboard
                    </span>
                  </Link>
                </div>

                {/* Upload button */}
                <Link
                  to="/upload"
                  className="flex items-center gap-1.5 rounded-lg bg-navy-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-700 dark:bg-navy-600 dark:hover:bg-navy-500"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Upload</span>
                </Link>

                {/* Dark mode toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg text-warm-500 hover:text-warm-700 hover:bg-warm-100 dark:text-warm-400 dark:hover:text-warm-200 dark:hover:bg-warm-800 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 hover:bg-warm-100 dark:hover:bg-warm-800 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-navy-700 text-sm font-semibold dark:bg-navy-800 dark:text-navy-200">
                      {user?.name?.charAt(0)}
                    </div>
                    <ChevronDown size={14} className={`text-warm-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-warm-200 bg-white p-2 shadow-lg z-50 dark:border-warm-700 dark:bg-warm-900">
                        <div className="px-3 py-2 mb-1">
                          <p className="text-sm font-semibold text-warm-900 dark:text-warm-100">{user?.name}</p>
                          <p className="text-xs text-warm-500">{chapter?.name}</p>
                          {user?.isAdvisor && (
                            <span className="mt-1 inline-block rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-500 dark:bg-gold-500/20 dark:text-gold-400">
                              Advisor
                            </span>
                          )}
                        </div>
                        <div className="border-t border-warm-100 dark:border-warm-800 my-1" />
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-warm-700 hover:bg-warm-50 dark:text-warm-300 dark:hover:bg-warm-800"
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Link
                          to="/my-uploads"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-warm-700 hover:bg-warm-50 dark:text-warm-300 dark:hover:bg-warm-800"
                        >
                          <FolderOpen size={16} /> My Uploads
                        </Link>
                        {user?.isAdvisor && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-warm-700 hover:bg-warm-50 dark:text-warm-300 dark:hover:bg-warm-800"
                          >
                            <Shield size={16} /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-warm-100 dark:border-warm-800 my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger-light dark:hover:bg-danger/10"
                        >
                          <LogOut size={16} /> Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile menu toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg text-warm-500 hover:bg-warm-100 dark:hover:bg-warm-800"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg text-warm-500 hover:text-warm-700 hover:bg-warm-100 dark:text-warm-400 dark:hover:text-warm-200 dark:hover:bg-warm-800 transition-colors"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-warm-700 hover:text-warm-900 dark:text-warm-300 dark:hover:text-warm-100"
                >
                  Log in
                </Link>
                <Link
                  to="/signup/student"
                  className="rounded-lg bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 dark:bg-navy-600 dark:hover:bg-navy-500"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="lg:hidden border-t border-warm-200 dark:border-warm-800 py-3 space-y-1">
            <form onSubmit={handleSearch} className="mb-3 md:hidden">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-warm-200 bg-warm-50 py-2 pl-10 pr-4 text-sm dark:border-warm-700 dark:bg-warm-900 dark:text-warm-100"
                />
              </div>
            </form>
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-warm-700 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-warm-800"
            >
              Events
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-warm-700 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-warm-800"
            >
              Leaderboard
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
