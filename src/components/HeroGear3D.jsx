import { useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from 'framer-motion';

/* ─── Single Gear SVG ─── */
function GearSVG({ teeth = 16, innerRadius = 60, outerRadius = 80, holeRadius = 20, color = '#1a1a1a', highlight = '#333' }) {
  const points = useMemo(() => {
    const pts = [];
    const toothDepth = outerRadius - innerRadius;
    const angleStep = (2 * Math.PI) / teeth;
    const halfTooth = angleStep * 0.25;

    for (let i = 0; i < teeth; i++) {
      const a = angleStep * i;
      // Inner start
      pts.push([
        Math.cos(a - halfTooth * 1.3) * innerRadius,
        Math.sin(a - halfTooth * 1.3) * innerRadius,
      ]);
      // Outer start
      pts.push([
        Math.cos(a - halfTooth * 0.7) * outerRadius,
        Math.sin(a - halfTooth * 0.7) * outerRadius,
      ]);
      // Outer end
      pts.push([
        Math.cos(a + halfTooth * 0.7) * outerRadius,
        Math.sin(a + halfTooth * 0.7) * outerRadius,
      ]);
      // Inner end
      pts.push([
        Math.cos(a + halfTooth * 1.3) * innerRadius,
        Math.sin(a + halfTooth * 1.3) * innerRadius,
      ]);
    }
    return pts.map(([x, y]) => `${x},${y}`).join(' ');
  }, [teeth, innerRadius, outerRadius]);

  const svgSize = outerRadius * 2 + 20;
  const center = svgSize / 2;

  return (
    <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full h-full">
      <defs>
        <radialGradient id={`gear-grad-${teeth}-${outerRadius}`} cx="35%" cy="35%">
          <stop offset="0%" stopColor={highlight} />
          <stop offset="60%" stopColor={color} />
          <stop offset="100%" stopColor="#0d0d0d" />
        </radialGradient>
        <filter id={`gear-shadow-${teeth}-${outerRadius}`}>
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      <g transform={`translate(${center}, ${center})`} filter={`url(#gear-shadow-${teeth}-${outerRadius})`}>
        {/* Gear body */}
        <polygon
          points={points}
          fill={`url(#gear-grad-${teeth}-${outerRadius})`}
          stroke="#444"
          strokeWidth="0.8"
        />
        {/* Inner ring */}
        <circle r={innerRadius * 0.7} fill="none" stroke="#333" strokeWidth="1" opacity="0.5" />
        {/* Center hole */}
        <circle r={holeRadius} fill="#0a0a0a" stroke="#444" strokeWidth="1" />
        {/* Center dot */}
        <circle r={holeRadius * 0.3} fill="#333" />
        {/* Metallic highlight arc */}
        <circle r={innerRadius * 0.85} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
      </g>
    </svg>
  );
}

/* ─── Gear Configuration ─── */
const gears = [
  // Left side gears
  { id: 'L1', x: '-12%', y: '8%',   size: 'min(38vw, 340px)', teeth: 20, inner: 70, outer: 90, hole: 18, speed: 12, dir: 1,  color: '#1a1a1a', highlight: '#2a2a2a' },
  { id: 'L2', x: '-5%',  y: '42%',  size: 'min(26vw, 230px)', teeth: 14, inner: 55, outer: 72, hole: 14, speed: 17, dir: -1, color: '#181818', highlight: '#282828' },
  { id: 'L3', x: '-15%', y: '72%',  size: 'min(32vw, 280px)', teeth: 18, inner: 65, outer: 82, hole: 16, speed: 14, dir: 1,  color: '#1c1c1c', highlight: '#2c2c2c' },

  // Right side gears
  { id: 'R1', x: '78%',  y: '5%',   size: 'min(30vw, 270px)', teeth: 16, inner: 60, outer: 78, hole: 15, speed: 15, dir: -1, color: '#1b1b1b', highlight: '#2b2b2b' },
  { id: 'R2', x: '82%',  y: '38%',  size: 'min(36vw, 320px)', teeth: 22, inner: 75, outer: 92, hole: 20, speed: 11, dir: 1,  color: '#191919', highlight: '#292929' },
  { id: 'R3', x: '75%',  y: '70%',  size: 'min(24vw, 210px)', teeth: 12, inner: 50, outer: 65, hole: 12, speed: 20, dir: -1, color: '#1d1d1d', highlight: '#2d2d2d' },

  // Small accent gears (connecting pieces)
  { id: 'S1', x: '5%',   y: '30%',  size: 'min(14vw, 120px)', teeth: 10, inner: 40, outer: 55, hole: 10, speed: 24, dir: -1, color: '#1e1e1e', highlight: '#333' },
  { id: 'S2', x: '88%',  y: '25%',  size: 'min(12vw, 100px)', teeth: 10, inner: 38, outer: 52, hole: 9,  speed: 26, dir: 1,  color: '#1e1e1e', highlight: '#333' },
  { id: 'S3', x: '2%',   y: '60%',  size: 'min(10vw, 90px)',  teeth: 8,  inner: 35, outer: 48, hole: 8,  speed: 30, dir: 1,  color: '#202020', highlight: '#353535' },
  { id: 'S4', x: '90%',  y: '58%',  size: 'min(11vw, 95px)',  teeth: 8,  inner: 35, outer: 48, hole: 8,  speed: 28, dir: -1, color: '#202020', highlight: '#353535' },
];

export default function HeroGear3D() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven parallax for the whole system
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.6, 0.3]);
  const springY = useSpring(parallaxY, { stiffness: 40, damping: 20 });

  // Continuous spin values for each gear
  const spinValues = useRef({});

  useEffect(() => {
    const controls = [];
    gears.forEach((g) => {
      const mv = spinValues.current[g.id] || (spinValues.current[g.id] = { value: 0 });
      // We'll use CSS animation instead for performance
    });
    return () => controls.forEach((c) => c && c.stop && c.stop());
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ y: springY, opacity }}
    >
      {gears.map((g) => (
        <div
          key={g.id}
          className="absolute"
          style={{
            left: g.x,
            top: g.y,
            width: g.size,
            height: g.size,
            animation: `spin-gear ${g.speed}s linear infinite ${g.dir === -1 ? 'reverse' : 'normal'}`,
          }}
        >
          <GearSVG
            teeth={g.teeth}
            innerRadius={g.inner}
            outerRadius={g.outer}
            holeRadius={g.hole}
            color={g.color}
            highlight={g.highlight}
          />
        </div>
      ))}

      {/* Ambient glow effects where gears cluster */}
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          left: '-5%', top: '20%', width: '30vw', height: '30vw',
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          right: '-5%', top: '30%', width: '30vw', height: '30vw',
          background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}
