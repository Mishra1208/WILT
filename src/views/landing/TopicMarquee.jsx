import React from 'react';
import { Sparkle } from './Doodles';

const DOTS = ['bg-marker-orange', 'bg-marker-green', 'bg-marker-blue', 'bg-ink'];

/** Yellow strip with an endless, slow row of topics students write about. */
export const TopicMarquee = ({ topics = [] }) => {
  const list = topics.length ? topics : ['Finance', 'Banking', 'Economics', 'Technology', 'Accounting', 'Marketing'];
  const row = [...list, ...list];
  return (
    <section className="bg-paper px-5 sm:px-8 pb-16">
      <div className="max-w-7xl mx-auto rounded-[28px] bg-highlight py-8 sm:py-10 overflow-hidden">
        <p className="text-center text-[15px] sm:text-[16px] font-medium text-ink/80">
          What students on WILT are learning about
        </p>
        <div className="mt-6 relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-[marquee_38s_linear_infinite] motion-reduce:animate-none">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-12 pr-12" aria-hidden={dup === 1}>
                {row.map((t, i) => (
                  <span key={`${dup}-${i}`} className="flex items-center gap-3 whitespace-nowrap text-[24px] sm:text-[28px] font-bold tracking-[-0.03em] text-ink">
                    {i % 5 === 2 ? <Sparkle className="w-5 h-5 text-marker-orange" /> : <span className={`w-3 h-3 rounded-full ${DOTS[i % DOTS.length]}`} />}
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopicMarquee;
