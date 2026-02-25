import { formatDistanceToNow } from 'date-fns';
import type { NewsItem } from '../lib/types';
import { SentimentBadge } from './SentimentBadge';

interface NewsCardProps {
  item: NewsItem;
  style?: React.CSSProperties;
}

const INSIGHT_BG: Record<NewsItem['sentiment'], string> = {
  Bullish: 'bg-bullish/10 border-l-4 border-bullish',
  Bearish: 'bg-bearish/10 border-l-4 border-bearish',
  Neutral: 'bg-neutral/10 border-l-4 border-neutral',
};

const INSIGHT_TEXT: Record<NewsItem['sentiment'], string> = {
  Bullish: 'text-bullish',
  Bearish: 'text-bearish',
  Neutral: 'text-neutral',
};

export function NewsCard({ item, style }: NewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(item.timestamp), { addSuffix: true });

  return (
    <article
      style={style}
      className="bg-surface border-2 border-white neo-shadow flex flex-col gap-4 p-5 animate-slide-up"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">
            {item.source}
          </p>
          <h2 className="text-sm font-bold text-white leading-snug line-clamp-3">
            {item.originalTitle}
          </h2>
        </div>
        <div className="shrink-0">
          <SentimentBadge sentiment={item.sentiment} size="sm" />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* AI Summary */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
          AI Summary
        </p>
        <ul className="space-y-1.5">
          {item.aiSummary.map((point, i) => (
            <li key={i} className="flex gap-2 text-xs text-white/80 leading-relaxed">
              <span className="text-white/30 font-bold shrink-0">0{i + 1}</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actionable Insight */}
      <div className={`p-3 ${INSIGHT_BG[item.sentiment]}`}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-white/40">
          Actionable Insight
        </p>
        <p className={`text-xs leading-relaxed font-semibold ${INSIGHT_TEXT[item.sentiment]}`}>
          {item.actionableInsight}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">
          {timeAgo}
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-white/50 uppercase tracking-wider font-black border-b border-white/20 hover:text-white hover:border-white transition-colors"
        >
          Read Original →
        </a>
      </div>
    </article>
  );
}
