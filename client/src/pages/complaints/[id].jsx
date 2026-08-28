import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { initSocket, getSocket } from '../../services/socket';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import CommentSection from '../../components/CommentSection';
import ComplaintTimeline from '../../components/ComplaintTimeline';
import { formatDate, formatFileSize } from '../../utils/helpers';
import { PRIORITIES } from '../../utils/constants';
import {
  ArrowLeft,
  Calendar,
  User,
  Building2,
  Tags,
  Download,
  Paperclip,
  CheckCircle2,
  RotateCcw,
  UserCheck,
  Star,
  Trash2,
  AlertTriangle,
  Send,
  MessageSquare,
  History,
  X,
  FileCheck,
} from 'lucide-react';

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role || 'student';

  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'timeline'

  // Modals state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Form states for modals
  const [facultyList, setFacultyList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [assignDepartment, setAssignDepartment] = useState('');
  const [assignFaculty, setAssignFaculty] = useState('');

  const [targetStatus, setTargetStatus] = useState('IN_PROGRESS');
  const [resolutionRemarks, setResolutionRemarks] = useState('');

  const [reopenReason, setReopenReason] = useState('');

  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  const [actionLoading, setActionLoading] = useState(false);

  // Load single complaint data
  const loadData = async () => {
    try {
      setLoading(true);
      const [compRes, commRes, timeRes] = await Promise.all([
        api.get(`/complaints/${id}`),
        api.get(`/complaints/${id}/comments`),
        api.get(`/complaints/${id}/timeline`),
      ]);
      setComplaint(compRes.data);
      setComments(commRes.data || []);
      setTimeline(timeRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Socket.IO room joining for live updates
    const socket = getSocket();
    if (socket) {
      socket.emit('join_complaint', id);

      socket.on('complaint_update', (data) => {
        if (data.action === 'NEW_COMMENT' && data.comment) {
          setComments((prev) => [...prev, data.comment]);
        } else {
          loadData();
        }
      });
    }

    return () => {
      if (socket) {
        socket.emit('leave_complaint', id);
        socket.off('complaint_update');
      }
    };
  }, [id]);

  // Fetch departments and faculty for assignment
  const openAssignModal = async () => {
    try {
      const [deptRes, userRes] = await Promise.all([
        api.get('/departments?isActive=true'),
        api.get('/users?role=faculty&isActive=true'),
      ]);
      setDepartmentList(deptRes.data || []);
      setFacultyList(userRes.data || []);
      setAssignDepartment(complaint.department?._id || deptRes.data[0]?._id || '');
      setAssignFaculty(complaint.assignedTo?._id || '');
      setShowAssignModal(true);
    } catch (err) {
      console.error('Failed to load assignment choices:', err);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.post(`/complaints/${id}/assign`, {
        department: assignDepartment || null,
        assignedTo: assignFaculty || null,
      });
      setComplaint(res.data);
      setShowAssignModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Assignment failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.post(`/complaints/${id}/status`, {
        status: targetStatus,
        resolutionRemarks: resolutionRemarks.trim(),
      });
      setComplaint(res.data);
      setShowStatusModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReopen = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.post(`/complaints/${id}/reopen`, {
        reason: reopenReason.trim(),
      });
      setComplaint(res.data);
      setShowReopenModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Reopen failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.post(`/complaints/${id}/feedback`, {
        rating: feedbackRating,
        comment: feedbackComment.trim(),
      });
      setComplaint(res.data);
      setShowFeedbackModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Feedback failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async (msg) => {
    const res = await api.post(`/complaints/${id}/comments`, { message: msg });
    setComments((prev) => [...prev, res.data]);
    loadData();
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this complaint?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      navigate('/complaints');
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-1/4" />
        <div className="h-48 bg-slate-800/60 rounded-3xl" />
        <div className="h-96 bg-slate-800/40 rounded-3xl" />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Complaint Not Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">{error || 'This record does not exist or you do not have permission to view it.'}</p>
        <Link to="/complaints" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </Link>
      </div>
    );
  }

  const isAssignedFaculty = role === 'faculty' && complaint.assignedTo?._id?.toString() === user._id?.toString();
  const isSubmitter = role === 'student' && complaint.submittedBy?._id?.toString() === user._id?.toString();

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Admin Controls */}
          {role === 'admin' && (
            <>
              <button
                onClick={openAssignModal}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>{complaint.assignedTo ? 'Reassign' : 'Assign Department & Staff'}</span>
              </button>

              <button
                onClick={() => {
                  setTargetStatus('RESOLVED');
                  setShowStatusModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                Change Status
              </button>

              <button
                onClick={handleDelete}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                title="Delete complaint"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Faculty Controls */}
          {role === 'faculty' && isAssignedFaculty && (
            <>
              {complaint.status === 'ASSIGNED' && (
                <button
                  onClick={async () => {
                    await api.post(`/complaints/${id}/status`, { status: 'IN_PROGRESS' });
                    loadData();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition"
                >
                  Mark In Progress
                </button>
              )}

              {['ASSIGNED', 'IN_PROGRESS', 'REOPENED'].includes(complaint.status) && (
                <button
                  onClick={() => {
                    setTargetStatus('RESOLVED');
                    setShowStatusModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resolve Complaint</span>
                </button>
              )}
            </>
          )}

          {/* Student Controls */}
          {role === 'student' && isSubmitter && (
            <>
              {complaint.status === 'RESOLVED' && !complaint.feedback && (
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/30 transition flex items-center gap-1.5"
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>Rate Resolution</span>
                </button>
              )}

              {['RESOLVED', 'CLOSED'].includes(complaint.status) && (
                <button
                  onClick={() => setShowReopenModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold border border-rose-500/30 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reopen Issue</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Complaint Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Header Badges & ID */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-extrabold text-indigo-400 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                {complaint.complaintNumber}
              </span>
              <StatusBadge status={complaint.status} size="md" />
              <PriorityBadge priority={complaint.priority} size="md" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white pt-2">
              {complaint.title}
            </h1>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-1 font-mono">
            <div className="flex items-center gap-1.5 justify-end">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Submitted: {formatDate(complaint.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Category
            </span>
            <span className="text-xs font-semibold text-slate-200 mt-1 block">
              {complaint.category?.name || 'General'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Department
            </span>
            <span className="text-xs font-semibold text-slate-200 mt-1 block">
              {complaint.department?.name || <span className="text-slate-500 italic">Unassigned</span>}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Submitted By
            </span>
            <span className="text-xs font-semibold text-slate-200 mt-1 block">
              {complaint.submittedBy?.name}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Assigned Faculty
            </span>
            <span className="text-xs font-semibold text-indigo-300 mt-1 block">
              {complaint.assignedTo?.name || <span className="text-slate-500 italic">Pending Assignment</span>}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Issue Description
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-800/30 p-4 rounded-2xl border border-slate-800">
            {complaint.description}
          </p>
        </div>

        {/* Attachments Section */}
        {complaint.attachments?.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attachments ({complaint.attachments.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {complaint.attachments.map((att) => (
                <a
                  key={att._id}
                  href={`/${att.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/40 transition flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-white truncate font-mono">
                      {att.originalName}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {formatFileSize(att.size)}
                    </p>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Resolution Remarks Banner */}
        {complaint.resolutionRemarks && (
          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Official Resolution Remarks</span>
            </div>
            <p className="text-xs text-emerald-200 leading-relaxed pl-6">
              {complaint.resolutionRemarks}
            </p>
            {complaint.resolvedAt && (
              <span className="text-[10px] text-emerald-400/70 font-mono block pl-6">
                Resolved on: {formatDate(complaint.resolvedAt)}
              </span>
            )}
          </div>
        )}

        {/* Student Feedback Banner */}
        {complaint.feedback && (
          <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Star className="w-4 h-4 fill-current text-amber-400" />
              <span>Student Satisfaction Rating: {complaint.feedback.rating} / 5 Stars</span>
            </div>
            {complaint.feedback.comment && (
              <p className="text-xs text-amber-200 leading-relaxed pl-6">
                "{complaint.feedback.comment}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tabs for Live Comments & Audit Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'comments'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discussion & Remarks ({comments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'timeline'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail Timeline ({timeline.length})</span>
          </button>
        </div>

        {activeTab === 'comments' ? (
          <CommentSection comments={comments} onAddComment={handleAddComment} />
        ) : (
          <ComplaintTimeline logs={timeline} />
        )}
      </div>

      {/* --- MODALS --- */}

      {/* 1. Admin Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                <span>Assign Complaint</span>
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Department
                </label>
                <select
                  value={assignDepartment}
                  onChange={(e) => setAssignDepartment(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Choose Department</option>
                  {departmentList.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Faculty Member
                </label>
                <select
                  value={assignFaculty}
                  onChange={(e) => setAssignFaculty(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Choose Faculty / Staff</option>
                  {facultyList.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.department?.name || 'Faculty'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  {actionLoading ? 'Assigning...' : 'Save Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Update Complaint Status</span>
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  New Status
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {role === 'admin' ? (
                    <>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                      <option value="REJECTED">REJECTED</option>
                    </>
                  ) : (
                    <>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Resolution Remarks / Progress Note
                </label>
                <textarea
                  rows={4}
                  required={targetStatus === 'RESOLVED'}
                  value={resolutionRemarks}
                  onChange={(e) => setResolutionRemarks(e.target.value)}
                  placeholder="Explain the steps taken to resolve this grievance..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  {actionLoading ? 'Updating...' : 'Confirm Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Reopen Modal */}
      {showReopenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-400" />
                <span>Reopen Complaint</span>
              </h3>
              <button
                onClick={() => setShowReopenModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReopen} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Reason for Reopening <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="Explain why the resolution was incomplete or if the problem re-occurred..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReopenModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20"
                >
                  {actionLoading ? 'Submitting...' : 'Reopen Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>Rate Resolution Satisfaction</span>
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFeedback} className="space-y-5">
              {/* Star Selector */}
              <div className="text-center py-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Select Rating (1 to 5 Stars)
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= feedbackRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Comments / Feedback
                </label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Optional thoughts on how the staff handled your grievance..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/30"
                >
                  {actionLoading ? 'Saving...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetailsPage;
