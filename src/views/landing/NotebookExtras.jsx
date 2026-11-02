import React, { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../lib/gsap';

// ---------- Typing example notes (shown while the box is empty) ----------

const EXAMPLES = [
  "Why EBITDA isn't the same as cash flow…",
  'Repo rate vs reverse repo, in one line…',
  'How a SIP averages out market ups and downs…',
  'BFS finds the shortest path; DFS goes deep first…',
  'Why a weaker rupee helps IT exporters…'
];

/** Types each example out, pauses, deletes it, moves to the next. */
export const useTypingExample = (active) => {
  const [state, setState] = useState({ i: 0, len: 0, deleting: false });

  useEffect(() => {
    if (!active || prefersReducedMotion()) return undefined;
    const full = EXAMPLES[state.i];
    let delay = state.deleting ? 28 : 55 + Math.random() * 45;
    let next;
    if (!state.deleting && state.len < full.length) next = { ...state, len: state.len + 1 };
    else if (!state.deleting) { next = { ...state, deleting: true }; delay = 1800; }
    else if (state.len > 0) next = { ...state, len: state.len - 1 };
    else { next = { i: (state.i + 1) % EXAMPLES.length, len: 0, deleting: false }; delay = 400; }
    const t = setTimeout(() => setState(next), delay);
    return () => clearTimeout(t);
  }, [active, state]);

  if (prefersReducedMotion()) return EXAMPLES[0];
  return EXAMPLES[state.i].slice(0, state.len);
};

// ---------- Today's prompt ----------

const PROMPTS = [
  'One formula you used this week',
  "A term from today's lecture, in your own words",
  'Something in the news that surprised you',
  'A mistake you made and what it taught you',
  'One shortcut that saves you time',
  'Explain a concept as if to a first-year',
  'A number every finance student should know',
  'Two things people often confuse, and the difference',
  'One thing a company did this week, and why',
  'An interview question you can now answer',
  'A ratio or chart you finally understand',
  'Something you learned outside class today',
  'A rule of thumb from a professor or senior',
  'One idea from a book or podcast'
];

/** Same prompt for everyone on a given day; changes at midnight. */
export const todaysPrompt = () => {
  const now = new Date();
  const day = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  return PROMPTS[day % PROMPTS.length];
};

export const StickyPrompt = ({ onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`sticky-note group/prompt text-left w-[210px] sm:w-[230px] bg-highlight px-5 pt-6 pb-5 rotate-[4deg] hover:rotate-[1deg] hover:-translate-y-1 transition-transform duration-300 cursor-pointer shadow-[0_18px_30px_-18px_rgba(30,30,30,0.55)] ${className}`}
    title="Write about today's prompt"
  >
    {/* the pin */}
    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-marker-orange shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.18)]" aria-hidden="true" />
    <span className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/60">Today's prompt</span>
    <span className="mt-1.5 block font-hand text-[21px] leading-[1.2] text-ink">{todaysPrompt()}</span>
    <span className="mt-3 block text-[13px] font-semibold text-ink/70 group-hover/prompt:text-ink">Write about this →</span>
  </button>
);

// ---------- Notebook decorations ----------

/** Punched holes down the left edge of the page */
export const Holes = () => (
  <div className="pointer-events-none absolute left-3 sm:left-4 top-0 bottom-0 flex flex-col justify-evenly" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <span key={i} className="block w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-paper shadow-[inset_1px_2px_3px_rgba(30,30,30,0.25)]" />
    ))}
  </div>
);

/** Two strips of tape "holding" the page onto the orange paper */
export const Tape = () => (
  <>
    <span className="pointer-events-none absolute -top-3 left-14 sm:left-24 w-24 sm:w-28 h-7 bg-[#F4E7B5]/80 -rotate-[5deg] shadow-sm" aria-hidden="true" />
    <span className="pointer-events-none absolute -bottom-3 right-10 sm:right-24 w-24 sm:w-28 h-7 bg-[#F4E7B5]/80 rotate-[4deg] shadow-sm" aria-hidden="true" />
  </>
);
