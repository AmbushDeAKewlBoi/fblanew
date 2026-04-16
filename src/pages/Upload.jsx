import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X, FileText, CheckCircle2, School, MapPin, Map, Globe } from 'lucide-react';
import { FBLA_EVENTS } from '../data/mockEvents';
import { RESOURCE_TYPES, VISIBILITY_LEVELS } from '../data/mockResources';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import SelectDropdown from '../components/SelectDropdown';

export default function Upload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    event: '',
    resourceType: '',
    tags: [],
    visibilityLevel: 'region',
    isAnonymous: true,
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

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.event || !form.resourceType || !file) {
      console.log('Form validation failed:', { title: form.title, event: form.event, rootType: form.resourceType, file });
      setError('Please fill in all required fields and upload a file.');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to upload.');
      return;
    }

    setUploading(true);
    
    try {
      // 1. Create storage reference
      const extension = file.name.split('.').pop();
      const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
      const storageRef = ref(storage, `resources/${user.id}/${filename}`);
      
      // 2. Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // 3. Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // 4. Save metadata to Firestore
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
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'resources'), newResource);
      setSubmitted(true);
    } catch (err) {
      console.error('Firebase upload error:', err);
      // Give a more descriptive error if it's a permission issue or bucket error
      if (err.code === 'storage/unauthorized' || err.code === 'permission-denied') {
        setError('Permission denied by Firebase. Check your Firebase Storage/Firestore rules!');
      } else if (err.code === 'storage/bucket-not-found') {
        setError('Firebase Storage is not enabled. Please enable Storage in your Firebase console.');
      } else {
        setError(`Failed to upload file: ${err.message || 'Please try again.'}`);
      }
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-light text-success dark:bg-success/20">
          <CheckCircle2 size={28} />
        </div>
        <h1 className="text-xl font-bold text-warm-900 dark:text-warm-100">Resource Uploaded!</h1>
        <p className="mt-2 text-sm text-warm-500 dark:text-warm-400">
          Your resource "{form.title}" is now available to your {form.visibilityLevel === 'school' ? 'chapter' : form.visibilityLevel}.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => { setSubmitted(false); setForm({ title: '', description: '', event: '', resourceType: '', tags: [], visibilityLevel: 'region', isAnonymous: true }); setFile(null); }}
            className="rounded-lg border border-warm-200 px-5 py-2.5 text-sm font-medium text-warm-700 hover:bg-warm-100 dark:border-warm-700 dark:text-warm-300"
          >
            Upload Another
          </button>
          <button
            onClick={() => navigate('/my-uploads')}
            className="rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 dark:bg-navy-600"
          >
            View My Uploads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-warm-900 dark:text-warm-100">Upload Resource</h1>
        <p className="mt-1 text-sm text-warm-500 dark:text-warm-400">
          Share study materials with your community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* File upload */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            dragOver
              ? 'border-navy-400 bg-navy-50 dark:border-navy-500 dark:bg-navy-900/20'
              : file
              ? 'border-success bg-success-light dark:border-success dark:bg-success/10'
              : 'border-warm-200 bg-warm-50 dark:border-warm-700 dark:bg-warm-800/50'
          }`}
        >
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText size={24} className="text-success" />
              <div className="text-left">
                <p className="text-sm font-medium text-warm-900 dark:text-warm-100">{file.name}</p>
                <p className="text-xs text-warm-500">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="ml-2 rounded-md p-1 text-warm-400 hover:bg-warm-200 hover:text-warm-600 dark:hover:bg-warm-700"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <UploadIcon size={32} className="mx-auto mb-3 text-warm-400" />
              <p className="text-sm font-medium text-warm-700 dark:text-warm-300">
                Drag and drop your file here
              </p>
              <p className="mt-1 text-xs text-warm-400">PDF, PPTX, DOCX, PNG, JPG, TXT — Max 25MB</p>
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-warm-200 bg-white px-4 py-2 text-sm font-medium text-warm-700 hover:bg-warm-50 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-300">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.pptx,.ppt,.docx,.doc,.png,.jpg,.jpeg,.txt"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                Browse Files
              </label>
            </>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">
            Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="MIS Database Normalization Cheatsheet"
            maxLength={200}
            className="w-full rounded-lg border border-warm-200 bg-white px-3.5 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
          />
          <p className="mt-1 text-right text-xs text-warm-400">{form.title.length}/200</p>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What does this resource cover? Any tips for using it?"
            maxLength={2000}
            rows={3}
            className="w-full resize-none rounded-lg border border-warm-200 bg-white px-3.5 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
          />
          <p className="mt-1 text-right text-xs text-warm-400">{form.description.length}/2000</p>
        </div>

        {/* Event + Type (side by side) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">
              Event <span className="text-danger">*</span>
            </label>
            <SelectDropdown
              value={form.event}
              onChange={(val) => setForm({ ...form, event: val })}
              options={FBLA_EVENTS}
              placeholder="Select event..."
              searchable={true}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">
              Resource Type <span className="text-danger">*</span>
            </label>
            <SelectDropdown
              value={form.resourceType}
              onChange={(val) => setForm({ ...form, resourceType: val })}
              options={RESOURCE_TYPES}
              placeholder="Select type..."
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700 dark:text-warm-300">
            Tags <span className="text-xs text-warm-400">(max 10, press Enter to add)</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-700 dark:bg-navy-900/30 dark:text-navy-300">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-navy-400 hover:text-navy-600">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={form.tags.length >= 10 ? 'Max tags reached' : 'Add a tag...'}
            disabled={form.tags.length >= 10}
            className="w-full rounded-lg border border-warm-200 bg-white px-3.5 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 disabled:opacity-50 dark:border-warm-700 dark:bg-warm-800 dark:text-warm-100"
          />
        </div>

        {/* Visibility */}
        <div>
          <label className="mb-3 block text-sm font-medium text-warm-700 dark:text-warm-300">
            Visibility <span className="text-danger">*</span>
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {VISIBILITY_LEVELS.map(vis => (
              <button
                key={vis.value}
                type="button"
                onClick={() => setForm({ ...form, visibilityLevel: vis.value })}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                  form.visibilityLevel === vis.value
                    ? 'border-navy-500 bg-navy-50 ring-1 ring-navy-500 dark:border-navy-400 dark:bg-navy-900/20'
                    : 'border-warm-200 bg-white hover:border-warm-300 dark:border-warm-700 dark:bg-warm-800'
                }`}
              >
                <span className="text-xl">
                  {vis.iconName === 'school' && <School size={20} />}
                  {vis.iconName === 'mapPin' && <MapPin size={20} />}
                  {vis.iconName === 'map' && <Map size={20} />}
                  {vis.iconName === 'globe' && <Globe size={20} />}
                </span>
                <div>
                  <p className="text-sm font-semibold text-warm-900 dark:text-warm-100">{vis.label}</p>
                  <p className="text-xs text-warm-500 dark:text-warm-400">{vis.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Anonymous toggle */}
        <label className="flex cursor-pointer items-center gap-3">
          <div className="relative">
            <input
              type="checkbox"
              checked={form.isAnonymous}
              onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-warm-200 peer-checked:bg-navy-600 transition-colors dark:bg-warm-700" />
            <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-warm-700 dark:text-warm-300">Upload anonymously</p>
            <p className="text-xs text-warm-400">Your name won't be shown to other users</p>
          </div>
        </label>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-danger-light p-3 text-sm font-medium text-danger dark:bg-danger/10">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-warm-200 px-5 py-2.5 text-sm font-medium text-warm-700 hover:bg-warm-100 dark:border-warm-700 dark:text-warm-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-70 dark:bg-navy-600 dark:hover:bg-navy-500 transition-colors"
          >
            {uploading ? 'Uploading securely...' : 'Upload Resource'}
          </button>
        </div>
      </form>
    </div>
  );
}
