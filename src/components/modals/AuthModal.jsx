import React, { useState } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_LEADERBOARD_USERS, CURRENT_DEMO_USER } from '../../data/seedData';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, switchAccount } = useAuth();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');

  if (!isAuthModalOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username.trim() || !name.trim()) return;

    login({
      username,
      name,
      university: university || "University Student",
      major: "Finance & Tech"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Student Sign In
            </h2>
            <p className="text-xs text-slate-500">
              Join the campus leaderboard & quizzes
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Demo Profiles */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-coral-500" />
            <span>Instant Demo Accounts</span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[CURRENT_DEMO_USER, INITIAL_LEADERBOARD_USERS[0]].map((demo) => (
              <button
                key={demo.id}
                onClick={() => switchAccount(demo)}
                className="p-2.5 rounded-2xl bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-200 text-left flex items-center gap-2.5 transition-all group"
              >
                <img
                  src={demo.avatar}
                  alt={demo.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-primary-700 truncate">
                    {demo.name}
                  </div>
                  <div className="text-[10px] text-primary-600 font-mono">
                    @{demo.username}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase">or create handle</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Sterling"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Unique Handle
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alex_fintech"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500 font-mono font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-btn transition-all flex items-center justify-center gap-1.5 transform active:scale-95"
          >
            <span>Enter WILT Campus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
