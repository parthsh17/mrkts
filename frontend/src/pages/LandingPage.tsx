import { Link } from 'react-router-dom';
import { NewsCard } from '../components/NewsCard';
import { mockNews } from '../lib/mockData';

// Grab one of each sentiment for the preview
const previewItems = [
  mockNews.find((n) => n.sentiment === 'Bullish')!,
  mockNews.find((n) => n.sentiment === 'Bearish')!,
  mockNews.find((n) => n.sentiment === 'Neutral')!,
];

const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-Time Signals',
    desc: 'News aggregated from 20+ financial sources, processed by AI the moment it hits the wire.',
  },
  {
    icon: '🧠',
    title: 'AI Sentiment Analysis',
    desc: 'Every headline is classified Bullish, Bearish, or Neutral — no guesswork required.',
  },
  {
    icon: '🎯',
    title: 'Actionable Insights',
    desc: 'Skip the fluff. Get a precise trading insight for each story in plain English.',
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#18181b] overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <nav className="border-b-2 border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between" style={{background: '#18181bff'}}>
          <span className="font-black text-xl uppercase tracking-tighter text-bullish border-2 border-bullish neo-shadow-brand px-1.5 py-0.5">
            mrkts
          </span>
          <Link
            to="/login"
            id="nav-login-btn"
            className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border-2 border-white text-white neo-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-white hover:text-black transition-all duration-100"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-20 pb-16">
        {/* Grid background */}
        <div className="absolute inset-0 hero-grid pointer-events-none" />
        {/* Radial vignette to fade grid at edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 0%, transparent 40%, #18181b 100%)',
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #18181b)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-slide-up">
          {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 border-2 border-bullish px-3 py-1 mb-6 neo-shadow-bullish">
              <span className="w-2 h-2 bg-bullish animate-pulse inline-block" />
              <span className="text-bullish text-[10px] font-black uppercase tracking-widest">
              Live · AI-Powered · Free
              </span>
          </div>

          {/* Headline */}
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white leading-none mb-6">
              Cut the{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-black bg-white px-2">noise.</span>
              </span>
              <br />
              Trade the{' '}
              <span className="text-bullish">signal.</span>
            </h1>

            <p className="text-white/60 text-lg font-medium leading-relaxed mb-10 max-w-xl">
              mrkts aggregates financial news from top sources and uses AI to surface what actually matters — sentiment, summaries, and actionable trade ideas. Built for day traders who move fast.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                id="hero-cta-btn"
                className="inline-block px-8 py-4 bg-bullish text-white font-black text-sm uppercase tracking-widest border-2 border-bullish neo-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100"
              >
                Get Started — It's Free
              </Link>
              <a
                href="#preview"
                className="inline-block px-8 py-4 bg-transparent text-white font-black text-sm uppercase tracking-widest border-2 border-white neo-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100"
              >
                See It Live ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t-2 border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-surface border-2 border-white neo-shadow p-6 animate-slide-up"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-black text-white uppercase tracking-tight text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PREVIEW ── */}
      <section id="preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
            Live Feed Preview
          </h2>
          <p className="text-white/40 text-sm font-medium">
            This is what your dashboard looks like — updated by AI every few minutes.
          </p>
        </div>

        {/* Mocked cards — non-interactive overlay */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pointer-events-none select-none opacity-90">
            {previewItems.map((item, i) => (
              <NewsCard
                key={item.id}
                item={item}
                style={{ animationDelay: `${0.1 * i}s` }}
              />
            ))}
          </div>
          {/* Gradient overlay & CTA */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#18181b] to-transparent flex items-end justify-center pb-4">
            <Link
              to="/login"
              id="preview-cta-btn"
              className="inline-block px-6 py-3 bg-bullish text-black font-black text-sm uppercase tracking-widest border-2 border-bullish neo-shadow-bullish hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100"
            >
              Unlock Full Feed →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-black text-lg uppercase tracking-tighter text-bullish border-2 border-bullish px-1.5 py-0.5">
            mrkts
          </span>
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
            © 2026 mrkts · Not financial advice · AI-generated content
          </p>
        </div>
      </footer>
    </main>
  );
}
