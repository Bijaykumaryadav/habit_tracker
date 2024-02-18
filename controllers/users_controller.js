//users_controller.js
const User = require("../models/users");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
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
// module.exports.createSession = async function (req, res) {
//   try {
//     // Find the user
//     let user = await User.findOne({ email: req.body.email });
//     console.log(user);
//     // If user not found or password doesn't match, redirect back
//     if (!user || user.password !== req.body.password) {
//       return res.redirect("back");
//     }

//     //Log user authentication
//     // console.log(`User ${user.name} authenticated successfully`);

//     // Set cookie with user id
//     // res.cookie("user_id", user.id);

//     //Log saved cookies
//     // console.log("Saved cookies:", req.cookies);

//     // Redirect to user profile
//     return res.redirect("/users/profile");
//   } catch (err) {
//     console.error("Error in user sign-in:", err);
//     return res.status(403).json({
//       message: "Unauthorized!",
//     });
//   }
// };
module.exports.createSession = async function (req, res) {
  try {
    // Find the user
    let user = await User.findOne({ email: req.body.email });

    // If user not found, redirect back
    if (!user) {
      return res.redirect("back");
    }

    // Compare hashed password with user input
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    // If password doesn't match, redirect back
    if (!isMatch) {
      return res.redirect("back");
    }

    // Redirect to user profile on successful authentication
    return res.redirect("/users/profile");
  } catch (err) {
    console.error("Error in user sign-in:", err);
    return res.status(403).json({
      message: "Unauthorized!",
    });
  }
};
//show the profile only if the user is authenticated
module.exports.profile = async function (req, res) {
  try {
    // if (req.cookies.user_id) {
    // let user = await User.findById(req.cookies.user_id);
    let user = await User.findById(req.user._id);
    console.log(user);
    if (user) {
      // console.log(`User ${user.name} authenticated.`);
      return res.render("users_profile", {
        title: "User Profile",
        user: user,
      });
    } else {
      return res.redirect("/users/sign_in");
    }
    // }
    // else {
    //   return res.redirect("/users/sign_in");
    // }
  } catch (err) {
    console.log("Invalid Username/Password", err);
    return res.redirect("/users/sign_in");
  }
};

// Collect the data from the profile and save it into the database
module.exports.trackHabit = async function (req, res) {
  try {
    // Retrieve user id from cookie
    // const userId = req.cookies.user_id;

    // Find user by id
    const user = await User.findById(req.user._id);

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
module.exports.destroySession = function (req, res) {
  // Log out the user and then redirect
  req.logout(function (err) {
    if (err) {
      console.log("Error in logging out", err);
      return;
    }
    return res.redirect("/");
  });
};

//to show the form of the forgot password
module.exports.forgotPassword = function (req, res) {
  return res.render("forgotten_password", {
    title: "Forgot Password!",
  });
};

// Function to generate a random token
function generateToken() {
  return crypto.randomBytes(20).toString("hex");
}

// Reset password request handler
module.exports.collectForgotPassword = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // Generate a token
      const token = generateToken();

      // Associate the token with the user
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expiry in 1 hour

      // Save the user
      await user.save();

      // Send the token to the user (this is where you'd typically send an email)
      console.log("Reset token generated:", token);

      // Redirect or respond accordingly
      return res.redirect("/");
    } else {
      return res.redirect("/users/forgot-password");
    }
  } catch (err) {
    console.error("Error in generating reset token:", err);
    return res.redirect("back");
  }
};

// Reset password form action controller
// Reset password form action controller
module.exports.resetPassword = async function (req, res) {
  try {
    if (req.params.token) {
      const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      console.log(req.params.token);
      if (user) {
        return res.render("reset_password", {
          title: "Reset Password",
          user_id: user._id,
        });
      } else {
        // Token is invalid or expired
        // req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/users/reset_password");
      }
    } else {
      // Render the reset password page without the token
      return res.render("reset_password", {
        title: "Reset Password",
        user_id: null, // or any other default value you want to pass
      });
    }
  } catch (err) {
    console.error("Error in reset password:", err);
    return res.redirect("back");
  }
};
