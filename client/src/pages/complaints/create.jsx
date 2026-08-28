import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { PRIORITIES } from '../../utils/constants';
import {
  FilePlus,
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const CreateComplaintPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories?isActive=true');
        setCategories(res.data || []);
        if (res.data && res.data.length > 0) {
          setCategory(res.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected].slice(0, 5));
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !category) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('priority', priority);

      files.forEach((file) => {
        formData.append('attachments', file);
      });

      const res = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const createdComplaint = res.data;
      navigate(`/complaints/${createdComplaint._id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <FilePlus className="w-6 h-6 text-indigo-400" />
          <span>Submit a New Complaint</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Provide accurate details to ensure prompt investigation by the college administration.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Complaint Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Broken Projector in Room 302 / Library Wi-Fi connection issue"
            className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Category & Priority Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Category <span className="text-rose-400">*</span>
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Suggested Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            >
              {Object.entries(PRIORITIES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Detailed Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened, where it happened, exact block/room numbers, and any steps already taken..."
            className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-y"
          />
        </div>

        {/* Attachment Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Attachments / Photos (Optional, max 5 files, 5MB each)
          </label>
          <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl p-6 text-center cursor-pointer bg-slate-800/30 hover:bg-slate-800/60 transition block">
            <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-200">
              Click to browse or drag and drop photos / documents
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Supports JPG, PNG, WEBP, PDF, DOC, TXT
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </label>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/50 text-xs"
                >
                  <span className="text-slate-200 truncate font-mono">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(i)}
                    className="text-slate-400 hover:text-rose-400 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/complaints')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <span>{loading ? 'Submitting...' : 'Submit Complaint'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateComplaintPage;
