import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { DEMO_USERS } from '../utils/constants';
import { Sparkles, Lock, Mail, AlertCircle, ArrowRight, Check } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeDemo, setActiveDemo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      await login(email, password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      // Error handled by store
    }
  };

  const handleSelectDemo = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setActiveDemo(demo.role);
    clearError();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Welcome to CCMS
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Sign in to access your role-specific grievance dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
          {/* Quick Demo Autofill Pills */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              ⚡ One-Click Demo Autofill:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleSelectDemo(demo)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center flex flex-col items-center gap-1 ${
                    activeDemo === demo.role
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                  }`}
                >
                  <span className="capitalize">{demo.role}</span>
                  {activeDemo === demo.role && <Check className="w-3 h-3 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="name@ccms.edu"
                  className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            Are you a student without an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:underline">
              Create student account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
