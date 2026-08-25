import React, { useState } from 'react';
import { SplitText } from './SplitText';

export const MaskedHeading = () => {
  const [animateScribble, setAnimateScribble] = useState(false);

  return (
    <div className="text-center max-w-3xl mx-auto space-y-4 select-none py-4 overflow-visible">
      {/* Top Floating Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold shadow-sm hover:scale-105 transition-transform">
        <span className="w-2 h-2 rounded-full bg-primary-400 animate-ping" />
        <span className="tracking-wide">Today's Knowledge Slate</span>
      </div>

      {/* REACTBITS SPLIT-TEXT + MASKED HEADING */}
      <div className="relative inline-block px-4 overflow-visible">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.2] sm:leading-[1.18] text-slate-900 pb-2 sm:pb-3 overflow-visible">
          {/* Staggered Rising Characters for "What did you" */}
          <SplitText
            text="What did you "
            splitType="chars"
            delay={0.03}
            duration={0.65}
            from={{ opacity: 0, y: 35 }}
            to={{ opacity: 1, y: 0 }}
            className="inline-block mr-2 overflow-visible"
          />

          {/* Staggered Rising Gradient Masked Characters for "learn today?" with extra bottom padding */}
          <span className="relative inline-block pb-3 sm:pb-4 overflow-visible">
            <SplitText
              text="learn today?"
              splitType="chars"
              delay={0.035}
              duration={0.7}
              from={{ opacity: 0, y: 35 }}
              to={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-600 via-primary-600 to-cyan-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] inline-block overflow-visible"
              onAnimationComplete={() => setAnimateScribble(true)}
            />

            {/* HAND-DRAWN BLUE INK PEN SCRIBBLE UNDERLINE */}
            <svg
              className="absolute -bottom-1 sm:bottom-0 left-0 w-full h-5 sm:h-6 overflow-visible pointer-events-none z-10"
              viewBox="0 0 260 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Primary Fountain Blue Ink Gradient */}
                <linearGradient id="blueInkStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="40%" stopColor="#4F46E5" />
                  <stop offset="75%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>

                {/* Secondary Cyan-Indigo Ink Flourish */}
                <linearGradient id="cyanInkAccent" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#6366F1" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.8" />
                </linearGradient>

                {/* Subtle Ink Glow */}
                <filter id="inkGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#3B82F6" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Main Calligraphic Fountain Blue Ink Stroke */}
              <path
                d="M 5,14 Q 70,4 135,11 Q 195,17 255,8"
                stroke="url(#blueInkStroke)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#inkGlow)"
                className={`transition-all duration-1000 ease-out ${
                  animateScribble
                    ? 'stroke-dashoffset-0 opacity-100'
                    : 'opacity-0'
                }`}
                style={{
                  strokeDasharray: 300,
                  strokeDashoffset: animateScribble ? 0 : 300,
                }}
              />

              {/* Second Hand-drawn Ink Line Overlap */}
              <path
                d="M 15,18 Q 85,9 155,15 Q 215,7 245,13"
                stroke="url(#cyanInkAccent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-all duration-1000 delay-200 ease-out ${
                  animateScribble
                    ? 'stroke-dashoffset-0 opacity-90'
                    : 'opacity-0'
                }`}
                style={{
                  strokeDasharray: 300,
                  strokeDashoffset: animateScribble ? 0 : 300,
                }}
              />
            </svg>
          </span>
        </h1>
      </div>

      {/* Subtitle with generous top margin */}
      <p className="text-xs sm:text-base text-slate-500 max-w-xl mx-auto font-medium leading-relaxed pt-2">
        Jot down a 30-second formula, mental model, or insight. It will be indexed into the campus feed & weekly recall challenge.
      </p>
    </div>
  );
};

export default MaskedHeading;
