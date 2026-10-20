import React from 'react';

export const TIERS = [
  { name: 'Novice', min: 0 },
  { name: 'Curious Scholar', min: 600 },
  { name: 'Fellow Analyst', min: 1200 },
  { name: 'Grand Scholar', min: 1800 },
  { name: 'Mastermind', min: 2500 }
];

/** Where an XP total sits inside its tier, and what's next. */
export const getTierProgress = (xp = 0) => {
  const value = Math.max(0, Number(xp) || 0);
  let idx = 0;
  TIERS.forEach((t, i) => {
    if (value >= t.min) idx = i;
  });
  const current = TIERS[idx];
  const next = TIERS[idx + 1] || null;
  const span = next ? next.min - current.min : 1;
  const progress = next ? Math.min(1, (value - current.min) / span) : 1;
  return { current, next, progress, toNext: next ? next.min - value : 0 };
};

/**
 * Circular XP meter. Animates its arc when the value changes
 * (a response to earning XP), never on its own.
 */
export const XpRing = ({ xp = 0, size = 64, stroke = 6, track = 'rgba(255,255,255,0.14)', children, className = '' }) => {
  const { progress } = getTierProgress(xp);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const gradientId = React.useId().replace(/:/g, '');

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={`xp-${gradientId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: 'rgb(var(--accent-400))' }} />
            <stop offset="100%" style={{ stopColor: 'rgb(var(--accent-600))' }} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#xp-${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};

export default XpRing;
