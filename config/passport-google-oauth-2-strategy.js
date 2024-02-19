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
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOne({
          email: profile.emails[0].value,
        }).exec();
        if (user) {
          return done(null, user);
        } else {
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
          });
          return done(null, newUser);
        }
      } catch (err) {
        console.log("Error in authentication using google", err);
        return;
      }
    }
  )
);
