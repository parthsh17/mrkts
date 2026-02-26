/**
 * Authentication middleware.
 * Protects routes that require the user to be logged in via Passport session.
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
};

module.exports = { isAuthenticated };
