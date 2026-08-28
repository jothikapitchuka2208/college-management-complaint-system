import React from 'react';
import { formatDate } from '../../utils/helpers';
import {
  FilePlus,
  UserCheck,
  TrendingUp,
  CheckCircle,
  RotateCcw,
  MessageSquare,
  Star,
  Activity,
} from 'lucide-react';

const ComplaintTimeline = ({ logs = [] }) => {
  if (logs.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-slate-800/30 border border-slate-800">
        No audit log history recorded yet.
      </div>
    );
  }

  const getLogIcon = (action) => {
    if (action.includes('Created')) return <FilePlus className="w-4 h-4 text-amber-400" />;
    if (action.includes('Assigned')) return <UserCheck className="w-4 h-4 text-blue-400" />;
    if (action.includes('Status') || action.includes('IN_PROGRESS'))
      return <TrendingUp className="w-4 h-4 text-indigo-400" />;
    if (action.includes('Resolved') || action.includes('RESOLVED'))
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (action.includes('Reopened')) return <RotateCcw className="w-4 h-4 text-rose-400" />;
    if (action.includes('Comment')) return <MessageSquare className="w-4 h-4 text-sky-400" />;
    if (action.includes('Feedback')) return <Star className="w-4 h-4 text-amber-300" />;
    return <Activity className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {logs.map((log, idx) => (
        <div key={log._id || idx} className="relative group">
          {/* Step Icon */}
          <div className="absolute -left-6 top-0.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500/50 flex items-center justify-center shadow group-hover:border-indigo-400 transition">
            {getLogIcon(log.action)}
          </div>

          <div className="bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 rounded-xl p-3.5 transition">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-white tracking-wide">
                {log.action}
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                {formatDate(log.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300">
              <span>By:</span>
              <span className="font-semibold text-indigo-300">
                {log.userId?.name || 'System'}
              </span>
              {log.userId?.role && (
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-700 text-slate-300">
                  {log.userId.role}
                </span>
              )}
            </div>

            {log.metadata?.resolutionRemarks && (
              <div className="mt-2 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
                <span className="font-semibold block mb-0.5">Resolution Remarks:</span>
                {log.metadata.resolutionRemarks}
              </div>
            )}

            {log.metadata?.reason && (
              <div className="mt-2 p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/20 text-xs text-rose-300">
                <span className="font-semibold block mb-0.5">Reopen Reason:</span>
                {log.metadata.reason}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintTimeline;
