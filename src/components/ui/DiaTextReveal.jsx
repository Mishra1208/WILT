import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function DiaTextReveal({
  text = 'WILT',
  className = '',
  colors = ['#4F46E5', '#6366F1', '#38BDF8', '#00b4db', '#2774ae', '#4338CA', '#818CF8'],
  delay = 0.08,
}) {
  const characters = Array.from(text);
  const gradientString = `linear-gradient(120deg, ${colors.join(', ')})`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 25,
      filter: 'blur(10px)',
      scale: 0.85,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 120,
      },
    },
  };

  return (
    <motion.div
      className={cn('inline-flex items-center justify-center select-none overflow-visible px-4 sm:px-6 py-2', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => {
        // Optical kerning adjustments for visual balance
        const kerningClass = char === 'T' ? '-ml-2 sm:-ml-4 pr-0.5 sm:pr-1' : 'px-0.5 sm:px-1.5';
        const bgPosPercent = (index / Math.max(characters.length - 1, 1)) * 100;

        return (
          <motion.span
            key={index}
            variants={letterVariants}
            style={{
              backgroundImage: gradientString,
              backgroundSize: '400% 100%',
              backgroundPosition: `${bgPosPercent}% 50%`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
            className={cn('inline-block transition-transform duration-300 hover:scale-105 animate-aurora', kerningClass)}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </motion.div>
  );
}

export default DiaTextReveal;
