import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { NewsCard } from '../components/NewsCard';
import type { NewsItem, Sentiment } from '../lib/types';

type FilterValue = Sentiment | 'All';

const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function DashboardPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterValue>('All');
  const [lastEnrichedAt, setLastEnrichedAt] = useState<Date | null>(null);

  // Stable ref so the interval always sees the latest filter without re-subscribing
  const activeFilterRef = useRef<FilterValue>(activeFilter);
  activeFilterRef.current = activeFilter;

  const fetchLastEnriched = () => {
    fetch('/api/articles/last-enriched', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.lastEnrichedAt) setLastEnrichedAt(new Date(data.lastEnrichedAt));
      })
      .catch(() => {});
  };

  const fetchFeed = (filter: FilterValue, showLoading = false) => {
    const params = new URLSearchParams({ page: '1' });
    if (filter !== 'All') params.set('sentiment', filter);

    if (showLoading) {
      setIsLoading(true);
      setError(null);
    }

    fetch(`/api/articles/feed?${params.toString()}`, { credentials: 'include' })
      .then((res) => {
        if (res.status === 401) { navigate('/login'); return null; }
        if (!res.ok) throw new Error('Failed to fetch articles');
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        const mapped: NewsItem[] = (data.articles ?? []).map((a: any) => ({
          id: a._id,
          source: a.source,
          originalTitle: a.title,
          url: a.originalUrl,
          timestamp: a.publishedAt,
          sentiment: a.sentiment,
          aiSummary: a.summaryPoints?.length
            ? a.summaryPoints
            : ['Summary pending…', '', ''],
          actionableInsight: a.actionableInsight || 'Insight pending — check back soon.',
        }));
        setArticles(mapped);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  // Initial load + re-fetch when filter changes
  useEffect(() => {
    fetchFeed(activeFilter, true);
  }, [activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch last-enriched timestamp on mount
  useEffect(() => {
    fetchLastEnriched();
  }, []);

  // Auto-refresh every 5 minutes (silent — no loading spinner)
  useEffect(() => {
    const id = setInterval(() => {
      fetchFeed(activeFilterRef.current, false);
      fetchLastEnriched();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(() => ({
    Bullish: articles.filter((n) => n.sentiment === 'Bullish').length,
    Bearish: articles.filter((n) => n.sentiment === 'Bearish').length,
    Neutral: articles.filter((n) => n.sentiment === 'Neutral').length,
  }), [articles]);

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
                AI-curated signals — updated every 5 minutes
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              {/* Last enriched timer */}
              <div className="flex items-center gap-2 border border-white/10 bg-surface px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-bullish animate-pulse inline-block" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  {lastEnrichedAt
                    ? `AI last ran ${formatDistanceToNow(lastEnrichedAt, { addSuffix: true })}`
                    : 'AI enrichment pending…'}
                </span>
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
        </div>

        {/* Filter bar */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <FilterBar active={activeFilter} onChange={setActiveFilter} />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-bullish border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white/30 font-bold text-sm uppercase tracking-widest">Loading signals…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-bearish/40">
            <p className="text-bearish font-black text-lg uppercase tracking-widest">Error</p>
            <p className="text-white/30 text-sm mt-1">{error}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/20">
            <p className="text-white/30 font-black text-lg uppercase tracking-widest">No signals yet</p>
            <p className="text-white/20 text-sm mt-1">
              {activeFilter !== 'All'
                ? `No ${activeFilter} articles enriched yet — try All, or check back soon.`
                : 'AI is processing articles — refresh in a few minutes.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {articles.map((item, i) => (
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
