import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { STATUSES, PRIORITIES } from '../../utils/constants';

const ComplaintFilters = ({
  search = '',
  status = '',
  priority = '',
  category = '',
  department = '',
  categories = [],
  departments = [],
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onDepartmentChange,
  onReset,
}) => {
  const hasActiveFilters = search || status || priority || category || department;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ID, title, or keywords..."
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            Clear All Filters
          </button>
        )}
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/60">
        {/* Status */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUSES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">All Priorities</option>
            {Object.entries(PRIORITIES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ComplaintFilters;
