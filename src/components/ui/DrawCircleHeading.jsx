import React from 'react';
import { motion } from 'framer-motion';

export const DrawCircleHeading = ({ 
  prefix = "The", 
  highlight = "4 Core Pillars", 
  suffix = "of WILT" 
}) => {
  return (
    <div className="text-center relative py-2">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-normal inline-block">
        {prefix && <span>{prefix} </span>}
        <span className="relative inline-block mx-1.5 my-1">
          <span className="relative z-10 px-2 py-0.5 bg-gradient-to-r from-primary-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
            {highlight}
          </span>
          <svg
            viewBox="0 0 286 73"
            fill="none"
            preserveAspectRatio="none"
            className="absolute -left-3 -right-3 -top-2 -bottom-2 w-[calc(100%+24px)] h-[calc(100%+16px)] pointer-events-none overflow-visible z-0"
          >
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{
                duration: 1.3,
                ease: [0.42, 0, 0.58, 1],
              }}
              d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
              stroke="#F59E0B"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {suffix && <span> {suffix}</span>}
      </h2>
    </div>
  );
};
