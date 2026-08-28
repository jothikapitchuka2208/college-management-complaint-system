export const STATUSES = {
  PENDING: { label: 'Pending', color: 'amber', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  ASSIGNED: { label: 'Assigned', color: 'blue', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  IN_PROGRESS: { label: 'In Progress', color: 'indigo', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  RESOLVED: { label: 'Resolved', color: 'emerald', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  CLOSED: { label: 'Closed', color: 'slate', bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
  REOPENED: { label: 'Reopened', color: 'rose', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  REJECTED: { label: 'Rejected', color: 'red', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
};

export const PRIORITIES = {
  LOW: { label: 'Low', bg: 'bg-slate-500/10', text: 'text-slate-300', border: 'border-slate-500/30' },
  MEDIUM: { label: 'Medium', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  HIGH: { label: 'High', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  URGENT: { label: 'Urgent', bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/50', animate: true },
};

export const DEMO_USERS = [
  {
    role: 'admin',
    title: 'Administrator',
    email: 'admin@ccms.edu',
    password: 'Admin@12345',
    desc: 'Full oversight: Manage users, assign staff, view reports & audits',
  },
  {
    role: 'faculty',
    title: 'Faculty / Staff',
    email: 'faculty.cs@ccms.edu',
    password: 'Faculty@12345',
    desc: 'Resolve assigned complaints, add remarks & progress notes',
  },
  {
    role: 'student',
    title: 'Student',
    email: 'student1@ccms.edu',
    password: 'Student@12345',
    desc: 'Submit complaints, track timeline & provide satisfaction rating',
  },
];
