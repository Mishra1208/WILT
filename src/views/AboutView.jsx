import React, { useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, PenLine, Plus, Minus, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { useReveal } from './landing/useReveal';
import { Sparkle, Squiggle, CurvyArrow, Smiley } from './landing/Doodles';
import ClosingCta from './landing/ClosingCta';
import narendraImg from '../assets/team/narendra.webp';
import avinendraImg from '../assets/team/avinendra.webp';
import kumarImg from '../assets/team/kumar.webp';

// Slightly uneven "cut paper" edges, one per card so they don't look stamped
const CUTS = [
  'polygon(3% 4%, 98% 0, 100% 95%, 0 100%)',
  'polygon(0 2%, 97% 5%, 100% 100%, 2% 96%)',
  'polygon(2% 0, 100% 4%, 98% 97%, 0 100%)'
];

const TEAM = [
  {
    name: 'Narendra Mishra',
    role: 'Lead Architect',
    school: 'Concordia University, Canada',
    cohort: "Concordia '26",
    photo: narendraImg,
    panel: 'bg-marker-orange',
    tilt: '-rotate-2',
    quote: 'Knowledge grows when shared. WILT makes continuous peer learning seamless, high-yield, and accessible to every engineering, finance, and tech student.',
    focus: 'Full-stack architecture & cloud'
  },
  {
    name: 'Avinendra Pratap Singh',
    role: 'Concept Architect',
    school: 'Symbiosis School of Banking & Finance, Pune',
    cohort: "SSBF '26",
    photo: avinendraImg,
    panel: 'bg-marker-green',
    tilt: 'rotate-1',
    quote: "Students shouldn't have to reread 500-page finance textbooks for one formula. WILT is built so SSBF peers can teach each other in 30 seconds.",
    focus: 'Banking & financial services'
  },
  {
    name: 'Karan Kumar',
    role: 'Platform Lead',
    school: 'Symbiosis School of Banking & Finance, Pune',
    cohort: "SSBF '26",
    photo: kumarImg,
    panel: 'bg-marker-blue',
    tilt: '-rotate-1',
    quote: "The secret to acing banking exams isn't cramming. It's active recall. We engineered WILT to turn financial revision into a fast, gamified habit.",
    focus: 'Banking & fintech systems'
  }
];

const STEPS = [
  { n: '01', title: 'Write one note', body: 'A formula, a shortcut or a concept you learned today, in two or three lines, with where you learned it.' },
  { n: '02', title: 'Take the weekly quiz', body: "Five questions from classmates' notes and the week's business news in Mint. No one writes them by hand." },
  { n: '03', title: 'Get sent back to the source', body: "Miss a question and WILT opens the exact note or story it came from, so the gap closes right away." },
  { n: '04', title: 'Climb the leaderboard', body: 'Every right answer earns XP. Build a streak and rise through your campus ranking.' }
];

const PILLARS = [
  { title: 'Small notes, every day', body: 'Thirty-second insights instead of three-hour slides. Small enough to write daily, specific enough to remember.', color: 'bg-marker-orange', mark: 'N' },
  { title: 'Recall, not rereading', body: 'The weekly quiz makes you pull answers out of memory, which is what actually makes them stick.', color: 'bg-highlight', mark: 'Q' },
  { title: 'News recruiters ask about', body: "Knowledge Quest gathers the week's business and finance stories from Mint, India and global, for placement prep.", color: 'bg-marker-green', mark: 'K' },
  { title: 'Terms in plain English', body: 'A dictionary of finance, accounting and tech terms explained the way a classmate would explain them.', color: 'bg-marker-blue', mark: 'D' }
];

const FAQS = [
  {
    q: 'Who is WILT for?',
    a: 'University students in finance, accounting, economics, business and computer science who want to learn a little every day and remember it, especially MBA students getting ready for placements.'
  },
  {
    q: 'How does "Did you forget about it? Read it here" work?',
    a: 'When you get a weekly quiz question wrong, WILT shows a link straight to the note or news story the question came from, with the relevant part highlighted.'
  },
  {
    q: 'Where does the business news come from?',
    a: "Knowledge Quest shows stories from Mint (livemint.com) with Mint's own summary. The full story always opens on Mint's site."
  },
  {
    q: 'Who started WILT?',
    a: 'Narendra Mishra (Concordia University, Canada), with Avinendra Pratap Singh and Karan Kumar (Symbiosis School of Banking & Finance, Pune).'
  }
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-6 py-6 text-left cursor-pointer group"
      >
        <span className="text-[19px] sm:text-[21px] font-semibold text-ink tracking-[-0.02em] group-hover:text-ink/80">{q}</span>
        <span className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-ink text-white' : 'bg-white text-ink border border-line'}`}>
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <p className="overflow-hidden text-[17px] leading-relaxed text-muted pr-14 pb-6">{a}</p>
      </div>
    </div>
  );
};

