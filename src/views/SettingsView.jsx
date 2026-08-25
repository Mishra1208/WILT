import React, { useState } from 'react';
import { Settings, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_LEADERBOARD_USERS, CURRENT_DEMO_USER } from '../data/seedData';

export const SettingsView = () => {
  const { user, setUser, switchAccount, logout } = useAuth();

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
          Manage your student credentials and university standing.
        </p>
      </div>

      {user && (
        <form onSubmit={handleSaveProfile} className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-primary-500"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {user.name}
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
      )}

      {/* Switch Demo Profile */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Switch Demo Student Profile
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[CURRENT_DEMO_USER, ...INITIAL_LEADERBOARD_USERS.slice(0, 2)].map((demo) => (
            <button
              key={demo.id}
              onClick={() => switchAccount(demo)}
              className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-left flex items-center gap-3 hover:border-primary-300 hover:bg-white transition-all shadow-sm"
            >
              <img
                src={demo.avatar}
                alt={demo.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">{demo.name}</div>
                <div className="text-[11px] text-primary-600 font-mono font-semibold">@{demo.username}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
