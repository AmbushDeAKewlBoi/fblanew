import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Books,
  ChartLineUp,
  ChatsCircle,
  Compass,
  Handshake,
  Lightning,
  Trophy,
} from '@phosphor-icons/react';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { CAMPUS_SIGNALS } from '../data/mockCommunity';

gsap.registerPlugin(ScrollTrigger);

const PHOTOS = {
  hero: 'award-stage-wide',
  award: 'championship-award-group',
  trophyLine: 'trophy-line-close',
  podium: 'student-speaker-podium',
  speaker: 'make-your-mark-speaker',
  keynote: 'fbla-keynote-lectern',
  wave: 'stage-wave-officers',
  campaign: 'campaign-scholarships',
  screen: 'make-your-mark-screen',
  plaque: 'award-plaque-stage',
};

function Photo({ name, alt, className = '', loading = 'lazy', sizes, fetchPriority }) {
  const base = `/landingassets/${name}`;
  return (
    <img
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      sizes={sizes || '(min-width: 1280px) 720px, (min-width: 768px) 56vw, 92vw'}
      src={`${base}-md.webp`}
      srcSet={`${base}-sm.webp 720w, ${base}-md.webp 1100w, ${base}-lg.webp 1600w, ${base}-xl.webp 2200w`}
      className={className}
    />
  );
}

