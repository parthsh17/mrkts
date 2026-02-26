const Article = require('../models/Article');
const { getLastEnrichedAt } = require('../workers/ingestionWorker');

const FEED_LIMIT = 5; // Show only the 5 most-recently enriched articles

/**
 * GET /api/articles/feed
 * Returns the 5 most-recently enriched articles.
 * Optionally filtered by sentiment query param.
 */
const getFeed = async (req, res) => {
  try {
    const { sentiment } = req.query;

    // Only return articles that have been AI-enriched
    const filter = {
      enrichedAt: { $ne: null, $exists: true },
    };

    if (sentiment && ['Bullish', 'Bearish', 'Neutral'].includes(sentiment)) {
      filter.sentiment = sentiment;
    }

    const articles = await Article.find(filter)
      .sort({ enrichedAt: -1 })   // newest enriched first
      .limit(FEED_LIMIT)
      .lean();

    res.json({
      success: true,
      articles,
      total: articles.length,
      limit: FEED_LIMIT,
    });
  } catch (error) {
    console.error(`❌ getFeed error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to fetch feed.' });
  }
};

/**
 * GET /api/articles/:id
 * Returns a single article by MongoDB ID.
 */
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).lean();

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    res.json({ success: true, article });
  } catch (error) {
    console.error(`❌ getArticleById error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to fetch article.' });
  }
};

/**
 * GET /api/articles/last-enriched
 * Returns the timestamp of the last AI enrichment run.
 */
const getLastEnriched = (req, res) => {
  res.json({ success: true, lastEnrichedAt: getLastEnrichedAt() });
};

module.exports = { getFeed, getArticleById, getLastEnriched };
