import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function SignupStudent() {
  const [form, setForm] = useState({ name: '', email: '', password: '', chapterKey: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [keyValid, setKeyValid] = useState(null);
  const [keyChapter, setKeyChapter] = useState('');
  const [error, setError] = useState('');
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleKeyChange = (val) => {
    setForm(prev => ({ ...prev, chapterKey: val }));
    // Mock validation fallback + Generative Key Validation
    if (val === 'VA-SHEN-X7K9M4P2') {
      setKeyValid(true);
      setKeyChapter('Independence High School');
    } else if (val === 'VA-SHEN-R3J6N8W1') {
      setKeyValid(true);
      setKeyChapter('Broad Run High School');
    } else if (val === 'VA-NRTH-T5Q2L7V9') {
      setKeyValid(true);
      setKeyChapter('Riverside High School');
    } else if (val.split('-').length >= 3 && val.length > 12) {
      setKeyValid(true);
      setKeyChapter('Registered Chapter');
    } else if (val.length >= 10) {
      setKeyValid(false);
      setKeyChapter('');
    } else {
      setKeyValid(null);
      setKeyChapter('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.chapterKey) {
      setError('Please fill in all fields.');
      return;
    }
    if (!keyValid) {
      setError('Please enter a valid chapter key.');
      return;
    }
    const result = await signup({ name: form.name, email: form.email, password: form.password, isAdvisor: false, chapterId: 1 });
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden">
            <img src="/logo.png" alt="FBLA Hub" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-xl font-bold text-warm-900 dark:text-warm-100">Join your chapter</h1>
          <p className="mt-1 text-sm text-warm-500 dark:text-warm-400">
            Get your chapter key from your advisor
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-danger-light p-3 text-sm text-danger dark:bg-danger/10">{error}</div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Sarah Mitchell"
              className="w-full rounded-lg border border-warm-200 bg-white px-3.5 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@school.edu"
              className="w-full rounded-lg border border-warm-200 bg-white px-3.5 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 8 characters"
                className="w-full rounded-lg border border-warm-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-warm-900 placeholder:text-warm-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">Chapter Key</label>
            <input
              type="text"
              value={form.chapterKey}
              onChange={(e) => handleKeyChange(e.target.value.toUpperCase())}
              placeholder="VA-SHEN-X7K9M4P2"
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm font-mono text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-1 dark:bg-warm-800 dark:text-warm-100 ${
                keyValid === true
                  ? 'border-success focus:border-success focus:ring-success'
                  : keyValid === false
                  ? 'border-danger focus:border-danger focus:ring-danger'
                  : 'border-warm-200 focus:border-navy-500 focus:ring-navy-500 dark:border-warm-700'
              }`}
            />
            {keyValid === true && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-success">
                <CheckCircle2 size={12} /> {keyChapter}
              </p>
            )}
            {keyValid === false && (
              <p className="mt-1.5 text-xs text-danger">Invalid chapter key</p>
            )}
            <p className="mt-1.5 text-xs text-warm-400">
              Try: <button type="button" onClick={() => handleKeyChange('VA-SHEN-X7K9M4P2')} className="font-mono text-navy-600 hover:underline dark:text-navy-400">VA-SHEN-X7K9M4P2</button>
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 dark:bg-navy-600 dark:hover:bg-navy-500"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-warm-200 dark:border-warm-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-warm-50 px-2 text-warm-400 dark:bg-[#141414]">or</span>
          </div>
        </div>

        {/* Google signup */}
        <button
          type="button"
          onClick={async () => {
            const result = await loginWithGoogle();
            if (result.success) {
              navigate('/dashboard');
            } else {
              setError(result.error);
            }
          }}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-warm-200 bg-white py-2.5 text-sm font-medium text-warm-700 hover:bg-warm-50 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-300 dark:hover:bg-warm-700"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

        <p className="mt-6 text-center text-sm text-warm-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-navy-700 hover:text-navy-600 dark:text-navy-400">Sign in</Link>
          {' · '}
          <Link to="/signup/advisor" className="font-medium text-navy-700 hover:text-navy-600 dark:text-navy-400">Register as Advisor</Link>
        </p>
      </div>
    </div>
  );
}
