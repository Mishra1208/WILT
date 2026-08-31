import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function MaskedLottieText({
  text = 'WILT',
  lottieUrl = 'https://lottie.host/1fb7413b-2b7d-4ad7-af18-85a2e7c6d21a/Dcg12TPIZL.lottie',
  className = '',
  strokeColor = '#0F172A',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={cn('relative flex items-center justify-center w-full max-w-4xl mx-auto select-none', className)}
    >
      <svg 
        className="w-full h-auto max-h-[160px] sm:max-h-[220px] overflow-visible" 
        viewBox="0 0 600 160"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* SVG Mask defining the exact WILT text shape */}
          <mask id="wilt-lottie-text-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="160">
            {/* Black background masks out everything outside */}
            <rect x="0" y="0" width="600" height="160" fill="#000000" />
            {/* White text reveals the Lottie animation inside text */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'Outfit', 'Syne', 'Plus Jakarta Sans', sans-serif"
              fontWeight="900"
              fontSize="128"
              letterSpacing="-3"
              fill="#ffffff"
            >
              {text}
            </text>
          </mask>
        </defs>

        {/* ForeignObject containing the live Lottie Animation masked by WILT text */}
        <foreignObject x="0" y="0" width="600" height="160" mask="url(#wilt-lottie-text-mask)">
          <div className="w-full h-full flex items-center justify-center scale-125 sm:scale-150">
            <DotLottieReact
              src={lottieUrl}
              loop
              autoplay
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </foreignObject>

        {/* Crisp Outer Stroke Outline Over Contours for High Contrast Legibility */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Outfit', 'Syne', 'Plus Jakarta Sans', sans-serif"
          fontWeight="900"
          fontSize="128"
          letterSpacing="-3"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3.5"
          className="opacity-50"
        >
          {text}
        </text>
      </svg>
    </motion.div>
  );
}

export default MaskedLottieText;
