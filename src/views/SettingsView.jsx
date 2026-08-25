import React, { useState } from 'react';
import { Settings, LogOut, Check, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsView = () => {
  const { user, setUser, logout, setIsAuthModalOpen } = useAuth();

  const [displayName, setDisplayName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [major, setMajor] = useState(user?.major || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!user) return;
    const updated = {
      ...user,
      name: displayName,
      username: username.replace(/^@/, '').toLowerCase().trim(),
      university,
      major
    };
    setUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your verified student credentials and campus standing.
        </p>
      </div>

      {user ? (
        <form onSubmit={handleSaveProfile} className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-primary-500 shadow-sm"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>{user.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Scholar
                </span>
              </h3>
              <p className="text-xs text-primary-600 font-mono font-bold">@{user.username} • {user.tier}</p>
              <p className="text-xs text-slate-400 mt-0.5">{user.xp} XP Earned</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-primary-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Unique Student Handle
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-primary-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                University
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-primary-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Major
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-primary-500 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-btn transition-all flex items-center gap-1.5"
            >
              {isSaved ? <Check className="w-4 h-4" /> : null}
              <span>{isSaved ? 'Saved Changes!' : 'Update Profile'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-4 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              You are currently signed out
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Sign in with your Google account or Phone OTP to manage your profile and view your campus ranking.
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-btn transition-all inline-flex items-center gap-2 transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sign In with Clerk (Google / Phone OTP) ⚡</span>
          </button>
        </div>
      )}
    </div>
  );
};
