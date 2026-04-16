import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import PageGears from './components/PageGears';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignupStudent from './pages/SignupStudent';
import SignupAdvisor from './pages/SignupAdvisor';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Upload from './pages/Upload';
import ResourceDetail from './pages/ResourceDetail';
import MyUploads from './pages/MyUploads';
import Leaderboard from './pages/Leaderboard';
import Search from './pages/Search';
import AdminDashboard from './pages/AdminDashboard';

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
  if (pathname === '/' || pathname === '') return null; // Landing has its own gears
  if (pathname.includes('dashboard')) return 'dashboard';
  if (pathname.includes('events')) return 'events';
  if (pathname.includes('upload') || pathname.includes('my-uploads')) return 'upload';
  if (pathname.includes('leaderboard')) return 'leaderboard';
  if (pathname.includes('admin')) return 'dashboard';
  return 'default';
}

export default function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fbla-dark-mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('fbla-dark-mode', darkMode);
  }, [darkMode]);

  const gearVariant = useMemo(() => getGearVariant(location.pathname), [location.pathname]);

  return (
    <div className="min-h-screen bg-warm-50 text-warm-950 transition-colors duration-300 dark:bg-[#111111] dark:text-[#e5e2de]">
      {/* Route-aware animated gear backdrop (not on landing — it has its own) */}
      <AnimatePresence mode="wait">
        {gearVariant && <PageGears key={gearVariant} variant={gearVariant} />}
      </AnimatePresence>

      {/* Content layer */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={<PublicOnlyRoute><Landing /></PublicOnlyRoute>} />
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/signup/student" element={<PublicOnlyRoute><SignupStudent /></PublicOnlyRoute>} />
            <Route path="/signup/advisor" element={<PublicOnlyRoute><SignupAdvisor /></PublicOnlyRoute>} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/events/:slug" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/resource/:id" element={<ProtectedRoute><ResourceDetail /></ProtectedRoute>} />
            <Route path="/my-uploads" element={<ProtectedRoute><MyUploads /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}
