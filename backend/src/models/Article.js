const mongoose = require("mongoose");

const APPROVED_SOURCES = [
  "Yahoo Finance",
  "CNBC",
  "MarketWatch",
  "CoinDesk",
  "WSJ Markets",
  "Investing.com",
];

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: APPROVED_SOURCES,
    },
    originalUrl: {
      type: String,
      required: true,
      unique: true,
    },
    publishedAt: {
      type: Date,
      required: true,
    },
    snippet: {
      type: String,
      default: '',
    },
    sentiment: {
      type: String,
      enum: ["Bullish", "Bearish", "Neutral"],
      default: "Neutral",
    },
    summaryPoints: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 3,
        message: "summaryPoints can contain at most 3 items.",
      },
    },
    actionableInsight: {
      type: String,
      default: "",
    },
    enrichedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Index for fast feed queries (enriched articles newest-first)
ArticleSchema.index({ enrichedAt: -1 });
// Index for pending enrichment batch queries
ArticleSchema.index({ enrichedAt: 1, publishedAt: -1 });

module.exports = mongoose.model("Article", ArticleSchema);
