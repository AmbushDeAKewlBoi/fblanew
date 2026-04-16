import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, X, FileText, CheckCircle2, School, MapPin, Map, Globe, CloudUpload } from 'lucide-react';
import { FBLA_EVENTS } from '../data/mockEvents';
import { RESOURCE_TYPES, VISIBILITY_LEVELS } from '../data/mockResources';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import SelectDropdown from '../components/SelectDropdown';
import PageTransition from '../components/PageTransition';

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

  const removeTag = (tag) => setForm({ ...form, tags: form.tags.filter(t => t !== tag) });

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error

    if (!form.title || !form.event || !form.resourceType || !file) {
      setError('Please fill in all required fields and upload a file.'); return;
    }
    if (!user) { setError('You must be logged in to upload.'); return; }
    
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
      console.error("Upload error details:", err);
      // Detailed Firebase error mapping
      if (err.code === 'storage/unauthorized') {
        setError('Error: You do not have permission to upload to storage. Check Firebase rules.');
      } else if (err.code === 'storage/quota-exceeded') {
        setError('Error: Storage quota exceeded.');
      } else if (err.message && err.message.includes('permission-denied')) {
        setError('Error: Firestore permission denied. Ensure you are logged in correctly.');
      } else {
        setError(`Failed to upload: ${err.message || 'Unknown error'}. Please try again.`);
      }
    } finally { setUploading(false); }
  };

  if (submitted) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
          </motion.div>
          <h1 className="text-xl font-bold text-warm-900 dark:text-white">Resource Uploaded!</h1>
          <p className="mt-2 text-sm text-warm-500 dark:text-warm-400">
            Your resource "{form.title}" is now available to your {form.visibilityLevel === 'school' ? 'chapter' : form.visibilityLevel}.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setSubmitted(false); setForm({ title: '', description: '', event: '', resourceType: '', tags: [], visibilityLevel: 'region', isAnonymous: true }); setFile(null); }}
              className="rounded-xl border border-warm-200 px-5 py-2.5 text-sm font-medium text-warm-700 transition-colors hover:border-warm-300 dark:border-warm-700 dark:text-warm-300"
            >Upload Another</motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/my-uploads')}
              className="rounded-xl bg-gradient-to-r from-navy-800 to-navy-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm dark:from-navy-600 dark:to-navy-500"
            >View My Uploads</motion.button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const visIcons = { school: School, mapPin: MapPin, map: Map, globe: Globe };

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 text-white shadow-lg">
              <CloudUpload size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-warm-900 dark:text-white">Upload Resource</h1>
              <p className="text-sm text-warm-500 dark:text-warm-400">Share study materials with your community</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-danger-light p-4 text-sm font-medium text-danger dark:bg-danger/10"
            >{error}</motion.div>
          )}

          {/* File upload */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
              dragOver
                ? 'border-navy-400 bg-navy-50/50 dark:border-navy-500 dark:bg-navy-900/20'
                : file
                ? 'border-emerald-400 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-900/10'
                : 'border-warm-200 bg-warm-50/50 hover:border-warm-300 dark:border-warm-700 dark:bg-warm-800/30'
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <FileText size={20} className="text-emerald-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-warm-900 dark:text-warm-100">{file.name}</p>
                  <p className="text-xs text-warm-500">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
                <button type="button" onClick={() => setFile(null)}
                  className="ml-2 rounded-lg p-1.5 text-warm-400 hover:bg-warm-200 hover:text-warm-600 dark:hover:bg-warm-700 transition-colors"
                ><X size={16} /></button>
              </div>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-warm-100 dark:bg-warm-800">
                  <UploadIcon size={24} className="text-warm-400" />
                </div>
                <p className="text-sm font-medium text-warm-700 dark:text-warm-300">Drag and drop your file here</p>
                <p className="mt-1 text-xs text-warm-400">PDF, PPTX, DOCX, PNG, JPG, TXT — Max 25MB</p>
                <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-warm-200 bg-white px-5 py-2.5 text-sm font-medium text-warm-700 transition-all duration-200 hover:border-warm-300 hover:shadow-sm dark:border-warm-700 dark:bg-warm-800 dark:text-warm-300">
                  <input type="file" className="hidden" accept=".pdf,.pptx,.ppt,.docx,.doc,.png,.jpg,.jpeg,.txt"
                    onChange={(e) => setFile(e.target.files[0])} />
                  Browse Files
                </label>
              </>
            )}
          </motion.div>

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-warm-700 dark:text-warm-300">Title <span className="text-danger">*</span></label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="MIS Database Normalization Cheatsheet" maxLength={200}
              className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-sm text-warm-900 placeholder:text-warm-400 transition-all duration-200 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-400/20 dark:border-warm-700 dark:bg-warm-900 dark:text-warm-100" />
            <p className="mt-1 text-right text-xs text-warm-400">{form.title.length}/200</p>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-warm-700 dark:text-warm-300">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does this resource cover? Any tips for using it?" maxLength={2000} rows={3}
              className="w-full resize-none rounded-xl border border-warm-200 bg-white px-4 py-3 text-sm text-warm-900 placeholder:text-warm-400 transition-all duration-200 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-400/20 dark:border-warm-700 dark:bg-warm-900 dark:text-warm-100" />
            <p className="mt-1 text-right text-xs text-warm-400">{form.description.length}/2000</p>
          </div>

          {/* Event + Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-warm-700 dark:text-warm-300">Event <span className="text-danger">*</span></label>
              <SelectDropdown value={form.event} onChange={(val) => setForm({ ...form, event: val })} options={FBLA_EVENTS} placeholder="Select event..." searchable={true} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-warm-700 dark:text-warm-300">Resource Type <span className="text-danger">*</span></label>
              <SelectDropdown value={form.resourceType} onChange={(val) => setForm({ ...form, resourceType: val })} options={RESOURCE_TYPES} placeholder="Select type..." />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-sm font-medium text-warm-700 dark:text-warm-300">
              Tags <span className="text-xs text-warm-400">(max 10, press Enter to add)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map(tag => (
                <motion.span key={tag} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-1 rounded-lg bg-navy-500/10 px-2.5 py-1 text-xs font-medium text-navy-700 dark:bg-navy-400/15 dark:text-navy-300">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-navy-400 hover:text-navy-600 transition-colors"><X size={12} /></button>
                </motion.span>
              ))}
            </div>
            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag}
              placeholder={form.tags.length >= 10 ? 'Max tags reached' : 'Add a tag...'}
              disabled={form.tags.length >= 10}
              className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-sm text-warm-900 placeholder:text-warm-400 transition-all duration-200 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-400/20 disabled:opacity-50 dark:border-warm-700 dark:bg-warm-900 dark:text-warm-100" />
          </div>

          {/* Visibility */}
          <div>
            <label className="mb-3 block text-sm font-medium text-warm-700 dark:text-warm-300">Visibility <span className="text-danger">*</span></label>
            <div className="grid gap-3 sm:grid-cols-2">
              {VISIBILITY_LEVELS.map(vis => {
                const Icon = visIcons[vis.iconName] || Globe;
                const selected = form.visibilityLevel === vis.value;
                return (
                  <motion.button key={vis.value} type="button" whileTap={{ scale: 0.98 }}
                    onClick={() => setForm({ ...form, visibilityLevel: vis.value })}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ${
                      selected
                        ? 'border-navy-500 bg-navy-500/5 ring-1 ring-navy-500/30 dark:border-navy-400 dark:bg-navy-400/10'
                        : 'border-warm-200 bg-white hover:border-warm-300 dark:border-warm-700 dark:bg-warm-800/50 dark:hover:border-warm-600'
                    }`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${selected ? 'bg-navy-500/10 text-navy-600 dark:text-navy-400' : 'bg-warm-100 text-warm-500 dark:bg-warm-800 dark:text-warm-400'}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-warm-900 dark:text-warm-100">{vis.label}</p>
                      <p className="text-xs text-warm-500 dark:text-warm-400">{vis.description}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Anonymous toggle */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-warm-100 bg-warm-50/50 p-4 transition-colors hover:bg-warm-50 dark:border-warm-800 dark:bg-warm-800/30 dark:hover:bg-warm-800/50">
            <div className="relative">
              <input type="checkbox" checked={form.isAnonymous} onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-warm-200 peer-checked:bg-navy-600 transition-colors dark:bg-warm-700" />
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-warm-700 dark:text-warm-300">Upload anonymously</p>
              <p className="text-xs text-warm-400">Your name won't be shown to other users</p>
            </div>
          </label>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="rounded-xl border border-warm-200 px-5 py-3 text-sm font-medium text-warm-700 transition-colors hover:border-warm-300 dark:border-warm-700 dark:text-warm-300"
            >Cancel</button>
            <motion.button type="submit" disabled={uploading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-xl bg-gradient-to-r from-navy-800 to-navy-700 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-70 dark:from-navy-600 dark:to-navy-500"
            >{uploading ? 'Uploading securely...' : 'Upload Resource'}</motion.button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
