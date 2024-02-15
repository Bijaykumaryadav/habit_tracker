//users_controller.js
const User = require("../models/users");
//user the sign up page
module.exports.signUp = function (req, res) {
  return res.render("user_sign_up", {
    title: "habit_tracker | Sign Up",
  });
};
//setting up the sign in page
module.exports.signIn = function (req, res) {
  return res.render("user_sign_in", {
    title: "habit_tracker | Sign In",
  });
};
