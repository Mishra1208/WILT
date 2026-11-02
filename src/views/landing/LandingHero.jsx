import React, { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { Sparkle, CurvyArrow, Smiley, Squiggle } from './Doodles';

// Slightly uneven "cut paper" edge for the panel behind the writing slate
const CUT = 'polygon(1.5% 3%, 99% 0, 100% 97%, 0 100%)';

// The giant wordmark: each letter sits at its own small angle, like stickers
const LETTERS = [
  { ch: 'W', tilt: '-rotate-[4deg]' },
  { ch: 'I', tilt: 'rotate-[3deg]' },
  { ch: 'L', tilt: '-rotate-[2deg]' },
  { ch: 'T', tilt: 'rotate-[4deg]' }
];

// "What I Learned Today", with each initial picked out in a marker colour
const MEANING = [
  { initial: 'W', rest: 'hat', mark: 'bg-marker-orange' },
  { initial: 'I', rest: '', mark: 'bg-highlight' },
  { initial: 'L', rest: 'earned', mark: 'bg-marker-green' },
  { initial: 'T', rest: 'oday', mark: 'bg-marker-blue' }
];

/**
 * First screen of the home page.
 * 1. A welcome: "Hello, welcome to" + a giant WILT wordmark + what it stands for,
 *    so first-time visitors remember the name and get the idea.
 * 2. Below it, centred, the writing slate (passed in as children) on an orange
 *    cut-paper panel — writing a note is the heart of WILT.
 */
export const LandingHero = ({ onBrowse, notesCount = 0, avatars = [], children }) => {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!root.current || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.w-hello', { y: 24, opacity: 0, rotate: -6, duration: 0.9 })
        .from('.w-letter', { yPercent: 60, rotation: (i) => [-18, 14, -12, 20][i % 4], opacity: 0, duration: 1.1, stagger: 0.09, ease: 'back.out(1.7)', clearProps: 'transform,opacity' }, '-=0.5')
        .from('.w-dot', { scale: 0, duration: 0.6, ease: 'back.out(3)' }, '-=0.6')
        .from('.w-mean', { y: 18, opacity: 0, duration: 0.7, stagger: 0.07 }, '-=0.5')
        .from('.w-fade', { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, '-=0.4')
        .from('.w-doodle', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(2)' }, '-=0.6');

      // The slate rises in as it scrolls into view
      gsap.from('.h-panel', { y: 60, rotate: -4, opacity: 0, duration: 1.1, scrollTrigger: { trigger: '.h-panel', start: 'top 90%', once: true } });
      gsap.from('.h-slate', { y: 80, opacity: 0, duration: 1.1, scrollTrigger: { trigger: '.h-panel', start: 'top 90%', once: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-paper overflow-hidden">
      {/* ---------- Welcome ---------- */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-28 sm:pt-36 pb-14 sm:pb-20 text-center">
        <Squiggle className="w-doodle hidden md:block absolute left-[8%] top-40 w-28 text-marker-green" />
        <Sparkle className="w-doodle absolute right-[10%] top-32 sm:top-36 w-8 sm:w-10 text-highlight" />
        <Smiley className="w-doodle hidden md:block absolute right-[7%] top-[52%] w-16 text-ink" />
        <Sparkle className="w-doodle hidden md:block absolute left-[12%] top-[58%] w-6 text-marker-orange" />

        <p className="w-hello inline-block font-hand text-[26px] sm:text-[34px] leading-none text-marker-orange -rotate-2">
          Hello, welcome to
        </p>

        {/* Giant wordmark */}
        <h1 className="relative mt-4 sm:mt-6 flex items-end justify-center leading-none select-none" aria-label="WILT">
          {LETTERS.map((l) => (
            <span key={l.ch} className={`inline-block ${l.tilt} transition-transform duration-300 hover:-translate-y-2 hover:rotate-0`}>
              <span
                className="w-letter inline-block font-extrabold text-ink tracking-[-0.06em] text-[clamp(7rem,27vw,20rem)] leading-[0.82]"
                aria-hidden="true"
              >
                {l.ch}
              </span>
            </span>
          ))}
          <span
            className="w-dot inline-block w-[clamp(1.6rem,5.5vw,4.2rem)] h-[clamp(1.6rem,5.5vw,4.2rem)] rounded-full bg-marker-orange mb-[0.06em] ml-[0.04em] shrink-0"
            aria-hidden="true"
          />
        </h1>

        {/* What it stands for */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2 text-[22px] sm:text-[32px] font-semibold tracking-[-0.03em] text-ink">
          {MEANING.map((m) => (
            <span key={m.initial} className="w-mean inline-flex items-baseline">
              <span className={`inline-flex items-center justify-center ${m.mark} text-ink rounded-md px-[0.18em] mr-[0.04em] leading-[1.15]`}>
                {m.initial}
              </span>
              {m.rest}
            </span>
          ))}
        </div>

        <p className="w-fade mt-6 mx-auto max-w-xl text-[18px] sm:text-[20px] leading-relaxed text-muted">
          Write one thing you learned today. Get quizzed on it next week. See what everyone on campus is learning.
        </p>

        <div className="w-fade mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <a
            href="#write"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('write')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="btn-marker px-7 py-3.5 text-[16px] font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            Write today's note
          </a>
          <button
            onClick={onBrowse}
            className="px-7 py-3.5 rounded-full border-2 border-ink text-ink text-[16px] font-semibold hover:bg-ink hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            See what others learned <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {notesCount > 0 && (
          <div className="w-fade mt-6 flex items-center justify-center gap-3">
            {avatars.length > 0 && (
              <div className="flex -space-x-2.5">
                {avatars.slice(0, 4).map((a, i) => (
                  <img key={i} src={a} alt="" className="w-8 h-8 rounded-full border-2 border-paper bg-white" />
                ))}
              </div>
            )}
            <span className="text-[15px] text-muted">
              <span className="font-semibold text-ink">{notesCount}</span> notes shared so far
            </span>
          </div>
        )}
      </div>

      {/* ---------- The writing slate ---------- */}
      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="text-center mb-12 sm:mb-14">
          <h2 className="text-ink font-semibold tracking-[-0.045em] leading-[1.05] text-[clamp(2rem,4.5vw,3.4rem)]">
            What did you{' '}
            <span className="relative inline-block">
              learn
              <span className="absolute left-0 right-0 bottom-[0.06em] h-[0.3em] bg-highlight -z-10 rounded-sm" aria-hidden="true" />
            </span>{' '}
            today?
          </h2>
        </div>

        <div className="relative">
          <div
            className="h-panel absolute -inset-x-2 sm:-inset-x-6 -top-6 sm:-top-8 -bottom-6 sm:-bottom-8 bg-marker-orange rotate-[-1.2deg]"
            style={{ clipPath: CUT }}
            aria-hidden="true"
          />
          <div className="hidden sm:flex absolute -top-16 -left-2 items-end gap-1 text-ink" aria-hidden="true">
            <span className="font-hand text-[22px] leading-none -rotate-3">start here</span>
            <CurvyArrow className="w-14 rotate-[20deg] translate-y-3" />
          </div>

          <div id="write" className="h-slate relative scroll-mt-28 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
