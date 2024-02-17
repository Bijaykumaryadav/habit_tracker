const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users");
const bcrypt = req("bcrypt");
//serializing user to decide which key is to be set in cookie
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//deserialize user from the key in the cookie
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    console.log("error in finding user --> passport", err);
    return done(err);
  }
});

//authenticate using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      try {
        const user = await User.findOne({ email: email });
        let isMatch;
        //if user is present then only try to match the password else not match
        if (user) {
          isMatch = await bcrypt.compare(password, user.password);
        }
        if (!user) {
          console.log("Email is not registered!");
          return done(null, false);
        } else if (!isMatch) {
          console.log("Invalid Username/Password");
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        console.log(
          "Error in passport local strategy establishing the user!",
          err
        );
      }
    }
  )
);

//check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  //if the user is signed in, then pass on the request to the next function controller action
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/users/sign_in");
  }
};

//set the authenticated user
passport.setAuthenticatdUser = function (req, res, next) {
  //res.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
};
