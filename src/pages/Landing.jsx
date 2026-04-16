import { Link } from 'react-router-dom';
import { Upload, Search, Trophy, ArrowRight, Zap, Shield, School, MapPin, Map, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const VISIBILITY_TIERS = [
  { icon: School, tier: 'School', desc: 'Just your chapter. Keep the competitive advantage close.', color: 'border-l-vis-school', iconColor: 'text-vis-school' },
  { icon: MapPin, tier: 'Region', desc: 'All chapters in your region. Build regional strength.', color: 'border-l-vis-region', iconColor: 'text-vis-region' },
  { icon: Map, tier: 'State', desc: 'Every chapter in your state. Lift the whole community.', color: 'border-l-vis-state', iconColor: 'text-vis-state' },
  { icon: Globe, tier: 'Public', desc: 'Open to everyone. Maximum impact, maximum reputation.', color: 'border-l-vis-public', iconColor: 'text-vis-public' },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        {/* Full background banner */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/banner.png)' }}
        />
        {/* Sleek, deep overlay for premium contrast */}
        <div className="absolute inset-0 bg-navy-950/80 bg-blend-multiply backdrop-blur-[2px]" />
        
        {/* Subtle grid pattern over the banner */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
          <motion.div 
            className="flex flex-col items-center text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-navy-200 backdrop-blur-md">
              <Zap size={14} className="text-gold-400 animate-pulse" />
              Built exclusively for FBLA competitors
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl drop-shadow-lg">
              Share smarter.
              <br />
              <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">
                Compete harder.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="mt-8 text-lg font-medium leading-relaxed text-navy-100/90 sm:text-xl drop-shadow">
              The high-performance resource hub where FBLA chapters upload, discover, and share study
              materials — with absolute control over who sees what.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mt-12 flex flex-wrap justify-center gap-5">
              <Link
                to="/signup/student"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-white px-8 py-4 text-base font-bold text-navy-900 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-warm-100 to-white opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative">Get Started</span>
                <ArrowRight size={18} className="relative transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/signup/advisor"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/30 hover:scale-105 active:scale-95"
              >
                I'm an Advisor
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fading edge */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-warm-50 dark:from-warm-950 to-transparent" />
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden py-24">
        {/* Animated Background gradients */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-navy-400/10 dark:bg-navy-800/20 blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] rounded-full bg-gold-400/10 dark:bg-gold-600/10 blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }}
            variants={itemVariants}
            className="mb-16 text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-warm-900 dark:text-warm-100 sm:text-5xl">
              Engineered for Success
            </h2>
            <p className="mt-4 text-lg text-warm-500 dark:text-warm-400">
              Three seamless steps to elevate your entire chapter's competitive advantage.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid gap-8 sm:grid-cols-3"
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {[
              {
                icon: Upload,
                title: 'Upload & Vault',
                description: 'Securely drop your study guides, strategic presentations, and roleplay scripts into a highly organized hub.',
                accent: 'bg-navy-50 text-navy-700 dark:bg-navy-900/40 dark:text-navy-300',
              },
              {
                icon: Search,
                title: 'Discover & Study',
                description: 'Find exactly what you need with precision search. Filter by event type, upvote the gold, and dominate.',
                accent: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
              },
              {
                icon: Trophy,
                title: 'Compete & Climb',
                description: 'Your chapter earns elite reputation for sharing high-value intel. Track your rank on the global leaderboard.',
                accent: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
              },
            ].map(item => (
              <motion.div 
                key={item.title} 
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-3xl border border-warm-200/60 bg-white/60 p-8 backdrop-blur-md transition-all hover:bg-white hover:shadow-2xl hover:shadow-navy-900/5 dark:border-warm-800/60 dark:bg-warm-900/60 dark:hover:bg-warm-900 dark:hover:shadow-black/40"
              >
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 ${item.accent}`}>
                  <item.icon size={26} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-warm-900 dark:text-warm-100">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-warm-600 dark:text-warm-400">
                  {item.description}
                </p>
                <div className="absolute inset-0 rounded-3xl ring-2 ring-transparent transition-all group-hover:ring-navy-500/10 dark:group-hover:ring-white/5" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Visibility tiers */}
      <section className="relative overflow-hidden bg-warm-100/50 py-24 dark:bg-warm-900/30">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-navy-500/5 to-transparent dark:from-navy-400/5" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            variants={itemVariants}
            className="mb-16 max-w-3xl"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-warm-900 dark:text-warm-100 sm:text-5xl">
              Total Strategic Visibility
            </h2>
            <p className="mt-4 text-lg text-warm-600 dark:text-warm-400">
              Information is power. Don't give everything away. Granular sharing tiers allow you to selectively empower your team or help the entire state.
            </p>
          </motion.div>

          <motion.div 
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {VISIBILITY_TIERS.map(t => (
              <motion.div 
                key={t.tier} 
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className={`group relative overflow-hidden rounded-2xl border-l-[6px] ${t.color} bg-white p-6 shadow-sm transition-all hover:shadow-xl dark:bg-warm-800`}
              >
                <t.icon size={28} className={`${t.iconColor} mb-4 transition-transform group-hover:scale-110`} />
                <h3 className="mb-2 text-xl font-bold text-warm-900 dark:text-warm-100">{t.tier} Tier</h3>
                <p className="text-sm leading-relaxed text-warm-500 dark:text-warm-400">{t.desc}</p>
                {/* Subtle sheen effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:via-white/5" style={{ transform: 'translateX(-100%)', animation: 'sparkle 2s infinite' }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modern High-End CTA */}
      <section className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2.5rem] bg-navy-900 p-10 text-center shadow-2xl sm:p-16 lg:p-24 dark:bg-navy-900"
        >
          {/* Rich Background for CTA */}
          <div className="absolute inset-0 bg-[url('/banner.png')] bg-cover bg-center opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy-950/80" />
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              initial={{ rotate: -10, opacity: 0 }}
              whileInView={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gold-400/20 mb-8 backdrop-blur-md border border-gold-400/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <Shield size={40} className="text-gold-400" />
              </div>
            </motion.div>
            
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Start building your legacy.
            </h2>
            <p className="mt-6 max-w-xl text-lg text-navy-200 sm:text-xl">
              Don't leave success to chance. Form a team, share elite resources, and crush the competition.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/signup/student"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gold-400 px-8 py-4 text-base font-bold text-navy-950 transition-all hover:scale-105 hover:bg-gold-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] active:scale-95"
              >
                Sign up as Student
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-warm-200/60 bg-warm-50 dark:border-warm-800/60 dark:bg-[#141414]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3 grayscale transition-all hover:grayscale-0">
              <img src="/logo.png" alt="Atlas" className="h-8 w-8 object-contain drop-shadow-sm" />
              <span className="text-base font-bold tracking-tight text-warm-700 dark:text-warm-300">Atlas Project</span>
            </div>
            <p className="text-sm font-medium text-warm-400">
              Built for FBLA students, by FBLA students. Not affiliated with FBLA-PBL Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
