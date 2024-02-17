//routes/users.js
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users_controller");
router.get("/profile", usersController.profile);
router.get("/sign_up", usersController.signUp);
router.get("/sign_in", usersController.signIn);
router.post("/create", usersController.create);
router.post("/create-session", usersController.createSession);
router.get("/logout", usersController.destroySession);
//to collect the data from the profile
router.post("/track-habit", usersController.trackHabit);
module.exports = router;
