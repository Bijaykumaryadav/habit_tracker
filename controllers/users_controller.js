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

//get the signup data

// Create a new user
module.exports.create = async function (req, res) {
  try {
    // Check if passwords match
    if (req.body.password !== req.body.confirm_password) {
      return res.redirect("/users/sign_up");
    }

    // Check if user with same email already exists
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.redirect("/users/sign_up");
    }

    // Create a new user document
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // Save the new user document to the database
    await newUser.save();

    // Redirect to sign-in page after successful signup
    return res.redirect("/users/sign_in");
  } catch (err) {
    console.error("Error in creating user while signing up:", err.message);
    return res.redirect("back");
  }
};
//sign in and create the session for the user
module.exports.createSession = function (req, res) {
  return res.redirect("/");
};