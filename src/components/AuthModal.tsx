import React, { useState } from 'react';
import { X, Lock, User as UserIcon, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login } = useApp();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    login({
      username: username.trim(),
      displayName: displayName.trim() || username.trim(),
    });
  };

  const handleQuickDemo = (demoUsername: string, demoName: string) => {
    login({
      username: demoUsername,
      displayName: demoName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#14141C] border border-zinc-800 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-500 mb-2 shadow-lg">
            <span className="text-2xl font-black">🇳🇵</span>
          </div>
          <h3 className="text-base font-extrabold text-white">
            {authMode === 'login' ? 'Welcome to NepTok' : 'Join NepTok Nepal'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {authMode === 'login'
              ? 'Sign in to like, comment and post short videos'
              : 'Create your account to become a Nepal creator'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 rounded-xl bg-zinc-900 border border-zinc-800 mb-4">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
              authMode === 'login' ? 'bg-rose-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
              authMode === 'signup' ? 'bg-rose-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {authMode === 'signup' && (
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                Full Name / Creator Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. Sujan Shrestha"
                  className="w-full bg-zinc-900 text-xs text-white placeholder-zinc-500 pl-9 pr-3 py-2.5 rounded-xl border border-zinc-700/80 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-zinc-500 text-xs font-bold">@</span>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="nepali_creator"
                className="w-full bg-zinc-900 text-xs text-white placeholder-zinc-500 pl-8 pr-3 py-2.5 rounded-xl border border-zinc-700/80 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 text-xs text-white placeholder-zinc-500 pl-9 pr-3 py-2.5 rounded-xl border border-zinc-700/80 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 mt-2"
          >
            {authMode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{authMode === 'login' ? 'Sign In' : 'Create Free Account'}</span>
          </button>
        </form>

        {/* Quick 1-Click Demo Accounts */}
        <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
          <span className="text-[10px] font-semibold text-zinc-400 block mb-2 uppercase tracking-wide flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Quick Demo Logins
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('aarav_shrestha', 'Aarav Shrestha 🇳🇵')}
              className="py-1.5 px-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-[11px] font-medium text-zinc-200 transition border border-zinc-700"
            >
              Aarav (Kathmandu)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('priyanka_pokhara', 'Priyanka Gurung')}
              className="py-1.5 px-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-[11px] font-medium text-zinc-200 transition border border-zinc-700"
            >
              Priyanka (Pokhara)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
