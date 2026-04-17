import { motion, useReducedMotion } from 'framer-motion';

/* ─── Reusable Gear SVG ─── */
function GearShape({ size = 80, teeth = 10, speed = 25, direction = 1, className = '' }) {
  const points = [];
  const step = Math.PI / teeth;
  const inner = size * 0.35;
  const outer = size * 0.47;
  for (let i = 0; i < 2 * teeth; i++) {
    const angle = i * step - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    points.push(`${size / 2 + r * Math.cos(angle)},${size / 2 + r * Math.sin(angle)}`);
  }
  return (
    <motion.svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 * direction }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
    >
      <polygon points={points.join(' ')} fill="currentColor" />
      <circle cx={size / 2} cy={size / 2} r={size * 0.12} fill="currentColor" opacity="0.4" />
    </motion.svg>
  );
}

/* ─── Page Gears — subtle corner decorations for inner pages ─── */
export default function PageGears({ variant = 'default' }) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  const configs = {
    default: [
      { pos: 'top-[-30px] left-[-30px]', size: 120, teeth: 12, speed: 30, dir: 1 },
      { pos: 'bottom-[-40px] right-[-40px]', size: 160, teeth: 16, speed: 35, dir: -1 },
    ],
    dashboard: [
      { pos: 'top-[-20px] right-[-20px]', size: 100, teeth: 10, speed: 25, dir: 1 },
      { pos: 'bottom-[-30px] left-[-30px]', size: 140, teeth: 14, speed: 30, dir: -1 },
      { pos: 'top-[40%] left-[-50px]', size: 80, teeth: 8, speed: 20, dir: 1 },
    ],
    events: [
      { pos: 'top-[-25px] left-[-25px]', size: 110, teeth: 12, speed: 28, dir: -1 },
      { pos: 'bottom-[-35px] right-[-35px]', size: 130, teeth: 14, speed: 32, dir: 1 },
    ],
    upload: [
      { pos: 'top-[-20px] right-[-20px]', size: 90, teeth: 10, speed: 22, dir: 1 },
      { pos: 'bottom-[-25px] left-[-25px]', size: 100, teeth: 10, speed: 26, dir: -1 },
    ],
    leaderboard: [
      { pos: 'top-[-30px] left-[-30px]', size: 130, teeth: 14, speed: 30, dir: 1 },
      { pos: 'top-[-20px] right-[-20px]', size: 90, teeth: 8, speed: 20, dir: -1 },
      { pos: 'bottom-[-40px] right-[-40px]', size: 150, teeth: 16, speed: 35, dir: 1 },
    ],
  };

  const gears = configs[variant] || configs.default;

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {gears.map((g, i) => (
        <motion.div
          key={`${variant}-${i}`}
          className={`absolute ${g.pos}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: i * 0.15 }}
        >
          <GearShape
            size={g.size}
            teeth={g.teeth}
            speed={g.speed}
            direction={g.dir}
            className="text-[#6d9ea8]/[0.04] dark:text-[#6d9ea8]/[0.06]"
          />
        </motion.div>
      ))}
    </div>
  );
}
