const RSSParser = require('rss-parser');
const https = require('https');

const lenientAgent = new https.Agent({ rejectUnauthorized: false });

const parser = new RSSParser({
  timeout: 12000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; mrkts-news-aggregator/1.0)',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
  requestOptions: { agent: lenientAgent },
});

const RSS_FEEDS = [
  {
    name: 'Yahoo Finance',
    url: 'https://finance.yahoo.com/news/rssindex',
  },
  {
    name: 'CNBC',
    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
  },
  {
    name: 'MarketWatch',
    url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories',
  },
  {
    name: 'CoinDesk',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
  },
  {
    name: 'WSJ Markets',
    url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
  },
  {
    name: 'Investing.com',
    url: 'https://www.investing.com/rss/news.rss',
  },
];

/**
 * Fetch and normalize articles from a single RSS feed.
 * @param {{ name: string, url: string }} feed
 * @returns {Promise<Array>}
 */
const fetchFeed = async (feed) => {
  try {
    const parsed = await parser.parseURL(feed.url);
    const items = parsed.items.map((item) => ({
      title: item.title?.trim() || 'Untitled',
      source: feed.name,
      originalUrl: item.link || item.guid,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      // Content snippet for AI enrichment — prefer longer form
      snippet: item.contentSnippet || item.content || item.summary || item.title || '',
    }));
    console.log(`  ✓ [${feed.name}] ${items.length} articles`);
    return items;
  } catch (error) {
    console.error(`⚠️  Failed to fetch RSS feed [${feed.name}]: ${error.message}`);
    return [];
  }
};

/**
 * Fetch all RSS feeds and return a flat array of normalized articles.
 * @returns {Promise<Array>}
 */
const fetchAllFeeds = async () => {
  console.log(`📡 Fetching ${RSS_FEEDS.length} RSS feeds...`);
  const results = await Promise.allSettled(RSS_FEEDS.map(fetchFeed));
  const articles = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value);
  console.log(`📰 RSS fetch complete: ${articles.length} raw articles collected.`);
  return articles;
};

module.exports = { fetchAllFeeds, RSS_FEEDS };
