import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../store/notificationStore';
import { formatRelativeTime } from '../../utils/helpers';
import {
  Bell,
  X,
  CheckCheck,
  FileText,
  UserCheck,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

const NotificationDrawer = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isOpen,
    setIsOpen,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif._id);
    }
    setIsOpen(false);
    if (notif.complaintId) {
      const complaintId = notif.complaintId._id || notif.complaintId;
      navigate(`/complaints/${complaintId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Notifications</h3>
                <p className="text-xs text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1.5 transition"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-500">
                  <Bell className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-medium text-slate-300">No notifications yet</h4>
                <p className="text-xs text-slate-500 mt-1">
                  You will receive real-time updates as your complaints make progress.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex gap-3.5 items-start ${
                    notif.isRead
                      ? 'bg-slate-800/30 border-slate-800/60 hover:bg-slate-800/60 text-slate-300'
                      : 'bg-indigo-950/20 border-indigo-500/30 hover:bg-indigo-950/40 text-white shadow-sm'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800/80 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
