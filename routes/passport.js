const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: "1040252073430-ok2snj9f09kdmr1srip9csib8vuf6u1a.apps.googleusercontent.com", // Your Credentials here.
      clientSecret: "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", // Your Credentials here.
      callbackURL: "http://localhost:4000/auth/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
