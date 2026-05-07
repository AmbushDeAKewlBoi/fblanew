import { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({ value, duration = 1.2, className = '' }) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let frame = 0;
    let hasAnimated = false;

    const animate = () => {
      const start = performance.now();
      const durationMs = duration * 1000;

      const tick = (now) => {
        const progress = Math.min((now - start) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * eased).toLocaleString());
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animate();
        observer.disconnect();
      }
    }, { rootMargin: '-40px' });

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [duration, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
}
