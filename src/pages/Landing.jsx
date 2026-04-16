import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import {
  Upload, Search, Trophy, School, MapPin, Map, Globe,
  ArrowRight, Users, BookOpen, Zap, ChevronDown,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import HeroGear3D from '../components/HeroGear3D';

/* ─── Section Reveal ─── */
function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Data ─── */
const features = [
  { icon: Upload, title: 'Share Resources', desc: 'Upload study guides, practice tests, presentations, and roleplay scripts for your FBLA events.', accent: '#3b82f6' },
  { icon: Search, title: 'Discover & Learn', desc: 'Browse resources by event, type, or tag. Find exactly what you need to prepare for competition.', accent: '#f59e0b' },
  { icon: Trophy, title: 'Compete & Climb', desc: 'Earn recognition on the leaderboard. The more you contribute, the higher your chapter ranks.', accent: '#10b981' },
];

const tiers = [
  { icon: School, label: 'School', desc: 'Visible only to your chapter' },
  { icon: MapPin, label: 'Region', desc: 'Shared across your region' },
  { icon: Map, label: 'State', desc: 'Available statewide' },
  { icon: Globe, label: 'Public', desc: 'Open to all FBLA members' },
];

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroContentY = useTransform(heroScroll, [0, 1], [0, 150]);
  const heroContentOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const springContentY = useSpring(heroContentY, { stiffness: 50, damping: 20 });

  return (
    <PageTransition>
      <div className="bg-[#0a0a0a] text-white min-h-screen overflow-hidden">

        {/* ═══════════════════════════════════════════════
            SECTION 1 — HERO with side gears
        ═══════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
          {/* Interlocking gears on the sides */}
          <HeroGear3D />

          {/* Center hero content — clean, no gear behind it */}
          <motion.div
            className="relative z-10 text-center px-6 max-w-3xl mx-auto"
            style={{ y: springContentY, opacity: heroContentOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 mb-8"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/50">
                The #1 FBLA Resource Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]"
            >
              Share smarter.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-amber-400">
                Compete harder.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-6 text-base sm:text-lg text-white/40 max-w-xl mx-auto leading-relaxed"
            >
              A resource-sharing platform built by FBLA members, for FBLA members.
              Upload study materials, discover winning strategies, and climb the leaderboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/signup/student"
                className="group relative flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:bg-white/90 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
                />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-8 py-4 text-base font-semibold text-white/60 transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
              >
                Sign In
              </Link>
            </motion.div>

            {/* Stats inline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-16 flex items-center justify-center gap-10 sm:gap-16"
            >
              {[
                { icon: Users, value: '2,400+', label: 'Members' },
                { icon: BookOpen, value: '850+', label: 'Resources' },
                { icon: Zap, value: '58', label: 'Events' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon size={16} className="mx-auto mb-1.5 text-white/20" />
                  <p className="text-xl sm:text-2xl font-bold text-white/80">{stat.value}</p>
                  <p className="text-[10px] text-white/30 mt-0.5 tracking-widest uppercase">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/20">Scroll</span>
            <ChevronDown size={14} className="text-white/20" />
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — HOW IT WORKS
        ═══════════════════════════════════════════════ */}
        <section className="relative py-28 px-4 border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto">
            <RevealSection className="text-center mb-16">
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-white/25 mb-4">How it works</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Three steps to competition success
              </h2>
            </RevealSection>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((f, i) => (
                <RevealSection key={i} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -8, transition: { duration: 0.25 } }}
                    className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 overflow-hidden h-full"
                  >
                    <div
                      className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                      style={{ background: f.accent }}
                    />
                    <div
                      className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}30` }}
                    >
                      <f.icon size={22} style={{ color: f.accent }} />
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-white">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-white/40">{f.desc}</p>
                  </motion.div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — VISIBILITY TIERS
        ═══════════════════════════════════════════════ */}
        <section className="relative py-28 px-4 border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto">
            <RevealSection className="text-center mb-16">
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-white/25 mb-4">Visibility tiers</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Control who sees your resources
              </h2>
              <p className="mt-4 text-white/35 max-w-lg mx-auto text-sm">
                Choose the right audience for each resource. Share within your chapter or open it up to the entire FBLA community.
              </p>
            </RevealSection>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tiers.map((tier, i) => (
                <RevealSection key={i} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      <tier.icon size={20} className="text-white/40" />
                    </div>
                    <h3 className="mb-1 text-base font-bold text-white">{tier.label}</h3>
                    <p className="text-xs text-white/35">{tier.desc}</p>
                  </motion.div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — CTA
        ═══════════════════════════════════════════════ */}
        <section className="relative py-28 px-4">
          <RevealSection>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to level up your chapter?
              </h2>
              <p className="text-white/35 max-w-lg mx-auto mb-10">
                Join thousands of FBLA members already sharing resources and climbing the leaderboard.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup/student"
                  className="group relative flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:bg-white/90 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-8 py-4 text-base font-semibold text-white/60 transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.04] py-12 bg-black/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="FBLA Hub" className="h-8 w-8 object-contain" />
                <span className="text-lg font-bold text-white">FBLA Hub</span>
              </div>
              <p className="text-xs text-white/20 tracking-wider font-medium">© 2026 FBLA Resource Hub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
