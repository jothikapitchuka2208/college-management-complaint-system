import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../StatusBadge';
import PriorityBadge from '../PriorityBadge';
import { formatDate } from '../../utils/helpers';
import { ChevronRight, ArrowUpDown, FileQuestion } from 'lucide-react';

const ComplaintTable = ({
  complaints = [],
  pagination = {},
  onPageChange,
  showAssignee = true,
}) => {
  if (complaints.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-white">No complaints found</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          No complaints match the current filter or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Complaint ID</th>
              <th className="py-3.5 px-4">Title & Category</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              {showAssignee && <th className="py-3.5 px-4">Department / Assignee</th>}
              <th className="py-3.5 px-4">Date Submitted</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {complaints.map((c) => (
              <tr
                key={c._id}
                className="hover:bg-slate-800/40 transition group cursor-pointer"
              >
                <td className="py-4 px-4 font-mono text-xs font-bold text-indigo-400">
                  <Link to={`/complaints/${c._id}`} className="hover:underline">
                    {c.complaintNumber}
                  </Link>
                </td>
                <td className="py-4 px-4 max-w-xs">
                  <Link to={`/complaints/${c._id}`} className="block">
                    <p className="font-semibold text-white group-hover:text-indigo-300 transition truncate">
                      {c.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {c.category?.name || 'General'}
                    </p>
                  </Link>
                </td>
                <td className="py-4 px-4">
                  <PriorityBadge priority={c.priority} size="sm" />
                </td>
                <td className="py-4 px-4">
                  <StatusBadge status={c.status} size="sm" />
                </td>
                {showAssignee && (
                  <td className="py-4 px-4 text-xs">
                    <p className="font-medium text-slate-200">
                      {c.department?.name || <span className="text-slate-500 italic">Unassigned</span>}
                    </p>
                    {c.assignedTo && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {c.assignedTo.name}
                      </p>
                    )}
                  </td>
                )}
                <td className="py-4 px-4 text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(c.createdAt)}
                </td>
                <td className="py-4 px-4 text-right">
                  <Link
                    to={`/complaints/${c._id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/20 transition"
                  >
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between px-2 py-3 text-xs text-slate-400">
          <p>
            Showing Page <span className="font-bold text-white">{pagination.page}</span> of{' '}
            <span className="font-bold text-white">{pagination.pages}</span> ({pagination.total} total items)
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 transition"
            >
              Previous
            </button>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintTable;
