import React, { useLayoutEffect, useRef } from 'react';
import { PenLine, ArrowUpRight, Check, Trophy } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { Sparkle, CurvyArrow, Smiley, Scribble } from './Doodles';

// Organic, slightly uneven panels (like paper cut with scissors)
const CUT_A = 'polygon(4% 2%, 100% 0, 97% 97%, 0 100%)';
const CUT_B = 'polygon(0 4%, 96% 0, 100% 100%, 3% 95%)';
const CUT_C = 'polygon(2% 0, 100% 5%, 98% 100%, 0 96%)';

export const LandingHero = ({ onWrite, onBrowse, notesCount = 0, avatars = [], quizLive = true }) => {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!root.current || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.h-word', { yPercent: 110, duration: 1, stagger: 0.06 })
        .from('.h-fade', { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, '-=0.6')
        .from('.h-panel', { y: 60, rotate: 0, opacity: 0, duration: 1.1, stagger: 0.12 }, '-=0.8')
        .from('.h-doodle', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(2)' }, '-=0.6');

      // gentle idle float on the collage pieces
      gsap.utils.toArray('.h-float').forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 10 : -10, duration: 3 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.4 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const Word = ({ children }) => (
    <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
      <span className="h-word inline-block">{children}</span>
    </span>
  );

  return (
    <section ref={root} className="relative bg-paper overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 sm:pt-36 pb-20 sm:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8 items-center">
        {/* Copy */}
        <div className="lg:col-span-6 relative z-10">
          {quizLive && (
            <div className="h-fade flex items-center gap-2 text-marker-orange">
              <Sparkle className="w-5 h-5" />
              <span className="font-hand text-[20px] leading-none">This week's quiz is live</span>
            </div>
          )}

          <h1 className="mt-5 text-ink font-semibold leading-[1.02] tracking-[-0.055em] text-[clamp(2.7rem,6vw,4.9rem)]">
            <Word>Write</Word> <Word>down</Word> <Word>one</Word> <Word>thing</Word> <Word>you</Word>{' '}
            <span className="relative inline-block">
              <Word>learned</Word>
              <span className="absolute left-0 right-0 bottom-[0.06em] h-[0.32em] bg-highlight -z-10 rounded-sm" aria-hidden="true" />
            </span>{' '}
            <Word>today.</Word>
          </h1>

          <p className="h-fade mt-6 max-w-lg text-[18px] sm:text-[19px] leading-relaxed text-muted">
            A few lines and a source is all it takes. Next week it comes back as a quiz, so it actually sticks, for you and everyone on campus.
          </p>

          <div className="h-fade mt-9 flex flex-col sm:flex-row gap-3">
            <button onClick={onWrite} className="btn-marker px-7 py-4 text-[17px] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer">
              <PenLine className="w-5 h-5" />
              Write today's note
            </button>
            <button onClick={onBrowse} className="btn-iris px-7 py-4 text-[17px] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer">
              Explore notes
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>

          {avatars.length > 0 && (
            <div className="h-fade mt-10 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {avatars.slice(0, 5).map((a, i) => (
                  <img key={i} src={a} alt="" className="w-9 h-9 rounded-full border-2 border-paper bg-white" />
                ))}
              </div>
              <p className="text-[15px] text-muted">
                <span className="font-semibold text-ink">{notesCount}</span> notes shared by students so far
              </p>
            </div>
          )}
        </div>

        {/* Collage */}
        <div className="lg:col-span-6 relative h-[440px] sm:h-[520px]" aria-hidden="true">
          {/* big orange panel with a note card */}
          <div className="h-panel h-float absolute left-[6%] top-[6%] w-[64%] h-[62%] bg-marker-orange rotate-[-3deg]" style={{ clipPath: CUT_A }} />
          <div className="h-panel h-float absolute left-[12%] top-[14%] w-[56%] rounded-2xl bg-white p-5 shadow-[0_30px_60px_-30px_rgba(30,30,30,0.45)] rotate-[-3deg]">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-marker-brown">
              <span className="w-2 h-2 rounded-full bg-marker-orange" /> Corporate Finance
            </div>
            <div className="mt-2 text-[22px] font-semibold tracking-[-0.03em] leading-tight text-ink">Why EBITDA isn't cash flow</div>
            <div
              className="mt-3 text-[15px] leading-[30px] text-muted"
              style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 29px, #EEEAE1 29px, #EEEAE1 30px)' }}
            >
              It skips capex and cash stuck in receivables, so a company can look strong and still run dry.
            </div>
            <div className="mt-3 text-[13px] text-muted">investopedia.com</div>
          </div>

          {/* blue panel with a quiz answer */}
          <div className="h-panel h-float absolute right-[0%] top-[0%] w-[42%] h-[34%] bg-marker-blue rotate-[4deg]" style={{ clipPath: CUT_B }} />
          <div className="h-panel h-float absolute right-[4%] top-[8%] w-[36%] rounded-2xl bg-white p-4 shadow-[0_24px_50px_-26px_rgba(30,30,30,0.45)] rotate-[4deg]">
            <div className="text-[12px] font-semibold text-[#1D5FB8]">Question 3 of 5</div>
            <div className="mt-2 rounded-xl border-2 border-marker-green bg-[#DDF5E6] px-3 py-2 text-[13px] font-semibold text-[#15803D] flex items-center justify-between gap-2">
              Inflation cools <Check className="w-4 h-4 shrink-0" />
            </div>
            <div className="mt-2 text-[13px] font-bold text-ink">+30 XP</div>
          </div>

          {/* green panel with tier progress */}
          <div className="h-panel h-float absolute right-[2%] bottom-[2%] w-[48%] h-[38%] bg-marker-green rotate-[-2deg]" style={{ clipPath: CUT_C }} />
          <div className="h-panel h-float absolute right-[7%] bottom-[9%] w-[40%] rounded-2xl bg-white p-4 shadow-[0_24px_50px_-26px_rgba(30,30,30,0.45)] rotate-[-2deg]">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-highlight flex items-center justify-center">
                <Trophy className="w-5 h-5 text-marker-brown" />
              </span>
              <div>
                <div className="text-[15px] font-bold text-ink leading-none">Fellow Analyst</div>
                <div className="text-[12px] text-muted mt-1">120 XP to Grand Scholar</div>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-paper overflow-hidden">
              <div className="h-full w-[78%] bg-marker-green rounded-full" />
            </div>
          </div>

          {/* yellow sticky note */}
          <div className="h-panel h-float hidden sm:block absolute left-[2%] bottom-[4%] w-[34%] bg-highlight p-4 rotate-[5deg] shadow-[0_20px_40px_-24px_rgba(30,30,30,0.4)]">
            <div className="font-hand text-[18px] leading-snug text-ink">Repo rate up → loans cost more → inflation cools</div>
          </div>

          <Smiley className="h-doodle absolute left-[0%] top-[0%] w-16 text-ink" />
          <CurvyArrow className="h-doodle hidden sm:block absolute left-[44%] bottom-[30%] w-20 text-ink" />
          <Sparkle className="h-doodle absolute right-[42%] top-[2%] w-7 text-highlight" />
          <Scribble className="h-doodle absolute right-[-2%] top-[40%] w-14 text-marker-orange" />
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
