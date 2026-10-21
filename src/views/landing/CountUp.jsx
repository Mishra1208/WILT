import React, { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

/** A number that counts up once when it scrolls into view. */
export const CountUp = ({ value = 0, className = '' }) => {
  const el = useRef(null);

  useLayoutEffect(() => {
    if (!el.current) return undefined;
    const target = Number(value) || 0;
    if (prefersReducedMotion()) {
      el.current.textContent = target.toLocaleString();
      return undefined;
    }
    const ctx = gsap.context(() => {
      const obj = { n: 0 };
      gsap.to(obj, {
        n: target,
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: el.current, start: 'top 90%', once: true },
        onUpdate: () => {
          if (el.current) el.current.textContent = Math.round(obj.n).toLocaleString();
        }
      });
    }, el);
    return () => ctx.revert();
  }, [value]);

  return (
    <span ref={el} className={`tabular-nums ${className}`}>
      0
    </span>
  );
};

export default CountUp;
