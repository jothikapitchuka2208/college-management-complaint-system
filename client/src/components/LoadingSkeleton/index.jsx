import React from 'react';

export const MetricSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-32 bg-slate-800/60 rounded-2xl border border-slate-700/50 p-6" />
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full bg-slate-800/40 rounded-2xl border border-slate-700/50 p-4 space-y-4 animate-pulse">
    <div className="h-10 bg-slate-700/40 rounded-lg w-full" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-14 bg-slate-800/80 rounded-xl w-full border border-slate-700/30" />
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-4 animate-pulse">
    <div className="h-6 bg-slate-700/60 rounded w-1/3" />
    <div className="h-4 bg-slate-700/40 rounded w-full" />
    <div className="h-4 bg-slate-700/40 rounded w-2/3" />
    <div className="h-10 bg-slate-700/30 rounded-xl w-full mt-4" />
  </div>
);

export default { MetricSkeleton, TableSkeleton, CardSkeleton };
