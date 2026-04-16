import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/* ─── Single Gear SVG ─── */
function GearSVG({ teeth = 12, innerRadius = 30, outerRadius = 40, holeRadius = 10 }) {
  const points = [];
  const step = Math.PI / teeth;
  for (let i = 0; i < 2 * teeth; i++) {
    const angle = i * step - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    points.push(`${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`);
  }
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points={points.join(' ')} fill="currentColor" opacity="0.12" />
      <circle cx="50" cy="50" r={holeRadius} fill="currentColor" opacity="0.06" />
      <circle cx="50" cy="50" r={outerRadius + 1} fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
    </svg>
  );
}

/* ─── Floating Particle ─── */
function Particle({ delay, size, x, y, duration }) {
  return (
    <motion.div
      className="absolute rounded-full bg-navy-500/10 dark:bg-navy-400/10"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, 0, 20, 0],
        x: [0, 15, -10, 5, 0],
        opacity: [0.3, 0.6, 0.4, 0.7, 0.3],
        scale: [1, 1.2, 0.9, 1.1, 1],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ─── Gear Configurations per route ─── */
const GEAR_CONFIGS = {
  landing: [
    { x: -8, y: 5, size: 280, teeth: 16, speed: 1, direction: 1, innerR: 32, outerR: 42, holeR: 12 },
    { x: 85, y: -5, size: 220, teeth: 12, speed: 1.4, direction: -1, innerR: 28, outerR: 38, holeR: 10 },
    { x: -5, y: 45, size: 180, teeth: 10, speed: 1.8, direction: 1, innerR: 30, outerR: 40, holeR: 8 },
    { x: 90, y: 40, size: 320, teeth: 20, speed: 0.7, direction: -1, innerR: 34, outerR: 44, holeR: 14 },
    { x: 10, y: 80, size: 240, teeth: 14, speed: 1.2, direction: -1, innerR: 30, outerR: 40, holeR: 10 },
    { x: 80, y: 75, size: 160, teeth: 8, speed: 2, direction: 1, innerR: 26, outerR: 36, holeR: 8 },
    { x: 45, y: 15, size: 100, teeth: 8, speed: 2.5, direction: 1, innerR: 24, outerR: 34, holeR: 6 },
    { x: 50, y: 60, size: 140, teeth: 10, speed: 1.6, direction: -1, innerR: 28, outerR: 38, holeR: 8 },
  ],
  dashboard: [
    { x: -6, y: 10, size: 200, teeth: 12, speed: 0.5, direction: 1, innerR: 30, outerR: 40, holeR: 10 },
    { x: 88, y: 5, size: 160, teeth: 10, speed: 0.7, direction: -1, innerR: 28, outerR: 38, holeR: 8 },
    { x: 92, y: 70, size: 240, teeth: 16, speed: 0.4, direction: 1, innerR: 32, outerR: 42, holeR: 12 },
    { x: -4, y: 75, size: 180, teeth: 14, speed: 0.6, direction: -1, innerR: 30, outerR: 40, holeR: 10 },
  ],
  default: [
    { x: -5, y: 8, size: 180, teeth: 12, speed: 0.6, direction: 1, innerR: 30, outerR: 40, holeR: 10 },
    { x: 90, y: 10, size: 140, teeth: 10, speed: 0.8, direction: -1, innerR: 28, outerR: 38, holeR: 8 },
    { x: 88, y: 80, size: 200, teeth: 14, speed: 0.5, direction: 1, innerR: 30, outerR: 40, holeR: 10 },
  ],
};

function getConfigForPath(pathname) {
  if (pathname === '/' || pathname === '') return 'landing';
  if (pathname.includes('dashboard')) return 'dashboard';
  return 'default';
}

/* ─── Animated Gear with scroll + constant spin ─── */
function AnimatedGear({ gear, scrollProgress, index }) {
  const baseRotation = useMotionValue(0);
  const scrollRotation = useTransform(scrollProgress, [0, 1], [0, 360 * gear.direction * gear.speed]);
  const springScroll = useSpring(scrollRotation, { stiffness: 50, damping: 20 });

  // Constant idle spin
  useEffect(() => {
    const controls = animate(baseRotation, [0, 360 * gear.direction], {
      duration: 30 / gear.speed,
      repeat: Infinity,
      ease: 'linear',
    });
    return controls.stop;
  }, [gear.speed, gear.direction]);

  // Combine idle + scroll
  const [combinedRotation, setCombinedRotation] = useState(0);
  useEffect(() => {
    const unsubBase = baseRotation.on('change', (v) => {
      setCombinedRotation(v + (springScroll.get() || 0));
    });
    const unsubScroll = springScroll.on('change', (v) => {
      setCombinedRotation((baseRotation.get() || 0) + v);
    });
    return () => { unsubBase(); unsubScroll(); };
  }, [baseRotation, springScroll]);

  // Parallax Y offset
  const parallaxY = useTransform(scrollProgress, [0, 1], [0, -60 * (index % 2 === 0 ? 1 : -1)]);
  const springY = useSpring(parallaxY, { stiffness: 40, damping: 15 });

  return (
    <motion.div
      className="absolute text-navy-600 dark:text-navy-400 pointer-events-none"
      style={{
        left: `${gear.x}%`,
        top: `${gear.y}%`,
        width: gear.size,
        height: gear.size,
        rotate: combinedRotation,
        y: springY,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
    >
      <GearSVG teeth={gear.teeth} innerRadius={gear.innerR} outerRadius={gear.outerR} holeRadius={gear.holeR} />
    </motion.div>
  );
}

/* ─── Connector Lines between gears ─── */
function GearConnectors({ gears }) {
  if (gears.length < 2) return null;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {gears.slice(0, -1).map((g, i) => {
        const next = gears[i + 1];
        if (!next) return null;
        const x1 = g.x + (g.size / 20);
        const y1 = g.y + (g.size / 20);
        const x2 = next.x + (next.size / 20);
        const y2 = next.y + (next.size / 20);
        return (
          <motion.line
            key={i}
            x1={`${x1}%`} y1={`${y1}%`}
            x2={`${x2}%`} y2={`${y2}%`}
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            className="text-navy-400/10 dark:text-navy-500/10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: i * 0.2 }}
          />
        );
      })}
    </svg>
  );
}

/* ─── Main GearSystem Component ─── */
export default function GearSystem() {
  const location = useLocation();
  const containerRef = useRef(null);
  const configKey = getConfigForPath(location.pathname);
  const gears = GEAR_CONFIGS[configKey] || GEAR_CONFIGS.default;

  const { scrollYProgress } = useScroll();

  // Particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
    }));
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-gradient-to-br from-navy-200/20 to-transparent dark:from-navy-800/15 blur-3xl"
          animate={{ x: [0, 50, -30, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-gold-200/15 to-transparent dark:from-gold-700/10 blur-3xl"
          animate={{ x: [0, -40, 30, 0], y: [0, 30, -50, 0], scale: [1, 0.9, 1.15, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 w-[40%] h-[40%] rounded-full bg-gradient-to-r from-navy-300/10 to-gold-300/10 dark:from-navy-600/8 dark:to-gold-600/8 blur-3xl"
          animate={{ x: [0, 60, -40, 0], y: [0, -30, 40, 0], rotate: [0, 90, 180, 360] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Connector lines */}
      <GearConnectors gears={gears} />

      {/* Gears */}
      {gears.map((gear, i) => (
        <AnimatedGear key={`${configKey}-${i}`} gear={gear} scrollProgress={scrollYProgress} index={i} />
      ))}

      {/* Floating particles */}
      {particles.map(p => (
        <Particle key={p.id} {...p} />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(30,58,138,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,58,138,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
