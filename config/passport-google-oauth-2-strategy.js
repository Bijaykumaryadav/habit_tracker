const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/users");
passport.use(
  new googleStrategy(
    {
      clientID:
        "373498918292-4vbioq37rlupgihsdb7vsllphggm45ff.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {}
  )
);
