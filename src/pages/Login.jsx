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
        {/* Background blobs */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-navy-400/5 blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-gold-400/5 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="card-surface p-8 sm:p-10">
            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden">
                <img src="/logo.png" alt="FBLA Hub" className="h-14 w-14 object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-warm-900 dark:text-white">Welcome back</h1>
              <p className="mt-2 text-sm text-warm-500 dark:text-warm-400">Sign in to your FBLA Hub account</p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl bg-danger-light p-4 text-sm text-danger dark:bg-danger/10"
              >
                {error}
              </motion.div>
            )}

            {/* Google Sign In */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-warm-200 bg-white px-6 py-3.5 text-sm font-semibold text-warm-700 shadow-sm transition-all duration-200 hover:border-warm-300 hover:shadow-md dark:border-warm-700 dark:bg-warm-800 dark:text-warm-200 dark:hover:border-warm-600"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </motion.button>

            {/* Footer links */}
            <div className="mt-8 text-center">
              <p className="text-sm text-warm-500 dark:text-warm-400">
                Don't have an account?{' '}
                <Link to="/signup/student" className="font-semibold text-navy-700 hover:text-navy-600 dark:text-navy-400 dark:hover:text-navy-300 transition-colors">
                  Sign up as a Student
                </Link>
              </p>
              <p className="mt-2 text-sm text-warm-500 dark:text-warm-400">
                <Link to="/signup/advisor" className="font-medium text-warm-600 hover:text-warm-700 dark:text-warm-400 dark:hover:text-warm-300 transition-colors">
                  Register as an Advisor →
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
