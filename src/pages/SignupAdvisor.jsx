import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Eye, EyeOff, Copy, Check } from 'lucide-react';

const REGIONS = ['Shenandoah', 'Northern', 'Central', 'Southwest', 'Tidewater', 'Piedmont'];
const STATES = ['Virginia', 'Maryland', 'North Carolina', 'West Virginia', 'Pennsylvania'];

export default function SignupAdvisor() {
  const [form, setForm] = useState({ name: '', email: '', password: '', schoolName: '', region: '', state: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [keyCopied, setKeyCopied] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.schoolName || !form.region || !form.state) {
      setError('Please fill in all fields.');
      return;
    }
    // Generate mock key
    const stateCode = form.state.substring(0, 2).toUpperCase();
    const regionCode = form.region.substring(0, 4).toUpperCase();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    const key = `${stateCode}-${regionCode}-${random}`;
    setGeneratedKey(key);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const continueToApp = () => {
    signup({ name: form.name, email: form.email, isAdvisor: true, chapterId: 1 });
    navigate('/dashboard');
  };

  if (generatedKey) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-light text-success">
            <Check size={28} />
          </div>
          <h1 className="text-xl font-bold text-warm-900 dark:text-warm-100">Chapter Registered!</h1>
          <p className="mt-2 text-sm text-warm-500 dark:text-warm-400">
            Share this key with your students so they can join.
          </p>

          <div className="mt-6 rounded-xl border border-warm-200 bg-warm-50 p-4 dark:border-warm-700 dark:bg-warm-800">
            <p className="mb-2 text-xs font-medium text-warm-500 uppercase tracking-wider">Chapter Key</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-lg font-bold text-navy-800 dark:text-navy-300">{generatedKey}</code>
              <button
                onClick={copyKey}
                className="rounded-md p-1.5 text-warm-400 hover:bg-warm-200 hover:text-warm-600 dark:hover:bg-warm-700"
              >
                {keyCopied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-warning-light p-3 text-left text-xs text-warning dark:bg-warning/10">
            <strong>Save this key!</strong> Students will need it to join your chapter.
            You can regenerate it from the admin dashboard if needed.
          </div>

          <button
            onClick={continueToApp}
            className="mt-6 w-full rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 dark:bg-navy-600 dark:hover:bg-navy-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden">
            <img src="/logo.png" alt="FBLA Hub" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-xl font-bold text-warm-900 dark:text-warm-100">Register Your Chapter</h1>
          <p className="mt-1 text-sm text-warm-500 dark:text-warm-400">
            Set up your school's FBLA Hub presence
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-danger-light p-3 text-sm text-danger dark:bg-danger/10">{error}</div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">Your Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Mr. Thompson"
              className="w-full rounded-lg border border-warm-200 bg-white px-3.5 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="advisor@school.edu"
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
            <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">School Name</label>
            <input
              type="text"
              value={form.schoolName}
              onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
              placeholder="Independence High School"
              className="w-full rounded-lg border border-warm-200 bg-white px-3.5 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">Region</label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2.5 text-sm text-warm-900 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
              >
                <option value="">Select...</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">State</label>
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2.5 text-sm text-warm-900 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
              >
                <option value="">Select...</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 dark:bg-navy-600 dark:hover:bg-navy-500"
          >
            Register Chapter
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-warm-500">
          <Link to="/login" className="font-medium text-navy-700 hover:text-navy-600 dark:text-navy-400">Sign in</Link>
          {' · '}
          <Link to="/signup/student" className="font-medium text-navy-700 hover:text-navy-600 dark:text-navy-400">Join as Student</Link>
        </p>
      </div>
    </div>
  );
}
