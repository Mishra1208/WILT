import React, { useEffect, useState } from 'react';

/**
 * Big result ring for the end of a quiz. Fills from empty to the score once,
 * right after the student finishes — the one celebratory moment in the flow.
 */
export const ScoreRing = ({ score = 0, total = 5, size = 168 }) => {
  const [shown, setShown] = useState(0);
  const pct = total > 0 ? score / total : 0;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  useEffect(() => {
    const t = setTimeout(() => setShown(pct), 120);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          style={{ stroke: 'rgb(var(--accent-400))', transition: 'stroke-dashoffset 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" role="img" aria-label={`${score} out of ${total} correct`}>
        <div className="font-display text-5xl font-extrabold text-white leading-none">
          {score}
          <span className="text-2xl text-white/60">/{total}</span>
        </div>
        <div className="text-xs text-primary-100/80 mt-1.5">correct</div>
      </div>
    </div>
  );
};

export default ScoreRing;
