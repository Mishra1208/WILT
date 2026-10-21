import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const QA = [
  ['Is WILT free?', 'Yes. Reading notes, writing them, the weekly quiz and the leaderboard are all free for students.'],
  ['Do I need an account?', "You can browse notes and the dictionary without one. To post, take the quiz or earn XP, sign in with your email or Google. It takes a few seconds."],
  ['What counts as a source?', 'Anything someone else could check: a link, a textbook, a paper, or where you heard it, like "Prof. Rao, Econ 201 lecture". Every note needs one.'],
  ['How does XP work?', 'Each correct answer in the weekly quiz is worth 30 XP, so a perfect round is 150. XP moves you up the tiers, from Novice to Mastermind.'],
  ['Who can see my notes?', 'Notes are shared with everyone on WILT. You appear under your WILT username, not your real name or email.']
];

export const Faq = () => {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center">
          <div className="font-hand text-[22px] text-marker-orange" data-reveal="up">Questions</div>
          <h2 className="mt-2 text-ink font-semibold leading-[1.05] tracking-[-0.05em] text-[clamp(2.2rem,4.6vw,3.6rem)]" data-reveal="words">
            Good to know
          </h2>
        </div>
        <div className="mt-12 space-y-3">
          {QA.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} className="rounded-[22px] bg-white border border-line" data-reveal="up">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                >
                  <span className="text-[18px] sm:text-[19px] font-semibold tracking-[-0.02em] text-ink">{q}</span>
                  <span className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-marker-orange rotate-45' : 'bg-paper'}`}>
                    <Plus className="w-5 h-5 text-ink" />
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-[17px] leading-relaxed text-muted">{a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
