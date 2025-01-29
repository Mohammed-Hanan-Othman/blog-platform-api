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
        .isIn(["reader","author","admin"])
        .withMessage("invalid role. user must be 'reader', 'author', 'admin'"),
    
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

module.exports = {
    validateSignup,
    validateLogin
};