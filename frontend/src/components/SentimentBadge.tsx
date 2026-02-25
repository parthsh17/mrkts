import type { Sentiment } from '../lib/types';

interface SentimentBadgeProps {
  sentiment: Sentiment;
  size?: 'sm' | 'md';
}

const CONFIG: Record<Sentiment, { bg: string; text: string; border: string; shadow: string; label: string }> = {
  Bullish: {
    bg: 'bg-bullish',
    text: 'text-black',
    border: 'border-2 border-black',
    shadow: 'neo-shadow-bullish',
    label: '▲ BULLISH',
  },
  Bearish: {
    bg: 'bg-bearish',
    text: 'text-white',
    border: 'border-2 border-black',
    shadow: 'neo-shadow-bearish',
    label: '▼ BEARISH',
  },
  Neutral: {
    bg: 'bg-neutral',
    text: 'text-black',
    border: 'border-2 border-black',
    shadow: 'neo-shadow-neutral',
    label: '● NEUTRAL',
  },
};

export function SentimentBadge({ sentiment, size = 'md' }: SentimentBadgeProps) {
  const c = CONFIG[sentiment];
  const sizeClass = size === 'sm'
    ? 'text-[10px] px-2 py-0.5'
    : 'text-xs px-3 py-1';

  return (
    <span
      className={`inline-block font-black uppercase tracking-wider ${sizeClass} ${c.bg} ${c.text} ${c.border} ${c.shadow}`}
    >
      {c.label}
    </span>
  );
}
