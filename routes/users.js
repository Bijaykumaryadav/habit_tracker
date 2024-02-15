//routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');
// router.get('/profile',usersController.Profile);
router.get("/sign_up", usersController.signUp);
router.get("/sign_in", usersController.signIn);
module.exports = router;
