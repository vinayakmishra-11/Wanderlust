const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controllers/user.js");

// Signup routes
router.route("/signup")
  .get(usercontroller.getsignup)                   // GET /signup
  .post(wrapAsync(usercontroller.postsignup));     // POST /signup

// Login routes
router.route("/login")
  .get(usercontroller.getlogin)                    // GET /login
  .post(usercontroller.postlogin);                 // POST /login

// Logout (single route, cannot chain)
router.get("/logout", usercontroller.getlogout);

module.exports = router;
