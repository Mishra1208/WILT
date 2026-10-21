import React from 'react';
import { Brain, Newspaper, BookOpen, Trophy, ArrowUpRight } from 'lucide-react';
import { CountUp } from './CountUp';

/** Bento of what WILT gives you, with live numbers and the leaderboard top 3. */
export const WhyWilt = ({ go, stats, topThree = [] }) => (
  <section className="bg-white py-24 sm:py-32">
    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      <div className="max-w-2xl">
        <div className="font-hand text-[22px] text-marker-orange" data-reveal="up">Why WILT</div>
        <h2 className="mt-2 text-ink font-semibold leading-[1.05] tracking-[-0.05em] text-[clamp(2.2rem,4.6vw,3.6rem)]" data-reveal="words">
          Everything you need to keep what you learn
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-6 gap-5">
        {/* Numbers */}
        <div className="md:col-span-6 rounded-[28px] bg-marker-green p-8 sm:p-10 grid grid-cols-3 gap-4" data-reveal="up">
          {stats.map(([v, l]) => (
            <div key={l}>
              <CountUp value={v} className="block font-semibold text-ink tracking-[-0.06em] leading-none text-[clamp(2.6rem,7vw,5.5rem)]" />
              <div className="mt-2 text-[15px] sm:text-[18px] font-medium text-ink/80">{l}</div>
            </div>
          ))}
        </div>

        <button onClick={() => go('quiz')} className="group md:col-span-3 text-left rounded-[28px] bg-[#FFE3D6] p-8 cursor-pointer" data-reveal="up">
          <Brain className="w-9 h-9 text-marker-orange" />
          <h3 className="mt-10 text-[26px] font-semibold tracking-[-0.035em] text-ink">A weekly quiz that's actually about you</h3>
          <p className="mt-3 text-[17px] text-muted leading-relaxed">Questions come from real notes and the week's news, and every miss links back to the source.</p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink group-hover:underline underline-offset-4">Take the quiz <ArrowUpRight className="w-4 h-4" /></span>
        </button>

        <button onClick={() => go('knowledge-quest')} className="group md:col-span-3 text-left rounded-[28px] bg-[#E1EEFC] p-8 cursor-pointer" data-reveal="up">
          <Newspaper className="w-9 h-9 text-marker-blue" />
          <h3 className="mt-10 text-[26px] font-semibold tracking-[-0.035em] text-ink">Business news in 30 seconds</h3>
          <p className="mt-3 text-[17px] text-muted leading-relaxed">What happened, why it matters and what to say about it in a placement interview.</p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink group-hover:underline underline-offset-4">Open Knowledge Quest <ArrowUpRight className="w-4 h-4" /></span>
        </button>

        <button onClick={() => go('dictionary')} className="group md:col-span-2 text-left rounded-[28px] bg-[#FFF4D1] p-8 cursor-pointer" data-reveal="up">
          <BookOpen className="w-9 h-9 text-marker-brown" />
          <h3 className="mt-10 text-[24px] font-semibold tracking-[-0.035em] text-ink">A dictionary written by students</h3>
          <p className="mt-3 text-[16px] text-muted leading-relaxed">Plain-English definitions, with formulas where they help.</p>
        </button>

        <div className="md:col-span-4 rounded-[28px] bg-ink text-white p-8" data-reveal="up">
          <div className="flex items-center justify-between">
            <Trophy className="w-9 h-9 text-highlight" />
            <button onClick={() => go('leaderboard')} className="text-[15px] font-semibold text-white/80 hover:text-white inline-flex items-center gap-1.5 cursor-pointer">
              Full leaderboard <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <h3 className="mt-8 text-[24px] font-semibold tracking-[-0.035em]">This week's top scholars</h3>
          {topThree.length > 0 ? (
            <ol className="mt-5 space-y-2">
              {topThree.map((u, i) => (
                <li key={u.id} className="flex items-center gap-4 rounded-full bg-white/[0.07] px-5 py-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-bold text-ink ${['bg-highlight', 'bg-white', 'bg-[#FFC4A8]'][i]}`}>{i + 1}</span>
                  <span className="flex-1 min-w-0 truncate text-[16px] font-medium">@{u.username}</span>
                  <span className="text-[16px] font-semibold tabular-nums">{u.xp} XP</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-[17px] text-white/70">Nobody yet. Take this week's quiz to claim the top spot.</p>
          )}
        </div>
      </div>
    </div>
  </section>
);

export default WhyWilt;
