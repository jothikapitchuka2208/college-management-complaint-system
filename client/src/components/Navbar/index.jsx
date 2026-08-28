import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { getInitials } from '../../utils/helpers';
import {
  Bell,
  LogOut,
  User,
  Shield,
  GraduationCap,
  Briefcase,
  Menu,
  Sparkles,
} from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { unreadCount, toggleOpen } = useNotificationStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          icon: <Shield className="w-3.5 h-3.5" />,
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        };
      case 'faculty':
        return {
          label: 'Faculty',
          icon: <Briefcase className="w-3.5 h-3.5" />,
          color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        };
      default:
        return {
          label: 'Student',
          icon: <GraduationCap className="w-3.5 h-3.5" />,
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-base bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              CCMS Portal
            </span>
            <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium tracking-wide">
              College Grievance Hub
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Actions, Role Badge, Notifications & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Role Badge */}
        {user && (
          <div
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${roleInfo.color}`}
          >
            {roleInfo.icon}
            <span>{roleInfo.label}</span>
          </div>
        )}

        {/* Notifications Button */}
        <button
          onClick={toggleOpen}
          className="relative p-2.5 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition"
          title="Open Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-md shadow-rose-500/40 animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Info & Settings Link */}
        {user && (
          <Link
            to="/settings"
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50 transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-inner group-hover:bg-indigo-500 transition">
              {getInitials(user.name)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-white leading-tight truncate max-w-[130px]">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                {user.email}
              </p>
            </div>
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2.5 text-slate-400 hover:text-rose-400 bg-slate-800/40 hover:bg-rose-500/10 rounded-xl border border-slate-800 hover:border-rose-500/30 transition"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
