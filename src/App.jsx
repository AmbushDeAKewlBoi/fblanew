import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import PageGears from './components/PageGears';

// Eager: top of funnel + the most likely first-visit page.
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Lazy: everything else is split into its own chunk.
const SignupStudent     = lazy(() => import('./pages/SignupStudent'));
const SignupAdvisor     = lazy(() => import('./pages/SignupAdvisor'));
const Feed              = lazy(() => import('./pages/Feed'));
const Connections       = lazy(() => import('./pages/Connections'));
const Events            = lazy(() => import('./pages/Events'));
const EventDetail       = lazy(() => import('./pages/EventDetail'));
const Upload            = lazy(() => import('./pages/Upload'));
const ResourceDetail    = lazy(() => import('./pages/ResourceDetail'));
const MyUploads         = lazy(() => import('./pages/MyUploads'));
const Leaderboard       = lazy(() => import('./pages/Leaderboard'));
const Messages          = lazy(() => import('./pages/Messages'));
const Notifications     = lazy(() => import('./pages/Notifications'));
const Profile           = lazy(() => import('./pages/Profile'));
const Search            = lazy(() => import('./pages/Search'));
const AdminDashboard    = lazy(() => import('./pages/AdminDashboard'));
const Changelog         = lazy(() => import('./pages/Changelog'));

function LegalPage({ type }) {
  const isPrivacy = type === 'privacy';
  return (
    <div className="atlas-page">
      <section className="atlas-hero">
        <div className="relative z-10 max-w-3xl space-y-4">
          <p className="atlas-kicker">Atlas policy</p>
          <h1 className="text-4xl leading-[1.05]">{isPrivacy ? 'Privacy notice' : 'Terms of service'}</h1>
          <p className="max-w-[62ch] text-[15px] leading-relaxed text-[var(--atlas-muted)]">
            {isPrivacy
              ? 'Atlas stores the profile, chapter, resource, and activity information needed to run an FBLA study network. Chapter advisors can review member activity for safety and moderation.'
              : 'Use Atlas for lawful school and FBLA preparation work. Do not upload copyrighted material you cannot share, harass other members, or bypass advisor moderation controls.'}
          </p>
          <Link to="/" className="atlas-btn atlas-btn-primary">Back to Atlas</Link>
        </div>
      </section>
    </div>
  );
}

function NotFound() {
  return (
    <div className="atlas-page">
      <section className="atlas-hero">
        <div className="relative z-10 max-w-2xl space-y-4">
          <p className="atlas-kicker">404</p>
          <h1 className="text-4xl leading-[1.05]">This page is not in the binder.</h1>
          <p className="max-w-[60ch] text-[15px] leading-relaxed text-[var(--atlas-muted)]">
            The link may be old, or the resource may have moved. Head back to the main Atlas workspace.
          </p>
          <Link to="/" className="atlas-btn atlas-btn-primary">Return home</Link>
        </div>
      </section>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, user, logout } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.status === 'banned') {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
        <div className="card-surface mx-auto max-w-lg p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
            <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="mb-4 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--atlas-fg)]">Account Suspended</h1>
          <p className="mb-8 text-sm leading-relaxed text-[var(--atlas-muted)]">
            Your access to this chapter has been revoked by an administrator due to a violation of community guidelines. You can no longer access the platform.
          </p>
          <button type="button" onClick={logout} className="atlas-btn atlas-btn-ghost w-full">Sign Out</button>
        </div>
      </div>
    );
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function getGearVariant(pathname) {
  if (pathname === '/' || pathname === '') return null;
  if (pathname.includes('events')) return 'events';
  if (pathname.includes('upload') || pathname.includes('my-uploads')) return 'upload';
  if (pathname.includes('leaderboard')) return 'leaderboard';
  if (
    pathname.includes('dashboard') ||
    pathname.includes('feed') ||
    pathname.includes('updates') ||
    pathname.includes('connections') ||
    pathname.includes('profile') ||
    pathname.includes('messages') ||
    pathname.includes('notifications') ||
    pathname.includes('admin')
  ) {
    return 'dashboard';
  }
  return 'default';
}

function RouteFallback() {
  return (
    <div className="atlas-page" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page</span>
      <div className="space-y-4">
        <div className="skeleton h-10 w-72" />
        <div className="skeleton h-4 w-96" />
        <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-40" />)}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('atlas-dark-mode') ?? localStorage.getItem('fbla-dark-mode');
      if (saved !== null) return saved === 'true';
      return true;
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('atlas-dark-mode', darkMode);
  }, [darkMode]);

  const gearVariant = useMemo(() => getGearVariant(location.pathname), [location.pathname]);

  return (
    <div className="min-h-[100dvh] text-[var(--atlas-fg)] transition-colors duration-300">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--atlas-elev)] focus:px-3 focus:py-2 focus:font-[family-name:var(--font-mono)] focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.18em] focus:text-[var(--atlas-fg)] focus:shadow">
        Skip to content
      </a>

      <AnimatePresence mode="wait">
        {gearVariant && <PageGears key={gearVariant} variant={gearVariant} />}
      </AnimatePresence>

      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main id="main-content" className="overflow-x-hidden w-full max-w-full">
          <AnimatePresence mode="wait">
            <Suspense key={location.pathname} fallback={<RouteFallback />}>
              <Routes location={location}>
                <Route path="/" element={<Landing />} />
                <Route path="/privacy" element={<LegalPage type="privacy" />} />
                <Route path="/terms" element={<LegalPage type="terms" />} />
                <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                <Route path="/signup/student" element={<PublicOnlyRoute><SignupStudent /></PublicOnlyRoute>} />
                <Route path="/signup/advisor" element={<PublicOnlyRoute><SignupAdvisor /></PublicOnlyRoute>} />

                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
                <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
                <Route path="/profile/:profileId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                <Route path="/events/:slug" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                <Route path="/resource/:id" element={<ProtectedRoute><ResourceDetail /></ProtectedRoute>} />
                <Route path="/my-uploads" element={<ProtectedRoute><MyUploads /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/updates" element={<ProtectedRoute><Changelog /></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
