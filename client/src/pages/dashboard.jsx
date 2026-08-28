import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import MetricGrid from '../components/MetricGrid';
import ComplaintTable from '../components/ComplaintTable';
import { MetricSkeleton } from '../components/LoadingSkeleton';
import {
  PlusCircle,
  FileText,
  AlertTriangle,
  Users,
  Building2,
  Tags,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const role = user?.role || 'student';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [role]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            {role.toUpperCase()} CONSOLE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hello, {user?.name}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {role === 'student'
              ? 'Track your submitted grievances, receive instant resolution notifications, and submit new requests.'
              : role === 'faculty'
              ? 'Review complaints assigned to your department, update progress statuses, and provide resolution remarks.'
              : 'Monitor college-wide complaints, assign faculty departments, manage categories, and generate reports.'}
          </p>
        </div>

        {role === 'student' && (
          <Link
            to="/complaints/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit New Complaint</span>
          </Link>
        )}
      </div>

      {/* Metrics Cards */}
      {loading ? (
        <MetricSkeleton />
      ) : (
        <MetricGrid metrics={data?.metrics} role={role} />
      )}

      {/* Admin Specific Analytics Summary */}
      {role === 'admin' && data && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Complaints by Department</span>
              </h3>
              <Link to="/departments" className="text-xs text-indigo-400 hover:underline">
                Manage →
              </Link>
            </div>
            <div className="space-y-3">
              {data.departmentBreakdown?.length === 0 ? (
                <p className="text-xs text-slate-500">No department data available.</p>
              ) : (
                data.departmentBreakdown?.map((dept) => {
                  const maxCount = Math.max(
                    ...data.departmentBreakdown.map((d) => d.count),
                    1
                  );
                  const percentage = Math.round((dept.count / maxCount) * 100);
                  return (
                    <div key={dept.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{dept.name}</span>
                        <span className="text-indigo-400 font-mono">{dept.count}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tags className="w-4 h-4 text-purple-400" />
                <span>Complaints by Category</span>
              </h3>
              <Link to="/categories" className="text-xs text-indigo-400 hover:underline">
                Manage →
              </Link>
            </div>
            <div className="space-y-3">
              {data.categoryBreakdown?.length === 0 ? (
                <p className="text-xs text-slate-500">No category data available.</p>
              ) : (
                data.categoryBreakdown?.slice(0, 5).map((cat) => {
                  const maxCount = Math.max(
                    ...data.categoryBreakdown.map((c) => c.count),
                    1
                  );
                  const percentage = Math.round((cat.count / maxCount) * 100);
                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{cat.name}</span>
                        <span className="text-purple-400 font-mono">{cat.count}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Complaints Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              {role === 'student'
                ? 'Recent Complaints'
                : role === 'faculty'
                ? 'Recently Assigned Tasks'
                : 'Recent Platform Complaints'}
            </h3>
            <p className="text-xs text-slate-400">
              Live records showing current status and progress updates
            </p>
          </div>
          <Link
            to="/complaints"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="h-48 bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse" />
        ) : (
          <ComplaintTable
            complaints={data?.recentComplaints || []}
            showAssignee={role !== 'faculty'}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
