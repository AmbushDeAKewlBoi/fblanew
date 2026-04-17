import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import { CAMPUS_SIGNALS, STUDY_CIRCLES } from '../data/mockCommunity';

/**
 * Brutalist landing — professional, not financial-terminal.
 * Bold grid typography, muted accents (steel / sage / gold), FBLA + study + network focus.
 */
export default function Landing() {
  useEffect(() => {
    document.title = 'Atlas — FBLA study & network';
  }, []);

  const wireItems = [
    `${CAMPUS_SIGNALS[0].value} chapters active this week`,
    `${CAMPUS_SIGNALS[3].value} resources exchanged`,
    `${CAMPUS_SIGNALS[1].value} peer intros sent`,
    `${CAMPUS_SIGNALS[2].value} study circles running`,
    'Built for competitors who take preparation seriously',
  ];

  const focusRows = [
    ['Intro to Business', '186', '3', '22'],
    ['Entrepreneurship', '141', '2', '18'],
    ['Marketing / Roleplay', '122', '2', '15'],
    ['Accounting I', '98', '1', '12'],
    ['Database Design', '64', '1', '9'],
    ['Public Speaking', '59', '1', '11'],
  ];

  return (
    <PageTransition>
      <style>{css}</style>
      <div className="al-root">
        <div className="al-scan" aria-hidden />

        <header className="al-topbar">
          <span className="al-topbar-brand">Atlas</span>
          <span className="al-topbar-sep">·</span>
          <span className="al-topbar-muted">Study tool &amp; professional network for FBLA</span>
          <span className="al-topbar-spacer" />
          <Link to="/login" className="al-topbar-link">
            Sign in
          </Link>
        </header>

        <section className="al-hero">
          <div className="al-hero-grid" aria-hidden />
          <div className="al-hero-inner">
            <p className="al-eyebrow">Future Business Leaders of America</p>

            <h1 className="al-title">
              <span className="al-title-line">Prepare</span>
              <span className="al-title-line al-title-outline">like it matters.</span>
              <span className="al-title-line al-title-accent">Meet people who do.</span>
            </h1>

            <p className="al-lede">
              Atlas helps you study for competition and build the relationships that last beyond it.
              Share resources, find collaborators, grow your chapter, and start a professional identity early —
              <strong> it&apos;s not only what you know. It&apos;s who you know.</strong>
            </p>

            <div className="al-cta">
              <Link to="/signup/student" className="al-btn al-btn-primary">
                Join Atlas
              </Link>
              <Link to="/login" className="al-btn al-btn-ghost">
                I already have an account
              </Link>
            </div>

            <div className="al-stats">
              <div className="al-stat">
                <span className="al-stat-k">Members</span>
                <span className="al-stat-v">2.4k+</span>
              </div>
              <div className="al-stat">
                <span className="al-stat-k">Resources shared</span>
                <span className="al-stat-v">840+</span>
              </div>
              <div className="al-stat">
                <span className="al-stat-k">Study circles</span>
                <span className="al-stat-v">9</span>
              </div>
              <div className="al-stat">
                <span className="al-stat-k">Chapters this week</span>
                <span className="al-stat-v">38</span>
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

        <section className="al-section">
          <header className="al-sec-head">
            <span className="al-sec-num">01</span>
            <h2 className="al-sec-title">What you get</h2>
            <p className="al-sec-sub">Four pieces that work together — no gimmicks, no fake urgency.</p>
          </header>

          <div className="al-modules">
            <article className="al-mod">
              <div className="al-mod-top">
                <span>Library</span>
                <span className="al-mod-id">01</span>
              </div>
              <h3 className="al-mod-h">Shared study materials</h3>
              <p className="al-mod-p">
                Rubric-aligned files from students who have been in your seat — flashcards, outlines, roleplay notes.
                Find what fits your event and chapter.
              </p>
              <p className="al-mod-foot">Peer-ranked · Event-tagged</p>
            </article>

            <article className="al-mod al-mod-highlight">
              <div className="al-mod-top">
                <span>Network</span>
                <span className="al-mod-id">02</span>
              </div>
              <h3 className="al-mod-h">People, not profiles</h3>
              <p className="al-mod-p">
                Discover members by event, chapter, and strengths. Practice with someone outside your school.
                Send a respectful intro — this is early-career networking with training wheels off.
              </p>
              <p className="al-mod-foot">Search · Intros · Chapters</p>
            </article>

            <article className="al-mod">
              <div className="al-mod-top">
                <span>Circles</span>
                <span className="al-mod-id">03</span>
              </div>
              <h3 className="al-mod-h">Small groups, real cadence</h3>
              <p className="al-mod-p">
                Study circles that meet on a schedule: drills, critiques, accountability. The hour that turns prep into progress.
              </p>
              <p className="al-mod-foot">Live &amp; async</p>
            </article>

            <article className="al-mod">
              <div className="al-mod-top">
                <span>Beyond regionals</span>
                <span className="al-mod-id">04</span>
              </div>
              <h3 className="al-mod-h">Career-ready habits</h3>
              <p className="al-mod-p">
                The same skills FBLA rewards — clarity, collaboration, presentation — are the ones internships ask for.
                Atlas keeps your network when the season ends.
              </p>
              <p className="al-mod-foot">Long-term, not one weekend</p>
            </article>
          </div>
        </section>

        <section className="al-manifesto">
          <div className="al-manifesto-inner">
            <p className="al-sec-num al-manifesto-label">02</p>
            <h2 className="al-manifesto-title">
              Brutally honest:<br />
              <span className="al-manifesto-em">your network is part of the assignment.</span>
            </h2>
            <ul className="al-manifesto-list">
              <li>The rubric is a spec — ship to it.</li>
              <li>Roleplay is practice for real rooms.</li>
              <li>Chapters that share resources outlearn chapters that hoard them.</li>
              <li>Who you practice with shapes how you show up when it counts.</li>
            </ul>
            <p className="al-manifesto-aside">(Yes — networking can be homework. We&apos;re fine with that.)</p>
          </div>
        </section>

        <section className="al-section">
          <header className="al-sec-head">
            <span className="al-sec-num">03</span>
            <h2 className="al-sec-title">Where chapters are focused</h2>
            <p className="al-sec-sub">Illustrative activity — not rankings, not predictions. Just where prep is concentrated right now.</p>
          </header>

          <div className="al-table">
            <div className="al-table-head">
              <span>Competitive area</span>
              <span>Study files</span>
              <span>Circles</span>
              <span>Chapters</span>
            </div>
            {focusRows.map(([name, files, circles, chapters]) => (
              <div key={name} className="al-table-row">
                <span className="al-table-name">{name}</span>
                <span>{files}</span>
                <span>{circles}</span>
                <span>{chapters}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="al-section al-circles">
          <header className="al-sec-head">
            <span className="al-sec-num">04</span>
            <h2 className="al-sec-title">Study circles on Atlas</h2>
            <p className="al-sec-sub">Examples of how members group up — yours will look like your chapter.</p>
          </header>
          <div className="al-circle-cards">
            {STUDY_CIRCLES.map((c) => (
              <article key={c.id} className="al-circle-card">
                <h3 className="al-circle-name">{c.name}</h3>
                <p className="al-circle-meta">{c.event} · {c.cadence}</p>
                <p className="al-circle-focus">{c.focus}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="al-cta-block">
          <div className="al-cta-inner">
            <h2 className="al-cta-title">
              Ready when you are.
            </h2>
            <p className="al-cta-copy">
              Free for students and advisors. Bring your chapter — or start solo and find your people.
            </p>
            <div className="al-cta">
              <Link to="/signup/student" className="al-btn al-btn-primary al-btn-lg">
                Create a student account
              </Link>
              <Link to="/signup/advisor" className="al-btn al-btn-ghost al-btn-lg">
                Advisor onboarding
              </Link>
            </div>
          </div>
        </section>

        <footer className="al-footer">
          <span>Atlas · FBLA</span>
          <span>Study together. Network on purpose.</span>
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
  font-family: 'Archivo', system-ui, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

.al-scan {
  pointer-events: none;
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 4px);
  z-index: 0;
  opacity: 0.6;
}
.al-root > *:not(.al-scan) { position: relative; z-index: 1; }

.al-topbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 20px;
  border-bottom: 1px solid var(--al-line);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--al-muted);
}
.al-topbar-brand {
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--al-fg);
}
.al-topbar-sep { opacity: 0.5; }
.al-topbar-muted { flex: 1; min-width: 200px; }
.al-topbar-spacer { flex: 1; }
.al-topbar-link {
  color: var(--al-accent);
  text-decoration: none;
  font-weight: 600;
  padding: 6px 10px;
  border: 1px solid rgba(109, 158, 168, 0.35);
  border-radius: 2px;
}
.al-topbar-link:hover {
  background: rgba(109, 158, 168, 0.12);
  color: var(--al-fg);
}

.al-hero {
  position: relative;
  padding: clamp(36px, 7vw, 96px) 24px clamp(40px, 6vw, 80px);
  border-bottom: 1px solid var(--al-line);
}
.al-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--al-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--al-grid) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at 25% 20%, #000 0%, transparent 70%);
  pointer-events: none;
}
.al-hero-inner { max-width: 1120px; margin: 0 auto; }

.al-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--al-accent-2);
  margin-bottom: 16px;
}

