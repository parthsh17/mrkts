const User = require('../models/User');

const APPROVED_SOURCES = ['Yahoo Finance', 'CNBC', 'MarketWatch', 'CoinDesk', 'WSJ Markets'];

/**
 * GET /api/user/preferences
 * Returns the authenticated user's preferred sources.
 */
const getPreferences = (req, res) => {
  res.json({
    success: true,
    preferredSources: req.user.preferredSources,
    allSources: APPROVED_SOURCES,
  });
};

/**
 * PUT /api/user/preferences
 * Updates the authenticated user's preferred sources.
 * Body: { preferredSources: string[] }
 */
const updatePreferences = async (req, res) => {
  try {
    const { preferredSources } = req.body;

    if (!Array.isArray(preferredSources)) {
      return res.status(400).json({ success: false, message: '`preferredSources` must be an array.' });
    }

    const invalid = preferredSources.filter((s) => !APPROVED_SOURCES.includes(s));
    if (invalid.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid sources: ${invalid.join(', ')}. Must be one of: ${APPROVED_SOURCES.join(', ')}.`,
      });
    }

    if (preferredSources.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one source must be selected.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { preferredSources },
      { new: true, runValidators: true }
    ).lean();

    res.json({
      success: true,
      message: 'Preferences updated successfully.',
      preferredSources: updatedUser.preferredSources,
    });
  } catch (error) {
    console.error(`❌ updatePreferences error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to update preferences.' });
  }
};

module.exports = { getPreferences, updatePreferences };
