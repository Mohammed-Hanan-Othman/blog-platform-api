// Implements authentication
const { Router } = require("express");
const { getSignupPage, postSignup, 
    getLoginPage,postLogin
} = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../middlewares/authValidator");
const { handleValidationErrors } = require("../middlewares/handleValidation");
const authRouter = Router();

// sign up routes
authRouter.get("/signup", getSignupPage);
authRouter.post(
    "/signup", 
    validateSignup,
    handleValidationErrors,
    postSignup
);

// login routes
authRouter.get("/login", getLoginPage);
authRouter.post(
    "/login", 
    validateLogin,
    handleValidationErrors,
    postLogin
);

module.exports = { authRouter };