.al-title {
  font-family: 'Anton', 'Archivo', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  line-height: 0.9;
  letter-spacing: -0.02em;
  margin: 0 0 24px;
}
.al-title-line { display: block; font-size: clamp(52px, 11vw, 168px); }
.al-title-outline {
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(235, 233, 228, 0.85);
  padding-left: clamp(16px, 4vw, 72px);
}
.al-title-accent {
  display: inline-block;
  margin-top: 4px;
  padding: 0 12px 8px;
  background: linear-gradient(135deg, rgba(109, 158, 168, 0.35), rgba(184, 154, 82, 0.25));
  border: 1px solid rgba(109, 158, 168, 0.45);
  color: var(--al-fg);
  font-size: clamp(40px, 8vw, 120px);
  box-shadow: 6px 6px 0 rgba(0,0,0,0.35);
}

.al-lede {
  font-size: 17px;
  line-height: 1.65;
  max-width: 56ch;
  color: #c9c6c0;
  margin-bottom: 28px;
}
.al-lede strong { color: var(--al-fg); font-weight: 600; }

.al-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 48px; }

.al-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 14px 22px;
  text-decoration: none;
  border: 2px solid var(--al-line);
  border-radius: 2px;
  transition: transform 0.15s, background 0.15s, color 0.15s, border-color 0.15s;
}
.al-btn:hover { transform: translate(-2px, -2px); }
.al-btn-primary {
  background: rgba(109, 158, 168, 0.22);
  border-color: rgba(109, 158, 168, 0.55);
  color: var(--al-fg);
}
.al-btn-primary:hover {
  background: rgba(109, 158, 168, 0.35);
  border-color: rgba(109, 158, 168, 0.85);
}
.al-btn-ghost {
  background: transparent;
  color: var(--al-muted);
  border-color: var(--al-line);
}
.al-btn-ghost:hover {
  color: var(--al-fg);
  border-color: rgba(235, 233, 228, 0.35);
}
.al-btn-lg { padding: 16px 26px; font-size: 13px; }

