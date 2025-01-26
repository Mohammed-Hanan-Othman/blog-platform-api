// Implements authentication
const Router = require("express");
const { getSignupPage, postSignup, getLoginPage } = require("../controllers/authController");
const authRouter = Router();

// sign up routes
authRouter.get("/signup", getSignupPage);
authRouter.post("/signup", postSignup);

// login routes
authRouter.get("/login", getLoginPage);
authRouter.post("/login", postSignup);


module.exports = {authRouter};