export const AboutView = () => {
  const { setCurrentView } = useApp();
  const root = useRef(null);
  useReveal(root);

  // Hero intro
  useLayoutEffect(() => {
    if (!root.current || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.a-word', { yPercent: 110, duration: 1, stagger: 0.05 })
        .from('.a-mark', { scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: 'power3.inOut' }, '-=0.5')
        .from('.a-fade', { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, '-=0.5')
        .from('.a-doodle', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(2)' }, '-=0.6');
    }, root);
    return () => ctx.revert();
  }, []);

  const Word = ({ children }) => (
    <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
      <span className="a-word inline-block">{children}</span>
    </span>
  );

  return (
    <div ref={root} className="bg-paper">
      {/* ---------- Hero ---------- */}
      <section className="relative px-5 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="a-fade flex items-center gap-2 text-marker-orange">
            <Sparkle className="w-5 h-5" />
            <span className="font-hand text-[20px] leading-none">Our story</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-ink font-semibold leading-[1.02] tracking-[-0.055em] text-[clamp(2.6rem,6vw,5rem)]">
            <Word>Built</Word> <Word>for</Word> <Word>students</Word> <Word>who</Word> <Word>learn</Word> <Word>in</Word>{' '}
            <span className="relative inline-block">
              <Word>minutes,</Word>
              <span className="a-mark absolute left-0 right-0 bottom-[0.06em] h-[0.3em] bg-highlight -z-10 rounded-sm" aria-hidden="true" />
            </span>{' '}
            <Word>not</Word> <Word>hours.</Word>
          </h1>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <p className="a-fade lg:col-span-7 text-[18px] sm:text-[20px] leading-relaxed text-muted max-w-2xl">
              WILT, short for <span className="text-ink font-semibold">What I Learned Today</span>, turns scattered notes and last-minute cramming into a small daily habit: write one thing you learned, get quizzed on it next week, and see what your classmates are learning too.
            </p>
            <div className="a-fade lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
              <button
                onClick={() => setCurrentView('notepad')}
                className="btn-marker px-7 py-3.5 text-[16px] font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <PenLine className="w-4 h-4" /> Write today's note
              </button>
              <button
                onClick={() => setCurrentView('discover')}
                className="px-7 py-3.5 rounded-full border-2 border-ink text-ink text-[16px] font-semibold hover:bg-ink hover:text-white transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                Browse notes <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <Squiggle className="a-doodle hidden md:block absolute right-10 top-16 w-28 text-marker-green" />
        <Smiley className="a-doodle hidden lg:block absolute right-40 top-40 w-14 text-ink" />
      </section>

      {/* ---------- Team ---------- */}
      <section className="px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="font-hand text-[20px] text-marker-orange">The people</div>
              <h2 data-reveal="words" className="mt-2 text-ink font-semibold tracking-[-0.045em] leading-[1.05] text-[clamp(2rem,4.2vw,3.4rem)]">
                Meet the team behind WILT
              </h2>
            </div>
            <p data-reveal="up" className="max-w-sm text-[17px] text-muted leading-relaxed">
              One builder in Montreal, two finance students in Pune, and one shared idea: learning sticks when you share it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {TEAM.map((p, i) => (
              <article key={p.name} data-reveal="up" className="group">
                {/* Portrait on a cut-paper panel */}
                <div className={`relative h-[340px] sm:h-[380px] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 ${p.tilt} group-hover:rotate-0`}>
                  <div className={`absolute inset-0 ${p.panel}`} style={{ clipPath: CUTS[i] }} aria-hidden="true" />
                  <img
                    src={p.photo}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[92%] w-auto max-w-[95%] object-contain object-bottom drop-shadow-[0_18px_24px_rgba(30,30,30,0.25)] transition-transform duration-500 ease-out group-hover:scale-[1.03] origin-bottom"
                    style={{ clipPath: CUTS[i] }}
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-ink text-[13px] font-semibold shadow-sm">
                    {p.role}
                  </span>
                </div>

                <div className="pt-6 space-y-3">
                  <div>
                    <h3 className="text-[24px] font-semibold text-ink tracking-[-0.03em] leading-tight">{p.name}</h3>
                    <div className="mt-1.5 flex items-start gap-2 text-[15px] text-muted">
                      <GraduationCap className="w-4 h-4 mt-0.5 shrink-0 text-ink" />
                      <span>{p.school}</span>
                    </div>
                  </div>
                  <blockquote className="font-hand text-[19px] leading-snug text-ink/85 border-l-[3px] border-highlight pl-4">
                    “{p.quote}”
                  </blockquote>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="px-3 py-1 rounded-full bg-white border border-line text-[13px] font-medium text-ink">{p.focus}</span>
                    <span className="px-3 py-1 rounded-full bg-ink text-white text-[13px] font-medium">{p.cohort}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto rounded-[32px] bg-white px-6 sm:px-12 py-14 sm:py-16">
          <div className="max-w-2xl">
            <div className="font-hand text-[20px] text-marker-green">The loop</div>
            <h2 data-reveal="words" className="mt-2 text-ink font-semibold tracking-[-0.045em] leading-[1.05] text-[clamp(2rem,4.2vw,3.4rem)]">
              How WILT works
            </h2>
          </div>
          <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {STEPS.map((s) => (
              <li key={s.n} data-reveal="up" className="border-t-2 border-ink pt-5">
                <div className="text-[44px] font-semibold tracking-[-0.05em] leading-none text-ink/15 tabular-nums">{s.n}</div>
                <h3 className="mt-4 text-[20px] font-semibold text-ink tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- What makes it work ---------- */}
      <section className="px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end gap-3">
            <h2 data-reveal="words" className="text-ink font-semibold tracking-[-0.045em] leading-[1.05] text-[clamp(2rem,4.2vw,3.4rem)]">
              What makes it stick
            </h2>
            <CurvyArrow className="hidden sm:block w-14 text-marker-orange rotate-[100deg] mb-2" />
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {PILLARS.map((p) => (
              <div key={p.title} data-reveal="up" className="card-lift rounded-[28px] bg-white p-7 sm:p-8 flex gap-5">
                <div className={`w-14 h-14 shrink-0 rounded-2xl ${p.color} flex items-center justify-center text-ink text-[22px] font-bold`}>
                  {p.mark}
                </div>
                <div>
                  <h3 className="text-[21px] font-semibold text-ink tracking-[-0.02em]">{p.title}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-muted">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="font-hand text-[20px] text-marker-blue">Good questions</div>
            <h2 data-reveal="words" className="mt-2 text-ink font-semibold tracking-[-0.045em] leading-[1.05] text-[clamp(2rem,4.2vw,3.4rem)]">
              Asked often
            </h2>
          </div>
          <div className="lg:col-span-8 border-t border-line" data-reveal="up">
            {FAQS.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </div>
      </section>

      <ClosingCta onWrite={() => setCurrentView('notepad')} />
    </div>
  );
};

export default AboutView;
