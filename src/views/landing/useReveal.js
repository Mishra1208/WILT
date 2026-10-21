import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

/**
 * Fades elements marked with data-reveal up into place as they scroll into view.
 * data-reveal="words" splits a heading into words that rise one after another.
 */
export const useReveal = (ref, deps = []) => {
  useLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal="words"]').forEach((el) => {
        if (!el.dataset.split) {
          const words = el.textContent.trim().split(/\s+/);
          el.innerHTML = words
            .map((w) => `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:0.08em;margin-bottom:-0.08em"><span class="rw" style="display:inline-block">${w}</span></span>`)
            .join(' ');
          el.dataset.split = '1';
        }
        gsap.from(el.querySelectorAll('.rw'), {
          yPercent: 105,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
      });

      gsap.set('[data-reveal="up"]', { opacity: 0 });
      ScrollTrigger.batch('[data-reveal="up"]', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(batch, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08 })
      });
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useReveal;
