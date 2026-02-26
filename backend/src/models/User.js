const mongoose = require('mongoose');

const APPROVED_SOURCES = ['Yahoo Finance', 'CNBC', 'MarketWatch', 'CoinDesk', 'WSJ Markets'];

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    preferredSources: {
      type: [String],
      default: APPROVED_SOURCES,
      validate: {
        validator: (sources) => sources.every((s) => APPROVED_SOURCES.includes(s)),
        message: 'preferredSources contains an invalid source.',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
