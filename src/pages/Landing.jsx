import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { CAMPUS_SIGNALS } from '../data/mockCommunity';

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

/**
 * Asymmetric landing — split hero, zig-zag features, single accent (sage on zinc).
 * Taste baseline: variance 8, motion 6, density 4.
 */
export default function Landing() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'Atlas — FBLA study and network';
  }, []);

  const wireItems = [
    `${CAMPUS_SIGNALS[0].value} chapters active this week`,
    `${CAMPUS_SIGNALS[2].value} resources exchanged`,
    `${CAMPUS_SIGNALS[1].value} peer intros sent`,
    'Built for competitors who prepare with intent',
  ];

  const focusRows = [
    ['Intro to Business', '186', '22'],
    ['Entrepreneurship', '141', '18'],
    ['Marketing / Roleplay', '122', '15'],
    ['Accounting I', '98', '12'],
    ['Database Design', '64', '9'],
    ['Public Speaking', '59', '11'],
  ];

  return (
    <PageTransition>
      <style>{css}</style>
      <div className="al-root">
        <div className="al-grain" aria-hidden />

        <section className="al-hero-split">
          <div className="al-hero-copy">
            <motion.p className="al-eyebrow" {...fade} transition={{ type: 'spring', stiffness: 100, damping: 22 }}>
              Future Business Leaders of America
            </motion.p>

            <motion.h1
              className="al-title"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 90, damping: 24, delay: 0.05 }}
            >
              Prepare with depth.
              <span className="al-title-muted"> Meet people who treat competition as craft.</span>
            </motion.h1>

            <motion.p
              className="al-lede"
              {...fade}
              transition={{ type: 'spring', stiffness: 100, damping: 22, delay: 0.08 }}
            >
              Atlas is where rubric-aligned materials meet deliberate introductions. Share files, find practice partners,
              and keep relationships after the season closes —{' '}
              <strong>reputation travels with the work you publish.</strong>
            </motion.p>

            <motion.div
              className="al-cta"
              {...fade}
              transition={{ type: 'spring', stiffness: 100, damping: 22, delay: 0.12 }}
            >
              {isAuthenticated ? (
                <Link to="/dashboard" className="al-btn al-btn-primary active:scale-[0.98]">
                  Open dashboard
                </Link>
              ) : (
                <Link to="/signup/student" className="al-btn al-btn-primary active:scale-[0.98]">
                  Create account
                </Link>
              )}
            </motion.div>

            <div className="al-metrics">
              <div className="al-metric">
                <span className="al-metric-label">Members</span>
                <span className="al-metric-value tabular-nums">2.47k</span>
              </div>
              <div className="al-metric">
                <span className="al-metric-label">Files indexed</span>
                <span className="al-metric-value tabular-nums">843</span>
              </div>
              <div className="al-metric">
                <span className="al-metric-label">Chapters this week</span>
                <span className="al-metric-value tabular-nums">38</span>
              </div>
            </div>
          </div>

          <div className="al-hero-visual">
            <div className="al-visual-frame">
              <img
                src="/atlas-fbla-stage.webp"
                alt="FBLA competitors standing on stage with an award banner"
                className="al-visual-img"
                width={960}
                height={1200}
                loading="eager"
              />
              <div className="al-visual-scrim" aria-hidden />
              <div className="al-visual-glass">
                <p className="al-glass-kicker">Live chapter signal</p>
                <p className="al-glass-stat">
                  <span className="tabular-nums">{CAMPUS_SIGNALS[1].value}</span> introduction requests routed between chapters this week — visibility stays under advisor rules.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="al-marquee-wrap" aria-hidden>
          <div className="al-marquee">
            {[...wireItems, ...wireItems].map((t, i) => (
              <span key={i} className="al-marquee-item">
                {t}
              </span>
            ))}
          </div>
        </div>

        <section className="al-section al-section-tight">
          <header className="al-sec-head al-sec-head-asym">
            <span className="al-sec-num">01</span>
            <div>
              <h2 className="al-sec-title">What you get</h2>
              <p className="al-sec-sub">
                Four connected surfaces — library, network, chapter ops, and long-term habits.
              </p>
            </div>
          </header>

          <div className="al-zigzag">
            <article className="al-zz">
              <div className="al-zz-copy">
                <span className="al-zz-tag">Library</span>
                <h3 className="al-zz-h">Shared study materials</h3>
                <p className="al-zz-p">
                  Rubric-tagged uploads from students who have already presented — outlines, flashcards, roleplay scripts.
                  Filter by event and visibility so you do not waste time on generic PDFs.
                </p>
              </div>
              <div className="al-zz-panel">
                <span className="al-zz-mono">Peer-ranked</span>
                <span className="al-zz-mono">Event-tagged</span>
              </div>
            </article>

            <article className="al-zz al-zz-reverse">
              <div className="al-zz-copy">
                <span className="al-zz-tag">Network</span>
                <h3 className="al-zz-h">Introductions with context</h3>
                <p className="al-zz-p">
                  Search by competitive event and chapter. Practice with someone outside your school, trade feedback, and
                  keep a thread that reads like early-career correspondence — not a feed of vanity metrics.
                </p>
              </div>
              <div className="al-zz-panel al-zz-panel-strong">
                <span className="al-zz-mono">Search</span>
                <span className="al-zz-mono">Intros</span>
                <span className="al-zz-mono">Chapters</span>
              </div>
            </article>

            <article className="al-zz al-zz-wide">
              <div className="al-zz-copy">
                <span className="al-zz-tag">Beyond regionals</span>
                <h3 className="al-zz-h">Career-ready habits</h3>
                <p className="al-zz-p">
                  The habits FBLA rewards — clarity, collaboration, delivery — map directly to internships and client work.
                  Atlas preserves your network when trophies live in a closet.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="al-manifesto">
          <div className="al-manifesto-inner">
            <p className="al-sec-num al-manifesto-label">02</p>
            <h2 className="al-manifesto-title">
              Straight talk:
              <span className="al-manifesto-em"> your network is part of the deliverable.</span>
            </h2>
            <ul className="al-manifesto-list">
              <li>The rubric is the spec — judge yourself against it weekly.</li>
              <li>Roleplay is rehearsal for rooms where stakes are real.</li>
              <li>Chapters that circulate materials outlearn chapters that gatekeep them.</li>
              <li>Who you drill with changes how you sound when judges push back.</li>
            </ul>
            <p className="al-manifesto-aside">Networking can be assigned work. Atlas is built for that honesty.</p>
          </div>
        </section>

        <section className="al-section">
          <header className="al-sec-head al-sec-head-asym">
            <span className="al-sec-num">03</span>
            <div>
              <h2 className="al-sec-title">Where prep clusters</h2>
              <p className="al-sec-sub">
                Illustrative activity — not rankings. A snapshot of where files and chapters concentrate right now.
              </p>
            </div>
          </header>

          <div className="al-table">
            <div className="al-table-head">
              <span>Competitive area</span>
              <span className="tabular-nums">Study files</span>
              <span className="tabular-nums">Chapters</span>
            </div>
            {focusRows.map(([name, files, chapters]) => (
              <div key={name} className="al-table-row">
                <span className="al-table-name">{name}</span>
                <span className="tabular-nums">{files}</span>
                <span className="tabular-nums">{chapters}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="al-cta-block">
          <div className="al-cta-inner">
            <h2 className="al-cta-title">Start on your timeline.</h2>
            <p className="al-cta-copy">
              Free for students and advisors. Bring a chapter or arrive solo and find collaborators.
            </p>
            <div className="al-cta">
              {isAuthenticated ? (
                <Link to="/dashboard" className="al-btn al-btn-primary al-btn-lg active:scale-[0.98]">
                  Open dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signup/student" className="al-btn al-btn-primary al-btn-lg active:scale-[0.98]">
                    Student signup
                  </Link>
                  <Link to="/signup/advisor" className="al-btn al-btn-ghost al-btn-lg active:scale-[0.98]">
                    Advisor access
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <footer className="al-footer">
          <span>Atlas / FBLA</span>
          <span className="al-footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </span>
        </footer>
      </div>
    </PageTransition>
  );
}

const css = `
.al-root {
  --al-bg: #0a0b0d;
  --al-bg-elev: #12141a;
  --al-fg: #ebe9e4;
  --al-muted: #8a8680;
  --al-line: rgba(255,255,255,0.1);
  --al-accent: #6d9ea8;
  --al-accent-2: #b89a52;
  --al-grid: rgba(255,255,255,0.045);
  background: var(--al-bg);
  color: var(--al-fg);
  font-family: 'Outfit', system-ui, sans-serif;
  min-height: 100dvh;
  overflow-x: hidden;
  position: relative;
}

.al-grain {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.45;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
}
.al-root > *:not(.al-grain) { position: relative; z-index: 1; }

.al-hero-split {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  border-bottom: 1px solid var(--al-line);
}
@media (min-width: 1024px) {
  .al-hero-split {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.92fr);
    min-height: min(92dvh, 920px);
    align-items: stretch;
  }
}

.al-hero-copy {
  padding: clamp(40px, 7vw, 96px) clamp(20px, 5vw, 56px) clamp(32px, 5vw, 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 640px;
}
@media (min-width: 1024px) {
  .al-hero-copy {
    padding-left: clamp(28px, 6vw, 72px);
  }
}

.al-eyebrow {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--al-accent-2);
  margin-bottom: 16px;
}

.al-title {
  font-family: var(--font-editorial);
  font-size: clamp(2.25rem, 4.2vw, 3.75rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.05;
  margin: 0 0 22px;
}
.al-title-muted {
  display: block;
  margin-top: 10px;
  color: #9d9890;
  font-weight: 500;
  font-size: clamp(1.25rem, 2.4vw, 1.65rem);
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.al-lede {
  font-size: 1.0625rem;
  line-height: 1.65;
  max-width: 52ch;
  color: #c9c6c0;
  margin-bottom: 28px;
}
.al-lede strong { color: var(--al-fg); font-weight: 600; }

.al-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 36px; }

.al-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 14px 22px;
  text-decoration: none;
  border-radius: 12px;
  border: 1px solid var(--al-line);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.al-btn-primary {
  background: rgba(109, 158, 168, 0.2);
  border-color: rgba(109, 158, 168, 0.5);
  color: var(--al-fg);
}
.al-btn-primary:hover {
  background: rgba(109, 158, 168, 0.32);
  border-color: rgba(109, 158, 168, 0.75);
}
.al-btn-ghost {
  background: transparent;
  color: var(--al-muted);
}
.al-btn-ghost:hover {
  color: var(--al-fg);
  border-color: rgba(235, 233, 228, 0.28);
}
.al-btn-lg { padding: 16px 26px; font-size: 13px; }

.al-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: var(--al-line);
  border: 1px solid var(--al-line);
  border-radius: 14px;
  overflow: hidden;
}
@media (max-width: 520px) {
  .al-metrics { grid-template-columns: 1fr; }
}
.al-metric {
  padding: 16px 18px;
  background: var(--al-bg-elev);
}
.al-metric-label {
  display: block;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--al-muted);
  margin-bottom: 6px;
}
.al-metric-value {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--al-fg);
}

.al-hero-visual {
  position: relative;
  min-height: 340px;
}
@media (min-width: 1024px) {
  .al-hero-visual { min-height: auto; }
}

.al-visual-frame {
  position: relative;
  height: 100%;
  min-height: 380px;
  overflow: hidden;
}
@media (min-width: 1024px) {
  .al-visual-frame {
    min-height: 100%;
    border-left: 1px solid var(--al-line);
  }
}

.al-visual-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02);
}

.al-visual-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(130deg, rgba(10,11,13,0.75) 0%, transparent 55%, rgba(10,11,13,0.45) 100%);
  pointer-events: none;
}

.al-visual-glass {
  position: absolute;
  left: clamp(16px, 4vw, 36px);
  right: clamp(16px, 4vw, 36px);
  bottom: clamp(20px, 4vw, 40px);
  padding: 18px 20px;
  border-radius: 16px;
  background: rgba(18, 20, 26, 0.65);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 20px 50px -24px rgba(0,0,0,0.6);
}
.al-glass-kicker {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--al-accent);
  margin: 0 0 8px;
}
.al-glass-stat {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #d4d0c8;
  max-width: 42ch;
}
.al-glass-stat span { color: var(--al-fg); font-weight: 600; }

.al-marquee-wrap {
  border-bottom: 1px solid var(--al-line);
  background: #0e1014;
  overflow: hidden;
}
.al-marquee {
  display: flex;
  gap: 48px;
  white-space: nowrap;
  padding: 12px 0;
  animation: al-marquee 46s linear infinite;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--al-muted);
}
@keyframes al-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.al-marquee-item::after {
  content: ' · ';
  color: rgba(109, 158, 168, 0.45);
}

.al-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(48px, 7vw, 100px) clamp(20px, 5vw, 48px);
  border-bottom: 1px solid var(--al-line);
}
.al-section-tight { padding-top: clamp(56px, 8vw, 112px); }

.al-sec-head { margin-bottom: 40px; }
.al-sec-head-asym {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 24px 32px;
  align-items: start;
}
@media (max-width: 640px) {
  .al-sec-head-asym { grid-template-columns: 1fr; }
}
.al-sec-num {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.28em;
  color: var(--al-accent-2);
}
.al-sec-title {
  font-family: var(--font-editorial);
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 4px 0 10px;
}
.al-sec-sub {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--al-muted);
  max-width: 58ch;
}

.al-zigzag {
  display: flex;
  flex-direction: column;
  gap: clamp(28px, 5vw, 48px);
}

.al-zz {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.65fr);
  gap: 24px 32px;
  padding: clamp(22px, 3vw, 32px);
  border: 1px solid var(--al-line);
  border-radius: 20px;
  background: linear-gradient(165deg, rgba(109, 158, 168, 0.06), transparent 40%);
}
.al-zz-reverse {
  grid-template-columns: minmax(0, 0.65fr) minmax(0, 1.15fr);
  background: linear-gradient(195deg, rgba(184, 154, 82, 0.05), transparent 45%);
}
.al-zz-reverse .al-zz-copy { order: 2; }
.al-zz-reverse .al-zz-panel { order: 1; }
.al-zz-wide {
  grid-template-columns: 1fr;
  background: var(--al-bg-elev);
}
@media (max-width: 900px) {
  .al-zz, .al-zz-reverse {
    grid-template-columns: 1fr;
  }
  .al-zz-reverse .al-zz-copy { order: 1; }
  .al-zz-reverse .al-zz-panel { order: 2; }
}

.al-zz-tag {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--al-muted);
}
.al-zz-h {
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 10px 0 12px;
}
.al-zz-p {
  font-size: 0.98rem;
  line-height: 1.65;
  color: #b8b4ac;
  margin: 0;
  max-width: 62ch;
}
.al-zz-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 18px;
  border-radius: 14px;
  border: 1px solid var(--al-line);
  background: rgba(255,255,255,0.02);
}
.al-zz-panel-strong {
  background: rgba(109, 158, 168, 0.08);
  border-color: rgba(109, 158, 168, 0.22);
}
.al-zz-mono {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--al-accent);
}

.al-manifesto {
  background: #e8e4dc;
  color: #1a1a1a;
  border-bottom: 1px solid #c9c4ba;
}
.al-manifesto-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(48px, 7vw, 88px) clamp(20px, 5vw, 48px);
}
.al-manifesto-label { color: #6d5a3a; }
.al-manifesto-title {
  font-family: var(--font-editorial);
  font-size: clamp(1.75rem, 3.2vw, 2.75rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin: 8px 0 20px;
}
.al-manifesto-em {
  color: #3d6d76;
  font-style: normal;
}
.al-manifesto-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  max-width: 58ch;
}
.al-manifesto-list li {
  padding: 10px 0;
  border-top: 1px solid #c9c4ba;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 13px;
  line-height: 1.55;
  letter-spacing: 0.02em;
}
.al-manifesto-list li:last-child { border-bottom: 1px solid #c9c4ba; }
.al-manifesto-aside {
  font-size: 15px;
  color: #5c574e;
  margin: 0;
}

.al-table {
  border: 1px solid var(--al-line);
  border-radius: 14px;
  overflow: hidden;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 12px;
}
.al-table-head,
.al-table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
  padding: 12px 16px;
  align-items: center;
}
@media (max-width: 640px) {
  .al-table-head, .al-table-row {
    grid-template-columns: 1fr 1fr;
    font-size: 11px;
  }
  .al-table-head span:nth-child(3),
  .al-table-row span:nth-child(3) { display: none; }
}
.al-table-head {
  background: var(--al-bg-elev);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--al-muted);
  border-bottom: 1px solid var(--al-line);
}
.al-table-row {
  border-bottom: 1px solid var(--al-line);
  color: #c9c6c0;
}
.al-table-row:last-child { border-bottom: 0; }
.al-table-row:hover { background: rgba(255,255,255,0.03); }
.al-table-name { color: var(--al-fg); font-weight: 600; }

.al-cta-block {
  border-bottom: 1px solid var(--al-line);
  background:
    radial-gradient(ellipse at 18% 40%, rgba(109, 158, 168, 0.12), transparent 52%),
    radial-gradient(ellipse at 82% 72%, rgba(184, 154, 82, 0.07), transparent 48%),
    var(--al-bg);
}
.al-cta-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(56px, 8vw, 100px) clamp(20px, 5vw, 48px);
}
.al-cta-title {
  font-family: var(--font-editorial);
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.035em;
  margin: 0 0 14px;
}
.al-cta-copy {
  font-size: 16px;
  line-height: 1.55;
  color: var(--al-muted);
  max-width: 48ch;
  margin-bottom: 24px;
}

.al-footer {
  max-width: 1400px;
  margin: 0 auto;
  padding: 22px clamp(20px, 5vw, 48px) 40px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--al-muted);
}
.al-footer a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.al-footer a:hover {
  color: var(--al-fg);
}
.al-footer-links {
  display: inline-flex;
  gap: 18px;
}
@media (max-width: 500px) {
  .al-footer { flex-direction: column; text-align: center; justify-content: center; }
}
`;
