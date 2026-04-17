import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
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
    <div className="min-h-screen text-[var(--atlas-fg)] transition-colors duration-300">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--atlas-elev)] focus:px-3 focus:py-2 focus:font-[family-name:var(--font-mono)] focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.18em] focus:text-[var(--atlas-fg)] focus:shadow">
        Skip to content
      </a>

      <AnimatePresence mode="wait">
        {gearVariant && <PageGears key={gearVariant} variant={gearVariant} />}
      </AnimatePresence>

      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main id="main-content">
          <AnimatePresence mode="wait">
            <Suspense key={location.pathname} fallback={<RouteFallback />}>
              <Routes location={location}>
                <Route path="/" element={<PublicOnlyRoute><Landing /></PublicOnlyRoute>} />
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

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
