import React from 'react';
import { PenLine } from 'lucide-react';
import { Sparkle, Squiggle, Smiley } from './Doodles';

export const ClosingCta = ({ onWrite }) => (
  <section className="bg-paper px-5 sm:px-8 pb-24">
    <div className="relative max-w-7xl mx-auto rounded-[32px] bg-ink text-white px-6 sm:px-16 py-16 sm:py-24 text-center overflow-hidden" data-reveal="up">
      <Squiggle className="absolute left-8 top-10 w-28 text-marker-orange hidden sm:block" />
      <Sparkle className="absolute right-12 top-12 w-8 text-highlight" />
      <Smiley className="absolute right-16 bottom-10 w-16 text-marker-green hidden sm:block" />
      <div className="font-hand text-[22px] text-highlight">Your turn</div>
      <h2 className="mt-3 mx-auto max-w-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-[clamp(2.2rem,5vw,4rem)]">
        Your brain will thank you next week.
      </h2>
      <p className="mt-5 mx-auto max-w-xl text-[18px] text-white/70 leading-relaxed">
        Write one thing you learned today. It takes a minute, and it's the easiest way to stop forgetting.
      </p>
      <button onClick={onWrite} className="btn-marker mt-9 px-8 py-4 text-[17px] font-semibold inline-flex items-center gap-2 cursor-pointer">
        <PenLine className="w-5 h-5" />
        Write today's note
      </button>
    </div>
  </section>
);

export default ClosingCta;
