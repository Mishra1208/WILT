import React from 'react';

// Hand-drawn marks in the spirit of a student's notebook margin.
const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' };

export const Sparkle = ({ className = '' }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <path {...base} strokeWidth="2.4" d="M16 3c1 7 3 10 13 13-10 3-12 6-13 13-1-7-3-10-13-13 10-3 12-6 13-13z" fill="currentColor" />
  </svg>
);

export const Squiggle = ({ className = '' }) => (
  <svg viewBox="0 0 120 24" className={className} aria-hidden="true">
    <path {...base} strokeWidth="3" d="M3 14c10-12 18 10 28-1s18-11 28 0 18 11 28 0 18-11 30-1" />
  </svg>
);

export const CurvyArrow = ({ className = '' }) => (
  <svg viewBox="0 0 90 70" className={className} aria-hidden="true">
    <path {...base} strokeWidth="2.6" d="M6 8c22 4 46 16 52 34 3 10-6 16-12 10-6-7 6-18 20-12 7 3 12 9 16 18" />
    <path {...base} strokeWidth="2.6" d="M73 50l9 9 2-12" />
  </svg>
);

export const Smiley = ({ className = '' }) => (
  <svg viewBox="0 0 70 50" className={className} aria-hidden="true">
    <circle cx="26" cy="12" r="3.5" fill="currentColor" />
    <circle cx="44" cy="10" r="3.5" fill="currentColor" />
    <path {...base} strokeWidth="3" d="M8 22c10 22 42 26 56 2" />
  </svg>
);

export const Scribble = ({ className = '' }) => (
  <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
    <path {...base} strokeWidth="2.6" d="M4 30c8-20 14-24 16-16s-4 18 4 10 12-22 18-16 2 18 14 10" />
  </svg>
);

export const Underline = ({ className = '' }) => (
  <svg viewBox="0 0 300 18" preserveAspectRatio="none" className={className} aria-hidden="true">
    <path {...base} strokeWidth="5" d="M4 12c60-8 140-10 292-4" />
  </svg>
);