function ProductPreview({ type }) {
  if (type === 'network') {
    return (
      <div className="atl-product-preview atl-product-preview-network" aria-hidden>
        <div className="atl-preview-bar">
          <span>Network match</span>
          <strong>4 shared events</strong>
        </div>
        {[
          ['Ari Patel', 'Business Management · Richmond', 'Roleplay partner'],
          ['Mia Chen', 'Marketing · Fairfax', 'Feedback swap'],
          ['Noah Brooks', 'MIS · Virginia Beach', 'Resource exchange'],
        ].map(([name, meta, action]) => (
          <div className="atl-preview-person" key={name}>
            <div className="atl-preview-avatar">{name.charAt(0)}</div>
            <div>
              <strong>{name}</strong>
              <span>{meta}</span>
            </div>
            <em>{action}</em>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="atl-product-preview atl-product-preview-dashboard" aria-hidden>
      <div className="atl-preview-bar">
        <span>Chapter dashboard</span>
        <strong>Live this week</strong>
      </div>
      <div className="atl-preview-stats">
        <div><span>Uploads</span><strong>42</strong></div>
        <div><span>Intros</span><strong>126</strong></div>
        <div><span>Events</span><strong>31</strong></div>
      </div>
      <div className="atl-preview-task">
        <span>Next best move</span>
        <strong>Share Accounting II prep packet with two matched teams.</strong>
      </div>
    </div>
  );
}

const focusAreas = [
  {
    title: 'Library',
    photo: PHOTOS.keynote,
    copy: 'Rubric-tagged prep files, examples, study guides, and roleplay drills stay searchable by event.',
  },
  {
    title: 'Network',
    photo: PHOTOS.wave,
    copy: 'Find competitors by chapter, strength, event, or ambition, then turn practice into correspondence.',
  },
  {
    title: 'Chapter Ops',
    photo: PHOTOS.podium,
    copy: 'Advisor-friendly visibility, moderation patterns, and member momentum live in one calm workspace.',
  },
];

const stackItems = [
  {
    title: 'Dashboard',
    copy: 'A command surface for uploads, network suggestions, and chapter momentum.',
    Icon: Lightning,
    tag: 'Opening session',
    visual: 'dashboard',
  },
  {
    title: 'Events',
    copy: 'A fast index for competitive categories, search, and resource counts.',
    Icon: Books,
    photo: PHOTOS.plaque,
    tag: 'Plaque on stage',
  },
  {
    title: 'Network',
    copy: 'Profiles, posts, private messages, and collaboration signals in one system.',
    Icon: Handshake,
    tag: 'Awards line',
    visual: 'network',
  },
];

const marqueeItems = [
  'Roleplay rehearsal',
  'Chapter exchange',
  'Rubric-first uploads',
  'Peer introductions',
  'Advisor visibility',
  'Career-ready habits',
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const root = useRef(null);

  useEffect(() => {
    document.title = 'Atlas — FBLA study and network';
  }, []);

  useGSAP(() => {
    const words = gsap.utils.toArray('.atl-word');
    gsap.set(words, { opacity: 0.14 });
    gsap.to(words, {
      opacity: 1,
      stagger: 0.035,
      ease: 'none',
      scrollTrigger: {
        trigger: '.atl-manifesto',
        start: 'top 72%',
        end: 'bottom 48%',
        scrub: true,
      },
    });

    gsap.utils.toArray('.atl-bento-card, .atl-accordion-panel, .atl-visual-card').forEach((card) => {
      gsap.fromTo(card, { opacity: 0, y: 46, scale: 0.94 }, {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 86%',
          end: 'top 54%',
          scrub: 0.6,
        },
      });
    });

    gsap.utils.toArray('.atl-hero-floater').forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 === 0 ? -14 : 18,
        rotate: i % 2 === 0 ? -1.5 : 1.2,
        duration: 4 + i,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    gsap.utils.toArray('.atl-stack-card').forEach((card) => {
      gsap.fromTo(card, { y: 96, scale: 0.9, opacity: 0.25 }, {
        y: 0,
        scale: 1,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          end: 'top 52%',
          scrub: true,
        },
      });
    });
  }, { scope: root });

  const manifesto = 'Atlas turns FBLA preparation into a living exchange: publish the work, meet the right competitors, practice in public, and carry the network beyond awards night.';

  return (
    <PageTransition>
      <div ref={root} className="atl-root overflow-x-hidden w-full max-w-full">
        <section className="atl-hero">
          <div className="atl-hero-bg" aria-hidden>
            <Photo
              name={PHOTOS.hero}
              alt=""
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              className="atl-hero-bg-img"
            />
          </div>
          <div className="atl-hero-wash" aria-hidden />
          <div className="atl-hero-grid" aria-hidden />

          <div className="atl-hero-inner">
            <div className="atl-hero-copy">
              <p className="atl-kicker">
                <span className="atl-kicker-dot" aria-hidden /> Virginia FBLA · Study network
              </p>
              <h1 className="atl-title">
                Where chapter drills compound into first-place pennants.
              </h1>
              <p className="atl-lede">
                Atlas brings binder prep, chapter signals, event discovery, and private collaboration into one calm
                workspace, so the late-night rehearsal and the awards-night handshake belong to the same trail.
              </p>

              <div className="atl-hero-actions">
                <Link to={isAuthenticated ? '/dashboard' : '/signup/student'} className="atl-btn atl-btn-light">
                  {isAuthenticated ? 'Open dashboard' : 'Join Atlas'}
                  <ArrowRight size={16} weight="bold" />
                </Link>
                <Link to={isAuthenticated ? '/events' : '/login'} className="atl-btn atl-btn-dark">
                  {isAuthenticated ? 'Browse events' : 'Log in'}
                </Link>
              </div>

              <dl className="atl-hero-signals">
                {CAMPUS_SIGNALS.map(({ label, value }) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="atl-hero-art" aria-hidden>
              <figure className="atl-photo-feature atl-cutout atl-hero-floater">
                <Photo
                  name={PHOTOS.award}
                  alt=""
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 640px, 92vw"
                />
                <figcaption className="atl-photo-caption">
                  <span>04 / 11 / 26</span>
                  <span>Virginia FBLA · awards stage</span>
                </figcaption>
              </figure>

              <figure className="atl-photo-stub atl-hero-floater">
                <Photo
                  name={PHOTOS.speaker}
                  alt=""
                  sizes="(min-width: 1024px) 280px, 40vw"
                />
              </figure>

              <div className="atl-hero-chip">
                <Trophy size={18} weight="regular" />
                <div>
                  <span className="atl-hero-chip-label">Awards night</span>
                  <span className="atl-hero-chip-value">{CAMPUS_SIGNALS[2].value} resources exchanged</span>
                </div>
              </div>

              <div className="atl-orbit-card atl-orbit-card-one">
                <Compass size={20} weight="regular" />
                <span>{CAMPUS_SIGNALS[0].value} active chapters · this week</span>
              </div>
            </div>
          </div>
        </section>

        <section className="atl-marquee" aria-label="Atlas capabilities">
          <div className="atl-marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={`${item}-${index}`}>
                <span className="atl-marquee-dot" aria-hidden />
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="atl-section atl-interest">
          <div className="atl-section-head">
            <h2>Everything important has a place to land.</h2>
            <p>
              The product is dense because FBLA work is dense. The interface keeps the density calm, legible, and
              connected across every screen.
            </p>
          </div>

          <div className="atl-bento grid-flow-dense">
            <article className="atl-bento-card atl-bento-feature group lg:col-span-4">
              <div className="atl-bento-image atl-cutout-soft">
                <Photo
                  name={PHOTOS.campaign}
                  alt="Virginia FBLA students campaigning beside a scholarship-themed display board."
                  className="group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
              </div>
              <div className="atl-bento-meta">
                <span className="atl-meta-pin"><Trophy size={14} weight="regular" /> Campaign table</span>
              </div>
              <div className="atl-bento-icon"><Books size={22} weight="regular" /></div>
              <h3>A shared library that behaves like a competitive advantage.</h3>
              <p>
                Files are organized around events, visibility, reputation, and actual prep behavior, so students find
                the right artifact without digging through old folders.
              </p>
            </article>

            <article className="atl-bento-card atl-bento-quiet atl-signal-card lg:col-span-2">
              <div className="atl-signal-grid" aria-hidden>
                <span>Event</span>
                <strong>Management Information Systems</strong>
                <span>Ask</span>
                <strong>Practice partner</strong>
                <span>Match</span>
                <strong>Chapter-ready</strong>
              </div>
              <div className="atl-bento-icon"><Handshake size={22} weight="regular" /></div>
              <h3>Introductions with context.</h3>
              <p>
                <span className="atl-stat">{CAMPUS_SIGNALS[1].value}</span> peer intros routed this week across
                chapters. Atlas annotates each one with event, strength, and ask.
              </p>
            </article>

            <article className="atl-bento-card atl-bento-quiet atl-bento-mini lg:col-span-2">
              <div className="atl-mini-photo">
                <Photo
                  name={PHOTOS.screen}
                  alt="A Make Your Mark screen at a Virginia FBLA event."
                  sizes="(min-width: 980px) 28vw, 92vw"
                />
              </div>
              <div className="atl-bento-icon"><ChartLineUp size={22} weight="regular" /></div>
              <h3>Momentum you can scan.</h3>
              <p>
                Uploads, feedback, connections, and practice streaks are visible without turning the product into a
                leaderboard circus.
              </p>
            </article>

            <article className="atl-bento-card atl-bento-feature group lg:col-span-4">
              <div className="atl-bento-image atl-cutout-soft">
                <Photo
                  name={PHOTOS.trophyLine}
                  alt="Virginia FBLA students celebrating with awards on stage."
                  className="group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
              </div>
              <div className="atl-bento-meta">
                <span className="atl-meta-pin"><ChatsCircle size={14} weight="regular" /> Discussion</span>
              </div>
              <div className="atl-bento-icon"><ChatsCircle size={22} weight="regular" /></div>
              <h3>Discussion that feels closer to early career communication.</h3>
              <p>
                Global posts, message threads, and profile cards make collaboration readable, intentional, and useful
                long after the event season ends.
              </p>
            </article>
          </div>
        </section>

        <section className="atl-section atl-accordions">
          <div className="atl-section-head atl-section-head-wide">
            <h2>
              Built for students who move between practice, proof, and people.
            </h2>
          </div>
          <div className="atl-accordion-row">
            {focusAreas.map(({ title, photo, copy }, index) => (
              <article
                key={title}
                className="atl-accordion-panel group"
              >
                <Photo
                  name={photo}
                  alt={`${title} preview from a Virginia FBLA event.`}
                  className="atl-accordion-bg"
                  sizes="(min-width: 980px) 32vw, 92vw"
                />
                <div>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="atl-manifesto">
          <p>
            {manifesto.split(' ').map((word, index) => (
              <span key={`${word}-${index}`} className="atl-word">{word} </span>
            ))}
          </p>
        </section>

        <section className="atl-desire">
          <div className="atl-pinned-copy">
            <p className="atl-kicker"><span className="atl-kicker-dot" aria-hidden />From prep to podium</p>
            <h2>Atlas keeps chapter resources, event prep, and peer connections moving together.</h2>
            <p>
              Students can find event materials, share work, ask for feedback, and build useful relationships without
              scattering preparation across chats, drives, and hallway conversations.
            </p>
          </div>
          <div className="atl-stack">
            {stackItems.map(({ title, copy, Icon, photo, tag, visual }) => (
              <article key={title} className="atl-stack-card atl-visual-card">
                {photo ? (
                  <div className="atl-stack-photo atl-cutout-soft">
                    <Photo
                      name={photo}
                      alt={`${title} surface — visualised with a Virginia FBLA stage moment.`}
                      sizes="(min-width: 980px) 60vw, 92vw"
                    />
                  </div>
                ) : (
                  <div className="atl-stack-system">
                    <ProductPreview type={visual} />
                  </div>
                )}
                <div className="atl-stack-body">
                  <span className="atl-stack-tag"><Icon size={16} weight="regular" /> {tag}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="atl-action">
          <div>
            <h2>Bring the chapter into a cleaner operating rhythm.</h2>
            <p>Start with one upload, one event search, or one introduction. Atlas makes the next useful move obvious.</p>
          </div>
          <div className="atl-action-buttons">
            <Link to={isAuthenticated ? '/upload' : '/signup/student'} className="atl-btn atl-btn-light">
              {isAuthenticated ? 'Upload a resource' : 'Create student account'}
            </Link>
            <Link to="/events" className="atl-btn atl-btn-dark">Explore events</Link>
          </div>
        </section>

        <footer className="atl-footer">
          <span>Atlas / FBLA network</span>
          <span>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </span>
        </footer>
      </div>
    </PageTransition>
  );
}
