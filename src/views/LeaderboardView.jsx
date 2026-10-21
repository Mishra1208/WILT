import React, { useState, useEffect } from 'react';
import { Trophy, Search, Sparkles, UserCheck, ArrowDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { PageHero, HeroAction } from '../components/widgets/PageHero';
import { XpRing } from '../components/widgets/XpRing';

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
    <div className="px-5 sm:px-8 py-8 sm:py-10 max-w-6xl mx-auto space-y-8 pb-16">
      
      <PageHero
        icon={Trophy}
        title="Leaderboard"
        description="Everyone who has taken the weekly quiz, ranked by XP. Accuracy is lifetime correct answers out of all answered."
        aside={
          <HeroAction onClick={() => setCurrentView('quiz')} icon={Sparkles}>Take this week's quiz</HeroAction>
        }
      >
        {/* Podium: block height encodes the place */}
        <div className="grid grid-cols-3 items-end gap-2 sm:gap-4 max-w-2xl pt-2">
          {[
            { entry: top2, place: 2, block: 'h-16 sm:h-24 bg-[#E2E2DF]' },
            { entry: top1, place: 1, block: 'h-24 sm:h-36 bg-highlight' },
            { entry: top3, place: 3, block: 'h-12 sm:h-16 bg-[#E9D5BF]' }
          ].map(({ entry, place, block }) => (
            <div key={place} className="flex flex-col items-center text-center min-w-0">
              {entry ? (
                <>
                  <img
                    src={entry.avatar}
                    alt=""
                    className={`rounded-full bg-haze border border-line ${place === 1 ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-11 h-11 sm:w-14 sm:h-14'}`}
                  />
                  <div className="mt-2 text-sm sm:text-[15px] font-semibold text-ink truncate max-w-full">{getCleanHandle(entry)}</div>
                  <div className="text-sm text-muted tabular-nums">{entry.xp} XP · {entry.accuracy}%</div>
                </>
              ) : (
                <>
                  <div className={`rounded-full border border-dashed border-ink/25 ${place === 1 ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-11 h-11 sm:w-14 sm:h-14'}`} />
                  <div className="mt-2 text-sm sm:text-[15px] font-medium text-muted">Open</div>
                  <button onClick={() => setCurrentView('quiz')} className="text-sm font-semibold text-primary-700 hover:underline underline-offset-4 cursor-pointer">
                    Claim it
                  </button>
                </>
              )}
              <div className={`mt-3 w-full rounded-t-md flex items-start justify-center pt-2 ${block}`}>
                <span className="text-lg sm:text-2xl font-bold text-ink/70 tabular-nums">{place}</span>
              </div>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Your standing */}
      {activeUserHandle && (
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <XpRing xp={activeUserXP} size={60} stroke={6} track="rgb(var(--brand-100))">
              <span className="text-sm font-bold text-ink">{activeUserRank ? `#${activeUserRank}` : '—'}</span>
            </XpRing>
            <div className="min-w-0">
              <div className="text-sm text-slate-600">Your standing</div>
              <div className="text-lg font-semibold text-ink truncate">{activeUserHandle}</div>
              <div className="text-sm text-slate-600">
                {activeUserXP > 0
                  ? <><span className="font-semibold text-ink">{activeUserXP} XP</span> · {user?.tier || 'Novice'}</>
                  : 'Take a quiz to get on the board.'}
              </div>
            </div>
          </div>
          {activeUserRank ? (
            <button
              onClick={handleScrollToMyRank}
              className="px-4 py-2.5 rounded-md border border-line hover:bg-haze text-ink font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              <UserCheck className="w-4 h-4" />
              Find me in the list
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('quiz')}
              className="btn-iris px-4 py-2.5 rounded-md font-semibold text-sm cursor-pointer shrink-0"
            >
              Start quiz
            </button>
          )}
        </div>
      )}

      {/* Roster Table */}
      <div className="rounded-xl bg-white border border-line overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-ink">
              All students <span className="text-slate-500 font-medium text-base">({filteredUsers.length})</span>
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by name, rank or campus"
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-ink placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Rank</th>
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-5 hidden md:table-cell">University</th>
                <th className="py-3.5 px-5 hidden md:table-cell">Tier</th>
                <th className="py-3.5 px-5">Accuracy</th>
                <th className="py-3.5 px-5 text-right">XP</th>
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
                        ? "bg-[#FFF8DC] shadow-[inset_3px_0_0_#F9E177]"
                        : "hover:bg-slate-50/80"
                    )}
                  >
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center justify-center w-7 h-7 rounded-md text-sm font-semibold tabular-nums",
                        student.rank === 1 ? "bg-highlight text-ink" : student.rank === 2 ? "bg-[#E2E2DF] text-ink" : student.rank === 3 ? "bg-[#E9D5BF] text-ink" : "text-muted"
                      )}>
                        {student.rank}
                      </span>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img loading="lazy" decoding="async"
                          src={student.avatar}
                          alt={handle}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-semibold",
                            isCurrentUser ? "text-ink" : "text-ink"
                          )}>
                            {handle}
                          </span>
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.5 rounded bg-ink text-white text-xs font-semibold">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-slate-600 font-medium hidden md:table-cell">
                      {student.university}
                    </td>

                    <td className="py-4 px-5 text-slate-600 font-medium hidden md:table-cell">
                      {student.tier}
                    </td>

                    <td className="py-4 px-5 text-muted tabular-nums">
                      {student.accuracy}%
                    </td>

                    <td className="py-4 px-5 text-right font-semibold text-ink tabular-nums">
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
              className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-ink font-semibold text-sm hover:border-primary-300 hover:text-primary-700 transition-colors flex items-center gap-2 cursor-pointer group"
            >
              <span>Show 5 more</span>
              <ArrowDown className="w-3.5 h-3.5 text-primary-600 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default LeaderboardView;
