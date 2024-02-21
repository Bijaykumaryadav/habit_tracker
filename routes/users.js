//routes/users.js
const express = require("express");
const router = express.Router();
const passport = require("../config/passport-local-strategy");
const usersController = require("../controllers/users_controller");
router.get("/sign_up", usersController.signUp);
router.get("/sign_in", usersController.signIn);
//create the routes for the forgot password
router.get("/forgot-password", usersController.forgotPassword);

router.post("/forgot-password", usersController.collectForgotPassword);

router.post("/create", usersController.create);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign_in" }),
  usersController.createSession
);
//  route for sign up or sign in the user via google
router.get('/auth/google',passport.authenticate('google',{scope:['email','profile']}));
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  usersController.createSession
);
router.get("/profile", passport.checkAuthentication, usersController.profile);
//routes for the resetting the password
router.get("/reset_password/:token", usersController.resetPassword);
router.post("/reset_password", usersController.updatePassword);
//for the logout of the user
router.get("/logout", usersController.destroySession);
//to collect the data from the profile
router.post("/track-habit", usersController.trackHabit);
module.exports = router;
