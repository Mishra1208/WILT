import React, { useState } from 'react';
import { Trophy, Search, Zap, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const LeaderboardView = () => {
  const { leaderboard } = useApp();
  const { user } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  const filteredUsers = leaderboard.filter(
    (u) =>
      u.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(filterQuery.toLowerCase()) ||
      u.university?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Hierarchy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Weekly peer rankings based on quiz accuracy, contributions, and streaks.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-primary-50 border border-primary-100 text-xs font-bold text-primary-700 font-mono self-start sm:self-auto">
          Fall Semester 2026
        </div>
      </div>

      {/* Top 3 Clean Podium Cards (Nextplate Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rank 2 (Silver) */}
        {top2 && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between order-2 md:order-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  🥈 #2 Rank
                </span>
                <span className="text-xs text-slate-500 font-mono font-bold">{top2.accuracy}% Acc</span>
              </div>
              <div className="flex items-center gap-3.5 mb-3">
                <img
                  src={top2.avatar}
                  alt={top2.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{top2.name}</h4>
                  <span className="text-xs text-primary-600 font-mono font-semibold">@{top2.username}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 truncate">{top2.university}</p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold">{top2.tier}</span>
              <span className="text-base font-extrabold font-mono text-slate-900">{top2.xp} XP</span>
            </div>
          </div>
        )}

        {/* Rank 1 (Gold Champion) */}
        {top1 && (
          <div className="p-7 rounded-3xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white border-2 border-amber-400 shadow-hover flex flex-col justify-between order-1 md:order-2">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>🥇 #1 Champion</span>
                </span>
                <span className="text-xs text-amber-800 font-mono font-bold">{top1.accuracy}% Acc</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={top1.avatar}
                  alt={top1.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">{top1.name}</h4>
                  <span className="text-xs text-amber-700 font-mono font-bold">@{top1.username}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium truncate">{top1.university}</p>
            </div>
            <div className="pt-4 mt-4 border-t border-amber-200/60 flex items-center justify-between">
              <span className="text-xs text-amber-800 font-bold">{top1.tier}</span>
              <span className="text-xl font-black font-mono text-amber-600">{top1.xp} XP</span>
            </div>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3 && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between order-3 md:order-3">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-coral-50 text-coral-600 border border-coral-100">
                  🥉 #3 Rank
                </span>
                <span className="text-xs text-slate-500 font-mono font-bold">{top3.accuracy}% Acc</span>
              </div>
              <div className="flex items-center gap-3.5 mb-3">
                <img
                  src={top3.avatar}
                  alt={top3.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{top3.name}</h4>
                  <span className="text-xs text-primary-600 font-mono font-semibold">@{top3.username}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 truncate">{top3.university}</p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold">{top3.tier}</span>
              <span className="text-base font-extrabold font-mono text-slate-900">{top3.xp} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Roster Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <h3 className="text-base font-bold text-slate-900">
            Student Rankings
          </h3>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by student or university..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Rank</th>
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-5">University</th>
                <th className="py-3.5 px-5">Tier</th>
                <th className="py-3.5 px-5">Accuracy</th>
                <th className="py-3.5 px-5 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((student) => {
                const isCurrentUser = user && (user.id === student.id || user.username === student.username);
                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-primary-50/70 font-bold text-primary-950'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-4 px-5 whitespace-nowrap font-mono font-bold">
                      {student.trophy === 'gold' && '🥇 #1'}
                      {student.trophy === 'silver' && '🥈 #2'}
                      {student.trophy === 'bronze' && '🥉 #3'}
                      {!student.trophy && `#${student.rank}`}
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900">
                            {student.name}
                          </span>
                          <span className="text-[11px] text-primary-600 font-mono ml-1.5">
                            @{student.username}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-slate-600">
                      {student.university}
                    </td>

                    <td className="py-4 px-5 text-slate-600 font-medium">
                      {student.tier}
                    </td>

                    <td className="py-4 px-5 font-mono text-emerald-600 font-bold">
                      {student.accuracy}%
                    </td>

                    <td className="py-4 px-5 text-right font-mono font-extrabold text-slate-900">
                      {student.xp} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
