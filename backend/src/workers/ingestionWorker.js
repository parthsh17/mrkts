const cron = require('node-cron');
const Article = require('../models/Article');
const { fetchAllFeeds } = require('../services/rssService');
const { enrichArticle } = require('../services/groqService');

// ── Shared state ────────────────────────────────────────────────────────────

// Tracks the last time Groq enrichment ran (in this process lifetime)
let lastEnrichedAt = null;
const getLastEnrichedAt = () => lastEnrichedAt;

// Hourly enrichment counter — resets at the top of each hour
let enrichedThisHour = 0;
let enrichedHourMark = new Date().getHours();

const HOURLY_FETCH_CAP = 20;   // max new articles saved per hourly fetch run
const BATCH_SIZE = 5;          // articles enriched per 5-min run
const HOURLY_ENRICH_CAP = 15;  // max enrichments per clock-hour

// ── JOB 1: Hourly RSS Fetch (cap: 20 new articles) ──────────────────────────
/**
 * Fetches all RSS feeds, then saves at most HOURLY_FETCH_CAP newest new articles.
 * enrichedAt is left null — the 5-min enrichment job picks them up later.
 */
const runFetch = async () => {
  console.log('📡 [Fetch] Starting hourly RSS fetch…');
  try {
    const rawArticles = await fetchAllFeeds();

    // Sort newest-first so we fill the cap with the freshest content
    rawArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    let newCount = 0;
    let skippedCount = 0;

    for (const raw of rawArticles) {
      if (newCount >= HOURLY_FETCH_CAP) break; // hard cap

      try {
        const exists = await Article.findOne({ originalUrl: raw.originalUrl });
        if (exists) { skippedCount++; continue; }

        await Article.create({
          title: raw.title,
          source: raw.source,
          originalUrl: raw.originalUrl,
          publishedAt: raw.publishedAt,
          snippet: raw.snippet || '',
          // AI fields filled by the enrichment job
          sentiment: 'Neutral',
          summaryPoints: [],
          actionableInsight: '',
          enrichedAt: null,
        });

        newCount++;
      } catch (err) {
        console.error(`⚠️  [Fetch] Skipped "${raw.title}": ${err.message}`);
      }
    }

    console.log(`✅ [Fetch] Done — ${newCount} new articles saved (cap: ${HOURLY_FETCH_CAP}), ${skippedCount} already seen.`);
  } catch (error) {
    console.error(`❌ [Fetch] Fatal error: ${error.message}`);
  }
};

// ── JOB 2: Groq Enrichment every 5 min (batch: 5, hourly cap: 15) ──────────
/**
 * Picks up to BATCH_SIZE un-enriched articles and enriches them via Groq.
 * Stops for the rest of the hour once HOURLY_ENRICH_CAP is reached.
 * Throttled to 1 request per 2s (safe within Groq free tier ~30 req/min).
 */
const runEnrichment = async () => {
  // Reset counter at the top of a new clock-hour
  const currentHour = new Date().getHours();
  if (currentHour !== enrichedHourMark) {
    enrichedHourMark = currentHour;
    enrichedThisHour = 0;
    console.log('🔄 [Enrich] New hour — enrichment counter reset.');
  }

  if (enrichedThisHour >= HOURLY_ENRICH_CAP) {
    console.log(`⏸  [Enrich] Hourly cap reached (${enrichedThisHour}/${HOURLY_ENRICH_CAP}) — skipping this run.`);
    return;
  }

  const remaining = HOURLY_ENRICH_CAP - enrichedThisHour;
  const limit = Math.min(BATCH_SIZE, remaining);

  console.log(`🧠 [Enrich] Starting Groq batch — will enrich up to ${limit} articles (${enrichedThisHour}/${HOURLY_ENRICH_CAP} used this hour)…`);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  try {
    const pending = await Article.find({
      $or: [{ enrichedAt: null }, { enrichedAt: { $exists: false } }],
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    if (pending.length === 0) {
      console.log('✅ [Enrich] No pending articles — all up to date.');
      return;
    }

    let enrichedCount = 0;

    for (let i = 0; i < pending.length; i++) {
      const article = pending[i];
      try {
        const enriched = await enrichArticle({
          title: article.title,
          snippet: article.snippet || article.title,
        });

        await Article.findByIdAndUpdate(article._id, {
          sentiment: enriched.sentiment,
          summaryPoints: enriched.summaryPoints,
          actionableInsight: enriched.actionableInsight,
          enrichedAt: new Date(),
        });

        enrichedCount++;
        enrichedThisHour++;

        // Throttle: 2s between Groq calls (well under 30 req/min free tier)
        if (i < pending.length - 1) await sleep(2000);
      } catch (err) {
        console.error(`⚠️  [Enrich] Failed "${article.title}": ${err.message}`);
      }
    }

    lastEnrichedAt = new Date();
    console.log(`✅ [Enrich] Done — ${enrichedCount}/${pending.length} enriched. Total this hour: ${enrichedThisHour}/${HOURLY_ENRICH_CAP}.`);
  } catch (error) {
    console.error(`❌ [Enrich] Fatal error: ${error.message}`);
  }
};

// ── Worker Startup ───────────────────────────────────────────────────────────
const startIngestionWorker = () => {
  console.log('🚀 [Worker] Starting ingestion worker…');

  // Run fetch immediately on startup (don't burn Groq quota on boot)
  runFetch();

  // Every hour at :00 — fetch up to 20 new articles from all RSS feeds
  cron.schedule('0 * * * *', () => {
    console.log('⏰ [Worker] Hourly RSS fetch triggered.');
    runFetch();
  });

  // Every 5 minutes — enrich up to 5 pending articles (max 15/hr)
  cron.schedule('*/5 * * * *', () => {
    console.log('⏰ [Worker] 5-min Groq enrichment triggered.');
    runEnrichment();
  });
};

module.exports = { startIngestionWorker, getLastEnrichedAt };
