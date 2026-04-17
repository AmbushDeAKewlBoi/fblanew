import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

export default function Login() {
  const [error, setError] = useState('');
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    const result = await loginWithGoogle();
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <div className="card-surface p-8 sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border-2 border-[var(--atlas-accent)] bg-[var(--atlas-surface)] text-xl font-bold text-[var(--atlas-fg)] font-[family-name:var(--font-mono)]">
                A
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight text-[var(--atlas-fg)]">Welcome back</h1>
              <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--atlas-muted)]">Sign in to Atlas</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 border border-red-500/40 bg-red-500/10 p-4 font-[family-name:var(--font-mono)] text-xs text-red-600 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 border border-[var(--atlas-border)] bg-[var(--atlas-elev)] px-6 py-3.5 text-sm font-semibold text-[var(--atlas-fg)] transition-colors hover:border-[var(--atlas-accent)]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </motion.button>

            <div className="mt-8 space-y-3 text-center">
              <p className="text-sm text-[var(--atlas-muted)]">
                Don&apos;t have an account?{' '}
                <Link to="/signup/student" className="font-semibold text-[var(--atlas-accent)] underline-offset-4 hover:underline">
                  Sign up as a student
                </Link>
              </p>
              <p className="text-sm text-[var(--atlas-muted)]">
                <Link to="/signup/advisor" className="font-medium text-[var(--atlas-fg)] hover:text-[var(--atlas-accent)]">
                  Register as an advisor →
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
