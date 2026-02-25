import type { NewsItem } from './types';

export const mockNews: NewsItem[] = [
  {
    id: '1',
    source: 'CNBC',
    originalTitle: 'Tech stocks rally as inflation data cools',
    url: 'https://cnbc.com/tech-stocks-rally',
    timestamp: '2026-02-25T04:00:00Z',
    sentiment: 'Bullish',
    aiSummary: [
      'Core inflation dropped by 0.2% unexpectedly.',
      'Major tech stocks (AAPL, MSFT) saw immediate pre-market gains.',
      'Bond yields fell to a 3-month low.',
    ],
    actionableInsight:
      'Consider scaling into tech ETFs or maintaining long positions on mega-cap tech as rate cut probabilities increase.',
  },
  {
    id: '2',
    source: 'Bloomberg',
    originalTitle: 'Fed signals no rate cuts until Q4 amid persistent wage growth',
    url: 'https://bloomberg.com/fed-rate-signals',
    timestamp: '2026-02-25T03:30:00Z',
    sentiment: 'Bearish',
    aiSummary: [
      'Fed minutes reveal hawkish consensus — no cuts expected before Q4.',
      'Wage growth came in at 4.1%, above the 3.6% forecast.',
      'Probability of a September cut fell from 65% to 38% after the release.',
    ],
    actionableInsight:
      'Reduce exposure to rate-sensitive sectors (utilities, REITs); consider short-duration bonds or cash positions.',
  },
  {
    id: '3',
    source: 'Reuters',
    originalTitle: 'OPEC+ holds production steady, oil markets mixed',
    url: 'https://reuters.com/opec-production',
    timestamp: '2026-02-25T02:15:00Z',
    sentiment: 'Neutral',
    aiSummary: [
      'OPEC+ voted to maintain current production quotas for Q2.',
      'Brent crude moved sideways, trading between $78–$80.',
      'Markets await US inventory data for direction.',
    ],
    actionableInsight:
      'Hold energy positions flat — await US EIA inventory report on Thursday before adjusting oil exposure.',
  },
  {
    id: '4',
    source: 'Yahoo Finance',
    originalTitle: 'NVIDIA beats earnings estimates on surging AI chip demand',
    url: 'https://finance.yahoo.com/nvda-earnings',
    timestamp: '2026-02-25T01:45:00Z',
    sentiment: 'Bullish',
    aiSummary: [
      'NVDA reported EPS of $5.16 vs. $4.59 estimate — a 12% beat.',
      'Data center revenue surged 110% YoY driven by H100/H200 demand.',
      'Q1 guidance set at $24B — well above the $21.9B consensus.',
    ],
    actionableInsight:
      'NVDA and semiconductor supply chain stocks (ASML, TSM) remain high-conviction longs; consider adding on any post-earnings dip.',
  },
  {
    id: '5',
    source: 'MarketWatch',
    originalTitle: 'China manufacturing PMI contracts for third straight month',
    url: 'https://marketwatch.com/china-pmi',
    timestamp: '2026-02-24T23:00:00Z',
    sentiment: 'Bearish',
    aiSummary: [
      'Official Manufacturing PMI came in at 49.1, below the 50.0 expansion threshold.',
      'New export orders dropped to their lowest level since October 2023.',
      'Yuan weakened slightly against the dollar following the release.',
    ],
    actionableInsight:
      'Reduce China-exposed ADRs and materials stocks; watch copper futures as a leading indicator for a potential recovery signal.',
  },
  {
    id: '6',
    source: 'The Wall Street Journal',
    originalTitle: 'Apple explores major AI partnership with Google for on-device models',
    url: 'https://wsj.com/apple-google-ai',
    timestamp: '2026-02-24T21:30:00Z',
    sentiment: 'Bullish',
    aiSummary: [
      'Reports suggest Apple is in late-stage talks to license Google Gemini for iOS 19.',
      'The deal could generate up to $3B annually for Google.',
      'AAPL shares rose 2.4% in after-hours trading on the news.',
    ],
    actionableInsight:
      'Both AAPL and GOOGL stand to benefit — consider a paired long or simply adding to existing positions in either name.',
  },
  {
    id: '7',
    source: 'Seeking Alpha',
    originalTitle: 'Small-cap stocks underperform as dollar strengthens',
    url: 'https://seekingalpha.com/small-cap-dollar',
    timestamp: '2026-02-24T20:00:00Z',
    sentiment: 'Bearish',
    aiSummary: [
      'Russell 2000 fell 1.8% while the DXY dollar index hit a 2-month high.',
      'Small caps are more domestic-revenue dependent but also more rate-sensitive.',
      'Analysts warn of continued underperformance if the dollar stays elevated.',
    ],
    actionableInsight:
      'Avoid new entries in IWM or small-cap growth; rotate toward large-cap international exporters that benefit from dollar strength.',
  },
  {
    id: '8',
    source: 'Financial Times',
    originalTitle: 'Bitcoin consolidates near $92,000 ahead of halving narrative renewal',
    url: 'https://ft.com/bitcoin-consolidation',
    timestamp: '2026-02-24T18:00:00Z',
    sentiment: 'Neutral',
    aiSummary: [
      'BTC has traded in a tight $90K–$94K band for the past 10 days.',
      'On-chain data shows long-term holders are not distributing but miners are.',
      'Macro uncertainty and rising real yields are capping upside.',
    ],
    actionableInsight:
      'Maintain current crypto allocation without adding — wait for a decisive breakout above $95K or retrace to $85K before adjusting size.',
  },
];
