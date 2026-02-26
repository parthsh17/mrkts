const express = require('express');
const router = express.Router();
const { getFeed, getArticleById, getLastEnriched } = require('../controllers/articleController');
const { isAuthenticated } = require('../middleware/auth');

// All article routes are protected
router.use(isAuthenticated);

// GET /api/articles/feed?page=1&sentiment=Bullish
router.get('/feed', getFeed);

// GET /api/articles/last-enriched — when was the last Gemini batch run
router.get('/last-enriched', getLastEnriched);

// GET /api/articles/:id
router.get('/:id', getArticleById);

module.exports = router;
