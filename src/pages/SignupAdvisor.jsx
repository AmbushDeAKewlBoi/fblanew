import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Eye, EyeOff, Copy, Check } from 'lucide-react';

const REGIONS = ['Shenandoah', 'Northern', 'Central', 'Southwest', 'Tidewater', 'Piedmont'];
const STATES = ['Virginia'];

import SelectDropdown from '../components/SelectDropdown';

export default function SignupAdvisor() {
  const [form, setForm] = useState({ schoolName: '', region: '', state: '' });
  const [error, setError] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [keyCopied, setKeyCopied] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.schoolName || !form.region || !form.state) {
      setError('Please fill in all layout fields.');
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

  const continueToAppWithGoogle = async () => {
    const result = await loginWithGoogle({ 
      isAdvisor: true, 
      chapterId: 1, 
      schoolName: form.schoolName,
      region: form.region,
      state: form.state,
      generatedKey: generatedKey
    });
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
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

          {error && (
            <div className="mt-4 rounded-lg bg-danger-light p-3 text-left text-xs text-danger dark:bg-danger/10">
              {error}
            </div>
          )}

          <button
            onClick={continueToAppWithGoogle}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg border border-warm-200 bg-white py-2.5 text-sm font-medium text-warm-700 hover:bg-warm-50 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-300 dark:hover:bg-warm-700"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google to Secure Key
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
              <SelectDropdown
                value={form.region}
                onChange={(val) => setForm({ ...form, region: val })}
                options={REGIONS}
                placeholder="Region..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">State</label>
              <SelectDropdown
                value={form.state}
                onChange={(val) => setForm({ ...form, state: val })}
                options={STATES}
                placeholder="State..."
              />
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
