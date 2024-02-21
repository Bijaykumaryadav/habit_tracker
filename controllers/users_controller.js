//users_controller.js
const User = require("../models/users");
const CalendarEvent = require("../models/calendar_events");
const userSignUpMailer = require("../mailers/user_sign_up_mailer");
const forgottenPasswordMailer = require("../mailers/forgotten_password_mailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// const { Cookie } = require("express-session");
//user the sign up page
module.exports.signUp = function (req, res) {
  //if user is already signed in don't show the signin page rather the signin page rather show profile page
  if (req.isAuthenticated()) {
    return res.render("/users/profile");
  }
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
    if (req.body.password !== confirm_password) {
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
    const newUser = await User.create({
      name,
      email,
      password,
    });
    userSignUpMailer.signUp(newUser);
    console.log("Account create successfully", newUser);
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
// Modify createSession function to handle Google OAuth users
module.exports.createSession = async function (req, res) {
  try {
    let user;
    if (req.user) {
      // User authenticated via local strategy
      user = req.user;
    } else if (req.body.email && req.body.token) {
      // User authenticated via Google OAuth
      user = await User.findOne({ email: req.body.email });
      if (!user) {
        // Create a new user if not found
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.token, // Store token as password temporarily
        });
      }
    } else {
      // Neither local nor Google OAuth authentication details provided
      return res.redirect("/users/sign_in");
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
    // Generate a token
    const token = crypto.randomBytes(20).toString("hex");
    console.log(token);
    let user = await User.findById(req.user._id);
    console.log(user);
    if (user) {
      // console.log(`User ${user.name} authenticated.`);
      return res.render("users_profile", {
        title: "User Profile",
        user: user,
        token: token
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
//collect data from forget password
module.exports.collectForgotPassword = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = crypto.randomBytes(20).toString("hex");
      user.token = token;
      user.save();
      forgottenPasswordMailer.forgottenPassword(user.email, token);
      // req.flash("success", "Reset Email sent!");
      return res.redirect("/");
    } else {
      // req.flash("error", "Email not registered!");
      return res.redirect("/");
    }
  } catch (err) {
    console.log("error in finding user while reseting password", err);
  }
};

// Reset password form action controller
module.exports.resetPassword = async function (req, res) {
  try {
    // Find user by reset password toke
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is not expired
    });
    if (user) {
      // Render the reset password form
      return res.render("reset_password", {
        title: "Reset Password",
        token: req.params.token, // Pass token to the view
      });
    } else {
      // Token not found or expired, redirect to home page with an error message
      // req.flash("error", "Password reset token is invalid or has expired.");
      return res.redirect("/");
    }
  } catch (err) {
    console.log("Error in rendering reset password form", err);
    // Redirect to home page with an error message
    req.flash("error", "Something went wrong. Please try again later.");
    return res.redirect("/");
  }
};
//to collect password from above form and finally update the password of user
module.exports.updatePassword = async function (req, res) {
  try {
    const user = await User.findOne({ token: req.body.token });
    if (user) {
      user.password = req.body.password;
      user.token = undefined;
      await user.save();
      return res.redirect("/users/sign_in");
    } else {
      return res.redirect("/users/forgot-password");
    }
  } catch (err) {
    console.error("Error in updating password:", err);
    return res.redirect("/users/forgot-password");
  }
};
//to show calendar
module.exports.showCalendar = async function (req, res) {
  try {
    const user = res.locals.user;
    if (user) {
      const calendarEventId = user.CalendarEvent.findById(calendarEventId);
      console.log(CalendarEvent);
      const calendarEventDates = CalendarEvent.dates.map((dateObj) => {
        return { date: dateObj.date.toISOString().split("T")[0] };
      });
      return res.render("calendar", {
        title: "Calendar",
        calendarEventDates: calendarEventDates,
      });
    }
  } catch (err) {
    console.log("Eror in fetching calendar events:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
