import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ShieldAlert, ArrowRight } from 'lucide-react';
import { Role } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
  onSelectRoleDirect: (role: Role) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onSelectRoleDirect }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Connect to backend login API
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Invalid username or password');
      }

      const data = await res.json();
      onLoginSuccess(data.data);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'ADMINISTRATOR' as Role, user: 'admin', pass: 'admin123', label: 'Administrator', color: 'bg-blue-600' },
    { role: 'DOCTOR' as Role, user: 'doctor.priya', pass: 'doctor123', label: 'Doctor (Cardiology)', color: 'bg-emerald-600' },
    { role: 'NURSE' as Role, user: 'nurse.rahul', pass: 'nurse123', label: 'Nurse (Ward 3B)', color: 'bg-purple-600' },
    { role: 'BED_MANAGER' as Role, user: 'bedmanager.anil', pass: 'bed123', label: 'Bed Manager', color: 'bg-amber-600' },
    { role: 'AMBULANCE_CREW' as Role, user: 'crew.unit104', pass: 'crew123', label: 'Ambulance Driver', color: 'bg-sky-600' },
    { role: 'AMBULANCE_COORDINATOR' as Role, user: 'coordinator.sarah', pass: 'coord123', label: 'Ambulance Coordinator', color: 'bg-teal-600' },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left Column: Form & Branding */}
      <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-between max-w-xl mx-auto">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              +
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">MediSync</span>
          </div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Connected Hospitals. Safer Lives.
          </p>
        </div>

        {/* Center Form */}
        <div className="my-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
          <p className="text-slate-600 text-sm mb-6">
            Access your dashboard and manage hospital operations in real-time.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email or Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email or username"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-slate-600">
                <input type="checkbox" className="rounded border-slate-300 text-sky-600 mr-2" defaultChecked />
                Remember me
              </label>
              <a href="#forgot" className="text-sky-600 hover:text-sky-700 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-lg shadow-md shadow-sky-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Login'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Quick Demo Selector */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-2.5 uppercase tracking-wider">
              Quick Role Switch (Interactive Testing)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => {
                    setUsername(acc.user);
                    setPassword(acc.pass);
                    onSelectRoleDirect(acc.role);
                  }}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md text-left flex items-center justify-between transition-colors"
                >
                  <span className="truncate">{acc.label}</span>
                  <span className={`w-2 h-2 rounded-full ${acc.color}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-600 flex items-center justify-between border-t border-slate-100 pt-4">
          <span>Trusted by 12+ Hospitals</span>
          <span>24/7 Operations Support</span>
        </div>
      </div>

      {/* Right Column: Hero Graphic Banner */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex justify-end">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-sky-200 border border-white/10">
            Emergency Network v2.4
          </span>
        </div>

        {/* Stylized Emergency Center Visual Card */}
        <div className="relative z-10 my-auto text-center px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 backdrop-blur-sm shadow-xl shadow-sky-950/40">
            <span className="text-4xl font-black">+</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Real-Time Multi-Hospital & Ambulance Coordination
          </h1>
          <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
            One trusted operational picture • Role-specific access • Visible data freshness • Human-verified clinical decisions.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 text-left max-w-sm mx-auto">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-[10px] text-slate-400 font-medium">Hospitals</p>
              <p className="text-lg font-bold text-white">12+</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-[10px] text-slate-400 font-medium">Avg Handoff</p>
              <p className="text-lg font-bold text-emerald-400">11.4m</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-[10px] text-slate-400 font-medium">Live Bed Sync</p>
              <p className="text-lg font-bold text-sky-400">99.8%</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between">
          <span>CareLink Clinical Standards</span>
          <span>Security: TLS 1.3 & RBAC</span>
        </div>
      </div>
    </div>
  );
};

