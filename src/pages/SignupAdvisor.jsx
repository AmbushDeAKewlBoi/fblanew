import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';
import SelectDropdown from '../components/SelectDropdown';
import PageTransition from '../components/PageTransition';

const REGIONS = ['Shenandoah', 'Northern', 'Central', 'Southwest', 'Tidewater', 'Piedmont'];
const STATES = ['Virginia'];

export default function SignupAdvisor() {
  const [form, setForm] = useState({ schoolName: '', region: '', state: '' });
  const [error, setError] = useState('');
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    setError('');
    if (!form.schoolName || !form.region || !form.state) {
      setError('Please fill in all fields.');
      return;
    }
    const stateCode = form.state.substring(0, 2).toUpperCase();
    const regionCode = form.region.substring(0, 4).toUpperCase();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    const key = `${stateCode}-${regionCode}-${random}`;

    const result = await loginWithGoogle({
      isAdvisor: true,
      chapterId: 1,
      schoolName: form.schoolName,
      region: form.region,
      state: form.state,
      generatedKey: key,
    });
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-1/4 right-1/3 h-72 w-72 rounded-full bg-gold-400/5 blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-navy-400/5 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="card-surface p-8 sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-300/20">
                <Shield size={28} className="text-gold-500" />
              </div>
              <h1 className="text-2xl font-bold text-warm-900 dark:text-white">Register Your Chapter</h1>
              <p className="mt-2 text-sm text-warm-500 dark:text-warm-400">Set up your school's FBLA Hub presence</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl bg-danger-light p-4 text-sm text-danger dark:bg-danger/10"
              >{error}</motion.div>
            )}

            <div className="space-y-5">
              {/* School Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-warm-700 dark:text-warm-300">School Name</label>
                <input
                  type="text"
                  value={form.schoolName}
                  onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                  placeholder="Independence High School"
                  className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3.5 text-sm text-warm-900 placeholder:text-warm-400 transition-all duration-200 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-400/20 dark:border-warm-700 dark:bg-warm-900 dark:text-warm-100 dark:focus:border-navy-500"
                />
              </div>

              {/* Region & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-warm-700 dark:text-warm-300">Region</label>
                  <SelectDropdown
                    value={form.region}
                    onChange={(val) => setForm({ ...form, region: val })}
                    options={REGIONS}
                    placeholder="Region..."
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-warm-700 dark:text-warm-300">State</label>
                  <SelectDropdown
                    value={form.state}
                    onChange={(val) => setForm({ ...form, state: val })}
                    options={STATES}
                    placeholder="State..."
                  />
                </div>
              </div>

              {/* Google Sign Up */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleGoogleSignup}
                className="mt-2 flex w-full items-center justify-center gap-3 rounded-xl border border-warm-200 bg-white px-6 py-3.5 text-sm font-semibold text-warm-700 shadow-sm transition-all duration-200 hover:border-warm-300 hover:shadow-md dark:border-warm-700 dark:bg-warm-800 dark:text-warm-200 dark:hover:border-warm-600"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Sign in with Google to Register
              </motion.button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-warm-500 dark:text-warm-400">
                <Link to="/login" className="font-semibold text-navy-700 hover:text-navy-600 dark:text-navy-400 transition-colors">Sign in</Link>
                {' · '}
                <Link to="/signup/student" className="font-semibold text-navy-700 hover:text-navy-600 dark:text-navy-400 transition-colors">Join as Student</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
