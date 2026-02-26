const express = require('express');
const router = express.Router();
const { googleAuth, googleCallback, logout, getMe } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

// GET /api/auth/google — Initiate OAuth
router.get('/google', googleAuth);

// GET /api/auth/google/callback — OAuth callback
router.get('/google/callback', ...googleCallback);

// GET /api/auth/logout — Logout user
router.get('/logout', logout);

// GET /api/auth/me — Get current user (protected)
router.get('/me', isAuthenticated, getMe);

module.exports = router;
