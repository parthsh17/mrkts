const passport = require("passport");

/**
 * Helper to ensure the CLIENT_URL is absolute.
 * If the user forgot 'https://' in their env vars, this prevents relative redirect 404s.
 */
const getAbsoluteUrl = (path = "") => {
  let clientUrl = process.env.CLIENT_URL || "";
  if (!clientUrl) {
    console.warn("⚠️ CLIENT_URL is not defined in environment variables. Redirects may fail.");
  }
  if (clientUrl && !clientUrl.startsWith("http")) {
    clientUrl = `https://${clientUrl}`;
  }
  // Remove trailing slash from clientUrl if it exists, and path already starts with /
  if (clientUrl.endsWith("/") && path.startsWith("/")) {
    return clientUrl + path.substring(1);
  }
  return clientUrl + path;
};


const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = [
  (req, res, next) => {
    passport.authenticate("google", {
      failureRedirect: getAbsoluteUrl("/login?error=auth_failed"),
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(getAbsoluteUrl("/dashboard"));
  },
];

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(getAbsoluteUrl());
    });
  });
};

const getMe = (req, res) => {
  res.json({
    success: true,
    user: {
      _id: req.user._id,
      email: req.user.email,
      displayName: req.user.displayName,
      photoURL: req.user.avatarUrl,
      preferredSources: req.user.preferredSources,
    },
  });
};

module.exports = { googleAuth, googleCallback, logout, getMe };
