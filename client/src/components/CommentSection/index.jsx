import React, { useState } from 'react';
import { formatDate, getInitials } from '../../utils/helpers';
import { Send, MessageSquare, Shield, GraduationCap, Briefcase } from 'lucide-react';

const CommentSection = ({ comments = [], onAddComment, isLoading = false }) => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onAddComment(message.trim());
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Shield className="w-2.5 h-2.5" /> Admin
          </span>
        );
      case 'faculty':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Briefcase className="w-2.5 h-2.5" /> Faculty
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <GraduationCap className="w-2.5 h-2.5" /> Student
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Comments List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-800/30 border border-slate-800">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-500 mb-2" />
            <p className="text-xs text-slate-400 font-medium">No comments posted yet.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Use the box below to ask questions or share progress updates.
            </p>
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex gap-3 items-start"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600/80 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">
                {getInitials(c.author?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {c.author?.name || 'User'}
                    </span>
                    {getRoleBadge(c.author?.role)}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-1.5 leading-relaxed whitespace-pre-wrap">
                  {c.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a remark or comment on this complaint..."
          className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
        />
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-[10px] text-slate-500 font-mono">
            Visible to student, faculty & administrator
          </span>
          <button
            type="submit"
            disabled={!message.trim() || submitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
