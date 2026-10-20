import './GradientText.css';

/**
 * Animated gradient text — pure CSS.
 * (Previously powered by framer-motion, which added ~450 KB of JavaScript to the
 * first page load just to slide a background gradient.)
 */
export default function GradientText({
  children,
  className = '',
  colors = ['#5227FF', '#FF9FFC', '#B497CF'],
  animationSpeed = 8,
  showBorder = false,
  direction = 'horizontal',
  pauseOnHover = false,
  yoyo = true
}) {
  const gradientAngle =
    direction === 'horizontal' ? 'to right' : direction === 'vertical' ? 'to bottom' : 'to bottom right';
  // Duplicate first color at the end for seamless looping
  const gradientColors = [...colors, colors[0]].join(', ');

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize: direction === 'vertical' ? '100% 300%' : direction === 'diagonal' ? '300% 300%' : '300% 100%',
    backgroundRepeat: 'repeat',
    animationName: direction === 'vertical' ? 'wilt-gradient-y' : 'wilt-gradient-x',
    animationDuration: `${animationSpeed * (yoyo ? 2 : 1)}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationDirection: yoyo ? 'alternate' : 'normal'
  };

  return (
    <div
      className={`animated-gradient-text ${showBorder ? 'with-border' : ''} ${pauseOnHover ? 'pause-on-hover' : ''} ${className}`}
    >
      {showBorder && <div className="gradient-overlay" style={gradientStyle} />}
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </div>
  );
}
