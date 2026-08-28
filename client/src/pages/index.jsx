import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { DEMO_USERS } from '../utils/constants';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Shield,
  Layers,
  FileCheck,
  TrendingUp,
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();

  const handleQuickLogin = async (email, password) => {
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Navbar */}
      <header className="h-20 border-b border-slate-800/80 px-6 sm:px-12 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight">CCMS</h1>
            <p className="text-[10px] text-indigo-400 font-medium -mt-1 tracking-wider uppercase">
              College Grievance Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
              >
                <span>Student Register</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 py-20 sm:py-28 max-w-7xl mx-auto w-full text-center flex flex-col items-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-sm">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation Transparent Campus Grievance System</span>
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl leading-[1.1]">
          Resolve campus issues with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            speed & clarity.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-400 mt-6 max-w-2xl leading-relaxed">
          Centralized digital complaint tracking for students, faculty departments, and
          administrators. From submission to audit resolution with complete accountability.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link
            to="/register"
            className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition duration-200 flex items-center gap-2"
          >
            <span>Submit a Complaint Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/60 backdrop-blur transition"
          >
            Access Portal
          </Link>
        </div>

        {/* One-Click Quick Demo Switcher Cards */}
        <div className="w-full max-w-5xl mt-20 text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center mb-6">
            ⚡ Quick Test / Demo Sign-In (Click any role to test immediately)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DEMO_USERS.map((demo) => (
              <div
                key={demo.role}
                onClick={() => handleQuickLogin(demo.email, demo.password)}
                className="p-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition duration-200 group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 uppercase tracking-wider">
                      {demo.title}
                    </span>
                    <span className="text-xs text-slate-500 font-mono group-hover:text-indigo-400 transition">
                      1-Click Login →
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{demo.email}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{demo.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Pass: {demo.password}</span>
                  <span className="text-indigo-400 font-semibold">Sign in</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              End-to-End Complaint Lifecycle
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Every complaint is assigned a unique tracking number (e.g.{' '}
              <span className="font-mono text-indigo-400 font-bold">CMP-2026-00001</span>) and
              progresses through defined stages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Submission',
                desc: 'Students submit issues with categories, priority, details, and attachments.',
                icon: <FileCheck className="w-6 h-6 text-amber-400" />,
              },
              {
                step: '02',
                title: 'Department Assignment',
                desc: 'Admins review and assign complaint to appropriate faculty or department lead.',
                icon: <Layers className="w-6 h-6 text-blue-400" />,
              },
              {
                step: '03',
                title: 'Active Resolution',
                desc: 'Faculty investigates, adds resolution remarks, and transitions to Resolved.',
                icon: <TrendingUp className="w-6 h-6 text-indigo-400" />,
              },
              {
                step: '04',
                title: 'Student Review & Feedback',
                desc: 'Students review the solution, provide 1-5 star feedback rating, or reopen.',
                icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative group hover:border-slate-700 transition"
              >
                <span className="text-3xl font-black text-slate-800 font-mono absolute top-4 right-5">
                  {s.step}
                </span>
                <div className="p-3 rounded-xl bg-slate-800/80 w-fit mb-4">{s.icon}</div>
                <h4 className="text-base font-bold text-white">{s.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Feature Highlights */}
      <section className="py-20 max-w-7xl mx-auto px-6 sm:px-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Tailored Roles & Permissions
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            Secure role-based boundaries ensure students, faculty, and administrators have the
            exact tools they need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Student Experience</h4>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Self-serve registration & easy submission
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Live status tracking & complete history
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Real-time notifications & satisfaction ratings
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="mt-6 block text-center py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition"
            >
              Register as Student
            </Link>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 w-fit mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Faculty & Staff</h4>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  Assigned complaints task queue
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  Status workflows (In Progress, Resolved)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  Add resolution remarks & progress comments
                </li>
              </ul>
            </div>
            <Link
              to="/login"
              className="mt-6 block text-center py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold text-xs border border-blue-500/30 transition"
            >
              Faculty Sign In
            </Link>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Administration</h4>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  Platform-wide complaint management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  User & Department administration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  Comprehensive analytics & audit logs
                </li>
              </ul>
            </div>
            <Link
              to="/login"
              className="mt-6 block text-center py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-semibold text-xs border border-purple-500/30 transition"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 College Complaint Management System (CCMS). Designed for Modern Higher Education Institutions.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
