export type Sentiment = 'Bullish' | 'Bearish' | 'Neutral';

export interface NewsItem {
  id: string;
  source: string;
  originalTitle: string;
  url: string;
  timestamp: string; // ISO 8601
  sentiment: Sentiment;
  aiSummary: [string, string, string]; // exactly 3 bullets
  actionableInsight: string;
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}