.al-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--al-line);
  background: var(--al-bg-elev);
}
@media (max-width: 800px) {
  .al-stats { grid-template-columns: repeat(2, 1fr); }
}
.al-stat {
  padding: 20px 22px;
  border-left: 1px solid var(--al-line);
}
.al-stat:first-child { border-left: 0; }
@media (max-width: 800px) {
  .al-stat:nth-child(3) { border-left: 0; border-top: 1px solid var(--al-line); }
  .al-stat:nth-child(4) { border-top: 1px solid var(--al-line); }
}
.al-stat-k {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--al-muted);
  margin-bottom: 8px;
}
.al-stat-v {
  font-family: 'Anton', sans-serif;
  font-size: clamp(28px, 4vw, 44px);
  letter-spacing: 0.02em;
  color: var(--al-fg);
}

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
  animation: al-marquee 40s linear infinite;
  font-family: 'JetBrains Mono', monospace;
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
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(48px, 7vw, 100px) 24px;
  border-bottom: 1px solid var(--al-line);
}
.al-sec-head { margin-bottom: 36px; max-width: 720px; }
.al-sec-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.28em;
  color: var(--al-accent-2);
}
.al-sec-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(36px, 5vw, 64px);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1;
  margin: 8px 0 12px;
}
.al-sec-sub {
  font-size: 15px;
  line-height: 1.55;
  color: var(--al-muted);
  max-width: 54ch;
}

