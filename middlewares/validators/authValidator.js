const { check } = require("express-validator");

const validateSignup = [
    check("username")
        .notEmpty().withMessage("username is required")
        .isAlphanumeric().withMessage("username must consist of letters and numbers only")
        .isLength({min:3, max:25}).withMessage("username must between 3 and 25 characters"),
    
    check("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("email is invalid"),
    
    check("role")
        .notEmpty().withMessage("role is required")
        .isIn(["reader","author"])
        .withMessage("invalid role. user must be 'reader' or 'author'"),
    
    check("password")
        .notEmpty().withMessage("password is required")
        .isLength({min:8}).withMessage("password must be at least 8 characters long")
];
const validateLogin = [
    check("identifier")
        .notEmpty().withMessage("username or email cannot be empty"),

    check("password")
        .notEmpty().withMessage("password cannot be empty")
];
const validateResetRequest = [
    check("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("email is invalid")
]
const validateResetCode = [
    check("resetCode")
        .notEmpty().withMessage("reset code required")
        .escape(),
    check("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("email is invalid")
        .escape()
];
const validateResetPassword = [
    check("resetCode")
        .notEmpty().withMessage("reset code required")
        .escape(),
    check("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("email is invalid")
        .escape(),
    check("password")
        .notEmpty().withMessage("password is required")
        .isLength({min:8}).withMessage("password must be at least 8 characters long"),
    check("password2")
        .notEmpty().withMessage("password is required")
        .isLength({min:8}).withMessage("password must be at least 8 characters long")
];
module.exports = {
    validateSignup,
    validateLogin,
    validateResetRequest,
    validateResetCode,
    validateResetPassword
};