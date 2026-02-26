import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SentimentBadge } from '../components/SentimentBadge';

describe('SentimentBadge', () => {
  it('renders BULLISH label with correct text', () => {
    render(<SentimentBadge sentiment="Bullish" />);
    expect(screen.getByText('▲ BULLISH')).toBeInTheDocument();
  });

  it('renders BEARISH label', () => {
    render(<SentimentBadge sentiment="Bearish" />);
    expect(screen.getByText('▼ BEARISH')).toBeInTheDocument();
  });

  it('renders NEUTRAL label', () => {
    render(<SentimentBadge sentiment="Neutral" />);
    expect(screen.getByText('● NEUTRAL')).toBeInTheDocument();
  });

  it('applies sm size class when size=sm', () => {
    const { container } = render(<SentimentBadge sentiment="Bullish" size="sm" />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('text-[10px]');
  });

  it('applies md size class by default', () => {
    const { container } = render(<SentimentBadge sentiment="Bullish" />);
    const span = container?.querySelector('span');
    expect(span?.className).toContain('text-xs');
  });
});
