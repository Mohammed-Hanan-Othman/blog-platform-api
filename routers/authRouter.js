// Implements authentication
const { Router } = require("express");
const { getSignupPage, 
    postSignup, 
    getLoginPage,
    postLogin,
    requestResetCode,
    verifyResetCode,
    resetPassword
} = require("../controllers/authController");
const { validateSignup, 
    validateLogin, 
    validateResetRequest, 
    validateResetCode, 
    validateResetPassword 
} = require("../middlewares/validators/authValidator");
const { handleValidationErrors } = require("../middlewares/validators/handleValidation");
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
authRouter.post("/verify-reset-code",
    validateResetCode,
    handleValidationErrors,
    verifyResetCode
);
authRouter.post("/reset-password",
    validateResetPassword,
    handleValidationErrors,
    resetPassword,
);

module.exports = { authRouter };