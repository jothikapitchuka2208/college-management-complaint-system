import React from 'react';
import { PRIORITIES } from '../../utils/constants';
import { AlertTriangle, AlertCircle, Clock, ShieldAlert } from 'lucide-react';

const PriorityBadge = ({ priority, size = 'md' }) => {
  const config = PRIORITIES[priority] || {
    label: priority || 'Medium',
    bg: 'bg-slate-500/10',
    text: 'text-slate-300',
    border: 'border-slate-500/30',
  };

  const getIcon = () => {
    switch (priority) {
      case 'URGENT':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'HIGH':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'MEDIUM':
        return <AlertCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  }[size] || 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${
        config.animate ? 'animate-pulse' : ''
      }`}
    >
      {getIcon()}
      {config.label}
    </span>
  );
};

export default PriorityBadge;
