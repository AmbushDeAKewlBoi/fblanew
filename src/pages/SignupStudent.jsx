import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { KeyRound, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function SignupStudent() {
  const [chapterKey, setChapterKey] = useState('');
  const [keyValid, setKeyValid] = useState(null);
  const [chapterLabel, setChapterLabel] = useState('');
  const [error, setError] = useState('');
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const validateKey = (key) => {
    setChapterKey(key);
    if (!key.trim()) { setKeyValid(null); setChapterLabel(''); return; }
    const upper = key.trim().toUpperCase();
    if (upper === 'VA-CENT-A1B2') {
      setKeyValid(true); setChapterLabel('Central Virginia Chapter');
    } else if (upper === 'TX-NORTH-X9Z3') {
      setKeyValid(true); setChapterLabel('North Texas Chapter');
    } else if (upper === 'CA-BAY-Q7W4') {
      setKeyValid(true); setChapterLabel('Bay Area Chapter');
    } else if (/^[A-Z]{2}-[A-Z]+-[A-Z0-9]{4}$/.test(upper)) {
      setKeyValid(true); setChapterLabel('FBLA Chapter');
    } else {
      setKeyValid(false); setChapterLabel('');
    }
  };

  const handleSignup = async () => {
    if (!chapterKey.trim() || !keyValid) { setError('Please enter a valid chapter key.'); return; }
    setError('');
    const result = await loginWithGoogle({ isAdvisor: false, chapterId: 1, chapterKey: chapterKey.trim().toUpperCase() });
    if (result.success) { navigate('/dashboard'); }
    else { setError(result.error || 'Signup failed.'); }
  };

  const fillDemo = () => validateKey('VA-CENT-A1B2');

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-navy-400/5 blur-3xl animate-blob" />
          <div className="absolute bottom-1/3 left-1/4 h-64 w-64 rounded-full bg-gold-400/5 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="card-surface p-8 sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden">
                <img src="/logo.png" alt="FBLA Hub" className="h-14 w-14 object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-warm-900 dark:text-white">Join as a Student</h1>
              <p className="mt-2 text-sm text-warm-500 dark:text-warm-400">Enter your chapter key to get started</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl bg-danger-light p-4 text-sm text-danger dark:bg-danger/10"
              >{error}</motion.div>
            )}

            {/* Chapter Key Input */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-warm-700 dark:text-warm-300">Chapter Key</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400" />
                <input
                  type="text"
                  placeholder="e.g. VA-CENT-A1B2"
                  value={chapterKey}
                  onChange={(e) => validateKey(e.target.value)}
                  className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-11 text-sm font-mono tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-warm-900 dark:text-warm-100 ${
                    keyValid === true
                      ? 'border-emerald-400 focus:ring-emerald-400/20'
                      : keyValid === false
                      ? 'border-danger focus:ring-danger/20'
                      : 'border-warm-200 focus:border-navy-400 focus:ring-navy-400/20 dark:border-warm-700'
                  }`}
                />
                {keyValid !== null && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {keyValid ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <XCircle size={18} className="text-danger" />
                    )}
                  </div>
                )}
              </div>
              {keyValid === true && chapterLabel && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ {chapterLabel}
                </motion.p>
              )}
              {keyValid === false && (
                <p className="mt-2 text-sm text-danger">Invalid key format. Ask your advisor for the chapter key.</p>
              )}
            </div>

            {/* Demo key hint */}
            <button
              onClick={fillDemo}
              className="mb-6 flex w-full items-center gap-2 rounded-xl border border-gold-300/40 bg-gold-100/40 px-4 py-3 text-sm text-gold-500 transition-colors hover:bg-gold-100/60 dark:border-gold-400/20 dark:bg-gold-400/10 dark:text-gold-400"
            >
              <Lightbulb size={14} />
              <span>Demo: Click to use <code className="font-mono font-semibold">VA-CENT-A1B2</code></span>
            </button>

            {/* Google Sign Up */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignup}
              disabled={!keyValid}
              className={`flex w-full items-center justify-center gap-3 rounded-xl px-6 py-3.5 text-sm font-semibold shadow-sm transition-all duration-200 ${
                keyValid
                  ? 'border border-warm-200 bg-white text-warm-700 hover:border-warm-300 hover:shadow-md dark:border-warm-700 dark:bg-warm-800 dark:text-warm-200'
                  : 'border border-warm-100 bg-warm-50 text-warm-400 cursor-not-allowed dark:border-warm-800 dark:bg-warm-900 dark:text-warm-600'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </motion.button>

            <div className="mt-8 text-center">
              <p className="text-sm text-warm-500 dark:text-warm-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-navy-700 hover:text-navy-600 dark:text-navy-400 transition-colors">
                  Sign in
                </Link>
              </p>
              <p className="mt-2 text-sm text-warm-500 dark:text-warm-400">
                <Link to="/signup/advisor" className="font-medium text-warm-600 hover:text-warm-700 dark:text-warm-400 transition-colors">
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
