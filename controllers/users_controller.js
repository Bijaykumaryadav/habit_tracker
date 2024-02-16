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
module.exports.createSession = async function (req, res) {
  try {
    // Find the user
    let user = await User.findOne({ email: req.body.email });

    // If user not found or password doesn't match, redirect back
    if (!user || user.password !== req.body.password) {
      return res.redirect("back");
    }

    // Set cookie with user id
    res.cookie("user_id", user.id);

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
module.exports.profile = async function (req,res){
  try{
    if(req.cookies.user_id){
      let user = await User.findById(req.cookies.user_id);
      if(user){
        return res.render('users_profile', {
          title: "User Profile",
          user: user
        })
      }else{
        return res.redirect('/users/sign_in');
      }
    }else{
      return res.redirect('/users/sign_in');
    }
  }catch(err){
    console.log("Invalid Username/Password",err);
    return res.redirect('users/sign_in');
  }
}

//collect the data from the profile and save into the database
module.exports.trackHabit = async function (req, res) {
  try {
    const user = res.locals.user;
    user.diet = req.body.diet;
    user.book = req.body.book;
    user.walk = req.body.walk;
    user.coding = req.body.coding;
    user.homework = req.body.homework;
    user.skincare = req.body.skincare;
    await user.save();
  } catch (err) {
    console.log("Error on tracking the habit", err.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
