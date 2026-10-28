import React, { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { Sparkle, CurvyArrow, Smiley, Squiggle } from './Doodles';

// Slightly uneven "cut paper" edge for the panel behind the writing slate
const CUT = 'polygon(2% 3%, 99% 0, 100% 96%, 0 100%)';

/**
 * The first screen: the question on the left and the writing slate (passed in
 * as children) on the right, framed on an orange cut-paper panel. Writing a
 * note is the heart of WILT, so it is the first thing a visitor can do.
 */
export const LandingHero = ({ onBrowse, notesCount = 0, avatars = [], children }) => {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!root.current || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.h-word', { yPercent: 110, duration: 1, stagger: 0.06 })
        .from('.h-mark', { scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: 'power3.inOut' }, '-=0.5')
        .from('.h-fade', { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, '-=0.5')
        .from('.h-panel', { y: 50, rotate: -6, opacity: 0, duration: 1.1 }, '-=0.9')
        .from('.h-slate', { y: 70, opacity: 0, duration: 1.1 }, '-=0.95')
        .from('.h-doodle', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(2)' }, '-=0.5');
    }, root);
    return () => ctx.revert();
  }, []);

  const Word = ({ children: w }) => (
    <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
      <span className="h-word inline-block">{w}</span>
    </span>
  );

  return (
    <section ref={root} className="relative bg-paper overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 sm:pt-36 pb-20 sm:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* The question */}
        <div className="lg:col-span-5 relative z-10">
          <div className="h-fade flex items-center gap-2 text-marker-orange">
            <Sparkle className="w-5 h-5" />
            <span className="font-hand text-[20px] leading-none">One note a day</span>
          </div>

          <h1 className="mt-5 text-ink font-semibold leading-[1.0] tracking-[-0.055em] text-[clamp(3rem,6.4vw,5.4rem)]">
            <Word>What</Word> <Word>did</Word> <Word>you</Word>{' '}
            <span className="relative inline-block">
              <Word>learn</Word>
              <span className="h-mark absolute left-0 right-0 bottom-[0.06em] h-[0.3em] bg-highlight -z-10 rounded-sm" aria-hidden="true" />
            </span>{' '}
            <Word>today?</Word>
          </h1>

          <p className="h-fade mt-6 max-w-md text-[18px] sm:text-[19px] leading-relaxed text-muted">
            Write it in two or three lines and add where you learned it. Next week it comes back as a quiz, so it sticks, for you and everyone on campus.
          </p>

          <div className="h-fade mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button
              onClick={onBrowse}
              className="px-6 py-3 rounded-full border-2 border-ink text-ink text-[15px] font-semibold hover:bg-ink hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              See what others learned <ArrowUpRight className="w-4 h-4" />
            </button>

            {notesCount > 0 && (
              <div className="flex items-center gap-3">
                {avatars.length > 0 && (
                  <div className="flex -space-x-2.5">
                    {avatars.slice(0, 4).map((a, i) => (
                      <img key={i} src={a} alt="" className="w-8 h-8 rounded-full border-2 border-paper bg-white" />
                    ))}
                  </div>
                )}
                <span className="text-[15px] text-muted">
                  <span className="font-semibold text-ink">{notesCount}</span> notes shared
                </span>
              </div>
            )}
          </div>
        </div>

        {/* The writing slate */}
        <div className="lg:col-span-7 relative">
          <div
            className="h-panel absolute -inset-x-2 sm:-inset-x-5 -top-6 sm:-top-8 -bottom-6 sm:-bottom-8 bg-marker-orange rotate-[-1.5deg]"
            style={{ clipPath: CUT }}
            aria-hidden="true"
          />

          <div className="h-doodle hidden sm:flex absolute -top-16 left-6 items-end gap-1 text-ink" aria-hidden="true">
            <span className="font-hand text-[22px] leading-none -rotate-3">start here</span>
            <CurvyArrow className="w-14 rotate-[20deg] translate-y-3" />
          </div>
          <Sparkle className="h-doodle absolute -top-10 right-10 w-8 text-highlight" />
          <Smiley className="h-doodle hidden sm:block absolute -bottom-16 -left-4 w-16 text-ink" />
          <Squiggle className="h-doodle hidden sm:block absolute -bottom-12 right-6 w-24 text-marker-green" />

          <div id="write" className="h-slate relative scroll-mt-28 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
