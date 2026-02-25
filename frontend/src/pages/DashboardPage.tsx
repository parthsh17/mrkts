import { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { NewsCard } from '../components/NewsCard';
import { mockNews } from '../lib/mockData';
import type { Sentiment } from '../lib/types';

type FilterValue = Sentiment | 'All';

export function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('All');

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return mockNews;
    return mockNews.filter((n) => n.sentiment === activeFilter);
  }, [activeFilter]);

  const counts = useMemo(() => ({
    Bullish: mockNews.filter((n) => n.sentiment === 'Bullish').length,
    Bearish: mockNews.filter((n) => n.sentiment === 'Bearish').length,
    Neutral: mockNews.filter((n) => n.sentiment === 'Neutral').length,
  }), []);

  return (
    <div className="min-h-screen bg-[#18181b]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-1">
                Market Feed
              </h1>
              <p className="text-white/40 text-sm font-medium">
                AI-curated signals — updated in real time
              </p>
            </div>
            {/* Sentiment stats */}
            <div className="flex gap-4 text-center">
              <div className="border-2 border-bullish p-3 neo-shadow-bullish min-w-[64px]">
                <p className="text-bullish font-black text-xl">{counts.Bullish}</p>
                <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Bullish</p>
              </div>
              <div className="border-2 border-bearish p-3 neo-shadow-bearish min-w-[64px]">
                <p className="text-bearish font-black text-xl">{counts.Bearish}</p>
                <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Bearish</p>
              </div>
              <div className="border-2 border-neutral p-3 neo-shadow-neutral min-w-[64px]">
                <p className="text-neutral font-black text-xl">{counts.Neutral}</p>
                <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Neutral</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <FilterBar active={activeFilter} onChange={setActiveFilter} />
        </div>

        {/* News grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/20">
            <p className="text-white/30 font-black text-lg uppercase tracking-widest">No signals</p>
            <p className="text-white/20 text-sm mt-1">No news matching this filter right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((item, i) => (
              <NewsCard
                key={item.id}
                item={item}
                style={{ animationDelay: `${0.05 * i}s` }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-white/10 mt-16 py-6">
        <p className="text-center text-white/20 text-[10px] uppercase tracking-widest font-bold">
          mrkts © 2026 · Powered by AI · Not financial advice
        </p>
      </footer>
    </div>
  );
}
