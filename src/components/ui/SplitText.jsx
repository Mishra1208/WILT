import React from 'react';
import { motion } from 'framer-motion';

export const SplitText = ({
  text = '',
  className = '',
  delay = 0.035,
  duration = 0.7,
  splitType = 'chars', // 'chars' | 'words'
  from = { opacity: 0, y: 35 },
  to = { opacity: 1, y: 0 },
  onAnimationComplete,
  tag = 'span',
  style = {}
}) => {
  if (!text) return null;

  const items = splitType === 'chars' ? Array.from(text) : text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay,
        delayChildren: 0.05,
      },
    },
  };

  const childVariants = {
    hidden: { ...from },
    visible: {
      ...to,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1], // smooth power3.out bezier curve
      },
    },
  };

  const Component = motion[tag] || motion.span;

  return (
    <Component
      className={`inline-block overflow-visible ${className}`}
      style={{ overflow: 'visible', ...style }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      onAnimationComplete={onAnimationComplete}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          className="inline-block overflow-visible"
          style={{
            whiteSpace: item === ' ' ? 'pre' : 'inherit',
            display: 'inline-block',
            overflow: 'visible',
            paddingBottom: '0.08em' // ensures descenders like 'y', 'g', 'p' are 100% visible
          }}
        >
          {item === ' ' ? '\u00A0' : item}
          {splitType === 'words' && index < items.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Component>
  );
};

export default SplitText;
