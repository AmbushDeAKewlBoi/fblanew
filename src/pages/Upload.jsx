import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, X, FileText, CheckCircle2, School, MapPin, Map, Globe } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { FBLA_EVENTS } from '../data/mockEvents';
import { RESOURCE_TYPES, VISIBILITY_LEVELS } from '../data/mockResources';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../config/firebase';
import SelectDropdown from '../components/SelectDropdown';
import PageTransition from '../components/PageTransition';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { formatFileSize } from '../lib/formatters';

const VIS_ICONS = { school: School, mapPin: MapPin, map: Map, globe: Globe };

export default function Upload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '', description: '', event: '', resourceType: '',
    tags: [], visibilityLevel: 'region', isAnonymous: true,
  });
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (form.tags.length >= 10) return;
      if (!form.tags.includes(tagInput.trim())) {
        setForm({ ...form, tags: [...form.tags, tagInput.trim().toLowerCase()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.event || !form.resourceType || !file) {
      setError('Please fill in all required fields and upload a file.');
      return;
    }
    if (!user) {
      setError('You must be logged in to upload.');
      return;
    }

    setUploading(true);
    try {
      const extension = file.name.split('.').pop();
      const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
      const storageRef = ref(storage, `resources/${user.id}/${filename}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const newResource = {
        title: form.title,
        description: form.description,
        event: form.event,
        resourceType: form.resourceType,
        tags: form.tags,
        visibilityLevel: form.visibilityLevel,
        isAnonymous: form.isAnonymous,
        uploaderId: user.id,
        chapterId: user.chapterId || 1,
        fileExtension: `.${extension}`,
        fileSizeBytes: file.size,
        downloadUrl: downloadURL,
        upvoteCount: 0,
        downloadCount: 0,
        viewCount: 0,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'resources'), newResource);
      setSubmitted(true);
    } catch (err) {
      console.error('Upload error details:', err);
      if (err.code === 'storage/unauthorized') {
        setError('You do not have permission to upload to storage. Check Firebase rules.');
      } else if (err.code === 'storage/quota-exceeded') {
        setError('Storage quota exceeded.');
      } else if (err.message && err.message.includes('permission-denied')) {
        setError('Firestore permission denied. Ensure you are logged in correctly.');
      } else {
        setError(`Failed to upload: ${err.message || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <PageTransition>
        <div className="atlas-page mx-auto max-w-lg">
          <EmptyState
            icon={<CheckCircle2 size={20} className="text-emerald-500" />}
            title="Resource uploaded"
            description={`"${form.title}" is now available to your ${form.visibilityLevel === 'school' ? 'chapter' : form.visibilityLevel}.`}
            action={(
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ title: '', description: '', event: '', resourceType: '', tags: [], visibilityLevel: 'region', isAnonymous: true });
                    setFile(null);
                  }}
                  className="atlas-btn atlas-btn-ghost"
                >
                  Upload another
                </button>
                <button
                  onClick={() => navigate('/my-uploads')}
                  className="atlas-btn atlas-btn-primary"
                >
                  View my uploads
                </button>
              </div>
            )}
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="atlas-page mx-auto max-w-2xl">
        <PageHeader
          kicker="Upload"
          title="Share a resource"
          subtitle="Push study materials into the Atlas library so the rest of your chapter can build on them."
        />

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="border-l-2 border-red-500 bg-red-500/10 p-4 text-sm font-medium text-red-700 dark:text-red-300"
              style={{ borderRadius: 2 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-8 text-center transition-colors ${
              dragOver
                ? 'border-[var(--atlas-accent)] bg-[rgba(61,109,118,0.08)]'
                : file
                ? 'border-emerald-500/55 bg-emerald-500/8'
                : 'border-[var(--atlas-border)] bg-[var(--atlas-surface)] hover:border-[var(--atlas-accent)]/55'
            }`}
            style={{ borderRadius: 2 }}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border-2 border-emerald-500/55 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" style={{ borderRadius: 2 }}>
                  <FileText size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--atlas-fg)]">{file.name}</p>
                  <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  aria-label="Remove file"
                  className="ml-2 border-2 border-transparent p-1.5 text-[var(--atlas-muted)] transition-colors hover:border-[var(--atlas-border)] hover:text-[var(--atlas-fg)]"
                  style={{ borderRadius: 2 }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border-2 border-[var(--atlas-border)] text-[var(--atlas-accent)]" style={{ borderRadius: 2 }}>
                  <UploadIcon size={20} />
                </div>
                <p className="text-sm font-semibold text-[var(--atlas-fg)]">Drag and drop your file here</p>
                <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
                  PDF · PPTX · DOCX · PNG · JPG · TXT — Max 25MB
                </p>
                <label className="atlas-btn atlas-btn-primary mt-5 cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.pptx,.ppt,.docx,.doc,.png,.jpg,.jpeg,.txt"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  Browse files
                </label>
              </>
            )}
          </motion.div>

          <div>
            <label htmlFor="upload-title" className="atlas-kicker mb-2 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="upload-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="MIS Database Normalization Cheatsheet"
              maxLength={200}
              className="atlas-input"
            />
            <p className="mt-1 text-right font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
              {form.title.length}/200
            </p>
          </div>

          <div>
            <label htmlFor="upload-desc" className="atlas-kicker mb-2 block">Description</label>
            <textarea
              id="upload-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does this resource cover? Any tips for using it?"
              maxLength={2000}
              rows={3}
              className="atlas-textarea"
            />
            <p className="mt-1 text-right font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-muted)]">
              {form.description.length}/2000
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="atlas-kicker mb-2 block">
                Event <span className="text-red-500">*</span>
              </label>
              <SelectDropdown
                value={form.event}
                onChange={(val) => setForm({ ...form, event: val })}
                options={FBLA_EVENTS}
                placeholder="Select event..."
                searchable
              />
            </div>
            <div>
              <label className="atlas-kicker mb-2 block">
                Resource type <span className="text-red-500">*</span>
              </label>
              <SelectDropdown
                value={form.resourceType}
                onChange={(val) => setForm({ ...form, resourceType: val })}
                options={RESOURCE_TYPES}
                placeholder="Select type..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="upload-tags" className="atlas-kicker mb-2 block">
              Tags <span className="text-[var(--atlas-muted)] normal-case tracking-normal">(max 10, press Enter to add)</span>
            </label>
            {form.tags.length > 0 ? (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {form.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="atlas-chip atlas-chip-active"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag}`}
                      className="ml-1 text-[var(--atlas-muted)] hover:text-[var(--atlas-fg)]"
                    >
                      <X size={11} />
                    </button>
                  </motion.span>
                ))}
              </div>
            ) : null}
            <input
              id="upload-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={form.tags.length >= 10 ? 'Max tags reached' : 'Add a tag...'}
              disabled={form.tags.length >= 10}
              className="atlas-input disabled:opacity-50"
            />
          </div>

          <div>
            <span className="atlas-kicker mb-3 block">
              Visibility <span className="text-red-500">*</span>
            </span>
            <div role="radiogroup" aria-label="Visibility level" className="grid gap-3 sm:grid-cols-2">
              {VISIBILITY_LEVELS.map((vis) => {
                const Icon = VIS_ICONS[vis.iconName] || Globe;
                const selected = form.visibilityLevel === vis.value;
                return (
                  <motion.button
                    key={vis.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setForm({ ...form, visibilityLevel: vis.value })}
                    className={`flex items-start gap-3 border-2 p-4 text-left transition ${
                      selected
                        ? 'border-[var(--atlas-accent)] bg-[rgba(61,109,118,0.08)] dark:bg-[rgba(109,158,168,0.12)]'
                        : 'border-[var(--atlas-border)] bg-[var(--atlas-surface)] hover:border-[var(--atlas-accent)]/55'
                    }`}
                    style={{ borderRadius: 2 }}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center border ${
                        selected
                          ? 'border-[var(--atlas-accent)] text-[var(--atlas-accent)]'
                          : 'border-[var(--atlas-border)] text-[var(--atlas-muted)]'
                      }`}
                      style={{ borderRadius: 2 }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--atlas-fg)]">{vis.label}</p>
                      <p className="text-xs text-[var(--atlas-muted)]">{vis.description}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <label className="atlas-panel flex cursor-pointer items-center gap-3 p-4 transition-colors hover:border-[var(--atlas-accent)]/55">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.isAnonymous}
                onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                className="peer sr-only"
              />
              <div className="h-6 w-11 border border-[var(--atlas-border)] bg-[var(--atlas-surface)] transition-colors peer-checked:border-[var(--atlas-accent)] peer-checked:bg-[rgba(61,109,118,0.20)]" style={{ borderRadius: 2 }} />
              <div className="absolute left-0.5 top-0.5 h-5 w-5 bg-[var(--atlas-fg)] transition-transform peer-checked:translate-x-5" style={{ borderRadius: 2 }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--atlas-fg)]">Upload anonymously</p>
              <p className="text-xs text-[var(--atlas-muted)]">Your name won't be shown to other users.</p>
            </div>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="atlas-btn atlas-btn-ghost">
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={uploading}
              whileTap={{ scale: 0.98 }}
              className="atlas-btn atlas-btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? 'Uploading securely...' : 'Upload resource'}
            </motion.button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
