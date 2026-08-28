import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  Building2,
  Tags,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const role = user?.role || 'student';

  const getNavLinks = () => {
    const baseLinks = [
      {
        to: '/dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
    ];

    if (role === 'student') {
      baseLinks.push(
        {
          to: '/complaints/create',
          label: 'Submit Complaint',
          icon: <PlusCircle className="w-5 h-5 text-indigo-400" />,
          highlight: true,
        },
        {
          to: '/complaints',
          label: 'My Complaints',
          icon: <FileText className="w-5 h-5" />,
        }
      );
    } else if (role === 'faculty') {
      baseLinks.push({
        to: '/complaints',
        label: 'Assigned Complaints',
        icon: <FileText className="w-5 h-5" />,
      });
    } else if (role === 'admin') {
      baseLinks.push(
        {
          to: '/complaints',
          label: 'All Complaints',
          icon: <FileText className="w-5 h-5" />,
        },
        {
          to: '/users',
          label: 'User Management',
          icon: <Users className="w-5 h-5" />,
        },
        {
          to: '/departments',
          label: 'Departments',
          icon: <Building2 className="w-5 h-5" />,
        },
        {
          to: '/categories',
          label: 'Categories',
          icon: <Tags className="w-5 h-5" />,
        },
        {
          to: '/reports',
          label: 'Analytics & Reports',
          icon: <BarChart3 className="w-5 h-5" />,
        }
      );
    }

    baseLinks.push(
      {
        to: '/notifications',
        label: 'Notifications',
        icon: <Bell className="w-5 h-5" />,
      },
      {
        to: '/settings',
        label: 'Settings & Profile',
        icon: <Settings className="w-5 h-5" />,
      }
    );

    return baseLinks;
  };

  const links = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-wide">CCMS Portal</h1>
            <p className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">
              {role} Workspace
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Main Menu
          </p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : link.highlight
                    ? 'bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <span>{link.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/40">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5 capitalize">
              Role: {user?.role}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
