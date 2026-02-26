const passport = require("passport");

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = [
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  },
];

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(process.env.CLIENT_URL);
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
