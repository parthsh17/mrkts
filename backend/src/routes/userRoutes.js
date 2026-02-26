const express = require('express');
const router = express.Router();
const { getPreferences, updatePreferences } = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

// All user routes are protected
router.use(isAuthenticated);

// GET /api/user/preferences
router.get('/preferences', getPreferences);

// PUT /api/user/preferences
router.put('/preferences', updatePreferences);

module.exports = router;
