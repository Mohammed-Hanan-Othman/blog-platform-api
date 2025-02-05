const { check, param } = require("express-validator");

const validateUserId = [
    param("id").trim().notEmpty().escape().withMessage("Id cannot be empty")
        .isAlphanumeric().withMessage("Id must be alphanumeric")
];
const validateUserInfo = [
    check("username").trim().notEmpty().escape()
        .withMessage("username is required")
        .isAlphanumeric()
        .withMessage("username must consist of letters and numbers only")
        .isLength({min:3, max:25})
        .withMessage("username must between 3 and 25 characters"),

    check("email").trim().notEmpty().escape()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Email invalid"),
];
module.exports = {
    validateUserId,
    validateUserInfo
}