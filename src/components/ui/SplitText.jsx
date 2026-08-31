import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '../../lib/utils';

export const SplitText = ({
  text = 'WILT',
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: rootMargin });
  const characters = Array.from(text);

  // Map power3.out cubic-bezier or custom ease
  const easeCurve = ease === 'power3.out' ? [0.215, 0.61, 0.355, 1] : ease;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay / 1000,
        delayChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: from.opacity ?? 0, 
      y: from.y ?? 40 
    },
    visible: {
      opacity: to.opacity ?? 1,
      y: to.y ?? 0,
      transition: {
        duration,
        ease: easeCurve,
      },
    },
  };

  const Tag = motion[tag] || motion.p;

  return (
    <Tag
      ref={ref}
      className={cn('inline-flex items-center justify-center select-none overflow-visible', className)}
      style={{ textAlign }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      onAnimationComplete={onLetterAnimationComplete}
    >
      {characters.map((char, index) => {
        // Optical kerning adjustments for visual balance
        const kerningClass = char === 'T' ? '-ml-2 sm:-ml-4 pr-0.5 sm:pr-1' : 'px-0.5 sm:px-1.5';

        return (
          <motion.span
            key={index}
            variants={letterVariants}
            className={cn('inline-block', kerningClass)}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </Tag>
  );
};

export default SplitText;
