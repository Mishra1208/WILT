import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

// Product previews (illustrations of the real screens)
const NotePreview = () => (
  <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_30px_60px_-30px_rgba(30,30,30,0.5)]">
    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-marker-brown">
      <span className="w-2 h-2 rounded-full bg-marker-orange" /> Corporate Finance
    </div>
    <div className="mt-2 text-[22px] font-semibold tracking-[-0.03em] leading-tight text-ink">Why EBITDA isn't cash flow</div>
    <div
      className="mt-3 text-[15px] leading-[30px] text-muted"
      style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 29px, #EEEAE1 29px, #EEEAE1 30px)' }}
    >
      It ignores capex and cash stuck in receivables, so strong EBITDA can still mean an empty bank account
      <span className="inline-block w-[2px] h-4 bg-ink align-middle ml-0.5 animate-pulse" />
    </div>
    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#DDF5E6] px-3 py-1 text-[13px] font-medium text-[#15803D]">
      <ShieldCheck className="w-3.5 h-3.5" /> investopedia.com
    </div>
  </div>
);

const QuizPreview = () => (
  <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_30px_60px_-30px_rgba(30,30,30,0.5)]">
    <div className="flex items-center justify-between text-[13px] font-semibold">
      <span className="text-[#1D5FB8]">Question 3 of 5</span>
      <span className="text-ink">+30 XP</span>
    </div>
    <div className="mt-3 flex gap-1.5">
      {[1, 1, 2, 0, 0].map((d, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full ${d === 1 ? 'bg-marker-green' : d === 2 ? 'bg-marker-blue' : 'bg-paper'}`} />
      ))}
    </div>
    <div className="mt-4 text-[19px] font-semibold tracking-[-0.02em] leading-snug text-ink">
      The central bank raises the repo rate. What happens next?
    </div>
    <div className="mt-4 space-y-2 text-[14px]">
      <div className="px-4 py-3 rounded-full border border-line text-ink">Banks get more cash to lend</div>
      <div className="px-4 py-3 rounded-full border-2 border-marker-green bg-[#DDF5E6] text-[#15803D] font-semibold flex items-center justify-between">
        Borrowing costs more, inflation cools <Check className="w-4 h-4" />
      </div>
      <div className="px-4 py-3 rounded-full border border-line text-ink">Stock prices must rise</div>
    </div>
  </div>
);

const ClimbPreview = () => (
  <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_30px_60px_-30px_rgba(30,30,30,0.5)]">
    <div className="text-[20px] font-semibold tracking-[-0.02em] text-ink">This week on campus</div>
    <ol className="mt-4 space-y-1.5">
      {[
        ['1', '@quantum_mind', '1,240', 'bg-highlight'],
        ['2', '@you', '1,180', 'bg-[#FFE3D6]'],
        ['3', '@orbit_scholar', '960', '']
      ].map(([r, h, xp, bg]) => (
        <li key={r} className={`flex items-center gap-3 px-4 py-2.5 rounded-full ${bg}`}>
          <span className="w-5 font-bold text-ink tabular-nums">{r}</span>
          <span className="flex-1 font-medium text-ink">{h}</span>
          <span className="font-semibold text-ink tabular-nums">{xp}</span>
        </li>
      ))}
    </ol>
    <div className="mt-4 text-[13px] text-muted">60 XP to Fellow Analyst</div>
    <div className="mt-1.5 h-2 rounded-full bg-paper overflow-hidden">
      <div className="h-full w-[82%] rounded-full bg-marker-orange" />
    </div>
  </div>
);

const STEPS = [
  {
    n: '01',
    title: 'Write down what you learned',
    body: 'Two or three lines about something from class, an internship or the news, plus where it came from. Takes about a minute.',
    panel: 'bg-marker-orange',
    cut: 'polygon(3% 0, 100% 3%, 97% 100%, 0 97%)',
    Preview: NotePreview
  },
  {
    n: '02',
    title: 'Get quizzed on it next week',
    body: "Your notes, your classmates' notes and the week's business news come back as five quick questions. Miss one and we link you to the source.",
    panel: 'bg-marker-blue',
    cut: 'polygon(0 3%, 97% 0, 100% 97%, 3% 100%)',
    Preview: QuizPreview
  },
  {
    n: '03',
    title: 'Climb the campus leaderboard',
    body: 'Every correct answer is worth 30 XP. Keep showing up and you move up the tiers, and remember far more of what you study.',
    panel: 'bg-marker-green',
    cut: 'polygon(2% 2%, 100% 0, 98% 98%, 0 100%)',
    Preview: ClimbPreview
  }
];

/** "How it works": three steps, each with a coloured panel showing that part of WILT. */
export const HowItWorks = () => (
  <section className="bg-white py-24 sm:py-32" aria-label="How WILT works">
    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="font-hand text-[22px] text-marker-orange" data-reveal="up">How it works</div>
        <h2 className="mt-2 text-ink font-semibold leading-[1.05] tracking-[-0.05em] text-[clamp(2.2rem,4.6vw,3.6rem)]" data-reveal="words">
          Learn it once. Remember it for good.
        </h2>
        <p className="mt-5 text-[18px] text-muted leading-relaxed" data-reveal="up">
          WILT is built on active recall: the fastest way to make something stick is to write it down and be asked about it later.
        </p>
      </div>

      <div className="mt-20 space-y-20 sm:space-y-28">
        {STEPS.map(({ n, title, body, panel, cut, Preview }) => (
          <div key={n} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="border-l-2 border-ink/80 pl-6 sm:pl-8" data-reveal="up">
              <div className="font-hand text-[22px] text-marker-orange">Step {n}</div>
              <h3 className="mt-2 text-[clamp(1.8rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-ink">{title}</h3>
              <p className="mt-4 text-[17px] sm:text-[18px] leading-relaxed text-muted max-w-md">{body}</p>
            </div>
            <div className={`relative ${panel} px-6 sm:px-12 py-12 sm:py-16 flex justify-center`} style={{ clipPath: cut }} data-reveal="up">
              <Preview />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
