import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Star,
  Building2,
  Tags,
  Download,
} from 'lucide-react';

const ReportsPage = () => {
  const [complaintStats, setComplaintStats] = useState(null);
  const [deptStats, setDeptStats] = useState([]);
  const [catStats, setCatStats] = useState([]);
  const [resolutionStats, setResolutionStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [compRes, deptRes, catRes, resRes] = await Promise.all([
          api.get('/reports/complaints'),
          api.get('/reports/departments'),
          api.get('/reports/categories'),
          api.get('/reports/resolution'),
        ]);
        setComplaintStats(compRes.data);
        setDeptStats(deptRes.data || []);
        setCatStats(catRes.data || []);
        setResolutionStats(resRes.data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-800/60 rounded-3xl" />
          <div className="h-32 bg-slate-800/60 rounded-3xl" />
          <div className="h-32 bg-slate-800/60 rounded-3xl" />
        </div>
        <div className="h-96 bg-slate-800/40 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Campus Grievance Analytics & Reports</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit performance, department resolution rates, and student satisfaction
          </p>
        </div>
      </div>

      {/* High Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Total Grievances
            </p>
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-4xl font-extrabold text-white mt-3 font-mono">
            {complaintStats?.total || 0}
          </h3>
          <p className="text-xs text-slate-400 mt-2">Recorded platform-wide</p>
        </div>

        <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Avg Resolution Time
            </p>
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-4xl font-extrabold text-white mt-3 font-mono">
            {complaintStats?.avgResolutionHours || 0}{' '}
            <span className="text-lg font-normal text-emerald-300">hours</span>
          </h3>
          <p className="text-xs text-slate-400 mt-2">From submission to resolved</p>
        </div>

        <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Satisfaction Rating
            </p>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <h3 className="text-4xl font-extrabold text-white mt-3 font-mono">
            {resolutionStats?.averageRating || 0}{' '}
            <span className="text-lg font-normal text-amber-300">/ 5.0</span>
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Based on {resolutionStats?.totalFeedbacks || 0} student ratings
          </p>
        </div>
      </div>

      {/* Department Performance Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Department Performance Matrix</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {deptStats.length} Departments Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/40 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Resolved / Closed</th>
                <th className="py-3 px-4">In Progress</th>
                <th className="py-3 px-4">Pending</th>
                <th className="py-3 px-4 text-right">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 font-mono">
              {deptStats.map((d) => (
                <tr key={d.name} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-sans font-bold text-white text-sm">
                    {d.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-bold">{d.total}</td>
                  <td className="py-3.5 px-4 text-emerald-400">{d.resolved}</td>
                  <td className="py-3.5 px-4 text-indigo-400">{d.inProgress}</td>
                  <td className="py-3.5 px-4 text-amber-400">{d.pending}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${d.resolutionRate}%` }}
                        />
                      </div>
                      <span className="font-bold text-emerald-400 text-xs">
                        {d.resolutionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Performance & Feedback Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Tags className="w-5 h-5 text-purple-400" />
            <span>Category Resolution Metrics</span>
          </h3>
          <div className="space-y-3">
            {catStats.map((cat) => (
              <div key={cat.name} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{cat.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {cat.resolved} of {cat.total} solved
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  {cat.resolutionRate}% Rate
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Student Feedback Reviews */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>Recent Student Reviews</span>
          </h3>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {resolutionStats?.feedbacks?.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-10">
                No satisfaction reviews submitted yet.
              </p>
            ) : (
              resolutionStats?.feedbacks?.map((f) => (
                <div
                  key={f._id}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      {f.complaintNumber}
                    </span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: f.feedback?.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-white">{f.title}</p>
                  {f.feedback?.comment && (
                    <p className="text-xs text-slate-300 italic">
                      "{f.feedback.comment}"
                    </p>
                  )}
                  <span className="text-[10px] text-slate-500 block font-mono">
                    By {f.submittedBy?.name} • {formatDate(f.feedback?.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