.al-modules {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  border: 1px solid var(--al-line);
}
@media (max-width: 800px) { .al-modules { grid-template-columns: 1fr; } }

.al-mod {
  padding: 28px 26px;
  border-left: 1px solid var(--al-line);
  border-top: 1px solid var(--al-line);
  background: var(--al-bg);
  margin-left: -1px;
  margin-top: -1px;
}
.al-mod-highlight {
  background: linear-gradient(160deg, rgba(109, 158, 168, 0.08), rgba(184, 154, 82, 0.05));
}
.al-mod-top {
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--al-muted);
  margin-bottom: 14px;
}
.al-mod-id { opacity: 0.7; }
.al-mod-h {
  font-family: 'Anton', sans-serif;
  font-size: clamp(22px, 2.5vw, 28px);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin: 0 0 10px;
  line-height: 1.05;
}
.al-mod-p {
  font-size: 15px;
  line-height: 1.6;
  color: #b8b4ac;
  margin: 0 0 18px;
}
.al-mod-foot {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--al-accent);
  text-transform: uppercase;
}

.al-manifesto {
  background: #e8e4dc;
  color: #1a1a1a;
  border-bottom: 1px solid #c9c4ba;
}
.al-manifesto-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(48px, 7vw, 88px) 24px;
}
.al-manifesto-label { color: #6d5a3a; }
.al-manifesto-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(32px, 5vw, 56px);
  text-transform: uppercase;
  line-height: 1.02;
  letter-spacing: -0.02em;
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
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.55;
  letter-spacing: 0.02em;
}
.al-manifesto-list li:last-child { border-bottom: 1px solid #c9c4ba; }
.al-manifesto-aside {
  font-size: 15px;
  font-style: italic;
  color: #5c574e;
  margin: 0;
}

.al-table {
  border: 1px solid var(--al-line);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}
.al-table-head,
.al-table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 12px;
  padding: 12px 16px;
  align-items: center;
}
@media (max-width: 640px) {
  .al-table-head, .al-table-row {
    grid-template-columns: 1fr 1fr;
    font-size: 11px;
  }
  .al-table-head span:nth-child(n+3),
  .al-table-row span:nth-child(n+3) { display: none; }
}
.al-table-head {
  background: var(--al-bg-elev);
  letter-spacing: 0.16em;
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
.al-table-name { color: var(--al-fg); font-weight: 600; letter-spacing: 0.04em; }

.al-circles .al-circle-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 900px) { .al-circles .al-circle-cards { grid-template-columns: 1fr; } }
.al-circle-card {
  border: 1px solid var(--al-line);
  padding: 20px 18px;
  background: var(--al-bg-elev);
}
.al-circle-name {
  font-family: 'Anton', sans-serif;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin: 0 0 6px;
}
.al-circle-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--al-accent-2);
  margin: 0 0 10px;
}
.al-circle-focus {
  font-size: 14px;
  line-height: 1.5;
  color: #b8b4ac;
  margin: 0;
}

.al-cta-block {
  border-bottom: 1px solid var(--al-line);
  background:
    radial-gradient(ellipse at 20% 50%, rgba(109, 158, 168, 0.12), transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(184, 154, 82, 0.08), transparent 45%),
    var(--al-bg);
}
.al-cta-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(56px, 8vw, 100px) 24px;
}
.al-cta-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(40px, 6vw, 84px);
  text-transform: uppercase;
  line-height: 0.98;
  letter-spacing: -0.02em;
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
  max-width: 1120px;
  margin: 0 auto;
  padding: 22px 24px 40px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--al-muted);
}
@media (max-width: 500px) { .al-footer { flex-direction: column; text-align: center; justify-content: center; } }
`;
