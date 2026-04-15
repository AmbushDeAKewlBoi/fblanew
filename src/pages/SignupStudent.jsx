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
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleKeyChange = (val) => {
    setForm(prev => ({ ...prev, chapterKey: val }));
    // Mock validation
    if (val === 'VA-SHEN-X7K9M4P2') {
      setKeyValid(true);
      setKeyChapter('Independence High School');
    } else if (val === 'VA-SHEN-R3J6N8W1') {
      setKeyValid(true);
      setKeyChapter('Broad Run High School');
    } else if (val === 'VA-NRTH-T5Q2L7V9') {
      setKeyValid(true);
      setKeyChapter('Riverside High School');
    } else if (val.length >= 10) {
      setKeyValid(false);
      setKeyChapter('');
    } else {
      setKeyValid(null);
      setKeyChapter('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.chapterKey) {
      setError('Please fill in all fields.');
      return;
    }
    if (!keyValid) {
      setError('Please enter a valid chapter key.');
      return;
    }
    signup({ name: form.name, email: form.email, isAdvisor: false, chapterId: 1 });
    navigate('/dashboard');
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
