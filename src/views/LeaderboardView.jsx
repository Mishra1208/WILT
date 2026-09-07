import React, { useState, useEffect } from 'react';
import { Trophy, Search, Sparkles, UserCheck, ArrowDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const LeaderboardView = () => {
  const { leaderboard, setCurrentView } = useApp();
  const { user } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  // Reset pagination when search filter changes
  useEffect(() => {
    setVisibleCount(10);
  }, [filterQuery]);

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  const getCleanHandle = (u) => {
    if (!u) return '';
    const raw = u.username || u.name || 'anonymous';
    return `@${raw.replace(/^@/, '')}`;
  };

  const activeUserHandle = getCleanHandle(user);
  const activeUserRankItem = leaderboard.find((u) => {
    const h = getCleanHandle(u).toLowerCase();
    return (user && user.id === u.id) || (activeUserHandle && h === activeUserHandle.toLowerCase());
  });

  const activeUserRank = activeUserRankItem ? activeUserRankItem.rank : null;
  const activeUserXP = activeUserRankItem ? activeUserRankItem.xp : (user?.xp ?? 0);

  // Filter Users across handle, rank number (#1, 1), university, or tier
  const filteredUsers = leaderboard.filter((u) => {
    const handle = getCleanHandle(u).toLowerCase();
    const rankStr = `${u.rank || ''}`;
    const formattedRankStr = `#${u.rank || ''}`;
    const uni = (u.university || '').toLowerCase();
    const tier = (u.tier || '').toLowerCase();
    const q = filterQuery.toLowerCase().trim();

    if (!q) return true;
    return (
      handle.includes(q) ||
      rankStr === q ||
      formattedRankStr === q ||
      uni.includes(q) ||
      tier.includes(q)
    );
  });

  const displayedUsers = filteredUsers.slice(0, visibleCount);

  const handleScrollToMyRank = () => {
    const element = document.getElementById('active-user-rank-row');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Campus Hierarchy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Live peer rankings based on real Supabase quiz attempts and active recall accuracy.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 font-mono self-start sm:self-auto shadow-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Audience Feed</span>
        </div>
      </div>

      {/* Active User Rank Highlight Banner */}
      {activeUserHandle && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-primary-500/15 border-2 border-amber-400/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm sm:text-base shadow-sm shrink-0">
              {activeUserRank ? `#${activeUserRank}` : '0 XP'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">Your Live Standing</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  {activeUserXP > 0 ? 'Active Player' : 'Unranked'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold font-mono text-slate-900 mt-0.5">
                {activeUserHandle}{' '}
                <span className="text-xs font-semibold text-slate-600">
                  ({activeUserXP} XP · {activeUserXP > 0 ? (user?.tier || 'Curious Scholar') : 'Take a quiz to enter live rankings!'})
                </span>
              </h3>
            </div>
          </div>

          {activeUserRank && (
            <button
              onClick={handleScrollToMyRank}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Jump to My Rank Row</span>
            </button>
          )}
        </div>
      )}

      {/* Top 3 Clean Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rank 2 (Silver) */}
        {top2 ? (
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
                  alt={getCleanHandle(top2)}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                />
                <div>
                  <h4 className="text-base font-bold font-mono text-slate-900">
                    {getCleanHandle(top2)}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">Live Audience Scholar</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 truncate">{top2.university}</p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold">{top2.tier}</span>
              <span className="text-base font-extrabold font-mono text-slate-900">{top2.xp} XP</span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-slate-50/70 border border-dashed border-slate-200 shadow-xs flex flex-col justify-between order-2 md:order-1 text-center py-8">
            <div className="space-y-2">
              <span className="text-2xl">🥈</span>
              <h4 className="text-sm font-bold text-slate-700">Open #2 Rank Slot</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">Attempt today's weekly quiz to claim the #2 spot!</p>
            </div>
            <button onClick={() => setCurrentView('quiz')} className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs cursor-pointer">Take Quiz Now</button>
          </div>
        )}

        {/* Rank 1 (Gold Champion) */}
        {top1 ? (
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
                  alt={getCleanHandle(top1)}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <h4 className="text-lg font-extrabold font-mono text-amber-700">
                    {getCleanHandle(top1)}
                  </h4>
                  <span className="text-[11px] text-amber-800/80 font-medium">Live Audience Scholar</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium truncate">{top1.university}</p>
            </div>
            <div className="pt-4 mt-4 border-t border-amber-200/60 flex items-center justify-between">
              <span className="text-xs text-amber-800 font-bold">{top1.tier}</span>
              <span className="text-xl font-black font-mono text-amber-600">{top1.xp} XP</span>
            </div>
          </div>
        ) : (
          <div className="p-7 rounded-3xl bg-gradient-to-b from-amber-500/10 to-white border-2 border-amber-300 shadow-sm flex flex-col justify-between order-1 md:order-2 text-center py-8">
            <div className="space-y-2">
              <span className="text-3xl">🥇</span>
              <h4 className="text-base font-bold text-amber-950">Open #1 Champion Slot</h4>
              <p className="text-xs text-amber-900/80 max-w-xs mx-auto">Be the first live audience member to attempt the quiz and claim #1!</p>
            </div>
            <button onClick={() => setCurrentView('quiz')} className="mt-4 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm cursor-pointer">Claim #1 Spot 🏆</button>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3 ? (
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between order-3 md:order-3">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  🥉 #3 Rank
                </span>
                <span className="text-xs text-slate-500 font-mono font-bold">{top3.accuracy}% Acc</span>
              </div>
              <div className="flex items-center gap-3.5 mb-3">
                <img
                  src={top3.avatar}
                  alt={getCleanHandle(top3)}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                />
                <div>
                  <h4 className="text-base font-bold font-mono text-slate-900">
                    {getCleanHandle(top3)}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">Live Audience Scholar</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 truncate">{top3.university}</p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold">{top3.tier}</span>
              <span className="text-base font-extrabold font-mono text-slate-900">{top3.xp} XP</span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-slate-50/70 border border-dashed border-slate-200 shadow-xs flex flex-col justify-between order-3 md:order-3 text-center py-8">
            <div className="space-y-2">
              <span className="text-2xl">🥉</span>
              <h4 className="text-sm font-bold text-slate-700">Open #3 Rank Slot</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {activeUserRank ? "Compete in today's weekly quiz to boost your ranking!" : "Attempt today's weekly quiz to claim the #3 spot!"}
              </p>
            </div>
            <button onClick={() => setCurrentView('quiz')} className="mt-4 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
              {activeUserRank ? "Practice Quiz for XP" : "Take Quiz Now"}
            </button>
          </div>
        )}
      </div>

      {/* Roster Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Live Student Rankings ({filteredUsers.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search handle, rank (#1), or campus..."
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Rank</th>
                <th className="py-3.5 px-5">Student Handle</th>
                <th className="py-3.5 px-5">University</th>
                <th className="py-3.5 px-5">Tier</th>
                <th className="py-3.5 px-5">Accuracy</th>
                <th className="py-3.5 px-5 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedUsers.map((student) => {
                const handle = getCleanHandle(student);
                const isCurrentUser = (user && user.id === student.id) || (activeUserHandle && handle.toLowerCase() === activeUserHandle.toLowerCase());

                return (
                  <tr
                    key={student.id}
                    id={isCurrentUser ? 'active-user-rank-row' : undefined}
                    className={cn(
                      "transition-all duration-200",
                      isCurrentUser
                        ? "bg-amber-100/70 border-l-4 border-l-amber-500 font-bold text-slate-950 shadow-xs"
                        : "hover:bg-slate-50/80"
                    )}
                  >
                    <td className="py-4 px-5 whitespace-nowrap font-mono font-bold">
                      {student.rank === 1 ? '🥇 #1' : student.rank === 2 ? '🥈 #2' : student.rank === 3 ? '🥉 #3' : `#${student.rank}`}
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={handle}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-bold font-mono",
                            isCurrentUser ? "text-amber-950 text-sm font-black" : "text-primary-700"
                          )}>
                            {handle}
                          </span>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase shadow-2xs">
                              ⭐ YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-slate-600 font-medium">
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

        {/* Load More Rankings Button (+5 increment) */}
        {filteredUsers.length > visibleCount && (
          <div className="p-4 border-t border-slate-100 flex justify-center bg-slate-50/50">
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-extrabold text-xs shadow-xs hover:shadow-md hover:border-primary-300 hover:text-primary-600 transition-all flex items-center gap-2 cursor-pointer group"
            >
              <span>Load More Rankings (+5 remaining)</span>
              <ArrowDown className="w-3.5 h-3.5 text-primary-600 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default LeaderboardView;
