import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/notificationStore';
import { formatRelativeTime, formatDate } from '../utils/helpers';
import {
  Bell,
  CheckCheck,
  FileText,
  UserCheck,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    isLoading,
  } = useNotificationStore();

  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'COMPLAINT_SUBMITTED':
        return <FileText className="w-5 h-5 text-amber-400" />;
      case 'COMPLAINT_ASSIGNED':
        return <UserCheck className="w-5 h-5 text-blue-400" />;
      case 'COMPLAINT_RESOLVED':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'COMPLAINT_REOPENED':
        return <RotateCcw className="w-5 h-5 text-rose-400" />;
      case 'COMMENT_ADDED':
        return <MessageSquare className="w-5 h-5 text-indigo-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const displayedNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const handleClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif._id);
    }
    if (notif.complaintId) {
      const complaintId = notif.complaintId._id || notif.complaintId;
      navigate(`/complaints/${complaintId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-indigo-400" />
            <span>In-App Notifications</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time updates regarding your complaints, assignments, and resolution notes
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            filter === 'all'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            filter === 'unread'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {displayedNotifications.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <Bell className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No notifications found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You will automatically receive alerts whenever complaints are assigned, commented on, or resolved.
            </p>
          </div>
        ) : (
          displayedNotifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleClick(notif)}
              className={`p-5 rounded-2xl border transition cursor-pointer flex gap-4 items-start ${
                notif.isRead
                  ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 text-slate-300'
                  : 'bg-indigo-950/20 border-indigo-500/30 hover:bg-indigo-950/40 text-white shadow-md'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-800/80 shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-bold text-white truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {formatDate(notif.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
