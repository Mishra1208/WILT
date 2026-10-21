import React, { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

const TEXT =
  "Most of what you learn this week, you'll forget by next week. WILT turns one short note a day into something you";

/**
 * One big sentence that "reads itself" as you scroll: each word brightens in turn,
 * and the last word gets the highlighter.
 */
export const Manifesto = () => {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!root.current) return undefined;
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.mf-word');
      const hl = root.current.querySelector('.mf-hl');
      if (prefersReducedMotion()) {
        gsap.set(words, { opacity: 1 });
        gsap.set(hl, { backgroundSize: '100% 100%' });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 55%', scrub: 0.5 }
      });
      tl.to(words, { opacity: 1, stagger: 0.1, ease: 'none' }).to(hl, { backgroundSize: '100% 100%', duration: 0.6, ease: 'none' });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-10 py-28 sm:py-40">
        <p className="font-semibold text-ink leading-[1.06] tracking-[-0.05em] text-[clamp(2.1rem,5.2vw,4.6rem)]">
          {TEXT.split(' ').map((w, i) => (
            <span key={i} className="mf-word opacity-[0.12]">
              {w}{' '}
            </span>
          ))}
          <span
            className="mf-word mf-hl opacity-[0.12] px-[0.05em]"
            style={{
              backgroundImage: 'linear-gradient(#FFD66B, #FFD66B)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0 85%',
              backgroundSize: '0% 100%'
            }}
          >
            keep.
          </span>
        </p>
      </div>
    </section>
  );
};

export default Manifesto;
