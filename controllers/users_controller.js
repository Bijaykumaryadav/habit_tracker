//users_controller.js
const User = require("../models/users");
// const { Cookie } = require("express-session");
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
  const { name, email, password, confirm_password } = req.body;
  try {
    // Check if passwords match
    if (req.body.password !== req.body.confirm_password) {
      return res.redirect("/users/sign_up");
    }

    // Check if user with same email already exists
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      // to do : toast notification
      return res.redirect("/users/sign_in");
    }

    // Create a new user document
    // let newUser = new User({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password,
    //   habits: new Map()
    // });
    await User.create({
      name,
      email,
      password,
    });

    // Redirect to sign-in page after successful signup
    return res.redirect("/users/sign_in");
  } catch (err) {
    console.error("Error in creating user while signing up:", err);
    return res.redirect("back");
  }
};
//sign in and create the session for the user
module.exports.createSession = async function (req, res) {
  try {
    // Find the user
    let user = await User.findOne({ email: req.body.email });

    // If user not found or password doesn't match, redirect back
    if (!user || user.password !== req.body.password) {
      return res.redirect("back");
    }

    //Log user authentication
    // console.log(`User ${user.name} authenticated successfully`);

    // Set cookie with user id
    // res.cookie("user_id", user.id);

    //Log saved cookies
    // console.log("Saved cookies:", req.cookies);

    // Redirect to user profile
    return res.redirect("/users/profile");
  } catch (err) {
    console.error("Error in user sign-in:", err.message);
    return res.status(403).json({
      message: "Unauthorized!",
    });
  }
};
//show the profile only if the user is authenticated
module.exports.profile = async function (req, res) {
  try {
    if (req.cookies.user_id) {
      let user = await User.findById(req.cookies.user_id);
      if (user) {
        console.log(`User ${user.name} authenticated.`);
        return res.render("users_profile", {
          title: "User Profile",
          user: user,
        });
      } else {
        return res.redirect("/users/sign_in");
      }
    } else {
      return res.redirect("/users/sign_in");
    }
  } catch (err) {
    console.log("Invalid Username/Password", err);
    return res.redirect("users/sign_in");
  }
};

// Collect the data from the profile and save it into the database
module.exports.trackHabit = async function (req, res) {
  try {
    // Retrieve user id from cookie
    const userId = req.cookies.user_id;

    // Find user by id
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new habit entry
    const newHabit = {
      date: new Date(),
      diet: req.body.diet,
      walk: req.body.walk,
      book: req.body.book,
      coding: req.body.coding,
      homework: req.body.homework,
      skincare: req.body.skincare,
    };

    // Add the new habit entry to the user's habits array
    user.habits.push(newHabit);

    // Save updated user
    await user.save();

    return res.redirect("back");
  } catch (err) {
    console.log("Error on tracking the habit", err.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
//create a destroy session for a user
module.exports.destroySession = async function (req, res) {
  try {
    res.clearCookie("user_id");
    return res.redirect("/");
  } catch (err) {
    console.log("Error in destroying session", err);
    return res.redirect("back");
  }
};
