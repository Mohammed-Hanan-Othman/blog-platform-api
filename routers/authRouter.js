// Implements authentication
const { Router } = require("express");
const { getSignupPage, postSignup, 
    getLoginPage,postLogin,
    requestResetCode
} = require("../controllers/authController");
const { validateSignup, validateLogin, validateResetRequest } = require("../middlewares/authValidator");
const { handleValidationErrors } = require("../middlewares/handleValidation");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
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
// password reset
authRouter.post("/forgot-password",
    validateResetRequest,
    handleValidationErrors,
    requestResetCode
);
authRouter.post("/verify-reset-code",(req, res)=>{
    // Verify reset code
});
authRouter.post("/reset-password",(req, res)=>{
    // Reset the password
});

module.exports = { authRouter };