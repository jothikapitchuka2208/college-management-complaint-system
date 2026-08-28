import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  CheckCheck,
  AlertTriangle,
  Users,
  Building2,
  TrendingUp,
} from 'lucide-react';

const MetricGrid = ({ metrics = {}, role = 'student' }) => {
  const getCards = () => {
    if (role === 'student') {
      return [
        {
          label: 'Total Submitted',
          value: metrics.total || 0,
          icon: <FileText className="w-6 h-6 text-indigo-400" />,
          color: 'from-indigo-500/10 to-indigo-500/5',
          border: 'border-indigo-500/20',
          subtitle: 'All time complaints',
        },
        {
          label: 'Pending Review',
          value: metrics.pending || 0,
          icon: <Clock className="w-6 h-6 text-amber-400" />,
          color: 'from-amber-500/10 to-amber-500/5',
          border: 'border-amber-500/20',
          subtitle: 'Awaiting assignment',
        },
        {
          label: 'In Progress',
          value: metrics.inProgress || 0,
          icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
          color: 'from-blue-500/10 to-blue-500/5',
          border: 'border-blue-500/20',
          subtitle: 'Staff actively resolving',
        },
        {
          label: 'Resolved',
          value: metrics.resolved || 0,
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
          color: 'from-emerald-500/10 to-emerald-500/5',
          border: 'border-emerald-500/20',
          subtitle: 'Successfully completed',
        },
      ];
    }

    if (role === 'faculty') {
      return [
        {
          label: 'Total Assigned',
          value: metrics.assigned || 0,
          icon: <FileText className="w-6 h-6 text-indigo-400" />,
          color: 'from-indigo-500/10 to-indigo-500/5',
          border: 'border-indigo-500/20',
          subtitle: 'Assigned to your queue',
        },
        {
          label: 'In Progress',
          value: metrics.inProgress || 0,
          icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
          color: 'from-blue-500/10 to-blue-500/5',
          border: 'border-blue-500/20',
          subtitle: 'Currently working on',
        },
        {
          label: 'Resolved',
          value: metrics.resolved || 0,
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
          color: 'from-emerald-500/10 to-emerald-500/5',
          border: 'border-emerald-500/20',
          subtitle: 'Successfully resolved',
        },
        {
          label: 'Urgent Priority',
          value: metrics.urgent || 0,
          icon: <AlertTriangle className="w-6 h-6 text-rose-400" />,
          color: 'from-rose-500/10 to-rose-500/5',
          border: 'border-rose-500/20',
          subtitle: 'Requires immediate action',
        },
      ];
    }

    // Admin metrics
    return [
      {
        label: 'Total Complaints',
        value: metrics.total || 0,
        icon: <FileText className="w-6 h-6 text-indigo-400" />,
        color: 'from-indigo-500/10 to-indigo-500/5',
        border: 'border-indigo-500/20',
        subtitle: 'Platform-wide total',
      },
      {
        label: 'Pending Assignment',
        value: metrics.pending || 0,
        icon: <Clock className="w-6 h-6 text-amber-400" />,
        color: 'from-amber-500/10 to-amber-500/5',
        border: 'border-amber-500/20',
        subtitle: 'Needs department assignment',
      },
      {
        label: 'In Progress',
        value: metrics.inProgress || 0,
        icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
        color: 'from-blue-500/10 to-blue-500/5',
        border: 'border-blue-500/20',
        subtitle: 'Under active resolution',
      },
      {
        label: 'Resolution Rate',
        value: `${metrics.resolutionRate || 0}%`,
        icon: <CheckCheck className="w-6 h-6 text-emerald-400" />,
        color: 'from-emerald-500/10 to-emerald-500/5',
        border: 'border-emerald-500/20',
        subtitle: `${(metrics.resolved || 0) + (metrics.closed || 0)} complaints solved`,
      },
    ];
  };

  const cards = getCards();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} backdrop-blur-sm relative overflow-hidden group hover:scale-[1.02] transition duration-200`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.label}
              </p>
              <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
                {card.value}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 shadow-inner group-hover:scale-110 transition">
              {card.icon}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 font-medium flex items-center gap-1.5">
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MetricGrid;
